import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Khởi tạo Google GenAI SDK (chỉ chạy ở phía máy chủ)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint Chatbot AI Hỏi/Đáp phục vụ người học
app.post('/api/chat', async (req, res) => {
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

    // Thử lần lượt các model hợp lệ với cơ chế dự phòng khi có tải cao (503/429)
    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
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
        // Chờ 500ms trước khi thử model tiếp theo nếu gặp lỗi
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    if (!reply && lastError) {
      throw lastError;
    }

    return res.json({ reply: reply || 'Xin lỗi, hiện tại tôi chưa thể phản hồi. Vui lòng thử lại sau ít giây.' });
  } catch (error: any) {
    console.error('Lỗi khi gọi Gemini API:', error);
    const errorMessage = error?.message || 'Có lỗi xảy ra khi kết nối với Gemini AI';
    return res.status(500).json({ error: errorMessage });
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
