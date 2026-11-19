# Nhật ký — Quản trị (quy trình, ma trận, eForm, DMDC, thông báo, trình ký) (`quan-tri`)

> Mỗi PR một mục, mới nhất trên cùng: `## YYYY-MM-DD — <việc> (#PR)` + 2–5 gạch đầu dòng (màn, thay đổi, nguồn, điểm treo mới).
> Lịch sử trước T77: [lich-su-chung.md](lich-su-chung.md).

## 2026-11-19 — T80 L7: SCR-31 Nhà cung cấp — liên danh, người đại diện

- Hộp thoại Thêm mới / Chỉnh sửa / Xem: **Nhà thầu liên danh** (Không / Có) → **Thành viên liên danh** (ít nhất 02, chọn từ chính danh mục, không chọn nhà thầu liên danh khác) và **Thành viên đứng đầu liên danh** (trong số thành viên) — QC-12869 Điều 24 khoản 4; liên danh không bắt buộc mã số thuế riêng.
- Trường theo Danh mục Đối tác hệ thống cũ (HT-THAU-VID §5): Người đại diện, Chức vụ người đại diện (mặc định "Giám đốc"), Số đăng ký kinh doanh, Ngày thành lập, Tài khoản ngân hàng, Fax; dữ liệu giả cho 12 nhà cung cấp mẫu.
- Danh sách thêm cột Người đại diện (kèm chức vụ), Liên danh.
- Khuôn hộp thoại DMDC: ô chọn phụ thuộc ô khác được vẽ lại cả khi có `onChange` (trừ ô vừa đổi); ẩn ô chọn ngày gốc của trình duyệt (trước lộ dưới trường ngày, cả ở Ngưỡng phân luồng).
- e2e mới `dmdc-t80-ncc` 2 ca; `dmdc` cập nhật cột.
