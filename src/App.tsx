/**
 * ====================================================================================================
 * 🚁 HỆ THỐNG THI TRẮC NGHIỆM CHUYÊN NGÀNH UAV (UNMANNED AERIAL VEHICLE)
 * Tích hợp ReactJS + TailwindCSS + Firebase Firestore (`exam_questions` & `exam_results`)
 * 
 * 📌 HƯỚNG DẪN CẤU HÌNH & QUẢN LÝ DÀNH CHO BẠN:
 * 1. TRANG QUẢN TRỊ CÂU HỎI VÀ KẾT QUẢ:
 *    - Bấm nút "Quản Lý" trên thanh Header để truy cập trực tiếp.
 *    - Tab 1: Quản lý ngân hàng câu hỏi (Thêm/Sửa/Xóa, Đồng bộ lên Firestore `exam_questions`, Nhập/Xuất JSON).
 *    - Tab 2: Quản lý kết quả thí sinh (Xem bảng điểm `exam_results`, bộ lọc, xem chi tiết bài làm, xuất CSV/Excel).
 * 
 * 2. VỊ TRÍ DÁN FIREBASE CONFIG:
 *    - Mở file `src/services/firebase.ts`, tìm đối tượng `defaultFirebaseConfig` để dán API Key của bạn.
 *    - Hoặc bấm nút "Firebase Config" trực tiếp trên thanh menu trên cùng của ứng dụng!
 * 
 * 3. BỘ SƯU TẬP FIRESTORE TỰ ĐỘNG SỬ DỤNG:
 *    - Collection `exam_questions`: Lưu trữ ngân hàng câu hỏi trắc nghiệm đồng bộ máy chủ.
 *    - Collection `exam_results`: Lưu trữ kết quả thi của thí sinh kèm thời gian nộp bài.
 * ====================================================================================================
 */

import React, { useState, useEffect } from 'react';
import { UserCandidate, Question } from './types/quiz';
import { UAV_QUESTIONS, selectRandomQuestions, EXAM_QUESTION_COUNT } from './data/uavQuestions';
import { fetchQuestionsFromFirestore } from './services/firebase';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminPasswordModal } from './components/AdminPasswordModal';
import { FirebaseConfigModal } from './components/FirebaseConfigModal';
import { HistoryModal } from './components/HistoryModal';
import { isAdminAuthenticated, logoutAdmin } from './services/auth';
import { Plane, LayoutDashboard } from 'lucide-react';

