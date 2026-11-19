/*
 * eForm của MS23.02 Bàn giao hàng hoá / dịch vụ (T25 B6). Theo DG-MS23.02 §C. Mỗi đợt giao một hồ sơ con, tự sinh từ MS23 bước 4; bước 16, 17, 19, 22 là service task.
 * Hồ sơ kho, kết quả KCS, xác nhận dịch vụ, HOC đã ký nằm ở Danh sách tài liệu (loại 4), không đặt trong form.
 */
(function () {
  const { txt, banner, ta, tf, sel, chk, req, opts, aiBox, dt, num, grp, file } = window.EForms.b;
  const Flow = window.Flow, D = window.D;
  const pick = (vals, keys) => keys.reduce((o, k) => { if (vals[k] !== undefined) o[k] = vals[k]; return o; }, {});
  const hd = () => window.HopDong.find(Flow.state.parent) || {};
  const dk = (s) => String(s || '').split('/').reverse().join('');

  const head = () => txt('**{{hd.code}}** — {{hd.ten}} · nhà thầu {{hd.ncc}}');
  /* T79 L3 (D-131, theo đề xuất DX-18): nhóm trường Xuất nhập khẩu ở bước giao nhận — hiện khi hợp đồng có hàng nhập khẩu (nhà thầu nước ngoài / mẫu 9, 10); không bắt buộc (GIẢ LẬP P-HD-01). */
  const XNK_KEYS = ['xnkSoTk', 'xnkNgayTk', 'xnkMaHs', 'xnkThueNk', 'xnkThueVat', 'xnkTiGia', 'xnkSoQd', 'xnkGiayPhep', 'xnkAnqp', 'xnkEuc'];
  const c4 = { layout: { columns: 4 } };
  const xnk = () => Object.assign(grp('Thông tin xuất nhập khẩu (theo đề xuất)', [tf('xnkSoTk', 'Số tờ khai hải quan', c4), dt('xnkNgayTk', 'Ngày tờ khai hải quan', c4), tf('xnkMaHs', 'Mã hồ sơ hải quan', c4),
    num('xnkThueNk', 'Thuế nhập khẩu (tỷ đồng)', c4), num('xnkThueVat', 'Thuế VAT hàng nhập khẩu (tỷ đồng)', c4), tf('xnkTiGia', 'Tỉ giá của tờ khai hải quan', c4), tf('xnkSoQd', 'Số / ngày QĐ phê duyệt hợp đồng', c4),
    tf('xnkGiayPhep', 'Giấy phép nhập khẩu (số / ngày / ghi chú)', c4), tf('xnkAnqp', 'Giấy xác nhận hàng ANQP (số / ngày / ghi chú)', c4), tf('xnkEuc', 'Giấy chứng nhận người sử dụng cuối cùng (số / ngày / ghi chú)', c4)]),
    { conditional: { hide: '=not(hd.nhapKhau)' } });
  const dot = () => txt('**{{dot.ten}}** · {{dot.hang}}\nNgày dự kiến giao {{dot.ngay}} · {{dot.diaDiem}}');
  const again = () => banner('Hàng bổ sung, thay thế: làm lại giao nhận và kiểm tra.', '=not(laThayThe)', 'moved');
  const note = (id, keyName, label, notes, q) => ({ id, q: q || [], schema: () => ({ components: [head(), dot(), ta(keyName, label, req())] }), notes: () => notes, write: (v) => pick(v, [keyName]) });

  const F = {
    1: { id: 'dtms-ms2302-t01-nhan-thong-bao', q: ['P-175'],
      schema: () => ({ components: [head(), dot(), sel('bgLoai', 'Đối tượng bàn giao', req({ values: opts(['Hàng hoá', 'Dịch vụ']), layout: { columns: 8 } })), ta('bgGhiChu', 'Ghi chú')] }),
      notes: () => ['Hồ sơ tự sinh từ thông báo đã ghi nhận ở MS23 bước 3. Cổng "Đối tượng bàn giao?": hàng hoá → bước 2; dịch vụ → bước 4, không qua kho, KCS kho.'], write: (v) => pick(v, ['bgLoai', 'bgGhiChu']) },
    2: { id: 'dtms-ms2302-t02-thong-bao', outputs: () => ['BG-TB'],
      schema: () => ({ components: [head(), dot(), ta('bgThongBao', 'Nội dung thông báo gửi Phòng Quản lý tài sản', req())] }),
      notes: () => ['Bản vẽ bước 2 không có mũi tên ra; theo diễn giải sang bước 3 (P-185).'], write: (v) => pick(v, ['bgThongBao']) },
    3: { id: 'dtms-ms2302-t03-giao-nhan', q: ['P-175'],
      schema: () => ({ components: [head(), dot(), again(), dt('bgNgayNhan', 'Ngày nhận hàng', req({ layout: { columns: 8 } })), tf('bgPhieuKho', 'Số phiếu nhập kho', req({ layout: { columns: 8 } })), xnk()] }),
      notes: () => ['Hồ sơ giao nhận, hồ sơ kho tải lên ở Danh sách tài liệu (bắt buộc). Hàng bổ sung, thay thế quay lại bước này. <b>Giả lập P-175</b>: thao tác SAP chưa dựng.'], write: (v) => pick(v, ['bgNgayNhan', 'bgPhieuKho'].concat(XNK_KEYS)) },
    4: note('dtms-ms2302-t04-xac-nhan-dich-vu', 'bgDichVu', 'Kết quả, khối lượng dịch vụ', ['Biên bản xác nhận thực hiện dịch vụ tải lên ở Danh sách tài liệu (bắt buộc). Xong → ghi dòng cần khởi tạo MS23.03, nhánh kết thúc; chưa phải nghiệm thu hoàn thành. <b>Giả lập P-180</b>.'], ['P-180']),
    5: note('dtms-ms2302-t05-yeu-cau-kiem-tra', 'bgYeuCau', 'Nội dung yêu cầu kiểm tra chất lượng', ['<b>Giả lập P-174</b>: Phòng Quản lý tài sản lập yêu cầu, Đơn vị sử dụng ghi nhận kết quả ở bước 6.'], ['P-174']),
    6: { id: 'dtms-ms2302-t06-ket-qua-kiem-tra', q: ['P-174', 'P-176'],
      schema: () => ({ components: [head(), dot(), again(), txt('Yêu cầu kiểm tra: {{bgYeuCau}}'), ta('bgKetQua', 'Kết quả, căn cứ đánh giá', req())] }),
      notes: () => ['Kết quả KCS tải lên ở Danh sách tài liệu (bắt buộc). Đạt → bước 14. Không đạt lần đầu → bước 7; đã bổ sung, thay thế mà vẫn không đạt → bước 9. <b>Giả lập P-176</b>.'], write: (v) => pick(v, ['bgKetQua']) },
    7: { id: 'dtms-ms2302-t07-bien-ban-khong-dat', q: ['P-122'], outputs: () => ['BG-BBKD'],
      schema: () => ({ components: [head(), dot(), ta('bgKhongDat', 'Nội dung không đạt', req())] }),
      notes: () => ['Cổng "Hướng xử lý lần đầu?" chọn bằng nút. <b>Giả lập P-122</b>: Phòng Quản lý tài sản quyết định; hạn 7 ngày làm việc từ ngày lập biên bản.'], write: (v) => pick(v, ['bgKhongDat']) },
    8: { id: 'dtms-ms2302-t08-theo-doi-thay-the', q: ['P-122'],
      schema: () => ({ components: [head(), dot(), txt('Hạn bổ sung, thay thế: **{{bgHan}}**'), dt('bgNgayBs', 'Ngày giao bổ sung, thay thế', req({ layout: { columns: 8 } })), ta('bgBoSung', 'Hàng bổ sung, thay thế')] }),
      notes: () => ['Có hàng trong hạn → bước 3 làm lại giao nhận, kiểm tra. Hệ thống chặn ngày giao sau hạn: khi đó chọn Không khắc phục trong hạn → bước 9. <b>Giả lập P-122</b>.'], write: (v) => pick(v, ['bgNgayBs', 'bgBoSung']) },
    9: note('dtms-ms2302-t09-quyen-tu-choi', 'bgTuChoi', 'Căn cứ từ chối', ['Từ chối ngay, quá hạn hoặc kiểm tra lại vẫn không đạt. Bản vẽ bước 9 không có mũi tên ra; theo diễn giải sang bước 10 (P-185).'], ['P-122', 'P-185']),
    10: note('dtms-ms2302-t10-tra-hang', 'bgTraHang', 'Kết quả trả hàng, vướng mắc', ['Cổng "Hướng xử lý theo HĐ / PO?" chọn bằng nút; ba hướng không tuần tự. <b>Giả lập P-177</b>: Đơn vị sử dụng chọn.'], ['P-177', 'P-185']),
    11: note('dtms-ms2302-t11-xu-ly-vi-pham', 'bgViPham', 'Căn cứ xử lý vi phạm', ['Xong → mở hồ sơ MS23.01 loại Biên bản phạt. <b>Giả lập P-178</b>: hồ sơ bàn giao giữ trạng thái chờ, bản vẽ không có bước quay lại.'], ['P-178']),
    12: { id: 'dtms-ms2302-t12-thu-tuc-huy', q: ['P-123'],
      schema: () => ({ components: [head(), dot(), sel('bgPhamVi', 'Phạm vi hủy', req({ values: opts(D.hdBgHuy), layout: { columns: 8 } })), ta('bgLyDoHuy', 'Lý do hủy', req())] }),
      notes: () => ['Kết thúc theo phạm vi hủy. <b>Giả lập P-123</b>: chưa có tuyến duyệt hủy; hủy toàn bộ thì hợp đồng Chấm dứt.'], write: (v) => pick(v, ['bgPhamVi', 'bgLyDoHuy']) },
    13: { id: 'dtms-ms2302-t13-xin-y-kien', q: ['P-179'], outputs: () => ['BG-TTR'],
      schema: () => ({ components: [head(), dot(), ta('bgVuongMac', 'Vướng mắc, phương án đề xuất', req())] }),
      notes: () => ['Áp dụng mục 6.6 QT-10.2.5. <b>Giả lập P-179</b>: sau khi trình, hồ sơ giữ trạng thái chờ ý kiến chỉ đạo.'], write: (v) => pick(v, ['bgVuongMac']) },
    14: { id: 'dtms-ms2302-t14-tap-hop', q: ['P-181'],
      schema: () => ({ components: [head(), dot(), banner('AI kiểm tra lần trước không đạt: bổ sung, chỉnh sửa hồ sơ.', '=not(aiLoi)'), chk('bgDuHoSo', 'Xác nhận', req({ text: 'Đã kiểm tra hàng hoá, chứng từ và kết quả kiểm tra chất lượng đạt' }))] }),
      notes: () => ['Đủ → AI kiểm tra (bước 16). Chưa đủ → bước 15. Cũng là nơi quay lại khi AI bước 16 không đạt hoặc Trưởng phòng không duyệt (P-183). <b>Giả lập P-181</b>: mỗi đợt một HOC.'], write: (v) => pick(v, ['bgDuHoSo']) },
    15: note('dtms-ms2302-t15-bo-sung', 'bgBoSungHs', 'Nội dung đã bổ sung', ['Nội dung còn thiếu xem ở Lịch sử hồ sơ. Bản vẽ bước 15 không có mũi tên ra; theo diễn giải về bước 14 (P-185).'], ['P-185']),
    18: { id: 'dtms-ms2302-t18-hoan-thien-hoc', q: ['P-181'], outputs: () => ['BG-HOC'],
      schema: () => ({ components: [head(), dot(), banner('AI kiểm tra HOC lần trước không đạt: sửa theo nội dung được chỉ ra.', '=not(aiLoi2)'), aiBox('dự thảo HOC', 'Dự thảo theo hồ sơ của **{{dot.ten}}**, căn cứ kết quả kiểm tra đạt.'), ta('bgHoc', 'Nội dung HOC', req())] }),
      notes: () => ['Hoàn thành → AI kiểm tra trước duyệt (bước 19). <b>Giả lập P-181</b>: BG-HOC là mã tạm.'], write: (v) => pick(v, ['bgHoc']) },
    20: { id: 'dtms-ms2302-t20-phe-duyet', q: ['P-183'],
      schema: () => ({ components: [head(), dot(), aiBox('kiểm tra HOC trước duyệt', 'Kết quả: **Đạt**'), txt('Nội dung HOC: {{bgHoc}}'), ta('bgYKien20', 'Ý kiến')] }),
      notes: () => ['Không duyệt → bước 14 theo mũi tên bản vẽ. <b>Giả lập P-183</b>.'], write: (v) => pick(v, ['bgYKien20']) },
    21: { id: 'dtms-ms2302-t21-cap-nhat-hoc', q: ['P-123'],
      schema: () => ({ components: [head(), dot(), sel('bgHinhThucKy', 'Hình thức ký', req({ values: opts(['VContract', 'Ký cứng', 'Hình thức khác']), layout: { columns: 8 } })), dt('bgNgay', 'Ngày bàn giao thực tế', req({ layout: { columns: 8 } })), chk('bgDuChuKy', 'Xác nhận', req({ text: 'HOC đã có đủ chữ ký theo hợp đồng' }))] }),
      notes: () => ['HOC đã ký đầy đủ tải lên ở Danh sách tài liệu (bắt buộc). Hoàn thành → AI bước 22 cập nhật ngày thực tế qua MS23 bước 5. <b>Giả lập P-123</b>: không thêm cấp ký; ngày không tự suy ra (P-184).'], write: (v) => pick(v, ['bgHinhThucKy', 'bgNgay', 'bgDuChuKy']) },
  };
  window.EForms['MS23.02'] = (tok) => F[tok.task] || null;

  /* Mã tạm (P-181). */
  const DOCS = [{ code: 'BG-TB', name: 'Thông báo giao hàng', by: 2 }, { code: 'BG-BBKD', name: 'Biên bản hàng hoá không đạt', by: 7 }, { code: 'BG-TTR', name: 'Tờ trình xin ý kiến', by: 13 }, { code: 'BG-HOC', name: 'HOC', by: 17 }];
  const UP = [['bgKho', 'Ho-so-giao-nhan', 3, 'Hồ sơ giao nhận, hồ sơ kho'], ['bgDv', 'Xac-nhan-dich-vu', 4, 'Biên bản xác nhận thực hiện dịch vụ'], ['bgKcs', 'Ket-qua-KCS', 6, 'Kết quả KCS'], ['bgHocKy', 'HOC-da-ky', 21, 'HOC đã ký đầy đủ']];
  const at = (n) => { const h = Flow.lastOf(n); return h ? Flow.dateOf(h.t) : null; };
  const ms = () => Flow.caseOf(D.hdCaseCode(Flow.state.parent, 'MS23')).vars.track.ms.find((m) => m.name === Flow.state.vars.msName) || {};

  function vars() {
    const h = hd(), u = Flow.ui, k = window.HopDong.kit(), v = Flow.state.vars, m = ms(), today = Flow.dateOf(Flow.state.clock);
    return Object.assign({}, u, { laThayThe: !!v.bgThayThe, aiLoi: !!(v.aiBgIn && !v.aiBgIn.ok), aiLoi2: !!(v.aiBgOut && !v.aiBgOut.ok), bgHan: v.bgHan, bgLoai: u.bgLoai || 'Hàng hoá', bgYeuCau: u.bgYeuCau || 'Kiểm tra theo yêu cầu kỹ thuật của hợp đồng', bgHoc: u.bgHoc || `Bàn giao ${m.goods || ''}`, bgHinhThucKy: u.bgHinhThucKy || 'VContract',
      bgNgayNhan: u.bgNgayNhan || today, bgNgayBs: u.bgNgayBs || today, bgNgay: u.bgNgay || today, hd: { code: h.code, ten: h.title, ncc: k.nccName(h.ncc), nhapKhau: window.HopDong.isImport(h) }, dot: { ten: m.name, hang: m.goods, ngay: m.plan, diaDiem: m.site } });
  }
  function reqDocs(tok) { return UP.filter((x) => String(x[2]) === String(tok.task)).map(([key, , , name]) => ({ key, name, have: !!Flow.ui[key] })); }
  const files = () => {
    const u = Flow.ui, no = Flow.state.code, rows = [];
    UP.forEach(([key, name, by]) => { if (u[key] || at(by)) rows.push({ name: `${name}-${no}.pdf`, at: at(by) || Flow.dateOf(Flow.state.clock) }); });
    (u.uploads || []).forEach((f, i) => rows.push({ name: f.name, at: f.at, up: i }));
    return rows;
  };
  const outs = () => DOCS.filter((d) => at(d.by)).map((d) => ({ code: d.code, name: `${d.code} ${d.name}`, at: at(d.by) }));
  function docOf(code) {
    const d = DOCS.find((x) => x.code === code);
    if (!d) return null;
    const u = Flow.ui, m = ms(), esc = window.UI.esc;
    return { name: d.name, html: `<div class="doc paper"><p class="c"><b>${esc(d.name.toUpperCase())}</b><br>${esc(hd().title)}</p><p>${esc(m.name || '')}: ${esc(m.goods || '')}.</p><p>${esc(u.bgHoc || u.bgKhongDat || u.bgVuongMac || u.bgThongBao || 'Nội dung theo mẫu.')}</p></div>` };
  }
  /* Bước 8: chỉ nhận hàng trong hạn 7 ngày (GIẢ LẬP P-122). */
  function check(tok, choice, vals) {
    if (String(tok.task) !== '8' || !vals || !choice || !choice.main) return null;
    const han = Flow.state.vars.bgHan;
    return vals.bgNgayBs && han && dk(vals.bgNgayBs) > dk(han) ? `Ngày giao bổ sung, thay thế sau hạn ${han}. Chọn Không khắc phục trong hạn.` : null;
  }
  window.EForms.hdBy['MS23.02'] = { vars, reqDocs, files, outs, doc: docOf, version: () => 1 + Flow.doneCount(18), docs: DOCS, check };
})();
