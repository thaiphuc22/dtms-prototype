/* Quản lý thầu theo Backlog W1_T10 (T16 B2, plan docs/dtms/prototype-W1T10-backlog-chuan-bi.md §2i) — màn tĩnh, không chạy luồng (D-17).
   KHLCNT là đối tượng cha (như ĐXMS / KĐT, D-12): lập từ một đối tượng nguồn đã phê duyệt (ĐXMS / KĐT), quy trình MS18 (BPMN-MS18, bản nháp).
   Gói thầu là dòng gói của KHLCNT; tổ chức LCNT theo hình thức (QC-12869 Điều 12–21) — MS19 theo BPMN-MS19 (T67 T5), quy trình con chi tiết treo P-235.
   SCR-78 #/khlcnt, SCR-79 #/khlcnt/create[/<loại>/<mã nguồn>], SCR-80 #/khlcnt/<mã>, SCR-81 #/goi-thau, SCR-82 #/goi-thau/<mã>, SCR-83 #/nha-thau. */
(function () {
  const D = window.D, Flow = window.Flow, S = window.Screens;
  const { esc, icon, ty, vSelect, badge, pager, norm, toast, persona, modal } = window.UI;
  const rerender = () => window.App.render();
  const head = (o) => S.head(o);
  const dash = '<span class="dash">-</span>';
  const clamp = (v) => (v ? `<span class="clamp">${esc(v)}</span>` : dash);
  const money = (v) => (v == null ? dash : ty(v, 2));
  const kv = (k, v, cls) => `<div class="${cls || ''}"><div class="k">${k}</div><div class="v clamp">${v == null || v === '' ? '-' : v}</div></div>`;
  const field = (label, ctl, o) => `<div class="vfield ${o && o.err ? 'invalid' : ''} ${o && o.cls ? o.cls : ''}"><div class="lr"><label>${label}</label>${o && o.req ? '<span class="req" aria-hidden="true">*</span>' : ''}</div>${ctl}${o && o.err ? `<p class="msg" role="alert">${esc(o.err)}</p>` : ''}</div>`;
  const table = (cols, rows, cell, foot) => `<div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
    <tbody>${rows.map((r, i) => `<tr><td class="ord">${i + 1}</td>${cell(r, i)}</tr>`).join('') || `<tr><td class="vtable-empty" colspan="${cols.length + 1}"><img src="assets/empty-table.svg" alt="">Chưa có dữ liệu</td></tr>`}</tbody>${foot || ''}</table></div>`;
  const card = (title, body, cap) => `<section class="vcard pad24">${cap ? `<div class="vcard-h"><h3>${title}</h3><span class="cap">${cap}</span></div>` : `<h3>${title}</h3>`}${body}</section>`;
  const emptyCard = (title, text) => card(title, `<div class="empty-t">${text}</div>`);
  const cat = (key, code) => ((window.Catalog.rows(key).find((r) => r.code === code) || {}).name || code || '');
  const nccName = (code) => { const r = D.nccOf(code); return r.name || r.short || code; };
  const dkey = (s) => { const [d, m, y] = String(s || '').split('/'); return y ? `${y}${m}${d}` : ''; };
  const sum = (a) => Math.round(a.reduce((s, x) => s + (x || 0), 0) * 100) / 100;
  /* Trường theo hệ thống cũ (T24 B3, HT-THAU-IMG): Quy chế áp dụng, Cấp phê duyệt, Người phụ trách. law = Theo luật (đăng tải mạng đấu thầu quốc gia, P-83). */
  const QC = { MSTX: 'Mua sắm thường xuyên', LUAT: 'Theo luật' };
  const LEVEL = { TCT: 'Tổng Công ty', TD: 'Tập đoàn' };
  const qcOf = (k) => (k.law ? 'LUAT' : 'MSTX');
  const levelOf = (k) => k.level || 'TCT';
  const ownerOf = (k) => k.owner || k.creator;
  /* Tiền bằng chữ cho dòng Tổng của bảng gói thầu (như hệ thống cũ, IMG 7212) — dùng UI.inWords (chung với Tờ trình BM-01 / BM-09). */
  const inWords = window.UI.inWords;

  /* ---------- Đối tượng nguồn (S4): giá trị được phê duyệt lấy từ hồ sơ Hoàn thành gần nhất của ĐXMS / KĐT ---------- */
  const SRC = { DXMS: 'Đề xuất mua sắm', KDT: 'Khoản đầu tư', DADT: 'Dự án đầu tư' };
  const srcHref = (kind, code) => (kind === 'KDT' ? 'kdt/' : 'dxms/') + encodeURIComponent(code);
  /* T45 (D-104): KĐT có thể chọn nhiều đề tài / dự án. */
  const nvText = (codes) => (codes || []).map((c) => D.nvOf(c)).filter(Boolean).map((n) => `${n.code} — ${n.name}`).join('; ');
  function srcInfo(kind, code) {
    if (kind === 'KDT') {
      const x = Flow.findKdt(code);
      if (!x) return null;
      /* T45 (D-103): KĐT đã duyệt = hồ sơ phê duyệt KĐT Hoàn thành hoặc hồ sơ chủ trương gộp (CT_KDT) Hoàn thành — chủ trương BM-01 chưa đủ. */
      const m = window.Kdt.meta(x), done = !m.approved ? null
        : m.hs.find((c) => c.kind === 'KDT' && c.st === 'done') || (m.ct && m.ct.st === 'done' && m.ct.scope === 'CT_KDT' ? m.ct : null);
      const d = done && (done.docs || []).filter(([k]) => k === 'BM-18' || k === 'BM-00').pop();
      return { kind, code, nv: x.nv, nvText: nvText(x.nvs || [x.nv]), title: x.title, unit: x.unit, approved: m.approved, value: m.approved ? m.value : null,
        doc: d ? `${d[0] === 'BM-18' ? 'BM-18 Quyết định phê duyệt KĐT' : 'BM-00 Hồ sơ chủ trương và KĐT'} ngày ${d[1]}` : '',
        fund: x.type === 'KHCN' ? 'KHCN' : x.type === 'TBNB' ? 'DTPT' : 'SXKD' };
    }
    const x = Flow.findDxms(code);
    if (!x) return null;
    const done = S.allCases().filter((c) => c.dxms === code && c.st === 'done').sort((a, b) => dkey(b.updated).localeCompare(dkey(a.updated)))[0];
    const doc = done ? (done.kind === 'DC' ? 'QĐ điều chỉnh ĐXMS' : done.flow === 'MS01.03' ? 'BM-09 Tờ trình ĐXMS (đã phê duyệt)' : 'BM-08 Quyết định phê duyệt ĐXMS') + ' ngày ' + done.updated : '';
    return { kind, code, nv: x.nv, nvText: nvText([x.nv]), title: x.title, unit: x.unit, approved: !!done, value: done ? done.total : null, doc, fund: (x.est || 0) < 20 ? 'CPTX' : 'DTPT' };
  }
  const approvedSources = (kind) => (kind === 'KDT' ? Flow.kdtAll() : Flow.dxmsAll()).map((x) => srcInfo(kind, x.code)).filter((s) => s && s.approved);

  /* ---------- Dữ liệu mẫu ----------
     KH_ST theo 4 luồng con MS18: 18.1 lập thông tin gói → 18.2 Tờ trình (BM-01, VOffice) → 18.3 Báo cáo kiểm tra (Q02) → 18.4 Quyết định (BM-03) & đăng tải. */
  const KH_ST = { FIX: ['Yêu cầu chỉnh sửa', 'warning'], OPINION: ['Chờ ý kiến', 'warning'], SIGNED: ['Đã ký, chờ đăng tải', 'success'], CANCEL: ['Đã huỷ', 'error'], DRAFT: ['Dự thảo', 'default'], SIGN: ['Đang trình ký tờ trình', 'info'], CHECK: ['Đang kiểm tra', 'info'], APPROVE: ['Chờ phê duyệt', 'warning'],
    OK: ['Đã phê duyệt', 'success'], ADJ: ['Đang điều chỉnh', 'warning'], RUN: ['Đang xử lý', 'info'] };
  /* T67 T4 — trạng thái hai lớp (THAU-TT-1311 §1.1, §3.4, §4.1): mã → [trạng thái hiển thị, màu, giai đoạn lớn]. KH_ST / PK_ST còn là khoá nội bộ
     của dữ liệu mẫu (báo cáo, hợp đồng dùng); màn hiện KHL / LC. Giai đoạn lớn của KHLCNT GIẢ LẬP theo ví dụ §1.1 (tài liệu chỉ có cho gói thầu). */
  const KHL = { 'KHL-01': ['Nháp KHLCNT', 'default', 'Chuẩn bị KHLCNT'], 'KHL-02': ['Đang lập KHLCNT', 'info', 'Đang lập KHLCNT'],
    'KHL-03': ['Chờ Tổ thẩm định xác nhận', 'info', 'Đang kiểm tra/thẩm định'], 'KHL-04': ['Đang kiểm tra/thẩm định KHLCNT', 'info', 'Đang kiểm tra/thẩm định'],
    'KHL-05': ['Yêu cầu chỉnh sửa KHLCNT', 'warning', 'Đang kiểm tra/thẩm định'], 'KHL-06': ['Chờ ý kiến/giải trình', 'warning', 'Đang kiểm tra/thẩm định'],
    'KHL-07': ['Đang trình phê duyệt KHLCNT', 'warning', 'Đang trình phê duyệt'], 'KHL-08': ['KHLCNT đã phê duyệt', 'success', 'Đang công khai'],
    'KHL-09': ['Đang công khai KHLCNT', 'info', 'Đang công khai'], 'KHL-10': ['Hoàn thành KHLCNT', 'success', 'Hoàn thành KHLCNT'], 'KHL-X': ['Đã hủy', 'error', 'Kết thúc'] };
  /* Mẫu chưa chạy MS18: trạng thái cũ → [mã, bước đang ở] (§2 mapping hệ thống cũ → TO-BE; bước theo BPMN-MS18-TOBE, CHECK tuyến Tập đoàn ở 12). */
  const KH_MAP = { DRAFT: ['KHL-01', null], SIGN: ['KHL-02', 5], CHECK: ['KHL-04', 10], APPROVE: ['KHL-07', 16], OK: ['KHL-10', null], ADJ: ['KHL-02', 3],
    FIX: ['KHL-05', 9], OPINION: ['KHL-06', 13], SIGNED: ['KHL-08', 21], CANCEL: ['KHL-X', null] };
  const KH0 = [
    /* T67 dữ liệu demo (16/11): phủ thêm KHL-05, KHL-06, KHL-08, KHL-X; mỗi KHLCNT một nguồn ĐXMS đã phê duyệt, tổng gói = giá trị được duyệt.
       KĐT-2026-0015 để trống làm nguồn cho kịch bản Lập KHLCNT từ KĐT. */
    { code: 'KHLCNT-2026-0020', src: ['DXMS', 'ĐXMS-2026-0142'], title: 'KHLCNT dịch vụ bảo trì hệ thống điều hoà phòng sạch năm 2028', st: 'SIGNED', owner: 'Ninh Thị Hồng', creator: 'Phan Văn Lộc', created: '14/09/2026', updated: '06/10/2026',
      basis: 'Một gói: dịch vụ bảo trì định kỳ, nhiều nhà cung cấp trên thị trường đáp ứng — chào giá trực tuyến.',
      parts: { done: [], na: [], pending: [] }, pkgs: ['GT-2026-0039'],
      docs: { bm01: ['0917/TTr-MS-ĐT', '18/09/2026', 'Ninh Thị Hồng'], bm02: ['', '25/09/2026', 'Phạm Thị Lan'], bm03: ['0931/QĐ-VHT', '05/10/2026', 'Ngô Đình Khôi'] } },
    { code: 'KHLCNT-2026-0019', src: ['DXMS', 'ĐXMS-2026-0141'], title: 'KHLCNT dịch vụ bảo trì hệ thống điều hoà phòng sạch năm 2027', st: 'OPINION', level: 'TD', owner: 'Ninh Thị Hồng', creator: 'Phan Văn Lộc', created: '01/09/2026', updated: '02/10/2026',
      basis: 'Một gói: dịch vụ bảo trì định kỳ 12 tháng, đấu thầu rộng rãi trong nước qua mạng.',
      parts: { done: [], na: [], pending: [] }, pkgs: ['GT-2026-0038'],
      docs: { bm01: ['0905/TTr-MS-ĐT', '08/09/2026', 'Ninh Thị Hồng'], bm02: ['0906/BC-TTĐ', '22/09/2026', 'Hoàng Quốc Bình'] } },
    { code: 'KHLCNT-2026-0018', src: ['DXMS', 'ĐXMS-2026-0112'], title: 'KHLCNT dịch vụ thuê hạ tầng điện toán đám mây giai đoạn 2', st: 'FIX', owner: 'Ninh Thị Hồng', creator: 'Lương Thị Hạnh', created: '24/09/2026', updated: '06/10/2026',
      basis: 'Tách 2 gói: thuê máy chủ ảo, lưu trữ (chào giá trực tuyến) và sao lưu dữ liệu phụ thuộc hạ tầng đang dùng (chỉ định thầu rút gọn).',
      parts: { done: [], na: [], pending: [] }, pkgs: ['GT-2026-0036', 'GT-2026-0037'], docs: { bm01: ['0921/TTr-MS-ĐT', '30/09/2026', 'Ninh Thị Hồng'] },
      checkNok: { 'Giá gói thầu': 'Giá gói thuê máy chủ ảo lấy theo một báo giá; bổ sung tối thiểu 03 báo giá đối chứng.' } },
    { code: 'KHLCNT-2026-0015', src: ['DXMS', 'ĐXMS-2026-0084'], title: 'KHLCNT thuê hạ tầng điện toán đám mây cho hệ thống OSS (huỷ)', st: 'CANCEL', level: 'TD', creator: 'Lương Thị Hạnh', created: '20/09/2026', updated: '28/09/2026',
      basis: 'Một gói thuê hạ tầng 12 tháng.', cancelWhy: 'Chọn nhầm cấp phê duyệt Tập đoàn; huỷ và lập lại KHLCNT-2026-0017 cấp Tổng Công ty.',
      parts: { done: [], na: [], pending: [] }, pkgs: [] },
    { code: 'KHLCNT-2026-0017', src: ['DXMS', 'ĐXMS-2026-0084'], title: 'KHLCNT thuê hạ tầng điện toán đám mây cho hệ thống OSS', st: 'DRAFT', creator: 'Lương Thị Hạnh', created: '29/09/2026', updated: '30/09/2026',
      basis: 'Một gói: dịch vụ thuê hạ tầng liên tục 12 tháng, một nhà cung cấp trong Tập đoàn đáp ứng.',
      parts: { done: [], na: [], pending: [] }, pkgs: ['GT-2026-0034'] },
    { code: 'KHLCNT-2026-0016', src: ['DXMS', 'ĐXMS-2026-0103'], title: 'KHLCNT hệ thống mô phỏng mạng lõi 5G', st: 'CHECK', level: 'TD', creator: 'Phạm Thị Lan', created: '22/09/2026', updated: '03/10/2026',
      basis: 'Tách theo tính chất kỹ thuật: thiết bị mô phỏng (thị trường có nhiều nhà thầu), bản quyền phần mềm lõi độc quyền, phần tích hợp do Trung tâm Mạng lõi đủ năng lực tự thực hiện.',
      parts: { done: [], na: [{ name: 'Chi phí quản lý, giám sát nội bộ', value: 4.5, why: 'Chi phí của Chủ đầu tư, không hình thành gói thầu' }], pending: [] },
      pkgs: ['GT-2026-0032', 'GT-2026-0035', 'GT-2026-0033'], docs: { bm01: ['0981/TTr-TTMS', '28/09/2026', 'Hoàng Quốc Bình'] },
      checkNok: { 'Hình thức và phương thức lựa chọn nhà thầu': 'Gói bản quyền phần mềm lõi áp dụng trường hợp đặc biệt cần văn bản chấp thuận chủ trương của TGĐ Tập đoàn (Điều 21).' } },
    { code: 'KHLCNT-2026-0014', src: ['DXMS', 'ĐXMS-2026-0089'], title: 'KHLCNT thiết bị thử nghiệm môi trường', st: 'OK', owner: 'Phạm Thị Lan', creator: 'Bùi Minh Quang', created: '09/09/2026', updated: '24/09/2026', post: ['KH202609-071-00', '25/09/2026'], sap: '1000009871',
      basis: 'Tách 2 gói theo tính chất thị trường: buồng thử nhiệt ẩm (ít nhà thầu, cần đấu thầu) và thiết bị đo rung thông dụng (chào giá trực tuyến).',
      parts: { done: [], na: [], pending: [] }, pkgs: ['GT-2026-0029', 'GT-2026-0030'],
      docs: { bm01: ['0866/TTr-PCL', '12/09/2026', 'Bùi Minh Quang'], bm02: ['0873/BC-TTMS', '17/09/2026', 'Phạm Thị Lan'], bm03: ['0889/QĐ-VHT', '24/09/2026', 'Hoàng Quốc Bình'] } },
    { code: 'KHLCNT-2026-0013', src: ['KDT', 'KĐT-2026-0012'], title: 'KHLCNT hệ thống đo kiểm anten trong buồng vi sóng', st: 'OK', creator: 'Nguyễn Văn Minh', created: '18/07/2026', updated: '04/08/2026', post: ['KH202608-019-00', '05/08/2026'], sap: '1000009644',
      basis: 'Tách theo trình tự thực hiện và năng lực thị trường: hệ thống buồng đo (hãng sản xuất chiến lược, đàm phán trực tiếp), phần mềm đo mở rộng từ gói đã có KQLCNT (mua sắm trực tiếp), hiệu chuẩn giao đơn vị đo lường của Tập đoàn.',
      parts: { done: [{ name: 'Tư vấn lập hồ sơ khoản đầu tư', value: 0.7, legal: 'HĐ 112/2026/HĐTV ngày 02/02/2026' }], na: [],
        pending: [{ name: 'Mở rộng dải đo 110 GHz (giai đoạn 2)', value: 3.5, why: 'Chưa đủ thông số kỹ thuật; lập KHLCNT bổ sung khi có kết quả thử nghiệm giai đoạn 1' }] },
      pkgs: ['GT-2026-0026', 'GT-2026-0027', 'GT-2026-0028'],
      docs: { bm01: ['0598/TTr-TTVT', '22/07/2026', 'Trần Đức Hải'], bm02: ['0611/BC-TTMS', '29/07/2026', 'Phạm Thị Lan'], bm03: ['0632/QĐ-VHT', '04/08/2026', 'Ngô Đình Khôi'] } },
    { code: 'KHLCNT-2026-0011', src: ['DXMS', 'ĐXMS-2026-0072'], title: 'KHLCNT anten mảng pha phục vụ đo kiểm', st: 'OK', creator: 'Nguyễn Văn Minh', created: '12/08/2026', updated: '26/08/2026', law: true, post: ['IB2600118042-00', '27/08/2026'], sap: '1000009752',
      basis: 'Tách 2 gói: anten mảng pha có yêu cầu kỹ thuật đặc thù (chỉ một số nhà thầu chiến lược đáp ứng) và phụ kiện gá lắp phụ thuộc thiết kế anten trúng thầu.',
      parts: { done: [], na: [], pending: [] }, pkgs: ['GT-2026-0024', 'GT-2026-0031'],
      docs: { bm01: ['0744/TTr-TTVT', '14/08/2026', 'Trần Đức Hải'], bm02: ['0756/BC-TTMS', '20/08/2026', 'Phạm Thị Lan'], bm03: ['0779/QĐ-VHT', '26/08/2026', 'Ngô Đình Khôi'] } },
    { code: 'KHLCNT-2026-0009', src: ['DXMS', 'ĐXMS-2026-0077'], title: 'KHLCNT dây chuyền lắp ráp bo mạch trạm thu phát', st: 'OK', owner: 'Phạm Thị Lan', creator: 'Phan Văn Lộc', created: '18/08/2026', updated: '30/09/2026', post: ['KH202609-006-00', '03/09/2026'], sap: '1000009790',
      basis: 'Tách theo tính chất kỹ thuật: dây chuyền thiết bị (đấu thầu rộng rãi, hai túi hồ sơ) và dịch vụ lắp đặt, đào tạo (chỉ định thầu, phụ thuộc thiết bị trúng thầu).',
      parts: { done: [{ name: 'Tư vấn khảo sát, lập đề xuất mua sắm', value: 0.4, legal: 'HĐ 067/2026/HĐTV ngày 15/04/2026' }],
        na: [{ name: 'Chi phí quản lý, giám sát nội bộ', value: 1.2, why: 'Chi phí của Chủ đầu tư, không hình thành gói thầu' }],
        pending: [{ name: 'Vật tư dự phòng năm thứ hai', value: 21.2, why: 'Chưa xác định được chủng loại; lập KHLCNT khi dây chuyền vận hành ổn định' }] },
      pkgs: ['GT-2026-0021', 'GT-2026-0022'],
      docs: { bm01: ['0688/TTr-NMSX', '21/08/2026', 'Phan Văn Lộc'], bm02: ['0701/BC-TTMS', '27/08/2026', 'Phạm Thị Lan'], bm03: ['0719/QĐ-VHT', '02/09/2026', 'Ngô Đình Khôi'] },
      versions: [{ v: 'v1', at: '02/09/2026', why: 'Phê duyệt lần đầu', no: '0719/QĐ-VHT' },
        { v: 'v2', at: '30/09/2026', why: 'Điều chỉnh giá gói dây chuyền theo dự toán được duyệt; phần vật tư dự phòng tăng tương ứng', no: '0912/QĐ-VHT' }],
      diff: [['GT-2026-0021 · Giá gói thầu', '198,00 tỷ đồng', '195,00 tỷ đồng'], ['GT-2026-0021 · Cơ sở xác định giá', 'Báo giá của 3 nhà cung cấp', 'Dự toán được duyệt sau KHLCNT (QĐ 0905/QĐ-VHT)'],
        ['Phần chưa đủ điều kiện lập KHLCNT', '18,20 tỷ đồng', '21,20 tỷ đồng']] },
    /* 17/11 (phuctd7 "mock thêm dữ liệu cho phần Hợp đồng và Thầu"): 6 KHLCNT trên 6 ĐXMS đã phê duyệt — phủ thêm KHL-02 (đang điều chỉnh), KHL-07 (đang trình phê duyệt),
       gói tư vấn hạn chế hai túi, gói huỷ do không có nhà thầu, gói đang mời / đánh giá / xử lý tình huống; 5 gói có hợp đồng (đang trình ký, đang thực hiện, đang thanh lý, đã thanh lý). */
    { code: 'KHLCNT-2026-0012', src: ['DXMS', 'ĐXMS-2026-0070'], title: 'KHLCNT phần mềm quản lý vòng đời sản phẩm (PLM)', st: 'ADJ', owner: 'Lương Thị Hạnh', creator: 'Lương Thị Hạnh', created: '02/09/2026', updated: '05/10/2026',
      adjWhy: 'Tách phần tích hợp ERP khỏi gói bản quyền theo ý kiến Ban ĐTXD; đổi hình thức gói triển khai sang chỉ định thầu thông thường (nhà thầu ERP hiện hữu).',
      basis: 'Tách 2 gói: bản quyền phần mềm PLM (nhiều hãng đáp ứng — đấu thầu rộng rãi, hai túi hồ sơ) và triển khai, tích hợp với ERP đang vận hành.',
      parts: { done: [], na: [], pending: [] }, pkgs: ['GT-2026-0052', 'GT-2026-0053'],
      docs: { bm01: ['0884/TTr-TTPM', '08/09/2026', 'Lương Thị Hạnh'], bm02: ['', '16/09/2026', 'Phạm Thị Lan'], bm03: ['0902/QĐ-VHT', '25/09/2026', 'Ngô Đình Khôi'] } },
    { code: 'KHLCNT-2026-0010', src: ['DXMS', 'ĐXMS-2026-0069'], title: 'KHLCNT máy phát tín hiệu vector và bộ khuếch đại công suất', st: 'APPROVE', owner: 'Phạm Thị Lan', creator: 'Nguyễn Văn Minh', created: '10/08/2026', updated: '30/09/2026',
      basis: 'Tách 2 gói theo thị trường: máy phát tín hiệu vector 44 GHz (ít hãng, nhập khẩu — đấu thầu rộng rãi quốc tế) và bộ khuếch đại công suất thông dụng (chào giá trực tuyến).',
      parts: { done: [], na: [], pending: [] }, pkgs: ['GT-2026-0050', 'GT-2026-0051'],
      docs: { bm01: ['0802/TTr-TTVT', '14/08/2026', 'Trần Đức Hải'], bm02: ['', '26/08/2026', 'Phạm Thị Lan'] } },
    { code: 'KHLCNT-2026-0007', src: ['DXMS', 'ĐXMS-2026-0064'], title: 'KHLCNT dịch vụ kiểm định, hiệu chuẩn thiết bị đo năm 2026', st: 'OK', owner: 'Bùi Minh Quang', creator: 'Bùi Minh Quang', created: '25/05/2026', updated: '12/06/2026', post: ['KH202606-044-00', '13/06/2026'], sap: '1000009402',
      basis: 'Một gói: dịch vụ kiểm định, hiệu chuẩn định kỳ theo danh mục thiết bị đo, nhiều tổ chức được chỉ định đáp ứng — chào giá trực tuyến.',
      parts: { done: [], na: [], pending: [] }, pkgs: ['GT-2026-0049'],
      docs: { bm01: ['0402/TTr-PCL', '28/05/2026', 'Bùi Minh Quang'], bm02: ['', '04/06/2026', 'Phạm Thị Lan'], bm03: ['0431/QĐ-VHT', '11/06/2026', 'Hoàng Quốc Bình'] } },
    { code: 'KHLCNT-2026-0005', src: ['DXMS', 'ĐXMS-2026-0053'], title: 'KHLCNT vật tư, linh kiện sản xuất thử lô RRU 5G', st: 'OK', owner: 'Phạm Thị Lan', creator: 'Phan Văn Lộc', created: '08/05/2026', updated: '16/06/2026', post: ['KH202606-021-00', '17/06/2026'], sap: '1000009415',
      basis: 'Tách 4 gói theo nhóm hàng và nguồn cung: linh kiện bán dẫn nhập khẩu, bo mạch PCB, vỏ cơ khí (thị trường trong nước nhiều nhà cung cấp) và vận chuyển, lưu kho hàng nhập khẩu.',
      parts: { done: [], na: [{ name: 'Kiểm tra chất lượng linh kiện đầu vào (IQC nội bộ)', value: 2.0, why: 'Nhà máy tự thực hiện bằng nguồn lực sẵn có, không hình thành gói thầu' }], pending: [] },
      pkgs: ['GT-2026-0045', 'GT-2026-0046', 'GT-2026-0047', 'GT-2026-0048'],
      docs: { bm01: ['0371/TTr-NMSX', '12/05/2026', 'Phan Văn Lộc'], bm02: ['', '22/05/2026', 'Phạm Thị Lan'], bm03: ['0448/QĐ-VHT', '15/06/2026', 'Ngô Đình Khôi'] },
      versions: [{ v: 'v1', at: '29/05/2026', why: 'Phê duyệt lần đầu', no: '0398/QĐ-VHT' },
        { v: 'v2', at: '15/06/2026', why: 'Tách gói vận chuyển, lưu kho khỏi gói linh kiện bán dẫn (nhà thầu nước ngoài không nhận giao tại kho)', no: '0448/QĐ-VHT' }],
      diff: [['GT-2026-0045 · Giá gói thầu', '39,20 tỷ đồng', '38,00 tỷ đồng'], ['GT-2026-0045 · Phạm vi', 'Linh kiện bán dẫn, giao tại kho Nhà máy', 'Linh kiện bán dẫn, giao tại cảng Hải Phòng (CIF)'],
        ['GT-2026-0048 · Gói thầu', 'Không có', 'Vận chuyển, lưu kho linh kiện nhập khẩu — 1,20 tỷ đồng']] },
    { code: 'KHLCNT-2026-0002', src: ['DXMS', 'ĐXMS-2026-0047'], title: 'KHLCNT dịch vụ tư vấn thẩm tra thiết kế vi mạch ASIC', st: 'OK', level: 'TD', owner: 'Ninh Thị Hồng', creator: 'Trịnh Quốc Việt', created: '02/04/2026', updated: '06/05/2026', law: true, post: ['IB2600041127-00', '07/05/2026'], sap: '1000009188',
      basis: 'Tách 3 gói: tư vấn thẩm tra thiết kế (yêu cầu kỹ thuật cao, chỉ một số đơn vị đủ năng lực — đấu thầu hạn chế, hai túi hồ sơ), đào tạo thiết kế vật lý, thuê máy chủ mô phỏng.',
      parts: { done: [], na: [], pending: [] }, pkgs: ['GT-2026-0042', 'GT-2026-0043', 'GT-2026-0044'],
      docs: { bm01: ['0288/TTr-TTVM', '06/04/2026', 'Trịnh Quốc Việt'], bm02: ['0301/BC-TTĐ', '20/04/2026', 'Hoàng Quốc Bình'], bm03: ['612/QĐ-CNVTQĐ', '05/05/2026', 'TGĐ Tập đoàn'] } },
    { code: 'KHLCNT-2026-0001', src: ['DXMS', 'ĐXMS-2026-0044'], title: 'KHLCNT thiết bị truyền dẫn quang cho phòng lab mạng lõi', st: 'OK', owner: 'Ninh Thị Hồng', creator: 'Đặng Thu Trang', created: '16/03/2026', updated: '03/04/2026', post: ['KH202604-008-00', '04/04/2026'], sap: '1000009102',
      basis: 'Tách 2 gói: thiết bị truyền dẫn DWDM (giá trị lớn — đấu thầu rộng rãi qua mạng) và module quang, dây nhảy (hàng thông dụng — chào giá trực tuyến).',
      parts: { done: [{ name: 'Tư vấn khảo sát tuyến, lập đề xuất kỹ thuật', value: 0.4, legal: 'HĐ 021/2026/HĐTV ngày 12/01/2026' }],
        na: [{ name: 'Chi phí quản lý, giám sát nội bộ', value: 0.6, why: 'Chi phí của Chủ đầu tư, không hình thành gói thầu' }],
        pending: [{ name: 'Mở rộng tuyến kết nối liên phòng lab (giai đoạn 2)', value: 1.4, why: 'Chờ phương án mặt bằng phòng lab mới; lập KHLCNT bổ sung khi có thiết kế' }] },
      pkgs: ['GT-2026-0040', 'GT-2026-0041'],
      docs: { bm01: ['0211/TTr-TTML', '19/03/2026', 'Đặng Thu Trang'], bm02: ['', '26/03/2026', 'Phạm Thị Lan'], bm03: ['0247/QĐ-VHT', '02/04/2026', 'Ngô Đình Khôi'] } },
  ];
  /* Gói thầu: st = giai đoạn tổ chức LCNT; giá, hình thức, phương thức, loại HĐ, tiến độ là nội dung bắt buộc của KHLCNT (Điều 22 khoản 2). */
  const PK_ST = { KH: ['Chờ phê duyệt KHLCNT', 'default'], HS: ['Đang lập hồ sơ mời', 'info'], MOI: ['Đang mời thầu', 'info'], DG: ['Đang đánh giá', 'info'],
    TH: ['Đang xử lý tình huống', 'warning'], KQ_CHO: ['Chờ phê duyệt KQLCNT', 'warning'], KQ: ['Đã có KQLCNT', 'success'], HUY: ['Đã huỷ thầu', 'error'] };
  const LV = { KH: 0, HS: 1, MOI: 2, DG: 3, TH: 3, KQ_CHO: 4, KQ: 5, HUY: 3 };
  /* Backbone gói thầu LC-01…11, LC-X (THAU-TT-1311 §4.1). CHO-KH không có trong §4.1: gói của KHLCNT chưa Hoàn thành (GIẢ LẬP, gói chỉ mở ở MS18 bước 23). */
  const LC = { 'CHO-KH': ['Chờ hoàn thành KHLCNT', 'default', 'Lập KHLCNT'], 'LC-01': ['Đang chuẩn bị hồ sơ LCNT', 'info', 'Chuẩn bị hồ sơ LCNT'],
    'LC-02': ['Đang thẩm định hồ sơ LCNT', 'info', 'Thẩm định/phê duyệt hồ sơ'], 'LC-03': ['Đang phát hành hồ sơ LCNT', 'info', 'Phát hành/gửi mời'],
    'LC-04': ['Chờ nhà thầu phản hồi/nộp hồ sơ', 'info', 'Chờ hồ sơ nhà thầu'], 'LC-05': ['Đang mở/tiếp nhận hồ sơ', 'info', 'Mở/tiếp nhận hồ sơ'],
    'LC-06': ['Đang đánh giá hồ sơ', 'info', 'Đánh giá'], 'LC-07': ['Đang thương thảo/đàm phán', 'info', 'Thương thảo/đàm phán'],
    'LC-08': ['Đang trình KQLCNT', 'warning', 'Trình KQLCNT'], 'LC-09': ['Đang công khai KQLCNT', 'info', 'Công khai KQLCNT'],
    'LC-10': ['Đang chuyển ký hợp đồng', 'warning', 'Chuyển ký hợp đồng'], 'LC-11': ['Hoàn thành lựa chọn nhà thầu', 'success', 'Hoàn thành LCNT'],
    'LC-X': ['Đã hủy / Không thực hiện', 'error', 'Hủy/Không thực hiện'] };
  /* Mẫu: trạng thái cũ → LC (§2): Phát thầu → chờ hồ sơ; tình huống 01 HSDT lúc đóng thầu → mở/tiếp nhận; có KQLCNT → chuyển ký HĐ, đã có hợp đồng → Hoàn thành. */
  const LC_MAP = { KH: 'CHO-KH', HS: 'LC-01', MOI: 'LC-04', DG: 'LC-06', TH: 'LC-05', KQ_CHO: 'LC-08', KQ: 'LC-10', HUY: 'LC-X' };
  /* Người xử lý theo giai đoạn gói (GIẢ LẬP tới khi MS19 chạy theo gói — T5). */
  const LC_WHO = { 'LC-01': 'Tổ chuyên gia', 'LC-02': 'Tổ thẩm định', 'LC-03': 'Bên mời thầu — Bộ phận Thầu', 'LC-04': 'Bên mời thầu — Bộ phận Thầu', 'LC-05': 'Bên mời thầu — Bộ phận Thầu',
    'LC-06': 'Tổ chuyên gia', 'LC-07': 'Tổ chuyên gia', 'LC-08': 'Tổ thẩm định', 'LC-09': 'Bên mời thầu — Bộ phận Thầu', 'LC-10': 'Phòng Pháp chế — Hợp đồng' };
  const PK = [
    { code: 'GT-2026-0021', sap: '3000004812', kh: 'KHLCNT-2026-0009', name: 'Cung cấp dây chuyền lắp ráp bo mạch trạm thu phát', type: 'HH_LD', price: 195.0, priceBasis: 'Dự toán được duyệt sau KHLCNT', est: ['0905/QĐ-VHT', '25/09/2026', 195.0],
      form: 'DTRR', method: '1GD2T', intl: true, online: true, start: 'Quý IV/2026', selTime: '60 ngày', execTime: '240 ngày', contract: 'TRON_GOI', st: 'KQ',
      lots: [['Phần 1: Thiết bị gắn linh kiện SMT', 128.0], ['Phần 2: Thiết bị kiểm tra quang học, X-ray', 67.0]],
      items: [['Máy gắn linh kiện tốc độ cao', 'Máy', 4], ['Lò hàn đối lưu 10 vùng nhiệt', 'Máy', 2], ['Máy kiểm tra quang học tự động (AOI)', 'Máy', 2], ['Máy kiểm tra X-ray 3D', 'Máy', 1]],
      bidders: [['NCC-000003', 186.4, 'Đạt', 'Đạt', 88, 'Thương thảo không thành công: không chấp nhận tiến độ giao hàng 240 ngày', [0, 1.2, 0]], ['NCC-000009', 191.2, 'Đạt', 'Đạt', 85, null, [0.35, 0, 2.0]], ['NCC-000002', 152.0, 'Đạt', 'Không đạt', 61], ['NCC-000008', 199.8, 'Đạt', 'Đạt', 82]],
      winner: 'NCC-000009', kq: ['0961/QĐ-VHT', '05/10/2026'],
      events: [['Thương thảo', '22/09/2026', 'Thương thảo không thành công với nhà thầu xếp hạng thứ nhất (Gamma Technologies) — mời nhà thầu xếp hạng thứ hai (Iota Electronics) vào thương thảo (Điều 36).', 'Đã xử lý'],
        ['Kiến nghị về KQLCNT', '07/10/2026', 'Công ty Cổ phần Thiết bị Beta kiến nghị về việc đánh giá kỹ thuật không đạt.', 'Đang giải quyết'],
        ['Tạm dừng ký hợp đồng', '07/10/2026', 'Người có thẩm quyền tạm dừng ký hợp đồng đến khi có văn bản giải quyết kiến nghị (Điều 38).', 'Đang hiệu lực']] },
    { code: 'GT-2026-0022', kh: 'KHLCNT-2026-0009', name: 'Dịch vụ lắp đặt, đào tạo vận hành dây chuyền lắp ráp', type: 'PTV', price: 18.6, priceBasis: 'Báo giá', form: 'CDT_TT', method: '1GD1T',
      intl: false, online: false, start: 'Quý IV/2026', selTime: '30 ngày', execTime: '90 ngày', contract: 'TRON_GOI', st: 'DG',
      items: [['Lắp đặt, căn chỉnh dây chuyền', 'Gói', 1], ['Đào tạo vận hành, bảo trì', 'Khoá', 3]], bidders: [['NCC-000011', 18.1, 'Đạt', 'Đạt', null]] },
    { code: 'GT-2026-0024', kh: 'KHLCNT-2026-0011', hdTime: '150 ngày', name: 'Cung cấp anten mảng pha băng Ka phục vụ đo kiểm', type: 'MS_HH', price: 148.5, priceBasis: 'Báo giá và giá niêm yết của hãng', form: 'DTHC', method: '1GD1T',
      intl: true, online: true, start: 'Quý III/2026', selTime: '50 ngày', execTime: '180 ngày', contract: 'TRON_GOI', st: 'MOI', short: ['NCC-000003', 'NCC-000008', 'NCC-000009'],
      items: [['Anten mảng pha băng Ka 256 phần tử', 'Bộ', 4], ['Bộ điều khiển chùm tia', 'Bộ', 4]],
      events: [['Kiến nghị trước KQLCNT', '28/09/2026', 'Theta Messtechnik kiến nghị yêu cầu kinh nghiệm 03 hợp đồng tương tự là hạn chế cạnh tranh.', 'Đã giải quyết — giữ nguyên HSMT', '06/10/2026']] },
    { code: 'GT-2026-0026', kh: 'KHLCNT-2026-0013', name: 'Cung cấp hệ thống buồng đo anten vi sóng', type: 'HH_LD', price: 120.0, priceBasis: 'Giá niêm yết của hãng sản xuất chiến lược', form: 'DPTT', method: '1GD1T',
      intl: true, online: false, start: 'Quý III/2026', selTime: '45 ngày', execTime: '300 ngày', contract: 'TRON_GOI', st: 'KQ_CHO', short: ['NCC-000008', 'NCC-000003'],
      items: [['Buồng đo không phản xạ 18–110 GHz', 'Hệ thống', 1], ['Bàn xoay định vị đa trục', 'Bộ', 1]], bidders: [['NCC-000008', 116.4, 'Đạt', 'Đạt', null], ['NCC-000003', 119.0, 'Đạt', 'Đạt', null]], winner: 'NCC-000008',
      /* T49 (GIẢ LẬP, dữ liệu báo cáo kiến nghị): kiến nghị đã giải quyết, phần tử thứ 5 = ngày giải quyết. */
      events: [['Kiến nghị trước KQLCNT', '12/09/2026', 'Gamma Technologies kiến nghị tiêu chí dải tần 18–110 GHz chỉ phù hợp một hãng.', 'Đã giải quyết — sửa đổi HSMT, gia hạn đóng thầu', '01/10/2026']] },
    { code: 'GT-2026-0027', sap: '3000004655', kh: 'KHLCNT-2026-0013', name: 'Mở rộng bản quyền phần mềm điều khiển đo', type: 'PM', price: 12.5, priceBasis: 'KQLCNT gói tương tự GT-2025-0118', form: 'MSTT', method: '1GD1T', ref: 'GT-2025-0118',
      intl: false, online: false, start: 'Quý III/2026', selTime: '20 ngày', execTime: '30 ngày', contract: 'DG_CD', st: 'KQ', prior: ['GT-2025-0118', '14/11/2025', 'Đơn giá không cao hơn, khối lượng 120% (≤ 150%)'],
      items: [['Bản quyền mô-đun đo trường xa', 'Bản quyền', 6]], bidders: [['NCC-000001', 12.3, 'Đạt', 'Đạt', null]], winner: 'NCC-000001', kq: ['0655/QĐ-VHT', '21/08/2026'],
      events: [['Kiến nghị về KQLCNT', '24/08/2026', 'Nhà thầu không được mời kiến nghị việc áp dụng mua sắm trực tiếp theo gói tương tự GT-2025-0118.', 'Đã giải quyết — giữ nguyên KQLCNT', '30/09/2026']] },
    { code: 'GT-2026-0028', kh: 'KHLCNT-2026-0013', name: 'Hiệu chuẩn hệ thống đo sau lắp đặt', type: 'PTV', price: 1.8, priceBasis: 'Đơn giá dịch vụ nội bộ Tập đoàn', form: 'GIAO_NV', method: '1GD1T',
      intl: false, online: false, start: 'Quý I/2027', selTime: '10 ngày', execTime: '30 ngày', contract: 'TRON_GOI', st: 'KQ', assignee: 'Trung tâm Đo lường Viettel', kq: ['0660/QĐ-VHT', '24/08/2026'],
      items: [['Hiệu chuẩn buồng đo, cấp chứng chỉ', 'Gói', 1]] },
    { code: 'GT-2026-0029', kh: 'KHLCNT-2026-0014', name: 'Cung cấp buồng thử nhiệt ẩm', type: 'MS_HH', price: 14.2, priceBasis: 'Báo giá', form: 'DTRR', method: '1GD1T', intl: false, online: true,
      start: 'Quý IV/2026', selTime: '45 ngày', execTime: '120 ngày', contract: 'TRON_GOI', st: 'TH', items: [['Buồng thử nhiệt ẩm 1.000 lít', 'Buồng', 2]], bidders: [['NCC-000004', 13.9, 'Đạt', null, null]],
      events: [['Chỉ có 01 nhà thầu nộp hồ sơ', '02/10/2026', 'Tại thời điểm đóng thầu chỉ có 01 HSDT. Tổ chuyên gia đề xuất gia hạn thời điểm đóng thầu 05 ngày để thu hút thêm nhà thầu (Điều 36).', 'Chờ Chủ đầu tư quyết định']] },
    { code: 'GT-2026-0030', kh: 'KHLCNT-2026-0014', name: 'Cung cấp thiết bị đo rung', type: 'MS_HH', price: 4.5, priceBasis: 'Báo giá', form: 'CGTT', method: '1GD1T', intl: false, online: true,
      start: 'Quý IV/2026', selTime: '15 ngày', execTime: '60 ngày', contract: 'TRON_GOI', st: 'HUY', items: [['Bộ đo rung 3 trục', 'Bộ', 5]],
      bidders: [['NCC-000004', 4.92, 'Đạt', 'Đạt', null], ['NCC-000001', 5.10, 'Đạt', 'Đạt', null]],
      events: [['Tất cả giá chào vượt giá gói thầu', '30/09/2026', 'Hai HSCG đều có giá vượt giá gói thầu 4,50 tỷ đồng. Chủ đầu tư quyết định huỷ thầu, cập nhật giá gói theo báo giá mới và tổ chức chào giá lại.', 'Đã xử lý'],
        ['Huỷ thầu', '01/10/2026', 'Quyết định huỷ thầu 0931/QĐ-VHT — lý do: tất cả HSCG vượt giá gói thầu (Điều 34).', 'Đã ban hành']] },
    { code: 'GT-2026-0031', kh: 'KHLCNT-2026-0011', secret: true, name: 'Cung cấp bộ gá lắp, cáp RF cho anten mảng pha', type: 'MS_HH', price: 3.5, priceBasis: 'Báo giá', form: 'CDT_RG', method: '1GD1T', intl: false, online: false,
      start: 'Quý IV/2026', selTime: '15 ngày', execTime: '45 ngày', contract: 'TRON_GOI', st: 'HS', items: [['Bộ gá lắp anten trên tháp đo', 'Bộ', 4], ['Cáp RF tổn hao thấp 40 GHz', 'Sợi', 16]] },
    { code: 'GT-2026-0032', kh: 'KHLCNT-2026-0016', srcs: [['DXMS', 'ĐXMS-2026-0103', 150.0], ['DXMS', 'ĐXMS-2026-0089', 40.0]], name: 'Cung cấp hệ thống mô phỏng mạng lõi 5G', type: 'HH_LD', price: 190.0, priceBasis: 'Báo giá', form: 'DTRR', method: '1GD2T', intl: true, online: true,
      start: 'Quý I/2027', selTime: '60 ngày', execTime: '210 ngày', contract: 'TRON_GOI', st: 'KH', items: [['Hệ thống mô phỏng lưu lượng mạng lõi', 'Hệ thống', 1], ['Máy chủ mô phỏng', 'Máy', 12]] },
    { code: 'GT-2026-0035', kh: 'KHLCNT-2026-0016', cur: 'USD', rate: 25400, name: 'Bản quyền phần mềm lõi mô phỏng giao thức', type: 'PM', price: 6.0, priceBasis: 'Giá niêm yết của hãng (độc quyền)', form: 'DAC_BIET', method: '1GD1T', intl: true, online: false,
      start: 'Quý I/2027', selTime: '30 ngày', execTime: '30 ngày', contract: 'TRON_GOI', st: 'KH', items: [['Bản quyền phần mềm mô phỏng giao thức 5GC', 'Bản quyền', 1]] },
    { code: 'GT-2026-0033', kh: 'KHLCNT-2026-0016', name: 'Tích hợp hệ thống mô phỏng vào phòng lab mạng lõi', type: 'PTV', price: 10.0, priceBasis: 'Dự toán', form: 'TU_TH', method: '1GD1T', intl: false, online: false,
      start: 'Quý II/2027', selTime: '10 ngày', execTime: '90 ngày', contract: 'TRON_GOI', st: 'KH', assignee: 'Trung tâm Mạng lõi', items: [['Tích hợp, kiểm thử hệ thống', 'Gói', 1]] },
    { code: 'GT-2026-0034', kh: 'KHLCNT-2026-0017', name: 'Dịch vụ thuê hạ tầng điện toán đám mây 12 tháng', type: 'PTV', price: 9.6, priceBasis: 'Đơn giá dịch vụ của đơn vị thành viên', form: 'DAT_HANG', method: '1GD1T', intl: false, online: false,
      start: 'Tháng 11/2026', selTime: '15 ngày', execTime: '365 ngày', contract: 'DG_CD', st: 'KH', assignee: 'Viettel IDC (đơn vị thành viên)', items: [['Thuê máy chủ ảo, lưu trữ', 'Tháng', 12]] },
    /* T67 dữ liệu demo: gói của KHLCNT-2026-0018…0020 (chào giá, chỉ định thầu rút gọn, rộng rãi). */
    { code: 'GT-2026-0036', kh: 'KHLCNT-2026-0018', name: 'Dịch vụ thuê máy chủ ảo, lưu trữ 12 tháng (giai đoạn 2)', type: 'PTV', price: 8.4, priceBasis: 'Báo giá của 3 nhà cung cấp', form: 'CGTT', method: '1GD1T', intl: false, online: true,
      start: 'Quý IV/2026', selTime: '15 ngày', execTime: '365 ngày', contract: 'DG_CD', st: 'KH', items: [['Máy chủ ảo 32 vCPU / 128 GB', 'Máy-tháng', 96], ['Lưu trữ khối 200 TB', 'Tháng', 12]] },
    { code: 'GT-2026-0037', kh: 'KHLCNT-2026-0018', name: 'Dịch vụ sao lưu, khôi phục dữ liệu hệ thống OSS', type: 'PTV', price: 2.8, priceBasis: 'Đơn giá hợp đồng đang thực hiện', form: 'CDT_RG', method: '1GD1T', intl: false, online: false,
      start: 'Quý IV/2026', selTime: '10 ngày', execTime: '365 ngày', contract: 'TRON_GOI', st: 'KH', items: [['Sao lưu hằng ngày, lưu 90 ngày', 'Tháng', 12]] },
    { code: 'GT-2026-0038', kh: 'KHLCNT-2026-0019', name: 'Bảo trì hệ thống điều hoà phòng sạch năm 2027', type: 'PTV', price: 6.5, priceBasis: 'Báo giá', form: 'DTRR', method: '1GD1T', intl: false, online: true,
      start: 'Quý IV/2026', selTime: '45 ngày', execTime: '365 ngày', contract: 'TRON_GOI', st: 'KH', items: [['Bảo trì định kỳ AHU, chiller', 'Quý', 4], ['Thay lọc HEPA', 'Lần', 2]] },
    { code: 'GT-2026-0039', kh: 'KHLCNT-2026-0020', name: 'Bảo trì hệ thống điều hoà phòng sạch năm 2028', type: 'PTV', price: 7.9, priceBasis: 'Báo giá', form: 'CGTT', method: '1GD1T', intl: false, online: true,
      start: 'Quý III/2027', selTime: '15 ngày', execTime: '365 ngày', contract: 'TRON_GOI', st: 'KH', items: [['Bảo trì định kỳ AHU, chiller', 'Quý', 4], ['Thay lọc HEPA, kiểm định phòng sạch', 'Lần', 2]] },
    /* 17/11 dữ liệu demo: gói của KHLCNT-2026-0001 / 0002 / 0005 / 0007 / 0010 / 0012. */
    { code: 'GT-2026-0040', kh: 'KHLCNT-2026-0001', name: 'Cung cấp thiết bị truyền dẫn quang DWDM 400G', type: 'MS_HH', price: 26.4, priceBasis: 'Báo giá của 3 nhà cung cấp', form: 'DTRR', method: '1GD1T', intl: false, online: true,
      start: 'Quý II/2026', selTime: '45 ngày', execTime: '150 ngày', contract: 'TRON_GOI', st: 'KQ', mau: '1.0',
      items: [['Thiết bị ROADM 400G 20 hướng', 'Bộ', 4], ['Card transponder 400G', 'Card', 16], ['Phần mềm quản lý mạng quang', 'Bản quyền', 1]],
      bidders: [['NCC-000002', 25.1, 'Đạt', 'Đạt', null], ['NCC-000001', 26.2, 'Đạt', 'Đạt', null], ['NCC-000003', 25.9, 'Đạt', 'Không đạt', null, 'Không đáp ứng yêu cầu chuyển mạch bảo vệ dưới 50 ms']],
      winner: 'NCC-000002', kq: ['0318/QĐ-VHT', '18/05/2026'] },
    { code: 'GT-2026-0041', kh: 'KHLCNT-2026-0001', name: 'Cung cấp module quang, dây nhảy quang', type: 'MS_HH', price: 4.2, priceBasis: 'Báo giá', form: 'CGTT', method: '1GD1T', intl: false, online: true,
      start: 'Quý II/2026', selTime: '15 ngày', execTime: '45 ngày', contract: 'TRON_GOI', st: 'KQ', mau: '7.2',
      items: [['Module quang QSFP-DD 400G', 'Cái', 32], ['Dây nhảy quang LC-LC 5 m', 'Sợi', 100]],
      bidders: [['NCC-000001', 3.86, 'Đạt', 'Đạt', null], ['NCC-000002', 3.95, 'Đạt', 'Đạt', null], ['NCC-000012', 4.05, 'Đạt', 'Đạt', null]], winner: 'NCC-000001', kq: ['0296/QĐ-VHT', '06/05/2026'] },
    { code: 'GT-2026-0042', kh: 'KHLCNT-2026-0002', name: 'Tư vấn thẩm tra thiết kế vi mạch ASIC 28 nm', type: 'TV', price: 9.5, priceBasis: 'Dự toán chi phí tư vấn', form: 'DTHC', method: '1GD2T', intl: true, online: true,
      start: 'Quý II/2026', selTime: '50 ngày', execTime: '180 ngày', contract: 'THOI_GIAN', st: 'KQ', mau: '5', short: ['NCC-000006', 'NCC-000011', 'NCC-000008'],
      items: [['Thẩm tra thiết kế RTL, kiểm chứng chức năng', 'Tháng chuyên gia', 20], ['Thẩm tra thiết kế vật lý, timing sign-off', 'Tháng chuyên gia', 12]],
      bidders: [['NCC-000006', 9.2, 'Đạt', 'Đạt', 86], ['NCC-000008', 9.45, 'Đạt', 'Đạt', 82, null, [0.05, 0, 0.2]], ['NCC-000011', 8.6, 'Đạt', 'Không đạt', 64]], winner: 'NCC-000006', kq: ['0402/QĐ-VHT', '22/06/2026'] },
    { code: 'GT-2026-0043', kh: 'KHLCNT-2026-0002', name: 'Đào tạo quy trình thiết kế vật lý (physical design)', type: 'PTV', price: 1.6, priceBasis: 'Báo giá', form: 'CDT_RG', method: '1GD1T', intl: false, online: false,
      start: 'Quý II/2026', selTime: '10 ngày', execTime: '60 ngày', contract: 'TRON_GOI', st: 'KQ', mau: '8.2',
      items: [['Khoá đào tạo thiết kế vật lý nâng cao', 'Khoá', 2], ['Tài liệu, bài thực hành', 'Bộ', 30]], bidders: [['NCC-000011', 1.55, 'Đạt', 'Đạt', null]], winner: 'NCC-000011', kq: ['0352/QĐ-VHT', '25/05/2026'] },
    { code: 'GT-2026-0044', kh: 'KHLCNT-2026-0002', name: 'Thuê máy chủ mô phỏng phần cứng (emulation) 6 tháng', type: 'PTV', price: 0.9, priceBasis: 'Báo giá', form: 'CGTT', method: '1GD1T', intl: false, online: true,
      start: 'Quý III/2026', selTime: '15 ngày', execTime: '180 ngày', contract: 'DG_CD', st: 'HUY', items: [['Thuê hệ thống emulation 100 triệu cổng', 'Tháng', 6]],
      events: [['Không có nhà thầu tham dự', '28/07/2026', 'Hết thời hạn chào giá không có HSCG. Chủ đầu tư quyết định huỷ thầu và chuyển nhu cầu sang thuê theo hợp đồng khung của Tập đoàn.', 'Đã xử lý'],
        ['Huỷ thầu', '30/07/2026', 'Quyết định huỷ thầu 0571/QĐ-VHT — lý do: không có nhà thầu tham dự (Điều 34).', 'Đã ban hành']] },
    { code: 'GT-2026-0045', kh: 'KHLCNT-2026-0005', cur: 'USD', rate: 25400, name: 'Cung cấp linh kiện bán dẫn (FPGA, ADC / DAC) cho lô RRU 5G', type: 'MS_HH', price: 38.0, priceBasis: 'Báo giá và giá niêm yết của nhà phân phối', form: 'DTRR', method: '1GD1T', intl: true, online: true,
      start: 'Quý III/2026', selTime: '50 ngày', execTime: '120 ngày', contract: 'DG_CD', st: 'DG',
      items: [['FPGA SoC RF 16 nm', 'Con', 220], ['ADC 14 bit 3 GSPS', 'Con', 440], ['DAC 16 bit 6 GSPS', 'Con', 440]],
      bidders: [['NCC-000009', 36.4, 'Đạt', 'Đạt', null, null, [0, 0, 0.9]], ['NCC-000003', 37.1, 'Đạt', null, null], ['NCC-000001', 35.2, 'Không đạt', null, null, 'Không có giấy uỷ quyền bán hàng của hãng sản xuất'], ['NCC-000010', 34.8, 'Đạt', null, null, null, [0, 0.6, 0]]] },
    { code: 'GT-2026-0046', kh: 'KHLCNT-2026-0005', name: 'Cung cấp bo mạch PCB nhiều lớp cho lô RRU 5G', type: 'MS_HH', price: 14.5, priceBasis: 'Báo giá', form: 'DTRR', method: '1GD1T', intl: false, online: true,
      start: 'Quý III/2026', selTime: '45 ngày', execTime: '90 ngày', contract: 'TRON_GOI', st: 'MOI', items: [['Bo mạch PCB 16 lớp vật liệu cao tần', 'Tấm', 220], ['Bo mạch nguồn 8 lớp', 'Tấm', 220]],
      events: [['Làm rõ HSMT', '29/09/2026', 'Hai nhà thầu đề nghị làm rõ yêu cầu hằng số điện môi vật liệu nền; Bên mời thầu đã trả lời trên hệ thống, không thay đổi HSMT.', 'Đã xử lý']] },
    { code: 'GT-2026-0047', kh: 'KHLCNT-2026-0005', name: 'Cung cấp vỏ cơ khí, tản nhiệt nhôm cho RRU', type: 'MS_HH', price: 8.3, priceBasis: 'Báo giá', form: 'CGTT', method: '1GD1T', intl: false, online: true,
      start: 'Quý III/2026', selTime: '15 ngày', execTime: '75 ngày', contract: 'TRON_GOI', st: 'TH', items: [['Vỏ nhôm đúc IP65', 'Bộ', 220], ['Tản nhiệt nhôm định hình', 'Bộ', 220]],
      bidders: [['NCC-000010', 7.6, 'Đạt', 'Đạt', null], ['NCC-000004', 8.1, 'Đạt', 'Đạt', null]],
      events: [['Nhà thầu xếp hạng thứ nhất có tên trong danh sách hạn chế', '25/09/2026', 'Kappa đang bị hạn chế tham dự do vi phạm tiến độ (0311/QĐ-VHT). Tổ chuyên gia đề xuất xem xét nhà thầu xếp hạng thứ hai (Delta HN).', 'Chờ Chủ đầu tư quyết định']] },
    /* T80 L1: mua sắm trực tiếp theo gói tương tự GT-2025-0207 (đấu thầu rộng rãi, KQLCNT 15/12/2025 — D.lcPriorPkgs). */
    { code: 'GT-2026-0048', kh: 'KHLCNT-2026-0005', name: 'Dịch vụ vận chuyển, lưu kho linh kiện nhập khẩu', type: 'PTV', price: 1.2, priceBasis: 'Đơn giá gói tương tự GT-2025-0207 (đấu thầu rộng rãi)', form: 'MSTT', method: '1GD1T', intl: false, online: false, ref: 'GT-2025-0207',
      start: 'Quý IV/2026', selTime: '10 ngày', execTime: '120 ngày', contract: 'DG_CD', st: 'HS', items: [['Vận chuyển cảng Hải Phòng – Hoà Lạc', 'Chuyến', 6], ['Lưu kho ngoại quan', 'Tháng', 4]] },
    { code: 'GT-2026-0049', kh: 'KHLCNT-2026-0007', name: 'Dịch vụ kiểm định, hiệu chuẩn thiết bị đo năm 2026', type: 'PTV', price: 5.4, priceBasis: 'Báo giá của 3 tổ chức kiểm định', form: 'CGTT', method: '1GD1T', intl: false, online: true,
      start: 'Quý III/2026', selTime: '15 ngày', execTime: '150 ngày', contract: 'DG_CD', st: 'KQ', mau: '3.0',
      items: [['Hiệu chuẩn máy phân tích phổ, máy phát tín hiệu', 'Thiết bị', 46], ['Kiểm định thiết bị đo điện, nguồn', 'Thiết bị', 80]],
      bidders: [['NCC-000004', 5.05, 'Đạt', 'Đạt', null], ['NCC-000011', 5.3, 'Đạt', 'Đạt', null], ['NCC-000006', 5.38, 'Đạt', 'Không đạt', null]], winner: 'NCC-000004', kq: ['0751/QĐ-VHT', '24/09/2026'] },
    { code: 'GT-2026-0050', kh: 'KHLCNT-2026-0010', cur: 'EUR', rate: 27450, name: 'Cung cấp máy phát tín hiệu vector 44 GHz', type: 'MS_HH', price: 31.2, priceBasis: 'Giá niêm yết của hãng và báo giá', form: 'DTRR', method: '1GD1T', intl: true, online: true,
      start: 'Quý IV/2026', selTime: '50 ngày', execTime: '150 ngày', contract: 'TRON_GOI', st: 'KH', items: [['Máy phát tín hiệu vector 44 GHz', 'Máy', 3], ['Phần mềm tạo tín hiệu 5G NR', 'Bản quyền', 3]] },
    { code: 'GT-2026-0051', kh: 'KHLCNT-2026-0010', name: 'Cung cấp bộ khuếch đại công suất băng rộng', type: 'MS_HH', price: 11.4, priceBasis: 'Báo giá', form: 'CGTT', method: '1GD1T', intl: false, online: true,
      start: 'Quý IV/2026', selTime: '15 ngày', execTime: '90 ngày', contract: 'TRON_GOI', st: 'KH', items: [['Bộ khuếch đại công suất 6–18 GHz 50 W', 'Bộ', 4], ['Bộ khuếch đại công suất 18–40 GHz 20 W', 'Bộ', 2]] },
    { code: 'GT-2026-0052', kh: 'KHLCNT-2026-0012', name: 'Cung cấp bản quyền phần mềm PLM 200 người dùng', type: 'PM', price: 16.8, priceBasis: 'Báo giá của 3 hãng', form: 'DTRR', method: '1GD2T', intl: true, online: true,
      start: 'Quý IV/2026', selTime: '60 ngày', execTime: '60 ngày', contract: 'TRON_GOI', st: 'KH', items: [['Bản quyền PLM người dùng thiết kế', 'Bản quyền', 80], ['Bản quyền PLM người dùng xem / phê duyệt', 'Bản quyền', 120]] },
    { code: 'GT-2026-0053', kh: 'KHLCNT-2026-0012', name: 'Triển khai, tích hợp PLM với hệ thống ERP', type: 'PTV', price: 8.0, priceBasis: 'Dự toán triển khai', form: 'CDT_TT', method: '1GD1T', intl: false, online: false,
      start: 'Quý I/2027', selTime: '30 ngày', execTime: '180 ngày', contract: 'TRON_GOI', st: 'KH', items: [['Triển khai, cấu hình PLM', 'Gói', 1], ['Tích hợp PLM – ERP (BOM, mã vật tư)', 'Gói', 1], ['Đào tạo người dùng', 'Khoá', 4]] },
  ];

  /* Trường gói theo form hệ thống cũ (HT-THAU-IMG 7213–7221) — thật là trường eForm MS18 bước 3–4; mẫu suy từ dữ liệu gói. */
  const FIELD_LB = { HANG_HOA: 'Hàng hóa', XAY_LAP: 'Xây lắp', TU_VAN: 'Tư vấn', PHI_TU_VAN: 'Phi tư vấn', HON_HOP: 'Hỗn hợp' };
  const COST = { MS_HH: 'Chi phí thiết bị', HH_LD: 'Chi phí thiết bị, lắp đặt', PM: 'Chi phí bản quyền phần mềm', PTV: 'Chi phí dịch vụ', TV: 'Chi phí tư vấn', XL: 'Chi phí xây lắp' };
  function pkExtra(g, k) {
    const row = window.Catalog.rows('loai-goi-thau').find((r) => r.code === g.type) || {};
    return { no: `${g.code.slice(-2)}-2026-VHT-K2`, summary: (g.items || []).map((i) => i[0]).join('; '), sign: !['GIAO_NV', 'TU_TH'].includes(g.form),
      cur: g.cur || 'VND', rate: g.rate || 1, field: FIELD_LB[row.field] || '', net: !g.online ? 'Không qua mạng' : k && k.law ? 'Qua mạng đấu thầu quốc gia' : 'Qua mạng Viettel',
      hdTime: g.hdTime || g.execTime, cost: COST[g.type] || 'Chi phí khác', authority: k && levelOf(k) === 'TD' ? 'TGĐ Tập đoàn' : 'TGĐ Tổng Công ty' };
  }
  const OWNER_ORG = 'Tổng Công ty Công nghiệp Công nghệ cao Viettel';

  /* Bản ghi tạo trên prototype + điều chỉnh (localStorage riêng, như E-Form). */
  const KEY = 'dtms-proto-thau';
  let U = { kh: [], adj: {}, pk: {} };
  try { U = Object.assign(U, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* bỏ qua */ }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(U)); } catch (e) { /* bỏ qua */ } };
  /* T67 T2: KHLCNT đã khởi tạo MS18 (hồ sơ con HSKH-…) — đang chạy thì trạng thái Đang xử lý, bước hiện tại theo việc đang mở; xong thì khFlowDone ghi kết quả vào U.adj. */
  const khCaseOf = (code) => Flow.caseOf(D.hdCaseCode(code, 'MS18'));
  const khLive = (k) => { const c = khCaseOf(k.code); return c && c.status === 'running' ? { st: 'RUN' } : {}; };
  const khAll = () => U.kh.concat(KH0).map((k) => Object.assign({}, k, U.adj[k.code] || {})).map((k) => Object.assign(k, khLive(k))).map((k) => Object.assign(k, { prog: khProg(k) }));
  /* T67 T4 — tiến độ (THAU-TT-1311 §1.2, §7): trạng thái + giai đoạn + bước hiện tại + người xử lý + bắt đầu / hạn / thời gian tại bước + vướng mắc.
     Hồ sơ MS18 đang chạy: lấy từ việc đang mở (khl của bước, người được giao, since); hạn = định mức bước × 2 như Việc của tôi; vướng mắc từ biến quy trình
     (lý do trả sửa / từ chối ký, chờ Ban ĐTXD, thành viên chưa cam kết). Mẫu chưa chạy: theo KH_MAP, bắt đầu bước = Ngày cập nhật. Ngày hiện tại = ngày dữ liệu mẫu. */
  const due = (task, since) => since + Math.max(1, Math.ceil(((D.flows.MS18[task] || {}).nlv || 0.5) * 2));
  const tname = (n) => ((window.BPMN_FLOWS.MS18 || { tasks: {} }).tasks[n] || {}).name || '';
  const nowNlv = (c) => Math.max(c ? c.clock : 0, Flow.clockOf(window.HopDong ? window.HopDong.TODAY : '07/10/2026'));
  function khProg(k) {
    const c = khCaseOf(k.code), P = (khl, o) => Object.assign({ khl, gd: KHL[khl][2], step: '', who: '', since: null, due: null, days: null, issue: '' }, o);
    if (c && c.status === 'approved') return P('KHL-10', { step: 'Hoàn thành KHLCNT' });
    if (c && c.status === 'stopped') return P('KHL-X');
    if (c && c.status === 'running') {
      const ts = c.tokens.filter((t) => D.flows.MS18[t.task] && !D.flows.MS18[t.task].gw);
      if (!ts.length) return P('KHL-02');
      const t0 = ts[0], f = D.flows.MS18[t0.task], since = Math.min(...ts.map((t) => t.since)), now = nowNlv(c), dl = due(t0.task, since);
      const names = [...new Set(ts.map((t) => persona(t.who).name))], unit = persona(t0.who).unit;
      const back = [...c.history].reverse().find((h) => h.reason && [10, 12, 19].includes(Number(h.task)));
      const issue = [9, 19].includes(Number(t0.task)) && back ? (Number(t0.task) === 19 ? 'Người ký từ chối: ' : 'Trả sửa: ') + back.reason
        : f.external ? `Chờ Phiếu nhận xét của ${f.external}`
        : String(t0.task) === '8' ? `Chờ ${ts.length} thành viên Tổ thẩm định cam kết` : '';
      return P(f.khl || 'KHL-02', { step: [...new Set(ts.map((t) => `${t.task}. ${tname(t.task)}`))].join(', '), who: `${unit} / ${names.join(', ')}`,
        since: Flow.dateOf(since), due: Flow.dateOf(dl), late: dl < now, days: Math.max(0, Math.floor(now - since)), issue });
    }
    const [khl, n0] = KH_MAP[k.st] || ['KHL-02', null], n = k.st === 'CHECK' && levelOf(k) === 'TD' ? 12 : n0;
    if (!n) return P(khl, { step: khl === 'KHL-01' ? 'Chưa khởi tạo quy trình' : '', issue: k.cancelWhy || '' });
    /* Bước dịch vụ (16 Trình ký VOffice…) không có người xử lý: hiện tác nhân của bước theo BPMN. */
    const since = Flow.clockOf(k.updated), now = nowNlv(null), dl = due(n, since), w = D.flows.MS18[n].who, p = w ? persona(w) : null;
    const nok = Object.entries(k.checkNok || {})[0];
    return P(khl, { step: `${n}. ${tname(n)}`, who: p ? `${p.unit} / ${p.name}` : (((window.BPMN_FLOWS.MS18 || { tasks: {} }).tasks[n] || {}).actor || ''), since: k.updated, due: Flow.dateOf(dl), late: dl < now, days: Math.max(0, now - since),
      issue: k.st === 'ADJ' ? 'Điều chỉnh: ' + (k.adjWhy || '') : k.st === 'OPINION' ? 'Chờ Phiếu nhận xét của Ban ĐTXD Tập đoàn' : nok ? `${nok[0]}: ${nok[1]}` : '' });
  }
  const khOf = (code) => khAll().find((k) => k.code === code) || null;
  /* T67 T5: kết quả MS19 (U.pk — KQLCNT, nhà thầu, mẫu hợp đồng) phủ lên dữ liệu mẫu của gói. */
  const pkM = (g) => (g && U.pk && U.pk[g.code] ? Object.assign({}, g, U.pk[g.code]) : g);
  const pkOf = (code) => pkM(PK.find((p) => p.code === code)) || null;
  const pkgsOf = (k) => (k.pkgs || []).map(pkOf).filter(Boolean);
  /* Đối tượng cha của hồ sơ MS18 (D.hdProcesses.MS18.obj.find → Flow.ci): tên, đơn vị lập, tổng giá gói, người phụ trách, cấp phê duyệt. */
  function khCase(code) {
    const k = khOf(code);
    if (!k) return null;
    /* Không gọi srcInfo: srcInfo đọc Screens.allCases() → Flow.ci() → khCase (đệ quy). Đơn vị lập lấy thẳng từ ĐXMS / KĐT nguồn. */
    const s = (k.src[0] === 'KDT' ? Flow.findKdt(k.src[1]) : Flow.findDxms(k.src[1])) || {};
    return { title: k.title, unit: s.unit, value: sum(pkgsOf(k).map((g) => g.price)), owner: ownerOf(k), levelText: LEVEL[levelOf(k)], kh: k };
  }
  /* MS18 bước 23 (service): KHLCNT Hoàn thành — số, ngày văn bản lấy theo bước của hồ sơ (Checklist hệ thống cũ IMG 7211; số GIẢ LẬP theo mã KHLCNT).
     BM02 cấp VHT (Báo cáo kiểm tra) không có ô Số (BM-KHLCNT). */
  /* Số văn bản của KHLCNT chạy MS18 — GIẢ LẬP theo mã KHLCNT (thật: số do VOffice / văn thư cấp, mã đăng tải do Cổng đấu thầu trả về). */
  const khNos = (code) => { const n = 900 + Number(code.slice(-2)); return { ttr: `0${n}/TTr-MS-ĐT`, bc: `0${n + 1}/BC-TTĐ`, qdV: `0${n + 2}/QĐ-VHT`, qdT: `${n + 2}/QĐ-CNVTQĐ`,
    ptr: `0${n + 3}/PTr-VHT`, post: `KH202610-${String(n).slice(-3)}-00` }; };
  function khFlowDone(code) {
    const S0 = Flow.state, k = khOf(code);
    if (!k) return;
    const at = (n) => { const h = S0.history.filter((x) => String(x.task) === String(n)).pop(); return h ? Flow.dateOf(h.t) : ''; };
    const by = (n) => { const h = S0.history.filter((x) => String(x.task) === String(n) && x.who).pop(); return h ? persona(h.who).name : ''; };
    const no = khNos(code), td = S0.vars.level === 'TD', u = S0.ui || {}, kyAt = u.khQdNgay || at(S0.vars.khKy === 'CUNG' ? 20 : 17), post = at(22);
    U.adj[code] = Object.assign({}, U.adj[code], { st: 'OK', updated: post,
      docs: { bm01: [no.ttr, at(5), by(5)], bm02: td ? [no.bc, at(12), by(12)] : ['', at(10), by(10)],
        bm03: [u.khQdSo || (td ? no.qdT : no.qdV), kyAt, td ? 'TGĐ Tập đoàn' : persona('tgd').name] },
      post: [no.post, post] });
    persist();
  }
  /* Tổng các phần công việc (Điều 23 khoản 2 điểm e): a đã thực hiện + b không áp dụng + c thuộc KHLCNT (giá gói) + d chưa đủ điều kiện. */
  function totals(k) {
    const p = k.parts || {}, a = sum((p.done || []).map((x) => x.value)), b = sum((p.na || []).map((x) => x.value)), c = sum(pkgsOf(k).map((g) => g.price)), d = sum((p.pending || []).map((x) => x.value));
    const s = srcInfo(k.src[0], k.src[1]), all = sum([a, b, c, d]);
    return { a, b, c, d, all, approved: s ? s.value : null, diff: s && s.value != null ? Math.round((all - s.value) * 100) / 100 : null, s };
  }
  const khBy = (kind, code) => khAll().filter((k) => k.src[0] === kind && k.src[1] === code);

  /* ---------- Khuôn danh sách dùng chung (profile-list / task-management): ô tìm + Tìm kiếm nâng cao, phân trang ---------- */
  const LST = {};
  const st = (id, empty) => (LST[id] = LST[id] || { kw: '', adv: false, f: empty(), d: empty(), page: 1, size: 10, psOpen: false, empty });
  /* T71 S12 (D-124): o.exp = tên tệp → nút Xuất Excel đầu hàng tiêu đề; xuất mọi dòng thỏa tìm kiếm / bộ lọc đang áp, đúng các cột đang hiện (bỏ cột Thao tác, cột chọn).
     BE: API xuất .xlsx của danh sách; prototype tải .csv (UTF-8). */
  const EXP = {};
  const filtered = (o) => { const L = st(o.id, o.empty); return o.rows().filter((r) => (!L.adv ? !L.kw || norm(o.kwText(r)).includes(norm(L.kw)) : o.match(r, L.f))); };
  function exportList(o) {
    const keep = o.cols.map(([h], i) => (h && h !== 'Thao tác' ? i : -1)).filter((i) => i >= 0);
    const t = document.createElement('table');
    t.innerHTML = '<tbody>' + filtered(o).map((r) => `<tr>${o.cell(r)}</tr>`).join('') + '</tbody>';
    const txt = (td) => (td ? td.textContent.replace(/\s+/g, ' ').trim() : '');
    const body = [...t.querySelectorAll('tr')].map((tr, i) => [i + 1].concat(keep.map((k) => { const v = txt(tr.children[k]); return v === '-' ? '' : v; })));
    const q = (v) => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`;
    const lines = [[o.title.toUpperCase()], [], ['STT'].concat(keep.map((k) => o.cols[k][0]))].concat(body);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + lines.map((r) => r.map(q).join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' }));
    a.download = o.exp + '.csv';
    a.click();
    toast('<b>Thành công</b><br>Xuất file thành công');
  }
  function listPage(o) {
    const L = st(o.id, o.empty);
    if (o.exp) EXP[o.id] = o;
    const rows = filtered(o);
    const pages = Math.max(1, Math.ceil(rows.length / L.size));
    if (L.page > pages) L.page = pages;
    const from = (L.page - 1) * L.size;
    const txt = (k, label) => `<div class="vfield"><div class="lr"><label>${label}</label></div><input class="vctl" data-tf="${o.id}:${k}" maxlength="255" placeholder="Nhập ${label.toLowerCase()}" value="${esc(L.d[k])}"></div>`;
    /* T56: khoảng ngày = hai vht-calendar + "-" (UI.vDateRange). */
    const range = (a, b, label) => window.UI.vDateRange({ label, from: [`data-tf="${o.id}:${a}"`, L.d[a]], to: [`data-tf="${o.id}:${b}"`, L.d[b]] });
    const sel = (k, label, opt) => `<div class="vfield"><div class="lr"><label>${label}</label></div>${vSelect(Object.assign({ id: `tf-${o.id}-${k}`, value: L.d[k], clear: true, searchable: true,
      placeholder: 'Chọn ' + label.toLowerCase(), onChange: (v) => { L.d[k] = v; rerender(); } }, opt))}</div>`;
    const adv = `<form class="adv" data-tadv="${o.id}"><div class="grid3">${o.adv(txt, sel, range)}</div>
      <div class="acts"><button type="button" class="vbtn secondary" data-tl="${o.id}:reset">Làm mới</button><button type="submit" class="vbtn primary">Tìm kiếm</button></div></form>`;
    const body = rows.slice(from, from + L.size).map((r, i) => `<tr class="click" data-go="${o.href(r)}" data-code="${esc(r.code)}"><td class="ord">${from + i + 1}</td>${o.cell(r)}</tr>`).join('');
    return `<div class="pg">
      ${head({ title: o.title, info: o.info, right: (o.exp ? `<button type="button" class="vbtn secondary" data-lx="${o.id}">${icon('excel')} Xuất Excel</button>` : '') + (o.right || '') })}
      ${o.top || ''}
      <div class="vcard">
        <div class="pg-head"><span></span><div class="r">
          ${L.adv ? '' : `<label class="vsearch" style="width:264px">${icon('search')}<input id="${o.id}-kw" data-tkw="${o.id}" maxlength="255" placeholder="${o.ph}" value="${esc(L.kw)}"></label>`}
          <button class="vbtn ${L.adv ? 'active' : 'secondary'}" data-tl="${o.id}:adv">${L.adv ? 'Ẩn tìm kiếm nâng cao' : 'Tìm kiếm nâng cao'}</button></div></div>
        ${L.adv ? adv : ''}
        <div class="vtable-vp"><table class="vtable"><thead><tr><th class="ord">STT</th>${o.cols.map(([h, w, a]) => `<th class="${a || ''}" style="width:${w}px;min-width:${w}px">${h}</th>`).join('')}</tr></thead>
          <tbody>${body || `<tr><td class="vtable-empty" colspan="${o.cols.length + 1}"><img src="assets/empty-table.svg" alt="">Chưa có dữ liệu</td></tr>`}</tbody></table></div>
        ${pager({ id: o.id, total: rows.length, page: L.page, size: L.size, open: L.psOpen })}
      </div></div>`;
  }
  const has = (v, x) => !v || norm(x).includes(norm(v));
  const inSet = (arr, v) => !arr || !arr.length || arr.includes(v);
  const catOpts = (key) => window.Catalog.rows(key).map((r) => ({ value: r.code, label: r.name }));

  /* ---------- SCR-78 Danh sách KHLCNT ---------- */
  const khHref = (k) => 'khlcnt/' + encodeURIComponent(k.code);
  const khRow = (k) => { const t = totals(k), qd = (k.docs || {}).bm03 || []; return Object.assign({}, k, { kind: k.src[0], srcCode: k.src[1], unit: t.s ? t.s.unit : '', n: pkgsOf(k).length, total: t.c,
    qc: qcOf(k), lv: levelOf(k), owner: ownerOf(k), fund: t.s ? t.s.fund : '', qdNo: qd[0], qdDate: qd[1], postDate: (k.post || [])[1] }); };
  const inRange = (d, from, to) => (!from || (d && dkey(d) >= dkey(from))) && (!to || (d && dkey(d) <= dkey(to)));
  /* Cột tiến độ dùng chung SCR-78 / SCR-81 (THAU-TT-1311 §7). Hạn quá ngày hiện tại tô đỏ như Việc của tôi. */
  const PROG_COLS = [['Giai đoạn', 190], ['Bước hiện tại', 260], ['Đơn vị / người xử lý', 260], ['Bắt đầu bước', 120], ['Hạn xử lý', 110], ['Thời gian tại bước', 140, 'c'], ['Vướng mắc', 280]];
  const progCells = (p) => `<td>${clamp(p.gd)}</td><td>${clamp(p.step)}</td><td>${clamp(p.who)}</td><td class="num">${p.since ? esc(p.since) : dash}</td>
    <td class="num${p.late ? ' due-over' : ''}">${p.due ? esc(p.due) : dash}</td><td class="c">${p.days != null ? esc(p.days + ' ngày') : dash}</td><td>${clamp(p.issue)}</td>`;
  const stBadge = (cat0, code) => `<span title="${esc(code)}">${badge(cat0[code][0], cat0[code][1])}</span>`;
  function khList() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/task-management.component.html (KHLCNT = đối tượng cha như ĐXMS / KĐT)
    return listPage({
      id: 'khl', title: 'Danh sách kế hoạch lựa chọn nhà thầu', ph: 'Tìm kiếm theo mã, tên KHLCNT, mã đối tượng nguồn',
      right: `<button class="vbtn primary" data-go="khlcnt/create">${icon('add')} Thêm mới</button>`,
      rows: () => khAll().map(khRow), kwText: (k) => `${k.code} ${k.title} ${k.srcCode}`,
      empty: () => ({ code: '', title: '', src: '', kind: [], unit: null, st: [], gd: null, qc: null, lv: null, fund: null, owner: [], from: '', to: '' }),
      match: (k, f) => has(f.code, k.code) && has(f.title, k.title) && has(f.src, k.srcCode) && inSet(f.kind, k.kind) && (!f.unit || k.unit === f.unit) && inSet(f.st, k.prog.khl) && (!f.gd || k.prog.gd === f.gd)
        && (!f.qc || k.qc === f.qc) && (!f.lv || k.lv === f.lv) && (!f.fund || k.fund === f.fund) && inSet(f.owner, k.owner) && inRange(k.qdDate, f.from, f.to),
      adv: (txt, sel, range) => `${txt('code', 'Mã KHLCNT')}${txt('title', 'Tên KHLCNT')}${txt('src', 'Mã đối tượng nguồn')}
        ${sel('kind', 'Loại đối tượng nguồn', { multi: true, searchable: false, options: [['DXMS', SRC.DXMS], ['KDT', SRC.KDT]].map(([value, label]) => ({ value, label })) })}
        ${sel('unit', 'Đơn vị lập', { options: [...new Set(khAll().map(khRow).map((k) => k.unit))].map((u) => ({ value: u, label: u })) })}
        ${sel('st', 'Trạng thái', { multi: true, searchable: false, options: Object.entries(KHL).map(([value, [label]]) => ({ value, label })) })}
        ${sel('gd', 'Giai đoạn', { searchable: false, options: [...new Set(Object.values(KHL).map((x) => x[2]))].map((u) => ({ value: u, label: u })) })}
        ${sel('qc', 'Quy chế áp dụng', { searchable: false, options: Object.entries(QC).map(([value, label]) => ({ value, label })) })}
        ${sel('lv', 'Cấp phê duyệt', { searchable: false, options: Object.entries(LEVEL).map(([value, label]) => ({ value, label })) })}
        ${sel('fund', 'Nguồn vốn', { options: catOpts('nguon-von') })}
        ${sel('owner', 'Người phụ trách', { multi: true, options: [...new Set(khAll().map(ownerOf))].map((u) => ({ value: u, label: u })) })}
        ${range('from', 'to', 'Ngày QĐ KHLCNT')}`,
      cols: [['Trạng thái', 220, 'c'], ['Mã KHLCNT', 170], ['Tên KHLCNT', 320], ...PROG_COLS, ['Quy chế áp dụng', 170], ['Cấp phê duyệt', 130], ['Người phụ trách', 170], ['Loại đối tượng nguồn', 170], ['Mã đối tượng nguồn', 160], ['Đơn vị lập', 200],
        ['Số QĐ KHLCNT', 140], ['Ngày QĐ KHLCNT', 130], ['Ngày đăng tải KHLCNT', 160], ['Số gói thầu', 100, 'c'], ['Tổng giá gói thầu (tỷ đồng)', 190, 'r'], ['Ngày cập nhật', 130]],
      href: khHref,
      cell: (k) => `<td class="c">${stBadge(KHL, k.prog.khl)}</td><td><a class="link" data-go="${khHref(k)}">${esc(k.code)}</a></td><td>${clamp(k.title)}</td>${progCells(k.prog)}<td>${esc(QC[k.qc])}</td><td>${esc(LEVEL[k.lv])}</td><td>${clamp(k.owner)}</td><td>${esc(SRC[k.kind])}</td>
        <td><a class="link" data-go="${srcHref(k.kind, k.srcCode)}">${esc(k.srcCode)}</a></td><td>${clamp(k.unit)}</td><td>${k.qdNo ? esc(k.qdNo) : dash}</td><td class="num">${k.qdDate ? esc(k.qdDate) : dash}</td><td class="num">${k.postDate ? esc(k.postDate) : dash}</td><td class="c">${k.n}</td><td class="r num">${money(k.total)}</td><td class="num">${esc(k.updated)}</td>`,
      info: {
        scr: 'SCR-78', name: 'Danh sách kế hoạch lựa chọn nhà thầu', uc: 'UC-08-01 · Backlog W1_T10 › Quản lý thầu › KHLCNT (dòng 314–318)', bpmn: 'MS18 Lập và phê duyệt KHLCNT (BPMN-MS18-TOBE, 23 bước); trạng thái THAU-TT-1311',
        notes: [
          'KHLCNT là <b>đối tượng cha</b> như ĐXMS / KĐT (D-12): lập trên cơ sở một ĐXMS / KĐT đã phê duyệt (QC-12869 Điều 22 khoản 1a); Dự án đầu tư chưa có phân hệ. Bố cục task-management.',
          '<b>T67 T4 — trạng thái hai lớp</b> (THAU-TT-1311 §1, §3.4): Trạng thái KHL-01 Nháp … KHL-10 Hoàn thành, KHL-X Đã hủy (mã hiện khi rê chuột) + Giai đoạn lớn + Bước hiện tại. Trạng thái do quy trình đặt: mỗi dòng cấu hình bước MS18 có thuộc tính trạng thái, việc của bước mở thì KHLCNT nhận trạng thái đó; người dùng không chọn trạng thái như hệ thống cũ. Giai đoạn lớn của KHLCNT GIẢ LẬP theo ví dụ §1.1.',
          'Cột tiến độ theo §7: Giai đoạn · Bước hiện tại · Đơn vị / người xử lý · Bắt đầu bước · Hạn xử lý (định mức bước × 2, như Việc của tôi; quá hạn tô đỏ) · Thời gian tại bước (ngày làm việc tới ngày hiện tại) · Vướng mắc (lý do trả sửa / người ký từ chối, chờ Phiếu nhận xét Ban ĐTXD, thành viên Tổ thẩm định chưa cam kết — đều là biến quy trình). Bước tiếp theo / Cập nhật gần nhất của §7 không thêm (Ngày cập nhật đã có).',
          'KHLCNT chạy MS18 lấy tiến độ từ hồ sơ xử lý; KHLCNT mẫu chưa chạy quy đổi trạng thái cũ theo §2 (Dự thảo → KHL-01, Đang kiểm tra → KHL-04 ở bước 10 / 12, Đã phê duyệt → KHL-10, Đang điều chỉnh → KHL-02), bắt đầu bước = Ngày cập nhật (GIẢ LẬP).',
          'Không có cột Thao tác (D-43, team BA 30/10/2026: chưa có thao tác trên dòng).',
          'Cột và bộ lọc Quy chế áp dụng, Cấp phê duyệt, Nguồn vốn, Người phụ trách, Số / Ngày QĐ, Ngày đăng tải theo màn KHLCNT của hệ thống cũ (HT-THAU-IMG, T24). Số / Ngày QĐ lấy từ BM-03 đã ký; Ngày đăng tải từ tích hợp đăng tải (bước 59).',
        ],
        q: ['P-76', 'P-110', 'P-115'], src: 'task-management/task-management.component · /task-management',
      },
    });
  }

  /* ---------- SCR-79 Thêm mới KHLCNT ---------- */
  const F = { v: {}, err: {} };
  function resetForm(kind, code) {
    F.err = {};
    const s = kind && code ? srcInfo(kind, code) : null;
    F.v = { title: s ? 'KHLCNT ' + s.title.replace(/^(Mua sắm|Đầu tư|Trang bị)\s+/i, '').replace(/^./, (c) => c.toLowerCase()) : '', kind: kind || 'DXMS', src: s ? code : null, qc: 'MSTX', level: 'TCT', owner: persona(Flow.state.persona).name };
  }
  function khForm() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/components/task-create/task-create.component.html (mode create)
    const v = F.v, err = F.err, s = v.src ? srcInfo(v.kind, v.src) : null;
    const upd = (k) => (val) => { v[k] = val; delete err[k]; if (k === 'kind') v.src = null; rerender(); };
    const info = {
      scr: 'SCR-79', name: 'Thêm mới kế hoạch lựa chọn nhà thầu', uc: 'Backlog W1_T10 › KHLCNT › Tạo KHLCNT từ DADT/KĐT/ĐXMS; Lấy giá trị được phê duyệt (dòng 317–318)', bpmn: 'MS18 bước 1 "Khởi tạo lập KHLCNT", bước 2 kiểm tra căn cứ, bước 2–4 (mua sắm thường xuyên, Luật Đấu thầu)',
      notes: [
        'Theo task-create (mode create). Lưu = tạo KHLCNT ở trạng thái Dự thảo (Nháp, chưa chạy quy trình — THAU-TT-1311 §3.1); mở Chi tiết KHLCNT. Form này là bước 1–2 của MS18 (BPMN-MS18-TOBE); nút <b>Khởi tạo KHLCNT</b> ở Chi tiết khởi tạo quy trình, khoá Cấp phê duyệt, mở bước 3 (T67 T2, D-118). Chọn nhiều hồ sơ nguồn (BPMN bước 2) chưa dựng.',
        '<b>Đối tượng nguồn</b> chỉ liệt kê ĐXMS / KĐT đã phê duyệt (MS18 bước 2 "Kiểm tra căn cứ" — chặn ngay ở ô chọn). <b>Giá trị được duyệt</b> và văn bản phê duyệt lấy từ hồ sơ Hoàn thành gần nhất, chỉ xem; tổng giá trị các phần công việc phải khớp giá trị này (Điều 23 khoản 2e).',
        'Mỗi đối tượng nguồn chỉ có một KHLCNT đang hiệu lực; thay đổi sau phê duyệt làm bằng <b>Điều chỉnh KHLCNT</b>.',
        '<b>Quy chế áp dụng</b> (thay hai ô Mua sắm thường xuyên / Áp dụng Luật Đấu thầu, theo hệ thống cũ — T24), không đổi sau khi tạo: Mua sắm thường xuyên → hệ thống kiểm tra nhu cầu 06–12 tháng và nguy cơ chia nhỏ gói (MS18 bước 2, Điều 22 khoản 1b); Theo luật → KHLCNT riêng kèm điều, khoản áp dụng (bước 4, Điều 22 khoản 3).',
        '<b>Cấp phê duyệt</b>, <b>Người phụ trách</b> theo hệ thống cũ; Người phụ trách mặc định là người tạo. Nhánh trình Tập đoàn (Phiếu trình GQCV, nhận xét Ban ĐTXD) chưa có trong BPMN-MS18 — đề xuất DX-05.',
      ],
      q: ['P-115'], src: 'task-management/components/task-create · /task-management/create',
    };
    const opts = approvedSources(v.kind).map((x) => ({ value: x.code, label: `${x.code} - ${x.title}` }));
    return `<form class="pg" data-kh-form>
      ${head({ title: 'Thêm mới kế hoạch lựa chọn nhà thầu', back: 'khlcnt', lg: true, info, right: `<button type="button" class="vbtn secondary grey" data-go="khlcnt">Huỷ</button><button type="submit" class="vbtn primary" id="kh-save">Lưu</button>` })}
      <section class="vcard"><h3>Thông tin chung KHLCNT</h3>
        <div class="grid3">
          ${field('Mã KHLCNT', '<input class="vctl" placeholder="Hệ thống tự sinh" disabled>')}
          ${field('Tên KHLCNT', `<input class="vctl" id="kh-title" maxlength="500" placeholder="Nhập tên kế hoạch lựa chọn nhà thầu" value="${esc(v.title)}" ${err.title ? 'aria-invalid="true"' : ''}>`, { req: true, err: err.title, cls: 'span2' })}
          ${field('Loại đối tượng nguồn', vSelect({ id: 'kh-kind', value: v.kind, options: [{ value: 'DXMS', label: SRC.DXMS }, { value: 'KDT', label: SRC.KDT }, { value: 'DADT', label: SRC.DADT, disabled: true }], onChange: upd('kind') }), { req: true })}
          ${field('Đối tượng nguồn', vSelect({ id: 'kh-src', value: v.src, searchable: true, placeholder: 'Chọn ' + SRC[v.kind].toLowerCase() + ' đã phê duyệt', invalid: !!err.src, options: opts, onChange: upd('src') }), { req: true, err: err.src, cls: 'span2' })}
          ${field('Giá trị được duyệt (tỷ đồng)', `<input class="vctl" id="kh-approved" value="${s ? ty(s.value, 2) : ''}" placeholder="Lấy từ đối tượng nguồn" disabled>`)}
          ${field('Văn bản phê duyệt', `<input class="vctl" value="${esc(s ? s.doc : '')}" placeholder="Lấy từ đối tượng nguồn" disabled>`, { cls: 'span2' })}
          ${field('Đơn vị lập', `<input class="vctl" value="${esc(s ? s.unit : '')}" placeholder="Lấy từ đối tượng nguồn" disabled>`)}
          ${field('Quy chế áp dụng', vSelect({ id: 'kh-qc', value: v.qc, options: Object.entries(QC).map(([value, label]) => ({ value, label })), onChange: upd('qc') }), { req: true })}
          ${field('Cấp phê duyệt', vSelect({ id: 'kh-level', value: v.level, options: Object.entries(LEVEL).map(([value, label]) => ({ value, label })), onChange: upd('level') }), { req: true })}
          ${field('Người phụ trách', vSelect({ id: 'kh-owner', value: v.owner, searchable: true, options: D.personas.filter((x) => !['admin', 'td'].includes(x.id)).map((x) => ({ value: x.name, label: `${x.name} - ${x.unit}` })), onChange: upd('owner') }), { req: true })}
          ${field('Người lập', `<input class="vctl" value="${esc(persona(Flow.state.persona).name)}" disabled>`)}
        </div></section></form>`;
  }
  function saveKh() {
    const t = document.getElementById('kh-title');
    if (t) F.v.title = t.value;
    const v = F.v, err = F.err = {};
    if (!v.title.trim()) err.title = 'Bạn cần nhập Tên KHLCNT.';
    if (!v.src) err.src = 'Bạn cần chọn Đối tượng nguồn.';
    else if (khBy(v.kind, v.src).length) err.src = `Đối tượng nguồn đã có ${khBy(v.kind, v.src)[0].code}. Thay đổi kế hoạch thực hiện bằng Điều chỉnh KHLCNT.`;
    if (Object.keys(err).length) { rerender(); return; }
    const n = Math.max(...khAll().map((k) => Number(k.code.slice(-4)))) + 1;
    const now = Flow.dateOf(Flow.state.clock);
    const code = 'KHLCNT-2026-' + String(n).padStart(4, '0');
    U.kh.unshift({ code, src: [v.kind, v.src], title: v.title.trim(), st: 'DRAFT', creator: persona(Flow.state.persona).name, created: now, updated: now,
      law: v.qc === 'LUAT', level: v.level, owner: v.owner, basis: '', parts: { done: [], na: [], pending: [] }, pkgs: [] });
    persist();
    toast('<b>Thành công</b><br>Thêm mới kế hoạch lựa chọn nhà thầu thành công!');
    location.hash = '#/khlcnt/' + encodeURIComponent(code);
  }
  document.addEventListener('submit', (e) => { if (e.target.matches('[data-kh-form]')) { e.preventDefault(); saveKh(); } });

  /* ---------- Tab chung (app-tabs) ---------- */
  const TB = { key: null, tab: 'info' };
  function tabs(key, list, bodies) {
    if (TB.key !== key || !list.some(([k]) => k === TB.tab)) { TB.key = key; TB.tab = list[0][0]; }
    return `<nav class="tabs dx-tabs" role="tablist">${list.map(([k, l]) => `<button type="button" class="tab ${TB.tab === k ? 'on' : ''}" role="tab" aria-selected="${TB.tab === k}" data-ttab="${k}">${l}</button>`).join('')}</nav>${bodies[TB.tab]()}`;
  }

  /* ---------- SCR-80 Chi tiết KHLCNT ---------- */
  const pkHref = (g) => 'goi-thau/' + encodeURIComponent(g.code);
  const pkLink = (g) => `<a class="link" data-go="${pkHref(g)}">${esc(g.code)}</a>`;
  function khDetail(code) {
    // Theo: task-create (mode detail) + app-tabs, như SCR-29 Chi tiết ĐXMS
    const k = khOf(code);
    if (!k) return `<div class="pg">${head({ title: 'Xem chi tiết kế hoạch lựa chọn nhà thầu', back: 'khlcnt', lg: true })}${emptyCard('Thông tin chung', 'Không tìm thấy kế hoạch lựa chọn nhà thầu.')}</div>`;
    const t = totals(k), gs = pkgsOf(k), s = t.s || {};
    const ok = t.diff === 0;
    const vs = k.versions || (k.st === 'OK' || k.st === 'ADJ' ? [{ v: 'v1', at: (k.docs && k.docs.bm03 || [])[1] || k.updated, why: 'Phê duyệt lần đầu', no: (k.docs && k.docs.bm03 || [])[0] }] : []);
    const curV = vs.length ? vs[vs.length - 1].v : 'v1';
    const info = {
      scr: 'SCR-80', name: 'Chi tiết kế hoạch lựa chọn nhà thầu', uc: 'Backlog W1_T10 › KHLCNT (dòng 316, 319–331)', bpmn: 'MS18 (BPMN-MS18-TOBE, 23 bước) — hồ sơ xử lý HSKH-… là hồ sơ con của KHLCNT (T67 T2, D-118)',
      notes: [
        'Theo task-create (mode detail) + app-tabs như Chi tiết ĐXMS. Các tab chỉ xem — dữ liệu do các bước MS18 ghi (eForm bảng lặp phần công việc / gói thầu ở bước 3–4, Tờ trình bước 5, Báo cáo kiểm tra / thẩm định bước 10 / 12, Quyết định bước 11 / 15 của BPMN-MS18-TOBE).',
        '<b>Phân bổ công việc</b> theo Tờ trình KHLCNT (QC-12869 Điều 23 khoản 2): a) đã thực hiện, b) không áp dụng LCNT, c) thuộc KHLCNT (các gói thầu), d) chưa đủ điều kiện lập KHLCNT; e) tổng a–d phải khớp giá trị được duyệt của đối tượng nguồn — service task MS18 bước 24 / 33 kiểm tra, lệch thì không chuyển bước.',
        '<b>Gói thầu</b>: cơ sở phân chia theo kỹ thuật, trình tự thực hiện, năng lực thị trường (Điều 22 khoản 1c); một gói / nhiều gói theo số dòng gói (biểu mẫu Tập đoàn khác nhau).',
        '<b>Phiên bản & điều chỉnh</b>: KHLCNT đã duyệt không ghi đè; Điều chỉnh tạo phiên bản mới chạy lại MS18 (giá, phạm vi, hình thức thay đổi trước đóng thầu). So sánh trước / sau = DEV-1 như ĐXMS.',
        '<b>Tờ trình KHLCNT</b> (T24, theo tab TTr của hệ thống cũ và BM01.QCLCNT): Tổ thẩm định, giải trình a)–i), văn bản kèm theo, danh mục hạng mục — eForm bước 5 (bảng lặp + ô nhập), giải trình gợi ý từ dữ liệu gói. Không chép ô soạn HTML tự do và nút Export rời: văn bản sinh ở Văn bản đầu ra của bước.',
        '<b>Kết quả</b>: BM-01 Tờ trình (bước 5), BM-02 Báo cáo kiểm tra (bước 10 — 16 tiêu chí 3 nhóm theo BM02.QCLCNT của hệ thống cũ, trả lời một phần Q02; kết quả là bảng lặp eForm, không mặc định Đáp ứng), BM-03 Quyết định phê duyệt (bước 11 / 15, ký 16–20). Số, ngày văn bản nhận từ VOffice, không nhập lại như tab Checklist cũ. Dòng Đăng tải lấy từ Công khai & tích hợp (bước 59); Mã KHLCNT trên SAP chỉ xem.',
      ],
      q: ['P-76', 'P-116'], src: 'task-management/components/task-create (mode detail) · /task-management/detail/:id',
    };
    /* T67 T2: Nháp → Khởi tạo KHLCNT (start MS18); KHLCNT mẫu đang xử lý → Chạy luồng mẫu tới bước của mẫu; đã có hồ sơ MS18 → Xem hồ sơ xử lý. */
    const kc = khCaseOf(k.code), smp = KH_SAMPLE[k.code];
    const right = (kc ? `<button type="button" class="vbtn secondary" data-go="ho-so-hd/${esc(kc.code)}">Xem hồ sơ xử lý</button>` : '')
      + (!kc && k.st === 'DRAFT' ? `<button type="button" class="vbtn primary" data-kh-start="${esc(k.code)}">Khởi tạo KHLCNT</button>` : '')
      + (!kc && smp ? `<button type="button" class="vbtn primary" data-kh-sample="${esc(k.code)}">Chạy luồng mẫu</button>` : '')
      + (k.st === 'OK' ? `<button type="button" class="vbtn primary" data-kh-adj="${esc(k.code)}">Điều chỉnh KHLCNT</button>` : '');
    const infoCards = card('Thông tin chung KHLCNT', `<div class="ginfo c3">
        ${kv('Mã KHLCNT', esc(k.code))}${kv('Tên KHLCNT', esc(k.title), 'span2')}
        ${kv('Loại đối tượng nguồn', esc(SRC[k.src[0]]))}${kv('Đối tượng nguồn', `<a class="link-red" href="#/${srcHref(k.src[0], k.src[1])}">${esc(k.src[1])}</a> - ${esc(s.title || '')}`, 'span2')}
        ${kv('Đơn vị lập', esc(s.unit))}${kv('Người lập', esc(k.creator))}${kv('Trạng thái', stBadge(KHL, k.prog.khl))}
        ${kv('Bước hiện tại', esc(khStep(k)))}${kv('Phiên bản hiện hành', esc(curV))}${kv('Ngày cập nhật', esc(k.updated))}
        ${kv('Quy chế áp dụng', esc(QC[qcOf(k)]))}${kv('Cấp phê duyệt', esc(LEVEL[levelOf(k)]))}${kv('Người phụ trách', esc(ownerOf(k)))}
        ${kv('Số gói thầu', String(gs.length))}</div>`)
      + card('Kiểm soát giá trị', `<div class="ginfo c3">
        ${kv('Giá trị được duyệt của đối tượng nguồn', t.approved != null ? ty(t.approved, 2) + ' tỷ đồng' : null)}${kv('Văn bản phê duyệt', esc(s.doc), 'span2')}
        ${kv('Tổng giá trị các phần công việc', ty(t.all, 2) + ' tỷ đồng')}${kv('Chênh lệch', t.diff == null ? null : ty(t.diff, 2) + ' tỷ đồng')}
        ${kv('Kết quả đối chiếu', !gs.length && !t.all ? badge('Chưa lập phân bổ', 'default') : ok ? badge('Khớp giá trị được duyệt', 'success') : badge('Lệch giá trị được duyệt', 'error'))}</div>`);
    const partT = (title, rows, cols, cell, total) => card(title, table(cols, rows, cell, rows.length ? `<tfoot><tr><td></td><td colspan="${cols.length - 1}"><b>Cộng</b></td><td class="r num"><b>${ty(total, 2)}</b></td></tr></tfoot>` : ''));
    const p = k.parts || {};
    const phanBo = () => partT('a) Phần công việc đã thực hiện', p.done || [], [['Nội dung công việc', 420], ['Căn cứ pháp lý', 320], ['Giá trị (tỷ đồng)', 160, 'r']],
      (r) => `<td>${clamp(r.name)}</td><td>${clamp(r.legal)}</td><td class="r num">${money(r.value)}</td>`, t.a)
      + partT('b) Phần công việc không áp dụng hình thức lựa chọn nhà thầu', p.na || [], [['Nội dung công việc', 420], ['Lý do', 320], ['Giá trị (tỷ đồng)', 160, 'r']],
        (r) => `<td>${clamp(r.name)}</td><td>${clamp(r.why)}</td><td class="r num">${money(r.value)}</td>`, t.b)
      + partT('c) Phần công việc thuộc KHLCNT', gs, [['Mã gói thầu', 150], ['Tên gói thầu', 420], ['Hình thức LCNT', 200], ['Giá gói thầu (tỷ đồng)', 170, 'r']],
        (g) => `<td>${pkLink(g)}</td><td>${clamp(g.name)}</td><td>${clamp(cat('hinh-thuc-lcnt', g.form))}</td><td class="r num">${money(g.price)}</td>`, t.c)
      + partT('d) Phần công việc chưa đủ điều kiện lập KHLCNT', p.pending || [], [['Nội dung công việc', 420], ['Lý do', 320], ['Giá trị (tỷ đồng)', 160, 'r']],
        (r) => `<td>${clamp(r.name)}</td><td>${clamp(r.why)}</td><td class="r num">${money(r.value)}</td>`, t.d)
      + card('e) Tổng hợp giá trị', table([['Phần công việc', 520], ['Giá trị (tỷ đồng)', 180, 'r']],
        [['a) Đã thực hiện', t.a], ['b) Không áp dụng hình thức LCNT', t.b], ['c) Thuộc KHLCNT', t.c], ['d) Chưa đủ điều kiện lập KHLCNT', t.d]],
        (r) => `<td>${esc(r[0])}</td><td class="r num">${money(r[1])}</td>`,
        `<tfoot><tr><td></td><td><b>Tổng cộng</b> · giá trị được duyệt ${t.approved != null ? ty(t.approved, 2) : '-'}</td><td class="r num"><b>${ty(t.all, 2)}</b></td></tr></tfoot>`));
    const goiWords = inWords(t.c);
    const goi = () => card('Cơ sở phân chia gói thầu', `<div class="ginfo c3">${kv('Hình thức kế hoạch', gs.length > 1 ? 'KHLCNT nhiều gói thầu' : 'KHLCNT một gói thầu')}${kv('Cơ sở phân chia', esc(k.basis), 'span2')}</div>`)
      + card('Danh sách gói thầu', table([['Mã gói thầu', 140], ['Số gói thầu', 190], ['Tên gói thầu', 320], ['Loại gói thầu', 200], ['Giá gói thầu (tỷ đồng)', 170, 'r'], ['Hình thức LCNT', 190], ['Phương thức LCNT', 220],
        ['Loại hợp đồng', 170], ['Thời gian bắt đầu LCNT', 160], ['Thời gian thực hiện HĐ', 170], ['Thời gian thực hiện gói thầu', 190], ['Trạng thái', 200, 'c']], gs,
      (g) => `<td>${pkLink(g)}</td><td>${esc(pkExtra(g, k).no)}</td><td>${clamp(g.name)}</td><td>${clamp(cat('loai-goi-thau', g.type))}</td><td class="r num">${money(g.price)}</td><td>${clamp(cat('hinh-thuc-lcnt', g.form))}</td>
        <td>${clamp(cat('phuong-thuc-lcnt', g.method))}</td><td>${clamp(cat('loai-hop-dong', g.contract))}</td><td>${esc(g.start)}</td><td>${esc(pkExtra(g, k).hdTime)}</td><td>${esc(g.execTime)}</td><td class="c">${stBadge(LC, pkRow(g).lc)}</td>`,
      gs.length ? `<tfoot><tr><td></td><td colspan="4"><b>Tổng</b></td><td class="r num"><b>${ty(t.c, 2)}</b></td><td colspan="7" data-kh-words>${esc(goiWords)}</td></tr></tfoot>` : ''));
    const phienBan = () => {
      if (!vs.length) return emptyCard('Lịch sử phiên bản', 'KHLCNT chưa được phê duyệt. Phiên bản đầu được ghi nhận khi có Quyết định phê duyệt KHLCNT.');
      const rows = vs.map((x, i) => Object.assign({ cur: i === vs.length - 1 && k.st !== 'ADJ' }, x)).concat(k.st === 'ADJ' ? [{ v: 'v' + (vs.length + 1), at: k.updated, why: k.adjWhy, no: '', draft: true }] : []);
      return card('Lịch sử phiên bản KHLCNT', table([['Phiên bản', 110], ['Ngày', 130], ['Nội dung', 420], ['Quyết định', 170], ['Trạng thái', 170, 'c']], rows.reverse(),
        (x) => `<td>${esc(x.v)}</td><td class="num">${esc(x.at)}</td><td>${clamp(x.why)}</td><td>${x.no ? esc(x.no) : dash}</td><td class="c">${x.draft ? badge('Đang điều chỉnh', 'warning') : x.cur ? badge('Hiện hành', 'success') : badge('Đã thay thế', 'default')}</td>`), `Phiên bản hiện hành: ${esc(curV)}`)
        + (k.diff ? card('So sánh KHLCNT trước / sau điều chỉnh', table([['Nội dung', 300], ['Trước điều chỉnh (v1)', 360], ['Sau điều chỉnh (v2)', 360]], k.diff,
          (d) => `<td>${clamp(d[0])}</td><td><span class="diff-old">${esc(d[1])}</span></td><td><span class="diff-new">${esc(d[2])}</span></td>`), 'Chỉ liệt kê nội dung thay đổi') : '');
    };
    /* ---------- T67 T3 (D-118, yêu cầu BA): 8 tab như hệ thống cũ (HT-THAU-IMG 7210, HT-THAU-XLS mục 1.3.2.1–1.3.2.9) ----------
       KHLCNT đã khởi tạo MS18: mỗi tab đọc dữ liệu hồ sơ xử lý (biến / eForm do bước ghi), bước chưa tới → "được cập nhật ở bước n".
       KHLCNT mẫu chưa chạy luồng: giữ dữ liệu mẫu tĩnh. */
    const C = khCaseOf(k.code), live = !!C, td = levelOf(k) === 'TD', ui = (C && C.ui) || {};
    const hist = (n) => (C ? C.history.filter((h) => String(h.task) === String(n)) : []);
    const doneAt = (n) => { const h = hist(n).filter((x) => x.who || x.system).pop(); return h ? Flow.dateOf(h.t) : null; };
    const doneAny = (ns) => ns.map(doneAt).filter(Boolean).pop() || null;
    const T18 = window.BPMN_FLOWS.MS18.tasks;
    const waitCard = (title, steps) => emptyCard(title, `Chưa có dữ liệu — được cập nhật ở bước ${steps.map((n) => `${n}. ${T18[n].name}`).join(' / ')}.`);
    const no = khNos(k.code);
    /* Tờ trình KHLCNT (bước 5–6): theo tab TTr của hệ thống cũ + BM01; KHLCNT chạy luồng đọc Tổ thẩm định (bước 6) và giải trình (bước 5) từ hồ sơ. */
    const GT = td ? [['khCoSo', 'a. Cơ sở phân chia các gói thầu'], ['khGtGia', 'b. Giá gói thầu'], ['khGtVon', 'c. Nguồn vốn'], ['khGtHinhThuc', 'd. Hình thức và phương thức lựa chọn nhà thầu'],
      ['khGtBatDau', 'e. Thời gian bắt đầu tổ chức lựa chọn nhà thầu'], ['khGtLoaiHd', 'f. Loại hợp đồng'], ['khGtThoiGianTh', 'g. Thời gian thực hiện hợp đồng']]
      : [['khCoSo', 'a) Cơ sở phân chia các gói thầu'], ['khGtGia', 'b) Giá gói thầu'], ['khGtVon', 'c) Nguồn vốn'], ['khGtHinhThuc', 'd) Hình thức lựa chọn nhà thầu'],
        ['khGtPhuongThuc', 'đ) Phương thức lựa chọn nhà thầu'], ['khGtThoiGianLcnt', 'e) Thời gian lựa chọn nhà thầu'], ['khGtBatDau', 'g) Thời gian bắt đầu tổ chức lựa chọn nhà thầu'],
        ['khGtLoaiHd', 'h) Loại hợp đồng'], ['khGtThoiGianTh', 'i) Thời gian thực hiện gói thầu']];
    const liveTeam = () => (ui.khTtd || D.khTeam0.map(([nguoi, vaiTro, phanCong]) => ({ nguoi, vaiTro, phanCong })))
      .map((r) => [persona(r.nguoi).name, persona(r.nguoi).role, r.vaiTro, r.phanCong, r.nguoi]);
    const toTrinh = () => {
      if (!gs.length) return emptyCard('Tờ trình KHLCNT', 'Tờ trình được lập sau khi có thông tin gói thầu.');
      if (live && !doneAt(5)) return waitCard('Tờ trình KHLCNT', [5]);
      const off = Number(k.code.slice(-2));
      const P = (i) => PEOPLE[(off + i) % PEOPLE.length];
      const team = live ? (doneAt(6) ? liveTeam() : []) : [[P(0), 'Phó Tổng Giám đốc chuyên trách', 'Tổ trưởng', 'Chỉ đạo chung'], [P(1), 'Trưởng phòng Chiến lược - KHCN', 'Thành viên', 'Kỹ thuật'], [P(2), 'Trưởng phòng Tài chính Kế toán', 'Thành viên', 'Tài chính'],
        [P(3), 'Bộ phận Bảo vệ An ninh', 'Thành viên', 'An ninh chính trị nội bộ'], [P(4), 'Giám đốc Trung tâm Mua sắm', 'Thành viên', 'Pháp lý']];
      const perG = (fn) => gs.map((g) => `${pkExtra(g, k).no}: ${fn(g)}`).join('; ');
      const why = live ? GT.map(([key, l]) => [l, ui[key] || '']) : [['a) Cơ sở phân chia các gói thầu', k.basis], ['b) Giá gói thầu', perG((g) => `${ty(g.price, 2)} tỷ đồng — ${g.priceBasis}`)], ['c) Nguồn vốn', cat('nguon-von', s.fund)],
        ['d) Hình thức lựa chọn nhà thầu', perG((g) => `${cat('hinh-thuc-lcnt', g.form)} — ${COND[g.form] || ''}`)], ['đ) Phương thức lựa chọn nhà thầu', perG((g) => cat('phuong-thuc-lcnt', g.method))],
        ['e) Thời gian bắt đầu tổ chức lựa chọn nhà thầu', perG((g) => g.start)], ['g) Thời gian lựa chọn nhà thầu', perG((g) => g.selTime)], ['h) Loại hợp đồng', perG((g) => cat('loai-hop-dong', g.contract))], ['i) Thời gian thực hiện gói thầu', perG((g) => g.execTime)]];
      const attach = [[s.doc || 'Văn bản phê duyệt đối tượng nguồn', 'Bản chụp'], ['Báo giá, cơ sở xác định giá gói thầu', 'Bản chụp'], ['Tờ trình đề xuất / khoản đầu tư đã phê duyệt', 'Bản chụp']];
      const lines = gs.flatMap((g) => (g.items || []).map((i) => [pkExtra(g, k).no, i[0], i[1], i[2]]));
      return (team.length ? card('Thành viên Tổ thẩm định', table([['Họ và tên', 200], ['Chức vụ', 280], ['Vai trò trong Tổ thẩm định', 180], ['Phân công công việc', 220], ['Chứng chỉ đào tạo về đấu thầu', 230]], team,
          (r) => { const c = certOf(r[0]); return `<td>${esc(r[0])}</td><td>${clamp(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td><td>${c.so ? `${esc(c.so)} <span class="faint">· ${esc(c.ngay)}</span>` : badge('Chưa có', 'error')}</td>`; }))
          : waitCard('Thành viên Tổ thẩm định', [6]))
        + card('Mô tả tóm tắt', `<div class="ginfo c3">${kv('Đối tượng nguồn', esc(`${k.src[1]} - ${s.title || ''}`), 'span2')}${kv('Giá trị được duyệt', t.approved != null ? ty(t.approved, 2) + ' tỷ đồng' : null)}
          ${kv('Nhiệm vụ / Đề tài, dự án', s.nvText ? esc(s.nvText) : null, 'span2')}${kv('Đơn vị đề xuất', esc(s.unit))}${live ? kv('Số / ngày Tờ trình', esc(`${no.ttr} ngày ${doneAt(5)}`)) : ''}</div>`)
        + phanBo()
        + card('Giải trình nội dung KHLCNT', table([['Nội dung', 320], ['Giải trình', 760]], why, (r) => `<td>${esc(r[0])}</td><td>${clamp(r[1])}</td>`))
        + card('Văn bản kèm theo', table([['Nội dung', 620], ['Ghi chú', 160]], attach, (r) => `<td>${clamp(r[0])}</td><td>${esc(r[1])}</td>`))
        + card('Chi tiết danh mục mua sắm thuộc gói thầu', table([['Số gói thầu', 200], ['Hạng mục', 460], ['Đơn vị tính', 130], ['Khối lượng', 110, 'r']], lines,
          (r) => `<td>${esc(r[0])}</td><td>${clamp(r[1])}</td><td>${esc(r[2])}</td><td class="r num">${ty(r[3], 0)}</td>`));
    };
    /* Checklist (IMG 7211, HT-THAU-XLS 1.3.2.2): số / ngày văn bản hệ thống tự ghi theo kết quả bước (không nhập tay như hệ thống cũ); dòng 5–6 chỉ cấp Tập đoàn. */
    const checklist = () => {
      const d = k.docs || {}, at17 = doneAny([17, 20]);
      const qd = live ? (at17 ? [ui.khQdSo || (td ? no.qdT : no.qdV), ui.khQdNgay || at17] : null) : d.bm03;
      const rows = [
        ['TTr KHLCNT', live ? (doneAt(5) ? [no.ttr, doneAt(5)] : null) : d.bm01, 5],
        [td ? 'BC thẩm định KHLCNT' : 'BC kiểm tra KHLCNT', live ? (doneAny([10, 12]) ? [td ? no.bc : '', doneAny([10, 12])] : null) : d.bm02, td ? 12 : 10],
        ['QĐ phê duyệt KHLCNT', qd, td ? 15 : 11],
        ['Đăng tải KHLCNT', live ? (doneAt(22) ? [no.post, doneAt(22)] : null) : k.post, 22],
        ['Nhận xét của Ban Đầu tư XD', !td ? 'NA' : live ? (doneAt(13) ? [ui.khPnxSo, ui.khPnxNgay || doneAt(13)] : null) : null, 13],
        ['Phiếu trình GQCV', !td ? 'NA' : live ? (doneAt(14) ? [no.ptr, doneAt(14)] : null) : null, 14],
        ['Mã KHLCNT trên SAP', k.sap ? [k.sap, ''] : null, null]];
      return card('Checklist kế hoạch lựa chọn nhà thầu', table([['Nội dung', 260], ['Ngày văn bản', 130], ['Số văn bản', 200], ['Ngày soạn thảo', 170], ['Tệp', 90, 'c'], ['Bước', 260]], rows,
        (r) => (r[1] === 'NA' ? `<td>${esc(r[0])}</td><td colspan="4"><span class="faint">Không áp dụng với cấp phê duyệt Tổng Công ty</span></td><td>${dash}</td>`
          : `<td>${esc(r[0])}</td><td class="num">${r[1] && r[1][1] ? esc(r[1][1]) : dash}</td><td>${r[1] && r[1][0] ? esc(r[1][0]) : r[1] ? '<span class="faint">Không đánh số</span>' : dash}</td>
          <td class="num">${r[1] && r[2] && live && doneAt(r[2]) ? esc(doneAt(r[2])) : r[1] && r[1][1] ? esc(r[1][1]) : dash}</td>
          <td class="c">${r[1] && r[1][0] ? `<button type="button" class="vbtn icon ghost" aria-label="Tải xuống" data-dl="${esc(String(r[1][0]).replace(/\//g, '-'))}.pdf">${icon('download')}</button>` : dash}</td>
          <td>${r[2] ? esc(`${r[2]}. ${T18[r[2]].name}`) : '<span class="faint">Đồng bộ SAP</span>'}</td>`)),
      'Số, ngày văn bản lấy theo kết quả ký và đăng tải');
    };
    /* TĐ KHLCNT: VHT = Báo cáo kiểm tra (16 tiêu chí, bước 10); Tập đoàn = Báo cáo thẩm định (7 nội dung + ý kiến, bước 12). Có lịch sử các vòng trả sửa. */
    const thamDinh = () => {
      const [ok, nok] = D.khCrit.ok[td ? 'TD' : 'VHT'], stepN = td ? 12 : 10, title = td ? 'Báo cáo thẩm định KHLCNT' : 'Báo cáo kiểm tra KHLCNT';
      const nokS = k.checkNok || {};
      /* Bước đã xong mà biến chưa có (tua theo nhánh chính, không qua eForm) → giá trị mặc định của form: mọi tiêu chí đạt. */
      const dflt = () => (td ? D.khCrit.TD.map((tieuChi) => ({ tieuChi, kq: ok, nhanXet: '' })) : D.khCrit.VHT.flatMap(([nhom, list]) => list.map((tieuChi) => ({ nhom, tieuChi, kq: ok, nhanXet: '' }))));
      const rows = live ? ((td ? ui.khThamDinh : ui.khKiemTra) || (doneAt(stepN) ? dflt() : [])).map((r) => [r.nhom || '', r.tieuChi, r.kq, r.nhanXet])
        : (k.docs && k.docs.bm02) || k.checkNok ? (td ? D.khCrit.TD.map((c) => ['', c, nokS[c] ? nok : ok, nokS[c] || ''])
          : D.khCrit.VHT.flatMap(([grp, list]) => list.map((c) => [grp, c, nokS[c] ? nok : ok, nokS[c] || '']))) : [];
      if (!rows.length) return waitCard(title, [stepN]);
      const rounds = hist(stepN).filter((h) => h.who).map((h) => [Flow.dateOf(h.t), persona(h.who).name, h.action, h.reason || '']);
      return card(title, table(td ? [['Nội dung thẩm định', 360], ['Kết quả thẩm định', 220, 'c'], ['Ý kiến thẩm định', 460]] : [['Nhóm', 260], ['Tiêu chí', 380], ['Kết quả', 150, 'c'], ['Nội dung không đáp ứng', 380]], rows,
        (r) => `${td ? '' : `<td>${clamp(r[0])}</td>`}<td>${clamp(r[1])}</td><td class="c">${r[2] === nok ? badge(nok, 'error') : badge(ok, 'success')}</td><td>${clamp(r[3])}</td>`),
      td ? 'BM02 cấp Tập đoàn — Bảng số 2' : 'BM02 cấp VHT — 16 tiêu chí')
        + (ui.khNhanXet ? card('Nhận xét và kiến nghị', `<p>${esc(ui.khNhanXet)}</p>`) : '')
        + (rounds.length ? card(td ? 'Các lần thẩm định' : 'Các lần kiểm tra', table([['Ngày', 130], ['Người thực hiện', 220], ['Kết quả', 260], ['Nội dung trả sửa', 460]], rounds,
          (r) => `<td class="num">${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${clamp(r[3])}</td>`)) : '');
    };
    /* Cam kết TTĐ (IMG 7243, HT-THAU-XLS 1.3.2.7): mỗi thành viên một Bản cam kết — bước 8 (multi-instance). */
    const camKet = () => {
      if (live) {
        if (!doneAt(6)) return waitCard('Bản cam kết thành viên Tổ thẩm định', [6, 8]);
        const ck = ui.khCamKet || {}, wait = new Set(C.tokens.filter((x) => String(x.task) === '8').map((x) => x.who));
        return card('Bản cam kết thành viên Tổ thẩm định', table([['Họ và tên', 220], ['Vai trò trong Tổ thẩm định', 180], ['Số CCCD', 160], ['Nơi cấp', 220], ['Trạng thái', 160, 'c'], ['Thời điểm cam kết', 150], ['Tệp', 80, 'c']], liveTeam(),
          (r) => { const h8 = hist(8).filter((h) => h.who === r[4]).pop(), x = ck[r[4]] || (h8 ? { soCccd: '', noiCap: '', at: Flow.dateOf(h8.t) } : null); return `<td>${esc(r[0])}</td><td>${esc(r[2])}</td><td>${x ? esc(x.soCccd) : dash}</td><td>${x ? clamp(x.noiCap) : dash}</td>
            <td class="c">${x ? badge('Đã cam kết', 'success') : wait.has(r[4]) ? badge('Chờ cam kết', 'warning') : badge('Chưa giao', 'default')}</td><td class="num">${x ? esc(x.at) : dash}</td>
            <td class="c">${x ? `<button type="button" class="vbtn icon ghost" aria-label="Tải xuống" data-dl="Ban-cam-ket-${esc(r[4])}.pdf">${icon('download')}</button>` : dash}</td>`; }),
        'Căn cứ Điều 66 Quy định mua sắm thường xuyên 1340/QĐ-CNVTQĐ');
      }
      if (!(k.docs && k.docs.bm01)) return waitCard('Bản cam kết thành viên Tổ thẩm định', [6, 8]);
      const off = Number(k.code.slice(-2)), at = k.docs.bm01[1];
      return card('Bản cam kết thành viên Tổ thẩm định', table([['Họ và tên', 260], ['Vai trò trong Tổ thẩm định', 220], ['Trạng thái', 160, 'c'], ['Thời điểm cam kết', 160]],
        [0, 1, 2, 3, 4].map((i) => [PEOPLE[(off + i) % PEOPLE.length], i ? 'Thành viên' : 'Tổ trưởng']),
        (r) => `<td>${esc(r[0])}</td><td>${esc(r[1])}</td><td class="c">${badge('Đã cam kết', 'success')}</td><td class="num">${esc(at)}</td>`));
    };
    /* QĐ KHLCNT (IMG 7245): dự thảo BM03 (bước 11 / 15), phương thức ký, kết quả ký (16–20). */
    const quyetDinh = () => {
      const draftN = td ? 15 : 11;
      if (live) {
        if (!doneAt(draftN)) return waitCard('Quyết định phê duyệt KHLCNT', [draftN]);
        const at17 = doneAny([17, 20]), hard = C.vars.khKy === 'CUNG';
        const signs = C.history.filter((h) => ['16', '17', '18', '19', '20'].includes(String(h.task))).map((h) => [Flow.dateOf(h.t), `${h.task}. ${T18[h.task].name}`, h.who ? persona(h.who).name : 'Hệ thống', h.reason || h.action || '']);
        return card('Quyết định phê duyệt KHLCNT', `<div class="ginfo c3">${kv('Biểu mẫu', td ? 'BM03 cấp Tập đoàn' : 'BM03 cấp VHT')}${kv('Số quyết định', at17 ? esc(ui.khQdSo || (td ? no.qdT : no.qdV)) : null)}${kv('Ngày ký', at17 ? esc(ui.khQdNgay || at17) : null)}
          ${kv('Người ký', esc(td ? 'Tổng Giám đốc Tập đoàn' : persona('tgd').name + ' — Tổng Giám đốc Tổng Công ty'))}${kv('Phương thức ký', hard ? 'Ký cứng' : 'VOffice')}${kv('Trạng thái', at17 ? badge('Đã ký', 'success') : C.status === 'running' ? badge('Đang trình ký', 'info') : badge('Chưa ký', 'default'))}
          ${kv('Ghi chú rà soát dự thảo', ui.khQdGhiChu ? esc(ui.khQdGhiChu) : null, 'span2')}</div>`)
          + (signs.length ? card('Lịch sử trình ký', table([['Ngày', 130], ['Bước', 300], ['Người / hệ thống', 200], ['Nội dung', 420]], signs,
            (r) => `<td class="num">${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${clamp(r[3])}</td>`)) : '');
      }
      const d = (k.docs || {}).bm03;
      if (!d) return waitCard('Quyết định phê duyệt KHLCNT', [draftN]);
      return card('Quyết định phê duyệt KHLCNT', `<div class="ginfo c3">${kv('Biểu mẫu', td ? 'BM03 cấp Tập đoàn' : 'BM03 cấp VHT')}${kv('Số quyết định', esc(d[0]))}${kv('Ngày ký', esc(d[1]))}${kv('Người ký', esc(d[2]))}${kv('Trạng thái', badge('Đã ký', 'success'))}</div>`);
    };
    /* Phiếu trình GQCV (IMG 7249, HT-THAU-XLS 1.3.2.9): chỉ cấp Tập đoàn — ý kiến Ban ĐTXD (bước 13), giải trình + mục đích + lý do (bước 14). */
    const phieuTrinh = () => {
      if (!td) return emptyCard('Phiếu trình giải quyết công việc', 'Không áp dụng với cấp phê duyệt Tổng Công ty — Phiếu trình GQCV chỉ lập khi KHLCNT trình Tổng Giám đốc Tập đoàn phê duyệt.');
      if (!live || !doneAt(13)) return waitCard('Phiếu trình giải quyết công việc', [13, 14]);
      const yk = ui.khYKien || [];
      return card('Phiếu nhận xét của Ban Đầu tư — Xây dựng Tập đoàn', `<div class="ginfo c3">${kv('Số phiếu', esc(ui.khPnxSo))}${kv('Ngày phiếu', esc(ui.khPnxNgay))}${kv('Số ý kiến', String(yk.length))}</div>`)
        + card('Ý kiến Ban ĐTXD và giải trình của VHT', table([['Ý kiến', 460], ['Giải trình của VHT', 520]], yk, (r) => `<td>${clamp(r.noiDung)}</td><td>${r.giaiTrinh ? clamp(r.giaiTrinh) : dash}</td>`))
        + (doneAt(14) ? card('Phiếu trình giải quyết công việc', `<div class="ginfo c3">${kv('Mẫu', gs.length > 1 ? 'Phiếu trình KHLCNT nhiều gói' : 'Phiếu trình KHLCNT một gói')}${kv('Ngày lập', esc(doneAt(14)))}
          ${kv('Mục đích', esc(ui.khMucDich), 'span3')}${kv('Lý do lựa chọn hình thức đấu thầu', esc(ui.khLyDoHinhThuc), 'span3')}</div>`) : waitCard('Phiếu trình giải quyết công việc', [14]));
    };
    /* Gói thầu: KHLCNT chạy luồng — sau bước 3 (tạo gói) mới có danh sách gói. */
    const goiTab = () => (live && !doneAt(3) ? waitCard('Danh sách gói thầu', [3]) : goi());
    const TABS = [['info', 'Thông tin chung'], ['checklist', 'Checklist'], ['goi', 'Gói thầu/ Công việc thuộc KHLCNT'], ['to-trinh', 'TTr KHLCNT'], ['tham-dinh', 'TĐ KHLCNT'],
      ['cam-ket', 'Cam kết TTĐ'], ['quyet-dinh', 'QĐ KHLCNT'], ['phieu-trinh', 'Phiếu trình GQCV']].concat(vs.length || k.st === 'ADJ' ? [['phien-ban', 'Phiên bản & điều chỉnh']] : []);
    return `<div class="pg">
      ${head({ title: 'Xem chi tiết kế hoạch lựa chọn nhà thầu', back: 'khlcnt', lg: true, info, right })}
      ${tabs('kh:' + k.code, TABS, { info: () => infoCards, checklist, goi: goiTab, 'to-trinh': toTrinh, 'tham-dinh': thamDinh, 'cam-ket': camKet, 'quyet-dinh': quyetDinh, 'phieu-trinh': phieuTrinh, 'phien-ban': phienBan })}</div>`;
  }
  /* Bước hiện tại: hồ sơ MS18 đang chạy → tên các việc đang mở (BPMN-MS18-TOBE); không thì theo trạng thái mẫu. */
  function khStep(k) { return (k.prog || khProg(k)).step; }
  /* KHLCNT mẫu chạy được trên MS18 (T67 T2): tua theo nhánh chính tới bước của mẫu. 0016 cấp Tập đoàn đang thẩm định (bước 12). */
  const KH_SAMPLE = { 'KHLCNT-2026-0016': { target: 12 }, 'KHLCNT-2026-0019': { target: 13 }, 'KHLCNT-2026-0020': { target: 21 } };
  /* Gói mẫu chạy được trên MS19 (T67 T5): rộng rãi 1 túi GT-2026-0029 đang ở đánh giá HSDT; chỉ định thầu GT-2026-0022 đang đánh giá HSĐX. */
  /* T80 L1: GT-2026-0031 chỉ định thầu rút gọn chạy tới 7.5 (thư mời thương thảo, không HSYC); GT-2026-0048 mua sắm trực tiếp tới 7.6 (kiểm tra điều kiện). */
  const PK_SAMPLE = { 'GT-2026-0029': { target: '3.5' }, 'GT-2026-0022': { target: '7.3' }, 'GT-2026-0031': { target: '7.5' }, 'GT-2026-0048': { target: '7.6' }, 'GT-2026-0024': { target: 5 }, 'GT-2026-0026': { target: 14 } };
  function lcStart(code, target) {
    const g = pkOf(code), c = Flow.startLc(code, { name: g.name, target });
    const tok = Flow.caseTokens(Flow.state.persona).find((t) => t.caseCode === c);
    toast(`<b>Thành công</b><br>Đã khởi tạo tổ chức lựa chọn nhà thầu ${esc(code)}, hồ sơ xử lý ${esc(c)}.`);
    location.hash = tok ? '#/task/' + tok.id : '#/ho-so-hd/' + encodeURIComponent(c);
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-lc-start]');
    if (b) { lcStart(b.dataset.lcStart); return; }
    const s = e.target.closest('[data-lc-sample]');
    if (s) lcStart(s.dataset.lcSample, PK_SAMPLE[s.dataset.lcSample].target);
  });
  function khStart(code, target) {
    const k = khOf(code);
    const c = Flow.startKh(code, { level: levelOf(k), name: k.title, target });
    const tok = Flow.caseTokens(Flow.state.persona).find((t) => t.caseCode === c);
    toast(`<b>Thành công</b><br>Đã khởi tạo ${esc(code)}, hồ sơ xử lý ${esc(c)}.`);
    location.hash = tok ? '#/task/' + tok.id : '#/ho-so-hd/' + encodeURIComponent(c);
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-kh-start]');
    if (b) {
      const code = b.dataset.khStart, k = khOf(code);
      const m = modal(`<div class="modal-h"><h3>Khởi tạo kế hoạch lựa chọn nhà thầu</h3></div><div class="modal-b"><p>Khởi tạo ${esc(code)} theo cấp phê duyệt <b>${esc(LEVEL[levelOf(k)])}</b>. Sau khi khởi tạo, cấp phê duyệt không đổi được; cần đổi thì huỷ hồ sơ và tạo KHLCNT mới.</p></div>
        <div class="modal-f"><button class="btn secondary" data-close>Huỷ</button><button class="btn primary" id="kh-start-ok">Khởi tạo</button></div>`);
      m.el.querySelector('#kh-start-ok').onclick = () => { m.close(); khStart(code); };
      return;
    }
    const s = e.target.closest('[data-kh-sample]');
    if (s) khStart(s.dataset.khSample, KH_SAMPLE[s.dataset.khSample].target);
  });
  /* Điều chỉnh KHLCNT: lý do bắt buộc → phiên bản mới ở trạng thái Đang điều chỉnh (chạy lại MS18), bản đã duyệt giữ nguyên. */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-kh-adj]');
    if (!b) return;
    const code = b.dataset.khAdj;
    const m = modal(`<div class="modal-h"><h3>Điều chỉnh kế hoạch lựa chọn nhà thầu</h3></div><div class="modal-b">
      <div class="vfield"><div class="lr"><label>Lý do điều chỉnh</label><span class="req" aria-hidden="true">*</span></div><textarea class="vctl ta" id="adj-why" maxlength="1000" placeholder="Nhập lý do điều chỉnh (giá, phạm vi, hình thức lựa chọn nhà thầu…)"></textarea><p class="msg" id="adj-err" role="alert" hidden>Bạn cần nhập Lý do điều chỉnh.</p></div></div>
      <div class="modal-f"><button class="btn secondary" data-close>Huỷ</button><button class="btn primary" id="adj-ok">Xác nhận</button></div>`);
    m.el.querySelector('#adj-ok').onclick = () => {
      const why = m.el.querySelector('#adj-why').value.trim();
      if (!why) { m.el.querySelector('#adj-err').hidden = false; m.el.querySelector('.vfield').classList.add('invalid'); return; }
      U.adj[code] = { st: 'ADJ', adjWhy: why, updated: Flow.dateOf(Flow.state.clock) };
      persist(); m.close();
      toast('<b>Thành công</b><br>Đã tạo phiên bản điều chỉnh KHLCNT.');
      rerender();
    };
  });


  /* ---------- SCR-81 Danh sách gói thầu ---------- */
  const pkRow = (g0) => { const g = pkM(g0), k = khOf(g.kh), stx = k && k.st === 'OK' ? g.st : 'KH'; return Object.assign({}, g, { stx, unit: k ? (totals(k).s || {}).unit : '', lc: pkLc(g, stx, k), prog: pkProg(g, stx, k) }); };
  /* T67 T5: hồ sơ MS19 của gói (HSLC-…) đang chạy → trạng thái theo thuộc tính lc của bước; KHLCNT đã Hoàn thành mà gói chưa khởi tạo → LC-01 chờ bước 1. */
  const lcCaseOf = (code) => Flow.caseOf(D.hdCaseCode(code, 'MS19'));
  const lcRun = (g) => { const c = lcCaseOf(g.code); return c && c.status === 'running' ? c : null; };
  const lcTok = (c) => c.tokens.find((t) => D.flows.MS19[t.task] && !D.flows.MS19[t.task].gw);
  const pkLc = (g, stx, k) => { const c = lcRun(g), t = c && lcTok(c);
    if (c) return t ? D.flows.MS19[t.task].lc : 'LC-01';
    if (stx === 'KH' && k && k.st === 'OK') return 'LC-01';
    return stx === 'KQ' && window.HopDong && window.HopDong.byPkg(g.code) ? 'LC-11' : LC_MAP[stx]; };
  /* Gợi ý mẫu hợp đồng (H-Q2, GIẢ LẬP — nguồn không ghi quy tắc): theo Loại gói thầu; nhà thầu nước ngoài → mẫu quốc tế; xây lắp chưa có mẫu → 1.6 (H-Q6). */
  const mauGoiY = (g) => { if (g.mau) return g.mau; const nn = g.winner && D.nccOf(g.winner).kind === 'NN';
    if (nn) return ['PTV', 'TV'].includes(g.type) ? '9' : '10';
    return { MS_HH: '1.0', HH_LD: '1.6', PM: '1.8', PTV: '3.0', TV: '5', XL: '1.6' }[g.type] || '1.6'; };
  /* MS19 bước 24 (service): đóng tổ chức LCNT — gói có KQLCNT (nhà thầu, giá, QĐ), mẫu hợp đồng của HSMT; số QĐ GIẢ LẬP theo mã gói khi ký VOffice. */
  function lcFlowDone(code) {
    const S0 = Flow.state, u = S0.ui || {}, g = pkOf(code);
    if (!g) return;
    const at = (n) => { const h = S0.history.filter((x) => String(x.task) === String(n)).pop(); return h ? Flow.dateOf(h.t) : ''; };
    const dg = u.lcDanhGia || [], win = u.lcNhaThau || (dg[0] || {}).ma || (g.bidders && g.bidders[0] ? g.bidders[0][0] : 'NCC-000001');
    const price = u.lcGiaTT != null && u.lcGiaTT !== '' ? Number(u.lcGiaTT) : ((dg.find((r) => r.ma === win) || {}).giaSo || g.price);
    /* T80 L2: giữ năng lực, điểm kỹ thuật, lý do và sửa lỗi / hiệu chỉnh / giảm giá của bảng đánh giá; nhà thầu trúng thầu ghi giá đề nghị trúng thầu (đã gồm hiệu chỉnh). */
    const bid = dg.length ? dg.map((r) => [r.ma, r.ma === win ? price : r.giaSo, r.hopLe, r.nangLuc || r.hopLe, r.kyThuat === 'Không đạt' ? 'Không đạt' : r.diemKt != null ? r.diemKt : null, r.ghiChu || null,
      r.ma === win ? null : [Number(r.suaLoi) || 0, Number(r.hieuChinh) || 0, Number(r.giamGia) || 0]]) : [[win, price, 'Đạt', 'Đạt', null]];
    const kqForm = ['GIAO_NV', 'TU_TH', 'DAT_HANG'].includes(g.form);
    U.pk[code] = Object.assign({}, U.pk[code], { st: 'KQ', winner: win, bidders: bid, mau: u.lcMauHd || mauGoiY(g),
      kq: [u.lcQdSo || `0${950 + Number(code.slice(-2))}/QĐ-VHT`, u.lcQdNgay || at(S0.vars.lcKy === 'CUNG' ? 18 : 17) || at(24)],
      /* Tình huống mẫu chưa xử lý được xử lý trong quá trình tổ chức LCNT. */
      events: (g.events || []).map((x) => (/^Đã/.test(x[3]) ? x : [x[0], x[1], x[2], 'Đã xử lý trong tổ chức LCNT'])) }, kqForm ? { assignee: D.nccOf(win).name || win } : {});
    persist();
  }
  /* Tiến độ gói đang chạy MS19: việc đang mở; vướng mắc = lý do trả sửa HSMT / KQLCNT, người ký từ chối. */
  function lcProg(c, g) {
    const ts = c.tokens.filter((t) => D.flows.MS19[t.task] && !D.flows.MS19[t.task].gw), t0 = ts[0];
    const lc = t0 ? D.flows.MS19[t0.task].lc : 'LC-01', P = (o) => Object.assign({ gd: LC[lc][2], step: '', who: '', since: null, due: null, days: null, issue: '' }, o);
    if (!t0) return P({});
    const tn = (n) => ((window.BPMN_FLOWS.MS19 || { tasks: {} }).tasks[n] || {}).name || '';
    const since = Math.min(...ts.map((t) => t.since)), now = nowNlv(c), dl = since + Math.max(1, Math.ceil((D.flows.MS19[t0.task].nlv || 0.5) * 2));
    const back = [...c.history].reverse().find((h) => h.reason && ['3.2', '14'].includes(String(h.task)));
    const n = String(t0.task), issue = n === '3.1' && back && String(back.task) === '3.2' ? 'Trả sửa HSMT: ' + back.reason : n === '15' && back ? 'Trả sửa: ' + back.reason
      : n === '21' ? 'Người ký từ chối Quyết định phê duyệt KQLCNT' : n === '3.4' && (c.ui.lcGiaHan || []).length ? 'Gia hạn đóng thầu đến ' + c.ui.lcGiaHan.slice(-1)[0].dongMoi : '';
    return P({ step: [...new Set(ts.map((t) => `${t.task}. ${tn(t.task)}`))].join(', '), who: `${persona(t0.who).unit} / ${[...new Set(ts.map((t) => persona(t.who).name))].join(', ')}`,
      since: Flow.dateOf(since), due: Flow.dateOf(dl), late: dl < now, days: Math.max(0, Math.floor(now - since)), issue });
  }
  /* Tiến độ gói (§7): bước hiện tại = bước đầu chưa xong của trình tự theo hình thức (như bảng Trình tự ở Chi tiết gói); vướng mắc = tình huống / kiến nghị chưa xong.
     Bắt đầu bước, hạn GIẢ LẬP theo mã gói tới khi MS19 chạy theo gói (T5). */
  function pkProg(g, stx, k) {
    const c = lcRun(g);
    if (c) return lcProg(c, g);
    if (stx === 'KH' && k && k.st === 'OK') { const since = Flow.clockOf(k.updated), now = nowNlv(null), p = persona('thau');
      return { gd: LC['LC-01'][2], step: `1. ${((window.BPMN_FLOWS.MS19 || { tasks: {} }).tasks[1] || {}).name || ''}`, who: `${p.unit} / ${p.name}`, since: k.updated, due: Flow.dateOf(since + 1), late: since + 1 < now, days: Math.max(0, now - since), issue: '' }; }
    const lc = pkLc(g, stx, k), P = (o) => Object.assign({ gd: LC[lc][2], step: '', who: '', since: null, due: null, days: null, issue: '' }, o);
    if (lc === 'CHO-KH') return P({ step: k ? `${k.code}: ${k.prog.step || KHL[k.prog.khl][0]}` : '' });
    const open = (g.events || []).filter((x) => !/^Đã/.test(x[3])).pop(), issue = open ? `${open[0]} — ${open[3]}` : '';
    if (['LC-11', 'LC-X'].includes(lc)) return P({ issue });
    const steps = STEPS[g.form === 'DTRR' && g.method === '1GD2T' ? 'DTRR2' : g.form] || [], cur = lc === 'LC-10' ? ['Chuyển ký hợp đồng'] : steps.find((r) => r[1] >= LV[stx]);
    const now = nowNlv(null), d = 1 + (Number(g.code.slice(-2)) % 5), since = now - d, dl = since + 5;
    return P({ step: cur ? cur[0] : '', who: LC_WHO[lc] || '', since: Flow.dateOf(since), due: Flow.dateOf(dl), late: dl < now, days: d, issue });
  }
  function pkList() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/profile-management/profile-list/profile-list.component.html
    return listPage({
      id: 'gtl', title: 'Danh sách gói thầu', ph: 'Tìm kiếm theo mã, tên gói thầu, mã KHLCNT',
      rows: () => PK.map(pkRow), kwText: (g) => `${g.code} ${g.name} ${g.kh}`,
      empty: () => ({ code: '', name: '', kh: '', type: null, form: [], method: null, st: [], gd: null }),
      match: (g, f) => has(f.code, g.code) && has(f.name, g.name) && has(f.kh, g.kh) && (!f.type || g.type === f.type) && inSet(f.form, g.form) && (!f.method || g.method === f.method) && inSet(f.st, g.lc) && (!f.gd || g.prog.gd === f.gd),
      adv: (txt, sel) => `${txt('code', 'Mã gói thầu')}${txt('name', 'Tên gói thầu')}${txt('kh', 'Mã KHLCNT')}
        ${sel('type', 'Loại gói thầu', { options: catOpts('loai-goi-thau') })}${sel('form', 'Hình thức LCNT', { multi: true, options: catOpts('hinh-thuc-lcnt') })}
        ${sel('method', 'Phương thức LCNT', { searchable: false, options: catOpts('phuong-thuc-lcnt') })}
        ${sel('st', 'Trạng thái', { multi: true, searchable: false, options: Object.entries(LC).map(([value, [label]]) => ({ value, label })) })}
        ${sel('gd', 'Giai đoạn', { searchable: false, options: [...new Set(Object.values(LC).map((x) => x[2]))].map((u) => ({ value: u, label: u })) })}`,
      cols: [['Trạng thái', 230, 'c'], ['Mã gói thầu', 150], ['Tên gói thầu', 320], ...PROG_COLS, ['Mã KHLCNT', 170], ['Loại gói thầu', 200], ['Giá gói thầu (tỷ đồng)', 170, 'r'],
        ['Hình thức LCNT', 190], ['Phương thức LCNT', 210], ['Thời gian bắt đầu LCNT', 160], ['Đơn vị', 200]],
      href: pkHref,
      cell: (g) => `<td class="c">${stBadge(LC, g.lc)}</td><td>${pkLink(g)}</td><td>${clamp(g.name)}</td>${progCells(g.prog)}<td><a class="link" data-go="khlcnt/${encodeURIComponent(g.kh)}">${esc(g.kh)}</a></td>
        <td>${clamp(cat('loai-goi-thau', g.type))}</td><td class="r num">${money(g.price)}</td><td>${clamp(cat('hinh-thuc-lcnt', g.form))}</td><td>${clamp(cat('phuong-thuc-lcnt', g.method))}</td>
        <td>${esc(g.start)}</td><td>${clamp(g.unit)}</td>`,
      info: {
        scr: 'SCR-81', name: 'Danh sách gói thầu', uc: 'Backlog W1_T10 › Quản lý gói thầu › Tra cứu gói thầu (dòng 334–335)',
        notes: [
          'Khuôn profile-list. Gói thầu là dòng gói của KHLCNT (tạo ở MS18 bước 3, không thêm mới ở đây); trạng thái theo giai đoạn tổ chức LCNT. Gói của KHLCNT chưa phê duyệt hiện "Chờ phê duyệt KHLCNT".',
          '<b>T67 T4</b>: trạng thái theo backbone LC-01 Đang chuẩn bị hồ sơ LCNT … LC-11 Hoàn thành lựa chọn nhà thầu, LC-X Đã hủy / Không thực hiện (THAU-TT-1311 §4.1; mã hiện khi rê chuột) + Giai đoạn lớn. Gói của KHLCNT chưa Hoàn thành: "Chờ hoàn thành KHLCNT" (GIẢ LẬP — §4.1 không có mã; Bước hiện tại ghi bước của KHLCNT). Mẫu quy đổi trạng thái cũ theo §2: Đang mời thầu → LC-04, Đang đánh giá → LC-06, tình huống 01 HSDT lúc đóng thầu → LC-05, Chờ phê duyệt KQLCNT → LC-08, Đã có KQLCNT → LC-10 (đã tạo hợp đồng → LC-11), Đã huỷ thầu → LC-X.',
          'Cột tiến độ như Danh sách KHLCNT (§7). Bước hiện tại = bước đầu chưa xong trong Trình tự theo hình thức LCNT; Vướng mắc = tình huống / kiến nghị chưa xử lý xong. Người xử lý, Bắt đầu bước, Hạn xử lý GIẢ LẬP theo giai đoạn tới khi tổ chức LCNT (MS19) chạy theo từng gói (T5).',
        ],
        q: ['P-77'], src: 'profile-management/profile-list · /khcn-profile-management',
      },
    });
  }

  /* ---------- SCR-82 Chi tiết gói thầu ---------- */
  /* Trình tự theo hình thức (QC-12869 Điều 12–21); lv = giai đoạn gói đạt tới khi bước hoàn thành. */
  const STEPS = {
    DTRR: [['Lập, thẩm định, phê duyệt HSMT', 1], ['Phát hành, sửa đổi, làm rõ HSMT; tiếp nhận HSDT', 2], ['Mở thầu, đánh giá HSDT', 3], ['Thương thảo hợp đồng', 4], ['Thẩm định, phê duyệt, công khai KQLCNT', 5]],
    DTRR2: [['Lập, thẩm định, phê duyệt HSMT', 1], ['Phát hành, sửa đổi, làm rõ HSMT; tiếp nhận HSDT', 2], ['Mở thầu, đánh giá HSĐXKT', 3], ['Phê duyệt danh sách nhà thầu đáp ứng kỹ thuật', 3],
      ['Mở thầu, đánh giá HSĐXTC', 3], ['Thương thảo hợp đồng', 4], ['Thẩm định, phê duyệt, công khai KQLCNT', 5]],
    DTHC: [['Phê duyệt danh sách ngắn (tối thiểu 03 nhà thầu)', 1], ['Lập, thẩm định, phê duyệt HSMT', 1], ['Phát hành HSMT cho danh sách ngắn; tiếp nhận HSDT', 2], ['Mở thầu, đánh giá HSDT', 3], ['Thương thảo hợp đồng', 4], ['Thẩm định, phê duyệt, công khai KQLCNT', 5]],
    CGTT: [['Lập HSMCG (giá thấp nhất, không bảo đảm dự thầu)', 1], ['Đăng tải, chào giá trên Cổng đấu thầu Viettel', 2], ['Đánh giá HSCG, xếp hạng theo giá', 3], ['Phê duyệt, công khai KQLCNT', 5]],
    /* T80 L1 (D-132): mua sắm trực tiếp theo Điều 15 khoản 2–4, chỉ định thầu rút gọn theo Điều 16 khoản 5 — không HSYC / HSĐX. */
    MSTT: [['Kiểm tra điều kiện với gói tham chiếu: trúng qua đấu thầu rộng rãi / hạn chế, khối lượng ≤ 150%, đơn giá không vượt, KQLCNT trong 12 tháng', 1],
      ['Gửi thư mời thương thảo kèm dự thảo hợp đồng cho nhà thầu đã trúng gói tham chiếu', 2], ['Thương thảo, hoàn thiện hợp đồng (không thành: mời nhà thầu xếp hạng tiếp theo)', 4], ['Phê duyệt, công khai KQLCNT', 5]],
    CDT_TT: [['Lập, phê duyệt HSYC', 1], ['Phát hành HSYC cho nhà thầu được đề nghị', 2], ['Đánh giá HSĐX', 3], ['Thương thảo hợp đồng', 4], ['Phê duyệt, công khai KQLCNT', 5]],
    CDT_RG: [['Gửi thư mời thương thảo kèm dự thảo hợp đồng cho nhà thầu dự kiến', 2], ['Thương thảo, hoàn thiện hợp đồng', 4], ['Phê duyệt, công khai KQLCNT', 5]],
    DPTT: [['Lập danh sách nhà thầu / hãng, đoàn đàm phán, phương án đàm phán', 1], ['Phê duyệt phương án đàm phán', 2], ['Tổ chức đàm phán', 3], ['Phê duyệt KQLCNT', 5]],
    DAT_HANG: [['Lập phương án đặt hàng', 1], ['Phê duyệt phương án, gửi đơn vị nhận đặt hàng', 2], ['Ký hợp đồng đặt hàng', 5]],
    GIAO_NV: [['Lập phương án giao nhiệm vụ', 1], ['Phê duyệt, ban hành văn bản giao nhiệm vụ', 5]],
    TU_TH: [['Kiểm tra điều kiện tự thực hiện (năng lực, giới hạn chuyển giao công việc)', 1], ['Phê duyệt phương án tự thực hiện', 2], ['Giao đơn vị thực hiện', 5]],
    DAC_BIET: [['Chấp thuận chủ trương áp dụng trường hợp đặc biệt (TGĐ Tập đoàn)', 1], ['Phê duyệt phương án lựa chọn nhà thầu', 2], ['Tổ chức thực hiện theo phương án', 3], ['Phê duyệt KQLCNT', 5]],
  };
  const COND = {
    DTRR: 'Không hạn chế số lượng nhà thầu (Điều 12).', DTHC: 'Gói có yêu cầu cao hoặc đặc thù về kỹ thuật, hoặc chọn trong danh sách Nhà thầu chiến lược; danh sách ngắn tối thiểu 03 nhà thầu (Điều 13).',
    CGTT: 'Giá gói không quá 05 tỷ đồng; hàng hoá thông dụng, sẵn có, dịch vụ phi tư vấn, xây lắp / hỗn hợp đơn giản (Điều 14).',
    MSTT: 'Gói tương tự đã có KQLCNT, nhà thầu trúng qua đấu thầu rộng rãi / hạn chế; khối lượng từng hạng mục không quá 150%; đơn giá không vượt; phê duyệt KQLCNT gói trước không quá 12 tháng (Điều 15 khoản 2).',
    CDT_TT: 'Thuộc trường hợp chỉ định thầu (Điều 16); có HSYC, HSĐX, đánh giá và thương thảo.', CDT_RG: 'Thuộc trường hợp chỉ định thầu theo trình tự rút gọn (Điều 16 khoản 3).',
    DPTT: 'Có danh sách nhà thầu / hãng sản xuất chiến lược, đoàn đàm phán và phương án đàm phán được duyệt (Điều 17).',
    DAT_HANG: 'Giữa Đơn vị phụ thuộc và Đơn vị thành viên theo điều kiện của Quy chế (Điều 18).', GIAO_NV: 'Nguyên tắc, trình tự tương tự Đặt hàng (Điều 19).',
    TU_TH: 'Đơn vị có năng lực; không chuyển giao công việc vượt giới hạn của Quy chế (Điều 20).',
    DAC_BIET: 'Không áp dụng được các hình thức khác; lưu lý do, căn cứ và phương án được chấp thuận (Điều 21).',
  };
  const DOCK = { DTRR: 'HSMT', DTHC: 'HSMT', CGTT: 'HSMCG', MSTT: 'Dự thảo hợp đồng', CDT_TT: 'HSYC', CDT_RG: 'Dự thảo hợp đồng', DPTT: 'Phương án đàm phán' };
  /* T80 L1 — gói tham chiếu cho mua sắm trực tiếp (Điều 15 khoản 1–2): gói có KQLCNT trong ĐTMS (đấu thầu rộng rãi / hạn chế) + gói năm 2025 chuyển đổi
     từ hệ thống cũ (D.lcPriorPkgs). Gói ĐTMS chưa lưu đơn giá hạng mục → Tổ chuyên gia nhập ở bảng so sánh của bước 7.6. */
  function lcRefPkgs() {
    const own = PK.filter((g) => ['DTRR', 'DTHC'].includes(g.form) && g.kq && g.winner).map((g) => ({ code: g.code, name: g.name, form: g.form, kq: g.kq,
      rank: [[g.winner, ((g.bidders || []).find((b) => b[0] === g.winner) || [])[1]]].concat((g.bidders || []).filter((b) => b[0] !== g.winner && b[2] === 'Đạt' && b[3] === 'Đạt').sort((a, b) => a[1] - b[1]).map((b) => [b[0], b[1]])),
      items: (g.items || []).map((i) => [i[0], i[1], i[2], null]) }));
    return (D.lcPriorPkgs || []).concat(own);
  }
  const lcRefOf = (code) => lcRefPkgs().find((r) => r.code === code) || null;
  /* Bốn điều kiện Điều 15 khoản 2 (bộ xử lý hành động của bước 7.6 dùng lại khi xác nhận). cmp = bảng so sánh hạng mục của eForm
     [{ hangMuc, klTruoc, klNay, dgTruoc, dgNay }]; ngay = ngày kiểm tra (dd/mm/yyyy). Trả về [{ dk, yeuCau, thucTe, kq: 'Đạt' | 'Không đạt' }]. */
  function lcCheck15(refCode, cmp, ngay) {
    const r = lcRefOf(refCode), rows = cmp || [], P = (s) => { const [d, m, y] = String(s || '').split('/').map(Number); return new Date(y, (m || 1) - 1, d || 1); };
    const kl = rows.filter((x) => Number(x.klTruoc) > 0).map((x) => [x.hangMuc, Math.round((Number(x.klNay) || 0) / Number(x.klTruoc) * 100)]);
    const dg = rows.filter((x) => Number(x.dgTruoc) > 0 && x.dgNay != null && x.dgNay !== '').map((x) => [x.hangMuc, Number(x.dgNay) <= Number(x.dgTruoc)]);
    const thang = r ? (P(ngay) - P(r.kq[1])) / (1000 * 3600 * 24 * 30.44) : null;
    const ok = (b) => (b ? 'Đạt' : 'Không đạt');
    return [
      { dk: 'a) Nhà thầu trúng gói tham chiếu qua đấu thầu rộng rãi / hạn chế', yeuCau: 'Đấu thầu rộng rãi hoặc đấu thầu hạn chế', thucTe: r ? cat('hinh-thuc-lcnt', r.form) : 'Chưa chọn gói tham chiếu', kq: ok(r && ['DTRR', 'DTHC'].includes(r.form)) },
      { dk: 'b) Khối lượng từng hạng mục', yeuCau: 'Không quá 150% hạng mục tương ứng', thucTe: kl.length ? kl.map(([h, p]) => `${h}: ${p}%`).join('; ') : 'Chưa nhập bảng so sánh', kq: ok(kl.length && kl.every(([, p]) => p <= 150)) },
      { dk: 'c) Đơn giá (chưa thuế)', yeuCau: 'Không vượt đơn giá gói tham chiếu', thucTe: dg.length ? dg.map(([h, b]) => `${h}: ${b ? 'không vượt' : 'vượt'}`).join('; ') : 'Chưa nhập đơn giá', kq: ok(dg.length && dg.every(([, b]) => b)) },
      { dk: 'd) Thời gian từ phê duyệt KQLCNT gói tham chiếu', yeuCau: 'Không quá 12 tháng', thucTe: r ? `${r.kq[0]} ngày ${r.kq[1]} — ${ty(Math.max(thang, 0), 1)} tháng` : '-', kq: ok(r && thang != null && thang <= 12) },
    ];
  }
  /* T80 L2 (QC-12869 Điều 32): giá dự thầu sau sửa lỗi, hiệu chỉnh sai lệch, trừ giảm giá; xếp hạng nhà thầu đạt theo phương pháp đánh giá của HSMT.
     Giá đánh giá = giá sau hiệu chỉnh + chi phí quy đổi; kết hợp kỹ thuật và giá = tỷ trọng kỹ thuật × điểm kỹ thuật + tỷ trọng giá × 100 × giá thấp nhất / giá nhà thầu
     (cách quy điểm giá GIẢ LẬP — quy chế không ghi công thức); giá cố định chỉ xếp hạng nhà thầu không vượt giá gói. Thật: bộ xử lý hành động của bước đánh giá. */
  const PP_DG = ['Giá thấp nhất', 'Giá đánh giá', 'Dựa trên kỹ thuật', 'Kết hợp giữa kỹ thuật và giá', 'Giá cố định'];
  /* T80 L9: giá trị gợi ý của các trường HSMT khi người lập chưa nhập (GIẢ LẬP — mẫu HSMT khách chưa cung cấp): hiệu lực HSDT 120 ngày, HĐ tương tự 50% giá gói,
     doanh thu bình quân 150% giá gói trong 03 năm (theo số liệu gói mẫu của hệ thống cũ, HT-THAU-CONV). Hiệu lực bảo đảm dự thầu = hiệu lực HSDT + 30 ngày (Điều 27 khoản 4). */
  const lcHs = (g, u) => { u = u || {}; const r1 = (x) => Math.round(x * 100) / 100, hl = u.lcHieuLucHsdt != null ? Number(u.lcHieuLucHsdt) : 120, bd = u.lcBaoDam != null ? Number(u.lcBaoDam) : 1.5;
    return { hieuLuc: hl, hieuLucBd: hl + 30, baoDam: bd, baoDamTien: Math.round(g.price * bd * 10) / 1000, hdTuongTu: u.lcHdTuongTu != null ? Number(u.lcHdTuongTu) : r1(g.price * 0.5),
      soNamDt: u.lcSoNamDt != null ? Number(u.lcSoNamDt) : 3, dtBinhQuan: u.lcDtBinhQuan != null ? Number(u.lcDtBinhQuan) : r1(g.price * 1.5),
      tangKl: u.lcTangKl != null ? Number(u.lcTangKl) : 0, giamKl: u.lcGiamKl != null ? Number(u.lcGiamKl) : 0, tgSuDung: u.lcTgSuDung || '05 năm' }; };
  /* T80 L3 (phần thầu) — Thư chấp thuận HSDT và trao hợp đồng, Thông tin chuyển giao để ký hợp đồng (trường theo tab Trao HĐ, TT Ký HĐ của hệ thống cũ —
     HT-THAU-CONV; QC-12869 không có biểu mẫu → GIẢ LẬP, P-THAU-04). Giá trị đã nhập ở MS19 bước 22 hoặc gợi ý:
     thời hạn hoàn thiện hợp đồng 10 ngày (quốc tế 20 ngày — mốc mất bảo đảm dự thầu, Điều 27 khoản 8 điểm e), ký kết 05 ngày (GIẢ LẬP);
     bảo đảm thực hiện hợp đồng 3% giá hợp đồng (khoảng 2%–10% — Điều 44 khoản 3; gói tư vấn không yêu cầu — khoản 1);
     ngày hết hiệu lực HSDT = thời điểm đóng thầu + hiệu lực HSDT của nhà thầu trúng thầu (Điều 30 khoản 4); giá trúng thầu phân bổ theo nguồn của gói, tỷ lệ theo giá trị phân bổ. */
  const dAdd = (s, n) => { const [d, m, y] = String(s || '').split('/').map(Number); if (!y) return '';
    const x = new Date(y, m - 1, d + Number(n || 0)); return `${String(x.getDate()).padStart(2, '0')}/${String(x.getMonth() + 1).padStart(2, '0')}/${x.getFullYear()}`; };
  const dNum = (s) => { const [d, m, y] = String(s || '').split('/').map(Number); return y ? y * 10000 + m * 100 + d : 0; };
  const lcTrao = (g, u, today) => { u = u || {}; const nz = (x, d) => (x != null && x !== '' ? Number(x) : d), r3 = (x) => Math.round(x * 1000) / 1000;
    const dg = u.lcDanhGia || [], win = u.lcNhaThau || ((dg.filter((r) => r.xepHang).sort((a, b) => a.xepHang - b.xepHang)[0]) || {}).ma || (g.winner || '');
    const w = dg.find((r) => r.ma === win), hl = w && w.hieuLuc != null && w.hieuLuc !== '' ? Number(w.hieuLuc) : lcHs(g, u).hieuLuc;
    const gia = nz(u.lcGiaTT, g.price), ngayThu = u.lcNgayThu || today || '', hoanThien = nz(u.lcTgHoanThien, g.intl ? 20 : 10), kyKet = nz(u.lcTgKyKet, 5);
    const tv = g.type === 'TV', baoLanh = tv ? null : nz(u.lcBaoLanh, 3), k = khOf(g.kh) || {};
    const srcs = g.srcs || [[k.src ? k.src[0] : 'DXMS', k.src ? k.src[1] : '', g.price]], tot = srcs.reduce((a, s) => a + Number(s[2] || 0), 0) || 1;
    const hetHl = u.lcNgayDong ? dAdd(u.lcNgayDong, hl) : '', hanKy = dAdd(ngayThu, hoanThien + kyKet), mau = D.mauOf(u.lcMauHd || mauGoiY(g)) || {};
    const pn = (id) => (D.personas.find((p) => p.id === id) || {}).name || '';
    return { win, gia, hieuLuc: hl, ngayDong: u.lcNgayDong || '', hetHl, ngayThu, hoanThien, kyKet, hanKy, tv, baoLanh, baoLanhTien: baoLanh == null ? null : r3(gia * baoLanh / 100),
      quaHl: !!(hetHl && hanKy && dNum(hanKy) > dNum(hetHl)), ngayBanGiao: u.lcNgayBanGiao || ngayThu, tgGiaoHang: u.lcTgGiaoHang || u.lcTgThHd || g.execTime || '', dkTt: u.lcDkTt || mau.tt || '',
      phanBo: srcs.map((s) => ({ loai: SRC[s[0]] || s[0], ma: s[1], phanBo: Number(s[2] || 0), trung: r3(Number(s[2] || 0) * gia / tot) })),
      dauMoi: u.lcDauMoi || [['Đầu mối đơn vị sử dụng', pn('dvsd')], ['Đầu mối nhà thầu', u.lcDaiDienNt || ''], ['Trợ lý dự án', ''], ['Đầu mối đơn vị giám sát', pn('thau')]].map(([vaiTro, ten]) => ({ vaiTro, ten, lienHe: '' })) }; };
  /* Điều 32 khoản 7: HSĐX, HSCG chỉ đánh giá theo giá thấp nhất — phương pháp khác chỉ có ở HSMT (đấu thầu rộng rãi / hạn chế). */
  const lcPpOf = (g, u) => (['DTRR', 'DTHC'].includes((g || {}).form) && PP_DG.includes((u || {}).lcPpDanhGia) ? u.lcPpDanhGia : 'Giá thấp nhất');
  function lcXepHang(rows, pp, giaGoi, tKt) {
    const n = (x) => Number(x) || 0, r3 = (x) => Math.round(x * 1000) / 1000;
    const out = (rows || []).map((r) => { const giaSau = r3(n(r.giaSo) + n(r.suaLoi) + n(r.hieuChinh) - n(r.giamGia));
      return Object.assign({}, r, { giaSau, giaDg: pp === 'Giá đánh giá' ? r3(giaSau + n(r.quyDoi)) : null, diemTh: null, xepHang: null,
        dat: r.hopLe === 'Đạt' && (r.nangLuc || 'Đạt') === 'Đạt' && r.kyThuat === 'Đạt' }); });
    const ok = out.filter((r) => r.dat && (pp !== 'Giá cố định' || r.giaSau <= giaGoi)), minG = Math.min(...ok.map((r) => r.giaSau));
    if (pp === 'Kết hợp giữa kỹ thuật và giá') { const t = (Number(tKt) || 20) / 100; ok.forEach((r) => { r.diemTh = Math.round((t * n(r.diemKt) + (1 - t) * 100 * minG / r.giaSau) * 100) / 100; }); }
    const key = { 'Giá đánh giá': (r) => r.giaDg, 'Dựa trên kỹ thuật': (r) => -n(r.diemKt), 'Giá cố định': (r) => -n(r.diemKt), 'Kết hợp giữa kỹ thuật và giá': (r) => -r.diemTh }[pp] || ((r) => r.giaSau);
    /* T80 L2b (Điều 31 khoản 5 điểm b): đánh giá ngang nhau thì nhà thầu thuộc đối tượng ưu đãi xếp hạng cao hơn — không cộng / trừ giá. */
    ok.slice().sort((a, b) => key(a) - key(b) || (b.uuDai ? 1 : 0) - (a.uuDai ? 1 : 0)).forEach((r, i) => { r.xepHang = i + 1; });
    return out;
  }
  const PEOPLE = ['Nguyễn Hữu Nam', 'Trần Thị Ngọc', 'Lê Quang Vinh', 'Phạm Thu Hương', 'Đỗ Văn Khánh', 'Vũ Minh Châu', 'Hồ Thanh Tâm'];
  /* T80 L6: Tổ chuyên gia (vị trí, phân công theo màn TTr thành lập Tổ chuyên gia của hệ thống cũ — HT-THAU-CONV) và Tổ thẩm định của gói; chứng chỉ đào tạo về
     đấu thầu đọc D.lcCert (QC-12869 Điều 2 khoản 27: thành viên Tổ chuyên gia phải có, trừ chuyên gia chuyên ngành đánh giá kỹ thuật; khoản 28: Tổ thẩm định
     phải có). Thật: danh sách thành viên là dữ liệu Quyết định thành lập Tổ (P-THAU-03). */
  const EXPERT = ['Trương Minh Đức', 'Nghiêm Văn Hậu'];
  const TCG_VT = [['Tổ trưởng', 'Phụ trách chung'], ['Tổ phó phụ trách kỹ thuật', 'Phụ trách kỹ thuật, tổng hợp đánh giá kỹ thuật'],
    ['Thành viên – Phụ trách kỹ thuật', 'Đánh giá kỹ thuật, công nghệ của hàng hoá, dịch vụ', true], ['Thành viên – Phụ trách pháp lý', 'Đánh giá tính hợp lệ, năng lực kinh nghiệm, tài chính, thương mại']];
  const certOf = (ten, cn) => { const c = (D.lcCert || {})[ten]; return c ? { ok: true, so: c[0], ngay: c[1], loai: c[2] } : { ok: !!cn, mien: !!cn }; };
  const certTxt = (c) => (c.so ? `${c.so} (${c.ngay})` : c.mien ? 'Không yêu cầu — chuyên gia chuyên ngành' : 'Chưa có');
  function lcTeam(g) {
    const off = Number(g.code.slice(-2)), P = (i) => PEOPLE[(off + i) % PEOPLE.length];
    const tcg = TCG_VT.map(([viTri, phanCong, cn], i) => ({ ten: cn ? EXPERT[off % 2] : P(i), to: 'Tổ chuyên gia', viTri, phanCong, cn: !!cn }));
    const ttd = [[P(4), 'Tổ trưởng', 'Chủ trì thẩm định HSMT / HSYC, KQLCNT'], [P(5), 'Thành viên – Phụ trách pháp lý', 'Thẩm định sự phù hợp với Quy chế']]
      .map(([ten, viTri, phanCong]) => ({ ten, to: 'Tổ thẩm định', viTri, phanCong, cn: false }));
    return tcg.concat(ttd).map((r) => Object.assign(r, { cc: certOf(r.ten, r.cn), qd: `${(r.to === 'Tổ chuyên gia' ? 600 : 601) + off * 2}/QĐ-VHT` }));
  }
  function pkDetail(code) {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/profile-management/profile-detail/profile-detail.component.html + app-tabs
    const g0 = pkOf(code);
    if (!g0) return `<div class="pg">${head({ title: 'Xem chi tiết gói thầu', back: 'goi-thau', lg: true })}${emptyCard('Thông tin chung', 'Không tìm thấy gói thầu.')}</div>`;
    const g = pkRow(g0), k = khOf(g.kh) || {}, lv = LV[g.stx], s = totals(k).s || {};
    const steps = STEPS[g.form === 'DTRR' && g.method === '1GD2T' ? 'DTRR2' : g.form] || [];
    const docKind = DOCK[g.form];
    const hasBid = !!docKind && !['DAT_HANG', 'GIAO_NV', 'TU_TH'].includes(g.form);
    const info = {
      scr: 'SCR-82', name: 'Chi tiết gói thầu', uc: 'Backlog W1_T10 › Quản lý gói thầu, Lựa chọn nhà thầu, Hồ sơ LCNT, Tổ chức LCNT, Đánh giá & KQLCNT, Tình huống & Kiến nghị (dòng 336–402)',
      bpmn: 'MS18 bước 3–4 (thông tin gói); MS19 Tổ chức LCNT (BPMN-MS19, 24 bước) — hồ sơ xử lý HSLC-<mã gói>',
      notes: [
        'Màn tổng hợp xuyên suốt từ KHLCNT đến KQLCNT (Backlog dòng 336). Khuôn profile-detail + app-tabs; các tab chỉ xem.',
        '<b>T67 T5 — MS19 theo từng gói</b> (BPMN-MS19, D-118): KHLCNT Hoàn thành → nút <b>Khởi tạo tổ chức LCNT</b> (bước 1; thật: MS18 bước 23 khởi tạo một process instance cho mỗi gói, task 1 chờ người phụ trách). Bước 2 đọc hình thức / phương thức → cổng G1 chọn quy trình con: rộng rãi 1 túi 3.1–3.6, chỉ định thầu 7.1–7.4; hình thức khác một bước gộp (GIẢ LẬP P-235). Bước 24 ghi KQLCNT → gói Đang chuyển ký hợp đồng, nút Tạo hợp đồng. Gói mẫu GT-2026-0029 / GT-2026-0022: <b>Chạy luồng mẫu</b> tới bước của mẫu. Thẻ <b>Theo dõi lựa chọn nhà thầu</b> = trạng thái hai lớp (THAU-TT-1311 §1, §7); tab Hồ sơ mời thầu, Đánh giá & KQLCNT đọc eForm của hồ sơ, bước chưa tới thì ghi bước sẽ cập nhật.',
        '<b>T80 L1 (D-132)</b>: chỉ định thầu rút gọn và mua sắm trực tiếp không lập HSYC / HSĐX — gửi thư mời thương thảo kèm dự thảo hợp đồng rồi thương thảo (QC-12869 Điều 16 khoản 5, Điều 15 khoản 4). Mua sắm trực tiếp có <b>Gói thầu tham chiếu</b> (gói đã có KQLCNT trong ĐTMS hoặc gói chuyển đổi từ hệ thống cũ) và bước kiểm tra 4 điều kiện Điều 15 khoản 2 (bộ xử lý hành động chặn khi có điều kiện không đạt); thương thảo không thành thì mời nhà thầu xếp hạng tiếp theo của gói tham chiếu (khoản 3). BPMN-MS19 chưa có nhánh này — đề xuất DX-19, số bước GIẢ LẬP (P-235).',
        '<b>T67 H2</b>: Mẫu hợp đồng và Phương thức thanh toán là trường của HSMT / HSYC (QT-10.2.4 §5.2) — gói chạy MS19 lấy từ eForm 3.1 / 7.1; gói mẫu theo gợi ý Loại gói thầu (GIẢ LẬP P-236).',
        'Trường theo form Cập nhật gói thầu của hệ thống cũ (HT-THAU-IMG 7213–7221, T24): Số gói thầu, Tóm tắt công việc, Ký hợp đồng, Mật, Người phụ trách, Tiền tệ + tỷ giá, Phạm vi chia phần, Đơn vị sử dụng / giám sát, Sơ tuyển, qua mạng, Danh sách ngắn, Lĩnh vực, Thời gian thực hiện HĐ, Chủ đầu tư / Bên mời thầu / Người có thẩm quyền — trường eForm MS18.1. Trạng thái do quy trình cập nhật, không chọn tay như hệ thống cũ. <b>Nguồn gói thầu</b> n-n có Giá trị phân bổ; TTr kinh phí của hệ thống cũ tương ứng ĐXMS / KĐT.',
        '<b>Thông tin chung</b>: nội dung bắt buộc của KHLCNT (Điều 22 khoản 2) — loại gói (DMDC Loại gói thầu), nguồn 1..n ĐXMS / KĐT, phạm vi + chia phần, giá gói + cơ sở xác định giá + giá từng phần, dự toán được duyệt sau KHLCNT thay giá gói, nguồn vốn, tiến độ, loại hợp đồng.',
        '<b>Phương án LCNT</b>: hình thức (DMDC Hình thức LCNT, 11 dòng) là khoá chọn <b>quy trình Camunda</b> tổ chức LCNT — mỗi hình thức một trình tự (Điều 12–21); điều kiện áp dụng do service task MS18 bước 11 kiểm tra.',
        '<b>Thành phần tham gia</b>: Tổ chuyên gia, Tổ thẩm định và vai trò; kiểm tra xung đột vai trò (đề xuất – thẩm định – phê duyệt độc lập) = validate khi lưu thành phần; danh sách ngắn ≥ 03 nhà thầu với đấu thầu hạn chế.',
        '<b>Hồ sơ mời</b>: loại hồ sơ theo hình thức (HSMT / HSYC / HSMCG); bảo đảm dự thầu ≤ 3% giá gói (Điều 27) = validate; phiên bản khi sửa đổi sau phát hành. <b>Đánh giá & KQLCNT</b>: kết quả theo nhà thầu là bảng lặp eForm của Tổ chuyên gia; cảnh báo giá thấp bất thường theo ngưỡng cấu hình (P-79). <b>T80 L2</b> (QC-12869 Điều 32, 33): bảng đánh giá thêm năng lực kinh nghiệm, điểm kỹ thuật (phương pháp có điểm), sửa lỗi, hiệu chỉnh sai lệch, giảm giá, chi phí quy đổi (giá đánh giá), hiệu lực HSDT; giá sau hiệu chỉnh tính lại trên form; xếp hạng do bộ xử lý hành động tính theo phương pháp của HSMT (HSYC / HSMCG chỉ giá thấp nhất — khoản 7); nhà thầu không đạt bắt buộc lý do; HSMT kết hợp kỹ thuật và giá kiểm tỷ trọng điểm kỹ thuật (khoản 4 điểm b). Cách quy điểm giá của phương pháp kết hợp GIẢ LẬP. <b>T80 L4</b>: tab Thông tin chung thêm thẻ <b>Mốc văn bản</b> (khung Checklist của hệ thống cũ, chỉ mốc quy trình TO-BE có) — chỉ xem, đọc lại số / ngày từ KHLCNT, biến hồ sơ MS19, tin công khai SCR-94, KQLCNT, huỷ thầu; mã gói thầu trên SAP GIẢ LẬP đồng bộ (P-THAU-02). <b>T80 L5</b>: bước 3.4 chỉ 01 HSDT → gia hạn đóng thầu ≥ 03 ngày làm việc / mở thầu ngay (Điều 36 khoản 5), cổng sau 3.4 GIẢ LẬP (P-THAU-01, DX-20).',
        '<b>Tình huống & kiến nghị</b>: huỷ thầu (Điều 34), tình huống (Điều 36), kiến nghị (Điều 37–38), tạm dừng ký hợp đồng. KQLCNT chuyển sang Quản lý hợp đồng bằng nút Tạo hợp đồng (phân hệ dựng ở B3).',
      ],
      q: ['P-77', 'P-235', 'P-236', 'P-78', 'P-79', 'P-114', 'P-THAU-01', 'P-THAU-02', 'P-THAU-04'], src: 'profile-management/profile-detail · /khcn-profile-management/:id/view',
    };
    /* KQLCNT → Quản lý hợp đồng (T16 B3): gói đã có hợp đồng thì mở hợp đồng; tạm dừng ký thì không tạo. */
    const hd = window.HopDong && window.HopDong.byPkg(g.code);
    /* T67 T5: KHLCNT Hoàn thành → Khởi tạo tổ chức LCNT (MS19 bước 1); gói mẫu đang tổ chức → Chạy luồng mẫu tới bước của mẫu; đã có hồ sơ → Xem hồ sơ xử lý. */
    const C = lcCaseOf(g.code), live = !!C, cu = (C && C.ui) || {};
    const lcBtn = C ? `<button type="button" class="vbtn secondary" data-go="ho-so-hd/${esc(C.code)}">Xem hồ sơ xử lý</button>`
      : g.stx === 'KH' && k.st === 'OK' ? `<button type="button" class="vbtn primary" data-lc-start="${esc(g.code)}">Khởi tạo tổ chức LCNT</button>`
      : PK_SAMPLE[g.code] && g.stx !== 'KQ' ? `<button type="button" class="vbtn primary" data-lc-sample="${esc(g.code)}">Chạy luồng mẫu</button>` : '';
    const doneAt = (n) => !!C && C.history.some((h) => String(h.task) === String(n) && h.who);
    const T19 = (window.BPMN_FLOWS.MS19 || { tasks: {} }).tasks;
    const waitCard = (title, ns) => emptyCard(title, `Chưa có dữ liệu — được cập nhật ở bước ${ns.map((n) => `${n}. ${(T19[n] || {}).name || ''}`).join(' / ')}.`);
    /* T80 L1: chỉ định thầu rút gọn / mua sắm trực tiếp (rg) không có HSYC, HSĐX — hồ sơ mời = thư mời thương thảo 7.5, kết quả = thương thảo 7.4. */
    const route = C ? C.vars.route : D.lcRoute(g.form, g.method), rg = route === '7' && D.lcFirst7(g.form) !== '7.1';
    const hsStep = route === '7' ? (rg ? '7.5' : '7.1') : '3.1', dgStep = route === '7' ? (rg ? '7.4' : '7.3') : route === '3' ? '3.5' : route;
    const ref = g.form === 'MSTT' ? lcRefOf(cu.lcGoiTc || g.ref) : null;
    const mau = D.mauOf(cu.lcMauHd || g.mau || mauGoiY(g));
    const progCard = () => { const p = g.prog; return card('Theo dõi lựa chọn nhà thầu', `<div class="ginfo c3">${kv('Trạng thái', stBadge(LC, g.lc))}${kv('Giai đoạn', esc(p.gd))}${kv('Bước hiện tại', esc(p.step || '-'))}
      ${kv('Đơn vị / người xử lý', esc(p.who || '-'))}${kv('Hạn xử lý', p.due ? `<span class="${p.late ? 'due-over' : ''}">${esc(p.due)}</span>` : '-')}${kv('Vướng mắc', esc(p.issue || '-'))}</div>`); };
    const right0 = hd ? `<button type="button" class="vbtn secondary" data-go="hop-dong/${encodeURIComponent(hd.code)}">Xem hợp đồng</button>`
      : g.stx === 'KQ' && hasBid && !(g.events || []).some((e) => /Tạm dừng/.test(e[0]) && /hiệu lực/.test(e[3])) ? `<button type="button" class="vbtn primary" data-go="hop-dong/create/${encodeURIComponent(g.code)}">Tạo hợp đồng</button>` : '';
    const right = lcBtn + right0;
    const srcs = (g0.srcs || [[k.src ? k.src[0] : 'DXMS', k.src ? k.src[1] : '', g.price]]);
    const x = pkExtra(g0, k);
    const tInfo = () => progCard() + card('Thông tin chung gói thầu', `<div class="ginfo c3">
        ${kv('Mã gói thầu', esc(g.code))}${kv('Tên gói thầu', esc(g.name), 'span2')}
        ${kv('Số gói thầu', esc(x.no))}${kv('Ký hợp đồng', x.sign ? 'Có' : 'Không')}${kv('Mật', g.secret ? 'Mật' : 'Không mật')}
        ${kv('Lĩnh vực', esc(x.field))}${kv('Người phụ trách', esc(ownerOf(k)))}${kv('Đơn vị sử dụng', esc(s.unit))}
        ${kv('Đơn vị giám sát', 'Trung tâm Mua sắm')}${kv('Chủ đầu tư', OWNER_ORG)}${kv('Bên mời thầu', OWNER_ORG)}
        ${kv('Người có thẩm quyền', esc(x.authority))}${kv('Tóm tắt công việc chính', esc(x.summary), 'span2')}
        ${kv('Loại gói thầu', esc(cat('loai-goi-thau', g.type)))}${kv('KHLCNT', `<a class="link-red" href="#/khlcnt/${encodeURIComponent(g.kh)}">${esc(g.kh)}</a>`)}${kv('Trạng thái', stBadge(LC, g.lc))}
        ${kv('Loại hợp đồng dự kiến', esc(cat('loai-hop-dong', g.contract)))}${kv('Nguồn vốn', esc(cat('nguon-von', s.fund)))}${kv('Đơn vị', esc(s.unit))}</div>`)
      + card('Nguồn gói thầu', table([['Loại đối tượng', 170], ['Mã', 160], ['Tên', 340], ['Nhiệm vụ / Đề tài, dự án', 280], ['Nguồn vốn', 200], ['Khoản mục chi phí', 200], ['Giá trị phân bổ (tỷ đồng)', 180, 'r']], srcs,
        (r) => { const o = srcInfo(r[0], r[1]) || {}; return `<td>${esc(SRC[r[0]])}</td><td><a class="link" data-go="${srcHref(r[0], r[1])}">${esc(r[1])}</a></td><td>${clamp(o.title)}</td><td>${clamp(o.nvText)}</td><td>${clamp(cat('nguon-von', o.fund))}</td><td>${esc(x.cost)}</td><td class="r num">${money(r[2])}</td>`; },
        `<tfoot><tr><td></td><td colspan="6"><b>Tổng</b></td><td class="r num"><b>${ty(sum(srcs.map((r) => r[2])), 2)}</b></td></tr></tfoot>`))
      + card('Phạm vi gói thầu', table([['Hàng hoá / dịch vụ / công việc', 460], ['Đơn vị tính', 140], ['Khối lượng', 120, 'r']], g.items || [],
        (r) => `<td>${clamp(r[0])}</td><td>${esc(r[1])}</td><td class="r num">${ty(r[2], 0)}</td>`), g.lots ? `Có chia phần · ${g.lots.length} phần` : 'Không chia phần')
      + card('Giá gói thầu', `<div class="ginfo c3">${kv('Giá gói thầu', ty(g.price, 2) + ' tỷ đồng')}${kv('Đơn vị tiền tệ', esc(x.cur))}${kv('Tỷ giá', x.cur === 'VND' ? '1' : Number(x.rate).toLocaleString('vi-VN'))}
        ${kv('Cơ sở xác định giá', esc(g.priceBasis), 'span3')}
        ${kv('Dự toán được duyệt sau KHLCNT', g.est ? `${esc(g.est[0])} ngày ${esc(g.est[1])} · ${ty(g.est[2], 2)} tỷ đồng (thay giá gói thầu)` : null, 'span3')}</div>`
        + (g.lots ? table([['Phần', 460], ['Giá từng phần (tỷ đồng)', 200, 'r']], g.lots, (r) => `<td>${esc(r[0])}</td><td class="r num">${money(r[1])}</td>`) : ''))
      + card('Tiến độ', `<div class="ginfo c3">${kv('Thời gian bắt đầu tổ chức LCNT', esc(g.start))}${kv('Thời gian lựa chọn nhà thầu', esc(g.selTime))}${kv('Thời gian thực hiện gói thầu', esc(g.execTime))}
        ${kv('Thời gian thực hiện hợp đồng theo KHLCNT', esc(x.hdTime))}</div>`)
      + mocCard();
    /* T80 L4 (HT-THAU-VID §3.2 Checklist 25 mốc — chỉ mốc quy trình TO-BE có): bảng chỉ xem, số / ngày văn bản đọc lại dữ liệu đã có — KHLCNT (MS18), biến hồ sơ
       MS19 (gói đang chạy), tin công khai (SCR-94), KQLCNT, huỷ thầu. Mốc chưa tới để trống. Mã gói thầu trên SAP: đồng bộ SAP (GIẢ LẬP như mã KHLCNT, P-THAU-02). */
    const mocCard = () => {
      const T18 = (window.BPMN_FLOWS.MS18 || { tasks: {} }).tasks, s18 = (n) => `MS18 — ${n}. ${(T18[n] || {}).name || ''}`, s19 = (n) => `MS19 — ${n}. ${(T19[n] || {}).name || ''}`;
      const atD = (n) => { const h = C && C.history.filter((y) => String(y.task) === String(n) && y.who).pop(); return h ? Flow.dateOf(h.t) : null; };
      const ck = window.CongKhai ? window.CongKhai.items().filter((i) => i.code === g.code || i.id === `KHLCNT:${k.code}:v1`) : [], pub = (ty) => ck.find((i) => i.ty === ty) || null;
      const dk = k.docs || {}, kp = pub('KHLCNT'), td = levelOf(k) === 'TD';
      const huy = (g.events || []).find((e) => e[0] === 'Huỷ thầu');
      /* T80 L4b: gói Mật — không đăng tải (QC-12869 Điều 7 khoản 1); không tạo mã trên SAP theo cách làm của hệ thống cũ (HT-THAU-CONV, GIẢ LẬP — Q-THAU-02). */
      const mat = !!g.secret, NA_DT = 'Không đăng tải — gói mật', NA_SAP = 'Không tạo — gói mật';
      const rows = [['QĐ phê duyệt KHLCNT', dk.bm03 ? dk.bm03[0] : null, dk.bm03 ? dk.bm03[1] : null, s18(td ? 15 : 11)],
        ['Đăng tải KHLCNT', k.post ? k.post[0] : kp && kp.ref, k.post ? k.post[1] : kp && kp.pubAt, s18(22), mat && NA_DT],
        ['Mã KHLCNT trên SAP', k.sap || null, null, 'Đồng bộ SAP', mat && NA_SAP],
        ['Mã gói thầu trên SAP', g.sap || null, null, 'Đồng bộ SAP', mat && NA_SAP]];
      /* Nguồn theo quy trình con của hình thức: rộng rãi 1 túi 3.x, chỉ định thầu 7.x; hình thức khác một bước gộp (P-235) — mốc con chỉ có từ tin công khai. */
      const sub = route === '3' || route === '7', st = (a, b) => (route === '3' ? a : route === '7' ? b : String(route)), dOf = (n, v) => (live && sub && atD(n) ? v || atD(n) : null);
      if (hasBid && rg) {
        rows.push(['Thư mời thương thảo kèm dự thảo hợp đồng', null, dOf('7.5', cu.lcNgayGuiTm), s19('7.5')]);
      } else if (hasBid) {
        const t = pub('TBMT'), b = pub('BBMT'), r7 = route === '7';
        rows.push([`Phê duyệt ${docKind}`, null, dOf(st('3.2', '7.1')), s19(st('3.2', '7.1'))],
          [r7 ? 'Gửi HSYC cho nhà thầu' : 'Đăng tải TBMT kèm ' + docKind, live ? (dOf('3.3') ? cu.lcTbmt || `IB26${g.code.slice(-4)}-00` : null) : t && t.ref,
            live ? dOf(st('3.3', '7.2'), r7 ? cu.lcNgayGui : cu.lcNgayPh) : t && t.at, s19(st('3.3', '7.2')), !r7 && mat && NA_DT]);
        if (!r7) {
          const gh = (cu.lcGiaHan || []).length;
          rows.push(['Thời điểm đóng thầu' + (gh ? ` (gia hạn lần ${gh})` : ''), gh ? cu.lcGiaHan[gh - 1].soVb : null, live && sub ? cu.lcNgayDong || null : null, s19(st('3.1', '7.1'))],
            ['Biên bản mở thầu', null, live ? dOf('3.4', cu.lcNgayMo) : b && b.at, s19(st('3.4', '7.3'))]);
          /* T80 L5b: xử lý tình huống 01 HSDT (Điều 36 khoản 5) — tờ trình và công văn gia hạn. */
          const xl = cu.lcGiaHan && cu.lcGiaHan.length ? cu.lcGiaHan[cu.lcGiaHan.length - 1] : null;
          if (xl || cu.lcMoNgay && cu.lcSoTtrXlth) rows.push(['Tờ trình xử lý tình huống', xl ? xl.soTtr : cu.lcSoTtrXlth, xl ? xl.ngay : cu.lcMoNgay, s19('3.4')]);
          if (xl) rows.push(['Công văn gia hạn đóng thầu', xl.soCv, xl.ngay, s19('3.4')]);
        }
        rows.push([`Báo cáo đánh giá ${r7 ? 'HSĐX' : 'HSDT'}`, null, dOf(dgStep), s19(dgStep)]);
      }
      const tt = rg ? '7.4' : st('3.6', '7.4');
      if (hasBid) rows.push(['Biên bản thương thảo hợp đồng', null, dOf(tt, cu.lcNgayTT), s19(tt)]);
      const kq = pub('KQ');
      rows.push(['QĐ phê duyệt KQLCNT', g.kq ? g.kq[0] : null, g.kq ? g.kq[1] : null, s19(17)], ['Đăng tải KQLCNT', kq && kq.ref, kq && kq.pubAt, s19(22), mat && NA_DT]);
      /* T80 L3: thư chấp thuận HSDT và trao hợp đồng, bàn giao thông tin để ký hợp đồng (MS19 bước 22). */
      if (live) rows.push(['Thư chấp thuận HSDT và trao hợp đồng', null, doneAt(22) ? cu.lcNgayThu || atD(22) : null, s19(22)],
        ['Bàn giao thông tin để ký hợp đồng', null, doneAt(22) ? cu.lcNgayBanGiao || atD(22) : null, s19(22)]);
      if (huy) rows.push(['Quyết định huỷ thầu', (huy[2].match(/\d+\/QĐ-[A-Z]+/) || [null])[0], huy[1], 'Tình huống & kiến nghị']);
      return card('Mốc văn bản', table([['Mốc', 300], ['Số văn bản / mã', 220], ['Ngày', 150], ['Nguồn', 380]], rows,
        (r) => (r[4] ? `<td>${esc(r[0])}</td><td colspan="2"><span class="faint">${esc(r[4])}</span></td><td>${esc(r[3])}</td>`
          : `<td>${esc(r[0])}</td><td>${r[1] ? esc(r[1]) : r[2] ? '<span class="faint">Không đánh số</span>' : dash}</td><td class="num">${r[2] ? esc(r[2]) : dash}</td><td>${esc(r[3])}</td>`)),
        'Đọc từ các bước đã thực hiện; mốc chưa tới để trống');
    };
    const tPa = () => card('Phương án lựa chọn nhà thầu', `<div class="ginfo c3">
        ${kv('Hình thức lựa chọn nhà thầu', esc(cat('hinh-thuc-lcnt', g.form)))}${kv('Phương thức lựa chọn nhà thầu', esc(cat('phuong-thuc-lcnt', g.method)))}${kv('Phạm vi', g.intl ? 'Quốc tế' : 'Trong nước')}
        ${kv('Sơ tuyển', 'Không sơ tuyển')}${kv('Lựa chọn nhà thầu qua mạng', esc(x.net))}${kv('Áp dụng danh sách ngắn', g.short ? 'Có' : 'Không')}
        ${kv('Mua sắm tập trung', g.central ? esc(g.central) : 'Không')}${kv('Đơn vị thực hiện', g.assignee ? esc(g.assignee) : null)}
        ${kv('Điều kiện áp dụng', esc(COND[g.form]), 'span2')}${kv('Kết quả kiểm tra theo Quy chế', lv > 0 || k.st === 'OK' ? badge('Phù hợp', 'success') : g.form === 'DAC_BIET' ? badge('Chờ chấp thuận chủ trương', 'warning') : badge('Phù hợp', 'success'))}</div>`)
      + card('Trình tự thực hiện', table([['Bước', 520], ['Trạng thái', 170, 'c']], steps,
        (r, i) => { const done = g.stx === 'KQ' || lv > r[1];
          const cur = !done && !['KH', 'HUY'].includes(g.stx) && steps.slice(0, i).every((p) => lv > p[1]);
          return `<td>${esc(r[0])}</td><td class="c">${done ? badge('Hoàn thành', 'success') : cur ? badge('Đang thực hiện', 'info') : g.stx === 'HUY' ? badge('Đã huỷ', 'default') : badge('Chưa thực hiện', 'default')}</td>`; }), 'Theo hình thức LCNT')
      + (ref ? refCard() : '');
    /* T80 L1: gói tham chiếu của mua sắm trực tiếp (Điều 15) — kết quả kiểm tra đọc biến bước 7.6 khi gói chạy MS19. */
    const refCard = () => {
      const rows = live && doneAt('7.6') ? (cu.lcDieuKien || []) : [];
      return card('Gói thầu tham chiếu (mua sắm trực tiếp)', `<div class="ginfo c3">${kv('Mã gói thầu', esc(ref.code))}${kv('Tên gói thầu', esc(ref.name), 'span2')}
          ${kv('Hình thức lựa chọn nhà thầu', esc(cat('hinh-thuc-lcnt', ref.form)))}${kv('Quyết định phê duyệt KQLCNT', `${esc(ref.kq[0])} ngày ${esc(ref.kq[1])}`)}${kv('Nhà thầu trúng thầu', esc(nccName(ref.rank[0][0])))}</div>`
        + (rows.length ? table([['Điều kiện (Điều 15 khoản 2)', 300], ['Yêu cầu', 240], ['Thực tế', 360], ['Kết quả', 120, 'c']], rows,
          (r) => `<td>${esc(r.dk)}</td><td>${esc(r.yeuCau)}</td><td>${clamp(r.thucTe)}</td><td class="c">${badge(r.kq, r.kq === 'Đạt' ? 'success' : 'error')}</td>`) : ''),
        live && !doneAt('7.6') ? 'Chờ bước Kiểm tra điều kiện mua sắm trực tiếp' : '');
    };
    const tTp = () => {
      if (lv < 1) return emptyCard('Thành phần tham gia', 'Thành phần tham gia được thành lập sau khi KHLCNT được phê duyệt.');
      const off = Number(g.code.slice(-2));
      const team = lcTeam(g), thieu = team.filter((r) => !r.cc.ok), tdNames = team.filter((r) => r.to === 'Tổ thẩm định').map((r) => r.ten);
      const trung = team.filter((r) => r.to === 'Tổ chuyên gia' && tdNames.includes(r.ten)).map((r) => r.ten);
      const shortL = g.short ? card('Danh sách ngắn', table([['Mã nhà thầu', 140], ['Tên nhà thầu', 340], ['Nguồn', 220], ['Tình trạng', 180, 'c']], g.short,
        (c) => `<td>${esc(c)}</td><td>${clamp(nccName(c))}</td><td>${STRAT.some((x) => x[0] === c) ? 'Nhà thầu chiến lược Tập đoàn' : 'Đề xuất của Tổ chuyên gia'}</td><td class="c">${D.nccOf(c).ban ? badge('Bị cấm', 'error') : badge('Hợp lệ', 'success')}</td>`),
        g.short.length >= 3 ? `${g.short.length} nhà thầu · đạt tối thiểu 03` : `${g.short.length} nhà thầu · ít hơn 03 — xử lý tình huống (Điều 36 khoản 3)`) : '';
      return card('Tổ chuyên gia và Tổ thẩm định', table([['Họ và tên', 170], ['Tổ', 120], ['Vị trí trong Tổ', 200], ['Phân công công việc', 250], ['Chứng chỉ đào tạo về đấu thầu', 210], ['Quyết định thành lập', 120]], team,
        (r) => `<td>${esc(r.ten)}</td><td>${esc(r.to)}</td><td>${esc(r.viTri)}</td><td>${clamp(r.phanCong)}</td>
          <td>${r.cc.so ? `${esc(r.cc.so)} <span class="faint">· ${esc(r.cc.ngay)}</span>` : r.cc.mien ? '<span class="faint">Không yêu cầu — chuyên gia chuyên ngành</span>' : badge('Chưa có', 'error')}</td><td>${esc(r.qd)}</td>`))
        + card('Kiểm tra thành phần', `<div class="ginfo c3">${kv('Xung đột vai trò', trung.length ? badge('Trùng: ' + trung.join(', '), 'error') : badge('Không có xung đột', 'success'))}${kv('Nội dung kiểm tra', 'Thành viên Tổ chuyên gia không đồng thời thuộc Tổ thẩm định, không là người phê duyệt KQLCNT', 'span2')}
          ${kv('Chứng chỉ đào tạo về đấu thầu', thieu.length ? badge(`Thiếu ${thieu.length} thành viên`, 'error') : badge('Đủ', 'success'))}${kv('Căn cứ', 'Tổ chuyên gia phải có chứng chỉ, trừ chuyên gia chuyên ngành đánh giá kỹ thuật, công nghệ; Tổ thẩm định phải có (QC-12869 Điều 2 khoản 27, 28)', 'span2')}</div>`)
        + shortL;
    };
    /* T80 L2: phần tử 7 của dòng nhà thầu = [sửa lỗi, hiệu chỉnh sai lệch, giảm giá] (tỷ đồng); xếp hạng và cảnh báo theo giá sau hiệu chỉnh (Điều 32 khoản 1 điểm b). */
    const bidders = (g.bidders || []).map((b, i) => { const a = b[6] || [0, 0, 0];
      return { ncc: b[0], price: b[1], valid: b[2], cap: b[3], tech: b[4], note: b[5], adj: b[6], i, adjP: Math.round((b[1] + a[0] + a[1] - a[2]) * 1000) / 1000 }; });
    const ranked = bidders.filter((b) => b.valid === 'Đạt' && b.cap === 'Đạt' && (b.tech == null || b.tech >= 70)).sort((a, b) => a.adjP - b.adjP);
    const low = (b) => b.adjP < g.price * 0.8;
    /* Gói chạy MS19: Hồ sơ mời đọc eForm bước lập HSMT / HSYC (3.1 / 7.1) và phát hành (3.3 / 7.2); chưa tới bước thì chờ. */
    /* T80 L1: chỉ định thầu rút gọn / mua sắm trực tiếp — thư mời thương thảo kèm dự thảo hợp đồng (Điều 15 khoản 4 điểm a, Điều 16 khoản 5 điểm a). */
    const moiNt = () => (ref ? ref.rank[Math.min(Number(cu.lcMoiTiep || 0), ref.rank.length - 1)][0] : g.bidders && g.bidders[0] ? g.bidders[0][0] : '');
    const tThuMoi = (sent) => card('Thư mời thương thảo và dự thảo hợp đồng', `<div class="ginfo c3">${kv('Loại hồ sơ', 'Thư mời thương thảo kèm dự thảo hợp đồng')}
        ${kv('Trạng thái', sent ? badge('Đã gửi', 'success') : badge('Đang chuẩn bị', 'info'))}${kv('Ngày gửi', esc(cu.lcNgayGuiTm || '-'))}
        ${kv('Nhà thầu được mời', esc(nccName(cu.lcNhaThauMoi || moiNt())))}${kv(g.form === 'MSTT' ? 'Lượt mời' : 'Tỷ lệ giảm giá yêu cầu', g.form === 'MSTT' ? (Number(cu.lcMoiTiep || 0) ? `Lần ${Number(cu.lcMoiTiep) + 1} — nhà thầu xếp hạng tiếp theo của gói tham chiếu` : 'Lần 1 — nhà thầu trúng gói tham chiếu') : cu.lcGiamGia != null ? `${ty(Number(cu.lcGiamGia), 1)}% giá gói thầu` : '-')}
        ${kv('Mẫu hợp đồng', mau ? `${esc(mau.code)} — ${esc(mau.name)}` : '-', 'span2')}${kv('Phương thức thanh toán', mau ? esc(mau.tt) : '-')}</div>`);
    const tHsLive = () => {
      if (!doneAt(hsStep)) return waitCard('Hồ sơ mời', [hsStep]);
      if (rg) return tThuMoi(true);
      const pub = route === '7' ? '7.2' : '3.3', bd = cu.lcBaoDam != null ? Number(cu.lcBaoDam) : 1.5, h = lcHs(g, cu);
      return card('Thông tin ' + (docKind || 'hồ sơ mời'), `<div class="ginfo c3">${kv('Loại hồ sơ', esc(docKind || 'HSYC'))}${kv('Trạng thái phát hành', doneAt(pub) ? badge('Đã phát hành', 'success') : badge('Đang lập', 'info'))}
          ${kv('Phương pháp đánh giá', esc(cu.lcPpDanhGia || 'Giá thấp nhất'))}${kv('Bảo đảm dự thầu', `${ty(bd, 1)}% giá gói · ${ty(Math.round(g.price * bd * 10) / 1000, 3)} tỷ đồng`)}
          ${kv(route === '7' ? 'Hạn nộp HSĐX' : 'Thời điểm đóng thầu', esc(cu.lcNgayDong || '-'))}${kv(route === '7' ? 'Nhà thầu dự kiến' : 'Số thông báo mời thầu', esc(route === '7' ? nccName(cu.lcNhaThauDk || (g.bidders && g.bidders[0] ? g.bidders[0][0] : '')) : cu.lcTbmt || (doneAt(pub) ? `IB26${g.code.slice(-4)}-00` : '-')))}
          ${kv('Mẫu hợp đồng', mau ? `${esc(mau.code)} — ${esc(mau.name)}` : '-', 'span2')}${kv('Phương thức thanh toán', mau ? esc(mau.tt) : '-')}
          ${kv('Thời gian có hiệu lực của HSDT', `${h.hieuLuc} ngày`)}${kv('Hiệu lực bảo đảm dự thầu', `${h.hieuLucBd} ngày`)}${kv('Thời gian sử dụng dự kiến của hàng hoá', esc(h.tgSuDung))}</div>`)
        + card('Yêu cầu năng lực, kinh nghiệm và khối lượng', `<div class="ginfo c3">${kv('Giá trị hợp đồng tương tự tối thiểu', ty(h.hdTuongTu, 2) + ' tỷ đồng')}
          ${kv('Doanh thu bình quân tối thiểu', `${ty(h.dtBinhQuan, 2)} tỷ đồng · ${h.soNamDt} năm gần nhất`)}${kv('Tỷ lệ tăng / giảm khối lượng tối đa', `Tăng ${h.tangKl}% · giảm ${h.giamKl}%`)}</div>`);
    };
    const tHs = () => {
      if (live && hasBid) return tHsLive();
      if (!hasBid) return emptyCard('Hồ sơ mời', `Hình thức ${esc(cat('hinh-thuc-lcnt', g.form))} không phát hành hồ sơ mời thầu.`);
      if (lv < 1) return emptyCard('Hồ sơ mời', 'Hồ sơ mời được lập sau khi KHLCNT được phê duyệt.');
      if (rg) return tThuMoi(lv >= 2);
      const pp = g.form === 'CGTT' || ['MSTT', 'CDT_TT', 'CDT_RG'].includes(g.form) ? 'GIA_THAP_NHAT' : g.method === '1GD2T' ? 'GIA_DANH_GIA' : 'GIA_THAP_NHAT';
      const guar = ['DTRR', 'DTHC'].includes(g.form);
      const issued = lv >= 2;
      const vs = [['v1', issued ? 'Phát hành' : 'Đang lập', issued ? '15/09/2026' : '-']].concat(g.code === 'GT-2026-0024' ? [['v2', 'Sửa đổi sau phát hành (làm rõ yêu cầu kỹ thuật bộ điều khiển chùm tia)', '24/09/2026']] : []);
      const clar = g.code === 'GT-2026-0024' ? [['Iota Electronics Co., Ltd.', '20/09/2026', 'Làm rõ dải quét chùm tia yêu cầu', 'Đã trả lời — sửa đổi HSMT v2']] : lv >= 2 && guar ? [[nccName((bidders[0] || {}).ncc || 'NCC-000001'), '18/09/2026', 'Làm rõ điều kiện bảo hành', 'Đã trả lời']] : [];
      return card('Thông tin ' + docKind, `<div class="ginfo c3">${kv('Loại hồ sơ', esc(docKind))}${kv('Phiên bản hiện hành', esc(vs[vs.length - 1][0]))}${kv('Trạng thái phát hành', issued ? badge('Đã phát hành', 'success') : badge('Đang lập', 'info'))}
          ${kv('Phương pháp đánh giá', esc(cat('phuong-phap-danh-gia', pp)))}${kv('Bảo đảm dự thầu', guar ? `${esc(cat('hinh-thuc-bao-dam', 'BL_NH'))} · ${ty(Math.round(g.price * 0.015 * 1000) / 1000, 3)} tỷ đồng (1,5% giá gói)` : 'Không yêu cầu')}
          ${kv('Thời điểm đóng thầu', issued ? '30/09/2026 09:00' : null)}${kv('Mẫu hợp đồng', mau ? `${esc(mau.code)} — ${esc(mau.name)}` : '-', 'span2')}${kv('Phương thức thanh toán', mau ? esc(mau.tt) : '-')}</div>`)
        + card('Tiêu chuẩn đánh giá', table([['Nội dung', 260], ['Phương pháp', 260], ['Yêu cầu', 420]],
          [['Tính hợp lệ', 'Đạt / Không đạt', 'Tư cách hợp lệ (Điều 24), không thuộc danh sách cấm, bảo đảm dự thầu hợp lệ'], ['Năng lực, kinh nghiệm', cat('phuong-phap-danh-gia', 'DAT_KHONG_DAT'), 'Tối thiểu 02 hợp đồng tương tự trong 03 năm'],
            ['Kỹ thuật', g.method === '1GD2T' ? cat('phuong-phap-danh-gia', 'CHAM_DIEM') + ' (tối thiểu 70/100)' : cat('phuong-phap-danh-gia', 'DAT_KHONG_DAT'), 'Đáp ứng thông số kỹ thuật, tiến độ, bảo hành'], ['Tài chính', cat('phuong-phap-danh-gia', pp), 'Xếp hạng theo ' + cat('phuong-phap-danh-gia', pp).toLowerCase()]],
          (r) => `<td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${clamp(r[2])}</td>`))
        + card('Phiên bản hồ sơ', table([['Phiên bản', 110], ['Nội dung', 520], ['Ngày', 140]], vs, (r) => `<td>${esc(r[0])}</td><td>${clamp(r[1])}</td><td class="num">${esc(r[2])}</td>`))
        + card('Làm rõ / sửa đổi hồ sơ mời', table([['Nhà thầu đề nghị', 300], ['Ngày', 120], ['Nội dung', 360], ['Kết quả', 260]], clar, (r) => `<td>${clamp(r[0])}</td><td class="num">${esc(r[1])}</td><td>${clamp(r[2])}</td><td>${clamp(r[3])}</td>`))
        + card('Hồ sơ dự thầu đã nộp', table([['Nhà thầu', 340], ['Thời điểm nộp', 160], ['Giá dự thầu (tỷ đồng)', 170, 'r'], ['Bảo đảm dự thầu', 180, 'c']], lv >= 3 ? bidders : [],
          (b) => `<td>${clamp(nccName(b.ncc))}</td><td class="num">29/09/2026 ${String(10 + b.i).padStart(2, '0')}:15</td><td class="r num">${money(b.price)}</td><td class="c">${guar ? badge('Hợp lệ', 'success') : dash}</td>`), lv >= 3 ? `${bidders.length} hồ sơ` : 'Chưa đến thời điểm đóng thầu')
        + card('Biên bản mở thầu', lv >= 3 && bidders.length ? `<div class="ginfo c3">${kv('Thời điểm mở thầu', '30/09/2026 09:30')}${kv('Số hồ sơ', String(bidders.length))}${kv('Tệp', `<a class="link-red" href="#" data-dl="Bien-ban-mo-thau-${esc(g.code)}.pdf">Bien-ban-mo-thau-${esc(g.code)}.pdf</a>`)}</div>` : '<div class="empty-t">Chưa mở thầu.</div>');
    };
    /* Gói chạy MS19: kết quả đánh giá đọc bảng lặp eForm bước đánh giá; KQLCNT sau bước 13. */
    const tDgLive = () => {
      if (!doneAt(dgStep)) return waitCard('Đánh giá hồ sơ', [dgStep]);
      /* T80 L2: bảng lặp eForm bước đánh giá — giá sau sửa lỗi, hiệu chỉnh sai lệch, trừ giảm giá và xếp hạng theo phương pháp của HSMT (Điều 32). */
      const pp = lcPpOf(g, cu), rows = lcXepHang(cu.lcDanhGia || [], pp, g.price, cu.lcTyTrongKt);
      const res = (v) => (v === 'Đạt' ? badge('Đạt', 'success') : v ? badge(v, 'error') : dash), sg = (x) => (Number(x) ? money(x) : dash);
      const diem = ['Dựa trên kỹ thuật', 'Kết hợp giữa kỹ thuật và giá', 'Giá cố định'].includes(pp), lose = rows.filter((r) => !r.dat || r.xepHang == null);
      const ud = ['DTRR', 'DTHC'].includes(g.form), hlYc = lcHs(g, cu).hieuLuc;
      return (rows.length ? card('Kết quả đánh giá nhà thầu', `<div class="ginfo c3">${kv('Phương pháp đánh giá', esc(pp))}${kv('Giá gói thầu', ty(g.price, 2) + ' tỷ đồng')}${kv('Số nhà thầu đạt', `${rows.filter((r) => r.xepHang).length} / ${rows.length}`)}</div>`
          + table([['Nhà thầu', 220], ['Xếp hạng', 80, 'c'], ['Hợp lệ', 90, 'c'], ['Năng lực, kinh nghiệm', 110, 'c'], ['Kỹ thuật', 90, 'c'], ...(diem ? [['Điểm kỹ thuật', 90, 'r']] : []), ...(ud ? [['Ưu đãi', 80, 'c']] : []),
            ['Giá dự thầu (tỷ đồng)', 120, 'r'], ['Giá sau sửa lỗi, hiệu chỉnh, giảm giá', 150, 'r'], ...(pp === 'Giá đánh giá' ? [['Giá đánh giá', 110, 'r']] : []),
            ...(pp === 'Kết hợp giữa kỹ thuật và giá' ? [['Điểm tổng hợp', 100, 'r']] : []), ['Cảnh báo', 160], ['Sửa lỗi', 90, 'r'], ['Hiệu chỉnh sai lệch', 100, 'r'], ['Giảm giá', 90, 'r'], ['Hiệu lực HSDT (ngày)', 100, 'r']], rows,
          (r) => `<td>${clamp(r.ten)}</td><td class="c">${r.xepHang || dash}</td><td class="c">${res(r.hopLe)}</td><td class="c">${res(r.nangLuc || 'Đạt')}</td><td class="c">${res(r.kyThuat)}</td>${diem ? `<td class="r num">${r.diemKt != null ? esc(r.diemKt) : dash}</td>` : ''}${ud ? `<td class="c">${r.uuDai ? badge('Có', 'info') : dash}</td>` : ''}
            <td class="r num">${money(r.giaSo)}</td><td class="r num"><b>${money(r.giaSau)}</b></td>
            ${pp === 'Giá đánh giá' ? `<td class="r num">${money(r.giaDg)}</td>` : ''}${pp === 'Kết hợp giữa kỹ thuật và giá' ? `<td class="r num">${r.diemTh != null ? esc(ty(r.diemTh, 2)) : dash}</td>` : ''}
            <td>${r.hieuLuc != null && Number(r.hieuLuc) < hlYc ? badge('Hiệu lực HSDT ngắn hơn yêu cầu', 'error') : r.giaSau > g.price ? badge('Vượt giá gói thầu', 'error') : r.giaSau < g.price * 0.8 ? badge('Giá thấp bất thường', 'warning') : dash}</td>
            <td class="r num">${sg(r.suaLoi)}</td><td class="r num">${sg(r.hieuChinh)}</td><td class="r num">${sg(r.giamGia)}</td><td class="r num">${r.hieuLuc != null ? esc(r.hieuLuc) : dash}</td>`))
        + card('Nhà thầu không đạt và lý do', table([['Nhà thầu', 340], ['Lý do', 560]], lose, (r) => `<td>${clamp(r.ten)}</td><td>${clamp(r.ghiChu || (r.dat ? 'Giá sau hiệu chỉnh vượt giá gói thầu (phương pháp giá cố định)' : ''))}</td>`), lose.length ? `${lose.length} nhà thầu` : 'Không có') : '')
        + (doneAt(13) ? card('Kết quả lựa chọn nhà thầu', `<div class="ginfo c3">${kv('Nhà thầu đề nghị trúng thầu', esc(nccName(cu.lcNhaThau || (rows[0] || {}).ma || '')))}${kv('Giá đề nghị trúng thầu', cu.lcGiaTT != null ? ty(Number(cu.lcGiaTT), 2) + ' tỷ đồng' : '-')}
            ${kv('Ngày biên bản thương thảo', esc(cu.lcNgayTT || '-'))}${kv('Quyết định phê duyệt KQLCNT', g.kq ? `${esc(g.kq[0])} ngày ${esc(g.kq[1])}` : badge('Chờ phê duyệt', 'warning'))}</div>`)
          : waitCard('Kết quả lựa chọn nhà thầu', [13])) + traoCard();
    };
    /* T80 L3 (phần thầu): thư chấp thuận HSDT và trao hợp đồng, thông tin chuyển giao để ký hợp đồng — đọc eForm MS19 bước 22 (Thau.lcTrao).
       Gói mẫu chưa chạy luồng không có dữ liệu bước 22 → không hiện (không bịa số liệu). */
    const traoCard = () => {
      if (!live) return '';
      if (!doneAt(22)) return C.status === 'running' && doneAt(13) ? waitCard('Thư chấp thuận HSDT và trao hợp đồng', [22]) : '';
      const t = lcTrao(g, cu, cu.lcNgayThu);
      return card('Thư chấp thuận HSDT và trao hợp đồng', `<div class="ginfo c3">${kv('Nhà thầu trúng thầu', esc(nccName(t.win)))}${kv('Ngày thư', esc(t.ngayThu))}${kv('Giá trúng thầu', ty(t.gia, 2) + ' tỷ đồng')}
          ${kv('Thời hạn hoàn thiện hợp đồng', t.hoanThien + ' ngày')}${kv('Thời hạn ký kết hợp đồng', t.kyKet + ' ngày')}${kv('Ngày hết hạn hoàn thiện, ký kết hợp đồng', esc(t.hanKy))}
          ${kv('Bảo đảm thực hiện hợp đồng', t.tv ? 'Không yêu cầu — gói tư vấn' : `${ty(t.baoLanh, 1)}% giá hợp đồng · ${ty(t.baoLanhTien, 3)} tỷ đồng`, 'span3')}</div>`)
        + card('Thông tin chuyển giao để ký hợp đồng', `<div class="ginfo c3">${kv('Ngày bàn giao', esc(t.ngayBanGiao))}${kv('Ký hợp đồng trước ngày', esc(t.hanKy))}
            ${kv('Ngày hết hiệu lực HSDT', t.hetHl ? esc(t.hetHl) + (t.quaHl ? ' ' + badge('Trước hạn ký hợp đồng — đề nghị nhà thầu gia hạn', 'warning') : '') : dash)}
            ${kv('Thời gian giao hàng', esc(t.tgGiaoHang))}${kv('Điều kiện thanh toán', esc(t.dkTt), 'span2')}</div>`
          + table([['Đầu mối', 240], ['Họ và tên', 260], ['Điện thoại / email', 320]], t.dauMoi, (r) => `<td>${esc(r.vaiTro)}</td><td>${r.ten ? esc(r.ten) : dash}</td><td>${r.lienHe ? esc(r.lienHe) : dash}</td>`)
          + table([['Nguồn gói thầu', 200], ['Mã', 200], ['Giá trị phân bổ của gói (tỷ đồng)', 230, 'r'], ['Giá trúng thầu phân bổ (tỷ đồng)', 230, 'r']], t.phanBo,
            (r) => `<td>${esc(r.loai)}</td><td>${esc(r.ma)}</td><td class="r num">${money(r.phanBo)}</td><td class="r num">${money(r.trung)}</td>`,
            `<tfoot><tr><td></td><td colspan="2"><b>Tổng</b></td><td class="r num"><b>${ty(t.phanBo.reduce((a, r) => a + r.phanBo, 0), 2)}</b></td><td class="r num"><b>${ty(t.gia, 2)}</b></td></tr></tfoot>`),
          'Hợp đồng khởi tạo từ gói đọc các thông tin này');
    };
    const tDg = () => {
      if (live && C.status === 'running') return tDgLive();
      if (!bidders.length || lv < 3) return emptyCard('Đánh giá hồ sơ', 'Chưa có hồ sơ tham dự để đánh giá.');
      const rk = (b) => { const r = ranked.indexOf(b); return r < 0 ? dash : String(r + 1); };
      const res = (v) => (v == null ? dash : v === 'Đạt' ? badge('Đạt', 'success') : typeof v === 'number' ? (v >= 70 ? badge(v + ' điểm', 'success') : badge(v + ' điểm', 'error')) : badge(v, 'error'));
      const win = g.winner && D.nccOf(g.winner);
      const lose = bidders.filter((b) => b.ncc !== g.winner).map((b) => [nccName(b.ncc), b.note || (b.cap !== 'Đạt' && b.cap != null ? 'Không đạt năng lực, kinh nghiệm' : b.tech != null && b.tech < 70 ? 'Không đạt điểm kỹ thuật tối thiểu' : 'Xếp hạng thấp hơn nhà thầu trúng thầu')]);
      const sg = (x) => (Number(x) ? money(x) : dash);
      return card('Kết quả đánh giá nhà thầu', table([['Nhà thầu', 220], ['Xếp hạng', 80, 'c'], ['Hợp lệ', 90, 'c'], ['Năng lực', 100, 'c'], ['Kỹ thuật', 100, 'c'], ['Giá dự thầu (tỷ đồng)', 120, 'r'],
            ['Giá sau sửa lỗi, hiệu chỉnh, giảm giá', 150, 'r'], ['Cảnh báo', 160], ['Sửa lỗi', 90, 'r'], ['Hiệu chỉnh sai lệch', 100, 'r'], ['Giảm giá', 90, 'r']], bidders,
          (b) => `<td>${clamp(nccName(b.ncc))}</td><td class="c">${rk(b)}</td><td class="c">${res(b.valid)}</td><td class="c">${res(b.cap)}</td><td class="c">${res(b.tech)}</td><td class="r num">${money(b.price)}</td>
            <td class="r num"><b>${money(b.adjP)}</b></td><td>${low(b) ? badge('Giá thấp bất thường', 'warning') : b.adjP > g.price ? badge('Vượt giá gói thầu', 'error') : dash}</td>
            <td class="r num">${sg((b.adj || [])[0])}</td><td class="r num">${sg((b.adj || [])[1])}</td><td class="r num">${sg((b.adj || [])[2])}</td>`), `Giá gói thầu ${ty(g.price, 2)} tỷ đồng · xếp hạng theo giá sau sửa lỗi, hiệu chỉnh sai lệch, trừ giảm giá`)
        + card('Làm rõ hồ sơ dự thầu', table([['Nhà thầu', 300], ['Ngày', 120], ['Nội dung yêu cầu làm rõ', 380], ['Trả lời', 260]],
          bidders.filter(low).map((b) => [nccName(b.ncc), '03/10/2026', 'Giải trình giá dự thầu thấp hơn 20% giá gói thầu', 'Đã giải trình — chưa chứng minh được khả năng thực hiện']),
          (r) => `<td>${clamp(r[0])}</td><td class="num">${esc(r[1])}</td><td>${clamp(r[2])}</td><td>${clamp(r[3])}</td>`))
        + card('Kết quả lựa chọn nhà thầu', win && lv >= 4 ? `<div class="ginfo c3">${kv('Nhà thầu đề nghị trúng thầu', esc(win.name))}${kv('Giá trúng thầu', ty(bidders.find((b) => b.ncc === g.winner).adjP, 2) + ' tỷ đồng')}${kv('Loại hợp đồng', esc(cat('loai-hop-dong', g.contract)))}
            ${kv('Thời gian thực hiện', esc(g.execTime))}${kv('Quyết định phê duyệt KQLCNT', g.kq ? `${esc(g.kq[0])} ngày ${esc(g.kq[1])}` : badge('Chờ phê duyệt', 'warning'))}${kv('Thương thảo hợp đồng', badge('Thành công', 'success'))}</div>`
          + table([['Nhà thầu không trúng thầu', 340], ['Lý do', 520]], lose, (r) => `<td>${clamp(r[0])}</td><td>${clamp(r[1])}</td>`) : '<div class="empty-t">Chưa có kết quả lựa chọn nhà thầu.</div>')
        + traoCard();
    };
    /* T80 L5: gói chạy MS19 — xử lý tình huống 01 HSDT ở bước 3.4 (Điều 36 khoản 5) ghi thêm dòng; tình huống mẫu cùng loại coi như đã xử lý. */
    const ghs = (cu.lcGiaHan || []).map((x) => ['Chỉ có 01 HSDT — gia hạn thời điểm đóng thầu', x.ngay, `Gia hạn lần ${x.lan}: đóng thầu ${x.dongCu} → ${x.dongMoi}, mở thầu ${x.moMoi}. Tờ trình ${x.soTtr || '-'}, công văn gia hạn ${x.soCv || '-'}, thông báo gia hạn TBMT ${x.soVb}. Lý do: ${x.lyDo}`, 'Đã gia hạn']);
    const moNgay = live && cu.lcMoNgay && (g.bidders || []).length === 1 ? [['Chỉ có 01 HSDT — mở thầu ngay', cu.lcMoNgay, `Chủ đầu tư quyết định mở thầu ngay để đánh giá (Điều 36 khoản 5 điểm b)${cu.lcSoTtrXlth ? ` — tờ trình ${cu.lcSoTtrXlth}` : ''}.`, 'Đã xử lý']] : [];
    const evs = (g.events || []).map((x) => (live && (ghs.length || moNgay.length) && /01 nhà thầu|01 HSDT/.test(x[0]) && !/^Đã/.test(x[3]) ? [x[0], x[1], x[2], 'Đã xử lý trong tổ chức LCNT'] : x)).concat(ghs, moNgay);
    const tTh = () => card('Tình huống & kiến nghị', table([['Loại', 220], ['Ngày', 120], ['Nội dung', 520], ['Trạng thái', 220]], evs,
      (r) => `<td>${esc(r[0])}</td><td class="num">${esc(r[1])}</td><td>${clamp(r[2])}</td><td>${clamp(r[3])}</td>`), 'Huỷ thầu, xử lý tình huống, kiến nghị, tạm dừng ký hợp đồng');
    const kq = g.form === 'GIAO_NV' || g.form === 'TU_TH' || g.form === 'DAT_HANG';
    const kqCard = () => (live && C.status === 'running' ? waitCard('Kết quả', [route]) : g.kq ? card('Kết quả', `<div class="ginfo c3">${kv('Đơn vị thực hiện', esc(g.assignee))}${kv('Văn bản', `${esc(g.kq[0])} ngày ${esc(g.kq[1])}`)}${kv('Giá trị', ty(g.price, 2) + ' tỷ đồng')}</div>`) : emptyCard('Kết quả', 'Chưa có văn bản giao thực hiện.'));
    return `<div class="pg">
      ${head({ title: 'Xem chi tiết gói thầu', back: 'goi-thau', lg: true, info, right })}
      ${tabs('gt:' + g.code, [['info', 'Thông tin chung'], ['pa', 'Phương án LCNT'], ['tp', 'Thành phần tham gia'], ['hs', 'Hồ sơ mời thầu'], ['dg', kq ? 'Kết quả' : 'Đánh giá & KQLCNT'], ['th', 'Tình huống & kiến nghị']],
        { info: tInfo, pa: tPa, tp: tTp, hs: tHs, dg: kq ? kqCard : tDg, th: tTh })}</div>`;
  }

  /* ---------- SCR-83 Nhà thầu & kiểm soát rủi ro (ecat catalog-list chỉ xem + app-tabs) ---------- */
  const STRAT = [['NCC-000003', 'Thiết bị đo kiểm vô tuyến, anten', '1102/QĐ-CNVTQĐ', '01/03/2026', '31/12/2027'], ['NCC-000008', 'Thiết bị đo kiểm, buồng đo', '1102/QĐ-CNVTQĐ', '01/03/2026', '31/12/2027'],
    ['NCC-000009', 'Thiết bị điện tử, dây chuyền SMT', '1102/QĐ-CNVTQĐ', '01/03/2026', '31/12/2027'], ['NCC-000001', 'Thiết bị CNTT, viễn thông', '1102/QĐ-CNVTQĐ', '01/03/2026', '31/12/2027']];
  const MAKERS = [['Hãng Sigma Instruments', 'Đức', 'Máy phân tích phổ, máy đo vector', 'NCC-000008'], ['Omega RF Systems', 'Hàn Quốc', 'Anten mảng pha, buồng đo', 'NCC-000009'],
    ['Tau Antenna Lab', 'Singapore', 'Anten băng Ka, bộ điều khiển chùm tia', 'NCC-000003']];
  const VIOL = [['NCC-000007', 'Không thực hiện bảo đảm thực hiện hợp đồng sau khi trúng thầu', 'GT-2025-0142', '0415/QĐ-VHT', '02/01/2026', 'Cấm tham gia đến 31/12/2026'],
    ['NCC-000010', 'Chậm tiến độ giao hàng quá 60 ngày, không thông báo', 'GT-2025-0098', '0311/QĐ-VHT', '15/11/2025', 'Hạn chế: chỉ tham gia khi có bảo đảm 10%'],
    ['NCC-000007', 'Nộp HSDT có thông tin không trung thực về kinh nghiệm', 'GT-2024-0211', '0902/QĐ-VHT', '10/09/2024', 'Cảnh cáo (hết hiệu lực)']];
  const NT = { tab: 'cl' };
  function ntPage() {
    // Theo: ecat common-catalog/base/catalog-list.component (chỉ xem) + app-tabs
    const info = {
      scr: 'SCR-83', name: 'Nhà thầu & kiểm soát rủi ro', uc: 'Backlog W1_T10 › Nhà thầu & Kiểm soát rủi ro (dòng 403–406)',
      notes: [
        'Tra cứu chỉ xem, khuôn catalog-list của ecat + app-tabs. Nhà thầu / hãng chiến lược do Tập đoàn công bố (QC-12869 Điều 13 khoản 2) — nguồn ưu tiên cho đấu thầu hạn chế, đàm phán trực tiếp.',
        'Nhà thầu bị cấm / hạn chế = cờ Tình trạng của danh mục Nhà cung cấp (SCR-31); khi đưa nhà thầu vào danh sách ngắn hoặc đánh giá, hệ thống chặn / cảnh báo theo cờ này. Lịch sử vi phạm ghi theo quyết định xử lý.',
        'Cảnh báo gian lận, thông thầu, chia nhỏ gói bất thường (dòng 407–408) để sau.',
      ],
      q: ['P-78'], src: 'ecat common-catalog/base/catalog-list.component · /common-catalog',
    };
    const ban = window.Catalog.rows('nha-cung-cap').filter((r) => r.ban);
    const body = {
      cl: () => card('Nhà thầu chiến lược', table([['Mã nhà thầu', 140], ['Tên nhà thầu', 320], ['Lĩnh vực', 280], ['Quyết định công bố', 200], ['Hiệu lực từ', 120], ['Hiệu lực đến', 120]], STRAT,
        (r) => `<td>${esc(r[0])}</td><td>${clamp(nccName(r[0]))}</td><td>${clamp(r[1])}</td><td>${esc(r[2])}</td><td class="num">${esc(r[3])}</td><td class="num">${esc(r[4])}</td>`)),
      hang: () => card('Hãng sản xuất chiến lược', table([['Tên hãng', 260], ['Quốc gia', 140], ['Sản phẩm', 340], ['Nhà thầu đại diện', 300]], MAKERS,
        (r) => `<td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${clamp(r[2])}</td><td>${clamp(nccName(r[3]))}</td>`)),
      cam: () => card('Nhà thầu bị cấm / hạn chế', table([['Mã nhà thầu', 140], ['Tên nhà thầu', 320], ['Tình trạng', 200, 'c'], ['Mã số thuế', 160]], ban,
        (r) => `<td>${esc(r.code)}</td><td>${clamp(r.name)}</td><td class="c">${r.ban.until ? badge('Cấm đến ' + r.ban.until, 'error') : badge('Hạn chế', 'warning')}</td><td>${esc(r.tax)}</td>`))
        + card('Lịch sử vi phạm và chế tài', table([['Nhà thầu', 280], ['Hành vi vi phạm', 340], ['Gói thầu', 140], ['Quyết định xử lý', 160], ['Ngày', 120], ['Chế tài', 260]], VIOL,
          (r) => `<td>${clamp(nccName(r[0]))}</td><td>${clamp(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td><td class="num">${esc(r[4])}</td><td>${clamp(r[5])}</td>`)),
    };
    return `<div class="pg">${head({ title: 'Nhà thầu & kiểm soát rủi ro', info })}
      <nav class="tabs dx-tabs" role="tablist">${[['cl', 'Nhà thầu chiến lược'], ['hang', 'Hãng sản xuất chiến lược'], ['cam', 'Nhà thầu bị cấm']].map(([k, l]) => `<button type="button" class="tab ${NT.tab === k ? 'on' : ''}" role="tab" aria-selected="${NT.tab === k}" data-nttab="${k}">${l}</button>`).join('')}</nav>
      ${body[NT.tab]()}</div>`;
  }

  /* ---------- Sự kiện danh sách / tab ---------- */
  document.addEventListener('click', (e) => {
    const t = e.target;
    const tb = t.closest('[data-ttab]');
    if (tb) { TB.tab = tb.dataset.ttab; rerender(); return; }
    const nt = t.closest('[data-nttab]');
    if (nt) { NT.tab = nt.dataset.nttab; rerender(); return; }
    const pg = t.closest('[data-pager]');
    if (pg && LST[pg.dataset.pager]) {
      const L = LST[pg.dataset.pager], b = t.closest('[data-pg]'), s = t.closest('[data-ps]');
      if (b) L.page = Number(b.dataset.pg);
      else if (s) { L.size = Number(s.dataset.ps); L.page = 1; L.psOpen = false; } else if (t.closest('[data-ps-open]')) L.psOpen = !L.psOpen;
      else return;
      rerender(); return;
    }
    const lx = t.closest('[data-lx]');
    if (lx && EXP[lx.dataset.lx]) { exportList(EXP[lx.dataset.lx]); return; }
    const tl = t.closest('[data-tl]');
    if (!tl) return;
    const [id, act] = tl.dataset.tl.split(':'), L = LST[id];
    if (act === 'adv') { L.adv = !L.adv; L.d = JSON.parse(JSON.stringify(L.f)); L.page = 1; }
    if (act === 'reset') { L.d = L.empty(); L.f = L.empty(); L.page = 1; }
    rerender();
  });
  document.addEventListener('submit', (e) => {
    const f = e.target.closest('[data-tadv]');
    if (!f) return;
    e.preventDefault();
    const L = LST[f.dataset.tadv];
    L.f = JSON.parse(JSON.stringify(L.d)); L.page = 1; rerender();
  });
  document.addEventListener('input', (e) => {
    const f = e.target.closest && e.target.closest('[data-tf]');
    if (f) { const [id, k] = f.dataset.tf.split(':'); LST[id].d[k] = f.value; }
  });
  document.addEventListener('keydown', (e) => {
    const id = e.key === 'Enter' && e.target.dataset && e.target.dataset.tkw;
    if (!id) return;
    LST[id].kw = e.target.value.trim(); LST[id].page = 1; rerender();
    const k = document.getElementById(id + '-kw');
    if (k) { k.focus(); k.setSelectionRange(k.value.length, k.value.length); }
  });

  /* Router: #/khlcnt, #/khlcnt/create[/<loại>/<mã>], #/khlcnt/<mã>, #/goi-thau[/<mã>], #/nha-thau. */
  function route(parts) {
    const [a, b] = parts;
    if (a === 'khlcnt') return b === 'create' ? khForm() : b ? khDetail(decodeURIComponent(b)) : khList();
    if (a === 'goi-thau') return b ? pkDetail(decodeURIComponent(b)) : pkList();
    return ntPage();
  }
  function enter(parts) {
    if (parts[0] === 'khlcnt' && parts[1] === 'create') resetForm(parts[2], parts[3] && decodeURIComponent(parts[3]));
  }
  function reset() { U = { kh: [], adj: {}, pk: {} }; persist(); }

  /* Khuôn dùng chung cho các phân hệ B3 (hop-dong.js, thong-bao.js, bao-cao.js): danh sách, bảng, card, tab, trường. */
  const setTab = (key, tab) => { TB.key = key; TB.tab = tab; };
  const kit = { listPage, table, card, emptyCard, tabs, setTab, kv, field, money, clamp, dash, has, inSet, catOpts, cat, nccName, sum, dkey, LST };
  /* Nhãn trạng thái cho màn khác (Chi tiết KĐT / ĐXMS, đề tài, biến eForm): theo KHL / LC. */
  const khStLabel = (k) => { const x = (khOf(k.code) || k).prog || khProg(k); return [KHL[x.khl][0], KHL[x.khl][1]]; };
  const pkStLabel = (g) => { const r = pkRow(g); return [LC[r.lc][0], LC[r.lc][1]]; };
  /* Đối tượng cha của hồ sơ MS19 (D.hdProcesses.MS19.obj): gói thầu. */
  const lcCase = (code) => { const g = pkOf(code); if (!g) return null; const k = khOf(g.kh) || {};
    const s = k.src ? ((k.src[0] === 'KDT' ? Flow.findKdt(k.src[1]) : Flow.findDxms(k.src[1])) || {}) : {};
    return { title: g.name, unit: s.unit, value: g.price, owner: k.code ? ownerOf(k) : '', levelText: cat('hinh-thuc-lcnt', g.form), g }; };
  window.Thau = { KH_SAMPLE, PK_SAMPLE, lcRefPkgs, lcRefOf, lcCheck15, PP_DG, lcPpOf, lcXepHang, lcHs, lcTrao, lcTeam, certOf, certTxt, route, enter, reset, khBy, srcInfo, pkExtra, khAll, khOf, khCase, khFlowDone, lcCase, lcFlowDone, mauGoiY, totals, pkgsOf, pkOf, get PK() { return PK.map(pkM); }, KH_ST, PK_ST, KHL, LC, khStLabel, pkStLabel, khProg, pkRow, srcHref, kit, LEVEL, levelOf };
})();
