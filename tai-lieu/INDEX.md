# Tài liệu nghiệp vụ cho BA (bản chép, chỉ đọc)

> Sinh tự động bằng `scripts/proto-docs-sync.js` của workspace người tích hợp — **không sửa tay ở đây**.
> Đây là **bản đọc** (`_md`) của tài liệu chuẩn trong sổ đăng ký `project-knowledge/INDEX.md`; tệp gốc (pdf, docx, drawio, ảnh) không chép.
> Trích dẫn bằng **mã tài liệu** (vd `QT-10.2.1 §5`). Số liệu / hình quan trọng cần đối chiếu tệp gốc → hỏi người tích hợp.
> Thiếu tài liệu cho phân hệ của bạn → ghi trong PR, người tích hợp thêm mã vào danh sách.

## Dùng chung (mọi BA) (`chung`)

| Mã | Tài liệu | Bản đọc |
|---|---|---|
| LNV | Luồng nghiệp vụ TTMS CĐS: 29 nghiệp vụ MS01–MS29, 149 luồng, pha, nhu cầu AI | [`_md/LNV.md`](_md/LNV.md) |
| BPMN-DTMS | BPMN chuẩn bản 12/10/2026, 12 trang: MS01, MS01 v1.1, MS02 ver1.1, MS13 (78 bước, thay MS13-TO BE), MS14 (75 bước, thay MS14-TO BE), MS22, MS23 - Tổng quan, MS23.01…04, MS24. So vớ | [`_md/BPMN-DTMS.md`](_md/BPMN-DTMS.md) |
| BPMN-DTMS-1611 | Tệp BPMN ĐTMS người dùng nhận 16/11/2026, 15 trang. Chỉ dùng trang MS18, MS19 (là Tệp chuẩn của BPMN-MS18-TOBE, BPMN-MS19). 12 trang MS01…MS24 giống từng phần tử bản 05/11 (ĐTMS-05 | [`_md/BPMN-DTMS-1611.md`](_md/BPMN-DTMS-1611.md) |
| SRS-COMMON | Thiết kế dùng chung cho các SRS ĐTMS (bản riêng, mới hơn §4 chép trong SRS-QTQT / SRS-VCT — các SRS nên tham chiếu bản này): Trường điều khiển, Thông báo chung (bộ mã VL001–VL011,  | [`_md/SRS-COMMON.md`](_md/SRS-COMMON.md) |
| SRS-VCT | SRS (tài liệu thiết kế chi tiết) Việc của tôi V1.0: Xem danh sách việc của tôi, Xem chi tiết, Xử lý Task, Xử lý gắn E-form (§3.1); §4–§6 chép nguyên từ SRS-QTQT (bản cũ, khác SRS-C | [`_md/SRS-VCT.md`](_md/SRS-VCT.md) |
| CR-FE-UI | Danh mục component @khcn-core/ui: bảng tra, input và ví dụ của vht-form-field, các control, vht-button, vht-table, VhtModalService, VhtConfirmService, ToastService… | [`_md/CR-FE-UI.md`](_md/CR-FE-UI.md) |

## Luồng / ĐXMS (MS01, MS02), YCBG (`luong-dxms`)

| Mã | Tài liệu | Bản đọc |
|---|---|---|
| QT-10.2.1 | Quy trình xây dựng và phê duyệt ĐXMS | [`_md/QT-10.2.1.md`](_md/QT-10.2.1.md) |
| BM-10.2.1 | Biểu mẫu hồ sơ ĐXMS (BM-01…BM-09, Checklist 01/02) | [`_md/BM-10.2.1.md`](_md/BM-10.2.1.md) |
| QC-12868 | Quy chế quản lý hoạt động đầu tư (QĐ 12868/QĐ-CNVTQĐ) | [`_md/QC-12868.md`](_md/QC-12868.md) |
| QD-16026 | KPI đánh giá hoạt động ĐTMS 2026 (QĐ 16026/QĐ-VHT) | [`_md/QD-16026.md`](_md/QD-16026.md) |
| DG-MS01 | Diễn giải luồng MS01 – Phê duyệt ĐXMS (MS01.01 / .02 / .03), v1.2 27/09/2026 (tệp 07/10, nội dung giống bản 28/09). ⚠ Không có 10a/10b — xem C7 | [`_md/DG-MS01.md`](_md/DG-MS01.md) |
| DG-MS02 | Diễn giải luồng MS02 – Phê duyệt điều chỉnh ĐXMS (MS02.01 / .02 / .03), v1.0 26/09/2026 | [`_md/DG-MS02.md`](_md/DG-MS02.md) |
| BB-2708 | Biên bản làm việc 27/08/2026 | [`_md/BB-2708.md`](_md/BB-2708.md) |
| BB-0909 | Biên bản làm việc 09/09/2026 | [`_md/BB-0909.md`](_md/BB-0909.md) |
| BB-1109 | Biên bản làm việc 11/09/2026 | [`_md/BB-1109.md`](_md/BB-1109.md) |
| BG-0411 | Bản ghi nhận và mô tả nghiệp vụ ĐTMS và Khoản đầu tư do BA VTIT tóm tắt từ GA-DXMS-0411, GA-KDT-0411: bóc nhu cầu từ dự toán COP1/2/3; rà soát tồn kho khả dụng (WMS) trước ĐXMS, cô | [`_md/BG-0411.md`](_md/BG-0411.md) |
| HT-DXMS-NOTE | Ghi chú màn hình hệ thống cũ, 3 sheet: ĐXMS Thành phần màn hình (10 màn Đề tài dự án, Dự toán chi phí, Soạn thảo TTr, Thẩm định TTr: trường, lọc, 12 trạng thái TTr, thao tác thẩm đ | [`_md/HT-DXMS-NOTE.md`](_md/HT-DXMS-NOTE.md) |
| HT-DXMS-TT | Mẫu tờ trình ĐXMS của hệ thống cũ (văn bản sinh từ màn Soạn thảo TTr kinh phí, dữ liệu ví dụ): đầu văn bản, Kính gửi, hai căn cứ mặc định (QĐ 12868/QĐ-CNVTQĐ = QC-12868; QT.CNVTQĐ. | [`_md/HT-DXMS-TT.md`](_md/HT-DXMS-TT.md) |
| IA-DXMS | Information Architecture màn ĐXMS do BA tổng hợp (người dùng nhận 05/11/2026, không ghi tác giả / ngày; tên tệp ghi "[KDT]" nhưng nội dung là ĐXMS). Sheet UI Component 0.2 (23 dòng | [`_md/IA-DXMS.md`](_md/IA-DXMS.md) |
| RV-PROTO-0511 | Review prototype ĐXMS do BA viết (người dùng nhận 05/11/2026, không ghi ngày / người ký, không kèm ảnh). Bản 2 (Review prototype (1).docx, thay bản 1 cùng ngày): thêm góp ý 19 (men | [`_md/RV-PROTO-0511.md`](_md/RV-PROTO-0511.md) |
| RV-PROTO-0911 | Review prototype ĐXMS lần 2 (người dùng nhận 09/11/2026, tên gốc Review prototype (2).docx, không ghi người / ngày, không ảnh). Bảng 6 mục: Loại ĐXMS (Tạo mới / Điều chỉnh) ở tìm k | [`_md/RV-PROTO-0911.md`](_md/RV-PROTO-0911.md) |
| YC-DXMS-PROTO | Nội dung chỉnh sửa và bổ sung prototype ĐXMS do BA VTIT tổng hợp từ HT-DXMS-NOTE và các buổi họp BA với VHT (người dùng nhận 04/11/2026, không ghi ngày, không ký). Gồm: §2 module Đ | [`_md/YC-DXMS-PROTO.md`](_md/YC-DXMS-PROTO.md) |
| BM-RSTK | Biên bản rà soát vật tư, linh kiện tồn kho (…/BBRS-MS) mẫu thật TTMS dùng, ví dụ 18/09/2023, 233 dòng: cột Yêu cầu (mô tả, mã NSX, ĐVT, SL) và Kết quả rà soát (SL tồn, SL xuất kho, | [`_md/BM-RSTK.md`](_md/BM-RSTK.md) |
| BM-YCBG | Mẫu công văn yêu cầu báo giá của VHT (TGĐ ký) + phụ lục Mẫu báo giá: bảng 9 cột (Hàng hóa, Model, Nhà sản xuất, Chỉ tiêu kỹ thuật, ĐVT, SL, Đơn giá, Thành tiền chưa thuế, thuế GTGT | [`_md/BM-YCBG.md`](_md/BM-YCBG.md) |
| BM-YCKT | Mẫu yêu cầu kỹ thuật để báo giá — tệp link "download template" cạnh trường Yêu cầu kỹ thuật trên màn YCBG cũ (HT-DXMS-IMG); người lập điền rồi tải lên. Mục 1 bảng 5 cột: TT (La Mã  | [`_md/BM-YCKT.md`](_md/BM-YCKT.md) |
| SRS-DXMS | SRS Quản lý đề xuất mua sắm (tài liệu thiết kế chi tiết) v0.9.3 dự thảo, 10/11/2026, do ta viết (T27, T35 đặc tả theo cấu hình, T38 B1 mô hình 1 ĐXMS – 1 hồ sơ ở chương 1–2; chương | [`_md/SRS-DXMS.md`](_md/SRS-DXMS.md) |

## Khoản đầu tư (MS13, MS14) (`kdt`)

| Mã | Tài liệu | Bản đọc |
|---|---|---|
| QT-8.6.5 | Quy trình thẩm định, phê duyệt Khoản đầu tư (KĐT) | [`_md/QT-8.6.5.md`](_md/QT-8.6.5.md) |
| BM-8.6.5 | Biểu mẫu hồ sơ KĐT | [`_md/BM-8.6.5.md`](_md/BM-8.6.5.md) |
| QC-12868 | Quy chế quản lý hoạt động đầu tư (QĐ 12868/QĐ-CNVTQĐ) | [`_md/QC-12868.md`](_md/QC-12868.md) |
| HD-1971 | Hướng dẫn 1971/HD-ĐTXD-ĐT 12/11/2025: phân loại Dự án đầu tư, Khoản đầu tư, Đề xuất mua sắm theo QC-12868 | [`_md/HD-1971.md`](_md/HD-1971.md) |
| DG-MS13 | Diễn giải luồng MS13 – Khoản đầu tư đơn giản, bản 12/10/2026 (v1.0, viết lại toàn bộ): 78 bước (74 chính + 75–78 hình thức ký dùng chung). Thêm bước 13 xác định thẩm quyền (cấp duy | [`_md/DG-MS13.md`](_md/DG-MS13.md) |
| DG-MS14 | Diễn giải luồng MS14 – Khoản đầu tư thông thường, bản 12/10/2026 (v1.0, viết lại toàn bộ): 75 bước (71 chính + 72–75 hình thức ký dùng chung), hai giai đoạn chủ trương (BM-02 → BM- | [`_md/DG-MS14.md`](_md/DG-MS14.md) |
| BG-0411 | Bản ghi nhận và mô tả nghiệp vụ ĐTMS và Khoản đầu tư do BA VTIT tóm tắt từ GA-DXMS-0411, GA-KDT-0411: bóc nhu cầu từ dự toán COP1/2/3; rà soát tồn kho khả dụng (WMS) trước ĐXMS, cô | [`_md/BG-0411.md`](_md/BG-0411.md) |
| BB-2409 | Biên bản làm việc 24/09/2026 | [`_md/BB-2409.md`](_md/BB-2409.md) |
| BB-2909 | Biên bản làm việc 29/09/2026: MS13, MS14, MS18, MS19, MS22, MS23, MS24, KĐT KHCN | [`_md/BB-2909.md`](_md/BB-2909.md) |

## Thầu (MS18, MS19) (`thau`)

| Mã | Tài liệu | Bản đọc |
|---|---|---|
| QC-12869 | Quy chế lựa chọn nhà thầu (QĐ 12869/QĐ-CNVTQĐ) | [`_md/QC-12869.md`](_md/QC-12869.md) |
| QT-LCNT | Quy trình tổ chức lựa chọn nhà thầu (bản trình ký) | [`_md/QT-LCNT.md`](_md/QT-LCNT.md) |
| BPMN-MS18 | BPMN MS18 KHLCNT (luồng tổng hợp + MS18.1–18.4). Bản nháp, nhưng là nguồn MS18 duy nhất | [`_md/BPMN-MS18.md`](_md/BPMN-MS18.md) |
| THAU-TT-1311 | Diễn giải luồng nghiệp vụ Thầu TO-BE — trạng thái theo dõi tiến độ KHLCNT và LCNT (phiên bản 13/11/2026): trạng thái hai lớp (Giai đoạn lớn + Bước hiện tại), tự sinh từ task Camund | [`_md/THAU-TT-1311.md`](_md/THAU-TT-1311.md) |
| HT-THAU-DG | Đặc tả trường (bản BA viết dở) màn KHLCNT hệ thống cũ: mục 1.1–1.3 có trường (Tìm kiếm, Thêm, Sửa tổng quan, Sửa chi tiết: tab Thông tin chung / Checklist / Gói thầu, form gói thầu | [`_md/HT-THAU-DG.md`](_md/HT-THAU-DG.md) |
| HT-THAU-XLS | Cấu trúc màn hình + đặc tả trường màn KHLCNT hệ thống cũ dạng bảng (nhận 16/11/2026), 2 sheet: *01_Cấu trúc màn hình* (16 mục: danh sách, Tìm kiếm, Thêm, Sửa tổng quan, Sửa chi tiế | [`_md/HT-THAU-XLS.md`](_md/HT-THAU-XLS.md) |
| HT-THAU-ANH | Cùng mục lục với HT-THAU-DG nhưng thay chữ bằng ảnh chụp (≈ 50 ảnh, chính là bộ HT-THAU-IMG). Bản đọc chỉ có tiêu đề và chỗ đặt ảnh | [`_md/HT-THAU-ANH.md`](_md/HT-THAU-ANH.md) |
| LNV-PDT | Luồng nghiệp vụ module Đầu tư (P.ĐT): 4 luồng chính ĐT01–04, 40 luồng thành phần | [`_md/LNV-PDT.md`](_md/LNV-PDT.md) |
| BB-2909 | Biên bản làm việc 29/09/2026: MS13, MS14, MS18, MS19, MS22, MS23, MS24, KĐT KHCN | [`_md/BB-2909.md`](_md/BB-2909.md) |

## Hợp đồng (MS22–MS24) (`hop-dong`)

| Mã | Tài liệu | Bản đọc |
|---|---|---|
| QT-10.2.4 | Quy trình quản lý hợp đồng | [`_md/QT-10.2.4.md`](_md/QT-10.2.4.md) |
| QT-10.2.5 | Quy trình quản lý đơn hàng và thực hiện hợp đồng | [`_md/QT-10.2.5.md`](_md/QT-10.2.5.md) |
| DG-MS22 | Diễn giải luồng MS22 – Thương thảo và ký hợp đồng, v1.0 06/10/2026: 13 bước | [`_md/DG-MS22.md`](_md/DG-MS22.md) |
| DG-MS23 | Diễn giải MS23 – Theo dõi thực hiện hợp đồng tổng quan v1.0 (07/10/2026, nhận 30/10): 5 bước đọc theo nhánh sự kiện độc lập (không phải chuỗi 1→5): AI đọc hợp đồng trích mốc → hồ s | [`_md/DG-MS23.md`](_md/DG-MS23.md) |
| DG-MS23.01 | Diễn giải MS23.01 – Văn bản phát sinh khi thực hiện hợp đồng v1.0 (07/10/2026): 12 bước — lập thông tin văn bản, đề xuất sửa đổi → người có thẩm quyền duyệt, AI kiểm tra căn cứ + h | [`_md/DG-MS23.01.md`](_md/DG-MS23.01.md) |
| DG-MS23.02 | Diễn giải MS23.02 – Bàn giao hàng hóa dịch vụ v1.0 (07/10/2026): 22 bước — nhận/gửi thông báo giao hàng, Phòng QLTS ghi nhận giao nhận + hồ sơ kho, ĐVSD xác nhận dịch vụ, KCS; nhán | [`_md/DG-MS23.02.md`](_md/DG-MS23.02.md) |
| DG-MS23.03 | Diễn giải MS23.03 – Nghiệm thu hàng hóa dịch vụ v1.0 (07/10/2026): 14 bước — báo cáo KCS tài sản (Phòng Đảm bảo hàng hóa/TTMS) / dịch vụ (ĐVSD), khắc phục và kiểm tra lại, AI soạn  | [`_md/DG-MS23.03.md`](_md/DG-MS23.03.md) |
| DG-MS23.04 | Diễn giải MS23.04 – Thanh lý hợp đồng v1.0 (07/10/2026): 14 bước — G1 kiểm tra yêu cầu thanh lý / điều kiện ký chung; ký chung: chuẩn bị biên bản thanh lý, nhận kết quả ký từ MS23. | [`_md/DG-MS23.04.md`](_md/DG-MS23.04.md) |
| DG-MS24 | Diễn giải luồng MS24 – Thanh toán hợp đồng theo từng đợt, bản 30/10 (bảng sửa đổi vẫn ghi v1.0 06/10): 20 bước; Phòng Tài chính kế toán thực hiện bước 18–19, bỏ nhãn "đề xuất" bước | [`_md/DG-MS24.md`](_md/DG-MS24.md) |
| HT-HD-IMG | 14 ảnh chụp hệ thống cũ, menu Hợp đồng / TTr MS (muasam.vht.vn, tệp gốc Mẫu HT.docx chỉ có ảnh, không có chữ; tách theo thứ tự ở Ảnh HT cũ/01.png…14.png). Gồm: danh sách HĐ / TTr M | [`_md/HT-HD-IMG.md`](_md/HT-HD-IMG.md) |
| HT-HD-IMG2 | 40 ảnh chụp hệ thống cũ, menu Hợp đồng / TTr MS, bổ sung HT-HD-IMG (https://10.55.34.211/home.zul, cùng hệ thống; chụp bằng điện thoại 17/11/2026 15:59–16:12, gói tải từ Drive nhận | [`_md/HT-HD-IMG2.md`](_md/HT-HD-IMG2.md) |
| BB-2909 | Biên bản làm việc 29/09/2026: MS13, MS14, MS18, MS19, MS22, MS23, MS24, KĐT KHCN | [`_md/BB-2909.md`](_md/BB-2909.md) |
| BM-HD-2026-1.0 | HĐ hàng hóa sẵn có | [`_md/BM-HD-2026-1.0.md`](_md/BM-HD-2026-1.0.md) |
| BM-HD-2026-1.1 | HĐ hàng hóa sẵn có | [`_md/BM-HD-2026-1.1.md`](_md/BM-HD-2026-1.1.md) |
| BM-HD-2026-1.2 | HĐ hàng hóa sẵn có | [`_md/BM-HD-2026-1.2.md`](_md/BM-HD-2026-1.2.md) |
| BM-HD-2026-1.3 | HĐ hàng hóa theo yêu cầu | [`_md/BM-HD-2026-1.3.md`](_md/BM-HD-2026-1.3.md) |
| BM-HD-2026-1.4 | HĐ hàng hóa theo yêu cầu | [`_md/BM-HD-2026-1.4.md`](_md/BM-HD-2026-1.4.md) |
| BM-HD-2026-1.5 | HĐ hàng hóa theo yêu cầu | [`_md/BM-HD-2026-1.5.md`](_md/BM-HD-2026-1.5.md) |
| BM-HD-2026-1.6 | HĐ hàng hóa sẵn có và dịch vụ | [`_md/BM-HD-2026-1.6.md`](_md/BM-HD-2026-1.6.md) |
| BM-HD-2026-1.7 | HĐ hàng hóa theo yêu cầu và dịch vụ | [`_md/BM-HD-2026-1.7.md`](_md/BM-HD-2026-1.7.md) |
| BM-HD-2026-1.8 | HĐ hàng hóa phần mềm / license phần mềm | [`_md/BM-HD-2026-1.8.md`](_md/BM-HD-2026-1.8.md) |
| BM-HD-2026-2 | Thỏa thuận khung hàng hóa | [`_md/BM-HD-2026-2.md`](_md/BM-HD-2026-2.md) |
| BM-HD-2026-3.0 | HĐ dịch vụ phi tư vấn | [`_md/BM-HD-2026-3.0.md`](_md/BM-HD-2026-3.0.md) |
| BM-HD-2026-3.1 | HĐ dịch vụ phi tư vấn — vận chuyển | [`_md/BM-HD-2026-3.1.md`](_md/BM-HD-2026-3.1.md) |
| BM-HD-2026-3.2 | HĐ dịch vụ phi tư vấn — đào tạo | [`_md/BM-HD-2026-3.2.md`](_md/BM-HD-2026-3.2.md) |
| BM-HD-2026-4 | Thỏa thuận khung phi tư vấn | [`_md/BM-HD-2026-4.md`](_md/BM-HD-2026-4.md) |
| BM-HD-2026-5 | HĐ dịch vụ tư vấn | [`_md/BM-HD-2026-5.md`](_md/BM-HD-2026-5.md) |
| BM-HD-2026-6 | Thỏa thuận khung tư vấn | [`_md/BM-HD-2026-6.md`](_md/BM-HD-2026-6.md) |
| BM-HD-2026-7.0 | HĐ hàng hóa đơn giản sẵn có | [`_md/BM-HD-2026-7.0.md`](_md/BM-HD-2026-7.0.md) |
| BM-HD-2026-7.1 | HĐ hàng hóa đơn giản sẵn có | [`_md/BM-HD-2026-7.1.md`](_md/BM-HD-2026-7.1.md) |
| BM-HD-2026-7.2 | HĐ hàng hóa đơn giản sẵn có | [`_md/BM-HD-2026-7.2.md`](_md/BM-HD-2026-7.2.md) |
| BM-HD-2026-7.3 | HĐ hàng hóa đơn giản theo yêu cầu | [`_md/BM-HD-2026-7.3.md`](_md/BM-HD-2026-7.3.md) |
| BM-HD-2026-7.4 | HĐ hàng hóa đơn giản theo yêu cầu | [`_md/BM-HD-2026-7.4.md`](_md/BM-HD-2026-7.4.md) |
| BM-HD-2026-7.5 | HĐ hàng hóa đơn giản theo yêu cầu | [`_md/BM-HD-2026-7.5.md`](_md/BM-HD-2026-7.5.md) |
| BM-HD-2026-7.6 | HĐ hàng hóa đơn giản sẵn có và dịch vụ | [`_md/BM-HD-2026-7.6.md`](_md/BM-HD-2026-7.6.md) |
| BM-HD-2026-7.7 | HĐ hàng hóa đơn giản theo yêu cầu và dịch vụ | [`_md/BM-HD-2026-7.7.md`](_md/BM-HD-2026-7.7.md) |
| BM-HD-2026-7.8 | HĐ hàng hóa đơn giản phần mềm / license phần mềm | [`_md/BM-HD-2026-7.8.md`](_md/BM-HD-2026-7.8.md) |
| BM-HD-2026-8.0 | HĐ dịch vụ phi tư vấn đơn giản | [`_md/BM-HD-2026-8.0.md`](_md/BM-HD-2026-8.0.md) |
| BM-HD-2026-8.1 | HĐ dịch vụ phi tư vấn đơn giản — vận chuyển | [`_md/BM-HD-2026-8.1.md`](_md/BM-HD-2026-8.1.md) |
| BM-HD-2026-8.2 | HĐ dịch vụ phi tư vấn đơn giản — đào tạo | [`_md/BM-HD-2026-8.2.md`](_md/BM-HD-2026-8.2.md) |
| BM-HD-2026-9 | HĐ quốc tế dịch vụ (tiếng Anh) | [`_md/BM-HD-2026-9.md`](_md/BM-HD-2026-9.md) |
| BM-HD-2026-10 | HĐ quốc tế hàng hóa — MSTX (tiếng Anh) | [`_md/BM-HD-2026-10.md`](_md/BM-HD-2026-10.md) |

## Đề tài / dự án (`de-tai`)

| Mã | Tài liệu | Bản đọc |
|---|---|---|
| SRS-DADT | SRS Quản lý đề tài / dự án (tài liệu thiết kế chi tiết) v1.5, 12/11/2026 (v1.5: theo review prototype 12/11 (T56 / D-110) — tab ĐXMS liên quan cột Giá trị đề xuất (tỷ đồng), tab KĐ | [`_md/SRS-DADT.md`](_md/SRS-DADT.md) |
| TPL-DADT-EX | Template xuất danh sách Đề tài / dự án của hệ thống cũ, 6 sheet: danh sách ĐT/DA; gói thầu + hợp đồng (có / không link gói thầu); tỉ lệ thực hiện ĐTMS; văn bản pháp lý; gói thầu ph | [`_md/TPL-DADT-EX.md`](_md/TPL-DADT-EX.md) |
| TPL-DADT-IM | Template import Đề tài / dự án: 15 cột; sheet List (Loại, Nguồn vốn, Đơn vị, Trạng thái, Cấp phê duyệt) | [`_md/TPL-DADT-IM.md`](_md/TPL-DADT-IM.md) |
| QT-8.6.2 | Quy trình lập, thẩm định, phê duyệt dự án đầu tư (DADT) — gộp 8.6.1 + 8.6.2 | [`_md/QT-8.6.2.md`](_md/QT-8.6.2.md) |
| BM-8.6.2 | Biểu mẫu hồ sơ DADT | [`_md/BM-8.6.2.md`](_md/BM-8.6.2.md) |

## Báo cáo (`bao-cao`)

| Mã | Tài liệu | Bản đọc |
|---|---|---|
| QD-16026 | KPI đánh giá hoạt động ĐTMS 2026 (QĐ 16026/QĐ-VHT) | [`_md/QD-16026.md`](_md/QD-16026.md) |
| BA-TD | Tiến độ BA ĐTMS: sheet Backlog (051026) (Backlog chức năng 12 module — WBS mới, thay cho WBS trong CN khi lập demo / SRS), W1_T10 (051026) + Overview (giao việc tuần, PIC, hạn), Kế | [`_md/BA-TD.md`](_md/BA-TD.md) |

## Quản trị (quy trình, ma trận, eForm, DMDC, thông báo, trình ký) (`quan-tri`)

| Mã | Tài liệu | Bản đọc |
|---|---|---|
| SRS-QTQT | SRS (tài liệu thiết kế chi tiết) Quản trị quy trình V1.0: Quản lý quy trình (3.1.1), Ma trận hành động (3.1.2), thiết kế dùng chung (§4). Nhận 07/10/2026 (Drive 16wNiNupFvBP2onqLDW | [`_md/SRS-QTQT.md`](_md/SRS-QTQT.md) |
| SRS-DMDC | SRS Danh mục dùng chung (tài liệu thiết kế chi tiết) V0.2 dự thảo, 18/11/2026 (V0.2: bảng Phân cấp thẩm quyền KĐT thêm chiều Hệ thống CNTT phục vụ nội bộ — ngoại lệ UQ-GUQ §1.2.2,  | [`_md/SRS-DMDC.md`](_md/SRS-DMDC.md) |
| SRS-TB | SRS Quản lý mẫu thông báo (đợt 16/10), chép từ KHCN; VHT yêu cầu đổi sang ĐTMS qua DT-TDNV | [`_md/SRS-TB.md`](_md/SRS-TB.md) |
| COMMON-TB | Common thông báo: Chuông thông báo (đợt 16/10) | [`_md/COMMON-TB.md`](_md/COMMON-TB.md) |

## Quản lý sản xuất (`sx`)

| Mã | Tài liệu | Bản đọc |
|---|---|---|
| QT-TTSX-4A11 | Quy trình Quản lý hoạt động sản xuất QT.VHT.TTSX.4A.1.1 (bản gốc VHT, tên tệp QT.VHT.TT (1).docx): phạm vi từ sau sản xuất thử nghiệm tới kiểm tra xuất xưởng / nghiệm thu cấp VHT;  | [`_md/QT-TTSX-4A11.md`](_md/QT-TTSX-4A11.md) |
| QT-TTSX-4A11-LD | Lưu đồ QT.VHT.TTSX.4A.1.1 dạng bản vẽ (2 lane BP QLSX / BP ĐBCL, 4 giai đoạn); chữ trích rời rạc. Điểm chỉ lưu đồ có: nút rẽ "TN?" trước bước 11 và vòng lặp "Có SX đợt tiếp theo" s | [`_md/QT-TTSX-4A11-LD.md`](_md/QT-TTSX-4A11-LD.md) |
| BM-QLHDSX-01 | Biểu mẫu Kế hoạch sản xuất dự án (QT.VHT.TTSX.4A.1.1, Khối 1): OKRs, yêu cầu, phương án tổ chức, mốc, rủi ro; 6 phụ lục (cấu hình, lưu trình tích hợp đo kiểm, danh sách gói mua sắm | [`_md/BM-QLHDSX-01.md`](_md/BM-QLHDSX-01.md) |
| BM-QLHDSX-04 | Biểu mẫu Biên bản làm việc TCT – nhà máy thống nhất phương án tổ chức sản xuất (đầu mối, cấp ký BBBG tài liệu / BBLV, kế hoạch điều hành) | [`_md/BM-QLHDSX-04.md`](_md/BM-QLHDSX-04.md) |
| BM-QLHDSX-XLS | Bảng tính biểu mẫu kèm QT.VHT.TTSX.4A.1.1 (tên tệp không ghi số biểu mẫu), 2 sheet: Bàn giao VHT-M1 = Checklist tài liệu bàn giao (sử dụng VMMS) — cột level, mã / loại tài liệu, re | [`_md/BM-QLHDSX-XLS.md`](_md/BM-QLHDSX-XLS.md) |
| SX-KS-K1 | Báo cáo khảo sát nghiệp vụ Phân hệ QLSX Khối 1 v1.0 (BA): đặc thù Khối 1 (quân sự, 2 mô hình VMC tổng thầu / TTSX tự tổ chức), yêu cầu 6 nhóm vai trò, 3 quy trình cốt lõi QT.VHT.TT | [`_md/SX-KS-K1.md`](_md/SX-KS-K1.md) |
| SX-KS-K2 | Báo cáo khảo sát nghiệp vụ Phân hệ Sản xuất Khối 2 v1.0 (06/11/2026; nằm trong thư mục "VHT gửi" nhưng do VTIT soạn — Bùi Thị Thảo, Nguyễn Thị Nga): bối cảnh Khối 2 (viễn thông, kh | [`_md/SX-KS-K2.md`](_md/SX-KS-K2.md) |
| SX-KS-3NGAY | Báo cáo kết quả 3 ngày khảo sát tại VHT (29/10/2026, BA): kết quả ĐTMS (mốc UAT yêu cầu cuối 11 ĐXMS + KĐT, cuối 12 Thầu + Hợp đồng — chưa chốt ngày), Sản xuất (chưa đủ As-is), KHC | [`_md/SX-KS-3NGAY.md`](_md/SX-KS-3NGAY.md) |
| SX-GA-0911 | Bản ghi buổi khảo sát khách hàng 09/11/2026 (Khối 1): danh mục quy trình, tờ trình mua sắm, so sánh VHT tự sản xuất / VMC thầu, hệ thống VECO và VMM/MES, định hướng MES. Kèm tệp gh | [`_md/SX-GA-0911.md`](_md/SX-GA-0911.md) |
| SX-GA-K2 | Bài thuyết minh "Phạm vi và quy trình nghiệp vụ phân hệ QLSX theo 03COP" (5:20, nằm trong thư mục khảo sát Khối 2). Không phải ghi âm khảo sát: một giọng đọc theo kịch bản (tên tệp | [`_md/SX-GA-K2.md`](_md/SX-GA-K2.md) |
| SX-VMMS-1111 | Ghi chú khảo sát hệ thống VMMS 11/11/2026: phân quyền theo dự án, môi trường dev ngoài / production trong mạng nhà máy, tiến độ từ trạm đo tự động, EBOM → MBOM (trigger), IQC + bla | [`_md/SX-VMMS-1111.md`](_md/SX-VMMS-1111.md) |
| SX-ULNL | Bảng ước lượng nỗ lực (ULNL) phân hệ Quản lý sản xuất v1.0 (16/11/2026, mẫu ULNL Viettel; trang bìa chưa điền người lập / mã dự án). Tổng hợp: chức năng 1.220 MD (9.761 MH; giải ph | [`_md/SX-ULNL.md`](_md/SX-ULNL.md) |
| QT-CLKHCN-2.2.1 | Quy trình tổng thể nghiên cứu phát triển sản phẩm (lần 4, hiệu lực 20/09/2024) — COP1, đầu vào cho sản xuất | [`_md/QT-CLKHCN-2.2.1.md`](_md/QT-CLKHCN-2.2.1.md) |
| QT-CLKHCN-2.2.2 | Quy trình thiết kế và chế tạo mẫu phần cứng (lần 4, 20/09/2024) | [`_md/QT-CLKHCN-2.2.2.md`](_md/QT-CLKHCN-2.2.2.md) |
| QT-CLKHCN-2.2.3 | Quy trình thiết kế, chế tạo mẫu cơ khí – kiểu dáng (lần 4, 20/09/2024) | [`_md/QT-CLKHCN-2.2.3.md`](_md/QT-CLKHCN-2.2.3.md) |
| QT-CLKHCN-2.2.4 | Quy trình phát triển module phần mềm (lần 4, 20/09/2024) | [`_md/QT-CLKHCN-2.2.4.md`](_md/QT-CLKHCN-2.2.4.md) |
| QT-CLKHCN-2.3.1 | Quy trình nghiên cứu phát triển sản phẩm phần mềm (Agile/Scrum, lần 4, 20/09/2024) | [`_md/QT-CLKHCN-2.3.1.md`](_md/QT-CLKHCN-2.3.1.md) |
| CLTT-2.2.1 | Chiến lược thực hiện quy trình NC PTSP (bảng theo QĐ thực hiện đề tài) — PDF + Excel cùng nội dung | [`_md/CLTT-2.2.1.md`](_md/CLTT-2.2.1.md) |
| CLTT-2.3.1 | Chiến lược thực thi quy trình phát triển phần mềm — PDF + Excel | [`_md/CLTT-2.3.1.md`](_md/CLTT-2.3.1.md) |
| BC-CAITIEN-PTSP | Báo cáo cải tiến quy trình nghiên cứu PTSP (QT.38) | [`_md/BC-CAITIEN-PTSP.md`](_md/BC-CAITIEN-PTSP.md) |
