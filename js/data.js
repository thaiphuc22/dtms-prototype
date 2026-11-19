/*
 * Dữ liệu tĩnh của prototype ĐTMS.
 * Nguồn: docs/dtms/prototype-MS01-chuan-bi.md (persona §2.2, hồ sơ mẫu §2.3, cảnh §2.4, màn §4, điểm ❓ §6),
 *        menu theo 12 module Backlog (D-15, BA-TD), use-case-dtms.md, BPMN chuẩn ĐTMS.drawio / MS01 v1.1 (61 task, xem bpmn-tasks.js).
 * Tên người, đơn vị, nhà cung cấp đều hư cấu.
 */
(function () {
  const D = {};

  D.product = { code: 'ĐTMS', name: 'Hệ thống Đầu tư mua sắm' };

  /* ---------- Persona (§2.2) ---------- */
  D.personas = [
    { id: 'minh', name: 'Nguyễn Văn Minh', short: 'Minh', role: 'Chuyên quản ĐVĐX', unit: 'Trung tâm Vô tuyến', urd: 'R-DVDX-CQ', actor: 'A01' },
    { id: 'hai', name: 'Trần Đức Hải', short: 'Hải', role: 'Chỉ huy ĐVĐX', unit: 'Giám đốc Trung tâm Vô tuyến', urd: 'R-DVDX-CH', actor: 'A02' },
    { id: 'lan', name: 'Phạm Thị Lan', short: 'Lan', role: 'Chuyên viên TTMS', unit: 'Trung tâm Mua sắm', urd: 'R-TTMS', actor: 'A04' },
    { id: 'hoa', name: 'Lê Thanh Hòa', short: 'Hòa', role: 'Chuyên viên CQCM', unit: 'Ban Pháp chế', urd: 'R-CQCM', actor: 'A03' },
    { id: 'tung', name: 'Đỗ Mạnh Tùng', short: 'Tùng', role: 'Trưởng ban CQCM', unit: 'Ban Pháp chế', urd: 'R-CQCM-CH', actor: 'A03' },
    { id: 'thu', name: 'Vũ Hoài Thu', short: 'Thu', role: 'Chuyên viên Tài chính (CQCM)', unit: 'Ban Tài chính', urd: 'R-TC', actor: 'A05' },
    { id: 'quang', name: 'Bùi Minh Quang', short: 'Quang', role: 'Chuyên viên CQCM', unit: 'Phòng Chất lượng', urd: 'R-CQCM', actor: 'A03' },
    /* Review nhi 06/11 #40: thêm chuyên viên để chọn đích danh người thẩm định ở bước 16 (GIẢ LẬP P-224). */
    { id: 'ngatt', name: 'Trần Thị Nga', short: 'Nga', role: 'Chuyên viên CQCM', unit: 'Ban Pháp chế', urd: 'R-CQCM', actor: 'A03' },
    { id: 'hant', name: 'Nguyễn Thu Hà', short: 'Hà', role: 'Chuyên viên Tài chính (CQCM)', unit: 'Ban Tài chính', urd: 'R-TC', actor: 'A05' },
    { id: 'sonph', name: 'Phạm Hồng Sơn', short: 'Sơn', role: 'Chuyên viên CQCM', unit: 'Phòng Chất lượng', urd: 'R-CQCM', actor: 'A03' },
    { id: 'binh', name: 'Hoàng Quốc Bình', short: 'Bình', role: 'Phó Tổng Giám đốc', unit: 'Ban Giám đốc', urd: 'R-PTGD', actor: 'A22' },
    { id: 'tgd', name: 'Ngô Đình Khôi', short: 'TGĐ Khôi', role: 'Tổng Giám đốc VHT', unit: 'Ban Giám đốc', urd: 'R-TGD-VHT', actor: 'A06' },
    { id: 'qt', name: 'Đặng Thu Trang', short: 'Trang', role: 'Quản trị hệ thống', unit: 'Ban Công nghệ thông tin', urd: 'R-QTHT', actor: 'A21' },
    /* T17 (D-27): người thứ hai của vai trò để demo chọn nhiều người / thay người trong luồng mua sắm (phương án Gộp). */
    { id: 'ngoc', name: 'Phan Thị Ngọc', short: 'Ngọc', role: 'Chuyên quản ĐVĐX', unit: 'Trung tâm Vô tuyến', urd: 'R-DVDX-CQ', actor: 'A01' },
    { id: 'son', name: 'Lý Văn Sơn', short: 'Sơn', role: 'Chỉ huy ĐVĐX', unit: 'Phó Giám đốc Trung tâm Vô tuyến', urd: 'R-DVDX-CH', actor: 'A02' },
    { id: 'mai', name: 'Đinh Thị Mai', short: 'Mai', role: 'Chuyên viên TTMS', unit: 'Trung tâm Mua sắm', urd: 'R-TTMS', actor: 'A04' },
    /* T24 Q3: người được cấp một phần quyền Quản trị quy trình (SRS-QTQT 3.1.1.5) — không có QT03, QT05; Ma trận chỉ xem. */
    { id: 'qlqt', name: 'Cao Thị Hạnh', short: 'Hạnh', role: 'Người dùng quản trị quy trình', unit: 'Ban Công nghệ thông tin', urd: 'R-QTQT', actor: 'A21' },
    /* T25 D-51: vai của MS22, MS23.x, MS24. Nhà thầu không có tài khoản: bước của nhà thầu do Phòng Hợp đồng ghi nhận kết quả (D-50). */
    { id: 'phd', name: 'Trịnh Thị Yến', short: 'Yến', role: 'Chuyên viên Phòng Hợp đồng', unit: 'Phòng Hợp đồng', urd: 'R-DVMS', actor: '—' },
    { id: 'tphd', name: 'Mạc Văn Kiên', short: 'Kiên', role: 'Trưởng phòng Hợp đồng', unit: 'Phòng Hợp đồng', urd: 'R-DVMS-CH', actor: '—' },
    { id: 'dvsd', name: 'Tạ Quỳnh Anh', short: 'Quỳnh Anh', role: 'Chuyên viên Đơn vị sử dụng', unit: 'Nhà máy sản xuất thử nghiệm', urd: 'R-DVSD', actor: '—' },
    { id: 'qlts', name: 'Hà Văn Tiến', short: 'Tiến', role: 'Chuyên viên Phòng Quản lý tài sản', unit: 'Phòng Quản lý tài sản', urd: 'R-QLTS', actor: '—' },
    /* T29 B16 — DX-10 (D-83): Chỉ huy Kho duyệt rà soát (7.1); Thầu TTMS khởi tạo YCBG, tổng hợp báo giá (8, 10); Chỉ huy Thầu TTMS duyệt báo giá (10.1).
       Mã vai trò GIẢ LẬP P-210 — thật: danh mục Vai trò thực hiện đồng bộ từ BPMN khi BA vẽ lại (D-75). */
    { id: 'khoch', name: 'Lưu Văn Thắng', short: 'Thắng', role: 'Chỉ huy Kho (Trưởng phòng Quản lý tài sản)', unit: 'Phòng Quản lý tài sản', urd: 'R-QLTS-CH', actor: '—' },
    { id: 'thau', name: 'Ninh Thị Hồng', short: 'Hồng', role: 'Chuyên viên Thầu TTMS', unit: 'Trung tâm Mua sắm — Bộ phận Thầu', urd: 'R-TTMS-THAU', actor: '—' },
    { id: 'thauch', name: 'Phí Đức Long', short: 'Long', role: 'Chỉ huy Thầu TTMS', unit: 'Trung tâm Mua sắm — Bộ phận Thầu', urd: 'R-TTMS-THAU-CH', actor: '—' },
    { id: 'tckt', name: 'Kiều Thị Loan', short: 'Loan', role: 'Trưởng phòng Tài chính kế toán', unit: 'Phòng Tài chính kế toán', urd: 'R-TCKT', actor: '—' },
    { id: 'vthu', name: 'Dương Thị Nga', short: 'Nga', role: 'Văn thư', unit: 'Văn phòng', urd: 'R-VT', actor: '—' },
    /* Tài khoản demo toàn quyền (all): thấy mọi việc đang chờ, xử lý thay mọi vai, vào mọi màn quản trị. Không phải vai nghiệp vụ. */
    { id: 'admin', name: 'Tài khoản toàn quyền', short: 'Toàn quyền', role: 'Toàn quyền (demo)', unit: 'Tài khoản demo — không phải vai nghiệp vụ', urd: '—', actor: '—', all: true },
    { id: 'td', name: 'Ban ĐTXD Tập đoàn', short: 'Tập đoàn', role: 'Các Ban chuyên môn, Ban ĐTXD, TGĐ Tập đoàn (giả lập)', unit: 'Tập đoàn — không đăng nhập thật', urd: 'R-BAN-DTXD, R-TGD-TD', actor: 'A08', simulated: true },
  ];

  /* Vai có cờ all (Tài khoản toàn quyền) qua mọi kiểm tra quyền và thấy toàn bộ dữ liệu. */
  D.allAccess = (pid) => !!(D.personas.find((p) => p.id === pid) || {}).all;
  /* T24 Q3: mã quyền như BE my-permissions (workflow-management-permissions, action-matrix-permissions, GS00 của process-monitoring). Thật: IAM cấp theo vai trò. */
  const PERM_ALL = ['QT00', 'QT01', 'QT02', 'QT03', 'QT05', 'HTN00', 'HTN01', 'HTN02', 'HTN03', 'HTN04', 'HTN05', 'DMHS00', 'DMHD01', 'DMHD02', 'DTO00', 'DTO01', 'DTO02', 'DTO03', 'GS00'];
  D.perms = { qt: PERM_ALL, lan: ['GS00'],
    qlqt: ['QT00', 'QT01', 'QT02', 'HTN00', 'HTN01', 'HTN04', 'DMHS00', 'DMHD01', 'DMHD02', 'DTO00', 'DTO01', 'GS00'] };
  D.can = (pid, code) => D.allAccess(pid) || (D.perms[pid] || []).includes(code);
  /* Vai trò thực hiện (T17 D-27) = roleCode trong Candidate Users của task BPMN; mã vai trò lấy theo mã vai URD của persona.
     Người thuộc vai trò = persona cùng mã (thật: IAM người dùng theo vai trò); bỏ tài khoản toàn quyền và Tập đoàn giả lập. */
  D.roleOf = (pid) => (D.personas.find((p) => p.id === pid) || {}).urd || null;
  D.usersOfRole = (code) => D.personas.filter((p) => p.urd === code && !p.all && !p.simulated);

  /* CQCM tham gia góp ý hồ sơ mẫu. `doer` làm task 16/33/34/42, `signer` thông qua ở task 17. */
  D.cqcm = [
    { id: 'PC', unit: 'Ban Pháp chế', doer: 'hoa', signer: 'tung', doers: ['hoa', 'ngatt'] },
    { id: 'TC', unit: 'Ban Tài chính', doer: 'thu', signer: 'thu', doers: ['thu', 'hant'] },
    { id: 'CL', unit: 'Phòng Chất lượng', doer: 'quang', signer: 'quang', doers: ['quang', 'sonph'] },
  ];

  /* ---------- 5 giai đoạn theo nhãn trang MS01 v1.1 (dải task do nhóm suy ra từ vị trí trên sơ đồ) ---------- */
  D.stages = [
    { id: 1, name: 'Căn cứ • Tồn kho • Báo giá • Dự thảo', from: 1, to: 18, status: 'Đang lập dự thảo' },
    { id: 2, name: 'Góp ý CQCM • BM-04', from: 19, to: 25, status: 'Đang góp ý CQCM' },
    { id: 3, name: 'Hoàn chỉnh • Giải trình • Họp', from: 26, to: 34, status: 'Đang hoàn chỉnh & giải trình' },
    { id: 4, name: 'Rà soát lại • Checklist • BM-09 / BM-05', from: 35, to: 47, status: 'Đang thẩm định BM-05' },
    { id: 5, name: 'Báo cáo Tập đoàn • Quyết định phê duyệt', from: 48, to: 61, status: 'Báo cáo TĐ & phê duyệt' },
  ];
  /* Task của quy trình khác — hồ sơ không đi qua; timeline hiện "Không áp dụng". */
  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  D.notApplicable = { 'MS01.01': [11, 38, 39, 40], 'MS01.02': [11, 38, 39, 40].concat(range(49, 56)), 'MS01.03': [12].concat(range(41, 59)) };
  /* Ngưỡng KPI thẩm định (NLV, từ task 18 tới task 60): MS01.03 theo QT 10.2.1 — v1.1 không ghi (P-21). */
  D.kpiLimit = { 'MS01.01': 20, 'MS01.02': 20, 'MS01.03': 10 };

  /* Quy trình người dùng chọn khi tạo ĐXMS (SCR-25, chốt 2026-09-28). Khoảng giá trị lấy từ Ngưỡng phân luồng (D.dxmsRules);
     basis = phần điều kiện về căn cứ; basisGroup = căn cứ hiện ở task 1 (true: đã được CT/TGĐ TĐ duyệt, false: chưa, null: mọi loại).
     name là tên process definition trong BPMN, không đổi theo ngưỡng. */
  D.processes = {
    'MS01.01': { name: 'Phê duyệt ĐXMS ≥ 160 tỷ — căn cứ chưa được CT/TGĐ Tập đoàn phê duyệt', basis: 'căn cứ chưa được CT/TGĐ TĐ duyệt', basisGroup: false },
    'MS01.02': { name: 'Phê duyệt ĐXMS ≥ 160 tỷ — căn cứ đã được CT/TGĐ Tập đoàn phê duyệt', basis: 'căn cứ đã được CT/TGĐ TĐ duyệt (không gồm Kế hoạch SXKD năm)', basisGroup: true, noTypes: ['khsx'] },
    'MS01.03': { name: 'Phê duyệt ĐXMS < 160 tỷ', basis: 'mọi loại căn cứ', basisGroup: null },
  };
  /* Ngưỡng phân luồng ĐXMS: [từ, đến dưới) tỷ đồng → quy trình. Mặc định = 2 dòng ĐXMS của SCR-40 (§5.3); catalog.js thay bằng
     các ngưỡng đang hoạt động, đã có hiệu lực ở ngày `date`. Hồ sơ giữ bản chụp lúc tạo (P-34, Flow vars.th). */
  D.dxmsRules = () => [{ from: 0, to: 160, procs: ['MS01.03'] }, { from: 160, to: null, procs: ['MS01.01', 'MS01.02'] }];
  const tyNum = (n) => n.toLocaleString('vi-VN', { maximumFractionDigits: 2 });
  D.inRange = (process, total, rules) => rules.some((r) => r.procs.includes(process) && total >= r.from && (r.to == null || total < r.to));
  D.rangeText = (process, rules) => {
    const rs = rules.filter((r) => r.procs.includes(process));
    if (!rs.length) return 'chưa có ngưỡng';
    return rs.map((r) => (r.to == null ? `≥ ${tyNum(r.from)} tỷ` : r.from === 0 ? `< ${tyNum(r.to)} tỷ` : `${tyNum(r.from)} – dưới ${tyNum(r.to)} tỷ`)).join(' hoặc ');
  };
  /* Điều kiện hiển thị của quy trình (nhãn ở SCR-25, task 01, cổng kiểm tra khớp). */
  D.procCond = (process, rules) => `${D.rangeText(process, rules)} · ${(D.processes[process] || {}).basis || ''}`;
  /* Căn cứ hiện ở task 1 theo quy trình đã chọn. */
  D.basisFits = (process, doc) => {
    const p = D.processes[process];
    if (!p) return true;
    return (p.basisGroup == null || doc.group === p.basisGroup) && !(p.noTypes || []).includes(doc.type);
  };
  /* T29 B1 (D-54): một quy trình MS01 "Phê duyệt đề xuất mua sắm"; MS01.01 / .02 / .03 là luồng con (biến hồ sơ vars.process).
     subFlow: luồng con theo giá trị và cờ "Căn cứ đã được phê duyệt" (D-77) — lúc tạo luồng (giá trị dự kiến) và ở cổng sau bước 10 (Tổng giá trị).
     Không ngưỡng nào chứa giá trị (chưa nhập) → coi như từ ngưỡng. */
  D.mainProc = { code: 'MS01', name: 'Phê duyệt đề xuất mua sắm' };
  /* T29 B3a + B5 (D-82, thay hai lần của D-58): kết quả rà soát tồn kho do Phòng QLTS / Thủ kho (persona qlts) nhập MỘT lần theo cột biên bản BM-RSTK
     — việc ngoài sơ đồ ở Việc của tôi khi hồ sơ ở bước 7 (SCR-105). Mẫu: Mã hàng trong kho cho hạng mục quản lý tồn (stock != null); SL tồn kho = book (hoặc stock);
     SL xuất kho = min(tồn khả dụng, SL yêu cầu) với khả dụng = tồn − đang giữ cho ĐXMS khác (BR-DXMS-03-02); hợp đồng đầu vào, vị trí — GIẢ LẬP. t = đồng hồ demo (NLV). */
  D.rstkCode = (n) => 'VT-' + String(4100 + n * 37);
  D.rstkSample = (items, t) => ({
    kq: { t, by: 'qlts', rows: items.map((i) => {
      if (i.stock == null) return { n: i.n, code: '' };
      const stock = i.book != null ? i.book : i.stock, out = Math.min(Math.max(0, stock - (i.held || 0)), i.prop);
      return { n: i.n, code: D.rstkCode(i.n), maker: ['Keysight', 'Rohde & Schwarz', 'Anritsu', 'Keysight'][i.n % 4], stock, out, transfer: 0,
        cost: Math.round((i.price || 0) * 1e9 * 0.92), vat: Math.round((i.price || 0) * 1e9 * 0.092), contract: `HĐ-2025-${String(310 + i.n).padStart(4, '0')}`,
        origin: 'Nhiệm vụ gNodeB thế hệ 1', price: Math.round((i.price || 0) * 1e9 * 1.012), bin: `Thùng ${30 + i.n}` };
    }) },
    file: 'Bien-ban-kiem-dem-ton-kho.pdf',
  });
  D.subFlow = (total, basisTD, rules) => {
    const r = total == null || Number.isNaN(total) ? null : (rules || D.dxmsRules()).find((x) => total >= x.from && (x.to == null || total < x.to));
    if (r && r.procs.length === 1) return r.procs[0];
    return basisTD ? 'MS01.02' : 'MS01.01';
  };
  /* Nhãn Quy trình của hồ sơ MS01 (BR-DXMS-C-05): trước cổng sau bước 10 "MS01"; từ ngưỡng, chưa qua bước 48 ".0x (dự kiến)"; còn lại luồng con. */
  D.flowLabel = (v) => {
    if (!v || !v.process || D.familyOf(v.process) !== 'MS01') return v && v.process;
    if (!(v.checks || []).length) return D.mainProc.code;
    return v.big === false || v.reportTD != null ? v.process : `${v.process} (dự kiến)`;
  };
  /* Quy trình của loại hồ sơ Điều chỉnh (P-63: MS02 hiện là một quy trình, trang MS02 ver1.1 gộp MS02.01/.02/.03). */
  D.adjProcesses = { MS02: { name: 'Điều chỉnh đề xuất mua sắm', page: 'MS02 ver1.1' } };
  D.procName = (k) => ((D.processes[k] || D.adjProcesses[k] || {}).name || '');
  /* Loại hồ sơ của ĐXMS (D-10, như ProfileType XET_DUYET / DIEU_CHINH của KHCN) → các quy trình chọn được. */
  D.kinds = {
    PD: { label: 'Phê duyệt ĐXMS', procs: ['MS01.01', 'MS01.02', 'MS01.03'] },
    DC: { label: 'Điều chỉnh ĐXMS', procs: ['MS02'] },
  };
  D.kindOfProc = (k) => (D.adjProcesses[k] ? 'DC' : 'PD');
  /* Mã: ĐXMS tạo ở SCR-28 đầu tiên là 0117 (luồng demo); hồ sơ Phê duyệt đầu tiên giữ 4 số của ĐXMS (HS-2026-0117);
     [1] = hồ sơ mới của cùng ĐXMS tạo ở task 10b khi chuyển quy trình. */
  D.dxmsCode0 = 'ĐXMS-2026-0117';
  D.caseCodes = ['HS-2026-0117', 'HS-2026-0125'];

  /*
   * Điều hướng 61 task theo BPMN chuẩn ĐTMS.drawio / MS01 v1.1. Tên, actor, biểu mẫu lấy ở BPMN_TASKS; ở đây chỉ có phần prototype cần thêm:
   *  who     — persona xử lý ('cqcm:doer' | 'cqcm:signer' = theo CQCM của token)
   *  scr     — màn hình trong danh sách §4
   *  next    — task kế tiếp; choices — các nút hành động (main = nhánh chính của kịch bản demo;
   *            mainWhen(vars) = nhánh chính tuỳ trạng thái, dùng khi cùng một task được làm nhiều lần)
   *  fork    — tách token song song (also = thêm token khác vào cùng nhóm); join — chờ đủ token của nhóm
   *  gw      — cổng (không phải task BPMN): varGate / roundGate chọn nhánh; matchGate = cổng "Giá trị khớp quy trình đã chọn?"
 *  moves   — task hệ thống 10b: ghi hồ sơ mới (mã, quy trình đúng) trước khi kết thúc END_MOVED
   *  round   — task hệ thống tăng bộ đếm vòng giải trình
   *  sign    — hành động mở hộp thoại trình ký SCR-21; reason — bắt buộc nhập lý do
   *  small   — nhãn / văn bản ký thay thế khi hồ sơ đi nhánh < 160 tỷ (MS01.03); scrSmall — màn thay thế (Flow.choiceOf, Flow.scrOf)
   *  lockWhen(vars) — lý do khoá nút (nút vẫn hiện, không bấm được); mainWhen(vars, ui) — nhánh chính tuỳ trạng thái
   *  nlv     — số ngày làm việc giả lập tiêu tốn (dùng cho KPI)
   */
  /* T29 B16 — DX-10 (D-83, người dùng duyệt 05/11, chờ BA vẽ lại BPMN): lớp chồng lên BPMN MS01 v1.1. Bước mới mang khoá thập phân để giữ thứ tự số
     (engine, KPI, danh sách bước đọc số bước): 5.1 Chỉ huy ĐVĐX xác nhận khởi tạo (bỏ qua khi người khởi tạo là Chỉ huy ĐVĐX — vars.creatorCh),
     7.1 Chỉ huy Kho duyệt rà soát, 10.1 Chỉ huy Thầu TTMS duyệt báo giá, 16.1 Chỉ huy ĐVĐX duyệt BM-03 + danh sách CQCM (cách B: dự thảo 11 / 12 → 13 → 16 → 16.1 → 17).
     Bước 7 đổi tác nhân thành Chuyên quản Kho (SCR-105 vào sơ đồ), 8 / 10 thành Thầu TTMS, 9 = TTMS gửi YCBG. Mọi bước chỉ huy duyệt trên ĐTMS (Duyệt / Trả lại có lý do). */
  D.dx10 = { after: { 5: '5.1', 7: '7.1', 10: '10.1', 16: '16.1' } };
  const DX10_NOTE = 'Bước mới theo DX-10 (người dùng duyệt 05/11/2026) — chưa có trên BPMN MS01 v1.1, chờ BA vẽ lại.';
  const DX10_TASKS = {
    '5.1': { name: 'Chỉ huy ĐVĐX xác nhận khởi tạo', actor: 'Chỉ huy Đơn vị đề xuất mua sắm', type: 'user', form: 'Không có mẫu riêng', old: '', dx: 'DX-10', note: `Xác nhận nội dung khởi tạo, danh mục bóc tách trước khi gửi Kho rà soát tồn kho. Bỏ qua khi người khởi tạo là Chỉ huy ĐVĐX. ${DX10_NOTE}` },
    '7.1': { name: 'Chỉ huy Kho duyệt kết quả rà soát tồn kho', actor: 'Chỉ huy Kho (Phòng Quản lý tài sản)', type: 'user', form: 'Biên bản rà soát tồn kho (BM-RSTK)', old: '', dx: 'DX-10', note: `Duyệt kết quả rà soát và biên bản; trả lại thì Kho rà soát lại. ${DX10_NOTE}` },
    '10.1': { name: 'Chỉ huy Thầu TTMS duyệt kết quả báo giá', actor: 'Chỉ huy Thầu (Trung tâm Mua sắm)', type: 'user', form: 'Không có mẫu riêng', old: '', dx: 'DX-10', note: `Duyệt báo giá tổng hợp và cơ sở giá; trả lại thì Thầu tổng hợp lại. ${DX10_NOTE}` },
    '16.1': { name: 'Chỉ huy ĐVĐX duyệt BM-03 và danh sách CQCM', actor: 'Chỉ huy Đơn vị đề xuất mua sắm', type: 'user', form: 'BM-03', old: '', dx: 'DX-10', note: `Duyệt Phiếu yêu cầu thẩm định và các bên CQCM trước khi TTMS kiểm danh sách. ${DX10_NOTE}` },
  };
  if (window.BPMN_TASKS) {
    Object.assign(window.BPMN_TASKS, DX10_TASKS);
    const re = (k, actor) => { if (window.BPMN_TASKS[k]) window.BPMN_TASKS[k] = Object.assign({}, window.BPMN_TASKS[k], { actor, dxActor: 'DX-10' }); };
    re('7', 'Chuyên quản Kho (Phòng Quản lý tài sản)'); re('8', 'Thầu (Trung tâm Mua sắm)'); re('9', 'Hệ thống — gửi YCBG của Thầu TTMS'); re('10', 'Thầu (Trung tâm Mua sắm)');
  }
  /* Khoá bước theo thứ tự (số 1…last, chèn bước DX-10 sau bước gốc). */
  D.stepKeys = (last) => { const out = []; for (let n = 1; n <= last; n++) { out.push(n); if (D.dx10.after[n]) out.push(D.dx10.after[n]); } return out; };
  const approve = (who, scr, ok, back, okLabel, backLabel) => ({ who, scr, nlv: 0.5, choices: [{ label: okLabel || 'Duyệt', to: ok, main: true }, { label: backLabel || 'Trả lại', to: back, kind: 'danger', reason: true }] });
  /* Review nhi 06/11 #2, #3: bước 10 không so sánh / đánh giá báo giá trên hệ thống (Thầu làm ngoài hệ thống) — Thầu chỉ tải tệp báo giá của các NCC
     và nhập giá trị báo giá cuối cùng. Cờ tạm ẩn card Đánh giá báo giá và cơ sở giá (T29 B3b / B4 P1) và kiểm tra AI báo giá (DX-03); false = bật lại. */
  D.quoteManual = true;
  /* Review nhi 06/11 #18 (GIẢ LẬP P-223): tạm ẩn bảng AI bước 6 Bóc tách và đối chiếu trong popup của màn Lập ĐXMS; bật lại bằng D.bocHide = false. */
  D.bocHide = true;

  const F = {
    1: { who: 'minh', scr: 'SCR-03', next: 2, nlv: 0.5 },
    2: { next: 3 },
    3: { next: 4 },
    4: { who: 'minh', scr: 'SCR-04', next: 5, nlv: 0.5 },
    5: { who: 'minh', scr: 'SCR-05', nlv: 1, choices: [
      /* T29 Q5: Xác nhận danh mục = gửi danh mục sang Bộ phận Kho / QLTS rà soát tồn kho (service task 06). */
      { label: 'Gửi rà soát tồn kho', to: 'g5', main: true, set: { basisOk: true } },
      { label: 'Thiếu thông tin căn cứ', to: 6, kind: 'secondary', set: { basisOk: false } }] },
    /* DX-10 (b): người khởi tạo là Chỉ huy ĐVĐX → bỏ qua 5.1. */
    g5: { gw: true, when: (v) => (v.creatorCh ? 6 : '5.1') },
    '5.1': approve('hai', 'SCR-05', 6, 5, 'Xác nhận khởi tạo'),
    6: { varGate: { basisOk: { true: 7, false: 4 } } },
    /* DX-10 (c), (d): Kho rà soát tồn kho trên sơ đồ (SCR-105), Chỉ huy Kho duyệt. */
    /* Review nhi 06/11 #21, #31–33: nút mở thẳng màn SCR-105 (page), nhập trên màn; Gửi = hoàn thành bước, không còn nút Hoàn thành riêng. */
    /* T59 #54, C0 (D-114 Q4): không còn màn riêng SCR-105 — Kho nhập ở tab Rà soát tồn kho của màn xử lý việc bước 7 (mở sẵn tab này);
       nút đóng việc "Gửi Chỉ huy Kho" theo luật hiển thị như mọi bước (kiểm dữ liệu của tab khi bấm — RaSoatKho.submit).
       [T59] trước: actionLabel: 'Cập nhật kết quả rà soát', page: 'ra-soat-kho' (nút mở màn riêng). */
    7: { who: 'qlts', scr: 'SCR-06', next: '7.1', nlv: 1, actionLabel: 'Gửi Chỉ huy Kho', tab: 'ton-kho' },
    '7.1': approve('khoch', 'SCR-06', 8, 7),
    /* DX-10 (e): Thầu TTMS khởi tạo YCBG, hệ thống gửi (9), Thầu tổng hợp báo giá (10); không đạt → YCBG mới. */
    8: { who: 'thau', scr: 'SCR-07', next: 9, nlv: 0.5, actionLabel: 'Tạo yêu cầu báo giá' },
    9: { next: 10 },
    10: { who: 'thau', scr: 'SCR-07', nlv: 3, choices: [
      { label: 'Báo giá đạt', to: 'gQuote', main: true },
      /* DX-10 (e), review Huylx4 #27: không đạt → Thầu tạo YCBG mới (về bước 8). */
      /* Review nhi 06/11 #7: Không đạt nhập lý do (dialog nhận xét), không mở form báo giá. */
      { label: 'Không đạt — tạo YCBG mới', to: 8, kind: 'secondary', reason: true }] },
    /* DX-03 (duyệt 2026-10-07, chờ BA): cổng "Báo giá đạt?" đọc thêm kết quả AI kiểm tra báo giá (vars.quoteAi, ghi trước khi hoàn thành task 10).
       DX-10 (f): đạt → Chỉ huy Thầu TTMS duyệt (10.1) rồi mới tới cổng Giá trị. */
    gQuote: { gw: true, when: (v) => (v.quoteAi === false ? 9 : '10.1') },
    /* Review nhi 06/11 #7: Chỉ huy Thầu phê duyệt kết quả báo giá — Đồng ý / Từ chối (Từ chối về bước Thầu tổng hợp). */
    '10.1': approve('thauch', 'SCR-07', 'gValue', 10, 'Đồng ý', 'Từ chối'),
    /* T29 B1 (D-54): cổng "Giá trị?" của v1.1 — một quy trình MS01, hệ thống đặt luồng con theo Tổng giá trị và ngưỡng hồ sơ giữ:
       .03 → 11; ≥ ngưỡng → 12 (.01 / .02 dự kiến theo "Căn cứ đã được phê duyệt", chốt ở bước 48). Không còn 10a / 10b. */
    gValue: { gw: true, matchGate: { big: 12, small: 11 } },
    11: { who: 'minh', scr: 'SCR-08', next: 13, nlv: 2, actionLabel: 'Soạn thảo tờ trình ĐXMS' },
    12: { who: 'minh', scr: 'SCR-08', next: 13, nlv: 2, actionLabel: 'Soạn thảo tờ trình ĐXMS' },
    13: { who: 'hai', scr: 'SCR-09', nlv: 0.5, choices: [
      { label: 'Đồng ý', to: 15, main: true },
      { label: 'Không đồng ý', to: 14, kind: 'danger', reason: true }] },
    14: { varGate: { big: { true: 12, false: 11 } } },
    15: { next: 16 },
    16: { who: 'minh', scr: 'SCR-10', next: '16.1', nlv: 0.5, actionLabel: 'Lập phiếu yêu cầu thẩm định' },
    /* DX-10 (g), (h): Chỉ huy ĐVĐX duyệt BM-03 + danh sách CQCM trước khi TTMS kiểm (17). */
    /* T54 (SRS 21 V0.4, SRS 32 B0 K5): BM-03 trình ký ở 16.1 khi Chỉ huy ĐVĐX phê duyệt (TKV-MS01-16_1-BM03); bước 18 không tự trình nữa. */
    '16.1': (() => { const a = approve('hai', 'SCR-10', 17, 16, 'Phê duyệt phiếu yêu cầu thẩm định'); a.choices[0].sign = 'BM-03'; return a; })(),
    /* BPMN v1.1: bước 17 TTMS chỉ kết luận danh sách CQCM (Đồng ý → 18, Từ chối → 16); gửi yêu cầu + trình ký BM-03 là service task 18 của hệ thống (P-225). */
    17: approve('lan', 'SCR-22', 18, 16, 'Đồng ý', 'Từ chối'),
    /* DX-12 (D-100, duyệt tạm 09/11, chờ BA): 19–22 chạy riêng từng CQCM (multi-instance), 23 gộp khi đủ BM-04 đã ký. */
    18: { fork: 'cqcm', to: 19, kpiStart: true },
    19: { who: 'cqcm:doer', scr: 'SCR-11', next: 20, nlv: 1, actionLabel: 'Hoàn thành phiếu, trình chỉ huy' },
    20: { who: 'cqcm:signer', scr: 'SCR-11', nlv: 0.5, choices: [
      { label: 'Đồng ý & trình ký BM-04', to: 22, main: true, sign: 'BM-04' },
      { label: 'Không đồng ý', to: 21, kind: 'danger', reason: true }] },
    21: { next: 19 },
    22: { next: 23 },
    23: { join: 'cqcm', next: 24 },
    24: { next: 25 },
    25: { next: 26 },
    /* DX-02 (duyệt 2026-10-07, chờ BA): một nút "Hoàn thành"; gateway rẽ nhánh theo biến coBaoLuu (bảng quyết định trong eForm task 26). */
    26: { who: 'minh', scr: 'SCR-12', nlv: 0.5, next: 'g26', actionLabel: 'Hoàn thành' },
    g26: { gw: true, when: (v, u) => (v.round === 0 && D.keepAny(u) ? 28 : 27) },
    27: { who: 'minh', scr: 'SCR-13', nlv: 1, next: 'fork35', actionLabel: 'Gửi hồ sơ hoàn chỉnh cho CQCM' },
    28: { who: 'minh', scr: 'SCR-13', next: 29, nlv: 0.5, actionLabel: 'Gửi giải trình' },
    29: { round: true, next: 'gRound' },
    gRound: { gw: true, roundGate: { over: 30, under: 13 } },
    30: { next: 31 },
    31: { who: 'lan', scr: 'SCR-14', next: 32, nlv: 1, actionLabel: 'Đã tổ chức họp' },
    32: { who: 'lan', scr: 'SCR-14', nlv: 0.5, choices: [
      { label: 'Đã thống nhất', to: 27, main: true },
      { label: 'Chưa thống nhất — trình cấp cao hơn', to: 33, kind: 'secondary' }] },
    33: { who: 'lan', scr: 'SCR-14', next: 34, nlv: 0.25 },
    34: { who: 'tgd', scr: 'SCR-14', nlv: 1, choices: [
      { label: 'Thống nhất phương án', to: 27, main: true, reason: true },
      /* DX-15 (D-100): về 14 rồi rẽ 11 / 12 theo giá trị (bản vẽ v1.1 luôn về 12). */
      { label: 'Yêu cầu xử lý lại', to: 14, kind: 'secondary', reason: true }] },
    /* DX-13 (D-100): 35–37 theo từng CQCM; một CQCM Chưa đạt hủy cả lượt (cancelGroup) → 27. */
    fork35: { gw: true, fork: 'cqcm', to: 35 },
    35: { who: 'cqcm:doer', scr: 'SCR-15', nlv: 0.5, choices: [
      { label: 'Đạt', to: 36, main: true },
      { label: 'Chưa đạt', to: 27, kind: 'danger', reason: true, cancelGroup: true }] },
    36: { who: 'cqcm:doer', scr: 'SCR-15', nlv: 0.25, choices: [
      { label: 'Xác nhận ký BM-04 & Checklist 01', to: 37, main: true, sign: 'BM-04 + Checklist 01',
        small: { label: 'Xác nhận ký BM-04 & Checklist 02', sign: 'BM-04 + Checklist 02' } }] },
    37: { join: 'cqcm', varGate: { big: { true: 41, false: 'fork38' } } },
    /* Nhánh < 160 tỷ (MS01.03): TTMS ‖ Phó TGĐ ký thẳng trên BM-09 (SCR-23), chờ đủ hai kết quả ở task 40 (P-20).
       DX-14 (D-100, GIẢ LẬP Q03): một bên Không đồng ý → trả về 25 ngay, hủy việc ký còn lại (cancelGroup); 46 ‖ 47 cũng vậy. */
    fork38: { gw: true, forkTo: [{ task: 38, who: 'lan' }, { task: 39, who: 'binh' }], group: 'bm09' },
    38: { who: 'lan', scr: 'SCR-23', nlv: 1, choices: [
      { label: 'Ký thẩm định BM-09', to: 40, main: true, sign: 'BM-09' },
      { label: 'Không đồng ý', to: 25, kind: 'danger', reason: true, cancelGroup: true }] },
    39: { who: 'binh', scr: 'SCR-23', nlv: 1, choices: [
      { label: 'Ký thẩm định BM-09', to: 40, main: true, sign: 'BM-09' },
      { label: 'Không đồng ý', to: 25, kind: 'danger', reason: true, cancelGroup: true }] },
    40: { join: 'bm09', next: 60 },
    41: { next: 42 },
    42: { who: 'lan', scr: 'SCR-16', nlv: 0.75, choices: [
      { label: 'Hoàn tất rà soát BM-05', to: 43, main: true },
      { label: 'Hồ sơ chưa đạt — trả đơn vị', to: 25, kind: 'danger', reason: true }] },
    43: { who: 'lan', scr: 'SCR-16', nlv: 0.25, q: ['P-10'], choices: [
      { label: 'Xác nhận đủ điều kiện & ký BM-05 (TTMS)', to: 44, main: true, sign: 'BM-05' }] },
    44: { next: 45 },
    45: { fork: 'cqcm', to: 46, also: [{ task: 47, who: 'binh' }] },
    46: { who: 'cqcm:doer', scr: 'SCR-17', nlv: 0.5, choices: [
      { label: 'Ký BM-05', to: 'j47', main: true, sign: 'BM-05' },
      { label: 'Không đồng ý', to: 25, kind: 'danger', reason: true, cancelGroup: true }] },
    47: { who: 'binh', scr: 'SCR-17', nlv: 0.5, choices: [
      { label: 'Đồng ý, ký BM-05', to: 'j47', main: true, sign: 'BM-05' },
      { label: 'Không đồng ý', to: 25, kind: 'danger', reason: true, cancelGroup: true }] },
    j47: { gw: true, join: 'cqcm', next: 48 },
    48: { who: 'lan', scr: 'SCR-16', nlv: 0.25, choices: [
      /* T29 B1 (D-54, D-77, RV-PROTO-0511 câu 3): TTMS chọn; chọn sẵn theo "Căn cứ đã được phê duyệt" của luồng (vars.basisTD). Chọn = chốt luồng con .01 / .02. */
      { label: 'Có báo cáo TGĐ Tập đoàn', to: 'gReport', mainWhen: (v) => !v.basisTD, set: { reportTD: true, process: 'MS01.01' } },
      { label: 'Không báo cáo TGĐ Tập đoàn', to: 'gReport', kind: 'secondary', mainWhen: (v) => !!v.basisTD, set: { reportTD: false, process: 'MS01.02' } }] },
    gReport: { gw: true, varGate: { reportTD: { true: 49, false: 57 } } },
    49: { next: 50 },
    50: { who: 'lan', scr: 'SCR-18', next: 51, nlv: 0.5 },
    51: { who: 'tgd', scr: 'SCR-18', nlv: 0.5, choices: [
      { label: 'Đồng ý trình ký BM-06', to: 52, main: true, sign: 'BM-06' },
      { label: 'Không đồng ý', to: 25, kind: 'danger', reason: true }] },
    52: { next: 53 },
    53: { who: 'td', scr: 'SCR-18', nlv: 1.5, choices: [
      { label: 'Chấp nhận hồ sơ, lập BM-07', to: 54, main: true },
      { label: 'Trả lại', to: 25, kind: 'danger', reason: true }] },
    54: { who: 'td', scr: 'SCR-18', next: 55, nlv: 0.5 },
    55: { who: 'td', scr: 'SCR-18', next: 56, nlv: 0.25 },
    56: { who: 'td', scr: 'SCR-18', nlv: 1.5, q: ['P-13'], choices: [
      { label: 'TGĐ Tập đoàn đồng ý', to: 57, main: true },
      { label: 'Trả lại', to: 25, kind: 'danger', reason: true }] },
    57: { next: 58 },
    58: { who: 'lan', scr: 'SCR-19', next: 59, nlv: 0.5 },
    59: { who: 'lan', scr: 'SCR-19', nlv: 0.25, choices: [{ label: 'Trình phê duyệt', to: 60, main: true }] },
    60: { who: 'tgd', scr: 'SCR-19', scrSmall: 'SCR-24', nlv: 1, kpiEnd: true, choices: [
      { label: 'Phê duyệt', to: 61, main: true, sign: 'BM-08', small: { sign: 'BM-09' } },
      { label: 'Yêu cầu hoàn chỉnh', to: 25, kind: 'secondary', reason: true },
      { label: 'Chỉ đạo khác — kết thúc', to: 'END_OTHER', kind: 'danger', reason: true }] },
    61: { next: 'END' },
  };
  D.flow = F;

  /*
   * Luồng MS13 bản 12/10 (T18, BPMN-DTMS `ĐTMS-121026.drawio` trang MS13, DG-MS13; mũi tên trong BPMN_FLOWS.MS13 — 78 bước, 36 cổng).
   * Cấp VHT dựng đủ (D-35 giữ D-8): nhánh gộp BM-00 (18–24 → khối chung → 61–62) và hai giai đoạn BM-01 (39–48) → BM-03 (49–60).
   * Khối kiểm tra – thẩm định – giải trình – họp 25–38 là khối CHUNG theo vòng (D-32, không còn quy trình con 41 / 49): vào từ 24 / 45 / 54,
   * vòng = vars.td (GOP = BM-00, CT = BM-01, KDT = BM-03); bộ đếm chk / meet theo vòng; G12 / G16 đọc vòng để quay về / đi tiếp đúng nhánh.
   * Bước 13 (service) ghi cấp duyệt chủ trương / KĐT từ danh mục Phân cấp thẩm quyền KĐT (SCR-100, D-33); G23 / G27 / G30 tính lại rồi rẽ VHT / Tập đoàn.
   * Tuyến Tập đoàn 63–74 (T18 B4, người dùng mở D-8 12/10): cổng cấp duyệt ra Tập đoàn ghi loại hồ sơ trình (vars.tdKind = CT / KDT / GOP) → 63 AI dự thảo công văn
   * → 64 → 65 TGĐ VHT ký công văn → 66 chuyển → 67 các Ban Tập đoàn nhận xét → 68 tiếp thu → 69 ký trình lại → 70 Ban ĐTXD kiểm tra → G34 chủ trương riêng? 71 : 72
   * → 73 TGĐ Tập đoàn ký → 74 lưu kết quả → G36 chủ trương → 49 lập hồ sơ KĐT; KĐT / gộp → kết thúc. Khối ký chung 75–78 (D-34): nút `sign` của bước ký (P-91) đi qua khối
   * (Flow kySign: G1 Mật → 77; không Mật → 75 → G2 → 76 VOffice | 77 → 78; G3 về đích của nút — vars.ky.to).
   * Khoá như D.flow, thêm:
   *  when(vars, ui) — cổng chọn nhánh theo biến / lựa chọn trên màn
   *  run(vars, ui)  — việc của hệ thống khi đi qua cổng (đọc kết quả kiểm tra giả lập trên ui rồi xoá, để lượt sau không lặp)
   *  td          — mở vòng thẩm định (45 = CT, 54 = KDT; vòng GOP mở ở bước 24, cổng gộp G10 đặt sẵn vòng của nhánh)
   *  bump        — tăng bộ đếm của vòng (chk = lượt ĐVĐX bổ sung / giải trình ở bước 31, meet = lần họp ở bước 33)
   *  auth        — bước 13: xác định thẩm quyền (Flow.kdtAuth) · capGate — cổng cấp duyệt (CT / KDT / GOP) tính lại thẩm quyền rồi rẽ
   *  groupGate   — cổng "Tổng mức vốn thực tế thuộc MS13?" (Flow.kdtCheck: ghi Nhóm KĐT + nhánh hồ sơ dự kiến)
   *  mergeGate   — cổng "Đủ 03 điều kiện lập hồ sơ gộp BM-00?" (ghi nhánh hồ sơ, vòng)
   *  wip         — bước chưa dựng: token đứng yên, không có nút hành động, tua nhanh dừng ở đây (MS13 bản 12/10 không còn bước nào)
   *  tdResult    — 74 nhận kết quả phê duyệt Tập đoàn: ghi văn bản đã ký theo loại hồ sơ trình (vars.tdDocs)
   *  vo          — 76 gửi VOffice (service; lỗi gửi giả lập → token chờ Gửi lại) · kyReturn — G3 trở về bước ký của luồng chính
   */
  const K = {
    1: { who: 'minh', scr: 'SCR-03', next: 2, nlv: 0.5 },
    2: { next: 3 },
    3: { next: 4 },
    4: { who: 'minh', scr: 'SCR-04', next: 5, nlv: 0.5 },
    5: { who: 'minh', scr: 'SCR-05', nlv: 1, choices: [
      { label: 'Xác nhận danh mục', to: 6, main: true, set: { basisOk: true } },
      { label: 'Thiếu thông tin căn cứ', to: 6, kind: 'secondary', set: { basisOk: false } }] },
    /* 6 Kiểm tra tồn kho (service) → G4 "Đủ thông tin căn cứ?". */
    6: { varGate: { basisOk: { true: 7, false: 4 } } },
    7: { who: 'minh', scr: 'SCR-06', next: 8, nlv: 1 },
    8: { who: 'minh', scr: 'SCR-07', next: 9, nlv: 0.5 },
    9: { next: 10 },
    10: { who: 'minh', scr: 'SCR-07', nlv: 3, choices: [
      { label: 'Chốt tổng mức vốn, gửi xác nhận', to: 'g5', main: true, set: { quoteOk: true } },
      { label: 'Báo giá chưa đạt yêu cầu', to: 'g5', kind: 'secondary', reason: true, set: { quoteOk: false } }] },
    /* G5 "Báo giá đạt yêu cầu?" (bản 12/10 đặt ngay sau 10): lựa chọn ở bước 10 và kết quả AI kiểm tra báo giá (vars.quoteAi, DX-03). */
    g5: { gw: true, when: (v) => (v.quoteOk && v.quoteAi !== false ? 'g6' : 8) },
    /* G6 AND: Ban Tài chính xác nhận TSCĐ (11) ‖ TTMS xác nhận 04 yếu tố (12); G7 chờ đủ hai kết quả; G8 "Cả 02 xác nhận đều OK?". */
    g6: { gw: true, forkTo: [{ task: 11, who: 'thu' }, { task: 12, who: 'lan' }], group: 'xn' },
    11: { who: 'thu', scr: 'SCR-57', nlv: 1, choices: [
      { label: 'Xác nhận OK', to: 'g7', main: true, set: { tscdOk: true } },
      { label: 'Không OK', to: 'g7', kind: 'danger', reason: true, set: { tscdOk: false } }] },
    12: { who: 'lan', scr: 'SCR-58', nlv: 1, choices: [
      { label: 'Xác nhận OK', to: 'g7', main: true, set: { factorsOk: true } },
      { label: 'Không OK', to: 'g7', kind: 'danger', reason: true, set: { factorsOk: false } }] },
    g7: { gw: true, join: 'xn', next: 'g8' },
    g8: { gw: true, when: (v) => (v.tscdOk && v.factorsOk ? 13 : 14) },
    /* 13 Xác định thẩm quyền phê duyệt (service, D-33) → G9 "Tổng mức vốn thực tế thuộc MS13?". */
    13: { auth: true, next: 'g9' },
    14: { next: 10 },
    g9: { gw: true, groupGate: { yes: 15, no: 'X_MS14' } },
    /* G9 "Không thuộc MS13" → "Chuyển xử lý theo MS14 / MS15": kết thúc hồ sơ MS13 "Đã chuyển luồng", hồ sơ mới của cùng KĐT theo nhóm đúng (P-53). */
    X_MS14: { gw: true, moves: true, next: 'END_MOVED' },
    15: { who: 'minh', scr: 'SCR-59', next: 16, nlv: 2, actionLabel: 'Hoàn thành dự thảo' },
    16: { next: 17 },
    17: { who: 'minh', scr: 'SCR-59', next: 'g10', nlv: 1, actionLabel: 'Hoàn thiện đề xuất' },
    g10: { gw: true, mergeGate: { yes: 18, no: 39 } },
    /* BM-00: AI dự thảo (18) → lập (19) → xin ý kiến Chỉ huy (20, 21 — không có nhánh trả lại, P-92) → chọn CQCM (22) → CQCM chủ trì xác nhận DS (23)
       → Chỉ huy ký phiếu yêu cầu thẩm định, mở vòng BM-00 (24). */
    18: { next: 19 },
    19: { who: 'minh', scr: 'SCR-59', next: 20, nlv: 1, actionLabel: 'Hoàn thành dự thảo BM-00' },
    20: { who: 'minh', scr: 'SCR-59', next: 21, nlv: 0.5, actionLabel: 'Gửi xin ý kiến Chỉ huy' },
    21: { who: 'hai', scr: 'SCR-59', next: 22, nlv: 1, actionLabel: 'Gửi ý kiến cho đơn vị' },
    22: { who: 'minh', scr: 'SCR-60', next: 23, nlv: 0.5, actionLabel: 'Gửi danh sách CQCM' },
    23: { who: 'lan', scr: 'SCR-60', nlv: 1, choices: [
      { label: 'Đồng ý danh sách CQCM', to: 24, main: true },
      { label: 'Không đồng ý — chọn lại', to: 22, kind: 'danger', reason: true }] },
    24: { who: 'hai', scr: 'SCR-21', nlv: 0.5, choices: [
      { label: 'Ký phiếu yêu cầu thẩm định', to: 'g13', main: true, sign: 'Phiếu yêu cầu thẩm định', set: { td: 'GOP' } }] },
    /* Khối chung 25–38 (D-32). G13 "Hồ sơ đủ điều kiện thẩm định?" — kiểm tra của hệ thống khi mở vòng (giả lập: ui.inc[vòng] đặt từ Công cụ demo / nhánh phụ). */
    g13: { gw: true, run: (v, u) => { const k = v.td || 'GOP'; v.inc = !!(u.inc && u.inc[k]); if (v.inc) delete u.inc[k]; }, when: (v) => (v.inc ? 25 : 27) },
    25: { next: 26 },
    26: { who: 'minh', scr: 'SCR-62', next: 'g12', nlv: 1, actionLabel: 'Đã sửa hồ sơ' },
    /* G12 "Hồ sơ cần sửa thuộc vòng nào?" → chọn lại CQCM đúng vòng. */
    g12: { gw: true, when: (v) => ({ GOP: 22, CT: 41, KDT: 52 })[v.td || 'GOP'] },
    27: { who: 'lan', scr: 'SCR-61', next: 'g14', nlv: 1, actionLabel: 'Hoàn thành thẩm định' },
    /* G14 "Cần ý kiến CQCM liên quan?" = đã chọn CQCM phối hợp (bước 22 / 41 / 52). */
    g14: { gw: true, when: () => (window.Flow.cqcmSel().length ? 28 : 'g15') },
    28: { fork: 'cqcm', to: 29 },
    29: { who: 'cqcm:doer', scr: 'SCR-61', next: 'j29', nlv: 1, actionLabel: 'Gửi ý kiến thẩm định' },
    j29: { gw: true, join: 'cqcm', next: 'g15' },
    g15: { gw: true, when: (v, u) => (D.kdtNeedFix(v, u) ? 30 : 'g16') },
    /* G16 "Hồ sơ đã thống nhất thuộc vòng nào?": BM-01 → 46, BM-03 → 55, BM-00 → G30 cấp duyệt hồ sơ gộp. */
    g16: { gw: true, when: (v) => ({ GOP: 'g30', CT: 46, KDT: 55 })[v.td || 'GOP'] },
    30: { next: 31 },
    /* G17 "Đã thống nhất nội dung?": ĐVĐX bổ sung toàn bộ → thống nhất, thẩm định lại (27); còn giải trình, bảo lưu → chưa. */
    31: { who: 'minh', scr: 'SCR-62', nlv: 1, bump: 'chk', choices: [
      { label: 'Bổ sung hồ sơ theo ý kiến', to: 'g17', set: { agreed: true, directed: false }, mainWhen: (v) => !!v.directed || !D.kdtCnt(v, 'chk') },
      { label: 'Giải trình, bảo lưu ý kiến', to: 'g17', kind: 'secondary', set: { agreed: false, directed: false }, mainWhen: (v) => !v.directed && D.kdtCnt(v, 'chk') > 0 }] },
    g17: { gw: true, when: (v) => (v.agreed ? 27 : 'g18') },
    /* G18 "Vòng hiện tại đã họp dưới 02 lần?" — đếm riêng mỗi vòng, giữ khi bổ sung / trình lại. */
    g18: { gw: true, when: (v) => (D.kdtCnt(v, 'meet') < 2 ? 32 : 37) },
    32: { who: 'lan', scr: 'SCR-62', nlv: 1, choices: [
      { label: 'Đã thống nhất sau họp', to: 33, main: true, set: { meetOk: true } },
      { label: 'Chưa thống nhất', to: 33, kind: 'secondary', reason: true, set: { meetOk: false } }] },
    33: { bump: 'meet', next: 'g19' },
    g19: { gw: true, when: (v) => (v.meetOk ? 34 : 'g18') },
    34: { who: 'minh', scr: 'SCR-62', next: 35, nlv: 0.5, actionLabel: 'Xác nhận nội dung điều chỉnh' },
    35: { who: 'hai', scr: 'SCR-62', next: 36, nlv: 0.5, actionLabel: 'Xác nhận, cho phép cập nhật hồ sơ' },
    36: { who: 'minh', scr: 'SCR-62', next: 27, nlv: 1, actionLabel: 'Cập nhật hồ sơ, gửi thẩm định lại' },
    37: { who: 'lan', scr: 'SCR-62', next: 38, nlv: 0.5, actionLabel: 'Gửi báo cáo Thủ trưởng' },
    38: { who: 'tgd', scr: 'SCR-62', nlv: 1, choices: [
      { label: 'Kết luận, chỉ đạo xử lý tiếp', to: 31, main: true, reason: true, set: { directed: true } },
      { label: 'Chỉ đạo dừng', to: 'END_OTHER', kind: 'danger', reason: true }] },
    /* BM-01: lập tờ trình + Checklist 01 (39), kiểm tra (40), chọn CQCM (41), CQCM chủ trì xác nhận DS (42), trình (43),
       HT/AI kiểm tra (44 → G22: Không đạt → 39, giả lập ui.ai44Fail — P-62), mở vòng BM-01 (45). */
    39: { who: 'minh', scr: 'SCR-59', next: 40, nlv: 2, actionLabel: 'Hoàn thành tờ trình chủ trương' },
    40: { who: 'minh', scr: 'SCR-59', next: 41, nlv: 0.5, actionLabel: 'Xác nhận hồ sơ đủ điều kiện trình' },
    41: { who: 'minh', scr: 'SCR-60', next: 42, nlv: 0.5, actionLabel: 'Gửi danh sách CQCM' },
    42: { who: 'lan', scr: 'SCR-60', nlv: 1, choices: [
      { label: 'Đồng ý danh sách CQCM', to: 43, main: true },
      { label: 'Không đồng ý — chọn lại', to: 41, kind: 'danger', reason: true }] },
    43: { who: 'minh', scr: 'SCR-60', next: 44, nlv: 0.5, actionLabel: 'Trình hồ sơ' },
    44: { next: 'g22' },
    g22: { gw: true, run: (v, u) => { v.aiFail = !!u.ai44Fail; if (u.ai44Fail) u.ai44Fail = false; }, when: (v) => (v.aiFail ? 39 : 45) },
    45: { td: 'CT', next: 'g13' },
    /* Thẩm định và hoàn chỉnh chủ trương (46) → G23 cấp duyệt chủ trương: VHT → ký thẩm định (47) → TGĐ VHT ký (48); Tập đoàn → 63.
       Không đồng ý → G25 ý kiến chỉ đạo: dừng / tiếp tục xử lý (về G10 gộp — 39 hoặc 18). */
    46: { who: 'lan', scr: 'SCR-61', next: 'g23', nlv: 1, actionLabel: 'Hoàn thành thẩm định chủ trương' },
    g23: { gw: true, capGate: { of: 'CT', vht: 47, td: 63 } },
    47: { who: 'lan', scr: 'SCR-21', nlv: 0.5, choices: [
      { label: 'Ký thẩm định trên tờ trình', to: 48, main: true, sign: 'BM-01' }] },
    48: { who: 'tgd', scr: 'SCR-21', nlv: 1, choices: [
      /* T45 (D-103): ký chủ trương = kết thúc hồ sơ CT (KĐT Đã phê duyệt chủ trương); hồ sơ KĐT tạo riêng, chạy từ 49 (Flow.createKdtCase kind KDT). */
      { label: 'Ký phê duyệt chủ trương', to: 'END', main: true, sign: 'BM-01' },
      { label: 'Không đồng ý — chỉ đạo xử lý tiếp', to: 'g10', kind: 'secondary', reason: true },
      { label: 'Không đồng ý — chỉ đạo dừng', to: 'END_OTHER', kind: 'danger', reason: true }] },
    /* BM-03: AI (49) → lập (50) → kiểm tra, trình (51) → chọn CQCM (52) → xác nhận DS (53) → mở vòng BM-03 (54) → khối chung → thẩm định (55)
       → G27 cấp duyệt KĐT: VHT → Chỉ huy ký tờ trình (56) → TTMS ký BM-14 + dự thảo BM-18 (57: không thông qua → 58 → 59 → 50) → TGĐ VHT ký BM-18 (60). */
    49: { next: 50 },
    50: { who: 'minh', scr: 'SCR-64', next: 51, nlv: 2, actionLabel: 'Hoàn thành hồ sơ phê duyệt KĐT' },
    51: { who: 'minh', scr: 'SCR-64', next: 52, nlv: 0.5, actionLabel: 'Xác nhận hồ sơ đủ điều kiện trình' },
    52: { who: 'minh', scr: 'SCR-60', next: 53, nlv: 0.5, actionLabel: 'Gửi danh sách CQCM' },
    53: { who: 'lan', scr: 'SCR-60', nlv: 1, choices: [
      { label: 'Đồng ý danh sách CQCM', to: 54, main: true },
      { label: 'Không đồng ý — chọn lại', to: 52, kind: 'danger', reason: true }] },
    54: { td: 'KDT', next: 'g13' },
    55: { who: 'lan', scr: 'SCR-61', next: 'g27', nlv: 1, actionLabel: 'Hoàn thành thẩm định KĐT' },
    g27: { gw: true, capGate: { of: 'KDT', vht: 56, td: 63 } },
    56: { who: 'hai', scr: 'SCR-21', nlv: 0.5, choices: [
      { label: 'Ký tờ trình phê duyệt KĐT', to: 57, main: true, sign: 'BM-03' }] },
    57: { who: 'lan', scr: 'SCR-65', nlv: 1, choices: [
      { label: 'Ký báo cáo thẩm định BM-14, trình dự thảo BM-18', to: 60, main: true, sign: 'BM-14' },
      { label: 'Báo cáo không được thông qua — yêu cầu hoàn chỉnh', to: 58, kind: 'secondary', reason: true }] },
    58: { next: 59 },
    59: { who: 'minh', scr: 'SCR-62', next: 50, nlv: 1, actionLabel: 'Hoàn chỉnh hồ sơ' },
    60: { who: 'tgd', scr: 'SCR-21', nlv: 1, choices: [
      { label: 'Ký ban hành Quyết định phê duyệt KĐT', to: 'END', main: true, sign: 'BM-18' },
      { label: 'Không đồng ý — sửa BM-03', to: 50, kind: 'secondary', reason: true }] },
    /* Hồ sơ gộp: G30 cấp duyệt (Tập đoàn khi chủ trương hoặc KĐT thuộc Tập đoàn) → TTMS ký BM-14 + dự thảo BM-18 (61) → TGĐ VHT ký (62); Không đồng ý → 19. */
    g30: { gw: true, capGate: { of: 'GOP', vht: 61, td: 63 } },
    61: { who: 'lan', scr: 'SCR-65', nlv: 1, choices: [
      { label: 'Ký báo cáo thẩm định BM-14, trình ký hồ sơ gộp', to: 62, main: true, sign: 'BM-14' }] },
    62: { who: 'tgd', scr: 'SCR-21', nlv: 1, choices: [
      { label: 'Ký phê duyệt hồ sơ gộp, ban hành BM-18', to: 'END', main: true, sign: 'BM-00 + BM-18' },
      { label: 'Không đồng ý — sửa BM-00', to: 19, kind: 'secondary', reason: true }] },
    /* Tuyến Tập đoàn 63–74 (T18 B4): vào từ G23 / G27 / G30 — loại hồ sơ trình vars.tdKind (CT chủ trương BM-01, KDT hồ sơ KĐT BM-03, GOP hồ sơ gộp BM-00).
       Người Tập đoàn (67, 70–73) = tài khoản giả lập "td" như MS01 (P-96). Ký 65 / 69 của VHT đi qua khối ký chung (P-91); 73 là ký của Tập đoàn, kết quả về ở 74.
       Thời hạn GIẢ LẬP P-93. */
    63: { next: 64 },
    64: { who: 'minh', scr: 'SCR-18', next: 65, nlv: 1, actionLabel: 'Trình ký công văn gửi Tập đoàn' },
    65: { who: 'tgd', scr: 'SCR-21', nlv: 1, choices: [
      { label: 'Ký công văn trình Tập đoàn', to: 66, main: true, sign: 'Công văn trình Tập đoàn' },
      { label: 'Không đồng ý — hoàn thiện công văn', to: 64, kind: 'secondary', reason: true }] },
    66: { tdSend: true, next: 67 },
    67: { who: 'td', scr: 'SCR-18', next: 68, nlv: 5, actionLabel: 'Gửi phiếu nhận xét về VHT' },
    68: { who: 'minh', scr: 'SCR-18', next: 69, nlv: 2, actionLabel: 'Hoàn thiện hồ sơ, trình ký lại' },
    69: { who: 'tgd', scr: 'SCR-21', nlv: 1, choices: [
      { label: 'Ký trình bộ hồ sơ hoàn thiện lên Tập đoàn', to: 70, main: true, sign: 'BM-06' }] },
    70: { who: 'td', scr: 'SCR-18', nlv: 2, choices: [
      { label: 'Hồ sơ hoàn thiện đạt yêu cầu', to: 'g34', main: true },
      { label: 'Chưa đạt — yêu cầu bổ sung', to: 68, kind: 'secondary', reason: true }] },
    /* G34 "Hồ sơ chủ trương riêng?" */
    g34: { gw: true, when: (v) => (v.tdKind === 'CT' ? 71 : 72) },
    71: { who: 'td', scr: 'SCR-18', next: 73, nlv: 2, actionLabel: 'Hoàn thiện hồ sơ chủ trương, các Ban đã ký BM-01' },
    72: { who: 'td', scr: 'SCR-18', next: 73, nlv: 2, actionLabel: 'Ký báo cáo thẩm định BM-14, trình dự thảo BM-18' },
    73: { who: 'td', scr: 'SCR-18', nlv: 2, choices: [
      { label: 'Ký phê duyệt hồ sơ cấp Tập đoàn', to: 74, main: true },
      { label: 'Không đồng ý — yêu cầu sửa', to: 68, kind: 'danger', reason: true }] },
    74: { tdResult: true, next: 'g36' },
    /* G36 "Là Chủ trương riêng hay hồ sơ gộp đã được duyệt?": T45 (D-103) — cả hai nhánh kết thúc hồ sơ đang chạy: chủ trương → kết thúc hồ sơ CT
       (KĐT Đã phê duyệt chủ trương, hồ sơ KĐT tạo riêng từ 49); KĐT / hồ sơ gộp → hoàn tất phê duyệt cấp Tập đoàn. */
    g36: { gw: true, when: () => 'END' },
    /* Khối ký chung 75–78 (D-34). 75 chọn hình thức ký ghi ở hộp thoại Trình ký của bước ký (B3-1) — không thành việc riêng.
       76 có việc chỉ khi gửi VOffice lỗi (P-94): người trình bấm Gửi lại. 77 người ký của bước ký; 78 người phụ trách hồ sơ (chuyên viên ĐVĐX). */
    76: { vo: true, next: 'g3', who: 'ky:by', scr: 'SCR-21', nlv: 0.25, choices: [
      { label: 'Gửi lại VOffice', to: 76, main: true }] },
    77: { who: 'ky:signer', scr: 'SCR-21', next: 78, nlv: 1, actionLabel: 'Đã ký ngoài hệ thống' },
    78: { who: 'minh', scr: 'SCR-21', next: 'g3', nlv: 0.5, actionLabel: 'Lưu kết quả ký ngoài hệ thống' },
    g3: { gw: true, kyReturn: true },
  };
  /* Bộ đếm của vòng thẩm định hiện tại (chk, meet) — Flow.tdCount đọc cùng cách. */
  D.kdtCnt = (v, k) => ((v[k] || {})[v.td || 'GOP'] || 0);
  /* Ý kiến thẩm định mẫu theo giai đoạn và lượt TTMS thẩm định (i = 0, 1, …; hết mẫu thì dùng lượt cuối). id = TTMS hoặc mã CQCM.
     fix = cần sửa đổi / giải trình; lựa chọn trên màn (ui.op['td-i-id']) được ưu tiên. */
  D.kdtReview = (td, i) => { const a = ((D.caseRef.review || {})[td]) || []; return a.length ? a[Math.min(i, a.length - 1)] : {}; };
  D.kdtFix = (td, i, id, u) => { const o = ((u || {}).op || {})[td + '-' + i + '-' + id]; return o != null ? o : !!(D.kdtReview(td, i)[id] || {}).fix; };
  /* Cổng "Cần sửa đổi hoặc giải trình?": TTMS hoặc một CQCM phối hợp của lượt vừa thẩm định kết luận cần sửa. */
  D.kdtNeedFix = (v, u) => {
    const td = v.td || 'GOP', i = Math.max(0, window.Flow.tdRound() - 1);
    return ['TTMS'].concat(window.Flow.cqcmSel()).some((id) => D.kdtFix(td, i, id, u));
  };
  /* Định nghĩa luồng theo quy trình (plan KĐT §6 #2): MS01.01 / .02 / .03 chung D.flow; MS13 = trang MS13 bản 12/10 (D-31). */
  /* T21 (D-37): trang MS02 ver1.1 trùng topo MS01 v1.1 (plan T21 §2) → luồng Điều chỉnh dùng lại định nghĩa MS01, bỏ 10a / 10b;
     tên bước theo BPMN_FLOWS.MS02. Cổng sau bước 10 rẽ 11 / 12 theo giá trị sau điều chỉnh (D-39, không theo quy trình đã chọn);
     bước 48 chọn sẵn theo căn cứ của ĐXMS cũ (vars.basisTD — hồ sơ Phê duyệt MS01.02), TTMS đổi được (P-106). */
  const A = Object.assign({}, F);
  delete A['10a'];
  delete A['10b'];
  /* T29 B16: DX-10 chỉ áp cho MS01 — MS02 (BPMN trùng topo, BA vẽ lại sau) giữ thứ tự cũ: ĐVĐX làm 5–10, chỉ huy duyệt ở 13. */
  ['g5', '5.1', '7.1', '10.1', '16.1'].forEach((k) => { delete A[k]; });
  A[5] = Object.assign({}, F[5], { choices: F[5].choices.map((c) => (c.to === 'g5' ? Object.assign({}, c, { to: 6 }) : c)) });
  A[7] = { who: 'minh', scr: 'SCR-06', next: 8, nlv: 1 };
  A[8] = Object.assign({}, F[8], { who: 'minh' });
  A[10] = Object.assign({}, F[10], { who: 'minh', choices: [F[10].choices[0], { label: 'Không đạt — gửi lại YCBG', to: 9, kind: 'secondary' }] });
  A.gQuote = { gw: true, when: (v) => (v.quoteAi === false ? 9 : 'gValue') };
  A[16] = Object.assign({}, F[16], { next: 17, actionLabel: 'Gửi TTMS xác nhận danh sách CQCM' });
  A.gValue = { gw: true, run: (v) => { v.big = !D.inRange('MS01.03', v.adj.total, v.th || D.dxmsRules()); }, when: (v) => (v.big ? 12 : 11) };
  A[48] = Object.assign({}, F[48], { q: ['P-106'], choices: [
    { label: 'Có báo cáo TGĐ Tập đoàn', to: 'gReport', mainWhen: (v) => !v.basisTD, set: { reportTD: true } },
    { label: 'Không báo cáo TGĐ Tập đoàn', to: 'gReport', kind: 'secondary', mainWhen: (v) => !!v.basisTD, set: { reportTD: false } }] });
  D.flows = { MS01: F, MS13: K, MS02: A };
  /* Khối ký chung theo quy trình (D-50): bước ghi hình thức, bước ký điện tử, bước ký bản cứng — xem flow.js kySign. */
  D.kyConf = { MS13: { choose: 75, soft: 76, hard: 77 } };
  /* T25 B1 — MS22 Thương thảo và ký hợp đồng (BPMN-DTMS trang MS22, DG-MS22; mũi tên trong BPMN_FLOWS.MS22). Hồ sơ con của hợp đồng (D-47), chỉ HĐ-2026-0052 (D-48).
     Bước 5 AI kiểm tra (service, S5) đọc dữ liệu đã nhập: bảo hành thấp hơn HSMT → cần thống nhất lại với nhà thầu (6); thiếu mã hàng → sửa nội bộ (7) — GIẢ LẬP P-127, P-128.
     Trưởng phòng trả về (8) cũng qua cổng G4, nút nói rõ nhánh. 10 trả về 9 như mũi tên BPMN (P-129). 13 Phòng Hợp đồng ghi nhận kết quả của nhà thầu (D-50); Ghi nhận chưa ký ở lại 13 (P-121, DX-06). */
  D.hdWarrantyMin = 24;
  const hdIssues = (v, u) => {
    const w = u.hdWarranty != null ? u.hdWarranty : v.hdFixed ? D.hdWarrantyMin : 18, out = [];
    if (w < D.hdWarrantyMin) out.push({ nhom: 'NCC', noiDung: `Bảo hành lò hàn đối lưu ${w} tháng, HSMT yêu cầu tối thiểu ${D.hdWarrantyMin} tháng — cần thống nhất lại với nhà thầu.` });
    if (u.hdMissingCode) out.push({ nhom: 'NOIBO', noiDung: 'Phụ lục kỹ thuật còn hạng mục chưa có mã hàng — Phòng Hợp đồng bổ sung.' });
    return out;
  };
  const HD22 = 'SCR-102';
  const M22 = {
    1: { who: 'phd', scr: HD22, nlv: 1, actionLabel: 'Hoàn thành tiếp nhận', next: 'g1' },
    g1: { gw: true, forkTo: [{ task: 2, who: 'dvsd' }, { task: 3, who: 'phd' }], group: 'ms22' },
    2: { who: 'dvsd', scr: HD22, nlv: 2, actionLabel: 'Hoàn thành phụ lục kỹ thuật', next: 'j1', q: ['P-133'] },
    3: { who: 'phd', scr: HD22, nlv: 2, actionLabel: 'Hoàn thành body và phụ lục giá', next: 'j1', q: ['P-119', 'P-126'] },
    j1: { gw: true, join: 'ms22', next: 4 },
    4: { who: 'phd', scr: HD22, nlv: 3, actionLabel: 'Hoàn thành thương thảo', next: 5 },
    5: { nlv: 0.5, q: ['P-127'], run: (v, u) => { const issues = hdIssues(v, u); v.aiHd = { ok: !issues.length, issues, lan: ((v.aiHd || {}).lan || 0) + 1 }; if (issues.length) v.g4 = issues[0].nhom; }, when: (v) => (v.aiHd.ok ? 8 : 'g4') },
    g4: { gw: true, when: (v) => (v.g4 === 'NOIBO' ? 7 : 6) },
    6: { who: 'phd', scr: HD22, nlv: 2, optional: true, q: ['P-128'], choices: [{ label: 'Cập nhật và kiểm tra lại', to: 5, main: true, set: { hdFixed: true } }] },
    7: { who: 'phd', scr: HD22, nlv: 1, optional: true, q: ['P-128'], actionLabel: 'Cập nhật và kiểm tra lại', next: 5 },
    8: { who: 'tphd', scr: HD22, nlv: 1, choices: [{ label: 'Phê duyệt và ký soạn thảo', to: 9, main: true },
      { label: 'Trả chỉnh sửa — sửa nội bộ', to: 'g4', kind: 'secondary', reason: true, set: { g4: 'NOIBO' } },
      { label: 'Trả chỉnh sửa — thống nhất lại với nhà thầu', to: 'g4', kind: 'secondary', reason: true, set: { g4: 'NCC' } }] },
    9: { who: 'phd', scr: HD22, nlv: 2, actionLabel: 'Trình Thủ trưởng VHT', next: 10, q: ['P-134'] },
    10: { who: 'tgd', scr: HD22, nlv: 1, q: ['P-129', 'P-130', 'P-131'], choices: [{ label: 'Phê duyệt và ký hợp đồng', to: 11, main: true, sign: 'Hợp đồng' },
      { label: 'Không đồng ý — sửa và trình lại', to: 9, kind: 'secondary', reason: true }] },
    11: { who: 'phd', scr: HD22, nlv: 0.5, actionLabel: 'Đã nhận hợp đồng', next: 12 },
    12: { who: 'phd', scr: HD22, nlv: 0.5, q: ['P-132'], choices: [{ label: 'Gửi ký qua VContract', to: 13, main: true, set: { hdSign: 'VC' } }, { label: 'Gửi bản giấy để ký cứng', to: 13, kind: 'secondary', set: { hdSign: 'GIAY' } }] },
    13: { who: 'phd', scr: HD22, nlv: 3, external: 'Nhà thầu / Nhà cung cấp', q: ['P-121', 'P-131'], choices: [{ label: 'Ghi nhận đã ký đầy đủ', to: 'END', main: true },
      { label: 'Ghi nhận chưa ký', to: 13, kind: 'secondary', reason: true }] },
  };
  D.flows.MS22 = M22;
  /* Quy trình của hồ sơ con: tên, trang BPMN, loại hồ sơ, nhật ký kết thúc. */
  D.hdProcesses = { MS22: { name: 'Thương thảo và ký hợp đồng', page: 'MS22', type: 'Thương thảo và ký hợp đồng', end: 'Kết thúc — hợp đồng đã ký đầy đủ, chuyển MS23', prefix: 'HSHD-',
    then: (c, today) => ({ process: 'MS23', vars: { hd: c.parent, signed: (c.ui || {}).hdNgayKy || today } }) },
  MS23: { name: 'Theo dõi thực hiện hợp đồng', page: 'MS23 - Tổng quan', type: 'Theo dõi thực hiện hợp đồng', end: 'Theo dõi theo sự kiện, không có việc đang chờ', prefix: 'HSTD-' } };
  /* T25 B2 — MS23 Tổng quan (D-49, DG-MS23): hồ sơ theo dõi tự khởi tạo khi MS22 kết thúc (bước 1). Không có sự kiện kết thúc chung, các nhánh độc lập và cùng ghi về hồ sơ theo dõi:
     đến mốc → 2 nhắc; nhà thầu thông báo → 3 ghi nhận → 4 thông báo, chuyển MS23.02; đến hạn / phát sinh (S4, không có số bước) → cần khởi tạo MS23.01, .03, .04; biên bản đã ký → 5 cập nhật ngày thực tế.
     Mốc AI trích xuất (S5) đọc D.hdTrack: GIẢ LẬP P-135; sự kiện kích hoạt bằng công cụ demo, B4…B6 nối 5 với biên bản thật của luồng con. */
  D.hdRemindDays = 7;
  D.hdTrack = { 'HĐ-2026-0052': [
    { name: 'Giao đợt 1: máy gắn linh kiện, lò hàn đối lưu', days: 90, rate: 61, kind: 'GIAO', site: 'Xưởng SMT — Nhà máy sản xuất thử nghiệm', goods: 'Máy gắn linh kiện tốc độ cao × 4; Lò hàn đối lưu 10 vùng nhiệt × 2', qty: [[0, 4], [1, 2]] },
    { name: 'Giao đợt 2: máy kiểm tra AOI, X-ray 3D', days: 210, rate: 39, kind: 'GIAO', site: 'Xưởng SMT — Nhà máy sản xuất thử nghiệm', goods: 'Máy kiểm tra quang học tự động (AOI) × 2; Máy kiểm tra X-ray 3D × 1', qty: [[2, 2], [3, 1]] },
    { name: 'Nghiệm thu tổng thể', days: 210, rate: 0, kind: 'NT' }] };
  const dayAdd = (s, n) => { const [d, m, y] = s.split('/').map(Number), x = new Date(y, m - 1, d + n); return [x.getDate(), x.getMonth() + 1].map((p) => String(p).padStart(2, '0')).join('/') + '/' + x.getFullYear(); };
  const trackLog = (v, at, ev, kq) => { v.trackLog = (v.trackLog || []).concat([[at, ev, kq]]); };
  const nextMs = (v, kind) => v.track.ms.find((m) => m.kind === kind && !m.actual) || null;
  /* Giả lập P-138: bộ phận nhận thông báo giao hàng. */
  D.hdNotifyTo = 'Đơn vị sử dụng; Phòng Quản lý tài sản; Phòng Tài chính kế toán';
  /* Đến hạn hoặc phát sinh chứng từ: luồng con cần khởi tạo (GIẢ LẬP P-120 — Phòng Hợp đồng khởi tạo). */
  const HD_TRIGGER = { 'MS23.01': ['Văn bản phát sinh', 'Có phát sinh cần lập văn bản'], 'MS23.03': ['Nghiệm thu', 'Đến hạn nghiệm thu'] };
  D.flows.MS23 = {
    1: { nlv: 0.5, q: ['P-135'], stop: true, run: (v) => {
      v.track = { at: v.signed, ms: (D.hdTrack[v.hd] || []).map((m) => Object.assign({}, m, { plan: dayAdd(v.signed, m.days), actual: null })) };
      trackLog(v, v.signed, 'Hợp đồng đã ký được tải lên', `AI trích xuất ${v.track.ms.length} mốc, lưu hồ sơ theo dõi`);
    } },
    2: { nlv: 0.5, q: ['P-136'], stop: true, run: (v) => {
      const m = nextMs(v, 'GIAO');
      if (!m) { trackLog(v, v.signed, 'Đến mốc giao hàng', 'Không còn mốc giao hàng chưa hoàn thành, không gửi nhắc'); return; }
      const at = dayAdd(m.plan, -D.hdRemindDays);
      v.reminds = (v.reminds || []).concat([{ ms: m.name, plan: m.plan, at, to: 'Nhà thầu; Đầu mối theo dõi', ch: 'Email; Thông báo trên hệ thống' }]);
      trackLog(v, at, 'Đến mốc giao hàng', `Đã gửi nhắc: ${m.name}`);
    } },
    3: { who: 'phd', scr: 'SCR-102', nlv: 1, q: ['P-137'], actionLabel: 'Hoàn thành ghi nhận', next: 4 },
    4: { nlv: 0.5, q: ['P-138'], stop: true, run: (v, u) => {
      const m = v.track.ms.find((x) => x.name === u.tdDot) || nextMs(v, 'GIAO') || v.track.ms[0], at = dayAdd(m.plan, -3);
      v.notices = (v.notices || []).concat([{ dot: m.name, ngay: u.tdNgayDuKien || m.plan, site: u.tdDiaDiem || m.site, kenh: u.tdKenh || 'Email', at, to: D.hdNotifyTo, file: !!u.tdTb }]);
      trackLog(v, at, 'Nhà thầu thông báo giao hàng', `Đã thông báo các bộ phận, chuyển hồ sơ giao hàng: ${m.name}`);
      ['tdDot', 'tdNgayDuKien', 'tdDiaDiem', 'tdKenh', 'tdNoiDung', 'tdTb'].forEach((k) => { delete u[k]; });
    }, spawn: (v) => { /* Mỗi đợt một hồ sơ MS23.02; nhà thầu báo lại cùng đợt thì không sinh thêm. */
      const n = v.notices[v.notices.length - 1];
      return window.Flow.cases(v.hd).some((c) => c.vars.process === 'MS23.02' && c.vars.msName === n.dot) ? null : { process: 'MS23.02', name: n.dot, clock: window.Flow.clockOf(n.at), vars: { msName: n.dot } };
    } },
    S4: { gw: true, stop: true, run: (v) => {
      const [name, why0] = HD_TRIGGER[v.evt.flow], why = v.evt.why || why0, nt = v.track.ms.find((m) => m.kind === 'NT'), at = v.evt.date || (v.evt.flow === 'MS23.01' ? dayAdd(v.signed, 30) : nt.plan);
      v.triggers = (v.triggers || []).concat([Object.assign({ flow: v.evt.flow, name, why, at }, v.evt.kcs ? { kcs: v.evt.kcs } : {})]);
      trackLog(v, at, why, `Cần khởi tạo ${v.evt.flow} ${name}`);
    } },
    5: { nlv: 0.5, q: ['P-139', 'P-140'], stop: true, run: (v) => {
      if (v.evt.kind === 'TL') { trackLog(v, v.evt.date || v.signed, `Có ${v.evt.loai} đã ký đầy đủ`, 'AI ghi nhận kết quả thanh lý vào hồ sơ hợp đồng'); return; }
      if (v.evt.kind === 'VB') {
        /* Tiến độ có hiệu lực (GIẢ LẬP P-171): phụ lục gia hạn dời mốc chưa hoàn thành; mốc đã xong và nhắc đã gửi giữ nguyên. */
        const open = v.evt.days ? v.track.ms.filter((m) => !m.actual) : [];
        open.forEach((m) => { m.plan = dayAdd(m.plan, v.evt.days); });
        trackLog(v, v.evt.date, `Có ${v.evt.loai} đã ký đầy đủ`, open.length ? `AI cập nhật tiến độ có hiệu lực: dời ${open.length} mốc chưa hoàn thành thêm ${v.evt.days} ngày` : 'AI ghi nhận thông tin phát sinh vào hồ sơ hợp đồng');
        return;
      }
      const m = v.evt.ms ? v.track.ms.find((x) => x.name === v.evt.ms && !x.actual) : nextMs(v, v.evt.kind);
      if (!m) { trackLog(v, v.signed, `Có ${v.evt.loai} đã ký đầy đủ`, 'Không có mốc tương ứng, không cập nhật'); return; }
      m.actual = v.evt.date || m.plan;
      trackLog(v, m.actual, `Có ${v.evt.loai} đã ký đầy đủ`, `AI cập nhật ngày thực tế ${m.actual}: ${m.name}`);
    } },
  };
  /* T25 B3 — MS24 Thanh toán theo từng đợt (DG-MS24): mỗi đợt một hồ sơ con. Hai tuyến ký 4 cấp độc lập về nhánh sửa: bảng tổng hợp 7 → 8 → 9 → 10, trả về 11 → 7; đề nghị chuyển tiền 13 → 14 → 15 → 16, trả về 17 → 12 → 13.
     Hình thức ký chọn một lần ở bước 12 (DG-MS24 §C.21), các cấp bấm Đồng ý và ký, không mở hộp thoại Trình ký (GIẢ LẬP P-152). Người ký Phòng tài chính = Trưởng phòng TCKT (P-124). Đồng bộ SAP lỗi: việc Gửi lại cho Phòng TCKT (P-125).
     Kế hoạch thanh toán theo hợp đồng: value = giá trị đề nghị, adv = khấu trừ tạm ứng, hold = giữ lại bảo hành (tỷ đồng); need = mốc phải có ngày thực tế mới tạo được hồ sơ, HOLD = chưa tới kỳ. GIẢ LẬP P-147. */
  /* T67 H4 (T66 L4): kế hoạch HĐ-2026-0052 sinh theo phương thức thanh toán của mẫu hợp đồng 1.6 (BM-HD-2026, TT 10 / 30 / 60) — có nguồn, thay GIẢ LẬP P-147 phần
     kế hoạch: tạm ứng 10% có bảo lãnh; đợt 1 trả 40% trừ tạm ứng sau Biên bản bàn giao; đợt 2 trả 60% sau nghiệm thu. Mẫu không có khoản giữ lại bảo hành. */
  D.hdPayPlan = { 'HĐ-2026-0052': [
    { name: 'Tạm ứng', cond: 'Sau ký hợp đồng và nộp bảo lãnh tạm ứng', rate: 10, value: 19.12, adv: 0, hold: 0 },
    { name: 'Thanh toán đợt 1', cond: 'Sau Biên bản bàn giao — 40% giá trị hợp đồng, trừ tạm ứng', rate: 40, value: 76.48, adv: 19.12, hold: 0, need: ['GIAO', 0] },
    { name: 'Thanh toán đợt 2', cond: 'Sau nghiệm thu', rate: 60, value: 114.72, adv: 0, hold: 0, need: ['NT', 0] }] };
  const noTable = (v, u) => u.ttBangTH === false;
  const kyTT = (who, to, back, what, o) => Object.assign({ who, scr: 'SCR-102', nlv: 1, choices: [{ label: 'Đồng ý và ký', to, main: true }, { label: `Không đồng ý — sửa ${what}`, to: back, kind: 'secondary', reason: true }] }, o);
  const onTable = { optional: noTable, q: ['P-124', 'P-150'] }, onReq = { q: ['P-124', 'P-150'] };
  D.flows.MS24 = {
    1: { who: 'phd', scr: 'SCR-102', nlv: 1, q: ['P-144'], actionLabel: 'Gửi hồ sơ thanh toán', next: 2 },
    2: { who: 'phd', scr: 'SCR-102', nlv: 1, q: ['P-145', 'P-147'], choices: [{ label: 'Đủ căn cứ thanh toán', to: 4, main: true }, { label: 'Yêu cầu bổ sung hồ sơ', to: 3, kind: 'secondary', reason: true }] },
    3: { who: 'phd', scr: 'SCR-102', nlv: 1, optional: true, q: ['P-144'], actionLabel: 'Gửi lại kiểm tra', next: 2 },
    4: { nlv: 0.5, q: ['P-148'], when: (v, u) => (noTable(v, u) ? 12 : 5) },
    5: { who: 'phd', scr: 'SCR-102', nlv: 1, optional: noTable, actionLabel: 'Cung cấp hoá đơn', next: 6 },
    6: { nlv: 0.5, optional: noTable, q: ['P-149'], next: 7 },
    7: kyTT('tckt', 8, 11, 'bảng tổng hợp', onTable),
    8: kyTT('tgd', 9, 11, 'bảng tổng hợp', onTable),
    9: kyTT('vthu', 10, 11, 'bảng tổng hợp', onTable),
    10: kyTT('td', 12, 11, 'bảng tổng hợp', onTable),
    11: { who: 'phd', scr: 'SCR-102', nlv: 1, optional: true, actionLabel: 'Trình ký lại từ Phòng tài chính', next: 7 },
    12: { who: 'phd', scr: 'SCR-102', nlv: 1, q: ['P-152'], actionLabel: 'Hoàn thiện và trình ký', next: 13 },
    13: kyTT('tckt', 14, 17, 'đề nghị', onReq),
    14: kyTT('tgd', 15, 17, 'đề nghị', onReq),
    15: kyTT('vthu', 16, 17, 'đề nghị', onReq),
    16: kyTT('td', 18, 17, 'đề nghị', onReq),
    17: { who: 'phd', scr: 'SCR-102', nlv: 1, optional: true, q: ['P-151'], actionLabel: 'Hoàn thiện lại đề nghị', next: 12 },
    18: { who: 'tckt', scr: 'SCR-102', nlv: 1, q: ['P-153'], actionLabel: 'Đã thanh toán', next: 19 },
    19: { who: 'tckt', scr: 'SCR-102', nlv: 0.5, q: ['P-146'], actionLabel: 'Cập nhật trạng thái', next: 20 },
    20: { nlv: 0.5, scr: 'SCR-102', q: ['P-125'], retry: { flag: 'sapFail', who: 'tckt', fail: 'Lỗi đồng bộ SAP — chưa ghi nhận được trạng thái thanh toán' }, next: 'END', choices: [{ label: 'Gửi lại SAP', to: 20, main: true }] },
  };
  D.hdProcesses.MS24 = { name: 'Thanh toán hợp đồng theo từng đợt', page: 'MS24', type: 'Thanh toán hợp đồng', end: 'Hoàn tất lần thanh toán — đã đồng bộ SAP', prefix: 'HSTT-', tab: 'pay', done: 'Hoàn tất lần thanh toán, đã đồng bộ SAP.' };
  D.hdProcesses.MS22.done = 'Hợp đồng đã ký đầy đủ, chuyển sang theo dõi thực hiện.';
  /* T25 B4 — MS23.03 Nghiệm thu + MS23.04 Thanh lý (DG-MS23.03, DG-MS23.04). Hai hồ sơ con báo cho nhau bằng tín hiệu (D.hdSignals; thật: message correlate theo mã hợp đồng):
     G1: MS23.03 xong bước 6 → khởi tạo MS23.04 (f.spawn). G2: MS23.04 kiểm tra đạt, ký chung → MS23.03 bước 7. G3: MS23.03 xong bước 13 → MS23.04 bước 13.
     Phương án ký chốt một lần ở MS23.03 bước 6, MS23.04 đọc lại (GIẢ LẬP P-155). Ký chung chỉ có một tuyến ký ở MS23.03, trả về thì sửa ở MS23.03 bước 6 (P-156).
     MS23.03 bước 14 và MS23.04 bước 14 phát sự kiện MS23 bước 5, dùng chung một chức năng cập nhật (DG-MS23.03 §B.5). Giám đốc = Phó TGĐ, Tổng Giám đốc = TGĐ VHT (GIẢ LẬP P-157). */
  const isChung = (v) => v.plan === 'CHUNG', notChung = (v) => !isChung(v);
  D.flows['MS23.03'] = {
    g1k: { gw: true, when: (v) => (v.kcs === 'DV' ? 2 : 1) },
    1: { who: 'lan', scr: 'SCR-102', nlv: 1, optional: (v) => v.kcs === 'DV', actionLabel: 'Gửi báo cáo KCS', next: 3 },
    2: { who: 'dvsd', scr: 'SCR-102', nlv: 1, optional: (v) => v.kcs !== 'DV', actionLabel: 'Gửi báo cáo KCS', next: 3 },
    3: { who: 'phd', scr: 'SCR-102', nlv: 1, choices: [{ label: 'Đủ hồ sơ, KCS đạt', to: 5, main: true }, { label: 'Thiếu chứng từ — yêu cầu bổ sung', to: 3, kind: 'secondary', reason: true }, { label: 'KCS chưa đạt — khắc phục', to: 4, kind: 'secondary', reason: true }] },
    4: { who: 'dvsd', scr: 'SCR-102', nlv: 2, optional: true, actionLabel: 'Hoàn thành khắc phục', next: 'g1k' },
    5: { nlv: 0.5, next: 6 },
    6: { who: 'phd', scr: 'SCR-102', nlv: 2, q: ['P-155'], actionLabel: 'Hoàn thiện biên bản', next: 'g3' },
    g3: { gw: true, run: (v, u) => { v.plan = v.plan || u.tnPhuongAn || 'RIENG'; }, spawn: (v) => ({ process: 'MS23.04', at: 'g1', vars: { plan: v.plan } }), when: (v) => (isChung(v) ? 'w7' : 8) },
    w7: { gw: true, when: (v) => (v.sig_g2 ? 7 : 'h7') },
    h7: { gw: true, stop: true, run: (v) => { v.hold = 'Chờ biên bản thanh lý hoàn thiện từ MS23.04'; } },
    7: { who: 'phd', scr: 'SCR-102', nlv: 1, optional: notChung, actionLabel: 'Tập hợp bộ hồ sơ', next: 8 },
    8: { nlv: 0.5, q: ['P-158'], run: (v, u) => { v.aiNt = { ok: !u.tnAiFail }; u.tnAiFail = false; }, when: (v) => (v.aiNt.ok ? 9 : 6) },
    9: kyTT('tphd', 10, 6, 'biên bản', { q: ['P-156'] }),
    10: kyTT('binh', 11, 6, 'biên bản', { q: ['P-156', 'P-157'] }),
    11: { who: 'vthu', scr: 'SCR-102', nlv: 1, q: ['P-154'], choices: [{ label: 'Hồ sơ đạt', to: 12, main: true }, { label: 'Không đạt — trả hoàn thiện', to: 6, kind: 'secondary', reason: true }] },
    12: kyTT('tgd', 13, 6, 'biên bản', { q: ['P-156', 'P-157'] }),
    13: { who: 'phd', scr: 'SCR-102', nlv: 1, external: 'Nhà thầu / Nhà cung cấp', actionLabel: 'Cập nhật biên bản đã ký', next: 'g3s' },
    g3s: { gw: true, signal: ['MS23.04', 'g3'], next: 14 },
    14: { nlv: 0.5, signal: ['MS23', 'nt'], next: 'END' },
  };
  D.flows['MS23.04'] = {
    g1: { gw: true, when: (v) => (v.plan === 'KHONG' ? 'e1' : 1) },
    e1: { gw: true, run: (v) => { v.endText = 'Không thực hiện thanh lý — chỉ nghiệm thu theo MS23.03'; }, when: () => 'END' },
    1: { who: 'phd', scr: 'SCR-102', nlv: 1, q: ['P-155'], actionLabel: 'Hoàn thành kiểm tra', next: 'g2' },
    g2: { gw: true, when: (v) => (isChung(v) ? 2 : 3) },
    2: { who: 'phd', scr: 'SCR-102', nlv: 1, optional: notChung, actionLabel: 'Hoàn thành chuẩn bị', next: 6 },
    3: { who: 'phd', scr: 'SCR-102', nlv: 1, optional: isChung, choices: [{ label: 'Nghiệm thu đã ký xong, đủ bảo lãnh', to: 4, main: true }, { label: 'Tiếp tục chờ, bổ sung bảo lãnh', to: 3, kind: 'secondary' }] },
    4: { who: 'phd', scr: 'SCR-102', nlv: 1, optional: isChung, actionLabel: 'Hoàn thành chuẩn bị', next: 5 },
    5: { who: 'phd', scr: 'SCR-102', nlv: 2, optional: isChung, q: ['P-159'], actionLabel: 'Ghi nhận quyết toán', next: 6 },
    6: { nlv: 0.5, next: 7 },
    7: { who: 'phd', scr: 'SCR-102', nlv: 2, actionLabel: 'Hoàn thiện biên bản', next: 8 },
    8: { nlv: 0.5, q: ['P-158'], run: (v, u) => { v.aiTl = { ok: !u.tlAiFail }; u.tlAiFail = false; }, when: (v) => (v.aiTl.ok ? 'g6' : 7) },
    g6: { gw: true, when: (v) => (isChung(v) ? 'g2s' : 9) },
    g2s: { gw: true, stop: true, signal: ['MS23.03', 'g2'], run: (v) => { v.hold = 'Chờ kết quả ký chung từ MS23.03'; } },
    9: kyTT('tphd', 10, 7, 'biên bản', { optional: isChung }),
    10: kyTT('binh', 11, 7, 'biên bản', { optional: isChung, q: ['P-157'] }),
    11: { who: 'vthu', scr: 'SCR-102', nlv: 1, optional: isChung, choices: [{ label: 'Hồ sơ đạt', to: 12, main: true }, { label: 'Không đạt — trả hoàn thiện', to: 7, kind: 'secondary', reason: true }] },
    12: kyTT('tgd', 13, 7, 'biên bản', { optional: isChung, q: ['P-157'] }),
    13: { who: 'phd', scr: 'SCR-102', nlv: 1, q: ['P-160'], external: 'Nhà thầu / Nhà cung cấp', actionLabel: 'Cập nhật biên bản đã ký', next: 14 },
    14: { nlv: 0.5, signal: ['MS23', 'tl'], next: 'END' },
  };
  /* Tín hiệu vào hồ sơ đích: trả về bước đi tiếp (null = hồ sơ chưa chờ, chỉ ghi nhận). s = ui của hồ sơ gửi. */
  const release = (to) => (v) => { if (!v.hold) return null; delete v.hold; return to; };
  D.hdSignals = { 'MS23.03': { g2: release(7) }, 'MS23.04': { g3: release(13) },
    MS23: { nt: (v, u, s) => { v.evt = { loai: 'biên bản nghiệm thu', kind: 'NT', date: s.tnNgay }; return 5; }, tl: (v, u, s) => { v.evt = { loai: 'biên bản thanh lý', kind: 'TL', date: s.tlNgay }; return 5; } } };
  D.hdProcesses['MS23.03'] = { name: 'Nghiệm thu hàng hoá / dịch vụ', page: 'MS23.03', type: 'Nghiệm thu', end: 'Có nghiệm thu đã ký đầy đủ', prefix: 'HSNT-', tab: 'bg', done: 'Biên bản nghiệm thu đã ký đầy đủ, đã cập nhật ngày nghiệm thu thực tế.',
    start: { name: 'Nghiệm thu tổng thể', at: 'g1k', vars: { kcs: 'TS' } } };
  D.hdProcesses['MS23.04'] = { name: 'Thanh lý hợp đồng', page: 'MS23.04', type: 'Thanh lý', end: 'Hoàn tất biên bản thanh lý', prefix: 'HSTL-', tab: 'tl', done: 'Hoàn tất biên bản thanh lý hợp đồng.' };
  /* T25 B5 — MS23.01 Văn bản phát sinh (DG-MS23.01): mỗi văn bản một hồ sơ con. Phụ lục hợp đồng là sửa đổi hợp đồng (cổng G1, GIẢ LẬP P-161), đi qua 2, 3; loại khác hợp nhất thẳng tới 4.
     Bước 4 không đạt về 1, làm lại nhánh tương ứng. Bước 7 không có cổng: chỉ ghi kết quả, không chặn (P-167). Người có thẩm quyền = TGĐ VHT (GIẢ LẬP P-163). Hình thức ký chọn ở bước 9, các cấp bấm Đồng ý và ký như B3-2.
     Bước 12 phát sự kiện MS23 bước 5: dùng chung một chức năng cập nhật, mỗi hồ sơ ký một lần (P-170); phụ lục gia hạn thì mốc chưa hoàn thành dời theo (P-171). Giá trị, ngày hết hạn của hợp đồng đọc từ hồ sơ đã xong (hop-dong.js liveDocs). */
  D.hdVbTypes = ['Phụ lục hợp đồng', 'Biên bản làm việc', 'Biên bản phạt', 'Văn bản khác'];
  D.hdVbSua = (u) => (u.vbLoai || D.hdVbTypes[0]) === D.hdVbTypes[0];
  const notSua = (v, u) => !D.hdVbSua(u);
  D.flows['MS23.01'] = {
    1: { who: 'phd', scr: 'SCR-102', nlv: 1, q: ['P-161', 'P-166'], actionLabel: 'Hoàn thành lập thông tin', next: 'g1' },
    g1: { gw: true, when: (v, u) => (D.hdVbSua(u) ? 2 : 'g3') },
    2: { who: 'phd', scr: 'SCR-102', nlv: 1, optional: notSua, q: ['P-162', 'P-173'], actionLabel: 'Trình đề xuất sửa đổi', next: 3 },
    3: { who: 'tgd', scr: 'SCR-102', nlv: 1, optional: notSua, q: ['P-163'], choices: [{ label: 'Duyệt đề xuất', to: 'g3', main: true }, { label: 'Chưa duyệt — hoàn thiện tờ trình', to: 2, kind: 'secondary', reason: true }] },
    g3: { gw: true, next: 4 },
    4: { nlv: 0.5, q: ['P-166'], run: (v, u) => { v.aiVbIn = { ok: !u.vbAiFail }; u.vbAiFail = false; }, when: (v) => (v.aiVbIn.ok ? 5 : 1) },
    5: { nlv: 0.5, next: 6 },
    6: { who: 'phd', scr: 'SCR-102', nlv: 2, q: ['P-168'], actionLabel: 'Hoàn thiện văn bản', next: 7 },
    7: { nlv: 0.5, q: ['P-167'], run: (v, u) => { v.aiVbOut = { warn: !!u.vbAiWarn }; u.vbAiWarn = false; }, next: 8 },
    8: { who: 'tphd', scr: 'SCR-102', nlv: 1, q: ['P-164'], choices: [{ label: 'Phê duyệt để trình ký', to: 9, main: true }, { label: 'Không duyệt — hoàn thiện lại', to: 6, kind: 'secondary', reason: true }] },
    9: { who: 'phd', scr: 'SCR-102', nlv: 1, q: ['P-169'], actionLabel: 'Trình ký', next: 10 },
    10: kyTT('tgd', 11, 9, 'hồ sơ trình ký', { q: ['P-163', 'P-165'] }),
    11: { who: 'phd', scr: 'SCR-102', nlv: 1, q: ['P-169', 'P-172'], external: 'Nhà thầu / Nhà cung cấp', actionLabel: 'Cập nhật và gửi lại', next: 12 },
    12: { nlv: 0.5, q: ['P-170', 'P-171'], signal: ['MS23', 'vb'], next: 'END' },
  };
  D.hdSignals.MS23.vb = (v, u, s, c) => {
    if ((v.vbDone || []).includes(c.code)) return null;
    v.vbDone = (v.vbDone || []).concat(c.code);
    v.evt = { loai: (s.vbLoai || D.hdVbTypes[0]).toLowerCase(), kind: 'VB', date: s.vbNgayKy || window.Flow.dateOf(c.clock), days: D.hdVbSua(s) ? Number(s.vbGiaHan) || 0 : 0 };
    return 5;
  };
  D.hdProcesses['MS23.01'] = { name: 'Văn bản phát sinh khi thực hiện hợp đồng', page: 'MS23.01', type: 'Văn bản phát sinh', end: 'Hoàn tất một văn bản phát sinh', prefix: 'HSVB-', tab: 'vb', many: true, done: 'Hoàn tất văn bản phát sinh, đã cập nhật thông tin hợp đồng.',
    start: { name: 'Văn bản phát sinh', at: 1, vars: {}, date: (t) => { const x = (t.triggers || []).filter((r) => r.flow === 'MS23.01').pop(); return x ? x.at : dayAdd(t.signed, 30); } } };
  D.hdProcesses['MS23.03'].start.date = (t) => t.track.ms.find((m) => m.kind === 'NT').plan;
  /* T25 B6 — MS23.02 Bàn giao (DG-MS23.02): mỗi đợt giao một hồ sơ con, tự sinh khi MS23 bước 4 chuyển thông báo giao hàng (không có nút Tạo hồ sơ). Mũi tên thiếu trên bản vẽ (2 → 3, 9 → 10, 10 → cổng, 15 → 14) đi theo diễn giải (P-185).
     Không đạt lần đầu → 7; đã bổ sung, thay thế mà vẫn không đạt → 9. Hạn 7 ngày làm việc từ ngày lập biên bản (GIẢ LẬP P-122), P.QLTS quyết định ở bước 7 theo diễn giải. Nhánh kết thúc khác nhau, không gộp thành đã bàn giao: dịch vụ → MS23.03; phạt → mở MS23.01, chờ; ý kiến → chờ; hủy → kết thúc theo phạm vi (DG-MS23.02 §C.24).
     Bước 22 phát sự kiện MS23 bước 5 cho đúng mốc của đợt, mỗi hồ sơ một lần (P-184). Không thêm cấp ký: tuyến ký HOC nằm ngoài bước 21 (GIẢ LẬP P-123). */
  const isDv = (v, u) => u.bgLoai === 'Dịch vụ', notDv = (v, u) => !isDv(v, u);
  const addWork = (s, n) => { const [d, m, y] = s.split('/').map(Number), x = new Date(y, m - 1, d); for (let k = n; k > 0;) { x.setDate(x.getDate() + 1); if (x.getDay() % 6) k -= 1; } return [x.getDate(), x.getMonth() + 1].map((p) => String(p).padStart(2, '0')).join('/') + '/' + x.getFullYear(); };
  const bg = (o) => Object.assign({ who: 'phd', scr: 'SCR-102', nlv: 1 }, o);
  D.flows['MS23.02'] = {
    1: bg({ q: ['P-175'], actionLabel: 'Hoàn thành tiếp nhận', next: 'g1' }),
    g1: { gw: true, when: (v, u) => (isDv(v, u) ? 4 : 2) },
    2: bg({ optional: isDv, actionLabel: 'Gửi thông báo giao hàng', next: 3 }),
    3: bg({ who: 'qlts', optional: isDv, q: ['P-175'], actionLabel: 'Ghi nhận giao nhận', next: 5 }),
    4: bg({ who: 'dvsd', optional: notDv, q: ['P-180'], actionLabel: 'Xác nhận thực hiện dịch vụ', next: 'e1' }),
    e1: { gw: true, signal: ['MS23', 'dv'], run: (v) => { v.endText = 'Có hồ sơ dịch vụ cho MS23.03, Đơn vị sử dụng tiếp tục chủ trì nghiệm thu'; }, when: () => 'END' },
    5: bg({ who: 'qlts', optional: isDv, q: ['P-174'], actionLabel: 'Gửi yêu cầu kiểm tra', next: 6 }),
    6: bg({ who: 'dvsd', optional: isDv, q: ['P-174', 'P-176'], choices: [{ label: 'Đạt', to: 14, main: true }, { label: 'Không đạt', to: 'g3', kind: 'secondary', reason: true }] }),
    g3: { gw: true, when: (v) => (v.bgThayThe ? 9 : 7) },
    7: bg({ who: 'qlts', optional: true, q: ['P-122'], choices: [{ label: 'Cho bổ sung / thay thế', to: 'h8', main: true }, { label: 'Từ chối ngay', to: 9, kind: 'secondary', reason: true }] }),
    h8: { gw: true, run: (v) => { v.bgHan = addWork(window.Flow.dateOf(window.Flow.state.clock), 7); }, next: 8 },
    8: bg({ who: 'qlts', optional: true, q: ['P-122'], choices: [{ label: 'Có hàng trong hạn', to: 3, main: true, set: { bgThayThe: true } }, { label: 'Không khắc phục trong hạn', to: 9, kind: 'secondary', reason: true }] }),
    9: bg({ who: 'qlts', optional: true, q: ['P-122', 'P-185'], actionLabel: 'Ghi nhận quyền từ chối', next: 10 }),
    10: bg({ who: 'dvsd', optional: true, q: ['P-177', 'P-185'], choices: [{ label: 'Phạt / hồ sơ xử lý', to: 11, main: true }, { label: 'Không hoàn thành mục tiêu mua sắm — hủy', to: 12, kind: 'secondary' }, { label: 'Vướng mắc đặc thù — xin ý kiến', to: 13, kind: 'secondary' }] }),
    11: bg({ optional: true, q: ['P-178'], actionLabel: 'Chuyển xử lý vi phạm', next: 'e3' }),
    e3: { gw: true, stop: true, run: (v) => { v.hold = 'Chuyển MS23.01, chờ kết quả xử lý'; }, spawn: () => ({ process: 'MS23.01', ui: { vbLoai: D.hdVbTypes[2] } }) },
    12: bg({ optional: true, q: ['P-123'], actionLabel: 'Hoàn tất thủ tục hủy', next: 'e2' }),
    e2: { gw: true, run: (v, u) => { v.endText = `Kết thúc — hủy ${(u.bgPhamVi || D.hdBgHuy[0]).toLowerCase()}`; }, when: () => 'END' },
    13: bg({ optional: true, q: ['P-179'], actionLabel: 'Trình xin ý kiến', next: 'e4' }),
    e4: { gw: true, stop: true, run: (v) => { v.hold = 'Chờ ý kiến chỉ đạo của Người có thẩm quyền'; } },
    14: bg({ q: ['P-181'], choices: [{ label: 'Đủ hàng, chứng từ, căn cứ chất lượng', to: 16, main: true }, { label: 'Chưa đủ — bổ sung', to: 15, kind: 'secondary', reason: true }] }),
    15: bg({ optional: true, q: ['P-185'], actionLabel: 'Xác nhận lại', next: 14 }),
    16: { nlv: 0.5, q: ['P-182'], run: (v, u) => { v.aiBgIn = { ok: !u.bgAiFail }; u.bgAiFail = false; }, when: (v) => (v.aiBgIn.ok ? 17 : 14) },
    17: { nlv: 0.5, next: 18 },
    18: bg({ nlv: 2, q: ['P-181'], actionLabel: 'Hoàn thiện HOC', next: 19 }),
    19: { nlv: 0.5, q: ['P-182'], run: (v, u) => { v.aiBgOut = { ok: !u.bgAiFail2 }; u.bgAiFail2 = false; }, when: (v) => (v.aiBgOut.ok ? 20 : 18) },
    20: bg({ who: 'tphd', q: ['P-183'], choices: [{ label: 'Phê duyệt để trình ký', to: 21, main: true }, { label: 'Không duyệt — hoàn thiện lại', to: 14, kind: 'secondary', reason: true }] }),
    21: bg({ q: ['P-123'], external: 'Nhà thầu / Nhà cung cấp', actionLabel: 'Cập nhật HOC đã ký', next: 22 }),
    22: { nlv: 0.5, q: ['P-184'], signal: ['MS23', 'bg'], next: 'END' },
  };
  D.hdBgHuy = ['Phần hàng hoá lỗi', 'Toàn bộ hợp đồng'];
  D.hdSignals.MS23.bg = (v, u, s, c) => {
    if ((v.bgDone || []).includes(c.code)) return null;
    v.bgDone = (v.bgDone || []).concat(c.code);
    v.evt = { loai: 'HOC', kind: 'GIAO', ms: c.vars.msName, date: s.bgNgay || null };
    return 5;
  };
  D.hdSignals.MS23.dv = (v, u, s, c) => { v.evt = { flow: 'MS23.03', why: 'Có hồ sơ dịch vụ cần nghiệm thu', kcs: 'DV', date: window.Flow.dateOf(c.clock) }; return 'S4'; };
  D.hdProcesses['MS23.02'] = { name: 'Bàn giao hàng hoá / dịch vụ', page: 'MS23.02', type: 'Bàn giao', end: 'Hoàn tất hồ sơ bàn giao', prefix: 'HSBG-', tab: 'bg', many: true, auto: true, done: 'Hoàn tất hồ sơ bàn giao, đã cập nhật ngày bàn giao thực tế.' };
  D.hdProcesses.MS24.many = true;
  /* Đối tượng cha của hồ sơ con: mặc định hợp đồng (D-47). Quy trình có đối tượng cha khác khai báo obj (T67: MS18 thuộc KHLCNT). */
  D.hdObj = { label: 'Mã hợp đồng', find: (c) => (window.HopDong ? window.HopDong.find(c) : null), href: (c) => 'hop-dong/' + encodeURIComponent(c) };
  D.caseObj = (p) => ((D.hdProcesses[p] || {}).obj || D.hdObj);

  /* T67 T2 (D-118) — MS18 Lập và phê duyệt KHLCNT. Nguồn: BPMN-MS18-TOBE (trang MS18 của BPMN-DTMS-1611), THAU-TT-1311 §3, BM-KHLCNT.
     Hồ sơ con của KHLCNT (đối tượng cha, cơ chế như hồ sơ con của hợp đồng D-47). Bước 1–2 (tạo hồ sơ, chọn hồ sơ nguồn) làm ở SCR-79 trước khi
     khởi tạo; Khởi tạo KHLCNT ghi nhận hai bước rồi mở bước 3 (THAU-TT-1311 §3.1 bước 2). Cấp phê duyệt (vars.level) khoá từ lúc khởi tạo.
     Vai GIẢ LẬP: Phòng Đầu tư – TTMS = thau; TTMS kiểm tra (BM02 VHT) = lan; Tổ trưởng Tổ thẩm định = binh; ý kiến Ban ĐTXD do TTMS ghi nhận thay
     (D-118 Q10, như nhà thầu ở MS22 D-50). Bước 8 = multi-instance theo danh sách Tổ thẩm định chọn ở bước 6 (bước 7 tạo việc cho từng người). */
  const KH18 = 'SCR-102';
  /* Tổ thẩm định mặc định [người, vai trò, phân công] — GIẢ LẬP theo thành phần Tổ thẩm định của hệ thống cũ (HT-THAU-IMG 7222). */
  D.khTeam0 = [['binh', 'Tổ trưởng', 'Chỉ đạo chung'], ['tckt', 'Thành viên', 'Tài chính'], ['thauch', 'Thành viên', 'Pháp lý']];
  /* Tiêu chí BM02 (BM-KHLCNT): VHT = Báo cáo kiểm tra, 16 tiêu chí 3 nhóm, Đáp ứng / Không đáp ứng; Tập đoàn = Báo cáo thẩm định, Bảng số 2, 7 nội dung,
     Tuân thủ, phù hợp / Không tuân thủ hoặc không phù hợp. Dùng chung cho eForm bước 10 / 12 và tab TĐ KHLCNT (T67 T3). */
  D.khCrit = { VHT: [['Căn cứ pháp lý', ['Sự đầy đủ hồ sơ trình theo danh mục quy định', 'Sự phù hợp của các căn cứ pháp lý trong tờ trình',
    'Sự tuân thủ các quy định về cấu trúc tờ trình và biểu mẫu kèm theo tờ trình', 'Sự đầy đủ và chính xác của các thông tin, số liệu cơ bản trong tờ trình']],
  ['Phần công việc không thuộc KHLCNT', ['Phần công việc đã thực hiện', 'Phần công việc không áp dụng được một trong các hình thức LCNT', 'Phần công việc chưa đủ điều kiện lập KHLCNT']],
  ['Phần công việc thuộc KHLCNT', ['Phân chia gói thầu', 'Tên gói thầu, nội dung công việc chính, nguồn vốn', 'Giá gói thầu', 'Hình thức LCNT', 'Phương thức LCNT',
    'Thời gian LCNT', 'Thời gian bắt đầu tổ chức LCNT', 'Loại hợp đồng', 'Thời gian thực hiện gói thầu']]],
  TD: ['Tên gói thầu', 'Giá gói thầu', 'Nguồn vốn', 'Hình thức và phương thức lựa chọn nhà thầu', 'Thời gian bắt đầu tổ chức lựa chọn nhà thầu', 'Loại hợp đồng', 'Thời gian thực hiện hợp đồng'],
  ok: { VHT: ['Đáp ứng', 'Không đáp ứng'], TD: ['Tuân thủ, phù hợp', 'Không tuân thủ hoặc không phù hợp'] } };
  const kySplit = () => ({ who: 'thau', scr: KH18, nlv: 1, q: ['P-230'], choices: [{ label: 'Trình ký VOffice', to: 16, main: true, set: { khKy: 'VO' } },
    { label: 'Trình ký cứng', to: 20, kind: 'secondary', set: { khKy: 'CUNG' } }] });
  D.flows.MS18 = {
    1: { who: 'thau', scr: KH18, nlv: 0.5, actionLabel: 'Hoàn thành', next: 2 },
    2: { who: 'thau', scr: KH18, nlv: 0.5, actionLabel: 'Hoàn thành', next: 3 },
    3: { who: 'thau', scr: KH18, nlv: 2, actionLabel: 'Hoàn thành tạo gói', next: 4 },
    4: { who: 'thau', scr: KH18, nlv: 1, actionLabel: 'Hoàn thành thông tin gói', next: 5 },
    5: { who: 'thau', scr: KH18, nlv: 2, actionLabel: 'Hoàn thành Tờ trình', next: 6 },
    6: { who: 'thau', scr: KH18, nlv: 0.5, actionLabel: 'Gửi Tổ thẩm định xác nhận', next: 7 },
    /* 7 service: tạo việc cam kết cho từng thành viên đã chọn ở bước 6 (Camunda: multi-instance trên collection khTtd). */
    7: { nlv: 0.5, multi: (v, u) => (u.khTtd || D.khTeam0.map((r) => ({ nguoi: r[0] }))).map((r) => r.nguoi).filter(Boolean), to: 8, group: 'ttd8' },
    8: { scr: KH18, nlv: 1, q: ['P-231'], actionLabel: 'Xác nhận cam kết', next: 'j8' },
    j8: { gw: true, join: 'ttd8', next: 'g1' },
    g1: { gw: true, when: (v) => (v.level === 'TD' ? 12 : 10) },
    9: { who: 'thau', scr: KH18, nlv: 1, optional: true, q: ['P-232'], actionLabel: 'Gửi lại', next: 5 },
    10: { who: 'lan', scr: KH18, nlv: 2, choices: [{ label: 'Đáp ứng', to: 11, main: true }, { label: 'Không đáp ứng — trả sửa', to: 9, kind: 'secondary', reason: true }] },
    11: kySplit(),
    12: { who: 'binh', scr: KH18, nlv: 2, choices: [{ label: 'Đạt', to: 13, main: true }, { label: 'Không đạt — trả sửa', to: 9, kind: 'secondary', reason: true }] },
    13: { who: 'thau', scr: KH18, nlv: 3, external: 'Ban ĐTXD Tập đoàn', q: ['P-233'], actionLabel: 'Ghi nhận ý kiến', next: 14 },
    14: { who: 'thau', scr: KH18, nlv: 2, actionLabel: 'Hoàn thành giải trình', next: 15 },
    15: kySplit(),
    /* 16–18, G5 (VOffice / Cổng đấu thầu): lỗi kỹ thuật (ui.voFail) → 18 thử lại tự động → 16, giữ bước nghiệp vụ; người ký từ chối (ui.signReject) → 19. */
    16: { nlv: 1, next: 17 },
    17: { nlv: 0.5, next: 'g5' },
    g5: { gw: true, run: (v, u) => { v.khKq = u.voFail ? 'ERR' : u.signReject ? 'REJ' : 'OK'; if (u.voFail) u.voFail = false; else u.signReject = false; },
      when: (v) => (v.khKq === 'ERR' ? 18 : v.khKq === 'REJ' ? 19 : 'g6') },
    18: { nlv: 0.5, next: 16 },
    19: { who: 'thau', scr: KH18, nlv: 1, optional: true, actionLabel: 'Chuyển chỉnh sửa', next: 9 },
    20: { who: 'thau', scr: KH18, nlv: 1, optional: (v) => v.khKy !== 'CUNG', actionLabel: 'Xác nhận kết quả ký', next: 'g6' },
    /* G6 "Có kết quả ký hợp lệ?": BPMN chỉ vẽ nhánh Có (P-232). */
    g6: { gw: true, next: 21 },
    21: { who: 'thau', scr: KH18, nlv: 0.5, actionLabel: 'Đăng tải KHLCNT', next: 22 },
    /* 22 tích hợp Cổng đấu thầu: BPMN chưa vẽ nhánh lỗi đăng tải (P-232). */
    22: { nlv: 0.5, next: 23 },
    /* 23 cập nhật KHLCNT Hoàn thành, mở các gói cho tổ chức LCNT (MS19 — T5). */
    23: { nlv: 0.5, run: (v) => { if (window.Thau) window.Thau.khFlowDone(v.kh); }, next: 'END' },
  };
  /* T67 T4 — trạng thái KHLCNT theo bước (THAU-TT-1311 §3.2–§3.4): thuộc tính khl của dòng cấu hình bước. Việc của bước được mở
     thì KHLCNT nhận trạng thái này (thật: listener task created cập nhật trạng thái đối tượng cha) — người dùng không chọn trạng thái (S6).
     11 / 15 Lập Quyết định gộp vào KHL-07 (§3.4 không có mã riêng cho lập Quyết định); 19 người ký từ chối → KHL-05. */
  Object.entries({ 'KHL-02': [1, 2, 3, 4, 5], 'KHL-03': [6, 7, 8], 'KHL-04': [10, 12], 'KHL-05': [9, 19], 'KHL-06': [13, 14],
    'KHL-07': [11, 15, 16, 17, 18, 20], 'KHL-08': [21], 'KHL-09': [22], 'KHL-10': [23] }).forEach(([c, ns]) => ns.forEach((n) => { D.flows.MS18[n].khl = c; }));
  D.hdProcesses.MS18 = { name: 'Lập và phê duyệt kế hoạch lựa chọn nhà thầu', page: 'MS18', type: 'Lập và phê duyệt KHLCNT', prefix: 'HSKH-', strip: 7,
    end: 'Kết thúc — KHLCNT đã phê duyệt và công khai, mở gói cho tổ chức lựa chọn nhà thầu', done: 'KHLCNT đã phê duyệt và công khai.',
    obj: { label: 'Mã KHLCNT', find: (c) => (window.Thau ? window.Thau.khCase(c) : null), href: (c) => 'khlcnt/' + encodeURIComponent(c) } };
  /* T67 T5 (D-118) — MS19 Tổ chức lựa chọn nhà thầu, một hồ sơ cho mỗi gói (BPMN-MS19, THAU-TT-1311 §4). Hồ sơ con của gói thầu (đối tượng cha).
     Bước 2 đọc hình thức / phương thức đã duyệt trong KHLCNT → cổng G1 chọn quy trình con. Q7 = A: rộng rãi 1 túi (3.1–3.6) và chỉ định thầu (7.1–7.4)
     chi tiết theo gạch đầu dòng của BPMN; 8 hình thức còn lại một bước gộp (chính task quy trình con 4, 5, 6, 8–12 — GIẢ LẬP, P-235).
     T80 L1 (D-132 Q3 = A): quy trình con 7 tách theo hình thức — chỉ định thầu thông thường 7.1–7.4 (HSYC → HSĐX); chỉ định thầu rút gọn
     7.5 → 7.4 (QC-12869 Điều 16 khoản 5); mua sắm trực tiếp 7.6 → 7.5 → 7.4, thương thảo không thành mời nhà thầu xếp hạng tiếp theo (Điều 15
     khoản 2–4). BPMN-MS19 chưa có nhánh này → DX-19, số bước 7.5 / 7.6 GIẢ LẬP (P-235). Thuộc tính lc = trạng thái gói (THAU-TT-1311 §4.1).
     Vai GIẢ LẬP: TTMS / Tổ chuyên gia = thau; Tổ thẩm định = lan; người có thẩm quyền ký qua VOffice (bước hệ thống). */
  const LC19 = 'SCR-102';
  D.lcRoute = (form, method) => ({ DTRR: method === '1GD2T' ? '4' : '3', DTHC: '5', CGTT: '6', CDT_TT: '7', CDT_RG: '7', MSTT: '7', DPTT: '8', DAT_HANG: '9',
    GIAO_NV: '10', TU_TH: '11', DAC_BIET: '12' }[form] || '12');
  const SUB19 = { 3.1: ['Lập HSMT', 'LC-01'], 3.2: ['Thẩm định, phê duyệt HSMT', 'LC-02', 'Tổ thẩm định'], 3.3: ['Phát hành HSMT', 'LC-03'], 3.4: ['Đóng thầu, mở HSDT', 'LC-05'],
    3.5: ['Đánh giá HSDT', 'LC-06'], 3.6: ['Thương thảo hợp đồng', 'LC-07'],
    7.1: ['Lập, phê duyệt HSYC', 'LC-01'], 7.2: ['Gửi HSYC cho nhà thầu dự kiến', 'LC-04'], 7.3: ['Nhận và đánh giá HSĐX', 'LC-06'], 7.4: ['Thương thảo, hoàn thiện hợp đồng', 'LC-07'],
    7.5: ['Gửi thư mời thương thảo kèm dự thảo hợp đồng', 'LC-04'], 7.6: ['Kiểm tra điều kiện mua sắm trực tiếp', 'LC-01'] };
  /* T80 L1: 7.5, 7.6 chưa có trong BPMN-MS19 — dựng theo đề xuất DX-19. */
  const DX19 = { 7.5: 'QC-12869 Điều 15 khoản 4 điểm a, Điều 16 khoản 5 điểm a', 7.6: 'QC-12869 Điều 15 khoản 2' };
  if (window.BPMN_FLOWS && window.BPMN_FLOWS.MS19) Object.entries(SUB19).forEach(([k, [name, , actor]]) => {
    window.BPMN_FLOWS.MS19.tasks[k] = { name, actor: actor || 'TTMS / Tổ chuyên gia', type: 'user', form: 'eForm', lane: actor || 'TTMS / Tổ chuyên gia', sub: k.split('.')[0],
      note: DX19[k] ? `Bước đề xuất DX-19 (${DX19[k]}) — BPMN-MS19 chưa có` : `Bước của quy trình con ${k.split('.')[0]} (gạch đầu dòng BPMN-MS19)` };
  });
  /* Bước đầu của quy trình con 7 theo hình thức (T80 L1). Hồ sơ cũ chưa ghi v.form thì đọc hình thức của gói. */
  const formOf19 = (v) => v.form || ((window.Thau && window.Thau.pkOf(v.goi)) || {}).form;
  D.lcFirst7 = (form) => (form === 'MSTT' ? '7.6' : form === 'CDT_RG' ? '7.5' : '7.1');
  const sub19 = (k, o) => Object.assign({ who: k === '3.2' ? 'lan' : 'thau', scr: LC19, nlv: 1, lc: SUB19[k][1] }, o);
  const gop19 = () => ({ who: 'thau', scr: LC19, nlv: 5, lc: 'LC-01', q: ['P-235'], actionLabel: 'Hoàn thành', next: 'g2' });
  D.flows.MS19 = {
    1: { who: 'thau', scr: LC19, nlv: 0.5, lc: 'LC-01', actionLabel: 'Khởi tạo tổ chức LCNT', next: 2 },
    2: { nlv: 0.5, lc: 'LC-01', run: (v) => { const g = window.Thau ? window.Thau.pkOf(v.goi) : null; if (g) { v.route = D.lcRoute(g.form, g.method); v.form = g.form; } }, next: 'g1' },
    g1: { gw: true, when: (v) => (v.route === '3' ? '3.1' : v.route === '7' ? D.lcFirst7(formOf19(v)) : Number(v.route)) },
    3.1: sub19('3.1', { actionLabel: 'Trình thẩm định HSMT', next: '3.2' }),
    3.2: sub19('3.2', { choices: [{ label: 'Đạt — phê duyệt HSMT', to: '3.3', main: true }, { label: 'Không đạt — trả sửa', to: '3.1', kind: 'secondary', reason: true }] }),
    3.3: sub19('3.3', { nlv: 0.5, actionLabel: 'Phát hành', next: '3.4' }),
    3.4: sub19('3.4', { actionLabel: 'Hoàn thành mở thầu', next: 'g34', q: ['P-THAU-01'] }),
    3.5: sub19('3.5', { nlv: 3, actionLabel: 'Hoàn thành đánh giá', next: '3.6' }),
    3.6: sub19('3.6', { nlv: 2, actionLabel: 'Hoàn thành thương thảo', next: 'g2' }),
    7.1: sub19('7.1', { actionLabel: 'Hoàn thành HSYC', next: '7.2' }),
    7.2: sub19('7.2', { nlv: 0.5, actionLabel: 'Gửi HSYC', next: '7.3' }),
    7.3: sub19('7.3', { nlv: 2, actionLabel: 'Hoàn thành đánh giá', next: '7.4' }),
    7.4: sub19('7.4', { nlv: 2, actionLabel: 'Hoàn thành thương thảo', next: 'g7' }),
    /* T80 L1: mua sắm trực tiếp — điều kiện Điều 15 khoản 2 do bộ xử lý hành động kiểm khi xác nhận (EVars.check), không đạt thì không chuyển bước. */
    7.6: sub19('7.6', { nlv: 1, actionLabel: 'Xác nhận đủ điều kiện', next: '7.5', q: ['P-235'] }),
    7.5: sub19('7.5', { nlv: 0.5, actionLabel: 'Gửi thư mời thương thảo', next: '7.4', q: ['P-235'] }),
    /* G7 (DX-19): thương thảo mua sắm trực tiếp không thành → mời nhà thầu xếp hạng tiếp theo của gói tham chiếu (Điều 15 khoản 3) → 7.5. */
    /* T80 L5 (QC-12869 Điều 36 khoản 5 điểm a): chỉ 01 HSDT, Chủ đầu tư gia hạn đóng thầu → bước 3.4 mở lại, chờ thời điểm đóng thầu mới (GIẢ LẬP P-THAU-01, DX-20). */
    g34: { gw: true, run: (v, u) => { v.lcXlTh = u.lcXlTh === 'GIA_HAN' ? 'GIA_HAN' : 'MO'; u.lcXlTh = ''; }, when: (v) => (v.lcXlTh === 'GIA_HAN' ? '3.4' : '3.5') },
    g7: { gw: true, run: (v, u) => { v.lcTtKq = u.lcTtKq === 'KHONG' ? 'KHONG' : 'OK'; if (v.lcTtKq === 'KHONG') { u.lcMoiTiep = (u.lcMoiTiep || 0) + 1; u.lcTtKq = ''; } },
      when: (v) => (v.lcTtKq === 'KHONG' && formOf19(v) === 'MSTT' ? '7.5' : 'g2') },
    4: gop19(), 5: gop19(), 6: gop19(), 8: gop19(), 9: gop19(), 10: gop19(), 11: gop19(), 12: gop19(),
    g2: { gw: true, next: 13 },
    13: { who: 'thau', scr: LC19, nlv: 1, lc: 'LC-08', actionLabel: 'Trình thẩm định KQLCNT', next: 14 },
    14: { who: 'lan', scr: LC19, nlv: 2, lc: 'LC-08', choices: [{ label: 'Đạt', to: 16, main: true }, { label: 'Không đạt — trả sửa', to: 15, kind: 'secondary', reason: true }] },
    15: { who: 'thau', scr: LC19, nlv: 1, lc: 'LC-08', optional: true, actionLabel: 'Trình lại', next: 13 },
    16: { who: 'thau', scr: LC19, nlv: 1, lc: 'LC-08', choices: [{ label: 'Trình ký VOffice', to: 17, main: true, set: { lcKy: 'VO' } }, { label: 'Trình ký cứng', to: 18, kind: 'secondary', set: { lcKy: 'CUNG' } }] },
    17: { nlv: 1, lc: 'LC-08', next: 19 },
    18: { who: 'thau', scr: LC19, nlv: 1, lc: 'LC-08', optional: (v) => v.lcKy !== 'CUNG', actionLabel: 'Xác nhận kết quả ký', next: 19 },
    /* 19 nhận kết quả ký → G5: lỗi kỹ thuật (ui.voFail) → 20 thử lại → 17; người ký từ chối (ui.signReject) → 21 → 16; thành công → 22. */
    19: { nlv: 0.5, lc: 'LC-08', next: 'g5' },
    g5: { gw: true, run: (v, u) => { v.lcKq = u.voFail ? 'ERR' : u.signReject ? 'REJ' : 'OK'; if (u.voFail) u.voFail = false; else u.signReject = false; },
      when: (v) => (v.lcKq === 'ERR' ? 20 : v.lcKq === 'REJ' ? 21 : 22) },
    20: { nlv: 0.5, lc: 'LC-08', next: 17 },
    21: { who: 'thau', scr: LC19, nlv: 1, lc: 'LC-08', optional: true, actionLabel: 'Chuyển chỉnh sửa', next: 16 },
    22: { who: 'thau', scr: LC19, nlv: 0.5, lc: 'LC-09', actionLabel: 'Đăng tải KQLCNT', next: 23, q: ['P-THAU-04'] },
    23: { nlv: 0.5, lc: 'LC-09', next: 24 },
    /* 24: đóng tổ chức LCNT, gói có KQLCNT (Chuyển ký hợp đồng) — Tạo hợp đồng ở Chi tiết gói thầu khởi tạo MS22 (H3). */
    24: { nlv: 0.5, lc: 'LC-10', run: (v) => { if (window.Thau) window.Thau.lcFlowDone(v.goi); }, next: 'END' },
  };
  /* Thứ tự bước hiện ở timeline hồ sơ: bước con nằm sau task quy trình con của nó. */
  const ORDER19 = [1, 2, 3, '3.1', '3.2', '3.3', '3.4', '3.5', '3.6', 4, 5, 6, 7, '7.6', '7.1', '7.2', '7.3', '7.5', '7.4', 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
  D.hdProcesses.MS19 = { name: 'Tổ chức lựa chọn nhà thầu', page: 'MS19', type: 'Tổ chức LCNT', prefix: 'HSLC-', strip: 3, order: ORDER19,
    end: 'Kết thúc — KQLCNT đã phê duyệt và công khai, gói chuyển ký hợp đồng', done: 'KQLCNT đã phê duyệt và công khai; gói chuyển ký hợp đồng.',
    obj: { label: 'Mã gói thầu', tail: ['Hình thức lựa chọn nhà thầu', 'Giá gói thầu'], find: (c) => (window.Thau ? window.Thau.lcCase(c) : null), href: (c) => 'goi-thau/' + encodeURIComponent(c) } };
  /* Tên bước hiện trên màn không mang ghi chú chờ chốt của bản vẽ ("[? Q2]"); điểm này nằm ở (i). */
  Object.keys(D.hdProcesses).forEach((p) => Object.values((window.BPMN_FLOWS[p] || {}).tasks || {}).forEach((t) => { t.name = t.name.replace(/\s*\[\?[^\]]*\]/g, ''); }));
  /* Mã hồ sơ theo mã hợp đồng và quy trình; quy trình many (MS24, MS23.01) mỗi lần một hồ sơ (n). Mốc đầu = ngày tạo hợp đồng mẫu 05/10/2026 (2 NLV sau 01/10). */
  D.hdCaseCode = (hd, process, n) => { const p = D.hdProcesses[process || 'MS22']; return p.prefix + hd.slice(p.strip != null ? p.strip : 3) + (p.many ? '-' + String(n || 1).padStart(2, '0') : ''); };
  D.hdCaseClock = 2;
  /* T25: mỗi trang Hợp đồng là một quy trình riêng (MS22, MS23, MS23.01…04, MS24). */
  D.familyOf = (process) => { const h = /^(MS22|MS23(?:\.0[1-4])?|MS24|MS18|MS19)/.exec(process || ''); /* T67 T1: MS18, MS19 là quy trình riêng */ return h ? h[1] : /^MS13/.test(process || '') ? 'MS13' : /^MS02/.test(process || '') ? 'MS02' : 'MS01'; };
  /* Luồng con của hồ sơ Điều chỉnh (DG-MS02 §B.3): < 160 tỷ → MS02.03; ≥ 160 tỷ → MS02.02 khi không báo cáo Tập đoàn (đã chọn ở 48,
     chưa tới 48 thì theo căn cứ ĐXMS cũ), còn lại MS02.01. Các bước "Không áp dụng" lấy theo luồng MS01 tương ứng. */
  D.adjBranch = (v) => (v.big === false ? 'MS02.03' : v.reportTD === false || (v.reportTD == null && v.basisTD) ? 'MS02.02' : 'MS02.01');
  /* T67 T2: MS18 — tuyến VHT không qua 12–15, tuyến Tập đoàn không qua 10–11 (cổng Cấp phê duyệt). */
  D.naOf = (v) => (D.familyOf(v.process) === 'MS18' ? (v.level === 'TD' ? [10, 11] : [12, 13, 14, 15])
    /* T67 T5: MS19 — task quy trình con 3 / 7 chỉ là khung (bước con hiện thay); quy trình con của hình thức khác không áp dụng. */
    : D.familyOf(v.process) === 'MS19' ? [3, 7].concat([4, 5, 6, 8, 9, 10, 11, 12].filter((n) => String(n) !== v.route),
      v.route === '3' ? [] : [3.1, 3.2, 3.3, 3.4, 3.5, 3.6],
      /* T80 L1: bước con 7 không thuộc hình thức của gói thì không áp dụng. */
      v.route !== '7' ? [7.1, 7.2, 7.3, 7.4, 7.5, 7.6] : D.lcFirst7(formOf19(v)) === '7.1' ? [7.5, 7.6] : D.lcFirst7(formOf19(v)) === '7.5' ? [7.1, 7.2, 7.3, 7.6] : [7.1, 7.2, 7.3])
    : D.familyOf(v.process) === 'MS02' ? D.notApplicable[D.adjBranch(v).replace('MS02', 'MS01')]
    /* DX-10 (b): người khởi tạo là Chỉ huy ĐVĐX → bước 5.1 không áp dụng. */
    : (D.notApplicable[v.process] || []).concat(v.creatorCh ? [5.1] : []));
  /* Task MS13 hồ sơ không đi qua (timeline "Không áp dụng"): tuyến Tập đoàn 63–74 khi chưa rẽ Tập đoàn; đã rẽ (vars.tdKinds) thì bỏ bước ký VHT
     thay thế (chủ trương 47–48, KĐT 56–60, gộp 61–62) và 71 / 72 không thuộc loại hồ sơ đã trình; hồ sơ Mật không qua 75–76 (G1 → 77 bản cứng);
     sau cổng gộp là nhánh còn lại (khối chung 25–38 dùng cho cả hai nhánh). 77–78 của hồ sơ không Mật: theo điều kiện. */
  D.kdtNa = (v, mat) => {
    const td = v.tdKinds || [], has = (k) => td.includes(k);
    const tdNa = !td.length ? range(63, 74) : [].concat(has('CT') ? [47, 48] : [71], has('KDT') ? range(56, 60) : [], has('GOP') ? [61, 62] : [], has('KDT') || has('GOP') ? [] : [72]);
    return tdNa.concat(mat ? [75, 76] : [], v.branch === 'BM00' ? range(39, 60) : v.branch === '2GD' ? range(18, 24).concat([61, 62]) : []);
  };
  /* Ngưỡng phân luồng KĐT: lĩnh vực + tính chất tài sản + [từ, đến dưới) tỷ → nhóm. Mặc định = 4 dòng KĐT của SCR-40 (BBLV 24/09, P-28);
     catalog.js thay bằng ngưỡng đang hoạt động. Hồ sơ giữ bản chụp lúc tạo (như P-34). */
  D.kdtRules = () => [
    { field: 'VTCNTT', asset: '*', from: 0, to: 160, procs: ['MS13'] }, { field: 'KHAC', asset: '*', from: 0, to: 90, procs: ['MS13'] },
    { field: 'VTCNTT', asset: '*', from: 160, to: 1000, procs: ['MS14'] }, { field: 'KHAC', asset: '*', from: 90, to: 500, procs: ['MS14'] }];
  /* T56 Q7 (review minhnh57 BA 12/11 #28, #35, #38): Nhóm KĐT ghi thẳng giá trị, không ghi mã; Nhánh hồ sơ ghi theo biểu mẫu "BM01→BM03".
     Mã quy trình chỉ còn ở trường Quy trình (D.kdtProcs), (i) và màn Quản lý quy trình. */
  D.kdtGroups = { MS13: 'Đơn giản', MS14: 'Thông thường', MS15: 'Phức tạp' };
  D.kdtProcs = { MS13: 'MS13 · KĐT đơn giản', MS14: 'MS14 · KĐT thông thường', MS15: 'MS15 · KĐT phức tạp' };
  D.kdtBranches = { BM00: 'BM00', '2GD': 'BM01→BM03' };
  /* Phân cấp thẩm quyền KĐT (bước 13, D-33): loại KĐT + lĩnh vực + [từ, đến dưới) tỷ → cấp duyệt chủ trương / KĐT. GIẢ LẬP P-90 theo UQ-GUQ §1.2:
     1.2.1 KHCN (trang bị CSVC-KT) < 45 tỷ → KĐT VHT trên chủ trương Tập đoàn; 1.2.2 KĐT khác (gồm KHCN không thuộc 1.2.1) → VHT / VHT, trừ
     KĐT kinh doanh, BĐS, phương tiện vận tải → Tập đoàn. "Hệ thống CNTT nội bộ" chưa có trường dữ liệu → chưa có dòng (P-90).
     catalog.js thay bằng danh mục SCR-100 đang hoạt động. */
  D.kdtAuthRules = () => [
    { type: 'KHCN', field: '*', from: 0, to: 45, ct: 'TD', kdt: 'VHT', basis: 'UQ-GUQ §1.2.1' },
    { type: 'KHCN', field: '*', from: 45, to: null, ct: 'VHT', kdt: 'VHT', basis: 'UQ-GUQ §1.2.2' },
    { type: 'TBNB', field: '*', from: 0, to: null, ct: 'VHT', kdt: 'VHT', basis: 'UQ-GUQ §1.2.2' },
    { type: 'KHAC', field: '*', from: 0, to: null, ct: 'VHT', kdt: 'VHT', basis: 'UQ-GUQ §1.2.2' },
    { type: 'SXKD', field: '*', from: 0, to: null, ct: 'TD', kdt: 'TD', basis: 'UQ-GUQ §1.2.2 (ngoại trừ: hình thành TSCĐ phục vụ kinh doanh)' },
    { type: 'BDS', field: '*', from: 0, to: null, ct: 'TD', kdt: 'TD', basis: 'UQ-GUQ §1.2.2 (ngoại trừ: bất động sản)' },
    { type: 'PTVT', field: '*', from: 0, to: null, ct: 'TD', kdt: 'TD', basis: 'UQ-GUQ §1.2.2 (ngoại trừ: phương tiện vận tải)' }];
  D.kdtLevels = { VHT: 'VHT', TD: 'Tập đoàn' };
  /* Thẩm quyền theo 04 yếu tố + tổng mức vốn: dòng đầu khớp; không dòng nào khớp → VHT / VHT, ghi rõ để người dùng thấy. */
  D.kdtAuthOf = (k, total, rs) => {
    const r = (rs || D.kdtAuthRules()).find((x) => x.type === k.type && (x.field === '*' || x.field === k.field) && total >= x.from && (x.to == null || total < x.to));
    return r ? { ct: r.ct, kdt: r.kdt, basis: r.basis } : { ct: 'VHT', kdt: 'VHT', basis: 'Không có quy tắc khớp — mặc định VHT' };
  };

  /* Cảnh demo §2.4: task bắt đầu của mỗi cảnh (dùng cho "Nhảy tới cảnh"). */
  D.scenes = [
    { n: 1, name: 'Tạo luồng / ĐXMS, tạo hồ sơ, bóc tách', start: 'NEW', tasks: '—, 01–07', who: 'minh' },
    /* T29 B3a: Phòng QLTS / Thủ kho rà soát tồn kho (việc ngoài sơ đồ, SCR-105) khi hồ sơ ở bước 7. */
    /* T59 Q4: mở việc bước 7 (màn xử lý việc, tab Rà soát tồn kho); #/ra-soat-kho chỉ còn chuyển hướng. */
    { n: '1b', name: 'Kho rà soát tồn kho (Phòng QLTS)', start: 7, tasks: '07–07.1 (Kho, Chỉ huy Kho)', who: 'qlts', go: 'ra-soat-kho' },
    { n: 2, name: 'Báo giá (Thầu TTMS)', start: 8, tasks: '08–10.1', who: 'thau' },
    { n: 3, name: 'Dự thảo, chọn CQCM', start: 12, tasks: '12–18', who: 'minh' },
    { n: 4, name: 'Góp ý BM-04', start: 19, tasks: '19–25', who: 'hoa' },
    { n: 5, name: 'Giải trình, hoàn chỉnh, ký lại', start: 26, tasks: '26–37', who: 'minh' },
    { n: 6, name: 'BM-05', start: 42, tasks: '41–48', who: 'lan' },
    { n: 7, name: 'Nhánh Tập đoàn', start: 50, tasks: '49–56', who: 'lan' },
    { n: 8, name: 'Phê duyệt', start: 58, tasks: '57–61', who: 'lan' },
    { n: 9, name: 'Tổng kết', start: 'END', tasks: '—', who: 'lan' },
  ];

  /* Màn hình §4 — tên, và bước dựng chi tiết trong lộ trình T5. */
  D.screens = {
    'SCR-102': { name: 'Xử lý việc hợp đồng' },
    'SCR-105': { name: 'Rà soát tồn kho (việc của Phòng QLTS / Thủ kho)', step: 'T29 B3' },
    'SCR-00': { name: 'Chọn vai demo', step: 1 }, 'SCR-01': { name: 'Việc của tôi', step: 1 },
    'SCR-02': { name: 'Danh sách hồ sơ ĐXMS', step: 1 }, 'SCR-03': { name: 'Chọn căn cứ', step: 2 },
    'SCR-04': { name: 'Thông tin cơ bản', step: 2 }, 'SCR-05': { name: 'Bóc tách danh mục', step: 2 },
    'SCR-06': { name: 'Kết quả rà soát tồn kho', step: 2 }, 'SCR-07': { name: 'YCBG & báo giá', step: 2 },
    'SCR-08': { name: 'Soạn hồ sơ ĐXMS', step: 2 }, 'SCR-09': { name: 'Duyệt dự thảo cấp đơn vị', step: 2 },
    'SCR-10': { name: 'Phiếu yêu cầu thẩm định & chọn CQCM', step: 2 }, 'SCR-11': { name: 'Phiếu nhận xét BM-04', step: 3 },
    'SCR-12': { name: 'Tổng hợp ý kiến', step: 3 }, 'SCR-13': { name: 'Hoàn chỉnh & giải trình', step: 3 },
    'SCR-14': { name: 'Xét giải trình, họp', step: 3 }, 'SCR-15': { name: 'Kiểm tra lại & ký Checklist 01', step: 3 },
    'SCR-16': { name: 'BM-05 & kiểm tra song song', step: 3 }, 'SCR-17': { name: 'Ký BM-05', step: 3 },
    'SCR-18': { name: 'Báo cáo Tập đoàn', step: 4 }, 'SCR-19': { name: 'Quyết định phê duyệt BM-08', step: 4 },
    'SCR-20': { name: 'Chi tiết hồ sơ (KĐT, hợp đồng — ĐXMS dùng SCR-97 từ T34 v0.2)', step: 1 }, 'SCR-21': { name: 'Hộp thoại trình ký', step: 1 },
    'SCR-22': { name: 'Xác nhận danh sách CQCM', step: 6 },
    'SCR-23': { name: 'Ký thẩm định trực tiếp BM-09', step: 'T6' }, 'SCR-24': { name: 'Phê duyệt Tờ trình BM-09', step: 'T6' },
    'SCR-25': { name: 'Thêm mới hồ sơ', step: 6 }, 'SCR-26': { name: 'Xử lý ĐXMS không khớp quy trình', step: 6 },
    'SCR-27': { name: 'Danh sách ĐXMS', step: 12 }, 'SCR-28': { name: 'Thêm mới / Chỉnh sửa ĐXMS', step: 12 }, 'SCR-29': { name: 'Chi tiết ĐXMS', step: 12 },
    'SCR-57': { name: 'Xác nhận hình thành TSCĐ', step: 'T11' }, 'SCR-58': { name: 'Xác nhận 04 yếu tố & kết quả phân luồng', step: 'T11' },
    'SCR-59': { name: 'Soạn dự thảo KĐT', step: 'T11' }, 'SCR-66': { name: 'Thông báo chuyển luồng', step: 'T11' },
    'SCR-60': { name: 'Chọn CQCM, đơn vị chủ trì & trình hồ sơ', step: 'T11' }, 'SCR-61': { name: 'Thẩm định', step: 'T11' },
    'SCR-62': { name: 'Sửa, giải trình, họp', step: 'T11' }, 'SCR-64': { name: 'Lập hồ sơ phê duyệt KĐT', step: 'T11' },
    'SCR-65': { name: 'Báo cáo kết quả thẩm định BM-14 & dự thảo BM-18', step: 'T11' },
  };

  /* ---------- Hồ sơ mẫu §2.3 ---------- */
  /* Mã hồ sơ và quy trình do instance quyết định (Flow.ci()); ở đây là dữ liệu mẫu. */
  D.caseInfo = {
    title: 'Mua sắm thiết bị đo kiểm phục vụ phát triển trạm gNodeB thế hệ 2',
    unit: 'Trung tâm Vô tuyến',
    basis: 'QĐ phê duyệt nhiệm vụ KHCN "Phát triển trạm gNodeB thế hệ 2" (nguồn eBOM)',
    basisApprovedByGroup: false,
    purpose: 'Triển khai hoạt động KHCN',
    secret: false,
    priority: 'Khẩn',
    fund: 'Vốn KHCN, năm 2027',
    period: '01/2027 – 09/2027',
    total: 182.9,
  };
  /* stock = tồn khả dụng; book = tồn sổ sách, held = đang giữ cho tờ trình khác (heldFor); cost = loại chi phí ghi ở Phụ lục chi phí từ v2. */
  D.items = [
    { n: 1, name: 'Máy phân tích phổ vector 44 GHz', uom: 'Bộ', bom: 24, used: 4, prop: 20, stock: 0, buy: 20, price: 3.2, amount: 64, group: 1, goods: 'VTCNTT', cost: 'TSCĐ' },
    { n: 2, name: 'Máy phát tín hiệu vector', uom: 'Bộ', bom: 20, used: 0, prop: 20, stock: 0, buy: 20, price: 2.1, amount: 42, group: 1, goods: 'VTCNTT', cost: 'TSCĐ' },
    { n: 3, name: 'Hệ thống buồng đo OTA', uom: 'Hệ thống', bom: 2, used: 0, prop: 2, stock: 0, buy: 2, price: 28, amount: 56, group: 2, goods: 'NCSX', cost: 'TSCĐ' },
    { n: 4, name: 'Bộ kit hiệu chuẩn', uom: 'Bộ', bom: 40, used: 0, prop: 40, stock: 6, book: 8, held: 2, heldFor: 'ĐXMS-2026-0098', buy: 34, price: 0.35, amount: 11.9, group: 1, goods: 'VTCNTT', cost: 'TSCĐ' },
    { n: 5, name: 'Dịch vụ đào tạo, chuyển giao', uom: 'Gói', bom: null, used: null, prop: 1, stock: null, buy: 1, price: 9, amount: 9, group: 1, goods: 'DVPTV', cost: 'TSCĐ', warn: 'Hạng mục không có trong dự toán/eBOM' },
  ];

  /* ĐXMS mẫu (đối tượng cha, D-10 — như nhiệm vụ KHCN wf_tasks). est = giá trị dự kiến nhập khi tạo ĐXMS;
     giá trị hiệu lực suy từ hồ sơ Hoàn thành gần nhất (R4). Trạng thái ĐXMS suy từ hồ sơ (R5). */
  D.dxmsList = [
    /* T58 (12/11/2026, phuctd7 "mock thêm dữ liệu cho dễ kiểm chứng"): ĐXMS mẫu phủ thẩm định, giải trình, trình ký, phê duyệt, Mật, MS01.02, quá hạn,
       điều chỉnh lần 2, dừng theo chỉ đạo. Hồ sơ của các ĐXMS đang xử lý chạy được (Flow.runSample) — bấm nút trên thanh trạng thái hoặc mở từ Việc của tôi. */
    /* Chuỗi điều chỉnh riêng của T58 (0141 → 0142 lần 1 → 0140 lần 2), không đụng 0084 → 0112 của kịch bản T34 (0112 vẫn điều chỉnh được). */
    { code: 'ĐXMS-2026-0142', nv: 'KHN-2026-VHT', title: 'Mua sắm dịch vụ bảo trì hệ thống điều hoà phòng sạch', unit: 'Nhà máy sản xuất thử nghiệm', est: 7.9, priority: 'Thường', period: '07/2026 – 06/2027', creator: 'Phan Văn Lộc', created: '10/08/2026', updated: '05/09/2026', adjFrom: 'ĐXMS-2026-0141', adjN: 1, root: 'ĐXMS-2026-0141', reason: 'Bổ sung bảo trì 02 dàn lạnh lắp thêm cho phòng sạch số 2.' },
    { code: 'ĐXMS-2026-0141', nv: 'KHN-2026-VHT', title: 'Mua sắm dịch vụ bảo trì hệ thống điều hoà phòng sạch', unit: 'Nhà máy sản xuất thử nghiệm', est: 6.5, priority: 'Thường', period: '07/2026 – 06/2027', creator: 'Phan Văn Lộc', created: '02/06/2026', updated: '02/06/2026' },
    { code: 'ĐXMS-2026-0140', nv: 'KHN-2026-VHT', title: 'Mua sắm dịch vụ bảo trì hệ thống điều hoà phòng sạch', unit: 'Nhà máy sản xuất thử nghiệm', est: 9.2, priority: 'Khẩn', period: '07/2026 – 06/2027', creator: 'Phan Văn Lộc', created: '29/09/2026', updated: '03/10/2026', adjFrom: 'ĐXMS-2026-0142', adjN: 2, root: 'ĐXMS-2026-0141', reason: 'Thay máy nén dàn lạnh số 1 hỏng ngoài phạm vi bảo hành.' },
    { code: 'ĐXMS-2026-0139', nv: 'KHN-2026-VHT', title: 'Mua sắm bàn đo chống tĩnh điện (ESD) cho phòng lắp ráp', unit: 'Nhà máy sản xuất thử nghiệm', est: 4.6, priority: 'Thường', period: '10/2026 – 12/2026', creator: 'Phan Văn Lộc', created: '01/09/2026', updated: '28/09/2026' },
    { code: 'ĐXMS-2026-0138', nv: 'NV-KHCN-2026-014', title: 'Mua sắm buồng đo phản xạ anten dải tần thấp', unit: 'Phòng Chất lượng', est: 172.5, priority: 'Thường', period: '01/2027 – 12/2027', creator: 'Bùi Minh Quang', created: '26/08/2026', updated: '01/10/2026' },
    { code: 'ĐXMS-2026-0137', nv: 'NV-KHCN-2025-031', title: 'Mua sắm hệ thống lõi 5G SA phục vụ thử nghiệm liên mạng', unit: 'Trung tâm Mạng lõi', est: 230.0, priority: 'Khẩn', period: '11/2026 – 09/2027', creator: 'Đặng Thu Trang', created: '20/07/2026', updated: '30/09/2026' },
    { code: 'ĐXMS-2026-0136', nv: 'KHN-2026-TTVT', title: 'Mua sắm máy hiện sóng băng rộng 33 GHz', unit: 'Trung tâm Vô tuyến', est: 19.9, priority: 'Thường', period: '12/2026 – 03/2027', creator: 'Nguyễn Văn Minh', created: '27/09/2026', updated: '02/10/2026' },
    { code: 'ĐXMS-2026-0135', nv: 'KHN-2026-VHT', title: 'Mua sắm linh kiện thụ động cho mẫu thử bo nguồn', unit: 'Nhà máy sản xuất thử nghiệm', est: 8.4, priority: 'Thường', period: '11/2026 – 01/2027', creator: 'Phan Văn Lộc', created: '28/09/2026', updated: '01/10/2026' },
    { code: 'ĐXMS-2026-0134', nv: 'NV-KHCN-2026-006', title: 'Mua sắm máy phân tích mạng vector dải mmWave', unit: 'Trung tâm Vô tuyến', est: 165.0, priority: 'Thượng khẩn', period: '11/2026 – 06/2027', creator: 'Phan Thị Ngọc', created: '05/09/2026', updated: '22/09/2026' },
    { code: 'ĐXMS-2026-0133', nv: 'KHN-2026-TTVT', title: 'Mua sắm thiết bị mã hoá đường truyền chuyên dụng', unit: 'Trung tâm Vô tuyến', est: 15.8, priority: 'Khẩn', period: '11/2026 – 02/2027', creator: 'Nguyễn Văn Minh', created: '08/09/2026', updated: '29/09/2026', secret: true, sign: 'Bản cứng' },
    { code: 'ĐXMS-2026-0132', nv: 'DA-2026-002', title: 'Mua sắm hệ thống giám sát chất lượng dây chuyền SMT', unit: 'Nhà máy sản xuất thử nghiệm', est: 192.0, basisTD: true, priority: 'Thường', period: '01/2027 – 09/2027', creator: 'Phan Văn Lộc', created: '12/08/2026', updated: '30/09/2026' },
    { code: 'ĐXMS-2026-0131', nv: 'KHN-2026-VHT', title: 'Mua sắm máy đo công suất quang đa kênh', unit: 'Phòng Chất lượng', est: 27.6, priority: 'Thường', period: '11/2026 – 03/2027', creator: 'Bùi Minh Quang', created: '18/08/2026', updated: '01/10/2026' },
    { code: 'ĐXMS-2026-0130', nv: 'NV-KHCN-2026-014', title: 'Mua sắm bản quyền công cụ EDA thiết kế vi mạch', unit: 'Trung tâm Thiết kế vi mạch', est: 54.2, priority: 'Khẩn', period: '12/2026 – 12/2027', creator: 'Lương Thị Hạnh', created: '14/08/2026', updated: '30/09/2026' },
    { code: 'ĐXMS-2026-0129', nv: 'KHN-2026-VHT', title: 'Mua sắm lò hàn reflow cho dây chuyền mẫu', unit: 'Nhà máy sản xuất thử nghiệm', est: 38.5, priority: 'Thường', period: '12/2026 – 04/2027', creator: 'Phan Văn Lộc', created: '10/08/2026', updated: '28/09/2026' },
    { code: 'ĐXMS-2026-0128', nv: 'NV-KHCN-2026-006', title: 'Mua sắm hệ thống đo kiểm OTA cho trạm 5G-Advanced', unit: 'Trung tâm Vô tuyến', est: 186.0, priority: 'Khẩn', period: '01/2027 – 10/2027', creator: 'Nguyễn Văn Minh', created: '01/09/2026', updated: '24/09/2026' },
    /* T34 (D-85…D-89): ĐXMS điều chỉnh = ĐXMS mới, adjFrom = ĐXMS được điều chỉnh, adjN = lần điều chỉnh, root = ĐXMS gốc của chuỗi; dữ liệu chép từ ĐXMS cũ. */
    { code: 'ĐXMS-2026-0126', nv: 'DA-2026-002', title: 'Mua sắm dây chuyền lắp ráp bo mạch trạm thu phát', unit: 'Nhà máy sản xuất thử nghiệm', est: 248.9, priority: 'Khẩn', period: '09/2026 – 06/2027', creator: 'Phan Văn Lộc', created: '15/09/2026', updated: '25/09/2026', adjFrom: 'ĐXMS-2026-0077', adjN: 1, root: 'ĐXMS-2026-0077', reason: 'Bổ sung 02 trạm hàn chọn lọc theo thiết kế bo mạch mới; giá linh kiện tăng.' },
    { code: 'ĐXMS-2026-0124', nv: 'DA-2026-002', title: 'Mua sắm hệ thống đo kiểm sản xuất loạt module RRU 5G', unit: 'Trung tâm Vô tuyến', est: 176.4, basisTD: true, priority: 'Thường', period: '02/2027 – 10/2027', creator: 'Nguyễn Văn Minh', created: '25/09/2026', updated: '25/09/2026', purpose: 'Đo kiểm cuối dây chuyền cho sản xuất loạt module RRU 5G theo PAKD 1876/QĐ-TĐ.' },
    { code: 'ĐXMS-2026-0121', nv: 'KHN-2026-VHT', title: 'Mua sắm máy chủ phục vụ phòng lab AI', unit: 'Trung tâm Phần mềm', est: 12.4, priority: 'Thường', period: '11/2026 – 03/2027', creator: 'Lương Thị Hạnh', created: '22/09/2026', updated: '22/09/2026', purpose: 'Bổ sung năng lực tính toán cho phòng lab AI.' },
    { code: 'ĐXMS-2026-0119', nv: 'KHN-2026-VHT', title: 'Mua sắm máy in 3D kim loại cho xưởng mẫu', unit: 'Nhà máy sản xuất thử nghiệm', est: 28.5, priority: 'Thường', period: '01/2027 – 06/2027', creator: 'Phan Văn Lộc', created: '21/09/2026', updated: '21/09/2026', purpose: 'Chế tạo nhanh chi tiết cơ khí cho mẫu thử.' },
    { code: 'ĐXMS-2026-0112', nv: 'KHN-2026-VHT', title: 'Mua sắm dịch vụ thuê hạ tầng điện toán đám mây cho hệ thống OSS', unit: 'Trung tâm Phần mềm', est: 11.2, priority: 'Thường', period: '09/2026 – 08/2027', creator: 'Lương Thị Hạnh', created: '02/09/2026', updated: '20/09/2026', adjFrom: 'ĐXMS-2026-0084', adjN: 1, root: 'ĐXMS-2026-0084', reason: 'Tăng dung lượng lưu trữ theo số trạm tăng thêm năm 2027.' },
    { code: 'ĐXMS-2026-0110', nv: 'KHN-2026-TTVT', title: 'Mua sắm bộ đàm chuyên dụng cho đội thử nghiệm hiện trường', unit: 'Trung tâm Vô tuyến', est: 6.8, priority: 'Khẩn', period: '10/2026 – 12/2026', creator: 'Nguyễn Văn Minh', created: '15/09/2026', updated: '15/09/2026' },
    { code: 'ĐXMS-2026-0106', nv: 'KHN-2026-VHT', title: 'Mua sắm phần mềm thiết kế mạch in và mô phỏng tín hiệu', unit: 'Trung tâm Thiết kế vi mạch', est: 21.3, priority: 'Thường', period: '11/2026 – 12/2026', creator: 'Trịnh Quốc Việt', created: '01/09/2026', updated: '01/09/2026' },
    { code: 'ĐXMS-2026-0103', nv: 'NV-KHCN-2025-031', title: 'Mua sắm hệ thống mô phỏng mạng lõi 5G', unit: 'Trung tâm Mạng lõi', est: 210.5, priority: 'Thường', period: '10/2026 – 06/2027', creator: 'Đặng Thu Trang', created: '28/07/2026', updated: '28/07/2026' },
    { code: 'ĐXMS-2026-0101', nv: 'NV-KHCN-2026-014', title: 'Mua sắm thiết bị đo kiểm tương thích điện từ (EMC)', unit: 'Phòng Chất lượng', est: 168.0, priority: 'Khẩn', period: '01/2027 – 12/2027', creator: 'Bùi Minh Quang', created: '21/07/2026', updated: '21/07/2026' },
    { code: 'ĐXMS-2026-0098', nv: 'KHN-2026-TTVT', title: 'Mua sắm linh kiện RF cho mẫu thử nghiệm', unit: 'Trung tâm Vô tuyến', est: 45.2, priority: 'Thường', period: '11/2026 – 03/2027', creator: 'Nguyễn Văn Minh', created: '02/09/2026', updated: '02/09/2026', purpose: 'Linh kiện RF và vỏ cơ khí cho lô mẫu thử nghiệm module RRU.' },
    { code: 'ĐXMS-2026-0095', nv: 'KHN-2026-VHT', title: 'Mua sắm vật tư tiêu hao cho xưởng sản xuất thử', unit: 'Nhà máy sản xuất thử nghiệm', est: 3.9, priority: 'Thường', period: '09/2026 – 12/2026', creator: 'Phan Văn Lộc', created: '12/08/2026', updated: '12/08/2026' },
    { code: 'ĐXMS-2026-0089', nv: 'KHN-2026-VHT', title: 'Mua sắm thiết bị thử nghiệm môi trường', unit: 'Phòng Chất lượng', est: 18.7, priority: 'Thượng khẩn', period: '10/2026 – 03/2027', creator: 'Bùi Minh Quang', created: '04/08/2026', updated: '04/08/2026', secret: true },
    { code: 'ĐXMS-2026-0084', nv: 'KHN-2026-VHT', title: 'Mua sắm dịch vụ thuê hạ tầng điện toán đám mây cho hệ thống OSS', unit: 'Trung tâm Phần mềm', est: 9.6, priority: 'Thường', period: '09/2026 – 08/2027', creator: 'Lương Thị Hạnh', created: '20/07/2026', updated: '20/07/2026' },
    { code: 'ĐXMS-2026-0077', nv: 'DA-2026-002', title: 'Mua sắm dây chuyền lắp ráp bo mạch trạm thu phát', unit: 'Nhà máy sản xuất thử nghiệm', est: 236.4, priority: 'Khẩn', period: '09/2026 – 06/2027', creator: 'Phan Văn Lộc', created: '02/06/2026', updated: '02/06/2026' },
    { code: 'ĐXMS-2026-0072', nv: 'NV-KHCN-2026-006', title: 'Mua sắm anten mảng pha phục vụ đo kiểm', unit: 'Trung tâm Vô tuyến', est: 152.0, priority: 'Thường', period: '09/2026 – 03/2027', creator: 'Nguyễn Văn Minh', created: '25/05/2026', updated: '25/05/2026' },
    /* 17/11 (phuctd7 "mock thêm dữ liệu cho phần Hợp đồng và Thầu"): 6 ĐXMS đã phê duyệt làm nguồn cho KHLCNT-2026-0001 / 0002 / 0005 / 0007 / 0010 / 0012. */
    { code: 'ĐXMS-2026-0070', nv: 'KHN-2026-VHT', title: 'Mua sắm phần mềm quản lý vòng đời sản phẩm (PLM)', unit: 'Trung tâm Phần mềm', est: 24.8, priority: 'Thường', period: '10/2026 – 06/2027', creator: 'Lương Thị Hạnh', created: '06/07/2026', updated: '06/07/2026' },
    { code: 'ĐXMS-2026-0069', nv: 'NV-KHCN-2026-006', title: 'Mua sắm máy phát tín hiệu vector và bộ khuếch đại công suất', unit: 'Trung tâm Vô tuyến', est: 42.6, priority: 'Khẩn', period: '10/2026 – 03/2027', creator: 'Nguyễn Văn Minh', created: '15/06/2026', updated: '15/06/2026' },
    { code: 'ĐXMS-2026-0064', nv: 'KHN-2026-VHT', title: 'Mua sắm dịch vụ kiểm định, hiệu chuẩn thiết bị đo năm 2026', unit: 'Phòng Chất lượng', est: 5.4, priority: 'Thường', period: '06/2026 – 12/2026', creator: 'Bùi Minh Quang', created: '20/04/2026', updated: '20/04/2026' },
    { code: 'ĐXMS-2026-0053', nv: 'DA-2026-002', title: 'Mua sắm vật tư, linh kiện sản xuất thử lô RRU 5G', unit: 'Nhà máy sản xuất thử nghiệm', est: 64.0, priority: 'Khẩn', period: '07/2026 – 12/2026', creator: 'Phan Văn Lộc', created: '18/03/2026', updated: '18/03/2026' },
    { code: 'ĐXMS-2026-0047', nv: 'NV-KHCN-2026-014', title: 'Mua sắm dịch vụ tư vấn thẩm tra thiết kế vi mạch ASIC', unit: 'Trung tâm Thiết kế vi mạch', est: 12.0, priority: 'Thường', period: '05/2026 – 12/2026', creator: 'Trịnh Quốc Việt', created: '24/02/2026', updated: '24/02/2026' },
    { code: 'ĐXMS-2026-0044', nv: 'NV-KHCN-2025-031', title: 'Mua sắm thiết bị truyền dẫn quang cho phòng lab mạng lõi', unit: 'Trung tâm Mạng lõi', est: 33.0, priority: 'Thường', period: '04/2026 – 10/2026', creator: 'Đặng Thu Trang', created: '09/02/2026', updated: '09/02/2026' },
  ];

  /* T59 #44 (D-114): Nội dung căn cứ pháp lý mẫu (trường nhập ở Thêm mới ĐXMS) — ĐXMS-2026-0117 của luồng demo và vài ĐXMS mẫu. */
  D.legalSample = {
    'ĐXMS-2026-0117': 'Quyết định số 1482/QĐ-VHT ngày 12/03/2026 của Tổng Giám đốc Tổng Công ty phê duyệt nhiệm vụ KHCN "Phát triển trạm gNodeB thế hệ 2";\nQuy chế mua sắm hàng hóa, dịch vụ của Tổng Công ty ban hành kèm Quyết định số 0215/QĐ-VHT ngày 10/01/2026.',
    'ĐXMS-2026-0138': 'Quyết định giao nhiệm vụ KHCN NV-KHCN-2026-014; Quy chế mua sắm hàng hóa, dịch vụ của Tổng Công ty (Quyết định số 0215/QĐ-VHT ngày 10/01/2026).',
    'ĐXMS-2026-0134': 'Quyết định số 1482/QĐ-VHT ngày 12/03/2026 phê duyệt nhiệm vụ KHCN; Kế hoạch mua sắm năm 2026 của Trung tâm Vô tuyến.',
    'ĐXMS-2026-0132': 'Quyết định số 1876/QĐ-TĐ ngày 14/04/2026 của Tổng Giám đốc Tập đoàn phê duyệt dự án; Quy chế mua sắm hàng hóa, dịch vụ của Tổng Công ty.',
    'ĐXMS-2026-0128': 'Quyết định phê duyệt nhiệm vụ KHCN NV-KHCN-2026-006; Kế hoạch đầu tư phát triển năm 2027 (Quyết định số 2410/QĐ-VHT ngày 30/10/2026).',
  };
  /* T59 #47/#49: Thành phần tham gia mẫu (roleMembers — cùng nguồn khối Thành phần tham gia ở Lập ĐXMS, D-75) cho vài ĐXMS mẫu. */
  const ROLE_SAMPLE = {
    'ĐXMS-2026-0138': [{ role: 'R-DVDX-CQ', person: 'ngoc' }, { role: 'R-QLTS', person: 'qlts' }, { role: 'R-TTMS-THAU', person: 'thau' }],
    'ĐXMS-2026-0134': [{ role: 'R-DVDX-CQ', person: 'ngoc' }, { role: 'R-DVDX-CH', person: 'son' }],
  };
  D.dxmsList.forEach((x) => { if (!x.legal && D.legalSample[x.code]) x.legal = D.legalSample[x.code]; if (!x.roleMembers && ROLE_SAMPLE[x.code]) x.roleMembers = ROLE_SAMPLE[x.code]; });
  /* ĐXMS-2026-0124 (MS01.02) và ĐXMS-2026-0098 (MS01.03) chưa có hồ sơ: hồ sơ của hai ĐXMS này chạy luồng trên prototype (T6, D.demoCases).
     Hồ sơ mẫu (đối tượng con, như wf_profile): không chạy luồng, mở được chi tiết ở trạng thái của nó (rule A5).
     kind: PD (Phê duyệt, MS01.0x) | DC (Điều chỉnh, MS02). total = giá trị trình trong hồ sơ (với DC: giá trị sau điều chỉnh).
     st: processing | done | moved | stopped — ánh xạ sang nhãn/badge ở Screens.CASE_STATUS; task = số task BPMN đang chờ (step = tên task,
     hồ sơ MS02 lấy tên từ sơ đồ). late: quá hạn xử lý bước hiện tại (Giám sát tiến trình SCR-48 hiện Quá hạn). */
  D.otherCases = [
    /* T58: hồ sơ của ĐXMS mẫu mới. ui / pre / settle: như nhánh phụ của Công cụ demo — để tua nhanh tới đúng bước khi chạy (Flow.runSample). */
    { code: 'HS-2026-0142', dxms: 'ĐXMS-2026-0142', kind: 'DC', title: 'Điều chỉnh lần 1 — Mua sắm dịch vụ bảo trì hệ thống điều hoà phòng sạch', total: 7.9, flow: 'MS02', st: 'done', created: '10/08/2026', updated: '05/09/2026', creator: 'Phan Văn Lộc', reason: 'Bổ sung bảo trì 02 dàn lạnh lắp thêm cho phòng sạch số 2.' },
    { code: 'HS-2026-0141', dxms: 'ĐXMS-2026-0141', kind: 'PD', title: 'Mua sắm dịch vụ bảo trì hệ thống điều hoà phòng sạch', total: 6.5, flow: 'MS01.03', st: 'done', created: '02/06/2026', updated: '28/07/2026', creator: 'Phan Văn Lộc' },
    { code: 'HS-2026-0140', dxms: 'ĐXMS-2026-0140', kind: 'DC', title: 'Điều chỉnh lần 2 — Mua sắm dịch vụ bảo trì hệ thống điều hoà phòng sạch', total: 9.2, flow: 'MS02', st: 'processing', task: 13, created: '29/09/2026', updated: '03/10/2026', creator: 'Phan Văn Lộc', reason: 'Thay máy nén dàn lạnh số 1 hỏng ngoài phạm vi bảo hành.' },
    { code: 'HS-2026-0139', dxms: 'ĐXMS-2026-0139', kind: 'PD', title: 'Mua sắm bàn đo chống tĩnh điện (ESD) cho phòng lắp ráp', total: 4.6, flow: 'MS01.03', st: 'stopped', created: '01/09/2026', updated: '28/09/2026', creator: 'Phan Văn Lộc' },
    { code: 'HS-2026-0138', dxms: 'ĐXMS-2026-0138', kind: 'PD', title: 'Mua sắm buồng đo phản xạ anten dải tần thấp', total: 172.5, flow: 'MS01.01', st: 'processing', task: 20, created: '26/08/2026', updated: '01/10/2026', creator: 'Bùi Minh Quang' },
    { code: 'HS-2026-0137', dxms: 'ĐXMS-2026-0137', kind: 'PD', title: 'Mua sắm hệ thống lõi 5G SA phục vụ thử nghiệm liên mạng', total: 230.0, flow: 'MS01.01', st: 'processing', task: 58, created: '20/07/2026', updated: '30/09/2026', creator: 'Đặng Thu Trang' },
    { code: 'HS-2026-0136', dxms: 'ĐXMS-2026-0136', kind: 'PD', title: 'Mua sắm máy hiện sóng băng rộng 33 GHz', total: 19.9, flow: 'MS01.03', st: 'processing', task: 13, created: '27/09/2026', updated: '02/10/2026', creator: 'Nguyễn Văn Minh' },
    { code: 'HS-2026-0135', dxms: 'ĐXMS-2026-0135', kind: 'PD', title: 'Mua sắm linh kiện thụ động cho mẫu thử bo nguồn', total: 8.4, flow: 'MS01.03', st: 'processing', task: 7, created: '28/09/2026', updated: '01/10/2026', creator: 'Phan Văn Lộc' },
    { code: 'HS-2026-0134', dxms: 'ĐXMS-2026-0134', kind: 'PD', title: 'Mua sắm máy phân tích mạng vector dải mmWave', total: 165.0, flow: 'MS01.01', st: 'processing', task: 10, late: true, created: '05/09/2026', updated: '22/09/2026', creator: 'Phan Thị Ngọc' },
    { code: 'HS-2026-0133', dxms: 'ĐXMS-2026-0133', kind: 'PD', title: 'Mua sắm thiết bị mã hoá đường truyền chuyên dụng', total: 15.8, flow: 'MS01.03', st: 'processing', task: 26, created: '08/09/2026', updated: '29/09/2026', creator: 'Nguyễn Văn Minh' },
    { code: 'HS-2026-0132', dxms: 'ĐXMS-2026-0132', kind: 'PD', title: 'Mua sắm hệ thống giám sát chất lượng dây chuyền SMT', total: 192.0, flow: 'MS01.02', st: 'processing', task: 48, created: '12/08/2026', updated: '30/09/2026', creator: 'Phan Văn Lộc' },
    { code: 'HS-2026-0131', dxms: 'ĐXMS-2026-0131', kind: 'PD', title: 'Mua sắm máy đo công suất quang đa kênh', total: 27.6, flow: 'MS01.03', st: 'processing', task: 60, created: '18/08/2026', updated: '01/10/2026', creator: 'Bùi Minh Quang' },
    { code: 'HS-2026-0130', dxms: 'ĐXMS-2026-0130', kind: 'PD', title: 'Mua sắm bản quyền công cụ EDA thiết kế vi mạch', total: 54.2, flow: 'MS01.03', st: 'processing', task: 39, created: '14/08/2026', updated: '30/09/2026', creator: 'Lương Thị Hạnh' },
    { code: 'HS-2026-0129', dxms: 'ĐXMS-2026-0129', kind: 'PD', title: 'Mua sắm lò hàn reflow cho dây chuyền mẫu', total: 38.5, flow: 'MS01.03', st: 'processing', task: 28, created: '10/08/2026', updated: '28/09/2026', creator: 'Phan Văn Lộc', ui: { resp: { TC: 'Bảo lưu' } } },
    { code: 'HS-2026-0128', dxms: 'ĐXMS-2026-0128', kind: 'PD', title: 'Mua sắm hệ thống đo kiểm OTA cho trạm 5G-Advanced', total: 186.0, flow: 'MS01.01', st: 'processing', task: 19, created: '01/09/2026', updated: '24/09/2026', creator: 'Nguyễn Văn Minh' },
    { code: 'HS-2026-0126', dxms: 'ĐXMS-2026-0126', kind: 'DC', title: 'Điều chỉnh lần 1 — Mua sắm dây chuyền lắp ráp bo mạch trạm thu phát', total: 248.9, flow: 'MS02', st: 'processing', task: 19, created: '15/09/2026', updated: '25/09/2026', creator: 'Phan Văn Lộc', reason: 'Bổ sung 02 trạm hàn chọn lọc theo thiết kế bo mạch mới; giá linh kiện tăng.' },
    { code: 'HS-2026-0121', dxms: 'ĐXMS-2026-0121', kind: 'PD', title: 'Mua sắm máy chủ phục vụ phòng lab AI', total: 12.4, flow: 'MS01.03', st: 'processing', task: 4, step: 'Rà soát và xác nhận thông tin cơ bản', created: '22/09/2026', updated: '26/09/2026', creator: 'Lương Thị Hạnh' },
    { code: 'HS-2026-0112', dxms: 'ĐXMS-2026-0112', kind: 'DC', title: 'Điều chỉnh lần 1 — Mua sắm dịch vụ thuê hạ tầng điện toán đám mây cho hệ thống OSS', total: 11.2, flow: 'MS02', st: 'done', created: '02/09/2026', updated: '20/09/2026', creator: 'Lương Thị Hạnh', reason: 'Tăng dung lượng lưu trữ theo số trạm tăng thêm năm 2027.' },
    { code: 'HS-2026-0110', dxms: 'ĐXMS-2026-0110', kind: 'PD', title: 'Mua sắm bộ đàm chuyên dụng cho đội thử nghiệm hiện trường', total: 6.8, flow: 'MS01.03', st: 'processing', task: 16, step: 'Lập phiếu yêu cầu thẩm định và chọn CQCM', created: '15/09/2026', updated: '23/09/2026', creator: 'Nguyễn Văn Minh' },
    { code: 'HS-2026-0106', dxms: 'ĐXMS-2026-0106', kind: 'PD', title: 'Mua sắm phần mềm thiết kế mạch in và mô phỏng tín hiệu', total: 21.3, flow: 'MS01.03', st: 'processing', task: 27, step: 'Hoàn chỉnh hồ sơ trình ĐXMS', created: '01/09/2026', updated: '22/09/2026', creator: 'Trịnh Quốc Việt' },
    { code: 'HS-2026-0103', dxms: 'ĐXMS-2026-0103', kind: 'PD', title: 'Mua sắm hệ thống mô phỏng mạng lõi 5G', total: 210.5, flow: 'MS01.02', st: 'done', created: '28/07/2026', updated: '19/09/2026', creator: 'Đặng Thu Trang' },
    { code: 'HS-2026-0101', dxms: 'ĐXMS-2026-0101', kind: 'PD', title: 'Mua sắm thiết bị đo kiểm tương thích điện từ (EMC)', total: 168.0, flow: 'MS01.01', st: 'processing', task: 53, late: true, step: 'Xem xét hồ sơ, lập Báo cáo gửi TGĐ Tập đoàn', created: '21/07/2026', updated: '18/09/2026', creator: 'Bùi Minh Quang' },
    { code: 'HS-2026-0095', dxms: 'ĐXMS-2026-0095', kind: 'PD', title: 'Mua sắm vật tư tiêu hao cho xưởng sản xuất thử', total: 3.9, flow: 'MS01.03', st: 'stopped', created: '12/08/2026', updated: '11/09/2026', creator: 'Phan Văn Lộc' },
    { code: 'HS-2026-0089', dxms: 'ĐXMS-2026-0089', kind: 'PD', title: 'Mua sắm thiết bị thử nghiệm môi trường', total: 18.7, flow: 'MS01.03', st: 'done', created: '04/08/2026', updated: '05/09/2026', creator: 'Bùi Minh Quang' },
    { code: 'HS-2026-0084', dxms: 'ĐXMS-2026-0084', kind: 'PD', title: 'Mua sắm dịch vụ thuê hạ tầng điện toán đám mây cho hệ thống OSS', total: 9.6, flow: 'MS01.03', st: 'done', created: '20/07/2026', updated: '28/08/2026', creator: 'Lương Thị Hạnh' },
    { code: 'HS-2026-0077', dxms: 'ĐXMS-2026-0077', kind: 'PD', title: 'Mua sắm dây chuyền lắp ráp bo mạch trạm thu phát', total: 236.4, flow: 'MS01.01', st: 'done', created: '02/06/2026', updated: '14/08/2026', creator: 'Phan Văn Lộc' },
    { code: 'HS-2026-0072', dxms: 'ĐXMS-2026-0072', kind: 'PD', title: 'Mua sắm anten mảng pha phục vụ đo kiểm', total: 152.0, flow: 'MS01.03', st: 'done', created: '25/05/2026', updated: '08/08/2026', creator: 'Nguyễn Văn Minh' },
    { code: 'HS-2026-0070', dxms: 'ĐXMS-2026-0070', kind: 'PD', title: 'Mua sắm phần mềm quản lý vòng đời sản phẩm (PLM)', total: 24.8, flow: 'MS01.03', st: 'done', created: '06/07/2026', updated: '28/08/2026', creator: 'Lương Thị Hạnh' },
    { code: 'HS-2026-0069', dxms: 'ĐXMS-2026-0069', kind: 'PD', title: 'Mua sắm máy phát tín hiệu vector và bộ khuếch đại công suất', total: 42.6, flow: 'MS01.03', st: 'done', created: '15/06/2026', updated: '05/08/2026', creator: 'Nguyễn Văn Minh' },
    { code: 'HS-2026-0064', dxms: 'ĐXMS-2026-0064', kind: 'PD', title: 'Mua sắm dịch vụ kiểm định, hiệu chuẩn thiết bị đo năm 2026', total: 5.4, flow: 'MS01.03', st: 'done', created: '20/04/2026', updated: '22/05/2026', creator: 'Bùi Minh Quang' },
    { code: 'HS-2026-0053', dxms: 'ĐXMS-2026-0053', kind: 'PD', title: 'Mua sắm vật tư, linh kiện sản xuất thử lô RRU 5G', total: 64.0, flow: 'MS01.03', st: 'done', created: '18/03/2026', updated: '05/05/2026', creator: 'Phan Văn Lộc' },
    { code: 'HS-2026-0047', dxms: 'ĐXMS-2026-0047', kind: 'PD', title: 'Mua sắm dịch vụ tư vấn thẩm tra thiết kế vi mạch ASIC', total: 12.0, flow: 'MS01.03', st: 'done', created: '24/02/2026', updated: '27/03/2026', creator: 'Trịnh Quốc Việt' },
    { code: 'HS-2026-0044', dxms: 'ĐXMS-2026-0044', kind: 'PD', title: 'Mua sắm thiết bị truyền dẫn quang cho phòng lab mạng lõi', total: 33.0, flow: 'MS01.03', st: 'done', created: '09/02/2026', updated: '12/03/2026', creator: 'Đặng Thu Trang' },
  ];

  /* ---------- Khoản đầu tư (PH09, plan KĐT v0.3) ----------
     KĐT là đối tượng cha (D-12), tạo ở SCR-55 không start quy trình. Trường KĐT: lĩnh vực / loại KĐT / tính chất tài sản = mã DMDC SCR-33/34/35;
     est = tổng mức vốn dự kiến (tỷ đồng). KĐT-2026-0032 (kịch bản chính) chưa có — tạo trên prototype ở cảnh 1; 0033 (nhánh chuyển MS14) chưa có hồ sơ. */
  D.kdtCode0 = 'KĐT-2026-0032';
  D.kdtList = [
    /* T58: KĐT mẫu phủ thẩm định chủ trương, họp lần 2, ký chủ trương (quá hạn), gộp BM-00 Mật, chủ trương thuộc thẩm quyền Tập đoàn, hồ sơ KĐT ở bước báo cáo,
       KĐT phức tạp (MS15, chưa có hồ sơ). */
    { code: 'KĐT-2026-0040', nv: 'KHN-2027-DTPT', title: 'Đầu tư trung tâm dữ liệu sản xuất thông minh', unit: 'Nhà máy sản xuất thử nghiệm', field: 'VTCNTT', type: 'KHAC', nature: 'TICH_HOP', est: 1250.0, period: '01/2027 – 12/2028', creator: 'Phan Văn Lộc', created: '02/10/2026', updated: '02/10/2026', purpose: 'Hạ tầng dữ liệu tập trung cho các dây chuyền sản xuất loạt.' },
    { code: 'KĐT-2026-0039', nv: 'NV-KHCN-2026-006', title: 'Đầu tư hệ thống kiểm thử tương thích thiết bị đầu cuối 5G', unit: 'Trung tâm Vô tuyến', field: 'VTCNTT', type: 'KHCN', nature: 'TICH_HOP', est: 88.0, period: '11/2026 – 09/2027', creator: 'Nguyễn Văn Minh', created: '05/05/2026', updated: '29/09/2026', purpose: 'Kiểm thử tương thích thiết bị đầu cuối với trạm 5G VHT.' },
    { code: 'KĐT-2026-0038', nv: 'NV-KHCN-2026-014', title: 'Đầu tư phòng thí nghiệm vật liệu bán dẫn công suất', unit: 'Trung tâm Thiết kế vi mạch', field: 'VTCNTT', type: 'KHCN', nature: 'TICH_HOP', est: 32.0, period: '01/2027 – 10/2027', creator: 'Lương Thị Hạnh', created: '20/07/2026', updated: '30/09/2026', purpose: 'Đo đặc tính vật liệu GaN cho bộ khuếch đại công suất.' },
    { code: 'KĐT-2026-0037', nv: 'KHN-2026-TTVT', title: 'Trang bị thiết bị mã hoá cho phòng thử nghiệm bảo mật', unit: 'Trung tâm Vô tuyến', field: 'VTCNTT', type: 'TBNB', nature: 'NGUYEN_CHIEC', est: 9.5, period: '11/2026 – 01/2027', creator: 'Nguyễn Văn Minh', created: '15/09/2026', updated: '01/10/2026', purpose: 'Thay thiết bị mã hoá đã hết hạn chứng nhận.', secret: true },
    { code: 'KĐT-2026-0036', nv: 'KHN-2027-DTPT', title: 'Đầu tư hệ thống quản lý vòng đời sản phẩm (PLM)', unit: 'Trung tâm Phần mềm', field: 'VTCNTT', type: 'TBNB', nature: 'TICH_HOP', est: 48.0, period: '12/2026 – 09/2027', creator: 'Lương Thị Hạnh', created: '10/06/2026', updated: '21/09/2026', purpose: 'Quản lý thiết kế, BOM và thay đổi kỹ thuật tập trung.' },
    { code: 'KĐT-2026-0035', nv: 'NV-KHCN-2025-031', title: 'Đầu tư hệ thống mô phỏng lưu lượng mạng lõi', unit: 'Trung tâm Mạng lõi', field: 'VTCNTT', type: 'KHCN', nature: 'TICH_HOP', est: 66.0, period: '01/2027 – 12/2027', creator: 'Đặng Thu Trang', created: '28/06/2026', updated: '30/09/2026', purpose: 'Mô phỏng tải mạng lõi 5G SA trước khi triển khai.' },
    { code: 'KĐT-2026-0034', nv: 'NV-KHCN-2026-006', title: 'Đầu tư hệ thống thử nghiệm mạng truy nhập vô tuyến mở (O-RAN)', unit: 'Trung tâm Vô tuyến', field: 'VTCNTT', type: 'KHCN', nature: 'TICH_HOP', est: 72.0, period: '01/2027 – 12/2027', creator: 'Nguyễn Văn Minh', created: '02/07/2026', updated: '27/09/2026', purpose: 'Thử nghiệm tương tác O-RAN giữa RU, DU, CU của VHT và đối tác.' },
    { code: 'KĐT-2026-0033', nv: 'KHN-2027-DTPT', title: 'Mở rộng dây chuyền SMT cho nhà máy sản xuất thử nghiệm', unit: 'Nhà máy sản xuất thử nghiệm', field: 'KHAC', type: 'KHAC', nature: 'TICH_HOP', est: 85.0, period: '01/2027 – 12/2027', creator: 'Phan Văn Lộc', created: '26/09/2026', updated: '26/09/2026', purpose: 'Tăng công suất lắp ráp bo mạch cho sản xuất loạt.' },
    { code: 'KĐT-2026-0031', nv: 'DT-KHCN-2027-002', title: 'Trang bị máy trạm thiết kế cho Trung tâm Vô tuyến', unit: 'Trung tâm Vô tuyến', field: 'VTCNTT', type: 'TBNB', nature: 'NGUYEN_CHIEC', est: 12.4, period: '11/2026 – 02/2027', creator: 'Nguyễn Văn Minh', created: '21/09/2026', updated: '25/09/2026', purpose: 'Thay máy trạm thiết kế RF đã hết khấu hao.' },
    { code: 'KĐT-2026-0030', nv: 'NV-KHCN-2026-014', title: 'Đầu tư phòng đo tương thích điện từ di động', unit: 'Phòng Chất lượng', field: 'VTCNTT', type: 'KHCN', nature: 'TICH_HOP', est: 64.0, period: '01/2027 – 09/2027', creator: 'Bùi Minh Quang', created: '18/09/2026', updated: '24/09/2026', purpose: 'Đo EMC tại hiện trường cho sản phẩm trạm thu phát.' },
    { code: 'KĐT-2026-0029', nv: 'NV-KHCN-2025-031', title: 'Đầu tư hệ thống kiểm thử phần mềm tự động cho OSS', unit: 'Trung tâm Phần mềm', field: 'VTCNTT', type: 'TBNB', nature: 'TICH_HOP', est: 22.8, period: '12/2026 – 06/2027', creator: 'Lương Thị Hạnh', created: '10/09/2026', updated: '23/09/2026', purpose: 'Tự động hoá kiểm thử hồi quy hệ thống OSS.' },
    { code: 'KĐT-2026-0028', nvs: ['KHN-2027-DTPT', 'NV-KHCN-2026-014'], title: 'Đầu tư dây chuyền đóng gói module quang', unit: 'Nhà máy sản xuất thử nghiệm', field: 'KHAC', type: 'KHCN', nature: 'TICH_HOP', est: 74.5, period: '10/2026 – 06/2027', creator: 'Phan Văn Lộc', created: '12/06/2026', updated: '22/09/2026', purpose: 'Đóng gói module quang tốc độ cao phục vụ đề tài KHCN.' },
    { code: 'KĐT-2026-0027', nv: 'NV-KHCN-2026-014', title: 'Đầu tư hệ thống mô phỏng kênh vô tuyến MIMO', unit: 'Trung tâm Vô tuyến', field: 'VTCNTT', type: 'KHCN', nature: 'TICH_HOP', est: 128.0, period: '01/2027 – 12/2027', creator: 'Nguyễn Văn Minh', created: '02/07/2026', updated: '21/09/2026', purpose: 'Mô phỏng kênh MIMO kích thước lớn cho nghiên cứu 5G-A.' },
    { code: 'KĐT-2026-0026', nv: 'KHN-2027-DTPT', title: 'Đầu tư phòng thí nghiệm an toàn thông tin', unit: 'Trung tâm Phần mềm', field: 'VTCNTT', type: 'KHCN', nature: 'TICH_HOP', est: 58.0, period: '11/2026 – 08/2027', creator: 'Lương Thị Hạnh', created: '20/06/2026', updated: '19/09/2026', purpose: 'Kiểm thử bảo mật thiết bị mạng và phần mềm.' },
    { code: 'KĐT-2026-0025', nvs: ['DA-2026-002', 'KHN-2026-TTVT'], title: 'Đầu tư nền tảng dữ liệu sản xuất thông minh (MES)', unit: 'Nhà máy sản xuất thử nghiệm', field: 'VTCNTT', type: 'TBNB', nature: 'TICH_HOP', est: 44.6, period: '10/2026 – 05/2027', creator: 'Phan Văn Lộc', created: '05/06/2026', updated: '18/09/2026', purpose: 'Thu thập, truy vết dữ liệu sản xuất theo lô.' },
    { code: 'KĐT-2026-0024', nv: 'NV-KHCN-2026-006', title: 'Đầu tư trạm thử nghiệm vệ tinh mặt đất', unit: 'Trung tâm Vô tuyến', field: 'VTCNTT', type: 'KHCN', nature: 'TICH_HOP', est: 97.3, period: '01/2027 – 12/2027', creator: 'Nguyễn Văn Minh', created: '28/05/2026', updated: '17/09/2026', purpose: 'Thử nghiệm kết nối vệ tinh quỹ đạo thấp.' },
    /* T45 (D-103): KĐT đã phê duyệt chủ trương (HS-2026-0023, BM-01), chưa có hồ sơ phê duyệt KĐT — mẫu để Thêm mới hồ sơ phê duyệt KĐT. */
    { code: 'KĐT-2026-0023', nvs: ['NV-KHCN-2026-006', 'NV-KHCN-2026-014'], title: 'Đầu tư hệ thống đo kiểm thiết bị 5G mmWave', unit: 'Trung tâm Vô tuyến', field: 'VTCNTT', type: 'KHCN', nature: 'TICH_HOP', est: 52.0, period: '01/2027 – 10/2027', creator: 'Nguyễn Văn Minh', created: '20/05/2026', updated: '05/10/2026', purpose: 'Đo kiểm bức xạ và hiệu năng thiết bị đầu cuối 5G dải mmWave phục vụ nhiệm vụ KHCN.', legal: 'Quyết định giao kế hoạch KHCN năm 2027 của VHT.', secret: false },
    { code: 'KĐT-2026-0021', nv: 'KHN-2027-DTPT', title: 'Đầu tư hệ thống in 3D kim loại công nghiệp', unit: 'Nhà máy sản xuất thử nghiệm', field: 'KHAC', type: 'TBNB', nature: 'TICH_HOP', est: 35.0, period: '09/2026 – 03/2027', creator: 'Phan Văn Lộc', created: '14/04/2026', updated: '28/08/2026', purpose: 'Chế tạo chi tiết cơ khí phức tạp cho mẫu thử.' },
    { code: 'KĐT-2026-0018', nv: 'DA-2026-002', title: 'Đầu tư dây chuyền SMT thế hệ mới', unit: 'Nhà máy sản xuất thử nghiệm', field: 'KHAC', type: 'KHAC', nature: 'TICH_HOP', est: 82.0, period: '10/2026 – 09/2027', creator: 'Phan Văn Lộc', created: '02/04/2026', updated: '26/08/2026', purpose: 'Thay dây chuyền SMT cũ, tăng độ chính xác gắn linh kiện.' },
    { code: 'KĐT-2026-0015', nv: 'KHN-2026-TTVT', title: 'Trang bị máy đo phổ cầm tay cho đội thử nghiệm hiện trường', unit: 'Trung tâm Vô tuyến', field: 'VTCNTT', type: 'TBNB', nature: 'NGUYEN_CHIEC', est: 8.6, period: '07/2026 – 09/2026', creator: 'Nguyễn Văn Minh', created: '11/03/2026', updated: '30/07/2026', purpose: 'Đo kiểm vùng phủ tại hiện trường.' },
    { code: 'KĐT-2026-0012', nv: 'DT-KHCN-2027-002', title: 'Đầu tư hệ thống đo kiểm anten trong buồng vi sóng', unit: 'Trung tâm Vô tuyến', field: 'VTCNTT', type: 'KHCN', nature: 'TICH_HOP', est: 136.0, period: '06/2026 – 03/2027', creator: 'Nguyễn Văn Minh', created: '20/01/2026', updated: '15/07/2026', purpose: 'Đo đồ thị bức xạ anten mảng pha.', secret: true },
  ];
  /* T45 (D-104): KĐT chọn nhiều đề tài / dự án — nvs; nv = nvs[0] để tương thích. KĐT-2026-0030 có thêm NV-KHCN-2026-006 (lĩnh vực khác, không chặn — GIẢ LẬP). */
  D.kdtList.find((x) => x.code === 'KĐT-2026-0030').nvs = ['NV-KHCN-2026-014', 'NV-KHCN-2026-006'];
  D.kdtList.forEach((x) => { if (!x.nvs) x.nvs = x.nv ? [x.nv] : []; x.nv = x.nvs[0] || null; });
  /* Hồ sơ mẫu của KĐT (đối tượng con). flow: MS13 / MS14, null = chưa xác định nhóm (trước bước 12, D-7). branch: BM00 (gộp) / 2GD (BM-01 → BM-03).
     stage = trạng thái KĐT suy từ hồ sơ (kdt.js KDT_STAGE); task = bước đang chờ (tên lấy từ BPMN_FLOWS.MS13, MS14 từ sơ đồ);
     total = tổng mức vốn thực tế sau báo giá (task 10). docs = văn bản đầu ra đã có. Luồng MS13 chạy được từ B2.
     T45 (D-103): kind CT = Hồ sơ phê duyệt chủ trương KĐT (bước 1–48; gộp BM-00 = scope CT_KDT, chạy tới 62); kind KDT = Hồ sơ phê duyệt KĐT
     (mã <mã CT>-2, parent = hồ sơ CT, luongCt = luồng của CT, est = Tổng mức vốn KĐT, lech = lệch luồng so với chủ trương hoặc null; MS13 từ bước 49).
     HS-2026-0026-2: chủ trương MS13, Tổng mức vốn KĐT vượt ngưỡng → MS14 (bản ghi tĩnh bước 46, GIẢ LẬP — prototype chưa có luồng MS14 chạy được). */
  D.kdtCases = [
    /* T58: hồ sơ của KĐT mẫu mới (ui / pre như nhánh phụ của Công cụ demo để tua tới đúng bước khi chạy). */
    { code: 'HS-2026-0039-2', kdt: 'KĐT-2026-0039', kind: 'KDT', parent: 'HS-2026-0039', luongCt: 'MS13', est: 90.5, lech: null, flow: 'MS13', branch: '2GD', stage: 'KYQD', st: 'processing', task: 57, total: 90.5, created: '20/08/2026', updated: '29/09/2026', creator: 'Nguyễn Văn Minh' },
    { code: 'HS-2026-0039', kdt: 'KĐT-2026-0039', kind: 'CT', scope: 'CT', flow: 'MS13', branch: '2GD', stage: 'CT_OK', st: 'done', total: 90.5, created: '05/05/2026', updated: '18/08/2026', creator: 'Nguyễn Văn Minh', docs: [['BM-01', '18/08/2026']] },
    { code: 'HS-2026-0038', kdt: 'KĐT-2026-0038', kind: 'CT', scope: 'CT', flow: 'MS13', branch: '2GD', stage: 'KYCT', st: 'processing', task: 64, total: 32.0, created: '20/07/2026', updated: '30/09/2026', creator: 'Lương Thị Hạnh' },
    { code: 'HS-2026-0037', kdt: 'KĐT-2026-0037', kind: 'CT', scope: 'CT_KDT', flow: 'MS13', branch: 'BM00', stage: 'GOP', st: 'processing', task: 21, total: 9.5, created: '15/09/2026', updated: '01/10/2026', creator: 'Nguyễn Văn Minh', ui: { secret: true } },
    { code: 'HS-2026-0036', kdt: 'KĐT-2026-0036', kind: 'CT', scope: 'CT', flow: 'MS13', branch: '2GD', stage: 'KYCT', st: 'processing', task: 47, late: true, total: 48.0, created: '10/06/2026', updated: '21/09/2026', creator: 'Lương Thị Hạnh' },
    { code: 'HS-2026-0035', kdt: 'KĐT-2026-0035', kind: 'CT', scope: 'CT', flow: 'MS13', branch: '2GD', stage: 'TDCT', st: 'processing', task: 32, total: 66.0, created: '28/06/2026', updated: '30/09/2026', creator: 'Đặng Thu Trang', pre: { meet: { CT: 1 } } },
    { code: 'HS-2026-0034', kdt: 'KĐT-2026-0034', kind: 'CT', scope: 'CT', flow: 'MS13', branch: '2GD', stage: 'TDCT', st: 'processing', task: 29, total: 72.0, created: '02/07/2026', updated: '27/09/2026', creator: 'Nguyễn Văn Minh' },
    { code: 'HS-2026-0031', kdt: 'KĐT-2026-0031', kind: 'CT', scope: 'CT_KDT', flow: 'MS13', branch: 'BM00', stage: 'GOP', st: 'processing', task: 19, total: 12.4, created: '21/09/2026', updated: '25/09/2026', creator: 'Nguyễn Văn Minh' },
    { code: 'HS-2026-0030', kdt: 'KĐT-2026-0030', kind: 'CT', scope: 'CT', flow: null, stage: 'LAP', st: 'processing', task: 8, created: '18/09/2026', updated: '24/09/2026', creator: 'Bùi Minh Quang' },
    { code: 'HS-2026-0029', kdt: 'KĐT-2026-0029', kind: 'CT', scope: 'CT', flow: null, stage: 'PL', st: 'processing', task: 11, tasks: [11, 12], total: 23.5, created: '10/09/2026', updated: '23/09/2026', creator: 'Lương Thị Hạnh' },
    { code: 'HS-2026-0028-2', kdt: 'KĐT-2026-0028', kind: 'KDT', parent: 'HS-2026-0028', luongCt: 'MS13', est: 76.2, lech: null, flow: 'MS13', branch: '2GD', stage: 'KYQD', st: 'processing', task: 60, total: 76.2, created: '17/08/2026', updated: '22/09/2026', creator: 'Phan Văn Lộc', docs: [['BM-14', '19/09/2026']] },
    { code: 'HS-2026-0028', kdt: 'KĐT-2026-0028', kind: 'CT', scope: 'CT', flow: 'MS13', branch: '2GD', stage: 'CT_OK', st: 'done', total: 76.2, created: '12/06/2026', updated: '14/08/2026', creator: 'Phan Văn Lộc', docs: [['BM-01', '14/08/2026']] },
    { code: 'HS-2026-0027-2', kdt: 'KĐT-2026-0027', kind: 'KDT', parent: 'HS-2026-0027', luongCt: 'MS13', est: 131.2, lech: null, flow: 'MS13', branch: '2GD', stage: 'TDKDT', st: 'processing', task: 55, late: true, total: 131.2, created: '31/08/2026', updated: '21/09/2026', creator: 'Nguyễn Văn Minh' },
    { code: 'HS-2026-0027', kdt: 'KĐT-2026-0027', kind: 'CT', scope: 'CT', flow: 'MS13', branch: '2GD', stage: 'CT_OK', st: 'done', total: 131.2, created: '02/07/2026', updated: '28/08/2026', creator: 'Nguyễn Văn Minh', docs: [['BM-01', '28/08/2026']] },
    { code: 'HS-2026-0026-2', kdt: 'KĐT-2026-0026', kind: 'KDT', parent: 'HS-2026-0026', luongCt: 'MS13', est: 172.0, flow: 'MS14', stage: 'HS', st: 'processing', task: 46, total: 172.0, created: '17/09/2026', updated: '19/09/2026', creator: 'Lương Thị Hạnh',
      lech: { from: 'MS13', to: 'MS14', reason: 'Bổ sung hệ thống kiểm thử xâm nhập phần cứng và buồng cách ly theo kết luận thẩm định chủ trương; tổng mức vốn KĐT tăng từ 57,4 lên 172 tỷ đồng, vượt ngưỡng MS13.' } },
    { code: 'HS-2026-0026', kdt: 'KĐT-2026-0026', kind: 'CT', scope: 'CT', flow: 'MS13', branch: '2GD', stage: 'CT_OK', st: 'done', total: 57.4, created: '20/06/2026', updated: '16/09/2026', creator: 'Lương Thị Hạnh', docs: [['BM-01', '16/09/2026']] },
    { code: 'HS-2026-0025', kdt: 'KĐT-2026-0025', kind: 'CT', scope: 'CT', flow: 'MS13', branch: '2GD', stage: 'KYCT', st: 'processing', task: 48, total: 45.1, created: '05/06/2026', updated: '18/09/2026', creator: 'Phan Văn Lộc' },
    { code: 'HS-2026-0024', kdt: 'KĐT-2026-0024', kind: 'CT', scope: 'CT', flow: 'MS13', branch: '2GD', stage: 'TDCT', st: 'processing', task: 46, total: 98.6, created: '28/05/2026', updated: '17/09/2026', creator: 'Nguyễn Văn Minh' },
    { code: 'HS-2026-0023', kdt: 'KĐT-2026-0023', kind: 'CT', scope: 'CT', flow: 'MS13', branch: '2GD', stage: 'CT_OK', st: 'done', total: 52.6, created: '20/05/2026', updated: '05/10/2026', creator: 'Nguyễn Văn Minh', docs: [['BM-01', '05/10/2026']] },
    { code: 'HS-2026-0021', kdt: 'KĐT-2026-0021', kind: 'CT', scope: 'CT', flow: 'MS13', branch: '2GD', stage: 'STOP', st: 'stopped', total: 35.0, created: '14/04/2026', updated: '28/08/2026', creator: 'Phan Văn Lộc' },
    { code: 'HS-2026-0019', kdt: 'KĐT-2026-0018', kind: 'CT', scope: 'CT', flow: 'MS14', stage: 'MS14', st: 'processing', task: 14, total: 118.0, created: '26/08/2026', updated: '26/08/2026', creator: 'Phan Văn Lộc', replaces: 'HS-2026-0018' },
    { code: 'HS-2026-0018', kdt: 'KĐT-2026-0018', kind: 'CT', scope: 'CT', flow: 'MS13', stage: 'MS14', st: 'moved', total: 118.0, created: '02/04/2026', updated: '26/08/2026', creator: 'Phan Văn Lộc', replacedBy: 'HS-2026-0019' },
    { code: 'HS-2026-0015', kdt: 'KĐT-2026-0015', kind: 'CT', scope: 'CT_KDT', flow: 'MS13', branch: 'BM00', stage: 'OK', st: 'done', total: 8.6, created: '11/03/2026', updated: '30/07/2026', creator: 'Nguyễn Văn Minh', docs: [['BM-00', '30/07/2026']] },
    { code: 'HS-2026-0012-2', kdt: 'KĐT-2026-0012', kind: 'KDT', parent: 'HS-2026-0012', luongCt: 'MS13', est: 138.5, lech: null, flow: 'MS13', branch: '2GD', stage: 'OK', st: 'done', total: 138.5, created: '14/04/2026', updated: '15/07/2026', creator: 'Nguyễn Văn Minh', docs: [['BM-14', '02/07/2026'], ['BM-18', '15/07/2026']] },
    { code: 'HS-2026-0012', kdt: 'KĐT-2026-0012', kind: 'CT', scope: 'CT', flow: 'MS13', branch: '2GD', stage: 'CT_OK', st: 'done', total: 138.5, created: '20/01/2026', updated: '12/04/2026', creator: 'Nguyễn Văn Minh', docs: [['BM-01', '12/04/2026']] },
  ];

  /* Việc đã xử lý trên hồ sơ mẫu (SCR-01 Việc của tôi) — mới nhất trước. Mở ra chi tiết hồ sơ ở chế độ xem. */
  D.sampleTasks = [
    { who: 'minh', code: 'HS-2026-0106', task: 26, created: '18/09/2026', due: '22/09/2026', done: '21/09/2026' },
    { who: 'minh', code: 'HS-2026-0110', task: 8, created: '17/09/2026', due: '19/09/2026', done: '18/09/2026' },
    { who: 'minh', code: 'HS-2026-0110', task: 4, created: '15/09/2026', due: '17/09/2026', done: '16/09/2026' },
    { who: 'minh', code: 'HS-2026-0106', task: 16, created: '04/09/2026', due: '08/09/2026', done: '05/09/2026' },
    { who: 'minh', code: 'HS-2026-0072', task: 26, created: '22/07/2026', due: '24/07/2026', done: '24/07/2026' },
    { who: 'hai', code: 'HS-2026-0110', task: 13, created: '19/09/2026', due: '23/09/2026', done: '22/09/2026' },
    { who: 'hai', code: 'HS-2026-0106', task: 13, created: '03/09/2026', due: '05/09/2026', done: '04/09/2026' },
    { who: 'hai', code: 'HS-2026-0072', task: 13, created: '06/07/2026', due: '08/07/2026', done: '07/07/2026' },
    { who: 'lan', code: 'HS-2026-0106', task: 17, created: '08/09/2026', due: '10/09/2026', done: '09/09/2026' },
    { who: 'lan', code: 'HS-2026-0101', task: 48, created: '09/09/2026', due: '11/09/2026', done: '11/09/2026' },
    { who: 'lan', code: 'HS-2026-0103', task: 58, created: '12/09/2026', due: '15/09/2026', done: '15/09/2026' },
    { who: 'lan', code: 'HS-2026-0077', task: 17, created: '16/06/2026', due: '18/06/2026', done: '17/06/2026' },
    { who: 'hoa', code: 'HS-2026-0106', task: 19, created: '10/09/2026', due: '15/09/2026', done: '14/09/2026' },
    { who: 'hoa', code: 'HS-2026-0101', task: 19, created: '05/08/2026', due: '10/08/2026', done: '12/08/2026' },
    { who: 'tung', code: 'HS-2026-0106', task: 20, created: '14/09/2026', due: '16/09/2026', done: '15/09/2026' },
    { who: 'thu', code: 'HS-2026-0106', task: 19, created: '10/09/2026', due: '15/09/2026', done: '15/09/2026' },
    { who: 'quang', code: 'HS-2026-0101', task: 10, created: '28/07/2026', due: '31/07/2026', done: '30/07/2026' },
    { who: 'binh', code: 'HS-2026-0103', task: 47, created: '02/09/2026', due: '04/09/2026', done: '03/09/2026' },
    { who: 'binh', code: 'HS-2026-0077', task: 47, created: '24/07/2026', due: '28/07/2026', done: '27/07/2026' },
    { who: 'tgd', code: 'HS-2026-0103', task: 60, created: '16/09/2026', due: '19/09/2026', done: '18/09/2026' },
    { who: 'tgd', code: 'HS-2026-0077', task: 60, created: '10/08/2026', due: '13/08/2026', done: '13/08/2026' },
    { who: 'tgd', code: 'HS-2026-0072', task: 60, created: '04/08/2026', due: '07/08/2026', done: '06/08/2026' },
    /* T58: việc đã xử lý trên hồ sơ ĐXMS mẫu mới — đủ các vai (Kho, Thầu, CQCM, Trưởng ban, Phó TGĐ, người thứ hai của vai). */
    { who: 'minh', code: 'HS-2026-0128', task: 16, created: '15/09/2026', due: '17/09/2026', done: '16/09/2026' },
    { who: 'hai', code: 'HS-2026-0128', task: 13, created: '12/09/2026', due: '14/09/2026', done: '13/09/2026' },
    { who: 'lan', code: 'HS-2026-0128', task: 17, created: '17/09/2026', due: '19/09/2026', done: '18/09/2026' },
    { who: 'qlts', code: 'HS-2026-0128', task: 7, created: '03/09/2026', due: '05/09/2026', done: '04/09/2026' },
    { who: 'thau', code: 'HS-2026-0128', task: 8, created: '05/09/2026', due: '07/09/2026', done: '06/09/2026' },
    { who: 'thau', code: 'HS-2026-0128', task: 10, created: '08/09/2026', due: '11/09/2026', done: '10/09/2026' },
    { who: 'quang', code: 'HS-2026-0129', task: 19, created: '05/09/2026', due: '10/09/2026', done: '09/09/2026' },
    { who: 'thu', code: 'HS-2026-0129', task: 19, created: '05/09/2026', due: '10/09/2026', done: '10/09/2026' },
    { who: 'tung', code: 'HS-2026-0129', task: 20, created: '11/09/2026', due: '13/09/2026', done: '12/09/2026' },
    { who: 'lan', code: 'HS-2026-0130', task: 38, created: '28/09/2026', due: '30/09/2026', done: '29/09/2026' },
    { who: 'binh', code: 'HS-2026-0131', task: 39, created: '24/09/2026', due: '26/09/2026', done: '25/09/2026' },
    { who: 'lan', code: 'HS-2026-0131', task: 38, created: '24/09/2026', due: '26/09/2026', done: '24/09/2026' },
    { who: 'ngoc', code: 'HS-2026-0134', task: 4, created: '06/09/2026', due: '08/09/2026', done: '07/09/2026' },
    { who: 'qlts', code: 'HS-2026-0134', task: 7, created: '09/09/2026', due: '11/09/2026', done: '11/09/2026' },
    { who: 'son', code: 'HS-2026-0136', task: 13, created: '01/10/2026', due: '03/10/2026', done: '02/10/2026' },
    { who: 'lan', code: 'HS-2026-0137', task: 48, created: '02/09/2026', due: '04/09/2026', done: '03/09/2026' },
    { who: 'tgd', code: 'HS-2026-0137', task: 51, created: '08/09/2026', due: '10/09/2026', done: '09/09/2026' },
    { who: 'hoa', code: 'HS-2026-0138', task: 19, created: '22/09/2026', due: '27/09/2026', done: '26/09/2026' },
    { who: 'tgd', code: 'HS-2026-0139', task: 60, created: '26/09/2026', due: '28/09/2026', done: '28/09/2026' },
    { who: 'mai', code: 'HS-2026-0132', task: 17, created: '25/08/2026', due: '27/08/2026', done: '26/08/2026' },
    /* Hồ sơ Điều chỉnh mẫu (T21 B3): HS-2026-0126 (MS02.01, đang ở 19), HS-2026-0112 (MS02.03, Hoàn thành) — tên việc theo BPMN_FLOWS.MS02. */
    { who: 'minh', code: 'HS-2026-0126', task: 16, created: '19/09/2026', due: '22/09/2026', done: '22/09/2026' },
    { who: 'minh', code: 'HS-2026-0126', task: 4, created: '15/09/2026', due: '17/09/2026', done: '16/09/2026' },
    { who: 'hai', code: 'HS-2026-0126', task: 13, created: '18/09/2026', due: '20/09/2026', done: '19/09/2026' },
    { who: 'lan', code: 'HS-2026-0126', task: 17, created: '22/09/2026', due: '24/09/2026', done: '23/09/2026' },
    { who: 'minh', code: 'HS-2026-0112', task: 4, created: '02/09/2026', due: '04/09/2026', done: '03/09/2026' },
    { who: 'lan', code: 'HS-2026-0112', task: 38, created: '16/09/2026', due: '18/09/2026', done: '17/09/2026' },
    { who: 'binh', code: 'HS-2026-0112', task: 39, created: '16/09/2026', due: '18/09/2026', done: '18/09/2026' },
    { who: 'tgd', code: 'HS-2026-0112', task: 60, created: '18/09/2026', due: '20/09/2026', done: '20/09/2026' },
  ];
  /* Việc đã xử lý trên hồ sơ KĐT mẫu (B5) — tên việc theo BPMN_FLOWS.MS13; mở Chi tiết hồ sơ KĐT ở chế độ xem. */
  D.sampleKdtTasks = [
    { who: 'minh', code: 'HS-2026-0027-2', task: 50, created: '31/08/2026', due: '02/09/2026', done: '02/09/2026' },
    { who: 'minh', code: 'HS-2026-0026', task: 39, created: '20/07/2026', due: '22/07/2026', done: '22/07/2026' },
    { who: 'minh', code: 'HS-2026-0012-2', task: 50, created: '05/05/2026', due: '07/05/2026', done: '06/05/2026' },
    { who: 'minh', code: 'HS-2026-0015', task: 19, created: '06/04/2026', due: '08/04/2026', done: '07/04/2026' },
    { who: 'hai', code: 'HS-2026-0015', task: 21, created: '09/04/2026', due: '13/04/2026', done: '10/04/2026' },
    { who: 'thu', code: 'HS-2026-0024', task: 11, created: '15/06/2026', due: '17/06/2026', done: '16/06/2026' },
    { who: 'thu', code: 'HS-2026-0012', task: 11, created: '10/02/2026', due: '12/02/2026', done: '11/02/2026' },
    { who: 'lan', code: 'HS-2026-0028-2', task: 57, created: '16/09/2026', due: '20/09/2026', done: '19/09/2026' },
    { who: 'lan', code: 'HS-2026-0024', task: 12, created: '15/06/2026', due: '17/06/2026', done: '17/06/2026' },
    { who: 'lan', code: 'HS-2026-0012-2', task: 57, created: '29/06/2026', due: '03/07/2026', done: '02/07/2026' },
    { who: 'hoa', code: 'HS-2026-0027', task: 29, created: '14/09/2026', due: '18/09/2026', done: '17/09/2026' },
    { who: 'tgd', code: 'HS-2026-0012-2', task: 60, created: '13/07/2026', due: '16/07/2026', done: '15/07/2026' },
    { who: 'tgd', code: 'HS-2026-0015', task: 62, created: '28/07/2026', due: '31/07/2026', done: '30/07/2026' },
    /* T58: việc đã xử lý trên hồ sơ KĐT mẫu mới. */
    { who: 'minh', code: 'HS-2026-0034', task: 17, created: '10/09/2026', due: '12/09/2026', done: '11/09/2026' },
    { who: 'thu', code: 'HS-2026-0034', task: 11, created: '20/08/2026', due: '22/08/2026', done: '21/08/2026' },
    { who: 'lan', code: 'HS-2026-0034', task: 12, created: '20/08/2026', due: '22/08/2026', done: '22/08/2026' },
    { who: 'hoa', code: 'HS-2026-0035', task: 29, created: '12/09/2026', due: '16/09/2026', done: '15/09/2026' },
    { who: 'hai', code: 'HS-2026-0037', task: 21, created: '25/09/2026', due: '27/09/2026', done: '26/09/2026' },
    { who: 'tgd', code: 'HS-2026-0039', task: 48, created: '15/08/2026', due: '18/08/2026', done: '18/08/2026' },
    { who: 'lan', code: 'HS-2026-0039-2', task: 55, created: '22/09/2026', due: '25/09/2026', done: '24/09/2026' },
    { who: 'hai', code: 'HS-2026-0039-2', task: 56, created: '25/09/2026', due: '28/09/2026', done: '27/09/2026' },
  ];

  /* ---------- Điểm chưa chốt §6 ---------- */
  D.openPoints = {
    'P-01': { q: 'Danh sách loại căn cứ và mapping dữ liệu, API eBOM/mBOM', src: 'UR-PRE-01, 02', def: '5 loại theo CL01; dữ liệu giả', scr: 'SCR-03' },
    'P-02': { q: 'Danh mục mức ưu tiên và ảnh hưởng tới SLA', src: 'AMB-06, UR-COM-06', def: 'Thường / Khẩn / Thượng khẩn, chỉ hiển thị, không đổi SLA', scr: 'SCR-04' },
    'P-03': { q: 'Hạng mục ngoài dự toán: chặn hay chỉ cảnh báo', src: 'AMB-02, BR-07-01', def: 'Chỉ cảnh báo (BBLV 09/09, mới hơn 27/08)', scr: 'SCR-05' },
    'P-04': { q: 'Tích hợp kho: API, 2 bước sổ sách → kiểm đếm', src: 'UR-PRE-10, 12', def: 'Một bước; kết quả giả lập', scr: 'SCR-06' },
    'P-05': { q: 'ĐVĐX tự chọn CQCM hay cần TTMS/Pháp chế xác nhận', src: 'BBLV 22/09 bước 15; BPMN v1.1 N07', def: 'Theo BPMN v1.1 (N07): ĐVĐX chọn, TTMS xác nhận danh sách đúng/đủ ở task 17', scr: 'SCR-22' },
    'P-06': { q: 'Tiêu chí báo giá đạt/không đạt', src: 'UR-PRE-23', def: 'Hết hiệu lực hoặc thiếu dòng thì Không đạt', scr: 'SCR-07' },
    'P-07': { q: 'Câu tự động khi dùng hàng tồn kho', src: 'BBLV 09/09', def: 'Câu mẫu do BA soạn, gắn nhãn', scr: 'SCR-08' },
    'P-08': { q: 'Mẫu phiếu giải trình', src: 'URD T-24', def: 'Dùng phụ lục 1 BM-02', scr: 'SCR-13' },
    'P-09': { q: 'Người nhận email khi > 2 vòng; cấp kết luận', src: 'UR-COM-21, 23; AMB-05; BPMN v1.1 task 34', def: 'ĐVĐX, CQCM, TTMS; cấp kết luận là Thủ trưởng VHT (task 34)', scr: 'SCR-14' },
    'P-10': { q: 'Ai chủ trì rà soát BM-05 (TTMS hay CQCM)', src: 'OQ-16; BPMN v1.1 Q01 (đã chốt)', def: 'Theo Q01: TTMS rà soát, cập nhật và ký BM-05 trước với tư cách CQCM về ĐTXD', scr: 'SCR-16' },
    'P-11': { q: 'Một bên từ chối ký BM-05 khi bên kia còn xử lý: trả ngay hay chờ đủ', src: 'BPMN v1.1 Q03 (cần làm rõ), task 46–47', def: 'Bản vẽ tạm chờ đủ hai kết quả; prototype trả hồ sơ ngay khi một bên không đồng ý', scr: 'SCR-17' },
    'P-12': { q: 'Thứ tự ký BM-05; phân biệt Không ký / Chưa ký / Không đồng ý', src: 'UR-DX-14; BPMN v1.1 Q01', def: 'TTMS ký trước (task 44), sau đó CQCM Tài chính/liên quan ‖ Phó TGĐ (46 ‖ 47); 3 trạng thái hiển thị riêng', scr: 'SCR-17' },
    'P-13': { q: 'Có phải chờ TGĐ Tập đoàn đồng ý mới sinh BM-08', src: 'Q02, BRD Q-04', def: 'Có chờ (Q02: TO-BE giữ nguyên); nút giả lập "TGĐ TĐ đồng ý"', scr: 'SCR-18' },
    'P-14': { q: 'Ký thẳng hay phải tổ chức LCNT sau phê duyệt', src: 'OQ-14, UC-07-13', def: 'Không demo; nút "Tạo gói thầu" để mờ', scr: 'SCR-19' },
    'P-15': { q: 'Giá trị và mốc tính KPI tổng', src: 'OQ-13, UR-KPI-02', def: '20 NLV từ ngày gửi CQCM (task 18) đến ngày phê duyệt (task 60)', scr: 'SCR-20' },
    'P-16': { q: 'Quy tắc ủy quyền ký, tài khoản intern, API VOffice', src: 'OQ-11, UR-COM-13', def: 'Giả lập; không vẽ ủy quyền (N01)', scr: 'SCR-21' },
    /* MS01.02 / MS01.03 — docs/dtms/prototype-MS01-02-03-chuan-bi.md §7. flows: chỉ gắn lên màn khi hồ sơ theo quy trình đó. */
    'P-17': { q: 'MS01.03: góp ý dự thảo bằng BM-04 hay trao đổi không cần văn bản', src: 'GAP-31; QT B8.3', def: 'BM-04, theo MS01 v1.1 (task 19–23, 36); Diễn giải BA v1.2 §B.5 cũng vậy', scr: 'SCR-11', flows: ['MS01.03'] },
    'P-18': { q: 'MS01.03: bị trả lại sau khi đã ký (TTMS, Phó TGĐ, Thủ trưởng) thì quay về đâu', src: 'BRD Q-03; URD §12 #25', def: 'Về task 25 → 26: ĐVĐX cập nhật BM-09 rồi CQCM kiểm tra, ký lại BM-04 + Checklist 02 (MS01 v1.1)', scr: 'SCR-12', flows: ['MS01.03'] },
    'P-19': { q: 'Tên văn bản ở B9–B10: "BM-01B" hay BM-09', src: 'URD §6.5', def: 'BM-09, theo MS01 v1.1 và Diễn giải BA v1.2', scr: 'SCR-08', flows: ['MS01.03'] },
    'P-20': { q: 'Thành phần và thứ tự ký BM-09: chỉ TTMS ‖ Phó TGĐ (v1.1) hay thêm ô CQCM TCKT, CQCM liên quan như mẫu; Phó TGĐ ký song song hay "tiếp tục" ký sau; một bên từ chối khi bên kia chưa ký thì trả ngay hay chờ đủ', src: 'Task 38, 39; BM-09; Diễn giải BA §C.3.3, D.2 #1', def: 'TTMS ‖ Phó TGĐ luôn ký, song song; TCKT và CQCM liên quan thể hiện qua BM-04 + Checklist 02; một bên không đồng ý thì trả hồ sơ ngay (như BM-05, P-11)', scr: 'SCR-23', flows: ['MS01.03'] },
    'P-21': { q: 'KPI MS01.03: ngưỡng 10 NLV và mốc bắt đầu tính', src: 'QT; QĐ 16026/QĐ-VHT; v1.1 không ghi', def: '10 NLV, từ task 18 (gửi CQCM) đến task 60 — cùng quy ước với P-15', scr: 'SCR-24', flows: ['MS01.03'] },
    'P-23': { q: 'Task 34 "Yêu cầu xử lý lại" chỉ vẽ nối về task 12 (≥ 160 tỷ); nhánh < 160 tỷ chưa vẽ', src: 'BPMN v1.1 task 34', def: '< 160 tỷ về task 11 (dự thảo BM-09)', scr: 'SCR-14', flows: ['MS01.03'] },
    'P-24': { q: 'MS01.02 không có nhánh riêng trên v1.1 (trang MS01.02 trong file là bản cũ 37 task)', src: 'URD §6.4; Diễn giải BA v1.2 §C.2', def: 'Nhánh ≥ 160 tỷ của v1.1, task 48 luôn "Không báo cáo Tập đoàn" (bỏ 49–56)', scr: 'SCR-16', flows: ['MS01.02'] },
    'P-25': { q: '< 160 tỷ: CQCM Tài chính bắt buộc (QT B8.2) do hệ thống khoá hay do TTMS kiểm soát ở task 17', src: 'QT B8.2; N07; Diễn giải BA D.2 #2', def: 'Hệ thống tích sẵn và khoá Ban Tài chính; TTMS vẫn xác nhận toàn bộ danh sách', scr: 'SCR-22', flows: ['MS01.03'] },
    'P-22': { q: 'Vòng giải trình: ≤ 2 vòng quay về chỉ huy ĐVĐX (task 13) rồi gửi lại CQCM, không còn bước TTMS xét giải trình; ghi chú N04 vẫn ghi "TTMS xem xét"', src: 'BPMN v1.1 task 28, 29, 13; N04', def: 'Theo hình vẽ v1.1', scr: 'SCR-13' },
    'P-26': { q: 'Ngưỡng phân luồng (160 tỷ) tính trên tổng nào — phần còn mở của P-26. Việc chọn quy trình khi tạo hồ sơ đã bỏ: T29 B1 (D-54, RV-PROTO-0511 #4) hệ thống tự phân luồng sau báo giá, không còn 10a / 10b', src: 'RV-PROTO-0511 #4; BPMN MS01 v1.1 (bản 12/10)', def: 'Tổng kinh phí gồm VAT sau khi trừ tồn kho; luồng con .01 / .02 / .03 đặt ở cổng sau task 10 và task 48', scr: 'SCR-25' },
    /* Mô hình ĐXMS ↔ Hồ sơ (D-10…D-12) — docs/dtms/prototype-DXMS-ho-so-chuan-bi.md §5. */
    'P-63': { q: 'MS02 có tách ba quy trình MS02.01 / .02 / .03 như MS01 (P-37) không', src: 'Diễn giải MS02 §B.3; P-37', def: 'Một quy trình MS02 (trang MS02 ver1.1 gộp ba luồng con)', scr: 'SCR-25' },
    'P-64': { q: 'Hồ sơ Phê duyệt kết thúc theo chỉ đạo khác: ĐXMS có được tạo hồ sơ Phê duyệt mới không, hay ĐXMS cũng dừng', src: '—', def: 'T34 (D-85): ĐXMS dừng theo hồ sơ (mỗi ĐXMS một hồ sơ); làm lại = Sao chép thành ĐXMS mới (P-226)', scr: 'SCR-25' },
    'P-65': { q: 'Sửa ĐXMS khi đang có hồ sơ chạy: trường nào bị khoá; thông tin trên ĐXMS và trên hồ sơ (task 04) lệch nhau thì lấy bên nào', src: '—', def: 'Sửa được trừ Mã ĐXMS và giá trị hiệu lực; hồ sơ giữ thông tin lúc tạo', scr: 'SCR-28' },
    'P-66': { q: 'Giá trị hiệu lực của ĐXMS lấy từ hồ sơ Hoàn thành gần nhất (kể cả hồ sơ Điều chỉnh)', src: 'Diễn giải MS02 §B.2 (giá trị sau điều chỉnh)', def: 'Như vậy; chưa có hồ sơ Hoàn thành thì dùng giá trị dự kiến', scr: 'SCR-29' },
    /* Khoản đầu tư MS13 — docs/dtms/prototype-KDT-chuan-bi.md §5; T18 rà lại theo BPMN 12/10 (trang MS13, 78 bước — plan T18 §6). */
    'P-50': { q: 'Mẫu BM-00 (văn bản gộp chủ trương + KĐT) chưa có trong bộ biểu mẫu KĐT của VHT', src: 'OQ-17, URD §12 #2', def: 'Mẫu giả ghép cấu trúc BM-01 + BM-03', scr: 'SCR-59' },
    'P-51': { q: 'Điều kiện gộp BM-00: trường dữ liệu làm căn cứ cho "Trang bị nội bộ" và "Nguyên chiếc"', src: 'OQ-17, diễn giải MS13 §D.2', def: 'Loại KĐT = Trang bị nội bộ và Tính chất tài sản = Nguyên chiếc (DMDC, nhập ở KĐT)', scr: 'SCR-58' },
    'P-52': { q: 'Tiêu chí OK / NOT OK của xác nhận TSCĐ và 04 yếu tố; NOT OK quay về đâu', src: 'DG-MS13 bước 11, 12; BPMN-DTMS MS13 (12/10)', def: 'NOT OK bắt buộc lý do → AI gợi ý cần sửa (14) → ĐVĐX tổng hợp lại báo giá (10), theo mũi tên của BPMN', scr: 'SCR-57' },
    'P-53': { q: 'Tổng mức vốn không thuộc MS13: tạo hồ sơ mới theo MS14/MS15 hay giữ hồ sơ', src: 'Diễn giải MS13 §B.2', def: 'Kết thúc hồ sơ MS13 "Đã chuyển luồng", tạo hồ sơ mới của cùng KĐT theo MS14/MS15, liên kết hai hồ sơ', scr: 'SCR-66' },
    'P-54': { q: 'Giới hạn họp: tối đa 02 lần họp mỗi vòng BM-00 / BM-01 / BM-03', src: 'DG-MS13 bước 32, 33; URD §12 #5; BPMN-DTMS MS13 (12/10) cổng "Vòng hiện tại đã họp dưới 02 lần?"', def: 'Bản 12/10 đã rõ: chưa thống nhất → họp (lần 1, 2); sau 02 lần vẫn chưa thống nhất → báo cáo (37); đếm riêng mỗi vòng, không đặt lại khi bổ sung / trình lại', scr: 'SCR-62' },
    'P-55': { q: 'Dữ liệu, thứ tự xác nhận sau họp của Chuyên quản và Chỉ huy ĐVĐX', src: 'Diễn giải MS13 §D.9', def: 'Tuần tự Chuyên quản → Chỉ huy; đủ cả hai mới mở sửa', scr: 'SCR-62' },
    'P-56': { q: 'Ma trận phân cấp VHT / Tập đoàn cho KĐT', src: 'DG-MS13 bước 13; URD §12 #4; UQ-GUQ §1.2', def: 'Thay bằng bước 13 + danh mục Phân cấp thẩm quyền KĐT (SCR-100, D-33) — bảng giả lập P-90; tuyến Tập đoàn 63–74 dựng ở T18 B4 (D-8 mở 12/10)', scr: 'SCR-100' },
    'P-57': { q: 'Có danh sách / ma trận CQCM bắt buộc không; đơn vị chủ trì cho KĐT KHCN / quốc phòng', src: 'Diễn giải MS13 §D.4, UR-KDT-09', def: 'ĐVĐX tự chọn, TTMS duyệt; KĐT KHCN / quốc phòng chọn thêm đơn vị chủ trì', scr: 'SCR-60' },
    'P-58': { q: 'Số task 64 "Trình ký VOffice để Thủ trưởng VHT ký sau ý kiến Tập đoàn" của trang MS13-TO BE: nhãn 64, TaskNo 60', src: 'BPMN-DTMS MS13-TO BE (bản cũ)', def: 'ĐÃ ĐÓNG (T18): trang MS13 bản 12/10 không còn task này', scr: 'SCR-42' },
    'P-59': { q: 'KĐT không chọn quy trình lúc tạo hồ sơ — hệ thống xác định nhóm MS13 / MS14 / MS15 sau bước 12 (khác ĐXMS chọn tay)', src: 'D-7, D-12; WBS PH09 #175, 176', def: 'Tạo KĐT trước; hồ sơ Phê duyệt KĐT không chọn nhóm', scr: 'SCR-55' },
    'P-60': { q: 'Hồ sơ KĐT Mật ký bản giấy (MS14 ghi rõ, MS13 không nêu)', src: 'Diễn giải MS14 §C.11', def: 'Mật → hộp thoại ký mặc định ký cứng như ĐXMS', scr: 'SCR-21' },
    'P-61': { q: '"Thực hiện theo chỉ đạo" khi Thủ trưởng không ký: dừng hay bàn giao, trạng thái và dữ liệu lưu', src: 'Diễn giải MS13 §D.14', def: 'Ghi nội dung chỉ đạo; chỉ đạo dừng → "Dừng theo chỉ đạo", chỉ đạo xử lý → quay lại cổng chọn nhánh hồ sơ (theo BPMN)', scr: 'SCR-21' },
    'P-62': { q: 'Tiêu chí không đạt của "HT/AI kiểm tra trước khi gửi" (bước 44)', src: 'DG-MS13 bước 44; BPMN-DTMS MS13 (12/10) cổng "AI kiểm tra đạt?"', def: 'Bản 12/10 vẽ nhánh Không đạt → 39. Tiêu chí giả lập: thiếu mục bắt buộc của BM-01 / Checklist 01', scr: 'SCR-60' },
    /* Danh mục dùng chung — docs/dtms/prototype-DMDC-chuan-bi.md §7. */
    'P-27': { q: 'Danh sách giá trị thật của từng danh mục', src: 'BB-2409 (VHT gửi qua email, chưa nhận)', def: 'Dữ liệu mẫu theo tài liệu chuẩn bị DMDC §3', scr: 'SCR-32' },
    'P-28': { q: 'Ngưỡng MS13/MS14: VT-CNTT < 160 và lĩnh vực khác < 90 (BB-2409), hay ngược lại (BB-1509)', src: 'BRD Q-01, UR-KDT-07; QT-8.6.5 trường hợp 1–3 ghi như BB-2409 (QT-8.6.5 chưa có bản PDF ban hành, INDEX C5)', def: 'Theo QT-8.6.5 / BB-2409', scr: 'SCR-40' },
    'P-29': { q: 'Loại khoản đầu tư có cần trường "Cấp xử lý" (SXKD luôn cấp Tập đoàn) không, hay chỉ dùng cho báo cáo', src: 'BB-1509 §2.5', def: 'Có trường Cấp xử lý', scr: 'SCR-34' },
    'P-30': { q: 'Mã nhà cung cấp do hệ thống tự sinh hay người dùng nhập', src: '—', def: 'Tự sinh NCC-000123; mã số thuế là khoá chống trùng', scr: 'SCR-31' },
    'P-31': { q: 'Có cần tài khoản ngân hàng, hồ sơ năng lực, đánh giá nhà cung cấp trong ĐTMS không', src: 'UC-10-07', def: 'Không có', scr: 'SCR-31' },
    'P-32': { q: 'Nhà cung cấp nước ngoài định danh bằng gì (mã thuế nước sở tại / số đăng ký kinh doanh), có bắt buộc không', src: 'Chốt nội bộ 28/09/2026 (có NCC nước ngoài)', def: 'Tuỳ chọn, nhập tự do', scr: 'SCR-31' },
    'P-33': { q: 'Bản ghi danh mục đã được hồ sơ dùng: chỉ Dừng hoạt động, không cho xoá', src: '—', def: 'Như vậy; bản ghi dừng hoạt động không hiện trong ô chọn, hồ sơ cũ vẫn hiện đúng giá trị', scr: 'SCR-32' },
    'P-34': { q: 'Ngưỡng có hiệu lực theo ngày; hồ sơ đang chạy giữ ngưỡng lúc tạo', src: '—', def: 'Như vậy', scr: 'SCR-40' },
    'P-35': { q: 'Phương thức LCNT và loại hợp đồng theo QĐ 12869 hay theo Luật Đấu thầu', src: 'BR-16; QC-12869 Điều 11 (2 phương thức), Điều 43 khoản 2 (8 loại hợp đồng)', def: 'Theo QC-12869: 2 phương thức một giai đoạn, 8 loại hợp đồng', scr: 'SCR-38' },
    'P-67': { q: 'Lĩnh vực đầu tư có những giá trị nào: QT-8.6.5 chỉ chia "VT-CNTT" / "lĩnh vực khác"; Quốc phòng (BB-2209) và Bất động sản (là loại KĐT theo QT-8.6.5) có cần là lĩnh vực riêng', src: 'QT-8.6.5 trường hợp 1–3, BB-1509, BB-2209', def: 'Giữ 4 lĩnh vực mẫu; Quốc phòng chưa có dòng ngưỡng', scr: 'SCR-40' },
    'P-68': { q: 'Loại KĐT "Hoạt động thường xuyên" (BB-1509 §2.2, §2.5) không có trong 6 loại của QT-8.6.5 (kinh doanh, bất động sản, phương tiện vận tải, trang bị nội bộ, KHCN, khác)', src: 'QT-8.6.5, BB-1509', def: 'Theo QT-8.6.5 (6 loại)', scr: 'SCR-34' },
    /* B0.5 — comment Figma nhóm A (docs/dtms/prototype-W1T10-backlog-chuan-bi.md §2d). */
    'P-69': { q: 'ĐXMS chọn từ nhiệm vụ / đề tài, dự án (comment #1): danh sách lấy ở đâu (module Quản lý nhiệm vụ KHCN, dự án SXKD, kế hoạch mua sắm thường xuyên)', src: 'Comment Figma #1', def: 'Danh sách mẫu 6 mục, chỉ mục đã phê duyệt', scr: 'SCR-28' },
    'P-70': { q: 'Bộ quy tắc bảo mật cho ĐXMS Mật (comment #12): ai ban hành, gồm những quy tắc nào', src: 'Comment Figma #12', def: '4 quy tắc mẫu, AI chỉ cảnh báo, không chặn Lưu', scr: 'SCR-28' },
    'P-71': { q: '"Ký tồn kho VO" (comment #2) nghĩa là gì: VO ký xác nhận kết quả rà soát tồn kho trên VOffice?', src: 'Comment Figma #2', def: 'Chưa dựng — hỏi lại khách', scr: 'SCR-05' },
    'P-72': { q: 'Nhà cung cấp thêm mới ngay trong hồ sơ (comment #3) có cần Quản trị danh mục duyệt trước khi gửi YCBG không', src: 'Comment Figma #3', def: 'Thêm vào danh mục ở trạng thái Hoạt động, gửi YCBG ngay', scr: 'SCR-07' },
    'P-73': { q: 'Đối soát ĐXMS (comment #4): MBOM, dự toán nhiệm vụ / dự án, KHN lấy từ hệ thống nào, đối soát theo mã hàng hay theo tên', src: 'Comment Figma #4', def: 'Dữ liệu mẫu, đối soát theo dòng hạng mục', scr: 'SCR-07' },
    'P-74': { q: 'Backlog "Import yêu cầu báo giá cho các nhà cung cấp": nhập gì (danh sách hạng mục, NCC nhận, hay báo giá NCC trả về), ở bước nào, theo mẫu tệp nào', src: 'BA-TD Backlog dòng 210', def: 'Chưa dựng; YCBG tạo trong task 08', scr: 'SCR-73' },
    'P-75': { q: 'Backlog KĐT "Thành phần tham gia — Quản lý Tổ chuyên gia" (dòng 263): KĐT có Tổ chuyên gia riêng không? MS13-TO BE không có bước lập Tổ chuyên gia', src: 'BA-TD Backlog dòng 263, BPMN-DTMS MS13-TO BE', def: 'Tab Thành phần tham gia của KĐT hiện CQCM thẩm định; Tổ chuyên gia ở Gói thầu', scr: 'SCR-56' },
    'P-76': { q: 'Báo cáo kiểm tra KHLCNT (MS18.3): tên / biểu mẫu chính thức, nội dung bắt buộc, người ký, có trình ký VOffice không (Q02 của BPMN-MS18)', src: 'BPMN-MS18 Q02', def: 'Đã có nguồn (T67, BM-KHLCNT): cấp VHT = BM02 Báo cáo kiểm tra 16 tiêu chí, Trung tâm Mua sắm lập, Giám đốc ký, không có ô Số; cấp Tập đoàn = BM02 Báo cáo thẩm định Bảng số 2, Tổ thẩm định lập — MS18 bước 10 / 12', scr: 'SCR-80' },
    'P-77': { q: 'Tổ chức LCNT (MS19) chưa có BPMN: trình tự theo từng hình thức (Điều 12–21) có tách một quy trình Camunda cho mỗi hình thức không', src: 'QC-12869 Điều 12–21; INDEX MS18 / MS19', def: 'Một phần đã có nguồn (T67 T5): BPMN-MS19 mức tổng 24 bước, một process instance cho mỗi gói, cổng Hình thức LCNT chọn quy trình con. Trình tự chi tiết từng hình thức vẫn treo (P-235)', scr: 'SCR-82' },
    'P-78': { q: 'Danh sách nhà thầu / hãng sản xuất chiến lược và nhà thầu bị cấm: tích hợp từ Tập đoàn hay nhập tay trên ĐTMS; ai cập nhật', src: 'QC-12869 Điều 13 khoản 2; Backlog dòng 403–406', def: 'Chiến lược: dữ liệu mẫu theo QĐ công bố; cấm: cờ Tình trạng của danh mục NCC', scr: 'SCR-83' },
    'P-79': { q: 'Ngưỡng cảnh báo giá dự thầu thấp bất thường (QC-12869 không nêu tỷ lệ)', src: 'Backlog dòng 389', def: 'Thấp hơn 20% giá gói thầu → cảnh báo, yêu cầu nhà thầu giải trình', scr: 'SCR-82' },
    'P-110': { q: 'Video hệ thống thầu cũ team BA nhắc tới (chưa có trong project-knowledge): có màn nào ngoài KHLCNT (HSMT, phát thầu, chấm thầu, KQLCNT — MS19) không', src: 'Yêu cầu team BA 30/10/2026; HT-THAU-IMG chỉ có KHLCNT', def: 'Hệ thống cũ không có màn MS19 (hiện trạng hệ thống thầu §8 câu 10) — Chi tiết gói thầu giữ 6 tab như đã dựng, đọc biến MS19 khi gói chạy luồng (T67 T5)' },
    'P-112': { q: 'Danh mục nào là chung toàn hệ thống, danh mục nào riêng ĐTMS; danh mục trùng ý nghĩa với ecat (Nguồn kinh phí ↔ Nguồn vốn, Đối tác ↔ Nhà cung cấp / Nhà thầu, Lĩnh vực ↔ Lĩnh vực đầu tư) dùng chung hay tách', src: 'Yêu cầu team BA 30/10/2026; ecat common-catalog', def: 'GIẢ LẬP — mọi danh mục nằm trong phân hệ Danh mục dùng chung; Nhà cung cấp / Nhà thầu, Loại đối tác, Nguồn vốn, Lĩnh vực đầu tư, Đơn vị tính, Tiền tệ xếp danh mục chung; còn lại gom nhóm Đầu tư mua sắm.' },
    'P-113': { q: 'Nhiệm vụ / Đề tài, dự án của KĐT: "KHN" trong yêu cầu BA là Kế hoạch năm (mọi nhiệm vụ, đề tài, dự án đã vào KHN) hay chỉ loại Mua sắm thường xuyên (KHN)', src: 'Yêu cầu team BA 30/10/2026', def: 'GIẢ LẬP — chọn trong toàn bộ danh sách nhiệm vụ / đề tài, dự án dùng chung với ĐXMS; bắt buộc khi tạo KĐT.' },
    'P-114': { q: 'Bộ Loại hợp đồng: 12 giá trị của hệ thống cũ (có 3 loại kết hợp, Thỏa thuận khung…) hay 8 giá trị theo QC-12869 Điều 43', src: 'HT-THAU-IMG 7221; QC-12869 Điều 43; P-35', def: 'GIẢ LẬP — giữ 8 giá trị theo Quy chế mới; loại kết hợp xếp vào Hỗn hợp.' },
    'P-115': { q: 'Quy chế áp dụng chỉ có 2 giá trị Mua sắm thường xuyên / Theo luật như hệ thống cũ, hay còn trường hợp khác theo QC-12869; 4 biến thể Quy chế × Cấp phê duyệt khác nhau ở tab / trường nào', src: 'HT-THAU-IMG 7204, 7208; HT-THAU-DG §3.2', def: 'GIẢ LẬP — 2 giá trị, không đổi sau khi tạo; Theo luật đăng tải mạng đấu thầu quốc gia (P-83); màn chung cho mọi biến thể.' },
    'P-117': { q: 'Đồng bộ từ Camunda: SRS-QTQT 3.1.1.5 lấy từ runtime Camunda, có khoá một phiên và sinh luật hành động; BE hiện đọc Web Modeler (syncFromWebModeler), trả void, chưa khoá phiên, chưa sinh luật. Làm theo bên nào', src: 'SRS-QTQT 3.1.1.5.4; be/dtms CamundaArtifactSyncService', def: 'GIẢ LẬP theo SRS: thêm phiên bản, đánh dấu Dừng hoạt động, sinh luật còn thiếu, chặn khi đang có phiên; thông báo giữ câu chữ FE.', scr: 'SCR-41' },
    'P-118': { q: 'Vai trò nào được cấp những mã quyền nào của Quản trị quy trình (QT, HTN, DMHS / DMHD, DTO, GS); "Người dùng quản trị quy trình" có là vai trò riêng không', src: 'SRS-QTQT 3.1.1.5; FE workflow-management-permissions, action-matrix-permissions', def: 'GIẢ LẬP — Quản trị hệ thống đủ quyền; Người dùng quản trị quy trình xem, không đồng bộ, không xem lịch sử phiên bản, Ma trận chỉ xem; Chuyên viên TTMS chỉ GS00.', scr: 'SCR-41' },
    'P-116': { q: 'Mã KHLCNT trên SAP lấy từ đâu (nhập tay hay đồng bộ); số đăng tải KH… lấy từ hệ thống nào', src: 'HT-THAU-IMG 7211; hien-trang-he-thong-thau §8 câu 8', def: 'GIẢ LẬP — hai dòng chỉ xem ở bảng văn bản, giá trị mẫu; thật là kết quả tích hợp, không nhập tay.' },
    'P-80': { q: 'Ngưỡng cảnh báo hợp đồng: bảo đảm thực hiện sắp hết hạn (bao nhiêu ngày trước), hợp đồng sắp hết hạn; có cấu hình theo loại hợp đồng không', src: 'Backlog dòng 456, 597', def: 'GIẢ LẬP — ngưỡng = tham số hệ thống (sys_config, D-44 bỏ Trigger thông báo): bảo đảm 30 ngày (CONTRACT_GUARANTEE_EXPIRING), hợp đồng 90 ngày (CONTRACT_EXPIRING), thỏa thuận khung 90 ngày (FRAMEWORK_EXPIRING); Hợp đồng / Thỏa thuận khung / Báo cáo dùng chung giá trị này. Chưa tách theo loại hợp đồng', scr: 'SCR-84, SCR-86' },
    'P-81': { q: 'Quy trình đơn hàng thuộc thỏa thuận khung (đặt, xác nhận, giao nhận, thanh toán từng đơn) chưa có BPMN; đơn hàng có theo dõi như một hợp đồng con không', src: 'Backlog dòng 465–469', def: 'GIẢ LẬP — đơn hàng là dòng của thỏa thuận khung (không phải hợp đồng con); Thêm đơn hàng chặn vượt giá trị còn lại; luồng 4 bước Chờ nhà thầu xác nhận → Đang giao → Đã giao đủ → Đã thanh toán, chuyển bước ở hộp thoại đơn hàng', scr: 'SCR-87' },
    'P-82': { q: 'Tích hợp Cổng đấu thầu Viettel (có phải SAP Ariba?) và Hệ thống mạng đấu thầu quốc gia: API, định dạng tin, mã tin, chiều đồng bộ tiến độ / KQLCNT về ĐTMS', src: 'Backlog dòng 413–415; QC-12869 Điều 26', def: 'GIẢ LẬP — hai hệ thống nối qua API của trục tích hợp: ĐTMS đẩy tin khi Chủ đầu tư xác nhận, nhận tiến độ / kết quả mở thầu / kiến nghị định kỳ 60 phút; lỗi trả về được ghi và cho Gửi lại (MS18 bước 60); mã tin VTB-… (Cổng Viettel), IB… / PL… (mạng ĐTQG)', scr: 'SCR-94' },
    'P-83': { q: 'Chọn hệ thống đăng tải theo tiêu chí nào (gói áp dụng Luật Đấu thầu, gói tổ chức qua mạng…); lịch ngày làm việc (nghỉ lễ, Tết) để tính hạn 05 ngày làm việc lấy từ đâu', src: 'QC-12869 Điều 26 khoản 1–2; BPMN-MS18 N02', def: 'GIẢ LẬP — KHLCNT có cờ "Áp dụng Luật Đấu thầu cho gói cụ thể" → mạng đấu thầu quốc gia, còn lại → Cổng đấu thầu Viettel; ngày làm việc chỉ trừ thứ Bảy, Chủ nhật (chưa có danh mục ngày nghỉ lễ)', scr: 'SCR-94' },
    /* T17 Luồng mua sắm (phương án Gộp) — docs/dtms/prototype-T17-luong-mua-sam-chuan-bi.md §6. */
    'P-84': { q: 'Danh sách Loại tài liệu căn cứ của luồng mua sắm, loại nào bắt buộc, gắn vào ĐXMS hay hồ sơ', src: 'Yêu cầu khách 12/10/2026 (căn cứ đầu vào)', def: 'GIẢ LẬP — danh mục Loại tài liệu căn cứ (SCR-99): bắt buộc QĐ giao nhiệm vụ / phê duyệt đề tài, dự án và Kế hoạch mua sắm năm được duyệt (gắn ĐXMS); không bắt buộc Chủ trương đầu tư, Văn bản chỉ đạo, Biên bản làm việc, Báo giá / khảo sát giá (gắn hồ sơ), Khác', scr: 'SCR-96' },
    'P-86': { q: 'Thay người: văn bản căn cứ đính kèm có cần lưu số hiệu / ngày văn bản không', src: 'Yêu cầu khách 12/10/2026 (thay người đính kèm văn bản); D-29', def: 'GIẢ LẬP — văn bản căn cứ và lý do đều không bắt buộc; có tệp thì lưu tên tệp vào Lịch sử thay đổi nhân sự, không nhập số hiệu / ngày', scr: 'SCR-98' },
    'P-87': { q: 'Văn bản đang trình ký mà người cũ đã ký một phần (ký nháy, ký trước): thu hồi cả văn bản hay chỉ thay chữ ký người cũ', src: 'D-29 (2), DX-04', def: 'GIẢ LẬP — thu hồi cả văn bản, trình lại toàn bộ luồng ký với người mới; chữ ký đã có huỷ theo văn bản thu hồi', scr: 'SCR-98' },
    'P-88': { q: 'Người cũ đang giữ (claim) task chưa hoàn thành khi bị thay: dữ liệu nháp của task giữ hay xoá', src: 'D-29 (1)', def: 'GIẢ LẬP — giữ dữ liệu nháp, task bỏ claim rồi giao người mới', scr: 'SCR-98' },
    'P-89': { q: 'Bước đã xong nhưng luồng có thể quay lại bước đó (vòng giải trình, trả lại): có cho cập nhật nhân sự của bước không', src: 'D-28; người dùng chốt 12/10 (vai trò đã xong bước thì không đổi)', def: 'GIẢ LẬP — bước đã xong thì khoá, không cập nhật; luồng quay lại bước đó vẫn giao theo nhân sự đang lưu của bước', scr: 'SCR-97' },
    /* T18 — BPMN MS13 bản 12/10 (docs/dtms/prototype-T18-ms13-bpmn-1210-chuan-bi.md §6). */
    'P-90': { q: 'Bảng quy tắc bước 13 "Xác định thẩm quyền phê duyệt": cấp duyệt chủ trương / KĐT (VHT / Tập đoàn) theo loại KĐT, lĩnh vực, tổng mức vốn', src: 'DG-MS13 bước 13; UQ-GUQ §1.2', def: 'GIẢ LẬP theo nguyên văn UQ-GUQ §1.2 (danh mục SCR-100): KHCN < 45 tỷ → chủ trương Tập đoàn, KĐT VHT (§1.2.1); KHCN ≥ 45 tỷ, Trang bị nội bộ, Khác → VHT / VHT (§1.2.2); Kinh doanh, Bất động sản, Phương tiện vận tải → Tập đoàn / Tập đoàn. "Hệ thống CNTT nội bộ" chưa có trường dữ liệu → chưa có dòng', scr: 'SCR-100' },
    'P-91': { q: 'Bước ký nào đi qua khối ký chung 75–78 (chọn hình thức ký, VOffice / bản cứng)', src: 'DG-MS13 bước 75–78', def: 'GIẢ LẬP — 24, 47, 48, 56, 57, 60, 61, 62 (cấp VHT); 65, 69 (VHT ký trình Tập đoàn). 73 là ký của TGĐ Tập đoàn — kết quả nhận ở bước 74, không qua khối', scr: 'SCR-21' },
    'P-92': { q: 'Bước 21 (Chỉ huy ĐVĐX cho ý kiến dự thảo BM-00) không có nhánh trả lại', src: 'DG-MS13 bước 21; BPMN-DTMS MS13 (12/10)', def: 'GIẢ LẬP — ý kiến ghi vào hồ sơ, ĐVĐX tiếp thu ở bước 22 trước khi chọn CQCM', scr: 'SCR-59' },
    'P-93': { q: 'Thời hạn (ngày làm việc) của các bước mới 23, 24, 42, 46, 53, 55, 56, 57, 61', src: 'DG-MS13 (không ghi thời hạn)', def: 'GIẢ LẬP — 0,5–1 ngày làm việc mỗi bước người dùng; service task 0', scr: 'SCR-42' },
    'P-94': { q: 'VOffice từ chối / lỗi khi trình ký trong khối ký chung', src: 'DG-MS13 bước 76', def: 'GIẢ LẬP — trạng thái "Lỗi gửi VOffice" + nút Gửi lại; từ chối ký = nhánh Không đồng ý của bước chính', scr: 'SCR-21' },
    'P-95': { q: 'Sơ đồ MS13 còn khung "Target KPI ≤ 10 ngày" (DG-MS13 đã bỏ) và lane "Thủ trưởng đơn vị VHT" (bước ghi TGĐ VHT)', src: 'BPMN-DTMS MS13 (12/10), DG-MS13', def: 'Hiển thị tác nhân theo bước (TGĐ VHT); KPI giữ theo QD-16026', scr: 'SCR-42' },
    /* T18 B4 — tuyến Tập đoàn 63–74. */
    'P-96': { q: 'Các Ban chuyên môn, Ban ĐTXD, TGĐ Tập đoàn (bước 67, 70–73) xử lý trên ĐTMS hay VHT nhận văn bản qua VOffice rồi cập nhật', src: 'DG-MS13 bước 67, 70–73; BPMN-DTMS MS13 (12/10) lane Tập đoàn', def: 'GIẢ LẬP — tài khoản "Tập đoàn (giả lập)" xử lý trên ĐTMS như MS01 bước 53–56; phiếu nhận xét BM-09 / BM-10, văn bản đã ký đính kèm ở bước', scr: 'SCR-18' },
    'P-97': { q: 'Bước 69 "TGĐ VHT / lãnh đạo được ủy quyền": khi nào lãnh đạo được ủy quyền ký trình lại thay TGĐ', src: 'DG-MS13 bước 69', def: 'GIẢ LẬP — giao TGĐ VHT; ủy quyền dùng chức năng ủy quyền xử lý chung của hệ thống', scr: 'SCR-21' },
    'P-98': { q: 'Tập đoàn trả lại (70 Chưa đạt, 73 Không đồng ý): có giới hạn số lần, có phải lập lại công văn (64–65) không', src: 'DG-MS13 bước 68, 70, 73', def: 'GIẢ LẬP — không giới hạn; về 68 tiếp thu → 69 ký trình lại (không lập công văn mới), theo mũi tên BPMN', scr: 'SCR-18' },
    'P-99': { q: 'Chuyển hồ sơ lên Tập đoàn (66) khi công văn ký bản cứng / hồ sơ Mật', src: 'DG-MS13 bước 66', def: 'GIẢ LẬP — 66 ghi "chuyển bộ hồ sơ giấy" kèm bản scan đã cập nhật ở 78; ký VOffice thì gửi qua tích hợp', scr: 'SCR-18' },
    /* T21 — luồng Điều chỉnh ĐXMS (MS02), plan T21 §6. */
    'P-100': { q: 'Phạm vi "kết quả đã thực hiện" của ĐXMS cũ lấy ở bước 2', src: 'DG-MS02 §D.2 #1', def: 'GIẢ LẬP — văn bản phê duyệt cũ, YCBG / báo giá, gói thầu, hợp đồng, đơn hàng đã có của ĐXMS; chỉ xem', scr: 'SCR-03' },
    'P-101': { q: 'Hạng mục đã có đơn hàng / hợp đồng có được điều chỉnh không', src: 'DG-MS02 §D.2 #2', def: 'GIẢ LẬP — không khoá; dòng có HĐ gắn nhãn "Đã ký HĐ", cảnh báo khi giảm dưới số đã ký', scr: 'SCR-04' },
    'P-102': { q: 'Trạng thái ĐXMS cũ sau khi điều chỉnh được phê duyệt', src: 'DG-MS02 §D.2 #3', def: 'T34 (D-85): điều chỉnh là ĐXMS mới; ĐXMS cũ "Đã được điều chỉnh" (hết hiệu lực), ĐXMS mới "Đã phê duyệt (điều chỉnh lần n)" mang giá trị sau điều chỉnh', scr: 'SCR-29' },
    'P-103': { q: 'Điều chỉnh / bổ sung ngân sách có chặn phê duyệt điều chỉnh không', src: 'DG-MS02 §D.2 #4', def: 'GIẢ LẬP — không chặn; bước 4 có ô ghi chú ngân sách thực hiện song song', scr: 'SCR-04' },
    'P-104': { q: 'Ký BM-05 song song: một bên từ chối khi bên kia chưa phản hồi', src: 'DG-MS02 §D.2 #5', def: 'GIẢ LẬP — chờ đủ hai kết quả rồi kiểm tra (như BPMN, như MS01)', scr: 'SCR-17' },
    'P-105': { q: 'Ma trận CQCM bắt buộc theo loại nội dung điều chỉnh', src: 'DG-MS02 §D.2 #6', def: 'GIẢ LẬP — bước 16 gợi ý CQCM theo phạm vi đã chọn ở bước 4, TTMS xác nhận ở bước 17', scr: 'SCR-10' },
    'P-106': { q: 'Điều kiện chi tiết nhánh báo cáo TGĐ Tập đoàn của hồ sơ điều chỉnh (bước 48)', src: 'DG-MS02 §D.2 #7', def: 'GIẢ LẬP — chọn sẵn theo căn cứ của ĐXMS cũ: hồ sơ Phê duyệt MS01.02 → Không báo cáo, còn lại → Có; TTMS đổi được (D-39)', scr: 'SCR-16' },
    'P-107': { q: 'VOffice lỗi / từ chối / đổi người ký trong luồng điều chỉnh', src: 'DG-MS02 §D.2 #8', def: 'GIẢ LẬP — như MS01 + Gửi lại (P-94)', scr: 'SCR-21' },
    'P-108': { q: 'Hiệu lực / số lượng báo giá điều chỉnh', src: 'DG-MS02 §D.2 #9', def: 'GIẢ LẬP — ít nhất 1 báo giá nhận sau ngày tạo hồ sơ điều chỉnh; báo giá cũ chỉ để so sánh', scr: 'SCR-07' },
    'P-109': { q: 'Trang MS02 ver1.1 còn bản MS01 cũ nằm khít bên dưới (cùng vị trí, khác nhãn) và một cổng G5 cạnh bước 17 không có mũi tên; 34 "Yêu cầu xử lý lại" về 12 (chỉ nhánh ≥ 160 tỷ)', src: 'BPMN-DTMS trang MS02 ver1.1', def: 'Tool trích lấy hình nằm trên (như drawio hiển thị), bỏ qua G5; 34 → 14 → 11 / 12 theo giá trị như MS01', scr: 'SCR-14' },
    'P-36': { q: 'Ai quản trị từng danh mục (TTMS cho Nhà cung cấp; quản trị hệ thống cho phần còn lại?)', src: 'UC-12-05 (A21)', def: 'Vai Quản trị hệ thống thấy tất cả; vai TTMS chỉ thấy Nhà cung cấp và Loại hàng hoá', scr: 'SCR-30' },
    /* T25 B1 — MS22, plan docs/dtms/prototype-T25-hop-dong-chuan-bi.md §4. */
    'P-119': { q: 'Tiêu chí chọn mẫu dự thảo; có phân mẫu theo giá trị không (ghi chú nêu ví dụ 45 tỷ, chưa phải quy tắc)', src: 'DG-MS22 §D 1–2', def: 'GIẢ LẬP — tiêu chí mẫu đơn giản / đầy đủ, sẵn có / theo yêu cầu theo gợi ý P-236. Nguồn mẫu đã có: lấy từ HSMT / HSYC của gói (T67 H3, QT-10.2.4 §5.2), MS22 bước 3 chỉ xem', scr: 'SCR-102' },
    'P-121': { q: 'Nhà thầu không ký hoặc chậm gửi lại: quay về đâu, ai theo dõi', src: 'DG-MS22 §D 9', def: 'GIẢ LẬP — bước 13 có nút Ghi nhận chưa ký, hồ sơ ở lại bước 13; đề xuất DX-06, không tự thêm nhánh', scr: 'SCR-102' },
    'P-126': { q: 'Mã, tên, mẫu hợp đồng, phụ lục, biên bản thương thảo và checklist áp dụng', src: 'DG-MS22 §D 3', def: 'GIẢ LẬP — mã văn bản tạm HD-PLKT, HD-BODY, HD-PL1, HD-DT, HD-KY; checklist. Mẫu hợp đồng đã có nguồn (BM-HD-2026, danh mục Mẫu hợp đồng — T67 H1)', scr: 'SCR-102' },
    'P-127': { q: 'Thông tin AI kiểm tra, tiêu chí OK / Not OK, mức cảnh báo, cách xác nhận kết quả', src: 'DG-MS22 §D 4', def: 'GIẢ LẬP — AI đối chiếu bảo hành với HSMT và kiểm tra đủ mã hàng; hiện kết quả chỉ xem ở bước 6, 7, 8', scr: 'SCR-102' },
    'P-128': { q: 'Ai quyết định có cần thống nhất lại với nhà thầu, tiêu chí rẽ bước 6 / 7', src: 'DG-MS22 §D 5', def: 'GIẢ LẬP — theo loại cảnh báo AI (điều khoản đã thương thảo → 6, thiếu sót nội bộ → 7); Trưởng phòng trả về thì chọn bằng nút', scr: 'SCR-102' },
    'P-129': { q: 'Thủ trưởng VHT không phê duyệt: sửa ở bước nào; có quay bước 5, 8 và lấy lại ký nháy không', src: 'DG-MS22 §D 6', def: 'GIẢ LẬP — theo mũi tên BPMN về bước 9, không qua lại AI và Trưởng phòng', scr: 'SCR-102' },
    'P-130': { q: 'Khi nào yêu cầu pháp chế, tài chính, đầu tư thẩm định ở bước 10; cách lấy ý kiến', src: 'DG-MS22 §D 7', def: 'GIẢ LẬP — ô ghi ý kiến thẩm định (nếu có) trong form bước 10, không tách bước', scr: 'SCR-102' },
    'P-131': { q: 'Kênh trình Thủ trưởng VHT; cách ghi nhận ký VContract / giấy, người cập nhật, bằng chứng ký đầy đủ', src: 'DG-MS22 §D 8', def: 'GIẢ LẬP — hộp thoại Trình ký như các luồng khác; bước 13 Phòng Hợp đồng nhập số, ngày ký và tải bản đã ký', scr: 'SCR-102' },
    'P-132': { q: 'Email bước 12 gửi thông báo / liên kết VContract hay bản hợp đồng; bản giấy gửi và nhận thế nào', src: 'DG-MS22 §D 11', def: 'GIẢ LẬP — chọn hình thức bằng nút, ghi chú cách gửi trong form', scr: 'SCR-102' },
    'P-133': { q: 'Nguồn mã hàng ở bước 2 và cách cập nhật', src: 'DG-MS22 §D 10', def: 'GIẢ LẬP — ĐVSD nhập mã hàng theo từng hạng mục', scr: 'SCR-102' },
    'P-134': { q: 'Hợp đồng đang tạm dừng ký do kiến nghị KQLCNT (Điều 38): chặn ở bước nào của MS22, gỡ bằng gì', src: 'BPMN-DTMS trang MS22 không thể hiện; HĐ-2026-0052', def: 'GIẢ LẬP — bước 9 bắt buộc nhập số văn bản giải quyết kiến nghị trước khi trình ký', scr: 'SCR-102' },
    /* T25 B3 — MS24, DG-MS24 §D. */
    'P-124': { q: 'Chức danh, thẩm quyền người ký Phòng tài chính trong hai tuyến; "có thể là Trưởng phòng" chưa là kết luận', src: 'DG-MS24 §D 3', def: 'GIẢ LẬP — Trưởng phòng Tài chính kế toán ký bước 7, 13 và làm bước 18, 19', scr: 'SCR-102' },
    'P-125': { q: 'Dữ liệu đồng bộ SAP, thời điểm, thành công / thất bại, gửi lại, tiêu chí kết thúc lần thanh toán', src: 'DG-MS24 §D 12', def: 'GIẢ LẬP — bước 20 ghi Thành công / Lỗi; lỗi thì Phòng Tài chính kế toán có việc Gửi lại SAP như VOffice P-94', scr: 'SCR-102' },
    'P-144': { q: 'Đơn vị, người tập hợp và bổ sung hồ sơ (Chuyên quản / ĐVMS); tên đầy đủ YCCT, nguồn giao việc', src: 'DG-MS24 §D 1', def: 'GIẢ LẬP — chuyên viên Phòng Hợp đồng (vai R-DVMS) làm bước 1, 3; không tách tài khoản với nhân sự chuyên thanh toán', scr: 'SCR-102' },
    'P-145': { q: 'Hợp đồng nào bắt buộc bảng tổng hợp; ai chọn Có / Không', src: 'DG-MS24 §D 2', def: 'GIẢ LẬP — nhân sự chuyên thanh toán chọn ở bước 2, mặc định Có', scr: 'SCR-102' },
    'P-146': { q: 'Tên trạng thái, thông tin và minh chứng bắt buộc theo phương thức thanh toán ở bước 19', src: 'DG-MS24 §D 4', def: 'GIẢ LẬP — một trạng thái Đã thanh toán; bắt buộc tải minh chứng, không phân theo phương thức', scr: 'SCR-102' },
    'P-147': { q: 'Checklist đủ căn cứ theo tạm ứng, bảo lãnh, giai đoạn; ai chốt ở bước 2; kế hoạch và số tiền từng đợt', src: 'DG-MS24 §D 5', def: 'GIẢ LẬP — checklist căn cứ; đợt có mốc chưa có ngày thực tế thì không tạo được hồ sơ; khi kiểm tra người xử lý chọn nút. Kế hoạch và số tiền từng đợt đã có nguồn: sinh theo phương thức thanh toán của mẫu hợp đồng (T67 H4: HĐ-2026-0052 mẫu 1.6, 10 / 30 / 60)', scr: 'SCR-102' },
    'P-148': { q: 'Mẫu đề nghị chuyển tiền và bảng tổng hợp, thông tin bắt buộc, nguồn dữ liệu', src: 'DG-MS24 §D 6', def: 'GIẢ LẬP — mã văn bản tạm TT-DNCT, TT-BTH, nội dung tự đặt', scr: 'SCR-102' },
    'P-149': { q: 'AI đọc hoá đơn thế nào, tổng hợp gì, xử lý thiếu / sai dữ liệu, ai rà soát trước khi trình ký', src: 'DG-MS24 §D 7', def: 'GIẢ LẬP — bảng tổng hợp lấy từ số hoá đơn và kế hoạch thanh toán; không có bước rà soát riêng', scr: 'SCR-102' },
    'P-150': { q: 'Trả sửa rồi ký lại: quản lý phiên bản, chữ ký, ý kiến của bản trước', src: 'DG-MS24 §D 8', def: 'GIẢ LẬP — trình lại đủ các cấp từ Phòng tài chính; ý kiến giữ ở lịch sử hồ sơ', scr: 'SCR-102' },
    'P-151': { q: 'Sửa đề nghị làm đổi số tiền / hoá đơn của bảng tổng hợp đã ký thì xử lý thế nào (BPMN không quay về tuyến bảng tổng hợp)', src: 'DG-MS24 §D 9', def: 'GIẢ LẬP — số tiền đọc theo kế hoạch, bước 17 không sửa số tiền', scr: 'SCR-102' },
    'P-152': { q: 'Hình thức ký ngoài VOffice / VContract, phạm vi tích hợp, cách ghi nhận đã ký hoặc từ chối', src: 'DG-MS24 §D 10', def: 'GIẢ LẬP — chọn một lần ở bước 12, mỗi cấp bấm Đồng ý và ký, không gọi tích hợp', scr: 'SCR-102' },
    'P-153': { q: 'Căn cứ xác định đã thanh toán; chuyển tiền lỗi; minh chứng tiền mặt', src: 'DG-MS24 §D 11', def: 'GIẢ LẬP — Phòng Tài chính kế toán nhập ngày, số chứng từ; chưa dựng chuyển tiền lỗi', scr: 'SCR-102' },
    /* T25 B4 — MS23.03, MS23.04: hai DG này không có mục cần đặc tả, các điểm dưới từ bản vẽ và khi dựng. */
    'P-154': { q: 'MS23.03: Văn thư kiểm tra không đạt quay về bước nào (bản vẽ để nhánh treo, diễn giải chỉ ghi "trả Phòng Hợp đồng")', src: 'BPMN-DTMS trang MS23.03 cổng G7; DG-MS23.03 §C.11', def: 'GIẢ LẬP — về bước 6, như các cấp ký khác', scr: 'SCR-102' },
    'P-155': { q: 'Ai chốt phương án ký chung / riêng: MS23.03 bước 6 và MS23.04 bước 1 đều kiểm tra', src: 'DG-MS23.03 §C.6; DG-MS23.04 §C.1', def: 'GIẢ LẬP — chốt một lần ở MS23.03 bước 6; MS23.04 bước 1 chỉ xác nhận', scr: 'SCR-102' },
    'P-156': { q: 'Ký chung bị trả: sửa biên bản thanh lý ở đâu, có cần qua lại MS23.04 không', src: 'DG-MS23.03 §C.15; DG-MS23.04 §C.15', def: 'GIẢ LẬP — sửa ở MS23.03 bước 6, biên bản thanh lý giữ nguyên, tập hợp lại ở bước 7', scr: 'SCR-102' },
    'P-157': { q: '"Giám đốc" và "Tổng Giám đốc" của hai tuyến ký là chức danh nào', src: 'DG-MS23.03 §B.3; DG-MS23.04 §B.3', def: 'GIẢ LẬP — Giám đốc = Phó Tổng Giám đốc, Tổng Giám đốc = Tổng Giám đốc VHT', scr: 'SCR-102' },
    'P-158': { q: 'Tiêu chí AI kiểm tra hồ sơ sau hoàn thiện ở MS23.03 bước 8, MS23.04 bước 8', src: 'DG-MS23.03 §C.8; DG-MS23.04 §C.8', def: 'GIẢ LẬP — mặc định đạt; nhánh không đạt bật bằng công cụ demo', scr: 'SCR-102' },
    'P-159': { q: 'Nội dung, căn cứ quyết toán giá trị ở nhánh ký riêng; nhánh ký chung quyết toán ở đâu', src: 'DG-MS23.04 §B.5, §C.5', def: 'GIẢ LẬP — nhập giá trị quyết toán, mặc định bằng giá trị hợp đồng; ký chung lấy giá trị hợp đồng', scr: 'SCR-102' },
    'P-160': { q: 'Thanh lý khi chưa thanh toán đủ hoặc chưa hết bảo hành: có chặn không', src: 'DG-MS23.04 không nêu; MS24 không có mũi tên sang thanh lý', def: 'GIẢ LẬP — không chặn; tab Thanh lý hiện điều kiện chưa hoàn thành', scr: 'SCR-102' },
    /* T25 B6 — MS23.02 Bàn giao, DG-MS23.02 §D (16 điểm; P-122 gộp §D 4, 5; P-123 gộp §D 8, 14). */
    'P-122': { q: 'Hạn 7 ngày tính ngày làm việc hay ngày lịch, căn cứ có hàng trong hạn; ai quyết định từ chối ngay hay cho thay thế', src: 'DG-MS23.02 §D 4, 5', def: 'GIẢ LẬP — 7 ngày làm việc từ ngày lập biên bản, trừ thứ Bảy, Chủ nhật; ngày giao bổ sung phải trong hạn; Phòng Quản lý tài sản quyết định ở bước 7 theo diễn giải', scr: 'SCR-102' },
    'P-123': { q: 'Tuyến ký HOC, hình thức ký; tuyến duyệt và hồ sơ hủy', src: 'DG-MS23.02 §D 8, 14', def: 'GIẢ LẬP — không thêm cấp ký: bước 21 chọn hình thức, ghi nhận đã đủ chữ ký; hủy không có tuyến duyệt riêng, hủy toàn bộ thì hợp đồng Chấm dứt', scr: 'SCR-102' },
    'P-174': { q: 'Phân công kiểm tra chất lượng giữa Phòng Quản lý tài sản và Đơn vị sử dụng', src: 'DG-MS23.02 §D 1', def: 'GIẢ LẬP — Phòng Quản lý tài sản lập yêu cầu, Đơn vị sử dụng ghi nhận kết quả, không có bước duyệt kết quả', scr: 'SCR-102' },
    'P-175': { q: 'Mẫu giao nhận, hồ sơ kho, yêu cầu kiểm tra và thao tác trên ĐTMS / SAP', src: 'DG-MS23.02 §D 2', def: 'GIẢ LẬP — tải hồ sơ ở Danh sách tài liệu; thao tác SAP chưa dựng', scr: 'SCR-102' },
    'P-176': { q: 'Tiêu chí đạt / không đạt, cách ghi nhận lần đầu và sau thay thế, minh chứng', src: 'DG-MS23.02 §D 3', def: 'GIẢ LẬP — người kiểm tra chọn Đạt / Không đạt, bắt buộc tải kết quả KCS; form ghi rõ lần kiểm tra lại', scr: 'SCR-102' },
    'P-177': { q: 'Tiêu chí, thẩm quyền chọn phạt, hủy hay xin ý kiến; quản lý phạm vi hàng lỗi', src: 'DG-MS23.02 §D 6', def: 'GIẢ LẬP — Đơn vị sử dụng chọn một hướng ở bước 10', scr: 'SCR-102' },
    'P-178': { q: 'Sau khi MS23.01 có kết quả xử lý vi phạm, hồ sơ quay lại đâu hay kết thúc', src: 'DG-MS23.02 §D 7', def: 'GIẢ LẬP — bước 11 mở hồ sơ MS23.01 Biên bản phạt; hồ sơ bàn giao giữ trạng thái chờ, không tự nối lại', scr: 'SCR-102' },
    'P-179': { q: 'Nhánh tiếp theo sau ý kiến chỉ đạo ở bước 13', src: 'DG-MS23.02 §D 9', def: 'GIẢ LẬP — hồ sơ giữ trạng thái chờ ý kiến chỉ đạo, chưa có bước tiếp', scr: 'SCR-102' },
    'P-180': { q: 'Mẫu xác nhận dịch vụ, cách chuyển hồ sơ sang MS23.03', src: 'DG-MS23.02 §D 10', def: 'GIẢ LẬP — xong bước 4 ghi dòng Luồng con cần khởi tạo; hồ sơ MS23.03 tạo từ dòng này đi nhánh KCS dịch vụ; mốc giao không cập nhật vì không có HOC', scr: 'SCR-102' },
    'P-181': { q: 'Tên gọi, mẫu HOC chính thức; lập theo từng đợt hay toàn bộ; hồ sơ bắt buộc', src: 'DG-MS23.02 §D 11', def: 'GIẢ LẬP — mỗi đợt một HOC; BG-HOC, BG-TB, BG-BBKD, BG-TTR là mã tạm', scr: 'SCR-102' },
    'P-182': { q: 'Tiêu chí AI bước 16, 19, xử lý cảnh báo, ai xác nhận', src: 'DG-MS23.02 §D 12', def: 'GIẢ LẬP — mặc định đạt; nhánh không đạt bật bằng công cụ demo', scr: 'SCR-102' },
    'P-183': { q: 'Trưởng phòng không duyệt: tập hợp lại toàn bộ hay chỉ hoàn thiện HOC', src: 'DG-MS23.02 §D 13', def: 'GIẢ LẬP — về bước 14 theo mũi tên bản vẽ, đi lại AI kiểm tra và hoàn thiện', scr: 'SCR-102' },
    'P-184': { q: 'Ngoài ngày bàn giao còn cập nhật gì; thiếu ngày thì sao; tránh cập nhật hai lần', src: 'DG-MS23.02 §D 15', def: 'GIẢ LẬP — chỉ cập nhật ngày; ngày bàn giao bắt buộc nhập ở bước 21; nhận diện theo mã hồ sơ', scr: 'SCR-102' },
    'P-185': { q: 'Mũi tên chưa gắn đầu cuối: 2 → 3, 9 → 10, 10 → cổng hướng xử lý, 15 → 14', src: 'DG-MS23.02 §D 16; plan T25 §9 B0', def: 'GIẢ LẬP — chạy theo diễn giải', scr: 'SCR-102' },
    /* T29 S5 — trường theo HT-DXMS-NOTE ("TTr" trong Note = ĐXMS), plan docs/dtms/prototype-T29-dxms-khao-sat-0411-chuan-bi.md §3.9, D-59. */
    'P-189': { q: 'Nghĩa của "Cập nhật người xem" ở hệ thống cũ: ai được thêm, được xem những gì, có hết hạn không', src: 'HT-DXMS-NOTE màn 7; plan T29 F9', def: 'GIẢ LẬP — người tạo ĐXMS thêm người dùng được xem ĐXMS và mọi hồ sơ của nó (chỉ xem, không xử lý việc), ngoài phạm vi xem theo vai trò', scr: 'SCR-97' },
    'P-190': { q: 'Danh mục Khối đơn vị và đơn vị thuộc từng khối', src: 'HT-DXMS-NOTE màn 1, 6 (Khối 1, 2, 3, Khối cơ quan)', def: 'GIẢ LẬP — Khối 1: Trung tâm Vô tuyến, Trung tâm Mạng lõi; Khối 2: Trung tâm Phần mềm, Trung tâm Thiết kế vi mạch; Khối 3: Nhà máy sản xuất thử nghiệm; Khối cơ quan: các phòng, ban', scr: 'SCR-95' },
    'P-191': { q: 'Tình trạng của từng CQCM: Chưa xem / Đang xem lấy theo sự kiện nào; Số ngày xử lý tính từ đâu tới đâu', src: 'HT-DXMS-NOTE màn 6, 10; plan T29 F8', def: 'GIẢ LẬP — Chưa xem: việc lập phiếu nhận xét chưa có bản lưu nháp; Đang xem: đã lưu nháp hoặc đang trình chỉ huy CQCM ký; Đã đồng ý / Yêu cầu sửa: phiếu đã ký, không có / có mục Không OK. Số ngày xử lý: ngày làm việc từ lúc gửi yêu cầu thẩm định tới lúc ký phiếu (chưa ký thì tới hôm nay)', scr: 'SCR-20' },
    'P-193': { q: 'Dự toán của nhiệm vụ / đề tài, dự án (Loại chi phí, Khoản mục, Giá trị, Hình thành gói thầu) lấy từ đâu; một Loại chi phí có chọn lại được ở đợt sau không', src: 'HT-DXMS-NOTE màn 4, 5, 8; GA-KDT-0411; DTMS_Q_0070', def: 'GIẢ LẬP — dự toán nhập tại ĐTMS ở SCR-104 cho mọi Loại (D-65), dữ liệu mẫu PL1–PL6 theo đề tài / dự án; card bóc tách chỉ hiện khoản mục Chi mua sắm còn khả dụng; Loại KHCN thì dòng thêm vào là hạng mục căn cứ (D-60), loại khác chỉ tham khảo, căn cứ là tệp đính kèm (D-30); chọn lại được một khoản mục ở nhiều đợt tới khi hết phần còn lại', scr: 'SCR-96' },
    'P-194': { q: 'Danh sách người thẩm định chọn ngay khi tạo luồng (DX-08): có bắt buộc không, bước 16 có được sửa không', src: 'HT-DXMS-NOTE màn 8; DX-08', def: 'GIẢ LẬP — không bắt buộc; danh sách điền sẵn vào bước 16 (chọn CQCM), đơn vị và TTMS vẫn sửa được ở bước 16, 17; chọn Đích danh hoặc Theo vai trò của phòng ban (D-62)', scr: 'SCR-96' },
    'P-192': { q: 'Số, Ngày Tờ trình có từ thời điểm nào; Đợt mua sắm đánh số tự động hay đơn vị nhập', src: 'HT-DXMS-NOTE màn 7, 8; plan T29 F5, F6', def: 'GIẢ LẬP — Số, Ngày Tờ trình cấp khi hồ sơ gửi yêu cầu thẩm định (BM-03 trình ký kèm Tờ trình); Đợt = số thứ tự ĐXMS của cùng nhiệm vụ / đề tài, dự án, hệ thống gợi ý, đơn vị sửa được', scr: 'SCR-96' },
    /* T29 v0.4 — YC-DXMS-PROTO (plan §3.10). SCR-103 Đề tài / dự án dựng ở B8. */
    'P-195': { q: 'Đề tài / dự án không phải Loại KHCN (SXKD, Dự án đầu tư, Hoạt động TX…) có thông tin chung lấy từ đâu ở Pha 1', src: 'YC-DXMS-PROTO §2.1; HT-DXMS-NOTE màn 1; TPL-DADT-EX', def: 'GIẢ LẬP — danh sách hiện mọi Loại (D-61); Loại KHCN có nguồn "Đồng bộ KHCN", SXKD / Dự án đầu tư "Đồng bộ HR Tool" (T36, P-227), loại khác "Chuyển từ hệ thống cũ", chỉ xem. Dự toán nhập tại ĐTMS cho mọi Loại (D-65); bóc tách làm căn cứ ĐXMS chỉ Loại KHCN (D-60), loại khác căn cứ vẫn là tệp đính kèm (D-30)', scr: 'SCR-103' },
    'P-186': { q: 'Phiếu yêu cầu rà soát tồn kho do ai lập: hệ thống sinh và gửi ở service task 6, hay đơn vị đề xuất lập phiếu (BM-RSTK ghi "căn cứ phiếu yêu cầu … số …/PYC")', src: 'BM-RSTK; GA-DXMS-0411 [03:48–04:51]; DTMS_Q_0080; INDEX C14', def: 'GIẢ LẬP — hệ thống sinh phiếu số …/PYC-RS từ hạng mục bước 5 và gửi ở service task 6; đơn vị không thao tác', scr: 'SCR-105' },
    'P-187': { q: 'Ai ký Biên bản rà soát vật tư, linh kiện tồn kho (BM-RSTK có Người lập, Thủ kho, GĐ TTMS nhưng Người lập = Thủ kho cùng chữ ký; ghi âm đề xuất Thủ kho → Chỉ huy QLTS → GĐ) và ký ở bước nào', src: 'BM-RSTK; BG-0411; GA-DXMS-0411 [08:56–09:38]; DTMS_Q_0136; DX-07', def: 'GIẢ LẬP — chân ký Thủ kho → Chỉ huy bộ phận QLTS → GĐ TTMS; biên bản sinh khi Kho lưu kết quả, trạng thái "Chờ ký — chờ DX-07"', scr: 'SCR-105' },
    'P-196': { q: 'Số tồn kho lấy từ WMS bằng API hay Bộ phận Kho / QLTS nhập tay', src: 'YC-DXMS-PROTO §4.3; BG-0411; BM-RSTK; INDEX C14; DTMS_Q_0080', def: 'GIẢ LẬP — NV QLTS / Thủ kho nhập ở tab Rà soát tồn kho; nút "Lấy số tồn từ WMS" điền số mẫu, người nhập vẫn sửa được', scr: 'SCR-97' },
    'P-197': { q: 'YC-DXMS-PROTO §6 ghi Đồng ý chuyển sang "BM-05 hoặc BM-09", Yêu cầu sửa trả ĐV "giải trình (BM-02)" — khác BPMN bước 19–26 (BM-04, AI tóm tắt NOK sau khi đủ BM-04)', src: 'YC-DXMS-PROTO §6; BPMN-DTMS MS01 v1.1 bước 19–26; QT-10.2.1 (BM-05 = Báo cáo kết quả thẩm định)', def: 'Theo BPMN: Đồng ý / Yêu cầu sửa là kết luận BM-04 của từng CQCM; hồ sơ về ĐV sau bước 23–25', scr: 'SCR-11' },
    'P-198': { q: 'Loại dự án (chi tiết) ứng với từng Loại ngoài KHCN; Note có 6 Loại, TPL-DADT-IM chỉ 4; "Hỗ trợ KHCN" thuộc Loại nào', src: 'HT-DXMS-NOTE màn 1, 4; TPL-DADT-IM sheet List', def: 'GIẢ LẬP — KHCN: 7 giá trị theo Note; Hoạt động TX: Thường xuyên; SXKD: Dự án Kinh doanh, Dự án sản xuất, Chương trình nội bộ; Dự án đầu tư: Dự án đầu tư mua sắm tài sản, Dự án đầu tư xây dựng Kinh doanh thử nghiệm; Dự án đầu tư khác, Dự án kinh doanh khác: chưa có Loại chi tiết; Hỗ trợ KHCN chưa xếp vào Loại nào (chỉ hiện khi chưa chọn Loại). Từ 11/11/2026 cấu hình ở danh mục SCR-112 cột Loại cha', scr: 'SCR-103' },
    'P-199': { q: 'Ô Nhập tay của dòng dự toán khi không tick: Thuế GTGT tính thế nào (câu ghi chú bị bỏ dở)', src: 'HT-DXMS-NOTE màn 5', def: 'GIẢ LẬP — không tick: Thuế GTGT = Giá trị trước thuế × %VAT, ô Thuế khoá; tick: người dùng tự nhập Thuế GTGT. Giá trị sau thuế = trước thuế + Thuế GTGT', scr: 'SCR-104' },
    'P-200': { q: 'Lịch sử ý kiến thẩm định ở màn thẩm định CQCM: YC-DXMS-PROTO §5 ghi hiện "toàn bộ cây góp ý của các CQCM khác", BR-DXMS-07-04 và comment #14 ghi CQCM không thấy nội dung BM-04 của cơ quan khác', src: 'YC-DXMS-PROTO §5; DTMS_CN_0159; BR-DXMS-07-04; comment Figma #14', def: 'GIẢ LẬP — cơ quan mình thấy đủ nội dung các lần; cơ quan khác chỉ thấy sự kiện, người, thời điểm và kết luận (Đồng ý / Yêu cầu sửa, số mục Không OK)', scr: 'SCR-11' },
    /* T31 — KĐT theo IA-DXMS (plan prototype-T31-kdt-ia-chuan-bi.md). */
    'P-201': { q: 'Tệp "[KDT] Information Architecture.xlsx" có phải IA riêng cho Khoản đầu tư (đang dở, nội dung còn của ĐXMS) không', src: 'IA-DXMS; GA-KDT-0411 [08:09–08:14]', def: 'GIẢ LẬP — dùng IA-DXMS làm danh sách thành phần màn cho KĐT (D-67); nội dung tờ trình theo BM-8.6.5, không theo mẫu ĐXMS', scr: 'SCR-54' },
    'P-202': { q: 'Bộ lọc "Chi phí năm" ở tìm kiếm Soạn thảo TTr nghĩa là gì (năm của dự toán, năm ghi nhận chi phí hay năm kế hoạch)', src: 'IA-DXMS UI Component 0.2 dòng 11; draft 0.1 dòng 9, 67', def: 'Chưa dựng: Danh sách KĐT không có bộ lọc này tới khi BA trả lời', scr: 'SCR-54' },
    /* Góp ý người dùng 05/11 — tab Dự toán chi phí của Đề tài / dự án chỉ xem. */
    'P-203': { q: 'Khoản mục Chi mua sắm ở Trạng thái Hoàn thành có ảnh hưởng gì (không bóc tách thêm vào ĐXMS / KĐT? giải phóng phần còn lại?); ai được đổi lại Đang thực hiện', src: 'Góp ý người dùng 05/11 (tab Dự toán chi phí); HT-DXMS-NOTE màn 4 (cột Trạng thái)', def: 'GIẢ LẬP — chỉ TTMS chọn; Hoàn thành thì khoản mục không còn trong danh sách bóc tách của ĐXMS / KĐT, phần đã giữ không đổi; đổi lại Đang thực hiện thì bóc tiếp được', scr: 'SCR-104' },
    'P-204': { q: 'Dự toán chi phí chỉ xem trên ĐTMS thì dữ liệu lấy từ đâu (phân hệ KHCN đồng bộ, import mẫu, hay chuyển từ hệ thống cũ); HT-DXMS-NOTE ghi KHCN chưa cung cấp dự toán', src: 'Góp ý người dùng 05/11 (chỉ xem, không thêm mới); HT-DXMS-NOTE sheet "KHCN Thông tin Dự toán"; DTMS_Q_0070', def: 'GIẢ LẬP — dữ liệu mẫu coi như đã có từ hệ thống nguồn; ĐTMS chỉ ghi Chi mua sắm, Trạng thái', scr: 'SCR-104' },
    'P-210': { q: 'DX-10: mã vai trò và người của Chỉ huy Kho, Chuyên viên Thầu TTMS, Chỉ huy Thầu TTMS; bước 5.1 / 7.1 / 10.1 / 16.1 có thời hạn (NLV) bao nhiêu', src: 'DX-10; D-83; review Huylx4 05/11 #25, #27–31', def: 'GIẢ LẬP — vai R-QLTS-CH, R-TTMS-THAU, R-TTMS-THAU-CH; mỗi bước duyệt 0,5 NLV; Trả lại bắt buộc lý do', scr: 'SCR-03' },
    'P-211': { q: 'Căn cứ pháp lý điền sẵn của ĐXMS: QT.CNVTQĐ.ĐTXD.8.6.3.23 ngày 29/03/2025 (hệ thống cũ, HT-DXMS-TT) còn hiệu lực hay đã thay bằng QT-10.2.1; ai cập nhật danh sách căn cứ mặc định', src: 'HT-DXMS-IMG (Soạn thảo TTr kinh phí); HT-DXMS-TT; INDEX C15', def: 'GIẢ LẬP — điền sẵn hai căn cứ như hệ thống cũ (QC-12868, QT 8.6.3.23), người tạo sửa được; thật là tham số hệ thống do TTMS cập nhật', scr: 'SCR-96' },
    'P-212': { q: 'Phụ lục của Tờ trình chọn Có: tệp bắt buộc ở bước nào (khi tạo luồng hay khi gửi dự thảo); có phụ lục nào hệ thống tự sinh (Danh mục mua sắm chi tiết từ bóc tách, báo giá) thay vì tải lên', src: 'HT-DXMS-IMG (6 cờ Có / Không); HT-DXMS-NOTE màn 8; IA-DXMS dòng 18, 95–100', def: 'GIẢ LẬP — chọn Có / Không khi tạo luồng (mặc định Không), Có thì tải tệp được ngay; ở bước lập dự thảo sửa được lựa chọn, phụ lục Có bắt buộc có tệp mới gửi được; Tờ trình in danh sách ở mục Danh mục hồ sơ kèm theo', scr: 'SCR-96' },
    'P-213': { q: 'Nút "Đặt giá trị mặc định" của màn YCBG cũ: giá trị mặc định của Điều kiện thanh toán, Địa điểm giao hàng, Các yêu cầu khác cấu hình ở đâu — toàn hệ thống, theo đơn vị hay theo loại hàng hoá', src: 'HT-DXMS-IMG (Yêu cầu báo giá / Cập nhật)', def: 'GIẢ LẬP — một bộ giá trị mẫu (D.ycbgTerms0) điền sẵn khi mở phiếu ở bước 8; eForm không có nút trong form, đặt lại giá trị mặc định = cần dev riêng (hoặc xoá nháp mở lại)', scr: 'SCR-106' },
    'P-214': { q: 'BM-YCKT bắt buộc nêu thời gian bảo hành và năm sản xuất: là trường chung của phiếu YCBG, cột theo từng dòng hàng, hay chỉ nằm trong tệp Yêu cầu kỹ thuật', src: 'BM-YCKT (Lưu ý); BM-YCBG (bảo hành ≥ mức NSX)', def: 'GIẢ LẬP — hai trường chung ở Điều khoản: Bảo hành tối thiểu (tháng, mặc định 12), Năm sản xuất từ (mặc định năm trước)', scr: 'SCR-106' },
    'P-215': { q: 'Nút "Soạn thảo" của màn YCBG cũ sinh công văn Word: BM-YCBG là công văn TGĐ ký — YCBG gửi email tự động (bước 9) có cần công văn ký kèm không; nếu có thì ký ở bước nào', src: 'HT-DXMS-IMG (nút Soạn thảo); BM-YCBG; BR-DXMS-04-06', def: 'GIẢ LẬP — không ký: email gửi nội dung phiếu + tệp đính kèm; mẫu BM-YCBG tải ở "Chọn mẫu tài liệu" của bước 8; sinh công văn điền sẵn = văn bản đầu ra của bước 8 khi BA xác nhận', scr: 'SCR-106' },
    'P-216': { q: 'AI bước 3 (gợi ý thông tin cơ bản) chạy tự động khi chọn căn cứ trên màn Lập ĐXMS hay khi người dùng bấm nút', src: 'BPMN MS01 v1.1 task 2, 3; DX-11', def: 'Người dùng chốt 06/11: theo nút Gợi ý từ AI (không tự chạy khi chọn đề tài); đổi đề tài thì báo và có nút Gợi ý lại. Chờ BA ghi vào DX-11', scr: 'SCR-96' },
    'P-217': { q: 'Đổi căn cứ sau khi người dùng đã sửa gợi ý AI: giữ nội dung đã sửa hay thay bằng gợi ý mới', src: 'DX-11', def: 'GIẢ LẬP — dòng đã Sửa giữ nội dung, gắn nhãn "Căn cứ đã đổi — xem lại"; dòng khác nhận gợi ý mới, về Chưa xử lý', scr: 'SCR-96' },
    'P-218': { q: 'Nguồn số tồn kho sổ sách AI dùng ở bước 6 (đối chiếu khi bóc tách): WMS hay phân hệ Quản lý kho của ĐTMS', src: 'BPMN MS01 v1.1 task 6; BG-0411; C14', def: 'GIẢ LẬP — số mẫu của hồ sơ demo; Kho vẫn rà soát thực tế ở bước 7', scr: 'SCR-96' },
    'P-219': { q: 'Bước 10 không so sánh / đánh giá báo giá trên hệ thống (review nhi 06/11 #2, #3): bỏ hẳn DX-03 (AI kiểm tra báo giá) và đối chiếu phần căn cứ theo đơn giá (T29 B4 P1), hay kiểm phần căn cứ theo Giá trị báo giá cuối cùng; giá trị cuối cùng có cần tách theo hạng mục / loại chi phí cho Tờ trình mục 3 không', src: 'Review nhi 06/11 #2, #3, #7; DX-03; BR-DXMS-04-10, 04-11', def: 'GIẢ LẬP — tạm ẩn card Đánh giá báo giá (cờ D.quoteManual); Thầu tải tệp + nhập một giá trị cuối cùng (đồng, gồm VAT) = giá trị hồ sơ cho cổng Giá trị; không chạy AI kiểm tra báo giá, không chặn vượt căn cứ', scr: 'SCR-07' },
    'P-221': { q: 'Thầu sửa tên, xoá, thêm hàng hoá trên phiếu YCBG ở bước 8 (review nhi 06/11 #23) và bỏ bảng Đối soát ĐXMS (#24): phiếu gửi nhà cung cấp được khác danh mục ĐXMS đã xác nhận ở mức nào, có cần đồng bộ ngược về danh mục hồ sơ hay trả ĐVĐX xác nhận lại không', src: 'Review nhi 06/11 #23, #24; P-73', def: 'GIẢ LẬP — chỉ đổi trên phiếu YCBG, danh mục hồ sơ dùng cho Tờ trình không đổi, không kiểm tra lại', scr: 'SCR-07' },
    'P-222': { q: 'Sửa Phụ lục chi phí ở bước Soạn thảo tờ trình (review nhi 06/11 #36): được lệch giá trị báo giá đã được Chỉ huy Thầu phê duyệt ở 10.1 không; qua ngưỡng 160 tỷ thì đổi biểu mẫu tại chỗ hay phải quay lại bước 10 / 10.1', src: 'Review nhi 06/11 #36; D-54', def: 'GIẢ LẬP — lệch giá chỉ cảnh báo; qua ngưỡng thì khi gửi hồ sơ đổi luồng con, biểu mẫu và Checklist theo giá trị mới, người soạn kiểm tra lại rồi gửi; đơn giá mẫu quy đổi theo tỷ lệ cho khớp giá trị cuối cùng', scr: 'SCR-08' },
    'P-223': { q: 'Tạm ẩn bảng AI bước 6 Bóc tách và đối chiếu ở màn Lập ĐXMS (review nhi 06/11 #18): bỏ hẳn bước 6 trên BPMN hay chỉ ẩn trên giao diện; khi đó ai kiểm số lượng đề xuất so với số còn được dùng', src: 'Review nhi 06/11 #18; BPMN MS01 v1.1 bước 6', def: 'GIẢ LẬP — ẩn bảng bằng cờ D.bocHide, áp dụng theo số đề xuất của căn cứ; popup còn dữ liệu căn cứ và bảng điền Loại chi phí', scr: 'SCR-96' },
    'P-250': { q: 'AI gợi ý điền phiếu Yêu cầu báo giá ở bước 8 (kho comment #86): AI lấy nguồn nào cho Điều kiện thanh toán, Địa điểm giao hàng, Các yêu cầu khác; có gợi ý thêm Model / Yêu cầu kỹ thuật từng hàng hoá không', src: 'Kho comment #86 (Phong BA 16/11); D-122', def: 'GIẢ LẬP — nút ✦ Gợi ý từ AI ở nhóm Thông tin chung (khuôn aiFill như Tờ trình), điền các ô điều khoản đang trống theo giá trị mẫu của hồ sơ demo, mỗi ô ghi nguồn; chưa gợi ý dòng hàng hoá', scr: 'SCR-106' },
    'P-224': { q: 'Chọn đích danh Người thẩm định của từng CQCM ở bước 16 (review nhi 06/11 #40): danh sách người lấy từ đâu; lãnh đạo CQCM có được đổi người được giao không', src: 'Review nhi 06/11 #40; D-27', def: 'GIẢ LẬP — danh sách chuyên viên mẫu theo đơn vị, mặc định người đầu danh sách; bước 19 giao đúng người đã chọn, bước 20 vẫn là lãnh đạo CQCM', scr: 'SCR-10' },
    'P-225': { q: 'Bước 18 "Gửi yêu cầu thẩm định, trình ký và thông báo" (tác nhân Hệ thống): ai là Đại diện đơn vị đề xuất ký BM-03; bước 16.1 Chỉ huy ĐVĐX duyệt trên ĐTMS có thay được việc ký không; hồ sơ Mật ký bản cứng thì ai tải bản scan, CQCM có phải chờ ký xong mới nhận yêu cầu không', src: 'BPMN-DTMS trang MS01 v1.1 bước 17, 18; BM-10.2.1 BM-03 (khối ký Đại diện đơn vị đề xuất); QT-10.2.1 bước 2', def: 'GIẢ LẬP — hệ thống tự trình Chỉ huy ĐVĐX (người duyệt 16.1) ký BM-03 theo Hình thức trình ký của hồ sơ (Mật: bản cứng), nhận kết quả ngay rồi gửi CQCM; 16.1 vẫn tách riêng với việc ký; chưa dựng bước tải bản scan', scr: 'SCR-22' },
    'P-226': { q: 'ĐXMS Dừng xử lý muốn làm lại: tạo ĐXMS mới từ đầu hay có chức năng Sao chép; ĐXMS mới có giữ liên kết tới ĐXMS cũ không, căn cứ đang giữ của ĐXMS cũ trả lúc nào', src: 'T34 (người dùng 09/11, mô hình 1 ĐXMS – 1 hồ sơ)', def: 'GIẢ LẬP — nút Sao chép thành ĐXMS mới: chép thông tin chung, Sao chép từ = ĐXMS cũ, chưa có hồ sơ; căn cứ của ĐXMS cũ trả khi dừng', scr: 'SCR-29' },
    'P-227': { q: 'HR Tool có phải nguồn đề tài / dự án của ĐTMS không, cho Loại nào; trạng thái, Mật, dự toán chi tiết của đề tài từ HR Tool lấy từ đâu (HR Tool chỉ có trạng thái phân bổ chi phí nhân công, không có cờ Mật, chỉ có Tổng dự toán)', src: 'T36 (người dùng 09/11, D-96); be/hrtool mission; YC-DXMS-PROTO §2.1; DTMS_Q_0438, 0439, 0441, 0442', def: 'GIẢ LẬP — HR Tool cấp Loại SXKD, Dự án đầu tư (phân loại SXKD, DTPT); nhiệm vụ KHCN bỏ qua, ghi Cảnh báo; Trạng thái Đang thực hiện, Mật = Không, chỉ Tổng dự toán', scr: 'SCR-103' },
    'P-228': { q: 'Đội HR Tool có làm API cho ĐTMS: danh sách nhiệm vụ thay đổi từ mốc (gồm bản ghi đã xóa), chi tiết theo mã, tải tệp tờ trình, tài khoản dịch vụ', src: 'T36 B0 §3; MissionController chỉ có POST /search, GET /{id}; DTMS_Q_0443', def: 'GIẢ LẬP — lần chạy thủ công trả kết quả mẫu; chưa có API thì mọi lần HR Tool chạy phạm vi Toàn bộ qua POST /search', scr: 'SCR-109' },
    'P-229': { q: 'Màn Thêm mới hồ sơ chủ trương / phê duyệt KĐT: AI bước 3 (thông tin cơ bản), bước 2 (loại căn cứ), bước 49 (BM-03) gợi ý những mục nào, nguồn trích ghi thế nào', src: 'T63 (D-117); DG-MS13 bước 3, 49; LNV MS13.01; SRS 25 tác vụ dtms-ms13-buoc-3; SRS 27 BR-KPD-02-01', def: 'GIẢ LẬP — gợi ý theo nút ✦ Gợi ý từ AI như Lập ĐXMS (P-216): sáu mục bước 3 từ đề tài / dự án và bóc tách của KĐT; loại căn cứ theo tên tệp; mục BM-03 kế thừa BM-01 đã duyệt', scr: 'SCR-25' },
    /* T67 T2 (D-118) — MS18 TO-BE (BPMN-MS18-TOBE, THAU-TT-1311). */
    'P-230': { q: 'Trình ký Quyết định KHLCNT: ai chọn VOffice hay ký cứng, khi nào bắt buộc ký cứng (hồ sơ Mật?); người ký theo cấp phê duyệt', src: 'BPMN-MS18-TOBE cổng Phương thức ký?, THAU-TT-1311 §5', def: 'GIẢ LẬP — người lập chọn bằng nút ở bước 11 / 15; người ký TGĐ Tổng Công ty (VHT) hoặc TGĐ Tập đoàn (Tập đoàn)' },
    'P-231': { q: 'Bản cam kết Tổ thẩm định: số CCCD, địa chỉ lấy từ hồ sơ nhân sự hay người cam kết tự nhập; căn cứ Điều 66 QĐ 1340 (MSTX) có áp cho KHLCNT Theo luật không', src: 'BM-KHLCNT Bản cam kết, hien-trang-he-thong-thau §8 câu 7', def: 'GIẢ LẬP — người cam kết tự nhập trong eForm bước 8, mỗi thành viên một việc' },
    'P-232': { q: 'Nhánh BPMN MS18 chưa vẽ: cổng Có kết quả ký hợp lệ? chỉ có nhánh Có; đăng tải lỗi; trả sửa về bước 5 có phải chọn lại và cam kết lại Tổ thẩm định không', src: 'BPMN-MS18-TOBE, plan T67 §3 T1', def: 'GIẢ LẬP — theo đúng mũi tên BPMN: trả sửa về 5 → 6 → 7 → 8 (cam kết lại); không vẽ nhánh Không và lỗi đăng tải' },
    'P-235': { q: 'Quy trình con của từng hình thức LCNT (MS19 bước 3–12): BPMN-MS19 chỉ ghi gạch đầu dòng, chưa có sơ đồ con; mua sắm trực tiếp không có trong cổng Hình thức LCNT', src: 'BPMN-MS19, THAU-TT-1311 §4.2–4.10', def: 'GIẢ LẬP (D-118 Q7 = A) — rộng rãi 1 túi (3.1–3.6) và chỉ định thầu thông thường (7.1–7.4) chi tiết theo gạch đầu dòng; 8 hình thức còn lại một bước gộp hiện trình tự chỉ xem. Mua sắm trực tiếp (7.6 kiểm tra điều kiện → 7.5 thư mời thương thảo kèm dự thảo hợp đồng → 7.4) và chỉ định thầu rút gọn (7.5 → 7.4) theo QC-12869 Điều 15, Điều 16 khoản 5 (D-132) — BPMN-MS19 chưa có, đề xuất DX-19; số bước 7.5 / 7.6 GIẢ LẬP', scr: 'SCR-82' },
    'P-236': { q: 'Mẫu hợp đồng: quy tắc chọn mẫu (đơn giản / đầy đủ, sẵn có / theo yêu cầu, nước ngoài); thư trao hợp đồng (trường trộn so_thu_trao_hd) do bước nào của MS19 phát hành; xây lắp chưa có mẫu', src: 'BM-HD-2026, T66 §3, H-Q2 / H-Q6', def: 'GIẢ LẬP — gợi ý theo Loại gói thầu (MS_HH 1.0, HH_LD 1.6, PM 1.8, PTV 3.0, TV 5; nhà thầu nước ngoài 9 / 10; xây lắp 1.6), người lập HSMT chọn lại; thư trao hợp đồng để trống', scr: 'SCR-103' },
    'P-272': { q: 'Nghiệm thu hợp đồng: hệ thống cũ có HOC / PAC / FAC / Thanh lý (nghiệm thu tạm và nghiệm thu cuối); quy trình mới MS23.03 chỉ có một loại biên bản nghiệm thu — có cần hai mức PAC / FAC không, áp dụng cho loại hợp đồng nào', src: 'HT-HD-IMG2 6524; DG-MS23.03', def: 'GIẢ LẬP — một mức nghiệm thu (MS23.03); card Mốc biên bản hiện HOC (bàn giao), Biên bản nghiệm thu, Biên bản thanh lý', scr: 'SCR-86' },
    'P-273': { q: 'Định dạng số biên bản bàn giao, serial hàng nhận, số đề nghị thanh toán, số SAP (HĐ, PO, hóa đơn, bảng tổng hợp thanh toán); ngày thanh toán dự kiến lấy từ đâu; tỷ lệ bảo lãnh bảo hành', src: 'HT-HD-IMG2 6523, 6527, 6528–6531; BM-HD-2026', def: 'GIẢ LẬP — số suy từ mã hợp đồng / mã đợt; ngày dự kiến = mốc điều kiện + 15 ngày (tạm ứng: ngày hiệu lực + 15); bảo lãnh bảo hành 3% giá trị, mẫu 1.x, từ nghiệm thu đến hết bảo hành', scr: 'SCR-86' },
    'P-274': { q: 'Phân bổ nguồn vốn / đề tài, dự án của hợp đồng nhập từ dữ liệu cũ: tệp nhập có cột Đề tài / dự án, Nguồn vốn, Khoản mục chi phí, Giá trị phân bổ không; hợp đồng từ KQLCNT có cho sửa tỷ lệ phân bổ khác nguồn gói thầu không', src: 'HT-HD-IMG2 6512, 6540, 6541', def: 'GIẢ LẬP — hợp đồng từ KQLCNT chia theo tỷ lệ nguồn gói thầu, chỉ xem; hợp đồng nhập lấy từ tệp nhập (dữ liệu mẫu ALLOC)', scr: 'SCR-86' },
    'P-233': { q: 'Ý kiến Ban ĐTXD Tập đoàn: nhận qua tích hợp hay TTMS nhập Phiếu nhận xét; Ban ĐTXD không đồng ý thì quay về đâu', src: 'BPMN-MS18-TOBE bước 13, THAU-TT-1311 §3.3', def: 'GIẢ LẬP — TTMS ghi nhận số, ngày phiếu và từng ý kiến (D-118 Q10); không có nhánh không đồng ý' },
    'P-220': { q: 'Bộ trường nhập của Tờ trình BM-01 / BM-09 và phiếu BM-03 trên eForm (review nhi 06/11 #8, #15): các ô của mẫu Word chưa có nguồn dữ liệu (Quan điểm thực hiện, Nguồn ngân sách, Đánh giá hiệu quả, số / trích yếu công văn BM-03) do người soạn nhập trên form hay để điền tiếp trên Word', src: 'BM-10.2.1 (BM-01, BM-09, BM-03); review nhi 06/11', def: 'GIẢ LẬP — mọi mục của mẫu có ô nhập trên eForm (không bắt buộc trừ mục bắt buộc của mẫu); ô bỏ trống in "…" trên văn bản', scr: 'SCR-08' },
    'P-206': { q: 'Hình thành gói thầu (bảng bóc tách chi phí ở Thêm mới luồng) là dropdown — danh sách giá trị gồm những gì', src: 'RV-PROTO-0511 #14; HT-DXMS-NOTE màn 8 (cột Hình thành gói thầu); QC-12869 Điều 39', def: 'GIẢ LẬP — Hình thành gói thầu / Không hình thành gói thầu (các trường hợp Điều 39 QC-12869)', scr: 'SCR-96' },
    'P-207': { q: 'Lý do khi chọn Mức ưu tiên Khẩn / Thượng khẩn nhập ở đâu — review ghi ở dòng "Luồng mua sắm / Tìm kiếm"', src: 'RV-PROTO-0511 #1', def: 'GIẢ LẬP — nhập ở Thêm mới luồng (trường Lý do ưu tiên, bắt buộc khi Khẩn / Thượng khẩn), hiện ở Chi tiết luồng; tìm kiếm chỉ lọc theo Mức ưu tiên', scr: 'SCR-96' },
    'P-208': { q: 'Số tiền nhập số thường (đồng) chỉ áp dụng cho Giá trị dự tính ở Thêm mới luồng, hay đổi đơn vị trên mọi màn (báo giá, eForm, báo cáo, ngưỡng 160 tỷ)', src: 'RV-PROTO-0511 #8', def: 'GIẢ LẬP — Thêm mới luồng và Chi tiết luồng nhập / hiện đồng; các màn khác giữ tỷ đồng tới khi BA xác nhận', scr: 'SCR-96' },
    'P-209': { q: 'Menu Quản lý hồ sơ: "hồ sơ (hay được hiểu là các biểu mẫu)" — là danh sách biểu mẫu / văn bản đã sinh của mọi luồng (D-78), hay danh sách hồ sơ quy trình; trạng thái ký lấy từ đâu; T34 v0.2 (D-92, hồ sơ không còn là đối tượng trên giao diện): tên menu giữ Quản lý hồ sơ hay đổi thành Quản lý văn bản ĐXMS', src: 'RV-PROTO-0511 bản 2 #19; T34 v0.2', def: 'GIẢ LẬP — danh sách văn bản đầu ra của mọi hồ sơ ĐXMS; văn bản có bước ký trên ĐTMS là Đã ký khi đã sinh, BM-02 / BM-07 Không ký trên ĐTMS; tên menu: người dùng chốt 10/11 (D-105) Quản lý tài liệu ĐXMS', scr: 'SCR-107' },
    'P-205': { q: 'Yêu cầu báo giá tạo trực tiếp (ngoài hồ sơ) dùng để làm gì và có gắn vào hồ sơ sau này không; SRS-DXMS chỉ có YCBG trong hồ sơ (bước 8–10)', src: 'RV-PROTO-0511 #10, câu hỏi 7; HT-DXMS-IMG Yêu cầu báo giá; BR-DXMS-04-01', def: 'GIẢ LẬP — khảo sát giá trước khi có hồ sơ (vd lấy giá dự tính); Nháp sửa được, đã gửi không sửa; hồ sơ tới bước 8 vẫn sinh YCBG riêng', scr: 'SCR-106' },
    /* T25 B5 — MS23.01 Văn bản phát sinh, DG-MS23.01 §D. P-173 thêm khi dựng. */
    'P-161': { q: 'Danh mục loại văn bản, mẫu tương ứng, điều kiện được xem là sửa đổi hợp đồng', src: 'DG-MS23.01 §D 1', def: 'GIẢ LẬP — bốn loại Phụ lục hợp đồng, Biên bản làm việc, Biên bản phạt, Văn bản khác; chỉ Phụ lục hợp đồng là sửa đổi hợp đồng', scr: 'SCR-102' },
    'P-162': { q: 'Phạm vi được phép sửa đổi, điều kiện xin ý kiến Đơn vị sử dụng, cách ghi nhận đã thống nhất', src: 'DG-MS23.01 §D 2; QT-10.2.4 Bước 9.1, 9.2', def: 'GIẢ LẬP — chuyên viên xác nhận được phép sửa đổi, ghi nội dung đã thống nhất ở bước 2; Đơn vị sử dụng không có việc riêng', scr: 'SCR-102' },
    'P-163': { q: 'Ai duyệt đề xuất sửa đổi ở bước 3, ai ký từng loại văn bản ở bước 10; khi nào cần ý kiến chuyên môn', src: 'DG-MS23.01 §D 3', def: 'GIẢ LẬP — Tổng Giám đốc VHT cho cả hai bước và mọi loại văn bản; ý kiến chuyên môn là trường không bắt buộc', scr: 'SCR-102' },
    'P-164': { q: 'Tiêu chí, nội dung phê duyệt trước trình ký ở bước 8 và phạm vi áp dụng theo loại văn bản', src: 'DG-MS23.01 §D 4', def: 'GIẢ LẬP — mọi loại văn bản đều qua Trưởng phòng Hợp đồng; không duyệt về bước 6, qua lại bước 7', scr: 'SCR-102' },
    'P-165': { q: 'Không được ký duyệt: loại văn bản khác phụ lục có quay bước 9 không; khi nào phải hoàn thiện lại nội dung', src: 'DG-MS23.01 §D 5', def: 'GIẢ LẬP — mọi loại về bước 9 theo mũi tên bản vẽ; không có nhánh về bước 6', scr: 'SCR-102' },
    'P-166': { q: 'Checklist chứng từ, căn cứ của AI ở bước 4, cách ghi nhận yêu cầu sửa ở bước 1', src: 'DG-MS23.01 §D 6', def: 'GIẢ LẬP — mặc định đạt; nhánh không đạt bật bằng công cụ demo; về bước 1 rồi đi lại nhánh tương ứng, phụ lục duyệt lại đề xuất', scr: 'SCR-102' },
    'P-167': { q: 'Kết quả AI bước 7: ai xử lý cảnh báo, có chặn chuyển bước 8 không', src: 'DG-MS23.01 §D 7', def: 'GIẢ LẬP — không chặn; cảnh báo hiện ở bước 8 để Trưởng phòng Hợp đồng quyết định', scr: 'SCR-102' },
    'P-168': { q: 'Danh mục và mẫu biểu thực tế của từng loại văn bản', src: 'DG-MS23.01 §D 8', def: 'GIẢ LẬP — dự thảo một mẫu chung; VB-TTR, VB-DT là mã tạm, chưa phải mã biểu mẫu', scr: 'SCR-102' },
    'P-169': { q: 'Chữ ký bắt buộc theo loại văn bản, cách theo dõi nhà thầu ký, danh mục hình thức ký và gửi, bằng chứng gửi', src: 'DG-MS23.01 §D 9', def: 'GIẢ LẬP — hình thức ký VContract, Ký cứng, Hình thức khác; hình thức gửi Email, VContract, Bưu chính, Bàn giao trực tiếp; bằng chứng gửi chưa dựng', scr: 'SCR-102' },
    'P-170': { q: 'Nhận diện mỗi hồ sơ ký để cập nhật một lần, xác định ngày thực tế, nội dung và hiệu lực phụ lục', src: 'DG-MS23.01 §D 10', def: 'GIẢ LẬP — nhận diện theo mã hồ sơ; hiệu lực phụ lục bằng ngày ký nhập ở bước 11', scr: 'SCR-102' },
    'P-171': { q: 'Khi phụ lục sửa tiến độ: thời điểm dùng mốc mới, xử lý mốc cũ', src: 'DG-MS23.01 §D 11', def: 'GIẢ LẬP — có hiệu lực ngay sau bước 12; mốc chưa hoàn thành dời theo số ngày gia hạn, mốc đã xong và nhắc đã gửi giữ nguyên', scr: 'SCR-102' },
    'P-172': { q: 'Thiếu bản ký, AI không đọc được, ký bị từ chối, gửi lại không thành công', src: 'DG-MS23.01 §D 12', def: 'GIẢ LẬP — bắt buộc tải bản ký ở bước 11; ký bị từ chối đi nhánh bước 10; các lỗi còn lại chưa dựng', scr: 'SCR-102' },
    'P-173': { q: 'Phụ lục đổi giá trị: kế hoạch thanh toán, phân bổ các đợt có đổi theo không', src: 'DG-MS23.01 không nêu; QT-10.2.4 Bước 9', def: 'GIẢ LẬP — giá trị hợp đồng đổi, kế hoạch thanh toán giữ nguyên; phần chênh lệch hiện ở Còn phải thanh toán', scr: 'SCR-102' },
    /* T25 B2 — MS23 Tổng quan, DG-MS23 §D. */
    'P-120': { q: 'Mốc / phát sinh nào kích hoạt MS23.01, .03, .04; ai khởi tạo, tự động hay không', src: 'DG-MS23 §D 5', def: 'GIẢ LẬP — sự kiện kích hoạt bằng công cụ demo; ghi vào danh sách luồng con cần khởi tạo, Phòng Hợp đồng khởi tạo', scr: 'SCR-86' },
    'P-135': { q: 'AI trích xuất những thông tin, mốc nào từ hợp đồng; ai kiểm tra và xác nhận trước khi dùng', src: 'DG-MS23 §D 1', def: 'GIẢ LẬP — trích 3 mốc (2 đợt giao, nghiệm thu tổng thể) và thông tin chung; không có bước xác nhận vì BPMN không có', scr: 'SCR-86' },
    'P-136': { q: 'Đôn đốc giao hàng: nhắc ai, thời điểm, tần suất, kênh; khi nào dừng', src: 'DG-MS23 §D 2', def: 'GIẢ LẬP — mỗi lần đến mốc nhắc một lần, trước hạn 7 ngày, gửi Nhà thầu và Đầu mối theo dõi qua email và thông báo trên hệ thống', scr: 'SCR-86' },
    'P-137': { q: 'Phòng Hợp đồng hay ĐVMS ghi nhận thông báo giao hàng; kênh nào, nhập tay hay tích hợp', src: 'DG-MS23 §D 3', def: 'GIẢ LẬP — Phòng Hợp đồng nhập tay, chọn kênh tiếp nhận; tải thông báo của nhà thầu lên hồ sơ', scr: 'SCR-102' },
    'P-138': { q: 'Những bộ phận nào nhận thông báo giao hàng, theo điều kiện gì, kênh và nội dung', src: 'DG-MS23 §D 4', def: 'GIẢ LẬP — Đơn vị sử dụng, Phòng Quản lý tài sản, Phòng Tài chính kế toán, gửi mọi lần', scr: 'SCR-86' },
    'P-139': { q: 'Xác định bản đã ký đầy đủ của mỗi luồng con thế nào; hồ sơ nào trả về, lúc nào chạy bước 5', src: 'DG-MS23 §D 6', def: 'GIẢ LẬP — công cụ demo phát sự kiện; B4, B6 nối với kết thúc luồng con', scr: 'SCR-86' },
    'P-140': { q: 'Mỗi loại biên bản cập nhật ngày, trạng thái nào; ai xác nhận kết quả AI', src: 'DG-MS23 §D 7', def: 'GIẢ LẬP — biên bản bàn giao cập nhật mốc giao kế tiếp, biên bản nghiệm thu cập nhật mốc nghiệm thu; ngày thực tế lấy bằng ngày kế hoạch; không có bước xác nhận', scr: 'SCR-86' },
    'P-141': { q: 'Nhận diện mã hợp đồng, xử lý nhiều lần giao, nhiều biên bản, phiên bản sửa đổi', src: 'DG-MS23 §D 8', def: 'GIẢ LẬP — hồ sơ con gắn mã hợp đồng từ lúc tạo; mỗi biên bản cập nhật một mốc theo thứ tự', scr: 'SCR-86' },
    'P-142': { q: 'Tên đầy đủ, phạm vi HOC / KCS và quan hệ với nghiệm thu', src: 'DG-MS23 §D 9', def: 'GIẢ LẬP — chuyển chi tiết sang MS23.02; bàn giao và nghiệm thu không phụ thuộc thứ tự', scr: 'SCR-86' },
    'P-143': { q: 'Quy tắc khi thiếu mốc, thiếu thông báo, AI không đọc được, nhận trùng biên bản, gửi thông báo thất bại', src: 'DG-MS23 §D 10', def: 'GIẢ LẬP — không có mốc tương ứng thì ghi nhật ký, không cập nhật; các lỗi khác chưa dựng', scr: 'SCR-86' },
    /* Quản trị quy trình — docs/dtms/prototype-PH02-quy-trinh-chuan-bi.md §4. */
    /* P-37 đã chốt 2026-09-28: MS01.01 / .02 / .03 là ba quy trình riêng (Locked decision "MS01 deploy"). */
    'P-38': { q: 'Hồ sơ Dừng xử lý hiện trạng thái gì trên Giám sát tiến trình (T29 B1 bỏ Chuyển quy trình 10b)', src: 'P-26', def: 'Đã hủy (hồ sơ Dừng xử lý cũng vậy)', scr: 'SCR-48' },
    'P-39': { q: 'Luật hiển thị có quyết định thật nút trên màn xử lý task không (đổi tên hiển thị, vô hiệu hoá → ẩn nút)', src: 'UR-WF-11', def: 'Có (T24 Q1, Backlog 96): nút trên màn xử lý việc lấy theo luật đang Kích hoạt, Tên hiển thị là nhãn nút; tắt / xoá luật thì nút ẩn', scr: 'SCR-44' },
    'P-40': { q: 'Ai được retry / xử lý incident, có cần phê duyệt không (UR-WF-05 retry có kiểm soát)', src: 'UR-WF-05', def: 'Không có — Giám sát tiến trình chỉ xem', scr: 'SCR-48' },
    'P-41': { q: 'Vai trò nào thấy menu Quản trị quy trình: chỉ Quản trị hệ thống, hay TTMS cũng xem Giám sát tiến trình', src: 'UC-02-01…03 (A21), UR-WF-12', def: 'Quản trị hệ thống thấy cả ba mục; Chuyên viên TTMS chỉ xem Giám sát tiến trình', scr: 'SCR-48' },
    /* Quản lý E-Form — docs/dtms/prototype-EFORM-chuan-bi.md §4. */
    'P-43': { q: 'Danh sách Loại biểu mẫu và Loại hồ sơ cho ĐTMS; Loại hồ sơ của Khoản đầu tư (MS13/MS14)', src: 'ecat option KHCN, D-10', def: 'Loại biểu mẫu: Tờ trình, Thuyết minh, Phiếu, Báo cáo, Công văn, Quyết định, Checklist; Loại hồ sơ: Phê duyệt ĐXMS / Điều chỉnh ĐXMS', scr: 'SCR-50' },
    'P-44': { q: 'Mã biểu mẫu dùng mã BM trong quy chế (BM-01): nếu MS02, MS13 cũng có "BM-01" thì mã duy nhất theo cặp (Loại hồ sơ, Mã) hay thêm tiền tố (MS01-BM-01)', src: 'QT ĐXMS, QT DADT/KĐT', def: 'Duy nhất theo cặp (Loại hồ sơ, Mã)', scr: 'SCR-50' },
    'P-45': { q: 'Sửa thiết kế biểu mẫu đang dùng: hồ sơ đang chạy giữ phiên bản cũ hay nhận bản mới; có cần xem/khôi phục bản cũ', src: 'UR-DOC-01 (phiên bản)', def: 'Mỗi lần lưu thiết kế tăng phiên bản; hồ sơ đã tạo giữ bản cũ; lịch sử chỉ xem', scr: 'SCR-53' },
    'P-46': { q: 'Word template: map biến ↔ khoá trường E-Form ở đâu, ai cấu hình, định dạng biến (${soCongVan})', src: 'UR-DOC-03, file chức năng r416–423', def: 'Chỉ tải File mẫu; chưa có màn map biến (D-5)', scr: 'SCR-50' },
    'P-47': { q: 'Biểu mẫu đang gắn bước quy trình BPMN / hồ sơ đang chạy có được xoá không', src: 'P-33 (DMDC)', def: 'Không; chỉ Dừng hoạt động', scr: 'SCR-49' },
    'P-48': { q: 'Vai nào quản lý E-Form: chỉ Quản trị hệ thống, hay TTMS (chủ quy chế biểu mẫu) cũng được sửa', src: 'R-ADMIN, UC-12-01 (A21)', def: 'Chỉ Quản trị hệ thống', scr: 'SCR-49' },
    'P-49': { q: 'Cần nút Nhân bản biểu mẫu không (source có xử lý, chưa có nút); Biểu thức tự tính và điều kiện FEEL do BA hay dev cấu hình', src: 'ecat handleDuplicate, dock thuộc tính', def: 'Không có Nhân bản; Biểu thức/FEEL nhập tự do', scr: 'SCR-49' },
  };
  /* Màn → điểm ❓ gắn trên màn đó. */
  D.screenQ = {};
  Object.entries(D.openPoints).forEach(([id, p]) => { (D.screenQ[p.scr] = D.screenQ[p.scr] || []).push(id); });

  /* ---------- Menu toàn hệ — 12 module của Backlog (D-15, plan T16 docs/dtms/prototype-W1T10-backlog-chuan-bi.md) ----------
     Nguồn: BA-TD sheet "Backlog (051026)", cột Module → Tính năng; thứ tự và tên theo Backlog. bl = module Backlog, due = bước plan T16 sẽ dựng.
     Bỏ khỏi menu (D-15): Kế hoạch & nhu cầu, Dự án, Dự toán & chi phí, Kho & tài sản, Hồ sơ & biểu mẫu, Quản trị hệ thống — không có trong Backlog.
     Route cũ của các mục này vẫn mở trang Đang phát triển (D.oldMenu) để không gãy liên kết cũ.
     Thầu / Hợp đồng: tính năng "trong từng gói thầu / hợp đồng" (Lựa chọn NT, HSMT, Tổ chức LCNT, Đánh giá & KQLCNT, Tình huống & Kiến nghị;
     Thương thảo, Ký kết, Bảo đảm, Theo dõi, VB phát sinh, Bàn giao & NT, Thanh toán, Thanh lý) là tab của màn chi tiết (B2/B3), không là mục menu. */
  D.menu = [
    { label: 'Tổng quan', icon: 'tong_quan', path: 'tong-quan', scr: 'SCR-92' },
    { label: 'Việc của tôi', icon: 'view_list', path: 'viec-cua-toi', scr: 'SCR-01', badge: 'tasks' },
    /* T54 (SRS 32 DTMS_CN_0274): Trình ký — mọi lần trình ký VOffice / ký ngoài hệ thống của người dùng. */
    { label: 'Trình ký', icon: 'view_list', path: 'trinh-ky', scr: 'SCR-113' },
    /* T29 D-63: Đề tài / dự án (SCR-103) — nguồn căn cứ của ĐXMS / KĐT. Người dùng 09/11 (T34): menu cấp 1, ngay trên Quản lý đề xuất mua sắm. */
    { label: 'Đề tài / dự án', icon: 'menu_square', path: 'de-tai', scr: 'SCR-103' },
    { label: 'Quản lý đề xuất mua sắm', icon: 'phan_he_mua_sam', open: true, bl: 'Quản lý đề xuất mua sắm', due: 'B1 (07/10)', children: [
      /* T34 (D-90): bỏ phương án Tách — Luồng mua sắm (Gộp) thay hai mục Đề xuất mua sắm / Hồ sơ đề xuất mua sắm. */
      // [T34 bỏ Tách] { label: 'Đề xuất mua sắm', path: 'dxms', scr: 'SCR-27' },
      /* Người dùng 09/11 (T34 v0.2): đổi tên Luồng mua sắm → Đề xuất mua sắm (route giữ #/luong). */
      { label: 'Đề xuất mua sắm', path: 'luong', scr: 'SCR-95' },
      /* T34 (người dùng 09/11): danh sách ĐXMS điều chỉnh (ĐXMS mới, Điều chỉnh từ ĐXMS cũ) + Thêm mới điều chỉnh (SCR-108). */
      /* Người dùng 09/11 (T34 v0.2): tạm ẩn menu — vào Thêm mới điều chỉnh bằng nút Điều chỉnh ĐXMS ở Danh sách đề xuất mua sắm; route #/dieu-chinh-dxms vẫn mở được. */
      // [T34 ẩn SCR-108] { label: 'Điều chỉnh đề xuất mua sắm', path: 'dieu-chinh-dxms', scr: 'SCR-108' },
      // [T34 bỏ Tách] { label: 'Hồ sơ đề xuất mua sắm', path: 'ho-so-dxms', scr: 'SCR-02' },
      /* T29 B12 (RV-PROTO-0511 bản 2 #19, D-78): Quản lý hồ sơ = danh sách biểu mẫu / văn bản đã sinh của mọi luồng (SCR-107). Người dùng 10/11 (D-105): đổi tên menu thành Quản lý tài liệu ĐXMS, route giữ. */
      { label: 'Quản lý tài liệu ĐXMS', path: 'quan-ly-ho-so', scr: 'SCR-107' }] },
      /* Người dùng 12/11: bỏ mục Yêu cầu báo giá ĐXMS — gộp vào menu cấp 1 Yêu cầu báo giá (dưới Quản lý khoản đầu tư). */
    { label: 'Quản lý khoản đầu tư', icon: 'view_flow', bl: 'Quản lý khoản đầu tư', due: 'B2 (08/10)', children: [
      { label: 'Khoản đầu tư', path: 'kdt', scr: 'SCR-54' },
      /* T45 (D-103): tách theo loại hồ sơ — chủ trương / phê duyệt KĐT (màn danh sách chung SCR-75, lọc theo kind). */
      /* T56 Q2 (review Phong BA 12/11 #30): Chủ trương KĐT · Tài liệu chủ trương KĐT · Phê duyệt KĐT · Tài liệu phê duyệt KĐT (giữ Khoản đầu tư đầu tiên). */
      { label: 'Chủ trương KĐT', path: 'ho-so-ct-kdt', scr: 'SCR-75' },
      { label: 'Tài liệu chủ trương KĐT', path: 'tai-lieu-ct-kdt', scr: 'SCR-107' },
      { label: 'Phê duyệt KĐT', path: 'ho-so-pd-kdt', scr: 'SCR-75' },
      { label: 'Tài liệu phê duyệt KĐT', path: 'tai-lieu-pd-kdt', scr: 'SCR-107' }] },
    /* Người dùng 12/11 (D-109): gộp Yêu cầu báo giá ĐXMS (SCR-73) + KĐT (SCR-76) thành một mục; lọc theo Loại đối tượng.
       T56 Q1 (review Nhi #10, Phong BA #32, #33): mục này chuyển vào nhóm Quản lý thầu (bên dưới). */
    // [T56 dời vào Quản lý thầu] { label: 'Yêu cầu báo giá', icon: 'view_list', path: 'ycbg', scr: 'SCR-73' },
    /* D-76 (RV-PROTO-0511 #17): Quản lý thầu / hợp đồng ẩn khỏi sidebar ở bản demo ĐXMS bằng cờ D.show.menuThau; route và bộ demo MS22–MS24 giữ nguyên. */
    /* T56 Q1: nhóm Quản lý thầu hiện, chỉ mục Yêu cầu báo giá; các mục thầu khác vẫn ẩn theo D-76 (cờ show từng mục con).
       T67 (D-118 Q2): hiện lại KHLCNT, Gói thầu, Nhà thầu, Công khai (MS18 chạy luồng). T67 H1–H5 xong (người dùng 16/11): hiện nhóm Quản lý hợp đồng.
       Giám sát hoạt động thầu vẫn ẩn (màn chưa dựng). */
    { label: 'Quản lý thầu', icon: 'doi_tac', bl: 'Quản lý thầu', due: 'B2 (08/10)', children: [
      { label: 'Yêu cầu báo giá', path: 'ycbg', scr: 'SCR-73' },
      { label: 'Kế hoạch lựa chọn nhà thầu', path: 'khlcnt', scr: 'SCR-78' },
      { label: 'Gói thầu', path: 'goi-thau', scr: 'SCR-81' },
      { label: 'Nhà thầu & kiểm soát rủi ro', path: 'nha-thau', scr: 'SCR-83' },
      { label: 'Công khai & tích hợp đấu thầu', path: 'cong-khai-thau', scr: 'SCR-94' },
      { label: 'Giám sát hoạt động thầu', path: 'ph/giam-sat-thau', show: 'menuThau' }] },
    { label: 'Quản lý hợp đồng', icon: 'chuc_danh_khoa_hoc', children: [
      { label: 'Hợp đồng', path: 'hop-dong', scr: 'SCR-84' },
      { label: 'Thỏa thuận khung & đơn hàng', path: 'thoa-thuan-khung', scr: 'SCR-87' }] },
    { label: 'Báo cáo', icon: 'nguon_kinh_phi', children: [
      { label: 'Báo cáo tổng hợp', path: 'bao-cao/tong-hop', scr: 'SCR-93' },
      { label: 'Báo cáo ĐXMS', path: 'bao-cao/dxms', scr: 'SCR-93' },
      { label: 'Báo cáo khoản đầu tư', path: 'bao-cao/kdt', scr: 'SCR-93' },
      { label: 'Báo cáo lựa chọn nhà thầu', path: 'bao-cao/lcnt', scr: 'SCR-93' },
      { label: 'Báo cáo hợp đồng', path: 'bao-cao/hop-dong', scr: 'SCR-93' },
      { label: 'Báo cáo tiến độ & tồn đọng', path: 'bao-cao/tien-do', scr: 'SCR-93' }] },
    /* Cấu hình hệ thống — sau nhóm vận hành (người dùng yêu cầu 2026-10-07). */
    /* D-2: 3 mục quy trình; tên nhóm và mục đầu theo Backlog "Quản lý quy trình". */
    { label: 'Quản lý quy trình', icon: 'phan_he_quy_trinh', children: [
      { label: 'Quản lý quy trình', path: 'quy-trinh', scr: 'SCR-41' },
      { label: 'Ma trận hành động', path: 'ma-tran', scr: 'SCR-43' },
      { label: 'Giám sát tiến trình', path: 'giam-sat-tien-trinh', scr: 'SCR-48' }] },
    /* D-42 (team BA 30/10/2026): Danh mục dùng chung + E-form rời menu ĐTMS, thành phân hệ riêng (D.dmdcMenu) — vào qua Danh sách Phân hệ. */
    { label: 'Thông báo', icon: 'menu_square', children: [
      { label: 'Mẫu thông báo', path: 'mau-thong-bao', scr: 'SCR-88' },
      { label: 'Kênh thông báo', path: 'kenh-thong-bao', scr: 'SCR-90' }] },
    /* D-44 (team BA 30/10/2026): bỏ Trigger thông báo (SCR-91); route cũ mở trang Đang phát triển qua D.oldMenu. */
    /* Ẩn khỏi menu (hidden, người dùng yêu cầu 2026-10-07) — route vẫn mở trang Đang phát triển. */
    { label: 'Tích hợp', hidden: true, icon: 'phan_he_iam', bl: 'Tích hợp', due: 'chưa giao PIC', children: [
      { label: 'Tích hợp Camunda', path: 'ph/tich-hop' },
      { label: 'Tích hợp SAP / Tài chính', path: 'ph/tich-hop-sap' },
      { label: 'Tích hợp VContract', path: 'ph/tich-hop-vcontract' },
      { label: 'Tích hợp VOffice', path: 'ph/tich-hop-voffice' },
      { label: 'Tích hợp PML', path: 'ph/tich-hop-pml' }] },
    { label: 'Trợ lý AI', hidden: true, icon: 'vai_tro_thuc_hien', path: 'ph/ai', bl: 'Trợ lý AI', due: 'chưa giao PIC' },
  ];

  /* Sidebar phân hệ Danh mục dùng chung (D-42, khuôn management-sidebar của ecat): danh mục chung phẳng, danh mục riêng ĐTMS gom một nhóm (P-112).
     catalog.js nối danh mục theo nhóm và lọc theo vai (P-36). */
  D.dmdcMenu = [
    { label: 'Tổng quan', icon: 'tong_quan', path: 'dmdc', scr: 'SCR-30' },
    { label: 'Quản lý E-form', icon: 'menu_square', path: 'eform', scr: 'SCR-49' },
    { label: 'Vai trò thực hiện', icon: 'vai_tro_thuc_hien', path: 'ph/dm-vai-tro' },
    { label: 'Chức danh khoa học', icon: 'chuc_danh_khoa_hoc', path: 'ph/dm-chuc-danh' },
    { label: 'Đầu tư mua sắm', icon: 'phan_he_mua_sam', open: true, dmdcGroup: true, children: [] },
  ];

  /* Mục menu cũ (13 phân hệ use-case) bỏ theo D-15 — route #/ph/… vẫn mở trang Đang phát triển để không gãy liên kết cũ. */
  D.oldMenu = [
    { label: 'Trigger thông báo', path: 'trigger-thong-bao' },
    { label: 'Vai trò thực hiện', path: 'ph/dm-vai-tro', notes: ['Danh mục chung sẵn có của ecat, ngoài phạm vi prototype ĐTMS (D-42).'] },
    { label: 'Chức danh khoa học', path: 'ph/dm-chuc-danh', notes: ['Danh mục chung sẵn có của ecat, ngoài phạm vi prototype ĐTMS (D-42).'] },
    { label: 'Người dùng tập trung', path: 'ph/he-iam', notes: ['Phân hệ khác của nền tảng, ngoài phạm vi prototype ĐTMS (D-42).'] },
    { label: 'Quản trị khoa học công nghệ', path: 'ph/he-khcn', notes: ['Phân hệ khác của nền tảng, ngoài phạm vi prototype ĐTMS (D-42).'] },
    { label: 'Quản lý nhân công', path: 'ph/he-nhan-cong', notes: ['Phân hệ khác của nền tảng, ngoài phạm vi prototype ĐTMS (D-42).'] },
    { label: 'Kế hoạch năm', path: 'ph/ke-hoach', uc: ['UC-04-01'] },
    { label: 'Nhu cầu mua sắm', path: 'ph/nhu-cau', uc: ['UC-04-02'] },
    { label: 'Dự án đầu tư', path: 'ph/du-an', uc: ['UC-05-07', 'UC-05-08', 'UC-05-09', 'UC-05-10'] },
    { label: 'Giám sát & rủi ro đầu tư', path: 'ph/giam-sat', uc: ['UC-05-11', 'UC-05-12'] },
    { label: 'Dự toán', path: 'ph/du-toan', uc: ['UC-06-01'] },
    { label: 'Tờ trình chi phí', path: 'ph/to-trinh', uc: ['UC-06-02', 'UC-06-03', 'UC-06-04'] },
    { label: 'Báo cáo CSGT', path: 'ph/csgt', uc: ['UC-06-05'] },
    { label: 'Cơ sở giá', path: 'ph/co-so-gia', uc: ['UC-07-04'] },
    { label: 'Tổ chuyên gia / thẩm định', path: 'ph/to-chuyen-gia', uc: ['UC-08-05'] },
    { label: 'HSMT / HSYC', path: 'ph/hsmt', uc: ['UC-09-01', 'UC-09-02'] },
    { label: 'Mở thầu & đánh giá', path: 'ph/mo-thau', uc: ['UC-09-03', 'UC-09-04', 'UC-09-05'] },
    { label: 'Kết quả LCNT', path: 'ph/kqlcnt', uc: ['UC-09-06', 'UC-09-07'] },
    { label: 'Tiến độ & nghiệm thu', path: 'ph/tien-do', uc: ['UC-10-04', 'UC-10-05'] },
    { label: 'Thanh lý & quyết toán', path: 'ph/thanh-ly', uc: ['UC-10-08'] },
    { label: 'Danh mục vật tư', path: 'ph/vat-tu', uc: ['UC-11-01'] },
    { label: 'Nhập / xuất kho', path: 'ph/kho', uc: ['UC-11-02', 'UC-11-03', 'UC-11-11'] },
    { label: 'Tài sản', path: 'ph/tai-san', uc: ['UC-11-04', 'UC-11-05', 'UC-11-06', 'UC-11-07', 'UC-11-08', 'UC-11-09', 'UC-11-12'] },
    { label: 'Kiểm kê', path: 'ph/kiem-ke', uc: ['UC-11-10'] },
    { label: 'Kho hồ sơ', path: 'ph/kho-ho-so', uc: ['UC-12-04'] },
    { label: 'Bộ hồ sơ & checklist', path: 'ph/checklist', uc: ['UC-12-02'] },
    { label: 'Trình ký VOffice', path: 'ph/voffice', uc: ['UC-12-06'] },
    { label: 'KPI thẩm định', path: 'ph/kpi', uc: ['UC-13-02'] },
    { label: 'Cảnh báo & nhắc việc', path: 'ph/canh-bao', uc: ['UC-13-03'] },
    { label: 'Truy vết chuỗi đầu tư', path: 'ph/truy-vet', uc: ['UC-13-05'] },
    { label: 'Người dùng & phân quyền', path: 'ph/nguoi-dung', uc: ['UC-01-02', 'UC-01-03'] },
    { label: 'Ủy quyền xử lý', path: 'ph/uy-quyen', uc: ['UC-01-04'] },
  ];

  /* Tên UC (rút gọn) cho trang phân hệ chưa dựng. */
  D.ucNames = {
    'UC-01-02': 'Quản lý người dùng (SSO & nội bộ)', 'UC-01-03': 'Cây đơn vị, chức danh, vai trò, phân quyền dữ liệu', 'UC-01-04': 'Ủy quyền xử lý',
    'UC-02-01': 'Quản lý quy trình BPMN, phiên bản', 'UC-02-02': 'Cấu hình ma trận hành động', 'UC-02-03': 'Theo dõi process instance / incident',
    'UC-04-01': 'Lập, trình, phê duyệt, điều chỉnh kế hoạch năm', 'UC-04-02': 'Khởi tạo nhu cầu, ghi nhận căn cứ đã phê duyệt',
    'UC-05-01': 'Phân loại KĐT và chọn luồng', 'UC-05-02': 'Lập, trình hồ sơ chủ trương / KĐT', 'UC-05-03': 'Thẩm định chủ trương / KĐT',
    'UC-05-04': 'Cho ý kiến tham mưu HĐĐT', 'UC-05-05': 'Phê duyệt chủ trương / KĐT / dự án', 'UC-05-06': 'Điều chỉnh chủ trương / KĐT',
    'UC-05-07': 'Chuẩn bị dự án ĐTXD / ĐTMS', 'UC-05-08': 'Lập, trình chủ trương / dự án / thiết kế-dự toán', 'UC-05-09': 'Thẩm định dự án / thiết kế-dự toán',
    'UC-05-10': 'Điều chỉnh, gia hạn dự án', 'UC-05-11': 'Quản trị rủi ro đầu tư', 'UC-05-12': 'Giám sát, đánh giá đầu tư',
    'UC-06-01': 'Lập dự toán / khái toán', 'UC-06-02': 'Soạn, trình Tờ trình chi phí', 'UC-06-03': 'Thẩm định Tờ trình chi phí', 'UC-06-04': 'Phê duyệt Tờ trình chi phí', 'UC-06-05': 'Báo cáo CSGT',
    'UC-07-03': 'Tạo YCBG, nhận và kiểm tra báo giá', 'UC-07-04': 'Quản lý cơ sở giá', 'UC-07-12': 'Điều chỉnh ĐXMS (MS02)',
    'UC-08-01': 'Tạo gói thầu', 'UC-08-02': 'Lập, trình Tờ trình KHLCNT', 'UC-08-03': 'Kiểm tra KHLCNT', 'UC-08-04': 'Phê duyệt, đăng tải KHLCNT', 'UC-08-05': 'Tổ chuyên gia / Tổ thẩm định',
    'UC-09-01': 'Lập, thẩm định, phê duyệt HSMT / HSYC', 'UC-09-02': 'Phát hành hồ sơ, làm rõ', 'UC-09-03': 'Tiếp nhận HSDT, mở thầu', 'UC-09-04': 'Đánh giá, xếp hạng',
    'UC-09-05': 'Thương thảo', 'UC-09-06': 'Phê duyệt KQLCNT', 'UC-09-07': 'Hủy thầu, kiến nghị', 'UC-09-08': 'Danh sách cấm / hạn chế nhà thầu',
    'UC-10-01': 'Khởi tạo, soạn thảo hợp đồng', 'UC-10-02': 'Trình ký, ký hợp đồng', 'UC-10-03': 'Hợp đồng & PO, tạm ứng', 'UC-10-04': 'Theo dõi milestone, bảo lãnh',
    'UC-10-05': 'Tiếp nhận hàng, KCS, nghiệm thu', 'UC-10-06': 'Sửa đổi hợp đồng, phụ lục', 'UC-10-07': 'Thanh toán nhà thầu', 'UC-10-08': 'Thanh lý, quyết toán',
    'UC-11-01': 'Danh mục vật tư hàng hoá', 'UC-11-02': 'Nhập kho', 'UC-11-03': 'Xuất kho', 'UC-11-04': 'Điều chuyển tài sản', 'UC-11-05': 'Thu hồi tài sản',
    'UC-11-06': 'Sửa chữa tài sản', 'UC-11-07': 'Chủ trương xử lý tài sản', 'UC-11-08': 'Thanh lý, tiêu huỷ', 'UC-11-09': 'Báo mất, bồi thường', 'UC-11-10': 'Kiểm kê',
    'UC-11-11': 'Rà soát tồn kho (cho UC-07-02)', 'UC-11-12': 'Mượn tài sản ngắn hạn',
    'UC-12-01': 'Thiết kế E-Form và Word template', 'UC-12-02': 'Bộ hồ sơ, checklist theo loại', 'UC-12-03': 'Tự động sinh văn bản', 'UC-12-04': 'Lưu trữ, tìm kiếm hồ sơ',
    'UC-12-05': 'Danh mục nghiệp vụ', 'UC-12-06': 'Trình ký trên VOffice', 'UC-12-07': 'AI kiểm tra biểu mẫu',
    'UC-13-01': 'Dashboard giá trị, drill-down', 'UC-13-02': 'KPI thẩm định / phê duyệt', 'UC-13-03': 'Cảnh báo quá hạn, nhắc việc', 'UC-13-04': 'Báo cáo, phân tích (AI)',
    'UC-13-05': 'Truy vết kế hoạch → hợp đồng → tài sản', 'UC-13-06': 'Đồng bộ SAP, VOffice, Ariba, SSO',
  };


  /* ---------- Nội dung mẫu cho các màn chi tiết (bước 2–4) ---------- */
  D.basisTypes = [
    { id: 'khsx', name: 'Kế hoạch SXKD năm', src: 'Dự toán' },
    { id: 'pakd', name: 'Phương án kinh doanh', src: 'Dự toán' },
    { id: 'ttkp', name: 'Tờ trình kinh phí', src: 'Dự toán' },
    { id: 'khcn', name: 'QĐ nhiệm vụ KHCN', src: 'eBOM / mBOM' },
    { id: 'khac', name: 'Văn bản chỉ đạo khác', src: 'Không có' },
  ];
  D.basisDocs = [
    { id: 'qd1', no: '1482/QĐ-VHT', date: '12/03/2026', title: 'Phê duyệt nhiệm vụ KHCN "Phát triển trạm gNodeB thế hệ 2"', type: 'khcn', group: false, value: 412.5, remain: 189.4 },
    { id: 'qd2', no: '0917/QĐ-VHT', date: '20/01/2026', title: 'Phê duyệt nhiệm vụ KHCN "Anten mảng pha băng Ka"', type: 'khcn', group: false, value: 96.0, remain: 41.2 },
    { id: 'qd3', no: '2210/QĐ-TĐ', date: '05/12/2025', title: 'Phê duyệt nhiệm vụ KHCN "Hệ thống mạng lõi 5G SA"', type: 'khcn', group: true, value: 640.0, remain: 210.5 },
    { id: 'qd4', no: '1876/QĐ-TĐ', date: '14/04/2026', title: 'Phê duyệt Phương án kinh doanh "Sản xuất module RRU 5G giai đoạn 2026–2028"', type: 'pakd', group: true, value: 420.0, remain: 205.3 },
    { id: 'qd5', no: '0412/QĐ-VHT', date: '15/01/2026', title: 'Phê duyệt Kế hoạch SXKD năm 2026 của Trung tâm Vô tuyến', type: 'khsx', group: false, value: 320.0, remain: 58.6 },
  ];
  /* Nhiệm vụ / đề tài, dự án mà ĐXMS phải chọn khi tạo (comment Figma #1, P-69): nhiệm vụ KHCN, dự án SXKD (PAKD) hoặc kế hoạch mua sắm
     thường xuyên năm (KHN). basis = văn bản căn cứ phê duyệt nhiệm vụ (D.basisDocs); src = nguồn đối soát ở task 08 (comment #4, P-73).
     T29 D-66: đây là danh mục **Đề tài / dự án** (SCR-103); nhiệm vụ KHCN là bản ghi có loai = 'KHCN'. loai / loaiCt theo HT-DXMS-NOTE màn 1
     (ánh xạ P-198); nguon: 'khcn' = thông tin chung đồng bộ từ phân hệ KHCN, 'hrtool' = đồng bộ từ HR Tool (Loại SXKD, Dự án đầu tư — T36, P-227),
     'cu' = chuyển từ hệ thống cũ (P-195). */
  D.nhiemVu = [
    { code: 'NV-KHCN-2026-014', name: 'Phát triển trạm gNodeB thế hệ 2', kind: 'Nhiệm vụ KHCN', basis: 'qd1', src: 'mbom', field: 'VTCNTT', fund: 'KHCN', loai: 'KHCN', loaiCt: 'Đề tài KHCN', nguon: 'khcn' },
    { code: 'NV-KHCN-2026-006', name: 'Anten mảng pha băng Ka', kind: 'Nhiệm vụ KHCN', basis: 'qd2', src: 'mbom', field: 'QP', fund: 'KHCN', loai: 'KHCN', loaiCt: 'Dự án KHCN', nguon: 'khcn' },
    { code: 'NV-KHCN-2025-031', name: 'Hệ thống mạng lõi 5G SA', kind: 'Nhiệm vụ KHCN', basis: 'qd3', src: 'mbom', field: 'VTCNTT', fund: 'KHCN', loai: 'KHCN', loaiCt: 'Chương trình KHCN', nguon: 'khcn' },
    { code: 'DA-2026-002', name: 'Sản xuất module RRU 5G giai đoạn 2026–2028', kind: 'Dự án SXKD', basis: 'qd4', src: 'dutoan', field: 'VTCNTT', fund: 'SXKD', loai: 'SXKD', loaiCt: 'Dự án sản xuất', nguon: 'hrtool', total: 420.0 },
    { code: 'KHN-2026-TTVT', name: 'Mua sắm thường xuyên năm 2026 — Trung tâm Vô tuyến', kind: 'Mua sắm thường xuyên (KHN)', basis: 'qd5', src: 'khn', field: 'VTCNTT', fund: 'CPTX', loai: 'Hoạt động TX', loaiCt: 'Thường xuyên', nguon: 'cu', total: 320.0 },
    { code: 'KHN-2026-VHT', name: 'Mua sắm thường xuyên năm 2026 — các đơn vị VHT', kind: 'Mua sắm thường xuyên (KHN)', basis: null, src: 'khn', field: 'KHAC', fund: 'CPTX', loai: 'Hoạt động TX', loaiCt: 'Thường xuyên', nguon: 'cu', total: 85.0 },
    /* D-45: nhiệm vụ / đề tài, dự án làm gốc cho KĐT (Kế hoạch năm 2027). */
    { code: 'DT-KHCN-2027-002', name: 'Đề tài phát triển trạm 5G-Advanced năm 2027', kind: 'Nhiệm vụ KHCN', basis: null, src: 'mbom', field: 'VTCNTT', fund: 'KHCN', loai: 'KHCN', loaiCt: 'Đề tài KHCN', nguon: 'khcn' },
    { code: 'KHN-2027-DTPT', name: 'Kế hoạch đầu tư phát triển năm 2027 — VHT', kind: 'Dự án SXKD', basis: null, src: 'khn', field: 'KHAC', fund: 'SXKD', loai: 'Dự án đầu tư', loaiCt: 'Dự án đầu tư mua sắm tài sản', nguon: 'hrtool', total: 260.0 },
    /* T29 S6 — 4 dòng mẫu của TPL-DADT-EX sheet1 (danh sách Đề tài / dự án hệ thống cũ). total = Tổng dự toán được duyệt (tỷ đồng):
       dự toán mẫu (D.duToanOf) quy về đúng tổng này. Thuộc tính màn Đề tài / dự án ở de-tai.js (D.deTaiInfo). */
    { code: '009-26-VHT-RDP-DS', name: 'Nghiên cứu, phát triển mạng 5G dành cho đường sắt tốc độ cao', kind: 'Nhiệm vụ KHCN', basis: null, src: 'mbom', field: 'VTCNTT', fund: 'KHCN', total: 108.35, loai: 'KHCN', loaiCt: 'Đề tài KHCN', nguon: 'khcn' },
    { code: '020-26-VHT-BP-C', name: 'PAKD hệ thống 5G Private Network cho đối tác Công ty JST (Thái Lan)', kind: 'Dự án SXKD', basis: null, src: 'dutoan', field: 'VTCNTT', fund: 'VCSH', total: 3.95, loai: 'SXKD', loaiCt: 'Dự án Kinh doanh', nguon: 'hrtool' },
    { code: '004-26-VHT-RDP-DS', name: 'Nghiên cứu xây dựng hệ thống quản lý không phận tầm thấp và thử nghiệm giải pháp phục vụ kinh tế tầm thấp', kind: 'Nhiệm vụ KHCN', basis: null, src: 'mbom', field: 'VTCNTT', fund: 'KHCN', total: 147.54, loai: 'KHCN', loaiCt: 'Đề tài KHCN', nguon: 'khcn' },
    { code: '005-26-VHT-BP-M', name: 'VHT.26.GP.MX.5G.26', kind: 'Dự án SXKD', basis: null, src: 'dutoan', field: 'VTCNTT', fund: 'VCSH', total: 548.26, loai: 'SXKD', loaiCt: 'Dự án Kinh doanh', nguon: 'hrtool' },
  ];
  D.nvOf = (code) => D.nhiemVu.find((x) => x.code === code) || null;
  /* Quy tắc bảo mật mẫu cho ĐXMS Mật (comment Figma #12, P-70) — AI kiểm tra khi Lưu, chỉ cảnh báo. */
  D.secRules = [
    { id: 'title', name: 'Tên ĐXMS không chứa số hiệu, tên mã thiết bị / dự án mật' },
    { id: 'purpose', name: 'Mục đích không nêu thông số kỹ thuật, địa điểm triển khai cụ thể' },
    { id: 'unit', name: 'Đơn vị đề xuất được phép xử lý hồ sơ Mật' },
    { id: 'sign', name: 'Hồ sơ Mật ký ngoài hệ thống (ký tay, bản giấy), không gửi YCBG qua email hệ thống khi chưa được duyệt' },
  ];
  D.aiBasic = [
    { key: 'purposeText', label: 'Mục đích', value: 'Trang bị thiết bị đo kiểm RF và OTA phục vụ phát triển, thử nghiệm và hiệu chuẩn trạm gNodeB thế hệ 2 theo nhiệm vụ KHCN 1482/QĐ-VHT.', from: 'QĐ 1482/QĐ-VHT, mục 2' },
    { key: 'scope', label: 'Phạm vi, quy mô', value: '5 hạng mục: 20 máy phân tích phổ, 20 máy phát tín hiệu, 02 hệ thống buồng đo OTA, 40 bộ kit hiệu chuẩn, 01 gói đào tạo chuyển giao.', from: 'eBOM dự án gNodeB-G2, nhóm Đo kiểm' },
    { key: 'value', label: 'Giá trị dự kiến', value: 'Khoảng 183 tỷ đồng (gồm VAT)', from: 'Dự toán nhiệm vụ, phần còn lại 189,4 tỷ' },
    { key: 'fund', label: 'Nguồn vốn', value: 'Vốn KHCN, kế hoạch năm 2027', code: 'KHCN', from: 'QĐ 1482/QĐ-VHT, mục 5' },
    { key: 'period', label: 'Thời gian thực hiện', value: '01/2027 – 09/2027', from: 'Tiến độ nhiệm vụ, giai đoạn 2' },
  ];
  /* Giá trị dự kiến AI gợi ý ở task 03 (tỷ) — dùng cho cảnh báo mềm lệch ngưỡng quy trình ở task 04. */
  D.aiEstimate = 183;
  D.tree = [
    { name: 'Dự án gNodeB thế hệ 2', children: [
      { name: 'Đo kiểm RF', lines: [1, 2] }, { name: 'Đo kiểm OTA', lines: [3] }, { name: 'Hiệu chuẩn', lines: [4] }] },
    { name: 'Ngoài dự toán / eBOM', lines: [5], warn: true },
  ];
  D.usedIn = { 1: 'ĐXMS-2026-0042 (đã phê duyệt 03/2026)' };
  /* Báo giá theo NCC (mã trong danh mục Nhà cung cấp SCR-31: Alpha, Beta, Gamma), đơn giá (tỷ) theo dòng. Lần 1: Gamma dòng 3 hết hiệu lực.
     Tên và loại tiền lấy từ danh mục (D.nccOf — catalog.js thay bằng bản ghi của SCR-31). */
  D.quotes = [
    { ncc: 'NCC-000001', date: '08/10/2026', valid: '08/01/2027', prices: { 1: 3.2, 2: 2.1, 3: 28.0, 4: 0.35, 5: 9.0 } },
    /* T29 B3b: NCC Alpha thấp nhất mọi hạng mục → Tổng giá trị theo cơ sở giá = 182,90 tỷ như hồ sơ mẫu (đổi cơ sở giá thì tổng đổi theo). */
    { ncc: 'NCC-000002', date: '09/10/2026', valid: '09/12/2026', prices: { 1: 3.35, 2: 2.15, 3: 29.4, 4: 0.37, 5: 9.5 } },
    { ncc: 'NCC-000003', date: '07/10/2026', valid: '20/09/2026', validRetry: '15/01/2027', prices: { 1: 3.28, 2: 2.2, 3: 28.4, 4: 0.36, 5: 9.2 } },
  ];
  /* T29 B4 P2 — điều khoản phiếu YCBG (BR-DXMS-04-06, DTMS_CN_0145 mục 7a–7d). Giá trị mẫu của hồ sơ demo theo HT-DXMS-IMG ảnh Yêu cầu báo giá
     (thanh toán hai đợt 40 % / 60 %, giao kho Viettel Hòa Lạc, thời hạn tiếp nhận 07 ngày); SRS mặc định rỗng. */
  D.ycbgTerms0 = {
    payment: 'Thanh toán 02 đợt: đợt 1 — 40 % giá trị hợp đồng trong 30 ngày kể từ ngày ký hợp đồng và nhận bảo lãnh tạm ứng; đợt 2 — 60 % giá trị còn lại trong 30 ngày kể từ ngày ký biên bản nghiệm thu, bàn giao.',
    place: 'Kho Viettel Hòa Lạc — Khu Công nghệ cao Hòa Lạc, Thạch Thất, Hà Nội',
    other: 'Báo giá có hiệu lực tối thiểu 90 ngày; bảo hành tối thiểu 12 tháng theo tiêu chuẩn hãng sản xuất; lắp đặt, hiệu chuẩn tại kho nhận; thời hạn tiếp nhận báo giá 07 ngày kể từ ngày gửi yêu cầu.',
  };
  /* Đầu mối tiếp nhận báo giá: người thuộc danh sách xử lý của hồ sơ. Prototype chưa có danh sách nhân sự hồ sơ (DTMS_CN_0176) → GIẢ LẬP: người xử lý bước,
     người đã xử lý, chỉ huy ĐVĐX (hai) và chuyên viên TTMS (lan) của hồ sơ demo. Số điện thoại, email: GIẢ LẬP. */
  D.ycbgContacts = (tok) => [...new Set([tok && tok.who, ...((window.Flow && Flow.state.history) || []).map((h) => h.who), 'hai', 'lan'].filter((id) => id && D.personas.some((p) => p.id === id)))];
  D.contactParts = (id) => { const p = D.personas.find((x) => x.id === id); if (!p) return null; const k = D.personas.indexOf(p), t = String(345000 + k * 1111);
    return { ten: p.name, donVi: p.unit, dienThoai: `0912 ${t.slice(0, 3)} ${t.slice(3)}`, email: `${id}@viettel.com.vn` }; };
  /* T29 B18: nhiều đầu mối (mảng id) → nối bằng "; ". */
  D.contactOf = (id) => (Array.isArray(id) ? id.map(D.contactOf).filter(Boolean).join('; ')
    : ((c) => (c ? `${c.ten} — ĐT ${c.dienThoai} — ${c.email}` : ''))(D.contactParts(id)));
  const NCC0 = { 'NCC-000001': ['NCC Alpha', 'VNĐ'], 'NCC-000002': ['NCC Beta', 'VNĐ'], 'NCC-000003': ['NCC Gamma', 'USD'] };
  D.nccOf = (code) => ({ code, short: (NCC0[code] || [code])[0], currency: (NCC0[code] || [])[1] || 'VNĐ' });
  /* T29 F7 — loại tài liệu phụ lục của Tờ trình (HT-DXMS-NOTE màn 8). Thật: danh mục Loại tài liệu, gắn bước lập dự thảo. */
  D.phuLuc = [
    ['plMuaSam', 'Phụ lục Danh mục mua sắm chi tiết'], ['plVtlk', 'Phụ lục Danh mục mua sắm chi tiết (VTLK)'], ['plCtkt', 'Phụ lục Chỉ tiêu kỹ thuật'],
    ['plCtsp', 'Phụ lục Cấu trúc sản phẩm'], ['plBanVe', 'Phụ lục Danh mục bản vẽ'], ['plTrichLuc', 'Phụ lục Trích lục nguồn'],
  ];
  /* T29 B17 — căn cứ pháp lý điền sẵn khi tạo luồng, như màn Soạn thảo TTr và mẫu tờ trình cũ (HT-DXMS-IMG, HT-DXMS-TT).
     Thật: tham số hệ thống "Căn cứ pháp lý mặc định của ĐXMS" do TTMS cập nhật khi quy chế / quy trình đổi, không viết trong code.
     GIẢ LẬP P-211: QT 8.6.3.23 không có trong bộ chuẩn (INDEX C15). */
  D.legalDefault = [
    'Căn cứ Quy chế quản lý hoạt động đầu tư, mua sắm của Tập đoàn ban hành kèm theo Quyết định số 12868/QĐ-CNVTQĐ ngày 20/10/2025;',
    'Căn cứ Quy trình số QT.CNVTQĐ.ĐTXD.8.6.3.23 ngày 29/03/2025 của Tập đoàn về việc xây dựng và phê duyệt đề xuất mua sắm;',
  ];
  /* T29 cách 1 — Thông tin dự án / đề tài (bảng bóc tách chi phí từ dự toán, HT-DXMS-NOTE màn 4, 5, 8). Dự toán chưa liên thông từ KHCN
     (DTMS_Q_0070) → GIẢ LẬP P-193: mỗi nhiệm vụ / đề tài, dự án có các dòng dự toán theo Loại chi phí PL1–PL6, giá trị gồm VAT (tỷ đồng). */
  D.costTypes = [['PL1', 'PL1 - Chi phí xây dựng'], ['PL2', 'PL2 - Chi phí vật tư thiết bị'], ['PL3', 'PL3 - Chi phí quản lý dự án'],
    ['PL4', 'PL4 - Chi phí tư vấn đầu tư xây dựng'], ['PL5', 'PL5 - Chi phí khác'], ['PL6', 'PL6 - Chi phí dự phòng']];
  /* Tên Nguồn vốn — dự phòng trước khi catalog.js nạp; catalog.js thay bằng tra danh mục SCR-32. Rà 11/11/2026: mã khớp danh mục
     (trước: SXKD ghi "Đầu tư phát triển", CPTX ghi "Chi phí SXKD", VG không có trong danh mục). */
  D.fundNames = { KHCN: 'Quỹ phát triển khoa học công nghệ', DTPT: 'Đầu tư phát triển', SXKD: 'Chi phí sản xuất kinh doanh', VCSH: 'Vốn góp của chủ sở hữu',
    CPTX: 'Chi phí thường xuyên', VAY: 'Vốn vay' };
  /* T29 S7 (D-65) — bảng dự toán **nhập tại ĐTMS** cho mọi Loại đề tài / dự án (HT-DXMS-NOTE hàng 5, 6; sheet "KHCN Thông tin Dự toán" ghi KHCN
     không cung cấp). Một bảng dùng chung cho SCR-104 tab Dự toán chi phí và card bóc tách chi phí SCR-96. Thật: bảng dự toán trong CSDL ĐTMS + API CRUD.
     Dòng: value = giá trị sau thuế (gồm VAT, tỷ đồng); pre, vat, tax, manual (ô Nhập tay); qty = khối lượng cần thực hiện, uom; buy = Chi mua sắm
     (chỉ TTMS đổi, D-64); status, note. Dữ liệu mẫu (P-193): dòng 1–5 giữ id, loại, khoản mục của cách 1; dòng 6–9 theo YC-DXMS-PROTO §3.1 (chi phí
     quản lý, nhân công, hội thảo không qua TTMS); nv.total có thì quy về đúng Tổng dự toán. */
  const r2 = (v) => Math.round(v * 100) / 100;
  /* P-199 (GIẢ LẬP): không tick Nhập tay thì Thuế GTGT = trước thuế × %VAT; tick thì lấy số người dùng nhập. */
  D.duToanCalc = (l) => { const tax = l.manual ? Number(l.tax) || 0 : r2(l.pre * l.vat / 100); return { tax, value: r2(l.pre + tax) }; };
  function duToanSeed(code) {
    const nv = D.nvOf(code);
    if (!nv) return [];
    const k = [...code].reduce((a, ch) => a + ch.charCodeAt(0), 0) % 7;
    const lines = [['PL2', 'Thiết bị, máy đo chuyên dụng', 120 + k * 12.5, 'Bộ', 4, true], ['PL2', 'Vật tư, linh kiện', 18.4 + k, 'Lô', 1, true],
      ['PL4', 'Tư vấn lập hồ sơ mời thầu, đánh giá HSDT', 0.85, 'Gói', 1, true], ['PL5', 'Đào tạo, chuyển giao công nghệ', 6.2 + k / 2, 'Gói', 1, true], ['PL6', 'Dự phòng phí', 9.5, 'Gói', 1, false],
      ['PL2', 'Máy tính xách tay cấu hình cao', 0.45, 'Chiếc', 10, true], ['PL3', 'Chi phí quản lý dự án', 3.2, 'Gói', 1, false],
      ['PL5', 'Chi phí nhân công thực hiện', 14.6, 'Gói', 1, false], ['PL5', 'Hội thảo, công tác phí', 1.1, 'Gói', 1, false]];
    const raw = lines.reduce((s, l) => s + l[2], 0), f = nv.total ? nv.total / raw : 1;
    return lines.map(([type, item, value, uom, qty, buy], i) => {
      const pre = r2((value * f) / 1.1), c = D.duToanCalc({ pre, vat: 10, manual: false });
      return { id: `${code}-${i + 1}`, code, name: nv.name, fund: D.fundNames[nv.fund] || 'Đầu tư phát triển', type, item, value: c.value, pre, vat: 10, tax: c.tax, manual: false,
        uom, qty, buy, status: 'Đang thực hiện', note: '' };
    });
  }
  const DUTOAN = {};
  D.duToanOf = (code) => { if (!DUTOAN[code]) DUTOAN[code] = duToanSeed(code); return DUTOAN[code]; };
  /* Lưu một dòng (thêm mới khi chưa có id). Trả về dòng đã lưu. */
  D.duToanSave = (code, line) => {
    const ls = D.duToanOf(code), nv = D.nvOf(code);
    const l = Object.assign({ code, name: nv.name, fund: D.fundNames[nv.fund] || 'Đầu tư phát triển', buy: false, status: 'Đang thực hiện', note: '' }, line, D.duToanCalc(line));
    if (!l.id) { l.id = `${code}-${ls.reduce((m, x) => Math.max(m, Number(x.id.split('-').pop()) || 0), 0) + 1}`; ls.push(l); } else ls.splice(ls.findIndex((x) => x.id === l.id), 1, l);
    return l;
  };
  D.duToanDel = (code, id) => { const ls = D.duToanOf(code); ls.splice(ls.findIndex((x) => x.id === id), 1); };
  D.duToanReset = () => { Object.keys(DUTOAN).forEach((k) => delete DUTOAN[k]); };
  /* SRS-DADT V1.4 BR-DADT-02-05 — ba mốc giá trị của phần khoản mục đã vào gói thầu: [Giá trị chọn thầu, Giá trị chọn HĐ, Giá trị sau khi tất toán HĐ]
     (tỷ đồng, null = chưa có). Khóa "<mã dòng dự toán>:<mã ĐXMS / KĐT>". Thật: tính từ Lựa chọn nhà thầu, Hợp đồng (giá trúng thầu, giá trị ký,
     giá trị sau tất toán × tỉ lệ của hạng mục trong gói), không nhập trên ĐTMS. GIẢ LẬP: số mẫu, chưa nối gói thầu / hợp đồng của prototype. */
  D.duToanMoc = {
    'NV-KHCN-2026-006-1:ĐXMS-2026-0072': [176.8, 174.5, 173.95],
    'NV-KHCN-2026-006-2:ĐXMS-2026-0072': [22.1, 22.1, null],
    'NV-KHCN-2025-031-1:ĐXMS-2026-0103': [104.2, null, null],
  };
  /* Mốc của một dòng con: { bid, hd, tt, latest } — latest = mốc muộn nhất đã có (tất toán, chưa có thì chọn HĐ, chưa có thì chọn thầu). */
  D.duToanMocOf = (lineId, code) => {
    const m = D.duToanMoc[`${lineId}:${code}`];
    if (!m || m.every((v) => v == null)) return null;
    const [bid, hd, tt] = m;
    return { bid, hd, tt, latest: tt != null ? tt : hd != null ? hd : bid };
  };
  /* Chỉ số một dòng (SRS-DADT V1.4 BR-DADT-C-07, 02-05). uses = các đợt ĐXMS / KĐT dùng dòng: { x: { code }, st (trạng thái), qty, value }.
     Đã đăng ký = ĐXMS / KĐT đã phê duyệt (OK); đang giữ = đang phê duyệt / điều chỉnh; còn lại = dự toán − đã đăng ký − đang giữ.
     Ba mốc = tổng mốc của các dòng con có mốc; Giá trị tiết kiệm = tổng (giá trị dự toán của dòng con − mốc muộn nhất). Không dòng con nào có mốc → null ("-"). */
  D.duToanStats = (l, uses) => {
    const sum = (f) => uses.filter(f).reduce((s, u) => s + (u.value || 0), 0);
    const live = (u) => u.st === 'OK' || u.st === 'PD' || u.st === 'DC';
    const ok = r2(sum((u) => u.st === 'OK')), held = r2(sum((u) => u.st === 'PD' || u.st === 'DC'));
    const out = { ok, held, qty: uses.filter(live).reduce((s, u) => s + (u.qty || 0), 0), remain: r2(l.value - ok - held), bid: null, hd: null, tt: null, saving: null };
    uses.forEach((u) => {
      const m = D.duToanMocOf(l.id, u.x ? u.x.code : u.code);
      if (!m) return;
      ['bid', 'hd', 'tt'].forEach((k) => { if (m[k] != null) out[k] = r2((out[k] || 0) + m[k]); });
      out.saving = r2((out.saving || 0) + (u.value || 0) - m.latest);
    });
    return out;
  };
  /* T29 F1 — Khối đơn vị (GIẢ LẬP P-190). */
  D.blocks = ['Khối 1', 'Khối 2', 'Khối 3', 'Khối cơ quan'];
  D.unitBlock = { 'Trung tâm Vô tuyến': 'Khối 1', 'Trung tâm Mạng lõi': 'Khối 1', 'Trung tâm Phần mềm': 'Khối 2', 'Trung tâm Thiết kế vi mạch': 'Khối 2',
    'Nhà máy sản xuất thử nghiệm': 'Khối 3' };
  D.blockOf = (unit) => (unit ? D.unitBlock[unit] || 'Khối cơ quan' : null);
  D.checklist = [
    { g: 'I', name: 'Văn bản căn cứ (QĐ nhiệm vụ KHCN)', no: '1482/QĐ-VHT', req: 'Bắt buộc', by: 1 },
    { g: 'I', name: 'Tờ trình đề xuất mua sắm (BM-01)', no: 'Dự thảo', req: 'Bắt buộc', by: 12 },
    { g: 'II', name: 'Phụ lục chi phí, cơ sở đơn giá', no: '3 báo giá', req: 'Bắt buộc', by: 10 },
    { g: 'II', name: 'Kết quả rà soát tồn kho', no: 'RSTK-2026-0311', req: 'Bắt buộc', by: 7 },
    { g: 'II', name: 'Thuyết minh (BM-02)', no: 'Dự thảo', req: 'Bắt buộc', by: 12 },
    { g: 'III', name: 'Hợp đồng tương tự', no: '—', req: 'Nếu có', by: null },
    /* T29 F7 — phụ lục đính kèm theo HT-DXMS-NOTE màn 8: đơn vị tải lên ở bước lập dự thảo Tờ trình (Danh sách tài liệu, nếu có). */
    ...D.phuLuc.map(([key, name]) => ({ g: 'III', name, no: '—', req: 'Nếu có', by: null, up: key })),
  ];
  /* Cờ hiển thị theo bản gửi (T29 B15, D-80; cùng hướng D-76): SCR-104 ẩn bảng KĐT liên quan và tab Gói thầu / Hợp đồng ở bản demo ĐXMS.
     Code và e2e giữ nguyên; bật lại khi demo KĐT / Thầu (Thật: cấu hình tham số hệ thống / quyền theo phân hệ). */
  D.show = { dtKdt: true, dtThau: false, menuThau: false }; /* dtKdt bật 11/11/2026: tab KĐT liên quan ở Chi tiết đề tài / dự án. */
  D.bm04Sections = ['Căn cứ', 'Sự cần thiết', 'Phạm vi, số lượng', 'Giá trị & cơ sở giá', 'Nguồn vốn', 'Biện pháp thực hiện', 'Phương án kỹ thuật – công nghệ'];
  D.opinions = {
    PC: { 'Căn cứ': { ok: true }, 'Biện pháp thực hiện': { ok: false, text: 'Chưa nêu rõ áp dụng Quy chế LCNT của Tập đoàn hay Luật Đấu thầu.', guide: 'Ghi rõ căn cứ áp dụng tại mục "Biện pháp thực hiện" của BM-01.' } },
    TC: { 'Giá trị & cơ sở giá': { ok: true }, 'Nguồn vốn': { ok: false, text: 'Cần tách chi phí CCDC và TSCĐ trong phụ lục chi phí.', guide: 'Bổ sung cột "Loại chi phí" tại Phụ lục chi phí.' } },
    CL: { 'Phương án kỹ thuật – công nghệ': { ok: true }, 'Phạm vi, số lượng': { ok: true } },
  };
  /* Tiếp thu / bảo lưu mặc định ở task 22 và nội dung giải trình (phụ lục 1 BM-02). */
  D.responses = {
    PC: { decision: 'Tiếp thu', text: 'Bổ sung: áp dụng Quy chế LCNT của Tập đoàn ban hành kèm QĐ 1105/QĐ-TĐ.', ref: 'BM-01 mục 9' },
    TC: { decision: 'Bảo lưu', text: 'Toàn bộ thiết bị là TSCĐ phục vụ nhiệm vụ KHCN, không có CCDC; đã ghi chú loại chi phí tại Phụ lục chi phí theo hướng dẫn 45/HD-TCKT.', ref: 'Phụ lục chi phí, cột 11' },
  };
  D.versionDiff = [
    { field: 'BM-01 · Biện pháp thực hiện', from: 'Tổ chức lựa chọn nhà thầu theo quy định', to: 'Tổ chức lựa chọn nhà thầu theo Quy chế LCNT của Tập đoàn (QĐ 1105/QĐ-TĐ)' },
    { field: 'Phụ lục chi phí · Loại chi phí', from: '(không có cột)', to: 'Thêm cột "Loại chi phí": 5/5 dòng là TSCĐ' },
    { field: 'BM-02 · Phụ lục 1 giải trình', from: '—', to: '1 ý kiến tiếp thu, 1 ý kiến bảo lưu' },
  ];
  D.bm05 = [
    ['Tuân thủ quy định', 'Hồ sơ lập theo QT 10.2.1; căn cứ QĐ 1482/QĐ-VHT còn hiệu lực.'],
    ['Sự cần thiết', 'Phục vụ trực tiếp giai đoạn 2 nhiệm vụ gNodeB thế hệ 2; chưa có thiết bị tương đương.'],
    ['Mục tiêu', 'Đủ năng lực đo kiểm RF/OTA cho 2 dòng sản phẩm trong năm 2027.'],
    ['Phạm vi, số lượng, tồn kho', 'Số lượng đã trừ phần đã dùng (4 máy phân tích phổ) và tồn kho khả dụng (6 bộ kit).'],
    ['Giá trị', '182,90 tỷ đồng gồm VAT; cơ sở giá từ 3 báo giá hợp lệ.'],
    ['Nguồn vốn', 'Vốn KHCN năm 2027; đơn vị giải trình toàn bộ là TSCĐ, TTMS chấp nhận.'],
    ['Biện pháp, kế hoạch', 'Áp dụng Quy chế LCNT của Tập đoàn; thực hiện 01–09/2027.'],
    ['Hiệu quả', 'Giảm thuê dịch vụ đo kiểm ngoài khoảng 14 tỷ đồng/năm.'],
  ];

  /* ---------- Dữ liệu theo hồ sơ chạy luồng (T6 — plan MS01.02/.03 §3.3, §8.3 việc 3) ----------
     Mỗi ĐXMS demo có bộ dữ liệu riêng; D.useCase(mã ĐXMS) gán bộ dữ liệu của hồ sơ đang chạy vào các khoá D.caseInfo, D.items…
     (Flow gọi khi tạo / nạp hồ sơ). ĐXMS khác (tạo trên prototype) dùng bộ dữ liệu của ĐXMS-2026-0117.
     ref: basisType/basisDoc — căn cứ chọn sẵn ở task 01; cqcm — CQCM chọn sẵn ở task 16; purposeCode — mục đích ở task 04;
     rstk, ebom, src — mã kết quả rà soát tồn kho, tệp eBOM/dự toán, nguồn bóc tách; quoteFailFirst — lần YCBG đầu Không đạt;
     doc — nội dung Tờ trình (BM-01 / BM-09); giá trị dạng mảng [v1, v2] = trước / sau hoàn chỉnh ở task 27. */
  const CASE_KEYS = ['caseInfo', 'items', 'aiBasic', 'aiEstimate', 'tree', 'usedIn', 'quotes', 'checklist', 'opinions', 'responses', 'versionDiff', 'bm05'];
  const pick = () => CASE_KEYS.reduce((o, k) => { o[k] = D[k]; return o; }, {});
  D.demoCases = {};
  D.demoCases[D.dxmsCode0] = Object.assign(pick(), { ref: {
    basisType: 'khcn', basisDoc: 'qd1', cqcm: ['PC', 'TC', 'CL'], purposeCode: 'KHCN', rstk: 'RSTK-2026-0311', ebom: 'eBOM-gNodeB-G2-Do-kiem.xlsx',
    src: 'eBOM dự án gNodeB-G2', quoteFailFirst: true, group2Note: 'Kèm chỉ tiêu kỹ thuật và bản vẽ buồng đo (tệp BOM).',
    doc: {
      necessity: 'Nhiệm vụ gNodeB thế hệ 2 bước vào giai đoạn thử nghiệm hệ thống (2027). Năng lực đo kiểm RF/OTA hiện có chỉ đáp ứng 30% nhu cầu, phải thuê ngoài khoảng 14 tỷ đồng/năm.',
      total: '<b>182.900.000.000 đồng</b> <i>(Một trăm tám mươi hai tỷ, chín trăm triệu đồng)</i>. Trong đó: thiết bị 173,90 tỷ; dịch vụ 9,00 tỷ.',
      tech: 'Thiết bị đo đến 44 GHz, hỗ trợ FR1/FR2; buồng đo OTA đạt chuẩn 3GPP TS 38.141-2.',
      stock: 'Đơn vị sử dụng 06 bộ kit hiệu chuẩn tồn kho khả dụng theo kết quả rà soát RSTK-2026-0311; số lượng đề xuất mua giảm tương ứng.',
      measures: ['Tổ chức lựa chọn nhà thầu theo quy định', 'Tổ chức lựa chọn nhà thầu theo Quy chế LCNT của Tập đoàn (QĐ 1105/QĐ-TĐ)'],
      plan: 'LCNT: 01–03/2027 · Ký HĐ: 04/2027 · Giao hàng, nghiệm thu: 05–09/2027.',
      files: ['1482-QD-VHT.pdf (căn cứ)', 'Bao-gia-Alpha.pdf, Bao-gia-Beta.pdf, Bao-gia-Gamma.pdf', 'RSTK-2026-0311.xlsx (kết quả tồn kho)', 'eBOM-gNodeB-G2-Do-kiem.xlsx'],
    },
  } });

  /* MS01.02 — ĐXMS-2026-0124: căn cứ PAKD đã được TGĐ Tập đoàn duyệt; ≥ 160 tỷ; task 48 luôn "Không" (P-24). */
  D.demoCases['ĐXMS-2026-0124'] = {
    caseInfo: { title: 'Mua sắm hệ thống đo kiểm sản xuất loạt module RRU 5G', unit: 'Trung tâm Vô tuyến',
      basis: 'Phương án kinh doanh "Sản xuất module RRU 5G giai đoạn 2026–2028" (1876/QĐ-TĐ, đã được TGĐ Tập đoàn duyệt)', basisApprovedByGroup: true,
      purpose: 'Liên tục SXKD', secret: false, priority: 'Thường', fund: 'Vốn SXKD năm 2027', period: '02/2027 – 10/2027', total: 176.4 },
    items: [
      { n: 1, name: 'Hệ thống đo kiểm tự động cuối dây chuyền (ATE)', uom: 'Hệ thống', bom: 4, used: 0, prop: 4, stock: 0, buy: 4, price: 24.5, amount: 98, group: 2, goods: 'NCSX', cost: 'TSCĐ' },
      { n: 2, name: 'Máy phân tích phổ vector 44 GHz', uom: 'Bộ', bom: 12, used: 0, prop: 12, stock: 0, buy: 12, price: 3.2, amount: 38.4, group: 1, goods: 'VTCNTT', cost: 'TSCĐ' },
      { n: 3, name: 'Buồng che chắn RF sản xuất', uom: 'Bộ', bom: 10, used: 0, prop: 10, stock: 0, buy: 10, price: 3.6, amount: 36, group: 2, goods: 'NCSX', cost: 'TSCĐ' },
      { n: 4, name: 'Dịch vụ tích hợp, chuyển giao', uom: 'Gói', bom: 1, used: 0, prop: 1, stock: null, buy: 1, price: 4, amount: 4, group: 1, goods: 'DVPTV', cost: 'TSCĐ' },
    ],
    aiBasic: [
      { key: 'purposeText', label: 'Mục đích', value: 'Trang bị hệ thống đo kiểm cuối dây chuyền cho sản xuất loạt module RRU 5G theo Phương án kinh doanh 1876/QĐ-TĐ.', from: 'PAKD 1876/QĐ-TĐ, mục 3' },
      { key: 'scope', label: 'Phạm vi, quy mô', value: '4 hạng mục: 04 hệ thống ATE, 12 máy phân tích phổ, 10 buồng che chắn RF, 01 gói dịch vụ tích hợp, chuyển giao.', from: 'Dự toán PAKD, hạng mục Đầu tư dây chuyền' },
      { key: 'value', label: 'Giá trị dự kiến', value: 'Khoảng 176 tỷ đồng (gồm VAT)', from: 'Dự toán PAKD, phần còn lại 205,3 tỷ' },
      { key: 'fund', label: 'Nguồn vốn', value: 'Vốn SXKD, kế hoạch năm 2027', code: 'SXKD', from: 'PAKD 1876/QĐ-TĐ, mục 6' },
      { key: 'period', label: 'Thời gian thực hiện', value: '02/2027 – 10/2027', from: 'Tiến độ PAKD, giai đoạn 2' },
    ],
    aiEstimate: 176,
    tree: [{ name: 'PAKD module RRU 5G 2026–2028', children: [{ name: 'Dây chuyền đo kiểm', lines: [1, 3] }, { name: 'Thiết bị đo', lines: [2] }, { name: 'Dịch vụ', lines: [4] }] }],
    usedIn: {},
    quotes: [
      { ncc: 'NCC-000001', date: '12/10/2026', valid: '12/01/2027', prices: { 1: 24.5, 2: 3.2, 3: 3.72, 4: 4.0 } },
      { ncc: 'NCC-000002', date: '13/10/2026', valid: '13/01/2027', prices: { 1: 25.1, 2: 3.35, 3: 3.6, 4: 4.3 } },
      { ncc: 'NCC-000003', date: '12/10/2026', valid: '20/01/2027', prices: { 1: 24.9, 2: 3.28, 3: 3.65, 4: 4.2 } },
    ],
    checklist: [
      { g: 'I', name: 'Văn bản căn cứ (PAKD đã được TGĐ Tập đoàn duyệt)', no: '1876/QĐ-TĐ', req: 'Bắt buộc', by: 1 },
      { g: 'I', name: 'Tờ trình đề xuất mua sắm (BM-01)', no: 'Dự thảo', req: 'Bắt buộc', by: 12 },
      { g: 'II', name: 'Phụ lục chi phí, cơ sở đơn giá', no: '3 báo giá', req: 'Bắt buộc', by: 10 },
      { g: 'II', name: 'Kết quả rà soát tồn kho', no: 'RSTK-2026-0342', req: 'Bắt buộc', by: 7 },
      { g: 'II', name: 'Thuyết minh (BM-02)', no: 'Dự thảo', req: 'Bắt buộc', by: 12 },
      { g: 'III', name: 'Hợp đồng tương tự', no: '—', req: 'Nếu có', by: null },
      ...D.phuLuc.map(([key, name]) => ({ g: 'III', name, no: '—', req: 'Nếu có', by: null, up: key })),
    ],
    opinions: {
      TC: { 'Nguồn vốn': { ok: false, text: 'Cần ghi rõ nguồn vốn thuộc kế hoạch vốn SXKD năm 2027 đã giao cho Trung tâm.', guide: 'Bổ sung số, ngày văn bản giao kế hoạch vốn tại mục "Nguồn vốn" của BM-01.' } },
      PC: { 'Căn cứ': { ok: true } },
      CL: { 'Phương án kỹ thuật – công nghệ': { ok: true } },
    },
    responses: { TC: { decision: 'Tiếp thu', text: 'Bổ sung: kế hoạch vốn SXKD năm 2027 giao tại văn bản 2215/VHT-KH.', ref: 'BM-01 mục 7' } },
    versionDiff: [{ field: 'BM-01 · Nguồn vốn', from: 'Vốn SXKD năm 2027', to: 'Vốn SXKD năm 2027, kế hoạch vốn giao tại văn bản 2215/VHT-KH' }],
    bm05: [
      ['Tuân thủ quy định', 'Hồ sơ lập theo QT 10.2.1; căn cứ PAKD 1876/QĐ-TĐ đã được TGĐ Tập đoàn phê duyệt, còn hiệu lực.'],
      ['Sự cần thiết', 'Đáp ứng công suất đo kiểm cho sản xuất loạt module RRU 5G từ quý II/2027.'],
      ['Phạm vi, số lượng, tồn kho', 'Không có tồn kho khả dụng (RSTK-2026-0342); số lượng theo dự toán PAKD.'],
      ['Giá trị', '176,40 tỷ đồng gồm VAT; cơ sở giá từ 3 báo giá hợp lệ.'],
      ['Nguồn vốn', 'Vốn SXKD năm 2027 theo kế hoạch vốn đã giao.'],
      ['Biện pháp, kế hoạch', 'Áp dụng Quy chế LCNT của Tập đoàn; thực hiện 02–10/2027.'],
      ['Báo cáo Tập đoàn', 'Không báo cáo: căn cứ đã được TGĐ Tập đoàn phê duyệt (MS01.02).'],
    ],
    ref: { basisType: 'pakd', basisDoc: 'qd4', cqcm: ['PC', 'TC', 'CL'], purposeCode: 'SX', rstk: 'RSTK-2026-0342', ebom: 'Du-toan-PAKD-RRU5G.xlsx',
      src: 'Dự toán PAKD 1876/QĐ-TĐ', quoteFailFirst: false, group2Note: 'Kèm chỉ tiêu kỹ thuật dây chuyền ATE và buồng che chắn.',
      doc: {
        necessity: 'Kế hoạch sản xuất loạt module RRU 5G năm 2027 cần 04 dây chuyền đo kiểm cuối; năng lực hiện có chỉ đáp ứng một dây chuyền thử nghiệm.',
        total: '<b>176.400.000.000 đồng</b> <i>(Một trăm bảy mươi sáu tỷ, bốn trăm triệu đồng)</i>. Trong đó: thiết bị 172,40 tỷ; dịch vụ 4,00 tỷ.',
        tech: 'Hệ thống ATE đo đồng thời 8 cổng RF; buồng che chắn đạt suy hao ≥ 80 dB đến 6 GHz.',
        stock: 'Không có hàng tồn kho khả dụng theo kết quả rà soát RSTK-2026-0342.',
        fund: ['Vốn SXKD năm 2027', 'Vốn SXKD năm 2027, kế hoạch vốn giao tại văn bản 2215/VHT-KH'],
        measures: 'Tổ chức lựa chọn nhà thầu theo Quy chế LCNT của Tập đoàn (QĐ 1105/QĐ-TĐ)',
        plan: 'LCNT: 02–04/2027 · Ký HĐ: 05/2027 · Giao hàng, nghiệm thu: 06–10/2027.',
        files: ['1876-QD-TD.pdf (căn cứ)', 'Bao-gia-Alpha.pdf, Bao-gia-Beta.pdf, Bao-gia-Gamma.pdf', 'RSTK-2026-0342.xlsx (kết quả tồn kho)', 'Du-toan-PAKD-RRU5G.xlsx'],
      } },
  };

  /* MS01.03 — ĐXMS-2026-0098: < 160 tỷ, căn cứ Kế hoạch SXKD năm; BM-09 + Checklist 02; góp ý bằng BM-04 (P-17); 2 CQCM (Tài chính bắt buộc — P-25).
     Dòng 3 dùng 2 bộ kit tồn kho — chính là 2 bộ hồ sơ MS01.01 thấy "đang giữ cho ĐXMS-2026-0098". */
  D.demoCases['ĐXMS-2026-0098'] = {
    caseInfo: { title: 'Mua sắm linh kiện RF cho mẫu thử nghiệm', unit: 'Trung tâm Vô tuyến',
      basis: 'Kế hoạch SXKD năm 2026 của Trung tâm Vô tuyến (0412/QĐ-VHT, nguồn Dự toán)', basisApprovedByGroup: false,
      purpose: 'Liên tục SXKD', secret: false, priority: 'Thường', fund: 'Chi phí SXKD năm 2026', period: '11/2026 – 03/2027', total: 45.2 },
    items: [
      { n: 1, name: 'Bộ linh kiện RF front-end', uom: 'Bộ', bom: 200, used: 0, prop: 200, stock: 0, buy: 200, price: 0.085, amount: 17, group: 1, goods: 'VTCNTT', cost: 'Hàng hoá' },
      { n: 2, name: 'Module khuếch đại công suất GaN', uom: 'Bộ', bom: 120, used: 0, prop: 120, stock: 0, buy: 120, price: 0.13, amount: 15.6, group: 1, goods: 'VTCNTT', cost: 'Hàng hoá' },
      { n: 3, name: 'Bộ kit hiệu chuẩn', uom: 'Bộ', bom: 2, used: 0, prop: 2, stock: 8, book: 8, held: 0, buy: 0, price: 0.35, amount: 0, group: null, goods: 'VTCNTT', cost: 'Hàng hoá' },
      { n: 4, name: 'Dịch vụ gia công vỏ cơ khí mẫu', uom: 'Gói', bom: 1, used: 0, prop: 1, stock: null, buy: 1, price: 12.6, amount: 12.6, group: 1, goods: 'NCSX', cost: 'Chi phí SXKD' },
    ],
    aiBasic: [
      { key: 'purposeText', label: 'Mục đích', value: 'Cung cấp linh kiện RF và gia công vỏ cơ khí cho lô mẫu thử nghiệm module RRU theo Kế hoạch SXKD năm 2026.', from: 'Kế hoạch SXKD 0412/QĐ-VHT, mục II.3' },
      { key: 'scope', label: 'Phạm vi, quy mô', value: '4 hạng mục: 200 bộ linh kiện RF front-end, 120 module khuếch đại GaN, 02 bộ kit hiệu chuẩn (dùng tồn kho), 01 gói gia công vỏ cơ khí.', from: 'Dự toán Kế hoạch SXKD 2026, nhóm Vật tư mẫu thử' },
      { key: 'value', label: 'Giá trị dự kiến', value: 'Khoảng 45 tỷ đồng (gồm VAT)', from: 'Dự toán Kế hoạch SXKD 2026, phần còn lại 58,6 tỷ' },
      { key: 'fund', label: 'Nguồn vốn', value: 'Chi phí SXKD năm 2026', code: 'SXKD', from: 'Kế hoạch SXKD 0412/QĐ-VHT, mục IV' },
      { key: 'period', label: 'Thời gian thực hiện', value: '11/2026 – 03/2027', from: 'Tiến độ Kế hoạch SXKD 2026' },
    ],
    aiEstimate: 45,
    tree: [{ name: 'Kế hoạch SXKD 2026 — Vật tư mẫu thử', children: [{ name: 'Linh kiện RF', lines: [1, 2] }, { name: 'Hiệu chuẩn', lines: [3] }, { name: 'Gia công cơ khí', lines: [4] }] }],
    usedIn: {},
    quotes: [
      { ncc: 'NCC-000001', date: '20/10/2026', valid: '20/01/2027', prices: { 1: 0.085, 2: 0.134, 4: 12.6 } },
      { ncc: 'NCC-000002', date: '21/10/2026', valid: '21/01/2027', prices: { 1: 0.089, 2: 0.13, 4: 13.1 } },
      { ncc: 'NCC-000003', date: '20/10/2026', valid: '15/02/2027', prices: { 1: 0.087, 2: 0.132, 4: 12.9 } },
    ],
    /* Checklist 02: nhóm I Văn bản trình ký, nhóm II Văn bản đính kèm (plan §6.2). */
    checklist: [
      { g: 'I', name: 'Tờ trình BM-09 kèm phụ lục chi phí', no: 'Dự thảo', req: 'Bắt buộc', by: 11 },
      { g: 'I', name: 'Thuyết minh (BM-02)', no: 'Dự thảo', req: 'Tuỳ chọn', by: 11 },
      { g: 'I', name: 'Checklist 02', no: 'Dự thảo', req: 'Bắt buộc', by: 11 },
      { g: 'II', name: 'Tài liệu đầu vào (Kế hoạch SXKD năm, kết quả rà soát tồn kho)', no: '0412/QĐ-VHT · RSTK-2026-0287', req: 'Bắt buộc', by: 7 },
      { g: 'II', name: 'Sở cứ giá', no: '3 báo giá', req: 'Bắt buộc', by: 10 },
      { g: 'II', name: 'Tài liệu khác', no: '—', req: 'Tuỳ chọn', by: null },
    ],
    opinions: {
      TC: { 'Giá trị & cơ sở giá': { ok: false, text: 'Dịch vụ gia công vỏ cơ khí là chi phí SXKD, chưa tách khỏi chi phí mua sắm hàng hoá.', guide: 'Tách dòng 4 sang mục "Chi phí sản xuất kinh doanh" trong cơ cấu chi phí BM-09.' }, 'Nguồn vốn': { ok: true } },
      CL: { 'Phương án kỹ thuật – công nghệ': { ok: true } },
    },
    responses: { TC: { decision: 'Tiếp thu', text: 'Tách dòng 4 (12,60 tỷ) sang mục "Chi phí sản xuất kinh doanh" trong cơ cấu chi phí BM-09.', ref: 'BM-09 mục 4; Phụ lục chi phí',
      keepText: 'Gia công vỏ cơ khí là một phần của mẫu thử, đề nghị giữ trong chi phí mua sắm.' } },
    versionDiff: [
      { field: 'BM-09 · Tổng kinh phí', from: 'Hàng hoá, dịch vụ: 45,20 tỷ', to: 'Mua sắm hàng hoá 32,60 tỷ; chi phí SXKD 12,60 tỷ (dòng 4)' },
      { field: 'Phụ lục chi phí · Loại chi phí', from: '(không có cột)', to: 'Thêm cột "Loại chi phí": dòng 4 là Chi phí SXKD' },
    ],
    bm05: [],
    ref: { basisType: 'khsx', basisDoc: 'qd5', cqcm: ['TC', 'CL'], purposeCode: 'SX', rstk: 'RSTK-2026-0287', ebom: 'Du-toan-KH-SXKD-2026.xlsx',
      src: 'Dự toán Kế hoạch SXKD 2026 (0412/QĐ-VHT)', quoteFailFirst: false, group2Note: '',
      doc: {
        necessity: 'Lô mẫu thử nghiệm module RRU (quý I/2027) cần linh kiện RF front-end, module khuếch đại GaN và vỏ cơ khí theo thiết kế mới; kho chỉ còn đủ kit hiệu chuẩn.',
        total: ['<b>45.200.000.000 đồng</b> <i>(Bốn mươi lăm tỷ, hai trăm triệu đồng)</i>. Trong đó: hàng hoá, dịch vụ 45,20 tỷ.',
          '<b>45.200.000.000 đồng</b> <i>(Bốn mươi lăm tỷ, hai trăm triệu đồng)</i>. Trong đó: mua sắm hàng hoá 32,60 tỷ; chi phí sản xuất kinh doanh 12,60 tỷ (gia công vỏ cơ khí).'],
        tech: 'Linh kiện RF băng n78/n79; module GaN công suất ra 40 W; vỏ nhôm đúc đạt IP65.',
        stock: 'Đơn vị sử dụng 02 bộ kit hiệu chuẩn tồn kho khả dụng theo kết quả rà soát RSTK-2026-0287; không đề xuất mua dòng 3.',
        measures: 'Tổ chức lựa chọn nhà thầu theo Quy chế LCNT của Tập đoàn (QĐ 1105/QĐ-TĐ)',
        plan: 'LCNT: 11–12/2026 · Ký HĐ: 12/2026 · Giao hàng, nghiệm thu: 01–03/2027.',
        files: ['0412-QD-VHT.pdf (căn cứ)', 'Bao-gia-Alpha.pdf, Bao-gia-Beta.pdf, Bao-gia-Gamma.pdf', 'RSTK-2026-0287.xlsx (kết quả tồn kho)', 'Du-toan-KH-SXKD-2026.xlsx'],
      } },
  };
  /* ---------- Hồ sơ KĐT chạy luồng MS13 (plan KĐT §2.3) ----------
     Căn cứ KĐT theo 3 loại của §4.1; bộ dữ liệu theo mã KĐT (D.useCase). KĐT khác tạo trên prototype dùng bộ của KĐT-2026-0032. */
  D.kdtBasisTypes = [
    { id: 'kh', name: 'Kế hoạch SXKD / PAKD / đề tài hàng năm', src: 'Dự toán / eBOM' },
    { id: 'hd', name: 'Hợp đồng / thoả thuận hợp tác', src: 'Hợp đồng' },
    { id: 'cd', name: 'Chỉ đạo Ban TGĐ', src: 'Không có' },
  ];
  D.kdtBasisDocs = [
    { id: 'kd1', no: '2318/QĐ-VHT', date: '18/08/2026', title: 'Phê duyệt đề tài KHCN năm 2027 "Phát triển trạm 5G-Advanced"', type: 'kh', value: 260.0, remain: 142.3 },
    { id: 'kd2', no: '0521/QĐ-VHT', date: '02/09/2026', title: 'Phê duyệt Kế hoạch SXKD năm 2027 của Nhà máy sản xuất thử nghiệm', type: 'kh', value: 410.0, remain: 188.6 },
    { id: 'kd3', no: '1135/TTHT-VHT', date: '11/06/2026', title: 'Thoả thuận hợp tác phát triển module quang tốc độ cao với đối tác Hàn Quốc', type: 'hd', value: 90.0, remain: 90.0 },
    { id: 'kd4', no: '0712/TB-VHT', date: '24/07/2026', title: 'Kết luận giao ban Ban TGĐ về năng lực đo kiểm dùng chung', type: 'cd', value: 0, remain: 0 },
    { id: 'kd5', no: '0633/QĐ-VHT', date: '09/09/2026', title: 'Phê duyệt Kế hoạch trang bị nội bộ năm 2027 của Trung tâm Vô tuyến', type: 'kh', value: 38.0, remain: 24.6 },
  ];
  /* T63 (D-117) — GIẢ LẬP P-229: kết quả AI của màn Thêm mới hồ sơ KĐT (khuôn Lập ĐXMS, P-216). Thật: tác vụ dtms-ms13-buoc-2 / buoc-3 (hồ sơ chủ trương)
     và bước 49 (hồ sơ phê duyệt) đọc tệp, dòng căn cứ, BM-01 đã duyệt; mỗi mục kèm nguồn; không đủ dữ liệu thì không gợi ý mục đó. */
  const kTy = (n) => (n == null || Number.isNaN(n) ? '' : String(Math.round(n * 100) / 100).replace('.', ','));
  const kNv = (x) => (x.nvs || []).map((c) => D.nvOf(c)).filter(Boolean);
  const kDoc = (n) => D.basisDocs.find((d) => d.id === n.basis) || null;
  D.kdtAiFetch = (x, at) => {
    const ns = kNv(x), lines = ns.flatMap((n) => D.duToanOf(n.code).filter((l) => l.buy));
    return { at, parts: [`Đề tài / dự án: ${ns.map((n) => n.code).join(', ') || '-'}`, `Dự toán: ${lines.length} dòng Chi mua sắm`,
      `Văn bản phê duyệt: ${ns.map((n) => (kDoc(n) || {}).no).filter(Boolean).join(', ') || '-'}`, `Bóc tách của KĐT: ${(x.cost || []).length} khoản mục`] };
  };
  /* Bước 3 — sáu mục thông tin cơ bản (SRS 25 tác vụ dtms-ms13-buoc-3). key theo D.aiBasic (purposeText, scope, value, fund, period) + bienPhap. */
  D.kdtAiBasic = (x) => {
    const ns = kNv(x), n0 = ns[0] || {}, d0 = kDoc(n0) || {}, src = ns.map((n) => `${n.code}${kDoc(n) ? ' — ' + kDoc(n).no : ''}`).join('; ') || 'căn cứ';
    const cost = (x.cost || []).reduce((a, r) => a + (Number(r.value) || 0), 0), est = cost || x.est || null;
    const scopeItems = ((x.cost || []).length ? x.cost.map((r) => r.item) : ns.flatMap((n) => D.duToanOf(n.code).filter((l) => l.buy).map((l) => l.item))).filter(Boolean);
    const rows = [
      { key: 'purposeText', label: 'Mục tiêu', value: `Đầu tư ${((t) => t.charAt(0).toLowerCase() + t.slice(1))(String(x.title || '').replace(/^Trang bị |^Đầu tư /, ''))} phục vụ ${ns.map((n) => n.name).join('; ') || 'nhiệm vụ của đơn vị'}.`, from: `${d0.no || src}, mục 2 (mục tiêu)` },
      { key: 'scope', label: 'Phạm vi, quy mô', value: scopeItems.length ? `${scopeItems.length} khoản mục: ${scopeItems.slice(0, 4).join('; ')}${scopeItems.length > 4 ? '; …' : ''}.` : '', from: (x.cost || []).length ? `Bóc tách của KĐT theo dự toán ${src}` : `Dòng Chi mua sắm của dự toán ${src}` },
      { key: 'value', label: 'Tổng mức vốn dự kiến (tỷ đồng)', value: est ? kTy(est) : '', from: cost ? `Tổng giá trị dự tính của ${x.cost.length} khoản mục bóc tách` : 'Tổng mức vốn dự kiến của KĐT' },
      { key: 'fund', label: 'Nguồn vốn', value: n0.fund === 'KHCN' ? 'Vốn KHCN' : n0.fund ? 'Vốn đầu tư phát triển' : '', code: n0.fund || null, from: `${n0.code || src} (nguồn vốn của đề tài / dự án)` },
      { key: 'period', label: 'Thời gian thực hiện', value: x.period || '01/2027 – 12/2027', from: x.period ? 'Thời gian thực hiện của KĐT' : `Tiến độ ${n0.code || 'đề tài / dự án'}` },
      { key: 'bienPhap', label: 'Biện pháp, kế hoạch thực hiện', value: 'Lựa chọn nhà thầu theo Quy chế lựa chọn nhà thầu của Tập đoàn; lập hồ sơ chủ trương: tháng 1; thẩm định, phê duyệt: tháng 2–3; lựa chọn nhà thầu, ký hợp đồng: tháng 4–6.', from: `BM-01 mục 6; tiến độ ${n0.code || 'đề tài / dự án'}` }];
    return rows.filter((r) => r.value);
  };
  /* Bước 49 — gợi ý từng mục BM-03 + Phụ lục thuyết minh từ BM-01 đã duyệt của hồ sơ chủ trương (SRS 27 BR-KPD-02-01). ct = { code, no }. */
  D.kdtAiBm03 = (x, ct) => {
    const ns = kNv(x), names = ns.map((n) => n.name).join('; ') || x.title, bm = `BM-01 ${ct && ct.no ? ct.no : ''}`.trim();
    const T = {
      hienTrang: [`Năng lực hiện có của ${x.unit || 'đơn vị'} chưa đáp ứng nhu cầu của ${names}; một phần công việc phải thuê ngoài.`, '4.1'],
      phanTichNhuCau: [`Nhu cầu theo ${(x.cost || []).length ? `bóc tách của KĐT: ${x.cost.length} khoản mục` : 'hạng mục kế thừa từ hồ sơ chủ trương'}, Tổng mức vốn KĐT ${kTy(x.est)} tỷ đồng.`, '4.2'],
      ketLuanCanThiet: [`Đầu tư "${x.title}" là cần thiết để bảo đảm tiến độ ${names}.`, '4.2'],
      quanDiem: ['Đầu tư đồng bộ, dùng chung cho các nhiệm vụ của đơn vị; ưu tiên thiết bị có khả năng nâng cấp.', '4.3'],
      phuongAnTk: ['Theo chỉ tiêu kỹ thuật đã thống nhất ở hồ sơ chủ trương và báo giá đạt.', '4.3'],
      diaDiem: [x.unit ? `Tại ${x.unit}` : '', '1'],
      giaiPhap: ['Lắp đặt theo đợt giao hàng; nhà cung cấp tích hợp, hiệu chuẩn ban đầu và đào tạo vận hành.', '4.3'],
      ruiRo: ['Chậm giao hàng do nhập khẩu; biện pháp: điều khoản tiến độ và phạt chậm trong hợp đồng.', '4.4'],
      phuongPhapTinh: ['Khối lượng theo bóc tách sau khi trừ tồn kho khả dụng; đơn giá thấp nhất trong các báo giá hợp lệ.', '5'],
      danhGiaHieuQua: [`Chủ động năng lực cho ${names}, giảm chi phí thuê ngoài.`, '5'],
      toChucTh: [`${x.unit || 'Đơn vị đề xuất'} lập hồ sơ KĐT; đơn vị chủ trì tổ chức lựa chọn nhà thầu, ký hợp đồng; đơn vị đề xuất tiếp nhận, vận hành.`, 'II'],
      cacMoc: ['Phê duyệt KĐT: tháng 3; lựa chọn nhà thầu: tháng 4–5; ký hợp đồng: tháng 6; bàn giao, nghiệm thu: tháng 9–12.', '6'],
    };
    return Object.entries(T).filter(([, [v]]) => v).map(([key, [value, muc]]) => ({ key, value, from: `Kế thừa từ ${bm} mục ${muc}` }));
  };
  D.basisTypesFor = (process) => (D.familyOf(process) === 'MS13' ? D.kdtBasisTypes : D.basisTypes);
  D.basisDocsFor = (process) => (D.familyOf(process) === 'MS13' ? D.kdtBasisDocs : D.basisDocs);
  /* KĐT của kịch bản chính — tạo ở SCR-55 (cảnh 1); nhảy cảnh thì hệ thống tạo sẵn. */
  D.kdtDemo = { code: D.kdtCode0, nv: 'DT-KHCN-2027-002', nvs: ['DT-KHCN-2027-002', '009-26-VHT-RDP-DS'], title: 'Đầu tư hệ thống đo kiểm OTA tích hợp phục vụ nhiệm vụ KHCN 5G-A', unit: 'Trung tâm Vô tuyến', field: 'VTCNTT', type: 'KHCN',
    nature: 'TICH_HOP', est: 120, period: '01/2027 – 12/2027', secret: false, purpose: 'Đo kiểm OTA cho trạm 5G-Advanced theo đề tài KHCN năm 2027.',
    creator: 'Nguyễn Văn Minh', created: '01/10/2026', updated: '01/10/2026' };
  /* T31 B3 (D-68) — dòng bóc tách từ dự toán của KĐT mẫu (GIẢ LẬP P-193): KĐT-2026-0030 giữ 1 bộ khoản mục 1 của NV-KHCN-2026-014, dùng chung
     với ĐXMS-2026-0101 (khả dụng tính chung ĐXMS + KĐT); KĐT kịch bản chính bóc tách 2 dòng của DT-KHCN-2027-002 (bước 01, 05 hiện duToanChon). */
  /* T45 (D-104): mỗi dòng bóc tách ghi đề tài / dự án của dòng dự toán (nv; mặc định nvs[0]). KĐT kịch bản chính thêm 1 dòng của đề tài thứ hai. */
  const kdtCostSeed = (x, rows) => { x.cost = rows.map(([n, qty, value, pkg, nv]) => { const c = nv || x.nv, l = D.duToanOf(c).find((y) => y.id === `${c}-${n}`);
    return Object.assign({}, l, { line: l.id, nv: c, qty, value, budget: l.value, pkg }); }); };
  kdtCostSeed(D.kdtList.find((x) => x.code === 'KĐT-2026-0030'), [[1, 1, 42.5, 'Gói thầu thiết bị đo EMC di động'], [2, 1, 12.0, 'Gói vật tư, linh kiện anten', 'NV-KHCN-2026-006']]);
  /* T49 Q3 (GIẢ LẬP, dữ liệu báo cáo): KĐT nhiều đề tài / dự án khác nguồn kinh phí — giá trị chia theo dòng bóc tách.
     0028: Đầu tư phát triển (KHN-2027-DTPT) + Quỹ phát triển KHCN (NV-KHCN-2026-014); 0025: Đầu tư phát triển (DA-2026-002) + Chi phí SXKD (KHN-2026-TTVT). */
  kdtCostSeed(D.kdtList.find((x) => x.code === 'KĐT-2026-0028'), [[1, 1, 52.0, 'Gói thầu dây chuyền đóng gói module quang'], [2, 1, 22.5, 'Gói vật tư quang, linh kiện thử nghiệm', 'NV-KHCN-2026-014']]);
  kdtCostSeed(D.kdtList.find((x) => x.code === 'KĐT-2026-0025'), [[1, 1, 32.6, 'Gói phần cứng, máy chủ thu thập dữ liệu'], [4, 1, 12.0, 'Gói triển khai, đào tạo vận hành MES', 'KHN-2026-TTVT']]);
  kdtCostSeed(D.kdtDemo, [[1, 2, 88, 'Gói thầu buồng đo OTA và máy phân tích phổ'], [4, 1, 8.2, 'Gói dịch vụ tích hợp, hiệu chuẩn'],
    [2, 1, 10.5, 'Gói vật tư, linh kiện đo kiểm', '009-26-VHT-RDP-DS']]);
  D.demoCases[D.kdtCode0] = {
    caseInfo: { title: D.kdtDemo.title, unit: 'Trung tâm Vô tuyến', basis: 'Đề tài KHCN năm 2027 "Phát triển trạm 5G-Advanced" (2318/QĐ-VHT, nguồn eBOM)',
      basisApprovedByGroup: false, purpose: 'Triển khai hoạt động KHCN', secret: false, priority: 'Thường', fund: 'Vốn KHCN, năm 2027', period: '01/2027 – 12/2027', total: 118.5 },
    items: [
      { n: 1, name: 'Hệ thống buồng đo OTA tích hợp', uom: 'Hệ thống', bom: 1, used: 0, prop: 1, stock: 0, buy: 1, price: 56, amount: 56, group: 2, goods: 'NCSX', cost: 'TSCĐ' },
      { n: 2, name: 'Máy phân tích phổ vector 44 GHz', uom: 'Bộ', bom: 12, used: 0, prop: 12, stock: 2, book: 2, held: 0, buy: 10, price: 3.2, amount: 32, group: 1, goods: 'VTCNTT', cost: 'TSCĐ' },
      { n: 3, name: 'Phần mềm điều khiển đo tự động', uom: 'Gói', bom: 1, used: 0, prop: 1, stock: null, buy: 1, price: 18.5, amount: 18.5, group: 1, goods: 'VTCNTT', cost: 'TSCĐ' },
      { n: 4, name: 'Dịch vụ tích hợp, hiệu chuẩn', uom: 'Gói', bom: 1, used: 0, prop: 1, stock: null, buy: 1, price: 12, amount: 12, group: 1, goods: 'DVPTV', cost: 'TSCĐ' },
    ],
    aiBasic: [
      { key: 'purposeText', label: 'Mục tiêu', value: 'Hình thành hệ thống đo kiểm OTA tích hợp phục vụ thử nghiệm trạm 5G-Advanced theo đề tài KHCN năm 2027.', from: 'QĐ 2318/QĐ-VHT, mục 2' },
      { key: 'scope', label: 'Phạm vi, quy mô', value: '4 hạng mục: 01 hệ thống buồng đo OTA, 12 máy phân tích phổ 44 GHz, 01 gói phần mềm điều khiển đo, 01 gói dịch vụ tích hợp, hiệu chuẩn.', from: 'eBOM đề tài 5G-Advanced, nhóm Đo kiểm' },
      { key: 'value', label: 'Tổng mức vốn sơ bộ', value: 'Khoảng 120 tỷ đồng (gồm VAT)', from: 'Dự toán đề tài, phần còn lại 142,3 tỷ' },
      { key: 'fund', label: 'Nguồn vốn', value: 'Vốn KHCN, kế hoạch năm 2027', code: 'KHCN', from: 'QĐ 2318/QĐ-VHT, mục 5' },
      { key: 'period', label: 'Thời gian thực hiện', value: '01/2027 – 12/2027', from: 'Tiến độ đề tài' },
    ],
    aiEstimate: 120,
    tree: [{ name: 'Đề tài 5G-Advanced 2027', children: [{ name: 'Đo kiểm OTA', lines: [1, 3] }, { name: 'Đo kiểm RF', lines: [2] }, { name: 'Tích hợp, hiệu chuẩn', lines: [4] }] }],
    usedIn: {},
    quotes: [
      { ncc: 'NCC-000001', date: '09/10/2026', valid: '09/01/2027', prices: { 1: 56.0, 2: 3.25, 3: 18.5, 4: 12.4 } },
      { ncc: 'NCC-000002', date: '10/10/2026', valid: '10/01/2027', prices: { 1: 57.2, 2: 3.2, 3: 19.1, 4: 12.0 } },
      { ncc: 'NCC-000003', date: '09/10/2026', valid: '20/01/2027', prices: { 1: 56.8, 2: 3.3, 3: 18.9, 4: 12.3 } },
    ],
    checklist: [], opinions: {}, responses: {}, versionDiff: [], bm05: [],
    ref: { basisType: 'kh', basisDoc: 'kd1', cqcm: ['TC', 'PC'], purposeCode: 'KHCN', rstk: 'RSTK-2026-0405', ebom: 'eBOM-5GA-Do-kiem-OTA.xlsx',
      src: 'eBOM đề tài 5G-Advanced', quoteFailFirst: false, group2Note: 'Kèm chỉ tiêu kỹ thuật buồng đo OTA tích hợp (tệp BOM).',
      host: 'Trung tâm Mua sắm',
      /* BM-01 Tờ trình chủ trương KĐT (ký trực tiếp) — mục theo BM-8.6.5. */
      doc: {
        necessity: 'Đề tài 5G-Advanced năm 2027 cần đo kiểm OTA cho khối anten tích hợp. VHT chưa có buồng đo OTA, chỉ còn 02 máy phân tích phổ 44 GHz khả dụng; năm 2025–2026 phải thuê đo ngoài, mỗi lượt chờ 4–6 tuần. Đầu tư hệ thống đo kiểm OTA tích hợp là cần thiết để bảo đảm tiến độ đề tài và dùng chung cho các nhiệm vụ 5G sau.',
        view: 'Đầu tư đồng bộ một hệ thống đo OTA dùng chung cho các nhiệm vụ KHCN 5G của VHT; ưu tiên thiết bị đáp ứng 3GPP TS 38.141-2, có khả năng nâng cấp dải tần (GIẢ LẬP).',
        deploy: 'Lắp đặt tại phòng đo R&D Hòa Lạc theo 2 đợt giao hàng; nhà cung cấp tích hợp, hiệu chuẩn ban đầu và đào tạo vận hành (GIẢ LẬP).',
        tech: 'Buồng đo OTA dải 0,4–44 GHz, đo trường gần và trường xa; máy phân tích phổ vector đến 44 GHz; phần mềm điều khiển đo tự động theo 3GPP TS 38.141-2.',
        method: 'Khối lượng theo eBOM đề tài sau khi trừ tồn kho khả dụng; đơn giá thấp nhất trong 03 báo giá hợp lệ.',
        fund: 'Vốn KHCN, kế hoạch năm 2027 (QĐ 2318/QĐ-VHT)',
        period: 'Dự kiến mua sắm từ tháng 01/2027 đến tháng 12/2027; bố trí vốn trong năm 2027.',
        effect: 'Chủ động đo kiểm OTA cho sản phẩm 5G-A, giảm thời gian chờ đo ngoài; dùng chung cho các nhiệm vụ KHCN khác của VHT.',
        org: 'Trung tâm Vô tuyến lập hồ sơ KĐT trình phê duyệt sau khi chủ trương được duyệt; đơn vị chủ trì tổ chức lựa chọn nhà thầu, ký hợp đồng; Trung tâm Vô tuyến tiếp nhận, lắp đặt, nghiệm thu và đưa vào sử dụng.',
      },
      /* Thẩm định chủ trương (quy trình con 41) — plan KĐT §2.3: lượt 1 Ban Tài chính cần sửa, ĐVĐX bổ sung; lượt 2 còn chưa thống nhất,
         ĐVĐX giải trình → họp lần 1 → xác nhận → cập nhật; lượt 3 thống nhất. items: [mục, nhận xét, hướng dẫn sửa]. */
      review: { CT: [
        { TTMS: { items: [['Pháp lý', 'Căn cứ đề tài KHCN 2318/QĐ-VHT còn hiệu lực, phần vốn còn lại 142,3 tỷ đủ cho KĐT.']] },
          TC: { fix: true, items: [['Tổng mức vốn', 'Chưa tách chi phí TSCĐ / CCDC trong tổng mức vốn: phần mềm điều khiển đo 18,50 tỷ chưa xác định là TSCĐ vô hình hay CCDC.', 'Phân loại phần mềm theo quy chế tài chính, cập nhật phụ lục danh mục.']] },
          PC: { items: [['Pháp lý', 'Căn cứ và thẩm quyền phê duyệt phù hợp; không có ý kiến.']] },
          CL: { items: [['Phạm vi, quy mô', 'Chỉ tiêu kỹ thuật buồng đo phù hợp yêu cầu đo 3GPP.']] } },
        { TTMS: { items: [['Tổng mức vốn', 'Đã phân loại phần mềm là TSCĐ vô hình; tổng mức vốn không đổi.']] },
          TC: { fix: true, items: [['Tổng mức vốn', 'Gói dịch vụ tích hợp, hiệu chuẩn 12,00 tỷ ghi toàn bộ là TSCĐ; phần hiệu chuẩn định kỳ năm thứ hai là chi phí hoạt động.', 'Tách phần hiệu chuẩn định kỳ khỏi giá trị TSCĐ.']] },
          PC: { items: [['Pháp lý', 'Không có ý kiến bổ sung.']] },
          CL: { items: [['Phạm vi, quy mô', 'Không có ý kiến bổ sung.']] } },
        { TTMS: { items: [['Kết luận', 'Hồ sơ đã cập nhật theo kết luận họp; đủ điều kiện ký thẩm định.']] },
          TC: { items: [['Tổng mức vốn', 'Thống nhất với phụ lục danh mục đã cập nhật sau họp.']] },
          PC: { items: [['Pháp lý', 'Không có ý kiến bổ sung.']] },
          CL: { items: [['Phạm vi, quy mô', 'Không có ý kiến bổ sung.']] } }],
        /* Thẩm định KĐT (quy trình con 49) — plan KĐT §2.4 cảnh 7: 1 vòng, thống nhất. */
        KDT: [
          { TTMS: { items: [['Pháp lý', 'BM-03 kế thừa đúng chủ trương đã được Thủ trưởng VHT phê duyệt; căn cứ đề tài 2318/QĐ-VHT còn hiệu lực.'], ['Tổng mức vốn', '118,50 tỷ đồng, không vượt tổng mức vốn của chủ trương; cơ cấu TSCĐ / chi phí hoạt động theo kết luận họp.']] },
            TC: { items: [['Tổng mức vốn', 'Cơ cấu TSCĐ 116,10 tỷ, chi phí hoạt động 2,40 tỷ phù hợp quy chế tài chính; nguồn vốn KHCN 2027 đủ bố trí.']] },
            PC: { items: [['Pháp lý', 'Thẩm quyền phê duyệt thuộc Thủ trưởng VHT; tổ chức LCNT theo Quy chế LCNT của Tập đoàn.']] },
            CL: { items: [['Quy mô', 'Chỉ tiêu kỹ thuật buồng đo OTA và máy phân tích phổ phù hợp 3GPP TS 38.141-2.']] } }] },
      /* BM-03 Tờ trình thẩm định, phê duyệt KĐT (kế thừa chủ trương), BM-14 Báo cáo kết quả thẩm định, BM-18 Quyết định phê duyệt KĐT — mục theo BM-8.6.5. */
      bm03: { no: '1452/TTr-TTVT', ctNo: '1387/TTr-TTVT', decider: 'Tổng Giám đốc VHT',
        place: 'Phòng đo kiểm OTA, tòa nhà R&D — Khu Công nghệ cao Hòa Lạc',
        state: 'Năm 2025–2026 VHT thuê đo OTA bên ngoài 11 lượt, mỗi lượt chờ 4–6 tuần; tồn kho còn 02 máy phân tích phổ 44 GHz khả dụng (RSTK-2026-0405).',
        risk: 'Rủi ro chậm giao buồng đo OTA (nhập khẩu, 20–24 tuần): ký hợp đồng trong tháng 02/2027, giao hàng theo 2 đợt.',
        milestones: [['Phê duyệt KĐT', '12/2026'], ['Phê duyệt KHLCNT, tổ chức LCNT', '01–03/2027'], ['Lắp đặt, hiệu chuẩn, nghiệm thu', '06–11/2027']] },
      bm14: { no: '0925/BC-TTMS', agreed: ['Căn cứ pháp lý trình phê duyệt KĐT phù hợp chủ trương đã được phê duyệt.', 'Sự cần thiết, mục tiêu đầu tư phù hợp đề tài KHCN 5G-Advanced năm 2027.', 'Quy mô, tổng mức vốn 118,50 tỷ đồng, nguồn vốn KHCN 2027, thời gian thực hiện 01–12/2027.'],
        explain: 'Trung tâm Vô tuyến đã làm việc với Ban Tài chính, thống nhất tách 2,40 tỷ đồng hiệu chuẩn định kỳ năm thứ hai sang chi phí hoạt động (biên bản họp lần 1, giai đoạn chủ trương).' },
      bm18: { no: '2107/QĐ-VHT', owner: 'Trung tâm Vô tuyến', costs: [['Chi phí thiết bị', 88], ['Chi phí phần mềm (TSCĐ vô hình)', 18.5], ['Chi phí tích hợp, hiệu chuẩn ban đầu', 9.6], ['Chi phí hiệu chuẩn định kỳ năm thứ hai (chi phí hoạt động)', 2.4]] },
      /* Trả lời của ĐVĐX ở bước 28 theo vòng check; nội dung họp và điều chỉnh đã thống nhất (bước 29–33). */
      reply: [
        'Tiếp thu: phần mềm điều khiển đo có bản quyền vĩnh viễn, phân loại TSCĐ vô hình; đã cập nhật phụ lục danh mục.',
        'Giải trình: hiệu chuẩn thuộc gói lắp đặt ban đầu, là chi phí hình thành tài sản; đề nghị giữ toàn bộ 12,00 tỷ là TSCĐ.'],
      meeting: { place: 'Phòng họp 2, tầng 4 — Trung tâm Mua sắm', time: '14:00',
        result: 'Thống nhất tách 2,40 tỷ hiệu chuẩn định kỳ năm thứ hai sang chi phí hoạt động; 9,60 tỷ tích hợp, hiệu chuẩn ban đầu giữ là TSCĐ. Tổng mức vốn không đổi 118,50 tỷ đồng.',
        changes: [['Phụ lục danh mục — dòng 4', 'Dịch vụ tích hợp, hiệu chuẩn 12,00 tỷ (TSCĐ)', 'Tích hợp, hiệu chuẩn ban đầu 9,60 tỷ (TSCĐ) · Hiệu chuẩn định kỳ năm 2: 2,40 tỷ (chi phí hoạt động)'],
          ['Tờ trình BM-01 — mục 5.2', 'Chưa nêu phân loại chi phí', 'Bổ sung cơ cấu: TSCĐ 116,10 tỷ; chi phí hoạt động 2,40 tỷ']] } },
  };
  /* Nhánh phụ — KĐT-2026-0033: lĩnh vực Khác, báo giá chốt 96,00 tỷ ≥ 90 → không thuộc MS13 → chuyển MS14 (SCR-66). */
  D.demoCases['KĐT-2026-0033'] = {
    caseInfo: { title: 'Mở rộng dây chuyền SMT cho nhà máy sản xuất thử nghiệm', unit: 'Nhà máy sản xuất thử nghiệm',
      basis: 'Kế hoạch SXKD năm 2027 của Nhà máy sản xuất thử nghiệm (0521/QĐ-VHT, nguồn Dự toán)', basisApprovedByGroup: false,
      purpose: 'Liên tục SXKD', secret: false, priority: 'Thường', fund: 'Vốn đầu tư phát triển, năm 2027', period: '01/2027 – 12/2027', total: 96.0 },
    items: [
      { n: 1, name: 'Máy gắn linh kiện tốc độ cao', uom: 'Hệ thống', bom: 2, used: 0, prop: 2, stock: 0, buy: 2, price: 28, amount: 56, group: 2, goods: 'NCSX', cost: 'TSCĐ' },
      { n: 2, name: 'Lò hàn reflow 10 vùng nhiệt', uom: 'Hệ thống', bom: 1, used: 0, prop: 1, stock: 0, buy: 1, price: 14, amount: 14, group: 2, goods: 'NCSX', cost: 'TSCĐ' },
      { n: 3, name: 'Máy in kem hàn kèm kiểm tra SPI', uom: 'Bộ', bom: 2, used: 0, prop: 2, stock: 0, buy: 2, price: 8, amount: 16, group: 1, goods: 'NCSX', cost: 'TSCĐ' },
      { n: 4, name: 'Dịch vụ lắp đặt, chạy thử dây chuyền', uom: 'Gói', bom: 1, used: 0, prop: 1, stock: null, buy: 1, price: 10, amount: 10, group: 1, goods: 'DVPTV', cost: 'TSCĐ' },
    ],
    aiBasic: [
      { key: 'purposeText', label: 'Mục tiêu', value: 'Tăng công suất lắp ráp bo mạch cho sản xuất loạt theo Kế hoạch SXKD năm 2027.', from: 'Kế hoạch SXKD 0521/QĐ-VHT, mục III.2' },
      { key: 'scope', label: 'Phạm vi, quy mô', value: '4 hạng mục: 02 máy gắn linh kiện, 01 lò hàn reflow, 02 máy in kem hàn kèm SPI, 01 gói lắp đặt chạy thử.', from: 'Dự toán Kế hoạch SXKD 2027, nhóm Dây chuyền SMT' },
      { key: 'value', label: 'Tổng mức vốn sơ bộ', value: 'Khoảng 85 tỷ đồng (gồm VAT)', from: 'Dự toán Kế hoạch SXKD 2027' },
      { key: 'fund', label: 'Nguồn vốn', value: 'Vốn đầu tư phát triển, năm 2027', code: 'DTPT', from: 'Kế hoạch SXKD 0521/QĐ-VHT, mục V' },
      { key: 'period', label: 'Thời gian thực hiện', value: '01/2027 – 12/2027', from: 'Tiến độ Kế hoạch SXKD 2027' },
    ],
    aiEstimate: 85,
    tree: [{ name: 'Kế hoạch SXKD 2027 — Dây chuyền SMT', children: [{ name: 'Thiết bị dây chuyền', lines: [1, 2, 3] }, { name: 'Dịch vụ', lines: [4] }] }],
    usedIn: {},
    quotes: [
      { ncc: 'NCC-000001', date: '12/10/2026', valid: '12/01/2027', prices: { 1: 28.0, 2: 14.6, 3: 8.0, 4: 10.4 } },
      { ncc: 'NCC-000002', date: '13/10/2026', valid: '13/01/2027', prices: { 1: 28.9, 2: 14.0, 3: 8.3, 4: 10.0 } },
      { ncc: 'NCC-000003', date: '12/10/2026', valid: '20/01/2027', prices: { 1: 28.4, 2: 14.2, 3: 8.1, 4: 10.2 } },
    ],
    checklist: [], opinions: {}, responses: {}, versionDiff: [], bm05: [],
    ref: { basisType: 'kh', basisDoc: 'kd2', cqcm: ['TC', 'PC'], purposeCode: 'SX', rstk: 'RSTK-2026-0411', ebom: 'Du-toan-KH-SXKD-2027-SMT.xlsx',
      src: 'Dự toán Kế hoạch SXKD 2027 (0521/QĐ-VHT)', quoteFailFirst: false, group2Note: 'Kèm thông số dây chuyền SMT theo thiết kế nhà xưởng.', doc: {} },
  };

  /* Nhánh gộp — KĐT-2026-0031 (plan KĐT §2.3, cảnh 9): Trang bị nội bộ · Nguyên chiếc · 12,40 tỷ → đủ 03 điều kiện gộp → BM-00.
     Hồ sơ mẫu HS-2026-0031 đang ở bước 18; cảnh K9 chạy lại hồ sơ này (Flow.startKdt dùng lại mã). BM-00 là mẫu giả ghép BM-01 + BM-03 (P-50). */
  D.demoCases['KĐT-2026-0031'] = {
    caseInfo: { title: 'Trang bị máy trạm thiết kế cho Trung tâm Vô tuyến', unit: 'Trung tâm Vô tuyến',
      basis: 'Kế hoạch trang bị nội bộ năm 2027 của Trung tâm Vô tuyến (0633/QĐ-VHT, nguồn Dự toán)', basisApprovedByGroup: false,
      purpose: 'Trang bị nội bộ', secret: false, priority: 'Thường', fund: 'Vốn đầu tư phát triển, năm 2027', period: '11/2026 – 02/2027', total: 12.4 },
    items: [
      { n: 1, name: 'Máy trạm thiết kế RF (CPU 32 nhân, RAM 256 GB, GPU chuyên dụng)', uom: 'Bộ', bom: 24, used: 0, prop: 24, stock: 2, book: 2, held: 0, buy: 22, price: 0.46, amount: 10.12, group: 1, goods: 'VTCNTT', cost: 'TSCĐ' },
      { n: 2, name: 'Màn hình đồ họa 32 inch 4K', uom: 'Chiếc', bom: 24, used: 0, prop: 24, stock: 0, buy: 24, price: 0.045, amount: 1.08, group: 1, goods: 'VTCNTT', cost: 'CCDC' },
      { n: 3, name: 'Nâng cấp bản quyền phần mềm mô phỏng trường điện từ (22 máy)', uom: 'Gói', bom: 1, used: 0, prop: 1, stock: null, buy: 1, price: 1.2, amount: 1.2, group: 1, goods: 'VTCNTT', cost: 'TSCĐ' },
    ],
    aiBasic: [
      { key: 'purposeText', label: 'Mục tiêu', value: 'Thay thế 24 máy trạm thiết kế RF đã hết khấu hao, bảo đảm năng lực mô phỏng anten, mạch RF cho các dự án năm 2027.', from: 'Kế hoạch trang bị nội bộ 0633/QĐ-VHT, mục II.1' },
      { key: 'scope', label: 'Phạm vi, quy mô', value: '3 hạng mục: 24 máy trạm thiết kế RF (dùng lại 02 máy tồn kho), 24 màn hình đồ họa 4K, 01 gói nâng cấp bản quyền phần mềm mô phỏng.', from: 'Dự toán Kế hoạch trang bị nội bộ 2027' },
      { key: 'value', label: 'Tổng mức vốn sơ bộ', value: 'Khoảng 12,4 tỷ đồng (gồm VAT)', from: 'Dự toán Kế hoạch trang bị nội bộ 2027' },
      { key: 'fund', label: 'Nguồn vốn', value: 'Vốn đầu tư phát triển, năm 2027', code: 'DTPT', from: 'Kế hoạch trang bị nội bộ 0633/QĐ-VHT, mục IV' },
      { key: 'period', label: 'Thời gian thực hiện', value: '11/2026 – 02/2027', from: 'Tiến độ Kế hoạch trang bị nội bộ 2027' },
    ],
    aiEstimate: 12.4,
    tree: [{ name: 'Kế hoạch trang bị nội bộ 2027 — Trung tâm Vô tuyến', children: [{ name: 'Máy trạm, màn hình', lines: [1, 2] }, { name: 'Phần mềm', lines: [3] }] }],
    usedIn: {},
    quotes: [
      { ncc: 'NCC-000001', date: '05/10/2026', valid: '05/01/2027', prices: { 1: 0.46, 2: 0.047, 3: 1.2 } },
      { ncc: 'NCC-000002', date: '06/10/2026', valid: '06/01/2027', prices: { 1: 0.47, 2: 0.045, 3: 1.24 } },
      { ncc: 'NCC-000003', date: '05/10/2026', valid: '15/01/2027', prices: { 1: 0.48, 2: 0.046, 3: 1.22 } },
    ],
    checklist: [], opinions: {}, responses: {}, versionDiff: [], bm05: [],
    ref: { basisType: 'kh', basisDoc: 'kd5', cqcm: ['TC', 'PC'], purposeCode: 'TB', rstk: 'RSTK-2026-0398', ebom: 'Du-toan-trang-bi-noi-bo-2027-TTVT.xlsx',
      src: 'Dự toán Kế hoạch trang bị nội bộ 2027 (0633/QĐ-VHT)', quoteFailFirst: false, group2Note: 'Kèm cấu hình máy trạm theo yêu cầu phần mềm mô phỏng.',
      host: null,
      /* BM-00 văn bản gộp (mẫu giả, P-50): phần A chủ trương, phần B khoản đầu tư. */
      doc: {
        necessity: '24 máy trạm thiết kế RF trang bị năm 2020 đã hết khấu hao, cấu hình không đáp ứng phần mềm mô phỏng trường điện từ phiên bản mới (thời gian mô phỏng một mẫu anten tăng từ 6 lên 20 giờ). Tồn kho còn 02 máy cùng cấu hình khả dụng. Trang bị thay thế là cần thiết để bảo đảm tiến độ thiết kế các dự án năm 2027.',
        tech: 'Máy trạm CPU 32 nhân, RAM 256 GB, GPU chuyên dụng mô phỏng; màn hình 32 inch 4K; nâng cấp bản quyền phần mềm mô phỏng lên phiên bản 2026.',
        method: 'Số lượng theo định biên kỹ sư thiết kế RF (24 người) sau khi trừ 02 máy tồn kho; đơn giá thấp nhất trong 03 báo giá hợp lệ.',
        fund: 'Vốn đầu tư phát triển, kế hoạch năm 2027 (QĐ 0633/QĐ-VHT)',
        period: 'Dự kiến mua sắm từ tháng 11/2026 đến tháng 02/2027.',
        effect: 'Rút ngắn thời gian mô phỏng thiết kế anten, mạch RF khoảng 3 lần; bảo đảm năng lực thiết kế cho các dự án vô tuyến năm 2027.',
        org: 'Trung tâm Vô tuyến là chủ đầu tư, tổ chức lựa chọn nhà thầu, ký hợp đồng, tiếp nhận, nghiệm thu và đưa vào sử dụng.',
        plan: [['Phê duyệt hồ sơ gộp', '10/2026'], ['Lựa chọn nhà thầu, ký hợp đồng', '11–12/2026'], ['Giao hàng, nghiệm thu', '01–02/2027']],
      },
      /* Ý kiến Chỉ huy ĐVĐX trên dự thảo BM-00 (bước 20). */
      lead: 'Đồng ý nội dung dự thảo. Bổ sung cấu hình tối thiểu của máy trạm vào phụ lục danh mục trước khi gửi thẩm định.',
      /* Thẩm định hồ sơ gộp (khối E, giai đoạn GOP) — cảnh 9: 1 vòng, thống nhất. */
      review: { GOP: [
        { TTMS: { items: [['Pháp lý', 'Căn cứ Kế hoạch trang bị nội bộ 2027 (0633/QĐ-VHT) còn hiệu lực, phần vốn còn lại 24,6 tỷ đủ cho KĐT.'], ['Tổng mức vốn', '12,40 tỷ đồng thuộc ngưỡng MS13; đủ 03 điều kiện gộp BM-00.']] },
          TC: { items: [['Tổng mức vốn', 'Phân loại TSCĐ / CCDC phù hợp: màn hình 1,08 tỷ là CCDC, còn lại là TSCĐ.']] },
          PC: { items: [['Pháp lý', 'Thẩm quyền phê duyệt thuộc Thủ trưởng VHT; không có ý kiến.']] } }] } },
  };

  /* T29 B12 (review Huylx4 #20): hạng mục của hồ sơ ĐXMS đang chạy = hạng mục mẫu − hạng mục ĐVĐX bỏ ở bước 5 + hạng mục thêm từ dự toán đề tài / dự án
     (Flow.ui.bocTachEdit do eForm bước 5 ghi). Rà soát tồn kho, YCBG, báo giá, phụ lục đọc D.items nên dùng ngay danh sách mới. D.itemsBase = bộ mẫu. */
  let baseItems = D.items;
  Object.defineProperty(D, 'items', { configurable: true, enumerable: true,
    get() {
      const F = window.Flow, e = F && F.state && !F.state.kdt && !F.state.parent ? (F.ui || {}).bocTachEdit : null;
      return e ? baseItems.filter((i) => !(e.drop || []).includes(i.n)).concat(e.add || []) : baseItems;
    },
    set(v) { baseItems = v; } });
  D.itemsBase = () => baseItems;
  /* T34: ĐXMS điều chỉnh / sao chép chưa có bộ dữ liệu mẫu riêng → dùng bộ của ĐXMS nguồn (adjFrom, copyFrom). */
  D.useCase = (code) => {
    for (let g = 0; code && !D.demoCases[code] && g < 10; g++) {
      const x = window.Flow && window.Flow.state && window.Flow.findDxms ? window.Flow.findDxms(code) : (D.dxmsList || []).find((o) => o.code === code);
      const nx = x && (x.adjFrom || x.copyFrom);
      if (!nx) break;
      code = nx;
    }
    const c = D.demoCases[code] || D.demoCases[/^KĐT/.test(code || '') ? D.kdtCode0 : D.dxmsCode0];
    CASE_KEYS.forEach((k) => { D[k] = c[k]; });
    D.caseRef = c.ref;
  };
  D.useCase(D.dxmsCode0);
  /* Có ý kiến Không OK mà ĐVĐX chọn "Không đồng ý" (bảo lưu) → task 26 đi nhánh lập giải trình. u = Flow.ui (lựa chọn trên SCR-12). */
  D.keepAny = (u) => Object.keys(D.responses).some((c) => (((u || {}).resp || {})[c] || D.responses[c].decision) === 'Bảo lưu');

  /* Bộ demo (công cụ demo › Chọn hồ sơ demo, plan §8.1): mỗi bộ = một ĐXMS + quy trình, cảnh (§3.4) và nhánh phụ. Cảnh start 'NEW' mở SCR-25. */
  /* Bản chụp danh mục Phân cấp thẩm quyền KĐT (vars.auth) dùng cho nhánh phụ tuyến Tập đoàn: KHCN → chủ trương Tập đoàn, KĐT VHT (UQ-GUQ §1.2.1, GIẢ LẬP P-90). */
  const AUTH_CT_TD = { auth: [{ type: 'KHCN', field: '*', from: 0, to: null, ct: 'TD', kdt: 'VHT', basis: 'UQ-GUQ §1.2.1' }] };
  D.demoSets = [
    { key: 'MS01.01', dxms: D.dxmsCode0, label: 'ĐXMS-2026-0117 · MS01.01', scenes: D.scenes, branches: [
      { name: 'Chỉ huy ĐVĐX không đồng ý', tasks: '13 → 14 → 12', task: 13, who: 'hai' },
      { name: 'TTMS trả lại danh sách CQCM', tasks: '17 → 16', task: 17, who: 'lan' },
      { name: 'Giải trình vòng 3/2 → cảnh báo, họp', tasks: '28 → 29–34', task: 28, who: 'minh', vars: { round: 2 } },
      { name: 'TTMS chọn Không báo cáo Tập đoàn', tasks: '48 → 57', task: 48, who: 'lan' },
      { name: 'Thủ trưởng VHT yêu cầu hoàn chỉnh', tasks: '60 → 25 → 26', task: 60, who: 'tgd' },
      /* T29 S9: thẩm định lần 02 — tua qua giải trình (28) rồi tới bước 19 của lần sau, Lịch sử ý kiến có hai lần. */
      { name: 'Thẩm định lần 02 — lịch sử ý kiến nhiều lần', tasks: '28 → 13–19', task: 19, who: 'hoa', pre: { via: 28 } },
      /* T29 B4 P1 (BR-DXMS-04-11): NCC Beta báo buồng đo OTA 39,5 tỷ / hệ thống, chọn làm cơ sở giá → hạng mục liên kết 1482/QĐ-VHT 196,90 tỷ > còn 189,40 tỷ;
         Báo giá đạt bị chặn ở bước 10. Tệp báo giá đã tải sẵn để vào thẳng điều kiện căn cứ. */
      { name: 'Báo giá vượt phần căn cứ — chặn Báo giá đạt', tasks: '10', task: 10, who: 'thau',
        ui: { 'quote_NCC-000001': true,'quote_NCC-000002': true, 'quote_NCC-000003': true,
          bgEval: { 'YCBG-2026-0117-01': { ncc: { 'NCC-000002': { prices: { 3: 39500000000 } } }, base: { 3: { ncc: 'NCC-000002', reason: 'Beta đáp ứng chỉ tiêu buồng đo dải mmWave theo yêu cầu đo kiểm 5G-Advanced' } } } } } }] },
    { key: 'MS01.02', dxms: 'ĐXMS-2026-0124', label: 'ĐXMS-2026-0124 · MS01.02', scenes: [
      { n: '2-1', name: 'Tạo luồng, căn cứ đã được phê duyệt (dự kiến MS01.02)', start: 'NEW', tasks: '—, 01, 10', who: 'minh' },
      { n: '2-2', name: 'Không báo cáo Tập đoàn', start: 48, tasks: '48', who: 'lan' },
      { n: '2-3', name: 'Phê duyệt (BM-08 không kèm BM-06, BM-07)', start: 58, tasks: '57–61', who: 'lan' },
      { n: '2-4', name: 'Tổng kết', start: 'END', tasks: '—', who: 'lan' }], branches: [] },
    { key: 'MS01.03', dxms: 'ĐXMS-2026-0098', label: 'ĐXMS-2026-0098 · MS01.03', scenes: [
      { n: '3-1', name: 'Tạo hồ sơ, căn cứ Kế hoạch SXKD (dưới ngưỡng → MS01.03)', start: 'NEW', tasks: '—, 01–10', who: 'minh' },
      { n: '3-2', name: 'Dự thảo BM-09 + Checklist 02, chọn CQCM', start: 11, tasks: '11, 13, 15–18', who: 'minh' },
      { n: '3-3', name: 'Góp ý BM-04', start: 19, tasks: '19–25', who: 'thu' },
      { n: '3-4', name: 'Hoàn chỉnh, ký lại BM-04 + Checklist 02', start: 26, tasks: '26, 27, 35–37', who: 'minh' },
      { n: '3-5', name: 'TTMS ‖ Phó TGĐ ký BM-09', start: 38, tasks: '38–40', who: 'lan' },
      { n: '3-6', name: 'Thủ trưởng phê duyệt trên BM-09', start: 60, tasks: '60–61', who: 'tgd' },
      { n: '3-7', name: 'Tổng kết', start: 'END', tasks: '—', who: 'tgd' }], branches: [
      { name: 'Thủ trưởng yêu cầu hoàn chỉnh (B-3a)', tasks: '60 → 25 → 26', task: 60, who: 'tgd' },
      { name: 'Phó TGĐ không đồng ý BM-09 (B-3b)', tasks: '39 → 25 → 26', task: 39, who: 'binh' },
      { name: 'TTMS trả lại danh sách CQCM (B-3c)', tasks: '17 → 16', task: 17, who: 'lan' },
      { name: 'Không đồng ý sửa → giải trình vòng 3/2, họp (B-3d)', tasks: '28 → 29–34', task: 28, who: 'minh', vars: { round: 2 }, ui: { resp: { TC: 'Bảo lưu' } } }] },
    /* KĐT (plan KĐT §2.4): cảnh 1 mở Thêm mới KĐT; nhánh phụ settle = tua xong nhánh song song còn lại (Ban Tài chính đã xác nhận). */
    { key: 'MS13', kdt: D.kdtCode0, also: ['KĐT-2026-0033', 'KĐT-2026-0031'], label: 'KĐT-2026-0032 · MS13', scenes: [
      { n: 'K1', name: 'Khởi tạo KĐT, hồ sơ, căn cứ', start: 'NEW', tasks: '—, 01–05', who: 'minh' },
      { n: 'K2', name: 'Tồn kho, báo giá', start: 7, tasks: '06–10', who: 'minh' },
      { n: 'K3', name: 'Xác nhận song song, thẩm quyền, phân luồng', start: 11, tasks: '11–13', who: 'thu' },
      { n: 'K4', name: 'Chủ trương: dự thảo, BM-01, chọn CQCM, trình', start: 15, tasks: '15–17, 39–45', who: 'minh' },
      { n: 'K5', name: 'Thẩm định chủ trương (vòng BM-01)', start: 27, tasks: '25–38, 46', who: 'lan' },
      { n: 'K6', name: 'Ký chủ trương BM-01', start: 47, tasks: '47, 48', who: 'lan' },
      /* T45: K7, K8, K10 tua hồ sơ CT tới kết thúc (chủ trương đã duyệt), tạo hồ sơ KĐT HS-2026-0032-2 (kế thừa chủ trương) rồi tua tiếp (flow.js fastForward). */
      { n: 'K7', name: 'Hồ sơ KĐT BM-03 + Checklist 02, thẩm định (vòng BM-03)', start: 50, tasks: '49–55', who: 'minh' },
      { n: 'K8', name: 'Ký tờ trình BM-03, báo cáo BM-14, TGĐ ký Quyết định BM-18', start: 56, tasks: '56, 57, 60', who: 'hai' },
      { n: 'K9', name: 'Nhánh gộp BM-00 — KĐT-2026-0031', start: 19, tasks: '18–24, 25–38, 61–62', who: 'minh', kdt: 'KĐT-2026-0031' },
      { n: 'K10', name: 'Tổng kết: Chi tiết KĐT, hồ sơ, BPMN', start: 'END', tasks: '—', who: 'lan', go: 'kdt/' + encodeURIComponent(D.kdtCode0) }], branches: [
      { name: 'KĐT-2026-0033 vượt ngưỡng MS13 → chuyển MS14', tasks: '12 → 13 → MS14', task: 12, who: 'lan', dxms: 'KĐT-2026-0033', settle: true },
      { name: 'TTMS: 04 yếu tố Không OK → AI gợi ý, về bước 10', tasks: '12 → 14 → 10', task: 12, who: 'lan', settle: true },
      { name: 'CQCM chủ trì không đồng ý danh sách CQCM BM-01', tasks: '42 → 41', task: 42, who: 'lan' },
      { name: 'Họp lần 2 vẫn chưa thống nhất → báo cáo, Thủ trưởng kết luận', tasks: '32 → 33 → 37 → 38', task: 32, who: 'lan', vars: { meet: { CT: 1 } } },
      { name: 'TGĐ VHT không đồng ý chủ trương — chỉ đạo', tasks: '48 → dừng / 39', task: 48, who: 'tgd' },
      { name: 'Báo cáo BM-14 không được thông qua → ĐVĐX hoàn chỉnh', tasks: '57 → 58 → 59 → 50', task: 57, who: 'lan' },
      { name: 'KĐT-2026-0031: TGĐ VHT không đồng ý hồ sơ gộp — sửa BM-00', tasks: '62 → 19', task: 62, who: 'tgd', dxms: 'KĐT-2026-0031' },
      { name: 'Tờ trình BM-01 thiếu mục bắt buộc → HT/AI kiểm tra Không đạt, về lập tờ trình', tasks: '43 → 44 → 39', task: 43, who: 'minh' },
      { name: 'Hồ sơ chủ trương chưa đủ điều kiện thẩm định → AI gợi ý, ĐVĐX sửa, chọn lại CQCM', tasks: '45 → 25 → 26 → 41', task: 26, who: 'minh', ui: { inc: { CT: true } } },
      /* GIẢ LẬP P-90: bản chụp danh mục Phân cấp thẩm quyền đặt chủ trương KHCN thuộc Tập đoàn → cổng cấp duyệt sau 46 rẽ Tập đoàn (tuyến 63–74, T18 B4). */
      { name: 'Chủ trương thuộc thẩm quyền Tập đoàn → AI dự thảo công văn, ĐVĐX hoàn thiện bộ hồ sơ gửi Tập đoàn', tasks: '13 → … → 46 → 63 → 64', task: 64, who: 'minh', pre: AUTH_CT_TD },
      /* Khối ký chung 75–78 (D-34): hồ sơ đánh dấu Mật ở bước 4 (ui.secret) → G1 bắt buộc bản cứng; lỗi gửi VOffice giả lập P-94 (ui.voFail, dùng một lần). */
      { name: 'Hồ sơ Mật — ký bản cứng bắt buộc, người phụ trách cập nhật kết quả + scan', tasks: '47 → 77 → 78 → 48', task: 47, who: 'lan', ui: { secret: true } },
      { name: 'Gửi VOffice lỗi → người trình Gửi lại, nhận kết quả ký', tasks: '47 → 75 → 76 (lỗi) → 76 → 48', task: 47, who: 'lan', ui: { voFail: true } },
      /* Tuyến Tập đoàn 63–74 (T18 B4) — người Tập đoàn là tài khoản giả lập (P-96). */
      { name: 'Tập đoàn: các Ban gửi phiếu nhận xét BM-09 → ĐVĐX tiếp thu, TGĐ VHT ký trình lại', tasks: '65 → 66 → 67 → 68 → 69', task: 67, who: 'td', pre: AUTH_CT_TD },
      { name: 'Tập đoàn: Ban ĐTXD kiểm tra hồ sơ hoàn thiện chưa đạt → ĐVĐX bổ sung', tasks: '70 → 68 → 69 → 70', task: 70, who: 'td', pre: AUTH_CT_TD },
      /* T45 (D-103): G36 chủ trương → kết thúc hồ sơ CT (KĐT Đã phê duyệt chủ trương); hồ sơ KĐT tạo riêng trong KĐT. */
      { name: 'TGĐ Tập đoàn ký chủ trương BM-01 → kết thúc hồ sơ chủ trương', tasks: '71 → 73 → 74 → kết thúc hồ sơ chủ trương', task: 73, who: 'td', pre: AUTH_CT_TD },
      { name: 'KĐT-2026-0031: hồ sơ gộp thuộc Tập đoàn → Ban ĐTXD lập BM-14 + dự thảo BM-18, TGĐ Tập đoàn ký', tasks: '… → G30 → 63–70 → 72 → 73 → 74 → kết thúc', task: 72, who: 'td', dxms: 'KĐT-2026-0031',
        pre: { auth: [{ type: 'TBNB', field: '*', from: 0, to: null, ct: 'VHT', kdt: 'TD', basis: 'GIẢ LẬP P-90' }] } }] },
    /* Điều chỉnh ĐXMS (T21 B3): bộ chính ĐXMS-2026-0103 (đã phê duyệt MS01.02, 210,5 tỷ → MS02.02). pre.adj = giá trị / lý do sau điều chỉnh
       đặt sẵn như đã xác nhận ở bước 4 (Flow.startAdj); chuyển ngưỡng xuống (0103 còn 150 tỷ → MS02.03), lên (0072 MS01.03 152 → 172 tỷ → MS02.01);
       0089 (MS01.03, 18,7 tỷ) là MS02.03 tự nhiên. */
    { key: 'MS02', dxms: 'ĐXMS-2026-0103', also: ['ĐXMS-2026-0072', 'ĐXMS-2026-0089'], label: 'ĐXMS-2026-0103 · Điều chỉnh MS02', scenes: [
      { n: 'A1', name: 'Tạo hồ sơ Điều chỉnh từ ĐXMS đã phê duyệt, bước 1 xác nhận căn cứ', start: 'NEW', tasks: '—, 01', who: 'minh' },
      { n: 'A2', name: 'Lý do, phạm vi, giá trị và bảng trước – sau', start: 4, tasks: '04', who: 'minh' },
      { n: 'A3', name: 'Rà soát tồn kho, báo giá điều chỉnh (kết quả cũ chỉ xem)', start: 7, tasks: '06–10', who: 'minh' },
      { n: 'A4', name: 'MS02.02: không báo cáo Tập đoàn (chọn sẵn theo căn cứ cũ)', start: 48, tasks: '48', who: 'lan' },
      { n: 'A5', name: 'Phê duyệt Quyết định BM-08 điều chỉnh', start: 58, tasks: '57–61', who: 'lan' },
      /* T34 (D-85): điều chỉnh tạo ĐXMS mới — tua lại từ đầu nên mã ĐXMS điều chỉnh luôn là 0127 (số trống đầu tiên). */
      { n: 'A6', name: 'Tổng kết: ĐXMS điều chỉnh lần 1 (ĐXMS mới), chuỗi điều chỉnh', start: 'END', tasks: '—', who: 'lan', go: 'dxms/' + encodeURIComponent('ĐXMS-2026-0127') },
      { n: 'A7', name: 'Chuyển ngưỡng xuống: còn 150 tỷ → MS02.03, dự thảo BM-09', start: 11, tasks: '10 → 11', who: 'minh',
        pre: { adj: { total: 150, reason: 'Giảm quy mô: bỏ 01 cụm mô phỏng lõi dự phòng do đã có tồn kho dùng chung.' } } },
      { n: 'A8', name: 'MS02.03: TTMS ‖ Phó TGĐ ký BM-09 điều chỉnh', start: 38, tasks: '38–40, 60–61', who: 'lan',
        pre: { adj: { total: 150, reason: 'Giảm quy mô: bỏ 01 cụm mô phỏng lõi dự phòng do đã có tồn kho dùng chung.' } } },
      { n: 'A9', name: 'Chuyển ngưỡng lên: ĐXMS-2026-0072 tăng 172 tỷ → MS02.01, BM-01', start: 12, tasks: '10 → 12', who: 'minh', dxms: 'ĐXMS-2026-0072',
        pre: { adj: { total: 172, reason: 'Bổ sung 08 phần tử anten mảng pha theo yêu cầu đo kiểm băng tần mới; giá linh kiện tăng.' } } },
      { n: 'A10', name: 'MS02.01: báo cáo TGĐ Tập đoàn (BM-06, BM-07)', start: 50, tasks: '48–56', who: 'lan', dxms: 'ĐXMS-2026-0072',
        pre: { adj: { total: 172, reason: 'Bổ sung 08 phần tử anten mảng pha theo yêu cầu đo kiểm băng tần mới; giá linh kiện tăng.' } } }], branches: [
      { name: 'Chỉ huy ĐVĐX không đồng ý dự thảo điều chỉnh', tasks: '13 → 14 → 12', task: 13, who: 'hai' },
      { name: 'TTMS không đồng ý danh sách CQCM', tasks: '17 → 16', task: 17, who: 'lan' },
      { name: 'Giải trình vòng 3/2 → cảnh báo, họp', tasks: '28 → 29–34', task: 28, who: 'minh', vars: { round: 2 } },
      { name: 'Phó TGĐ không đồng ý BM-05 → ĐVĐX hoàn chỉnh', tasks: '47 → 25 → 26', task: 47, who: 'binh' },
      { name: 'TTMS đổi lựa chọn: có báo cáo TGĐ Tập đoàn dù căn cứ đã được duyệt', tasks: '48 → 49 → 50', task: 48, who: 'lan' },
      { name: 'Thủ trưởng VHT yêu cầu hoàn chỉnh', tasks: '60 → 25 → 26', task: 60, who: 'tgd' },
      { name: 'ĐXMS-2026-0089 (< 160 tỷ): Phó TGĐ không đồng ý BM-09 điều chỉnh', tasks: '39 → 25 → 26', task: 39, who: 'binh', dxms: 'ĐXMS-2026-0089' }] },
  ];
  /* Hợp đồng (T25, D-48): bộ MS22 của HĐ-2026-0052, cảnh 1 mở Chi tiết hợp đồng để Tạo hồ sơ. */
  const HD_DEMO = 'HĐ-2026-0052', hdHref = 'hop-dong/' + encodeURIComponent(HD_DEMO);
  D.demoSets.push({ key: 'MS22', hd: HD_DEMO, label: 'HĐ-2026-0052 · MS22', scenes: [
    { n: 'H1', name: 'Tạo hồ sơ từ Chi tiết hợp đồng, tiếp nhận', start: 'NEW', tasks: '—, 01', who: 'phd', go: hdHref },
    { n: 'H2', name: 'Đơn vị sử dụng lập phụ lục kỹ thuật (song song bước 3)', start: 2, tasks: '02 ‖ 03', who: 'dvsd' },
    { n: 'H3', name: 'Gửi dự thảo, thương thảo với nhà thầu', start: 4, tasks: '04', who: 'phd' },
    { n: 'H4', name: 'AI cảnh báo bảo hành thấp hơn HSMT → thống nhất lại', start: 6, tasks: '05, 06', who: 'phd' },
    { n: 'H5', name: 'Trưởng phòng Hợp đồng phê duyệt, ký soạn thảo', start: 8, tasks: '08', who: 'tphd' },
    { n: 'H6', name: 'Tập hợp chữ ký nháy, gỡ tạm dừng ký, trình ký', start: 9, tasks: '09', who: 'phd' },
    { n: 'H7', name: 'Thủ trưởng VHT ký hợp đồng', start: 10, tasks: '10', who: 'tgd' },
    { n: 'H8', name: 'Nhận hợp đồng, gửi nhà thầu ký', start: 12, tasks: '11, 12', who: 'phd' },
    { n: 'H9', name: 'Ghi nhận nhà thầu đã ký', start: 13, tasks: '13', who: 'phd' },
    { n: 'H10', name: 'Tổng kết: hợp đồng Đang thực hiện', start: 'END', tasks: '—', who: 'phd', go: hdHref }], branches: [
    { name: 'Phụ lục kỹ thuật thiếu mã hàng → AI cảnh báo, sửa nội bộ', tasks: '05 → 07 → 05', task: 7, who: 'phd', ui: { hdMissingCode: true, hdWarranty: 24 } },
    { name: 'Trưởng phòng trả về — sửa nội bộ', tasks: '08 → 07 → 05', task: 8, who: 'tphd' },
    { name: 'Trưởng phòng trả về — thống nhất lại với nhà thầu', tasks: '08 → 06 → 05', task: 8, who: 'tphd' },
    { name: 'Thủ trưởng VHT không đồng ý — sửa và trình lại', tasks: '10 → 09', task: 10, who: 'tgd' },
    { name: 'Nhà thầu chưa ký — Ghi nhận chưa ký', tasks: '13 → 13', task: 13, who: 'phd' }] });
  /* MS23 Tổng quan (D-49): chạy sau MS22; evts = chỉ số sự kiện đã xảy ra trước cảnh. Sự kiện độc lập, bấm theo thứ tự nào cũng được. */
  D.demoSets.push({ key: 'MS23', hd: HD_DEMO, base: 'MS22', tab: 'td', label: 'HĐ-2026-0052 · MS23', events: [
    { key: 2, label: 'Đến mốc giao hàng — tự động nhắc', tasks: '02' },
    { key: 3, label: 'Nhà thầu thông báo giao hàng', tasks: '03' },
    { key: 'S4', label: 'Có phát sinh — cần văn bản phát sinh', tasks: 'MS23.01', data: { flow: 'MS23.01' } },
    { key: 'S4', label: 'Đến hạn nghiệm thu', tasks: 'MS23.03', data: { flow: 'MS23.03' } },
    { key: 5, label: 'Luồng con có biên bản bàn giao đã ký', tasks: '05', hidden: true, data: { loai: 'biên bản bàn giao', kind: 'GIAO' } }
  ], scenes: [
    { n: 'T1', name: 'Hợp đồng đã ký: AI trích mốc, lưu hồ sơ theo dõi', start: 'END', tasks: '01', who: 'phd', go: hdHref },
    { n: 'T2', name: 'Đến mốc giao hàng: tự động nhắc', start: 'END', tasks: '02', who: 'phd', go: hdHref, evts: [0] },
    { n: 'T3', name: 'Phòng Hợp đồng ghi nhận thông báo giao hàng', start: 3, tasks: '03', who: 'phd', go: hdHref, evts: [0, 1] },
    { n: 'T4', name: 'Thông báo các bộ phận, chuyển hồ sơ giao hàng', start: 'END', tasks: '04', who: 'phd', go: hdHref, evts: [0, 1] },
    { n: 'T5', name: 'Đến hạn: cần khởi tạo luồng con', start: 'END', tasks: 'MS23.01, .03', who: 'phd', go: hdHref, evts: [0, 1, 2, 3] },
    { n: 'T6', name: 'Biên bản đã ký: AI cập nhật ngày thực tế', start: 'END', tasks: '05', who: 'phd', go: hdHref, evts: [0, 1, 4] }], branches: [] });
  /* MS24 (T25 B3): chạy sau MS22; cảnh tua hồ sơ đợt Tạm ứng; BASE = hợp đồng đã ký, chưa có hồ sơ thanh toán. */
  D.demoSets.push({ key: 'MS24', hd: HD_DEMO, base: 'MS22', tab: 'pay', vars: { dot: 0 }, label: 'HĐ-2026-0052 · MS24', scenes: [
    { n: 'P1', name: 'Tạo hồ sơ thanh toán đợt Tạm ứng', start: 'BASE', tasks: '—, 01', who: 'phd', go: hdHref },
    { n: 'P2', name: 'Tiếp nhận, kiểm tra căn cứ', start: 2, tasks: '02', who: 'phd' },
    { n: 'P3', name: 'Xuất đề nghị, cung cấp hoá đơn', start: 5, tasks: '04, 05', who: 'phd' },
    { n: 'P4', name: 'AI lập bảng tổng hợp, Phòng tài chính ký', start: 7, tasks: '06, 07', who: 'tckt' },
    { n: 'P5', name: 'Thủ trưởng VHT, Văn thư, TGĐ Tập đoàn ký bảng tổng hợp', start: 10, tasks: '08–10', who: 'td' },
    { n: 'P6', name: 'Hoàn thiện đề nghị, chọn hình thức ký', start: 12, tasks: '12', who: 'phd' },
    { n: 'P7', name: 'Phòng tài chính ký đề nghị', start: 13, tasks: '13', who: 'tckt' },
    { n: 'P8', name: 'TGĐ Tập đoàn ký đề nghị', start: 16, tasks: '14–16', who: 'td' },
    { n: 'P9', name: 'Thanh toán tiền', start: 18, tasks: '18', who: 'tckt' },
    { n: 'P10', name: 'Cập nhật trạng thái, tải minh chứng', start: 19, tasks: '19', who: 'tckt' },
    { n: 'P11', name: 'Tổng kết: đã đồng bộ SAP, tab Thanh toán', start: 'END', tasks: '20', who: 'phd', go: hdHref }], branches: [
    { name: 'Hồ sơ chưa đủ căn cứ — bổ sung', tasks: '02 → 03 → 02', task: 2, who: 'phd' },
    { name: 'Hợp đồng không yêu cầu bảng tổng hợp', tasks: '04 → 12', task: 12, who: 'phd', ui: { ttBangTH: false } },
    { name: 'Văn thư trả bảng tổng hợp', tasks: '09 → 11 → 07', task: 9, who: 'vthu' },
    { name: 'TGĐ Tập đoàn trả đề nghị', tasks: '16 → 17 → 12 → 13', task: 16, who: 'td' },
    { name: 'Đồng bộ SAP lỗi — Gửi lại', tasks: '20 → 20', task: 20, who: 'tckt', ui: { sapFail: true } }] });
  /* MS23.03 + .04 (T25 B4): pre.legs = lộ trình tua qua các hồ sơ con [quy trình, bước đích, ui]; 'END' = chạy tới khi hết việc (đang chờ tín hiệu cũng dừng). */
  const NT = 'MS23.03', TL = 'MS23.04', CH = { tnPhuongAn: 'CHUNG' };
  const sc = (n, name, start, tasks, who, legs, o) => Object.assign({ n, name, start, tasks, who, go: hdHref, pre: legs ? { legs } : undefined }, o);
  D.demoSets.push({ key: NT, hd: HD_DEMO, base: 'MS22', baseEvts: [{ key: 'S4', data: { flow: NT } }], tab: 'td', label: 'HĐ-2026-0052 · Nghiệm thu, thanh lý ký riêng', scenes: [
    sc('N1', 'Đến hạn nghiệm thu: tạo hồ sơ từ tab Tiến độ', 'BASE', '—', 'phd'),
    sc('N2', 'Trung tâm Mua sắm gửi báo cáo KCS tài sản', 1, '01', 'lan', [[NT, 1]]),
    sc('N3', 'Tiếp nhận, kiểm tra căn cứ', 3, '03', 'phd', [[NT, 3]]),
    sc('N4', 'Hoàn thiện biên bản, chọn phương án ký', 6, '05, 06', 'phd', [[NT, 6]]),
    sc('N5', 'Trưởng phòng Hợp đồng ký duyệt', 9, '08, 09', 'tphd', [[NT, 9]]),
    sc('N6', 'Giám đốc ký', 10, '10', 'binh', [[NT, 10]]),
    sc('N7', 'Văn thư kiểm tra', 11, '11', 'vthu', [[NT, 11]]),
    sc('N8', 'Tổng Giám đốc ký', 12, '12', 'tgd', [[NT, 12]]),
    sc('N9', 'Cập nhật biên bản đã ký đầy đủ', 13, '13', 'phd', [[NT, 13]]),
    sc('N10', 'Tổng kết: ngày nghiệm thu thực tế, tab Bàn giao & nghiệm thu', 'END', '14', 'phd', [[NT, 'END']], { tab: 'bg' }),
    sc('L1', 'MS23.04: kiểm tra yêu cầu thanh lý', 1, '.04 · 01', 'phd', [[NT, 9], [TL, 1]]),
    sc('L2', 'MS23.04: chờ MS23.03 hoàn tất, đủ bảo lãnh', 3, '.04 · 03', 'phd', [[NT, 'END'], [TL, 3]]),
    sc('L3', 'MS23.04: quyết toán giá trị', 5, '.04 · 04, 05', 'phd', [[NT, 'END'], [TL, 5]]),
    sc('L4', 'MS23.04: hoàn thiện biên bản thanh lý', 7, '.04 · 06, 07', 'phd', [[NT, 'END'], [TL, 7]]),
    sc('L5', 'MS23.04: tuyến ký riêng, Trưởng phòng Hợp đồng', 9, '.04 · 08, 09', 'tphd', [[NT, 'END'], [TL, 9]]),
    sc('L6', 'MS23.04: Tổng Giám đốc ký', 12, '.04 · 10–12', 'tgd', [[NT, 'END'], [TL, 12]]),
    sc('L7', 'MS23.04: cập nhật biên bản thanh lý đã ký', 13, '.04 · 13', 'phd', [[NT, 'END'], [TL, 13]]),
    sc('L8', 'Tổng kết: hợp đồng Đã thanh lý', 'END', '.04 · 14', 'phd', [[NT, 'END'], [TL, 'END']], { tab: 'tl' })], branches: [
    { name: 'Thiếu chứng từ — bổ sung', tasks: '03 → 03', task: 3, who: 'phd', pre: { legs: [[NT, 3]] } },
    { name: 'KCS chưa đạt — khắc phục, ký lại KCS', tasks: '03 → 04 → 01', task: 3, who: 'phd', pre: { legs: [[NT, 3]] } },
    { name: 'Nghiệm thu dịch vụ: Đơn vị sử dụng gửi KCS', tasks: '02', task: 2, who: 'dvsd', pre: { legs: [[NT, 2, null, { kcs: 'DV' }]] } },
    { name: 'AI kiểm tra không đạt — sửa biên bản', tasks: '08 → 06', task: 6, who: 'phd', pre: { legs: [[NT, 6, { tnAiFail: true }]] } },
    { name: 'Văn thư trả hồ sơ', tasks: '11 → 06', task: 11, who: 'vthu', pre: { legs: [[NT, 11]] } },
    { name: 'Hợp đồng không yêu cầu thanh lý', tasks: 'chỉ nghiệm thu', task: 9, who: 'tphd', pre: { legs: [[NT, 9, { tnPhuongAn: 'KHONG' }]] } },
    { name: 'MS23.04: Tổng Giám đốc trả — sửa, trình lại từ Trưởng phòng', tasks: '.04 · 12 → 07', task: 12, who: 'tgd', pre: { legs: [[NT, 'END'], [TL, 12]] } }] });
  D.demoSets.push({ key: TL, hd: HD_DEMO, base: 'MS22', baseEvts: [{ key: 'S4', data: { flow: NT } }], tab: 'tl', label: 'HĐ-2026-0052 · Nghiệm thu, thanh lý ký chung', scenes: [
    sc('C1', 'Hoàn thiện biên bản nghiệm thu, chọn ký chung', 6, '.03 · 06', 'phd', [[NT, 6, CH]]),
    sc('C2', 'MS23.04: kiểm tra điều kiện ký chung (G1)', 1, '.04 · 01', 'phd', [[NT, 'END', CH], [TL, 1]]),
    sc('C3', 'MS23.04: chuẩn bị biên bản thanh lý', 2, '.04 · 02', 'phd', [[NT, 'END', CH], [TL, 2]]),
    sc('C4', 'MS23.04: hoàn thiện biên bản thanh lý', 7, '.04 · 06, 07', 'phd', [[NT, 'END', CH], [TL, 7]]),
    sc('C5', 'Tập hợp hai biên bản (G2)', 7, '.03 · 07', 'phd', [[NT, 'END', CH], [TL, 'END'], [NT, 7]]),
    sc('C6', 'Một tuyến ký: Trưởng phòng Hợp đồng', 9, '.03 · 08, 09', 'tphd', [[NT, 'END', CH], [TL, 'END'], [NT, 9]]),
    sc('C7', 'Một tuyến ký: Tổng Giám đốc', 12, '.03 · 10–12', 'tgd', [[NT, 'END', CH], [TL, 'END'], [NT, 12]]),
    sc('C8', 'Cập nhật biên bản nghiệm thu đã ký, gửi kết quả (G3)', 13, '.03 · 13', 'phd', [[NT, 'END', CH], [TL, 'END'], [NT, 13]]),
    sc('C9', 'MS23.04: cập nhật biên bản thanh lý đã ký', 13, '.04 · 13', 'phd', [[NT, 'END', CH], [TL, 'END'], [NT, 'END'], [TL, 13]]),
    sc('C10', 'Tổng kết: hợp đồng Đã thanh lý', 'END', '.04 · 14', 'phd', [[NT, 'END', CH], [TL, 'END'], [NT, 'END'], [TL, 'END']])], branches: [
    { name: 'Tổng Giám đốc trả hồ sơ ký chung — sửa, tập hợp lại', tasks: '.03 · 12 → 06 → 07', task: 12, who: 'tgd', pre: { legs: [[NT, 'END', CH], [TL, 'END'], [NT, 12]] } }] });
  /* MS23.01 (T25 B5): hồ sơ đầu tiên của hợp đồng; mặc định Phụ lục hợp đồng. */
  const VB = 'MS23.01', vbAt6 = (vbLoai) => [[VB, 6, { vbLoai }]];
  D.demoSets.push({ key: VB, hd: HD_DEMO, base: 'MS22', baseEvts: [{ key: 'S4', data: { flow: VB } }], tab: 'vb', label: 'HĐ-2026-0052 · Văn bản phát sinh', scenes: [
    sc('V1', 'Có phát sinh: tạo hồ sơ từ tab Tiến độ hoặc Văn bản phát sinh', 'BASE', '—', 'phd', null, { tab: 'td' }),
    sc('V2', 'Lập thông tin, chọn loại văn bản', 1, '01', 'phd', [[VB, 1]]),
    sc('V3', 'Lập và trình đề xuất sửa đổi', 2, '02', 'phd', [[VB, 2]]),
    sc('V4', 'Tổng Giám đốc duyệt đề xuất', 3, '03', 'tgd', [[VB, 3]]),
    sc('V5', 'AI kiểm tra, soạn dự thảo; hoàn thiện văn bản', 6, '04–06', 'phd', [[VB, 6]]),
    sc('V6', 'AI kiểm tra; Trưởng phòng Hợp đồng phê duyệt', 8, '07, 08', 'tphd', [[VB, 8]]),
    sc('V7', 'Chọn hình thức, trình ký', 9, '09', 'phd', [[VB, 9]]),
    sc('V8', 'Tổng Giám đốc ký', 10, '10', 'tgd', [[VB, 10]]),
    sc('V9', 'Cập nhật bản ký đầy đủ, gửi lại nhà thầu', 11, '11', 'phd', [[VB, 11]]),
    sc('V10', 'Tổng kết: AI cập nhật, tab Văn bản phát sinh', 'END', '12', 'phd', [[VB, 'END', { vbGiaTri: 2.5, vbGiaHan: 30, vbNoiDung: 'Bổ sung khối lượng lắp đặt, gia hạn 30 ngày' }]])], branches: [
    { name: 'Biên bản làm việc: không qua đề xuất sửa đổi', tasks: '01 → 04', task: 6, who: 'phd', pre: { legs: vbAt6(D.hdVbTypes[1]) } },
    { name: 'Biên bản phạt: nhập giá trị phạt', tasks: '06', task: 6, who: 'phd', pre: { legs: vbAt6(D.hdVbTypes[2]) } },
    { name: 'Đề xuất chưa duyệt — hoàn thiện tờ trình', tasks: '03 → 02', task: 3, who: 'tgd', pre: { legs: [[VB, 3]] } },
    { name: 'AI kiểm tra căn cứ không đạt — sửa thông tin', tasks: '04 → 01', task: 3, who: 'tgd', pre: { legs: [[VB, 3, { vbAiFail: true }]] } },
    { name: 'AI cảnh báo trước duyệt, vẫn chuyển duyệt', tasks: '07 → 08', task: 8, who: 'tphd', pre: { legs: [[VB, 8, { vbAiWarn: true }]] } },
    { name: 'Trưởng phòng Hợp đồng không duyệt', tasks: '08 → 06 → 07', task: 8, who: 'tphd', pre: { legs: [[VB, 8]] } },
    { name: 'Tổng Giám đốc không ký — trình ký lại', tasks: '10 → 09', task: 10, who: 'tgd', pre: { legs: [[VB, 10]] } }] });
  /* MS23.02 (T25 B6): hồ sơ tự sinh từ MS23 bước 4 (chặng đầu); via = các nút không phải nhánh chính phải bấm trên đường tới bước đích. */
  const BG = 'MS23.02', bgLeg = (to, u, via) => ({ legs: [['MS23', 'END'], [BG, to, u, null, via]] }), bgs = (n, name, start, tasks, who, o) => sc(n, name, start, tasks, who, bgLeg(start).legs, o);
  const FAIL = [6, 'Không đạt'], NOGO = [7, 'Từ chối ngay'], VP = [FAIL, NOGO, [9], [10, 'Phạt']];
  D.demoSets.push({ key: BG, hd: HD_DEMO, base: 'MS22', baseEvts: [{ key: 3 }], tab: 'bg', label: 'HĐ-2026-0052 · Bàn giao', scenes: [
    sc('G1', 'Nhà thầu thông báo: ghi nhận ở Việc của tôi', 'BASE', 'MS23 · 03', 'phd', null, { tab: 'td' }),
    bgs('G2', 'Nhận thông báo bàn giao, phân loại', 1, '01', 'phd'),
    bgs('G3', 'Lập và gửi thông báo giao hàng', 2, '02', 'phd'),
    bgs('G4', 'Phòng Quản lý tài sản ghi nhận giao nhận, hồ sơ kho', 3, '03', 'qlts'),
    bgs('G5', 'Lập yêu cầu kiểm tra chất lượng', 5, '05', 'qlts'),
    bgs('G6', 'Đơn vị sử dụng ghi nhận kết quả kiểm tra', 6, '06', 'dvsd'),
    bgs('G7', 'Tập hợp, xác nhận đủ hồ sơ bàn giao', 14, '14', 'phd'),
    bgs('G8', 'AI kiểm tra, soạn HOC; hoàn thiện HOC', 18, '16–18', 'phd'),
    bgs('G9', 'AI kiểm tra; Trưởng phòng Hợp đồng phê duyệt', 20, '19, 20', 'tphd'),
    bgs('G10', 'Trình ký, cập nhật HOC đã ký', 21, '21', 'phd'),
    sc('G11', 'Tổng kết: ngày bàn giao thực tế, tab Bàn giao & nghiệm thu', 'END', '22', 'phd', [['MS23', 'END'], [BG, 'END', { bgNgay: null }]])], branches: [
    { name: 'Dịch vụ: Đơn vị sử dụng xác nhận, chuyển nghiệm thu', tasks: '01 → 04', task: 4, who: 'dvsd', pre: bgLeg(4, { bgLoai: 'Dịch vụ' }) },
    { name: 'Kết quả không đạt lần đầu', tasks: '06 → 07', task: 6, who: 'dvsd', pre: bgLeg(6) },
    { name: 'Lập biên bản không đạt, chọn hướng xử lý', tasks: '07 → 08, 09', task: 7, who: 'qlts', pre: bgLeg(7, null, [FAIL]) },
    { name: 'Theo dõi bổ sung, thay thế trong 7 ngày', tasks: '08 → 03, 09', task: 8, who: 'qlts', pre: bgLeg(8, null, [FAIL, [7, 'Cho bổ sung']]) },
    { name: 'Sau thay thế vẫn không đạt', tasks: '06 → 09', task: 6, who: 'dvsd', pre: bgLeg(6, null, [FAIL, [7, 'Cho bổ sung'], [8, 'Có hàng']]) },
    { name: 'Ghi nhận quyền từ chối', tasks: '09', task: 9, who: 'qlts', pre: bgLeg(9, null, [FAIL, NOGO]) },
    { name: 'Chọn hướng xử lý theo hợp đồng', tasks: '10 → 11, 12, 13', task: 10, who: 'dvsd', pre: bgLeg(10, null, [FAIL, NOGO, [9]]) },
    { name: 'Xử lý vi phạm: mở hồ sơ MS23.01', tasks: '11 → MS23.01', task: 11, who: 'phd', pre: bgLeg(11, null, VP) },
    { name: 'Thủ tục hủy', tasks: '12', task: 12, who: 'phd', pre: bgLeg(12, null, [FAIL, NOGO, [9], [10, 'Không hoàn thành']]) },
    { name: 'Xin ý kiến Người có thẩm quyền', tasks: '13', task: 13, who: 'phd', pre: bgLeg(13, null, [FAIL, NOGO, [9], [10, 'Vướng mắc']]) },
    { name: 'Chưa đủ hồ sơ — bổ sung, xác nhận lại', tasks: '14 → 15 → 14', task: 14, who: 'phd', pre: bgLeg(14) },
    { name: 'AI kiểm tra căn cứ không đạt', tasks: '16 → 14', task: 14, who: 'phd', pre: bgLeg(14, { bgAiFail: true }) },
    { name: 'AI kiểm tra HOC không đạt', tasks: '19 → 18', task: 18, who: 'phd', pre: bgLeg(18, { bgAiFail2: true }) },
    { name: 'Trưởng phòng Hợp đồng không duyệt', tasks: '20 → 14', task: 20, who: 'tphd', pre: bgLeg(20) }] });
  D.demoSets.forEach((d) => { if (d.key !== 'MS01.01') d.branches.forEach((b) => { b.process = d.key; b.dxms = b.dxms || d.dxms || d.kdt || d.hd; }); });

  window.D = D;
})();
