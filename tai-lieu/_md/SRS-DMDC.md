<!-- pk-source: ../docs/SRS/33-srs-dmdc/ĐTMS_SRS Danh mục dùng chung - V0.2.docx -->
<!-- pk-sha256: ade3e570836cd133753634959ecd66160704a8a63ebcd807d8791f9b2231b176 -->
<!-- pk-generated: 2026-11-18 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# SRS-DMDC — bản đọc máy sinh

> Nguồn: `project-knowledge/../docs/SRS/33-srs-dmdc/ĐTMS_SRS Danh mục dùng chung - V0.2.docx`. Trích dẫn thì ghi mã **SRS-DMDC** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.

**TẬP ĐOÀN CÔNG NGHIỆP - VIỄN THÔNG QUÂN ĐỘI VIETTEL**

**TỔNG CÔNG TY CÔNG NGHIỆP CÔNG NGHỆ CAO VIETTEL**

**TÀI LIỆU THIẾT KẾ CHI TIẾT**

**DANH MỤC DÙNG CHUNG**

Mã hiệu dự án: CNM.VHT.DTMS

Mã hiệu tài liệu: CNM.VHT.DTMS_SRS_DMC

Phiên bản: 0.2 (dự thảo)

Hà Nội, 18/11/2026

**BẢNG GHI NHẬN THAY ĐỔI TÀI LIỆU**

\*A – Tạo mới, M – Sửa đổi, D – Xóa bỏ

| **Ngày thay đổi** | **Vị trí thay đổi** | **A\*, M, D** | **Nguồn gốc** | **Phiên bản cũ** | **Mô tả thay đổi** | **Phiên bản mới** |
|----|----|----|----|----|----|----|
| 11/11/2026 | Toàn bộ | A | Yêu cầu viết lại đặc tả Danh mục dùng chung theo bản dựng thử và mã nguồn ngày 11/11/2026; thay gói đặc tả phần Danh mục bản 27/10/2026 |  | Tạo mới tài liệu | 0.1 |
| 18/11/2026 | Mục 3.4.2 (BR-DMC-21-01, 21-02, 21-03 mới; DTMS_CN_0313 thành phần 5, dữ liệu khởi tạo, AC-0313-07 – 10), 4 (investment_authority_rule.internal_it_system), 6 (câu hỏi 10) | M, A | Chạy thử DMN thẩm quyền khoản đầu tư của Web Modeler 18/11/2026: ngoại lệ hệ thống công nghệ thông tin phục vụ nhu cầu nội bộ của văn bản ủy quyền §1.2.2 | 0.1 | Thêm chiều Hệ thống CNTT phục vụ nội bộ vào bảng Phân cấp thẩm quyền khoản đầu tư; Trang bị nội bộ là hệ thống CNTT phục vụ nội bộ thì cấp Tập đoàn | 0.2 |

**TRANG KÝ**

**Người lập: \<Ngày\>**

\<Chức danh\>

**Người xem xét: \<Ngày\>**

\<Chức danh\>

**Người xem xét: \<Ngày\>**

\<Chức danh\>

**Người phê duyệt: \<Ngày\>**

\<Chức danh\>

MỤC LỤC

# GIỚI THIỆU

## Mục đích

Tài liệu mô tả chi tiết phân hệ **Danh mục dùng chung** phục vụ Đầu tư mua sắm. Phân hệ này quản lý các danh mục mà các phân hệ nghiệp vụ (đề xuất mua sắm, khoản đầu tư, lựa chọn nhà thầu, hợp đồng, đề tài / dự án) dùng làm ô chọn và làm tham số của quy trình, ví dụ ngưỡng phân luồng, phân cấp thẩm quyền, loại tài liệu căn cứ bắt buộc. Người đọc là đội phát triển và kiểm thử. Tài liệu tự đủ để xây dựng phân hệ, không cần đọc thêm tài liệu khác.

## Phạm vi

**Trong phạm vi:** 21 danh mục ở mục 2.1, cùng màn Tổng quan của phân hệ. Mỗi danh mục gồm: xem danh sách và tìm kiếm, thêm mới, xem chi tiết kèm lịch sử thay đổi, chỉnh sửa, đổi trạng thái Đang hoạt động / Dừng hoạt động, xóa, và API ô chọn cho phân hệ dùng danh mục. Nhà cung cấp / Nhà thầu có thêm chức năng nhập từ Excel.

**Có sẵn trên hệ thống, không mô tả thêm:** Nguồn vốn (dùng danh mục Nguồn kinh phí), Vai trò thực hiện, Chức danh khoa học, Đối tác, Lĩnh vực, Quản lý E-form (mô tả ở tài liệu E-form). Các mục này vẫn được liệt kê ở mục 2.1 để thấy đủ menu.

**Ngoài phạm vi:** Loại chi phí, Nhóm dự án, Loại sản phẩm, Tình trạng pháp lý, Tình trạng mua sắm. Danh sách danh mục được duyệt không có các danh mục này (câu hỏi ở mục 6). Ngoài phạm vi còn có: đưa nhà cung cấp vào hoặc gỡ khỏi danh sách cấm (thuộc lựa chọn nhà thầu, ở đây chỉ hiển thị) và bảng ánh xạ mã danh mục với mã của hệ thống nguồn.

## Khái niệm, thuật ngữ

| Thuật ngữ | Ý nghĩa |
|----|----|
| Danh mục | Một bảng giá trị dùng chung, có màn quản trị riêng trong phân hệ Danh mục dùng chung, ví dụ Loại hợp đồng |
| Bản ghi danh mục | Một giá trị của danh mục, ví dụ "Trọn gói" của Loại hợp đồng |
| Bảng luật | Danh mục mà mỗi bản ghi là một quy tắc (điều kiện → kết quả), không có Mã / Tên: Ngưỡng phân luồng, Phân cấp thẩm quyền khoản đầu tư |
| Đang hoạt động, Dừng hoạt động | Hai trạng thái của bản ghi. Chỉ bản ghi Đang hoạt động hiện ở ô chọn khi nhập liệu nghiệp vụ |
| Phân hệ dùng danh mục | Phân hệ đọc danh mục qua API ô chọn: Đầu tư mua sắm (đề xuất mua sắm, khoản đầu tư, thầu, hợp đồng), Đề tài / dự án |
| Tham chiếu | Bản ghi danh mục đã được ít nhất một hồ sơ nghiệp vụ, hoặc một bản ghi của danh mục khác, lưu làm giá trị |
| ĐXMS, KĐT, LCNT | Đề xuất mua sắm; khoản đầu tư; lựa chọn nhà thầu |
| MS01, MS13, MS14, MS15 | Quy trình phê duyệt ĐXMS; quy trình phê duyệt KĐT đơn giản, thông thường, phức tạp |
| QTHT, TTMS, NDNV | Quản trị hệ thống; Chuyên viên Trung tâm Mua sắm; người dùng nghiệp vụ (chỉ dùng ô chọn) |
| Tỷ đồng | Đơn vị tiền của các ô giá trị ở bảng luật. Nhập dạng Việt Nam: dấu chấm phân cách nghìn, dấu phẩy thập phân, tối đa 2 chữ số thập phân |

## Tài liệu tham khảo

| Tài liệu | Sử dụng |
|----|----|
| Bản dựng thử ĐTMS ngày 11/11/2026, phân hệ Danh mục dùng chung | Danh sách 21 danh mục, nhóm menu, trường riêng, luật trường, dữ liệu khởi tạo, bảng luật |
| Mã nguồn phân hệ Danh mục dùng chung (ecat) ngày 10/11/2026 | Khuôn màn danh sách, tìm kiếm nâng cao, chi tiết và lịch sử thay đổi, hộp thoại; API; bảng dữ liệu; thông báo |
| Gói đặc tả Danh mục dùng chung ĐTMS, bản 27/10/2026 | Quy tắc chung: mã duy nhất, Dừng hoạt động, chặn xóa khi đã tham chiếu, lịch sử, sự kiện thay đổi; mã chức năng |
| Tài liệu thiết kế chi tiết Quản lý đề tài / dự án, bản 1.3 | Nơi dùng Cấp phê duyệt, Loại dự án / đề tài, Loại dự án (chi tiết), Nguồn vốn |

## Mô tả tài liệu

Mục 2 là tổng quan: danh sách danh mục, kiến trúc, phân quyền, trạng thái, quy tắc chung và **khuôn chức năng danh mục**, tức phần mọi danh mục cùng có, được mô tả một lần. Mục 3 thiết kế chi tiết từng danh mục. Mỗi danh mục chỉ ghi phần riêng: trường, cột, ô lọc, quy tắc, nơi dùng, dữ liệu khởi tạo, tiêu chí chấp nhận. Mục 4 là quy ước dùng chung, mục 5 là cơ sở dữ liệu, mục 6 là câu hỏi còn mở. Phụ lục ghi các điểm mã nguồn hiện tại cần bổ sung.

# TỔNG QUAN GIẢI PHÁP

## Tổng quan chức năng

Phân hệ Danh mục dùng chung là một phân hệ riêng, vào từ màn Danh sách phân hệ (thẻ "Danh mục dùng chung"). Thanh bên trái gồm: Tổng quan, các mục phẳng, rồi nhóm **Đầu tư mua sắm** mở sẵn. Thứ tự dưới đây là thứ tự menu.

| \# | Menu | Nhóm | Chức năng | Mục | Ghi chú |
|----|----|----|----|----|----|
| 1 | Tổng quan | phẳng | DTMS_CN_0343 | 3.1.1 |  |
| 2 | Quản lý E-form | phẳng | – | – | Đã có sẵn trên hệ thống, SRS này không mô tả thêm (mô tả ở tài liệu E-form) |
| 3 | Vai trò thực hiện | phẳng | – | 3.5 | Đã có sẵn trên hệ thống, SRS này không mô tả thêm |
| 4 | Chức danh khoa học | phẳng | – | 3.5 | Đã có sẵn trên hệ thống, SRS này không mô tả thêm |
| 5 | Nhà cung cấp / Nhà thầu | phẳng | DTMS_CN_0306 – 0312 | 3.2.1 | Có nhập từ Excel |
| 6 | Loại đối tác | phẳng | DTMS_CN_0004 – 0009 | 3.2.2 |  |
| 7 | Đơn vị tính | phẳng | DTMS_CN_0016 – 0021 | 3.2.3 |  |
| 8 | Tiền tệ | phẳng | DTMS_CN_0022 – 0027 | 3.2.4 |  |
| 9 | Nguồn vốn | phẳng | – | 3.5 | Đã có sẵn trên hệ thống (danh mục Nguồn kinh phí), SRS này không mô tả thêm |
| 10 | Lĩnh vực đầu tư | phẳng | DTMS_CN_0076 – 0081 | 3.2.5 |  |
| 11 | Loại hàng hoá / dịch vụ | Đầu tư mua sắm | DTMS_CN_0010 – 0015 | 3.3.1 |  |
| 12 | Loại khoản đầu tư | Đầu tư mua sắm | DTMS_CN_0028 – 0033 | 3.3.2 |  |
| 13 | Cấp phê duyệt đề tài / dự án | Đầu tư mua sắm | DTMS_CN_0325 – 0330 | 3.3.3 |  |
| 14 | Loại dự án / đề tài | Đầu tư mua sắm | DTMS_CN_0331 – 0336 | 3.3.4 |  |
| 15 | Loại dự án (chi tiết) | Đầu tư mua sắm | DTMS_CN_0337 – 0342 | 3.3.5 |  |
| 16 | Tính chất tài sản hình thành | Đầu tư mua sắm | DTMS_CN_0034 – 0039 | 3.3.6 |  |
| 17 | Loại gói thầu | Đầu tư mua sắm | DTMS_CN_0040 – 0045 | 3.3.7 |  |
| 18 | Hình thức lựa chọn nhà thầu | Đầu tư mua sắm | DTMS_CN_0046 – 0051 | 3.3.8 |  |
| 19 | Phương thức lựa chọn nhà thầu | Đầu tư mua sắm | DTMS_CN_0052 – 0057 | 3.3.9 |  |
| 20 | Phương pháp đánh giá | Đầu tư mua sắm | DTMS_CN_0058 – 0063 | 3.3.10 |  |
| 21 | Loại hợp đồng | Đầu tư mua sắm | DTMS_CN_0064 – 0069 | 3.3.11 |  |
| 22 | Hình thức bảo đảm | Đầu tư mua sắm | DTMS_CN_0070 – 0075 | 3.3.12 |  |
| 23 | Loại tài liệu căn cứ | Đầu tư mua sắm | DTMS_CN_0319 – 0324 | 3.3.13 |  |
| 24 | Ngưỡng phân luồng | Đầu tư mua sắm | DTMS_CN_0082 – 0087 | 3.4.1 | Bảng luật |
| 25 | Phân cấp thẩm quyền khoản đầu tư | Đầu tư mua sắm | DTMS_CN_0313 – 0318 | 3.4.2 | Bảng luật |

Danh mục Đối tác và Lĩnh vực có sẵn trên hệ thống phục vụ phân hệ Quản lý khoa học công nghệ, không nằm trên menu Đầu tư mua sắm. Hai danh mục này không thay cho Nhà cung cấp / Nhà thầu và Lĩnh vực đầu tư (mục 3.5).

Sáu mã chức năng của mỗi danh mục theo thứ tự: xem danh sách và tìm kiếm, thêm mới, xem chi tiết, chỉnh sửa, đổi trạng thái, xóa. Ví dụ Loại đối tác: 0004 danh sách, 0005 thêm, 0006 chi tiết, 0007 sửa, 0008 đổi trạng thái, 0009 xóa. Nhà cung cấp / Nhà thầu có thêm 0312 nhập từ Excel.

## Kiến trúc

| Thành phần | Thiết kế |
|----|----|
| Giao diện | Một giao diện tập trung là phân hệ Danh mục dùng chung (ứng dụng common-catalog). Các phân hệ nghiệp vụ không có màn quản trị danh mục riêng |
| Dịch vụ | Một dịch vụ tập trung là dịch vụ danh mục (/category/api/v1), dùng một cơ sở dữ liệu danh mục. Mọi danh mục ở mục 2.1 lưu và phục vụ tại đây |
| API mỗi danh mục | GET /{tài nguyên}/search (tìm kiếm, phân trang), GET /{tài nguyên}/{id} (chi tiết), GET /{tài nguyên}/{id}/histories (lịch sử), POST /{tài nguyên} (thêm), POST /{tài nguyên}/{id} (sửa), POST /{tài nguyên}/{id}/toggle-status (đổi trạng thái, gửi trạng thái đích và version), POST /{tài nguyên}/{id}/delete (xóa), GET /{tài nguyên}/dropdown (ô chọn). Tên tài nguyên ghi ở từng danh mục |
| Phân hệ dùng danh mục | Đọc qua GET …/dropdown khi nhập liệu và qua GET …/{id} khi hiển thị giá trị đã lưu. Hồ sơ nghiệp vụ lưu khóa của bản ghi (id) và mã |
| Sự kiện | Thêm, sửa, đổi trạng thái, xóa xong thì phát sự kiện thay đổi danh mục (BR-DMC-C-07) để phân hệ dùng danh mục làm mới bộ nhớ đệm |
| Phân quyền | Theo mã quyền chức năng ở mục 2.3, khai báo trên hệ thống quản lý người dùng tập trung. Dịch vụ kiểm quyền theo mã chức năng của API |

## Vai trò và phân quyền

Mỗi danh mục có bảy mã quyền: {tiền tố}00 vào phân hệ / thấy menu, 01 xem danh sách, 02 xem chi tiết, 03 thêm mới, 04 chỉnh sửa, 05 đổi trạng thái, 06 xóa. Nhà cung cấp / Nhà thầu có thêm NCC07 nhập từ Excel. Tổng quan dùng DMDC00.

| Danh mục                         | Tiền tố | QTHT    | TTMS    |
|----------------------------------|---------|---------|---------|
| Nhà cung cấp / Nhà thầu          | NCC     | 00 – 07 | 00 – 07 |
| Loại đối tác                     | LDT     | 00 – 06 | 00 – 06 |
| Đơn vị tính                      | DVT     | 00 – 06 | 00 – 06 |
| Tiền tệ                          | TIENTE  | 00 – 06 | 00 – 06 |
| Loại hàng hoá / dịch vụ          | LHHDV   | 00 – 06 | 00 – 06 |
| Lĩnh vực đầu tư                  | LVDT    | 00 – 06 | –       |
| Loại khoản đầu tư                | LKDT    | 00 – 06 | –       |
| Cấp phê duyệt đề tài / dự án     | CPD     | 00 – 06 | –       |
| Loại dự án / đề tài              | LDADT   | 00 – 06 | –       |
| Loại dự án (chi tiết)            | LDACT   | 00 – 06 | –       |
| Tính chất tài sản hình thành     | TCKDT   | 00 – 06 | –       |
| Loại gói thầu                    | LGT     | 00 – 06 | –       |
| Hình thức lựa chọn nhà thầu      | HTLCNT  | 00 – 06 | –       |
| Phương thức lựa chọn nhà thầu    | PTLCNT  | 00 – 06 | –       |
| Phương pháp đánh giá             | PPDG    | 00 – 06 | –       |
| Loại hợp đồng                    | LHD     | 00 – 06 | –       |
| Hình thức bảo đảm                | HTBD    | 00 – 06 | –       |
| Loại tài liệu căn cứ             | LTLCC   | 00 – 06 | –       |
| Ngưỡng phân luồng                | NPL     | 00 – 06 | –       |
| Phân cấp thẩm quyền khoản đầu tư | PCTQ    | 00 – 06 | –       |
| Tổng quan                        | DMDC00  | Có      | Có      |

Bảng trên là gán mặc định. Quản trị đổi được trên hệ thống quản lý người dùng tập trung. NDNV không vào màn quản trị. API ô chọn và API chi tiết mở cho mọi người dùng đã đăng nhập.

| Thao tác | Điều kiện hiển thị |
|----|----|
| Mục menu, thẻ Tổng quan của danh mục | Có mã 00 hoặc 01 của danh mục |
| Màn danh sách | Có 01; vào thẳng đường dẫn khi không có quyền thì màn hiện "Bạn chưa được cấp quyền truy cập chức năng này" |
| Link Mã, màn Chi tiết | Có 02 |
| \[Thêm mới\] | Có 03 |
| Icon Chỉnh sửa, nút \[Chỉnh sửa\] ở Chi tiết | Có 04 |
| Công tắc Trạng thái | Có 05; không có thì công tắc chỉ hiển thị, không bấm được |
| Icon Xóa | Có 06 |
| Nhóm Đầu tư mua sắm trên menu | Có quyền ít nhất một danh mục trong nhóm |

## Trạng thái bản ghi

| Trạng thái | Mã | Lưu | Ý nghĩa |
|----|----|----|----|
| Đang hoạt động | ACTIVE | 1 | Hiện ở ô chọn khi nhập liệu nghiệp vụ. Bản ghi mới luôn ở trạng thái này |
| Dừng hoạt động | INACTIVE | 0 | Không hiện ở ô chọn khi nhập liệu; vẫn hiện ở ô lọc tìm kiếm và trên hồ sơ đã lưu |
| Đã xóa | – | is_deleted = 1 | Không hiện ở mọi danh sách; mã giữ lại, không cấp lại |

