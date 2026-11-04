import React, { useEffect, useState } from 'react';
import { getExamResultsHistory } from '../services/firebase';
import { ExamResultRecord } from '../types/quiz';
import { X, Award, RefreshCw, Database } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<ExamResultRecord[]>([]);
  const [source, setSource] = useState<'firestore' | 'local'>('local');

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await getExamResultsHistory();
      setRecords(data.results);
      setSource(data.source);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Bảng Kết Quả Thi Trắc Nghiệm
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                  <Database className="w-3 h-3 text-indigo-400" />
                  Nguồn: {source === 'firestore' ? 'Firestore (`exam_results`)' : 'Bộ nhớ trình duyệt'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Danh sách bài thi của các cán bộ, học viên đã hoàn thành và lưu trữ
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadHistory}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Table */}
        <div className="p-6 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm">Đang tải danh sách kết quả...</p>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Award className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-base font-semibold text-slate-300">Chưa có kết quả bài thi nào</p>
              <p className="text-xs text-slate-500 mt-1">Khi thí sinh nộp bài, kết quả sẽ tự động được ghi nhận tại đây.</p>
            </div>
          ) : (
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Họ và Tên</th>
                    <th className="px-4 py-3">Cấp hàm</th>
                    <th className="px-4 py-3">Chức vụ</th>
                    <th className="px-4 py-3">Đơn vị</th>
                    <th className="px-4 py-3 text-center">Điểm số</th>
                    <th className="px-4 py-3 text-center">Đúng / Tổng</th>
                    <th className="px-4 py-3 text-center">Thời gian</th>
                    <th className="px-4 py-3 text-right">Ngày nộp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {records.map((rec, idx) => {
                    const isPass = (rec.score ?? 0) >= 7;
                    return (
                      <tr key={rec.id || idx} className="hover:bg-slate-800/30 transition">
                        <td className="px-4 py-3.5 font-medium text-white flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${isPass ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                          {rec.fullName}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60 text-[11px] font-medium text-amber-300">
                            {rec.rank}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-300">{rec.position}</td>
                        <td className="px-4 py-3 text-slate-300 font-medium text-sky-300">{rec.unit || 'N/A'}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block font-mono font-bold text-sm px-2 py-0.5 rounded ${
                            isPass 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}>
                            {typeof rec.score === 'number' ? rec.score.toFixed(1) : rec.score}/10
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-mono text-slate-200">
                            {rec.correctCount}/{rec.totalQuestions}
                          </span>
                          <span className="text-[10px] text-slate-400 block">({Math.round(rec.percentage || 0)}%)</span>
                        </td>
                        <td className="px-4 py-3 text-center font-mono text-slate-400">
                          {rec.timeSpentSeconds 
                            ? `${Math.floor(rec.timeSpentSeconds / 60)}p ${rec.timeSpentSeconds % 60}s` 
                            : '--'}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-400 text-[11px]">
                          {typeof rec.submittedAt === 'string' ? rec.submittedAt : 'Vừa xong'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
