import { Question } from '../types/quiz';

/**
 * =========================================================================================
 * 📌 HỆ THỐNG NGÂN HÀNG CÂU HỎI TRẮC NGHIỆM UAV (50 CÂU HỎI CHUẨN)
 * 
 * - Mỗi câu hỏi có 3 đáp án: A, B, C và 1 đáp án đúng duy nhất.
 * - Hệ thống sẽ tự động CHỌN NGẪU NHIÊN 20 CÂU HỎI trong tổng số câu hỏi của ngân hàng
 *   (hoặc từ Firebase Firestore nếu quản trị viên đã đồng bộ / nhập thêm).
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
  },
  {
    id: 21,
    question: "Ưu điểm nổi bật nhất của dòng UAV cánh bằng (Fixed-wing) so với dòng UAV đa cánh quạt (Multicopter) là gì?",
    options: [
      { key: "A", text: "Thời gian hoạt động trên không lâu hơn và tầm bay tác chiến xa hơn đáng kể" },
      { key: "B", text: "Khả năng đứng yên lơ lửng tại một điểm chính xác trong không gian" },
      { key: "C", text: "Không cần đường băng hoặc bãi phóng khi cất/hạ cánh" },
    ],
    correctAnswer: "A",
    explanation: "Nhờ nguyên lý lực nâng khí động học từ cánh tĩnh, UAV cánh bằng tiết kiệm năng lượng hơn rất nhiều so với việc phải liên tục quay cánh quạt nâng."
  },
  {
    id: 22,
    question: "Dòng UAV VTOL (Vertical Take-Off and Landing) kết hợp những ưu điểm gì giữa hai cấu hình cánh bằng và đa cánh quạt?",
    options: [
      { key: "A", text: "Cất/hạ cánh thẳng đứng không cần đường băng và bay hành trình tầm xa với tốc độ cao" },
      { key: "B", text: "Không cần sử dụng động cơ đẩy và không cần pin tích trữ năng lượng" },
      { key: "C", text: "Chỉ hoạt động được trong môi trường chân không ngoài khí quyển" },
    ],
    correctAnswer: "A",
    explanation: "UAV VTOL sử dụng động cơ nâng thẳng đứng khi cất/hạ cánh, sau đó chuyển sang động cơ đẩy ngang để bay như máy bay cánh bằng truyền thống."
  },
  {
    id: 23,
    question: "Hiệu ứng mặt đất (Ground Effect) tác động như thế nào khi UAV hạ cánh ở độ cao rất sát mặt đất?",
    options: [
      { key: "A", text: "Tạo ra một đệm không khí làm tăng lực nâng, khiến UAV có xu hướng bồng bềnh khó tiếp đất" },
      { key: "B", text: "Hút mạnh UAV đập xuống đất do áp suất chân không" },
      { key: "C", text: "Làm động cơ quay ngược chiều ngay tức thì" },
    ],
    correctAnswer: "A",
    explanation: "Khi cách mặt đất khoảng cách nhỏ hơn đường kính cánh quạt, luồng khí dội ngược tạo thành đệm khí làm tăng lực nâng (Ground Effect)."
  },
  {
    id: 24,
    question: "Chỉ số C-Rating (ví dụ 30C, 50C) trên thông số kỹ thuật pin LiPo của UAV thể hiện điều gì?",
    options: [
      { key: "A", text: "Khả năng xả dòng điện cực đại an toàn của pin so với dung lượng danh định" },
      { key: "B", text: "Số lượng chu kỳ sạc pin tối đa trước khi vứt bỏ" },
      { key: "C", text: "Nhiệt độ nóng chảy tính bằng độ C của vỏ pin" },
    ],
    correctAnswer: "A",
    explanation: "C-Rating là chỉ số tốc độ xả dòng điện cực đại (ví dụ pin 5000mAh xả 30C cho dòng phóng tối đa 150 Ampe)."
  },
  {
    id: 25,
    question: "Khi UAV mất tín hiệu định vị vệ tinh GNSS/GPS đột ngột trong khi đang bay, phi công cần phản ứng như thế nào?",
    options: [
      { key: "A", text: "Chuyển sang chế độ lái thủ công (Manual/ATTI), quan sát hướng bay và chủ động điều khiển đưa máy bay về" },
      { key: "B", text: "Buông tay điều khiển và bấm phím tắt nguồn trạm mặt đất ngay" },
      { key: "C", text: "Gạt cần ga hết cỡ lên tối đa để bay lên tầng bình lưu" },
    ],
    correctAnswer: "A",
    explanation: "Khi mất GNSS, UAV sẽ trôi tự do theo quán tính và gió; phi công phải có kỹ năng lái ATTI/Manual để giữ thăng bằng và lái về an toàn."
  },
  {
    id: 26,
    question: "Động cơ điện không chổi than (BLDC - Brushless Motor) trên UAV có ưu thế vượt trội nào so với động cơ có chổi than truyền thống?",
    options: [
      { key: "A", text: "Hiệu suất cao, độ bền vượt trội, tỏa nhiệt ít và không bị mài mòn chổi than cơ học" },
      { key: "B", text: "Tự tạo ra dòng điện xoay chiều mà không cần pin nuôi nguồn" },
      { key: "C", text: "Trọng lượng nặng hơn gấp 10 lần giúp máy bay đầm gió hơn" },
    ],
    correctAnswer: "A",
    explanation: "Động cơ BLDC dùng từ trường nam châm vĩnh cửu và chuyển mạch điện tử bằng ESC nên không ma sát cơ khí, cho độ tin cậy rất cao."
  },
  {
    id: 27,
    question: "Dữ liệu Telemetry truyền từ UAV về trạm mặt đất GCS trong thời gian thực thường KHÔNG bao gồm thông số nào?",
    options: [
      { key: "A", text: "Số tài khoản ngân hàng và mã PIN cá nhân của người điều khiển" },
      { key: "B", text: "Tọa độ GPS, độ cao bay, vận tốc, góc nghiêng và điện áp pin" },
      { key: "C", text: "Chế độ bay hiện tại, trạng thái kết nối và số lượng vệ tinh khóa được" },
    ],
    correctAnswer: "A",
    explanation: "Telemetry là gói dữ liệu đo xa phản ánh trạng thái bay, sức khỏe thiết bị và thông số kỹ thuật của phương tiện."
  },
  {
    id: 28,
    question: "Kỹ thuật RTK (Real-Time Kinematic) trên UAV trắc địa và trinh sát mang lại lợi ích gì?",
    options: [
      { key: "A", text: "Định vị tọa độ không gian chính xác đến từng centimet bằng cách sửa sai lệch vệ tinh theo thời gian thực" },
      { key: "B", text: "Tăng dung lượng pin lên gấp 3 lần trong lúc bay" },
      { key: "C", text: "Làm mát động cơ bằng luồng sóng vô tuyến siêu âm" },
    ],
    correctAnswer: "A",
    explanation: "RTK đo pha sóng mang từ trạm base mặt đất đến UAV, khử sai số tầng điện ly/đối lưu, giúp định vị chính xác mức centimet."
  },
  {
    id: 29,
    question: "Góc tới (Angle of Attack - AoA) của cánh nâng UAV là góc tạo bởi giữa yếu tố nào?",
    options: [
      { key: "A", text: "Đường dây cung cánh (Chord line) và hướng luồng khí tương đối (Relative wind)" },
      { key: "B", text: "Càng đáp phía trước và bề mặt mặt đất phẳng" },
      { key: "C", text: "Ống xả động cơ và hướng gió thổi từ phía sau" },
    ],
    correctAnswer: "A",
    explanation: "Góc tới AoA là góc giữa đường thẳng nối mép trước và mép sau cánh với vectơ vận tốc luồng khí tương đối thổi vào cánh."
  },
  {
    id: 30,
    question: "Hiện tượng thất tốc (Stall) xảy ra trên máy bay cánh bằng khi nào?",
    options: [
      { key: "A", text: "Khi góc tới (AoA) vượt quá góc tới tới hạn, làm luồng khí tách rời khỏi mặt trên cánh khiến lực nâng sụt giảm nghiêm trọng" },
      { key: "B", text: "Khi máy bay bay với vận tốc vượt quá tốc độ âm thanh" },
      { key: "C", text: "Khi bình ắc quy được nạp quá 100% dung lượng thiết kế" },
    ],
    correctAnswer: "A",
    explanation: "Khi AoA quá lớn, dòng khí bị cuộn xoáy và tách khỏi mặt trên cánh, gây mất lực nâng đột ngột dẫn đến máy bay rơi tự do (thất tốc)."
  },
  {
    id: 31,
    question: "Bộ cảm biến luồng quang học (Optical Flow sensor) dưới bụng UAV hỗ trợ đắc lực nhất trong môi trường nào?",
    options: [
      { key: "A", text: "Bay trong nhà hoặc hẻm núi che khuất sóng vệ tinh GPS, giữ vị trí bằng cách phân tích chuyển động bề mặt" },
      { key: "B", text: "Bay trên mặt nước biển động mạnh vào ban đêm không có trăng" },
      { key: "C", text: "Bay xuyên qua các đám mây mù dày đặc ở độ cao 3.000 mét" },
    ],
    correctAnswer: "A",
    explanation: "Cảm biến Optical Flow chụp và so sánh các khung hình bề mặt sàn liên tục để nhận biết độ dạt ngang khi không có tín hiệu GPS."
  },
  {
    id: 32,
    question: "Khái niệm Geofencing (hàng rào địa lý ảo) trên hệ thống phần mềm UAV có tác dụng gì?",
    options: [
      { key: "A", text: "Giới hạn phạm vi bán kính và độ cao bay tối đa, ngăn chặn máy bay bay vào khu vực cấm hoặc vượt tầm kiểm soát" },
      { key: "B", text: "Bắn tia laser phá hủy các chướng ngại vật xung quanh đường bay" },
      { key: "C", text: "Tự động gửi thông tin chuyến bay lên mạng xã hội" },
    ],
    correctAnswer: "A",
    explanation: "Geofencing tạo ra một lồng rào ảo dựa trên tọa độ GPS, UAV sẽ tự động dừng lại hoặc quay đầu khi chạm vào ranh giới ảo này."
  },
  {
    id: 33,
    question: "Ống Pitot (Pitot Tube) trang bị trên các dòng UAV cánh bằng dùng để đo thông số gì?",
    options: [
      { key: "A", text: "Tốc độ của máy bay so với luồng không khí tương đối (Airspeed)" },
      { key: "B", text: "Nhiệt độ nóng chảy của cánh quạt máy bay" },
      { key: "C", text: "Khối lượng nhiên liệu còn lại trong bình chứa" },
    ],
    correctAnswer: "A",
    explanation: "Ống Pitot đo chênh lệch giữa áp suất toàn phần và áp suất tĩnh để tính toán tốc độ bay thực tế so với luồng khí (Airspeed)."
  },
  {
    id: 34,
    question: "Kỹ thuật nhảy tần thích ứng FHSS (Frequency-Hopping Spread Spectrum) trên tay cầm điều khiển RC mang lại ưu điểm gì?",
    options: [
      { key: "A", text: "Tự động đổi kênh tần số liên tục hàng trăm lần mỗi giây để chống nhiễu và chống nghe lén tín hiệu" },
      { key: "B", text: "Gia tăng công suất phát sóng vô tuyến lên gấp 1.000 lần mức quy định" },
      { key: "C", text: "Tiêu diệt các loại virus máy tính lây nhiễm qua đường không khí" },
    ],
    correctAnswer: "A",
    explanation: "FHSS truyền tín hiệu bằng cách nhảy ngẫu nhiên giữa các tần số trong băng tần, hạn chế tối đa nguy cơ bị phá sóng hoặc nghẽn kênh."
  },
  {
    id: 35,
    question: "Gimbal 3 trục trên UAV điều khiển chống rung theo các trục chuyển động nào trong không gian?",
    options: [
      { key: "A", text: "Pitch (nghiêng lên/xuống), Roll (nghiêng trái/phải), Yaw (xoay ngang)" },
      { key: "B", text: "Độ cao, độ sâu và độ dài thân vỏ" },
      { key: "C", text: "Nhiệt độ, độ ẩm và áp suất khí quyển" },
    ],
    correctAnswer: "A",
    explanation: "Gimbal 3 trục khử rung lắc trên 3 trục quay tự do cơ bản của khí động học: Pitch, Roll và Yaw, đảm bảo khung hình ổn định tuyệt đối."
  },
  {
    id: 36,
    question: "Tại sao không nên xả cạn kiệt điện áp pin LiPo dưới mức 3.0V đến 3.2V trên mỗi cell?",
    options: [
      { key: "A", text: "Làm tổn thương hóa học vĩnh viễn cấu trúc phân tử pin, làm phồng pin và mất khả năng tích điện" },
      { key: "B", text: "Làm cánh quạt UAV quay ngược chiều ngay trên không" },
      { key: "C", text: "Làm thay đổi tọa độ kinh độ và vĩ độ của vệ tinh GPS" },
    ],
    correctAnswer: "A",
    explanation: "Xả quá sâu dưới 3.0V/cell gây thoái hóa điện cực và kết tủa kim loại Lithium, phá hủy cấu trúc pin và gây nguy hiểm cháy nổ khi sạc lại."
  },
  {
    id: 37,
    question: "Trước khi bay trong khu vực có nhiệt độ môi trường lạnh dưới 0°C, thao tác chuẩn bị pin nào sau đây là quan trọng nhất?",
    options: [
      { key: "A", text: "Ủ ấm pin lên nhiệt độ khoảng 20°C - 25°C trước khi cất cánh và bay thận trọng" },
      { key: "B", text: "Ngâm pin vào nước đá để đông cứng dung dịch điện phân" },
      { key: "C", text: "Xả sạch toàn bộ điện tích của pin về 0 Volts" },
    ],
    correctAnswer: "A",
    explanation: "Ở nhiệt độ quá lạnh, trở kháng trong của pin LiPo tăng vọt làm sụt áp đột ngột dẫn đến mất nguồn trên không; cần làm ấm pin trước khi bay."
  },
  {
    id: 38,
    question: "Tác động nguy hiểm nhất của hiện tượng sương mù dày đặc đối với thiết bị UAV là gì?",
    options: [
      { key: "A", text: "Hơi ẩm ngưng tụ gây chập mạch điện tử bo mạch và làm mờ thấu kính camera quan sát" },
      { key: "B", text: "Làm trọng lượng máy bay tăng gấp 100 lần ngay lập tức" },
      { key: "C", text: "Làm sóng radio biến đổi thành tia tử ngoại" },
    ],
    correctAnswer: "A",
    explanation: "Sương mù là các hạt nước lơ lửng, khi luồng gió cánh quạt thổi vào sẽ làm ngưng tụ nước trên mạch điện hở gây đoản mạch và hỏng hóc."
  },
  {
    id: 39,
    question: "Cảm biến áp suất khí quyển (Barometer) tích hợp trên Flight Controller có công dụng chính là gì?",
    options: [
      { key: "A", text: "Đo áp suất không khí xung quanh để xác định độ cao tương đối của UAV so với điểm cất cánh" },
      { key: "B", text: "Dự báo chính xác thời gian xảy ra động đất và núi lửa" },
      { key: "C", text: "Đo nồng độ khí Oxy bên trong khoang chứa pin" },
    ],
    correctAnswer: "A",
    explanation: "Khí áp kế (Barometer) tính toán độ cao thông qua sự thay đổi áp suất không khí theo phương thẳng đứng với độ nhạy cao."
  },
  {
    id: 40,
    question: "Trong điều khiển bay 4 cánh quạt (Quadcopter), chuyển động quay quanh trục đứng (Yaw) được thực hiện như thế nào?",
    options: [
      { key: "A", text: "Thay đổi tốc độ tương đối giữa cặp cánh quay thuận (CW) và cặp cánh quay nghịch (CCW) để tạo chênh lệch mô-men xoắn" },
      { key: "B", text: "Nghiêng toàn bộ thân máy bay về phía trước 90 độ" },
      { key: "C", text: "Tắt hoàn toàn 2 động cơ đối diện và rơi tự do" },
    ],
    correctAnswer: "A",
    explanation: "Quadcopter khử mô-men xoắn bằng 2 cánh CW và 2 cánh CCW. Khi tăng tốc một cặp và giảm tốc cặp còn lại, mô-men dư thừa sẽ xoay thân UAV."
  },
  {
    id: 41,
    question: "Trong quy định quản lý không phận, khoảng cách an toàn tối thiểu UAV cần giữ đối với đám đông người ngoài trời là bao nhiêu?",
    options: [
      { key: "A", text: "Không được bay trực tiếp phía trên đám đông người và giữ khoảng cách nằm ngang an toàn ít nhất 30-50 mét" },
      { key: "B", text: "Được phép bay sát cách đỉnh đầu người dân 0.5 mét" },
      { key: "C", text: "Không có quy định giới hạn khoảng cách" },
    ],
    correctAnswer: "A",
    explanation: "Tuyệt đối không bay trên đầu người để phòng ngừa rủi ro cơ khí hoặc mất điện rơi tự do gây thương tích nguy hiểm."
  },
  {
    id: 42,
    question: "Tần số vô tuyến 5.8 GHz thường được ưu tiên dùng cho đường truyền nào trên UAV chuyên dụng?",
    options: [
      { key: "A", text: "Truyền hình ảnh FPV trực tiếp độ nét cao với độ trễ cực thấp" },
      { key: "B", text: "Đo độ sâu đáy sông ngòi dưới bùn đất" },
      { key: "C", text: "Gửi tín hiệu cấp cứu xuyên qua lòng đất" },
    ],
    correctAnswer: "A",
    explanation: "Băng tần 5.8 GHz có bước sóng ngắn, băng thông rộng cho phép truyền tải luồng video chất lượng cao và độ trễ mili-giây."
  },
  {
    id: 43,
    question: "Khi sạc pin LiPo cho UAV, chế độ 'Balance Charge' (Sạc cân bằng) có vai trò thiết yếu gì?",
    options: [
      { key: "A", text: "Điều chỉnh điện áp từng cell pin riêng biệt về mức điện áp bằng nhau (4.20V/cell) để đảm bảo an toàn và tuổi thọ" },
      { key: "B", text: "Tăng trọng lượng của thỏi pin để chống gió thổi bay" },
      { key: "C", text: "Nén kích thước thể tích pin nhỏ lại một nửa" },
    ],
    correctAnswer: "A",
    explanation: "Sạc cân bằng kiểm tra từng cell qua dây cáp balance, nạp đều từng cell tránh cell bị quá áp bốc cháy hoặc cell non áp gây sụt nguồn."
  },
  {
    id: 44,
    question: "Tình huống nào sau đây bắt buộc phi công chỉ huy phải thực hiện hạ cánh khẩn cấp (Emergency Landing) ngay lập tức?",
    options: [
      { key: "A", text: "UAV rung lắc dữ dội bất thường, cảnh báo pin sụt áp mức báo động đỏ hoặc phát hiện khói bốc ra từ thân vỏ" },
      { key: "B", text: "Khi phát hiện một cánh chim bay cách máy bay 200 mét" },
      { key: "C", text: "Khi tín hiệu đồng hồ trạm mặt đất chỉ tròn đúng 12 giờ trưa" },
    ],
    correctAnswer: "A",
    explanation: "Các dấu hiệu rung chấn cơ khí nặng, cháy chập hoặc tụt áp tới hạn đe dọa trực tiếp khả năng duy trì lực nâng, phải hạ cánh khẩn cấp."
  },
  {
    id: 45,
    question: "Thao tác gắn cánh quạt cho UAV đa cánh (Multicopter) cần tuân thủ nguyên tắc cốt tử nào?",
    options: [
      { key: "A", text: "Gắn đúng chiều quay cánh thuận (CW) và cánh nghịch (CCW) khớp với chiều quay thiết kế của từng động cơ" },
      { key: "B", text: "Gắn tất cả các cánh quay cùng một chiều duy nhất" },
      { key: "C", text: "Lắp cánh lỏng lẻo không cần siết ốc để cánh tự do di chuyển" },
    ],
    correctAnswer: "A",
    explanation: "Lắp sai chiều cánh quạt sẽ tạo ra lực ấn máy bay xuống đất thay vì nâng lên, hoặc làm máy bay mất kiểm soát xoay tròn dữ dội."
  },
  {
    id: 46,
    question: "Hiện tượng can thiệp chế áp điện tử (GPS Spoofing) gây nguy cơ gì cho UAV đang tác chiến?",
    options: [
      { key: "A", text: "Phát tín hiệu tọa độ giả mạo khiến UAV hiểu sai vị trí thực tế và có thể bị dẫn dụ hạ cánh trái phép" },
      { key: "B", text: "Làm nóng chảy toàn bộ kim loại trên thân vỏ máy bay trong 1 giây" },
      { key: "C", text: "Biến đổi động cơ điện thành động cơ đốt trong chạy dầu" },
    ],
    correctAnswer: "A",
    explanation: "GPS Spoofing phát sóng giả mạo vệ tinh với công suất mạnh hơn tín hiệu thật, làm lệch hướng dẫn đường tự động của máy bay."
  },
  {
    id: 47,
    question: "Chỉ số KV trên thông số động cơ không chổi than (ví dụ: 1000KV, 2300KV) biểu thị thông số gì?",
    options: [
      { key: "A", text: "Số vòng quay trên một phút (RPM) của động cơ trên mỗi Volt điện áp cấp vào khi không tải" },
      { key: "B", text: "Khối lượng tính bằng Kilôgam của động cơ" },
      { key: "C", text: "Khoảng cách truyền sóng tối đa tính bằng Kilômét" },
    ],
    correctAnswer: "A",
    explanation: "KV là hệ số vận tốc vòng quay (RPM/Volt); số KV càng cao thì động cơ quay càng nhanh nhưng mô-men xoắn kéo cánh quạt lớn sẽ giảm."
  },
  {
    id: 48,
    question: "Để lưu trữ pin LiPo an toàn khi không sử dụng trong thời gian dài (trên 1-2 tuần), cần đưa điện áp pin về mức nào (Storage Mode)?",
    options: [
      { key: "A", text: "Khoảng 3.80V đến 3.85V trên mỗi cell (tương đương 40% - 50% dung lượng)" },
      { key: "B", text: "Sạc đầy 100% căng điện áp 4.35V/cell và cất tủ kín" },
      { key: "C", text: "Xả cạn kiệt về 0V" },
    ],
    correctAnswer: "A",
    explanation: "Mức điện áp 3.85V/cell là trạng thái hóa học ổn định nhất của pin LiPo, giảm thiểu phân rã chất điện phân và chống hiện tượng tự phồng."
  },
  {
    id: 49,
    question: "Thiết bị truyền phát nhận diện từ xa Remote ID gắn trên UAV có công dụng chủ yếu là gì?",
    options: [
      { key: "A", text: "Phát quảng bá định danh, tọa độ vị trí và độ cao của UAV cho cơ quan quản lý không phận giám sát an ninh" },
      { key: "B", text: "Tự động tắt động cơ của tất cả máy bay lạ xung quanh" },
      { key: "C", text: "Tăng tốc độ truyền tải video lên gấp 10 lần" },
    ],
    correctAnswer: "A",
    explanation: "Remote ID là 'biển số xe số' của UAV, liên tục phát sóng Bluetooth/Wi-Fi cung cấp vị trí và danh tính để quản lý không phận an toàn."
  },
  {
    id: 50,
    question: "Yếu tố khí tượng nào sau đây là chỉ dấu nguy hiểm hàng đầu buộc phải đình chỉ ngay lập tức các chuyến bay UAV?",
    options: [
      { key: "A", text: "Mây dông vũ tích (Cumulonimbus), có sấm sét, gió giật cục bộ và mưa đá diện rộng" },
      { key: "B", text: "Trời quang mây tạnh, gió nhẹ cấp 1 và tầm nhìn trên 10 km" },
      { key: "C", text: "Nhiệt độ ngoài trời ban ngày 26 độ C" },
    ],
    correctAnswer: "A",
    explanation: "Đám mây dông tích điện Cumulonimbus sinh ra dòng khí đi xuống (microburst) cực mạnh, sét đánh và mưa đá phá hủy khí tài bay ngay lập tức."
  }
];

// Thời gian thi chuẩn: 20 phút (= 1200 giây)
export const EXAM_DURATION_MINUTES = 20;

// Số lượng câu hỏi chuẩn trong 1 đề thi: 20 câu
export const EXAM_QUESTION_COUNT = 20;

/**
 * Hàm chọn ngẫu nhiên N câu hỏi từ ngân hàng tổng số câu hỏi (mặc định 20 câu).
 * Áp dụng thuật toán xáo trộn Fisher-Yates shuffle chuẩn, đảm bảo tính phân phối đều và công bằng.
 */
export function selectRandomQuestions(sourcePool: Question[], count: number = EXAM_QUESTION_COUNT): Question[] {
  if (!sourcePool || sourcePool.length === 0) {
    return [];
  }

  // Sao chép mảng gốc để không làm thay đổi ngân hàng dữ liệu
  const poolCopy = [...sourcePool];

  // Thuật toán Fisher-Yates Shuffle
  for (let i = poolCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [poolCopy[i], poolCopy[j]] = [poolCopy[j], poolCopy[i]];
  }

  // Lấy đúng số lượng câu hỏi mong muốn (tối đa bằng kích thước ngân hàng hiện có)
  const targetCount = Math.min(count, poolCopy.length);
  const selected = poolCopy.slice(0, targetCount);

  // Gán lại số thứ tự hiển thị đề thi từ 1 đến N nhưng vẫn giữ nguyên dữ liệu và id gốc
  return selected.map((q, index) => ({
    ...q,
    // ID dùng cho đề thi này (1, 2, ..., 20)
    id: index + 1,
    // Lưu lại ID gốc trong ngân hàng để tra cứu
    originalBankId: q.id,
    firestoreId: q.firestoreId
  }));
}

