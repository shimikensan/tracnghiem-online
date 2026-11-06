import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();

// Phân tích tham số --port từ dòng lệnh (nếu có do dev server truyền vào) hoặc biến PORT
const args = process.argv.slice(2);
const portIndex = args.indexOf('--port');
const cliPort = portIndex !== -1 && args[portIndex + 1] ? Number(args[portIndex + 1]) : null;
const PORT = cliPort || (process.env.NODE_ENV === 'production' ? (Number(process.env.PORT) || 3000) : 3000);

// Middleware xử lý CORS và JSON
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json());

// Endpoint kiểm tra trạng thái máy chủ AI
app.get(['/api/chat', '/api/chat/health'], (_req, res) => {
  res.json({ status: 'ok', service: 'Gemini Chatbot API', model: 'gemini-3.8-flash' });
});

// Khởi tạo Google GenAI SDK (chỉ chạy ở phía máy chủ)
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY;
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint Chatbot AI Hỏi/Đáp phục vụ người học
app.post(['/api/chat', '/api/chat/'], async (req, res) => {
  try {
    const { messages, context } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Danh sách tin nhắn không hợp lệ' });
    }

    const systemInstruction = `Bạn là Trợ lý AI Hỏi/Đáp Chuyên Nghiệp (Gemini 3.8 Flash) phục vụ đào tạo và ôn thi trắc nghiệm nghiệp vụ chuyên ngành UAV (thiết bị bay không người lái), điều lệnh và kỹ thuật tác chiến.

Nhiệm vụ trọng tâm:
1. Giải đáp tường minh, khoa học các thắc mắc về câu hỏi trắc nghiệm, giải thích cặn kẽ tại sao đáp án này đúng, các phương án khác sai hoặc chưa đầy đủ.
2. Cung cấp kiến thức chuyên sâu về kỹ thuật bay, an toàn hàng không, nguyên lý điều khiển, cơ chế hoạt động của các chế độ bay (GPS Mode, Attitude, Return-to-Home, Failsafe), khí động học quadcopter/fixed-wing, cảm biến IMU, gimbal, camera quang điện tử hồng ngoại, pin LiPo và bảo đảm an toàn thao tác.
3. Luôn giữ tác phong chuẩn mực, nghiêm túc, nhiệt tình, lịch sự, tôn trọng người học.
4. Trả lời bằng tiếng Việt chuẩn, sử dụng định dạng Markdown trực quan (in đậm ý chính, phân chia gạch đầu dòng rõ ràng, dễ tiếp thu).
5. Khuyến khích người học đặt thêm câu hỏi để củng cố vững chắc kiến thức.
${context ? `\nNgữ cảnh tham chiếu từ bài thi/học tập hiện tại:\n${context}` : ''}`;

    const contents = messages.map((m: { role: 'user' | 'model' | 'assistant'; content: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // Thử lần lượt các model được hỗ trợ chính thức và ổn định nhất
    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
    let reply = '';
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
          },
        });
        if (response.text) {
          reply = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Lỗi khi gọi model ${model}:`, err?.message || err);
        lastError = err;
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    if (!reply && lastError) {
      return res.status(500).json({ 
        error: 'Máy chủ AI đang bận hoặc lưu lượng cao. Đồng chí vui lòng bấm "Thử lại" sau ít giây.' 
      });
    }

    return res.json({ reply: reply || 'Xin lỗi, hiện tại tôi chưa thể phản hồi. Vui lòng thử lại sau ít giây.' });
  } catch (error: any) {
    console.error('Lỗi khi gọi Gemini API:', error);
    return res.status(500).json({ 
      error: 'Máy chủ AI đang đồng bộ dữ liệu. Đồng chí vui lòng bấm "Thử lại".' 
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
