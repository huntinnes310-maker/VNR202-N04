// Game Questions Data - VNR202 • Nhóm 4
// Chủ đề: Đảng ra đời: Từ khủng hoảng đường lối đến tổ chức tiên phong (1930 – 1945)

// Helpers giữ đúng cấu trúc dữ liệu mà app.js đang dùng
const tf = (id, question, isTrue, why, lesson) => ({
  id, question, type: "true_false",
  options: [{ key: "A", text: "ĐÚNG" }, { key: "B", text: "SAI" }],
  correct: isTrue ? "A" : "B",
  explanation: { answerText: isTrue ? "A. ĐÚNG" : "B. SAI", why, lesson }
});

const mc = (id, question, subtitle, options, correct, why, lesson, extra = {}) => {
  const opts = options.map((text, i) => ({ key: "ABCD"[i], text }));
  const ans = opts.find(o => o.key === correct);
  return {
    id, question, ...(subtitle ? { subtitle } : {}), type: "single_choice", ...extra,
    options: opts, correct,
    explanation: { answerText: `${ans.key}. ${ans.text}`, why, lesson }
  };
};

// Vòng 3: giữ key XAY/CHONG cho engine, chỉ đổi nhãn hiển thị
const APPLY = { key: "XAY", text: "VẬN DỤNG", icon: "🟢", desc: "Biết kế thừa bài học lịch sử" };
const AVOID = { key: "CHONG", text: "CẦN TRÁNH", icon: "🔴", desc: "Đi ngược bài học lịch sử" };
const bin = (id, situation, apply, why, lesson) => ({
  id, situation, type: "build_fight", options: [APPLY, AVOID],
  correct: apply ? "XAY" : "CHONG",
  explanation: { answerText: apply ? "🟢 VẬN DỤNG" : "🔴 CẦN TRÁNH", why, lesson }
});

export const ROUNDS_CONFIG = [
  {
    id: 1,
    title: "VÒNG 1: ĐÚNG HAY SAI?",
    subtitle: "Khởi động kiến thức 1930 – 1945 • Thi đấu luân phiên",
    badge: "1 LƯỢT / ĐỘI",
    pointsPerQuestion: 10,
    timeLimit: 15,
    hasSteal: false,
    mode: "true_false",
    description: "Mỗi câu 1 đội trả lời (ĐÚNG hoặc SAI). Trả lời đúng nhận +10 điểm. Nếu sai: 0 điểm và hiện đáp án ngay (không cướp điểm ở câu 2 lựa chọn)."
  },
  {
    id: 2,
    title: "VÒNG 2: DÒNG CHẢY LỊCH SỬ",
    subtitle: "Từ khủng hoảng đường lối đến Cách mạng Tháng Tám • Thi đấu luân phiên",
    badge: "1 LƯỢT / ĐỘI",
    pointsPerQuestion: 20,
    timeLimit: 15,
    hasSteal: true,
    mode: "multiple_choice",
    description: "Trắc nghiệm 4 lựa chọn về 3 phần của bài thuyết trình. Đúng nhận +20 điểm. Nếu sai: 0 điểm và các đội khác có cơ hội CƯỚP ĐIỂM (+10đ)!"
  },
  {
    id: 3,
    title: "VÒNG 3: VẬN DỤNG HAY CẦN TRÁNH?",
    subtitle: "Bài học lịch sử trong đời sống sinh viên hôm nay • Thi đấu luân phiên",
    badge: "1 LƯỢT / ĐỘI",
    pointsPerQuestion: 20,
    timeLimit: 15,
    hasSteal: false,
    mode: "build_fight",
    description: "Đội trong lượt chọn 🟢 VẬN DỤNG hoặc 🔴 CẦN TRÁNH. Đúng nhận +20 điểm. Nếu sai: 0 điểm và hiện đáp án ngay (không cướp điểm ở câu 2 lựa chọn)."
  },
  {
    id: 4,
    title: "VÒNG 4: TỪ LỊCH SỬ ĐẾN HÔM NAY",
    subtitle: "Vòng Về Đích • Tình huống thực tiễn",
    badge: "1 LƯỢT / ĐỘI",
    pointsPerQuestion: 30,
    timeLimit: 20,
    hasSteal: true,
    mode: "ai_dilemma",
    description: "Vòng Về Đích! 5 tình huống thực tiễn (4 lựa chọn A-B-C-D). Đúng nhận +30 điểm. Sai: 0 điểm → CÁC ĐỘI KHÁC CƯỚP ĐIỂM (+10đ)!"
  }
];

