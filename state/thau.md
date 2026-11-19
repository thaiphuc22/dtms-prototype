# State — Thầu (MS18, MS19) (`thau`)

> State riêng của phân hệ, BA của phân hệ giữ. Cập nhật **Now** cuối mỗi pha (PLAN → BUILD → VERIFY) để phiên sau tiếp được.
> Hook đầu phiên chèn mục Now khi bạn ở nhánh `thau/<việc>`. Giữ ngắn: việc xong thì gom một dòng vào "Đã xong".

**Chủ phân hệ:** (chưa giao — người tích hợp giữ)
**Tiền tố số mới:** điểm treo `P-THAU-01`…, đề xuất `DX-THAU-01`…, quyết định chờ chốt `Q-THAU-01`…, màn mới `SCR-THAU-01`…

## Now

**2026-11-19 — T80 L3 phần thầu xong (cùng nhánh, chưa PR):** biên bản thương thảo dạng bảng; bước 22 thư chấp thuận HSDT và trao hợp đồng + thông tin chuyển giao (P-THAU-04), văn bản LC-TCT, LC-CG; thẻ ở tab Đánh giá & KQLCNT, Mốc văn bản. Tiếp: L7 (nhánh `quan-tri/t80-ncc`), L3 phần hợp đồng sau T79.

**2026-11-19 — T80 L4b + L5b xong (cùng nhánh, chưa PR):** gói Mật không đăng tải (Điều 7 khoản 1) — SCR-94 bỏ gói mật, Mốc văn bản ghi không đăng tải / không tạo SAP; cờ Mật chuyển GT-2026-0024 → GT-2026-0031; bước 3.4 thêm số tờ trình xử lý tình huống, số công văn gia hạn, văn bản LC-XLTH. Tiếp: L3 (phần thầu).

**2026-11-19 — T80 L2b + L9 xong (cùng nhánh, chưa PR):** HSMT thêm hiệu lực HSDT (≤ 180 ngày), hiệu lực bảo đảm = + 30 ngày, năng lực kinh nghiệm, tỷ lệ khối lượng; đánh giá kiểm hiệu lực HSDT (Phụ lục 2) và ưu đãi xếp hạng khi ngang nhau (Điều 31.5). Tiếp: L4b + L5b.

**2026-11-19 — T80 L6 xong (cùng nhánh, chưa PR):** Tổ chuyên gia / Tổ thẩm định — vị trí, phân công, chứng chỉ đào tạo về đấu thầu (Điều 2 khoản 27, 28), kiểm ở MS19 bước 1 và MS18 bước 6 (P-THAU-03). Plan bổ sung theo HT-THAU-CONV (L2b, L4b, L5b, L9, L3). Tiếp: L2b + L9.

**2026-11-19 — T80 L4 xong (cùng nhánh, chưa PR):** thẻ Mốc văn bản ở tab Thông tin chung SCR-82 — chỉ xem, đọc lại số / ngày từ KHLCNT, MS19, tin công khai, KQLCNT; mã gói SAP GIẢ LẬP (P-THAU-02). Tiếp: L6 Tổ chuyên gia (phân công, chứng chỉ).

**2026-11-19 — T80 L5 xong (cùng nhánh, chưa PR):** tình huống 01 HSDT khi đóng thầu (Điều 36 khoản 5) — gia hạn ≥ 03 ngày làm việc / mở thầu ngay ở bước 3.4, cổng `g34` (DX-20, P-THAU-01). Tiếp: L4 mốc văn bản.

**2026-11-19 — T80 L2 xong (cùng nhánh, chưa PR):** báo cáo đánh giá theo Điều 32 — giá sau sửa lỗi, hiệu chỉnh sai lệch, trừ giảm giá; xếp hạng theo phương pháp HSMT; lý do không đạt bắt buộc (Điều 33.3); tỷ trọng điểm kỹ thuật (Điều 32.4b). Tiếp: L5 tình huống 01 HSDT (Điều 36 khoản 5).

**2026-11-19 — T80 L1 xong (nhánh `thau/t80-ht-cu`, chưa PR):** mua sắm trực tiếp theo Điều 15 (7.6 → 7.5 → 7.4, G7 mời nhà thầu xếp hạng tiếp theo) và chỉ định thầu rút gọn theo Điều 16 khoản 5 (7.5 → 7.4). DX-19, sửa P-235. Tiếp: L2 báo cáo đánh giá (Điều 32). Plan cds-vht `docs/dtms/prototype-T80-thau-ht-cu-1911.md`.

## Việc đang làm

| Nhánh | Việc | Pha | PR |
|---|---|---|---|
| `thau/t80-ht-cu` | T80 — bổ sung theo HT-THAU-VID + QC-12869 (L1, L2, L5, L4, L6, L2b, L9, L4b, L5b, L3 phần thầu xong) | BUILD | — |

## Quyết định chờ người tích hợp chốt

<!-- Q-THAU-01 — câu hỏi; phương án; đề xuất. Người tích hợp duyệt → thành D-xxx trong STATE.md của cds-vht, ghi mã D ở đây. -->

## Đã xong