## Quy tắc chung

| Mã | Quy tắc |
|----|----|
| BR-DMC-C-01 | **Mã duy nhất, không đổi.** Mã bắt buộc, duy nhất trong danh mục. So không phân biệt hoa thường, tính cả bản ghi Dừng hoạt động và bản ghi đã xóa. Mã của bản ghi đã xóa không cấp lại cho bản ghi mới. Mã không sửa được sau khi lưu. Hai người cùng thêm một mã: yêu cầu đến trước được lưu, yêu cầu đến sau nhận thông báo trùng mã |
| BR-DMC-C-02 | **Dừng hoạt động không ảnh hưởng dữ liệu cũ.** Bản ghi Dừng hoạt động không hiện ở ô chọn khi nhập liệu nghiệp vụ. Hồ sơ đã lưu bản ghi đó vẫn hiện đúng tên, và khi sửa hồ sơ thì giá trị đang giữ vẫn ở ô chọn. Ô lọc tìm kiếm của danh sách nghiệp vụ có cả bản ghi Dừng hoạt động. Đổi trạng thái không chặn theo tham chiếu, trừ khi Kích hoạt quy tắc của bảng luật (mục 3.4) |
| BR-DMC-C-03 | **Chặn xóa khi đã tham chiếu.** Chỉ xóa được bản ghi chưa có tham chiếu. Kiểm tra theo bảng nơi dùng ở từng danh mục ("Nơi dùng"), tính cả hồ sơ ở mọi trạng thái và bản ghi của danh mục khác (ví dụ Loại dự án (chi tiết) trỏ tới Loại dự án / đề tài). Bản ghi đã tham chiếu thì chỉ Dừng hoạt động. Xóa là xóa mềm |
| BR-DMC-C-04 | **Lịch sử.** Mỗi lần thêm, sửa, đổi trạng thái, xóa thì tăng Phiên bản thêm 1 và ghi một dòng lịch sử: thao tác, người thực hiện, thời điểm, nội dung thay đổi. Nội dung thay đổi theo mẫu: "Tạo mới", "Cập nhật {danh sách trường đổi}", "Kích hoạt", "Dừng hoạt động", "Xóa". Bản chi tiết ghi giá trị cũ, giá trị mới của từng trường |
| BR-DMC-C-05 | **Khóa lạc quan.** Sửa, đổi trạng thái, xóa phải gửi version đang xem. Khác version hiện tại thì từ chối và báo dữ liệu đã thay đổi. Người khác đã xóa bản ghi thì báo "Bản ghi không còn tồn tại" và tải lại lưới |
| BR-DMC-C-06 | **Chuẩn hóa dữ liệu nhập.** Mọi ô chữ được cắt khoảng trắng đầu cuối; ô chỉ có khoảng trắng coi là rỗng. Mã khi gõ được bỏ dấu (đ thành d), bỏ khoảng trắng, viết hoa, chỉ nhận chữ, số, -, \_. Nhập hoặc dán vượt độ dài thì ô chỉ nhận đủ độ dài tối đa và báo inline |
| BR-DMC-C-07 | **Sự kiện thay đổi danh mục.** Sau khi giao dịch thêm, sửa, đổi trạng thái, xóa ghi xong, phát một sự kiện lên topic category.changed.v1. Nội dung: mã sự kiện, loại thao tác, loại danh mục, khóa, mã, tên, trạng thái, cờ đã xóa, phiên bản, thời điểm, người thực hiện. Khóa thông điệp là mã bản ghi. Gửi lỗi chỉ ghi nhật ký, không hoàn tác thay đổi. Bật hay tắt theo cấu hình (câu hỏi 11) |
| BR-DMC-C-08 | **Ô chọn.** API ô chọn trả bản ghi Đang hoạt động, chưa xóa, xếp như lưới của danh mục (mục 2.6). Danh mục có trường lọc (ví dụ Phạm vi áp dụng của Hình thức bảo đảm) nhận tham số lọc tương ứng |

## Khuôn chức năng danh mục

Mọi danh mục ở mục 3.2 và 3.3 theo đúng khuôn này. Mục của từng danh mục chỉ ghi: nhãn, cột riêng, ô lọc riêng, trường riêng, quy tắc riêng. Bảng luật ở mục 3.4 theo khuôn này, trừ các chỗ mục 3.4 ghi khác. Trong khuôn, {tên} là tên danh mục viết thường, ví dụ "loại hợp đồng". Mỗi danh mục kiểm thử đủ AC-KC-01 … AC-KC-20 với dữ liệu của danh mục đó, cộng AC riêng ở mục của danh mục.

### Danh sách và tìm kiếm

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
|  | **Tiêu đề** |  |  |  |  |
| 1 | Tiêu đề màn | Text | Output | – | "Danh sách {tên}". |
| 2 | \[Thêm mới\] | Button | Input | – | Mở hộp thoại Thêm mới (2.6.2). Hiện khi có quyền 03. |
|  | **Tìm kiếm nhanh** |  |  |  |  |
| 3 | Từ khóa | Search box \[255\] | Input | Rỗng | Placeholder "Tìm theo mã hoặc tên {tên}". **Chứa** trên Mã, Tên, không phân biệt hoa thường và dấu. Tự tìm sau 300 ms ngừng gõ hoặc khi Enter, về trang 1. Ẩn khi khối nâng cao đang mở. Mapping: cột code, name của bảng danh mục. |
| 4 | \[Tìm kiếm nâng cao\] / \[Ẩn tìm kiếm nâng cao\] | Button | Input | – | Mở, đóng khối nâng cao. Khối mở thì danh sách lọc theo điều kiện nâng cao, không theo Từ khóa. |
|  | **Tìm kiếm nâng cao** |  |  |  |  |
| 5 | Mã | Textbox \[50\] | Input | Rỗng | Placeholder "Nhập mã {tên}". **Chứa**. |
| 6 | Tên | Textbox \[255\] | Input | Rỗng | Placeholder "Nhập tên {tên}". **Chứa**, không phân biệt hoa thường và dấu. |
| 7 | Trạng thái | Dropdown một lựa chọn | Input | Tất cả | Tất cả, Đang hoạt động, Dừng hoạt động. **Bằng**. Mapping: cột status. |
| 8 | Ngày cập nhật | Date range \[DD/MM/YYYY – DD/MM/YYYY\] | Input | Rỗng | Từ ngày, Đến ngày, tính cả hai đầu. Chỉ nhập một đầu thì lọc mở về đầu còn lại. Mapping: cột updated_at. |
| 9 | Ô lọc riêng | Theo danh mục | Input | Rỗng | Ghi ở mục của danh mục. |
| 10 | \[Làm mới\] | Button | Input | – | Đưa điều kiện nâng cao về giá trị khởi tạo, tải lại trang 1. |
| 11 | \[Tìm kiếm\] | Button | Input | – | Áp đồng thời mọi điều kiện nâng cao, về trang 1. |
|  | **Lưới** |  |  |  |  |
| 12 | STT | Number | Output | – | Theo vị trí trong tập kết quả, liên tục qua các trang. |
| 13 | Thao tác | Icon | Input | – | Chỉnh sửa (tooltip "Chỉnh sửa", quyền 04): mở hộp thoại Chỉnh sửa. Xóa (tooltip "Xóa", quyền 06): mở xác nhận xóa (2.6.5). |
| 14 | Trạng thái | Switch | Input | Theo dữ liệu | Bật = Đang hoạt động, tắt = Dừng hoạt động. Bấm thì mở xác nhận đổi trạng thái (2.6.4). Không có quyền 05 thì chỉ hiển thị. Mapping: cột status. |
| 15 | Mã {tên} | Link | Input | Theo dữ liệu | Mở màn Chi tiết (2.6.3) khi có quyền 02, không có thì là chữ thường. Mapping: cột code. |
| 16 | Tên {tên} | Text | Output | Theo dữ liệu | Tối đa 2 dòng, quá dài hiện tooltip. Mapping: cột name. |
| 17 | Cột riêng | Theo danh mục | Output | Theo dữ liệu | Ghi ở mục của danh mục, đặt giữa Tên và Ngày cập nhật. |
| 18 | Ngày cập nhật | Datetime \[DD/MM/YYYY HH:mm\] | Output | Theo dữ liệu | Mapping: cột updated_at. |
|  | **Phân trang** |  |  |  |  |
| 19 | Số bản ghi mỗi trang | Dropdown | Input | 10 | 10, 25, 50. Đổi thì về trang 1. |
| 20 | Tổng số bản ghi, chuyển trang | Text, Button | Output, Input | – | "Tổng số bản ghi: {n}"; trang đầu, trước, số trang, sau, trang cuối. |

- **Sắp xếp:** Mã tăng dần, trừ danh mục ghi khác. Không sắp theo cột khi bấm tiêu đề.

- **Phạm vi:** danh sách có cả bản ghi Đang hoạt động và Dừng hoạt động, không có bản ghi đã xóa.

- **Giữ điều kiện:** điều kiện tìm và trang hiện tại ghi trên địa chỉ trang, quay lại từ màn Chi tiết thì giữ nguyên.

### Thêm mới, chỉnh sửa

Hộp thoại cỡ vừa. Tiêu đề "Thêm mới {tên}" hoặc "Chỉnh sửa {tên}".

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Mã {tên} | Textbox \[50\] | Input | Rỗng; khi sửa là giá trị hiện tại | **Bắt buộc.** Placeholder "Nhập mã {tên}". Chuẩn hóa theo BR-DMC-C-06, kiểm tra theo BR-DMC-C-01. Khi sửa: khóa, không có dấu bắt buộc. Mapping: cột code. |
| 2 | Tên {tên} | Textbox \[255\] | Input | Rỗng | **Bắt buộc.** Placeholder "Nhập tên {tên}". Không giới hạn loại ký tự. Mapping: cột name. |
| 3 | Trường riêng | Theo danh mục | Input | Theo danh mục | Ghi ở mục của danh mục, đặt giữa Tên và Mô tả. |
| 4 | Mô tả | Textarea \[500\] | Input | Rỗng | Placeholder "Nhập mô tả". 3 dòng. Mapping: cột description. |
| 5 | \[Hủy\] | Button | Input | – | Đóng hộp thoại. Đã đổi dữ liệu thì hỏi "Hủy thay đổi?" — "Dữ liệu bạn vừa nhập sẽ không được lưu. Bạn có chắc chắn muốn hủy?", nút \[Tiếp tục nhập\] / \[Hủy thay đổi\]. Phím Esc không đóng hộp thoại. |
| 6 | \[Lưu\] | Button | Input | – | Kiểm tra mọi trường. Hợp lệ: thêm thì tạo bản ghi Đang hoạt động, Phiên bản 1; sửa thì ghi trường đổi. Ghi lịch sử, phát sự kiện, đóng hộp thoại, báo thành công, tải lại lưới. Khóa nút trong lúc lưu. Sửa mà không đổi gì thì báo "Chưa có thay đổi nào để lưu", không ghi. |

Kiểm tra khi rời ô và khi bấm \[Lưu\]. Lỗi hiện dưới ô.

### Chi tiết

Màn riêng, mở từ link Mã. Đầu màn: \[Quay lại\] (về danh sách, giữ điều kiện tìm), tiêu đề "Chi tiết {tên}", \[Chỉnh sửa\] (quyền 04, mở hộp thoại 2.6.2; lưu xong tải lại màn Chi tiết).

| STT | Tên | Kiểu dữ liệu | Mô tả |
|----|----|----|----|
|  | **Thông tin {tên}** |  |  |
| 1 | Mã, Tên, trường riêng | Text | Như hộp thoại; giá trị rỗng hiện "-". |
| 2 | Trạng thái | Tag | Đang hoạt động (xanh lá), Dừng hoạt động (xám). Mapping: cột status. |
| 3 | Phiên bản | Number | Mapping: cột revision_no. |
| 4 | Người tạo, Ngày tạo | Text, Datetime | Mapping: cột created_by_name, created_at. |
| 5 | Người cập nhật, Ngày cập nhật | Text, Datetime | Mapping: cột updated_by_name, updated_at. |
| 6 | Mô tả | Text | Mapping: cột description. |
|  | **Lịch sử thay đổi** |  |  |
| 7 | Phiên bản | Number | Mapping: cột revision_no của bảng lịch sử. |
| 8 | Người thực hiện | Text | Mapping: cột actor_name của bảng lịch sử. |
| 9 | Thời điểm | Datetime \[DD/MM/YYYY HH:mm\] | Mapping: cột action_at của bảng lịch sử. |
| 10 | Nội dung thay đổi | Text | Theo BR-DMC-C-04. Mapping: cột change_summary của bảng lịch sử. |

Lịch sử xếp Phiên bản giảm dần, không phân trang.

### Đổi trạng thái

| Chiều | Hộp xác nhận | Kết quả |
|----|----|----|
| Đang hoạt động → Dừng hoạt động | Mức cảnh báo. Tiêu đề "Dừng hoạt động". "Bạn có chắc chắn muốn dừng hoạt động {tên}: {Tên} - {Mã} không?" Nút \[Không\] / \[Có\] | Bản ghi sang Dừng hoạt động, tăng Phiên bản, ghi lịch sử "Dừng hoạt động", phát sự kiện. Toast "Cập nhật trạng thái thành công." |
| Dừng hoạt động → Đang hoạt động | Mức thông tin. Tiêu đề "Kích hoạt". "Bạn có chắc chắn muốn kích hoạt {tên}: {Tên} - {Mã} không?" Nút \[Không\] / \[Có\] | Như trên, lịch sử "Kích hoạt" |

API gửi trạng thái đích, không gửi lệnh đảo trạng thái. Hai người cùng đổi trạng thái thì xử lý theo thứ tự đến; người đến sau nhận thông báo dữ liệu đã thay đổi (BR-DMC-C-05). Bấm \[Không\] hoặc lỗi thì công tắc trả về như cũ.

### Xóa

Hộp xác nhận mức nguy hiểm. Tiêu đề "Bạn có chắc chắn muốn xóa không?", nội dung "Bạn có chắc chắn muốn xóa {tên}: {Tên} - {Mã} không?", nút \[Hủy\] / \[Xóa\]. Bấm \[Xóa\]: hệ thống kiểm tra tham chiếu (BR-DMC-C-03). Chưa có tham chiếu thì xóa mềm, ghi lịch sử "Xóa", phát sự kiện, toast "Xóa {tên} thành công.", tải lại lưới. Nếu dòng xóa là dòng cuối của trang thì lùi về trang trước. Xóa được cả bản ghi Đang hoạt động và Dừng hoạt động.

### Thông báo

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Bỏ trống trường bắt buộc | Inline: "Vui lòng nhập {nhãn}" (ô nhập) / "Vui lòng chọn {nhãn}" (ô chọn). Không lưu |
| Mã có ký tự ngoài chữ không dấu, số, -, \_ | Inline: "Mã chỉ gồm chữ không dấu, chữ số và dấu gạch" |
| Nhập, dán vượt độ dài | Inline: "Không được nhập quá {n} ký tự." Ô chỉ nhận {n} ký tự đầu |
| Trùng mã (BR-DMC-C-01) | Inline ở Mã: "Mã {mã} đã tồn tại trong danh mục". Hộp thoại giữ nguyên |
| Thêm, lưu thành công | Toast: "Thêm {tên} thành công." / "Lưu {tên} thành công." |
| Thêm, lưu lỗi khác | Toast: "Thêm {tên} thất bại. Vui lòng thử lại." / "Lưu {tên} thất bại. Vui lòng thử lại." Hộp thoại giữ dữ liệu |
| Đổi trạng thái lỗi | Toast: "Cập nhật trạng thái thất bại. Vui lòng thử lại." Công tắc trả về như cũ |
| Xóa bản ghi đã tham chiếu | Toast: "Không thể xóa vì bản ghi đã được sử dụng, vui lòng chuyển sang Dừng hoạt động". Không xóa |
| Bản ghi đã bị người khác xóa | Toast: "Bản ghi không còn tồn tại". Tải lại lưới; ở màn Chi tiết thì về danh sách |
| version khác hiện tại | Toast: "Dữ liệu đã có sự thay đổi trên hệ thống. Vui lòng làm mới dữ liệu và thử lại." |
| Ngày cập nhật: Đến ngày nhỏ hơn Từ ngày | Inline: "Đến ngày phải lớn hơn hoặc bằng Từ ngày". Không tìm |
| Chưa có bản ghi hoặc không khớp điều kiện | Lưới: "Không có dữ liệu" |
| Không tải được danh sách | Tại vùng lưới: "Không thể tải dữ liệu. Vui lòng thử lại." Giữ điều kiện tìm |
| Không có quyền | Màn: "Bạn chưa được cấp quyền truy cập chức năng này" |

