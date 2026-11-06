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
  HelpCircle,
  Sparkles,
  Volume2,
  VolumeX,
  BookOpen,
  Filter,
  Lightbulb
} from 'lucide-react';
import { playCelebrationSound, isAudioMuted, toggleAudioMuted } from '../services/sound';

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
  const [reviewFilter, setReviewFilter] = useState<'all' | 'wrong' | 'correct'>('all');
  const [isMuted, setIsMuted] = useState(isAudioMuted());
  const [saveStatus, setSaveStatus] = useState<{
    loading: boolean;
    success: boolean;
    mode?: 'firestore' | 'local';
    docId?: string;
    error?: string;
  }>({ loading: true, success: false });

  const hasSavedRef = useRef(false);
  const reviewSectionRef = useRef<HTMLDivElement>(null);
  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleOpenReview = (filter: 'all' | 'wrong' | 'correct' = 'wrong') => {
    setReviewFilter(filter);
    setShowReview(true);
    setTimeout(() => {
      reviewSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };

  const handleJumpToQuestion = (questionId: number) => {
    const el = questionRefs.current[questionId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-indigo-400');
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-indigo-400');
      }, 1500);
    }
  };

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

  // Hiệu ứng pháo hoa chúc mừng hoàn thành bài thi
  const fireFireworks = () => {
    // Đợt 1: Bắn pháo hoa trung tâm
    confetti({
      particleCount: isPassed ? 110 : 70,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#fbbf24']
    });

    // Đợt 2: Hai dàn pháo hoa bắn chéo từ hai góc trái và phải
    setTimeout(() => {
      confetti({
        particleCount: isPassed ? 85 : 50,
        angle: 60,
        spread: 65,
        origin: { x: 0.05, y: 0.75 },
        colors: ['#3b82f6', '#10b981', '#fbbf24', '#f43f5e', '#a855f7']
      });
      confetti({
        particleCount: isPassed ? 85 : 50,
        angle: 120,
        spread: 65,
        origin: { x: 0.95, y: 0.75 },
        colors: ['#8b5cf6', '#06b6d4', '#fbbf24', '#f43f5e', '#3b82f6']
      });
    }, 250);

    // Đợt 3: Mưa sao và hoa kim tuyến vàng lấp lánh trên cao
    setTimeout(() => {
      confetti({
        particleCount: isPassed ? 95 : 55,
        spread: 110,
        origin: { y: 0.35 },
        shapes: ['star', 'circle'],
        colors: ['#ffd700', '#f43f5e', '#38bdf8', '#4ade80', '#c084fc']
      });
    }, 550);
  };

  // Kích hoạt pháo hoa kết hợp âm thanh tiếng vỗ tay chúc mừng
  const fireCelebration = (forceSound = false) => {
    fireFireworks();
    if (isPassed || forceSound) {
      playCelebrationSound(score >= 8.0 ? 'high' : 'medium');
    }
  };

  // Bật/tắt âm thanh
  const handleToggleSound = () => {
    const nextMuted = toggleAudioMuted();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      // Phát thử một đoạn vỗ tay chúc mừng ngắn khi vừa bật âm thanh
      playCelebrationSound('medium');
    }
  };

  // Tự động bắn pháo hoa và phát âm thanh tiếng vỗ tay chúc mừng khi thí sinh đạt điểm cao (>= 7.0 điểm)
  useEffect(() => {
    const timer = setTimeout(() => {
      fireFireworks();
      if (isPassed) {
        playCelebrationSound(score >= 8.0 ? 'high' : 'medium');
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [isPassed, score]);

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
                <span>🎯 Đề thi {totalQuestions} câu hỏi chọn ngẫu nhiên {totalPoolCount ? `từ kho ${totalPoolCount} câu` : ''}</span>
              </div>
            </div>

            <div className={`mt-4 px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider ${gradeColor}`}>
              Xếp loại: {gradeText}
            </div>

            {isPassed && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium animate-fade-in">
                <span>👏 Đã phát tiếng vỗ tay &amp; chuông chúc mừng!</span>
                <button
                  type="button"
                  onClick={() => fireCelebration(true)}
                  className="text-white hover:text-emerald-200 underline underline-offset-2 font-semibold ml-1 cursor-pointer"
                  title="Bấm để phát lại âm thanh vỗ tay"
                >
                  (Phát lại 🔊)
                </button>
              </div>
            )}
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
            <button
              type="button"
              onClick={() => handleOpenReview('correct')}
              className="bg-emerald-950/30 hover:bg-emerald-950/60 border border-emerald-800/40 hover:border-emerald-600/70 rounded-xl p-3 text-center transition cursor-pointer group"
              title="Xem lại các câu trả lời đúng"
            >
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 group-hover:scale-105 transition-transform">
                {correctCount}
              </div>
              <div className="text-[11px] text-emerald-300/80 font-medium mt-0.5 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Số câu đúng
              </div>
              <span className="text-[10px] text-emerald-400/60 mt-0.5 block underline underline-offset-2">Lọc câu đúng</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenReview('wrong')}
              className="bg-rose-950/30 hover:bg-rose-950/60 border border-rose-800/40 hover:border-rose-600/70 rounded-xl p-3 text-center transition cursor-pointer group"
              title="Vào Chế độ ôn tập các câu sai và chưa làm"
            >
              <div className="text-xl sm:text-2xl font-bold font-mono text-rose-400 group-hover:scale-105 transition-transform">
                {wrongCount}
              </div>
              <div className="text-[11px] text-rose-300/80 font-medium mt-0.5 flex items-center justify-center gap-1">
                <XCircle className="w-3 h-3 text-rose-400" /> Số câu sai
              </div>
              <span className="text-[10px] text-rose-400/80 font-semibold mt-0.5 block underline underline-offset-2">Ôn tập câu sai 💡</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenReview('wrong')}
              className="bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/50 hover:border-slate-600 rounded-xl p-3 text-center transition cursor-pointer group"
              title="Xem các câu chưa kịp trả lời"
            >
              <div className="text-xl sm:text-2xl font-bold font-mono text-slate-300 group-hover:scale-105 transition-transform">
                {unansweredCount}
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" /> Chưa làm
              </div>
              <span className="text-[10px] text-slate-400/70 mt-0.5 block underline underline-offset-2">Xem lại</span>
            </button>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Dedicated Review Mode button */}
            <button
              type="button"
              onClick={() => handleOpenReview('wrong')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 via-rose-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-rose-950/50 transition transform hover:-translate-y-0.5 cursor-pointer ring-1 ring-white/20"
              title="Mở Chế độ ôn tập tập trung vào các câu trả lời sai kèm giải thích chi tiết"
            >
              <BookOpen className="w-4 h-4 text-amber-200" />
              <span>Chế độ ôn tập ({wrongCount + unansweredCount} câu sai)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (showReview) {
                  setShowReview(false);
                } else {
                  handleOpenReview('all');
                }
              }}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              {showReview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showReview ? 'Ẩn xem lại bài làm' : 'Xem lại toàn bộ bài làm'}</span>
            </button>

            <button
              type="button"
              onClick={() => fireCelebration(true)}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-indigo-500/20 hover:from-amber-500/30 hover:to-indigo-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs sm:text-sm flex items-center gap-2 transition transform hover:-translate-y-0.5 cursor-pointer shadow-md shadow-amber-500/10"
              title="Kích hoạt pháo hoa và tiếng vỗ tay chúc mừng"
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Pháo hoa &amp; Vỗ tay 🎉👏</span>
            </button>

            <button
              type="button"
              onClick={handleToggleSound}
              className={`px-4 py-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 transition cursor-pointer ${
                isMuted 
                  ? 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200' 
                  : 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300 hover:bg-emerald-900/40'
              }`}
              title={isMuted ? 'Bật âm thanh chúc mừng' : 'Tắt âm thanh chúc mừng'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              <span>{isMuted ? 'Âm thanh: Tắt' : 'Âm thanh: Bật'}</span>
            </button>

            <button
              type="button"
              onClick={onRetakeExam}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-2 transition"
            >
              <RotateCcw className="w-4 h-4 text-sky-400" />
              <span>Làm bài thi mới</span>
            </button>

            <button
              type="button"
              onClick={onOpenHistoryModal}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-2 transition"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Bảng điểm chung</span>
            </button>
          </div>
        </div>
      </div>

      {/* Review Mode: Chế Độ Ôn Tập & Giải Thích Chi Tiết Từng Câu Hỏi */}
      {showReview && (
        <div ref={reviewSectionRef} className="mt-10 space-y-6 animate-fade-in scroll-mt-6">
          {/* Header Card với Bộ lọc Chế độ ôn tập */}
          <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  CHẾ ĐỘ ÔN TẬP &amp; GIẢI THÍCH CHI TIẾT UAV
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  Phân Tích Đáp Án &amp; Cơ Sở Kỹ Thuật
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                  Xem lại chi tiết từng câu hỏi, đối chiếu phương án bạn đã chọn với đáp án chuẩn của hệ thống và ôn tập kiến thức chuyên môn UAV qua phần giải thích chi tiết.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-950/90 rounded-2xl border border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setReviewFilter('wrong')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                    reviewFilter === 'wrong'
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                  title="Chỉ hiển thị các câu bạn đã trả lời sai hoặc chưa kịp làm"
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-300" />
                  <span>Câu sai &amp; Chưa làm ({wrongCount + unansweredCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReviewFilter('all')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                    reviewFilter === 'all'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                  title={`Hiển thị tất cả ${totalQuestions} câu hỏi trong đề sát hạch`}
                >
                  <Filter className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Tất cả ({totalQuestions})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReviewFilter('correct')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                    reviewFilter === 'correct'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                  title="Chỉ hiển thị các câu bạn đã trả lời đúng"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Câu đúng ({correctCount})</span>
                </button>
              </div>
            </div>

            {/* Question Quick-Jump Chips Bar */}
            <div className="pt-4">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex flex-wrap items-center justify-between gap-2">
                <span>Điều hướng nhanh danh sách {totalQuestions} câu trong đề:</span>
                <span className="text-slate-500 font-normal text-[11px]">
                  🟢 Đúng ({correctCount}) &nbsp;|&nbsp; 🔴 Sai ({wrongCount}) &nbsp;|&nbsp; ⚪ Chưa làm ({unansweredCount})
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {questions.map((q, idx) => {
                  const selectedOpt = userAnswers[q.id];
                  const isUserCorrect = selectedOpt === q.correctAnswer;
                  const hasAnswered = Boolean(selectedOpt);

                  let chipStyle = 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-700';
                  if (isUserCorrect) {
                    chipStyle = 'bg-emerald-950/60 border-emerald-600/60 text-emerald-300 hover:bg-emerald-900/60';
                  } else if (hasAnswered) {
                    chipStyle = 'bg-rose-950/60 border-rose-600/60 text-rose-300 hover:bg-rose-900/60';
                  } else {
                    chipStyle = 'bg-amber-950/40 border-amber-700/50 text-amber-300 hover:bg-amber-900/40';
                  }

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => {
                        // Nếu bộ lọc hiện tại đang ẩn câu này, chuyển sang 'all' để hiện
                        if (reviewFilter === 'wrong' && isUserCorrect) {
                          setReviewFilter('all');
                        } else if (reviewFilter === 'correct' && !isUserCorrect) {
                          setReviewFilter('all');
                        }
                        setTimeout(() => handleJumpToQuestion(q.id), 60);
                      }}
                      className={`w-8 h-8 rounded-lg border text-xs font-mono font-bold flex items-center justify-center transition cursor-pointer ${chipStyle}`}
                      title={`Câu ${idx + 1}: ${isUserCorrect ? 'Đúng' : hasAnswered ? 'Sai' : 'Chưa làm'}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Danh Sách Câu Hỏi Theo Bộ Lọc */}
          {(() => {
            const filteredQuestions = questions.filter((q) => {
              const selected = userAnswers[q.id];
              const isCorrect = selected === q.correctAnswer;
              if (reviewFilter === 'wrong') {
                return !isCorrect;
              }
              if (reviewFilter === 'correct') {
                return isCorrect;
              }
              return true;
            });

            if (filteredQuestions.length === 0) {
              return (
                <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-3xl p-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4 text-emerald-400">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    Xuất Sắc! Không Có Câu Trả Lời Sai
                  </h4>
                  <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
                    Đồng chí đã trả lời chính xác 100% tất cả các câu hỏi trong đề sát hạch. Không có câu sai cần ôn tập lại.
                  </p>
                  <button
                    type="button"
                    onClick={() => setReviewFilter('all')}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 cursor-pointer"
                  >
                    Xem lại toàn bộ {totalQuestions} câu hỏi &amp; lời giải thích
                  </button>
                </div>
              );
            }

            return (
              <div className="space-y-6">
                {filteredQuestions.map((q) => {
                  const originalIdx = questions.findIndex(item => item.id === q.id);
                  const selectedOpt = userAnswers[q.id];
                  const isUserCorrect = selectedOpt === q.correctAnswer;
                  const hasAnswered = Boolean(selectedOpt);

                  return (
                    <div
                      key={q.id}
                      ref={(el) => { questionRefs.current[q.id] = el; }}
                      className={`bg-slate-900/90 border rounded-2xl p-6 sm:p-7 shadow-xl transition-all duration-300 ${
                        isUserCorrect
                          ? 'border-emerald-900/50 hover:border-emerald-700/60'
                          : 'border-rose-900/50 hover:border-rose-700/60 bg-gradient-to-b from-rose-950/10 to-transparent'
                      }`}
                    >
                      {/* Status header */}
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs font-mono shadow ${
                            isUserCorrect 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-rose-600 text-white'
                          }`}>
                            {originalIdx + 1}
                          </span>
                          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                            Câu hỏi {originalIdx + 1} / {totalQuestions}
                          </span>
                        </div>

                        <div>
                          {isUserCorrect ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Đúng
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-bold">
                              <XCircle className="w-3.5 h-3.5" /> 
                              {hasAnswered ? `Sai (Đã chọn ${selectedOpt})` : 'Chưa trả lời'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Question Title */}
                      <h4 className="text-base sm:text-lg font-semibold text-white mb-5 leading-relaxed">
                        {q.question}
                      </h4>

                      {/* Options List */}
                      <div className="space-y-3">
                        {q.options.map((opt) => {
                          const isUserChoice = selectedOpt === opt.key;
                          const isSystemCorrect = opt.key === q.correctAnswer;

                          let cardStyle = 'bg-slate-800/40 border-slate-700/60 text-slate-300';
                          let badgeStyle = 'bg-slate-700 text-slate-300';

                          if (isSystemCorrect) {
                            cardStyle = 'bg-emerald-950/50 border-emerald-500 text-white ring-1 ring-emerald-500/40 shadow-sm';
                            badgeStyle = 'bg-emerald-500 text-white font-bold';
                          } else if (isUserChoice && !isUserCorrect) {
                            cardStyle = 'bg-rose-950/40 border-rose-500 text-rose-200 ring-1 ring-rose-500/40';
                            badgeStyle = 'bg-rose-500 text-white font-bold';
                          }

                          return (
                            <div
                              key={opt.key}
                              className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border text-sm transition ${cardStyle}`}
                            >
                              <div className="flex items-start gap-3">
                                <span className={`font-mono px-2 py-0.5 rounded text-xs shrink-0 ${badgeStyle}`}>
                                  {opt.key}
                                </span>
                                <span className="pt-0.5 leading-relaxed">{opt.text}</span>
                              </div>

                              <div className="shrink-0 flex items-center gap-2">
                                {isUserChoice && (
                                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                    isUserCorrect 
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  }`}>
                                    {isUserCorrect ? '✓ Bạn đã chọn (Đúng)' : '✗ Bạn đã chọn (Sai)'}
                                  </span>
                                )}
                                {isSystemCorrect && !isUserChoice && (
                                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    ★ Đáp án đúng
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Technical Explanation Box (Cơ sở kỹ thuật & Giải thích chi tiết) */}
                      <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-500/30 text-xs text-slate-200">
                        <div className="flex items-center gap-2 mb-2 text-indigo-300 font-bold uppercase tracking-wider text-[11px]">
                          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>💡 Cơ sở kỹ thuật &amp; Hướng dẫn ôn tập:</span>
                        </div>
                        <p className="text-slate-200 leading-relaxed font-sans pl-6 border-l-2 border-indigo-500/50">
                          {q.explanation || 'Đáp án chính xác được xây dựng trên tài liệu hướng dẫn kỹ thuật vận hành và khí động học phương tiện bay không người lái (UAV).'}
                        </p>
                        <div className="mt-3 pl-6 text-[11px] text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="font-semibold text-emerald-400">
                            ✓ Đáp án chuẩn: Phương án {q.correctAnswer}
                          </span>
                          {selectedOpt && selectedOpt !== q.correctAnswer && (
                            <span className="text-rose-400 font-medium">
                              • Cần lưu ý: Tránh nhầm lẫn với phương án {selectedOpt}
                            </span>
                          )}
                          {!selectedOpt && (
                            <span className="text-amber-400 font-medium">
                              • Lưu ý: Câu hỏi này thí sinh chưa lựa chọn đáp án
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          <div className="text-center pt-6 pb-2">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition cursor-pointer"
            >
              ↑ Về đầu trang kết quả
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
