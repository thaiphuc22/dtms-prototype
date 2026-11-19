/*
 * eForm của MS24 Thanh toán theo từng đợt (T25 B3). Theo DG-MS24 §C, §E. Mỗi đợt một hồ sơ con; số tiền đọc từ kế hoạch thanh toán của hợp đồng (D.hdPayPlan), chỉ xem.
 * Hồ sơ, hoá đơn, minh chứng nằm ở Danh sách tài liệu (loại 4), không đặt trong form. Bước 4, 6, 20 là service task; bước 20 có màn khi đồng bộ SAP lỗi.
 */
(function () {
  const { txt, banner, tbl, ta, tf, sel, req, opts, aiBox, dt, num } = window.EForms.b;
  const Flow = window.Flow, D = window.D;
  const pick = (vals, keys) => keys.reduce((o, k) => { if (vals[k] !== undefined) o[k] = vals[k]; return o; }, {});
  const hd = () => window.HopDong.find(Flow.state.parent) || {};
  const plan = () => D.hdPayPlan[Flow.state.parent][Flow.state.vars.dot];
  const r3 = (n) => Math.round(n * 1000) / 1000;

  const head = () => txt('**{{hd.code}}** — {{hd.ten}} · nhà thầu {{hd.ncc}}');
  const amount = () => txt('**{{dot.ten}}** · điều kiện: {{dot.cond}}\nĐề nghị **{{dot.deNghi}} tỷ đồng** · khấu trừ tạm ứng {{dot.adv}} · giữ lại {{dot.hold}} · thanh toán ròng **{{dot.rong}} tỷ đồng**');
  const table = () => tbl('Bảng tổng hợp thanh toán', 'bth', [['noiDung', 'Nội dung'], ['giaTri', 'Giá trị (tỷ đồng)']]);
  /* Tuyến ký: bước trình bảng tổng hợp có bảng; bước trình đề nghị có thêm hình thức ký. Không đồng ý mở dialog nhận xét. */
  const kyForm = (id, n, doc, note, q) => ({ id, q: q || ['P-124', 'P-150'],
    schema: () => ({ components: [head(), amount()].concat(doc === 'BTH' ? [aiBox('bảng tổng hợp lập từ hoá đơn', 'Hoá đơn số **{{ttSoHoaDon}}**'), table()] : [txt('Hình thức ký: **{{ttKy}}**')], [ta(`ttYKien${n}`, 'Ý kiến')]) }),
    notes: () => [note, doc === 'BTH' ? 'Không đồng ý → bước 11, sửa bảng tổng hợp rồi trình lại từ Phòng tài chính (không về bước 6, không sang bước 17).' : 'Không đồng ý → bước 17 → bước 12 → trình lại từ bước 13 (không về tuyến bảng tổng hợp).'],
    write: (v) => pick(v, [`ttYKien${n}`]) });

  const F = {
    1: { id: 'dtms-ms24-t01-tap-hop', q: ['P-144'],
      schema: () => ({ components: [head(), amount(), ta('ttNoiDung', 'Nội dung hồ sơ thanh toán', req())] }),
      notes: () => ['Hồ sơ thanh toán tải lên ở Danh sách tài liệu (bắt buộc). <b>Giả lập P-144</b>: chuyên viên Phòng Hợp đồng làm thay Chuyên quản / ĐVMS.'],
      write: (v) => pick(v, ['ttNoiDung']) },
    2: { id: 'dtms-ms24-t02-tiep-nhan', q: ['P-145', 'P-147'],
      schema: () => ({ components: [head(), amount(), tf('ttNguoiNhan', 'Người nhận tiền', req()), sel('ttBth', 'Hợp đồng yêu cầu bảng tổng hợp?', req({ values: opts(['Có', 'Không']) })), txt('Nội dung hồ sơ: {{ttNoiDung}}')] }),
      notes: () => ['Cổng "Hồ sơ đủ căn cứ?" chọn bằng nút. <b>Giả lập P-145</b>: nhân sự chuyên thanh toán chọn có bảng tổng hợp hay không; cổng G2 sau bước 4 đọc lựa chọn này.'],
      write: (v) => Object.assign(pick(v, ['ttNguoiNhan']), { ttBangTH: v.ttBth !== 'Không' }) },
    3: { id: 'dtms-ms24-t03-bo-sung', q: ['P-144'],
      schema: () => ({ components: [head(), amount(), ta('ttBoSung', 'Nội dung đã bổ sung', req())] }),
      notes: () => ['Bổ sung xong gửi lại bước 2 kiểm tra. Yêu cầu bổ sung xem ở Lịch sử hồ sơ.'], write: (v) => pick(v, ['ttBoSung']) },
    5: { id: 'dtms-ms24-t05-hoa-don',
      schema: () => ({ components: [head(), amount(), tf('ttSoHoaDon', 'Số hoá đơn', req({ layout: { columns: 8 } })), dt('ttNgayHoaDon', 'Ngày hoá đơn', { layout: { columns: 8 } }),
        window.EForms.b.dlAdd('ttHoaDonThem', 'Hoá đơn khác của đợt', [tf('so', 'Số hoá đơn', { layout: { columns: 6 } }), dt('ngay', 'Ngày hoá đơn', { layout: { columns: 5 } }), num('giaTri', 'Giá trị (tỷ đồng)', { layout: { columns: 5 } })])] }),
      notes: () => ['Hoá đơn tải lên ở Danh sách tài liệu (bắt buộc). Hoàn thành → service task 6: AI lập bảng tổng hợp.', 'T79 (D-131): một đợt có thể nhiều hoá đơn — card Hóa đơn ở tab Thanh toán của hợp đồng.'],
      write: (v) => pick(v, ['ttSoHoaDon', 'ttNgayHoaDon', 'ttHoaDonThem']) },
    7: kyForm('dtms-ms24-t07-ky-bth', 7, 'BTH', 'Phòng tài chính kiểm tra, ký. <b>Giả lập P-124</b>: Trưởng phòng Tài chính kế toán.'),
    8: kyForm('dtms-ms24-t08-ky-bth', 8, 'BTH', 'Thủ trưởng VHT ký sau Phòng tài chính.'),
    9: kyForm('dtms-ms24-t09-ky-bth', 9, 'BTH', 'Văn thư kiểm tra font chữ, biểu mẫu, loại văn bản, định dạng, văn phong và ký xác nhận.'),
    10: kyForm('dtms-ms24-t10-ky-bth', 10, 'BTH', 'Tổng giám đốc Tập đoàn ký sau Văn thư (tài khoản giả lập).'),
    11: { id: 'dtms-ms24-t11-sua-bth', q: ['P-150'],
      schema: () => ({ components: [head(), amount(), table(), ta('ttSuaBth', 'Nội dung đã chỉnh sửa', req())] }),
      notes: () => ['Ý kiến trả lại xem ở Lịch sử hồ sơ. Sau chỉnh sửa trình lại từ bước 7.'], write: (v) => pick(v, ['ttSuaBth']) },
    12: { id: 'dtms-ms24-t12-hoan-thien', q: ['P-152', 'P-148'], outputs: () => ['TT-DNCT'],
      schema: () => ({ components: [head(), amount(), sel('ttKy', 'Hình thức ký', req({ values: opts(['VOffice', 'VContract', 'Hình thức khác']) }))] }),
      notes: () => ['<b>Giả lập P-152</b>: chọn hình thức ký một lần; các cấp bấm Đồng ý và ký, không gọi tích hợp. <b>Giả lập P-148</b>: mã văn bản tạm.'], write: (v) => pick(v, ['ttKy']) },
    13: kyForm('dtms-ms24-t13-ky-dn', 13, 'DN', 'Phòng tài chính ký duyệt đề nghị. <b>Giả lập P-124</b>: Trưởng phòng Tài chính kế toán.'),
    14: kyForm('dtms-ms24-t14-ky-dn', 14, 'DN', 'Thủ trưởng VHT ký sau Phòng tài chính.'),
    15: kyForm('dtms-ms24-t15-ky-dn', 15, 'DN', 'Văn thư kiểm tra thể thức và ký xác nhận.'),
    16: kyForm('dtms-ms24-t16-ky-dn', 16, 'DN', 'Tổng giám đốc Tập đoàn ký sau Văn thư (tài khoản giả lập). Đồng ý → bước 18 thanh toán.'),
    17: { id: 'dtms-ms24-t17-sua-dn', q: ['P-151'],
      schema: () => ({ components: [head(), amount(), ta('ttSuaDn', 'Nội dung đã chỉnh sửa', req())] }),
      notes: () => ['Ý kiến trả lại xem ở Lịch sử hồ sơ. Sau chỉnh sửa về bước 12 hoàn thiện lại, trình từ bước 13. <b>Giả lập P-151</b>: không sửa số tiền ở bước này.'], write: (v) => pick(v, ['ttSuaDn']) },
    18: { id: 'dtms-ms24-t18-thanh-toan', q: ['P-153'],
      schema: () => ({ components: [head(), amount(), txt('Người nhận: **{{ttNguoiNhan}}**'), sel('ttPhuongThuc', 'Phương thức thanh toán', req({ values: opts(['Chuyển khoản', 'Tiền mặt']), layout: { columns: 8 } })),
        dt('ttNgayTT', 'Ngày thanh toán', req({ layout: { columns: 8 } })), tf('ttChungTu', 'Số chứng từ', req())] }),
      notes: () => ['Một bước thanh toán gồm chuyển tiền hoặc tiền mặt, sơ đồ không tách cổng phương thức.'], write: (v) => pick(v, ['ttPhuongThuc', 'ttNgayTT', 'ttChungTu']) },
    19: { id: 'dtms-ms24-t19-cap-nhat', q: ['P-146'],
      schema: () => ({ components: [head(), amount(), txt('Đã thanh toán ngày **{{ttNgayTT}}** · chứng từ **{{ttChungTu}}**'), sel('ttTrangThai', 'Trạng thái thanh toán', req({ values: opts(['Đã thanh toán']) }))] }),
      notes: () => ['Minh chứng tải lên ở Danh sách tài liệu (bắt buộc). <b>Giả lập P-146</b>: tên trạng thái chưa chốt. Hoàn thành → service task 20: đồng bộ SAP.'], write: (v) => pick(v, ['ttTrangThai']) },
    20: { id: 'dtms-ms24-t20-gui-lai-sap', q: ['P-125'],
      schema: () => ({ components: [banner('Đồng bộ SAP không thành công — chưa ghi nhận được trạng thái thanh toán. Kiểm tra kết nối rồi bấm Gửi lại.'), head(), amount()] }),
      notes: () => ['<b>Giả lập P-125</b>: sơ đồ chưa có nhánh lỗi; lỗi đồng bộ tạo việc Gửi lại SAP (thật: incident của job worker, retry).'] },
  };
  window.EForms.MS24 = (tok) => F[tok.task] || null;

  const DOCS = [{ code: 'TT-DNCT', name: 'Đề nghị chuyển tiền', by: 4 }, { code: 'TT-BTH', name: 'Bảng tổng hợp thanh toán', by: 6 }];
  const REQ = { 1: [['ttHoSo', 'Hồ sơ thanh toán']], 5: [['ttHoaDon', 'Hoá đơn thanh toán']], 19: [['ttMinhChung', 'Chứng từ, minh chứng thanh toán']] };
  const at = (n) => { const h = Flow.lastOf(n); return h ? Flow.dateOf(h.t) : null; };

  function vars() {
    const h = hd(), u = Flow.ui, k = window.HopDong.kit(), p = plan(), rong = r3(p.value - p.adv - p.hold);
    return Object.assign({}, u, { ttBth: u.ttBangTH === false ? 'Không' : 'Có', ttNguoiNhan: u.ttNguoiNhan || k.nccName(h.ncc), ttKy: u.ttKy || 'VOffice', ttPhuongThuc: u.ttPhuongThuc || 'Chuyển khoản', ttNgayTT: u.ttNgayTT || Flow.dateOf(Flow.state.clock), ttTrangThai: u.ttTrangThai || 'Đã thanh toán', ttSoHoaDon: u.ttSoHoaDon || '0001234',
      hd: { code: h.code, ten: h.title, ncc: k.nccName(h.ncc) }, dot: { ten: p.name, cond: p.cond, deNghi: p.value, adv: p.adv, hold: p.hold, rong },
      bth: [{ noiDung: `Giá trị đề nghị theo hoá đơn ${u.ttSoHoaDon || '0001234'}`, giaTri: p.value }, { noiDung: 'Khấu trừ tạm ứng', giaTri: p.adv }, { noiDung: 'Giữ lại bảo hành', giaTri: p.hold }, { noiDung: 'Thanh toán ròng', giaTri: rong }] });
  }
  function reqDocs(tok) { return (REQ[tok.task] || []).map(([key, name]) => ({ key, name, have: !!Flow.ui[key] })); }
  const files = () => {
    const u = Flow.ui, no = Flow.state.code, rows = [];
    if (u.ttHoSo || at(1)) rows.push({ name: `Ho-so-thanh-toan-${no}.pdf`, at: at(1) || Flow.dateOf(Flow.state.clock) });
    if (u.ttHoaDon || at(5)) rows.push({ name: `Hoa-don-${no}.pdf`, at: at(5) || Flow.dateOf(Flow.state.clock) });
    if (u.ttMinhChung || at(19)) rows.push({ name: `Minh-chung-thanh-toan-${no}.pdf`, at: at(19) || Flow.dateOf(Flow.state.clock) });
    (u.uploads || []).forEach((f, i) => rows.push({ name: f.name, at: f.at, up: i }));
    return rows;
  };
  const outs = () => DOCS.filter((d) => at(d.by)).map((d) => ({ code: d.code, name: `${d.code} ${d.name}`, at: at(d.by) }));
  function doc(code) {
    const d = DOCS.find((x) => x.code === code);
    if (!d) return null;
    const v = vars(), esc = window.UI.esc, ty = window.UI.ty;
    return { name: d.name, html: `<div class="doc paper"><p class="c"><b>${esc(d.name.toUpperCase())}</b><br>${esc(v.hd.ten)}</p><p>Đợt: ${esc(v.dot.ten)}. Người nhận: ${esc(v.ttNguoiNhan)}.</p>${v.bth.map((r) => `<p>${esc(r.noiDung)}: ${ty(r.giaTri, 3)} tỷ đồng.</p>`).join('')}</div>` };
  }
  window.EForms.hdBy.MS24 = { vars, reqDocs, files, outs, doc, version: () => 1 + Flow.doneCount(17), docs: DOCS, check: () => null };
})();
