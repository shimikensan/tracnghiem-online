import React, { useState, useEffect } from 'react';
import { Question, ExamResultRecord } from '../types/quiz';
import { 
  fetchQuestionsFromFirestore, 
  saveQuestionToFirestore, 
  deleteQuestionFromFirestore, 
  syncDefaultQuestionsToFirestore,
  getExamResultsHistory,
  deleteExamResultFromFirestore,
  isFirebaseConfigured
} from '../services/firebase';
import { logoutAdmin, setAdminPassword, resetAdminPassword, getAdminPassword } from '../services/auth';
import { UAV_QUESTIONS } from '../data/uavQuestions';
import { 
  Database, 
  BookOpen, 
  Award, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Upload, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  X, 
  FileSpreadsheet, 
  Filter, 
  Eye, 
  Layers,
  ChevronRight,
  TrendingUp,
  User,
  Building2,
  Check,
  Lock,
  KeyRound,
  LogOut
} from 'lucide-react';

interface Props {
  onBackToExam: () => void;
  onOpenFirebaseConfig: () => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<Props> = ({ onBackToExam, onOpenFirebaseConfig, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'questions' | 'results' | 'settings'>('questions');

  // Change Admin Password State
  const [showChangePassModal, setShowChangePassModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passError, setPassError] = useState('');

  // Question Management State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsSource, setQuestionsSource] = useState<'firestore' | 'local'>('local');
  const [questionSearch, setQuestionSearch] = useState('');
  const [editingQuestion, setEditingQuestion] = useState<Partial<Question> | null>(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showJsonImportModal, setShowJsonImportModal] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Results Management State
  const [results, setResults] = useState<ExamResultRecord[]>([]);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsSource, setResultsSource] = useState<'firestore' | 'local'>('local');
  const [resultSearch, setResultSearch] = useState('');
  const [filterUnit, setFilterUnit] = useState<string>('all');
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pass' | 'fail'>('all');
  const [selectedResultDetail, setSelectedResultDetail] = useState<ExamResultRecord | null>(null);

  // Notifications
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const isConfigured = isFirebaseConfigured();

  // Load questions
  const loadQuestions = async () => {
    setQuestionsLoading(true);
    try {
      const data = await fetchQuestionsFromFirestore(UAV_QUESTIONS);
      setQuestions(data.questions);
      setQuestionsSource(data.source);
    } catch (err) {
      console.error(err);
      showToast('Không tải được câu hỏi: ' + String(err), 'error');
    } finally {
      setQuestionsLoading(false);
    }
  };

  // Load results
  const loadResults = async () => {
    setResultsLoading(true);
    try {
      const data = await getExamResultsHistory();
      setResults(data.results);
      setResultsSource(data.source);
    } catch (err) {
      console.error(err);
      showToast('Không tải được danh sách kết quả', 'error');
    } finally {
      setResultsLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
    loadResults();
  }, []);

  // Sync Default 20 Questions to Firestore
  const handleSyncDefaultQuestions = async () => {
    if (!isConfigured) {
      showToast('Vui lòng kết nối Firebase trước khi đồng bộ lên Cloud', 'error');
      return;
    }
    if (!confirm('Đồng bộ 20 câu hỏi UAV mẫu vào Firestore collection `exam_questions`?')) {
      return;
    }

    setIsSyncing(true);
    try {
      const res = await syncDefaultQuestionsToFirestore(UAV_QUESTIONS);
      if (res.success) {
        showToast(`Đã lưu thành công ${res.count} câu hỏi vào Firestore!`, 'success');
        loadQuestions();
      } else {
        showToast(`Đồng bộ thất bại: ${res.error}`, 'error');
      }
    } catch (err: any) {
      showToast('Lỗi: ' + err.message, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Handle Save Question
  const handleSaveQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion || !editingQuestion.question?.trim()) {
      showToast('Nội dung câu hỏi không được để trống', 'error');
      return;
    }

    try {
      const qData: any = {
        question: editingQuestion.question.trim(),
        options: editingQuestion.options || [
          { key: 'A', text: '' },
          { key: 'B', text: '' },
          { key: 'C', text: '' }
        ],
        correctAnswer: editingQuestion.correctAnswer || 'A',
        explanation: editingQuestion.explanation || '',
        firestoreId: editingQuestion.firestoreId,
        id: editingQuestion.id
      };

      const res = await saveQuestionToFirestore(qData, questions.length);
      if (res.success) {
        showToast(editingQuestion.firestoreId ? 'Đã cập nhật câu hỏi thành công!' : 'Đã thêm câu hỏi mới thành công!', 'success');
        setShowQuestionModal(false);
        setEditingQuestion(null);
        loadQuestions();
      }
    } catch (err: any) {
      showToast('Lỗi khi lưu câu hỏi: ' + err.message, 'error');
    }
  };

  // Handle Delete Question
  const handleDeleteQuestion = async (q: Question) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa câu hỏi số ${q.id}: "${q.question.slice(0, 40)}..."?`)) {
      return;
    }

    try {
      const res = await deleteQuestionFromFirestore(q.firestoreId, q.id);
      if (res.success) {
        showToast(`Đã xóa câu hỏi #${q.id}`, 'info');
        loadQuestions();
      }
    } catch (err: any) {
      showToast('Lỗi xóa câu hỏi: ' + err.message, 'error');
    }
  };

  // Handle Import JSON
  const handleImportJson = async () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        showToast('Dữ liệu JSON phải là một mảng [] danh sách câu hỏi', 'error');
        return;
      }

      setIsSyncing(true);
      let count = 0;
      for (const item of parsed) {
        if (item.question && item.options && item.correctAnswer) {
          await saveQuestionToFirestore({
            id: item.id || (questions.length + count + 1),
            question: item.question,
            options: item.options,
            correctAnswer: item.correctAnswer,
            explanation: item.explanation || ''
          }, questions.length + count);
          count++;
        }
      }
      showToast(`Đã nhập thành công ${count} câu hỏi vào hệ thống!`, 'success');
      setShowJsonImportModal(false);
      setJsonInput('');
      loadQuestions();
    } catch (err: any) {
      showToast('Định dạng JSON không hợp lệ: ' + err.message, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Handle Export Questions JSON
  const handleExportQuestionsJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `uav_questions_bank_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Handle Delete Result
  const handleDeleteResult = async (resId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bản ghi kết quả này?')) return;
    try {
      await deleteExamResultFromFirestore(resId);
      showToast('Đã xóa bản ghi kết quả thành công', 'info');
      loadResults();
    } catch (e: any) {
      showToast('Lỗi khi xóa kết quả: ' + e.message, 'error');
    }
  };

  // Handle Export Results CSV
  const handleExportResultsCSV = () => {
    if (results.length === 0) {
      showToast('Chưa có dữ liệu kết quả để xuất', 'info');
      return;
    }

    const headers = ['Họ và Tên', 'Cấp hàm', 'Chức vụ', 'Đơn vị', 'Điểm số', 'Đúng', 'Tổng', 'Thời gian (giây)', 'Ngày nộp', 'Kết quả'];
    const rows = results.map(r => [
      `"${r.fullName}"`,
      `"${r.rank}"`,
      `"${r.position}"`,
      `"${r.unit}"`,
      r.score,
      r.correctCount,
      r.totalQuestions,
      r.timeSpentSeconds,
      `"${r.submittedAt}"`,
      r.isPassed ? 'ĐẠT' : 'CHƯA ĐẠT'
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ket_qua_thi_uav_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Filtered Questions
  const filteredQuestions = questions.filter(q => {
    if (!questionSearch.trim()) return true;
    const term = questionSearch.toLowerCase();
    return q.question.toLowerCase().includes(term) ||
      q.options.some(opt => opt.text.toLowerCase().includes(term));
  });

  // Filtered Results
  const filteredResults = results.filter(r => {
    const matchesSearch = !resultSearch.trim() || 
      r.fullName.toLowerCase().includes(resultSearch.toLowerCase()) ||
      r.unit.toLowerCase().includes(resultSearch.toLowerCase());
    
    const matchesUnit = filterUnit === 'all' || r.unit === filterUnit;
    const matchesPosition = filterPosition === 'all' || r.position === filterPosition;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'pass' && r.isPassed) ||
      (filterStatus === 'fail' && !r.isPassed);

    return matchesSearch && matchesUnit && matchesPosition && matchesStatus;
  });

  // Calculate stats
  const totalSubmissions = results.length;
  const passedCount = results.filter(r => r.isPassed).length;
  const passRate = totalSubmissions > 0 ? Math.round((passedCount / totalSubmissions) * 100) : 0;
  const avgScore = totalSubmissions > 0 
    ? (results.reduce((acc, r) => acc + (Number(r.score) || 0), 0) / totalSubmissions).toFixed(1) 
    : '0';

  // Unique units for filter dropdown
  const uniqueUnits = Array.from(new Set(results.map(r => r.unit).filter(Boolean)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-slate-100">
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl border shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-bounce-short ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-950/95 border-emerald-500 text-emerald-200' 
            : toastMessage.type === 'error'
              ? 'bg-rose-950/95 border-rose-500 text-rose-200'
              : 'bg-indigo-950/95 border-indigo-500 text-indigo-200'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-md">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
                Trung Tâm Quản Trị Hệ Thống
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Firebase Firestore
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Quản lý ngân hàng câu hỏi UAV và theo dõi bảng điểm chi tiết của thí sinh
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenFirebaseConfig}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition ${
              isConfigured 
                ? 'bg-emerald-950/30 border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/40' 
                : 'bg-amber-950/40 border-amber-600/60 text-amber-300 hover:bg-amber-900/50'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isConfigured ? 'Firebase: Đã kết nối' : 'Cấu hình Firebase'}</span>
            <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          </button>

          <button
            onClick={() => {
              setNewPassword('');
              setConfirmNewPassword('');
              setPassError('');
              setShowChangePassModal(true);
            }}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition"
            title="Đổi mật khẩu bảo vệ quản trị"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Đổi Mật Khẩu</span>
          </button>

          <button
            onClick={onBackToExam}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white flex items-center gap-1.5 transition shadow-sm"
          >
            <span>Về Màn Hình Thi</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={onLogout}
            className="px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/60 text-xs font-bold text-rose-300 hover:text-rose-200 flex items-center gap-1.5 transition"
            title="Khóa và đăng xuất quyền quản trị"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Khóa / Đăng Xuất</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 mt-6 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition -mb-px ${
            activeTab === 'questions'
              ? 'border-indigo-500 text-white bg-slate-900/80 rounded-t-xl'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span>Ngân Hàng Câu Hỏi ({questions.length})</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${questionsSource === 'firestore' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
            {questionsSource === 'firestore' ? 'Firestore' : 'Local'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('results')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition -mb-px ${
            activeTab === 'results'
              ? 'border-indigo-500 text-white bg-slate-900/80 rounded-t-xl'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Kết Quả Thí Sinh ({results.length})</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${resultsSource === 'firestore' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
            {resultsSource === 'firestore' ? 'Firestore' : 'Local'}
          </span>
        </button>
      </div>

      {/* =========================================================================
       * TAB 1: QUẢN LÝ CÂU HỎI
       * ========================================================================= */}
      {activeTab === 'questions' && (
        <div className="mt-6 space-y-6">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={questionSearch}
                onChange={(e) => setQuestionSearch(e.target.value)}
                placeholder="Tìm kiếm nội dung câu hỏi hoặc đáp án..."
                className="w-full pl-10 pr-4 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setEditingQuestion({
                    id: questions.length + 1,
                    question: '',
                    options: [
                      { key: 'A', text: '' },
                      { key: 'B', text: '' },
                      { key: 'C', text: '' }
                    ],
                    correctAnswer: 'A',
                    explanation: ''
                  });
                  setShowQuestionModal(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm câu hỏi</span>
              </button>

              <button
                onClick={handleSyncDefaultQuestions}
                disabled={isSyncing}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-sky-300 flex items-center gap-1.5 transition disabled:opacity-50"
                title="Đồng bộ 20 câu hỏi UAV mẫu lên collection exam_questions"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Đồng bộ 20 câu lên Firestore</span>
              </button>

              <button
                onClick={() => setShowJsonImportModal(true)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition"
                title="Nhập hàng loạt qua định dạng JSON"
              >
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Nhập JSON</span>
              </button>

              <button
                onClick={handleExportQuestionsJson}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition"
                title="Tải về file JSON câu hỏi"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Xuất JSON</span>
              </button>
            </div>
          </div>

          {/* Questions Grid / List */}
          {questionsLoading ? (
            <div className="py-20 text-center text-slate-400">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs">Đang tải ngân hàng câu hỏi từ Firestore...</p>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="py-16 text-center text-slate-500 bg-slate-900/60 rounded-2xl border border-slate-800">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <p className="font-semibold text-slate-300">Không tìm thấy câu hỏi nào</p>
              <p className="text-xs mt-1">Bấm "Thêm câu hỏi" hoặc "Đồng bộ 20 câu lên Firestore" để khởi tạo.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((q, idx) => (
                <div
                  key={q.firestoreId || q.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {q.id || idx + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-white leading-relaxed">
                          {q.question}
                        </h4>
                        {q.explanation && (
                          <p className="text-xs text-slate-400 mt-1 italic">
                            💡 Giải thích: {q.explanation}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          setEditingQuestion(q);
                          setShowQuestionModal(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        title="Sửa câu hỏi"
                      >
                        <Edit3 className="w-4 h-4 text-sky-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                        title="Xóa câu hỏi"
                      >
                        <Trash2 className="w-4 h-4 text-rose-400" />
                      </button>
                    </div>
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80">
                    {q.options.map(opt => {
                      const isCorrect = opt.key === q.correctAnswer;
                      return (
                        <div
                          key={opt.key}
                          className={`px-3 py-2 rounded-xl text-xs flex items-center gap-2 border ${
                            isCorrect 
                              ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 font-semibold' 
                              : 'bg-slate-800/40 border-slate-800 text-slate-300'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono font-bold text-[10px] shrink-0 ${
                            isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                          }`}>
                            {opt.key}
                          </span>
                          <span className="truncate">{opt.text}</span>
                          {isCorrect && (
                            <span className="ml-auto text-[10px] text-emerald-400 font-bold shrink-0">
                              (Đáp án đúng)
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
       * TAB 2: QUẢN LÝ KẾT QUẢ THÍ SINH
       * ========================================================================= */}
      {activeTab === 'results' && (
        <div className="mt-6 space-y-6">
          {/* Stats Analytics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Tổng lượt thi
              </span>
              <div className="text-2xl font-bold font-mono text-white mt-1">
                {totalSubmissions}
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Lưu tại Firestore `exam_results`
              </span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Điểm trung bình
              </span>
              <div className="text-2xl font-bold font-mono text-sky-400 mt-1">
                {avgScore} <span className="text-xs text-slate-500">/10</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Thang điểm 10 quy chuẩn
              </span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Tỷ lệ Đạt (≥ 7.0)
              </span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                {passRate}%
              </div>
              <span className="text-[11px] text-emerald-400/80 mt-0.5 block">
                {passedCount}/{totalSubmissions} thí sinh đạt yêu cầu
              </span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Chưa đạt (&lt; 7.0)
              </span>
              <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
                {totalSubmissions - passedCount}
              </div>
              <span className="text-[11px] text-rose-400/80 mt-0.5 block">
                Cần sát hạch / bồi dưỡng lại
              </span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* Search by name/unit */}
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={resultSearch}
                  onChange={(e) => setResultSearch(e.target.value)}
                  placeholder="Tìm theo tên hoặc đơn vị..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Filter Unit */}
              <select
                value={filterUnit}
                onChange={(e) => setFilterUnit(e.target.value)}
                className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none"
              >
                <option value="all">Tất cả đơn vị</option>
                {uniqueUnits.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>

              {/* Filter Position */}
              <select
                value={filterPosition}
                onChange={(e) => setFilterPosition(e.target.value)}
                className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none"
              >
                <option value="all">Tất cả chức vụ</option>
                <option value="Cán bộ">Cán bộ</option>
                <option value="Chỉ huy Đội">Chỉ huy Đội</option>
                <option value="Chỉ huy Phòng">Chỉ huy Phòng</option>
              </select>

              {/* Filter Status */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none"
              >
                <option value="all">Tất cả kết quả</option>
                <option value="pass">Chỉ xem: ĐẠT</option>
                <option value="fail">Chỉ xem: CHƯA ĐẠT</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={loadResults}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition"
                title="Tải lại từ Firestore"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${resultsLoading ? 'animate-spin' : ''}`} />
                <span>Làm mới</span>
              </button>

              <button
                onClick={handleExportResultsCSV}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-700/20 transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Xuất CSV / Excel</span>
              </button>
            </div>
          </div>

          {/* Results Table */}
          {resultsLoading ? (
            <div className="py-20 text-center text-slate-400">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs">Đang truy vấn bảng điểm từ Firestore collection `exam_results`...</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="py-16 text-center text-slate-500 bg-slate-900/60 rounded-2xl border border-slate-800">
              <Award className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <p className="font-semibold text-slate-300">Không có kết quả bài thi nào khớp bộ lọc</p>
              <p className="text-xs mt-1">Khi các cán bộ nộp bài thi, kết quả sẽ tự động lưu vào đây.</p>
            </div>
          ) : (
            <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/80 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3.5">Họ và Tên</th>
                      <th className="px-4 py-3.5">Cấp hàm</th>
                      <th className="px-4 py-3.5">Chức vụ</th>
                      <th className="px-4 py-3.5">Đơn vị công tác</th>
                      <th className="px-4 py-3.5 text-center">Điểm số</th>
                      <th className="px-4 py-3.5 text-center">Đúng/Tổng</th>
                      <th className="px-4 py-3.5 text-center">Thời gian</th>
                      <th className="px-4 py-3.5 text-center">Đánh giá</th>
                      <th className="px-4 py-3.5 text-right">Ngày nộp</th>
                      <th className="px-4 py-3.5 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredResults.map((r, idx) => {
                      const isPass = (r.score ?? 0) >= 7;
                      return (
                        <tr key={r.id || idx} className="hover:bg-slate-800/40 transition">
                          <td className="px-4 py-3.5 font-bold text-white flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isPass ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                            {r.fullName}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-medium text-[11px]">
                              {r.rank}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-slate-300">{r.position}</td>
                          <td className="px-4 py-3.5 text-sky-300 font-medium">{r.unit || 'N/A'}</td>
                          <td className="px-4 py-3.5 text-center">
                            <span className={`font-mono font-bold text-sm px-2.5 py-0.5 rounded ${
                              isPass 
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}>
                              {typeof r.score === 'number' ? r.score.toFixed(1) : r.score}/10
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-center font-mono">
                            {r.correctCount}/{r.totalQuestions}
                          </td>
                          <td className="px-4 py-3.5 text-center font-mono text-slate-400">
                            {r.timeSpentSeconds ? `${Math.floor(r.timeSpentSeconds / 60)}p ${r.timeSpentSeconds % 60}s` : '--'}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              isPass ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-800/60' : 'text-rose-300 bg-rose-950/60 border border-rose-800/60'
                            }`}>
                              {isPass ? 'ĐẠT' : 'CHƯA ĐẠT'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right text-slate-400 text-[11px]">
                            {typeof r.submittedAt === 'string' ? r.submittedAt : 'Vừa xong'}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {r.answersDetail && (
                                <button
                                  onClick={() => setSelectedResultDetail(r)}
                                  className="p-1 rounded text-sky-400 hover:bg-slate-800 transition"
                                  title="Xem chi tiết các câu đã chọn"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => r.id && handleDeleteResult(r.id)}
                                className="p-1 rounded text-rose-400 hover:bg-slate-800 transition"
                                title="Xóa kết quả"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
       * MODAL: THÊM / SỬA CÂU HỎI
       * ========================================================================= */}
      {showQuestionModal && editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-400" />
                {editingQuestion.firestoreId ? 'Chỉnh Sửa Câu Hỏi' : 'Thêm Câu Hỏi Mới Vào Ngân Hàng'}
              </h3>
              <button
                onClick={() => setShowQuestionModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestionSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Số thứ tự (ID)
                </label>
                <input
                  type="number"
                  value={editingQuestion.id || 1}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, id: Number(e.target.value) })}
                  className="w-24 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nội dung câu hỏi <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={editingQuestion.question || ''}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                  placeholder="Nhập nội dung câu hỏi..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Options A, B, C */}
              <div className="space-y-3">
                <label className="block text-slate-300 font-semibold">
                  Các phương án trả lời & Chọn đáp án đúng <span className="text-rose-400">*</span>
                </label>

                {['A', 'B', 'C'].map((optKey, idx) => {
                  const currentOpt = editingQuestion.options?.find(o => o.key === optKey) || { key: optKey as any, text: '' };
                  const isCorrect = editingQuestion.correctAnswer === optKey;

                  return (
                    <div key={optKey} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingQuestion({ ...editingQuestion, correctAnswer: optKey as any })}
                        className={`w-9 h-9 rounded-lg font-mono font-bold text-xs flex items-center justify-center shrink-0 border transition ${
                          isCorrect
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                        title="Bấm để chọn đây là đáp án đúng"
                      >
                        {optKey}
                      </button>
                      <input
                        type="text"
                        required
                        value={currentOpt.text}
                        onChange={(e) => {
                          const updatedOpts = [...(editingQuestion.options || [])];
                          const existIndex = updatedOpts.findIndex(o => o.key === optKey);
                          if (existIndex >= 0) {
                            updatedOpts[existIndex] = { key: optKey as any, text: e.target.value };
                          } else {
                            updatedOpts.push({ key: optKey as any, text: e.target.value });
                          }
                          setEditingQuestion({ ...editingQuestion, options: updatedOpts });
                        }}
                        placeholder={`Phương án ${optKey}...`}
                        className={`flex-1 px-3 py-2 bg-slate-800 border rounded-lg text-white text-xs focus:outline-none ${
                          isCorrect ? 'border-emerald-500/80' : 'border-slate-700 focus:border-indigo-500'
                        }`}
                      />
                      {isCorrect && (
                        <span className="text-[11px] text-emerald-400 font-bold shrink-0">
                          (Đúng)
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Lời giải thích chi tiết (tùy chọn)
                </label>
                <textarea
                  rows={2}
                  value={editingQuestion.explanation || ''}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                  placeholder="Giải thích vì sao đáp án này đúng..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowQuestionModal(false)}
                  className="px-4 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md transition"
                >
                  Lưu vào Firebase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
       * MODAL: NHẬP DANH SÁCH JSON (BỘ 100 CÂU HỎI)
       * ========================================================================= */}
      {showJsonImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-400" />
                Nhập Ngân Hàng Câu Hỏi Từ JSON (Bộ 100 Câu UAV)
              </h3>
              <button
                onClick={() => setShowJsonImportModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs overflow-y-auto">
              <p className="text-slate-400 leading-relaxed">
                Dán mảng JSON chứa các câu hỏi theo cấu trúc chuẩn. Toàn bộ câu hỏi sẽ được ghi đồng bộ vào cơ sở dữ liệu Firebase Firestore:
              </p>

              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-amber-300 overflow-x-auto">
{`[
  {
    "id": 1,
    "question": "Nội dung câu hỏi...",
    "options": [
      { "key": "A", "text": "Phương án A" },
      { "key": "B", "text": "Phương án B" },
      { "key": "C", "text": "Phương án C" }
    ],
    "correctAnswer": "A",
    "explanation": "Lời giải thích (tùy chọn)"
  }
]`}
              </pre>

              <textarea
                rows={10}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Dán mảng JSON câu hỏi của bạn vào đây..."
                className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl font-mono text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJsonImportModal(false)}
                  className="px-4 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleImportJson}
                  disabled={!jsonInput.trim() || isSyncing}
                  className="px-5 py-2 font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg shadow-md transition disabled:opacity-50"
                >
                  {isSyncing ? 'Đang nhập...' : 'Bắt đầu nạp vào Firestore'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
       * MODAL: XEM CHI TIẾT BÀI LÀM CỦA THÍ SINH
       * ========================================================================= */}
      {selectedResultDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  Chi Tiết Bài Làm: {selectedResultDetail.fullName}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedResultDetail.rank} • {selectedResultDetail.position} • {selectedResultDetail.unit}
                </p>
              </div>
              <button
                onClick={() => setSelectedResultDetail(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 text-center">
                <div>
                  <span className="text-slate-400 block">Điểm số:</span>
                  <span className="text-xl font-bold font-mono text-emerald-400">{selectedResultDetail.score}/10</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Đúng / Tổng:</span>
                  <span className="text-xl font-bold font-mono text-white">{selectedResultDetail.correctCount}/{selectedResultDetail.totalQuestions}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Thời gian thi:</span>
                  <span className="text-xl font-bold font-mono text-sky-400">
                    {Math.floor(selectedResultDetail.timeSpentSeconds / 60)}p {selectedResultDetail.timeSpentSeconds % 60}s
                  </span>
                </div>
              </div>

              {selectedResultDetail.answersDetail && (
                <div className="space-y-3">
                  <h4 className="font-bold text-white text-sm">Bảng Lựa Chọn Từng Câu Hỏi:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(selectedResultDetail.answersDetail).map(([qId, ans]) => (
                      <div
                        key={qId}
                        className={`p-3 rounded-xl border flex items-center justify-between ${
                          ans.isCorrect 
                            ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200' 
                            : 'bg-rose-950/30 border-rose-800/40 text-rose-200'
                        }`}
                      >
                        <span className="font-semibold">Câu #{qId}</span>
                        <div className="flex items-center gap-2 font-mono">
                          <span>Chọn: <strong>{ans.selected || 'Bỏ trống'}</strong></span>
                          <span>• Đúng: <strong className="text-emerald-400">{ans.correct}</strong></span>
                          {ans.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
       * MODAL: ĐỔI MẬT KHẨU QUẢN TRỊ
       * ========================================================================= */}
      {showChangePassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                Đổi Mật Khẩu Quản Trị
              </h3>
              <button
                onClick={() => setShowChangePassModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newPassword.trim().length < 4) {
                  setPassError('Mật khẩu mới phải có tối thiểu 4 ký tự');
                  return;
                }
                if (newPassword !== confirmNewPassword) {
                  setPassError('Mật khẩu nhập lại không trùng khớp');
                  return;
                }
                const success = setAdminPassword(newPassword.trim());
                if (success) {
                  showToast('Đã đổi mật khẩu quản trị mới thành công!', 'success');
                  setShowChangePassModal(false);
                } else {
                  setPassError('Không thể lưu mật khẩu');
                }
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Mật khẩu mới <span className="text-rose-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (passError) setPassError('');
                  }}
                  placeholder="Nhập mật khẩu mới..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Xác nhận lại mật khẩu mới <span className="text-rose-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => {
                    setConfirmNewPassword(e.target.value);
                    if (passError) setPassError('');
                  }}
                  placeholder="Nhập lại mật khẩu mới..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              {passError && (
                <p className="text-[11px] text-rose-400 flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" /> {passError}
                </p>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Khôi phục mật khẩu về mặc định (admin123)?')) {
                      resetAdminPassword();
                      showToast('Đã khôi phục mật khẩu về mặc định: admin123', 'info');
                      setShowChangePassModal(false);
                    }
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 underline underline-offset-2"
                >
                  Khôi phục mặc định
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowChangePassModal(false)}
                    className="px-3 py-2 text-slate-400 hover:text-white"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition shadow-md"
                  >
                    Lưu Mật Khẩu
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
