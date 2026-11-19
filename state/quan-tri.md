# State — Quản trị (quy trình, ma trận, eForm, DMDC, thông báo, trình ký) (`quan-tri`)

> State riêng của phân hệ, BA của phân hệ giữ. Cập nhật **Now** cuối mỗi pha (PLAN → BUILD → VERIFY) để phiên sau tiếp được.
> Hook đầu phiên chèn mục Now khi bạn ở nhánh `quan-tri/<việc>`. Giữ ngắn: việc xong thì gom một dòng vào "Đã xong".

**Chủ phân hệ:** (chưa giao — người tích hợp giữ)
**Tiền tố số mới:** điểm treo `P-QT-01`…, đề xuất `DX-QT-01`…, quyết định chờ chốt `Q-QT-01`…, màn mới `SCR-QT-01`…

## Now

**2026-11-19 — T80 L7 xong (nhánh `quan-tri/t80-ncc`, chưa commit):** SCR-31 Nhà cung cấp thêm liên danh (Điều 24 khoản 4) và người đại diện, chức vụ, đăng ký kinh doanh, ngày thành lập, tài khoản ngân hàng, fax (HT-THAU-VID §5). Chờ người dùng duyệt để commit / PR.

## Việc đang làm

| Nhánh | Việc | Pha | PR |
|---|---|---|---|
| `quan-tri/t80-ncc` | T80 L7 — SCR-31 Nhà cung cấp: liên danh, người đại diện, trường hệ thống cũ | VERIFY | — |

## Quyết định chờ người tích hợp chốt

<!-- Q-QT-01 — câu hỏi; phương án; đề xuất. Người tích hợp duyệt → thành D-xxx trong STATE.md của cds-vht, ghi mã D ở đây. -->

## Đã xong

