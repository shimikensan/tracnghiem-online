import React from 'react';
import { UserCandidate } from '../types/quiz';
import { isFirebaseConfigured } from '../services/firebase';
import { ShieldCheck, Database, Award, User, LayoutDashboard, Settings, Bot } from 'lucide-react';

interface Props {
  candidate: UserCandidate | null;
  isAdminActive: boolean;
  onToggleAdmin: () => void;
  onOpenFirebaseModal: () => void;
  onOpenHistoryModal: () => void;
  onOpenChatbot: () => void;
}

export const Header: React.FC<Props> = ({
  candidate,
  isAdminActive,
  onToggleAdmin,
  onOpenFirebaseModal,
  onOpenHistoryModal,
  onOpenChatbot
}) => {
  const isConfigured = isFirebaseConfigured();

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-sky-600 to-emerald-600 p-0.5 shadow-md shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-sky-400">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white">
                HỆ THỐNG THI TRẮC NGHIỆM
              </h1>
              <span className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                UAV TÁC CHIẾN
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Tác giả: Đại úy Nguyễn Văn Biên - Cán bộ P7/K01
            </p>
          </div>
        </div>

        {/* Action badges & user status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {candidate && candidate.fullName && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <div className="text-left">
                <span className="text-white font-semibold">{candidate.fullName}</span>
                <span className="text-slate-400 text-[11px] ml-1.5">
                  ({candidate.rank} • {candidate.position} • {candidate.unit})
                </span>
              </div>
            </div>
          )}

          {/* Nút Hỏi/Đáp Chatbot AI phục vụ người học */}
          <button
            onClick={onOpenChatbot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition shadow-sm text-sky-300 hover:text-white bg-sky-950/60 hover:bg-sky-900/80 border-sky-700/60 shadow-sky-950/20 cursor-pointer"
            title="Trợ lý Gemini AI hỏi/đáp và giải thích câu hỏi ôn thi"
          >
            <Bot className="w-3.5 h-3.5 text-sky-400" />
            <span>Hỏi/Đáp</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse hidden sm:inline-block" />
          </button>

          {/* Admin Management button */}
          <button
            onClick={onToggleAdmin}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition shadow-sm ${
              isAdminActive
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-indigo-600/30'
                : 'text-indigo-300 hover:text-white bg-indigo-950/50 hover:bg-indigo-900/60 border-indigo-700/60'
            }`}
            title="Trang quản lý câu hỏi & kết quả"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>{isAdminActive ? 'Thoát Quản Trị' : 'Quản Lý'}</span>
          </button>

          {/* History button */}
          <button
            onClick={onOpenHistoryModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition shadow-sm"
            title="Xem danh sách điểm thi đã lưu"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Bảng Điểm Thi</span>
          </button>

          {/* Firebase config indicator button - CHỈ XUẤT HIỆN KHI ĐÃ ĐĂNG NHẬP PHẦN QUẢN LÝ */}
          {isAdminActive && (
            <button
              onClick={onOpenFirebaseModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition shadow-sm ${
                isConfigured
                  ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/40'
                  : 'bg-amber-950/30 border-amber-700/50 text-amber-300 hover:bg-amber-900/40'
              }`}
              title="Cài đặt Firebase Firestore"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isConfigured ? 'Firebase: Đã nối' : 'Firebase Config'}
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
