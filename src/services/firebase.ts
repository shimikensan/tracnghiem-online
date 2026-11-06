import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp, 
  Firestore,
  doc,
  updateDoc,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { ExamResultRecord, Question } from '../types/quiz';

/**
 * =========================================================================================
 * 📌 VỊ TRÍ DÁN FIREBASE CONFIG CỦA BẠN:
 * 
 * Lấy các thông số này từ: Firebase Console -> Project Settings -> General -> Your apps -> SDK setup
 * Bạn có thể dán trực tiếp vào các chuỗi bên dưới hoặc điền vào file .env
 * =========================================================================================
 */
export const defaultFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "", 
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

import appletConfig from '../../firebase-applet-config.json';

// Khóa lưu trữ cấu hình và bộ nhớ đệm nội bộ
const STORAGE_KEY_CONFIG = 'uav_custom_firebase_config';
const STORAGE_KEY_LOCAL_RESULTS = 'uav_exam_local_results';
const STORAGE_KEY_LOCAL_QUESTIONS = 'uav_exam_local_questions';

export function getActiveFirebaseConfig() {
  // 1. Ưu tiên cấu hình tự động từ firebase-applet-config.json (đã được cấp quyền)
  if (appletConfig && appletConfig.projectId && appletConfig.projectId !== 'remixed-project-id') {
    return {
      apiKey: appletConfig.apiKey || "",
      authDomain: appletConfig.authDomain || `${appletConfig.projectId}.firebaseapp.com`,
      projectId: appletConfig.projectId || "",
      storageBucket: appletConfig.storageBucket || `${appletConfig.projectId}.firebasestorage.app`,
      messagingSenderId: appletConfig.messagingSenderId || "",
      appId: appletConfig.appId || "",
      firestoreDatabaseId: appletConfig.firestoreDatabaseId || "(default)"
    };
  }

  // 2. Tiếp theo kiểm tra cấu hình tùy chỉnh do người dùng nhập trong modal
  const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.projectId && parsed.apiKey) {
        return parsed;
      }
    } catch {
      // fallback
    }
  }

  // 3. Fallback sang biến môi trường
  return defaultFirebaseConfig;
}

export function saveCustomFirebaseConfig(config: typeof defaultFirebaseConfig) {
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  window.location.reload();
}

export function clearCustomFirebaseConfig() {
  localStorage.removeItem(STORAGE_KEY_CONFIG);
  window.location.reload();
}

export function isFirebaseConfigured(): boolean {
  const cfg = getActiveFirebaseConfig();
  return Boolean(cfg.projectId && cfg.projectId.trim() !== "" && cfg.projectId !== "remixed-project-id" && cfg.apiKey && cfg.apiKey.trim() !== "");
}

// Khởi tạo Firebase an toàn (không gây crash nếu config trống)
let appInstance: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;

export function getFirebaseDb(): Firestore | null {
  if (dbInstance) return dbInstance;
  
  const config = getActiveFirebaseConfig();
  if (!config.projectId || config.projectId.trim() === '' || config.projectId === 'remixed-project-id') {
    return null;
  }

  try {
    if (getApps().length === 0) {
      appInstance = initializeApp({
        apiKey: config.apiKey,
        authDomain: config.authDomain,
        projectId: config.projectId,
        storageBucket: config.storageBucket,
        messagingSenderId: config.messagingSenderId,
        appId: config.appId
      });
    } else {
      appInstance = getApp();
    }

    if (config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)') {
      dbInstance = getFirestore(appInstance, config.firestoreDatabaseId);
    } else {
      dbInstance = getFirestore(appInstance);
    }
    return dbInstance;
  } catch (error) {
    console.warn('Lỗi khởi tạo Firebase Firestore:', error);
    return null;
  }
}

/* =========================================================================================
 * 📌 PHẦN 1: QUẢN LÝ CÂU HỎI THI TRÊN FIREBASE FIRESTORE (`exam_questions`)
 * ========================================================================================= */

/**
 * Tải danh sách câu hỏi từ Firestore (`exam_questions`).
 * Nếu Firestore chưa có hoặc offline, tự động lấy từ bộ nhớ cục bộ hoặc danh sách mặc định.
 */
