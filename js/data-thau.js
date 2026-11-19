/* Dữ liệu MỚI của phân hệ Thầu (MS18, MS19) (`thau`) — T77 S3 (D-129). BA của phân hệ sửa tệp này, không thêm vào js/data.js.
   Nạp ngay sau data.js / sx-data.js (index.html), trước flow.js và các màn: đọc / bổ sung window.D được.
   Mẫu:
     D.menu.find((g) => g.label === "<nhóm menu>").children.push({ label: "<mục mới>", path: "<route>" });
     D.openPoints["P-THAU-01"] = { scr: "SCR-…", q: "<câu hỏi>", def: "GIẢ LẬP …" };
   Màn mới đăng ký route ở tệp màn của phân hệ: (window.AppRoutes = window.AppRoutes || []).push({ match, active, render, app }) — xem js/app.js. */
(function () {
  const D = window.D;
  /* T80 L6 (QC-12869 Điều 2 khoản 27, 28; Điều 47 khoản 4): chứng chỉ đào tạo về đấu thầu của người có thể tham gia Tổ chuyên gia / Tổ thẩm định —
     [số, ngày cấp, loại]. Trong thời gian Tập đoàn chưa ban hành chứng chỉ nội bộ, chứng chỉ đào tạo / hành nghề đấu thầu khác được dùng (Điều 47 khoản 4).
     GIẢ LẬP — nguồn thật chưa rõ (P-THAU-03). Người không có trong danh sách = chưa có chứng chỉ. */
  D.lcCert = {
    'Hoàng Quốc Bình': ['CC-ĐT-2025-0142', '12/03/2025', 'Chứng chỉ đào tạo về đấu thầu'], 'Kiều Thị Loan': ['CC-ĐT-2025-0188', '20/05/2025', 'Chứng chỉ đào tạo về đấu thầu'],
    'Phí Đức Long': ['HN-ĐT-0311', '08/11/2024', 'Chứng chỉ hành nghề hoạt động đấu thầu'], 'Ninh Thị Hồng': ['CC-ĐT-2025-0203', '20/05/2025', 'Chứng chỉ đào tạo về đấu thầu'],
    'Phạm Thị Lan': ['CC-ĐT-2024-0977', '16/10/2024', 'Chứng chỉ đào tạo về đấu thầu'], 'Đinh Thị Mai': ['CC-ĐT-2025-0215', '20/05/2025', 'Chứng chỉ đào tạo về đấu thầu'],
    'Mạc Văn Kiên': ['CC-ĐT-2024-0912', '16/10/2024', 'Chứng chỉ đào tạo về đấu thầu'], 'Ngô Đình Khôi': ['CC-ĐT-2023-0410', '05/06/2023', 'Chứng chỉ đào tạo về đấu thầu'],
    'Nguyễn Hữu Nam': ['CC-ĐT-2025-0101', '12/03/2025', 'Chứng chỉ đào tạo về đấu thầu'], 'Trần Thị Ngọc': ['CC-ĐT-2025-0107', '12/03/2025', 'Chứng chỉ đào tạo về đấu thầu'],
    'Lê Quang Vinh': ['HN-ĐT-0288', '22/08/2024', 'Chứng chỉ hành nghề hoạt động đấu thầu'], 'Phạm Thu Hương': ['CC-ĐT-2024-0950', '16/10/2024', 'Chứng chỉ đào tạo về đấu thầu'],
    'Đỗ Văn Khánh': ['CC-ĐT-2025-0119', '12/03/2025', 'Chứng chỉ đào tạo về đấu thầu'], 'Vũ Minh Châu': ['CC-ĐT-2025-0124', '12/03/2025', 'Chứng chỉ đào tạo về đấu thầu'],
    'Hồ Thanh Tâm': ['CC-ĐT-2024-0961', '16/10/2024', 'Chứng chỉ đào tạo về đấu thầu'],
  };
  D.openPoints['P-THAU-03'] = { scr: 'SCR-80, SCR-82', q: 'Chứng chỉ đào tạo về đấu thầu của thành viên Tổ chuyên gia / Tổ thẩm định (QC-12869 Điều 2 khoản 27, 28) lưu ở đâu — hồ sơ nhân sự (HRM / IAM), danh mục riêng của ĐTMS hay đính kèm khi lập Quyết định thành lập Tổ? Có kiểm hạn chứng chỉ không? Ai xác định "chuyên gia chuyên ngành" được miễn?',
    def: 'GIẢ LẬP: danh sách chứng chỉ theo người (D.lcCert); Tổ thẩm định KHLCNT (MS18 bước 6) và Tổ chuyên gia / Tổ thẩm định của gói (MS19 bước 1) kiểm khi xác nhận; thành viên vị trí "Thành viên – Phụ trách kỹ thuật" là chuyên gia chuyên ngành, không yêu cầu chứng chỉ.' };
  /* T80 L3 (phần thầu): thư chấp thuận HSDT và trao hợp đồng, thông tin chuyển giao — hệ thống cũ có tab Trao HĐ, TT Ký HĐ (HT-THAU-CONV); quy chế, BPMN không có. */
  D.openPoints['P-THAU-04'] = { scr: 'SCR-82', q: 'Thư chấp thuận HSDT và trao hợp đồng, thông tin chuyển giao để ký hợp đồng: phát hành ở bước nào của MS19 (BPMN-MS19 không có bước riêng), ai ký thư? Thời hạn ký kết hợp đồng, mức bảo đảm thực hiện hợp đồng mặc định là bao nhiêu? Hạn ký hợp đồng sau ngày hết hiệu lực HSDT thì chặn hay chỉ cảnh báo?',
    def: 'GIẢ LẬP: nhập ở bước 22 (cùng đăng tải KQLCNT), sinh văn bản LC-TCT, LC-CG; trường theo hệ thống cũ. Gợi ý: hoàn thiện hợp đồng 10 ngày (quốc tế 20 — Điều 27 khoản 8 điểm e), ký kết 05 ngày, bảo đảm thực hiện hợp đồng 3% (kiểm 2%–10% — Điều 44 khoản 3; gói tư vấn không yêu cầu — khoản 1). Hạn ký sau ngày hết hiệu lực HSDT: chỉ cảnh báo ở Chi tiết gói thầu.' };
  /* T80 L5: gia hạn đóng thầu khi chỉ có 01 HSDT (QC-12869 Điều 36 khoản 5) — BPMN-MS19 không có nhánh. */
  /* T80 L4: mã gói thầu trên SAP ở thẻ Mốc văn bản (SCR-82) — hệ thống cũ nhập tay (HT-THAU-VID §3.2 mốc 6). */
  D.openPoints['P-THAU-02'] = { scr: 'SCR-82', q: 'Mã gói thầu trên SAP: SAP sinh khi nào (sau phê duyệt KHLCNT hay khi tạo hợp đồng), ĐTMS nhận qua đồng bộ hay người dùng nhập tay như hệ thống cũ?',
    def: 'GIẢ LẬP: đồng bộ từ SAP như mã KHLCNT trên SAP (SCR-80); thẻ Mốc văn bản chỉ hiển thị, chưa có thì để trống. Gói Mật: không tạo mã SAP (theo hệ thống cũ — HT-THAU-CONV; quy chế không quy định, cần BA / TTMS xác nhận); không đăng tải thì có căn cứ QC-12869 Điều 7 khoản 1.' };
  D.openPoints['P-THAU-01'] = { scr: 'SCR-82', q: 'Đóng thầu chỉ có 01 HSDT, Chủ đầu tư chọn gia hạn (Điều 36 khoản 5 điểm a): BPMN-MS19 không có nhánh quay lại chờ thời điểm đóng thầu mới. Ai quyết định (Chủ đầu tư ký văn bản gia hạn?) và hệ thống có tự nhận HSDT mới từ Cổng đấu thầu không?',
    def: 'GIẢ LẬP: eForm 3.4 có nhóm Xử lý tình huống (gia hạn / mở thầu ngay); gia hạn thì cổng sau 3.4 mở lại bước 3.4, ghi một dòng vào tab Tình huống & kiến nghị; thời điểm đóng thầu mới cách ít nhất 03 ngày làm việc (kiểm khi xác nhận). Đề xuất DX-20 cho BA.' };
  /* T80 L1 (D-132 Q3 = A) — gói thầu đã có KQLCNT trước khi dùng ĐTMS (năm 2025, chuyển đổi từ hệ thống cũ), làm gói tham chiếu cho mua sắm trực tiếp
     (QC-12869 Điều 15 khoản 1–2). Gói có KQLCNT trong ĐTMS lấy thẳng từ danh sách gói thầu; hai danh sách gộp ở Thau.lcRefPkgs.
     rank = danh sách xếp hạng nhà thầu [mã, giá dự thầu tỷ đồng] (Điều 15 khoản 3); items = [hạng mục, đơn vị, khối lượng, đơn giá triệu đồng chưa thuế]. */
  D.lcPriorPkgs = [
    { code: 'GT-2025-0207', name: 'Dịch vụ vận chuyển, lưu kho hàng nhập khẩu năm 2025', form: 'DTRR', kq: ['1127/QĐ-VHT', '15/12/2025'],
      rank: [['NCC-000005', 1.03], ['NCC-000004', 1.09]],
      items: [['Vận chuyển cảng Hải Phòng – Hoà Lạc', 'Chuyến', 5, 110], ['Lưu kho ngoại quan', 'Tháng', 4, 120]] },
    { code: 'GT-2025-0118', name: 'Cung cấp bản quyền phần mềm điều khiển đo', form: 'DTHC', kq: ['0912/QĐ-VHT', '14/11/2025'],
      rank: [['NCC-000001', 10.4], ['NCC-000012', 11.2]],
      items: [['Bản quyền mô-đun đo trường xa', 'Bản quyền', 5, 2050]] },
  ];
})();