export const QUESTIONS_DATA = {
  // ================= VÒNG 1: ĐÚNG HAY SAI =================
  1: [
    tf("r1_q1", "Đầu thế kỷ XX, mâu thuẫn chủ yếu nhất của xã hội Việt Nam là mâu thuẫn giữa nông dân và địa chủ phong kiến.", false,
      "Mâu thuẫn chủ yếu nhất là mâu thuẫn giữa toàn thể dân tộc Việt Nam với thực dân Pháp xâm lược. Mâu thuẫn nông dân – địa chủ là mâu thuẫn cơ bản thứ hai.",
      "Xác định đúng mâu thuẫn chủ yếu là cơ sở để xác định đúng nhiệm vụ hàng đầu của cách mạng: giải phóng dân tộc."),
    tf("r1_q2", "Phong trào Cần Vương và khởi nghĩa Yên Thế thuộc khuynh hướng phong kiến.", true,
      "Cả hai phong trào đều đặt dưới ngọn cờ tư tưởng phong kiến, chiến đấu anh dũng nhưng thất bại vì hệ tư tưởng đã lỗi thời.",
      "Lòng yêu nước là chưa đủ: cần một hệ tư tưởng tiến bộ dẫn đường."),
    tf("r1_q3", "Phong trào Đông Du do Phan Châu Trinh khởi xướng.", false,
      "Phong trào Đông Du gắn với Phan Bội Châu. Phan Châu Trinh gắn với phong trào Duy Tân.",
      "Hai xu hướng của khuynh hướng dân chủ tư sản: bạo động (Phan Bội Châu) và cải cách (Phan Châu Trinh), đều chưa tìm ra lối thoát."),
    tf("r1_q4", "Khởi nghĩa Yên Bái (1930) của Việt Nam Quốc dân Đảng là đỉnh cao của khuynh hướng dân chủ tư sản.", true,
      "Khởi nghĩa Yên Bái là đỉnh cao và cũng là sự kết thúc của khuynh hướng dân chủ tư sản trong phong trào yêu nước Việt Nam.",
      "Sự thất bại này cho thấy khuynh hướng dân chủ tư sản bế tắc về phương pháp và thiếu cơ sở quần chúng rộng rãi."),
    tf("r1_q5", "Hội nghị hợp nhất các tổ chức cộng sản, thành lập Đảng, diễn ra tại Quảng Châu (Trung Quốc).", false,
      "Hội nghị diễn ra tại Cửu Long (Hồng Kông), từ ngày 6/1 đến 7/2/1930, dưới sự chủ trì của Nguyễn Ái Quốc.",
      "Hội nghị hợp nhất đã thống nhất các tổ chức cộng sản thành một Đảng duy nhất."),
    tf("r1_q6", "Hội nghị hợp nhất diễn ra từ 6/1 đến 7/2/1930, và ngày 3/2 được chọn làm ngày kỷ niệm thành lập Đảng.", true,
      "6/1 – 7/2/1930 là thời gian diễn ra Hội nghị; ngày 3/2 được chọn là ngày kỷ niệm thành lập Đảng Cộng sản Việt Nam.",
      "Phân biệt thời gian diễn ra hội nghị với ngày kỷ niệm để tránh nhầm lẫn."),
    tf("r1_q7", "Cương lĩnh chính trị đầu tiên của Đảng gồm Chính cương vắn tắt và Sách lược vắn tắt.", true,
      "Hai văn kiện này được Hội nghị hợp nhất thông qua và gọi chung là Cương lĩnh chính trị đầu tiên.",
      "Cương lĩnh là ngọn cờ giải quyết triệt để cuộc khủng hoảng về đường lối cứu nước."),
    tf("r1_q8", "Trong cao trào 1936 – 1939, Đảng đặt mục tiêu giành độc lập ngay lập tức lên hàng đầu.", false,
      "Giai đoạn 1936 – 1939, Đảng linh hoạt chuyển sang đấu tranh đòi các quyền tự do, dân sinh, dân chủ, tận dụng việc Mặt trận nhân dân lên cầm quyền ở Pháp.",
      "Biết điều chỉnh mục tiêu trước mắt theo hoàn cảnh mà không từ bỏ mục tiêu lâu dài."),
    tf("r1_q9", "Hội nghị Trung ương 8 (tháng 5/1941) do Nguyễn Ái Quốc chủ trì.", true,
      "Hội nghị Trung ương 8 do Nguyễn Ái Quốc chủ trì, hoàn chỉnh chủ trương chuyển hướng chỉ đạo chiến lược.",
      "Hội nghị đặt nhiệm vụ giải phóng dân tộc lên trên hết, trước hết."),
    tf("r1_q10", "Khi Cách mạng Tháng Tám thành công (1945), Đảng mang tên Đảng Cộng sản Việt Nam.", false,
      "Lúc bấy giờ Đảng mang tên Đảng Cộng sản Đông Dương (đổi tên từ tháng 10/1930).",
      "Tên gọi thay đổi nhưng vai trò tiên phong lãnh đạo cách mạng là xuyên suốt.")
  ],

  // ================= VÒNG 2: DÒNG CHẢY LỊCH SỬ =================
  2: [
    mc("r2_q1", "Chính sách nào của thực dân Pháp làm thay đổi tính chất xã hội Việt Nam, nảy sinh hai mâu thuẫn cơ bản?", null,
      ["Cải cách giáo dục", "Khai thác thuộc địa", "Chia để trị", "Đồng hóa văn hóa"], "B",
      "Các cuộc khai thác thuộc địa làm xã hội Việt Nam trở thành xã hội thuộc địa nửa phong kiến với hai mâu thuẫn cơ bản.",
      "Muốn tìm lời giải đúng phải hiểu đúng bản chất xã hội."),
    mc("r2_q2", "Theo nhóm thuyết trình, các phong trào yêu nước trước năm 1930 thiếu những yếu tố nào?", null,
      ["Vũ khí, tiền bạc và lương thực", "Sự ủng hộ từ nước ngoài", "Hệ tư tưởng tiên tiến, giai cấp tiên phong và đường lối đúng đắn", "Tinh thần yêu nước của nhân dân"], "C",
      "Các phong trào ngùn ngụt tinh thần yêu nước nhưng thiếu hệ tư tưởng tiên tiến, giai cấp tiên phong và đường lối đúng đắn.",
      "Đây chính là biểu hiện của cuộc khủng hoảng về đường lối cứu nước và giai cấp lãnh đạo."),
    mc("r2_q3", "Phong trào Duy Tân gắn với nhân vật nào?", null,
      ["Phan Bội Châu", "Nguyễn Thái Học", "Hoàng Hoa Thám", "Phan Châu Trinh"], "D",
      "Phan Châu Trinh đại diện cho xu hướng cải cách (phong trào Duy Tân).",
      "Cải cách trong khuôn khổ chế độ thực dân không thể giải phóng dân tộc."),
    mc("r2_q4", "Nguyễn Ái Quốc đã tìm thấy con đường cứu nước nhờ ánh sáng của học thuyết nào?", null,
      ["Chủ nghĩa Mác – Lênin", "Chủ nghĩa Tam dân", "Tư tưởng Khai sáng", "Nho giáo"], "A",
      "Nguyễn Ái Quốc tìm thấy con đường cứu nước theo quỹ đạo cách mạng vô sản, dựa trên chủ nghĩa Mác – Lênin.",
      "Có lý luận đúng thì mới có đường lối đúng."),
    mc("r2_q5", "Tác phẩm nào (1927) được ví là cuốn cẩm nang “gieo những hạt giống đỏ đầu tiên”?", null,
      ["Bản án chế độ thực dân Pháp", "Đường Kách mệnh", "Nhật ký trong tù", "Tuyên ngôn Độc lập"], "B",
      "Đường Kách mệnh (1927) là tác phẩm Nguyễn Ái Quốc dùng để huấn luyện cán bộ, chuẩn bị về tư tưởng, chính trị cho việc thành lập Đảng.",
      "Sự ra đời của Đảng là kết quả của quá trình chuẩn bị công phu cả về tư tưởng, chính trị và tổ chức."),
    mc("r2_q6", "Cương lĩnh chính trị đầu tiên xác định phương hướng chiến lược của cách mạng Việt Nam là gì?", null,
      ["Làm cách mạng xã hội chủ nghĩa ngay", "Cải cách ôn hòa để đòi quyền lợi", "Dựa vào Pháp để đánh đổ phong kiến", "Làm tư sản dân quyền cách mạng và thổ địa cách mạng để đi tới xã hội cộng sản"], "D",
      "Trích Cương lĩnh chính trị đầu tiên (Văn kiện Đảng Toàn tập, Tập 2, tr.2).",
      "Đây là lời giải cho cuộc khủng hoảng đường lối kéo dài nhiều thập kỷ."),
    mc("r2_q7", "Lần đầu tiên, cách mạng Việt Nam xác định được mục tiêu gắn liền những yếu tố nào?", null,
      ["Độc lập dân tộc với chủ nghĩa xã hội", "Cải cách ruộng đất với công nghiệp hóa", "Dân chủ với tư bản chủ nghĩa", "Quân chủ lập hiến với độc lập"], "A",
      "Gắn giải phóng dân tộc với định hướng tiến lên chủ nghĩa xã hội là sáng tạo lý luận xuất sắc, phù hợp thực tiễn Việt Nam.",
      "Một lựa chọn mang tính thời đại."),
    mc("r2_q8", "Đỉnh cao của cao trào cách mạng 1930 – 1931 là gì?", null,
      ["Khởi nghĩa Bắc Sơn", "Khởi nghĩa Nam Kỳ", "Xô viết Nghệ – Tĩnh", "Tổng khởi nghĩa tháng Tám"], "C",
      "Xô viết Nghệ – Tĩnh là đỉnh cao của cuộc tập dượt đầu tiên; khối liên minh công – nông được xác lập vững chắc.",
      "Dù bị đàn áp đẫm máu, phong trào khẳng định đường lối của Đảng là đúng đắn."),
    mc("r2_q9", "Thành quả nổi bật của cuộc vận động dân chủ 1936 – 1939 là gì?", null,
      ["Giành chính quyền ở nhiều địa phương", "Xây dựng được đội quân chính trị quần chúng lên tới hàng triệu người", "Thành lập Mặt trận Việt Minh", "Đánh đuổi được thực dân Pháp"], "B",
      "Đảng giác ngộ, tập hợp được đạo quân chính trị hàng triệu người và tích lũy kinh nghiệm đấu tranh công khai, hợp pháp.",
      "Lực lượng được chuẩn bị từ sớm là nền tảng cho thắng lợi về sau."),
    mc("r2_q10", "Tháng 8/1945, Đảng chớp “thời cơ ngàn năm có một” nào để phát động Tổng khởi nghĩa?", null,
      ["Pháp đầu hàng Đức", "Chiến tranh thế giới thứ hai bùng nổ", "Nhật đảo chính Pháp", "Phát xít Nhật đầu hàng Đồng minh"], "D",
      "Khi phát xít Nhật đầu hàng Đồng minh, Đảng phát động Tổng khởi nghĩa giành chính quyền trên toàn quốc.",
      "Thời cơ chỉ có ý nghĩa với lực lượng đã chuẩn bị sẵn sàng.")
  ],

  // ================= VÒNG 3: VẬN DỤNG HAY CẦN TRÁNH (thực tiễn) =================
  3: [
    bin("r3_q1", "Nhóm làm bài tập lớn chia việc rõ ràng, mỗi người phát huy thế mạnh riêng nhưng cùng hướng tới một mục tiêu chung.", true,
      "Đây là tinh thần đại đoàn kết: quy tụ mọi lực lượng vào mục tiêu chung, như Mặt trận Việt Minh quy tụ toàn dân.",
      "Sức mạnh đến từ đoàn kết có tổ chức và có mục tiêu thống nhất."),
    bin("r3_q2", "Thành viên nào có ý kiến khác với nhóm trưởng thì bị gạt ra khỏi các buổi thảo luận.", false,
      "Gạt bỏ ý kiến khác làm tổ chức chia rẽ, mất đi sức mạnh tập thể.",
      "Đảng ra đời từ việc hợp nhất các tổ chức cộng sản, khắc phục sự chia rẽ — đoàn kết là điều kiện tiên quyết."),
    bin("r3_q3", "Chuẩn bị kiến thức, kỹ năng và hồ sơ từ sớm để khi có cơ hội thực tập hay học bổng thì nắm bắt được ngay.", true,
      "Giống 15 năm Đảng chuẩn bị lực lượng để khi thời cơ đến (8/1945) thì chớp được ngay.",
      "Thời cơ chỉ đến với người đã chuẩn bị."),
    bin("r3_q4", "Đợi đến khi có “thời cơ” rõ ràng rồi mới bắt đầu ôn thi và rèn luyện kỹ năng.", false,
      "Không có chuẩn bị thì khi thời cơ đến cũng không thể tận dụng.",
      "Cách mạng Tháng Tám thành công nhờ cả thời cơ lẫn quá trình chuẩn bị lâu dài."),
    bin("r3_q5", "Biết phương pháp học hiện tại không hiệu quả nhưng vẫn giữ nguyên vì “đã quen rồi”.", false,
      "Các phong trào trước 1930 rất cố gắng nhưng thất bại vì phương pháp và đường lối không phù hợp.",
      "Sai đường lối thì càng cố gắng càng bế tắc — phải dám thay đổi."),
    bin("r3_q6", "Khi hoàn cảnh thay đổi (chuyển sang học online, thay đổi lịch thi), chủ động điều chỉnh kế hoạch học tập cho phù hợp.", true,
      "Giống cách Đảng linh hoạt chuyển hướng chỉ đạo chiến lược năm 1936 và 1941 theo tình hình mới.",
      "Kiên định mục tiêu, linh hoạt phương pháp."),
    bin("r3_q7", "Trước khi làm dự án khởi nghiệp, nhóm khảo sát nhu cầu thực tế của người dùng thay vì chỉ làm theo suy nghĩ chủ quan.", true,
      "Đảng thành công vì bám rễ sâu trong quần chúng, xuất phát từ thực tiễn Việt Nam.",
      "Mọi đường lối đúng đều bắt đầu từ việc hiểu đúng thực tiễn."),
    bin("r3_q8", "Chia sẻ lên mạng xã hội bài viết xuyên tạc lịch sử Đảng mà không kiểm chứng nguồn.", false,
      "Lan truyền thông tin sai lệch làm méo mó lịch sử và gây hoang mang dư luận.",
      "Người học lịch sử cần kiểm chứng nguồn và có bản lĩnh trước thông tin sai lệch."),
    bin("r3_q9", "Tích cực tham gia hoạt động tình nguyện, phong trào Đoàn vì cộng đồng.", true,
      "Đây là cách thanh niên thể hiện tinh thần yêu nước và vai trò tiên phong bằng hành động cụ thể.",
      "Tiên phong không phải danh hiệu, mà là hành động gương mẫu vì cộng đồng."),
    bin("r3_q10", "Cho rằng học lịch sử là vô ích vì “đó là chuyện đã qua”.", false,
      "Lịch sử cho ta những bài học về đoàn kết, chuẩn bị, chớp thời cơ và đổi mới tư duy — vẫn còn nguyên giá trị.",
      "Hiểu quá khứ để hành động đúng ở hiện tại.")
  ],

  // ================= VÒNG 4: TỪ LỊCH SỬ ĐẾN HÔM NAY =================
  4: [
    mc("r4_q1", "Bài học nào từ năm 1930 phù hợp nhất để giải quyết tình trạng này?", null,
      ["Mỗi thành viên tiếp tục làm theo ý mình, cuối kỳ ghép lại", "Thống nhất một định hướng chung và một đầu mối điều phối, như việc hợp nhất các tổ chức cộng sản thành một Đảng", "Giải tán nhóm và để mỗi người tự làm", "Chọn ý tưởng của người học giỏi nhất, không cần bàn bạc"], "B",
      "Năm 1930, các tổ chức cộng sản hoạt động riêng rẽ gây phân tán; Hội nghị hợp nhất đã thống nhất thành một Đảng với một Cương lĩnh chung.",
      "Thống nhất tổ chức và đường lối là điều kiện để tập thể đi đến thành công.",
      { caseNum: "CASE 01", title: "Nhóm khởi nghiệp mỗi người một hướng",
        scenario: "Một nhóm 5 sinh viên làm dự án khởi nghiệp. Mỗi người tự theo một ý tưởng riêng, không ai chịu ai, sau 4 tuần dự án vẫn dậm chân tại chỗ." }),
    mc("r4_q2", "Cách xử lý nào giống với bài học từ cao trào 1936 – 1939 nhất?", null,
      ["Bỏ hẳn mục tiêu ban đầu vì quá khó", "Phản đối gay gắt, không chịu điều chỉnh gì", "Chuyển sang những hoạt động phù hợp quy định để duy trì và mở rộng thành viên, vẫn giữ mục tiêu lâu dài", "Hoạt động lén lút, bất chấp quy định"], "C",
      "Năm 1936 – 1939, Đảng tận dụng điều kiện mới để đấu tranh công khai, hợp pháp, đòi dân sinh dân chủ, qua đó xây dựng lực lượng hàng triệu người.",
      "Linh hoạt về hình thức, kiên định về mục tiêu.",
      { caseNum: "CASE 02", title: "Câu lạc bộ trước quy định mới",
        scenario: "Một câu lạc bộ sinh viên muốn tổ chức chuỗi sự kiện lớn, nhưng nhà trường vừa ban hành quy định mới khiến kế hoạch ban đầu chưa thể thực hiện ngay." }),
    mc("r4_q3", "Phản biện nào đúng và đầy đủ nhất?", null,
      ["Đồng ý, vì nếu Nhật không đầu hàng thì không có cách mạng", "Thời cơ khách quan là quan trọng, nhưng thắng lợi là kết quả của 15 năm chuẩn bị lực lượng và năng lực chớp đúng thời cơ của Đảng", "Cách mạng thành công hoàn toàn nhờ sự giúp đỡ của Đồng minh", "Thời cơ không có vai trò gì, chỉ cần quyết tâm"], "B",
      "Thời cơ đến với cả khu vực, nhưng chỉ lực lượng đã được chuẩn bị qua 3 cao trào, với Mặt trận Việt Minh và đường lối đúng, mới chớp được thời cơ.",
      "Nhìn lịch sử toàn diện: kết hợp yếu tố khách quan và chủ quan.",
      { caseNum: "CASE 03", title: "Bình luận chỉ nhờ may mắn",
        scenario: "Trên mạng xã hội có bình luận: “Cách mạng Tháng Tám thành công chỉ là nhờ may mắn vì Nhật đầu hàng.”" }),
    mc("r4_q4", "Bài học từ Cương lĩnh chính trị đầu tiên gợi ý cách làm nào?", null,
      ["Sao chép nguyên vẹn mô hình nước ngoài", "Chỉ làm theo kinh nghiệm cũ trong nước", "Tiếp thu cái tiến bộ của thế giới nhưng vận dụng sáng tạo cho phù hợp điều kiện cụ thể của Việt Nam", "Từ chối mọi kinh nghiệm bên ngoài"], "C",
      "Cương lĩnh vận dụng sáng tạo chủ nghĩa Mác – Lênin vào hoàn cảnh một nước thuộc địa, gắn giải phóng dân tộc với chủ nghĩa xã hội.",
      "Lý luận đúng phải gắn với thực tiễn cụ thể.",
      { caseNum: "CASE 04", title: "Học hỏi mô hình nước ngoài",
        scenario: "Một startup Việt muốn áp dụng mô hình kinh doanh rất thành công ở nước ngoài vào thị trường Việt Nam." }),
    mc("r4_q5", "Theo bạn, thanh niên hôm nay thể hiện tinh thần “tiên phong” đúng nhất bằng cách nào?", null,
      ["Học tập nghiêm túc, đổi mới sáng tạo, gương mẫu trong hành động và có trách nhiệm với cộng đồng", "Nổi tiếng trên mạng xã hội là đủ", "Tiên phong là việc của thế hệ trước", "Chỉ cần phát biểu hay trong các buổi họp"], "A",
      "Đảng trở thành tổ chức tiên phong nhờ hành động thực tiễn, bám sát quần chúng và dám đi đầu trong khó khăn.",
      "Tiên phong được khẳng định bằng hành động, không phải bằng lời nói.",
      { caseNum: "CASE 05", title: "Tinh thần tiên phong của thanh niên",
        scenario: "Bài thuyết trình kết luận: qua 15 năm, Đảng đã trở thành tổ chức tiên phong đích thực." })
  ]
};

