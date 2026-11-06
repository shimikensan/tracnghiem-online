export interface Question {
  id: number;
  originalBankId?: number;
  firestoreId?: string;
  question: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
}

export interface UserCandidate {
  fullName: string;
  rank: string;
  position: string;
  unit: string; // Đơn vị công tác
}

export interface UserAnswer {
  questionId: number;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  isCorrect: boolean;
  timeSpentSeconds?: number;
}

export interface ExamResultRecord {
  id?: string;
  fullName: string; // họ tên
  rank: string;     // cấp hàm
  position: string; // chức vụ (Cán bộ, Chỉ huy Đội, Chỉ huy Phòng)
  unit: string;     // đơn vị công tác
  score: number;    // điểm số (thang điểm 10)
  score100: number; // điểm số thang 100
  correctCount: number; // số câu đúng
  wrongCount: number;   // số câu sai
  unansweredCount: number; // số câu chưa làm
  totalQuestions: number;  // tổng số câu làm bài (30 câu)
  poolTotalQuestions?: number; // tổng số câu trong ngân hàng câu hỏi
  percentage: number;      // phần trăm
  timeSpentSeconds: number; // thời gian làm bài (giây)
  submittedAt: string | Date | any; // thời gian nộp bài
  isPassed: boolean;       // đạt hay không đạt
  answersSummary?: Record<number, string>;
  answersDetail?: Record<number, { selected: string | null; correct: string; isCorrect: boolean }>;
}
