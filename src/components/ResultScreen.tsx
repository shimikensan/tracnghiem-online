import React, { useEffect, useState, useRef } from 'react';
import { UserCandidate, Question, ExamResultRecord } from '../types/quiz';
import { saveExamResultToFirestore } from '../services/firebase';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  FileCheck, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface Props {
  candidate: UserCandidate;
  questions: Question[];
  totalPoolCount?: number;
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  timeSpentSeconds: number;
  onRetakeExam: () => void;
  onOpenHistoryModal: () => void;
}

export const ResultScreen: React.FC<Props> = ({
  candidate,
  questions,
  totalPoolCount,
  userAnswers,
  timeSpentSeconds,
  onRetakeExam,
  onOpenHistoryModal
}) => {
  const [showReview, setShowReview] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    loading: boolean;
    success: boolean;
    mode?: 'firestore' | 'local';
    docId?: string;
    error?: string;
  }>({ loading: true, success: false });

  const hasSavedRef = useRef(false);

  // Tính toán kết quả
  const totalQuestions = questions.length;
  let correctCount = 0;
  let wrongCount = 0;
  let unansweredCount = 0;

  questions.forEach((q) => {
    const selected = userAnswers[q.id];
    if (!selected) {
      unansweredCount++;
    } else if (selected === q.correctAnswer) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const score = Number(((correctCount / totalQuestions) * 10).toFixed(1));
  const score100 = Math.round((correctCount / totalQuestions) * 100);
  const isPassed = score >= 7.0;

  // Xếp loại đánh giá
  let gradeText = 'Không đạt';
  let gradeColor = 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  if (score >= 9.0) {
    gradeText = 'Xuất sắc';
    gradeColor = 'text-emerald-300 border-emerald-500/30 bg-emerald-500/20';
  } else if (score >= 8.0) {
    gradeText = 'Giỏi';
    gradeColor = 'text-sky-300 border-sky-500/30 bg-sky-500/20';
  } else if (score >= 7.0) {
    gradeText = 'Đạt yêu cầu (Khá)';
    gradeColor = 'text-teal-300 border-teal-500/30 bg-teal-500/20';
  } else if (score >= 5.0) {
    gradeText = 'Trung bình (Chưa đạt)';
    gradeColor = 'text-amber-300 border-amber-500/30 bg-amber-500/20';
  }

  // Bắn pháo hoa chúc mừng nếu đạt điểm khá trở lên
  useEffect(() => {
    if (isPassed) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isPassed]);

  // THỰC HIỆN LƯU DỮ LIỆU ĐIỂM SỐ VÀ THÔNG TIN VÀO FIREBASE (FIRESTORE) TẠI BƯỚC NÀY
  useEffect(() => {
    if (hasSavedRef.current) return;
    hasSavedRef.current = true;

    const answersDetail: Record<number, { selected: string | null; correct: string; isCorrect: boolean }> = {};
    const answersSummary: Record<number, string> = {};

    questions.forEach(q => {
      const selected = userAnswers[q.id] || null;
      answersDetail[q.id] = {
        selected,
        correct: q.correctAnswer,
        isCorrect: selected === q.correctAnswer
      };
      if (selected) answersSummary[q.id] = selected;
    });

    const record: ExamResultRecord = {
      fullName: candidate.fullName,
      rank: candidate.rank,
      position: candidate.position,
      unit: candidate.unit,
      score: score,
      score100: score100,
      correctCount: correctCount,
      wrongCount: wrongCount,
      unansweredCount: unansweredCount,
      totalQuestions: totalQuestions,
      poolTotalQuestions: totalPoolCount,
      percentage: percentage,
      timeSpentSeconds: timeSpentSeconds,
      submittedAt: new Date().toISOString(),
      isPassed: isPassed,
      answersDetail,
      answersSummary
    };

    saveExamResultToFirestore(record)
      .then((res) => {
        setSaveStatus({
          loading: false,
          success: res.success,
          mode: res.mode,
          docId: res.id,
          error: res.error
        });
      })
      .catch((err) => {
        setSaveStatus({
          loading: false,
          success: false,
          mode: 'local',
          error: err.message
        });
      });
  }, [candidate, score, score100, correctCount, wrongCount, unansweredCount, totalQuestions, percentage, timeSpentSeconds, isPassed]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 animate-fade-in">
      {/* Firebase Save Status Notification Badge */}
      <div className="mb-6">
        {saveStatus.loading ? (
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 shadow-sm">
            <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            <span>Đang ghi nhận kết quả vào cơ sở dữ liệu Firebase Firestore...</span>
          </div>
        ) : saveStatus.mode === 'firestore' && saveStatus.success ? (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-xs text-emerald-200 shadow-sm">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Đã lưu thành công vào Firestore:</strong> Bộ sưu tập <code className="bg-emerald-900/60 px-1 py-0.5 rounded font-mono">exam_results</code> (Mã: {saveStatus.docId?.slice(0, 8)}...)
              </span>
            </div>
            <button 
              onClick={onOpenHistoryModal}
              className="text-emerald-300 hover:text-white underline underline-offset-2 shrink-0 font-medium"
            >
              Xem danh sách
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/50 text-xs text-amber-200 shadow-sm">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Chế độ lưu nội bộ:</strong> {saveStatus.error || 'Dữ liệu đã lưu tạm an toàn trong LocalStorage.'}
              </span>
            </div>
            <button 
              onClick={onOpenHistoryModal}
              className="text-amber-300 hover:text-white underline underline-offset-2 shrink-0 font-medium"
            >
              Xem bảng điểm
            </button>
          </div>
        )}
      </div>

      {/* Main Result Card */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center">
        {/* Glow backdrop */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20 ${
          isPassed ? 'bg-emerald-500' : 'bg-rose-500'
        }`} />

        <div className="relative z-10">
          {/* Header Title */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-300 mb-4">
            <FileCheck className="w-3.5 h-3.5 text-indigo-400" />
            BIÊN BẢN KẾT QUẢ SÁT HẠCH TRỰC TUYẾN
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isPassed ? 'Chúc Mừng! Bạn Đã Hoàn Thành Bài Thi' : 'Kết Quả Bài Thi Chưa Đạt Chuẩn'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg mx-auto">
            Hệ thống đã tự động chấm điểm và đánh giá kết quả kiểm tra nghiệp vụ của đồng chí.
          </p>

          {/* Big Score Display */}
          <div className="my-8 flex flex-col items-center justify-center">
            <div className="relative">
              <div className="text-6xl sm:text-7xl font-extrabold font-mono tracking-tight text-white">
                {score.toFixed(1)}
                <span className="text-2xl sm:text-3xl text-slate-500 font-normal">/10</span>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-1">
                (Tương đương {score100}/100 điểm - Tỷ lệ đúng {percentage}%)
              </div>
              <div className="text-[11px] text-indigo-300/90 font-medium mt-1 flex items-center justify-center gap-1">
                <span>🎯 Đề thi 20 câu hỏi chọn ngẫu nhiên {totalPoolCount ? `từ kho ${totalPoolCount} câu` : ''}</span>
              </div>
            </div>

            <div className={`mt-4 px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider ${gradeColor}`}>
              Xếp loại: {gradeText}
            </div>
          </div>

          {/* Candidate Info Grid */}
          <div className="max-w-2xl mx-auto bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left text-xs mb-8">
            <div>
              <span className="text-slate-400 block text-[11px]">Họ và tên thí sinh:</span>
              <span className="font-bold text-white text-sm mt-0.5 block">{candidate.fullName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Cấp hàm / Chức vụ:</span>
              <span className="font-semibold text-amber-300 mt-0.5 block">
                {candidate.rank} - {candidate.position}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Đơn vị công tác:</span>
              <span className="font-semibold text-sky-300 mt-0.5 block">
                {candidate.unit}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Thời gian làm bài:</span>
              <span className="font-mono text-slate-200 mt-0.5 block font-medium">
                {Math.floor(timeSpentSeconds / 60)}p {timeSpentSeconds % 60}s
              </span>
            </div>
          </div>

          {/* Stats Breakdown Bar */}
          <div className="max-w-2xl mx-auto grid grid-cols-3 gap-3 mb-8">
            <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-3 text-center">
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
                {correctCount}
              </div>
              <div className="text-[11px] text-emerald-300/80 font-medium mt-0.5 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Số câu đúng
              </div>
            </div>

            <div className="bg-rose-950/30 border border-rose-800/40 rounded-xl p-3 text-center">
              <div className="text-xl sm:text-2xl font-bold font-mono text-rose-400">
                {wrongCount}
              </div>
              <div className="text-[11px] text-rose-300/80 font-medium mt-0.5 flex items-center justify-center gap-1">
                <XCircle className="w-3 h-3" /> Số câu sai
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-center">
              <div className="text-xl sm:text-2xl font-bold font-mono text-slate-300">
                {unansweredCount}
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" /> Chưa làm
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setShowReview(!showReview)}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              {showReview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showReview ? 'Ẩn xem lại bài làm' : 'Xem lại bài làm chi tiết'}</span>
            </button>

            <button
              onClick={onRetakeExam}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-2 transition"
            >
              <RotateCcw className="w-4 h-4 text-sky-400" />
              <span>Làm bài thi mới</span>
            </button>

            <button
              onClick={onOpenHistoryModal}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-2 transition"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Bảng điểm chung</span>
            </button>
          </div>
        </div>
      </div>

      {/* Review Mode: Chi Tiết Từng Câu Hỏi */}
      {showReview && (
        <div className="mt-10 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-indigo-400" />
                Chi Tiết Đáp Án & Bài Làm Của Thí Sinh
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Màu xanh: Bạn chọn đúng | Màu đỏ: Bạn chọn sai | Khung viền lục: Đáp án đúng của hệ thống
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
              {correctCount}/{totalQuestions} câu đúng
            </span>
          </div>

          <div className="space-y-6">
            {questions.map((q, idx) => {
              const selectedOpt = userAnswers[q.id];
              const isUserCorrect = selectedOpt === q.correctAnswer;
              const hasAnswered = Boolean(selectedOpt);

              return (
                <div
                  key={q.id}
                  className={`bg-slate-900/90 border rounded-2xl p-6 sm:p-7 shadow-lg transition ${
                    isUserCorrect
                      ? 'border-emerald-900/50 hover:border-emerald-700/60'
                      : 'border-rose-900/50 hover:border-rose-700/60'
                  }`}
                >
                  {/* Status header */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isUserCorrect 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-rose-600 text-white'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                        Câu hỏi {idx + 1}
                      </span>
                    </div>

                    <div>
                      {isUserCorrect ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Đúng
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-semibold">
                          <XCircle className="w-3.5 h-3.5" /> 
                          {hasAnswered ? 'Sai' : 'Chưa trả lời'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Title */}
                  <h4 className="text-base font-semibold text-white mb-5 leading-relaxed">
                    {q.question}
                  </h4>

                  {/* Options */}
                  <div className="space-y-3">
                    {q.options.map((opt) => {
                      const isUserChoice = selectedOpt === opt.key;
                      const isSystemCorrect = opt.key === q.correctAnswer;

                      let cardStyle = 'bg-slate-800/40 border-slate-700/60 text-slate-300';
                      let badgeStyle = 'bg-slate-700 text-slate-300';

                      if (isSystemCorrect) {
                        cardStyle = 'bg-emerald-950/40 border-emerald-500 text-white ring-1 ring-emerald-500/40';
                        badgeStyle = 'bg-emerald-500 text-white';
                      } else if (isUserChoice && !isUserCorrect) {
                        cardStyle = 'bg-rose-950/40 border-rose-500 text-rose-200 ring-1 ring-rose-500/40';
                        badgeStyle = 'bg-rose-500 text-white';
                      }

                      return (
                        <div
                          key={opt.key}
                          className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border text-sm transition ${cardStyle}`}
                        >
                          <div className="flex items-start gap-3">
                            <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs shrink-0 ${badgeStyle}`}>
                              {opt.key}
                            </span>
                            <span className="pt-0.5 leading-relaxed">{opt.text}</span>
                          </div>

                          <div className="shrink-0 flex items-center gap-2">
                            {isUserChoice && (
                              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                isUserCorrect 
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              }`}>
                                {isUserCorrect ? '✓ Bạn đã chọn (Đúng)' : '✗ Bạn đã chọn (Sai)'}
                              </span>
                            )}
                            {isSystemCorrect && !isUserChoice && (
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                ★ Đáp án đúng
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Note */}
                  {q.explanation && (
                    <div className="mt-4 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 flex items-start gap-2.5">
                      <HelpCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-sky-300">Giải thích: </strong>
                        <span>{q.explanation}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center pt-6">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition"
            >
              ↑ Về đầu trang
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
