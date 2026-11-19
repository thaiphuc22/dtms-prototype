/*
 * eForm của các user task MS19 Tổ chức lựa chọn nhà thầu (T67 T5, D-118; plan docs/dtms/prototype-T67-thau-hop-dong.md §3 T5).
 * Nguồn: BPMN-MS19 (trang MS19 của BPMN-DTMS-1611) — luồng chính 24 bước, quy trình con theo hình thức chỉ có gạch đầu dòng;
 * THAU-TT-1311 §4.1 (backbone LC), §4.2 (rộng rãi 1 túi), §4.6 (chỉ định thầu). Q7 = A: chi tiết rộng rãi 1 túi (3.1–3.6) và chỉ định thầu (7.1–7.4),
 * các hình thức khác một bước gộp. Biểu mẫu HSMT / HSYC / báo cáo đánh giá / KQLCNT khách chưa gửi (THAU-TT-1311 §8) → trường GIẢ LẬP theo Quy chế.
 * Hồ sơ con của gói thầu (đối tượng cha). Mẫu hợp đồng chọn ở bước lập HSMT / HSYC (T66 L2, H-Q1 = A) — danh mục Mẫu hợp đồng (catalog mau-hop-dong).
 */
(function () {
  const B = window.EForms.b;
  const { txt, banner, tbl, ta, tf, num, sel, rad, chk, req, dl, opts, dt } = B;
  const Flow = window.Flow, D = window.D;
  const pick = (vals, keys) => keys.reduce((o, k) => { if (vals[k] !== undefined) o[k] = vals[k]; return o; }, {});
  const T = () => window.Thau;
  const g0 = () => T().pkOf(Flow.state.parent) || {};
  const ty = (v) => window.UI.ty(v, 2);
  const kit = () => T().kit;

  const head = () => txt('**{{goi.code}}** — {{goi.ten}} · {{goi.hinhThuc}}, {{goi.phuongThuc}} · giá gói thầu **{{goi.gia}} tỷ đồng** · KHLCNT {{goi.kh}}');
  const back = (label) => banner(`${label}: {{lyDoTra}}`, '=lyDoTra = ""', 'info');
  const hsKind = () => (['DTRR', 'DTHC'].includes(g0().form) ? 'HSMT' : g0().form === 'CGTT' ? 'HSMCG' : 'HSYC');
  /* Lập hồ sơ mời: mẫu hợp đồng là trường của HSMT / HSYC (QT-10.2.4 §5.2). Gợi ý theo loại gói (H-Q2, GIẢ LẬP), người lập chọn lại được. */
  const hsForm = (id, kind) => ({ id, outputs: () => ['LC-HS'],
    schema: () => ({ components: [head(), txt(`Lập **${kind === 'HSYC' ? 'hồ sơ yêu cầu (HSYC)' : 'hồ sơ mời thầu (HSMT)'}** từ dữ liệu gói thầu đã duyệt trong KHLCNT.`),
      ...(kind === 'HSYC' ? [sel('lcNhaThauDk', 'Nhà thầu dự kiến', req({ valuesKey: 'nccOptions', searchable: true, layout: { columns: 8 } }))] : []),
      /* T80 L2: năm phương pháp của Điều 32 (khoản 1–5); HSYC chỉ giá thấp nhất (khoản 7). Kết hợp kỹ thuật và giá: tỷ trọng điểm kỹ thuật theo khoản 4 điểm b. */
      sel('lcPpDanhGia', 'Phương pháp đánh giá', req({ values: opts(kind === 'HSYC' ? ['Giá thấp nhất'] : T().PP_DG), layout: { columns: 8 } })),
      num('lcTyTrongKt', 'Tỷ trọng điểm kỹ thuật (%)', req({ layout: { columns: 8 }, description: g0().type === 'TV' ? 'Gói tư vấn: 70%–80% (Điều 32 khoản 4 điểm b)' : 'Gói hàng hoá, phi tư vấn, xây lắp, hỗn hợp: 10%–30% (Điều 32 khoản 4 điểm b)', conditional: { hide: '=not(lcPpDanhGia = "Kết hợp giữa kỹ thuật và giá")' } })),
      num('lcBaoDam', 'Bảo đảm dự thầu (% giá gói thầu)', req({ layout: { columns: 8 } })),
      /* T80 L9 (QC-12869 Điều 30 khoản 4, Điều 27 khoản 4; trường theo tab A-HSMT hệ thống cũ — HT-THAU-CONV). */
      num('lcHieuLucHsdt', 'Thời gian có hiệu lực của HSDT (ngày)', req({ layout: { columns: 8 }, description: 'Tối đa 180 ngày kể từ ngày đóng thầu (Điều 30 khoản 4)' })),
      { type: 'expression', key: 'lcHieuLucBd', expression: '=lcHieuLucHsdt + 30' },
      txt('Giá trị bảo đảm dự thầu: **{{decimal(giaGoiSo * lcBaoDam / 100, 3)}} tỷ đồng** · hiệu lực bảo đảm dự thầu: **{{lcHieuLucBd}} ngày** (hiệu lực HSDT + 30 ngày — Điều 27 khoản 4).'),
      num('lcHdTuongTu', 'Giá trị hợp đồng tương tự tối thiểu (tỷ đồng)', req({ layout: { columns: 8 } })),
      num('lcSoNamDt', 'Số năm tính doanh thu bình quân', req({ layout: { columns: 8 } })),
      num('lcDtBinhQuan', 'Doanh thu bình quân tối thiểu (tỷ đồng)', req({ layout: { columns: 8 } })),
      num('lcTangKl', 'Tỷ lệ tăng khối lượng tối đa (%)', { layout: { columns: 8 } }), num('lcGiamKl', 'Tỷ lệ giảm khối lượng tối đa (%)', { layout: { columns: 8 } }),
      tf('lcTgSuDung', 'Thời gian sử dụng dự kiến của hàng hoá', { layout: { columns: 8 } }),
      dt('lcNgayDong', kind === 'HSYC' ? 'Hạn nộp HSĐX' : 'Thời điểm đóng thầu', req({ layout: { columns: 8 } })),
      sel('lcMauHd', 'Mẫu hợp đồng', req({ valuesKey: 'mauOptions', searchable: true, layout: { columns: 12 } })),
      txt('Phương thức thanh toán theo mẫu đã chọn: **{{lcTt}}**.'),
      ta('lcYeuCau', 'Yêu cầu kỹ thuật, phạm vi cung cấp', req())] }),
    notes: () => ['Biểu mẫu HSMT / HSYC khách chưa cung cấp (THAU-TT-1311 §8): trường GIẢ LẬP theo Quy chế (bảo đảm dự thầu ≤ 3% giá gói — Điều 27, kiểm khi xác nhận).',
      '<b>Mẫu hợp đồng</b> đọc danh mục Mẫu hợp đồng (BM-HD-2026); gợi ý theo Loại gói thầu và nhà thầu trong / ngoài nước (GIẢ LẬP, chờ BA chốt quy tắc), người lập chọn lại được. Phương thức thanh toán đi theo mẫu. MS22 bước 3 đọc lại mẫu này.'],
    write: (v) => pick(v, ['lcNhaThauDk', 'lcPpDanhGia', 'lcTyTrongKt', 'lcBaoDam', 'lcHieuLucHsdt', 'lcHdTuongTu', 'lcSoNamDt', 'lcDtBinhQuan', 'lcTangKl', 'lcGiamKl', 'lcTgSuDung', 'lcNgayDong', 'lcMauHd', 'lcYeuCau']) });
  /* T80 L2 (QC-12869 Điều 32, Điều 33): mỗi nhà thầu — hợp lệ, năng lực kinh nghiệm, kỹ thuật (điểm khi phương pháp có điểm), sửa lỗi, hiệu chỉnh sai lệch, giảm giá,
     giá sau hiệu chỉnh (expression tính lại trên form), chi phí quy đổi (giá đánh giá), hiệu lực HSDT. Xếp hạng do bộ xử lý hành động tính khi xác nhận (Thau.lcXepHang). */
  const PP_DIEM = '=lcPpGia = "Giá thấp nhất" or lcPpGia = "Giá đánh giá"';
  const danhGia = (id, label) => ({ id, outputs: () => ['LC-BCDG'],
    schema: () => ({ components: [head(), txt('Phương pháp đánh giá (theo hồ sơ mời đã duyệt): **{{lcPpGia}}**{{tyTrongTxt}}. Nhà thầu đạt được xếp hạng khi xác nhận.'),
      dl('lcDanhGia', label, [txt('**{{this.ten}}** · giá dự thầu {{this.gia}} tỷ đồng', 12),
        rad('hopLe', 'Hợp lệ', req({ values: opts(['Đạt', 'Không đạt']), layout: { columns: 4 } })), rad('nangLuc', 'Năng lực, kinh nghiệm', req({ values: opts(['Đạt', 'Không đạt']), layout: { columns: 4 } })),
        rad('kyThuat', 'Kỹ thuật', req({ values: opts(['Đạt', 'Không đạt']), layout: { columns: 4 } })),
        num('diemKt', 'Điểm kỹ thuật', { layout: { columns: 4 }, conditional: { hide: PP_DIEM } }),
        num('suaLoi', 'Sửa lỗi (tỷ đồng, ±)', { layout: { columns: 4 } }), num('hieuChinh', 'Hiệu chỉnh sai lệch (tỷ đồng, ±)', { layout: { columns: 4 } }), num('giamGia', 'Giá trị giảm giá (tỷ đồng)', { layout: { columns: 4 } }),
        chk('uuDai', 'Ưu đãi', { text: 'Thuộc đối tượng được hưởng ưu đãi (Điều 31 khoản 5)', layout: { columns: 4 }, conditional: { hide: '=not(coUuDai)' } }),
        num('quyDoi', 'Chi phí quy đổi về cùng mặt bằng (tỷ đồng)', { layout: { columns: 4 }, conditional: { hide: '=not(lcPpGia = "Giá đánh giá")' } }),
        { type: 'expression', key: 'giaSau', expression: '=decimal(this.giaSo + this.suaLoi + this.hieuChinh - this.giamGia, 3)' },
        txt('Giá dự thầu sau sửa lỗi, hiệu chỉnh sai lệch, trừ giảm giá: **{{this.giaSau}} tỷ đồng**', 8), num('hieuLuc', 'Hiệu lực HSDT (ngày)', { layout: { columns: 4 } }),
        ta('ghiChu', 'Nhận xét; lý do không đạt')]),
      ta('lcLamRo', 'Nội dung làm rõ (nếu có)')] }),
    notes: () => ['Kết quả đánh giá theo nhà thầu là bảng lặp eForm của Tổ chuyên gia (Backlog dòng 360–372). Danh sách nhà thầu lấy từ hồ sơ đã mở / HSĐX đã nhận.',
      'Giá sau sửa lỗi, hiệu chỉnh sai lệch, trừ giảm giá và xếp hạng theo QC-12869 Điều 32; nhà thầu không đạt phải ghi lý do (Điều 33 khoản 3). Cách quy điểm giá của phương pháp kết hợp GIẢ LẬP.'],
    write: (v) => { const g = g0(), r = T().lcXepHang(v.lcDanhGia, T().lcPpOf(g, Flow.ui), g.price, Flow.ui.lcTyTrongKt);
      return Object.assign(pick(v, ['lcLamRo']), { lcDanhGia: r, lcKhongDat: r.filter((x) => !x.xepHang).map((x) => ({ ten: x.ten, lyDo: x.ghiChu || '' })) }); } });
  /* T80 L1: mua sắm trực tiếp thêm Kết quả thương thảo — Không thành → cổng G7 quay về 7.5 mời nhà thầu xếp hạng tiếp theo (Điều 15 khoản 3). */
  const nccRows = () => (window.Catalog ? window.Catalog.rows('nha-cung-cap') : []);
  const repOf = (code) => { const r = nccRows().find((x) => x.code === code) || {}; return { lcDaiDienNt: r.rep || '', lcChucVuNt: r.rep ? r.position || '' : '' }; };
  const thuongThao = (id) => ({ id, outputs: () => ['LC-BBTT'],
    schema: () => ({ components: [head(),
      sel('lcNhaThau', 'Nhà thầu đề nghị trúng thầu', req({ valuesKey: 'datOptions', layout: { columns: 10 } })),
      /* T80 (sau L7): người đại diện / chức vụ của nhà thầu đọc danh mục Nhà cung cấp SCR-31 theo nhà thầu đang chọn (lọc FEEL), ghi vào biên bản thương thảo. */
      tbl('Đại diện nhà thầu (danh mục Nhà cung cấp)', 'nccRep[item.ma = lcNhaThau]', [['rep', 'Người đại diện'], ['position', 'Chức vụ']]),
      banner('Nhà thầu chưa khai báo người đại diện ở danh mục Nhà cung cấp — cập nhật danh mục trước khi in biên bản thương thảo.', '=count(nccRep[item.ma = lcNhaThau and item.rep = "-"]) = 0', 'warning'),
      num('lcGiaTT', 'Giá sau thương thảo (tỷ đồng)', req({ layout: { columns: 6 } })), dt('lcNgayTT', 'Ngày biên bản thương thảo', req({ layout: { columns: 8 } })),
      rad('lcTtKq', 'Kết quả thương thảo', req({ values: [{ label: 'Thành công', value: 'OK' }, { label: 'Không thành — mời nhà thầu xếp hạng tiếp theo của gói tham chiếu', value: 'KHONG' }],
        conditional: { hide: '=not(goiForm = "MSTT")' } })),
      /* T80 L3: biên bản thương thảo dạng bảng (tab BB Thương thảo của hệ thống cũ — HT-THAU-CONV); dòng gợi ý điền sẵn từ HSMT / mẫu hợp đồng, thêm dòng được. */
      tf('lcTgThHd', 'Thời gian thực hiện hợp đồng sau thương thảo', req({ layout: { columns: 8 } })),
      B.dlAdd('lcBbTt', 'Biên bản thương thảo', [tf('noiDung', 'Nội dung thương thảo', req({ layout: { columns: 4 } })), ta('yKien', 'Ý kiến nhà thầu', { layout: { columns: 6 } }),
        ta('thongNhat', 'Nội dung hai bên thống nhất đưa vào hợp đồng', req({ layout: { columns: 6 } }))]),
      ta('lcNoiDungTT', 'Nội dung khác')] }),
    notes: () => ['Thương thảo hợp đồng với nhà thầu xếp hạng thứ nhất (Điều 36); không thành công thì mời nhà thầu kế tiếp — chọn lại ở ô Nhà thầu đề nghị trúng thầu. Ngày biên bản thương thảo là trường trộn của mẫu hợp đồng.',
      'Mua sắm trực tiếp: chọn <b>Không thành</b> → cổng sau bước (đề xuất DX-19) quay lại gửi thư mời cho nhà thầu xếp hạng tiếp theo của gói tham chiếu (QC-12869 Điều 15 khoản 3).'],
    write: (v) => Object.assign(pick(v, ['lcNhaThau', 'lcGiaTT', 'lcNgayTT', 'lcTtKq', 'lcNoiDungTT', 'lcTgThHd', 'lcBbTt']), repOf(v.lcNhaThau)) });
  /* T80 L1 (D-132 Q3 = A) — 7.6 kiểm tra điều kiện mua sắm trực tiếp (Điều 15 khoản 2); 7.5 thư mời thương thảo kèm dự thảo hợp đồng
     (Điều 15 khoản 4 điểm a — mua sắm trực tiếp; Điều 16 khoản 5 điểm a — chỉ định thầu rút gọn). Bước đề xuất DX-19, BPMN-MS19 chưa có. */
  const kiemTra15 = { id: 'dtms-ms19-t07-6-dieu-kien-mstt',
    schema: () => ({ components: [head(),
      txt('Mua sắm trực tiếp chỉ áp dụng khi gói thầu đáp ứng **đủ 4 điều kiện** so với một gói tương tự đã có KQLCNT: nhà thầu trúng qua đấu thầu rộng rãi / hạn chế; khối lượng từng hạng mục không quá 150%; đơn giá không vượt; phê duyệt KQLCNT gói trước không quá 12 tháng.'),
      sel('lcGoiTc', 'Gói thầu tham chiếu', req({ valuesKey: 'refOptions', searchable: true, layout: { columns: 16 } })),
      tbl('Gói thầu tham chiếu', 'refInfo', [['muc', 'Nội dung'], ['giaTri', 'Giá trị']]),
      dl('lcSoSanh', 'So sánh hạng mục với gói tham chiếu', [txt('**{{this.hangMuc}}** ({{this.dvt}})', 16),
        num('klTruoc', 'Khối lượng gói tham chiếu', req({ layout: { columns: 4 } })), num('klNay', 'Khối lượng gói này', req({ layout: { columns: 4 } })),
        num('dgTruoc', 'Đơn giá gói tham chiếu (triệu đồng)', req({ layout: { columns: 4 } })), num('dgNay', 'Đơn giá dự kiến (triệu đồng)', req({ layout: { columns: 4 } }))]),
      ta('lcGhiChuDk', 'Ghi chú kiểm tra (giá thị trường tại thời điểm hoàn thiện hợp đồng…)')] }),
    notes: () => ['<b>Đề xuất DX-19</b>: bước chưa có trong BPMN-MS19 (cổng Hình thức LCNT thiếu nhánh mua sắm trực tiếp). Số bước GIẢ LẬP.',
      'Gói tham chiếu chọn từ gói đã có KQLCNT của ĐTMS (đấu thầu rộng rãi / hạn chế) và gói chuyển đổi từ hệ thống cũ. Gói ĐTMS chưa lưu đơn giá từng hạng mục → Tổ chuyên gia nhập ở bảng so sánh.',
      'Khi xác nhận, bộ xử lý hành động tính 4 điều kiện (tỷ lệ khối lượng, so đơn giá, số tháng từ ngày phê duyệt KQLCNT); có điều kiện không đạt thì không chuyển bước — phải điều chỉnh KHLCNT sang hình thức khác.'],
    write: (v) => Object.assign(pick(v, ['lcGoiTc', 'lcSoSanh', 'lcGhiChuDk']), { lcDieuKien: T().lcCheck15(v.lcGoiTc, v.lcSoSanh, Flow.dateOf(Flow.state.clock)) }) };
  const thuMoi = { id: 'dtms-ms19-t07-5-thu-moi-tt', outputs: () => ['LC-TM'],
    schema: () => ({ components: [head(),
      banner('Thương thảo lần trước không thành công — mời nhà thầu xếp hạng tiếp theo của gói tham chiếu (lần mời {{lanMoi}}).', '=lcMoiTiep = 0', 'warning'),
      txt('Gửi **thư mời thương thảo kèm dự thảo hợp đồng** cho nhà thầu, nêu rõ phạm vi cung cấp, yêu cầu kỹ thuật, tiến độ. Không lập HSYC, không đánh giá HSĐX.'),
      sel('lcNhaThauMoi', 'Nhà thầu được mời', req({ valuesKey: 'nccOptions', searchable: true, layout: { columns: 10 } })),
      dt('lcNgayGuiTm', 'Ngày gửi thư mời', req({ layout: { columns: 6 } })),
      ta('lcPhamVi', 'Phạm vi cung cấp, yêu cầu kỹ thuật, tiến độ', req()),
      sel('lcMauHd', 'Dự thảo hợp đồng theo mẫu', req({ valuesKey: 'mauOptions', searchable: true, layout: { columns: 12 } })),
      num('lcGiamGia', 'Tỷ lệ giảm giá yêu cầu so với giá gói thầu (%)', { layout: { columns: 4 }, conditional: { hide: '=goiForm = "MSTT"' } }),
      txt('Phương thức thanh toán theo mẫu đã chọn: **{{lcTt}}**.')] }),
    notes: () => ['<b>Đề xuất DX-19</b>: bước chưa có trong BPMN-MS19 (quy trình con 7 chỉ ghi trình tự chỉ định thầu thông thường). Số bước GIẢ LẬP.',
      'Mua sắm trực tiếp: nhà thầu mặc định là nhà thầu trúng gói tham chiếu, mời lại thì nhà thầu xếp hạng tiếp theo (Điều 15 khoản 3); dự thảo hợp đồng theo kết quả gói trước. Chỉ định thầu rút gọn: nhà thầu dự kiến trong KHLCNT, có thể nêu tỷ lệ giảm giá so với giá gói (Điều 16 khoản 5 điểm a).'],
    write: (v) => pick(v, ['lcNhaThauMoi', 'lcNgayGuiTm', 'lcPhamVi', 'lcMauHd', 'lcGiamGia']) };
  /* Hình thức chưa có sơ đồ con (Q7 = A): một bước gộp, liệt kê trình tự theo BPMN-MS19. */
  const gop = (n) => ({ id: `dtms-ms19-t${String(n).padStart(2, '0')}-gop`, outputs: () => ['LC-BCDG'],
    schema: () => ({ components: [head(), txt('Trình tự theo hình thức **{{goi.hinhThuc}}**:\n{{trinhTu}}'),
      sel('lcNhaThau', 'Nhà thầu / đơn vị được đề nghị', req({ valuesKey: 'nccOptions', searchable: true, layout: { columns: 10 } })),
      num('lcGiaTT', 'Giá đề nghị (tỷ đồng)', req({ layout: { columns: 6 } })), ta('lcNoiDungTT', 'Kết quả thực hiện', req())] }),
    notes: () => ['<b>GIẢ LẬP</b> (D-118 Q7 = A): BPMN-MS19 chỉ ghi gạch đầu dòng cho quy trình con của hình thức này, chưa có sơ đồ con — prototype gộp thành một bước, trình tự hiện chỉ xem. Chờ BA vẽ quy trình con (P-235).'],
    write: (v) => pick(v, ['lcNhaThau', 'lcGiaTT', 'lcNoiDungTT']) });
  const ky = () => ({ id: 'dtms-ms19-t16-van-ban-kq', outputs: () => ['LC-QD'],
    schema: () => ({ components: [head(), txt('Dự thảo **Quyết định phê duyệt KQLCNT** do hệ thống sinh từ hồ sơ KQLCNT. Người ký: **{{nguoiKy}}**.'),
      tbl('Kết quả lựa chọn nhà thầu', 'kq', [['muc', 'Nội dung'], ['giaTri', 'Giá trị']]), ta('lcQdGhiChu', 'Ghi chú rà soát dự thảo')] }),
    notes: () => ['Chọn phương thức ký bằng nút: Trình ký VOffice (17 → 19 nhận kết quả) hoặc Trình ký cứng (18 tải bằng chứng ký). Lỗi kỹ thuật → 20 thử lại; người ký từ chối → 21 chỉnh sửa.'],
    write: (v) => pick(v, ['lcQdGhiChu']) });

  const F = {
    1: { id: 'dtms-ms19-t01-khoi-tao',
      schema: () => ({ components: [head(), tbl('Thông tin gói thầu đã duyệt trong KHLCNT', 'thongTin', [['muc', 'Nội dung'], ['giaTri', 'Giá trị']]),
        /* T80 L6: thành phần Tổ chuyên gia / Tổ thẩm định theo Quyết định thành lập; bộ xử lý hành động kiểm chứng chỉ đào tạo về đấu thầu (Điều 2 khoản 27, 28). */
        tbl('Tổ chuyên gia và Tổ thẩm định', 'toCg', [['ten', 'Họ và tên'], ['to', 'Tổ'], ['viTri', 'Vị trí trong Tổ'], ['phanCong', 'Phân công công việc'], ['chungChi', 'Chứng chỉ đào tạo về đấu thầu']]),
        chk('lcDaKiemTra', 'Xác nhận', req({ text: 'Đã kiểm tra thông tin gói thầu, Tổ chuyên gia và Tổ thẩm định' }))] }),
      notes: () => ['Mỗi gói một tiến trình (BPMN-MS19 bước 1). Hoàn thành → bước 2 (hệ thống) đọc hình thức / phương thức đã duyệt trong KHLCNT và rẽ quy trình con theo hình thức.'],
      write: (v) => pick(v, ['lcDaKiemTra']) },
    3.1: hsForm('dtms-ms19-t03-1-lap-hsmt', 'HSMT'),
    3.2: { id: 'dtms-ms19-t03-2-tham-dinh-hsmt', outputs: () => ['LC-HS'],
      decide: { btn: 'Kết quả thẩm định HSMT', yes: 'Đạt — phê duyệt HSMT', no: 'Không đạt — trả sửa', reasonKey: 'lcYKienHs' },
      schema: () => ({ components: [head(), tbl('Hồ sơ mời thầu', 'hs', [['muc', 'Nội dung'], ['giaTri', 'Giá trị']]), ta('lcYKienHs', 'Ý kiến thẩm định')] }),
      notes: () => ['Không đạt → trả Tổ chuyên gia sửa (THAU-TT-1311 §4.2 bước 2), bắt buộc ý kiến.'], write: (v) => pick(v, ['lcYKienHs']) },
    3.3: { id: 'dtms-ms19-t03-3-phat-hanh',
      schema: () => ({ components: [head(), tf('lcTbmt', 'Số thông báo mời thầu', req({ layout: { columns: 8 } })), dt('lcNgayPh', 'Ngày phát hành', req({ layout: { columns: 8 } })),
        chk('lcDaDang', 'Xác nhận', req({ text: 'Đã đăng tải HSMT trên Cổng đấu thầu' }))] }),
      notes: () => ['Phát hành qua tích hợp Cổng đấu thầu (P-82): số TBMT do cổng trả về, GIẢ LẬP theo mã gói.'], write: (v) => pick(v, ['lcTbmt', 'lcNgayPh', 'lcDaDang']) },
    /* T80 L5 (QC-12869 Điều 36 khoản 5): đấu thầu rộng rãi / hạn chế chỉ 01 HSDT khi đóng thầu → Chủ đầu tư gia hạn (≥ 03 ngày làm việc) hoặc mở thầu ngay. */
    3.4: { id: 'dtms-ms19-t03-4-mo-thau', outputs: () => (motHs1() ? ['LC-XLTH'] : []),
      schema: () => ({ components: [head(), banner('Đã gia hạn thời điểm đóng thầu {{giaHanTxt}}.', '=giaHanTxt = ""', 'info'),
        tbl('Hồ sơ dự thầu đã nhận', 'hsdt', [['ma', 'Mã nhà thầu'], ['ten', 'Tên nhà thầu'], ['gia', 'Giá dự thầu (tỷ đồng)']]),
        banner('Tại thời điểm đóng thầu chỉ có 01 nhà thầu nộp HSDT. Chủ đầu tư chọn một trong hai cách xử lý (Điều 36 khoản 5).', '=not(motHs)', 'bad'),
        rad('lcXlTh', 'Xử lý tình huống', req({ values: opts([['GIA_HAN', 'Gia hạn thời điểm đóng thầu'], ['MO', 'Mở thầu ngay để đánh giá']]), conditional: { hide: '=not(motHs)' } })),
        /* T80 L5b: Chủ đầu tư quyết định theo tờ trình xử lý tình huống (cả hai cách); gia hạn thêm công văn gia hạn đóng thầu gửi nhà thầu (HT-THAU-CONV tab Xử lý tình huống). */
        tf('lcSoTtrXlth', 'Số tờ trình xử lý tình huống', req({ layout: { columns: 8 }, conditional: { hide: '=not(motHs)' } })),
        tf('lcSoCvGh', 'Số công văn gia hạn đóng thầu', req({ layout: { columns: 8 }, conditional: { hide: '=not(lcXlTh = "GIA_HAN")' } })),
        ta('lcLyDoGh', 'Lý do gia hạn', req({ conditional: { hide: '=not(lcXlTh = "GIA_HAN")' } })),
        dt('lcDongMoi', 'Thời điểm đóng thầu mới', req({ layout: { columns: 8 }, description: 'Tối thiểu 03 ngày làm việc kể từ thời điểm đóng thầu hiện tại', conditional: { hide: '=not(lcXlTh = "GIA_HAN")' } })),
        dt('lcMoMoi', 'Thời điểm mở thầu mới', req({ layout: { columns: 8 }, conditional: { hide: '=not(lcXlTh = "GIA_HAN")' } })),
        tf('lcSoVbGh', 'Số văn bản gia hạn (thông báo sửa đổi TBMT trên Cổng đấu thầu)', req({ layout: { columns: 16 }, conditional: { hide: '=not(lcXlTh = "GIA_HAN")' } })),
        dt('lcNgayMo', 'Ngày mở thầu', req({ layout: { columns: 8 }, conditional: { hide: '=lcXlTh = "GIA_HAN"' } }))] }),
      notes: () => ['Danh sách HSDT nhận từ Cổng đấu thầu khi đóng thầu (P-82, GIẢ LẬP theo dữ liệu nhà thầu của gói). Chỉ 01 HSDT → tình huống Điều 36 ở tab Tình huống & kiến nghị.'],
      write: (v) => { const o = pick(v, ['lcNgayMo', 'lcXlTh', 'lcSoTtrXlth']);
        if (v.lcXlTh === 'GIA_HAN') { const ls = Flow.ui.lcGiaHan || [], ngay = Flow.dateOf(Flow.state.clock);
          return Object.assign(o, { lcNgayDong: v.lcDongMoi, lcGiaHan: ls.concat([{ lan: ls.length + 1, ngay, lyDo: v.lcLyDoGh, dongCu: Flow.ui.lcNgayDong || ngay, dongMoi: v.lcDongMoi, moMoi: v.lcMoMoi, soVb: v.lcSoVbGh, soTtr: v.lcSoTtrXlth, soCv: v.lcSoCvGh }]) }); }
        if (v.lcXlTh === 'MO') o.lcMoNgay = Flow.dateOf(Flow.state.clock);
        return o; } },
    3.5: danhGia('dtms-ms19-t03-5-danh-gia', 'Đánh giá HSDT'),
    3.6: thuongThao('dtms-ms19-t03-6-thuong-thao'),
    7.1: hsForm('dtms-ms19-t07-1-lap-hsyc', 'HSYC'),
    7.2: { id: 'dtms-ms19-t07-2-gui-hsyc',
      schema: () => ({ components: [head(), txt('Gửi HSYC cho nhà thầu dự kiến **{{nhaThauDk}}**.'), dt('lcNgayGui', 'Ngày gửi HSYC', req({ layout: { columns: 8 } }))] }),
      notes: () => ['Chỉ định thầu: HSYC gửi một nhà thầu dự kiến (THAU-TT-1311 §4.6); trạng thái gói Chờ nhà thầu phản hồi.'], write: (v) => pick(v, ['lcNgayGui']) },
    7.3: danhGia('dtms-ms19-t07-3-danh-gia', 'Đánh giá HSĐX'),
    7.4: thuongThao('dtms-ms19-t07-4-thuong-thao'),
    7.5: thuMoi, 7.6: kiemTra15,
    4: gop(4), 5: gop(5), 6: gop(6), 8: gop(8), 9: gop(9), 10: gop(10), 11: gop(11), 12: gop(12),
    13: { id: 'dtms-ms19-t13-ho-so-kq', outputs: () => ['LC-BCKQ'],
      schema: () => ({ components: [head(), back('Yêu cầu chỉnh sửa'), tbl('Kết quả lựa chọn nhà thầu', 'kq', [['muc', 'Nội dung'], ['giaTri', 'Giá trị']]), ta('lcKqGhiChu', 'Ghi chú hồ sơ KQLCNT')] }),
      notes: () => ['Tổng hợp từ quy trình con (nhà thầu, giá, ngày thương thảo) — chỉ xem; sửa thì sửa ở bước của quy trình con.'], write: (v) => pick(v, ['lcKqGhiChu']) },
    14: { id: 'dtms-ms19-t14-tham-dinh-kq', outputs: () => ['LC-BCKQ'],
      decide: { btn: 'Kết quả thẩm định KQLCNT', yes: 'Đạt', no: 'Không đạt — trả sửa', reasonKey: 'lcYKienKq' },
      schema: () => ({ components: [head(), tbl('Kết quả lựa chọn nhà thầu', 'kq', [['muc', 'Nội dung'], ['giaTri', 'Giá trị']]), ta('lcYKienKq', 'Ý kiến thẩm định')] }),
      notes: () => ['Kiểm tra căn cứ, kết quả đánh giá / thương thảo và hồ sơ trình (BPMN-MS19 bước 14). Không đạt → 15 sửa, trình lại 13.'], write: (v) => pick(v, ['lcYKienKq']) },
    15: { id: 'dtms-ms19-t15-sua-kq', schema: () => ({ components: [head(), back('Ý kiến thẩm định'), ta('lcNoiDungSua', 'Nội dung đã chỉnh sửa', req())] }),
      notes: () => ['Sửa theo ý kiến thẩm định rồi trình lại (15 → 13).'], write: (v) => pick(v, ['lcNoiDungSua']) },
    16: ky(),
    18: { id: 'dtms-ms19-t18-ky-cung', schema: () => ({ components: [head(), tf('lcQdSo', 'Số Quyết định', req({ layout: { columns: 8 } })), dt('lcQdNgay', 'Ngày ký', req({ layout: { columns: 8 } })),
      txt('Bản Quyết định đã ký tải lên ở Danh sách tài liệu.')] }), notes: () => ['Ký ngoài hệ thống: tải bằng chứng ký → 19 nhận kết quả.'], write: (v) => pick(v, ['lcQdSo', 'lcQdNgay']) },
    21: { id: 'dtms-ms19-t21-tu-choi', schema: () => ({ components: [head(), back('Ý kiến từ chối của người ký'), ta('lcChuyenSua', 'Nội dung cần chỉnh sửa', req())] }),
      notes: () => ['Người ký từ chối → sửa văn bản phê duyệt (21 → 16).'], write: (v) => pick(v, ['lcChuyenSua']) },
    /* T80 L3 (phần thầu): thư chấp thuận HSDT và trao hợp đồng + thông tin chuyển giao để ký hợp đồng (tab Trao HĐ, TT Ký HĐ của hệ thống cũ — HT-THAU-CONV).
       QC-12869 không có biểu mẫu, BPMN-MS19 không có bước riêng → đặt ở bước 22 cùng đăng tải KQLCNT (GIẢ LẬP P-THAU-04). */
    22: { id: 'dtms-ms19-t22-cong-khai', outputs: () => ['LC-TCT', 'LC-CG'],
      schema: () => ({ components: [head(), tbl('Thông tin công khai KQLCNT', 'kq', [['muc', 'Nội dung'], ['giaTri', 'Giá trị']]),
        txt('**Thư chấp thuận hồ sơ dự thầu và trao hợp đồng** — gửi nhà thầu trúng thầu **{{traoNt}}**, giá trúng thầu **{{giaTrungTxt}} tỷ đồng**.'),
        dt('lcNgayThu', 'Ngày thư', req({ layout: { columns: 6 } })),
        num('lcTgHoanThien', 'Thời hạn hoàn thiện hợp đồng (ngày)', req({ layout: { columns: 5 }, description: 'Nhà thầu không hoàn thiện hợp đồng trong 10 ngày (quốc tế 20 ngày) kể từ khi nhận thông báo trúng thầu thì không được hoàn trả bảo đảm dự thầu (Điều 27 khoản 8 điểm e)' })),
        num('lcTgKyKet', 'Thời hạn ký kết hợp đồng (ngày)', req({ layout: { columns: 5 } })),
        num('lcBaoLanh', 'Bảo đảm thực hiện hợp đồng (% giá hợp đồng)', req({ layout: { columns: 6 }, description: 'Từ 2% đến 10% giá hợp đồng (Điều 44 khoản 3)', conditional: { hide: '=laTv' } })),
        txt('Giá trị bảo đảm thực hiện hợp đồng: **{{decimal(giaTrungSo * lcBaoLanh / 100, 3)}} tỷ đồng**.', 16, '=laTv'),
        banner('Gói tư vấn: nhà thầu không phải nộp bảo đảm thực hiện hợp đồng (Điều 44 khoản 1).', '=not(laTv)', 'info'),
        txt('**Thông tin chuyển giao để ký hợp đồng** — bàn giao cho bộ phận Hợp đồng. Ngày hết hạn hoàn thiện, ký kết hợp đồng = ngày thư + thời hạn hoàn thiện + thời hạn ký kết (tính khi xác nhận).'),
        dt('lcNgayBanGiao', 'Ngày bàn giao', req({ layout: { columns: 6 } })),
        txt('Ngày hết hiệu lực HSDT của nhà thầu trúng thầu: **{{hetHlTxt}}**. Hạn ký hợp đồng sau ngày này thì đề nghị nhà thầu gia hạn hiệu lực HSDT.', 10),
        dl('lcDauMoi', 'Đầu mối liên hệ', [txt('**{{this.vaiTro}}**', 4), tf('ten', 'Họ và tên', { layout: { columns: 6 } }), tf('lienHe', 'Điện thoại / email', { layout: { columns: 6 } })]),
        tf('lcTgGiaoHang', 'Thời gian giao hàng / thực hiện', req({ layout: { columns: 8 } })), tf('lcDkTt', 'Điều kiện thanh toán', req({ layout: { columns: 8 } })),
        tbl('Phân bổ giá trúng thầu theo nguồn gói thầu', 'phanBoTt', [['loai', 'Nguồn gói thầu'], ['ma', 'Mã'], ['phanBo', 'Giá trị phân bổ của gói (tỷ đồng)'], ['trung', 'Giá trúng thầu phân bổ (tỷ đồng)']]),
        chk('lcDangTai', 'Xác nhận', req({ text: 'Đã kiểm tra dữ liệu trước khi đăng tải' }))] }),
      notes: () => ['Hoàn thành → 23 đăng tải qua Cổng đấu thầu → 24 đóng tổ chức LCNT, mở Hợp đồng (Tạo hợp đồng ở Chi tiết gói thầu).',
        '<b>GIẢ LẬP P-THAU-04</b>: thư chấp thuận HSDT và trao hợp đồng, thông tin chuyển giao theo tab Trao HĐ, TT Ký HĐ của hệ thống cũ (HT-THAU-CONV); BPMN-MS19 chưa có bước riêng. Thời hạn ký kết 05 ngày, bảo đảm thực hiện hợp đồng 3% là giá trị gợi ý.'],
      write: (v) => { const t = T().lcTrao(g0(), Object.assign({}, Flow.ui, v), v.lcNgayThu);
        return Object.assign(pick(v, ['lcDangTai', 'lcNgayThu', 'lcTgHoanThien', 'lcTgKyKet', 'lcBaoLanh', 'lcNgayBanGiao', 'lcDauMoi', 'lcTgGiaoHang', 'lcDkTt']), { lcHanKy: t.hanKy, lcHetHlHsdt: t.hetHl }); } },
  };
  window.EForms.MS19 = (tok) => F[tok.task] || null;

  const DOCS = [{ code: 'LC-HS', name: 'Hồ sơ mời thầu / hồ sơ yêu cầu', by: ['3.1', '7.1'] }, { code: 'LC-TM', name: 'Thư mời thương thảo kèm dự thảo hợp đồng', by: ['7.5'] }, { code: 'LC-XLTH', name: 'Tờ trình xử lý tình huống', by: ['3.4'] }, { code: 'LC-BCDG', name: 'Báo cáo đánh giá hồ sơ', by: ['3.5', '7.3', 4, 5, 6, 8, 9, 10, 11, 12] },
    { code: 'LC-BBTT', name: 'Biên bản thương thảo hợp đồng', by: ['3.6', '7.4'] }, { code: 'LC-BCKQ', name: 'Báo cáo kết quả lựa chọn nhà thầu', by: [13] },
    { code: 'LC-QD', name: 'Quyết định phê duyệt KQLCNT', by: [16] }, { code: 'LC-TCT', name: 'Thư chấp thuận hồ sơ dự thầu và trao hợp đồng', by: [22] },
    { code: 'LC-CG', name: 'Thông tin chuyển giao để ký hợp đồng', by: [22] }];
  const REQ = { 18: [['lcQdKyFile', 'Quyết định phê duyệt KQLCNT đã ký']] };
  const at = (n) => { const h = Flow.lastOf(n); return h ? Flow.dateOf(h.t) : null; };
  const atAny = (ns) => ns.map(at).filter(Boolean).pop() || null;
  /* Nhà thầu tham dự: theo dữ liệu nhà thầu của gói; gói chưa có thì 3 nhà cung cấp đầu danh mục (GIẢ LẬP). */
  /* T80 L5: đấu thầu rộng rãi / hạn chế chỉ 01 HSDT khi đóng thầu (Điều 36 khoản 5). */
  const motHs1 = () => ['DTRR', 'DTHC'].includes(g0().form) && bidders(g0()).length === 1;
  const bidders = (g) => (g.bidders && g.bidders.length ? g.bidders.map((b) => [b[0], b[1]]) : ['NCC-000001', 'NCC-000004', 'NCC-000009'].map((c, i) => [c, Math.round(g.price * (0.94 + i * 0.02) * 100) / 100]));

  function vars(tok) {
    const g = g0(), u = Flow.ui, k = T().khOf(g.kh) || {}, cat = kit().cat, ncc = (c) => { const r = D.nccOf(c); return r.name || r.short || c; };
    const mau = D.mauOf ? D.mauOf(u.lcMauHd || T().mauGoiY(g)) : null;
    /* T80 L1: gói tham chiếu (mua sắm trực tiếp) và nhà thầu được mời ở 7.5 — trúng gói tham chiếu, mời lại thì xếp hạng tiếp theo (Điều 15 khoản 3). */
    const rg = window.D.lcFirst7(g.form) !== '7.1' && ['MSTT', 'CDT_RG'].includes(g.form), refs = T().lcRefPkgs(), ref = T().lcRefOf(u.lcGoiTc || g.ref);
    const lan = Number(u.lcMoiTiep || 0), moiDef = ref ? ref.rank[Math.min(lan, ref.rank.length - 1)][0] : (u.lcNhaThauDk || (bidders(g)[0] || [])[0]);
    const nhaThauMoi = (lan && ref ? moiDef : u.lcNhaThauMoi) || moiDef;
    const soSanh = u.lcSoSanh || (g.items || []).map((i) => { const r = ref && ref.items.find((x) => x[0] === i[0]); return { hangMuc: i[0], dvt: i[1], klTruoc: r ? r[2] : null, klNay: i[2], dgTruoc: r ? r[3] : null, dgNay: r ? r[3] : null }; });
    const bs = bidders(g), dg = u.lcDanhGia || (rg ? [[nhaThauMoi, g.price]] : String(tok && tok.task).startsWith('7') || u.lcNhaThauDk ? [[u.lcNhaThauDk || bs[0][0], bs[0][1]]] : bs)
      .map(([c, gia]) => ({ ma: c, ten: ncc(c), gia: ty(gia), giaSo: gia, hopLe: 'Đạt', nangLuc: 'Đạt', kyThuat: 'Đạt', diemKt: null, suaLoi: 0, hieuChinh: 0, giamGia: 0, quyDoi: 0, hieuLuc: T().lcHs(g, u).hieuLuc, uuDai: false, ghiChu: '' }));
    /* T80 L2: nhà thầu đề nghị trúng thầu mặc định = xếp hạng thứ nhất, giá = giá sau sửa lỗi, hiệu chỉnh sai lệch, trừ giảm giá (Điều 33 khoản 1). */
    const pp = T().lcPpOf(g, u), tKt = u.lcTyTrongKt != null ? u.lcTyTrongKt : (g.type === 'TV' ? 80 : 20);
    const dat = T().lcXepHang(dg, pp, g.price, tKt).filter((r) => r.xepHang).sort((a, b) => a.xepHang - b.xepHang);
    const win = u.lcNhaThau || (dat[0] || {}).ma, td = k.level === 'TD';
    const lastBack = Flow.state.history.slice().reverse().find((h) => h.reason && ['3.2', '14', '21'].includes(String(h.task)) || (h.reason && String(h.task) === '19'));
    const kq = [{ muc: 'Nhà thầu đề nghị trúng thầu', giaTri: win ? ncc(win) : 'Chưa có' }, { muc: 'Giá đề nghị trúng thầu', giaTri: u.lcGiaTT != null ? ty(Number(u.lcGiaTT)) + ' tỷ đồng' : '-' },
      { muc: 'Loại hợp đồng', giaTri: cat('loai-hop-dong', g.contract) }, { muc: 'Thời gian thực hiện hợp đồng', giaTri: u.lcTgThHd || g.hdTime || g.execTime || '' },
      { muc: 'Mẫu hợp đồng', giaTri: mau ? `${mau.code} — ${mau.name}` : '-' }, { muc: 'Ngày biên bản thương thảo', giaTri: u.lcNgayTT || '-' }];
    const trinhTu = { 4: ['Lập/thẩm định/phê duyệt HSMT', 'Phát hành; nhận HSDT', 'Mở & đánh giá HSĐXKT', 'Phê duyệt DS đạt kỹ thuật', 'Mở & đánh giá HSĐXTC; thương thảo'],
      5: ['Lập/phê duyệt & công khai danh sách ngắn', 'Lập/thẩm định/phê duyệt HSMT', 'Phát hành cho danh sách ngắn', 'Nhận/mở/đánh giá HSDT', 'Thương thảo'],
      6: ['Lập/thẩm định/phê duyệt HSMCG', 'Đăng chào giá trên Cổng đấu thầu', 'Theo dõi nhà thầu chào giá', 'Nhận/xác nhận kết quả chào giá'],
      8: ['Lập & phê duyệt phương án đàm phán', 'Gửi thư mời hãng/nhà thầu', 'Tổ chức các phiên đàm phán', 'Lập Báo cáo kết quả đàm phán'],
      9: ['Lập/thẩm định/phê duyệt HSYC', 'Gửi HSYC; nhận HSĐX', 'Mở & đánh giá HSĐX', 'Thương thảo/hoàn thiện hợp đồng'],
      10: ['Giao đơn vị thành viên thực hiện', 'Nhận/đánh giá hồ sơ theo yêu cầu', 'Hoàn thiện điều kiện thực hiện'],
      11: ['Lập phương án tự thực hiện', 'Lập dự thảo thỏa thuận giao việc', 'Hoàn thiện phương án với đơn vị thực hiện'],
      12: ['Thực hiện đúng cách thức/trình tự đã duyệt trong KHLCNT', 'Theo dõi mốc theo cấu hình được duyệt'] }[tok && tok.task] || [];
    return Object.assign({}, u, {
      goi: { code: g.code, ten: g.name, gia: ty(g.price), hinhThuc: cat('hinh-thuc-lcnt', g.form), phuongThuc: cat('phuong-thuc-lcnt', g.method), kh: g.kh },
      thongTin: [{ muc: 'Loại gói thầu', giaTri: cat('loai-goi-thau', g.type) }, { muc: 'Hình thức / phương thức LCNT', giaTri: `${cat('hinh-thuc-lcnt', g.form)}, ${cat('phuong-thuc-lcnt', g.method)}` },
        { muc: 'Loại hợp đồng', giaTri: cat('loai-hop-dong', g.contract) }, { muc: 'Thời gian lựa chọn nhà thầu', giaTri: g.selTime || '' }, { muc: 'Thời gian thực hiện gói thầu', giaTri: g.execTime || '' }],
      nccRep: nccRows().map((r) => ({ ma: r.code, rep: r.rep || '-', position: r.rep ? r.position || '-' : '-' })),
      nccOptions: nccRows().map((r) => ({ label: `${r.code} — ${r.name || r.short}`, value: r.code })),
      mauOptions: (window.Catalog ? window.Catalog.rows('mau-hop-dong') : []).filter((r) => r.active !== false).map((r) => ({ label: `${r.code} — ${r.name} (${r.tt})`, value: r.code })),
      lcMauHd: u.lcMauHd || T().mauGoiY(g), lcTt: mau ? mau.tt : '-', lcPpDanhGia: u.lcPpDanhGia || 'Giá thấp nhất', lcBaoDam: u.lcBaoDam != null ? u.lcBaoDam : 1.5,
      lcNgayDong: u.lcNgayDong || '', lcYeuCau: u.lcYeuCau || ((g.items || []).map((i) => `${i[0]}: ${i[2]} ${i[1]}`).join('; ')), lcNhaThauDk: u.lcNhaThauDk || bs[0][0],
      nhaThauDk: ncc(u.lcNhaThauDk || bs[0][0]),
      hs: [{ muc: 'Loại hồ sơ', giaTri: hsKind() }, { muc: 'Phương pháp đánh giá', giaTri: u.lcPpDanhGia || 'Giá thấp nhất' }, { muc: 'Bảo đảm dự thầu', giaTri: `${u.lcBaoDam != null ? u.lcBaoDam : 1.5}% giá gói thầu` },
        { muc: 'Mẫu hợp đồng', giaTri: mau ? `${mau.code} — ${mau.name}` : '-' }, { muc: 'Phương thức thanh toán', giaTri: mau ? mau.tt : '-' }],
      lcTbmt: u.lcTbmt || `IB26${g.code.slice(-4)}-00`, lcNgayPh: u.lcNgayPh || Flow.dateOf(Flow.state.clock),
      hsdt: bs.map(([c, gia]) => ({ ma: c, ten: ncc(c), gia: ty(gia) })), lcNgayMo: u.lcNgayMo || Flow.dateOf(Flow.state.clock), lcNgayGui: u.lcNgayGui || Flow.dateOf(Flow.state.clock),
      lcDanhGia: dg, datOptions: dat.map((r) => ({ label: `${r.xepHang}. ${r.ma} — ${r.ten}`, value: r.ma })), lcNhaThau: win || '', lcGiaTT: u.lcGiaTT != null ? u.lcGiaTT : ((dat.find((r) => r.ma === win) || {}).giaSau || g.price),
      lcPpGia: pp, lcTyTrongKt: tKt, tyTrongTxt: pp === 'Kết hợp giữa kỹ thuật và giá' ? ` — tỷ trọng điểm kỹ thuật ${tKt}%, điểm giá ${100 - tKt}%` : '',
      lcNgayTT: u.lcNgayTT || Flow.dateOf(Flow.state.clock), kq, trinhTu: trinhTu.map((x) => '• ' + x).join('\n'),
      motHs: motHs1(), lcXlTh: '', lcLyDoGh: '', lcDongMoi: '', lcMoMoi: '', lcSoVbGh: '', lcSoTtrXlth: '', lcSoCvGh: '',
      giaHanTxt: (u.lcGiaHan || []).map((x) => `lần ${x.lan} đến ${x.dongMoi} (văn bản ${x.soVb})`).join('; '),
      toCg: T().lcTeam(g).map((r) => ({ ten: r.ten, to: r.to, viTri: r.viTri, phanCong: r.phanCong, chungChi: T().certTxt(r.cc) })),
      coUuDai: ['DTRR', 'DTHC'].includes(g.form), giaGoiSo: g.price,
      ...(() => { const h = T().lcHs(g, u); return { lcHieuLucHsdt: h.hieuLuc, lcHdTuongTu: h.hdTuongTu, lcSoNamDt: h.soNamDt, lcDtBinhQuan: h.dtBinhQuan, lcTangKl: h.tangKl, lcGiamKl: h.giamKl, lcTgSuDung: h.tgSuDung }; })(),
      /* T80 L3: biên bản thương thảo — dòng gợi ý từ mẫu hợp đồng, phạm vi / tiến độ của gói; thư trao hợp đồng và thông tin chuyển giao (Thau.lcTrao). */
      lcTgThHd: u.lcTgThHd || g.hdTime || g.execTime || '',
      lcBbTt: u.lcBbTt || [['Kết cấu hợp đồng', mau ? `Theo mẫu ${mau.code} — ${mau.name}` : 'Theo mẫu hợp đồng của hồ sơ mời'],
        ['Phạm vi cung cấp', u.lcYeuCau || (g.items || []).map((i) => `${i[0]}: ${i[2]} ${i[1]}`).join('; ')], ['Tiến độ thực hiện', u.lcTgThHd || g.execTime || ''],
        ['Điều kiện thanh toán', mau ? `Thanh toán theo tỷ lệ ${mau.tt}` : '']].map(([noiDung, thongNhat]) => ({ noiDung, yKien: '', thongNhat })),
      ...(() => { const t = T().lcTrao(g, u, Flow.dateOf(Flow.state.clock));
        return { traoNt: t.win ? ncc(t.win) : 'chưa xác định', giaTrungTxt: ty(t.gia), giaTrungSo: t.gia, lcNgayThu: t.ngayThu, lcTgHoanThien: t.hoanThien, lcTgKyKet: t.kyKet,
          lcBaoLanh: t.baoLanh, laTv: t.tv, lcNgayBanGiao: t.ngayBanGiao, hetHlTxt: t.hetHl || 'chưa xác định (gói không có thời điểm đóng thầu)', lcDauMoi: t.dauMoi,
          lcTgGiaoHang: t.tgGiaoHang, lcDkTt: t.dkTt, phanBoTt: t.phanBo.map((r) => ({ loai: r.loai, ma: r.ma, phanBo: ty(r.phanBo), trung: ty(r.trung) })) }; })(),
      goiForm: g.form, lcTtKq: u.lcTtKq || (g.form === 'MSTT' ? 'OK' : ''), lcMoiTiep: lan, lanMoi: lan + 1,
      refOptions: refs.map((r) => ({ label: `${r.code} — ${r.name} (${cat('hinh-thuc-lcnt', r.form)}, KQLCNT ${r.kq[1]})`, value: r.code })),
      lcGoiTc: u.lcGoiTc || g.ref || '', lcSoSanh: soSanh, lcGhiChuDk: u.lcGhiChuDk || '',
      refInfo: ref ? [{ muc: 'Gói thầu', giaTri: `${ref.code} — ${ref.name}` }, { muc: 'Hình thức lựa chọn nhà thầu', giaTri: cat('hinh-thuc-lcnt', ref.form) },
        { muc: 'Quyết định phê duyệt KQLCNT', giaTri: `${ref.kq[0]} ngày ${ref.kq[1]}` }, { muc: 'Xếp hạng nhà thầu', giaTri: ref.rank.map((r, i) => `${i + 1}. ${ncc(r[0])}`).join('; ') }] : [],
      lcNhaThauMoi: nhaThauMoi, lcNgayGuiTm: u.lcNgayGuiTm || Flow.dateOf(Flow.state.clock), lcGiamGia: u.lcGiamGia != null ? u.lcGiamGia : null,
      lcPhamVi: u.lcPhamVi || ((g.items || []).map((i) => `${i[0]}: ${i[2]} ${i[1]}`).join('; ') + (g.execTime ? `; thời gian thực hiện ${g.execTime}` : '')),
      nguoiKy: td ? 'Tổng Giám đốc Tập đoàn' : `${(D.personas.find((p) => p.id === 'tgd') || {}).name} — Tổng Giám đốc Tổng Công ty`,
      lyDoTra: lastBack ? lastBack.reason : '' });
  }
  function reqDocs(tok) { return (REQ[tok.task] || []).map(([key, name]) => ({ key, name, have: !!Flow.ui[key] })); }
  /* Kiểm tra phía BE (EVars.check): bảo đảm dự thầu ≤ 3% (Điều 27); có ít nhất một nhà thầu đạt mới thương thảo. */
  function check(tok, choice, vals) {
    if (!vals) return null;
    if (vals.lcBaoDam != null && Number(vals.lcBaoDam) > 3) return 'Bảo đảm dự thầu không vượt quá 3% giá gói thầu.';
    /* T80 L2: tỷ trọng điểm kỹ thuật (Điều 32 khoản 4 điểm b); nhà thầu không đạt phải có lý do (Điều 33 khoản 3); phương pháp có điểm thì nhà thầu đạt phải có điểm kỹ thuật. */
    if (vals.lcPpDanhGia === 'Kết hợp giữa kỹ thuật và giá' && vals.lcTyTrongKt != null) {
      const [lo, hi] = g0().type === 'TV' ? [70, 80] : [10, 30];
      if (Number(vals.lcTyTrongKt) < lo || Number(vals.lcTyTrongKt) > hi) return `Tỷ trọng điểm kỹ thuật của gói này phải từ ${lo}% đến ${hi}% (Điều 32 khoản 4 điểm b).`;
    }
    /* T80 L9: Điều 30 khoản 4 — hiệu lực HSDT tối đa 180 ngày. */
    if (vals.lcHieuLucHsdt != null && (Number(vals.lcHieuLucHsdt) <= 0 || Number(vals.lcHieuLucHsdt) > 180)) return 'Thời gian có hiệu lực của HSDT từ 1 đến 180 ngày kể từ ngày đóng thầu (Điều 30 khoản 4).';
    /* T80 L2b: Phụ lục 2 — hiệu lực HSDT ngắn hơn yêu cầu của HSMT thì HSDT không hợp lệ. */
    if (vals.lcDanhGia) {
      const yc = T().lcHs(g0(), Flow.ui).hieuLuc, ngan = vals.lcDanhGia.filter((r) => r.hopLe === 'Đạt' && r.hieuLuc != null && r.hieuLuc !== '' && Number(r.hieuLuc) < yc);
      if (ngan.length) return ngan.map((r) => `HSDT của ${r.ten} có hiệu lực ${r.hieuLuc} ngày`).join('; ') + `, ngắn hơn yêu cầu ${yc} ngày của hồ sơ mời — đánh giá Không đạt về tính hợp lệ (QC-12869 Phụ lục 2).`;
    }
    if (vals.lcDanhGia) {
      const g = g0(), pp = T().lcPpOf(g, Flow.ui), r = T().lcXepHang(vals.lcDanhGia, pp, g.price, Flow.ui.lcTyTrongKt);
      const noWhy = r.filter((x) => !x.dat && !String(x.ghiChu || '').trim()).map((x) => x.ten);
      if (noWhy.length) return 'Ghi lý do không đạt của nhà thầu: ' + noWhy.join(', ') + ' (Điều 33 khoản 3).';
      const noPt = ['Dựa trên kỹ thuật', 'Kết hợp giữa kỹ thuật và giá', 'Giá cố định'].includes(pp) ? r.filter((x) => x.dat && (x.diemKt == null || x.diemKt === '')).map((x) => x.ten) : [];
      if (noPt.length) return 'Nhập điểm kỹ thuật của nhà thầu: ' + noPt.join(', ') + '.';
      if (!r.some((x) => x.xepHang)) return 'Cần ít nhất một nhà thầu Đạt để chuyển thương thảo.';
    }
    /* T80 L6: Điều 2 khoản 27, 28 — thành viên Tổ chuyên gia (trừ chuyên gia chuyên ngành) và Tổ thẩm định phải có chứng chỉ đào tạo về đấu thầu. */
    if (String(tok.task) === '1') {
      const thieu = T().lcTeam(g0()).filter((r) => !r.cc.ok).map((r) => `${r.ten} (${r.to})`);
      if (thieu.length) return 'Thành viên chưa có chứng chỉ đào tạo về đấu thầu: ' + thieu.join(', ') + ' — cập nhật Quyết định thành lập Tổ (QC-12869 Điều 2 khoản 27, 28).';
    }
    /* T80 L5: Điều 36 khoản 5 điểm a — thời điểm đóng thầu mới cách tối thiểu 03 ngày làm việc; mở thầu không trước đóng thầu. */
    if (String(tok.task) === '3.4' && vals.lcXlTh === 'GIA_HAN') {
      const P = (s) => { const [d, m, y] = String(s || '').split('/').map(Number); return y ? new Date(y, m - 1, d) : null; };
      const now = P(Flow.dateOf(Flow.state.clock)), moi = P(vals.lcDongMoi), mo = P(vals.lcMoMoi);
      let nlv = 0; for (const x = new Date(now); moi && x < moi;) { x.setDate(x.getDate() + 1); if (x.getDay() % 6) nlv++; }
      if (!moi || nlv < 3) return 'Thời điểm đóng thầu mới phải cách thời điểm đóng thầu hiện tại tối thiểu 03 ngày làm việc (Điều 36 khoản 5 điểm a).';
      if (!mo || mo < moi) return 'Thời điểm mở thầu mới không được trước thời điểm đóng thầu mới.';
    }
    /* T80 L3: Điều 44 khoản 3 — bảo đảm thực hiện hợp đồng 2%–10% giá hợp đồng (gói tư vấn không yêu cầu — khoản 1); đầu mối đơn vị sử dụng và nhà thầu bắt buộc để bàn giao. */
    if (String(tok.task) === '22') {
      if (g0().type !== 'TV' && vals.lcBaoLanh != null && (Number(vals.lcBaoLanh) < 2 || Number(vals.lcBaoLanh) > 10)) return 'Giá trị bảo đảm thực hiện hợp đồng từ 2% đến 10% giá hợp đồng (Điều 44 khoản 3).';
      if ([vals.lcTgHoanThien, vals.lcTgKyKet].some((x) => x != null && Number(x) <= 0)) return 'Thời hạn hoàn thiện, ký kết hợp đồng phải lớn hơn 0 ngày.';
      const thieu = (vals.lcDauMoi || []).slice(0, 2).filter((r) => !String(r.ten || '').trim()).map((r) => r.vaiTro);
      if (thieu.length) return 'Nhập họ và tên: ' + thieu.join(', ') + ' (thông tin chuyển giao để ký hợp đồng).';
    }
    /* T80 L1: Điều 15 khoản 2 — đủ 4 điều kiện mới chuyển gửi thư mời; Điều 15 khoản 3 — hết nhà thầu trong danh sách xếp hạng thì không mời tiếp. */
    if (String(tok.task) === '7.6') {
      const bad = T().lcCheck15(vals.lcGoiTc, vals.lcSoSanh, Flow.dateOf(Flow.state.clock)).filter((r) => r.kq !== 'Đạt');
      if (bad.length) return 'Không đủ điều kiện mua sắm trực tiếp (Điều 15 khoản 2): ' + bad.map((r) => r.dk.replace(/^\w\) /, '')).join('; ') + '. Cần điều chỉnh KHLCNT sang hình thức khác.';
    }
    if (String(tok.task) === '7.4' && vals.lcTtKq === 'KHONG') {
      const ref = T().lcRefOf(Flow.ui.lcGoiTc || g0().ref);
      if (!ref || Number(Flow.ui.lcMoiTiep || 0) + 1 >= ref.rank.length) return 'Gói tham chiếu không còn nhà thầu xếp hạng tiếp theo để mời thương thảo.';
    }
    return null;
  }
  const files = () => {
    const u = Flow.ui, no = (Flow.state.parent || '').replace('GT-', ''), rows = [];
    if (u.lcQdKyFile) rows.push({ name: `Quyet-dinh-KQLCNT-da-ky-${no}.pdf`, at: at(18) || Flow.dateOf(Flow.state.clock) });
    if (at(17)) rows.push({ name: `Quyet-dinh-KQLCNT-da-ky-VOffice-${no}.pdf`, at: at(17) });
    (u.uploads || []).forEach((f, i) => rows.push({ name: f.name, at: f.at, up: i }));
    return rows;
  };
  const outs = () => DOCS.filter((d) => atAny(d.by)).map((d) => ({ code: d.code, name: `${d.code} ${d.name}`, at: atAny(d.by) }));
  function doc(code) {
    const d = DOCS.find((x) => x.code === code);
    if (!d) return null;
    const v = vars(null), esc = window.UI.esc;
    const rows = (list) => list.map((r) => `<p><b>${esc(r.muc)}:</b> ${esc(r.giaTri)}</p>`).join('');
    const body = { 'LC-HS': rows(v.hs) + `<p><b>Yêu cầu kỹ thuật:</b> ${esc(v.lcYeuCau)}</p>`,
      'LC-TM': `<p>Kính gửi: ${esc((window.D.nccOf(v.lcNhaThauMoi) || {}).name || v.lcNhaThauMoi)}.</p><p>Mời Quý công ty thương thảo, hoàn thiện hợp đồng gói thầu ${esc(v.goi.ten)}.</p>`
        + `<p><b>Phạm vi, yêu cầu kỹ thuật, tiến độ:</b> ${esc(v.lcPhamVi)}</p><p><b>Dự thảo hợp đồng:</b> theo mẫu ${esc(v.lcMauHd)} (kèm theo).</p>`,
      'LC-XLTH': (() => { const x = (Flow.ui.lcGiaHan || []).slice(-1)[0];
        return `<p>Kính gửi: Chủ đầu tư.</p><p>Tại thời điểm đóng thầu gói thầu ${esc(v.goi.ten)} chỉ có 01 nhà thầu nộp hồ sơ dự thầu. Căn cứ Điều 36 khoản 5 Quy chế lựa chọn nhà thầu, Tổ chuyên gia đề xuất `
          + (x ? `gia hạn thời điểm đóng thầu đến ${esc(x.dongMoi)}, thời điểm mở thầu ${esc(x.moMoi)}.</p><p><b>Lý do:</b> ${esc(x.lyDo)}</p>` : 'cách xử lý theo nội dung đã chọn tại bước đóng thầu, mở hồ sơ dự thầu.</p>'); })(),
      'LC-BCDG': `<p><b>Phương pháp đánh giá:</b> ${esc(v.lcPpGia)}.</p>` + T().lcXepHang(v.lcDanhGia, v.lcPpGia, g0().price, v.lcTyTrongKt).map((r) => `<p>${esc(r.ten)}: hợp lệ ${esc(r.hopLe)}, năng lực ${esc(r.nangLuc || 'Đạt')}, kỹ thuật ${esc(r.kyThuat)}`
        + ` — giá dự thầu ${esc(r.gia)} tỷ đồng, sau sửa lỗi, hiệu chỉnh sai lệch, trừ giảm giá ${esc(ty(r.giaSau))} tỷ đồng — ${r.xepHang ? 'xếp hạng ' + r.xepHang : 'không đạt' + (r.ghiChu ? ': ' + esc(r.ghiChu) : '')}.</p>`).join(''),
      'LC-BBTT': `<p>Thương thảo với ${esc((v.kq[0] || {}).giaTri)} ngày ${esc(v.lcNgayTT)}.</p>`
        + (() => { const r = v.lcDaiDienNt ? { lcDaiDienNt: v.lcDaiDienNt, lcChucVuNt: v.lcChucVuNt } : repOf(v.lcNhaThau);
          return `<p><b>Đại diện nhà thầu:</b> ${r.lcDaiDienNt ? `Ông/bà ${esc(r.lcDaiDienNt)}${r.lcChucVuNt ? ' — Chức vụ: ' + esc(r.lcChucVuNt) : ''}` : 'chưa khai báo ở danh mục Nhà cung cấp'}.</p>`; })()
        + `<table class="vtable"><thead><tr><th>TT</th><th>Nội dung thương thảo</th><th>Ý kiến nhà thầu</th><th>Nội dung hai bên thống nhất đưa vào hợp đồng</th></tr></thead><tbody>`
        + (v.lcBbTt || []).map((r, i) => `<tr><td>${i + 1}</td><td>${esc(r.noiDung)}</td><td>${esc(r.yKien || '')}</td><td>${esc(r.thongNhat)}</td></tr>`).join('') + '</tbody></table>'
        + `<p><b>Giá trúng thầu:</b> ${esc(ty(Number(v.lcGiaTT)))} tỷ đồng. <b>Thời gian thực hiện hợp đồng:</b> ${esc(v.lcTgThHd)}.</p>${v.lcNoiDungTT ? `<p>${esc(v.lcNoiDungTT)}</p>` : ''}`,
      'LC-TCT': `<p>Kính gửi: ${esc(v.traoNt)}.</p><p>Chủ đầu tư chấp thuận hồ sơ dự thầu và trao hợp đồng gói thầu ${esc(v.goi.ten)} với giá trúng thầu ${esc(v.giaTrungTxt)} tỷ đồng.</p>`
        + `<p>Đề nghị Quý công ty hoàn thiện hợp đồng trong ${esc(v.lcTgHoanThien)} ngày và ký kết hợp đồng trong ${esc(v.lcTgKyKet)} ngày kể từ ngày ${esc(v.lcNgayThu)} (hạn cuối ${esc(Flow.ui.lcHanKy || '')}).</p>`
        + (v.laTv ? '' : `<p>Bảo đảm thực hiện hợp đồng: ${esc(v.lcBaoLanh)}% giá hợp đồng.</p>`),
      'LC-CG': `<p><b>Nhà thầu trúng thầu:</b> ${esc(v.traoNt)} · <b>Ngày bàn giao:</b> ${esc(v.lcNgayBanGiao)} · <b>Ký hợp đồng trước ngày:</b> ${esc(Flow.ui.lcHanKy || '')} · <b>Ngày hết hiệu lực HSDT:</b> ${esc(v.hetHlTxt)}</p>`
        + (v.lcDauMoi || []).map((r) => `<p>${esc(r.vaiTro)}: ${esc(r.ten || '-')}${r.lienHe ? ' — ' + esc(r.lienHe) : ''}</p>`).join('')
        + `<p><b>Thời gian giao hàng:</b> ${esc(v.lcTgGiaoHang)} · <b>Điều kiện thanh toán:</b> ${esc(v.lcDkTt)}</p>`
        + v.phanBoTt.map((r) => `<p>${esc(r.loai)} ${esc(r.ma)}: ${esc(r.trung)} tỷ đồng</p>`).join(''),
      'LC-BCKQ': rows(v.kq), 'LC-QD': `<p><b>QUYẾT ĐỊNH</b> phê duyệt kết quả lựa chọn nhà thầu gói thầu ${esc(v.goi.ten)}.</p>${rows(v.kq)}<p>Người ký: ${esc(v.nguoiKy)}.</p>` }[code];
    return { name: d.name, html: `<div class="doc paper"><p class="c"><b>${esc(d.name.toUpperCase())}</b><br>${esc(v.goi.ten || '')}</p>${body}</div>` };
  }
  window.EForms.hdBy.MS19 = { vars, reqDocs, files, outs, doc, version: () => 1 + Flow.doneCount(15), docs: DOCS, check };
})();