export default function App() {
  // Trạng thái luồng màn hình: 'welcome' -> 'quiz' -> 'result' | 'admin'
  const [screen, setScreen] = useState<'welcome' | 'quiz' | 'result' | 'admin'>('welcome');

  // Ngân hàng toàn bộ câu hỏi (tải từ Firestore hoặc mặc định 50 câu)
  const [allQuestions, setAllQuestions] = useState<Question[]>(UAV_QUESTIONS);

  // Bộ 20 câu hỏi được chọn ngẫu nhiên cho lượt thi của thí sinh
  const [examQuestions, setExamQuestions] = useState<Question[]>(() => 
    selectRandomQuestions(UAV_QUESTIONS, EXAM_QUESTION_COUNT)
  );

  // Thông tin thí sinh đăng ký
  const [candidate, setCandidate] = useState<UserCandidate | null>(null);

  // Đáp án thí sinh đã chọn: { [questionId]: 'A' | 'B' | 'C' | 'D' }
  const [userAnswers, setUserAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});

  // Thời gian làm bài thực tế (tính bằng giây)
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);

  // Quản lý Modal Cấu hình Firebase & Modal Xem Lịch Sử Điểm Thi & Mật khẩu Admin
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isAdminPasswordModalOpen, setIsAdminPasswordModalOpen] = useState(false);

  // Tải toàn bộ câu hỏi từ Firestore khi khởi động
  const loadDynamicQuestions = async () => {
    try {
      const res = await fetchQuestionsFromFirestore(UAV_QUESTIONS);
      if (res.questions && res.questions.length > 0) {
        setAllQuestions(res.questions);
      }
    } catch (err) {
      console.warn('Sử dụng câu hỏi dự phòng:', err);
    }
  };

  useEffect(() => {
    loadDynamicQuestions();
  }, []);

  // Bắt đầu làm bài thi từ Màn hình 1 (chọn ngẫu nhiên 20 câu hỏi)
  const handleStartExam = (candidateData: UserCandidate) => {
    setCandidate(candidateData);
    setUserAnswers({});
    setTimeSpentSeconds(0);
    // BỐC NGẪU NHIÊN 20 CÂU HỎI TRONG TỔNG SỐ CÂU HỎI
    const selected20 = selectRandomQuestions(allQuestions, EXAM_QUESTION_COUNT);
    setExamQuestions(selected20);
    setScreen('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Nộp bài thi từ Màn hình 2 chuyển sang Màn hình 3
  const handleSubmitQuiz = (
    finalAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>,
    timeSpent: number
  ) => {
    setUserAnswers(finalAnswers);
    setTimeSpentSeconds(timeSpent);
    setScreen('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Làm lại bài thi mới (sẽ bốc một bộ 20 câu hỏi ngẫu nhiên mới)
  const handleRetakeExam = () => {
    setUserAnswers({});
    setTimeSpentSeconds(0);
    const fresh20 = selectRandomQuestions(allQuestions, EXAM_QUESTION_COUNT);
    setExamQuestions(fresh20);
    setScreen('welcome');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Chuyển đổi giữa chế độ thi và trang quản trị (BẢO MẬT BẰNG MẬT KHẨU)
  const handleToggleAdmin = () => {
    if (screen === 'quiz') {
      if (!confirm('Bạn đang trong quá trình làm bài thi. Thoát ra sẽ hủy phiên làm bài hiện tại. Đồng ý?')) {
        return;
      }
    }
    if (screen === 'admin') {
      setScreen('welcome');
      loadDynamicQuestions(); // Cập nhật lại câu hỏi nếu quản trị viên vừa chỉnh sửa
    } else {
      // Kiểm tra xem phiên làm việc đã đăng nhập mật khẩu admin chưa
      if (isAdminAuthenticated()) {
        setScreen('admin');
      } else {
        setIsAdminPasswordModalOpen(true);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminPasswordModalOpen(false);
    setScreen('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = () => {
    logoutAdmin();
    setScreen('welcome');
    loadDynamicQuestions();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header điều hướng chung */}
      <Header
        candidate={candidate}
        isAdminActive={screen === 'admin'}
        onToggleAdmin={handleToggleAdmin}
        onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
        onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
      />

      {/* Main Body Theo Trạng Thái Screen */}
      <main className="flex-1">
        {screen === 'admin' && (
          <AdminDashboard
            onBackToExam={() => {
              setScreen('welcome');
              loadDynamicQuestions();
            }}
            onOpenFirebaseConfig={() => setIsFirebaseModalOpen(true)}
            onLogout={handleAdminLogout}
          />
        )}

        {screen === 'welcome' && (
          <WelcomeScreen
            onStartExam={handleStartExam}
            totalPoolCount={allQuestions.length}
            examQuestionsCount={Math.min(EXAM_QUESTION_COUNT, allQuestions.length)}
          />
        )}

        {screen === 'quiz' && candidate && (
          <QuizScreen
            candidate={candidate}
            questions={examQuestions}
            totalPoolCount={allQuestions.length}
            onSubmitQuiz={handleSubmitQuiz}
          />
        )}

        {screen === 'result' && candidate && (
          <ResultScreen
            candidate={candidate}
            questions={examQuestions}
            totalPoolCount={allQuestions.length}
            userAnswers={userAnswers}
            timeSpentSeconds={timeSpentSeconds}
            onRetakeExam={handleRetakeExam}
            onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
          />
        )}
      </main>

      {/* Modal Xác Thực Mật Khẩu Quản Trị */}
      <AdminPasswordModal
        isOpen={isAdminPasswordModalOpen}
        onClose={() => setIsAdminPasswordModalOpen(false)}
        onSuccess={handleAdminAuthSuccess}
      />

      {/* Modal Cấu hình Firebase */}
      <FirebaseConfigModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
      />

      {/* Modal Bảng Điểm & Lịch Sử Kết Quả Firestore */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />

      {/* Footer Chuyên Nghiệp */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-400 font-medium">Nguyễn Văn Biên - Cậu bé Pilot</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={handleToggleAdmin}
              className="hover:text-indigo-300 transition flex items-center gap-1 font-semibold text-indigo-400"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{screen === 'admin' ? 'Màn hình làm bài' : 'Trang quản trị (Admin)'}</span>
            </button>
            <span>•</span>
            <span className="text-slate-500">Bảo mật &amp; Lưu trữ dữ liệu trực tuyến</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
