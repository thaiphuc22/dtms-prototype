# Nhật ký — Thầu (MS18, MS19) (`thau`)

> Mỗi PR một mục, mới nhất trên cùng: `## YYYY-MM-DD — <việc> (#PR)` + 2–5 gạch đầu dòng (màn, thay đổi, nguồn, điểm treo mới).
> Lịch sử trước T77: [lich-su-chung.md](lich-su-chung.md).

## 2026-11-19 — T80: người đại diện nhà thầu vào biên bản thương thảo

- eForm thương thảo (3.6 / 7.4): bảng chỉ xem **Đại diện nhà thầu** (Người đại diện, Chức vụ) đọc danh mục Nhà cung cấp SCR-31 (trường thêm ở T80 L7, HT-THAU-VID §5) theo nhà thầu đang chọn — lọc FEEL trên biến `nccRep`, đổi nhà thầu thì đổi theo; danh mục chưa khai báo thì cảnh báo, không chặn.
- Xác nhận ghi `lcDaiDienNt`, `lcChucVuNt` vào hồ sơ; văn bản LC-BBTT in dòng "Đại diện nhà thầu: Ông/bà … — Chức vụ: …".
- Bước 22: Đầu mối nhà thầu ở Thông tin chuyển giao gợi ý sẵn người đại diện (sửa được). Hai biến này để phần Hợp đồng điền sẵn Người đại diện / Chức vụ nhà thầu ở MS22.
- e2e `t80-trao-hd` thêm kiểm bảng đại diện, biến ghi hồ sơ, gợi ý đầu mối.

## 2026-11-19 — T80 L3 (phần thầu): biên bản thương thảo dạng bảng, thư trao hợp đồng, thông tin chuyển giao

- eForm thương thảo (3.6 / 7.4): bảng **Biên bản thương thảo** (Nội dung thương thảo · Ý kiến nhà thầu · Nội dung hai bên thống nhất đưa vào hợp đồng — theo tab BB Thương thảo của hệ thống cũ, HT-THAU-CONV), dòng gợi ý từ mẫu hợp đồng, phạm vi, tiến độ, thanh toán; thêm dòng được. Thêm **Thời gian thực hiện hợp đồng sau thương thảo**; ô nội dung tự do thành "Nội dung khác" (không bắt buộc). Văn bản LC-BBTT in bảng.
- Bước 22 (cùng đăng tải KQLCNT): **Thư chấp thuận HSDT và trao hợp đồng** (ngày thư, thời hạn hoàn thiện — gợi ý 10 / 20 ngày theo Điều 27 khoản 8 điểm e, thời hạn ký kết, bảo đảm thực hiện hợp đồng 2%–10% — Điều 44 khoản 3, gói tư vấn không yêu cầu — khoản 1) và **Thông tin chuyển giao để ký hợp đồng** (ngày bàn giao, ngày hết hiệu lực HSDT = đóng thầu + hiệu lực, đầu mối, thời gian giao hàng, điều kiện thanh toán, phân bổ giá trúng thầu theo nguồn gói). Văn bản đầu ra LC-TCT, LC-CG. GIẢ LẬP P-THAU-04.
- Chi tiết gói thầu: tab Đánh giá & KQLCNT thêm hai thẻ trên (cảnh báo khi hạn ký hợp đồng sau ngày hết hiệu lực HSDT); thẻ Mốc văn bản thêm dòng Thư chấp thuận, Bàn giao thông tin để ký hợp đồng. `Thau.lcTrao` dùng chung cho phần hợp đồng (L3 sau T79).
- e2e mới `t80-trao-hd` 2 ca.

## 2026-11-19 — T80 L4b + L5b: gói mật, tờ trình xử lý tình huống

- Gói **Mật** không đăng tải (QC-12869 Điều 7 khoản 1): SCR-94 Công khai không sinh tin cho gói mật; thẻ Mốc văn bản ghi "Không đăng tải — gói mật" (KHLCNT, TBMT, KQLCNT) và "Không tạo — gói mật" ở mã SAP (theo hệ thống cũ, GIẢ LẬP — P-THAU-02).
- Dữ liệu mẫu: cờ Mật chuyển từ GT-2026-0024 (đã có tin đăng trên mạng đấu thầu quốc gia — mâu thuẫn Điều 7) sang GT-2026-0031 (chỉ định thầu rút gọn, cùng KHLCNT anten mảng pha — Điều 16 khoản 1 điểm d).
- Bước 3.4 chỉ 01 HSDT: thêm **Số tờ trình xử lý tình huống** (cả gia hạn và mở thầu ngay) và **Số công văn gia hạn đóng thầu** (tách khỏi số thông báo gia hạn TBMT); văn bản đầu ra mới **LC-XLTH Tờ trình xử lý tình huống**; tab Tình huống & kiến nghị và thẻ Mốc văn bản ghi các số này.
- e2e: `t80-moc-van-ban` thêm ca gói mật; `t80-mot-hsdt` cập nhật.