### Tiêu chí chấp nhận của khuôn

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-KC-01 | QTHT; danh mục có 12 bản ghi, 2 bản ghi Dừng hoạt động | Mở danh mục từ menu | Lưới 10 dòng, xếp Mã tăng dần, có cả 2 bản ghi Dừng hoạt động; "Tổng số bản ghi: 12" |
| AC-KC-02 | Có bản ghi tên "Đơn vị tư vấn" | Nhập "don vi tu", chờ 300 ms | Còn các dòng có Mã hoặc Tên chứa chuỗi; về trang 1 |
| AC-KC-03 | Đã nhập Từ khóa | Mở khối nâng cao, chọn Trạng thái = Dừng hoạt động, \[Tìm kiếm\] | Chỉ các bản ghi Dừng hoạt động; Từ khóa không áp |
| AC-KC-04 | Khối nâng cao: Từ ngày 10/11/2026, Đến ngày 01/11/2026 | \[Tìm kiếm\] | Inline "Đến ngày phải lớn hơn hoặc bằng Từ ngày", không tìm |
| AC-KC-05 | Đã lọc, đang ở trang 2 | Mở Chi tiết một bản ghi, bấm \[Quay lại\] | Về danh sách, giữ điều kiện lọc và trang 2 |
| AC-KC-06 | Hộp thoại Thêm mới | Gõ "loại đặc biệt 1" vào Mã | Ô hiện "LOAIDACBIET1" |
| AC-KC-07 | Hộp thoại Thêm mới | Bỏ trống Mã, Tên, bấm \[Lưu\] | Inline "Vui lòng nhập Mã {tên}", "Vui lòng nhập Tên {tên}"; không lưu |
| AC-KC-08 | Có bản ghi mã "ABC" Dừng hoạt động | Thêm mã "abc", \[Lưu\] | Inline "Mã ABC đã tồn tại trong danh mục"; không lưu |
| AC-KC-09 | Bản ghi mã "XYZ" đã bị xóa | Thêm mã "XYZ", \[Lưu\] | Inline "Mã XYZ đã tồn tại trong danh mục" |
| AC-KC-10 | Hộp thoại Thêm mới, dữ liệu hợp lệ | \[Lưu\] | Bản ghi mới Đang hoạt động, Phiên bản 1; toast "Thêm {tên} thành công."; lịch sử có dòng "Tạo mới" |
| AC-KC-11 | Mở Chỉnh sửa | Không đổi gì, \[Lưu\] | Toast "Chưa có thay đổi nào để lưu"; Phiên bản không đổi |
| AC-KC-12 | Mở Chỉnh sửa | Ô Mã | Ô khóa, không sửa được |
| AC-KC-13 | Đã sửa Tên trong hộp thoại | Bấm \[Hủy\] | Hỏi "Hủy thay đổi?"; \[Tiếp tục nhập\] giữ hộp thoại, \[Hủy thay đổi\] đóng, không lưu |
| AC-KC-14 | Bản ghi Đang hoạt động, Phiên bản 3 | Bấm công tắc, \[Có\] | Bản ghi Dừng hoạt động, Phiên bản 4; lịch sử "Dừng hoạt động"; ô chọn ở phân hệ dùng danh mục không còn bản ghi này |
| AC-KC-15 | Hồ sơ cũ đã lưu bản ghi X; X đã Dừng hoạt động | Mở hồ sơ cũ để xem và để sửa | Hiện đúng tên X; khi sửa, ô chọn vẫn có X là giá trị đang giữ |
| AC-KC-16 | Bản ghi chưa có tham chiếu | Icon Xóa, \[Xóa\] | Bản ghi biến khỏi lưới; toast "Xóa {tên} thành công." |
| AC-KC-17 | Bản ghi đã được một hồ sơ lưu | Icon Xóa, \[Xóa\] | Toast "Không thể xóa vì bản ghi đã được sử dụng, vui lòng chuyển sang Dừng hoạt động"; bản ghi còn nguyên |
| AC-KC-18 | Hai QTHT cùng mở Chỉnh sửa một bản ghi | Người thứ nhất lưu, rồi người thứ hai lưu | Người thứ hai nhận "Dữ liệu đã có sự thay đổi trên hệ thống. Vui lòng làm mới dữ liệu và thử lại." |
| AC-KC-19 | Người dùng có quyền 01, 02, không có 03 – 06 | Mở danh sách | Không có \[Thêm mới\], icon Chỉnh sửa, icon Xóa; công tắc chỉ hiển thị; Mã vẫn mở Chi tiết, không có \[Chỉnh sửa\] |
| AC-KC-20 | NDNV không có quyền danh mục | Mở đường dẫn danh sách | "Bạn chưa được cấp quyền truy cập chức năng này"; không thấy mục menu |

# THIẾT KẾ CHI TIẾT

## TỔNG QUAN PHÂN HỆ

### Tổng quan Danh mục dùng chung

Quy tắc của nghiệp vụ 3.1.1:

| Mã | Quy tắc |
|----|----|
| BR-DMC-01-01 | **Thẻ nào hiện.** Mỗi danh mục trên menu (mục 2.1) mà người dùng có quyền 00 hoặc 01 thì có một thẻ, kể cả danh mục có sẵn và Quản lý E-form. Thẻ xếp theo thứ tự menu |
| BR-DMC-01-02 | **Số bản ghi.** Số trên thẻ là tổng bản ghi chưa xóa của danh mục, gồm cả Dừng hoạt động. Mỗi thẻ tải riêng; một thẻ lỗi thì thẻ đó hiện "-" kèm tooltip "Không tải được số lượng bản ghi", các thẻ khác vẫn hiện |

#### DTMS_CN_0343 Tổng quan Danh mục dùng chung

##### Thông tin chung chức năng

- **Mục đích:** Màn vào của phân hệ, cho thấy các danh mục người dùng được quản trị và số bản ghi của từng danh mục; mở danh mục.

- **Người dùng mục tiêu:** QTHT, TTMS (mục 2.3).

- **Đường dẫn truy cập:** Danh sách phân hệ \> thẻ Danh mục dùng chung \> \[Truy cập\]; hoặc menu Tổng quan.

- **Tiền điều kiện:** Đã đăng nhập, có quyền DMDC00.

- **Hậu điều kiện:** Không đổi dữ liệu.

##### Mô tả chi tiết các thành phần

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Tiêu đề khối | Text | Output | – | "Các module trong phân hệ". |
| 2 | Thẻ danh mục | Card | Input | Theo quyền | Icon của danh mục; dòng 1 "Danh mục {Tên menu}"; dòng 2 "Quản lý danh sách {tên}."; số bản ghi (BR-DMC-01-02); mũi tên. Bấm cả thẻ để mở danh sách của danh mục. |
| 3 | Thông báo trống | Text | Output | – | Không có thẻ nào: "Bạn chưa được cấp quyền truy cập module nào trong phân hệ này". |

##### Luồng nghiệp vụ

| Bước | Mô tả |
|----|----|
| 1 | Người dùng vào phân hệ; hệ thống hiện thẻ theo BR-DMC-01-01, tải số bản ghi theo BR-DMC-01-02. |
| 2 | Người dùng bấm thẻ; hệ thống mở danh sách của danh mục, mục menu tương ứng sáng lên. |

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0343-01 | QTHT | Mở Tổng quan | Có thẻ của mọi mục menu ở mục 2.1, theo thứ tự menu |
| AC-0343-02 | TTMS với quyền mặc định | Mở Tổng quan | Chỉ có thẻ Nhà cung cấp / Nhà thầu, Loại đối tác, Đơn vị tính, Tiền tệ, Loại hàng hoá / dịch vụ |
| AC-0343-03 | Tiền tệ có 6 bản ghi, 1 bản ghi Dừng hoạt động, 1 bản ghi đã xóa | Mở Tổng quan | Thẻ Tiền tệ hiện 6 |
| AC-0343-04 | API đếm của Loại hợp đồng lỗi | Mở Tổng quan | Thẻ Loại hợp đồng hiện "-", tooltip "Không tải được số lượng bản ghi"; các thẻ khác có số |
| AC-0343-05 | Người dùng có DMDC00, không có quyền danh mục nào | Mở Tổng quan | "Bạn chưa được cấp quyền truy cập module nào trong phân hệ này" |

## DANH MỤC CHUNG

Các danh mục ở mục này nằm ở phần phẳng của menu, dùng chung cho mọi nghiệp vụ Đầu tư mua sắm.

### Nhà cung cấp / Nhà thầu

Danh mục khác khuôn chung ở năm điểm: mã do hệ thống sinh, khóa chống trùng là Mã số thuế, hộp thoại lớn hai cột, có tìm kiếm nâng cao riêng, và có nhập từ Excel.

Quy tắc của nghiệp vụ 3.2.1:

| Mã | Quy tắc |
|----|----|
| BR-DMC-02-01 | **Mã tự sinh.** Mã có dạng NCC- cộng 6 chữ số, bằng số lớn nhất đã cấp (kể cả bản ghi đã xóa) cộng 1, ví dụ NCC-000013. Hệ thống sinh khi lưu, người dùng không nhập, không sửa |
| BR-DMC-02-02 | **Chống trùng.** Nhà cung cấp Trong nước: Mã số thuế duy nhất trong danh mục, tính cả bản ghi Dừng hoạt động. Nhà cung cấp Nước ngoài có Mã số thuế: như Trong nước. Nhà cung cấp Nước ngoài không có Mã số thuế: trùng khi cùng Tên (không phân biệt hoa thường và dấu) và cùng Quốc gia |
| BR-DMC-02-03 | **Phân loại và Quốc gia.** Trong nước thì Quốc gia là Việt Nam, khóa ô, Mã số thuế bắt buộc theo khuôn 10 số hoặc 10 số - 3 số. Nước ngoài thì Quốc gia bắt buộc chọn (khác Việt Nam), Mã số thuế không bắt buộc, nhập tự do. Đổi Phân loại sang Trong nước thì Quốc gia đặt lại thành Việt Nam; sang Nước ngoài thì xóa Quốc gia nếu đang là Việt Nam |
| BR-DMC-02-04 | **Tình trạng chỉ hiển thị.** Tình trạng (Bình thường, Cấm đến ngày, Hạn chế) do nghiệp vụ lựa chọn nhà thầu ghi khi đưa vào hoặc gỡ khỏi danh sách cấm; màn này không sửa. Hết ngày cấm thì Tình trạng về Bình thường |
| BR-DMC-02-05 | **Ô chọn nhà cung cấp nhận yêu cầu báo giá.** Chỉ có nhà cung cấp Đang hoạt động, Tình trạng khác Cấm; lọc theo Ngành hàng cung cấp chứa ngành hàng của hạng mục |
| BR-DMC-02-06 | **Nhập từ Excel.** Theo DTMS_CN_0312: kiểm tra từng dòng như hộp thoại Thêm mới, cộng trùng Mã số thuế giữa các dòng trong tệp; chỉ nhập các dòng hợp lệ sau khi người dùng xác nhận |

#### DTMS_CN_0306 Danh mục Nhà cung cấp / Nhà thầu

##### Thông tin chung chức năng

- **Mục đích:** Quản lý nhà cung cấp, nhà thầu nhận yêu cầu báo giá, tham gia lựa chọn nhà thầu và ký hợp đồng.

- **Người dùng mục tiêu:** QTHT, TTMS.

- **Đường dẫn truy cập:** Danh mục dùng chung \> Nhà cung cấp / Nhà thầu.

- **Tài nguyên API:** suppliers. **Bảng:** supplier, supplier_goods_type.

- **Chức năng:** 0306 xem danh sách và tìm kiếm, 0307 thêm mới, 0308 xem chi tiết, 0309 chỉnh sửa, 0310 đổi trạng thái, 0311 xóa (khuôn mục 2.6, khác ở các bảng dưới); 0312 nhập từ Excel (mục 3.2.1.2).

- **Sắp xếp:** Mã tăng dần.

##### Danh sách và tìm kiếm

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Tiêu đề màn | Text | Output | – | "Danh sách nhà cung cấp". Bên phải: \[Nhập từ Excel\] (quyền NCC07), \[Thêm mới\]. |
| 2 | Từ khóa | Search box \[255\] | Input | Rỗng | Placeholder "Tìm kiếm theo mã, tên, mã số thuế nhà cung cấp". **Chứa** trên Mã, Tên, Mã số thuế. Mapping: supplier.code, .name, .tax_code. |
| 3 | Mã nhà cung cấp | Textbox \[50\] | Input | Rỗng | Ô nâng cao. **Chứa**. Mapping: supplier.code. |
| 4 | Tên nhà cung cấp | Textbox \[255\] | Input | Rỗng | Ô nâng cao. **Chứa**, không phân biệt dấu. Mapping: supplier.name. |
| 5 | Mã số thuế | Textbox \[50\] | Input | Rỗng | Ô nâng cao. **Chứa**. Mapping: supplier.tax_code. |
| 6 | Phân loại | Dropdown một lựa chọn | Input | Tất cả | Ô nâng cao. Tất cả, Trong nước, Nước ngoài. **Bằng**. Mapping: supplier.supplier_type. |
| 7 | Quốc gia | Dropdown một lựa chọn, có tìm kiếm | Input | Rỗng | Ô nâng cao. **Bằng**. Mapping: supplier.country_code. |
| 8 | Ngành hàng | Dropdown một lựa chọn, có tìm kiếm | Input | Rỗng | Ô nâng cao. Gồm cả ngành hàng Dừng hoạt động. **Chứa** ngành hàng đã chọn. Mapping: supplier_goods_type.goods_service_type_id. |
| 9 | Trạng thái, Ngày cập nhật | Như khuôn | Input | Tất cả, Rỗng | Như khuôn 2.6.1 thành phần 7, 8. |
| 10 | Lưới | Table | Output | – | STT · Thao tác · Trạng thái · **Mã nhà cung cấp** (link Chi tiết) · Tên nhà cung cấp · Mã số thuế · Phân loại · Quốc gia · Ngành hàng (nối bằng dấu phẩy) · Email nhận yêu cầu báo giá · Người liên hệ · **Tình trạng** · Ngày cập nhật. Tình trạng là tag: "Bình thường" (xám), "Cấm đến DD/MM/YYYY" (đỏ), "Hạn chế" (vàng). Mapping: supplier.ban_status, .ban_until. |

##### Thêm mới, chỉnh sửa

Hộp thoại cỡ lớn, lưới hai cột. Tiêu đề "Thêm mới nhà cung cấp" hoặc "Chỉnh sửa nhà cung cấp". Ô "(2 cột)" chiếm cả hàng.

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Mã nhà cung cấp | Textbox | Output | "Hệ thống tự sinh" | Chỉ đọc, theo BR-DMC-02-01. Mapping: supplier.code. |
| 2 | Phân loại | Dropdown một lựa chọn | Input | Trong nước | **Bắt buộc.** Trong nước, Nước ngoài. Đổi theo BR-DMC-02-03. Mapping: supplier.supplier_type (DOMESTIC, FOREIGN). |
| 3 | Tên nhà cung cấp (2 cột) | Textbox \[255\] | Input | Rỗng | **Bắt buộc.** Chữ (có dấu), số, khoảng trắng và - & . , ( ). Sai: "Tên nhà cung cấp không đúng định dạng." Mapping: supplier.name. |
| 4 | Tên viết tắt / tên giao dịch | Textbox \[100\] | Input | Rỗng | Mapping: supplier.short_name. |
| 5 | Tên tiếng Anh | Textbox \[255\] | Input | Rỗng | Mapping: supplier.english_name. |
| 6 | Mã số thuế | Textbox \[50\] | Input | Rỗng | Bắt buộc khi Trong nước, theo khuôn ^\d{10}(-\d{3})?\$; Nước ngoài không bắt buộc, nhập tự do. Sai khuôn: "Mã số thuế không đúng định dạng." Trùng (BR-DMC-02-02): inline "Mã số thuế {x} đã tồn tại." Mapping: supplier.tax_code. |
| 7 | Quốc gia | Dropdown một lựa chọn, có tìm kiếm | Input | Việt Nam | **Bắt buộc.** Danh sách quốc gia của hệ thống. Khóa khi Trong nước. Mapping: supplier.country_code. |
| 8 | Địa chỉ (2 cột) | Textbox \[500\] | Input | Rỗng | **Bắt buộc.** Mapping: supplier.address. |
| 9 | Ngành hàng cung cấp (2 cột) | Dropdown nhiều lựa chọn, có tìm kiếm | Input | Rỗng | **Bắt buộc**, ít nhất một. Nguồn: Loại hàng hoá / dịch vụ Đang hoạt động, cộng giá trị đang giữ. Mapping: supplier_goods_type.goods_service_type_id. |
| 10 | Email nhận yêu cầu báo giá | Textbox \[255\] | Input | Rỗng | **Bắt buộc.** Một địa chỉ email. Sai: "Email nhận yêu cầu báo giá không đúng định dạng." Mapping: supplier.quote_email. |
| 11 | Email CC | Textbox \[500\] | Input | Rỗng | Placeholder "Nhiều email cách nhau bằng dấu ;". Mỗi địa chỉ đúng khuôn email. Mapping: supplier.cc_emails. |
| 12 | Người liên hệ | Textbox \[100\] | Input | Rỗng | Mapping: supplier.contact_name. |
| 13 | Số điện thoại | Textbox \[20\] | Input | Rỗng | 8–20 chữ số, cho phép + ở đầu và khoảng trắng. Mapping: supplier.phone. |
| 14 | Loại tiền báo giá thường dùng | Dropdown một lựa chọn | Input | Rỗng | Nguồn: danh mục Tiền tệ Đang hoạt động. Gợi ý loại tiền khi nhập báo giá. Mapping: supplier.default_currency_id. |
| 15 | Mô tả (2 cột) | Textarea \[500\] | Input | Rỗng | Mapping: supplier.description. |

Trùng Tên và Quốc gia của nhà cung cấp Nước ngoài không có Mã số thuế: toast "Nhà cung cấp {Tên} ({Quốc gia}) đã tồn tại.", hộp thoại giữ nguyên. Màn Chi tiết hiện đủ các trường trên cùng Tình trạng.

##### Nơi dùng, dữ liệu khởi tạo

| Nơi dùng (kiểm tra tham chiếu khi xóa) | Trường |
|----|----|
| Yêu cầu báo giá (ĐXMS, KĐT) | Nhà cung cấp nhận yêu cầu báo giá; nhà cung cấp của báo giá, cơ sở giá |
| Lựa chọn nhà thầu | Nhà thầu tham dự, nhà thầu trúng thầu, danh sách cấm |
| Hợp đồng | Bên cung cấp |

Dữ liệu khởi tạo: theo danh sách nhà cung cấp VHT cung cấp (câu hỏi 1).

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0306-01 | Mã lớn nhất đã cấp là NCC-000012 (đã xóa) | Thêm nhà cung cấp hợp lệ | Mã NCC-000013 |
| AC-0306-02 | Đang Thêm mới, Phân loại Trong nước | Xem ô Quốc gia | Việt Nam, khóa |
| AC-0306-03 | Trong nước, Mã số thuế "01012345" | \[Lưu\] | Inline "Mã số thuế không đúng định dạng." |
| AC-0306-04 | Đã có nhà cung cấp Mã số thuế 0101234567 (Dừng hoạt động) | Thêm nhà cung cấp cùng Mã số thuế | Inline "Mã số thuế 0101234567 đã tồn tại." |
| AC-0306-05 | Đã có "Theta Messtechnik GmbH", Đức, không có Mã số thuế | Thêm Nước ngoài "THETA MESSTECHNIK GMBH", Đức, không Mã số thuế | Toast "Nhà cung cấp THETA MESSTECHNIK GMBH (Đức) đã tồn tại." |
| AC-0306-06 | Đổi Phân loại sang Nước ngoài khi Quốc gia là Việt Nam | Xem ô | Quốc gia rỗng, mở khóa; Mã số thuế bỏ dấu bắt buộc |
| AC-0306-07 | Nhà cung cấp bị cấm đến 31/12/2026 | Mở danh sách | Tag "Cấm đến 31/12/2026" màu đỏ; ô chọn nhà cung cấp nhận yêu cầu báo giá không có nhà cung cấp này |
| AC-0306-08 | Nhà cung cấp đã nhận một yêu cầu báo giá | \[Xóa\] | Toast chặn xóa của khuôn; nhà cung cấp còn nguyên |
| AC-0306-09 | Ngành hàng "Dịch vụ tư vấn" đã Dừng hoạt động, nhà cung cấp X đang giữ ngành hàng này | Mở Chỉnh sửa X | Ô Ngành hàng vẫn có "Dịch vụ tư vấn"; thêm nhà cung cấp mới thì không chọn được |
| AC-0306-10 | Khối nâng cao: Phân loại Nước ngoài, Quốc gia Singapore | \[Tìm kiếm\] | Chỉ nhà cung cấp nước ngoài ở Singapore |

#### DTMS_CN_0312 Nhập nhà cung cấp từ Excel

##### Thông tin chung chức năng