const tie = (id, n, title, scenario, question, options, correct, why, lesson) => {
  const q = mc(id, question, null, options, correct, why, lesson);
  return { id, badge: `CÂU HỎI PHỤ 0${n}`, title, scenario, question, options: q.options, correct, explanation: q.explanation };
};

export const TIE_BREAKER_QUESTIONS = [
  tie("tie_q1", 1, "Hai mâu thuẫn cơ bản",
    "Dưới tác động của khai thác thuộc địa, xã hội Việt Nam nảy sinh hai mâu thuẫn cơ bản.",
    "Hai mâu thuẫn cơ bản đó là gì?",
    ["Công nhân với tư sản; nông dân với địa chủ", "Dân tộc Việt Nam với thực dân Pháp; nhân dân lao động (chủ yếu là nông dân) với địa chủ phong kiến", "Tư sản với địa chủ; công nhân với thực dân", "Triều đình với nhân dân; Pháp với Nhật"], "B",
    "Trong đó, mâu thuẫn dân tộc là mâu thuẫn chủ yếu nhất.",
    "Hiểu đúng mâu thuẫn để xác định đúng nhiệm vụ cách mạng."),
  tie("tie_q2", 2, "Sự kết hợp tất yếu",
    "Phần kết luận khẳng định sự ra đời của Đảng không phải là hiện tượng ngẫu nhiên.",
    "Đảng Cộng sản Việt Nam ra đời là sản phẩm kết hợp của những yếu tố nào?",
    ["Chủ nghĩa Mác – Lênin, phong trào công nhân và phong trào yêu nước Việt Nam", "Phong trào nông dân và phong trào tư sản", "Tư tưởng phong kiến và tư tưởng dân chủ", "Sự giúp đỡ của nước ngoài và phong trào sinh viên"], "A",
    "Sự kết hợp ba yếu tố này là kết quả tất yếu của lịch sử Việt Nam đầu thế kỷ XX.",
    "Đảng ra đời từ chính thực tiễn đấu tranh của dân tộc."),
  tie("tie_q3", 3, "Ba cuộc diễn tập",
    "Theo Chương 2 của Giáo trình, Đảng đã rèn luyện mình qua 3 “cuộc diễn tập” lớn.",
    "Thứ tự đúng của ba cao trào là gì?",
    ["1936–1939 → 1930–1931 → 1939–1945", "1930–1931 → 1939–1945 → 1936–1939", "1930–1931 → 1936–1939 → 1939–1945", "1939–1945 → 1936–1939 → 1930–1931"], "C",
    "Cao trào 1930–1931 (Xô viết Nghệ – Tĩnh) → Cuộc vận động dân chủ 1936–1939 → Cao trào giải phóng dân tộc 1939–1945.",
    "Mỗi cao trào là một bước trưởng thành của Đảng."),
  tie("tie_q4", 4, "Hội nghị Trung ương 8",
    "Tháng 5/1941, Hội nghị Trung ương 8 do Nguyễn Ái Quốc chủ trì.",
    "Hội nghị đã hoàn chỉnh chủ trương chuyển hướng chỉ đạo chiến lược nào?",
    ["Đặt cách mạng ruộng đất lên hàng đầu", "Đặt nhiệm vụ giải phóng dân tộc lên trên hết, trước hết và thành lập Mặt trận Việt Minh", "Đấu tranh đòi dân sinh, dân chủ", "Tập trung đấu tranh nghị trường"], "B",
    "Hội nghị đặt giải phóng dân tộc lên hàng đầu và chủ trương thành lập Mặt trận Việt Minh để đoàn kết toàn dân.",
    "Nắm đúng nhiệm vụ trọng tâm trong từng thời kỳ."),
  tie("tie_q5", 5, "Bước ngoặt vĩ đại",
    "Sự ra đời của Đảng năm 1930 được đánh giá là bước ngoặt vĩ đại của cách mạng Việt Nam.",
    "Vì sao sự ra đời của Đảng là “bước ngoặt vĩ đại”?",
    ["Vì ngay lập tức giành được độc lập", "Vì chấm dứt khủng hoảng đường lối, cách mạng có tổ chức lãnh đạo thống nhất và đường lối đúng đắn", "Vì kết thúc ách đô hộ của Pháp", "Vì thành lập được nhà nước công nông"], "B",
    "Từ đây cách mạng Việt Nam có Đảng lãnh đạo với Cương lĩnh đúng đắn, chấm dứt thời kỳ bế tắc.",
    "Có đường lối đúng và tổ chức tiên phong thì cách mạng mới đi từ thắng lợi này đến thắng lợi khác.")
];
