# Nhật ký — Hợp đồng (MS22–MS24) (`hop-dong`)

> Mỗi PR một mục, mới nhất trên cùng: `## YYYY-MM-DD — <việc> (#PR)` + 2–5 gạch đầu dòng (màn, thay đổi, nguồn, điểm treo mới).
> Lịch sử trước T77: [lich-su-chung.md](lich-su-chung.md).

## 2026-11-19 — T80 L3 (phần hợp đồng): tạo hợp đồng từ thông tin chuyển giao của gói thầu

- SCR-85 (nguồn Gói thầu): gói đã qua MS19 bước 22 → thẻ chỉ xem **Thông tin chuyển giao để ký hợp đồng (từ gói thầu)**: ngày thư chấp thuận HSDT và trao hợp đồng, ký hợp đồng trước ngày, ngày hết hiệu lực HSDT, bảo đảm thực hiện hợp đồng, thời gian giao hàng, điều kiện thanh toán, người đại diện nhà thầu, bảng đầu mối (đọc `Thau.lcTrao`; GIẢ LẬP P-THAU-04 theo tab Trao HĐ / TT Ký HĐ hệ thống cũ — HT-THAU-CONV). Gói chưa có thư trao: không hiện.
- Điền sẵn: Đầu mối dự án, đơn vị = đầu mối đơn vị sử dụng của thư trao; thời gian thực hiện hợp đồng = thời gian giao hàng. Lưu bản sao `trao` vào hợp đồng.
- SCR-86 tab Đối tác: Người đại diện bên bán (thư trao → danh mục Nhà cung cấp SCR-31) + thẻ chuyển giao khi hợp đồng tạo từ gói có thư trao.
- eForm MS22: bước 4 gợi ý Người đại diện / Chức vụ nhà thầu (thư trao / biên bản thương thảo → SCR-31, vẫn sửa được — H-Q5 = B); trường trộn `so_thu_trao_hd` đọc ngày thư trao.
- e2e mới `hop-dong-t80-chuyen-giao.spec.mjs` 2 ca.

## 2026-11-19 — T79 phần còn lại so với hệ thống cũ (file Convert 19/11, D-131)

- SCR-84: cột Số hợp đồng, Đồng tiền ký; lọc Phân loại (Hợp đồng · Đơn hàng PO · Thỏa thuận khung — gộp dòng SCR-87), Nguồn hình thành, ngày ký PAC / FAC tách riêng.
- SCR-85: Nguồn hình thành Tờ trình / ĐXMS theo đề xuất DX-17 (ĐXMS chưa vào KHLCNT hoặc phần không áp dụng LCNT của KHLCNT); Người chuyển tiền, Đầu mối dự án / KCS, File CTKT, Ghi chú (sửa ở MS22 bước 1).
- SCR-86: PAC / FAC có nguồn (QT-10.2.5, DG-MS23.03 — đóng P-272), Mốc biên bản 4 dòng + Thời hạn theo hợp đồng; Loại chi phí; ID hàng hóa, Mô tả; card Hóa đơn (MS24 bước 5); card Xuất nhập khẩu (DX-18); Hàng hóa đã nhận lọc đợt / từ khóa + hãng, xuất xứ, đơn giá, Mã tài sản (SAP); Tài liệu thêm Ngày sao CC/CT, Ghi chú, Xuất Excel.
- eForm: MS22 bước 1 (người phụ trách), MS23.02 bước 3 (nhóm XNK, ẩn khi không nhập khẩu), MS24 bước 5 (ngày hoá đơn, nhiều hoá đơn).
- Điểm treo mới P-HD-01…P-HD-06 (`js/data-hop-dong.js`); e2e mới `hop-dong-t79.spec.mjs`. Giữ D-43 (không cột Thao tác).