## 2026-11-19 — T80 L9 + L2b: trường HSMT, hiệu lực HSDT, ưu đãi

- eForm Lập HSMT / HSYC (3.1 / 7.1): Thời gian có hiệu lực của HSDT (bộ xử lý hành động kiểm 1–180 ngày — QC-12869 Điều 30 khoản 4), giá trị bảo đảm dự thầu quy ra tiền và **hiệu lực bảo đảm = hiệu lực HSDT + 30 ngày** (Điều 27 khoản 4, tính trên form), giá trị HĐ tương tự, số năm tính doanh thu, doanh thu bình quân tối thiểu, tỷ lệ tăng / giảm khối lượng, thời gian sử dụng dự kiến (theo tab A-HSMT hệ thống cũ — HT-THAU-CONV; giá trị gợi ý GIẢ LẬP).
- Tab Hồ sơ mời thầu (gói chạy MS19): hiệu lực HSDT, hiệu lực bảo đảm, thời gian sử dụng; card Yêu cầu năng lực, kinh nghiệm và khối lượng.
- eForm đánh giá: hiệu lực HSDT của nhà thầu mặc định theo HSMT; ngắn hơn yêu cầu mà đánh giá hợp lệ Đạt thì bị chặn (Phụ lục 2). Ô **Thuộc đối tượng được hưởng ưu đãi** (chỉ đấu thầu rộng rãi / hạn chế): đánh giá ngang nhau thì xếp hạng cao hơn (Điều 31 khoản 5) — không cộng / trừ giá như cột "Delta ưu đãi" của hệ thống cũ.
- Tab Đánh giá & KQLCNT: cột Ưu đãi, cảnh báo hiệu lực HSDT ngắn hơn yêu cầu. e2e `t80-hsmt-uu-dai` 2 ca.

## 2026-11-19 — T80 L6: Tổ chuyên gia, Tổ thẩm định — vị trí, phân công, chứng chỉ đào tạo về đấu thầu

- SCR-82 tab Thành phần tham gia: vị trí trong Tổ theo hệ thống cũ (HT-THAU-CONV: Tổ trưởng / Tổ phó phụ trách kỹ thuật / Thành viên – Phụ trách kỹ thuật / pháp lý), **Phân công công việc**, **Chứng chỉ đào tạo về đấu thầu**; chuyên gia chuyên ngành đánh giá kỹ thuật không yêu cầu (QC-12869 Điều 2 khoản 27); card Kiểm tra thành phần tính trùng người hai Tổ và đủ chứng chỉ.
- MS19 bước 1: bảng Tổ chuyên gia và Tổ thẩm định; bộ xử lý hành động chặn khi thành viên chưa có chứng chỉ. MS18 bước 6 (Tổ thẩm định KHLCNT): chặn thành viên chưa có chứng chỉ (khoản 28); SCR-80 bảng Thành viên Tổ thẩm định thêm cột chứng chỉ.
- Dữ liệu chứng chỉ theo người `D.lcCert` (`data-thau.js`, GIẢ LẬP **P-THAU-03**); `Thau.lcTeam` dùng chung cho tab và eForm.
- e2e `t80-to-chuyen-gia` 3 ca.

## 2026-11-19 — T80 L4: thẻ Mốc văn bản (SCR-82, tab Thông tin chung)

- Bảng chỉ xem theo khung Checklist 25 mốc của hệ thống cũ (HT-THAU-VID §3.2), chỉ giữ mốc quy trình TO-BE có: QĐ / đăng tải KHLCNT, mã KHLCNT và mã gói trên SAP, phê duyệt HSMT / HSYC, đăng tải TBMT / gửi HSYC, đóng thầu (kèm lần gia hạn), biên bản mở thầu, báo cáo đánh giá, thư mời thương thảo (rút gọn / mua sắm trực tiếp), biên bản thương thảo, QĐ / đăng tải KQLCNT, quyết định huỷ thầu.
- Số / ngày đọc lại từ KHLCNT (MS18), biến hồ sơ MS19, tin công khai (SCR-94), KQLCNT, sự kiện huỷ thầu; cột Nguồn ghi bước sinh ra (bước gộp với hình thức chưa tách quy trình con). Mốc chưa tới để trống.
- Mã gói thầu trên SAP: đồng bộ SAP (GIẢ LẬP, **P-THAU-02**); dữ liệu mẫu GT-2026-0021, GT-2026-0027.
- e2e `t80-moc-van-ban` 3 ca.

## 2026-11-19 — T80 L5: chỉ có 01 HSDT khi đóng thầu (QC-12869 Điều 36 khoản 5)

