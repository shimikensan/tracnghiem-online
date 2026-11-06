import React, { useState } from 'react';
import { UserCandidate } from '../types/quiz';
import { EXAM_DURATION_MINUTES, UAV_QUESTIONS } from '../data/uavQuestions';
import { 
  User, 
  Award, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ChevronRight, 
  ShieldAlert, 
  Plane,
  Sparkles,
  Building2
} from 'lucide-react';

interface Props {
  onStartExam: (candidate: UserCandidate) => void;
  onOpenFirebaseModal?: () => void;
  isFirebaseReady?: boolean;
  totalPoolCount?: number;
  examQuestionsCount?: number;
}

const COMMON_RANKS = [
  'Học viên',
  'Hạ sĩ',
  'Trung sĩ',
  'Thượng sĩ',
  'Thiếu úy',
  'Trung úy',
  'Thượng úy',
  'Đại úy',
  'Thiếu tá',
  'Trung tá',
  'Thượng tá',
  'Đại tá',
  'Cán bộ kỹ thuật'
];

// Chức vụ công tác chuẩn theo yêu cầu: Cán bộ, Chỉ huy Đội, Chỉ huy Phòng
const COMMON_POSITIONS = [
  'Cán bộ',
  'Chỉ huy Đội',
  'Chỉ huy Phòng'
];

// Danh sách Đơn vị công tác theo cấu trúc Phòng 7
const COMMON_UNITS = [
  'Đội 1 - Phòng 7',
  'Đội 2 - Phòng 7',
  'Đội 3 - Phòng 7',
  'Phòng 7'
];

