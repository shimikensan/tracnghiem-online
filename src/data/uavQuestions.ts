import { Question } from '../types/quiz';

/**
 * =========================================================================================
 * 📌 HỆ THỐNG NGÂN HÀNG CÂU HỎI TRẮC NGHIỆM UAV (50 CÂU HỎI CHUẨN QUÂN SỰ & KỸ THUẬT)
 * 
 * - Mỗi câu hỏi có 4 ĐÁP ÁN: A, B, C, D và 1 đáp án đúng duy nhất.
 * - Quy chế thi chuẩn:
 *   + Thời gian làm bài: 25 PHÚT
 *   + Số lượng câu hỏi trong bộ đề: 30 CÂU HỎI chọn ngẫu nhiên từ ngân hàng
 *   + Hình thức trắc nghiệm: 4 ĐÁP ÁN (A, B, C, D)
 * =========================================================================================
 */

export const UAV_QUESTIONS: Question[] = [
  {
    "id": 1,
    "question": "UAV là từ viết tắt của thuật ngữ tiếng Anh nào sau đây?",
    "options": [
      {
        "key": "A",
        "text": "Unmanned Aerial Vehicle"
      },
      {
        "key": "B",
        "text": "Universal Aviation Vehicle"
      },
      {
        "key": "C",
        "text": "United Airborne Vector"
      },
      {
        "key": "D",
        "text": "Uncontrolled Air Vessel"
      }
    ],
    "correctAnswer": "A",
    "explanation": "UAV là viết tắt của 'Unmanned Aerial Vehicle' (Phương tiện bay không người lái)."
  },
  {
    "id": 2,
    "question": "Trong cấu trúc cơ bản của một hệ thống UAV, trạm điều khiển mặt đất thường được viết tắt là gì?",
    "options": [
      {
        "key": "A",
        "text": "IMU (Inertial Measurement Unit)"
      },
      {
        "key": "B",
        "text": "FCS (Flight Control System)"
      },
      {
        "key": "C",
        "text": "GCS (Ground Control Station)"
      },
      {
        "key": "D",
        "text": "ESC (Electronic Speed Controller)"
      }
    ],
    "correctAnswer": "C",
    "explanation": "GCS (Ground Control Station) là trạm điều khiển mặt đất tiếp nhận dữ liệu telemetry và gửi lệnh điều khiển tới UAV."
  },
  {
    "id": 3,
    "question": "Hệ thống định vị nào sau đây thường được tích hợp trên UAV để duy trì vị trí và tự động quay về điểm xuất phát (RTH)?",
    "options": [
      {
        "key": "A",
        "text": "Hệ thống sonar siêu âm tầm ngắn dưới 3 mét"
      },
      {
        "key": "B",
        "text": "Hệ thống vệ tinh dẫn đường GNSS (GPS, GLONASS, BeiDou, Galileo)"
      },
      {
        "key": "C",
        "text": "Hệ thống la bàn cơ khí truyền thống trên tàu thủy"
      },
      {
        "key": "D",
        "text": "Cảm biến quang học đo phản xạ bề mặt"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Hệ thống GNSS (GPS, GLONASS, BeiDou, Galileo) cung cấp tọa độ địa lý 3 chiều chính xác giúp UAV định vị không gian và tự động quay về an toàn."
  },
  {
    "id": 4,
    "question": "Khi bay trong điều kiện gió mạnh vượt quá giới hạn thiết kế khí động học, nguy cơ nghiêm trọng nhất xảy ra với UAV là gì?",
    "options": [
      {
        "key": "A",
        "text": "Tự động tăng tốc độ bay tối đa và triệt tiêu sức cản"
      },
      {
        "key": "B",
        "text": "Mất ổn định luồng khí, tiêu hao năng lượng đột biến và mất kiểm soát tư thế bay"
      },
      {
        "key": "C",
        "text": "Động cơ tự đảo chiều quay ngược lại chiều ban đầu"
      },
      {
        "key": "D",
        "text": "Tín hiệu sóng vệ tinh GNSS bị thổi lệch quỹ đạo"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Gió vượt ngưỡng cho phép gây nhiễu động dòng khí trên bề mặt cánh và cánh quạt, làm động cơ hoạt động quá tải và dễ dẫn tới mất kiểm soát tư thế bay."
  },
  {
    "id": 5,
    "question": "Khối cảm biến quán tính IMU (Inertial Measurement Unit) trên UAV có chức năng cốt lõi là gì?",
    "options": [
      {
        "key": "A",
        "text": "Truyền hình ảnh độ nét cao về trung tâm chỉ huy mặt đất"
      },
      {
        "key": "B",
        "text": "Đo nhiệt độ của bình ắc quy trong suốt quá trình bay"
      },
      {
        "key": "C",
        "text": "Đo gia tốc, vận tốc góc và xác định tư thế bay (Roll, Pitch, Yaw)"
      },
      {
        "key": "D",
        "text": "Phát hiện mục tiêu kim loại ngầm dưới lòng đất"
      }
    ],
    "correctAnswer": "C",
    "explanation": "Khối cảm biến quán tính IMU bao gồm con quay hồi chuyển (gyroscope) và gia tốc kế (accelerometer) giúp vi điều khiển bay tính toán tư thế không gian (Roll, Pitch, Yaw) liên tục hàng trăm lần mỗi giây."
  },
  {
    "id": 6,
    "question": "Tính năng an toàn tự động Fail-Safe trên UAV thường được kích hoạt trong trường hợp nào?",
    "options": [
      {
        "key": "A",
        "text": "Khi phát hiện mất tín hiệu liên lạc C2 hoặc điện áp pin tụt dưới ngưỡng an toàn"
      },
      {
        "key": "B",
        "text": "Khi nhiệt độ môi trường xung quanh đạt mức lý tưởng 25 độ C"
      },
      {
        "key": "C",
        "text": "Khi UAV đang duy trì tốc độ bay ổn định trên hành trình"
      },
      {
        "key": "D",
        "text": "Khi nhận đủ tín hiệu từ trên 12 vệ tinh GNSS"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Quy trình Fail-Safe tự động can thiệp (RTH quay về, hạ cánh khẩn cấp hoặc treo cố định vị trí) khi mất sóng liên lạc điều khiển hoặc pin giảm xuống mức nguy hiểm."
  },
  {
    "id": 7,
    "question": "Loại pin nào hiện nay được sử dụng phổ biến nhất trên các dòng máy bay không người lái đa cánh (Multicopter) nhờ mật độ năng lượng và dòng xả cao?",
    "options": [
      {
        "key": "A",
        "text": "Pin khô chì - axit (Lead-acid)"
      },
      {
        "key": "B",
        "text": "Pin Lithium Polymer (LiPo)"
      },
      {
        "key": "C",
        "text": "Pin kiềm Alkaline dùng một lần"
      },
      {
        "key": "D",
        "text": "Pin Nickel-Cadmium (NiCd) cổ điển"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Pin LiPo có tỷ lệ năng lượng trên trọng lượng cao, điện trở trong thấp và khả năng phóng dòng xả tức thời (C-rating lớn), đáp ứng yêu cầu vận hành của động cơ UAV."
  },
  {
    "id": 8,
    "question": "Hai dải tần số vô tuyến chuẩn thường được sử dụng phổ biến nhất cho đường truyền điều khiển và truyền hình ảnh video UAV dân sự & chuyên dụng là gì?",
    "options": [
      {
        "key": "A",
        "text": "VHF 100 kHz và 200 kHz"
      },
      {
        "key": "B",
        "text": "Sóng ngắn HF 3 MHz và 30 MHz"
      },
      {
        "key": "C",
        "text": "2.4 GHz và 5.8 GHz"
      },
      {
        "key": "D",
        "text": "Tia hồng ngoại 850 nm và 940 nm"
      }
    ],
    "correctAnswer": "C",
    "explanation": "Băng tần 2.4 GHz (ưu thế xuyên thấu, khoảng cách điều khiển xa) và 5.8 GHz (băng thông lớn truyền dữ liệu video thời gian thực) là hai chuẩn truyền vô tuyến thông dụng nhất."
  },
  {
    "id": 9,
    "question": "Tải trọng quang điện tử (Payload) chuẩn trên UAV phục vụ nhiệm vụ trinh sát, tuần tra ban ngày và ban đêm bao gồm những thành phần nào?",
    "options": [
      {
        "key": "A",
        "text": "Cụm camera zoom quang học kết hợp cảm biến nhiệt hồng ngoại và Gimbal ổn định 3 trục"
      },
      {
        "key": "B",
        "text": "Loa phóng thanh công suất lớn và dàn đèn chiếu sáng công nghệ LED"
      },
      {
        "key": "C",
        "text": "Bộ thiết bị thu thập mẫu khí tầng cao và phao cứu sinh"
      },
      {
        "key": "D",
        "text": "Máy đo từ trường địa chất và cảm biến đo độ mặn nước biển"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Gimbal 3 trục giữ ổn định chống rung lắc kết hợp cụm camera kép (ánh sáng khả kiến quan sát chi tiết ban ngày và camera nhiệt hồng ngoại phát hiện thân nhiệt ban đêm) là cấu hình trinh sát tiêu chuẩn."
  },
  {
    "id": 10,
    "question": "Trước khi thực hiện chuyến bay huấn luyện hoặc làm nhiệm vụ tác chiến, bước kiểm tra an toàn nào sau đây là BẮT BUỘC (Pre-flight check)?",
    "options": [
      {
        "key": "A",
        "text": "Kiểm tra cơ học cánh quạt, chốt khóa cánh, dung lượng pin, la bàn từ tính và cài đặt độ cao RTH an toàn"
      },
      {
        "key": "B",
        "text": "Sơn mới lại toàn bộ vỏ thân và tháo rời động cơ để vệ sinh bằng nước"
      },
      {
        "key": "C",
        "text": "Tắt toàn bộ hệ thống định vị vệ tinh để bay hoàn toàn theo cảm giác"
      },
      {
        "key": "D",
        "text": "Điều chỉnh động cơ hoạt động ở công suất tối đa liên tục 10 phút trước cất cánh"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Quy trình kiểm tra an toàn trước chuyến bay (Pre-flight checklist) đảm bảo phần cứng (cánh, pin, cảm biến) và phần mềm (tọa độ Home, độ cao RTH, mức pin Fail-Safe) hoạt động chính xác trước khi rời mặt đất."
  },
  {
    "id": 11,
    "question": "Độ cao quay về an toàn RTH (Return To Home) cần được thiết lập như thế nào trước khi cất cánh thực hiện nhiệm vụ?",
    "options": [
      {
        "key": "A",
        "text": "Luôn đặt cố định ở độ cao 5 mét so với mặt đất"
      },
      {
        "key": "B",
        "text": "Cao hơn chướng ngại vật cao nhất trong toàn bộ khu vực hoạt động bay ít nhất 15 - 20 mét"
      },
      {
        "key": "C",
        "text": "Không cần cài đặt vì UAV có thể tự động bay xuyên qua chướng ngại vật"
      },
      {
        "key": "D",
        "text": "Đặt ở độ cao tối đa mà thiết bị có thể bay được (trên 1000m)"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Độ cao RTH phải được cài đặt cao hơn tòa nhà, cây cối, cột điện cao thế cao nhất trong hành lang bay để tránh va chạm khi mất sóng tự bay về điểm Home."
  },
  {
    "id": 12,
    "question": "Hiện tượng 'Jello effect' (hình ảnh video bị rung giật dạng gợn sóng ngang) truyền về từ UAV thường do nguyên nhân chủ yếu nào?",
    "options": [
      {
        "key": "A",
        "text": "Tín hiệu sóng GPS quá mạnh làm chói cảm biến quang học"
      },
      {
        "key": "B",
        "text": "Rung chấn cơ học tần số cao từ động cơ hoặc cánh quạt chưa cân bằng động truyền sang cụm camera"
      },
      {
        "key": "C",
        "text": "Ống kính camera bị quá lạnh do bay ở trần bay cao"
      },
      {
        "key": "D",
        "text": "Nhiệt độ của pin LiPo quá cao làm nhiễu cảm biến hình ảnh"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Rung động cơ học tần số cao (do cánh quạt mẻ, cong vênh hoặc mất cân bằng động) truyền qua khung vỏ tới cảm biến Rolling Shutter của camera gây ra hiệu ứng gợn sóng 'Jello'."
  },
  {
    "id": 13,
    "question": "Bộ điều tốc điện tử ESC (Electronic Speed Controller) trên máy bay không người lái đảm nhiệm vai trò gì?",
    "options": [
      {
        "key": "A",
        "text": "Điều khiển tốc độ và hướng quay của động cơ điện không chổi than (BLDC)"
      },
      {
        "key": "B",
        "text": "Định vị vị trí địa lý của UAV trên bản đồ tác chiến"
      },
      {
        "key": "C",
        "text": "Thu nhận tín hiệu hình ảnh truyền hình mặt đất"
      },
      {
        "key": "D",
        "text": "Sạc điện tự động cho pin điều khiển từ xa GCS"
      }
    ],
    "correctAnswer": "A",
    "explanation": "ESC nhận tín hiệu điều khiển từ Flight Controller và điều biến độ rộng xung (PWM/DShot) cấp dòng điện xoay chiều 3 pha tới các cuộn dây của động cơ BLDC để điều chỉnh tốc độ quay."
  },
  {
    "id": 14,
    "question": "Hệ thống truyền động của UAV cánh bằng (Fixed-wing) khác biệt cơ bản với UAV đa cánh (Multicopter) ở điểm nào?",
    "options": [
      {
        "key": "A",
        "text": "UAV cánh bằng tạo lực nâng chủ yếu nhờ luồng khí thổi qua bề mặt khí động của cánh khi tiến về phía trước"
      },
      {
        "key": "B",
        "text": "UAV cánh bằng hoàn toàn không cần động cơ để duy trì độ cao"
      },
      {
        "key": "C",
        "text": "UAV cánh bằng có thể đứng yên một chỗ trên không vô thời hạn"
      },
      {
        "key": "D",
        "text": "UAV cánh bằng không chịu tác động của trọng lực Trái Đất"
      }
    ],
    "correctAnswer": "A",
    "explanation": "UAV cánh bằng tạo lực nâng khí động học (Aerodynamic Lift) nhờ vận tốc tương đối giữa cánh và không khí, giúp tiết kiệm năng lượng và đạt tầm bay xa hơn multicopter."
  },
  {
    "id": 15,
    "question": "Tư thế bay của UAV được mô tả bởi ba góc quay trong không gian ba chiều (Euler angles). Ba góc đó là gì?",
    "options": [
      {
        "key": "A",
        "text": "X, Y, Z (Tọa độ không gian Đề-các)"
      },
      {
        "key": "B",
        "text": "Roll (nghiêng ngang), Pitch (chúi/ngóc đầu), Yaw (xoay hướng mũi)"
      },
      {
        "key": "C",
        "text": "Alpha, Beta, Gamma (Góc phản xạ ánh sáng)"
      },
      {
        "key": "D",
        "text": "Latitude, Longitude, Altitude (Tọa độ địa lý)"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Roll (lắc ngang quanh trục dọc), Pitch (chúi/ngóc quanh trục ngang) và Yaw (quay đầu quanh trục đứng) là 3 bậc tự do góc kiểm soát tư thế bay khí động học."
  },
  {
    "id": 16,
    "question": "Khi hiệu chuẩn la bàn từ tính (Compass Calibration) cho UAV, điều kiện môi trường nào sau đây là BẮT BUỘC?",
    "options": [
      {
        "key": "A",
        "text": "Đứng gần tháp phát sóng viễn thông hoặc trạm biến áp điện 220kV"
      },
      {
        "key": "B",
        "text": "Khu vực trống trải, cách xa các khối kim loại lớn, bê tông cốt thép và dây điện cao thế"
      },
      {
        "key": "C",
        "text": "Để UAV ngay trên nắp capo xe ô tô đang nổ máy"
      },
      {
        "key": "D",
        "text": "Thực hiện trong phòng kín bằng kim loại có che chắn sóng"
      }
    ],
    "correctAnswer": "B",
    "explanation": "La bàn từ tính rất nhạy cảm với từ trường dị thường; kim loại lớn, cốt thép hoặc nguồn điện mạnh sẽ làm sai lệch dữ liệu cảm biến dẫn đến hiện tượng 'Toilet bowl' mất kiểm soát."
  },
  {
    "id": 17,
    "question": "Kỹ thuật 'Cân bằng động cánh quạt' (Propeller Balancing) nhằm mục đích chính nào sau đây?",
    "options": [
      {
        "key": "A",
        "text": "Tăng trọng lượng của cánh quạt để máy bay đầm gió hơn"
      },
      {
        "key": "B",
        "text": "Triệt tiêu độ rung chấn cơ học, bảo vệ vòng bi động cơ và chống rung camera"
      },
      {
        "key": "C",
        "text": "Đổi màu sắc cánh quạt giúp dễ nhận diện từ xa"
      },
      {
        "key": "D",
        "text": "Làm giảm tốc độ quay tối đa của động cơ máy bay"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Cánh quạt lệch trọng tâm khi quay ở vận tốc 5.000 - 15.000 vòng/phút sẽ sinh ra lực ly tâm phá hủy bạc đạn động cơ, làm nhiễu cảm biến IMU và hỏng chất lượng hình ảnh."
  },
  {
    "id": 18,
    "question": "Điện áp danh định (Nominal voltage) của một cell pin Lithium Polymer (LiPo) tiêu chuẩn là bao nhiêu?",
    "options": [
      {
        "key": "A",
        "text": "1.2V"
      },
      {
        "key": "B",
        "text": "3.7V (đầy 4.2V, lưu kho an toàn 3.85V)"
      },
      {
        "key": "C",
        "text": "5.0V"
      },
      {
        "key": "D",
        "text": "12.0V"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Một cell pin LiPo tiêu chuẩn có điện áp danh định 3.7V, khi sạc đầy đạt 4.2V và điện áp lưu kho an toàn bảo dưỡng (Storage mode) là 3.80V - 3.85V."
  },
  {
    "id": 19,
    "question": "Hiện tượng 'Thất tốc' (Stall) ở UAV cánh bằng xảy ra khi nào?",
    "options": [
      {
        "key": "A",
        "text": "Góc tấn của cánh vượt quá góc tấn tới hạn, làm luồng khí tách rời khỏi bề mặt trên của cánh và mất lực nâng"
      },
      {
        "key": "B",
        "text": "Khi máy bay bay với vận tốc vượt quá tốc độ âm thanh"
      },
      {
        "key": "C",
        "text": "Khi máy bay hạ cánh chạm bánh xuống đường băng"
      },
      {
        "key": "D",
        "text": "Khi pin được sạc đầy 100% trước khi bay"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Hiện tượng thất tốc khí động học xảy ra khi góc đón gió (góc tấn) quá lớn hoặc vận tốc bay quá thấp, dòng khí mặt trên cánh bị cuộn xoáy tách rời khiến lực nâng suy giảm đột ngột."
  },
  {
    "id": 20,
    "question": "Khu vực cấm bay (No-Fly Zone - NFZ) đối với thiết bị bay không người lái thường bao gồm các địa bàn nào?",
    "options": [
      {
        "key": "A",
        "text": "Sân bay dân dụng, căn cứ quân sự, cơ quan đầu não chính trị và kho tàng trọng yếu quốc gia"
      },
      {
        "key": "B",
        "text": "Mọi cánh đồng canh tác nông nghiệp ở vùng nông thôn"
      },
      {
        "key": "C",
        "text": "Khu vực mặt nước trên biển khơi cách bờ trên 20 km"
      },
      {
        "key": "D",
        "text": "Các công viên công cộng không có người qua lại"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Quy định an ninh hàng không và quốc phòng cấm triệt để phương tiện bay không người lái hoạt động trái phép trong bán kính khu vực sân bay, công trình an ninh quốc gia và khu quân sự."
  },
  {
    "id": 21,
    "question": "Giao thức truyền thông MAVLink (Micro Air Vehicle Link) thường được sử dụng để làm gì trong hệ thống UAV?",
    "options": [
      {
        "key": "A",
        "text": "Truyền dữ liệu đo xa (Telemetry), lệnh điều khiển và trạng thái giữa vi điều khiển bay và trạm mặt đất GCS"
      },
      {
        "key": "B",
        "text": "Kết nối mạng xã hội để phát trực tiếp video"
      },
      {
        "key": "C",
        "text": "Chuyển tiền điện tử giữa các trạm trung chuyển"
      },
      {
        "key": "D",
        "text": "Điều chỉnh tần số âm thanh của loa phát thanh trên UAV"
      }
    ],
    "correctAnswer": "A",
    "explanation": "MAVLink là giao thức chuẩn mã nguồn mở cực kỳ nhẹ và tối ưu để đóng gói các bản tin dữ liệu đo xa (vận tốc, độ cao, tọa độ, trạng thái pin) và nhận lệnh từ trạm GCS."
  },
  {
    "id": 22,
    "question": "Trong cấu hình Quadcopter hình chữ X (4 động cơ), chiều quay của các cánh quạt được bố trí như thế nào để triệt tiêu mô-men xoắn?",
    "options": [
      {
        "key": "A",
        "text": "Tất cả 4 cánh quạt đều quay theo chiều kim đồng hồ (CW)"
      },
      {
        "key": "B",
        "text": "Hai cánh quạt chéo nhau quay thuận chiều kim đồng hồ (CW), hai cánh chéo còn lại quay ngược chiều kim đồng hồ (CCW)"
      },
      {
        "key": "C",
        "text": "Hai cánh phía trước đứng yên, hai cánh phía sau quay luân phiên"
      },
      {
        "key": "D",
        "text": "Các cánh quạt tự do quay theo hướng gió ngẫu nhiên"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Bố trí 2 cánh quay CW và 2 cánh quay CCW chéo góc nhau tạo ra mô-men phản kháng triệt tiêu lẫn nhau, giúp thân máy bay không bị tự xoay tròn quanh trục đứng."
  },
  {
    "id": 23,
    "question": "Cảm biến đo áp suất tĩnh (Barometer) tích hợp trên bo mạch điều khiển bay có chức năng chính là gì?",
    "options": [
      {
        "key": "A",
        "text": "Đo nồng độ oxy hòa tan trong không khí"
      },
      {
        "key": "B",
        "text": "Xác định độ cao tương đối của UAV so với điểm cất cánh dựa trên áp suất khí quyển"
      },
      {
        "key": "C",
        "text": "Đo áp suất dầu nhớt bôi trơn động cơ"
      },
      {
        "key": "D",
        "text": "Đo sức ép của luồng gió thổi vào cánh quạt"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Cảm biến áp suất khí quyển (Barometer) đo sự thay đổi áp suất không khí theo độ cao giúp giữ độ cao ổn định (Altitude Hold) với sai số chỉ vài chục centimet."
  },
  {
    "id": 24,
    "question": "Phương thức tác chiến nào sau đây được coi là biện pháp chế áp mềm (Soft-kill) hiệu quả đối với UAV xâm nhập trái phép?",
    "options": [
      {
        "key": "A",
        "text": "Chế áp điện tử gây nhiễu tín hiệu điều khiển vô tuyến (Jamming) và đánh lừa tín hiệu định vị vệ tinh (Spoofing)"
      },
      {
        "key": "B",
        "text": "Bắn pháo cao xạ đạn nổ mảnh tầm thấp"
      },
      {
        "key": "C",
        "text": "Sử dụng tên lửa phòng không tầm nhiệt dẫn đường quang học"
      },
      {
        "key": "D",
        "text": "Dùng súng bắn lưới cơ học kết hợp đạn ghém"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Biện pháp chế áp mềm (Soft-kill) sử dụng xung điện từ gây nhiễu dải tần 2.4GHz/5.8GHz và giả mạo tọa độ GNSS làm UAV mất liên lạc và buộc phải hạ cánh hoặc quay đầu."
  },
  {
    "id": 25,
    "question": "Hệ thống định vị vệ tinh vi sai RTK (Real-Time Kinematic) mang lại lợi ích vượt trội nào so với định vị GPS thông thường?",
    "options": [
      {
        "key": "A",
        "text": "Tăng thời gian hoạt động của pin máy bay lên gấp 3 lần"
      },
      {
        "key": "B",
        "text": "Độ chính xác định vị vị trí đạt tới cấp độ centimet (cm) theo thời gian thực"
      },
      {
        "key": "C",
        "text": "Cho phép bay dưới nước ngầm và trong hang sâu không có sóng"
      },
      {
        "key": "D",
        "text": "Loại bỏ hoàn toàn sự cần thiết của động cơ cánh quạt"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Công nghệ RTK so sánh pha sóng mang tín hiệu vệ tinh giữa trạm Base cố định và trạm Rover trên UAV, triệt tiêu sai số khí quyển và cho độ chính xác định vị tới từng centimet."
  },
  {
    "id": 26,
    "question": "Hiện tượng 'Ground Effect' (Hiệu ứng mặt đất) tác động như thế nào khi UAV đa cánh bay lơ lửng rất gần bề mặt sàn (dưới 0.5 mét)?",
    "options": [
      {
        "key": "A",
        "text": "Lực nâng tăng lên và luồng khí xoáy dội ngược từ mặt đất gây tròng trành, khó điều khiển ổn định"
      },
      {
        "key": "B",
        "text": "Trọng lượng máy bay đột ngột giảm xuống bằng 0"
      },
      {
        "key": "C",
        "text": "Động cơ bị dừng hoàn toàn do thiếu oxy dưới mặt sàn"
      },
      {
        "key": "D",
        "text": "Sóng vô tuyến bị triệt tiêu hoàn toàn xuống đất"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Hiệu ứng mặt đất sinh ra do luồng khí rửa (downwash) đập xuống sàn cứng tạo đệm khí áp suất cao, làm lực nâng tăng nhưng luồng xoáy dội lại khiến máy bay chao đảo."
  },
  {
    "id": 27,
    "question": "Hệ thống ống Pitot (Pitot Tube) trên máy bay không người lái cánh bằng dùng để đo đại lượng nào?",
    "options": [
      {
        "key": "A",
        "text": "Tốc độ gió tương đối / Tốc độ dòng khí đối với máy bay (Airspeed)"
      },
      {
        "key": "B",
        "text": "Độ nhớt của không khí xung quanh"
      },
      {
        "key": "C",
        "text": "Độ ẩm tuyệt đối trong khoang chứa hàng"
      },
      {
        "key": "D",
        "text": "Lượng nhiên liệu còn lại trong thùng chứa"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Ống Pitot đo chênh lệch giữa áp suất tổng (áp suất động) và áp suất tĩnh để tính toán tốc độ bay thực tế so với khối không khí (Airspeed), thông số sống còn chống thất tốc cánh bằng."
  },
  {
    "id": 28,
    "question": "Khi bảo quản pin Lithium Polymer (LiPo) của UAV trong thời gian không sử dụng dài ngày (trên 10 ngày), cần xử lý mức điện áp pin như thế nào?",
    "options": [
      {
        "key": "A",
        "text": "Sạc căng đầy 100% điện áp 4.2V/cell để sẵn sàng bay"
      },
      {
        "key": "B",
        "text": "Đưa pin về chế độ điện áp lưu kho an toàn (Storage mode: 3.80V - 3.85V mỗi cell)"
      },
      {
        "key": "C",
        "text": "Xả kiệt hoàn toàn về 0V để tránh nguy cơ cháy nổ"
      },
      {
        "key": "D",
        "text": "Ngâm pin vào xô nước muối để làm mát liên tục"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Lưu trữ pin LiPo ở mức đầy 4.2V làm hóa chất phân rã sinh khí gây phù pin; xả kiệt dưới 3.0V gây chết cell vĩnh viễn. Chế độ Storage 3.85V/cell là ngưỡng bảo vệ tuổi thọ hóa học tối ưu."
  },
  {
    "id": 29,
    "question": "Khái niệm BVLOS trong quy tắc điều khiển bay UAV viết tắt cho cụm từ nào sau đây?",
    "options": [
      {
        "key": "A",
        "text": "Beyond Visual Line of Sight (Bay ngoài tầm nhìn trực tiếp bằng mắt thường)"
      },
      {
        "key": "B",
        "text": "Battery Voltage Low Operations Standard"
      },
      {
        "key": "C",
        "text": "Basic Vertical Landing Optimization Software"
      },
      {
        "key": "D",
        "text": "Broadband Video Level Optimization Signal"
      }
    ],
    "correctAnswer": "A",
    "explanation": "BVLOS (Beyond Visual Line of Sight) là phương thức bay ở khoảng cách xa vượt khỏi tầm quan sát trực tiếp bằng mắt thường của phi công, đòi hỏi hệ thống telemetry và an toàn cao."
  },
  {
    "id": 30,
    "question": "Trong điều kiện thời tiết nào sau đây, người điều khiển BẮT BUỘC phải hoãn chuyến bay hoặc khẩn trương hạ cánh thiết bị?",
    "options": [
      {
        "key": "A",
        "text": "Trời quang mây tạnh, gió cấp 2, tầm nhìn xa trên 10 km"
      },
      {
        "key": "B",
        "text": "Khi trời chuẩn bị chuyển mưa dông, có sét, gió giật mạnh và mây đen tích điện tầng thấp"
      },
      {
        "key": "C",
        "text": "Nhiệt độ ngoài trời ở mức 26 độ C vào buổi sáng"
      },
      {
        "key": "D",
        "text": "Độ ẩm không khí đạt mức 55% vào mùa thu"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Mưa dông kèm gió giật và sét đánh là mối nguy hiểm chí tử với UAV: nước gây chập mạch điện tử, gió giật làm lật máy bay và xung điện tích sét phá hủy toàn bộ linh kiện bay."
  },
  {
    "id": 31,
    "question": "Chức năng RTH thông minh (Smart RTH) trên các dòng UAV hiện đại tự động tính toán yếu tố nào để cảnh báo phi công?",
    "options": [
      {
        "key": "A",
        "text": "Tính toán khoảng cách hiện tại, tốc độ gió ngược và lượng pin cần thiết đủ để bay về an toàn"
      },
      {
        "key": "B",
        "text": "Tự động gửi email thông báo kết quả cho người quản lý"
      },
      {
        "key": "C",
        "text": "Tự động tắt nguồn máy bay khi cách mặt đất 100m"
      },
      {
        "key": "D",
        "text": "Tự động chuyển đổi màu đèn led tín hiệu trên thân vỏ"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Smart RTH liên tục đối chiếu dung lượng pin khả dụng với năng lượng cần tiêu hao để vượt qua khoảng cách và lực cản gió ngược quay về điểm Home, tự động cảnh báo khi chạm ngưỡng tối thiểu."
  },
  {
    "id": 32,
    "question": "Cảm biến quang học cảm biến chướng ngại vật (Obstacle Avoidance Sensors) trên UAV có hạn chế lớn nhất trong điều kiện nào?",
    "options": [
      {
        "key": "A",
        "text": "Trong đêm tối thiếu sáng, sương mù dày đặc hoặc bề mặt vật thể phản xạ gương trong suốt"
      },
      {
        "key": "B",
        "text": "Vào buổi trưa trời nắng trong vắt không một gợn mây"
      },
      {
        "key": "C",
        "text": "Khi bay ở độ cao 30m so với mặt đất"
      },
      {
        "key": "D",
        "text": "Khi pin được sạc đầy 100%"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Cảm biến quang học Stereo Vision dựa trên độ tương phản hình ảnh quang học; bóng tối, bề mặt kính trong suốt hoặc sương mù dày làm cảm biến 'mù' và không nhận diện được vật cản."
  },
  {
    "id": 33,
    "question": "Khái niệm 'Tải trọng ích' (Useful Payload) trên UAV được định nghĩa chuẩn xác là gì?",
    "options": [
      {
        "key": "A",
        "text": "Tổng trọng lượng của bộ vỏ nhựa bên ngoài máy bay"
      },
      {
        "key": "B",
        "text": "Khối lượng thiết bị chuyên dụng mang thêm để thực hiện nhiệm vụ (camera, cảm biến, hàng cứu trợ...)"
      },
      {
        "key": "C",
        "text": "Trọng lượng của cụm pin LiPo cung cấp năng lượng bay"
      },
      {
        "key": "D",
        "text": "Trọng lượng trạm điều khiển mặt đất GCS"
      }
    ],
    "correctAnswer": "B",
    "explanation": "Tải trọng ích (Payload) là phần khối lượng khí tài gắn thêm phục vụ trực tiếp cho mục đích nhiệm vụ mà không bao gồm kết cấu thân vỏ và hệ thống động lực cơ bản của UAV."
  },
  {
    "id": 34,
    "question": "Cơ chế 'Nhảy tần thích ứng' (FHSS - Frequency Hopping Spread Spectrum) trên tay điều khiển UAV có tác dụng chủ yếu gì?",
    "options": [
      {
        "key": "A",
        "text": "Chống can nhiễu sóng vô tuyến và tăng tính bảo mật, chống chế áp điện tử thông thường"
      },
      {
        "key": "B",
        "text": "Tăng âm lượng loa cảnh báo gắn trên tay cầm"
      },
      {
        "key": "C",
        "text": "Giúp sạc pin nhanh gấp 2 lần cho bộ phát"
      },
      {
        "key": "D",
        "text": "Tự động phát hiện kim loại màu dưới mặt đất"
      }
    ],
    "correctAnswer": "A",
    "explanation": "FHSS liên tục thay đổi tần số phát tín hiệu hàng trăm lần mỗi giây theo chuỗi giả ngẫu nhiên, giúp tín hiệu không bị nghẽn do can nhiễu băng hẹp và chống phá sóng hiệu quả."
  },
  {
    "id": 35,
    "question": "Khi phát hiện UAV bay chệch quỹ đạo mất kiểm soát hướng (Flyaway), hành động khẩn cấp đầu tiên của người chỉ huy bay là gì?",
    "options": [
      {
        "key": "A",
        "text": "Chuyển sang chế độ khẩn cấp (Emergency Cut-off / RTH), xác định tọa độ cuối và cảnh báo an toàn mặt đất"
      },
      {
        "key": "B",
        "text": "Tiếp tục đứng chờ máy bay tự hết pin rơi xuống"
      },
      {
        "key": "C",
        "text": "Tắt nguồn trạm mặt đất GCS ngay lập tức và rời vị trí"
      },
      {
        "key": "D",
        "text": "Ném vật thể kim loại lên trời để chặn đường bay"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Quy trình khẩn nguy yêu cầu kích hoạt lệnh cắt động cơ hoặc ép RTH nếu khả dụng, ghi nhận tọa độ GPS telemetry cuối cùng và phát cảnh báo cho các lực lượng dưới mặt đất."
  },
  {
    "id": 36,
    "question": "Hiện tượng suy giảm tầm bay và thời lượng pin của UAV trong môi trường nhiệt độ quá lạnh (dưới 0 độ C) chủ yếu do nguyên nhân nào?",
    "options": [
      {
        "key": "A",
        "text": "Các phản ứng hóa học trong pin LiPo bị chậm lại, nội trở tăng vọt làm điện áp sụt nhanh dưới tải"
      },
      {
        "key": "B",
        "text": "Không khí lạnh quá đặc làm động cơ không thể quay được"
      },
      {
        "key": "C",
        "text": "Sóng vô tuyến bị đóng băng trong không khí"
      },
      {
        "key": "D",
        "text": "Tín hiệu vệ tinh GPS không thể truyền qua lớp không khí lạnh"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Nhiệt độ âm làm tăng điện trở trong của dung dịch điện phân trong pin LiPo, khiến pin sụt áp tức thời ngay khi kéo ga cao, có thể gây ngắt nguồn đột ngột giữa không trung."
  },
  {
    "id": 37,
    "question": "Loại cánh quạt có bước ren cánh lớn (High Pitch Propeller) thường mang lại đặc tính bay nào cho UAV?",
    "options": [
      {
        "key": "A",
        "text": "Cho tốc độ bay tối đa cao hơn nhưng tiêu tốn dòng điện lớn hơn khi tăng tốc ban đầu"
      },
      {
        "key": "B",
        "text": "Giúp máy bay tiết kiệm pin tối đa khi bay treo tại chỗ"
      },
      {
        "key": "C",
        "text": "Làm máy bay hoàn toàn không phát ra tiếng ồn khí động"
      },
      {
        "key": "D",
        "text": "Làm giảm trọng lượng tổng thể của cụm động cơ"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Bước cánh (Pitch) càng lớn thì mỗi vòng quay đẩy máy bay đi được quãng đường dài hơn (vận tốc lớn), nhưng đòi hỏi mô-men xoắn cao và tiêu hao điện năng dòng lớn."
  },
  {
    "id": 38,
    "question": "Công nghệ camera nhiệt (Thermal Imaging Camera) trên UAV phát hiện đối tượng dựa trên nguyên lý vật lý nào?",
    "options": [
      {
        "key": "A",
        "text": "Đo bức xạ nhiệt hồng ngoại phát ra từ mọi vật thể có nhiệt độ trên độ không tuyệt đối"
      },
      {
        "key": "B",
        "text": "Chiếu tia X-quang xuyên thấu từ trên cao xuống mặt đất"
      },
      {
        "key": "C",
        "text": "Thu nhận sóng âm thanh siêu âm phát ra từ động cơ đối phương"
      },
      {
        "key": "D",
        "text": "Phát hiện màu sắc phản quang phủ trên trang phục"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Cảm biến vi bức xạ nhiệt (Microbolometer) thu nhận bức xạ hồng ngoại bước sóng 8 - 14 µm phát ra từ nguồn nhiệt mục tiêu, tạo ảnh nhiệt rõ nét bất kể ngày đêm hay khói bụi mù mịt."
  },
  {
    "id": 39,
    "question": "Khi lập kế hoạch đường bay tự động (Waypoints Mission), yếu tố an toàn quan trọng nhất về hành lang bay là gì?",
    "options": [
      {
        "key": "A",
        "text": "Độ cao giữa các điểm chuyển hướng, vùng giao thoa địa hình và giới hạn tầm sóng liên lạc"
      },
      {
        "key": "B",
        "text": "Tên gọi của các điểm mốc trên bản đồ số"
      },
      {
        "key": "C",
        "text": "Số lượng ảnh chụp thử nghiệm trên điện thoại của phi công"
      },
      {
        "key": "D",
        "text": "Màu sắc của các đường vạch biểu diễn trên màn hình GCS"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Hành lang bay tự động phải tính toán trần cao an toàn vượt chướng ngại vật địa hình, vùng khuất sóng vô tuyến đồi núi và thời lượng pin quay về từ điểm xa nhất."
  },
  {
    "id": 40,
    "question": "Thiết bị Gimbal ổn định hình ảnh trên UAV hoạt động dựa trên cơ chế phản hồi nào để loại bỏ rung lắc?",
    "options": [
      {
        "key": "A",
        "text": "Cảm biến con quay góc IMU hồi tiếp tín hiệu đến các động cơ không chổi than mini để bù trừ tức thời"
      },
      {
        "key": "B",
        "text": "Hệ thống lò xo cơ khí và dầu giảm xóc thụ động hoàn toàn"
      },
      {
        "key": "C",
        "text": "Phần mềm cắt ghép và làm mịn hình ảnh nhân tạo trên máy chủ"
      },
      {
        "key": "D",
        "text": "Lực hút nam châm vĩnh cửu gắn ở đế camera"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Gimbal 3 trục sử dụng cảm biến IMU riêng biệt đo góc rung lắc với tần số hàng ngàn Hz và điều khiển 3 mô-tơ bước/brushless vi sai để giữ cân bằng quang học tuyệt đối."
  },
  {
    "id": 41,
    "question": "Tại sao việc cài đặt đúng thông số 'Geofence' (Hàng rào địa lý ảo) là quy tắc an toàn quan trọng trong tác chiến UAV?",
    "options": [
      {
        "key": "A",
        "text": "Ngăn chặn máy bay vô tình bay vượt ra ngoài khu vực tác chiến cho phép hoặc bay vào vùng cấm"
      },
      {
        "key": "B",
        "text": "Giúp máy bay tiết kiệm pin bằng cách tự động tắt động cơ"
      },
      {
        "key": "C",
        "text": "Tăng khoảng cách truyền hình ảnh lên gấp đôi"
      },
      {
        "key": "D",
        "text": "Làm giảm nhiệt độ của pin trong suốt chuyến bay"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Hàng rào ảo Geofence thiết lập ranh giới hình trụ hoặc đa giác: khi UAV chạm ranh giới, hệ thống tự động phanh lại và không cho phép bay tiếp để bảo vệ an ninh và tránh thất lạc."
  },
  {
    "id": 42,
    "question": "Trong hệ thống điện động lực học của UAV, ký hiệu '4S' hoặc '6S' in trên vỏ pin LiPo có ý nghĩa kỹ thuật gì?",
    "options": [
      {
        "key": "A",
        "text": "Số lượng cell pin mắc nối tiếp (Series) với nhau trong bộ pin (4S = 14.8V, 6S = 22.2V danh định)"
      },
      {
        "key": "B",
        "text": "Thời gian bay tối đa tính bằng số giây (Seconds)"
      },
      {
        "key": "C",
        "text": "Cấp độ chống nước của vỏ bảo vệ pin"
      },
      {
        "key": "D",
        "text": "Số lượng cánh quạt tương ứng có thể gắn vào động cơ"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Ký tự 'S' viết tắt của 'Series' (mắc nối tiếp): 1 cell = 3.7V, pin 4S gồm 4 cell mắc nối tiếp (14.8V), pin 6S gồm 6 cell mắc nối tiếp (22.2V danh định)."
  },
  {
    "id": 43,
    "question": "Khi điều khiển UAV bằng tay (Manual mode / Acro mode), điều gì sẽ xảy ra nếu phi công thả tay khỏi các cần điều khiển (Gimbals)?",
    "options": [
      {
        "key": "A",
        "text": "Máy bay giữ nguyên góc nghiêng tư thế hiện tại và tiếp tục di chuyển, không tự động cân bằng lại"
      },
      {
        "key": "B",
        "text": "Máy bay tự động phanh gấp và đứng yên lơ lửng tại chỗ"
      },
      {
        "key": "C",
        "text": "Máy bay lập tức kích hoạt tính năng RTH tự quay về"
      },
      {
        "key": "D",
        "text": "Động cơ tự động ngắt nguồn và rơi tự do"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Trong chế độ thuần cơ khí Acro/Manual, hệ thống tự cân bằng góc bị tắt; máy bay duy trì tốc độ quay góc và tư thế nghiêng hiện tại, đòi hỏi phi công phải liên tục điều khiển để giữ thăng bằng."
  },
  {
    "id": 44,
    "question": "Hiện tượng đóng băng bề mặt cánh (Icing) khi UAV bay qua tầng mây lạnh có độ ẩm cao gây ra nguy cơ gì?",
    "options": [
      {
        "key": "A",
        "text": "Làm biến dạng biên dạng khí động học của cánh, tăng vọt trọng lượng máy bay và gây thất tốc rơi máy bay"
      },
      {
        "key": "B",
        "text": "Làm cho máy bay bay nhanh hơn do bề mặt cánh trơn láng hơn"
      },
      {
        "key": "C",
        "text": "Làm pin bay được lâu hơn do nhiệt độ làm mát hiệu quả"
      },
      {
        "key": "D",
        "text": "Tăng độ phân giải cho camera trinh sát"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Băng bám phá vỡ hình dạng profile khí động học của cánh và cánh quạt, làm triệt tiêu lực nâng, tăng lực cản và tải trọng vượt mức nâng của động cơ dẫn tới rơi tự do."
  },
  {
    "id": 45,
    "question": "Hệ thống truyền dữ liệu telemetry giữa UAV và trạm mặt đất GCS thường cung cấp những thông tin sống còn nào?",
    "options": [
      {
        "key": "A",
        "text": "Tọa độ GPS, độ cao, vận tốc bay, điện áp pin, dòng tiêu thụ và chất lượng sóng vô tuyến"
      },
      {
        "key": "B",
        "text": "Danh bạ điện thoại của phi công điều khiển"
      },
      {
        "key": "C",
        "text": "Dung lượng bộ nhớ trống trên máy tính trạm GCS"
      },
      {
        "key": "D",
        "text": "Tên hãng sản xuất thẻ nhớ gắn trong camera"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Bản tin đo xa Telemetry cập nhật liên tục các tham số trạng thái khí tài theo thời gian thực để phi công và chỉ huy nắm bắt tình trạng kỹ thuật và đưa ra quyết định xử lý kịp thời."
  },
  {
    "id": 46,
    "question": "Phương pháp cất cánh và hạ cánh thẳng đứng (VTOL - Vertical Take-Off and Landing) mang lại ưu thế vượt trội gì cho máy bay không người lái cánh bằng?",
    "options": [
      {
        "key": "A",
        "text": "Không cần đường băng dài hoặc máy phóng/lưới thu hồi, triển khai linh hoạt trên mọi địa hình hẹp"
      },
      {
        "key": "B",
        "text": "Hoàn toàn không cần sử dụng năng lượng điện hay nhiên liệu"
      },
      {
        "key": "C",
        "text": "Có khả năng tàng hình trước mọi loại radar đối phương"
      },
      {
        "key": "D",
        "text": "Cho phép máy bay bay lặn dưới mặt nước biển"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Cấu hình lai VTOL kết hợp cánh nâng thẳng đứng để cất/hạ cánh linh hoạt trong không gian chật hẹp (rừng núi, tàu thuyền) và cánh bằng cố định để hành trình tầm xa tốc độ cao."
  },
  {
    "id": 47,
    "question": "Bộ cảm biến dòng điện và điện áp (Power Module / Current Sensor) trên bo mạch điều khiển bay có nhiệm vụ gì?",
    "options": [
      {
        "key": "A",
        "text": "Đo lường chính xác lượng điện áp và dòng xả thời gian thực để tính toán dung lượng pin còn lại (mAh)"
      },
      {
        "key": "B",
        "text": "Tăng áp suất không khí trong khoang điện tử"
      },
      {
        "key": "C",
        "text": "Thay đổi màu sắc đèn chiếu sáng cảnh báo ban đêm"
      },
      {
        "key": "D",
        "text": "Phát xung âm thanh xua đuổi chim bay gần máy bay"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Mô-đun nguồn cung cấp nguồn 5V ổn định cho Flight Controller và cảm biến dòng/áp liên tục để bộ vi xử lý tính toán chính xác phần trăm dung lượng pin còn lại."
  },
  {
    "id": 48,
    "question": "Khi tiếp cận khu vực có nguy cơ bị chế áp điện tử mạnh, biện pháp kỹ thuật nào giúp tăng khả năng sinh tồn cho UAV trinh sát?",
    "options": [
      {
        "key": "A",
        "text": "Bay theo chế độ tự động ngắt kết nối vô tuyến (Radio Silence) dựa trên hệ thống dẫn đường quán tính (INS)"
      },
      {
        "key": "B",
        "text": "Tăng tối đa công suất phát hình ảnh analog không mã hóa"
      },
      {
        "key": "C",
        "text": "Hạ độ cao xuống sát mặt đất và bật còi hú liên tục"
      },
      {
        "key": "D",
        "text": "Bật đèn chiếu sáng công suất lớn để làm lóa mắt thiết bị áp chế"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Chế độ im lặng vô tuyến (Radio Silence) tắt toàn bộ máy phát sóng và bay tự động theo lộ trình định sẵn bằng hệ dẫn đường quán tính INS giúp triệt tiêu nguy cơ bị định vị và vô hiệu hóa đòn phá sóng."
  },
  {
    "id": 49,
    "question": "Khi thực hiện hạ cánh khẩn cấp trên mặt nước đối với UAV không có tính năng chống nước chuyên dụng, điều gì sẽ xảy ra?",
    "options": [
      {
        "key": "A",
        "text": "Nước ngấm gây đoản mạch chập cháy linh kiện điện tử, hỏng pin LiPo và chìm hoàn toàn khí tài"
      },
      {
        "key": "B",
        "text": "Máy bay tự động chuyển sang chế độ xuồng cao tốc bơi về bờ"
      },
      {
        "key": "C",
        "text": "Hệ thống làm mát bằng nước giúp tăng gấp đôi công suất động cơ"
      },
      {
        "key": "D",
        "text": "Máy bay tự động nạp lại năng lượng từ sóng biển"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Nước dẫn điện gây đoản mạch bảng mạch điện tử cao áp, làm oxy hóa tế bào pin LiPo gây cháy nổ và làm mất hoàn toàn phương tiện bay nếu không có túi phao cứu hộ."
  },
  {
    "id": 50,
    "question": "Đám mây dông tích điện Cumulonimbus (CB) sinh ra những hiện tượng thời tiết nguy hiểm nào đối với hoạt động của UAV?",
    "options": [
      {
        "key": "A",
        "text": "Dòng khí giáng (Microburst) cực mạnh, nhiễu động dữ dội, sét đánh và mưa đá phá hủy khí tài bay"
      },
      {
        "key": "B",
        "text": "Gió lặng như tờ và ánh sáng dịu mát giúp camera thu hình rõ nét"
      },
      {
        "key": "C",
        "text": "Tăng cường độ bắt sóng vệ tinh định vị lên gấp 3 lần"
      },
      {
        "key": "D",
        "text": "Tạo luồng khí nâng êm ái giúp máy bay bay không tốn pin"
      }
    ],
    "correctAnswer": "A",
    "explanation": "Đám mây dông tích điện Cumulonimbus sinh ra dòng khí đi xuống (microburst) cực mạnh, sét đánh và mưa đá phá hủy khí tài bay ngay lập tức."
  }
];

// Thời gian thi chuẩn: 25 phút (= 1500 giây)
export const EXAM_DURATION_MINUTES = 25;

// Số lượng câu hỏi chuẩn trong 1 đề thi: 30 câu
export const EXAM_QUESTION_COUNT = 30;

/**
 * Hàm chọn ngẫu nhiên N câu hỏi từ ngân hàng tổng số câu hỏi (mặc định 30 câu).
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
    // ID dùng cho đề thi này (1, 2, ..., 30)
    id: index + 1,
    // Lưu lại ID gốc trong ngân hàng để tra cứu
    originalBankId: q.id,
    firestoreId: q.firestoreId
  }));
}
