/**
 * Service phát âm thanh chúc mừng & tiếng vỗ tay (Celebratory Applause & Victory Fanfare)
 * Sử dụng Web Audio API chuẩn trình duyệt, hoạt động ngoại tuyến 100%, không bị lỗi CORS/mạng.
 */

let audioCtx: AudioContext | null = null;
let isMutedState = false;

// Khởi tạo AudioContext an toàn
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isAudioMuted(): boolean {
  return isMutedState;
}

export function setAudioMuted(muted: boolean): void {
  isMutedState = muted;
}

export function toggleAudioMuted(): boolean {
  isMutedState = !isMutedState;
  return isMutedState;
}

/**
 * Phát tiếng vỗ tay đám đông (Crowd Applause) mô phỏng bằng bộ lọc nhiễu âm thanh Web Audio
 * Tạo hàng trăm xung nhịp vỗ tay ngẫu nhiên với âm sắc trầm ấm và độ vang tự nhiên.
 */
function createApplauseClap(ctx: AudioContext, time: number, pan: number, gainValue: number) {
  // Tạo buffer nhiễu trắng cho 1 nhịp vỗ tay (~40ms)
  const bufferSize = Math.floor(ctx.sampleRate * 0.05);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.012));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  // Bộ lọc băng thông để tạo âm thanh vỗ tay của lòng bàn tay (800Hz - 2200Hz)
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(900 + Math.random() * 600, time);
  filter.Q.setValueAtTime(2.5, time);

  // Gain envelope
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(gainValue * (0.6 + Math.random() * 0.5), time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.045);

  // Stereo Panner nếu trình duyệt hỗ trợ
  if (ctx.createStereoPanner) {
    const panner = ctx.createStereoPanner();
    panner.pan.setValueAtTime(pan, time);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(panner);
    panner.connect(ctx.destination);
  } else {
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
  }

  noise.start(time);
  noise.stop(time + 0.05);
}

/**
 * Phát hợp âm chuông chiến thắng (Victory Chime) rộn ràng
 */
function playVictoryChimes(ctx: AudioContext, startTime: number) {
  // Giai điệu chiến thắng: Đô 5 (523Hz), Mi 5 (659Hz), Sol 5 (784Hz), Đô 6 (1046Hz)
  const notes = [
    { freq: 523.25, time: startTime + 0.0, dur: 0.35, gain: 0.15 },
    { freq: 659.25, time: startTime + 0.15, dur: 0.35, gain: 0.18 },
    { freq: 783.99, time: startTime + 0.3, dur: 0.45, gain: 0.22 },
    { freq: 1046.50, time: startTime + 0.5, dur: 1.2, gain: 0.28 }
  ];

  notes.forEach(({ freq, time, dur, gain: noteGain }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(noteGain, time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + dur + 0.1);
  });
}

/**
 * Hàm chính phát hiệu ứng chúc mừng (tiếng vỗ tay giòn giã + chuông chiến thắng)
 * @param intensity Mức độ nhiệt liệt ('high' cho Giỏi/Xuất sắc, 'medium' cho Đạt)
 */
export function playCelebrationSound(intensity: 'high' | 'medium' = 'high'): void {
  if (isMutedState) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const duration = intensity === 'high' ? 3.5 : 2.5;
    const totalClaps = intensity === 'high' ? 180 : 100;

    // 1. Phát giai điệu chiến thắng nhẹ nhàng mở đầu
    playVictoryChimes(ctx, now);

    // 2. Phát chuỗi tiếng vỗ tay đám đông (Crowd Clapping) kéo dài 2.5 - 3.5 giây
    for (let i = 0; i < totalClaps; i++) {
      // Phân phối thời gian tự nhiên: dồn dập ở giây thứ 0.3 - 2.0, sau đó nhỏ dần
      const progress = i / totalClaps;
      const clapTime = now + 0.15 + progress * duration + (Math.random() - 0.5) * 0.15;
      const pan = (Math.random() * 2 - 1) * 0.8; // Trải rộng 2 loa trái/phải
      
      // Âm lượng tăng dần rồi nhỏ dần theo đường cong vòm
      const volumeCurve = Math.sin(progress * Math.PI);
      const gain = 0.25 * volumeCurve;

      createApplauseClap(ctx, Math.max(now, clapTime), pan, gain);
    }
  } catch (err) {
    console.warn('Lỗi khi phát âm thanh vỗ tay:', err);
  }
}