export const WelcomeScreen: React.FC<Props> = ({ 
  onStartExam, 
  onOpenFirebaseModal, 
  isFirebaseReady,
  totalPoolCount = 50,
  examQuestionsCount = 30
}) => {
  const [fullName, setFullName] = useState('');
  const [rank, setRank] = useState('');
  const [position, setPosition] = useState('');
  const [unit, setUnit] = useState('');

  const [customRank, setCustomRank] = useState(false);
  const [customPosition, setCustomPosition] = useState(false);
  const [customUnit, setCustomUnit] = useState(false);

  const [touched, setTouched] = useState({ 
    fullName: false, 
    rank: false, 
    position: false,
    unit: false
  });

  // Nút bắt đầu CHỈ KÍCH HOẠT khi CẢ 4 TRƯỜNG ĐÃ ĐƯỢC ĐIỀN ĐỦ
  const isFormValid = 
    fullName.trim().length >= 2 && 
    rank.trim().length >= 2 && 
    position.trim().length >= 2 &&
    unit.trim().length >= 2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    onStartExam({
      fullName: fullName.trim(),
      rank: rank.trim(),
      position: position.trim(),
      unit: unit.trim()
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 animate-fade-in">
      {/* Hero Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-4 tracking-wide uppercase">
          <Plane className="w-3.5 h-3.5 text-indigo-400" />
          PHÒNG KỸ THUẬT BẢO VỆ - BỘ TƯ LỆNH CẢNH VỆ
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
          Hệ Thống Đánh Giá & Kiểm Tra Kiến Thức UAV
        </h2>
        <p className="mt-2.5 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Vui lòng khai báo đầy đủ 4 thông tin bắt buộc dưới đây để hệ thống định danh bài thi và tự động lưu điểm số sau khi hoàn thành bài thi
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Registration Form Card */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="mb-6 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-sky-400" />
              Thông Tin Thí Sinh Bắt Buộc
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Yêu cầu nhập đầy đủ 4 thông tin (<span className="text-rose-400 font-bold">*</span>) để mở khóa bài thi
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Họ và tên */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center justify-between">
                <span>1. Họ và tên thí sinh <span className="text-rose-400">*</span></span>
                {fullName.trim().length >= 2 && (
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-normal">
                    <CheckCircle className="w-3 h-3" /> Hợp lệ
                  </span>
                )}
              </label>
              <input
                type="text"
                required
                value={fullName}
                onBlur={() => setTouched(prev => ({ ...prev, fullName: true }))}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn Biên"
                className={`w-full px-4 py-2.5 bg-slate-800/90 border rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none transition ${
                  touched.fullName && fullName.trim().length < 2
                    ? 'border-rose-500/80 focus:border-rose-500'
                    : 'border-slate-700 focus:border-indigo-500'
                }`}
              />
              {touched.fullName && fullName.trim().length < 2 && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Vui lòng nhập đầy đủ họ và tên
                </p>
              )}
            </div>

            {/* 2. Cấp hàm */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                  <span>2. Cấp hàm / Cấp bậc <span className="text-rose-400">*</span></span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setCustomRank(!customRank);
                    setRank('');
                  }}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 transition"
                >
                  {customRank ? '← Chọn từ danh sách' : '✏️ Nhập cấp hàm khác'}
                </button>
              </div>

              {customRank ? (
                <input
                  type="text"
                  value={rank}
                  onBlur={() => setTouched(prev => ({ ...prev, rank: true }))}
                  onChange={(e) => setRank(e.target.value)}
                  placeholder="Nhập cấp hàm cụ thể..."
                  className="w-full px-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition"
                />
              ) : (
                <select
                  value={rank}
                  onBlur={() => setTouched(prev => ({ ...prev, rank: true }))}
                  onChange={(e) => setRank(e.target.value)}
                  className={`w-full px-4 py-2.5 bg-slate-800 border rounded-xl text-sm focus:outline-none transition ${
                    rank ? 'text-white' : 'text-slate-500'
                  } ${
                    touched.rank && !rank
                      ? 'border-rose-500/80 focus:border-rose-500'
                      : 'border-slate-700 focus:border-indigo-500'
                  }`}
                >
                  <option value="">-- Chọn cấp hàm / cấp bậc --</option>
                  {COMMON_RANKS.map((r) => (
                    <option key={r} value={r} className="bg-slate-900 text-white">
                      {r}
                    </option>
                  ))}
                </select>
              )}

              {touched.rank && rank.trim().length < 2 && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Vui lòng chọn hoặc điền cấp hàm
                </p>
              )}
            </div>

            {/* 3. Chức vụ công tác: Cán bộ, Chỉ huy Đội, Chỉ huy Phòng */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                  <span>3. Chức vụ công tác <span className="text-rose-400">*</span></span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setCustomPosition(!customPosition);
                    setPosition('');
                  }}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 transition"
                >
                  {customPosition ? '← Chọn từ 3 nhóm chuẩn' : '✏️ Nhập chức vụ khác'}
                </button>
              </div>

              {customPosition ? (
                <input
                  type="text"
                  value={position}
                  onBlur={() => setTouched(prev => ({ ...prev, position: true }))}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Nhập chức vụ cụ thể..."
                  className="w-full px-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition"
                />
              ) : (
                <div className="grid grid-cols-3 gap-2.5">
                  {COMMON_POSITIONS.map((pos) => {
                    const isSelected = position === pos;
                    return (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => {
                          setPosition(pos);
                          setTouched(prev => ({ ...prev, position: true }));
                        }}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-600/30'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600 hover:text-white'
                        }`}
                      >
                        {pos}
                      </button>
                    );
                  })}
                </div>
              )}

              {touched.position && position.trim().length < 2 && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Vui lòng chọn chức vụ (Cán bộ, Chỉ huy Đội, Chỉ huy Phòng)
                </p>
              )}
            </div>

            {/* 4. Đơn vị công tác (MỤC MỚI BỔ SUNG) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                  <span>4. Đơn vị công tác <span className="text-rose-400">*</span></span>
                  {unit.trim().length >= 2 && (
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-normal ml-2">
                      <CheckCircle className="w-3 h-3" /> Hợp lệ
                    </span>
                  )}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setCustomUnit(!customUnit);
                    setUnit('');
                  }}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 transition"
                >
                  {customUnit ? '← Chọn từ danh sách' : '✏️ Tự nhập đơn vị'}
                </button>
              </div>

              {customUnit ? (
                <input
                  type="text"
                  value={unit}
                  onBlur={() => setTouched(prev => ({ ...prev, unit: true }))}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="Ví dụ: Đội 1 - Phòng 7, Phòng 7..."
                  className="w-full px-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition"
                />
              ) : (
                <select
                  value={unit}
                  onBlur={() => setTouched(prev => ({ ...prev, unit: true }))}
                  onChange={(e) => setUnit(e.target.value)}
                  className={`w-full px-4 py-2.5 bg-slate-800 border rounded-xl text-sm focus:outline-none transition ${
                    unit ? 'text-white' : 'text-slate-500'
                  } ${
                    touched.unit && !unit
                      ? 'border-rose-500/80 focus:border-rose-500'
                      : 'border-slate-700 focus:border-indigo-500'
                  }`}
                >
                  <option value="">-- Chọn đơn vị công tác --</option>
                  {COMMON_UNITS.map((u) => (
                    <option key={u} value={u} className="bg-slate-900 text-white">
                      {u}
                    </option>
                  ))}
                </select>
              )}

              {touched.unit && unit.trim().length < 2 && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Vui lòng chọn hoặc nhập đơn vị công tác
                </p>
              )}
            </div>

            {/* Quick Fill Button for testing convenience */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => {
                  setFullName('Nguyễn Văn An');
                  setRank('Đại úy');
                  setPosition('Chỉ huy Đội');
                  setUnit('Đội UAV Trinh sát');
                }}
                className="text-xs text-slate-400 hover:text-indigo-300 flex items-center gap-1 underline underline-offset-2 transition"
              >
                <Sparkles className="w-3 h-3 text-amber-400" /> Điền nhanh thông tin mẫu
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all ${
                  isFormValid
                    ? 'bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white shadow-indigo-600/30 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-75'
                }`}
              >
                <span>Bắt đầu làm bài thi</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              {!isFormValid && (
                <p className="text-[11px] text-center text-slate-500 mt-2">
                  * Nút sẽ kích hoạt khi điền đủ 4 mục: Họ tên, Cấp hàm, Chức vụ và Đơn vị công tác
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Exam Rules & Specifications Card */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Quy Chế & Thông Tin Đề Thi
            </h4>

            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <span className="text-slate-400 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-400" />
                  Thời gian làm bài:
                </span>
                <span className="font-bold text-white text-sm">{EXAM_DURATION_MINUTES} phút</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <span className="text-slate-400 flex items-center gap-2">
                  <Plane className="w-4 h-4 text-emerald-400" />
                  Số lượng câu hỏi trong đề:
                </span>
                <div className="text-right">
                  <span className="font-bold text-white text-sm">{examQuestionsCount} câu</span>
                  {totalPoolCount > examQuestionsCount && (
                    <span className="block text-[10px] text-indigo-300 font-medium">
                      (Chọn ngẫu nhiên từ {totalPoolCount} câu)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <span className="text-slate-400 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  Hình thức câu hỏi:
                </span>
                <span className="font-semibold text-slate-200">Trắc nghiệm 4 đáp án (A, B, C, D)</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <span className="text-slate-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  Tiêu chuẩn đạt yêu cầu:
                </span>
                <span className="font-bold text-emerald-400">≥ 70% (≥ 7.0 điểm)</span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-200 leading-relaxed flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong>Cơ chế bốc đề ngẫu nhiên:</strong> Mỗi lượt thi, hệ thống sẽ tự động <strong>chọn ngẫu nhiên 30 câu hỏi</strong> từ ngân hàng {totalPoolCount} câu hỏi, bảo đảm tính công bằng và độc lập cho từng thí sinh.
              </div>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 leading-relaxed">
              <strong>Lưu ý quan trọng:</strong> Hệ thống có đồng hồ đếm ngược đúng <strong>{EXAM_DURATION_MINUTES} phút</strong>. Khi hết thời gian, bài thi sẽ <strong>tự động nộp</strong> và lưu kết quả vào Firestore ngay lập tức.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
