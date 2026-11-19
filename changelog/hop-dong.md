# Nhật ký — Hợp đồng (MS22–MS24) (`hop-dong`)

> Mỗi PR một mục, mới nhất trên cùng: `## YYYY-MM-DD — <việc> (#PR)` + 2–5 gạch đầu dòng (màn, thay đổi, nguồn, điểm treo mới).
> Lịch sử trước T77: [lich-su-chung.md](lich-su-chung.md).

## 2026-11-19 — T79 phần còn lại so với hệ thống cũ (file Convert 19/11, D-131)

- SCR-84: cột Số hợp đồng, Đồng tiền ký; lọc Phân loại (Hợp đồng · Đơn hàng PO · Thỏa thuận khung — gộp dòng SCR-87), Nguồn hình thành, ngày ký PAC / FAC tách riêng.
- SCR-85: Nguồn hình thành Tờ trình / ĐXMS theo đề xuất DX-17 (ĐXMS chưa vào KHLCNT hoặc phần không áp dụng LCNT của KHLCNT); Người chuyển tiền, Đầu mối dự án / KCS, File CTKT, Ghi chú (sửa ở MS22 bước 1).
- SCR-86: PAC / FAC có nguồn (QT-10.2.5, DG-MS23.03 — đóng P-272), Mốc biên bản 4 dòng + Thời hạn theo hợp đồng; Loại chi phí; ID hàng hóa, Mô tả; card Hóa đơn (MS24 bước 5); card Xuất nhập khẩu (DX-18); Hàng hóa đã nhận lọc đợt / từ khóa + hãng, xuất xứ, đơn giá, Mã tài sản (SAP); Tài liệu thêm Ngày sao CC/CT, Ghi chú, Xuất Excel.
- eForm: MS22 bước 1 (người phụ trách), MS23.02 bước 3 (nhóm XNK, ẩn khi không nhập khẩu), MS24 bước 5 (ngày hoá đơn, nhiều hoá đơn).
- Điểm treo mới P-HD-01…P-HD-06 (`js/data-hop-dong.js`); e2e mới `hop-dong-t79.spec.mjs`. Giữ D-43 (không cột Thao tác).
