# State — Thầu (MS18, MS19) (`thau`)

> State riêng của phân hệ, BA của phân hệ giữ. Cập nhật **Now** cuối mỗi pha (PLAN → BUILD → VERIFY) để phiên sau tiếp được.
> Hook đầu phiên chèn mục Now khi bạn ở nhánh `thau/<việc>`. Giữ ngắn: việc xong thì gom một dòng vào "Đã xong".

**Chủ phân hệ:** (chưa giao — người tích hợp giữ)
**Tiền tố số mới:** điểm treo `P-THAU-01`…, đề xuất `DX-THAU-01`…, quyết định chờ chốt `Q-THAU-01`…, màn mới `SCR-THAU-01`…

## Now

**2026-11-19 — T80 người đại diện nhà thầu vào biên bản thương thảo (nhánh `thau/t80-dai-dien`, chưa PR):** eForm 3.6 / 7.4 hiện Người đại diện, Chức vụ của nhà thầu đang chọn (đọc danh mục SCR-31, lọc FEEL `nccRep[item.ma = lcNhaThau]`), cảnh báo khi danh mục chưa khai báo; ghi `lcDaiDienNt`, `lcChucVuNt`; LC-BBTT in dòng Đại diện nhà thầu; bước 22 gợi ý Đầu mối nhà thầu = người đại diện. e2e `t80-trao-hd` mở rộng. Tiếp: L3 phần hợp đồng (phân hệ `hop-dong`) sau khi T79 merge.

## Việc đang làm

| Nhánh | Việc | Pha | PR |
|---|---|---|---|
| `thau/t80-dai-dien` | T80 — người đại diện / chức vụ nhà thầu vào biên bản thương thảo | BUILD xong, chưa PR | — |

## Quyết định chờ người tích hợp chốt

<!-- Q-THAU-01 — câu hỏi; phương án; đề xuất. Người tích hợp duyệt → thành D-xxx trong STATE.md của cds-vht, ghi mã D ở đây. -->

## Đã xong

- **2026-11-19 — T80 (PR #1, đã merge `bbbf9bc`):** bổ sung Thầu theo HT-THAU-VID, HT-THAU-CONV + QC-12869 — MSTT / CĐT rút gọn (Điều 15, 16.5; DX-19), BCĐG (Điều 32, 33), tình huống 01 HSDT (Điều 36.5; DX-20, P-THAU-01), Mốc văn bản (P-THAU-02), Tổ chuyên gia (P-THAU-03), HSMT ưu đãi / hiệu lực HSDT, gói mật, biên bản thương thảo dạng bảng, thư trao hợp đồng + thông tin chuyển giao (P-THAU-04). Chi tiết `changelog/thau.md`.

