/* Công khai & tích hợp đấu thầu theo Backlog W1_T10 (dòng 409–415) — QC-12869 Điều 26, BPMN-MS18 bước 54–60 (MS18.4 bước 11–17).
   Danh sách tin cần đăng tải sinh từ dữ liệu Quản lý thầu (thau.js): KHLCNT đã phê duyệt (mỗi phiên bản), danh sách ngắn, TBMT kèm HSMT / HSMCG,
   biên bản mở thầu, KQLCNT, thông tin khác (huỷ thầu), nhà thầu vi phạm. Thời hạn đăng tải là cấu hình theo loại tin (TYPES), không viết theo từng màn.
   SCR-94 #/cong-khai-thau (tab Theo dõi đăng tải / Nhật ký đồng bộ / Kết nối & thời hạn). */
(function () {
  const { esc, icon, badge, toast, vModal, persona } = window.UI;
  const Flow = window.Flow, S = window.Screens;
  const rerender = () => window.App.render();
  const K = () => window.Thau.kit;
  const T = () => window.Thau;
  const TODAY = '07/10/2026';

  /* ---------- Ngày giờ: 'dd/mm/yyyy[ hh:mm]' ---------- */
  const ts = (s) => { const [d, t] = String(s || '').split(' '); const [dd, mm, yy] = d.split('/').map(Number); const [h, mi] = (t || '00:00').split(':').map(Number); return new Date(yy, mm - 1, dd, h, mi).getTime(); };
  const fmt = (ms, time) => { const x = new Date(ms), p = (n) => String(n).padStart(2, '0'); return `${p(x.getDate())}/${p(x.getMonth() + 1)}/${x.getFullYear()}${time ? ` ${p(x.getHours())}:${p(x.getMinutes())}` : ''}`; };
  /* Ngày làm việc: bỏ thứ Bảy, Chủ nhật; ngày nghỉ lễ lấy từ lịch làm việc (P-83). */
  function addWork(s, n) { let x = new Date(ts(s.split(' ')[0])); while (n > 0) { x = new Date(x.getTime() + 86400000); if (x.getDay() % 6) n--; } return fmt(x.getTime()); }
  const dayDiff = (a, b) => Math.round((ts(b.split(' ')[0]) - ts(a.split(' ')[0])) / 86400000);

  /* ---------- Cấu hình loại tin đăng tải (QC-12869 Điều 26 khoản 1, thời hạn khoản 2) ---------- */
  const TYPES = {
    KHLCNT: { name: 'KHLCNT', due: ['WD', 5], base: 'Ngày phê duyệt KHLCNT (mỗi lần điều chỉnh là một tin)', law: 'Khoản 1a, 2c',
      body: 'Tên KHLCNT, Chủ đầu tư, danh sách gói thầu (tên, giá, nguồn vốn, hình thức và phương thức LCNT, thời gian, loại hợp đồng), Quyết định phê duyệt' },
    DSN: { name: 'Danh sách ngắn', due: ['WD', 5], base: 'Ngày phê duyệt danh sách ngắn — phải đăng tải trước khi phát hành HSMT', law: 'Khoản 1b, 2c',
      body: 'Tên gói thầu, danh sách nhà thầu được mời, Quyết định phê duyệt danh sách ngắn' },
    TBMT: { name: 'TBMT kèm HSMT / HSMCG', due: ['DOC', 0], base: 'Thời điểm phát hành ghi trong HSMT / HSMCG', law: 'Khoản 1c–d, 2a',
      body: 'Thông báo mời thầu / mời chào giá, HSMT / HSMCG, thời điểm đóng thầu, bảo đảm dự thầu' },
    BBMT: { name: 'Biên bản mở thầu', due: ['H', 24], base: 'Thời điểm mở thầu (đấu thầu rộng rãi, hạn chế, chào giá trực tuyến)', law: 'Khoản 1e, 2b',
      body: 'Danh sách nhà thầu nộp hồ sơ, giá dự thầu, giảm giá, bảo đảm dự thầu, thời gian thực hiện' },
    KQ: { name: 'KQLCNT', due: ['WD', 5], base: 'Ngày phê duyệt KQLCNT', law: 'Khoản 1f, 2c',
      body: 'Tên nhà thầu trúng thầu, giá trúng thầu, loại hợp đồng, thời gian thực hiện hợp đồng, Quyết định phê duyệt KQLCNT' },
    KHAC: { name: 'Thông tin khác', due: ['WD', 5], base: 'Ngày ban hành văn bản (huỷ thầu, gia hạn, sửa đổi HSMT…)', law: 'Khoản 1h, 2c',
      body: 'Nội dung văn bản, lý do, Quyết định kèm theo' },
    VP: { name: 'Nhà thầu vi phạm', due: ['WD', 5], base: 'Ngày ban hành quyết định xử lý vi phạm', law: 'Khoản 1g, 2c; Điều 11 khoản 4',
      body: 'Tên nhà thầu, hành vi vi phạm, hình thức xử lý, thời hạn, Quyết định xử lý' },
  };
  const dueOf = (ty, at) => { const [k, n] = TYPES[ty].due; return k === 'WD' ? addWork(at, n) : k === 'H' ? fmt(ts(at) + n * 3600000, true) : at; };
  const dueText = (ty) => { const [k, n] = TYPES[ty].due; return k === 'WD' ? `${n} ngày làm việc` : k === 'H' ? `${n} giờ` : 'Cùng thời điểm phát hành'; };

  /* ---------- Hệ thống đăng tải: gói / KHLCNT áp dụng Luật Đấu thầu → mạng đấu thầu quốc gia; còn lại → Cổng đấu thầu Viettel (P-83) ---------- */
  const SYS = {
    VTB: { name: 'Cổng đấu thầu Viettel', short: 'Cổng Viettel', scope: 'Tin đăng tải của gói thầu theo Quy chế 12869; chào giá trực tuyến; trả về tiến độ, kết quả mở thầu, kiến nghị',
      way: 'API qua trục tích hợp (đẩy tin khi xác nhận; nhận tiến độ định kỳ 60 phút)', last: '07/10/2026 08:00', ok: true },
    DTQG: { name: 'Hệ thống mạng đấu thầu quốc gia', short: 'Mạng ĐTQG', scope: 'Tin đăng tải của KHLCNT / gói thầu áp dụng Luật Đấu thầu',
      way: 'API qua trục tích hợp (đẩy tin khi xác nhận; nhận trạng thái tin định kỳ 60 phút)', last: '07/10/2026 08:00', ok: true },
  };
  const sysOfKh = (k) => (k && k.law ? 'DTQG' : 'VTB');

  /* ---------- Mốc phát sinh của gói thầu từ tiến trình tổ chức LCNT (MS19 theo BPMN-MS19; quy trình con chi tiết treo P-235) ---------- */
  const EV = {
    'DSN:GT-2026-0024': '22/09/2026', 'TBMT:GT-2026-0024': '25/09/2026 08:00',
    'TBMT:GT-2026-0021': '04/09/2026 08:00', 'BBMT:GT-2026-0021': '15/09/2026 10:00',
    'TBMT:GT-2026-0029': '15/09/2026 08:00', 'BBMT:GT-2026-0029': '02/10/2026 10:00',
    'TBMT:GT-2026-0030': '22/09/2026 08:00', 'BBMT:GT-2026-0030': '29/09/2026 10:00',
  };
  const BID = ['DTRR', 'DTHC', 'CGTT'];
  const LV = { KH: 0, HS: 1, MOI: 2, DG: 3, TH: 3, KQ_CHO: 4, KQ: 5, HUY: 3 };
  const INTERNAL = ['GIAO_NV', 'TU_TH', 'DAT_HANG'];
  /* Nhà thầu vi phạm đang có hiệu lực (cùng nguồn với SCR-83 tab Nhà thầu bị cấm). */
  const VIOL = [['NCC-000007', 'Không thực hiện bảo đảm thực hiện hợp đồng sau khi trúng thầu', '0415/QĐ-VHT', '02/01/2026'],
    ['NCC-000010', 'Chậm tiến độ giao hàng quá 60 ngày, không thông báo', '0311/QĐ-VHT', '15/11/2025']];

  function items() {
    const out = [], th = T();
    th.khAll().filter((k) => k.docs && k.docs.bm03).forEach((k) => {
      (k.versions || [{ v: 'v1', at: k.docs.bm03[1], no: k.docs.bm03[0] }]).forEach((v, i) => out.push({ id: `KHLCNT:${k.code}:${v.v}`, ty: 'KHLCNT', code: k.code,
        title: k.title + (i ? ` — điều chỉnh ${v.v}` : ''), href: 'khlcnt/' + encodeURIComponent(k.code), at: v.at, doc: `QĐ ${v.no}`, sys: sysOfKh(k) }));
    });
    /* T80 L4b (QC-12869 Điều 7 khoản 1): tài liệu mật theo quy định của Tập đoàn, bí mật nhà nước, an ninh – quốc phòng không đăng tải → gói Mật không sinh tin. */
    th.PK.filter((g) => !g.secret).forEach((g) => {
      const kh = th.khAll().find((k) => k.code === g.kh), sys = sysOfKh(kh), lv = LV[g.st], base = { code: g.code, href: 'goi-thau/' + encodeURIComponent(g.code), sys };
      const add = (ty, at, title, doc) => at && out.push(Object.assign({ id: `${ty}:${g.code}`, ty, at, title, doc }, base));
      if (g.form === 'DTHC' && g.short && lv >= 1) add('DSN', EV['DSN:' + g.code], g.name, `${g.short.length} nhà thầu`);
      if (BID.includes(g.form) && lv >= 2) add('TBMT', EV['TBMT:' + g.code], g.name, g.form === 'CGTT' ? 'HSMCG' : 'HSMT');
      if (BID.includes(g.form) && lv >= 3) add('BBMT', EV['BBMT:' + g.code], g.name, `${(g.bidders || []).length} nhà thầu nộp hồ sơ`);
      if (g.kq && !INTERNAL.includes(g.form)) add('KQ', g.kq[1], g.name, `QĐ ${g.kq[0]}`);
      (g.events || []).filter((e) => e[0] === 'Huỷ thầu').forEach((e) => add('KHAC', e[1], `Huỷ thầu — ${g.name}`, 'QĐ ' + (e[2].match(/\d+\/QĐ-[A-Z]+/) || ['huỷ thầu'])[0]));
    });
    VIOL.forEach(([ncc, what, no, at]) => out.push({ id: `VP:${no}`, ty: 'VP', code: ncc, title: `${K().nccName(ncc)} — ${what}`, href: 'nha-thau', at, doc: `QĐ ${no}`, sys: 'VTB' }));
    return out.map((x) => Object.assign(x, { due: dueOf(x.ty, x.at) }, pubOf(x.id)));
  }

  /* ---------- Trạng thái đăng tải: dữ liệu mẫu + thao tác trên prototype (localStorage) ---------- */
  const PUB_ST = { WAIT: ['Chờ xác nhận đăng tải', 'warning'], ERR: ['Lỗi đăng tải', 'error'], OK: ['Đã đăng tải', 'success'] };
  const P0 = {
    'KHLCNT:KHLCNT-2026-0013:v1': ['OK', '06/08/2026 15:10', 'VTB-2608-00113', 'Nguyễn Văn Minh'],
    'KHLCNT:KHLCNT-2026-0011:v1': ['OK', '28/08/2026 10:05', 'PL2600045812', 'Nguyễn Văn Minh'],
    'KHLCNT:KHLCNT-2026-0009:v1': ['OK', '04/09/2026 09:40', 'VTB-2609-00121', 'Phan Văn Lộc'],
    'KHLCNT:KHLCNT-2026-0009:v2': ['ERR', '02/10/2026 09:12', null, 'Phan Văn Lộc', 'Cổng đấu thầu Viettel từ chối tin: giá gói GT-2026-0021 khác tin KHLCNT đã đăng tải — tin điều chỉnh phải kèm Quyết định điều chỉnh KHLCNT.'],
    'KHLCNT:KHLCNT-2026-0014:v1': ['OK', '26/09/2026 14:30', 'VTB-2609-00138', 'Bùi Minh Quang'],
    'DSN:GT-2026-0024': ['OK', '23/09/2026 09:00', 'IB2600231774', 'Trần Đức Hải'],
    'TBMT:GT-2026-0024': ['OK', '25/09/2026 08:00', 'IB2600231775', 'Trần Đức Hải'],
    'TBMT:GT-2026-0021': ['OK', '04/09/2026 08:00', 'VTB-2609-00122', 'Phan Văn Lộc'],
    'BBMT:GT-2026-0021': ['OK', '15/09/2026 15:20', 'VTB-2609-00129', 'Phan Văn Lộc'],
    'TBMT:GT-2026-0029': ['OK', '15/09/2026 08:00', 'VTB-2609-00130', 'Bùi Minh Quang'],
    'TBMT:GT-2026-0030': ['OK', '22/09/2026 08:00', 'VTB-2609-00134', 'Bùi Minh Quang'],
    'BBMT:GT-2026-0030': ['OK', '29/09/2026 10:00', 'VTB-2609-00141', 'Cổng đấu thầu Viettel (tự công khai)'],
    'KHAC:GT-2026-0030': ['OK', '02/10/2026 10:15', 'VTB-2610-00144', 'Bùi Minh Quang'],
    'KQ:GT-2026-0027': ['OK', '24/08/2026 16:00', 'VTB-2608-00117', 'Nguyễn Văn Minh'],
    'VP:0415/QĐ-VHT': ['OK', '06/01/2026 10:00', 'VTB-2601-00004', 'Phạm Thị Lan'],
    'VP:0311/QĐ-VHT': ['OK', '19/11/2025 09:30', 'VTB-2511-00187', 'Phạm Thị Lan'],
  };
  const LOG0 = [
    ['07/10/2026 08:00', 'VTB', 'Nhận về', 'GT-2026-0024', 'Tiến độ gói thầu: 03 nhà thầu trong danh sách ngắn đã tải HSMT; đóng thầu 10/10/2026 09:00', 'Thành công'],
    ['07/10/2026 08:00', 'VTB', 'Nhận về', 'GT-2026-0021', 'Kiến nghị về KQLCNT của Công ty Cổ phần Thiết bị Beta (nộp trên Cổng)', 'Thành công'],
    ['02/10/2026 10:05', 'VTB', 'Nhận về', 'GT-2026-0029', 'Kết quả đóng thầu: 01 HSDT', 'Thành công'],
    ['02/10/2026 09:12', 'VTB', 'Gửi đi', 'KHLCNT-2026-0009', 'Đăng tải KHLCNT — điều chỉnh v2', 'Lỗi: tin điều chỉnh thiếu Quyết định điều chỉnh KHLCNT'],
    ['29/09/2026 10:00', 'VTB', 'Nhận về', 'GT-2026-0030', 'Kết quả chào giá trực tuyến: 02 HSCG, giá chào thấp nhất 4,92 tỷ đồng (vượt giá gói)', 'Thành công'],
    ['26/09/2026 14:30', 'VTB', 'Gửi đi', 'KHLCNT-2026-0014', 'Đăng tải KHLCNT', 'Thành công · VTB-2609-00138'],
    ['25/09/2026 08:00', 'DTQG', 'Gửi đi', 'GT-2026-0024', 'Đăng tải TBMT kèm HSMT', 'Thành công · IB2600231775'],
  ];
  const KEY = 'dtms-proto-cong-khai';
  let U = { pub: {}, log: [], seq: 0 };
  try { U = Object.assign(U, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* bỏ qua */ }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(U)); } catch (e) { /* bỏ qua */ } };
  function pubOf(id) {
    const p = U.pub[id] || P0[id];
    if (!p) return { st: 'WAIT', pubAt: null, ref: null, by: null, err: null };
    const [st, pubAt, ref, by, err] = p;
    return { st, pubAt: st === 'OK' ? pubAt : null, triedAt: pubAt, ref, by, err: err || null };
  }
  /* Tình trạng hạn: tin đã đăng so với hạn; tin chưa đăng so với hôm nay. */
  const NOW = ts(TODAY + ' 12:00');
  const endOf = (d) => (d.includes(' ') ? ts(d) : ts(d) + 86400000 - 1);
  function timely(x) {
    if (x.st === 'OK') return ts(x.pubAt) > endOf(x.due) ? ['Trễ hạn', 'error'] : ['Đúng hạn', 'success'];
    if (NOW > endOf(x.due)) return [`Quá hạn ${Math.max(1, dayDiff(x.due, TODAY))} ngày`, 'error'];
    const d = dayDiff(TODAY, x.due);
    return d === 0 ? ['Đến hạn hôm nay', 'warning'] : [`Còn ${d} ngày`, 'info'];
  }

  /* ---------- SCR-94 ---------- */
  const TAB = { v: 'dt' };
  const TABS = [['dt', 'Theo dõi đăng tải'], ['log', 'Nhật ký đồng bộ'], ['cfg', 'Kết nối & thời hạn']];
  const tabBar = () => `<nav class="tabs dx-tabs" role="tablist">${TABS.map(([k, l]) => `<button type="button" class="tab ${TAB.v === k ? 'on' : ''}" role="tab" aria-selected="${TAB.v === k}" data-ck-tab="${k}">${l}</button>`).join('')}</nav>`;
  const INFO = {
    scr: 'SCR-94', name: 'Công khai & tích hợp đấu thầu', uc: 'Backlog W1_T10 › Quản lý thầu › Công khai & Tích hợp đấu thầu (dòng 409–415)',
    bpmn: 'MS18 bước 21–23 (đăng tải KHLCNT), MS19 bước 22–23 (công khai KQLCNT) — BPMN-MS18-TOBE / BPMN-MS19: sinh dữ liệu đăng tải → Chủ đầu tư kiểm tra, xác nhận → đăng tải → ghi nhận thời điểm / lỗi, cho gửi lại',
    notes: [
      '<b>Theo dõi đăng tải</b>: mỗi dòng là một tin phải công khai theo QC-12869 Điều 26 khoản 1, <b>sinh tự động</b> từ dữ liệu Quản lý thầu khi đối tượng đạt mốc (KHLCNT được phê duyệt — mỗi phiên bản điều chỉnh là một tin; danh sách ngắn; phát hành HSMT / HSMCG; mở thầu; KQLCNT; huỷ thầu; quyết định xử lý vi phạm). Không nhập tay.',
      '<b>Hạn đăng tải</b> = mốc phát sinh + thời hạn theo loại tin ở tab Kết nối & thời hạn (Điều 26 khoản 2: 05 ngày làm việc, 24 giờ với biên bản mở thầu). Bảng thời hạn là cấu hình, các chỉ tiêu KPI thầu ở Báo cáo đọc cùng nguồn.',
      '<b>Xác nhận đăng tải</b> (bước 55–57): Chủ đầu tư rà soát nội dung, bắt buộc tích đã loại trừ thông tin mật / bí mật Tập đoàn / an ninh – quốc phòng (BPMN-MS18 N02), rồi hệ thống gửi tin qua API. <b>Gửi lại</b> cho tin bị lỗi (bước 60). Thành công → lưu mã tin, thời điểm (bước 59) và ghi nhật ký.',
      '<b>Nhật ký đồng bộ</b>: chiều gửi tin đi và chiều nhận tiến độ / kết quả từ cổng về ĐTMS (Backlog dòng 415) — để màn Chi tiết gói thầu theo dõi xuyên suốt dù thao tác đấu thầu nằm ở cổng ngoài.',
      'Giả lập P-82: hai hệ thống kết nối qua API của trục tích hợp, đẩy tin khi xác nhận, nhận trạng thái định kỳ 60 phút; mã tin theo mẫu của từng hệ thống. Giả lập P-83: chọn hệ thống theo cờ "Áp dụng Luật Đấu thầu cho gói cụ thể" của KHLCNT; ngày làm việc chỉ trừ thứ Bảy, Chủ nhật.',
    ],
    q: ['P-82', 'P-83'], src: 'task-management/task-management.component · /task-management (khuôn danh sách) + app-tabs',
  };
  const tyOpts = Object.entries(TYPES).map(([value, t]) => ({ value, label: t.name }));
  function dtTab() {
    const k = K();
    return k.listPage({
      id: 'ckt', title: 'Công khai & tích hợp đấu thầu', ph: 'Tìm kiếm theo mã, tên đối tượng, mã tin', info: INFO, top: tabBar(),
      rows: () => items().sort((a, b) => (a.st === 'OK') - (b.st === 'OK') || ts(b.at) - ts(a.at)),
      kwText: (x) => `${x.code} ${x.title} ${x.ref || ''}`,
      empty: () => ({ code: '', ty: [], st: [], sys: null }),
      match: (x, f) => k.has(f.code, x.code) && k.inSet(f.ty, x.ty) && k.inSet(f.st, x.st) && (!f.sys || x.sys === f.sys),
      adv: (txt, sel) => `${txt('code', 'Mã đối tượng')}
        ${sel('ty', 'Loại tin', { multi: true, searchable: false, options: tyOpts })}
        ${sel('st', 'Trạng thái đăng tải', { multi: true, searchable: false, options: Object.entries(PUB_ST).map(([value, [label]]) => ({ value, label })) })}
        ${sel('sys', 'Hệ thống đăng tải', { searchable: false, options: Object.entries(SYS).map(([value, s]) => ({ value, label: s.name })) })}`,
      cols: [['Thao tác', 90, 'c'], ['Trạng thái đăng tải', 190, 'c'], ['Loại tin', 180], ['Mã đối tượng', 170], ['Nội dung', 340], ['Căn cứ', 170], ['Hệ thống đăng tải', 160],
        ['Mốc phát sinh', 150], ['Hạn đăng tải', 150], ['Tình trạng hạn', 150, 'c'], ['Thời điểm đăng tải', 150], ['Mã tin', 150]],
      href: (x) => x.href,
      cell: (x) => `<td class="c"><div class="acts">${x.st === 'OK' ? '' : `<button type="button" class="vbtn icon ghost" aria-label="${x.st === 'ERR' ? 'Gửi lại' : 'Xác nhận đăng tải'}" title="${x.st === 'ERR' ? 'Gửi lại' : 'Xác nhận đăng tải'}" data-ck-pub="${esc(x.id)}">${icon(x.st === 'ERR' ? 'reload' : 'upload')}</button>`}</div></td>
        <td class="c">${badge(...PUB_ST[x.st])}</td><td>${esc(TYPES[x.ty].name)}</td><td><a class="link" data-go="${x.href}">${esc(x.code)}</a></td><td>${k.clamp(x.title)}</td><td>${k.clamp(x.doc)}</td>
        <td>${esc(SYS[x.sys].short)}</td><td class="num">${esc(x.at)}</td><td class="num">${esc(x.due)}</td><td class="c">${badge(...timely(x))}</td>
        <td class="num">${x.pubAt ? esc(x.pubAt) : k.dash}</td><td>${x.ref ? esc(x.ref) : k.dash}</td>`,
    });
  }
  function page(body) { return `<div class="pg">${S.head({ title: 'Công khai & tích hợp đấu thầu', info: INFO })}${tabBar()}${body}</div>`; }
  function logTab() {
    const k = K(), rows = U.log.concat(LOG0);
    return page(k.card('Nhật ký đồng bộ với hệ thống đấu thầu', k.table([['Thời điểm', 150], ['Hệ thống', 200], ['Chiều', 100, 'c'], ['Đối tượng', 170], ['Nội dung', 420], ['Kết quả', 300]], rows,
      (r) => `<td class="num">${esc(r[0])}</td><td>${esc(SYS[r[1]].name)}</td><td class="c">${badge(r[2], r[2] === 'Gửi đi' ? 'info' : 'default')}</td>
        <td><a class="link" data-go="${/^GT-/.test(r[3]) ? 'goi-thau/' + encodeURIComponent(r[3]) : /^KHLCNT-/.test(r[3]) ? 'khlcnt/' + encodeURIComponent(r[3]) : 'nha-thau'}">${esc(r[3])}</a></td><td>${k.clamp(r[4])}</td>
        <td>${/^Lỗi/.test(r[5]) ? `<span class="t-err">${esc(r[5])}</span>` : k.clamp(r[5])}</td>`), `${rows.length} bản ghi`));
  }
  function cfgTab() {
    const k = K();
    return page(k.card('Hệ thống kết nối', k.table([['Hệ thống', 240], ['Phạm vi', 420], ['Phương thức kết nối', 340], ['Đồng bộ gần nhất', 150], ['Trạng thái', 140, 'c']], Object.values(SYS),
      (s) => `<td>${esc(s.name)}</td><td>${k.clamp(s.scope)}</td><td>${k.clamp(s.way)}</td><td class="num">${esc(s.last)}</td><td class="c">${s.ok ? badge('Đang kết nối', 'success') : badge('Mất kết nối', 'error')}</td>`))
      + k.card('Thời hạn đăng tải theo loại tin', k.table([['Loại tin', 200], ['Thời hạn', 180], ['Tính từ', 420], ['Căn cứ QC-12869 Điều 26', 220], ['Nội dung đăng tải', 420]], Object.values(TYPES).map((t, i) => [Object.keys(TYPES)[i], t]),
        ([key, t]) => `<td>${esc(t.name)}</td><td>${esc(dueText(key))}</td><td>${k.clamp(t.base)}</td><td>${esc(t.law)}</td><td>${k.clamp(t.body)}</td>`)));
  }
  function route() { return TAB.v === 'log' ? logTab() : TAB.v === 'cfg' ? cfgTab() : dtTab(); }

  /* ---------- Hộp thoại Xác nhận đăng tải / Gửi lại (BPMN-MS18 bước 55–60) ---------- */
  function pubDlg(id) {
    const x = items().find((r) => r.id === id);
    if (!x || x.st === 'OK') return;
    const k = K(), resend = x.st === 'ERR', t = timely(x);
    const m = vModal({ title: resend ? 'Gửi lại tin đăng tải' : 'Xác nhận đăng tải', size: 'lg', body: `
        ${resend ? `<div class="hd-alert error ck-err">${icon('info')}<span>Lần gửi ${esc(x.triedAt)}: ${esc(x.err)}</span></div>` : ''}
        <div class="ginfo ck-dlg">${k.kv('Loại tin', esc(TYPES[x.ty].name))}${k.kv('Mã đối tượng', esc(x.code))}${k.kv('Nội dung', esc(x.title), 'full')}
          ${k.kv('Căn cứ', esc(x.doc))}${k.kv('Hệ thống đăng tải', esc(SYS[x.sys].name))}${k.kv('Hạn đăng tải', esc(x.due))}${k.kv('Tình trạng hạn', badge(...t))}
          ${k.kv('Nội dung gửi đi', esc(TYPES[x.ty].body), 'full')}</div>
        <div class="vfield" id="ck-f1"><label class="check"><input type="checkbox" id="ck-secret"> Đã rà soát và loại trừ tài liệu mật, bí mật Tập đoàn, thông tin an ninh – quốc phòng không được công bố</label>
          <p class="msg" hidden>Bạn cần xác nhận đã rà soát thông tin không được công bố.</p></div>`,
      actions: `<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="ck-ok">${resend ? 'Gửi lại' : 'Xác nhận đăng tải'}</button>` });
    m.el.querySelector('#ck-ok').onclick = () => {
      const ok = m.el.querySelector('#ck-secret').checked, f1 = m.el.querySelector('#ck-f1');
      f1.classList.toggle('invalid', !ok); f1.querySelector('.msg').hidden = ok;
      if (!ok) return;
      const now = `${TODAY} ${new Date().toTimeString().slice(0, 5)}`, n = ++U.seq;
      const ref = x.sys === 'DTQG' ? `IB26003${String(n).padStart(5, '0')}` : `VTB-2610-${String(200 + n).padStart(5, '0')}`;
      U.pub[id] = ['OK', now, ref, persona(Flow.state.persona).name];
      U.log.unshift([now, x.sys, 'Gửi đi', x.code, `Đăng tải ${TYPES[x.ty].name}${resend ? ' (gửi lại)' : ''}`, `Thành công · ${ref}`]);
      persist(); m.close();
      toast(`<b>Thành công</b><br>Đăng tải ${esc(TYPES[x.ty].name)} ${esc(x.code)} lên ${esc(SYS[x.sys].name)} thành công`);
      rerender();
    };
  }

  document.addEventListener('click', (e) => {
    const t = e.target;
    const tb = t.closest('[data-ck-tab]');
    if (tb) { TAB.v = tb.dataset.ckTab; rerender(); return; }
    const p = t.closest('[data-ck-pub]');
    if (p) { e.preventDefault(); e.stopImmediatePropagation(); pubDlg(p.dataset.ckPub); }
  });

  function reset() { U = { pub: {}, log: [], seq: 0 }; persist(); }
  /* Số liệu cho Báo cáo / Tổng quan: tin chờ, lỗi, quá hạn. */
  const stats = () => { const r = items(); return { total: r.length, wait: r.filter((x) => x.st !== 'OK').length, err: r.filter((x) => x.st === 'ERR').length,
    over: r.filter((x) => x.st !== 'OK' && /^Quá hạn/.test(timely(x)[0])).length, late: r.filter((x) => x.st === 'OK' && timely(x)[0] === 'Trễ hạn').length }; };
  window.CongKhai = { route, reset, items, stats, TYPES, SYS, addWork };
})();
