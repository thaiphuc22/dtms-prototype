/*
 * eForm của các user task MS18 Lập và phê duyệt KHLCNT (T67 T2, D-118; plan docs/dtms/prototype-T67-thau-hop-dong.md §3 T2).
 * Nguồn: BPMN-MS18-TOBE (trang MS18 của BPMN-DTMS-1611), THAU-TT-1311 §3, biểu mẫu BM-KHLCNT (BM01 / BM02 / BM03 cấp VHT và Tập đoàn,
 * Bản cam kết, Phiếu trình GQCV). Trường của form đặt theo trường trộn của biểu mẫu (vd khCoSo ↔ <co_so_phan_chia_goi_thau>).
 * Hồ sơ con của KHLCNT (đối tượng cha): dữ liệu đọc từ KHLCNT và gói thầu (thau.js). Tài liệu nằm ở Danh sách tài liệu (loại 4).
 * Ngoài eForm: EForms.hdBy.MS18 = biến, kiểm tra, văn bản đầu ra, tài liệu — EForms.hd chọn theo quy trình của hồ sơ đang nạp (ms22.js).
 */
(function () {
  const B = window.EForms.b;
  const { txt, banner, tbl, ta, tf, sel, rad, chk, req, dl, dlAdd, opts, dt } = B;
  const Flow = window.Flow, D = window.D;
  const pick = (vals, keys) => keys.reduce((o, k) => { if (vals[k] !== undefined) o[k] = vals[k]; return o; }, {});
  const T = () => window.Thau;
  const kc = () => T().khCase(Flow.state.parent) || {};
  const isTd = () => Flow.state.vars.level === 'TD';
  const pname = (id) => (D.personas.find((p) => p.id === id) || {}).name || id;

  /* Tiêu chí BM02 dùng chung với tab TĐ KHLCNT (D.khCrit, data.js). */
  const CRIT_VHT = D.khCrit.VHT, CRIT_TD = D.khCrit.TD;
  const [OK_VHT, NOK_VHT] = D.khCrit.ok.VHT, [OK_TD, NOK_TD] = D.khCrit.ok.TD;
  /* Giải trình nội dung KHLCNT: BM01 VHT mục V.2 a)–i); BM01 Tập đoàn mục III a–g (gộp hình thức + phương thức, thời gian thực hiện hợp đồng). */
  const GT_VHT = [['khCoSo', 'a) Cơ sở phân chia các gói thầu'], ['khGtGia', 'b) Giá gói thầu'], ['khGtVon', 'c) Nguồn vốn'], ['khGtHinhThuc', 'd) Hình thức lựa chọn nhà thầu'],
    ['khGtPhuongThuc', 'đ) Phương thức lựa chọn nhà thầu'], ['khGtThoiGianLcnt', 'e) Thời gian lựa chọn nhà thầu'], ['khGtBatDau', 'g) Thời gian bắt đầu tổ chức lựa chọn nhà thầu'],
    ['khGtLoaiHd', 'h) Loại hợp đồng'], ['khGtThoiGianTh', 'i) Thời gian thực hiện gói thầu']];
  const GT_TD = [['khCoSo', 'a. Cơ sở phân chia các gói thầu'], ['khGtGia', 'b. Giá gói thầu'], ['khGtVon', 'c. Nguồn vốn'], ['khGtHinhThuc', 'd. Hình thức và phương thức lựa chọn nhà thầu'],
    ['khGtBatDau', 'e. Thời gian bắt đầu tổ chức lựa chọn nhà thầu'], ['khGtLoaiHd', 'f. Loại hợp đồng'], ['khGtThoiGianTh', 'g. Thời gian thực hiện hợp đồng']];

  const head = () => txt('**{{kh.code}}** — {{kh.ten}} · cấp phê duyệt **{{kh.cap}}** · {{kh.soGoi}} gói thầu, tổng giá **{{kh.tong}} tỷ đồng**');
  const goiTbl = () => tbl('Gói thầu thuộc KHLCNT', 'goi', [['so', 'Số gói thầu'], ['ten', 'Tên gói thầu'], ['gia', 'Giá gói thầu (tỷ đồng)'], ['hinhThuc', 'Hình thức LCNT'],
    ['phuongThuc', 'Phương thức LCNT'], ['loaiHd', 'Loại hợp đồng'], ['batDau', 'Thời gian bắt đầu LCNT'], ['thucHien', 'Thời gian thực hiện gói thầu']]);
  const back = (label) => banner(`${label}: {{lyDoTra}}`, '=lyDoTra = ""', 'info');
  const ky = (bm) => ({ schema: () => ({ components: [head(),
    txt(`Dự thảo **${bm}** do hệ thống sinh từ dữ liệu KHLCNT, Tờ trình và ${isTd() ? 'Báo cáo thẩm định, Phiếu trình GQCV' : 'Báo cáo kiểm tra'}. Người ký: **{{nguoiKy}}**.`),
    goiTbl(), ta('khQdGhiChu', 'Ghi chú rà soát dự thảo')] }),
  notes: () => ['Chọn phương thức ký bằng nút: Trình ký VOffice (bước 16–17, VOffice callback) hoặc Trình ký cứng (bước 20, tải bằng chứng ký). <b>Giả lập P-230</b>: người chọn, người ký theo cấp phê duyệt.'],
  outputs: () => ['KH-BM03'], write: (v) => pick(v, ['khQdGhiChu']) });

  const F = {
    3: { id: 'dtms-ms18-t03-tao-goi',
      schema: () => ({ components: [head(), txt('Hạng mục lấy từ hồ sơ nguồn **{{kh.nguon}}** — giá trị được duyệt **{{kh.duyet}} tỷ đồng**. Phân bổ vào một hoặc nhiều gói.'),
        dl('khGoi', 'Gói thầu', [txt('**{{this.so}}** — {{this.ten}}', 10), tf('gia', 'Giá gói thầu (tỷ đồng)', req({ layout: { columns: 6 } }))])] }),
      notes: () => ['Gói thầu là bảng lặp eForm (dynamiclist); hạng mục và giá trị được duyệt đọc từ hồ sơ nguồn (S4). Thêm, tách gói trên hệ thống thật dùng dòng thêm của bảng lặp.'],
      write: (v) => pick(v, ['khGoi']) },
    4: { id: 'dtms-ms18-t04-thong-tin-goi',
      schema: () => ({ components: [head(), goiTbl(),
        banner('Tổng giá các phần công việc {{kh.tongPhan}} tỷ đồng lệch giá trị được duyệt {{kh.duyet}} tỷ đồng.', '=kh.khop'),
        chk('khDaKiemTra', 'Xác nhận', req({ text: 'Đã kiểm tra giá, nguồn vốn, hình thức / phương thức LCNT, loại hợp đồng, thời gian của từng gói' }))] }),
      notes: () => ['Hệ thống kiểm tra tổng phân bổ và thông tin bắt buộc của gói (THAU-TT-1311 §3.1 bước 4); lệch giá trị được duyệt là cảnh báo, không chặn.'],
      write: (v) => pick(v, ['khDaKiemTra']) },
    5: { id: 'dtms-ms18-t05-to-trinh', outputs: () => ['KH-BM01'],
      schema: () => ({ components: [head(), txt('Biểu mẫu **{{bm01}}**. Số liệu bảng phần công việc, danh mục mua sắm hệ thống tự điền; người soạn bổ sung phần giải trình.'),
        ...(isTd() ? GT_TD : GT_VHT).map(([k, l]) => ta(k, l, req()))] }),
      notes: () => ['Ô giải trình theo trường trộn của BM01 (vd <code>co_so_phan_chia_goi_thau</code>, <code>giai_trinh_gia_goi_thau</code>); cấp VHT mục V.2 a)–i), cấp Tập đoàn mục III a–g. Giá trị gợi ý từ dữ liệu gói.'],
      write: (v) => pick(v, GT_VHT.map((x) => x[0])) },
    6: { id: 'dtms-ms18-t06-to-tham-dinh',
      schema: () => ({ components: [head(),
        dlAdd('khTtd', 'Thành viên Tổ thẩm định', [sel('nguoi', 'Họ và tên', req({ valuesKey: 'nguoiOptions', searchable: true, layout: { columns: 6 }, description: 'Phải có chứng chỉ đào tạo về đấu thầu (QC-12869 Điều 2 khoản 28)' })),
          sel('vaiTro', 'Vai trò trong Tổ thẩm định', req({ values: opts(['Tổ trưởng', 'Thành viên']), layout: { columns: 4 } })),
          tf('phanCong', 'Phân công công việc', req({ layout: { columns: 6 } }))])] }),
      notes: () => ['Hoàn thành → bước 7 (hệ thống) tạo việc Xác nhận cam kết cho từng thành viên (multi-instance trên danh sách này). Danh sách là Phụ lục vai trò và phân công của BM01 / BM03.'],
      write: (v) => pick(v, ['khTtd']) },
    8: { id: 'dtms-ms18-t08-cam-ket', q: ['P-231'],
      schema: () => ({ components: [txt('Thành viên tham gia thẩm định **{{kh.ten}}** thuộc **{{kh.nguon}}** — **{{toi.ten}}**, {{toi.vaiTro}}.'),
        tf('diaChi', 'Địa chỉ', req()), tf('soCccd', 'Số CCCD', req({ layout: { columns: 6 } })), dt('ngayCap', 'Ngày cấp', req({ layout: { columns: 5 } })),
        tf('noiCap', 'Nơi cấp', req({ layout: { columns: 5 } })),
        txt('Tôi cam kết có đủ năng lực, kinh nghiệm thẩm định gói thầu; thẩm định trung thực, khách quan, công bằng, không chịu ràng buộc về lợi ích với các bên; chịu trách nhiệm theo Điều 66 Quy định mua sắm thường xuyên số 1340/QĐ-CNVTQĐ.'),
        chk('camKet', 'Cam kết', req({ text: 'Tôi đồng ý các nội dung cam kết trên' }))] }),
      notes: () => ['Mỗi thành viên một việc (bước 7 tạo theo danh sách bước 6). Trường theo Bản cam kết (<code>ho_va_ten</code>, <code>dia_chi</code>, <code>so_cccd</code>, <code>ngay_cap_cccd</code>, <code>noi_cap_cccd</code>). <b>Giả lập P-231</b>: điền sẵn từ hồ sơ nhân sự, người cam kết sửa được.'],
      outputs: () => ['KH-CK'],
      write: (v, tok) => ({ khCamKet: Object.assign({}, Flow.ui.khCamKet, { [tok.who]: Object.assign(pick(v, ['diaChi', 'soCccd', 'ngayCap', 'noiCap', 'camKet']), { at: Flow.dateOf(Flow.state.clock) }) }) }) },
    9: { id: 'dtms-ms18-t09-chinh-sua', q: ['P-232'], outputs: () => ['KH-BM01'],
      schema: () => ({ components: [head(), back('Nội dung yêu cầu chỉnh sửa'), ta('khNoiDungSua', 'Nội dung đã chỉnh sửa', req())] }),
      notes: () => ['Vào bước này khi kiểm tra (10) / thẩm định (12) không đạt, hoặc người ký từ chối (19). Gửi lại → bước 5 theo mũi tên BPMN; <b>Giả lập P-232</b>: đi lại 6–8 (chọn và cam kết Tổ thẩm định).'],
      write: (v) => pick(v, ['khNoiDungSua']) },
    10: { id: 'dtms-ms18-t10-kiem-tra', outputs: () => ['KH-BM02'],
      decide: { btn: 'Kết quả kiểm tra', yes: OK_VHT, no: 'Không đáp ứng — trả sửa', reasonKey: 'khNhanXet' },
      schema: () => ({ components: [head(), goiTbl(),
        dl('khKiemTra', 'Tổng hợp kết quả kiểm tra (BM02 — Báo cáo kiểm tra)', [txt('**{{this.nhom}}**\n{{this.tieuChi}}', 8),
          rad('kq', 'Kết quả', req({ values: opts([OK_VHT, NOK_VHT]), layout: { columns: 8 } })),
          ta('nhanXet', 'Nội dung không đáp ứng', req({ conditional: { hide: `=this.kq != "${NOK_VHT}"` } }))]),
        ta('khNhanXet', 'Nhận xét và kiến nghị')] }),
      notes: () => ['Checklist 16 tiêu chí theo BM02 cấp VHT (Báo cáo kiểm tra do Trung tâm Mua sắm lập, Giám đốc ký, không có ô Số). Kết quả là bảng lặp eForm, không mặc định Đáp ứng như văn bản hệ thống cũ.'],
      write: (v) => pick(v, ['khKiemTra', 'khNhanXet']) },
    11: Object.assign({ id: 'dtms-ms18-t11-du-thao-qd', q: ['P-230'] }, ky('BM03 cấp VHT — Quyết định phê duyệt KHLCNT')),
    12: { id: 'dtms-ms18-t12-tham-dinh', outputs: () => ['KH-BM02'],
      decide: { btn: 'Kết quả thẩm định', yes: 'Đạt', no: 'Không đạt — trả sửa', reasonKey: 'khNhanXet' },
      schema: () => ({ components: [head(), goiTbl(),
        dl('khThamDinh', 'Bảng số 2 — Tổng hợp kết quả thẩm định nội dung KHLCNT (BM02 — Báo cáo thẩm định)', [txt('**{{this.tieuChi}}**', 6),
          rad('kq', 'Kết quả thẩm định', req({ values: opts([OK_TD, NOK_TD]), layout: { columns: 10 } })), ta('nhanXet', 'Ý kiến thẩm định', req())]),
        ta('khNhanXet', 'Nhận xét và kiến nghị của Tổ thẩm định')] }),
      notes: () => ['Theo BM02 cấp Tập đoàn: Tổ thẩm định lập, có Số; 7 nội dung kèm ý kiến từng mục (<code>nhan_xet_ten_goi_thau</code>, <code>nhan_xet_gia_goi_thau</code>…).'],
      write: (v) => pick(v, ['khThamDinh', 'khNhanXet']) },
    13: { id: 'dtms-ms18-t13-y-kien-ban-dtxd', q: ['P-233'],
      schema: () => ({ components: [head(), txt('Ban ĐTXD Tập đoàn không có tài khoản trên hệ thống; Trung tâm Mua sắm ghi nhận Phiếu nhận xét.'),
        tf('khPnxSo', 'Số Phiếu nhận xét', req({ layout: { columns: 8 } })), dt('khPnxNgay', 'Ngày Phiếu nhận xét', req({ layout: { columns: 8 } })),
        dlAdd('khYKien', 'Ý kiến cần VHT xử lý', [ta('noiDung', 'Nội dung ý kiến', req())])] }),
      notes: () => ['Trường theo Phiếu trình GQCV (<code>so_pnx_khlcnt</code>, <code>ngay_pnx_khlcnt_short</code>). Phiếu nhận xét tải lên ở Danh sách tài liệu (bắt buộc). <b>Giả lập P-233</b>.'],
      write: (v) => pick(v, ['khPnxSo', 'khPnxNgay', 'khYKien']) },
    14: { id: 'dtms-ms18-t14-giai-trinh', outputs: () => ['KH-PTR'],
      schema: () => ({ components: [head(),
        dl('khYKien', 'Ý kiến Ban ĐTXD và giải trình của VHT', [txt('**Ý kiến:** {{this.noiDung}}', 16), ta('giaiTrinh', 'Giải trình của VHT', req())]),
        ta('khMucDich', 'Mục đích', req()), ta('khLyDoHinhThuc', 'Lý do lựa chọn hình thức đấu thầu', req())] }),
      notes: () => ['Phiếu trình GQCV theo số gói: một gói → mẫu một gói (<code>so_goi_thau</code>, <code>gia_goi_thau</code>…), nhiều gói → mẫu nhiều gói (<code>bang_ptr_khlcnt</code>). Hệ thống chọn mẫu, không cần người dùng chọn.'],
      write: (v) => pick(v, ['khYKien', 'khMucDich', 'khLyDoHinhThuc']) },
    15: Object.assign({ id: 'dtms-ms18-t15-du-thao-qd', q: ['P-230'] }, ky('BM03 cấp Tập đoàn — Quyết định phê duyệt KHLCNT')),
    19: { id: 'dtms-ms18-t19-tu-choi',
      schema: () => ({ components: [head(), back('Ý kiến từ chối của người ký'), ta('khChuyenSua', 'Nội dung cần chỉnh sửa', req())] }),
      notes: () => ['Người ký từ chối (VOffice trả kết quả) → trả đúng người lập sửa hồ sơ; BPMN: 19 → 9 → 5.'], write: (v) => pick(v, ['khChuyenSua']) },
    20: { id: 'dtms-ms18-t20-ky-cung', q: ['P-230'],
      schema: () => ({ components: [head(), tf('khQdSo', 'Số Quyết định', req({ layout: { columns: 8 } })), dt('khQdNgay', 'Ngày ký', req({ layout: { columns: 8 } })),
        txt('Bản Quyết định đã ký tải lên ở Danh sách tài liệu.')] }),
      notes: () => ['Ký ngoài hệ thống: tải bằng chứng ký và xác nhận kết quả → cổng "Có kết quả ký hợp lệ?".'], write: (v) => pick(v, ['khQdSo', 'khQdNgay']) },
    21: { id: 'dtms-ms18-t21-xac-nhan-dang-tai',
      schema: () => ({ components: [head(), tbl('Thông tin đăng tải KHLCNT', 'dangTai', [['muc', 'Thông tin'], ['giaTri', 'Giá trị']]),
        chk('khDangTai', 'Xác nhận', req({ text: 'Đã kiểm tra dữ liệu trước khi đăng tải' }))] }),
      notes: () => ['Hoàn thành → bước 22 tích hợp Cổng đấu thầu (Theo luật: mạng đấu thầu quốc gia, P-83) → bước 23 KHLCNT Hoàn thành, mở các gói cho tổ chức LCNT.'],
      write: (v) => pick(v, ['khDangTai']) },
  };
  window.EForms.MS18 = (tok) => F[tok.task] || null;

  /* Văn bản đầu ra: mã tạm theo biểu mẫu BM-KHLCNT; by = bước sinh văn bản (mảng: một trong các bước). */
  const DOCS = [{ code: 'KH-BM01', name: 'Tờ trình KHLCNT (BM01)', by: [5] }, { code: 'KH-CK', name: 'Bản cam kết thành viên Tổ thẩm định', by: [8] },
    { code: 'KH-BM02', name: 'Báo cáo kiểm tra / thẩm định KHLCNT (BM02)', by: [10, 12] }, { code: 'KH-PTR', name: 'Phiếu trình giải quyết công việc', by: [14] },
    { code: 'KH-BM03', name: 'Quyết định phê duyệt KHLCNT (BM03)', by: [11, 15] }];
  const REQ = { 13: [['khPnxFile', 'Phiếu nhận xét của Ban ĐTXD Tập đoàn']], 20: [['khQdKyFile', 'Quyết định phê duyệt KHLCNT đã ký']] };
  const at = (n) => { const h = Flow.lastOf(n); return h ? Flow.dateOf(h.t) : null; };
  const atAny = (ns) => ns.map(at).filter(Boolean).pop() || null;
  const version = () => 1 + Flow.doneCount(9);
  const pkgs = () => (kc().kh ? T().pkgsOf(kc().kh) : []);
  const ty = (v) => window.UI.ty(v, 2);

  function vars(tok) {
    const c = kc(), k = c.kh || {}, u = Flow.ui, s = k.src ? T().srcInfo(k.src[0], k.src[1]) || {} : {}, kit = T().kit, gs = pkgs(), td = isTd();
    const tong = Math.round(gs.reduce((a, g) => a + g.price, 0) * 100) / 100, t = k.code ? T().totals(k) : {};
    const perG = (fn) => gs.map((g) => `${g.code}: ${fn(g)}`).join('; ');
    const gt = { khCoSo: k.basis || '', khGtGia: perG((g) => `${ty(g.price)} tỷ đồng — ${g.priceBasis || ''}`), khGtVon: kit.cat('nguon-von', s.fund),
      khGtHinhThuc: perG((g) => kit.cat('hinh-thuc-lcnt', g.form) + (td ? ', ' + kit.cat('phuong-thuc-lcnt', g.method) : '')), khGtPhuongThuc: perG((g) => kit.cat('phuong-thuc-lcnt', g.method)),
      khGtThoiGianLcnt: perG((g) => g.selTime), khGtBatDau: perG((g) => g.start), khGtLoaiHd: perG((g) => kit.cat('loai-hop-dong', g.contract)), khGtThoiGianTh: perG((g) => g.execTime) };
    const team = u.khTtd || D.khTeam0.map(([nguoi, vaiTro, phanCong]) => ({ nguoi, vaiTro, phanCong }));
    const me = team.find((r) => r.nguoi === (tok && tok.who)) || {};
    const ck = (u.khCamKet || {})[tok && tok.who] || {};
    const lastBack = Flow.state.history.slice().reverse().find((h) => h.reason && ['10', '12', '19'].includes(String(h.task)));
    return Object.assign({}, gt, u, {
      kh: { code: Flow.state.parent, ten: k.title, cap: c.levelText, soGoi: gs.length, tong: ty(tong), nguon: k.src ? `${k.src[1]} — ${s.title || ''}` : '', duyet: s.value != null ? ty(s.value) : '-',
        tongPhan: ty(t.all), khop: t.diff == null || t.diff === 0 },
      goi: gs.map((g) => ({ so: g.code, ten: g.name, gia: ty(g.price), hinhThuc: kit.cat('hinh-thuc-lcnt', g.form), phuongThuc: kit.cat('phuong-thuc-lcnt', g.method),
        loaiHd: kit.cat('loai-hop-dong', g.contract), batDau: g.start, thucHien: g.execTime })),
      khGoi: u.khGoi || gs.map((g) => ({ so: g.code, ten: g.name, gia: String(g.price) })),
      bm01: td ? 'BM01 cấp Tập đoàn — Tờ trình xin phê duyệt KHLCNT gửi TGĐ Tập đoàn' : 'BM01 cấp VHT — Tờ trình KHLCNT của Phòng Đầu tư – TTMS gửi TGĐ Tổng Công ty',
      khTtd: team, nguoiOptions: D.personas.filter((p) => !p.all && !p.simulated).map((p) => ({ label: `${p.name} — ${p.role}`, value: p.id })),
      toi: { ten: pname(tok && tok.who), vaiTro: me.vaiTro || 'Thành viên' },
      diaChi: ck.diaChi || 'Hà Nội', soCccd: ck.soCccd || '0010' + String(8 + ((tok && tok.who) || '').length).padStart(2, '0') + '0012345', ngayCap: ck.ngayCap || '12/05/2021', noiCap: ck.noiCap || 'Cục Cảnh sát QLHC về TTXH',
      khKiemTra: u.khKiemTra || CRIT_VHT.flatMap(([nhom, list]) => list.map((tieuChi) => ({ nhom, tieuChi, kq: OK_VHT, nhanXet: '' }))),
      khThamDinh: u.khThamDinh || CRIT_TD.map((tieuChi) => ({ tieuChi, kq: OK_TD, nhanXet: 'Phù hợp với đề xuất mua sắm được duyệt.' })),
      khYKien: u.khYKien || [{ noiDung: 'Làm rõ cơ sở xác định giá gói thầu bản quyền phần mềm (giá niêm yết của hãng).', giaiTrinh: '' },
        { noiDung: 'Bổ sung văn bản chấp thuận chủ trương áp dụng trường hợp đặc biệt.', giaiTrinh: '' }],
      khPnxSo: u.khPnxSo || '', khMucDich: u.khMucDich || `Phê duyệt KHLCNT ${k.title || ''} làm cơ sở tổ chức lựa chọn nhà thầu các gói thầu.`,
      khLyDoHinhThuc: u.khLyDoHinhThuc || gt.khGtHinhThuc,
      nguoiKy: td ? 'Tổng Giám đốc Tập đoàn' : `${pname('tgd')} — Tổng Giám đốc Tổng Công ty`,
      lyDoTra: lastBack ? lastBack.reason : '',
      dangTai: [{ muc: 'Hệ thống đăng tải', giaTri: k.law ? 'Hệ thống mạng đấu thầu quốc gia' : 'Cổng đấu thầu Viettel' }, { muc: 'Số Quyết định', giaTri: u.khQdSo || 'Theo kết quả ký VOffice' },
        { muc: 'Số gói thầu', giaTri: String(gs.length) }, { muc: 'Tổng giá gói thầu', giaTri: ty(tong) + ' tỷ đồng' }] });
  }
  function reqDocs(tok) { return (REQ[tok.task] || []).map(([key, name]) => ({ key, name, have: !!Flow.ui[key] })); }
  /* Kiểm tra phía BE khi xác nhận (EVars.check): kết quả từng tiêu chí phải khớp nút đã chọn. */
  function check(tok, choice, vals) {
    /* T80 L6: thành viên Tổ thẩm định phải có chứng chỉ đào tạo về đấu thầu (QC-12869 Điều 2 khoản 28) — đọc danh sách chứng chỉ (GIẢ LẬP P-THAU-03). */
    if (vals && String(tok.task) === '6' && vals.khTtd) {
      const thieu = vals.khTtd.map((r) => (D.personas.find((p) => p.id === r.nguoi) || {}).name).filter((ten) => ten && !window.Thau.certOf(ten).ok);
      if (thieu.length) return 'Thành viên Tổ thẩm định chưa có chứng chỉ đào tạo về đấu thầu: ' + thieu.join(', ') + ' (QC-12869 Điều 2 khoản 28).';
    }
    if (!vals || !choice) return null;
    const n = String(tok.task), yes = choice.main;
    if (n === '10' && vals.khKiemTra) {
      const bad = vals.khKiemTra.filter((r) => r.kq === NOK_VHT).length;
      if (yes && bad) return 'Còn tiêu chí Không đáp ứng — chọn Không đáp ứng để trả sửa.';
      if (!yes && !bad) return 'Bạn cần chọn ít nhất một tiêu chí Không đáp ứng.';
    }
    if (n === '12' && vals.khThamDinh) {
      const bad = vals.khThamDinh.filter((r) => r.kq === NOK_TD).length;
      if (yes && bad) return 'Còn nội dung Không tuân thủ hoặc không phù hợp — chọn Không đạt để trả sửa.';
      if (!yes && !bad) return 'Bạn cần chọn ít nhất một nội dung Không tuân thủ hoặc không phù hợp.';
    }
    return null;
  }
  const files = () => {
    const u = Flow.ui, no = (Flow.state.parent || '').replace('KHLCNT-', ''), rows = [];
    if (u.khPnxFile) rows.push({ name: `Phieu-nhan-xet-Ban-DTXD-${no}.pdf`, at: at(13) || Flow.dateOf(Flow.state.clock) });
    if (u.khQdKyFile) rows.push({ name: `Quyet-dinh-KHLCNT-da-ky-${no}.pdf`, at: at(20) || Flow.dateOf(Flow.state.clock) });
    if (at(17)) rows.push({ name: `Quyet-dinh-KHLCNT-da-ky-VOffice-${no}.pdf`, at: at(17) });
    (u.uploads || []).forEach((f, i) => rows.push({ name: f.name, at: f.at, up: i }));
    return rows;
  };
  const outs = () => DOCS.filter((d) => atAny(d.by)).map((d) => ({ code: d.code, name: `${d.code} ${d.name}`, at: atAny(d.by) }));
  /* Xem trước: mẫu Word BM-KHLCNT + dữ liệu eForm (phần đầu văn bản và các mục có trường trộn). */
  function doc(code) {
    const d = DOCS.find((x) => x.code === code);
    if (!d) return null;
    const v = vars(null), esc = window.UI.esc, td = isTd(), u = Flow.ui;
    const rows = (list) => list.map(([k, l]) => `<p><b>${esc(l)}:</b> ${esc(v[k] || '')}</p>`).join('');
    const body = {
      'KH-BM01': `<p>Kính gửi: ${td ? 'Tổng Giám đốc Tập đoàn' : 'Tổng Giám đốc Tổng Công ty'}.</p><p>Kế hoạch lựa chọn nhà thầu ${esc(v.kh.ten)} thuộc ${esc(v.kh.nguon)}.</p>${rows(td ? GT_TD : GT_VHT)}`,
      'KH-CK': (Object.entries(u.khCamKet || {})).map(([w, x]) => `<p>Tôi tên là: ${esc(pname(w))} · Địa chỉ: ${esc(x.diaChi)} · Số CCCD: ${esc(x.soCccd)} — đã cam kết ngày ${esc(x.at)}.</p>`).join('') || '<p>Chưa có thành viên cam kết.</p>',
      'KH-BM02': td ? `<p><b>BÁO CÁO THẨM ĐỊNH</b> kế hoạch lựa chọn nhà thầu ${esc(v.kh.ten)}.</p>${(v.khThamDinh || []).map((r) => `<p>${esc(r.tieuChi)}: ${esc(r.kq)} — ${esc(r.nhanXet)}</p>`).join('')}`
        : `<p><b>BÁO CÁO KIỂM TRA</b> kế hoạch lựa chọn nhà thầu ${esc(v.kh.ten)}.</p><p>Kết quả: ${(v.khKiemTra || []).filter((r) => r.kq === OK_VHT).length}/${(v.khKiemTra || []).length} tiêu chí Đáp ứng.</p><p>${esc(v.khNhanXet || '')}</p>`,
      'KH-PTR': `<p>Kính gửi: Tổng Giám đốc Tập đoàn. Xin phê duyệt KHLCNT ${esc(v.kh.ten)}.</p><p>Phiếu nhận xét của Ban Đầu tư Tập đoàn số ${esc(v.khPnxSo)}.</p><p><b>Mục đích:</b> ${esc(v.khMucDich)}</p>`
        + (v.khYKien || []).map((r) => `<p>Ý kiến: ${esc(r.noiDung)} — Giải trình: ${esc(r.giaiTrinh || '')}</p>`).join(''),
      'KH-BM03': `<p><b>QUYẾT ĐỊNH</b> về việc phê duyệt kế hoạch lựa chọn nhà thầu ${esc(v.kh.ten)}.</p><p>Điều 1. Phê duyệt kế hoạch lựa chọn nhà thầu với ${v.kh.soGoi} gói thầu, tổng giá ${esc(v.kh.tong)} tỷ đồng.</p><p>Người ký: ${esc(v.nguoiKy)}.</p>` }[code];
    return { name: d.name, html: `<div class="doc paper"><p class="c"><b>${esc(d.name.toUpperCase())}</b><br>${esc(v.kh.ten || '')}</p>${body}</div>` };
  }
  window.EForms.hdBy.MS18 = { vars, reqDocs, files, outs, doc, version, docs: DOCS, check };
})();