- eForm 3.4: đấu thầu rộng rãi / hạn chế chỉ 01 HSDT → nhóm **Xử lý tình huống**: Gia hạn thời điểm đóng thầu (lý do, thời điểm đóng / mở thầu mới, số văn bản gia hạn TBMT) hoặc Mở thầu ngay. Bộ xử lý hành động kiểm đóng thầu mới ≥ 03 ngày làm việc, mở thầu không trước đóng thầu.
- `data.js` (dùng chung): cổng `g34` sau 3.4 — gia hạn thì mở lại 3.4, mở thầu ngay thì 3.5. BPMN-MS19 chưa có → đề xuất **DX-20**, điểm treo **P-THAU-01** (GIẢ LẬP).
- SCR-82 tab Tình huống & kiến nghị ghi dòng gia hạn / mở thầu ngay (tình huống mẫu cùng loại chuyển Đã xử lý); tiến độ gói ghi "Gia hạn đóng thầu đến …".
- e2e `t80-mot-hsdt` 2 ca.

## 2026-11-19 — T80 L2: báo cáo đánh giá hồ sơ theo QC-12869 Điều 32, 33

- eForm đánh giá 3.5 / 7.3: thêm năng lực kinh nghiệm, điểm kỹ thuật (phương pháp có điểm), sửa lỗi, hiệu chỉnh sai lệch, giá trị giảm giá, chi phí quy đổi (giá đánh giá), hiệu lực HSDT; **giá sau sửa lỗi, hiệu chỉnh sai lệch, trừ giảm giá** tính lại trên form (trường expression).
- Bộ xử lý hành động: xếp hạng nhà thầu đạt theo phương pháp của HSMT (`Thau.lcXepHang`, 5 phương pháp Điều 32; HSYC / HSMCG chỉ giá thấp nhất — khoản 7); nhà thầu không đạt bắt buộc lý do (Điều 33 khoản 3); HSMT kết hợp kỹ thuật và giá kiểm tỷ trọng điểm kỹ thuật (khoản 4 điểm b). Cách quy điểm giá của phương pháp kết hợp GIẢ LẬP.
- Thương thảo 3.6 / 7.4: mặc định nhà thầu xếp hạng 1, giá đề nghị trúng thầu = giá sau hiệu chỉnh. Văn bản LC-BCDG ghi phương pháp, giá sau hiệu chỉnh, xếp hạng / lý do.
- SCR-82 tab Đánh giá & KQLCNT (gói chạy MS19 và gói tĩnh): cột Xếp hạng, giá sau hiệu chỉnh, sửa lỗi / hiệu chỉnh / giảm giá; cảnh báo vượt giá gói theo giá sau hiệu chỉnh; card Nhà thầu không đạt và lý do. Dữ liệu mẫu thêm sửa lỗi / giảm giá cho GT-2026-0045 và 2 gói đã có KQLCNT.
- e2e `t80-bcdg` 3 ca.

## 2026-11-19 — T80 L1: mua sắm trực tiếp và chỉ định thầu rút gọn theo QC-12869 (D-132)

- MS19 quy trình con 7 tách theo hình thức: chỉ định thầu thông thường giữ 7.1–7.4 (HSYC → HSĐX); **chỉ định thầu rút gọn** 7.5 Gửi thư mời thương thảo kèm dự thảo hợp đồng → 7.4 (Điều 16 khoản 5); **mua sắm trực tiếp** 7.6 Kiểm tra điều kiện → 7.5 → 7.4, cổng G7 thương thảo không thành → mời nhà thầu xếp hạng tiếp theo của gói tham chiếu (Điều 15 khoản 2–4).
- 7.6: chọn Gói thầu tham chiếu (gói có KQLCNT trong ĐTMS + gói 2025 chuyển đổi `D.lcPriorPkgs`), bảng so sánh khối lượng / đơn giá; bộ xử lý hành động tính 4 điều kiện, không đạt thì không chuyển bước.
- SCR-82: card Gói thầu tham chiếu + kết quả kiểm tra (tab Phương án LCNT), tab Hồ sơ mời hiện Thư mời thương thảo và dự thảo hợp đồng; trình tự MSTT / CĐT RG sửa theo quy chế. Văn bản mới LC-TM.
- Dữ liệu: GT-2026-0048 đổi sang mua sắm trực tiếp (gói tham chiếu GT-2025-0207), luồng mẫu dừng ở 7.6; GT-2026-0031 luồng mẫu dừng ở 7.5.
- Đề xuất **DX-19** (BPMN-MS19 chưa có nhánh) — số bước 7.5 / 7.6 GIẢ LẬP, sửa P-235. e2e `t80-mstt` 2 ca; `t67-du-lieu-mau` cập nhật mẫu.