- **Mục đích:** Thêm nhiều nhà cung cấp một lần từ tệp mẫu.

- **Người dùng mục tiêu:** QTHT, TTMS (quyền NCC07).

- **Đường dẫn truy cập:** Danh sách nhà cung cấp \> \[Nhập từ Excel\].

- **Hậu điều kiện:** Các dòng hợp lệ thành nhà cung cấp Đang hoạt động, mỗi dòng một dòng lịch sử "Tạo mới", phát sự kiện như Thêm mới.

##### Mô tả chi tiết các thành phần

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
|  | **Bước 1 — Nhập dữ liệu** |  |  |  |  |
| 1 | Tiêu đề | Text | Output | – | "Nhập dữ liệu". |
| 2 | Tệp mẫu | Text, Link | Input | – | "File mẫu import nhà cung cấp", link \[Tải file mẫu\] tải mau-nhap-nha-cung-cap.xlsx. Cột mẫu: Tên nhà cung cấp, Phân loại, Mã số thuế, Quốc gia, Địa chỉ, Ngành hàng cung cấp (mã, cách nhau dấu ;), Email nhận yêu cầu báo giá, Email CC, Người liên hệ, Số điện thoại, Loại tiền báo giá thường dùng (mã), Tên viết tắt, Tên tiếng Anh, Mô tả. |
| 3 | Vùng chọn tệp | File upload | Input | Rỗng | "Kéo thả file vào đây hoặc bấm để chọn" — "Hỗ trợ định dạng .xlsx, .csv (tối đa 10MB)". Một tệp. |
| 4 | \[Hủy\], \[Nhập dữ liệu\] | Button | Input | – | \[Nhập dữ liệu\] bật khi đã chọn tệp; đọc tệp, kiểm tra, sang bước 2. |
|  | **Bước 2 — Kết quả nhập dữ liệu** |  |  |  |  |
| 5 | Tổng hợp | Text | Output | – | "{n}/{N} dòng hợp lệ"; nút \[Nhập file mới\] quay về bước 1. |
| 6 | Bảng kết quả | Table | Output | – | STT · Kết quả (tag Hợp lệ / Lỗi) · Nội dung lỗi · Tên nhà cung cấp · Mã số thuế · Phân loại · Quốc gia · Ngành hàng · Email nhận yêu cầu báo giá. |
| 7 | \[Hủy\], \[Xác nhận nhập\] | Button | Input | – | \[Xác nhận nhập\] tắt khi 0 dòng hợp lệ; nhập các dòng hợp lệ, toast "Nhập nhà cung cấp thành công ({n} nhà cung cấp)", tải lại danh sách. |

##### Luồng nghiệp vụ

| Bước | Mô tả |
|----|----|
| 1 | Người dùng tải tệp mẫu, điền, chọn tệp, bấm \[Nhập dữ liệu\]. |
| 2 | Hệ thống kiểm tra từng dòng theo luật hộp thoại Thêm mới (3.2.1.1.3), trùng với danh mục (BR-DMC-02-02) và trùng Mã số thuế giữa các dòng trong tệp; mã ngành hàng, mã tiền tệ phải là bản ghi Đang hoạt động. Mỗi dòng lỗi ghi đủ lỗi, cách nhau dấu ;. |
| 3 | Người dùng xem kết quả, bấm \[Xác nhận nhập\]; hệ thống cấp mã theo BR-DMC-02-01 theo thứ tự dòng, lưu các dòng hợp lệ trong một giao dịch. |

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Sai định dạng tệp hoặc quá 10MB | Inline dưới vùng chọn: "Tệp không đúng định dạng .xlsx, .csv hoặc vượt quá 10MB." |
| Tệp không đúng cột mẫu | Toast: "Tệp không đúng mẫu. Vui lòng tải file mẫu và thử lại." |
| Tệp không có dòng dữ liệu | Toast: "Tệp không có dữ liệu." |
| Dữ liệu danh mục đổi giữa bước 2 và bước 3 (ví dụ người khác vừa thêm cùng Mã số thuế) | Dòng đó không nhập; toast ghi số dòng nhập được và số dòng bị bỏ |

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0312-01 | Tệp 20 dòng: dòng 7 trùng Mã số thuế đã có, dòng 15 thiếu email | \[Nhập dữ liệu\] | "18/20 dòng hợp lệ"; dòng 7, 15 tag Lỗi kèm nội dung lỗi |
| AC-0312-02 | Kết quả 18/20 | \[Xác nhận nhập\] | 18 nhà cung cấp mới, mã liên tiếp theo thứ tự dòng; toast "Nhập nhà cung cấp thành công (18 nhà cung cấp)" |
| AC-0312-03 | Hai dòng trong tệp cùng Mã số thuế, chưa có trong danh mục | \[Nhập dữ liệu\] | Cả hai dòng Lỗi, nội dung ghi trùng trong tệp |
| AC-0312-04 | Kết quả 0 dòng hợp lệ | Xem bước 2 | \[Xác nhận nhập\] tắt |
| AC-0312-05 | Chọn tệp .pdf | Chọn tệp | Inline lỗi định dạng; \[Nhập dữ liệu\] tắt |

### Loại đối tác

#### DTMS_CN_0004 Danh mục Loại đối tác

##### Thông tin chung chức năng

- **Mục đích:** Phân loại đối tác (nhà cung cấp hàng hoá, nhà thầu xây lắp, đơn vị tư vấn…) dùng chung toàn VHT.

- **Người dùng mục tiêu:** QTHT, TTMS.

- **Đường dẫn truy cập:** Danh mục dùng chung \> Loại đối tác.

- **Tài nguyên API:** partner-types. **Bảng:** partner_type.

- **Chức năng:** 0004 xem danh sách và tìm kiếm, 0005 thêm mới, 0006 xem chi tiết, 0007 chỉnh sửa, 0008 đổi trạng thái, 0009 xóa — đúng khuôn mục 2.6, không có trường riêng.

##### Nơi dùng, dữ liệu khởi tạo

Nơi dùng: lọc đối tác khi gửi yêu cầu báo giá, lựa chọn nhà thầu, hợp đồng. Trong phạm vi tài liệu này chưa có trường nghiệp vụ nào lưu Loại đối tác, nên kiểm tra tham chiếu khi xóa chưa có điều kiện. Phân hệ nào lưu trường này thì bổ sung vào kiểm tra.

Dữ liệu khởi tạo (Tên): Nhà cung cấp hàng hoá; Nhà thầu xây lắp, lắp đặt; Đơn vị tư vấn; Nhà cung cấp dịch vụ; Đối tác chiến lược; Đơn vị trong Tập đoàn (Dừng hoạt động).

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0004-01 | QTHT hoặc TTMS | Mở Loại đối tác | Danh sách theo khuôn, đạt AC-KC-01 … AC-KC-20 |
| AC-0004-02 | Loại đối tác chưa có tham chiếu | \[Xóa\] | Xóa được |

### Đơn vị tính

#### DTMS_CN_0016 Danh mục Đơn vị tính

##### Thông tin chung chức năng

- **Mục đích:** Đơn vị tính của hạng mục ĐXMS, KĐT, yêu cầu báo giá, gói thầu, hợp đồng; dùng chung toàn VHT.

- **Người dùng mục tiêu:** QTHT, TTMS.

- **Đường dẫn truy cập:** Danh mục dùng chung \> Đơn vị tính.

- **Tài nguyên API:** measurement-units. **Bảng:** wf_measurement_unit.

- **Chức năng:** 0016 – 0021 theo khuôn mục 2.6.

- **Sắp xếp:** Thứ tự hiển thị tăng dần (rỗng xếp cuối), rồi Mã tăng dần; ô chọn xếp như vậy.

##### Thành phần riêng

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Nhóm (hộp thoại, Chi tiết) | Dropdown một lựa chọn | Input | Rỗng | **Bắt buộc.** Số lượng, Đo lường, Thời gian. Mapping: wf_measurement_unit.unit_group (SO_LUONG, DO_LUONG, THOI_GIAN). |
| 2 | Thứ tự hiển thị (hộp thoại, Chi tiết) | Number | Input | Rỗng | Số nguyên 1 – 9999, không bắt buộc. Placeholder "Nhập số thứ tự". Sai: "Thứ tự hiển thị phải là số nguyên từ 1 đến 9999". Mapping: wf_measurement_unit.display_order. |
| 3 | Cột lưới | Text, Number | Output | – | Nhóm, Thứ tự hiển thị (giữa Tên và Ngày cập nhật). |
| 4 | Ô lọc nâng cao | Dropdown một lựa chọn | Input | Tất cả | Nhóm. **Bằng**. |

##### Nơi dùng, dữ liệu khởi tạo

| Nơi dùng                            | Trường                            |
|-------------------------------------|-----------------------------------|
| Hạng mục ĐXMS, KĐT; yêu cầu báo giá | Đơn vị tính của hạng mục          |
| Gói thầu, hợp đồng                  | Đơn vị tính của hàng hoá, dịch vụ |

Dữ liệu khởi tạo (Tên — Nhóm): Bộ, Cái, Chiếc, Hệ thống, Gói, Bản quyền — Số lượng; Mét, Kilôgam — Đo lường; Tháng — Thời gian; Người-tháng — Thời gian (Dừng hoạt động).

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0016-01 | "Cái" Thứ tự 1, "Bộ" Thứ tự 2, "Mét" chưa có Thứ tự | Mở danh sách | Thứ tự dòng: Cái, Bộ, …, Mét ở sau các dòng có Thứ tự |
| AC-0016-02 | Hộp thoại | Thứ tự hiển thị 0, \[Lưu\] | Inline "Thứ tự hiển thị phải là số nguyên từ 1 đến 9999" |
| AC-0016-03 | Hộp thoại | Bỏ trống Nhóm, \[Lưu\] | Inline "Vui lòng chọn Nhóm" |

### Tiền tệ

#### DTMS_CN_0022 Danh mục Tiền tệ

##### Thông tin chung chức năng

- **Mục đích:** Loại tiền của báo giá, giá gói thầu, giá hợp đồng; dùng chung toàn VHT.

- **Người dùng mục tiêu:** QTHT, TTMS.

- **Đường dẫn truy cập:** Danh mục dùng chung \> Tiền tệ.

- **Tài nguyên API:** currencies. **Bảng:** wf_currency.

- **Chức năng:** 0022 – 0027 theo khuôn mục 2.6.

##### Thành phần riêng

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Mã tiền tệ (hộp thoại) | Textbox \[3\] | Input | Rỗng | **Bắt buộc.** Thay ô Mã của khuôn: đúng 3 chữ cái theo ISO 4217, ví dụ USD. Placeholder "Mã ISO 4217, vd USD". Sai: "Mã tiền tệ gồm đúng 3 chữ cái." Mapping: wf_currency.code. |
| 2 | Ký hiệu (hộp thoại, Chi tiết) | Textbox \[10\] | Input | Rỗng | **Bắt buộc.** Ký hiệu hiện cạnh số tiền, ví dụ ₫. Không yêu cầu duy nhất. Mapping: wf_currency.symbol. |
| 3 | Số chữ số thập phân (hộp thoại, Chi tiết) | Dropdown một lựa chọn | Input | 0 | **Bắt buộc.** 0, 2. Số chữ số thập phân khi nhập và hiện số tiền theo loại tiền này. Mapping: wf_currency.decimal_places. |
| 4 | Cột lưới | Text, Number | Output | – | Ký hiệu, Số chữ số thập phân. |
| 5 | Ô lọc nâng cao | Textbox \[10\] | Input | Rỗng | Ký hiệu. **Chứa**. |

##### Nơi dùng, dữ liệu khởi tạo

| Nơi dùng                 | Trường                                   |
|--------------------------|------------------------------------------|
| Nhà cung cấp / Nhà thầu  | Loại tiền báo giá thường dùng            |
| Yêu cầu báo giá, báo giá | Loại tiền của báo giá                    |
| Gói thầu, hợp đồng       | Loại tiền của giá gói thầu, giá hợp đồng |

Dữ liệu khởi tạo (Mã — Tên — Ký hiệu — Số chữ số thập phân): VND Việt Nam đồng ₫ 0; USD Đô la Mỹ \$ 2; EUR Euro € 2; JPY Yên Nhật ¥ 0; KRW Won Hàn Quốc ₩ 0; CNY Nhân dân tệ CN¥ 2 (Dừng hoạt động).

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0022-01 | Hộp thoại | Mã "US", \[Lưu\] | Inline "Mã tiền tệ gồm đúng 3 chữ cái." |
| AC-0022-02 | Hộp thoại | Bỏ trống Ký hiệu, \[Lưu\] | Inline "Vui lòng nhập Ký hiệu" |
| AC-0022-03 | JPY có Số chữ số thập phân 0 | Nhập giá hợp đồng loại tiền JPY | Ô số tiền không nhận phần thập phân |
| AC-0022-04 | VND đang là Loại tiền báo giá thường dùng của một nhà cung cấp | \[Xóa\] VND | Toast chặn xóa của khuôn |

### Lĩnh vực đầu tư

#### DTMS_CN_0076 Danh mục Lĩnh vực đầu tư

##### Thông tin chung chức năng

- **Mục đích:** Lĩnh vực của khoản đầu tư; điều kiện của Ngưỡng phân luồng và Phân cấp thẩm quyền khoản đầu tư.

- **Người dùng mục tiêu:** QTHT.

- **Đường dẫn truy cập:** Danh mục dùng chung \> Lĩnh vực đầu tư.

- **Tài nguyên API:** investment-fields. **Bảng:** investment_field.

- **Chức năng:** 0076 – 0081 theo khuôn mục 2.6, không có trường riêng.

##### Nơi dùng, dữ liệu khởi tạo

| Nơi dùng | Trường |
|----|----|
| Khoản đầu tư | Lĩnh vực |
| Ngưỡng phân luồng, Phân cấp thẩm quyền khoản đầu tư | Điều kiện Lĩnh vực (mục 3.4) |
| Đề tài / dự án | Lĩnh vực đầu tư (nếu có) |

Dữ liệu khởi tạo (Tên): Viễn thông - CNTT; Quốc phòng; Bất động sản; Lĩnh vực khác.

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0076-01 | "Lĩnh vực khác" đang là điều kiện của một quy tắc Ngưỡng phân luồng | \[Xóa\] | Toast chặn xóa của khuôn |
| AC-0076-02 | "Quốc phòng" Dừng hoạt động | Mở hộp thoại Thêm mới Ngưỡng phân luồng | Ô Lĩnh vực không có Quốc phòng |

## DANH MỤC ĐẦU TƯ MUA SẮM

Các danh mục ở mục này nằm trong nhóm Đầu tư mua sắm của menu. Người dùng mục tiêu là QTHT; riêng Loại hàng hoá / dịch vụ có cả TTMS (mục 2.3). Đường dẫn: Danh mục dùng chung \> Đầu tư mua sắm \> {Tên menu}. Danh mục nào không ghi trường riêng thì đúng khuôn mục 2.6.

### Loại hàng hoá / dịch vụ

#### DTMS_CN_0010 Danh mục Loại hàng hoá / dịch vụ

##### Thông tin chung chức năng

- **Mục đích:** Ngành hàng của hạng mục mua sắm và của nhà cung cấp; lọc nhà cung cấp nhận yêu cầu báo giá. Dùng chung toàn VHT.

- **Người dùng mục tiêu:** QTHT, TTMS.

- **Tài nguyên API:** goods-service-types. **Bảng:** goods_service_type.

- **Chức năng:** 0010 – 0015 theo khuôn mục 2.6. Nhãn: "Mã loại hàng hoá, dịch vụ", "Tên loại hàng hoá, dịch vụ".

##### Thành phần riêng

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Nhóm (hộp thoại, Chi tiết, cột lưới, ô lọc nâng cao) | Dropdown một lựa chọn | Input | Rỗng | **Bắt buộc.** Hàng hoá, Dịch vụ. Lọc **Bằng**. Mapping: goods_service_type.goods_group (HANG_HOA, DICH_VU). |

##### Nơi dùng, dữ liệu khởi tạo

| Nơi dùng                            | Trường                  |
|-------------------------------------|-------------------------|
| Nhà cung cấp / Nhà thầu             | Ngành hàng cung cấp     |
| Hạng mục ĐXMS, KĐT; yêu cầu báo giá | Ngành hàng của hạng mục |

Dữ liệu khởi tạo (Tên — Nhóm): Viễn thông - CNTT; Phương tiện vận tải - Thiết bị dụng cụ quản lý; Nghiên cứu sản xuất; Hàng hoá kinh doanh — Hàng hoá. Dịch vụ tư vấn; Dịch vụ phi tư vấn — Dịch vụ.

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0010-01 | Ngành hàng "Nghiên cứu sản xuất" đang là ngành hàng của 5 nhà cung cấp | \[Xóa\] | Toast chặn xóa của khuôn |
| AC-0010-02 | Khối nâng cao | Nhóm = Dịch vụ, \[Tìm kiếm\] | Chỉ hai dòng Dịch vụ tư vấn, Dịch vụ phi tư vấn |

### Loại khoản đầu tư

Quy tắc của nghiệp vụ 3.3.2:

| Mã | Quy tắc |
|----|----|
| BR-DMC-08-01 | **Cấp xử lý.** Loại có Cấp xử lý "Luôn cấp Tập đoàn" thì cấp phê duyệt chủ trương và cấp phê duyệt khoản đầu tư của khoản đầu tư loại đó luôn là Tập đoàn, không tra bảng Phân cấp thẩm quyền (mục 3.4.2). Loại "Theo ngưỡng" thì cấp phê duyệt tra theo bảng đó. Nhóm (MS13, MS14, MS15) của mọi loại vẫn tính theo Ngưỡng phân luồng (mục 3.4.1) |

#### DTMS_CN_0028 Danh mục Loại khoản đầu tư

##### Thông tin chung chức năng

- **Mục đích:** Phân loại khoản đầu tư để phân luồng, xác định thẩm quyền và báo cáo.

- **Tài nguyên API:** investment-types. **Bảng:** wf_investment_type.

- **Chức năng:** 0028 – 0033 theo khuôn mục 2.6.

##### Thành phần riêng

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Cấp xử lý (hộp thoại, Chi tiết, cột lưới, ô lọc nâng cao) | Dropdown một lựa chọn | Input | Theo ngưỡng | **Bắt buộc.** Theo ngưỡng, Luôn cấp Tập đoàn. Theo BR-DMC-08-01. Mapping: wf_investment_type.processing_level (THEO_NGUONG, TAP_DOAN). |

##### Nơi dùng, dữ liệu khởi tạo

| Nơi dùng                         | Trường                                  |
|----------------------------------|-----------------------------------------|
| Khoản đầu tư                     | Loại khoản đầu tư                       |
| Phân cấp thẩm quyền khoản đầu tư | Điều kiện Loại khoản đầu tư (mục 3.4.2) |