export async function fetchQuestionsFromFirestore(
  defaultQuestions: Question[]
): Promise<{ questions: Question[]; source: 'firestore' | 'local' }> {
  const db = getFirebaseDb();
  if (db) {
    try {
      const q = query(collection(db, 'exam_questions'), orderBy('id', 'asc'));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const loaded: Question[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          loaded.push({
            firestoreId: docSnap.id,
            id: Number(data.id) || (loaded.length + 1),
            question: data.question || '',
            options: data.options || [],
            correctAnswer: data.correctAnswer || 'A',
            explanation: data.explanation || ''
          });
        });
        // Sắp xếp theo ID
        loaded.sort((a, b) => a.id - b.id);
        // Lưu cache local
        localStorage.setItem(STORAGE_KEY_LOCAL_QUESTIONS, JSON.stringify(loaded));
        return { questions: loaded, source: 'firestore' };
      }
    } catch (err) {
      console.warn('Không tải được câu hỏi từ Firestore, chuyển sang bộ nhớ cục bộ:', err);
    }
  }

  // Fallback đọc từ LocalStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOCAL_QUESTIONS);
    if (raw) {
      const parsed: Question[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return { questions: parsed, source: 'local' };
      }
    }
  } catch (e) {
    console.warn('Lỗi đọc local questions:', e);
  }

  // Fallback danh sách mặc định
  return { questions: defaultQuestions, source: 'local' };
}

/**
 * Thêm hoặc Cập nhật câu hỏi vào Firestore (`exam_questions`)
 */
export async function saveQuestionToFirestore(
  question: Partial<Question> & { question: string; options: Question['options']; correctAnswer: Question['correctAnswer'] },
  currentTotal: number
): Promise<{ success: boolean; firestoreId?: string; id: number; mode: 'firestore' | 'local' }> {
  const assignedId = question.id || (currentTotal + 1);
  const qData = {
    id: assignedId,
    question: question.question.trim(),
    options: question.options,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation ? question.explanation.trim() : '',
    updatedAt: new Date().toISOString()
  };

  const db = getFirebaseDb();
  if (db) {
    try {
      if (question.firestoreId) {
        // Cập nhật câu hỏi đã có
        const docRef = doc(db, 'exam_questions', question.firestoreId);
        await updateDoc(docRef, qData);
        updateQuestionInLocalStorage({ ...qData, firestoreId: question.firestoreId });
        return { success: true, firestoreId: question.firestoreId, id: assignedId, mode: 'firestore' };
      } else {
        // Thêm câu hỏi mới
        const colRef = collection(db, 'exam_questions');
        const docRef = await addDoc(colRef, qData);
        updateQuestionInLocalStorage({ ...qData, firestoreId: docRef.id });
        return { success: true, firestoreId: docRef.id, id: assignedId, mode: 'firestore' };
      }
    } catch (err: any) {
      console.error('Lỗi lưu câu hỏi lên Firestore:', err);
    }
  }

  // Lưu fallback vào LocalStorage
  const localId = question.firestoreId || 'local_q_' + Date.now();
  updateQuestionInLocalStorage({ ...qData, firestoreId: localId });
  return { success: true, firestoreId: localId, id: assignedId, mode: 'local' };
}

/**
 * Xóa câu hỏi khỏi Firestore (`exam_questions`)
 */
export async function deleteQuestionFromFirestore(
  firestoreId?: string,
  questionId?: number
): Promise<{ success: boolean; mode: 'firestore' | 'local' }> {
  const db = getFirebaseDb();
  if (db && firestoreId && !firestoreId.startsWith('local_')) {
    try {
      await deleteDoc(doc(db, 'exam_questions', firestoreId));
      deleteQuestionFromLocalStorage(questionId, firestoreId);
      return { success: true, mode: 'firestore' };
    } catch (err) {
      console.error('Lỗi xóa câu hỏi khỏi Firestore:', err);
    }
  }

  deleteQuestionFromLocalStorage(questionId, firestoreId);
  return { success: true, mode: 'local' };
}

/**
 * Đồng bộ toàn bộ danh sách câu hỏi mẫu lên Firestore
 */
export async function syncDefaultQuestionsToFirestore(
  questions: Question[]
): Promise<{ success: boolean; count: number; error?: string }> {
  const db = getFirebaseDb();
  if (!db) {
    return { success: false, count: 0, error: 'Firebase chưa được cấu hình. Vui lòng điền config trước.' };
  }

  try {
    const colRef = collection(db, 'exam_questions');
    let addedCount = 0;
    for (const q of questions) {
      await addDoc(colRef, {
        id: q.id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || '',
        syncedAt: serverTimestamp()
      });
      addedCount++;
    }
    return { success: true, count: addedCount };
  } catch (err: any) {
    console.error('Lỗi đồng bộ câu hỏi lên Firestore:', err);
    return { success: false, count: 0, error: err.message };
  }
}

