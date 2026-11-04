import { Question } from '../types/quiz';

/**
 * =========================================================================================
 * 📌 HƯỚNG DẪN THAY THẾ BỘ CÂU HỎI UAV:
 * 
 * Đề thi hiện tại gồm 20 CÂU HỎI TRẮC NGHIỆM 3 ĐÁP ÁN (A, B, C) - THỜI GIAN 20 PHÚT.
 * Bạn có thể thay thế hoặc mở rộng thành bộ 100 câu hỏi UAV bằng cách dán vào mảng `UAV_QUESTIONS` bên dưới.
 * 
 * Cấu trúc mỗi câu hỏi:
 * - id: Số thứ tự câu (1, 2, ..., 20)
 * - question: Nội dung câu hỏi trắc nghiệm
 * - options: 3 đáp án (A, B, C)
 * - correctAnswer: Đáp án đúng ('A', 'B', hoặc 'C')
 * - explanation: Giải thích chi tiết đáp án
 * =========================================================================================
 */

export const UAV_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "UAV là từ viết tắt của thuật ngữ tiếng Anh nào sau đây?",
    options: [
      { key: "A", text: "Unmanned Aerial Vehicle" },
      { key: "B", text: "Universal Aviation Vehicle" },
      { key: "C", text: "United Airborne Vector" },
    ],
    correctAnswer: "A",
    explanation: "UAV là viết tắt của 'Unmanned Aerial Vehicle' (Phương tiện bay không người lái)."
  },
  {
    id: 2,
    question: "Trong cấu trúc cơ bản của một hệ thống UAV, trạm điều khiển mặt đất thường được viết tắt là gì?",
    options: [
      { key: "A", text: "GCS (Ground Control Station)" },
      { key: "B", text: "FCS (Flight Control System)" },
      { key: "C", text: "IMU (Inertial Measurement Unit)" },
    ],
    correctAnswer: "A",
    explanation: "GCS (Ground Control Station) là trạm điều khiển mặt đất tiếp nhận dữ liệu telemetry và gửi lệnh điều khiển tới UAV."
  },
  {
    id: 3,
    question: "Hệ thống định vị nào thường được tích hợp trên UAV để duy trì vị trí và tự động quay về điểm xuất phát (RTH - Return To Home)?",
    options: [
      { key: "A", text: "Hệ thống vệ tinh dẫn đường GNSS (GPS, GLONASS, BeiDou)" },
      { key: "B", text: "Hệ thống sonar siêu âm tầm ngắn dưới 3 mét" },
      { key: "C", text: "Hệ thống la bàn cơ khí truyền thống" },
    ],
    correctAnswer: "A",
    explanation: "Hệ thống GNSS (GPS, GLONASS, v.v.) cung cấp tọa độ địa lý chính xác giúp UAV định vị không gian và tự động quay về an toàn."
  },
  {
    id: 4,
    question: "Khi bay trong điều kiện gió mạnh vượt quá giới hạn thiết kế, hiện tượng nào dễ xảy ra nhất đối với UAV?",
    options: [
      { key: "A", text: "Tự động tăng tốc độ bay tối đa và triệt tiêu sức cản" },
      { key: "B", text: "Mất ổn định luồng khí khí động học và nguy cơ mất kiểm soát hướng bay" },
      { key: "C", text: "Pin phát nổ do tốc độ gió làm lạnh quá mức" },
    ],
    correctAnswer: "B",
    explanation: "Gió vượt ngưỡng cho phép gây nhiễu động dòng khí trên cánh và cánh quạt, dẫn đến mất cân bằng và nguy cơ mất kiểm soát."
  },
  {
    id: 5,
    question: "Cảm biến IMU (Inertial Measurement Unit) trên UAV có chức năng chính là gì?",
    options: [
      { key: "A", text: "Đo gia tốc, vận tốc góc và xác định tư thế bay (Roll, Pitch, Yaw)" },
      { key: "B", text: "Truyền hình ảnh độ phân giải cao về trung tâm chỉ huy" },
      { key: "C", text: "Đo nhiệt độ của bình ắc quy trong suốt quá trình bay" },
    ],
    correctAnswer: "A",
    explanation: "Khối cảm biến quán tính IMU bao gồm con quay hồi chuyển (gyroscope) và gia tốc kế (accelerometer) giúp xác định tư thế không gian của UAV."
  },
  {
    id: 6,
    question: "Tính năng Fail-Safe trên phần mềm điều khiển bay UAV thường được kích hoạt trong tình huống nào?",
    options: [
      { key: "A", text: "Khi phát hiện mất tín hiệu điều khiển RC hoặc pin dưới ngưỡng an toàn" },
      { key: "B", text: "Khi nhiệt độ môi trường đạt mức 25 độ C lý tưởng" },
      { key: "C", text: "Khi tốc độ bay đạt ngưỡng tối thiểu" },
    ],
    correctAnswer: "A",
    explanation: "Tính năng an toàn dự phòng Fail-Safe tự động xử lý khi mất sóng liên lạc hoặc pin yếu để bảo vệ phương tiện và an toàn mặt đất."
  },
  {
    id: 7,
    question: "Loại pin nào hiện nay được sử dụng phổ biến nhất trên các dòng máy bay không người lái đa cánh (Multicopter) nhờ mật độ năng lượng cao?",
    options: [
      { key: "A", text: "Pin Lithium Polymer (LiPo)" },
      { key: "B", text: "Pin khô chì - axit (Lead-acid)" },
      { key: "C", text: "Pin kiềm Alkaline một lần" },
    ],
    correctAnswer: "A",
    explanation: "Pin LiPo có tỷ lệ năng lượng trên trọng lượng cao và khả năng phóng dòng điện lớn tức thời, rất thích hợp cho động cơ UAV."
  },
  {
    id: 8,
    question: "Dải tần số vô tuyến phổ biến nhất thường dùng cho đường truyền điều khiển và hình ảnh UAV là gì?",
    options: [
      { key: "A", text: "2.4 GHz và 5.8 GHz" },
      { key: "B", text: "VHF 100 kHz đến 200 kHz" },
      { key: "C", text: "Sóng ngắn AM 540 kHz" },
    ],
    correctAnswer: "A",
    explanation: "2.4 GHz (điều khiển khoảng cách xa) và 5.8 GHz (truyền tải hình ảnh FPV băng thông cao) là các băng tần tiêu chuẩn."
  },
  {
    id: 9,
    question: "Tải trọng quang điện tử (Payload) phổ biến nhất gắn trên UAV trinh sát, quan sát hiện đại gồm các thành phần nào?",
    options: [
      { key: "A", text: "Cụm camera zoom quang học kết hợp cảm biến nhiệt hồng ngoại và Gimbal ổn định 3 trục" },
      { key: "B", text: "Loa phóng thanh công suất lớn và đèn led trang trí" },
      { key: "C", text: "Hệ thống gầu xúc mẫu đất và máy nghiền đá tự động" },
    ],
    correctAnswer: "A",
    explanation: "Gimbal 3 trục giữ ổn định hình ảnh, kết hợp camera ánh sáng ngày và camera nhiệt hồng ngoại giúp quan sát cả ngày lẫn đêm."
  },
  {
    id: 10,
    question: "Trước khi thực hiện chuyến bay huấn luyện hoặc làm nhiệm vụ, bước kiểm tra nào sau đây là BẮT BUỘC (Pre-flight check)?",
    options: [
      { key: "A", text: "Kiểm tra cơ khí cánh quạt, dung lượng pin, la bàn từ tính, vệ tinh GPS và cài đặt độ cao RTH an toàn" },
      { key: "B", text: "Sơn lại toàn bộ thân vỏ và rửa động cơ bằng xà phòng ướt" },
      { key: "C", text: "Tắt toàn bộ hệ thống định vị và bay bằng trực giác" },
    ],
    correctAnswer: "A",
    explanation: "Quy trình kiểm tra an toàn trước chuyến bay (Pre-flight checklist) đảm bảo tất cả phần cứng, phần mềm và thông số cứu hộ hoạt động chuẩn xác."
  },
  {
    id: 11,
    question: "Độ cao RTH (Return To Home) cần được thiết lập như thế nào trước khi cất cánh làm nhiệm vụ?",
    options: [
      { key: "A", text: "Cao hơn chướng ngại vật cao nhất trong khu vực hoạt động bay ít nhất 15-20 mét" },
      { key: "B", text: "Luôn đặt cố định ở độ cao 5 mét so với mặt đất" },
      { key: "C", text: "Không cần thiết lập vì UAV tự động xuyên qua mọi chướng ngại vật" },
    ],
    correctAnswer: "A",
    explanation: "Độ cao quay về RTH phải cao hơn cây cối, tòa nhà hoặc cột điện cao nhất trong khu vực để tránh va chạm khi mất sóng tự bay về."
  },
  {
    id: 12,
    question: "Hiện tượng 'Jello effect' (rung giật hình ảnh dạng gợn sóng) trong video truyền về từ UAV thường do nguyên nhân nào?",
    options: [
      { key: "A", text: "Rung chấn tần số cao từ động cơ hoặc cánh quạt chưa cân bằng động truyền sang cụm camera" },
      { key: "B", text: "Tín hiệu sóng GPS quá mạnh làm lóa mắt cảm biến camera" },
      { key: "C", text: "Dung lượng thẻ nhớ máy bay còn quá nhiều chỗ trống" },
    ],
    correctAnswer: "A",
    explanation: "Rung chấn cơ khí tần số cao từ cánh quạt cong vênh hoặc đệm cao su giảm chấn gimbal bị chai cứng gây hiện tượng màn trập cuộn Jello."
  },
  {
    id: 13,
    question: "Bộ điều tốc điện tử ESC (Electronic Speed Controller) trên máy bay không người lái có chức năng gì?",
    options: [
      { key: "A", text: "Điều chỉnh tốc độ quay và hướng quay của động cơ không chổi than theo tín hiệu từ bộ điều khiển bay" },
      { key: "B", text: "Thu nhận tín hiệu định vị vệ tinh GPS và GLONASS" },
      { key: "C", text: "Ghi âm giọng nói của phi công tại trạm mặt đất" },
    ],
    correctAnswer: "A",
    explanation: "ESC (Electronic Speed Controller) chuyển đổi điện một chiều từ pin thành dòng điện 3 pha điều khiển tốc độ vòng quay động cơ BLDC."
  },
  {
    id: 14,
    question: "Trong chế độ bay ATTI (Attitude Mode), hệ thống nào trên UAV KHÔNG can thiệp giữ vị trí?",
    options: [
      { key: "A", text: "Hệ thống định vị vệ tinh GPS (UAV chỉ giữ thăng bằng độ nghiêng và độ cao, sẽ bị trôi theo chiều gió)" },
      { key: "B", text: "Cảm biến gia tốc con quay hồi chuyển IMU" },
      { key: "C", text: "Hệ thống cấp nguồn điện từ pin" },
    ],
    correctAnswer: "A",
    explanation: "Ở chế độ ATTI mode, GPS không can thiệp giữ tọa độ; UAV sẽ trôi tự do theo hướng gió nếu phi công không chủ động bù lái."
  },
  {
    id: 15,
    question: "Khu vực cấm bay (No-Fly Zone) đối với tàu bay không người lái theo quy định hiện hành bao gồm khu vực nào sau đây?",
    options: [
      { key: "A", text: "Khu vực doanh trại quân đội, cơ quan đầu não, sân bay dân sự và căn cứ quân sự bảo vệ mục tiêu trọng yếu" },
      { key: "B", text: "Các cánh đồng lúa và bãi đất trống ở ngoại thành xa khu dân cư" },
      { key: "C", text: "Bề mặt hồ nước công cộng không có người qua lại" },
    ],
    correctAnswer: "A",
    explanation: "Khu vực quân sự, công trình an ninh quốc gia và phễu bay tĩnh không sân bay là khu vực cấm bay nghiêm ngặt theo quy định pháp luật."
  },
  {
    id: 16,
    question: "Khi thực hiện hiệu chuẩn la bàn từ tính (Compass Calibration) cho UAV, thao tác nào sau đây là ĐÚNG?",
    options: [
      { key: "A", text: "Thực hiện ở không gian thoáng đãng, cách xa kết cấu sắt thép lớn, trạm biến áp và đường dây điện cao thế" },
      { key: "B", text: "Đặt máy bay cạnh một khối nam châm vĩnh cửu để tăng độ nhạy từ trường" },
      { key: "C", text: "Hiệu chuẩn ngay bên trong cabin xe ô tô bọc kim loại kín" },
    ],
    correctAnswer: "A",
    explanation: "La bàn từ tính rất nhạy cảm với kim loại và từ trường nhân tạo, do đó phải hiệu chuẩn tại nơi thoáng đãng không có dị vật sắt thép."
  },
  {
    id: 17,
    question: "Khái niệm BVLOS trong điều khiển và tác chiến UAV có nghĩa là gì?",
    options: [
      { key: "A", text: "Bay ngoài tầm nhìn trực quan của người điều khiển (Beyond Visual Line of Sight)" },
      { key: "B", text: "Bay tự do không cần người quan sát và không cần trạm điều khiển" },
      { key: "C", text: "Bay ở độ cao tuyệt đối sát mặt đất dưới 1 mét" },
    ],
    correctAnswer: "A",
    explanation: "BVLOS (Beyond Visual Line of Sight) là phương thức bay tầm xa vượt khỏi tầm quan sát mắt thường của kíp điều khiển mặt đất."
  },
  {
    id: 18,
    question: "Cảm biến đo độ cao bằng sóng Lidar hoặc Sonar gắn dưới bụng UAV thường phát huy hiệu quả tối đa trong tình huống nào?",
    options: [
      { key: "A", text: "Hỗ trợ hạ cánh chính xác và bay bám địa hình tầm thấp dưới 10-20 mét" },
      { key: "B", text: "Đo khoảng cách tới các vệ tinh viễn thông quỹ đạo địa tĩnh" },
      { key: "C", text: "Thay thế hoàn toàn động cơ đẩy khi bay ở độ cao 1.000 mét" },
    ],
    correctAnswer: "A",
    explanation: "Cảm biến sóng quang học/siêu âm tầm gần giúp máy bay đo cự ly chính xác tới mặt đất trong pha hạ cánh và tránh va đập địa hình."
  },
  {
    id: 19,
    question: "Khi phát hiện pin UAV bị phồng rộp hoặc nhiệt độ tăng cao bất thường sau chuyến bay, biện pháp xử lý an toàn nhất là gì?",
    options: [
      { key: "A", text: "Lập tức ngừng sử dụng, cách ly trong hộp chống cháy chuyên dụng và tuyệt đối không cắm sạc tiếp" },
      { key: "B", text: "Dùng kim chọc thủng lớp vỏ bọc để xả hơi nóng bên trong ra ngoài" },
      { key: "C", text: "Cắm sạc xả dòng điện cực đại để ép phẳng bề mặt pin" },
    ],
    correctAnswer: "A",
    explanation: "Pin LiPo phồng rộp tiềm ẩn nguy cơ phản ứng nhiệt gây nổ cháy dữ dội; phải cách ly trong túi/thùng chống cháy và loại bỏ đúng kỹ thuật."
  },
  {
    id: 20,
    question: "Tài liệu nào sau đây người chỉ huy và kíp bay UAV BẮT BUỘC phải hoàn thành và lưu trữ sau mỗi ca bay làm nhiệm vụ?",
    options: [
      { key: "A", text: "Nhật ký hành trình chuyến bay (Flight Log: thời gian, tọa độ, thông số kỹ thuật và tình trạng thiết bị)" },
      { key: "B", text: "Bản vẽ thiết kế lại toàn bộ bo mạch điện tử của máy bay" },
      { key: "C", text: "Hợp đồng mua sắm linh kiện bảo trì mới" },
    ],
    correctAnswer: "A",
    explanation: "Nhật ký bay ghi lại lịch sử hoạt động, giờ bay của từng cụm pin, động cơ và nhật ký lỗi nhằm bảo đảm an toàn kỹ thuật hàng không."
  }
];

// Thời gian thi chuẩn: 20 phút (= 1200 giây)
export const EXAM_DURATION_MINUTES = 20;