Dữ liệu khởi tạo (Tên — Cấp xử lý): Khoa học công nghệ; Trang bị nội bộ; Phương tiện vận tải; Khác — Theo ngưỡng. Kinh doanh; Bất động sản — Luôn cấp Tập đoàn.

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0028-01 | Loại "Kinh doanh" Luôn cấp Tập đoàn; khoản đầu tư Kinh doanh, Viễn thông - CNTT, 20 tỷ đồng | Quy trình xác định nhóm và cấp phê duyệt | Nhóm MS13 theo Ngưỡng phân luồng; cấp phê duyệt chủ trương và khoản đầu tư là Tập đoàn |
| AC-0028-02 | Hộp thoại Thêm mới | Xem Cấp xử lý | Mặc định "Theo ngưỡng" |

### Cấp phê duyệt đề tài / dự án

#### DTMS_CN_0325 Danh mục Cấp phê duyệt đề tài / dự án

##### Thông tin chung chức năng

- **Mục đích:** Cấp phê duyệt của đề tài / dự án; ô lọc của Danh sách đề tài / dự án.

- **Tài nguyên API:** project-approval-levels. **Bảng:** project_approval_level.

- **Chức năng:** 0325 xem danh sách và tìm kiếm, 0326 thêm mới, 0327 xem chi tiết, 0328 chỉnh sửa, 0329 đổi trạng thái, 0330 xóa — đúng khuôn mục 2.6, không có trường riêng. Nhãn: "Mã cấp phê duyệt", "Tên cấp phê duyệt".

##### Nơi dùng, dữ liệu khởi tạo

Nơi dùng: Đề tài / dự án — Cấp phê duyệt (nhập liệu, đồng bộ, ô lọc). Dữ liệu khởi tạo (Tên): Tổng Công ty; Tập đoàn.

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0325-01 | Cấp "Tập đoàn" Dừng hoạt động; có đề tài cấp Tập đoàn | Mở ô lọc Cấp phê duyệt ở Danh sách đề tài / dự án | Ô lọc vẫn có "Tập đoàn" |

### Loại dự án / đề tài

#### DTMS_CN_0331 Danh mục Loại dự án / đề tài

##### Thông tin chung chức năng

- **Mục đích:** Phân loại cấp một của đề tài / dự án; Loại cha của Loại dự án (chi tiết).

- **Tài nguyên API:** project-types. **Bảng:** project_type.

- **Chức năng:** 0331 xem danh sách và tìm kiếm, 0332 thêm mới, 0333 xem chi tiết, 0334 chỉnh sửa, 0335 đổi trạng thái, 0336 xóa — đúng khuôn mục 2.6, không có trường riêng. Nhãn: "Mã loại", "Tên loại".

##### Nơi dùng, dữ liệu khởi tạo

| Nơi dùng              | Trường                           |
|-----------------------|----------------------------------|
| Đề tài / dự án        | Loại (nhập liệu, đồng bộ, ô lọc) |
| Loại dự án (chi tiết) | Loại dự án / đề tài (Loại cha)   |

Dữ liệu khởi tạo (Tên): Sản xuất kinh doanh; Dự án đầu tư; Khoa học công nghệ (đề tài / dự án đồng bộ từ phân hệ Quản lý khoa học công nghệ); Hoạt động thường xuyên; Dự án đầu tư khác; Dự án kinh doanh khác.

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0331-01 | Loại "Hoạt động thường xuyên" là Loại cha của một Loại dự án (chi tiết), chưa có đề tài nào | \[Xóa\] | Toast chặn xóa của khuôn |

### Loại dự án (chi tiết)

#### DTMS_CN_0337 Danh mục Loại dự án (chi tiết)

##### Thông tin chung chức năng

- **Mục đích:** Phân loại chi tiết của đề tài / dự án theo Loại cha; ô lọc Loại chi tiết chỉ hiện theo các Loại đã chọn.

- **Tài nguyên API:** project-type-details. **Bảng:** project_type_detail.

- **Chức năng:** 0337 xem danh sách và tìm kiếm, 0338 thêm mới, 0339 xem chi tiết, 0340 chỉnh sửa, 0341 đổi trạng thái, 0342 xóa. Nhãn: "Mã loại chi tiết", "Tên loại chi tiết".

##### Thành phần riêng

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Loại dự án / đề tài (hộp thoại, Chi tiết) | Dropdown một lựa chọn, có tìm kiếm | Input | Rỗng | Không bắt buộc. Nguồn: Loại dự án / đề tài Đang hoạt động, cộng giá trị đang giữ. Mapping: project_type_detail.project_type_id. |
| 2 | Cột lưới "Loại dự án / đề tài" | Text | Output | – | Tên Loại cha; rỗng hiện "-". |
| 3 | Ô lọc nâng cao | Dropdown nhiều lựa chọn | Input | Rỗng | Loại dự án / đề tài, gồm cả Loại Dừng hoạt động và lựa chọn "(Chưa xếp loại)". **Thuộc**. |
| 4 | API ô chọn | – | – | – | GET project-type-details/dropdown?projectTypeIds=…: chỉ trả loại chi tiết thuộc các Loại đã chọn; không truyền thì trả tất cả. |

##### Nơi dùng, dữ liệu khởi tạo

Nơi dùng: Đề tài / dự án — Loại dự án (chi tiết).

Dữ liệu khởi tạo (Tên — Loại cha):

- Khoa học công nghệ: Đề tài khoa học công nghệ; Nghiên cứu thăm dò; Dự án sản xuất thử nghiệm; Hình thức nghiên cứu khoa học công nghệ khác; Dự án khoa học công nghệ; Đề án khoa học; Chương trình khoa học công nghệ.

- Hoạt động thường xuyên: Thường xuyên.

- Sản xuất kinh doanh: Dự án kinh doanh; Dự án sản xuất; Chương trình nội bộ.

- Dự án đầu tư: Dự án đầu tư mua sắm tài sản; Dự án đầu tư xây dựng kinh doanh thử nghiệm.

- Chưa xếp loại: Hỗ trợ khoa học công nghệ.

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0337-01 | Danh sách đề tài / dự án, ô lọc Loại = Sản xuất kinh doanh | Mở ô lọc Loại chi tiết | Chỉ có ba loại chi tiết của Sản xuất kinh doanh |
| AC-0337-02 | Hộp thoại Thêm mới | Bỏ trống Loại dự án / đề tài, \[Lưu\] | Lưu được; cột Loại dự án / đề tài hiện "-" |
| AC-0337-03 | Loại "Dự án đầu tư" Dừng hoạt động | Mở hộp thoại Thêm mới | Ô Loại dự án / đề tài không có "Dự án đầu tư" |
| AC-0337-04 | Khối nâng cao | Chọn "(Chưa xếp loại)", \[Tìm kiếm\] | Chỉ "Hỗ trợ khoa học công nghệ" |

### Tính chất tài sản hình thành

#### DTMS_CN_0034 Danh mục Tính chất tài sản hình thành

##### Thông tin chung chức năng

- **Mục đích:** Tính chất của tài sản hình thành từ khoản đầu tư; chọn mẫu biểu và là điều kiện của Ngưỡng phân luồng.

- **Tài nguyên API:** investment-natures. **Bảng:** wf_investment_nature.

- **Chức năng:** 0034 – 0039 đúng khuôn mục 2.6, không có trường riêng. Nhãn: "Mã tính chất tài sản", "Tên tính chất tài sản".

##### Nơi dùng, dữ liệu khởi tạo

| Nơi dùng          | Trường                                  |
|-------------------|-----------------------------------------|
| Khoản đầu tư      | Tính chất tài sản hình thành            |
| Ngưỡng phân luồng | Điều kiện Tính chất tài sản (mục 3.4.1) |

Dữ liệu khởi tạo (Tên): Nguyên chiếc; Cần tích hợp hệ thống trước khi sử dụng.

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0034-01 | Mở menu | Xem tiêu đề | Menu "Tính chất tài sản hình thành", tiêu đề "Danh sách tính chất tài sản hình thành" |

### Loại gói thầu

#### DTMS_CN_0040 Danh mục Loại gói thầu

##### Thông tin chung chức năng

- **Mục đích:** Phân loại gói thầu trong kế hoạch lựa chọn nhà thầu và tổ chức lựa chọn nhà thầu.

- **Tài nguyên API:** bid-package-types. **Bảng:** wf_bid_package_type.

- **Chức năng:** 0040 – 0045 theo khuôn mục 2.6.

- **Sắp xếp:** Thứ tự hiển thị tăng dần (rỗng xếp cuối), rồi Mã tăng dần.

##### Thành phần riêng

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Lĩnh vực đấu thầu (hộp thoại, Chi tiết, cột lưới, ô lọc nâng cao) | Dropdown một lựa chọn | Input | Rỗng | **Bắt buộc.** Hàng hoá, Xây lắp, Tư vấn, Phi tư vấn, Hỗn hợp. Lọc **Bằng**. Mapping: wf_bid_package_type.bidding_field (HANG_HOA, XAY_LAP, TU_VAN, PHI_TU_VAN, HON_HOP). |
| 2 | Thứ tự hiển thị (hộp thoại, Chi tiết, cột lưới) | Number | Input | Rỗng | Như Thứ tự hiển thị của Đơn vị tính (mục 3.2.3). Mapping: wf_bid_package_type.display_order. |

##### Nơi dùng, dữ liệu khởi tạo

Nơi dùng: Kế hoạch lựa chọn nhà thầu, gói thầu — Loại gói thầu; Đề tài / dự án — gói thầu liên quan.

Dữ liệu khởi tạo (Tên — Lĩnh vực đấu thầu): Mua sắm hàng hoá; Mua sắm phần mềm, bản quyền — Hàng hoá. Xây lắp — Xây lắp. Dịch vụ tư vấn — Tư vấn. Dịch vụ phi tư vấn — Phi tư vấn. Cung cấp và lắp đặt thiết bị — Hỗn hợp.

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0040-01 | Hộp thoại | Bỏ trống Lĩnh vực đấu thầu, \[Lưu\] | Inline "Vui lòng chọn Lĩnh vực đấu thầu" |
| AC-0040-02 | Loại gói thầu "Xây lắp" Dừng hoạt động | Mở ô Loại gói thầu khi lập gói thầu | Không có "Xây lắp" |

### Hình thức lựa chọn nhà thầu

#### DTMS_CN_0046 Danh mục Hình thức lựa chọn nhà thầu

##### Thông tin chung chức năng

- **Mục đích:** Hình thức lựa chọn nhà thầu của gói thầu trong kế hoạch lựa chọn nhà thầu.

- **Tài nguyên API:** contractor-selection-methods. **Bảng:** wf_contractor_selection_method.

- **Chức năng:** 0046 – 0051 theo khuôn mục 2.6. Nhãn: "Mã hình thức", "Tên hình thức".

##### Thành phần riêng

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Tên viết tắt (hộp thoại, Chi tiết, cột lưới) | Textbox \[100\] | Input | Rỗng | **Bắt buộc.** Chữ (có dấu), số, khoảng trắng và . \_ -. Sai: "Tên viết tắt không đúng định dạng." Hiện trong ô chọn và văn bản thay tên đầy đủ khi cần ngắn. Mapping: wf_contractor_selection_method.abbreviation. |

##### Nơi dùng, dữ liệu khởi tạo

Nơi dùng: Kế hoạch lựa chọn nhà thầu, gói thầu — Hình thức lựa chọn nhà thầu.

Dữ liệu khởi tạo (Tên — Tên viết tắt): Đấu thầu rộng rãi — ĐTRR; Đấu thầu hạn chế — ĐTHC; Chào giá trực tuyến — CGTT; Mua sắm trực tiếp — MSTT; Chỉ định thầu rút gọn — CĐT RG; Chỉ định thầu thông thường — CĐT TT; Đàm phán trực tiếp — ĐPTT; Đặt hàng — ĐH; Giao nhiệm vụ — GNV; Tự thực hiện — TTH; Trường hợp đặc biệt — THĐB.

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0046-01 | Hộp thoại | Tên viết tắt "CĐT.RG", \[Lưu\] | Lưu được |
| AC-0046-02 | Hộp thoại | Tên viết tắt "CĐT/RG", \[Lưu\] | Inline "Tên viết tắt không đúng định dạng." |

### Phương thức lựa chọn nhà thầu

#### DTMS_CN_0052 Danh mục Phương thức lựa chọn nhà thầu

##### Thông tin chung chức năng

- **Mục đích:** Phương thức lựa chọn nhà thầu của gói thầu (một giai đoạn một túi, hai túi hồ sơ).

- **Tài nguyên API:** contractor-selection-procedures. **Bảng:** wf_contractor_selection_procedure.

- **Chức năng:** 0052 – 0057 đúng khuôn mục 2.6, không có trường riêng. Nhãn: "Mã phương thức", "Tên phương thức".

##### Nơi dùng, dữ liệu khởi tạo

Nơi dùng: Kế hoạch lựa chọn nhà thầu, gói thầu — Phương thức. Phương thức một giai đoạn hai túi hồ sơ thì đánh giá kỹ thuật bằng chấm điểm (nghiệp vụ lựa chọn nhà thầu).

Dữ liệu khởi tạo (Tên): Một giai đoạn một túi hồ sơ; Một giai đoạn hai túi hồ sơ (hồ sơ đề xuất kỹ thuật và tài chính nộp riêng).

##### Tiêu chí chấp nhận

| Mã         | Cho trước              | Khi          | Thì             |
|------------|------------------------|--------------|-----------------|
| AC-0052-01 | QTHT có quyền PTLCNT03 | Mở danh sách | Có \[Thêm mới\] |

### Phương pháp đánh giá

#### DTMS_CN_0058 Danh mục Phương pháp đánh giá

##### Thông tin chung chức năng

- **Mục đích:** Phương pháp đánh giá hồ sơ dự thầu trong hồ sơ mời thầu và khi đánh giá, xếp hạng nhà thầu.

- **Tài nguyên API:** bid-evaluation-methods. **Bảng:** wf_bid_evaluation_method.

- **Chức năng:** 0058 – 0063 theo khuôn mục 2.6. Nhãn: "Mã phương pháp", "Tên phương pháp".

##### Thành phần riêng

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Bước đánh giá (hộp thoại, Chi tiết, cột lưới, ô lọc nâng cao) | Dropdown một lựa chọn | Input | Rỗng | **Bắt buộc.** Đánh giá kỹ thuật, Đánh giá tài chính, Xếp hạng tổng hợp. Ô chọn ở hồ sơ mời thầu lọc theo bước. Mapping: wf_bid_evaluation_method.evaluation_step (KY_THUAT, TAI_CHINH, XEP_HANG). |

##### Nơi dùng, dữ liệu khởi tạo

Nơi dùng: Hồ sơ mời thầu — phương pháp đánh giá từng bước.

Dữ liệu khởi tạo (Tên — Bước đánh giá): Đạt / Không đạt; Chấm điểm — Đánh giá kỹ thuật. So sánh giá chào — Đánh giá tài chính. Giá thấp nhất; Giá đánh giá; Kết hợp giữa kỹ thuật và giá; Dựa trên kỹ thuật — Xếp hạng tổng hợp.

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0058-01 | Hồ sơ mời thầu, ô phương pháp đánh giá kỹ thuật | Mở ô | Chỉ "Đạt / Không đạt", "Chấm điểm" |

### Loại hợp đồng

#### DTMS_CN_0064 Danh mục Loại hợp đồng

##### Thông tin chung chức năng

- **Mục đích:** Loại hợp đồng dự kiến của gói thầu và loại của hợp đồng.

- **Tài nguyên API:** contract-types. **Bảng:** wf_contract_type.

- **Chức năng:** 0064 – 0069 đúng khuôn mục 2.6, không có trường riêng.

##### Nơi dùng, dữ liệu khởi tạo

Nơi dùng: Gói thầu — Loại hợp đồng dự kiến; Hợp đồng — Loại hợp đồng; Đề tài / dự án — hợp đồng liên quan.

Dữ liệu khởi tạo (Tên): Trọn gói; Theo đơn giá cố định; Theo đơn giá điều chỉnh; Theo thời gian; Theo chi phí cộng phí; Theo kết quả đầu ra; Theo tỷ lệ phần trăm; Hỗn hợp.

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0064-01 | "Trọn gói" là Loại hợp đồng dự kiến của một gói thầu | \[Xóa\] | Toast chặn xóa của khuôn |

### Hình thức bảo đảm

#### DTMS_CN_0070 Danh mục Hình thức bảo đảm

##### Thông tin chung chức năng

- **Mục đích:** Hình thức bảo đảm dự thầu, bảo đảm thực hiện hợp đồng, bảo lãnh tạm ứng, bảo đảm bảo hành.

- **Tài nguyên API:** guarantee-forms. **Bảng:** wf_guarantee_form.

- **Chức năng:** 0070 – 0075 theo khuôn mục 2.6; hộp thoại cỡ lớn.

##### Thành phần riêng

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Phạm vi áp dụng (hộp thoại, Chi tiết) | Dropdown nhiều lựa chọn | Input | Rỗng | **Bắt buộc**, ít nhất một: Bảo đảm dự thầu, Bảo đảm thực hiện hợp đồng, Bảo lãnh tạm ứng, Bảo đảm bảo hành. Mapping: wf_guarantee_form.apply_bid_security, .apply_contract_performance_security, .apply_advance_payment, .apply_warranty. |
| 2 | Cột lưới "Phạm vi áp dụng" | Text | Output | – | Các phạm vi đã chọn, nối bằng dấu phẩy. |
| 3 | Ô lọc nâng cao | Dropdown một lựa chọn | Input | Rỗng | Phạm vi áp dụng. Bản ghi có phạm vi đã chọn. |
| 4 | API ô chọn | – | – | – | GET guarantee-forms/dropdown?applicableScope=…: chỉ trả hình thức có phạm vi tương ứng. |

##### Nơi dùng, dữ liệu khởi tạo

| Nơi dùng | Trường | Phạm vi lọc |
|----|----|----|
| Hồ sơ mời thầu | Hình thức bảo đảm dự thầu | Bảo đảm dự thầu |
| Hợp đồng | Bảo đảm thực hiện hợp đồng, bảo lãnh tạm ứng, bảo đảm bảo hành | Theo từng ô |

Dữ liệu khởi tạo (Tên — Phạm vi áp dụng): Thư bảo lãnh của ngân hàng — cả bốn; Chứng thư bảo hiểm bảo lãnh — dự thầu, thực hiện hợp đồng; Đặt cọc — dự thầu; Ký quỹ — dự thầu, thực hiện hợp đồng; Giữ lại một phần giá trị thanh toán — bảo đảm bảo hành (Dừng hoạt động).

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0070-01 | Hộp thoại | Bỏ trống Phạm vi áp dụng, \[Lưu\] | Inline "Vui lòng chọn Phạm vi áp dụng" |
| AC-0070-02 | Hồ sơ mời thầu | Mở ô Hình thức bảo đảm dự thầu | Chỉ hình thức có Bảo đảm dự thầu: Thư bảo lãnh của ngân hàng, Chứng thư bảo hiểm bảo lãnh, Đặt cọc, Ký quỹ |
| AC-0070-03 | Khối nâng cao | Phạm vi = Bảo lãnh tạm ứng, \[Tìm kiếm\] | Chỉ "Thư bảo lãnh của ngân hàng" |