// Helpers quản lý cache LocalStorage cho câu hỏi
function updateQuestionInLocalStorage(q: Question) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOCAL_QUESTIONS);
    let list: Question[] = raw ? JSON.parse(raw) : [];
    const idx = list.findIndex(item => (q.firestoreId && item.firestoreId === q.firestoreId) || item.id === q.id);
    if (idx >= 0) {
      list[idx] = q;
    } else {
      list.push(q);
    }
    list.sort((a, b) => a.id - b.id);
    localStorage.setItem(STORAGE_KEY_LOCAL_QUESTIONS, JSON.stringify(list));
  } catch (err) {
    console.warn('Lỗi ghi local questions:', err);
  }
}

function deleteQuestionFromLocalStorage(questionId?: number, firestoreId?: string) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOCAL_QUESTIONS);
    if (!raw) return;
    let list: Question[] = JSON.parse(raw);
    list = list.filter(item => {
      if (firestoreId && item.firestoreId === firestoreId) return false;
      if (questionId && item.id === questionId) return false;
      return true;
    });
    localStorage.setItem(STORAGE_KEY_LOCAL_QUESTIONS, JSON.stringify(list));
  } catch (err) {
    console.warn('Lỗi xóa local question:', err);
  }
}

/* =========================================================================================
 * 📌 PHẦN 2: QUẢN LÝ KẾT QUẢ THÍ SINH TRÊN FIREBASE FIRESTORE (`exam_results`)
 * ========================================================================================= */

/**
 * Lưu kết quả bài thi vào collection `exam_results` của Firebase Firestore
 */
export async function saveExamResultToFirestore(
  result: ExamResultRecord
): Promise<{ success: boolean; id?: string; mode: 'firestore' | 'local'; error?: string }> {
  // Luôn lưu bản sao vào localStorage để bảo toàn dữ liệu phòng hờ mất mạng
  saveResultToLocalStorage(result);

  const db = getFirebaseDb();
  if (!db) {
    return {
      success: true,
      mode: 'local',
      error: 'Chưa kết nối được Firebase Firestore. Dữ liệu đã lưu tạm thời ở bộ nhớ trình duyệt.'
    };
  }

  try {
    // Chuẩn hóa và lọc sạch các giá trị undefined tránh lỗi của Firestore SDK
    const docData: Record<string, any> = {
      fullName: (result.fullName || 'Khuyết danh').trim(),
      rank: result.rank || 'N/A',
      position: result.position || 'N/A',
      unit: (result.unit || 'N/A').trim(),
      score: Number(result.score) || 0,
      score100: Number(result.score100) || 0,
      correctCount: Number(result.correctCount) || 0,
      wrongCount: Number(result.wrongCount) || 0,
      unansweredCount: Number(result.unansweredCount) || 0,
      totalQuestions: Number(result.totalQuestions) || 0,
      poolTotalQuestions: Number(result.poolTotalQuestions) || undefined,
      percentage: Number(result.percentage) || 0,
      timeSpentSeconds: Number(result.timeSpentSeconds) || 0,
      submittedAt: serverTimestamp(),
      clientSubmittedAt: new Date().toISOString(),
      isPassed: Boolean(result.isPassed)
    };

    if (result.poolTotalQuestions) {
      docData.poolTotalQuestions = Number(result.poolTotalQuestions);
    }

    if (result.answersSummary) {
      docData.answersSummary = result.answersSummary;
    }

    if (result.answersDetail) {
      const sanitizedDetail: Record<string, { selected: string | null; correct: string; isCorrect: boolean }> = {};
      Object.entries(result.answersDetail).forEach(([k, v]) => {
        sanitizedDetail[String(k)] = {
          selected: v.selected !== undefined ? v.selected : null,
          correct: v.correct || '',
          isCorrect: Boolean(v.isCorrect)
        };
      });
      docData.answersDetail = sanitizedDetail;
    }

    const docRef = await addDoc(collection(db, 'exam_results'), docData);
    console.log('✅ Đã lưu kết quả bài thi vào Firestore `exam_results` thành công! Document ID:', docRef.id);
    
    return {
      success: true,
      id: docRef.id,
      mode: 'firestore'
    };
  } catch (error: any) {
    console.error('Lỗi khi ghi document vào Firestore `exam_results`:', error);
    return {
      success: false,
      mode: 'local',
      error: error?.message || 'Không thể ghi vào Firestore. Dữ liệu đã lưu an toàn ở bộ nhớ máy khách.'
    };
  }
}

