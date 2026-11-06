import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Trash2, 
  RotateCcw, 
  Lightbulb, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  CornerDownLeft
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialQuestionContext?: string;
}

const SUGGESTED_QUESTIONS = [
  'Giải thích chế độ bay Return-to-Home (RTH) và điều kiện kích hoạt an toàn',
  'Phân biệt ưu nhược điểm giữa chế độ GPS Mode và Attitude (ATTI) Mode',
  'Nguyên tắc vàng khi bảo quản, sạc và kiểm tra điện áp pin LiPo',
  'Quy trình xử lý khẩn cấp khi UAV bị mất tín hiệu điều khiển (Failsafe)',
  'Tần số 2.4GHz và 5.8GHz trong điều khiển bay khác nhau như thế nào?'
];

export const ChatbotModal: React.FC<Props> = ({ isOpen, onClose, initialQuestionContext }) => {
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Chào đồng chí! Tôi là **Trợ lý AI Hỏi/Đáp** hỗ trợ học tập và ôn luyện trắc nghiệm nghiệp vụ UAV. Đồng chí cần giải thích cặn kẽ câu hỏi ôn thi nào, hoặc cần tìm hiểu sâu về kỹ thuật bay, hãy gửi câu hỏi cho tôi ngay nhé!',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollToBottom();
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    setErrorMessage(null);
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newHistory.map(m => ({
            role: m.role,
            content: m.content
          })),
          context: initialQuestionContext || ''
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Lỗi máy chủ (${response.status})`);
      }

      const data = await response.json();
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Đã ghi nhận câu hỏi của đồng chí.',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMessage(err.message || 'Không thể kết nối đến máy chủ AI. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Đồng chí có chắc muốn xóa lịch sử cuộc trò chuyện này?')) {
      setMessages([
        {
          id: 'welcome-reset',
          role: 'assistant',
          content: 'Lịch sử cuộc trò chuyện đã được làm mới. Tôi sẵn sàng hỗ trợ đồng chí câu hỏi tiếp theo!',
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setErrorMessage(null);
    }
  };

  // Helper formatting simple Markdown (bold, lists, code)
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) {
            return <div key={idx} className="h-1.5" />;
          }

          // Bullet points
          if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
            const text = line.trim().slice(2);
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                <span>{renderInlineFormatting(text)}</span>
              </div>
            );
          }

          // Numbered list
          const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="font-bold text-indigo-400 text-xs shrink-0">{numMatch[1]}.</span>
                <span>{renderInlineFormatting(numMatch[2])}</span>
              </div>
            );
          }

          // Regular line
          return <p key={idx}>{renderInlineFormatting(line)}</p>;
        })}
      </div>
    );
  };

  const renderInlineFormatting = (text: string) => {
    // Basic bold format **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl h-[85vh] max-h-[750px] bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-900/95 backdrop-blur shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-sky-600 to-indigo-500 p-0.5 shadow-lg shadow-indigo-600/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-indigo-400">
                <Bot className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  Trợ Lý Hỏi/Đáp Học Tập
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Gemini AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Giải đáp thắc mắc, phân tích câu hỏi trắc nghiệm & kiến thức nghiệp vụ UAV
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handleClearHistory}
              className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
              title="Làm mới đoạn chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-950/50">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 items-start ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800 border border-slate-700 text-sky-400'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 shadow-sm ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1 text-[10px] opacity-70">
                    <span className="font-semibold">{isUser ? 'Đồng chí' : 'Trợ lý Gemini AI'}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  {renderFormattedContent(msg.content)}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-sky-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin text-indigo-400" />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 text-slate-400 flex items-center gap-2 text-xs">
                <div className="flex gap-1.5 items-center">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                </div>
                <span>Gemini đang suy nghĩ và tra cứu câu trả lời...</span>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => handleSendMessage()}
                className="px-2.5 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-white font-medium shrink-0 transition"
              >
                Thử lại
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Questions */}
        <div className="px-4 py-2 bg-slate-900/90 border-t border-slate-800/80 overflow-x-auto shrink-0 flex items-center gap-2 text-xs scrollbar-thin">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            Gợi ý:
          </span>
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-950/50 hover:border-indigo-600/50 border border-slate-700 text-slate-300 hover:text-indigo-300 text-[11px] whitespace-nowrap transition cursor-pointer disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 shrink-0">
          <div className="relative flex items-end gap-2 bg-slate-950 border border-slate-800 rounded-2xl p-2 focus-within:border-indigo-500/80 focus-within:ring-1 focus-within:ring-indigo-500/50 transition">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi cần giải đáp hoặc thắc mắc về nghiệp vụ UAV... (Nhấn Enter để gửi)"
              rows={1}
              className="flex-1 bg-transparent border-0 resize-none text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none px-2 py-1 max-h-28 overflow-y-auto"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isLoading}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-indigo-600/30 shrink-0 cursor-pointer"
              title="Gửi câu hỏi (Enter)"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Gửi</span>
            </button>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 px-2">
            <span>Nhấn <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Enter</kbd> để gửi, <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Shift + Enter</kbd> xuống dòng</span>
            <span>Trợ lý AI hỗ trợ ôn thi trực tuyến 24/7</span>
          </div>
        </div>
      </div>
    </div>
  );
};