### Loại tài liệu căn cứ

Quy tắc của nghiệp vụ 3.3.13:

| Mã | Quy tắc |
|----|----|
| BR-DMC-19-01 | **Tài liệu căn cứ bắt buộc.** Khi tạo luồng phê duyệt ĐXMS (hoặc gửi hồ sơ tương ứng), mỗi loại Đang hoạt động, Bắt buộc, có phạm vi khớp với đối tượng phải có ít nhất một tệp đính kèm; thiếu thì không tạo luồng và báo tên loại còn thiếu. Loại Dừng hoạt động không bắt buộc nữa |

#### DTMS_CN_0319 Danh mục Loại tài liệu căn cứ

##### Thông tin chung chức năng

- **Mục đích:** Loại tài liệu căn cứ đầu vào của luồng mua sắm. Mỗi tệp đính kèm vào ĐXMS hoặc hồ sơ chọn một loại; loại Bắt buộc phải có khi tạo luồng.

- **Tài nguyên API:** basis-document-types. **Bảng:** basis_document_type.

- **Chức năng:** 0319 xem danh sách và tìm kiếm, 0320 thêm mới, 0321 xem chi tiết, 0322 chỉnh sửa, 0323 đổi trạng thái, 0324 xóa. Nhãn: "Mã loại tài liệu", "Tên loại tài liệu căn cứ".

##### Thành phần riêng

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Áp dụng cho (hộp thoại, Chi tiết, cột lưới, ô lọc nâng cao) | Dropdown nhiều lựa chọn | Input | Rỗng | **Bắt buộc**, ít nhất một: ĐXMS, Hồ sơ Phê duyệt, Hồ sơ Điều chỉnh. Mapping: basis_document_type.apply_proposal, .apply_approval, .apply_adjustment. |
| 2 | Bắt buộc (hộp thoại, Chi tiết, cột lưới, ô lọc nâng cao) | Dropdown một lựa chọn | Input | Không bắt buộc | **Bắt buộc chọn.** Bắt buộc, Không bắt buộc. Theo BR-DMC-19-01. Mapping: basis_document_type.is_mandatory. |
| 3 | API ô chọn | – | – | – | GET basis-document-types/dropdown?applyTo=…: loại Đang hoạt động có phạm vi tương ứng; ô chọn loại tệp ở màn nghiệp vụ hiện "{Tên} (bắt buộc)" với loại Bắt buộc. |

##### Nơi dùng, dữ liệu khởi tạo

Nơi dùng: Lập ĐXMS và hồ sơ của luồng mua sắm — loại của tệp tài liệu căn cứ; kiểm tra khi tạo luồng (BR-DMC-19-01).

Dữ liệu khởi tạo (Tên — Áp dụng cho — Bắt buộc): QĐ giao nhiệm vụ / phê duyệt đề tài, dự án — ĐXMS — Bắt buộc; Kế hoạch mua sắm năm được duyệt — ĐXMS — Bắt buộc; Chủ trương đầu tư — ĐXMS, Hồ sơ Phê duyệt — Không; Văn bản chỉ đạo — cả ba — Không; Biên bản làm việc — cả ba — Không; Báo giá / khảo sát giá — Hồ sơ Phê duyệt, Hồ sơ Điều chỉnh — Không; Văn bản đề nghị điều chỉnh — Hồ sơ Điều chỉnh — Bắt buộc; Khác — cả ba — Không.

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0319-01 | ĐXMS chưa đính kèm tệp loại "Kế hoạch mua sắm năm được duyệt" (Bắt buộc, ĐXMS) | Tạo luồng | Không tạo; báo thiếu "Kế hoạch mua sắm năm được duyệt" |
| AC-0319-02 | Loại trên đã Dừng hoạt động | Tạo luồng khi thiếu tệp loại đó | Không báo thiếu loại đó |
| AC-0319-03 | Hộp thoại | Bỏ trống Áp dụng cho, \[Lưu\] | Inline "Vui lòng chọn Áp dụng cho" |
| AC-0319-04 | Màn đính kèm tài liệu căn cứ của ĐXMS | Mở ô loại tệp | Có các loại phạm vi ĐXMS; loại Bắt buộc có hậu tố "(bắt buộc)" |

## BẢNG LUẬT

Hai danh mục ở mục này là bảng quy tắc mà quy trình đọc để chọn luồng và cấp duyệt. Chúng theo khuôn mục 2.6 với các khác biệt sau:

- Không có Mã và Tên, nên BR-DMC-C-01 không áp. Cột đầu của lưới là link mở Chi tiết.

- Câu xác nhận và thông báo dùng **chuỗi mô tả quy tắc** thay "{Tên} - {Mã}". Ví dụ: "Khoản đầu tư · Viễn thông - CNTT · Tất cả · 0 – dưới 160".

- Hộp thoại cỡ vừa, lưới hai cột.

- Ô "Tất cả" của điều kiện lưu là rỗng (NULL) và khớp mọi giá trị.

- Khoảng giá trị tính cả **Từ**, không tính **Đến dưới**. Đến dưới rỗng nghĩa là không giới hạn trên.

- Quy trình không đọc bảng ở trình duyệt. Dịch vụ danh mục có API tra cứu (resolve) để bộ xử lý của quy trình gọi.

### Ngưỡng phân luồng

Quy tắc của nghiệp vụ 3.4.1:

| Mã | Quy tắc |
|----|----|
| BR-DMC-20-01 | **Không chồng khoảng.** Hai quy tắc Đang hoạt động cùng Nhóm quy trình mà Lĩnh vực giao nhau và Tính chất tài sản giao nhau (giống nhau, hoặc một bên là Tất cả) thì khoảng giá trị không được giao nhau. Kiểm tra khi Lưu và khi Kích hoạt. Nhóm Khoản đầu tư tính MS13, MS14, MS15 là một nhóm |
| BR-DMC-20-02 | **Hiệu lực.** Mỗi quy tắc có Hiệu lực từ ngày. Khi thêm mới, hoặc khi sửa điều kiện, khoảng giá trị hay quy trình, Hiệu lực từ ngày không được trước ngày hiện tại. Quy tắc có Hiệu lực từ ngày sau hôm nay hiện tag "Chưa hiệu lực" và chưa được tra cứu |
| BR-DMC-20-03 | **Tra cứu.** GET flow-thresholds/resolve?group={DXMS\|KDT}&fieldId&natureId&value&date trả các quy trình và chuỗi mô tả của quy tắc Đang hoạt động, đã hiệu lực tại date, khớp Lĩnh vực, Tính chất tài sản, và có value trong khoảng. value tính theo **đồng**; dịch vụ quy đổi khoảng tỷ đồng × 1.000.000.000 rồi so sánh. Không có quy tắc khớp thì trả rỗng: với khoản đầu tư từ 15.000 tỷ đồng trở lên thì phân hệ khoản đầu tư coi là Ngoài phạm vi; trường hợp khác thì báo "Chưa cấu hình ngưỡng phân luồng" |
| BR-DMC-20-04 | **Hồ sơ giữ ngưỡng lúc tạo.** Khi tạo hồ sơ, bộ xử lý ghi kết quả tra cứu và phiên bản của quy tắc vào hồ sơ. Đổi bảng sau đó không làm đổi luồng của hồ sơ đang chạy |
| BR-DMC-20-05 | **Loại Bất động sản.** Khoản đầu tư loại Bất động sản thuộc MS15, không tra bảng này, theo tài liệu Lập khoản đầu tư |
| BR-DMC-20-06 | **Ngưỡng của ĐXMS.** Ngưỡng ghi vào hồ sơ ĐXMS (biến nguong, đồng) là Đến dưới của quy tắc nhóm Đề xuất mua sắm có Giá trị từ bằng 0, Đang hoạt động, đã hiệu lực lúc tạo hồ sơ, quy đổi ra đồng. Với dữ liệu khởi tạo là 160.000.000.000 đồng |

#### DTMS_CN_0082 Danh mục Ngưỡng phân luồng

##### Thông tin chung chức năng

- **Mục đích:** Tham số hóa ngưỡng giá trị chọn luồng con của MS01 (đề xuất mua sắm) và chọn MS13 / MS14 / MS15 (khoản đầu tư), thay ngưỡng viết cứng.

- **Người dùng mục tiêu:** QTHT.

- **Tài nguyên API:** flow-thresholds. **Bảng:** flow_threshold, flow_threshold_process.

- **Chức năng:** 0082 xem danh sách và tìm kiếm, 0083 thêm mới, 0084 xem chi tiết, 0085 chỉnh sửa, 0086 đổi trạng thái, 0087 xóa.

- **Sắp xếp:** Nhóm quy trình, rồi Lĩnh vực, rồi Giá trị từ, rồi Tính chất tài sản.

##### Danh sách và tìm kiếm

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Tiêu đề màn | Text | Output | – | "Danh sách ngưỡng phân luồng". |
| 2 | Từ khóa | Search box \[255\] | Input | Rỗng | Placeholder "Tìm kiếm theo lĩnh vực, tính chất tài sản, quy trình". **Chứa** trên tên Lĩnh vực, tên Tính chất tài sản, mã quy trình. |
| 3 | Ô lọc nâng cao | Dropdown | Input | Tất cả | Nhóm quy trình, Lĩnh vực, Tính chất tài sản, Trạng thái, Ngày cập nhật. |
| 4 | Lưới | Table | Output | – | STT · Thao tác · Trạng thái · **Nhóm quy trình** (link Chi tiết; "Đề xuất mua sắm" hoặc "Khoản đầu tư") · Lĩnh vực ("Tất cả" khi rỗng) · Tính chất tài sản · **Khoảng giá trị (tỷ đồng)** ("{Từ} – dưới {Đến dưới}" hoặc "Từ {Từ} trở lên") · Quy trình áp dụng (mã, nối dấu phẩy) · **Hiệu lực từ ngày** (DD/MM/YYYY, kèm tag "Chưa hiệu lực" theo BR-DMC-20-02) · Ngày cập nhật. |

##### Thêm mới, chỉnh sửa

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Nhóm quy trình (2 cột) | Dropdown một lựa chọn | Input | Rỗng | **Bắt buộc.** "Đề xuất mua sắm (MS01)", "Khoản đầu tư (MS13, MS14, MS15)". Đổi nhóm thì bỏ các quy trình không thuộc nhóm. Mapping: flow_threshold.process_group (DXMS, KDT). |
| 2 | Lĩnh vực | Dropdown một lựa chọn, có tìm kiếm | Input | Tất cả | **Bắt buộc.** "Tất cả" và Lĩnh vực đầu tư Đang hoạt động. Mapping: flow_threshold.investment_field_id. |
| 3 | Tính chất tài sản | Dropdown một lựa chọn | Input | Tất cả | **Bắt buộc.** "Tất cả" và Tính chất tài sản hình thành Đang hoạt động. Mapping: flow_threshold.investment_nature_id. |
| 4 | Giá trị từ (tỷ đồng) | Number \[13\] | Input | Rỗng | **Bắt buộc**, từ 0. Placeholder "Gồm giá trị này". Định dạng Việt Nam, tối đa 2 chữ số thập phân; ô chỉ nhận số, dấu chấm, dấu phẩy. Mapping: flow_threshold.value_from. |
| 5 | Đến dưới (tỷ đồng) | Number \[13\] | Input | Rỗng | Không bắt buộc. Placeholder "Để trống nếu không giới hạn". Có giá trị thì phải lớn hơn Giá trị từ. Mapping: flow_threshold.value_to. |
| 6 | Quy trình áp dụng (2 cột) | Dropdown nhiều lựa chọn | Input | Rỗng | **Bắt buộc**, ít nhất một, theo Nhóm. Đề xuất mua sắm: MS01.01, MS01.02, MS01.03 (luồng con của MS01). Khoản đầu tư: "MS13 — Phê duyệt khoản đầu tư đơn giản", "MS14 — Phê duyệt khoản đầu tư thông thường", "MS15 — Phê duyệt khoản đầu tư phức tạp". Mapping: flow_threshold_process.process_code. |
| 7 | Hiệu lực từ ngày (2 cột) | Date \[DD/MM/YYYY\] | Input | Ngày hiện tại | **Bắt buộc.** Theo BR-DMC-20-02. Gõ số thì tự chèn "/". Mapping: flow_threshold.effective_from. |
| 8 | Mô tả (2 cột) | Textarea \[500\] | Input | Rỗng | Căn cứ, ghi chú. Mapping: flow_threshold.description. |

##### Thông báo riêng

| Trường hợp | Xử lý, nội dung thông báo |
|----|----|
| Đến dưới không lớn hơn Giá trị từ | Inline dưới Đến dưới: "Đến dưới phải lớn hơn Giá trị từ." |
| Hiệu lực từ ngày trước hôm nay (BR-DMC-20-02) | Inline: "Hiệu lực từ ngày không được trước ngày hiện tại ({DD/MM/YYYY})." |
| Chồng khoảng khi Lưu (BR-DMC-20-01) | Inline dưới Giá trị từ: "Khoảng giá trị giao với ngưỡng đang hoạt động: {chuỗi mô tả quy tắc}." |
| Chồng khoảng khi Kích hoạt | Toast: "Không thể kích hoạt: khoảng giá trị giao với ngưỡng đang hoạt động {chuỗi mô tả quy tắc}." Công tắc trả về như cũ |
| Giá trị sai định dạng | Inline: "{Nhãn} không đúng định dạng." |

##### Nơi dùng, dữ liệu khởi tạo

| Nơi dùng | Cách dùng |
|----|----|
| Quy trình MS01, tạo hồ sơ ĐXMS và sau bước báo giá | Tra cứu nhóm Đề xuất mua sắm theo giá trị dự kiến, rồi theo giá trị báo giá, để chọn luồng con |
| Quy trình khoản đầu tư, tạo hồ sơ chủ trương và hồ sơ phê duyệt khoản đầu tư | Tra cứu nhóm Khoản đầu tư theo Lĩnh vực, Tính chất tài sản, Tổng mức vốn, để chọn MS13, MS14 hoặc MS15 |

Tham chiếu khi xóa: quy tắc đã được ghi vào ít nhất một hồ sơ (BR-DMC-20-04).

Dữ liệu khởi tạo (hiệu lực 01/07/2026):

| Nhóm | Lĩnh vực | Tính chất | Khoảng (tỷ đồng) | Quy trình |
|----|----|----|----|----|
| Đề xuất mua sắm | Tất cả | Tất cả | 0 – dưới 160 | MS01.03 |
| Đề xuất mua sắm | Tất cả | Tất cả | Từ 160 trở lên | MS01.01, MS01.02 |
| Khoản đầu tư | Viễn thông - CNTT | Tất cả | 0 – dưới 160 | MS13 |
| Khoản đầu tư | Viễn thông - CNTT | Tất cả | 160 – dưới 1.000 | MS14 |
| Khoản đầu tư | Viễn thông - CNTT | Tất cả | 1.000 – dưới 15.000 | MS15 |
| Khoản đầu tư | Lĩnh vực khác | Tất cả | 0 – dưới 90 | MS13 |
| Khoản đầu tư | Lĩnh vực khác | Tất cả | 90 – dưới 500 | MS14 |
| Khoản đầu tư | Lĩnh vực khác | Tất cả | 500 – dưới 15.000 | MS15 |

Với nhóm Đề xuất mua sắm từ 160 tỷ đồng, chọn MS01.01 hay MS01.02 theo căn cứ đã được phê duyệt ở bước của quy trình, không theo bảng này.

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0082-01 | Dữ liệu khởi tạo | Tra cứu Khoản đầu tư, Viễn thông - CNTT, 159,99 tỷ đồng | MS13 |
| AC-0082-02 | Dữ liệu khởi tạo | Tra cứu Khoản đầu tư, Viễn thông - CNTT, 160.000.000.000 đồng | MS14 |
| AC-0082-11 | Dữ liệu khởi tạo | Tra cứu Khoản đầu tư, Lĩnh vực khác, 15.000.000.000.000 đồng | Rỗng; phân hệ khoản đầu tư hiện Ngoài phạm vi |
| AC-0082-12 | Dữ liệu khởi tạo | Tạo hồ sơ ĐXMS | Hồ sơ ghi ngưỡng 160.000.000.000 đồng |
| AC-0082-03 | Dữ liệu khởi tạo | Thêm: Khoản đầu tư, Tất cả, Tất cả, 100 – dưới 200, MS14 | Inline chồng khoảng với "Khoản đầu tư · Viễn thông - CNTT · Tất cả · 0 – dưới 160" |
| AC-0082-04 | Quy tắc "Lĩnh vực khác, 0 – dưới 90" Dừng hoạt động; đã thêm "Lĩnh vực khác, 0 – dưới 100" | Kích hoạt lại quy tắc 0 – dưới 90 | Toast "Không thể kích hoạt: …"; quy tắc vẫn Dừng hoạt động |
| AC-0082-05 | Hôm nay 11/11/2026 | Thêm quy tắc, Hiệu lực từ ngày 10/11/2026 | Inline "Hiệu lực từ ngày không được trước ngày hiện tại (11/11/2026)." |
| AC-0082-06 | Thêm quy tắc Hiệu lực từ 01/01/2027 | Xem danh sách hôm nay | Tag "Chưa hiệu lực"; tra cứu hôm nay không dùng quy tắc này |
| AC-0082-07 | Hồ sơ KĐT tạo khi ngưỡng Viễn thông - CNTT là 160 | Đổi bảng thành 150, rồi hồ sơ đi tiếp | Hồ sơ giữ luồng đã chọn theo 160 |
| AC-0082-08 | Đề xuất mua sắm, Đến dưới 160, Giá trị từ 200 | \[Lưu\] | Inline "Đến dưới phải lớn hơn Giá trị từ." |
| AC-0082-09 | Hộp thoại, Nhóm Khoản đầu tư, đã chọn MS13 | Đổi Nhóm sang Đề xuất mua sắm | Quy trình áp dụng rỗng; chỉ chọn được MS01.01 – MS01.03 |
| AC-0082-10 | Quy tắc đã được ghi vào 8 hồ sơ | \[Xóa\] | Toast chặn xóa của khuôn |

### Phân cấp thẩm quyền khoản đầu tư

Quy tắc của nghiệp vụ 3.4.2:

