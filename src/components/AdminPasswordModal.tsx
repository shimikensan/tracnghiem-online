import React, { useState, useEffect, useRef } from 'react';
import { verifyAdminPassword, DEFAULT_ADMIN_PASSWORD } from '../services/auth';
import { Lock, KeyRound, Eye, EyeOff, ShieldAlert, CheckCircle2, X, AlertCircle, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPasswordModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setErrorMessage('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMessage('Vui lòng nhập mật khẩu quản trị');
      return;
    }

    const isValid = verifyAdminPassword(password);
    if (isValid) {
      setErrorMessage('');
      onSuccess();
    } else {
      setErrorMessage('Mật khẩu không chính xác. Vui lòng thử lại!');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setPassword('');
      inputRef.current?.focus();
    }
  };

  const handleQuickFillDefault = () => {
    setPassword(DEFAULT_ADMIN_PASSWORD);
    setErrorMessage('');
    inputRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className={`relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden transition-all ${
          isShaking ? 'animate-bounce-short ring-2 ring-rose-500' : ''
        }`}
      >
        {/* Glow Header */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                Xác Thực Quản Trị Viên
              </h3>
              <p className="text-[11px] text-slate-400">
                Khu vực bảo mật quản lý câu hỏi & kết quả
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs relative z-10">
          <div className="p-3 bg-indigo-950/30 border border-indigo-800/40 rounded-xl text-indigo-200 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              Mục này dành riêng cho Ban Chỉ huy và Cán bộ quản lý đề thi. Vui lòng nhập mật khẩu để tiếp tục.
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              Mật khẩu quản trị <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Nhập mật khẩu quản trị..."
                className={`w-full pl-4 pr-10 py-2.5 bg-slate-800/90 border rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none transition ${
                  errorMessage
                    ? 'border-rose-500 focus:border-rose-500 bg-rose-950/20'
                    : 'border-slate-700 focus:border-indigo-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMessage && (
              <p className="text-[11px] text-rose-400 mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errorMessage}
              </p>
            )}
          </div>

          {/* Quick Default Password Hint */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-300">
            <span>
              Mật khẩu mặc định: <code className="text-amber-300 font-mono font-bold bg-slate-900 px-1.5 py-0.5 rounded">{DEFAULT_ADMIN_PASSWORD}</code>
            </span>
            <button
              type="button"
              onClick={handleQuickFillDefault}
              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 underline underline-offset-2"
            >
              <Sparkles className="w-3 h-3 text-amber-400" /> Điền nhanh
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800 rounded-xl transition"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Đăng nhập Quản Trị</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