// Lưu trữ phụ trợ LocalStorage
function saveResultToLocalStorage(result: ExamResultRecord) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOCAL_RESULTS);
    const list: ExamResultRecord[] = raw ? JSON.parse(raw) : [];
    const newRecord = {
      ...result,
      id: 'local_' + Date.now(),
      submittedAt: new Date().toISOString()
    };
    list.unshift(newRecord);
    localStorage.setItem(STORAGE_KEY_LOCAL_RESULTS, JSON.stringify(list.slice(0, 100)));
  } catch (err) {
    console.warn('Lỗi lưu localStorage:', err);
  }
}

/**
 * Tải lịch sử kết quả bài thi từ Firestore (`exam_results`) hoặc Local
 */
export async function getExamResultsHistory(): Promise<{ results: ExamResultRecord[]; source: 'firestore' | 'local' }> {
  const db = getFirebaseDb();
  if (db) {
    try {
      let querySnapshot;
      try {
        const q = query(collection(db, 'exam_results'), orderBy('submittedAt', 'desc'), limit(100));
        querySnapshot = await getDocs(q);
      } catch (orderErr) {
        // Fallback nếu chưa kịp có index hoặc trường submittedAt đang pending
        console.warn('Truy vấn có sắp xếp thất bại, fallback sang truy vấn thường:', orderErr);
        const fallbackQ = query(collection(db, 'exam_results'), limit(100));
        querySnapshot = await getDocs(fallbackQ);
      }

      const items: ExamResultRecord[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        let dateStr = new Date().toLocaleString('vi-VN');
        if (data.submittedAt && typeof data.submittedAt.toDate === 'function') {
          dateStr = data.submittedAt.toDate().toLocaleString('vi-VN');
        } else if (data.clientSubmittedAt) {
          dateStr = new Date(data.clientSubmittedAt).toLocaleString('vi-VN');
        }

        items.push({
          id: docSnap.id,
          fullName: data.fullName || 'Khuyết danh',
          rank: data.rank || 'N/A',
          position: data.position || 'N/A',
          unit: data.unit || 'N/A',
          score: data.score ?? 0,
          score100: data.score100 ?? 0,
          correctCount: data.correctCount ?? 0,
          wrongCount: data.wrongCount ?? 0,
          unansweredCount: data.unansweredCount ?? 0,
          totalQuestions: data.totalQuestions ?? 0,
          poolTotalQuestions: data.poolTotalQuestions || undefined,
          percentage: data.percentage ?? 0,
          timeSpentSeconds: data.timeSpentSeconds ?? 0,
          submittedAt: dateStr,
          isPassed: data.isPassed ?? false,
          answersDetail: data.answersDetail || undefined,
          answersSummary: data.answersSummary || undefined
        });
      });

      // Sắp xếp theo ngày giảm dần nếu cần
      return { results: items, source: 'firestore' };
    } catch (e) {
      console.warn('Không tải được lịch sử từ Firestore, chuyển sang bộ nhớ cục bộ:', e);
    }
  }

  // Fallback sang local
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOCAL_RESULTS);
    const list: ExamResultRecord[] = raw ? JSON.parse(raw) : [];
    return { results: list, source: 'local' };
  } catch {
    return { results: [], source: 'local' };
  }
}

/**
 * Xóa một bản ghi kết quả khỏi Firestore
 */
export async function deleteExamResultFromFirestore(docId: string): Promise<boolean> {
  const db = getFirebaseDb();
  if (db && !docId.startsWith('local_')) {
    try {
      await deleteDoc(doc(db, 'exam_results', docId));
      deleteResultFromLocalStorage(docId);
      return true;
    } catch (e) {
      console.error('Lỗi xóa kết quả từ Firestore:', e);
    }
  }
  deleteResultFromLocalStorage(docId);
  return true;
}

/**
 * Xóa toàn bộ kết quả khỏi bộ nhớ cục bộ
 */
export async function clearAllLocalResults(): Promise<void> {
  localStorage.removeItem(STORAGE_KEY_LOCAL_RESULTS);
}

function deleteResultFromLocalStorage(docId: string) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOCAL_RESULTS);
    if (!raw) return;
    let list: ExamResultRecord[] = JSON.parse(raw);
    list = list.filter(item => item.id !== docId);
    localStorage.setItem(STORAGE_KEY_LOCAL_RESULTS, JSON.stringify(list));
  } catch (err) {
    console.warn('Lỗi xóa local result:', err);
  }
}