| Mã | Quy tắc |
|----|----|
| BR-DMC-21-01 | **Không chồng khoảng.** Hai quy tắc Đang hoạt động cùng Loại khoản đầu tư mà Lĩnh vực giao nhau và Hệ thống CNTT phục vụ nội bộ giao nhau (Tất cả giao với Có và với Không) thì khoảng Tổng mức vốn không được giao nhau. Kiểm tra khi Lưu và khi Kích hoạt |
| BR-DMC-21-02 | **Tra cứu.** GET investment-authority-rules/resolve?typeId&fieldId&capital&internalIt (capital theo đồng; internalIt là true / false, không gửi coi như false) trả Cấp duyệt chủ trương, Cấp duyệt khoản đầu tư và Căn cứ của quy tắc Đang hoạt động khớp. Quy tắc có Hệ thống CNTT phục vụ nội bộ "Tất cả" khớp mọi giá trị internalIt; "Có" chỉ khớp true; "Không" chỉ khớp false. Loại có Cấp xử lý "Luôn cấp Tập đoàn" thì trả Tập đoàn / Tập đoàn (BR-DMC-08-01). Không có quy tắc khớp thì trả VHT / VHT, Căn cứ "Chưa cấu hình phân cấp thẩm quyền, áp dụng mặc định." kèm cờ không khớp. Người ký theo cấp do phân hệ khoản đầu tư xác định |
| BR-DMC-21-03 | **Hệ thống CNTT phục vụ nội bộ.** Khoản đầu tư trang bị nội bộ là hệ thống công nghệ thông tin phục vụ nhu cầu nội bộ không thuộc thẩm quyền của Tổng Giám đốc VHT, chuyển cấp Tập đoàn phê duyệt chủ trương và khoản đầu tư. Giá trị internalIt lấy từ câu trả lời "Hệ thống CNTT phục vụ nhu cầu nội bộ" ở bước xác nhận 04 yếu tố định danh của phân hệ khoản đầu tư |

#### DTMS_CN_0313 Danh mục Phân cấp thẩm quyền khoản đầu tư

##### Thông tin chung chức năng

- **Mục đích:** Bảng quy tắc mà bước "Xác định thẩm quyền phê duyệt" của MS13 đọc theo loại khoản đầu tư, lĩnh vực, hệ thống CNTT phục vụ nội bộ và tổng mức vốn, để ghi cấp duyệt chủ trương và cấp duyệt khoản đầu tư. Cổng cấp duyệt trước bước trình ký tính lại theo bảng.

- **Người dùng mục tiêu:** QTHT.

- **Tài nguyên API:** investment-authority-rules. **Bảng:** investment_authority_rule.

- **Chức năng:** 0313 xem danh sách và tìm kiếm, 0314 thêm mới, 0315 xem chi tiết, 0316 chỉnh sửa, 0317 đổi trạng thái, 0318 xóa. Tiêu đề "Danh sách quy tắc phân cấp thẩm quyền".

- **Sắp xếp:** Loại khoản đầu tư, rồi Lĩnh vực, rồi Hệ thống CNTT phục vụ nội bộ, rồi Tổng mức vốn từ.

##### Thành phần

| STT | Tên | Kiểu dữ liệu \[Độ dài\] | Input/Output | Giá trị khởi tạo | Mô tả |
|----|----|----|----|----|----|
| 1 | Từ khóa | Search box \[255\] | Input | Rỗng | Placeholder "Tìm kiếm theo loại khoản đầu tư, lĩnh vực, căn cứ". **Chứa**. |
| 2 | Lưới | Table | Output | – | STT · Thao tác · Trạng thái · **Loại khoản đầu tư** (link Chi tiết) · Lĩnh vực · Hệ thống CNTT nội bộ · Tổng mức vốn (tỷ đồng) · Cấp duyệt chủ trương · Cấp duyệt khoản đầu tư · Căn cứ · Ngày cập nhật. |
| 3 | Loại khoản đầu tư (hộp thoại) | Dropdown một lựa chọn | Input | Rỗng | **Bắt buộc.** Loại khoản đầu tư Đang hoạt động. Mapping: investment_authority_rule.investment_type_id. |
| 4 | Lĩnh vực (hộp thoại) | Dropdown một lựa chọn, có tìm kiếm | Input | Tất cả | **Bắt buộc.** "Tất cả" và Lĩnh vực đầu tư Đang hoạt động. Mapping: investment_authority_rule.investment_field_id. |
| 5 | Hệ thống CNTT phục vụ nội bộ (hộp thoại) | Dropdown một lựa chọn | Input | Tất cả | **Bắt buộc.** Tất cả, Có, Không (BR-DMC-21-02, 21-03). Mapping: investment_authority_rule.internal_it_system (rỗng là Tất cả, 1 Có, 0 Không). |
| 6 | Tổng mức vốn từ (tỷ đồng) | Number \[13\] | Input | Rỗng | **Bắt buộc**, từ 0. Placeholder "Gồm giá trị này". Mapping: investment_authority_rule.capital_from. |
| 7 | Đến dưới (tỷ đồng) | Number \[13\] | Input | Rỗng | Placeholder "Để trống nếu không giới hạn". Sai: "Đến dưới phải lớn hơn Tổng mức vốn từ." Mapping: investment_authority_rule.capital_to. |
| 8 | Cấp duyệt chủ trương | Dropdown một lựa chọn | Input | Rỗng | **Bắt buộc.** VHT, Tập đoàn. Mapping: investment_authority_rule.policy_approval_level (VHT, TAP_DOAN). |
| 9 | Cấp duyệt khoản đầu tư | Dropdown một lựa chọn | Input | Rỗng | **Bắt buộc.** VHT, Tập đoàn. Mapping: investment_authority_rule.investment_approval_level. |
| 10 | Căn cứ (2 cột) | Textbox \[255\] | Input | Rỗng | **Bắt buộc.** Placeholder "Văn bản phân cấp / ủy quyền áp dụng". Mapping: investment_authority_rule.legal_basis. |

Chồng khoảng khi Lưu: inline dưới Tổng mức vốn từ "Khoảng giá trị giao với quy tắc đang hoạt động: {chuỗi mô tả quy tắc}." Khi Kích hoạt: toast "Không thể kích hoạt: khoảng giá trị giao với quy tắc đang hoạt động {chuỗi mô tả quy tắc}."

##### Nơi dùng, dữ liệu khởi tạo

| Nơi dùng | Cách dùng |
|----|----|
| Quy trình MS13, bước Xác định thẩm quyền phê duyệt; cổng cấp duyệt trước trình ký | Tra cứu theo tổng mức vốn thực tế và câu trả lời Hệ thống CNTT phục vụ nhu cầu nội bộ của bước xác nhận 04 yếu tố định danh, ghi cấp duyệt vào hồ sơ |
| Lập khoản đầu tư | Gợi ý cấp duyệt khi nhập |

Tham chiếu khi xóa: quy tắc đã được ghi vào ít nhất một hồ sơ.

Dữ liệu khởi tạo:

| Loại khoản đầu tư | Lĩnh vực | Hệ thống CNTT nội bộ | Tổng mức vốn (tỷ đồng) | Chủ trương | Khoản đầu tư | Căn cứ |
|----|----|----|----|----|----|----|
| Khoa học công nghệ | Tất cả | Tất cả | 0 – dưới 45 | Tập đoàn | VHT | Văn bản ủy quyền §1.2.1 |
| Khoa học công nghệ | Tất cả | Tất cả | Từ 45 trở lên | VHT | VHT | Văn bản ủy quyền §1.2.2 |
| Trang bị nội bộ | Tất cả | Có | Từ 0 trở lên | Tập đoàn | Tập đoàn | Văn bản ủy quyền §1.2.2 (ngoại trừ hệ thống công nghệ thông tin phục vụ nhu cầu nội bộ) |
| Trang bị nội bộ | Tất cả | Không | Từ 0 trở lên | VHT | VHT | Văn bản ủy quyền §1.2.2 |
| Khác | Tất cả | Tất cả | Từ 0 trở lên | VHT | VHT | Văn bản ủy quyền §1.2 |
| Kinh doanh | Tất cả | Tất cả | Từ 0 trở lên | Tập đoàn | Tập đoàn | Văn bản ủy quyền §1.2.2 (ngoại trừ hình thành tài sản cố định phục vụ kinh doanh) |
| Bất động sản | Tất cả | Tất cả | Từ 0 trở lên | Tập đoàn | Tập đoàn | Văn bản ủy quyền §1.2 |
| Phương tiện vận tải | Tất cả | Tất cả | Từ 0 trở lên | Tập đoàn | Tập đoàn | Văn bản ủy quyền §1.2 |

##### Tiêu chí chấp nhận

| Mã | Cho trước | Khi | Thì |
|----|----|----|----|
| AC-0313-01 | Dữ liệu khởi tạo | Tra cứu Khoa học công nghệ, Viễn thông - CNTT, 30 tỷ đồng | Chủ trương Tập đoàn, khoản đầu tư VHT |
| AC-0313-02 | Dữ liệu khởi tạo | Tra cứu Khoa học công nghệ, 45 tỷ đồng | VHT / VHT |
| AC-0313-03 | Không có quy tắc cho loại "Hoạt động thường xuyên" | Tra cứu loại đó | VHT / VHT, Căn cứ "Chưa cấu hình phân cấp thẩm quyền, áp dụng mặc định.", cờ không khớp |
| AC-0313-06 | Loại "Kinh doanh" Luôn cấp Tập đoàn, không có quy tắc | Tra cứu loại đó | Tập đoàn / Tập đoàn |
| AC-0313-04 | Dữ liệu khởi tạo | Thêm: Khoa học công nghệ, Viễn thông - CNTT, 40 – dưới 50 | Inline chồng khoảng với quy tắc 0 – dưới 45 |
| AC-0313-05 | Hộp thoại | Bỏ trống Căn cứ, \[Lưu\] | Inline "Vui lòng nhập Căn cứ" |
| AC-0313-07 | Dữ liệu khởi tạo | Tra cứu Trang bị nội bộ, Viễn thông - CNTT, 20 tỷ đồng, internalIt = true | Tập đoàn / Tập đoàn, căn cứ "Văn bản ủy quyền §1.2.2 (ngoại trừ hệ thống công nghệ thông tin phục vụ nhu cầu nội bộ)" |
| AC-0313-08 | Dữ liệu khởi tạo | Tra cứu Trang bị nội bộ, Viễn thông - CNTT, 20 tỷ đồng, không gửi internalIt | VHT / VHT |
| AC-0313-09 | Dữ liệu khởi tạo | Thêm: Trang bị nội bộ, Tất cả, Hệ thống CNTT nội bộ Tất cả, từ 0 | Inline chồng khoảng với quy tắc "Trang bị nội bộ · Tất cả · Có · Từ 0 trở lên" |
| AC-0313-10 | Dữ liệu khởi tạo | Tra cứu Khoa học công nghệ, 30 tỷ đồng, internalIt = true | Chủ trương Tập đoàn, khoản đầu tư VHT (quy tắc Tất cả khớp mọi giá trị) |

## DANH MỤC CÓ SẴN

Các danh mục dưới đây đã có sẵn trên hệ thống, phân hệ Đầu tư mua sắm dùng lại. Mỗi danh mục: **Đã có sẵn trên hệ thống, SRS này không mô tả thêm.**

| Danh mục | Tên menu trên hệ thống | Dùng cho Đầu tư mua sắm | Ghi chú |
|----|----|----|----|
| Nguồn vốn | Quản lý nguồn kinh phí | Nguồn vốn của ĐXMS, khoản đầu tư, đề tài / dự án, gói thầu | Đã có sẵn trên hệ thống, SRS này không mô tả thêm. Menu Đầu tư mua sắm hiện tên "Nguồn vốn", mở danh mục Nguồn kinh phí |
| Vai trò thực hiện | Quản lý vai trò thực hiện | – | Đã có sẵn trên hệ thống, SRS này không mô tả thêm |
| Chức danh khoa học | Quản lý chức danh khoa học | – | Đã có sẵn trên hệ thống, SRS này không mô tả thêm |
| Đối tác | Quản lý đối tác | – (Đầu tư mua sắm dùng Nhà cung cấp / Nhà thầu, mục 3.2.1) | Đã có sẵn trên hệ thống, SRS này không mô tả thêm |
| Lĩnh vực | Quản lý lĩnh vực | – (Đầu tư mua sắm dùng Lĩnh vực đầu tư, mục 3.2.5) | Đã có sẵn trên hệ thống, SRS này không mô tả thêm |
| E-form | Quản lý e-form | Biểu mẫu của các bước quy trình | Đã có sẵn trên hệ thống, SRS này không mô tả thêm (mô tả ở tài liệu E-form) |

Các phân hệ Đầu tư mua sắm đọc Nguồn vốn qua API ô chọn sẵn có của danh mục Nguồn kinh phí, theo quy tắc BR-DMC-C-02 (chỉ bản ghi Đang hoạt động khi nhập liệu, giữ tên trên hồ sơ cũ).

# THIẾT KẾ DÙNG CHUNG VÀ TÁI SỬ DỤNG

| Mục | Quy tắc |
|----|----|
| Hiển thị giá trị | Không có giá trị thì "-". Ngày DD/MM/YYYY, ngày giờ DD/MM/YYYY HH:mm. Ô văn bản trong bảng tối đa 2 dòng; bị cắt thì di chuột hiện tooltip đủ nội dung |
| Số tiền tỷ đồng | Hiện và nhập dạng Việt Nam: 1.000; 159,99. Tối đa 2 chữ số thập phân, không hiện ",00" |
| Bảng | Căn trái chữ, mã, tên; căn giữa STT, Thao tác, Trạng thái, ngày; căn phải số. Cột STT, Thao tác, Trạng thái cố định khi cuộn ngang |
| Tag trạng thái | Đang hoạt động: xanh lá; Dừng hoạt động: xám; Chưa hiệu lực: vàng; Cấm: đỏ; Hạn chế: vàng |
| Tìm kiếm | Không phân biệt hoa thường và dấu; tìm, phân trang ở máy chủ |
| Trạng thái vùng dữ liệu | Đang tải: biểu tượng tải tại vùng lưới. Lỗi tải: "Không thể tải dữ liệu. Vui lòng thử lại." kèm nút thử lại |
| Chống thao tác lặp | Khóa nút \[Lưu\], \[Có\], \[Xóa\], \[Xác nhận nhập\] khi đang gửi yêu cầu |
| Hiệu năng | Trả trang đầu danh sách dưới 2 giây với 50.000 bản ghi; API ô chọn dưới 500 ms; phân hệ dùng danh mục được lưu đệm ô chọn tối đa 5 phút hoặc tới khi nhận sự kiện thay đổi danh mục |
| Nhật ký | Mọi thao tác ghi đổi dữ liệu ghi lịch sử (BR-DMC-C-04); thao tác đọc không ghi |

# THIẾT KẾ CƠ SỞ DỮ LIỆU

Mọi bảng nằm ở cơ sở dữ liệu của dịch vụ danh mục. Tên bảng của 12 danh mục đã có giữ như hiện tại. Mỗi bảng danh mục có một bảng lịch sử cùng tên kèm hậu tố \_history (khuôn ở cuối mục).

Cột chung của mọi bảng danh mục (bảng luật không có code, name):

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | id | BIGINT |  | x | P | Tự tăng | Khóa |
| 2 | code | VARCHAR(50) |  | x |  |  | Mã; duy nhất kể cả bản ghi đã xóa (BR-DMC-C-01) |
| 3 | name | VARCHAR(255) |  |  |  |  | Tên |
| 4 | description | VARCHAR(1000) | x |  |  |  | Mô tả; màn và dịch vụ chặn 500 ký tự |
| 5 | status | TINYINT |  |  |  | 1 | 1 Đang hoạt động, 0 Dừng hoạt động |
| 6 | revision_no | INT |  |  |  | 1 | Phiên bản, tăng mỗi lần ghi (BR-DMC-C-04) |
| 7 | is_deleted | TINYINT |  |  |  | 0 | Xóa mềm |
| 8 | created_by | VARCHAR(255) | x |  |  |  | Người tạo (định danh người dùng) |
| 9 | created_by_name | VARCHAR(250) | x |  |  |  | Tên người tạo |
| 10 | created_at | DATETIME(6) |  |  |  | Thời điểm ghi | Ngày tạo |
| 11 | updated_by | VARCHAR(255) | x |  |  |  | Người cập nhật |
| 12 | updated_by_name | VARCHAR(250) | x |  |  |  | Tên người cập nhật |
| 13 | updated_at | DATETIME(6) |  |  |  | Thời điểm ghi | Ngày cập nhật |
| 14 | version | BIGINT |  |  |  | 0 | Khóa lạc quan (BR-DMC-C-05) |

Chỉ mục chung: (is_deleted, status, code), (is_deleted, updated_at).

#### partner_type

Loại đối tác. Chỉ có cột chung.

#### goods_service_type

Loại hàng hoá / dịch vụ.

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | goods_group | VARCHAR(20) |  |  |  |  | **Mới.** HANG_HOA, DICH_VU |

#### wf_measurement_unit

Đơn vị tính.

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | unit_group | VARCHAR(20) |  |  |  |  | **Mới.** SO_LUONG, DO_LUONG, THOI_GIAN |
| 2 | display_order | INT | x |  |  |  | Thứ tự hiển thị 1 – 9999 (có sẵn) |

#### wf_currency

Tiền tệ. code là mã ISO 4217, đúng 3 chữ cái.

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | code | VARCHAR(50) |  | x |  |  | Mã tiền tệ (cột chung, ràng buộc thêm đúng 3 chữ cái) |
| 2 | symbol | VARCHAR(10) |  |  |  |  | Ký hiệu (có sẵn; **đổi** sang bắt buộc) |
| 3 | decimal_places | TINYINT |  |  |  | 0 | **Mới.** 0 hoặc 2 |

#### investment_field

Lĩnh vực đầu tư. **Bảng mới**, chỉ có cột chung.

#### supplier

Nhà cung cấp / Nhà thầu. **Bảng mới.** code do hệ thống sinh (BR-DMC-02-01).

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | code | VARCHAR(50) |  | x |  | Hệ thống sinh | NCC- + 6 chữ số |
| 2 | name | VARCHAR(255) |  |  |  |  | Tên nhà cung cấp |
| 3 | supplier_type | VARCHAR(10) |  |  |  | DOMESTIC | DOMESTIC Trong nước, FOREIGN Nước ngoài |
| 4 | short_name | VARCHAR(100) | x |  |  |  | Tên viết tắt / tên giao dịch |
| 5 | english_name | VARCHAR(255) | x |  |  |  | Tên tiếng Anh |
| 6 | tax_code | VARCHAR(50) | x | x\* |  |  | Mã số thuế; duy nhất khi có giá trị (BR-DMC-02-02) |
| 7 | country_code | VARCHAR(2) |  |  | F\* | VN | Quốc gia (ISO 3166-1) |
| 8 | address | VARCHAR(500) |  |  |  |  | Địa chỉ |
| 9 | quote_email | VARCHAR(255) |  |  |  |  | Email nhận yêu cầu báo giá |
| 10 | cc_emails | VARCHAR(500) | x |  |  |  | Email CC, cách nhau dấu ; |
| 11 | contact_name | VARCHAR(100) | x |  |  |  | Người liên hệ |
| 12 | phone | VARCHAR(20) | x |  |  |  | Số điện thoại |
| 13 | default_currency_id | BIGINT | x |  | F |  | Loại tiền báo giá thường dùng → wf_currency.id |
| 14 | ban_status | VARCHAR(20) |  |  |  | NORMAL | NORMAL Bình thường, BANNED Cấm, RESTRICTED Hạn chế; nghiệp vụ lựa chọn nhà thầu ghi (BR-DMC-02-04) |
| 15 | ban_until | DATE | x |  |  |  | Cấm đến ngày |
| 16 | description | VARCHAR(1000) | x |  |  |  | Mô tả |

