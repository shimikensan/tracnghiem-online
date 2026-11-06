import React, { useState, useEffect, useRef } from 'react';
import { UserCandidate, Question } from '../types/quiz';
import { EXAM_DURATION_MINUTES } from '../data/uavQuestions';
import { 
  Clock, 
  AlertTriangle, 
  Send, 
  User, 
  Flag
} from 'lucide-react';

interface Props {
  candidate: UserCandidate;
  questions: Question[];
  totalPoolCount?: number;
  onSubmitQuiz: (answers: Record<number, 'A' | 'B' | 'C' | 'D'>, timeSpentSeconds: number) => void;
}

export const QuizScreen: React.FC<Props> = ({
  candidate,
  questions,
  totalPoolCount,
  onSubmitQuiz
}) => {
  // State quản lý câu trả lời: questionId -> 'A' | 'B' | 'C' | 'D'
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  // State gắn cờ câu hỏi nghi vấn để xem lại
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  // Bộ đếm ngược thời gian (mặc định 30 phút = 1800 giây)
  const totalDurationSeconds = EXAM_DURATION_MINUTES * 60;
  const [timeLeft, setTimeLeft] = useState<number>(totalDurationSeconds);
  // Modal xác nhận nộp bài
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Đếm ngược thời gian và tự động nộp khi hết giờ
  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinalSubmit('timeout');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit('timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format giây thành dạng MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const totalCount = questions.length;
  const unansweredCount = totalCount - answeredCount;
  const progressPercentage = Math.round((answeredCount / totalCount) * 100);

  // Chọn đáp án
  const handleSelectOption = (questionId: number, optionKey: 'A' | 'B' | 'C' | 'D') => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionKey
    }));
  };

  // Bật/tắt cờ xem lại
  const handleToggleFlag = (questionId: number) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // Cuộn mượt đến câu hỏi tương ứng
  const scrollToQuestion = (questionId: number) => {
    const el = questionRefs.current[questionId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Nộp bài
  const handleFinalSubmit = (reason: 'manual' | 'timeout' = 'manual') => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setShowConfirmModal(false);
    const timeSpent = totalDurationSeconds - timeLeft;
    onSubmitQuiz(selectedAnswers, timeSpent);
  };

  const isLowTime = timeLeft <= 300; // dưới 5 phút
  const isCriticalTime = timeLeft <= 60; // dưới 1 phút

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Sticky Top Status Bar */}
      <div className="sticky top-16 z-30 mb-6 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Thông tin thí sinh */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm sm:text-base">
                  {candidate.fullName}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-medium">
                  {candidate.rank}
                </span>
                <span className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {totalPoolCount ? `Đề 20 câu / ${totalPoolCount} câu gốc` : 'Đề 20 câu ngẫu nhiên'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Chức vụ: <span className="text-slate-300 font-medium">{candidate.position}</span> • Đơn vị: <span className="text-slate-300 font-medium">{candidate.unit}</span>
              </p>
            </div>
          </div>

          {/* Đồng hồ đếm ngược và Tiến độ */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Tiến độ */}
            <div className="text-right hidden sm:block">
              <div className="text-xs text-slate-400">
                Tiến độ: <span className="text-white font-bold">{answeredCount}/{totalCount} câu</span>
              </div>
              <div className="w-28 h-2 bg-slate-800 rounded-full mt-1 overflow-hidden border border-slate-700">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Đồng hồ đếm ngược */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
              isCriticalTime 
                ? 'bg-rose-950/60 border-rose-600 text-rose-300 animate-pulse shadow-lg shadow-rose-900/30'
                : isLowTime
                  ? 'bg-amber-950/50 border-amber-500 text-amber-300'
                  : 'bg-slate-800/90 border-slate-700 text-white'
            }`}>
              <Clock className={`w-4 h-4 ${isCriticalTime ? 'text-rose-400 animate-spin' : isLowTime ? 'text-amber-400' : 'text-sky-400'}`} />
              <div>
                <span className="text-[10px] block leading-none text-slate-400 uppercase tracking-wider font-semibold">
                  Thời gian còn lại
                </span>
                <span className="font-mono text-lg sm:text-xl font-bold tracking-wider">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            {/* Nút nộp bài nhanh trên bar */}
            <button
              onClick={() => setShowConfirmModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-700/20 cursor-pointer transition transform hover:-translate-y-0.5"
            >
              <Send className="w-4 h-4" />
              <span>Nộp bài</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Danh sách các câu hỏi (Main Column) */}
        <div className="lg:col-span-8 space-y-6">
          {questions.map((q, index) => {
            const isAnswered = Boolean(selectedAnswers[q.id]);
            const isFlagged = Boolean(flaggedQuestions[q.id]);
            const selectedOpt = selectedAnswers[q.id];

            return (
              <div
                key={q.id}
                ref={(el) => {
                  questionRefs.current[q.id] = el;
                }}
                className={`bg-slate-900/90 border rounded-2xl p-6 sm:p-7 shadow-xl transition-all ${
                  isAnswered 
                    ? 'border-indigo-500/40 bg-slate-900/95' 
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Question Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-sm shadow-md">
                      {index + 1}
                    </span>
                    <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                      Câu hỏi {index + 1} / {totalCount}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleFlag(q.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                      isFlagged
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                    title="Đánh dấu câu này để xem lại trước khi nộp"
                  >
                    <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-400 text-amber-400' : ''}`} />
                    <span>{isFlagged ? 'Đã gắn cờ' : 'Gắn cờ'}</span>
                  </button>
                </div>

                {/* Question Content */}
                <h3 className="text-base sm:text-lg font-semibold text-white leading-relaxed mb-6">
                  {q.question}
                </h3>

                {/* Options List (Radio Button Cards) */}
                <div className="space-y-3">
                  {q.options.map((option) => {
                    const isSelected = selectedOpt === option.key;

                    return (
                      <label
                        key={option.key}
                        onClick={() => handleSelectOption(q.id, option.key)}
                        className={`group flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-md shadow-indigo-950/50'
                            : 'bg-slate-800/50 border-slate-700/70 text-slate-300 hover:bg-slate-800 hover:border-slate-600 hover:text-slate-100'
                        }`}
                      >
                        {/* Radio visual icon */}
                        <div className="pt-0.5 shrink-0">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                            isSelected 
                              ? 'border-indigo-400 bg-indigo-600 text-white' 
                              : 'border-slate-600 bg-slate-900 group-hover:border-slate-400'
                          }`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </div>

                        {/* Option label & text */}
                        <div className="flex items-start gap-2 text-sm leading-relaxed">
                          <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs shrink-0 ${
                            isSelected 
                              ? 'bg-indigo-500 text-white' 
                              : 'bg-slate-700/80 text-slate-300 group-hover:bg-slate-700 group-hover:text-white'
                          }`}>
                            {option.key}
                          </span>
                          <span className="pt-0.5">{option.text}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Bottom Submit Action */}
          <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white">Đã hoàn thành {answeredCount}/{totalCount} câu hỏi</h4>
              <p className="text-xs text-slate-400">
                {unansweredCount > 0 
                  ? `Bạn còn ${unansweredCount} câu chưa chọn đáp án.` 
                  : 'Bạn đã chọn đủ tất cả các câu hỏi.'}
              </p>
            </div>

            <button
              onClick={() => setShowConfirmModal(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Nộp bài & Chấm điểm</span>
            </button>
          </div>
        </div>

        {/* Right Sticky Question Navigator (Bảng Điều Hướng Câu Hỏi) */}
        <div className="lg:col-span-4 sticky top-40 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
              <span>Bảng Điều Hướng Câu Hỏi</span>
              <span className="text-xs text-indigo-400 font-mono font-normal">
                {answeredCount}/{totalCount}
              </span>
            </h4>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pb-3 mb-3 border-b border-slate-800">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-indigo-600 inline-block" /> Đã làm
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700 inline-block" /> Chưa làm
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500 inline-block" /> Gắn cờ
              </span>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto p-1">
              {questions.map((q, idx) => {
                const isAnswered = Boolean(selectedAnswers[q.id]);
                const isFlagged = Boolean(flaggedQuestions[q.id]);

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => scrollToQuestion(q.id)}
                    className={`relative h-10 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                      isFlagged
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500 hover:bg-amber-500/30'
                        : isAnswered
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500'
                          : 'bg-slate-800/80 text-slate-400 border border-slate-700/60 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Action Button */}
            <button
              onClick={() => setShowConfirmModal(true)}
              className="mt-4 w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition"
            >
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span>Xem lại bài & Nộp bài</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal Trước Khi Nộp Bài */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              Xác Nhận Nộp Bài Thi?
            </h3>

            <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-4 my-4 text-xs text-slate-300 space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Họ và tên thí sinh:</span>
                <span className="font-semibold text-white">{candidate.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cấp bậc / Chức vụ:</span>
                <span className="text-amber-300 font-medium">{candidate.rank} - {candidate.position}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Đơn vị công tác:</span>
                <span className="text-slate-200 font-medium">{candidate.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Số câu đã trả lời:</span>
                <span className="font-bold text-emerald-400">{answeredCount}/{totalCount} câu</span>
              </div>
              {unansweredCount > 0 && (
                <div className="flex justify-between text-amber-400 font-semibold">
                  <span>Số câu CHƯA trả lời:</span>
                  <span>{unansweredCount} câu</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Thời gian còn lại:</span>
                <span className="font-mono text-sky-400 font-bold">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {unansweredCount > 0 && (
              <p className="text-xs text-amber-300/90 mb-5 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                ⚠️ Bạn vẫn còn {unansweredCount} câu chưa chọn đáp án. Các câu chưa làm sẽ được tính là sai.
              </p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700/80 text-xs font-semibold text-slate-300 transition"
              >
                Tiếp tục làm bài
              </button>

              <button
                type="button"
                onClick={() => handleFinalSubmit('manual')}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white shadow-lg shadow-emerald-700/20 transition cursor-pointer"
              >
                Chắc chắn nộp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
