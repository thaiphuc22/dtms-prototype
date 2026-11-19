/* Dữ liệu MỚI của phân hệ Hợp đồng (MS22–MS24) (`hop-dong`) — T77 S3 (D-129). BA của phân hệ sửa tệp này, không thêm vào js/data.js.
   Nạp ngay sau data.js / sx-data.js (index.html), trước flow.js và các màn: đọc / bổ sung window.D được.
   Mẫu:
     D.menu.find((g) => g.label === "<nhóm menu>").children.push({ label: "<mục mới>", path: "<route>" });
     D.openPoints["P-HD-01"] = { scr: "SCR-…", q: "<câu hỏi>", def: "GIẢ LẬP …" };
   Màn mới đăng ký route ở tệp màn của phân hệ: (window.AppRoutes = window.AppRoutes || []).push({ match, active, render }) — xem js/app.js. */
(function () {
  const D = window.D; // eslint-disable-line no-unused-vars
  /* T79 (D-131): điểm treo mới của phân hệ Hợp đồng — phần còn lại so với hệ thống cũ (file Convert 19/11, ảnh HT-HD-IMG2). */
  Object.assign(D.openPoints, {
    'P-HD-01': { scr: 'SCR-86', src: 'HT-HD-IMG2 6525; DX-18', q: 'Xuất nhập khẩu: quy trình mới chưa có bước ghi tờ khai hải quan, thuế nhập khẩu, giấy phép nhập khẩu, giấy xác nhận hàng ANQP, chứng nhận người sử dụng cuối cùng — ai nhập, ở bước nào, hợp đồng nào phải có',
      def: 'GIẢ LẬP — theo đề xuất DX-18: nhóm trường XNK trong eForm bước giao nhận MS23.02 (Phòng Hợp đồng nhập khi hàng thông quan), hiện khi nhà thầu nước ngoài hoặc mẫu hợp đồng 9 / 10; dữ liệu mẫu (số tờ khai, thuế NK 5%, CO / CQ bản sao) suy từ hợp đồng' },
    'P-HD-02': { scr: 'SCR-86', src: 'HT-HD-IMG2 6521, 6534', q: 'Mã tài sản của hàng hoá đã nhận: lấy từ SAP / phân hệ QLTS sau ghi tăng hay ĐTMS cấp; đồng bộ lúc nào',
      def: 'GIẢ LẬP — chỉ xem, đồng bộ từ SAP sau khi ghi tăng (có nghiệm thu Đạt của đợt); chưa ghi tăng hiện "Chưa ghi tăng"; dịch vụ "Không áp dụng". Tích hợp SAP chưa giao PIC' },
    'P-HD-03': { scr: 'SCR-85', src: 'HT-HD-IMG2 6507, 6508, 6540; DX-17', q: 'Hợp đồng không qua LCNT (từ tờ trình / ĐXMS đã phê duyệt + khoản mục chi phí): những trường hợp nào được phép, giới hạn giá trị, ai duyệt',
      def: 'GIẢ LẬP — theo đề xuất DX-17: chọn ĐXMS đã phê duyệt chưa đưa vào KHLCNT, hoặc phần công việc không áp dụng LCNT của KHLCNT (Điều 23 khoản 2 điểm e — BM01); giá trị hợp đồng không vượt giá trị ĐXMS / phần đó; nhà thầu chọn từ danh mục; khoản mục chi phí chọn trong danh sách cố định (chưa có danh mục khoản mục của ĐXMS)' },
    'P-HD-04': { scr: 'SCR-85, SCR-86', src: 'HT-HD-IMG2 6507, 6512; DG-MS24; DG-MS23.03', q: 'Người chuyển tiền, Đầu mối dự án / đơn vị, Đầu mối KCS: chọn theo người cụ thể hay theo vai trò của ma trận; danh sách người được chọn',
      def: 'GIẢ LẬP — chọn ở SCR-85 (sửa ở MS22 bước 1): Người chuyển tiền trong nhân sự Phòng Hợp đồng; Đầu mối dự án là người của đơn vị sử dụng; Đầu mối KCS = Phòng Đảm bảo hàng hóa (hàng hoá) hoặc Đơn vị sử dụng (dịch vụ). Hợp đồng mẫu lấy theo persona' },
    'P-HD-05': { scr: 'SCR-86', src: 'HT-HD-IMG2 6512, 6518', q: 'Loại chi phí của dòng phân bổ: là thuộc tính của khoản mục chi phí (danh mục) hay của đề tài / dự án; danh sách giá trị',
      def: 'GIẢ LẬP — ánh xạ theo loại đề tài / dự án: KHCN → Chi phí nghiên cứu KHCN; Hoạt động TX → Chi phí hoạt động thường xuyên; Dự án đầu tư → Chi phí đầu tư; SXKD → Chi phí sản xuất kinh doanh' },
    'P-HD-06': { scr: 'SCR-84, SCR-86', src: 'QT-10.2.5; DG-MS23.03; HT-HD-IMG2 6524', q: 'Mức nghiệm thu PAC / FAC của từng hợp đồng và thời hạn ký từng biên bản: AI trích từ điều khoản hợp đồng hay chọn theo mẫu hợp đồng',
      def: 'GIẢ LẬP — mức nghiệm thu là trường của hợp đồng (AI trích ở MS23, sửa được — D-131 Q3): hàng hoá cần lắp đặt / tích hợp → PAC → FAC, hàng hoá khác → FAC, dịch vụ → nghiệm thu dịch vụ; thời hạn: PAC 15 ngày từ HOC, FAC theo mốc nghiệm thu tổng thể, thanh lý 30 ngày từ khi hết hạn hợp đồng' },
  });
})();