Chỉ mục: (tax_code), (name, country_code), (ban_status).

#### supplier_goods_type

Ngành hàng cung cấp của nhà cung cấp (nhiều – nhiều). **Bảng mới.**

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | supplier_id | BIGINT |  | x | F |  | → supplier.id |
| 2 | goods_service_type_id | BIGINT |  | x | F |  | → goods_service_type.id; cặp (supplier_id, goods_service_type_id) duy nhất |

#### wf_investment_type

Loại khoản đầu tư.

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | processing_level | VARCHAR(20) |  |  |  | THEO_NGUONG | **Mới.** THEO_NGUONG, TAP_DOAN (BR-DMC-08-01) |

#### project_approval_level

Cấp phê duyệt đề tài / dự án. **Bảng mới**, chỉ có cột chung.

#### project_type

Loại dự án / đề tài. **Bảng mới**, chỉ có cột chung.

#### project_type_detail

Loại dự án (chi tiết). **Bảng mới.**

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | project_type_id | BIGINT | x |  | F |  | Loại cha → project_type.id; rỗng là chưa xếp loại |

#### wf_investment_nature

Tính chất tài sản hình thành. Chỉ có cột chung.

#### wf_bid_package_type

Loại gói thầu.

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | bidding_field | VARCHAR(20) |  |  |  |  | **Mới.** HANG_HOA, XAY_LAP, TU_VAN, PHI_TU_VAN, HON_HOP |
| 2 | display_order | INT | x |  |  |  | Thứ tự hiển thị 1 – 9999 (có sẵn) |

#### wf_contractor_selection_method

Hình thức lựa chọn nhà thầu.

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | abbreviation | VARCHAR(100) |  |  |  |  | **Mới.** Tên viết tắt |

#### wf_contractor_selection_procedure

Phương thức lựa chọn nhà thầu. Chỉ có cột chung.

#### wf_bid_evaluation_method

Phương pháp đánh giá.

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | evaluation_step | VARCHAR(20) |  |  |  |  | **Mới.** KY_THUAT, TAI_CHINH, XEP_HANG |

#### wf_contract_type

Loại hợp đồng. Chỉ có cột chung.

#### wf_guarantee_form

Hình thức bảo đảm. Ràng buộc: ít nhất một cột phạm vi bằng 1.

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | apply_bid_security | BOOLEAN |  |  |  | 0 | Bảo đảm dự thầu (có sẵn) |
| 2 | apply_contract_performance_security | BOOLEAN |  |  |  | 0 | Bảo đảm thực hiện hợp đồng (có sẵn) |
| 3 | apply_advance_payment | BOOLEAN |  |  |  | 0 | **Mới.** Bảo lãnh tạm ứng |
| 4 | apply_warranty | BOOLEAN |  |  |  | 0 | **Mới.** Bảo đảm bảo hành |

#### basis_document_type

Loại tài liệu căn cứ. **Bảng mới.** Ràng buộc: ít nhất một cột áp dụng bằng 1.

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | apply_proposal | BOOLEAN |  |  |  | 0 | Áp dụng cho ĐXMS |
| 2 | apply_approval | BOOLEAN |  |  |  | 0 | Áp dụng cho Hồ sơ Phê duyệt |
| 3 | apply_adjustment | BOOLEAN |  |  |  | 0 | Áp dụng cho Hồ sơ Điều chỉnh |
| 4 | is_mandatory | BOOLEAN |  |  |  | 0 | Bắt buộc (BR-DMC-19-01) |

#### flow_threshold

Ngưỡng phân luồng. **Bảng mới**, bảng luật (không có code, name).

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | process_group | VARCHAR(10) |  |  |  |  | DXMS, KDT |
| 2 | investment_field_id | BIGINT | x |  | F |  | → investment_field.id; rỗng là Tất cả |
| 3 | investment_nature_id | BIGINT | x |  | F |  | → wf_investment_nature.id; rỗng là Tất cả |
| 4 | value_from | DECIMAL(18,2) |  |  |  |  | Giá trị từ, tỷ đồng (gồm) |
| 5 | value_to | DECIMAL(18,2) | x |  |  |  | Đến dưới, tỷ đồng (không gồm); rỗng là không giới hạn |
| 6 | effective_from | DATE |  |  |  |  | Hiệu lực từ ngày (BR-DMC-20-02) |
| 7 | description | VARCHAR(1000) | x |  |  |  | Mô tả |

Chỉ mục: (process_group, status, effective_from).

#### flow_threshold_process

Quy trình áp dụng của quy tắc ngưỡng. **Bảng mới.**

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | flow_threshold_id | BIGINT |  | x | F |  | → flow_threshold.id |
| 2 | process_code | VARCHAR(20) |  | x |  |  | MS01.01, MS01.02, MS01.03, MS13, MS14, MS15; cặp duy nhất |

#### investment_authority_rule

Phân cấp thẩm quyền khoản đầu tư. **Bảng mới**, bảng luật.

| STT | Tên trường | Kiểu dữ liệu và độ dài | Nullable | Unikey | P/F Key | Mặc định | Mô tả |
|----|----|----|----|----|----|----|----|
| 1 | investment_type_id | BIGINT |  |  | F |  | → wf_investment_type.id |
| 2 | investment_field_id | BIGINT | x |  | F |  | → investment_field.id; rỗng là Tất cả |
| 3 | internal_it_system | TINYINT(1) | x |  |  |  | Hệ thống CNTT phục vụ nội bộ: rỗng là Tất cả, 1 Có, 0 Không (BR-DMC-21-03) |
| 4 | capital_from | DECIMAL(18,2) |  |  |  |  | Tổng mức vốn từ, tỷ đồng (gồm) |
| 5 | capital_to | DECIMAL(18,2) | x |  |  |  | Đến dưới, tỷ đồng (không gồm); rỗng là không giới hạn |
| 6 | policy_approval_level | VARCHAR(10) |  |  |  |  | Cấp duyệt chủ trương: VHT, TAP_DOAN |
| 7 | investment_approval_level | VARCHAR(10) |  |  |  |  | Cấp duyệt khoản đầu tư: VHT, TAP_DOAN |
| 8 | legal_basis | VARCHAR(255) |  |  |  |  | Căn cứ |

**Khuôn bảng lịch sử** {bảng}\_history (mọi bảng trên):

| STT | Tên trường | Kiểu dữ liệu và độ dài | Mô tả |
|----|----|----|----|
| 1 | id | BIGINT | Khóa |
| 2 | {thực thể}\_id | BIGINT | Bản ghi danh mục |
| 3 | revision_no | INT | Phiên bản sau thao tác |
| 4 | action | VARCHAR(20) | CREATE, UPDATE, ACTIVATE, DEACTIVATE, DELETE |
| 5 | change_summary | VARCHAR(1000) | Nội dung thay đổi (BR-DMC-C-04) |
| 6 | change_detail | LONGTEXT (JSON) | Giá trị cũ, mới từng trường |
| 7 | actor_id, actor_name | VARCHAR(255), VARCHAR(250) | Người thực hiện |
| 8 | action_at | DATETIME(6) | Thời điểm |

# CÂU HỎI CÒN MỞ

| \# | Câu hỏi | Phương án đang dùng trong tài liệu |
|----|----|----|
| 1 | Danh sách giá trị thật của từng danh mục (gồm nhà cung cấp, quốc gia, nguồn vốn trong danh mục Nguồn kinh phí) là gì, ai cung cấp? | Dữ liệu khởi tạo ở từng danh mục |
| 2 | Ai quản trị danh mục nào? | QTHT mọi danh mục; TTMS năm danh mục Nhà cung cấp / Nhà thầu, Loại đối tác, Loại hàng hoá / dịch vụ, Đơn vị tính, Tiền tệ (mục 2.3) |
| 3 | Mã nhà cung cấp do hệ thống sinh hay người dùng nhập? Nhà cung cấp nước ngoài định danh bằng gì, có bắt buộc không? | Tự sinh NCC- + 6 số; Mã số thuế là khóa trùng; nước ngoài không bắt buộc Mã số thuế, trùng khi cùng Tên và Quốc gia |
| 4 | Nhà cung cấp có cần tài khoản ngân hàng, hồ sơ năng lực, đánh giá nhà cung cấp không? | Không |
| 5 | Lĩnh vực đầu tư có những giá trị nào? Quốc phòng, Bất động sản có là lĩnh vực riêng không? | Bốn giá trị; Quốc phòng chưa có quy tắc ngưỡng |
| 6 | Loại khoản đầu tư có cần Cấp xử lý không, và Cấp xử lý tác động lên cấp phê duyệt hay lên nhóm khoản đầu tư? Có loại "Hoạt động thường xuyên" không? | Có Cấp xử lý, tác động lên cấp phê duyệt (BR-DMC-08-01); sáu loại |
| 7 | Ngưỡng MS13 / MS14 / MS15 là Viễn thông - CNTT dưới 160 / 1.000 / 15.000 và lĩnh vực khác dưới 90 / 500 / 15.000 tỷ đồng, hay ngược lại? Khi đổi ngưỡng có hiệu lực từ ngày sau, quy tắc cũ và mới có cùng tồn tại tới ngày hiệu lực không? | Viễn thông - CNTT dưới 160, khác dưới 90; không cho chồng khoảng giữa các quy tắc Đang hoạt động; hồ sơ giữ ngưỡng lúc tạo |
| 8 | Phương thức lựa chọn nhà thầu, loại hợp đồng theo quy chế nội bộ hay Luật Đấu thầu? | Theo quy chế nội bộ: hai phương thức một giai đoạn, tám loại hợp đồng |
| 9 | Danh sách Loại tài liệu căn cứ, loại nào bắt buộc, gắn ĐXMS hay hồ sơ? Nhãn "Hồ sơ Phê duyệt", "Hồ sơ Điều chỉnh" có đổi thành ĐXMS Tạo mới / Điều chỉnh không? | Tám loại ở mục 3.3.13; giữ nhãn |
| 10 | Bảng phân cấp thẩm quyền khoản đầu tư (loại, lĩnh vực, hệ thống CNTT phục vụ nội bộ, khoảng tổng mức vốn, cấp duyệt) có đúng không? "Hệ thống công nghệ thông tin phục vụ nhu cầu nội bộ" (ngoại lệ của văn bản ủy quyền §1.2.2) gồm những gì, mua thiết bị CNTT lẻ (máy tính, máy in) có tính là hệ thống không? | Tám quy tắc ở mục 3.4.2; trang bị nội bộ là hệ thống CNTT phục vụ nội bộ thì cấp Tập đoàn; người xác nhận 04 yếu tố định danh tự đánh giá Có / Không |
| 11 | Sự kiện thay đổi danh mục: topic, phân hệ nhận, bật ngay hay chờ? | Topic category.changed.v1, bật khi có phân hệ nhận |
| 12 | Hình thức bảo đảm có bốn phạm vi (thêm bảo lãnh tạm ứng, bảo đảm bảo hành) không? | Bốn phạm vi |
| 13 | Năm danh mục Loại chi phí, Nhóm dự án, Loại sản phẩm, Tình trạng pháp lý, Tình trạng mua sắm có cần trong Pha 1 không? | Ngoài phạm vi tài liệu |
| 14 | Loại dự án / đề tài có sáu hay bốn giá trị? | Sáu giá trị |
| 15 | Loại dự án (chi tiết) ứng với từng Loại ngoài Khoa học công nghệ; "Hỗ trợ khoa học công nghệ" thuộc Loại nào? | Như mục 3.3.5; Hỗ trợ khoa học công nghệ chưa xếp loại |
| 16 | Nguồn vốn của Đầu tư mua sắm là danh mục riêng hay dùng danh mục Nguồn kinh phí? | Dùng Nguồn kinh phí (mục 3.5) |

# PHỤ LỤC

## Hiện trạng mã nguồn cần bổ sung

Mã nguồn ngày 10/11/2026 đã có 12 danh mục ở phân hệ Danh mục dùng chung. Bảng dưới ghi chỗ mã nguồn chưa khớp tài liệu.

| \# | Điểm | Hiện trạng | Cần làm |
|----|----|----|----|
| A1 | Dịch vụ tập trung | 12 danh mục gọi /dtms/api/v1 của dịch vụ Đầu tư mua sắm; dịch vụ danh mục có bản chép Loại đối tác, Loại hàng hoá / dịch vụ, Tiền tệ, Đơn vị tính chưa được gọi; Tiền tệ, Đơn vị tính có bảng ở cả hai cơ sở dữ liệu | Chuyển cả 12 danh mục về dịch vụ danh mục (/category/api/v1), một bảng mỗi danh mục, chuyển dữ liệu, bỏ bản ở dịch vụ Đầu tư mua sắm |
| A2 | Chặn xóa khi đã tham chiếu | Chưa có lớp kiểm tra tham chiếu nào; xóa luôn thành công | Kiểm tra theo bảng Nơi dùng của từng danh mục (BR-DMC-C-03) |
| A3 | Mã quyền | Bộ mã {tiền tố}00 – 06 đã khai báo nhưng phần lớn bị tắt; Hình thức, Phương thức lựa chọn nhà thầu đang chặn thật nên người không phải siêu quản trị không thêm, sửa được; menu, thẻ Tổng quan không lọc quyền | Bật kiểm quyền theo mục 2.3, khai báo mã trên hệ thống quản lý người dùng tập trung |
| A4 | Nhãn đổi trạng thái | "Tắt / Bật trạng thái", nút Tắt / Bật; thông báo chặn xóa có chỗ ghi "Ngưng sử dụng" | "Dừng hoạt động" / "Kích hoạt", nút Không / Có (mục 2.6.4); thống nhất "Dừng hoạt động" |
| A5 | Mã | Không tự viết hoa, bỏ dấu khi gõ | Theo BR-DMC-C-06 |
| A6 | Mô tả | 500 ở 4 danh mục, 1000 ở 8 danh mục | 500 cho mọi danh mục |
| A7 | Hộp thoại | Hỏi "Hủy thay đổi?", "Chưa có thay đổi nào để lưu" chỉ có ở Đơn vị tính, Tính chất, Hình thức bảo đảm | Mọi danh mục (mục 2.6.2) |
| A8 | Lưới | Chưa có cột STT; tìm phân biệt dấu | Thêm STT; tìm không phân biệt dấu |
| A9 | Khóa lạc quan | Có cột version nhưng màn không gửi | Gửi version khi sửa, đổi trạng thái, xóa (BR-DMC-C-05) |
| A10 | Cột người tạo, cập nhật | update_by BINARY(16) hoặc created_by_id VARCHAR(255) | created_by, updated_by VARCHAR(255) (mục 5) |
| A11 | Loại gói thầu | Thứ tự hiển thị có ở dịch vụ, không có trên màn; đổi trạng thái dùng /status; lịch sử nằm trong chi tiết, gộp thành STATUS_CHANGE | Hiện Thứ tự hiển thị; dùng toggle-status, histories như khuôn |
| A12 | Trường riêng còn thiếu | – | Nhóm (Loại hàng hoá / dịch vụ, Đơn vị tính), Số chữ số thập phân và Ký hiệu bắt buộc (Tiền tệ), Cấp xử lý (Loại khoản đầu tư), Lĩnh vực đấu thầu (Loại gói thầu), Tên viết tắt (Hình thức lựa chọn nhà thầu), Bước đánh giá (Phương pháp đánh giá), hai phạm vi mới (Hình thức bảo đảm) |
| A13 | Danh mục chưa có | – | Nhà cung cấp / Nhà thầu (cả nhập từ Excel), Lĩnh vực đầu tư, Cấp phê duyệt đề tài / dự án, Loại dự án / đề tài, Loại dự án (chi tiết), Loại tài liệu căn cứ, Ngưỡng phân luồng, Phân cấp thẩm quyền khoản đầu tư; màn Tổng quan theo mục 3.1 |
| A14 | Tên menu | "Quản lý tính chất KĐT"; bốn danh mục có hậu tố "(chung VHT)" | Tên menu theo mục 2.1 |
| A15 | Sự kiện | Đã có, đang tắt bằng cấu hình | Theo BR-DMC-C-07, câu hỏi 11 |

## Ngoài phạm vi

| Danh mục | Lý do |
|----|----|
| Loại chi phí, Nhóm dự án, Loại sản phẩm, Tình trạng pháp lý, Tình trạng mua sắm | Không có trong danh sách danh mục được duyệt (câu hỏi 13) |
| Bảng ánh xạ mã danh mục với mã của hệ thống nguồn | Chưa có yêu cầu được duyệt |

## Truy vết mã chức năng

| Mã                  | Danh mục                         | Mục    |
|---------------------|----------------------------------|--------|
| DTMS_CN_0004 – 0009 | Loại đối tác                     | 3.2.2  |
| DTMS_CN_0010 – 0015 | Loại hàng hoá / dịch vụ          | 3.3.1  |
| DTMS_CN_0016 – 0021 | Đơn vị tính                      | 3.2.3  |
| DTMS_CN_0022 – 0027 | Tiền tệ                          | 3.2.4  |
| DTMS_CN_0028 – 0033 | Loại khoản đầu tư                | 3.3.2  |
| DTMS_CN_0034 – 0039 | Tính chất tài sản hình thành     | 3.3.6  |
| DTMS_CN_0040 – 0045 | Loại gói thầu                    | 3.3.7  |
| DTMS_CN_0046 – 0051 | Hình thức lựa chọn nhà thầu      | 3.3.8  |
| DTMS_CN_0052 – 0057 | Phương thức lựa chọn nhà thầu    | 3.3.9  |
| DTMS_CN_0058 – 0063 | Phương pháp đánh giá             | 3.3.10 |
| DTMS_CN_0064 – 0069 | Loại hợp đồng                    | 3.3.11 |
| DTMS_CN_0070 – 0075 | Hình thức bảo đảm                | 3.3.12 |
| DTMS_CN_0076 – 0081 | Lĩnh vực đầu tư                  | 3.2.5  |
| DTMS_CN_0082 – 0087 | Ngưỡng phân luồng                | 3.4.1  |
| DTMS_CN_0306 – 0312 | Nhà cung cấp / Nhà thầu          | 3.2.1  |
| DTMS_CN_0313 – 0318 | Phân cấp thẩm quyền khoản đầu tư | 3.4.2  |
| DTMS_CN_0319 – 0324 | Loại tài liệu căn cứ             | 3.3.13 |
| DTMS_CN_0325 – 0330 | Cấp phê duyệt đề tài / dự án     | 3.3.3  |
| DTMS_CN_0331 – 0336 | Loại dự án / đề tài              | 3.3.4  |
| DTMS_CN_0337 – 0342 | Loại dự án (chi tiết)            | 3.3.5  |
| DTMS_CN_0343        | Tổng quan Danh mục dùng chung    | 3.1.1  |
