/* Danh mục dùng chung (DMDC) — phân hệ Danh mục dùng chung của toàn hệ thống (#/dmdc, D-42 thay D-14).
   Khuôn theo fe/repo-khcn-ecat-fe/src/app/features/common-catalog: mỗi danh mục chỉ khai báo cấu hình
   (như CatalogConfig), khuôn chung dựng danh sách, bộ lọc, hộp thoại Thêm mới/Chỉnh sửa, xác nhận và toast. */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc, icon, infoBtn, vSelect, vModal, modal, toast, pager, norm, badge } = window.UI;
  const rerender = () => window.App.render();
  const STORE = 'dtms-proto-dmdc';

  /* Cấu hình danh mục, thứ tự = thứ tự ô trên Tổng quan (tài liệu chuẩn bị §3).
     built: đã dựng khuôn danh sách; chưa dựng → màn Đang phát triển, count = số bản ghi mẫu dự kiến.
     roles: vai thấy ô ngoài Quản trị hệ thống (P-36).
     Mỗi dòng mẫu: [mã, tên, mô tả, đang hoạt động, số hồ sơ đang dùng, {trường thêm của nhóm A+}].
     Trường: code/name/textarea như ecat; abbr = Tên viết tắt (CATALOG_ABBREVIATION_PATTERN); select = vht-select, options cố định. */
  const F = {
    code: (label, width) => ({ key: 'code', label, type: 'code', required: true, max: 50, width: width || 160 }),
    name: (label, minWidth) => ({ key: 'name', label, type: 'name', required: true, max: 255, minWidth: minWidth || 280 }),
    desc: () => ({ key: 'description', label: 'Mô tả', type: 'textarea', max: 500, minWidth: 200 }),
  };
  const PROC_LEVEL = [{ value: 'THEO_NGUONG', label: 'Theo ngưỡng' }, { value: 'TAP_DOAN', label: 'Luôn cấp Tập đoàn' }];
  const GOODS_GROUP = [{ value: 'HANG_HOA', label: 'Hàng hoá' }, { value: 'DICH_VU', label: 'Dịch vụ' }];
  /* ---------- SCR-31 Nhà cung cấp / Nhà thầu (tài liệu chuẩn bị §4) ---------- */
  const KIND = [{ value: 'VN', label: 'Trong nước' }, { value: 'NN', label: 'Nước ngoài' }];
  const COUNTRY = ['Việt Nam', 'Singapore', 'Đức', 'Hàn Quốc', 'Nhật Bản', 'Trung Quốc', 'Đài Loan', 'Hoa Kỳ', 'Pháp', 'Anh', 'Thái Lan', 'Malaysia']
    .map((label, i) => ({ value: i ? label : 'VN', label }));
  const CURRENCY = ['VNĐ', 'USD', 'EUR', 'JPY', 'KRW', 'CNY'].map((v) => ({ value: v, label: v }));
  /* Ngành hàng lấy từ SCR-36; ô chọn chỉ có bản ghi đang hoạt động, trừ giá trị hồ sơ đang giữ (P-33). */
  const goodsOptions = (cur, all) => rows(byKey('loai-hang-hoa')).filter((r) => all || r.active || (cur || []).includes(r.code)).map((r) => ({ value: r.code, label: r.name }));
  /* T80 L7: liên danh (QC-12869 Điều 24 khoản 4 — thỏa thuận liên danh, thành viên đứng đầu) và trường của Danh mục Đối tác hệ thống cũ (HT-THAU-VID §5).
     Thành viên chọn từ chính danh mục (không chọn nhà thầu liên danh khác); thành viên đứng đầu chọn trong số thành viên đã chọn. */
  const JV = [{ value: 'KHONG', label: 'Không' }, { value: 'CO', label: 'Có' }];
  const memberOptions = (cur, all) => rows(byKey('nha-cung-cap')).filter((r) => r.jv !== 'CO' && (all || r.active || (cur || []).includes(r.code)))
    .map((r) => ({ value: r.code, label: `${r.code} — ${r.short || r.name}` }));
  /* Không có vals (hiển thị nhãn ở danh sách / xem) thì lấy mọi nhà cung cấp; trong hộp thoại chỉ các thành viên đã chọn. */
  const leadOptions = (cur, all, vals) => memberOptions(null, true).filter((o) => !vals || (vals.members || []).includes(o.value));
  /* Người đại diện, chức vụ, số đăng ký kinh doanh, ngày thành lập, tài khoản ngân hàng, fax của 12 nhà cung cấp mẫu (dữ liệu giả, như các trường sẵn có). */
  const NCC_REP = [
    ['Nguyễn Văn Hùng', 'Giám đốc', '0101234567', '15/03/2008', '0011000123456 — Ngân hàng TMCP Ngoại thương, CN Hà Nội', '024 3765 1235'],
    ['Trần Quốc Việt', 'Tổng Giám đốc', '0301234568', '02/07/2005', '0071000654321 — Ngân hàng TMCP Ngoại thương, CN TP Hồ Chí Minh', ''],
    ['Tan Wei Ming', 'Managing Director', '201912345K', '11/09/2019', '', '+65 6123 4568'],
    ['Lê Minh Tuấn', 'Giám đốc chi nhánh', '0107654321-001', '20/01/2012', '1200123456789 — Ngân hàng TMCP Đầu tư và Phát triển, CN Hoà Lạc', ''],
    ['Phạm Quốc Bảo', 'Tổng Giám đốc', '0100100100', '01/04/1996', '', '024 3833 5567'],
    ['Đỗ Thu Hà', 'Giám đốc', '0105550123', '08/08/2011', '', ''],
    ['Vũ Văn Nam', 'Giám đốc', '0106667788', '19/05/2014', '', ''],
    ['Klaus Weber', 'Geschäftsführer', 'HRB 123456', '01/02/1998', '', '+49 89 4129 100'],
    ['Kim Min-jun', 'CEO', '', '', '', ''],
    ['Ngô Thanh Tâm', 'Giám đốc', '0314445566', '12/12/2016', '', ''],
    ['Hoàng Anh Đức', 'Chủ tịch Hội đồng quản trị', '0108889900', '30/06/2019', '', ''],
    ['Trịnh Văn Lợi', 'Giám đốc', '0102223344', '25/10/2009', '', ''],
  ];
  const banBadge = (r) => (!r.ban ? badge('Bình thường', 'default') : r.ban.until ? badge('Cấm đến ' + r.ban.until, 'error') : badge('Hạn chế', 'warning'));
  const NCC = {
    formSize: 'lg', importable: true, advanced: true, unique: ['tax'],
    kwPlaceholder: 'Tìm kiếm theo mã, tên, mã số thuế nhà cung cấp',
    /* Nước ngoài không có mã số thuế thì không có khoá chống trùng: coi là trùng khi cùng Tên và Quốc gia (P-32). */
    dupOf: (v, row, list) => {
      if (v.tax) return '';
      const hit = list.find((r) => r !== row && !r.tax && norm(r.name) === norm(v.name) && r.country === v.country);
      return hit ? `Nhà cung cấp ${v.name} (${labelOf({ options: COUNTRY }, v.country)}) đã tồn tại.` : '';
    },
    /* T80 L7: liên danh có ít nhất 02 thành viên, thành viên đứng đầu thuộc danh sách thành viên (Điều 24 khoản 4). */
    validate: (v) => {
      if (v.jv !== 'CO') return {};
      if ((v.members || []).length < 2) return { members: 'Nhà thầu liên danh cần ít nhất 02 thành viên.' };
      if (v.lead && !v.members.includes(v.lead)) return { lead: 'Thành viên đứng đầu phải là một thành viên liên danh.' };
      return {};
    },
    autoCode: (list) => 'NCC-' + String(Math.max(0, ...list.map((r) => Number(r.code.slice(4)) || 0)) + 1).padStart(6, '0'),
    fields: [
      { key: 'code', label: 'Mã nhà cung cấp', type: 'auto', placeholder: 'Hệ thống tự sinh' },
      { key: 'kind', label: 'Phân loại', type: 'select', required: true, options: KIND, default: 'VN',
        onChange: (v, sel) => { if (v === 'VN') sel.country = 'VN'; else if (sel.country === 'VN') sel.country = null; } },
      { key: 'name', label: 'Tên nhà cung cấp', type: 'orgname', required: true, max: 255, span: 2 },
      { key: 'short', label: 'Tên viết tắt / tên giao dịch', type: 'text', max: 100 },
      { key: 'nameEn', label: 'Tên tiếng Anh', type: 'text', max: 255 },
      { key: 'tax', label: 'Mã số thuế', type: 'tax', max: 50, required: (v) => v.kind !== 'NN' && v.jv !== 'CO' },
      { key: 'country', label: 'Quốc gia', type: 'select', required: true, searchable: true, default: 'VN', options: COUNTRY, locked: (v) => v.kind === 'VN' },
      { key: 'address', label: 'Địa chỉ', type: 'text', required: true, max: 500, span: 2 },
      { key: 'jv', label: 'Nhà thầu liên danh', type: 'select', options: JV, default: 'KHONG',
        onChange: (v, sel) => { if (v !== 'CO') { sel.members = []; sel.lead = null; } } },
      { key: 'blank2', type: 'blank' },
      { key: 'members', label: 'Thành viên liên danh', type: 'select', multi: true, searchable: true, options: memberOptions, span: 2,
        required: (v) => v.jv === 'CO', locked: (v) => v.jv !== 'CO', onChange: (v, sel) => { if (sel.lead && !(v || []).includes(sel.lead)) sel.lead = null; } },
      { key: 'lead', label: 'Thành viên đứng đầu liên danh', type: 'select', options: leadOptions, required: (v) => v.jv === 'CO', locked: (v) => v.jv !== 'CO' },
      { key: 'rep', label: 'Người đại diện', type: 'text', max: 100 },
      { key: 'position', label: 'Chức vụ người đại diện', type: 'text', max: 100, default: 'Giám đốc' },
      { key: 'reg', label: 'Số đăng ký kinh doanh', type: 'text', max: 50 },
      { key: 'founded', label: 'Ngày thành lập', type: 'date' },
      { key: 'fax', label: 'Fax', type: 'phone', max: 20 },
      { key: 'bank', label: 'Tài khoản ngân hàng', type: 'text', max: 255, placeholder: 'Số tài khoản — ngân hàng, chi nhánh', span: 2 },
      { key: 'goods', label: 'Ngành hàng cung cấp', type: 'select', multi: true, searchable: true, required: true, options: goodsOptions, span: 2 },
      { key: 'email', label: 'Email nhận yêu cầu báo giá', type: 'email', required: true, max: 255 },
      { key: 'cc', label: 'Email CC', type: 'emails', max: 500, placeholder: 'Nhiều email cách nhau bằng dấu ;' },
      { key: 'contact', label: 'Người liên hệ', type: 'text', max: 100 },
      { key: 'phone', label: 'Số điện thoại', type: 'phone', max: 20 },
      { key: 'currency', label: 'Loại tiền báo giá thường dùng', type: 'select', options: CURRENCY },
      { key: 'blank', type: 'blank' },
      { key: 'description', label: 'Mô tả', type: 'textarea', max: 500, span: 2 },
    ],
    columns: [
      { key: 'code', label: 'Mã nhà cung cấp', width: 130 },
      { key: 'name', label: 'Tên nhà cung cấp', type: 'name', minWidth: 260 },
      { key: 'tax', label: 'Mã số thuế', width: 150 },
      { key: 'kind', label: 'Phân loại', type: 'select', options: KIND, width: 110 },
      { key: 'country', label: 'Quốc gia', type: 'select', options: COUNTRY, width: 120 },
      { key: 'goods', label: 'Ngành hàng', type: 'select', multi: true, options: goodsOptions, minWidth: 220 },
      { key: 'email', label: 'Email nhận yêu cầu báo giá', minWidth: 220 },
      { key: 'contact', label: 'Người liên hệ', width: 170 },
      { key: 'rep', label: 'Người đại diện', width: 190, render: (r) => (r.rep ? `${esc(r.rep)}${r.position ? `<div class="faint">${esc(r.position)}</div>` : ''}` : '<span class="dash">-</span>') },
      { key: 'jv', label: 'Liên danh', width: 110, render: (r) => (r.jv === 'CO' ? badge('Liên danh', 'info') : '<span class="dash">-</span>') },
      { key: 'ban', label: 'Tình trạng', width: 190, render: banBadge },
    ],
    /* 12 bản ghi mẫu: 3 nước ngoài (Gamma, Theta, Iota); Alpha/Beta/Gamma là 3 NCC trong luồng MS01 (task 09–12);
       Eta đang bị cấm, Kappa bị hạn chế (danh sách cấm thuộc phân hệ LCNT, UC-09-08); Mu dừng hoạt động. */
    seedRows: () => [
      ['Công ty TNHH Công nghệ Alpha', 'NCC Alpha', 'Alpha Technology Co., Ltd', 'VN', '0101234567', 'VN', 'Số 12 Duy Tân, Cầu Giấy, Hà Nội', ['VTCNTT', 'NCSX'], 'baogia@alphatech.vn', 'kinhdoanh@alphatech.vn', 'Nguyễn Văn Hùng', '024 3765 1234', 'VNĐ', 3],
      ['Công ty Cổ phần Thiết bị Beta', 'NCC Beta', 'Beta Equipment JSC', 'VN', '0301234568', 'VN', '45 Nguyễn Thị Minh Khai, Quận 1, TP Hồ Chí Minh', ['VTCNTT'], 'rfq@betaequip.vn', '', 'Trần Thị Mai', '0903 456 789', 'VNĐ', 3],
      ['Gamma Technologies Pte. Ltd.', 'NCC Gamma', 'Gamma Technologies Pte. Ltd.', 'NN', '201912345K', 'Singapore', '8 Marina View, Singapore 018960', ['VTCNTT'], 'quotation@gammatech.sg', 'sales.vn@gammatech.sg', 'David Tan', '+65 6123 4567', 'USD', 3],
      ['Công ty TNHH Đo lường Delta - Chi nhánh Hà Nội', 'Delta HN', '', 'VN', '0107654321-001', 'VN', 'Lô B2 Khu công nghệ cao Hoà Lạc, Thạch Thất, Hà Nội', ['NCSX'], 'baogia.hn@deltameas.vn', '', 'Lê Minh Tuấn', '0912 345 678', 'VNĐ', 1],
      ['Tổng công ty Vận tải Epsilon', 'Epsilon', '', 'VN', '0100100100', 'VN', '18 Láng Hạ, Đống Đa, Hà Nội', ['PTVT_TBQL'], 'muasam@epsilon.com.vn', '', 'Phạm Quốc Bảo', '024 3833 5566', 'VNĐ', 0],
      ['Công ty Cổ phần Tư vấn Thiết kế Zeta', 'Zeta Consult', '', 'VN', '0105550123', 'VN', '72 Trần Duy Hưng, Cầu Giấy, Hà Nội', ['DVTV'], 'tuvan@zeta.vn', '', 'Đỗ Thu Hà', '0988 111 222', 'VNĐ', 1],
      ['Công ty TNHH Dịch vụ Kỹ thuật Eta', 'Eta', '', 'VN', '0106667788', 'VN', '5 Phạm Hùng, Nam Từ Liêm, Hà Nội', ['DVPTV'], 'eta.service@eta.vn', '', 'Vũ Văn Nam', '0977 222 333', 'VNĐ', 0, { until: '31/12/2026' }],
      ['Theta Messtechnik GmbH', 'Theta', 'Theta Messtechnik GmbH', 'NN', 'DE812345678', 'Đức', 'Mühldorfstraße 15, 81671 München', ['NCSX'], 'angebot@theta-mt.de', '', 'Klaus Weber', '+49 89 4129 0', 'EUR', 0],
      ['Iota Electronics Co., Ltd.', 'Iota', 'Iota Electronics Co., Ltd.', 'NN', '', 'Hàn Quốc', '129 Samsung-ro, Suwon, Gyeonggi-do', ['VTCNTT', 'NCSX'], 'global.sales@iota-elec.kr', '', 'Kim Min-jun', '+82 31 200 1114', 'USD', 0],
      ['Công ty TNHH Thương mại Kappa', 'Kappa', '', 'VN', '0314445566', 'VN', '210 Cộng Hoà, Tân Bình, TP Hồ Chí Minh', ['HHKD', 'PTVT_TBQL'], 'sales@kappa.com.vn', '', 'Ngô Thanh Tâm', '028 3811 2233', 'VNĐ', 0, {}],
      ['Công ty Cổ phần Lambda & Cộng sự', 'Lambda', '', 'VN', '0108889900', 'VN', '3 Tôn Thất Thuyết, Cầu Giấy, Hà Nội', ['DVTV', 'DVPTV'], 'lienhe@lambda.vn', '', 'Hoàng Anh Đức', '0904 555 666', 'VNĐ', 0],
      ['Công ty TNHH Giải pháp Mạng Mu', 'Mu Network', '', 'VN', '0102223344', 'VN', '88 Hoàng Quốc Việt, Cầu Giấy, Hà Nội', ['VTCNTT'], 'baogia@munet.vn', '', 'Trịnh Văn Lợi', '0936 777 888', 'VNĐ', 0, null, false],
    ].map(([name, short, nameEn, kind, tax, country, address, goods, email, cc, contact, phone, currency, used, ban, active, extra], i) => Object.assign({
      id: i + 1, code: 'NCC-' + String(i + 1).padStart(6, '0'), name, short, nameEn, kind, tax, country, address, goods, email, cc, contact, phone, currency,
      description: '', used, ban: ban || null, active: active !== false, jv: 'KHONG' }, NCC_REP[i] ? { rep: NCC_REP[i][0], position: NCC_REP[i][1], reg: NCC_REP[i][2], founded: NCC_REP[i][3], bank: NCC_REP[i][4], fax: NCC_REP[i][5] } : {}, extra || {})),
  };

  /* ---------- SCR-40 Ngưỡng phân luồng (tài liệu chuẩn bị §5) ----------
     Mỗi dòng là một quy tắc (nhóm quy trình, lĩnh vực, tính chất tài sản, [từ, đến dưới)) → quy trình áp dụng; không có Mã/Tên.
     KĐT gộp MS13 và MS14 làm một nhóm để kiểm tra chồng khoảng giữa hai quy trình. "Tất cả" (*) giao với mọi giá trị. */
  const FLOW_GROUP = [{ value: 'DXMS', label: 'Đề xuất mua sắm (MS01)' }, { value: 'KDT', label: 'Khoản đầu tư (MS13, MS14)' }];
  const FLOW_PROC = {
    /* T29 B1 (D-54): MS01 một quy trình — MS01.01 / .02 / .03 là luồng con, ngưỡng là biến cổng "Giá trị?" sau bước 10. */
    DXMS: Object.keys(D.processes).map((k) => [k, `Luồng con của MS01 — ${D.processes[k].name}`]),
    /* MS13 là một quy trình (plan KĐT §6 #1): nhánh gộp BM-00 / hai giai đoạn do cổng trong BPMN chọn, không do ngưỡng. */
    KDT: [['MS13', 'Phê duyệt khoản đầu tư đơn giản'], ['MS14', 'Phê duyệt khoản đầu tư thông thường']],
  };
  const procOptions = (cur, all, vals) => {
    const g = vals && vals.group;
    return Object.keys(FLOW_PROC).filter((k) => !g || k === g).flatMap((k) => FLOW_PROC[k].map(([v, name]) => ({ value: v, label: `${v} — ${name}` })));
  };
  const ALL = { value: '*', label: 'Tất cả' };
  const dimOptions = (key) => (cur, all) => [ALL].concat(rows(byKey(key)).filter((r) => all || r.active || r.code === cur).map((r) => ({ value: r.code, label: r.name })));
  /* Ngày hiện tại của prototype = ngày hồ sơ bắt đầu chạy (Flow.dateOf(0)). */
  const today = () => Flow.dateOf(0);
  const dateKey = (s) => { const [d, m, y] = String(s).split('/'); return `${y}${m}${d}`; };
  const fmtNum = (n) => (n == null ? '' : n.toLocaleString('vi-VN', { maximumFractionDigits: 2 }));
  const range = (r) => (r.to == null ? `từ ${fmtNum(r.from)} tỷ trở lên` : `${fmtNum(r.from)} – dưới ${fmtNum(r.to)} tỷ`);
  const TH = {
    formGrid: true, unique: [], order: (a, b) => a.group.localeCompare(b.group) || a.field.localeCompare(b.field) || a.from - b.from || a.asset.localeCompare(b.asset),
    kwPlaceholder: 'Tìm kiếm theo lĩnh vực, tính chất tài sản, quy trình',
    searchText: (r) => [labelOf(TH.fields[1], r.field), labelOf(TH.fields[2], r.asset), (r.procs || []).join(' ')].join(' '),
    subject: (r) => `${labelOf({ options: FLOW_GROUP }, r.group)} · ${labelOf(TH.fields[1], r.field)} · ${labelOf(TH.fields[2], r.asset)} · ${range(r)}`,
    fields: [
      { key: 'group', label: 'Nhóm quy trình', type: 'select', required: true, options: FLOW_GROUP, span: 2,
        onChange: (v, sel) => { sel.procs = (sel.procs || []).filter((p) => procOptions(null, false, { group: v }).some((o) => o.value === p)); } },
      { key: 'field', label: 'Lĩnh vực', type: 'select', required: true, searchable: true, default: '*', options: dimOptions('linh-vuc'), span: 2 },
      { key: 'asset', label: 'Tính chất tài sản', type: 'select', required: true, default: '*', options: dimOptions('tinh-chat-tai-san'), span: 2 },
      { key: 'from', label: 'Giá trị từ (tỷ đồng)', type: 'num', required: true, max: 13, placeholder: 'Gồm giá trị này' },
      { key: 'to', label: 'Đến dưới (tỷ đồng)', type: 'num', max: 13, placeholder: 'Để trống nếu không giới hạn' },
      { key: 'procs', label: 'Quy trình áp dụng', type: 'select', multi: true, required: true, options: procOptions, span: 2 },
      { key: 'eff', label: 'Hiệu lực từ ngày', type: 'date', required: true, default: today, span: 2 },
    ],
    columns: [
      /* 7 cột dữ liệu vừa bảng ở màn 1440: nhóm bỏ mã (đã có ở cột Quy trình), Giá trị từ / Đến dưới gộp một cột, tên dài xuống dòng. */
      { key: 'group', label: 'Nhóm quy trình', width: 130, render: (r) => esc(labelOf({ options: FLOW_GROUP }, r.group).replace(/ \(.*\)$/, '')) },
      { key: 'field', label: 'Lĩnh vực', minWidth: 120, render: (r) => `<span class="clamp">${esc(labelOf(TH.fields[1], r.field))}</span>` },
      { key: 'asset', label: 'Tính chất tài sản', minWidth: 150, render: (r) => `<span class="clamp">${esc(labelOf(TH.fields[2], r.asset))}</span>` },
      { key: 'from', label: 'Khoảng giá trị (tỷ đồng)', width: 170,
        render: (r) => (r.to == null ? `Từ ${fmtNum(r.from)} trở lên` : `${fmtNum(r.from)} – dưới ${fmtNum(r.to)}`) },
      { key: 'procs', label: 'Quy trình áp dụng', width: 130, render: (r) => esc((r.procs || []).join(', ')) },
      { key: 'eff', label: 'Hiệu lực từ ngày', width: 130,
        render: (r) => `<div class="eff">${esc(r.eff)}${dateKey(r.eff) > dateKey(today()) ? badge('Chưa hiệu lực', 'warning') : ''}</div>` },
    ],
    /* Kiểm tra khi Lưu (backend): Đến dưới > Giá trị từ; đổi điều kiện hoặc quy trình thì hiệu lực không được trước ngày hiện tại (P-34);
       không chồng khoảng với quy tắc đang hoạt động khác. Lỗi hiện dưới trường. */
    validate: (v, row, list) => {
      const err = {};
      if (v.to != null && v.to <= v.from) err.to = 'Đến dưới phải lớn hơn Giá trị từ.';
      const changed = !row || ['group', 'field', 'asset', 'from', 'to', 'eff'].some((k) => row[k] !== v[k]) || String(row.procs) !== String(v.procs);
      if (changed && dateKey(v.eff) < dateKey(today())) err.eff = `Hiệu lực từ ngày không được trước ngày hiện tại (${today()}).`;
      const hit = (!row || row.active) && overlapOf(v, row, list);
      if (hit && !err.to) err.from = `Khoảng giá trị giao với ngưỡng đang hoạt động: ${TH.subject(hit)}.`;
      return err;
    },
    /* Kích hoạt lại một quy tắc cũng không được chồng khoảng. */
    canActivate: (r, list) => { const hit = overlapOf(r, r, list); return hit ? `Không thể kích hoạt: khoảng giá trị giao với ngưỡng đang hoạt động ${TH.subject(hit)}.` : ''; },
    seedRows: () => [
      ['DXMS', '*', '*', 0, 160, ['MS01.03'], 9],
      ['DXMS', '*', '*', 160, null, ['MS01.01', 'MS01.02'], 5],
      ['KDT', 'VTCNTT', '*', 0, 160, ['MS13'], 8],
      ['KDT', 'KHAC', '*', 0, 90, ['MS13'], 3],
      ['KDT', 'VTCNTT', '*', 160, 1000, ['MS14'], 0],
      ['KDT', 'KHAC', '*', 90, 500, ['MS14'], 1],
    ].map(([group, field, asset, from, to, procs, used], i) => ({ id: i + 1, group, field, asset, from, to, procs, eff: '01/07/2026', used, active: true })),
  };
  /* Dữ liệu lưu từ trước B1 KĐT còn quy trình MS13.01 / MS13.03 (8 trang con cũ) → nạp lại ngưỡng mẫu. */
  const staleTH = (list) => list.some((r) => (r.procs || []).some((p) => /^MS13\.0/.test(p)));
  const meets = (a, b) => a === '*' || b === '*' || a === b;
  const overlapOf = (v, row, list) => list.find((r) => r !== row && r.active && r.group === v.group && meets(r.field, v.field) && meets(r.asset, v.asset)
    && v.from < (r.to == null ? Infinity : r.to) && r.from < (v.to == null ? Infinity : v.to));

  /* ---------- SCR-100 Phân cấp thẩm quyền KĐT (T18 D-33) ----------
     Bảng quy tắc cho bước 13 "Xác định thẩm quyền phê duyệt" của MS13 (bản 12/10): loại KĐT + lĩnh vực + [từ, đến dưới) tỷ → cấp duyệt chủ trương,
     cấp duyệt KĐT, căn cứ. Khuôn như Ngưỡng phân luồng (không Mã / Tên). Dữ liệu mẫu = giả lập P-90 (D.kdtAuthRules). */
  const LEVEL = [{ value: 'VHT', label: 'VHT' }, { value: 'TD', label: 'Tập đoàn' }];
  const authSeed = D.kdtAuthRules; // bảng mặc định của data.js — giữ lại trước khi danh mục thay D.kdtAuthRules
  const typeOptions = (cur, all) => rows(byKey('loai-kdt')).filter((r) => all || r.active || r.code === cur).map((r) => ({ value: r.code, label: r.name }));
  const PC = {
    formGrid: true, unique: [], order: (a, b) => a.type.localeCompare(b.type) || a.field.localeCompare(b.field) || a.from - b.from,
    kwPlaceholder: 'Tìm kiếm theo loại khoản đầu tư, lĩnh vực, căn cứ',
    searchText: (r) => [labelOf(PC.fields[0], r.type), labelOf(PC.fields[1], r.field), r.basis].join(' '),
    subject: (r) => `${labelOf(PC.fields[0], r.type)} · ${labelOf(PC.fields[1], r.field)} · ${range(r)}`,
    fields: [
      { key: 'type', label: 'Loại khoản đầu tư', type: 'select', required: true, options: typeOptions },
      { key: 'field', label: 'Lĩnh vực', type: 'select', required: true, searchable: true, default: '*', options: dimOptions('linh-vuc') },
      { key: 'from', label: 'Tổng mức vốn từ (tỷ đồng)', type: 'num', required: true, max: 13, placeholder: 'Gồm giá trị này' },
      { key: 'to', label: 'Đến dưới (tỷ đồng)', type: 'num', max: 13, placeholder: 'Để trống nếu không giới hạn' },
      { key: 'ct', label: 'Cấp duyệt chủ trương', type: 'select', required: true, options: LEVEL },
      { key: 'kdt', label: 'Cấp duyệt khoản đầu tư', type: 'select', required: true, options: LEVEL },
      { key: 'basis', label: 'Căn cứ', type: 'text', required: true, max: 255, span: 2, placeholder: 'Văn bản phân cấp / ủy quyền áp dụng' },
    ],
    columns: [
      { key: 'type', label: 'Loại khoản đầu tư', minWidth: 150, render: (r) => esc(labelOf(PC.fields[0], r.type)) },
      { key: 'field', label: 'Lĩnh vực', minWidth: 120, render: (r) => esc(labelOf(PC.fields[1], r.field)) },
      { key: 'from', label: 'Tổng mức vốn (tỷ đồng)', width: 170, render: (r) => (r.to == null ? `Từ ${fmtNum(r.from)} trở lên` : `${fmtNum(r.from)} – dưới ${fmtNum(r.to)}`) },
      { key: 'ct', label: 'Cấp duyệt chủ trương', width: 150, render: (r) => esc(labelOf({ options: LEVEL }, r.ct)) },
      { key: 'kdt', label: 'Cấp duyệt KĐT', width: 130, render: (r) => esc(labelOf({ options: LEVEL }, r.kdt)) },
      { key: 'basis', label: 'Căn cứ', minWidth: 200, render: (r) => `<span class="clamp">${esc(r.basis)}</span>` },
    ],
    /* Kiểm tra khi Lưu: Đến dưới > Từ; không chồng khoảng với quy tắc đang hoạt động cùng loại KĐT, lĩnh vực giao nhau. */
    validate: (v, row, list) => {
      const err = {};
      if (v.to != null && v.to <= v.from) err.to = 'Đến dưới phải lớn hơn Tổng mức vốn từ.';
      const hit = (!row || row.active) && pcOverlap(v, row, list);
      if (hit && !err.to) err.from = `Khoảng giá trị giao với quy tắc đang hoạt động: ${PC.subject(hit)}.`;
      return err;
    },
    canActivate: (r, list) => { const hit = pcOverlap(r, r, list); return hit ? `Không thể kích hoạt: khoảng giá trị giao với quy tắc đang hoạt động ${PC.subject(hit)}.` : ''; },
    seedRows: () => authSeed().map((r, i) => Object.assign({ id: i + 1, used: r.type === 'KHCN' || r.type === 'TBNB' ? 4 : 0, active: true }, r)),
  };
  const pcOverlap = (v, row, list) => list.find((r) => r !== row && r.active && r.type === v.type && meets(r.field, v.field)
    && v.from < (r.to == null ? Infinity : r.to) && r.from < (v.to == null ? Infinity : v.to));

  /* ---------- 6 danh mục thêm ở T16 B1 theo Backlog W1_T10 (SCR-67…72): khuôn chung Mã / Tên / trường riêng / Mô tả ---------- */
  const UOM_GROUP = [{ value: 'SO_LUONG', label: 'Số lượng' }, { value: 'DO_LUONG', label: 'Đo lường' }, { value: 'THOI_GIAN', label: 'Thời gian' }];
  const DECIMALS = [{ value: '0', label: '0' }, { value: '2', label: '2' }];
  const EVAL_GROUP = [{ value: 'KY_THUAT', label: 'Đánh giá kỹ thuật' }, { value: 'TAI_CHINH', label: 'Đánh giá tài chính' }, { value: 'TONG_HOP', label: 'Xếp hạng tổng hợp' }];
  const GUAR_USE = [{ value: 'DU_THAU', label: 'Bảo đảm dự thầu' }, { value: 'THUC_HIEN', label: 'Bảo đảm thực hiện hợp đồng' },
    { value: 'TAM_UNG', label: 'Bảo lãnh tạm ứng' }, { value: 'BAO_HANH', label: 'Bảo đảm bảo hành' }];
  const PKG_FIELD = [{ value: 'HANG_HOA', label: 'Hàng hoá' }, { value: 'XAY_LAP', label: 'Xây lắp' }, { value: 'TU_VAN', label: 'Tư vấn' },
    { value: 'PHI_TU_VAN', label: 'Phi tư vấn' }, { value: 'HON_HOP', label: 'Hỗn hợp' }];
  /* T17 (D-30, P-84): căn cứ đầu vào của luồng mua sắm = tệp đính kèm vào ĐXMS / hồ sơ, mỗi tệp một loại; loại Bắt buộc thiếu thì không Lưu được. */
  /* T67 H1 — thuộc tính mẫu hợp đồng (BM-HD-2026, tên tệp mẫu ghi phương thức thanh toán TT10_30_60 / TT10_90 / TT100). */
  const MAU_GROUP = [['DAY_DU', 'HĐ đầy đủ'], ['DON_GIAN', 'HĐ đơn giản'], ['KHUNG', 'Thỏa thuận khung'], ['QUOC_TE', 'HĐ quốc tế']].map(([value, label]) => ({ value, label }));
  const MAU_FIELD = [['HANG_HOA', 'Hàng hóa'], ['PHI_TU_VAN', 'Phi tư vấn'], ['TU_VAN', 'Tư vấn']].map(([value, label]) => ({ value, label }));
  const MAU_NATURE = [['SAN_CO', 'Sẵn có'], ['THEO_YC', 'Theo yêu cầu'], ['PM', 'Phần mềm – license'], ['KAD', 'Không áp dụng']].map(([value, label]) => ({ value, label }));
  const MAU_TT = ['10 / 30 / 60', '10 / 90', '100'].map((v) => ({ value: v, label: v }));
  const MAU_LANG = [['VI', 'Tiếng Việt'], ['EN', 'Tiếng Anh']].map(([value, label]) => ({ value, label }));
  const YES_NO = [{ value: 'CO', label: 'Có' }, { value: 'KHONG', label: 'Không' }];
  const MAU_SEED = [
    ['1.0', 'HĐ hàng hóa sẵn có', 'DAY_DU', 'HANG_HOA', 'SAN_CO', 'KHONG', '10 / 30 / 60', 'Mau 1.0_Mau HD hang hoa san co (TT10_30_60).docx'],
    ['1.1', 'HĐ hàng hóa sẵn có', 'DAY_DU', 'HANG_HOA', 'SAN_CO', 'KHONG', '10 / 90', 'Mau 1.1_Mau HD hang hoa san co (TT10_90).docx'],
    ['1.2', 'HĐ hàng hóa sẵn có', 'DAY_DU', 'HANG_HOA', 'SAN_CO', 'KHONG', '100', 'Mau 1.2_Mau HD hang hoa san co (TT100).docx'],
    ['1.3', 'HĐ hàng hóa theo yêu cầu', 'DAY_DU', 'HANG_HOA', 'THEO_YC', 'KHONG', '10 / 30 / 60', 'Mau 1.3_Mau HD hang hoa theo yeu cau (TT10_30_60).docx'],
    ['1.4', 'HĐ hàng hóa theo yêu cầu', 'DAY_DU', 'HANG_HOA', 'THEO_YC', 'KHONG', '10 / 90', 'Mau 1.4_Mau HD hang hoa theo yeu cau (TT10_90).docx'],
    ['1.5', 'HĐ hàng hóa theo yêu cầu', 'DAY_DU', 'HANG_HOA', 'THEO_YC', 'KHONG', '100', 'Mau 1.5_Mau HD hang hoa theo yeu cau (TT100).docx'],
    ['1.6', 'HĐ hàng hóa sẵn có và dịch vụ', 'DAY_DU', 'HANG_HOA', 'SAN_CO', 'CO', '10 / 30 / 60', 'Mau 1.6_Mau HD hang hoa san co va dich vu (TT10_30_60).docx'],
    ['1.7', 'HĐ hàng hóa theo yêu cầu và dịch vụ', 'DAY_DU', 'HANG_HOA', 'THEO_YC', 'CO', '10 / 30 / 60', 'Mau 1.7_Mau HD hang hoa theo yeu cau va dich vu (TT10_30_60).docx'],
    ['1.8', 'HĐ hàng hóa phần mềm / license phần mềm', 'DAY_DU', 'HANG_HOA', 'PM', 'KHONG', '10 / 90', 'Mau 1.8_Mau HD hang hoa PM_License PM (TT10_90).docx'],
    ['2', 'Thỏa thuận khung hàng hóa', 'KHUNG', 'HANG_HOA', 'KAD', 'KHONG', '10 / 30 / 60', 'Mau 2_Mau Thoa thuan khung hang hoa (TT10-30-60).docx'],
    ['3.0', 'HĐ dịch vụ phi tư vấn', 'DAY_DU', 'PHI_TU_VAN', 'KAD', 'CO', '10 / 90', 'Mau 3.0_Mau HD dich vu phi tu van (TT 10_90).docx'],
    ['3.1', 'HĐ dịch vụ phi tư vấn — vận chuyển', 'DAY_DU', 'PHI_TU_VAN', 'KAD', 'CO', '10 / 90', 'Mau 3.1_Mau HD dich vu phi tu van_Van chuyen (TT 10_90).docx'],
    ['3.2', 'HĐ dịch vụ phi tư vấn — đào tạo', 'DAY_DU', 'PHI_TU_VAN', 'KAD', 'CO', '10 / 90', 'Mau 3.2_Mau HD dich vu phi tu van_Dao tao (TT 10_90).docx'],
    ['4', 'Thỏa thuận khung phi tư vấn', 'KHUNG', 'PHI_TU_VAN', 'KAD', 'CO', '10 / 90', 'Mau 4_Mau Thoa thuan khung Phi tu van (TT10_90).docx'],
    ['5', 'HĐ dịch vụ tư vấn', 'DAY_DU', 'TU_VAN', 'KAD', 'CO', '10 / 90', 'Mau 5_Mau HD dich vu tu van (TT 10_90).docx'],
    ['6', 'Thỏa thuận khung tư vấn', 'KHUNG', 'TU_VAN', 'KAD', 'CO', '10 / 90', 'Mau 6_Mau Thoa thuan khung tu van (TT-90).docx'],
    ['7.0', 'HĐ hàng hóa đơn giản sẵn có', 'DON_GIAN', 'HANG_HOA', 'SAN_CO', 'KHONG', '10 / 30 / 60', 'Mau 7.0_Mau HD hang hoa don gian san co (TT10_30_60).docx'],
    ['7.1', 'HĐ hàng hóa đơn giản sẵn có', 'DON_GIAN', 'HANG_HOA', 'SAN_CO', 'KHONG', '10 / 90', 'Mau 7.1_Mau HD hang hoa don gian san co (TT10_90).docx'],
    ['7.2', 'HĐ hàng hóa đơn giản sẵn có', 'DON_GIAN', 'HANG_HOA', 'SAN_CO', 'KHONG', '100', 'Mau 7.2_Mau HD hang hoa don gian san co (TT100).docx'],
    ['7.3', 'HĐ hàng hóa đơn giản theo yêu cầu', 'DON_GIAN', 'HANG_HOA', 'THEO_YC', 'KHONG', '10 / 30 / 60', 'Mau 7.3_Mau HD hang hoa don gian theo yeu cau (TT10_30_60).docx'],
    ['7.4', 'HĐ hàng hóa đơn giản theo yêu cầu', 'DON_GIAN', 'HANG_HOA', 'THEO_YC', 'KHONG', '10 / 90', 'Mau 7.4_Mau HD hang hoa don gian theo yeu cau (TT10_90).docx'],
    ['7.5', 'HĐ hàng hóa đơn giản theo yêu cầu', 'DON_GIAN', 'HANG_HOA', 'THEO_YC', 'KHONG', '100', 'Mau 7.5_Mau HD hang hoa don gian theo yeu cau (TT100).docx'],
    ['7.6', 'HĐ hàng hóa đơn giản sẵn có và dịch vụ', 'DON_GIAN', 'HANG_HOA', 'SAN_CO', 'CO', '10 / 30 / 60', 'Mau 7.6_Mau HD hang hoa don gian san co va dich vu (TT10_30_60).docx'],
    ['7.7', 'HĐ hàng hóa đơn giản theo yêu cầu và dịch vụ', 'DON_GIAN', 'HANG_HOA', 'THEO_YC', 'CO', '10 / 30 / 60', 'Mau 7.7_Mau HD hang hoa don gian theo yeu cau va dich vu (TT10_30_60).docx'],
    ['7.8', 'HĐ hàng hóa đơn giản phần mềm / license phần mềm', 'DON_GIAN', 'HANG_HOA', 'PM', 'KHONG', '10 / 90', 'Mau 7.8_Mau HD hang hoa don gian_Phan mem_License PM (TT10_90).docx'],
    ['8.0', 'HĐ dịch vụ phi tư vấn đơn giản', 'DON_GIAN', 'PHI_TU_VAN', 'KAD', 'CO', '10 / 90', 'Mau 8.0_Mau HD dich vu phi tu van don gian (TT10_90).docx'],
    ['8.1', 'HĐ dịch vụ phi tư vấn đơn giản — vận chuyển', 'DON_GIAN', 'PHI_TU_VAN', 'KAD', 'CO', '10 / 90', 'Mau 8.1_Mau HD dich vu phi tu van don gian_Van chuyen (TT10_90).docx'],
    ['8.2', 'HĐ dịch vụ phi tư vấn đơn giản — đào tạo', 'DON_GIAN', 'PHI_TU_VAN', 'KAD', 'CO', '10 / 90', 'Mau 8.2_Mau HD dich vu phi tu van don gian_Dao tao (TT 10_90).docx'],
    ['9', 'HĐ quốc tế dịch vụ', 'QUOC_TE', 'PHI_TU_VAN', 'KAD', 'CO', '10 / 90', 'Mau 9_HD Quoc te_dich vu.docx', 'Tên tệp không ghi phương thức thanh toán — theo nội dung mẫu'],
    ['10', 'HĐ quốc tế hàng hóa — mua sắm thường xuyên', 'QUOC_TE', 'HANG_HOA', 'SAN_CO', 'KHONG', '10 / 30 / 60', 'Mau 10 - HD quoc te_Hang hoa_MSTX.docx', 'Tên tệp không ghi phương thức thanh toán — theo nội dung mẫu'],
  ].map(([code, name, group, field, nature, svc, tt, file, desc]) => [code, name, desc || '', true, 0, { group, field, nature, svc, tt, lang: group === 'QUOC_TE' ? 'EN' : 'VI', file }]);
  const BASIS_SCOPE = [{ value: 'DXMS', label: 'ĐXMS' }, { value: 'PD', label: 'Hồ sơ Phê duyệt' }, { value: 'DC', label: 'Hồ sơ Điều chỉnh' }];
  const REQUIRED = [{ value: 'CO', label: 'Bắt buộc' }, { value: 'KHONG', label: 'Không bắt buộc' }];
  const B1_CATALOGS = {
    'loai-doi-tac': { key: 'loai-doi-tac', scr: 'SCR-67', title: 'Loại đối tác', entity: 'loại đối tác', icon: 'doi_tac', roles: ['lan'], built: true,
      use: 'Phân loại đối tác trong danh mục Nhà cung cấp / Nhà thầu, lọc đối tác khi gửi yêu cầu báo giá, lựa chọn nhà thầu và hợp đồng.',
      fields: [F.code('Mã loại đối tác'), F.name('Tên loại đối tác', 260), F.desc()],
      seed: [
        ['NCC', 'Nhà cung cấp hàng hoá', 'Cung cấp thiết bị, vật tư, linh kiện', true, 12],
        ['NHA_THAU', 'Nhà thầu xây lắp, lắp đặt', '', true, 3],
        ['TU_VAN', 'Đơn vị tư vấn', 'Tư vấn lập dự án, thiết kế, thẩm tra, giám sát', true, 2],
        ['DICH_VU', 'Nhà cung cấp dịch vụ', 'Dịch vụ phi tư vấn: vận chuyển, bảo trì, đào tạo', true, 1],
        ['CHIEN_LUOC', 'Đối tác chiến lược', 'Đối tác có thoả thuận hợp tác dài hạn với VHT', true, 0],
        ['NOI_BO', 'Đơn vị trong Tập đoàn', '', false, 0],
      ] },
    'don-vi-tinh': { key: 'don-vi-tinh', scr: 'SCR-68', title: 'Đơn vị tính', entity: 'đơn vị tính', icon: 'view_grid', roles: ['lan'], built: true,
      use: 'Đơn vị tính của hạng mục ĐXMS / KĐT, yêu cầu báo giá, gói thầu và hợp đồng.',
      fields: [F.code('Mã đơn vị tính'), F.name('Tên đơn vị tính', 220),
        { key: 'group', label: 'Nhóm', type: 'select', required: true, options: UOM_GROUP, width: 140 }, F.desc()],
      seed: [
        ['BO', 'Bộ', '', true, 9, { group: 'SO_LUONG' }],
        ['CAI', 'Cái', '', true, 6, { group: 'SO_LUONG' }],
        ['CHIEC', 'Chiếc', '', true, 4, { group: 'SO_LUONG' }],
        ['HE_THONG', 'Hệ thống', 'Thiết bị gồm nhiều thành phần lắp đặt đồng bộ', true, 5, { group: 'SO_LUONG' }],
        ['GOI', 'Gói', 'Dịch vụ, bản quyền theo gói', true, 7, { group: 'SO_LUONG' }],
        ['BAN_QUYEN', 'Bản quyền', 'License phần mềm', true, 2, { group: 'SO_LUONG' }],
        ['MET', 'Mét', '', true, 1, { group: 'DO_LUONG' }],
        ['KG', 'Kilôgam', '', true, 0, { group: 'DO_LUONG' }],
        ['THANG', 'Tháng', 'Dịch vụ thuê theo tháng', true, 1, { group: 'THOI_GIAN' }],
        ['NGUOI_THANG', 'Người-tháng', 'Dịch vụ tư vấn tính theo nhân công', false, 0, { group: 'THOI_GIAN' }],
      ] },
    'tien-te': { key: 'tien-te', scr: 'SCR-69', title: 'Tiền tệ', entity: 'tiền tệ', icon: 'nguon_kinh_phi', roles: ['lan'], built: true,
      use: 'Loại tiền của báo giá, giá gói thầu và giá hợp đồng; quy đổi về VNĐ khi tổng hợp giá trị.',
      fields: [{ key: 'code', label: 'Mã tiền tệ', type: 'code', required: true, max: 3, width: 120, placeholder: 'Mã ISO 4217, vd USD' },
        F.name('Tên tiền tệ', 220), { key: 'symbol', label: 'Ký hiệu', type: 'text', required: true, max: 10, width: 100 },
        { key: 'decimals', label: 'Số chữ số thập phân', type: 'select', required: true, options: DECIMALS, width: 170 }, F.desc()],
      seed: [
        ['VND', 'Việt Nam đồng', 'Đồng tiền hạch toán', true, 15, { symbol: '₫', decimals: '0' }],
        ['USD', 'Đô la Mỹ', '', true, 4, { symbol: '$', decimals: '2' }],
        ['EUR', 'Euro', '', true, 1, { symbol: '€', decimals: '2' }],
        ['JPY', 'Yên Nhật', '', true, 0, { symbol: '¥', decimals: '0' }],
        ['KRW', 'Won Hàn Quốc', '', true, 0, { symbol: '₩', decimals: '0' }],
        ['CNY', 'Nhân dân tệ', '', false, 0, { symbol: 'CN¥', decimals: '2' }],
      ] },
    'loai-goi-thau': { key: 'loai-goi-thau', scr: 'SCR-70', title: 'Loại gói thầu', entity: 'loại gói thầu', icon: 'menu_square', built: true,
      use: 'Phân loại gói thầu trong Kế hoạch lựa chọn nhà thầu và tổ chức lựa chọn nhà thầu.',
      fields: [F.code('Mã loại gói thầu'), F.name('Tên loại gói thầu', 260),
        { key: 'field', label: 'Lĩnh vực đấu thầu', type: 'select', required: true, options: PKG_FIELD, width: 160 }, F.desc()],
      seed: [
        ['MS_HH', 'Mua sắm hàng hoá', 'Thiết bị, vật tư, linh kiện', true, 6, { field: 'HANG_HOA' }],
        ['XL', 'Xây lắp', 'Xây dựng, lắp đặt công trình', true, 0, { field: 'XAY_LAP' }],
        ['TV', 'Dịch vụ tư vấn', '', true, 2, { field: 'TU_VAN' }],
        ['PTV', 'Dịch vụ phi tư vấn', 'Vận chuyển, bảo trì, đào tạo', true, 1, { field: 'PHI_TU_VAN' }],
        ['HH_LD', 'Cung cấp và lắp đặt thiết bị', 'Gói hỗn hợp hàng hoá và xây lắp', true, 1, { field: 'HON_HOP' }],
        ['PM', 'Mua sắm phần mềm, bản quyền', '', true, 1, { field: 'HANG_HOA' }],
      ] },
    'phuong-phap-danh-gia': { key: 'phuong-phap-danh-gia', scr: 'SCR-71', title: 'Phương pháp đánh giá', entity: 'phương pháp đánh giá', icon: 'linh_vuc', built: true,
      use: 'Phương pháp đánh giá hồ sơ dự thầu trong hồ sơ mời thầu và đánh giá, xếp hạng nhà thầu.',
      fields: [F.code('Mã phương pháp'), F.name('Tên phương pháp', 280),
        { key: 'group', label: 'Bước đánh giá', type: 'select', required: true, options: EVAL_GROUP, width: 170 }, F.desc()],
      seed: [
        ['DAT_KHONG_DAT', 'Đạt / Không đạt', 'Đánh giá năng lực, kỹ thuật theo tiêu chí Đạt / Không đạt', true, 5, { group: 'KY_THUAT' }],
        ['CHAM_DIEM', 'Chấm điểm', 'Đánh giá kỹ thuật theo thang điểm, có điểm tối thiểu', true, 2, { group: 'KY_THUAT' }],
        ['GIA_THAP_NHAT', 'Giá thấp nhất', '', true, 4, { group: 'TONG_HOP' }],
        ['GIA_DANH_GIA', 'Giá đánh giá', 'Quy đổi các yếu tố kỹ thuật, tài chính về cùng mặt bằng giá', true, 1, { group: 'TONG_HOP' }],
        ['KET_HOP', 'Kết hợp giữa kỹ thuật và giá', 'Thường dùng cho gói tư vấn', true, 1, { group: 'TONG_HOP' }],
        ['DUA_TREN_KT', 'Dựa trên kỹ thuật', 'Gói tư vấn có yêu cầu kỹ thuật cao', true, 0, { group: 'TONG_HOP' }],
        ['SO_SANH_GIA', 'So sánh giá chào', 'Đối chiếu đơn giá chào với giá gói thầu, cơ sở giá', true, 0, { group: 'TAI_CHINH' }],
      ] },
    'hinh-thuc-bao-dam': { key: 'hinh-thuc-bao-dam', scr: 'SCR-72', title: 'Hình thức bảo đảm', entity: 'hình thức bảo đảm', icon: 'chuc_danh_khoa_hoc', built: true,
      use: 'Bảo đảm dự thầu (hồ sơ mời thầu) và bảo đảm thực hiện, tạm ứng, bảo hành của hợp đồng.',
      fields: [F.code('Mã hình thức bảo đảm'), F.name('Tên hình thức bảo đảm', 260),
        { key: 'scope', label: 'Áp dụng cho', type: 'select', multi: true, required: true, options: GUAR_USE, minWidth: 260 }, F.desc()],
      seed: [
        ['BL_NH', 'Thư bảo lãnh của ngân hàng', 'Do tổ chức tín dụng hoạt động tại Việt Nam phát hành', true, 6, { scope: ['DU_THAU', 'THUC_HIEN', 'TAM_UNG', 'BAO_HANH'] }],
        ['BH_BL', 'Chứng thư bảo hiểm bảo lãnh', 'Do doanh nghiệp bảo hiểm phi nhân thọ phát hành', true, 1, { scope: ['DU_THAU', 'THUC_HIEN'] }],
        ['DAT_COC', 'Đặt cọc', '', true, 0, { scope: ['DU_THAU'] }],
        ['KY_QUY', 'Ký quỹ', '', true, 0, { scope: ['DU_THAU', 'THUC_HIEN'] }],
        ['GIU_LAI', 'Giữ lại một phần giá trị thanh toán', 'Thay cho bảo đảm bảo hành khi hợp đồng cho phép', false, 0, { scope: ['BAO_HANH'] }],
      ] },
  };

  const CATALOGS = [
    Object.assign({ key: 'nha-cung-cap', scr: 'SCR-31', title: 'Nhà cung cấp / Nhà thầu', entity: 'nhà cung cấp', icon: 'doi_tac', roles: ['lan'], built: true,
      use: 'Chọn nhà cung cấp nhận yêu cầu báo giá (lọc theo ngành hàng), bảng báo giá và cơ sở giá; sau này lựa chọn nhà thầu và hợp đồng.' }, NCC),
    B1_CATALOGS['loai-doi-tac'],
    { key: 'loai-hang-hoa', scr: 'SCR-36', title: 'Loại hàng hoá / dịch vụ', entity: 'loại hàng hoá, dịch vụ', icon: 'view_grid', roles: ['lan'], built: true,
      use: 'Ngành hàng của nhà cung cấp; lọc nhà cung cấp khi gửi yêu cầu báo giá. Bốn ngành hàng đầu theo biểu mẫu import ngành hàng MS27.01.',
      fields: [F.code('Mã loại hàng hoá, dịch vụ'), F.name('Tên loại hàng hoá, dịch vụ', 300),
        { key: 'group', label: 'Nhóm', type: 'select', required: true, options: GOODS_GROUP, width: 140 }, F.desc()],
      seed: [
        ['VTCNTT', 'Viễn thông - CNTT', 'Thiết bị viễn thông, máy chủ, phần mềm', true, 7, { group: 'HANG_HOA' }],
        ['PTVT_TBQL', 'Phương tiện vận tải - Thiết bị dụng cụ quản lý', '', true, 2, { group: 'HANG_HOA' }],
        ['NCSX', 'Nghiên cứu sản xuất', 'Vật tư, linh kiện phục vụ nghiên cứu sản xuất', true, 5, { group: 'HANG_HOA' }],
        ['HHKD', 'Hàng hoá kinh doanh', '', true, 0, { group: 'HANG_HOA' }],
        ['DVTV', 'Dịch vụ tư vấn', 'Tư vấn lập dự án, thiết kế, thẩm tra, giám sát', true, 1, { group: 'DICH_VU' }],
        ['DVPTV', 'Dịch vụ phi tư vấn', 'Vận chuyển, lắp đặt, bảo trì, đào tạo', true, 0, { group: 'DICH_VU' }],
      ] },
    B1_CATALOGS['don-vi-tinh'],
    B1_CATALOGS['tien-te'],
    { key: 'nguon-von', scr: 'SCR-32', title: 'Nguồn vốn', entity: 'nguồn vốn', icon: 'nguon_kinh_phi', built: true,
      fields: [
        { key: 'code', label: 'Mã nguồn vốn', type: 'code', required: true, max: 50, width: 220 },
        { key: 'name', label: 'Tên nguồn vốn', type: 'name', required: true, max: 255, minWidth: 320 },
        { key: 'description', label: 'Mô tả', type: 'textarea', max: 500, minWidth: 260 },
      ],
      seed: [
        ['KHCN', 'Quỹ phát triển khoa học công nghệ', 'Quỹ phát triển khoa học và công nghệ của VHT', true, 14],
        ['DTPT', 'Đầu tư phát triển', 'Nguồn vốn đầu tư phát triển theo kế hoạch năm', true, 6],
        ['SXKD', 'Chi phí sản xuất kinh doanh', 'Vốn sản xuất kinh doanh', true, 0],
        ['VCSH', 'Vốn góp của chủ sở hữu', 'Theo danh sách nguồn vốn của hệ thống mua sắm hiện hành', true, 0],
        ['CPTX', 'Chi phí thường xuyên', 'Chi phí hoạt động thường xuyên của đơn vị', true, 3],
        ['VAY', 'Vốn vay', '', false, 0],
      ] },
    { key: 'linh-vuc', scr: 'SCR-33', title: 'Lĩnh vực đầu tư', entity: 'lĩnh vực đầu tư', icon: 'linh_vuc', built: true,
      use: 'Phân luồng khoản đầu tư; điều kiện của Ngưỡng phân luồng.',
      fields: [F.code('Mã lĩnh vực'), F.name('Tên lĩnh vực'), F.desc()],
      seed: [
        ['VTCNTT', 'Viễn thông - CNTT', 'Hạ tầng viễn thông, công nghệ thông tin, chuyển đổi số', true, 9],
        ['QP', 'Quốc phòng', 'Khoản đầu tư phục vụ nhiệm vụ quốc phòng', true, 1],
        ['BDS', 'Bất động sản', 'Đất đai, nhà xưởng, công trình xây dựng', true, 0],
        ['KHAC', 'Lĩnh vực khác', 'Các lĩnh vực không thuộc nhóm trên', true, 2],
      ] },
    { key: 'loai-kdt', scr: 'SCR-34', title: 'Loại khoản đầu tư', entity: 'loại khoản đầu tư', icon: 'view_flow', built: true, q: ['P-29', 'P-68'],
      use: 'Phân luồng và báo cáo khoản đầu tư. Sáu loại theo QT-8.6.5 (định nghĩa KĐT). Cấp xử lý "Luôn cấp Tập đoàn" được ưu tiên hơn Ngưỡng phân luồng (P-29).',
      fields: [F.code('Mã loại khoản đầu tư'), F.name('Tên loại khoản đầu tư', 260),
        { key: 'level', label: 'Cấp xử lý', type: 'select', required: true, options: PROC_LEVEL, width: 180 }, F.desc()],
      seed: [
        ['KHCN', 'Khoa học công nghệ', 'Nhiệm vụ, đề tài, dự án khoa học công nghệ', true, 12, { level: 'THEO_NGUONG' }],
        ['TBNB', 'Trang bị nội bộ', 'Máy móc, thiết bị phục vụ hoạt động nội bộ', true, 4, { level: 'THEO_NGUONG' }],
        ['SXKD', 'Kinh doanh', 'Sản xuất kinh doanh: luôn xử lý ở cấp Tập đoàn (BB-1509 §2.5)', true, 0, { level: 'TAP_DOAN' }],
        ['BDS', 'Bất động sản', 'Luôn là KĐT phức tạp, không phân cấp cho đơn vị (QT-8.6.5)', true, 0, { level: 'TAP_DOAN' }],
        ['PTVT', 'Phương tiện vận tải', 'Xe, phương tiện vận chuyển', true, 1, { level: 'THEO_NGUONG' }],
        ['KHAC', 'Khác', '', true, 0, { level: 'THEO_NGUONG' }],
      ] },
    /* Rà tìm kiếm nâng cao Đề tài / dự án 11/11/2026 (SRS-DADT DTMS_CN_0240 ô 2, 9, 10; mục 2.2): ba danh mục chưa có trong ecat common-catalog
       bản 10/11/2026 — dựng theo cùng khuôn (mã, tên, mô tả, trạng thái). Giá trị theo HT-DXMS-NOTE màn 1, IA-DXMS dòng 2–3, TPL-DADT-IM List. */
    { key: 'cap-phe-duyet', scr: 'SCR-110', title: 'Cấp phê duyệt đề tài / dự án', entity: 'cấp phê duyệt', icon: 'view_flow', built: true,
      use: 'Ô Cấp phê duyệt của đề tài / dự án; lọc Danh sách đề tài / dự án.',
      fields: [F.code('Mã cấp phê duyệt'), F.name('Tên cấp phê duyệt'), F.desc()],
      seed: [
        ['TCT', 'Tổng Công ty', 'Đề tài / dự án do Tổng Công ty phê duyệt', true, 9],
        ['TD', 'Tập đoàn', 'Đề tài / dự án do Tập đoàn phê duyệt', true, 3],
      ] },
    { key: 'loai-dadt', scr: 'SCR-111', title: 'Loại dự án / đề tài', entity: 'loại dự án / đề tài', icon: 'view_flow', built: true, q: ['DTMS_Q_0405'],
      use: 'Loại của đề tài / dự án; Loại cha của Loại dự án (chi tiết); lọc Danh sách đề tài / dự án. Sáu giá trị theo HT-DXMS-NOTE màn 1 (mẫu nhập chỉ có 4 — DTMS_Q_0405).',
      fields: [F.code('Mã loại'), F.name('Tên loại'), F.desc()],
      seed: [
        ['SXKD', 'SXKD', 'Sản xuất kinh doanh', true, 4],
        ['DADT', 'Dự án đầu tư', '', true, 1],
        ['KHCN', 'KHCN', 'Khoa học công nghệ (nhiệm vụ KHCN, đồng bộ từ phân hệ KHCN)', true, 6],
        ['HDTX', 'Hoạt động TX', 'Hoạt động thường xuyên', true, 1],
        ['DADT_KHAC', 'Dự án đầu tư khác', '', true, 0],
        ['DAKD_KHAC', 'Dự án kinh doanh khác', '', true, 0],
      ] },
    { key: 'loai-dadt-ct', scr: 'SCR-112', title: 'Loại dự án (chi tiết)', entity: 'loại dự án (chi tiết)', icon: 'view_flow', built: true, q: ['DTMS_Q_0406', 'P-198'],
      use: 'Loại dự án (chi tiết) theo Loại cha; ô lọc Loại chi tiết hiện theo các Loại đã chọn. KHCN theo HT-DXMS-NOTE màn 4; Loại cha của nhóm khác GIẢ LẬP P-198 (DTMS_Q_0406).',
      fields: [F.code('Mã loại chi tiết'), F.name('Tên loại chi tiết', 300),
        { key: 'parent', label: 'Loại dự án / đề tài', type: 'select', searchable: true, width: 200,
          options: (cur, all) => rows(byKey('loai-dadt')).filter((r) => all || r.active || r.name === cur).map((r) => ({ value: r.name, label: r.name })) }, F.desc()],
      seed: [
        ['DT_KHCN', 'Đề tài KHCN', '', true, 3, { parent: 'KHCN' }], ['NC_THAM_DO', 'Nghiên cứu thăm dò', '', true, 0, { parent: 'KHCN' }],
        ['DA_SXTN', 'Dự án SX thử nghiệm', '', true, 0, { parent: 'KHCN' }], ['HT_KHCN_KHAC', 'Hình thức nghiên cứu KHCN khác', '', true, 0, { parent: 'KHCN' }],
        ['DA_KHCN', 'Dự án KHCN', '', true, 1, { parent: 'KHCN' }], ['DE_AN_KH', 'Đề án khoa học', '', true, 0, { parent: 'KHCN' }],
        ['CT_KHCN', 'Chương trình KHCN', '', true, 1, { parent: 'KHCN' }],
        ['THUONG_XUYEN', 'Thường xuyên', '', true, 1, { parent: 'Hoạt động TX' }],
        ['DA_KD', 'Dự án Kinh doanh', '', true, 3, { parent: 'SXKD' }], ['DA_SX', 'Dự án sản xuất', '', true, 1, { parent: 'SXKD' }],
        ['CT_NOI_BO', 'Chương trình nội bộ', '', true, 0, { parent: 'SXKD' }],
        ['DT_MSTS', 'Dự án đầu tư mua sắm tài sản', '', true, 1, { parent: 'Dự án đầu tư' }],
        ['DT_XD_KDTN', 'Dự án đầu tư xây dựng Kinh doanh thử nghiệm', '', true, 0, { parent: 'Dự án đầu tư' }],
        ['HO_TRO_KHCN', 'Hỗ trợ KHCN', 'Chưa xếp Loại cha (DTMS_Q_0406): chỉ hiện ở ô lọc khi chưa chọn Loại', true, 0, { parent: '' }],
      ] },
    { key: 'tinh-chat-tai-san', scr: 'SCR-35', title: 'Tính chất tài sản hình thành', entity: 'tính chất tài sản', icon: 'phan_he_hang_hoa', built: true,
      use: 'Chọn mẫu biểu và phân luồng; điều kiện của Ngưỡng phân luồng.',
      fields: [F.code('Mã tính chất tài sản'), F.name('Tên tính chất tài sản', 320), F.desc()],
      seed: [
        ['NGUYEN_CHIEC', 'Nguyên chiếc', 'Tài sản dùng được ngay khi bàn giao', true, 8],
        ['TICH_HOP', 'Cần tích hợp hệ thống trước khi sử dụng', 'Tài sản phải lắp đặt, tích hợp với hệ thống hiện có', true, 3],
      ] },
    B1_CATALOGS['loai-goi-thau'],
    { key: 'hinh-thuc-lcnt', scr: 'SCR-37', title: 'Hình thức lựa chọn nhà thầu', entity: 'hình thức lựa chọn nhà thầu', icon: 'chuc_danh_khoa_hoc', built: true,
      use: 'Kế hoạch lựa chọn nhà thầu. Hình thức theo QC-12869 Điều 12–21; chỉ định thầu tách trình tự rút gọn / thông thường (Điều 16 khoản 3) → 11 dòng như BR-16. Tên viết tắt theo khuôn Chức danh khoa học của ecat.',
      fields: [F.code('Mã hình thức'), F.name('Tên hình thức', 260),
        { key: 'abbreviation', label: 'Tên viết tắt', type: 'abbr', required: true, max: 100, width: 140 }, F.desc()],
      seed: [
        ['DTRR', 'Đấu thầu rộng rãi', '', true, 3, { abbreviation: 'ĐTRR' }],
        ['DTHC', 'Đấu thầu hạn chế', '', true, 0, { abbreviation: 'ĐTHC' }],
        ['CGTT', 'Chào giá trực tuyến', '', true, 1, { abbreviation: 'CGTT' }],
        ['MSTT', 'Mua sắm trực tiếp', '', true, 0, { abbreviation: 'MSTT' }],
        ['CDT_RG', 'Chỉ định thầu rút gọn', '', true, 4, { abbreviation: 'CĐT RG' }],
        ['CDT_TT', 'Chỉ định thầu thông thường', '', true, 1, { abbreviation: 'CĐT TT' }],
        ['DPTT', 'Đàm phán trực tiếp', '', true, 0, { abbreviation: 'ĐPTT' }],
        ['DAT_HANG', 'Đặt hàng', '', true, 0, { abbreviation: 'ĐH' }],
        ['GIAO_NV', 'Giao nhiệm vụ', '', true, 0, { abbreviation: 'GNV' }],
        ['TU_TH', 'Tự thực hiện', '', true, 0, { abbreviation: 'TTH' }],
        ['DAC_BIET', 'Trường hợp đặc biệt', '', true, 0, { abbreviation: 'THĐB' }],
      ] },
    { key: 'phuong-thuc-lcnt', scr: 'SCR-38', title: 'Phương thức lựa chọn nhà thầu', entity: 'phương thức lựa chọn nhà thầu', icon: 'phan_he_quy_trinh', built: true, q: ['P-35'],
      use: 'Kế hoạch lựa chọn nhà thầu. Danh sách theo QC-12869 Điều 11: chỉ có hai phương thức một giai đoạn (P-35).',
      fields: [F.code('Mã phương thức'), F.name('Tên phương thức', 300), F.desc()],
      seed: [
        ['1GD1T', 'Một giai đoạn một túi hồ sơ', '', true, 5],
        ['1GD2T', 'Một giai đoạn hai túi hồ sơ', 'Hồ sơ đề xuất kỹ thuật và tài chính nộp riêng', true, 1],
      ] },
    B1_CATALOGS['phuong-phap-danh-gia'],
    { key: 'loai-hop-dong', scr: 'SCR-39', title: 'Loại hợp đồng', entity: 'loại hợp đồng', icon: 'menu_square', built: true, q: ['P-35'],
      use: 'Hợp đồng (phân hệ chưa dựng). Tám loại theo QC-12869 Điều 43 khoản 2, hướng dẫn tại Phụ lục 3 (P-35).',
      fields: [F.code('Mã loại hợp đồng'), F.name('Tên loại hợp đồng'), F.desc()],
      seed: [
        ['TRON_GOI', 'Trọn gói', 'Giá hợp đồng không đổi trong suốt thời gian thực hiện', true, 6],
        ['DG_CD', 'Theo đơn giá cố định', '', true, 1],
        ['DG_DC', 'Theo đơn giá điều chỉnh', '', true, 0],
        ['THOI_GIAN', 'Theo thời gian', 'Thường dùng cho dịch vụ tư vấn', true, 0],
        ['CP_CONG_PHI', 'Theo chi phí cộng phí', 'Thường dùng khi khẩn cấp, sửa chữa chưa xác định được khối lượng', true, 0],
        ['KET_QUA', 'Theo kết quả đầu ra', '', true, 0],
        ['TY_LE', 'Theo tỷ lệ phần trăm', '', true, 0],
        ['HON_HOP', 'Hỗn hợp', 'Kết hợp các loại trên; ghi rõ phạm vi áp dụng từng loại', true, 0],
      ] },
    /* T67 H1 (T66 L1, H-Q3 = A) — Mẫu hợp đồng: 30 mẫu BM-HD-2026 (bản T7/2026). Thật: BE doc-templates thêm cột thuộc tính, FE quản trị khuôn catalog-list
       (cần dev nhỏ: doc-templates chưa có màn quản trị). Khi nạp mẫu đổi cú pháp trường trộn <so_hop_dong> → {{hd.so_hop_dong}} (TemplatePlaceholderFormatter). */
    { key: 'mau-hop-dong', scr: 'SCR-103', title: 'Mẫu hợp đồng', entity: 'mẫu hợp đồng', icon: 'menu_square', built: true, q: ['P-236'],
      use: 'Hồ sơ mời thầu / hồ sơ yêu cầu của gói thầu (MS19 bước lập HSMT / HSYC) — MS22 bước 3 đọc lại mẫu; kế hoạch thanh toán của hợp đồng sinh theo phương thức của mẫu.',
      fields: [F.code('Mã mẫu', 120), F.name('Tên mẫu', 300),
        { key: 'group', label: 'Nhóm mẫu', type: 'select', required: true, options: MAU_GROUP, width: 170 },
        { key: 'field', label: 'Lĩnh vực', type: 'select', required: true, options: MAU_FIELD, width: 140 },
        { key: 'nature', label: 'Tính chất hàng hóa', type: 'select', required: true, options: MAU_NATURE, width: 180 },
        { key: 'svc', label: 'Kèm dịch vụ', type: 'select', required: true, options: YES_NO, width: 120 },
        { key: 'tt', label: 'Phương thức thanh toán', type: 'select', required: true, options: MAU_TT, width: 190 },
        { key: 'lang', label: 'Ngôn ngữ', type: 'select', required: true, options: MAU_LANG, width: 120 },
        { key: 'file', label: 'Tệp mẫu', type: 'text', max: 255, minWidth: 260 }, F.desc()],
      seed: MAU_SEED },
    B1_CATALOGS['hinh-thuc-bao-dam'],
    { key: 'loai-tai-lieu-can-cu', scr: 'SCR-99', title: 'Loại tài liệu căn cứ', entity: 'loại tài liệu căn cứ', icon: 'menu_square', built: true, q: ['P-84'],
      use: 'Căn cứ đầu vào của luồng mua sắm (T17): mỗi tệp đính kèm vào ĐXMS / hồ sơ chọn một loại; loại Bắt buộc của ĐXMS và hồ sơ Phê duyệt phải có khi Tạo luồng.',
      fields: [F.code('Mã loại tài liệu'), F.name('Tên loại tài liệu căn cứ', 300),
        { key: 'scope', label: 'Áp dụng cho', type: 'select', multi: true, required: true, options: BASIS_SCOPE, minWidth: 220 },
        { key: 'req', label: 'Bắt buộc', type: 'select', required: true, options: REQUIRED, width: 150 }, F.desc()],
      seed: [
        ['QD_NV', 'QĐ giao nhiệm vụ / phê duyệt đề tài, dự án', 'Văn bản phê duyệt nhiệm vụ KHCN, dự án SXKD hoặc PAKD làm căn cứ mua sắm', true, 6, { scope: ['DXMS'], req: 'CO' }],
        ['KH_NAM', 'Kế hoạch mua sắm năm được duyệt', 'Kế hoạch mua sắm / kế hoạch SXKD năm có hạng mục của luồng', true, 6, { scope: ['DXMS'], req: 'CO' }],
        ['CHU_TRUONG', 'Chủ trương đầu tư', '', true, 1, { scope: ['DXMS', 'PD'], req: 'KHONG' }],
        ['CHI_DAO', 'Văn bản chỉ đạo', 'Ý kiến chỉ đạo của lãnh đạo VHT / Tập đoàn', true, 2, { scope: ['DXMS', 'PD', 'DC'], req: 'KHONG' }],
        ['BIEN_BAN', 'Biên bản làm việc', '', true, 1, { scope: ['DXMS', 'PD', 'DC'], req: 'KHONG' }],
        ['BAO_GIA', 'Báo giá / khảo sát giá', 'Báo giá sơ bộ có trước khi tạo hồ sơ', true, 3, { scope: ['PD', 'DC'], req: 'KHONG' }],
        ['QD_DC', 'Văn bản đề nghị điều chỉnh', '', true, 0, { scope: ['DC'], req: 'CO' }],
        ['KHAC', 'Khác', '', true, 0, { scope: ['DXMS', 'PD', 'DC'], req: 'KHONG' }],
      ] },
    Object.assign({ key: 'nguong-phan-luong', scr: 'SCR-40', title: 'Ngưỡng phân luồng', entity: 'ngưỡng phân luồng', icon: 'danh_muc_dung_chung', built: true }, TH),
    Object.assign({ key: 'phan-cap-tham-quyen', scr: 'SCR-100', title: 'Phân cấp thẩm quyền KĐT', entity: 'quy tắc phân cấp thẩm quyền', icon: 'view_flow', built: true, q: ['P-90'],
      use: 'Bước 13 "Xác định thẩm quyền phê duyệt" của MS13 (BPMN 12/10) đọc bảng này theo loại KĐT, lĩnh vực và tổng mức vốn thực tế để ghi cấp duyệt chủ trương / KĐT; cổng cấp duyệt trước trình ký tính lại (D-33).' }, PC),
    /* T71 S0 (D-121): danh mục riêng phân hệ Quản lý sản xuất (SX-13, khai báo ở sx-data.js) — nhóm riêng trên sidebar. */
    ...(D.sxCatalogs || []),
  ];
  const byKey = (k) => CATALOGS.find((c) => c.key === k);
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  /* ---------- Dữ liệu: mẫu + thay đổi người dùng (lưu localStorage, độc lập với luồng hồ sơ) ---------- */
  let DATA = {};
  try { DATA = JSON.parse(localStorage.getItem(STORE) || '{}'); } catch (e) { DATA = {}; }
  function rows(c) {
    if (c.key === 'nguong-phan-luong' && DATA[c.key] && staleTH(DATA[c.key])) delete DATA[c.key];
    if (!DATA[c.key]) DATA[c.key] = c.seedRows ? c.seedRows() : c.seed.map(([code, name, description, active, used, extra], i) => Object.assign({ id: i + 1, code, name, description, active, used }, extra));
    return DATA[c.key];
  }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(DATA)); } catch (e) { /* bỏ qua */ } }
  /* Công cụ demo › Khôi phục dữ liệu mẫu: bỏ mọi thay đổi, các danh mục lấy lại dữ liệu mẫu khi mở lần sau. */
  function reset() { DATA = {}; try { localStorage.removeItem(STORE); } catch (e) { /* bỏ qua */ } }
  /* Bản ghi đang hoạt động — nguồn cho ô chọn ở luồng nghiệp vụ. */
  const activeOptions = (key) => rows(byKey(key)).filter((r) => r.active).map((r) => ({ value: r.code, label: r.name }));
  /* Nối vào luồng MS01 (§5.4, §6): ngưỡng ĐXMS đang hoạt động, đã có hiệu lực ở ngày `date` (mặc định hôm nay), thay D.dxmsRules mặc định;
     tên, loại tiền của nhà cung cấp theo mã (D.quotes). */
  D.dxmsRules = (date) => rows(byKey('nguong-phan-luong')).filter((r) => r.group === 'DXMS' && r.active && dateKey(r.eff) <= dateKey(date || today()))
    .sort((a, b) => a.from - b.from).map((r) => ({ from: r.from, to: r.to, procs: r.procs.slice() }));
  /* Ngưỡng KĐT (cổng "Tổng mức vốn thực tế thuộc MS13?" — plan KĐT §6 #1): lĩnh vực, tính chất tài sản, khoảng giá trị → nhóm. */
  D.kdtRules = (date) => rows(byKey('nguong-phan-luong')).filter((r) => r.group === 'KDT' && r.active && dateKey(r.eff) <= dateKey(date || today()))
    .sort((a, b) => a.from - b.from).map((r) => ({ field: r.field, asset: r.asset, from: r.from, to: r.to, procs: r.procs.slice() }));
  /* Phân cấp thẩm quyền KĐT (bước 13, D-33): quy tắc đang hoạt động của SCR-100 thay bảng mặc định. */
  D.kdtAuthRules = () => rows(byKey('phan-cap-tham-quyen')).filter((r) => r.active)
    .map((r) => ({ type: r.type, field: r.field, from: r.from, to: r.to, ct: r.ct, kdt: r.kdt, basis: r.basis }));
  /* Tên Nguồn vốn theo danh mục SCR-32 (trước: bảng tên viết cứng trong data.js, lệch mã với danh mục — rà 11/11/2026). */
  D.fundNames = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? (rows(byKey('nguon-von')).find((r) => r.code === k) || {}).name : undefined) });
  /* T67 H1: tra mẫu hợp đồng theo mã (MS19 lập HSMT, MS22 bước 3, Chi tiết gói thầu / hợp đồng). */
  D.mauOf = (code) => rows(byKey('mau-hop-dong')).find((r) => r.code === code) || null;
  const nccDefault = D.nccOf;
  D.nccOf = (code) => rows(byKey('nha-cung-cap')).find((r) => r.code === code) || nccDefault(code);

  /* ---------- SCR-30 Tổng quan ---------- */
  const ARROW = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20 12H4M15.5 16.5S20 13.186 20 12s-4.5-4.5-4.5-4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const canSee = (key) => { const p = Flow.state.persona, c = byKey(key); return !!c && (p === 'qt' || D.allAccess(p) || (c.roles || []).includes(p)); };
  const visible = () => CATALOGS.filter((c) => canSee(c.key));
  /* Sidebar phân hệ Danh mục dùng chung (D-42): danh mục chung nối sau các mục sẵn có, danh mục riêng ĐTMS vào nhóm Đầu tư mua sắm (P-112). */
  const COMMON = ['nha-cung-cap', 'loai-doi-tac', 'nguon-von', 'linh-vuc', 'don-vi-tinh', 'tien-te'];
  const dtmsGroup = D.dmdcMenu.pop();
  const SX_KEYS = (D.sxCatalogs || []).map((c) => c.key);
  const sub = (c) => ({ label: c.title, path: 'dmdc/' + c.key, scr: c.scr, dmdc: c.key });
  dtmsGroup.children = CATALOGS.filter((c) => !COMMON.includes(c.key) && !SX_KEYS.includes(c.key)).map(sub);
  /* T71 S0 (D-121): nhóm danh mục riêng phân hệ Quản lý sản xuất, như nhóm Đầu tư mua sắm. */
  const sxGroup = { label: 'Quản lý sản xuất', icon: 'phan_he_hang_hoa', dmdcGroup: true, children: CATALOGS.filter((c) => SX_KEYS.includes(c.key)).map(sub) };
  D.dmdcMenu.push(...CATALOGS.filter((c) => COMMON.includes(c.key)).map((c) => ({ label: c.title, icon: c.icon, path: 'dmdc/' + c.key, scr: c.scr, dmdc: c.key })), dtmsGroup,
    ...(sxGroup.children.length ? [sxGroup] : []));

  function overview() {
    // Theo: fe/repo-khcn-ecat-fe/src/app/features/common-catalog/overview/common-catalog-overview.component.html
    const info = {
      scr: 'SCR-30', name: 'Tổng quan Danh mục dùng chung', uc: 'UC-12-05 · UR-DOC-05, UR-DOC-06, BR-04',
      notes: [
        'Vị trí (D-42, thay D-14; team BA 30/10/2026): Danh mục dùng chung là <b>phân hệ của toàn hệ thống</b> như ecat common-catalog, vào từ Danh sách Phân hệ; sidebar riêng gồm Tổng quan, Quản lý E-form, danh mục chung và nhóm danh mục Đầu tư mua sắm. Căn cứ: CN sheet "WBS pha 1" mục 1.0 để Danh mục dùng chung là module riêng.',
        'Menu con và ô trên Tổng quan cùng lọc theo vai (P-36).',
        'Ô lọc theo vai (P-36): Quản trị hệ thống thấy mọi danh mục; Chuyên viên TTMS thấy Nhà cung cấp / Nhà thầu và Loại hàng hoá / dịch vụ; vai khác thấy thông báo chưa được cấp quyền.',
        'Đã dựng 16 danh mục: 10 danh mục SCR-31…40 và 6 danh mục thêm theo Backlog W1_T10 (T16 B1): Loại đối tác, Đơn vị tính, Tiền tệ, Loại gói thầu, Phương pháp đánh giá, Hình thức bảo đảm (SCR-67…72). Ngưỡng phân luồng là bảng quy tắc, dùng cùng khuôn danh sách.',
        'Thứ tự menu và ô theo Backlog; Nhà cung cấp / Nhà thầu, Nguồn vốn, Lĩnh vực đầu tư, Ngưỡng phân luồng không có trong Backlog nhưng luồng MS01 / MS13 đang dùng nên giữ. Backlog ghi "Tính chất KĐT" = danh mục Tính chất tài sản hình thành.',
      ],
      q: ['P-36', 'P-27', 'P-112'], src: 'ecat common-catalog/overview · /common-catalog',
    };
    const cards = visible();
    const tile = (c) => `<a class="ov-tile" href="#/dmdc/${c.key}" data-go="dmdc/${c.key}">
        <span class="ov-ic">${icon(c.icon)}</span>
        <span class="ov-tx"><span class="t">Danh mục ${esc(c.title)}</span><span class="d">Quản lý danh sách ${esc(c.entity)}.</span></span>
        <span class="ov-n"><span class="n">${c.built ? rows(c).length : c.count}</span>${ARROW}</span></a>`;
    return `<div class="ov"><div class="ov-card">
      <h3 class="ov-title">Các module trong phân hệ${infoBtn(info)}</h3>
      ${cards.length ? `<div class="ov-grid">${cards.map(tile).join('')}</div>` : '<p class="ov-empty">Bạn chưa được cấp quyền truy cập module nào trong phân hệ này</p>'}
    </div></div>`;
  }

  /* ---------- SCR-31…39 Danh sách một danh mục (catalog-list) ---------- */
  const LS = {};
  const ADV0 = () => ({ code: '', name: '', tax: '', kind: null, country: null, goods: null, st: null });
  const ls = (k) => (LS[k] = LS[k] || { kw: '', kwInput: '', st: null, page: 1, size: 10, psOpen: false, advOpen: false, adv: ADV0(), draft: ADV0() });
  const STATUS = [{ value: 'ACTIVE', label: 'Đang hoạt động' }, { value: 'INACTIVE', label: 'Dừng hoạt động' }];

  function filtered(c) {
    const s = ls(c.key), a = s.adv;
    const has = (v, q) => !q || norm(v).includes(norm(q));
    const out = rows(c).filter((r) => has(c.searchText ? c.searchText(r) : [r.code, r.name, r.tax].join(' '), s.kw)
      && (!s.st || r.active === (s.st === 'ACTIVE'))
      && has(r.code, a.code) && has(r.name, a.name) && has(r.tax, a.tax)
      && (!a.kind || r.kind === a.kind) && (!a.country || r.country === a.country) && (!a.goods || (r.goods || []).includes(a.goods)));
    return c.order ? out.slice().sort(c.order) : out;
  }

  /* Tìm kiếm nâng cao (catalog-filter khi hasAdvancedFilter, như màn Đối tác của ecat): ô tìm nhanh và khung nâng cao loại trừ nhau;
     đóng/mở chỉ đổi ô hiển thị, danh sách giữ kết quả lần tìm gần nhất. */
  function advFilter(c) {
    const s = ls(c.key), d = s.draft;
    const toggle = `<button type="button" class="vbtn ${s.advOpen ? 'active' : 'secondary'} sm" data-adv-toggle>${s.advOpen ? 'Ẩn tìm kiếm nâng cao' : 'Tìm kiếm nâng cao'}</button>`;
    const quick = s.advOpen ? '' : `<label class="vsearch h36 w320">${icon('search')}<input data-cat-kw="${c.key}" maxlength="255" placeholder="${esc(c.kwPlaceholder)}" value="${esc(s.kwInput)}"></label>`;
    const fld = (label, ctl) => `<div class="vfield"><div class="lr"><label>${label}</label></div>${ctl}</div>`;
    const txt = (k, ph) => `<input class="vctl" data-adv="${k}" maxlength="255" placeholder="${ph}" value="${esc(d[k])}">`;
    const sel = (k, options, ph, searchable) => vSelect({ id: 'adv-' + k, options, value: d[k], placeholder: ph, clear: true, searchable,
      onChange: (v) => { d[k] = v; rerender(); } });
    const panel = !s.advOpen ? '' : `<form class="adv-panel" data-adv-form>
        <div class="adv-grid">${fld('Mã nhà cung cấp', txt('code', 'Nhập mã nhà cung cấp'))}${fld('Tên nhà cung cấp', txt('name', 'Nhập tên nhà cung cấp'))}
          ${fld('Mã số thuế', txt('tax', 'Nhập mã số thuế'))}${fld('Phân loại', sel('kind', KIND, 'Chọn phân loại'))}
          ${fld('Quốc gia', sel('country', COUNTRY, 'Chọn quốc gia', true))}${fld('Ngành hàng', sel('goods', goodsOptions(null, true), 'Chọn ngành hàng', true))}
          ${fld('Trạng thái', sel('st', STATUS, 'Tất cả trạng thái'))}</div>
        <div class="adv-acts"><button type="button" class="vbtn secondary sm" data-adv-reset>Làm mới</button><button type="submit" class="vbtn primary sm">Tìm kiếm</button></div></form>`;
    return `<div class="cat-filter">${quick}${toggle}</div>${panel}`;
  }

  /* Lựa chọn của trường select: mảng cố định hoặc hàm (giá trị đang giữ, lấy cả bản ghi dừng hoạt động). */
  const optsOf = (f, cur, all, vals) => (typeof f.options === 'function' ? f.options(cur, all, vals) : f.options);
  const labelOf = (f, v) => {
    const o = optsOf(f, null, true);
    return f.multi ? (v || []).map((x) => (o.find((y) => y.value === x) || {}).label).filter(Boolean).join(', ') : (o.find((y) => y.value === v) || {}).label;
  };

  function nccInfo(c) {
    return {
      scr: c.scr, name: 'Danh sách nhà cung cấp', uc: 'UC-12-05 · UR-DOC-05, UR-PRE-21/22, BR-08, BR-16',
      notes: [
        'ĐTMS giữ danh sách gốc, không đồng bộ SAP/Ariba; nhà cung cấp không đăng nhập hệ thống, mọi yêu cầu báo giá gửi qua email — vì vậy Email nhận yêu cầu báo giá là bắt buộc (chốt 28/09/2026).',
        'Khuôn chung ecat, khác: hộp thoại vht-modal lg 720px lưới 2 cột; tìm kiếm nâng cao như màn Đối tác của ecat; nút Nhập từ Excel dùng vht-import-dialog (2 bước: chọn file → kết quả kiểm tra từng dòng → Xác nhận nhập).',
        'Mã nhà cung cấp do hệ thống tự sinh NCC-000123 (P-30); mã số thuế là khoá chống trùng.',
        'Bấm Mã nhà cung cấp mở hộp thoại Xem chi tiết (chỉ xem, nút Đóng / Chỉnh sửa).',
        'Trong nước: Mã số thuế bắt buộc, 10 số hoặc 10 số-3 số (chi nhánh), Quốc gia khoá ở Việt Nam. Nước ngoài: mã định danh nước sở tại tuỳ chọn, nhập tự do (P-32).',
        'Nới khuôn của ecat: Tên nhận thêm & . , ( ) cho tên doanh nghiệp; Số điện thoại nhận +, số, khoảng trắng, 8–20 ký tự (số bàn, số nước ngoài).',
        'Ngành hàng lấy từ danh mục Loại hàng hoá / dịch vụ, dùng để lọc nhà cung cấp khi gửi yêu cầu báo giá (task 09).',
        'Cột Tình trạng chỉ hiển thị; đưa vào/gỡ khỏi danh sách cấm là việc của phân hệ Lựa chọn nhà thầu (UC-09-08, chưa dựng).',
        '<b>T80 L7</b> (Danh mục Đối tác hệ thống cũ — HT-THAU-VID §5): Người đại diện, Chức vụ (mặc định "Giám đốc" như hệ thống cũ), Số đăng ký kinh doanh, Ngày thành lập, Tài khoản ngân hàng, Fax. Người đại diện / chức vụ là thông tin nhà thầu ở biên bản thương thảo, hợp đồng.',
        '<b>Nhà thầu liên danh</b> (QC-12869 Điều 24 khoản 4): chọn Có thì chọn Thành viên liên danh (ít nhất 02, từ chính danh mục, không chọn nhà thầu liên danh khác) và Thành viên đứng đầu (trong số thành viên); liên danh không bắt buộc mã số thuế riêng. Thỏa thuận liên danh (trách nhiệm từng thành viên) gắn theo hồ sơ dự thầu, không lưu ở danh mục.',
        'Không có ở vòng này: hồ sơ năng lực, đánh giá nhà cung cấp (P-31).',
        'NCC Alpha, Beta, Gamma là 3 nhà cung cấp của luồng MS01 (đang dùng, không xoá được — P-33). Dữ liệu mẫu; thay đổi được lưu trên trình duyệt.',
      ],
      q: ['P-30', 'P-32', 'P-31', 'P-33', 'P-27'], src: 'ecat common-catalog/base/catalog-list (partner) · @khcn-core/ui vht-import-dialog',
    };
  }

  function thInfo(c) {
    return {
      scr: c.scr, name: 'Danh sách ngưỡng phân luồng', uc: 'UC-12-05 · UR-DOC-06, UR-KDT-02, UR-KDT-07, BR-04',
      notes: [
        'Bảng quy tắc (nhóm quy trình, lĩnh vực, tính chất tài sản, khoảng giá trị) → quy trình áp dụng; thay cho ngưỡng 160 tỷ viết cứng. UR-DOC-06: ngưỡng phân luồng phải cấu hình được. Source KHCN có mẫu tương tự: sys_config.TASK_LEVEL (min_budget/max_budget).',
        'Khuôn chung ecat (danh sách + hộp thoại 520px), không có Mã/Tên. Khoảng giá trị tính theo tỷ đồng, gồm "Giá trị từ", không gồm "Đến dưới"; để trống "Đến dưới" = không giới hạn. Trên bảng, hai trường gộp thành cột "Khoảng giá trị" để 7 cột vừa màn 1440.',
        'Khi Lưu: hai ngưỡng đang hoạt động cùng nhóm quy trình không được có khoảng giá trị giao nhau nếu lĩnh vực và tính chất tài sản trùng nhau ("Tất cả" trùng với mọi giá trị). Lỗi hiện dưới "Giá trị từ". Kích hoạt lại ngưỡng đã dừng cũng kiểm tra như vậy.',
        'Khoản đầu tư gộp MS13 và MS14 làm một nhóm để kiểm tra chồng khoảng giữa hai quy trình (tài liệu chuẩn bị ghi 2 nhóm).',
        'Bảng không có Mã: bấm Nhóm quy trình mở hộp thoại Xem chi tiết (chỉ xem, nút Đóng / Chỉnh sửa).',
        'Hiệu lực từ ngày (P-34): hồ sơ đã tạo giữ ngưỡng tại thời điểm tạo; ngưỡng mới chỉ áp dụng cho hồ sơ tạo từ ngày hiệu lực. Đổi điều kiện hoặc quy trình thì ngày hiệu lực không được trước ngày hiện tại. Ngày hiệu lực ở tương lai hiện nhãn "Chưa hiệu lực"; prototype chưa giữ bản cũ cho giai đoạn chờ.',
        'Đề xuất mua sắm (T29 B1, D-54): MS01 một quy trình; dòng ngưỡng trỏ tới luồng con — dưới 160 tỷ → MS01.03; từ 160 tỷ → MS01.01 hoặc MS01.02, chọn theo "Căn cứ đã được phê duyệt" và lựa chọn ở bước 48 chứ không theo ngưỡng. Loại khoản đầu tư có Cấp xử lý "Luôn cấp Tập đoàn" (Kinh doanh, Bất động sản) được ưu tiên hơn bảng ngưỡng (P-29).',
        'Ngưỡng MS13/MS14 theo QT-8.6.5 (trường hợp 1, 2): Viễn thông - CNTT dưới 160 tỷ / 160 – dưới 1.000 tỷ; lĩnh vực khác (trừ KĐT bất động sản) dưới 90 tỷ / 90 – dưới 500 tỷ. Khớp BB-2409; BB-1509 ghi ngược (P-28). Trên mức đó và KĐT bất động sản là KĐT phức tạp (MS15, Pha 2) — chưa có dòng ngưỡng. Lĩnh vực Quốc phòng thuộc "lĩnh vực khác" nhưng chưa có dòng ngưỡng riêng (P-67).',
        'Khoản đầu tư: MS13 là <b>một</b> quy trình (trang MS13), áp cho mọi tính chất tài sản. Nhánh gộp BM-00 (Nguyên chiếc + Trang bị nội bộ) hay hai giai đoạn BM-01 → BM-03 do cổng trong BPMN chọn sau khi TTMS xác nhận 04 yếu tố, không do bảng ngưỡng. Hệ thống xác định nhóm KĐT theo ngưỡng này sau bước 12 (D-7).',
        'Ngưỡng của Đề xuất mua sắm đang được hồ sơ dùng: không xoá được, chỉ Dừng hoạt động (P-33). Dữ liệu mẫu; thay đổi được lưu trên trình duyệt.',
        'Dùng ở: luồng con dự kiến khi Thêm mới luồng / hồ sơ (theo Giá trị dự kiến), cảnh báo mềm ở task 04, cổng "Giá trị?" sau task 10 (đặt luồng con theo Tổng giá trị). Hồ sơ giữ ngưỡng tại lúc tạo (P-34); tên luồng con (vd "Phê duyệt ĐXMS ≥ 160 tỷ") không đổi theo ngưỡng.',
      ],
      q: ['P-28', 'P-67', 'P-34', 'P-29', 'P-33', 'P-27'], src: 'ecat common-catalog/base/catalog-list · khcn sys_config.TASK_LEVEL',
    };
  }

  function list(key) {
    // Theo: fe/repo-khcn-ecat-fe/src/app/features/common-catalog/base/catalog-list.component.html
    //       + utils/common-catalog.utils.ts buildCatalogListColumns (Thao tác 80 → Trạng thái 136 → các trường)
    //       + constants/common-catalog.constants.ts FUNDING_SOURCE_CONFIG (độ rộng, maxLength)
    const c = byKey(key);
    if (!c) return window.Screens.viecCuaToi();
    if (!c.built) return window.Screens.phanHe({ label: 'Danh mục ' + c.title, uc: ['UC-12-05'] }, { ph: '12' });
    if (!canSee(key)) return `<div class="pg"><div class="pg-head"><div class="l"><h1 class="pg-title">Danh sách ${esc(c.entity)}</h1></div></div>
      <div class="vcard pad24"><p class="ov-empty">Bạn chưa được cấp quyền truy cập chức năng này</p></div></div>`;
    const s = ls(key);
    const all = filtered(c);
    const pages = Math.max(1, Math.ceil(all.length / s.size));
    if (s.page > pages) s.page = pages;
    const from = (s.page - 1) * s.size;
    const cols = c.columns || c.fields;
    const th = (f) => `<th class="${f.cls || ''}" style="${f.width ? `width:${f.width}px;min-width:${f.width}px;max-width:${f.width}px` : `min-width:${f.minWidth || 180}px`}">${esc(f.label)}</th>`;
    /* Cột đầu (Mã) là link đỏ mở hộp thoại Xem chi tiết (Backlog "Xem chi tiết", B5); Ngưỡng không có Mã → link ở cột Nhóm quy trình. */
    const td = (f, r) => {
      if (f === cols[0]) return `<td><a class="link" data-cat-view="${r.id}">${f.render ? f.render(r) : esc(f.type === 'select' ? labelOf(f, r[f.key]) : r[f.key])}</a></td>`;
      if (f.render) return `<td class="${f.cls || ''}">${f.render(r)}</td>`;
      const v = f.type === 'select' ? labelOf(f, r[f.key]) : r[f.key];
      if (!v) return '<td><span class="dash">-</span></td>';
      return `<td><span class="${f.type === 'textarea' || f.type === 'name' || f.multi ? 'clamp' : 'one'}">${esc(v)}</span></td>`;
    };
    const body = all.slice(from, from + s.size).map((r, i) => `<tr data-id="${r.id}">
      <td class="ord">${from + i + 1}</td>
      <td class="c"><div class="acts">
        <button type="button" class="cat-ic" data-cat-edit="${r.id}" title="Chỉnh sửa" aria-label="Chỉnh sửa">${icon('edit')}</button><span class="sep"></span>
        <button type="button" class="cat-ic del" data-cat-del="${r.id}" title="Xoá" aria-label="Xoá">${icon('del')}</button></div></td>
      <td class="c"><button type="button" class="vswitch ${r.active ? 'on' : ''}" role="switch" aria-checked="${r.active}" data-cat-tg="${r.id}"
        title="${r.active ? 'Dừng hoạt động' : 'Kích hoạt'}" aria-label="${r.active ? 'Dừng hoạt động' : 'Kích hoạt'}"><span></span></button></td>
      ${cols.map((f) => td(f, r)).join('')}</tr>`).join('');
    const info = c.key === 'nha-cung-cap' ? nccInfo(c) : c.key === 'nguong-phan-luong' ? thInfo(c) : {
      scr: c.scr, name: 'Danh sách ' + c.entity, uc: 'UC-12-05 · UR-DOC-05, BR-04',
      notes: [
        'Khuôn chung theo ecat common-catalog: Thêm mới / Chỉnh sửa là hộp thoại vht-modal 520px — ngoại lệ so với rule B6 (trang riêng) vì màn tương đương trong ecat dùng hộp thoại.',
        'Vị trí (D-42): mỗi danh mục có dòng riêng trên sidebar của phân hệ Danh mục dùng chung, như ecat; vì vậy không có nút quay lại. Vai không được xem danh mục (P-36) thấy thông báo chưa được cấp quyền.',
        'Lọc Trạng thái áp ngay khi chọn; ô tìm kiếm (mã hoặc tên) áp khi nhấn Enter. Phân trang 10 / 25 / 50 như ecat.',
        'Xem chi tiết (Backlog): bấm Mã mở cùng hộp thoại ở chế độ chỉ xem, nút Đóng / Chỉnh sửa. ecat chưa có chế độ này — làm theo mode view của display-rule-form (FE thêm tham số mode cho catalog-form-dialog, BE dùng API lấy chi tiết sẵn có).',
        'Mã: chữ không dấu, số, "-", "_"; dấu và khoảng trắng tự bỏ, tự viết hoa; không sửa được khi Chỉnh sửa; không trùng. Tên: chữ, số, khoảng trắng, "-".',
        'Bản ghi đang được hồ sơ dùng (vd Vốn KHCN) không xoá được, chỉ Dừng hoạt động (P-33). Bản ghi dừng hoạt động không hiện trong ô chọn ở luồng nghiệp vụ.',
        ...(c.use ? ['Dùng ở: ' + c.use] : []),
        'Dữ liệu mẫu; danh sách thật chờ VHT gửi (P-27). Thay đổi được lưu trên trình duyệt.',
      ],
      q: ['P-27', 'P-33'].concat(c.q || []), src: 'ecat common-catalog/base/catalog-list · /common-catalog/funding-source',
    };
    return `<div class="pg">
      <div class="pg-head"><div class="l"><h1 class="pg-title">Danh sách ${esc(c.entity)}${infoBtn(info)}</h1></div>
        <div class="r">${c.importable ? `<button class="vbtn secondary" data-cat-import>${icon('upload')} Nhập từ Excel</button>` : ''}<button class="vbtn primary" data-cat-new="${key}">${icon('add')} Thêm mới</button></div></div>
      <div class="vcard">
        ${c.advanced ? advFilter(c) : `<div class="cat-filter">
          <div class="cat-st">${vSelect({ id: 'cat-st-' + key, options: STATUS, value: s.st, placeholder: 'Trạng thái', clear: true,
            onChange: (v) => { s.st = v; s.kw = s.kwInput.trim(); s.page = 1; rerender(); } })}</div>
          <label class="vsearch h36">${icon('search')}<input data-cat-kw="${key}" maxlength="255" placeholder="${esc(c.kwPlaceholder || `Tìm kiếm theo mã ${c.entity}, tên ${c.entity}`)}" value="${esc(s.kwInput)}"></label>
        </div>`}
        <div class="vtable-vp"><table class="vtable cat"><thead><tr><th class="ord">STT</th>
          <th class="c" style="width:80px;min-width:80px">Thao tác</th><th class="c" style="width:136px;min-width:136px">Trạng thái</th>${cols.map(th).join('')}</tr></thead>
          <tbody>${body || `<tr><td class="vtable-empty" colspan="${cols.length + 3}"><img src="assets/empty-table.svg" alt="">Chưa có dữ liệu</td></tr>`}</tbody></table></div>
        ${pager({ id: 'cat-' + key, total: all.length, page: s.page, size: s.size, open: s.psOpen, sizes: [10, 25, 50] })}
      </div></div>`;
  }

  /* ---------- Hộp thoại Thêm mới / Chỉnh sửa (catalog-form-dialog trong vht-modal 520) ---------- */
  const CODE_RE = /^[a-zA-Z0-9_-]+$/;
  const NAME_RE = /^[\p{Script=Latin}\p{Mark}0-9\s-]+$/u;
  const ABBR_RE = /^[\p{Script=Latin}\p{Mark}0-9._\s-]+$/u;
  /* ecatCatalogTextFilter chế độ mã: bỏ dấu, bỏ khoảng trắng, viết hoa. */
  const codeFilter = (v) => v.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/\s+/g, '').toUpperCase();

  /* Nhà cung cấp (§4.2): tên doanh nghiệp nới khuôn tên của ecat; MST Việt Nam 10 số hoặc 10 số-3 số; SĐT nới khuôn di động 10 số. */
  const ORG_RE = /^[\p{Script=Latin}\p{Mark}0-9\s\-&.,()]+$/u;
  const TAX_VN_RE = /^\d{10}(-\d{3})?$/;
  const EMAIL_RE = /^[^\s@;]+@[^\s@;]+\.[^\s@;]+$/;
  const PHONE_RE = /^\+?[0-9 ]{8,20}$/;
  /* Ngưỡng (§5.2): số tỷ đồng kiểu Việt Nam — dấu chấm phân nhóm nghìn, dấu phẩy thập phân, tối đa 2 chữ số lẻ. */
  const NUM_RE = /^(\d{1,3}(\.\d{3})+|\d+)(,\d{1,2})?$/;
  const parseNum = (v) => (v === '' || v == null ? null : Number(String(v).replace(/\./g, '').replace(',', '.')));
  const CAL = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 2v2M6 2v2M11.996 13h.008M11.996 17h.008M15.991 13H16M8 13h.009M8 17h.009M3.5 8h17M2.5 12.243c0-4.357 0-6.536 1.252-7.89C5.004 3 7.02 3 11.05 3h1.9c4.03 0 6.046 0 7.298 1.354C21.5 5.707 21.5 7.886 21.5 12.244v.513c0 4.357 0 6.536-1.252 7.89C18.996 22 16.98 22 12.95 22h-1.9c-4.03 0-6.046 0-7.298-1.354C2.5 19.293 2.5 17.114 2.5 12.756v-.513ZM3 8h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const DATE_RE = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const isDate = (v) => { const m = DATE_RE.exec(v); if (!m) return false; const d = new Date(+m[3], m[2] - 1, +m[1]); return d.getDate() === +m[1] && d.getMonth() === m[2] - 1; };

  /* vals: giá trị hiện tại của cả hộp thoại (quy tắc phụ thuộc Phân loại). */
  const isReq = (f, vals) => (typeof f.required === 'function' ? f.required(vals) : !!f.required);
  function fieldError(f, v, vals) {
    const empty = Array.isArray(v) ? !v.length : !v;
    const bad = `${f.label} không đúng định dạng.`;
    if (isReq(f, vals || {}) && empty) return `Bạn cần ${f.type === 'select' ? 'chọn' : 'nhập'} ${f.label}.`;
    if (empty) return '';
    if (f.type === 'code' && !CODE_RE.test(v)) return bad;
    if (f.type === 'name' && !NAME_RE.test(v)) return bad;
    if (f.type === 'abbr' && !ABBR_RE.test(v)) return bad;
    if (f.type === 'orgname' && !ORG_RE.test(v)) return bad;
    if (f.type === 'tax' && (vals || {}).kind !== 'NN' && !TAX_VN_RE.test(v)) return bad;
    if (f.type === 'email' && !EMAIL_RE.test(v)) return bad;
    if (f.type === 'emails' && !v.split(';').map((x) => x.trim()).filter(Boolean).every((x) => EMAIL_RE.test(x))) return bad;
    if (f.type === 'phone' && !PHONE_RE.test(v)) return bad;
    if (f.type === 'num' && !NUM_RE.test(v)) return bad;
    if (f.type === 'date' && !isDate(v)) return bad;
    return '';
  }

  /* view: chế độ Xem chi tiết — cùng hộp thoại, mọi trường khoá, nút Đóng + Chỉnh sửa (ecat chưa có; theo mode view của display-rule-form). */
  function openForm(c, row, view) {
    /* Trường select: vht-select; searchable / multi theo cấu hình (Quốc gia, Ngành hàng của Nhà cung cấp). */
    const sel = {};
    const fields = c.fields.filter((f) => f.type !== 'blank');
    const vals = () => { const o = {}; fields.forEach((f) => { o[f.key] = valueOf(f); }); return o; };
    const selHtml = (f, invalid) => vSelect({ id: 'cf-' + f.key, options: optsOf(f, sel[f.key], false, sel), value: sel[f.key], multi: f.multi, searchable: f.searchable,
      placeholder: view ? '' : 'Chọn ' + f.label.toLowerCase(), invalid, disabled: view || (f.locked && f.locked(sel)),
      onChange: (v) => { sel[f.key] = v; if (f.onChange) { f.onChange(v, sel); sync(f.key); } check(f); } });
    const ctl = (f) => {
      if (f.type === 'select') { sel[f.key] = row ? row[f.key] : f.default || (f.multi ? [] : null); return `<div data-cf="${f.key}">${selHtml(f)}</div>`; }
      const raw = row ? row[f.key] : typeof f.default === 'function' ? f.default() : f.default;
      const v = esc(f.type === 'num' ? fmtNum(raw) : raw || '');
      const dis = view || f.type === 'auto' || (row && f.type === 'code') ? 'disabled' : '';
      const ph = f.placeholder && !view ? `placeholder="${esc(f.placeholder)}"` : '';
      if (f.type === 'textarea') return `<textarea class="vctl ta" data-cf="${f.key}" maxlength="${f.max}" rows="3" ${dis}>${v}</textarea>`;
      // vht-calendar: ô nhập DD/MM/YYYY + icon lịch bên phải (mở bộ chọn ngày của trình duyệt).
      if (f.type === 'date') return `<div class="vdate"><input class="vctl" data-cf="${f.key}" maxlength="10" inputmode="numeric" placeholder="DD/MM/YYYY" value="${v}" ${dis}>
          <button type="button" class="vdate-ic" data-date-pick tabindex="-1" aria-label="Chọn ngày">${CAL}</button><input type="date" class="vdate-native" tabindex="-1" aria-hidden="true" style="position:absolute;right:10px;bottom:0;width:1px;height:1px;opacity:0;border:0;padding:0;pointer-events:none"></div>`;
      return `<input class="vctl" data-cf="${f.key}" ${f.max ? `maxlength="${f.max}"` : ''} ${f.type === 'num' ? 'inputmode="decimal"' : ''} value="${v}" ${ph} ${dis}>`;
    };
    const lg = c.formSize === 'lg';
    const m = vModal({
      title: (view ? 'Xem chi tiết ' : row ? 'Chỉnh sửa ' : 'Thêm mới ') + c.entity, size: lg ? 'lg' : 'w520',
      body: `<form class="cat-form ${lg || c.formGrid ? 'g2' : ''}" novalidate>${c.fields.map((f) => (f.type === 'blank' ? '<div class="g2-blank"></div>' : `<div class="vfield ${f.span === 2 ? 'span2' : ''}" data-ff="${f.key}">
          <div class="lr"><label>${esc(f.label)}</label><span class="req" ${!view && isReq(f, row || {}) ? '' : 'hidden'}>*</span></div>${ctl(f)}<p class="msg" hidden></p></div>`)).join('')}</form>`,
      actions: view ? '<button class="vbtn secondary" data-close>Đóng</button><button class="vbtn primary" id="cat-edit">Chỉnh sửa</button>'
        : '<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="cat-save">Lưu</button>',
    });
    if (view) {
      m.el.querySelector('#cat-edit').onclick = () => { m.close(); openForm(c, row); };
      return;
    }
    const el = (k) => m.el.querySelector(`[data-cf="${k}"]`);
    const wrap = (f) => m.el.querySelector(`[data-ff="${f.key}"]`);
    const show = (f, err) => {
      const w = wrap(f);
      w.classList.toggle('invalid', !!err);
      if (f.type === 'select') el(f.key).innerHTML = selHtml(f, !!err);
      else el(f.key).setAttribute('aria-invalid', err ? 'true' : 'false');
      const msg = w.querySelector('.msg'); msg.hidden = !err; msg.textContent = err;
    };
    const valueOf = (f) => (f.type === 'select' ? sel[f.key] || (f.multi ? [] : '') : f.type === 'auto' ? '' : el(f.key).value.trim());
    const check = (f) => { if (f.type === 'auto') return true; const err = fieldError(f, valueOf(f), vals()); show(f, err); return !err; };
    /* Đổi Phân loại: cập nhật dấu *, khoá Quốc gia; trường đang báo lỗi được kiểm tra lại theo quy tắc mới. */
    /* T80 L7: vẽ lại mọi ô chọn trừ ô vừa đổi (ô có onChange khác cũng có thể phụ thuộc — vd Thành viên liên danh theo Nhà thầu liên danh). */
    const sync = (except) => {
      const v = vals();
      fields.forEach((f) => {
        const w = wrap(f);
        w.querySelector('.req').hidden = !isReq(f, v);
        if (f.type === 'select' && f.key !== except) el(f.key).innerHTML = selHtml(f, w.classList.contains('invalid'));
        if (w.classList.contains('invalid')) check(f);
      });
    };
    fields.forEach((f) => {
      if (f.type === 'select' || f.type === 'auto') return;
      const input = el(f.key);
      if (f.type === 'code') input.addEventListener('input', () => { const p = input.selectionStart, before = input.value.length; input.value = codeFilter(input.value); const at = Math.max(0, p - (before - input.value.length)); input.setSelectionRange(at, at); });
      if (f.type === 'num') input.addEventListener('input', () => { input.value = input.value.replace(/[^\d.,]/g, ''); });
      if (f.type === 'date') {
        // Gõ số thì tự chèn dấu /; chọn ở bộ chọn ngày thì ghi lại theo DD/MM/YYYY.
        input.addEventListener('input', () => { const d = input.value.replace(/\D/g, '').slice(0, 8); input.value = [d.slice(0, 2), d.slice(2, 4), d.slice(4)].filter(Boolean).join('/'); });
        const nat = input.parentNode.querySelector('.vdate-native');
        input.parentNode.querySelector('[data-date-pick]').onclick = () => {
          const mm = DATE_RE.exec(input.value); nat.value = mm ? `${mm[3]}-${mm[2]}-${mm[1]}` : '';
          try { nat.showPicker(); } catch (e) { nat.focus(); }
        };
        nat.addEventListener('change', () => { if (nat.value) { const [y, mo, d] = nat.value.split('-'); input.value = `${d}/${mo}/${y}`; check(f); } });
      }
      input.addEventListener('blur', () => check(f));
    });
    const first = m.el.querySelector('input[data-cf]:not(:disabled), textarea[data-cf]');
    if (first) first.focus();
    m.el.querySelector('form').addEventListener('submit', (e) => e.preventDefault());
    // Nhấn Lưu không làm ô đang nhập mất focus trước khi click: blur có thể xoá/hiện lỗi, hộp thoại đổi chiều cao và nút Lưu dịch khỏi con trỏ.
    m.el.querySelector('#cat-save').addEventListener('mousedown', (e) => e.preventDefault());
    m.el.querySelector('#cat-save').onclick = () => {
      if (!fields.map(check).every(Boolean)) return;
      const val = vals();
      fields.forEach((f) => { if (f.type === 'num') val[f.key] = parseNum(val[f.key]); });
      const list = rows(c);
      // Kiểm tra chéo giữa các trường (vd khoảng giá trị của Ngưỡng phân luồng): lỗi hiện dưới trường, hộp thoại giữ nguyên.
      const errs = c.validate ? c.validate(val, row, list) : {};
      if (Object.keys(errs).length) { Object.keys(errs).forEach((k) => show(fields.find((f) => f.key === k), errs[k])); return; }
      // Backend trả lỗi trùng mã (hoặc trùng khoá như mã số thuế); hộp thoại giữ nguyên để sửa (catalog-base.facade handleSubmitForm).
      const dup = (k) => val[k] && list.some((r) => r !== row && String(r[k] || '').toUpperCase() === String(val[k]).toUpperCase());
      const dupKey = [c.autoCode ? null : 'code'].concat(c.unique || []).find((k) => k && (k !== 'code' || !row) && dup(k));
      const dupMsg = dupKey ? `${fields.find((f) => f.key === dupKey).label} ${val[dupKey]} đã tồn tại.` : c.dupOf ? c.dupOf(val, row, list) : '';
      if (dupMsg) { toast(`<b>Lỗi</b><br>${esc(dupMsg)}`, 'warn'); return; }
      if (row) Object.assign(row, val, { code: row.code });
      else list.unshift(Object.assign({ id: Math.max(0, ...list.map((r) => r.id)) + 1, active: true, used: 0 }, val, c.autoCode ? { code: c.autoCode(list) } : {}));
      save();
      m.close();
      ls(c.key).page = 1;
      toast(`<b>Thành công</b><br>${row ? 'Cập nhật' : 'Thêm mới'} ${esc(c.entity)} thành công`);
      rerender();
    };
  }

  /* ---------- vht-confirm-dialog: 400px, icon 48 theo mức độ, tiêu đề 18/700, tên bản ghi in đậm ---------- */
  const GLYPH = {
    danger: icon('del'),
    warning: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5.32 9.56C8.22 4.52 9.67 2 12 2s3.78 2.52 6.68 7.56l.36.63c2.41 4.19 3.62 6.28 2.53 7.82C20.48 19.55 17.78 19.55 12.38 19.55h-.76c-5.4 0-8.1 0-9.19-1.54-1.09-1.54.12-3.63 2.53-7.82l.36-.63Z" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    info: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="2.5" y="2.5" width="19" height="19" rx="6" stroke="currentColor" stroke-width="1.5"/><path d="M12 16.5v-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="8" r="1.1" fill="currentColor"/></svg>',
  };
  function confirmDlg(o) {
    return new Promise((resolve) => {
      const i = o.desc.indexOf(o.hl);
      const desc = i < 0 ? esc(o.desc) : esc(o.desc.slice(0, i)) + `<b>${esc(o.hl)}</b>` + esc(o.desc.slice(i + o.hl.length));
      const m = modal(`<div class="vconfirm ${o.sev}" role="alertdialog">
        <button type="button" class="vconfirm-x" data-close aria-label="Đóng">${icon('x')}</button>
        <div class="vconfirm-c"><span class="vconfirm-ic">${GLYPH[o.sev]}</span>
          <div class="vconfirm-t"><h2>${esc(o.title)}</h2><p>${desc}</p></div></div>
        <div class="vconfirm-a"><button type="button" class="vconfirm-b ghost" data-close>${esc(o.cancel)}</button><button type="button" class="vconfirm-b filled" id="cf-ok">${esc(o.ok)}</button></div></div>`, { v: 'bare' });
      let done = false;
      const end = (v) => { if (!done) { done = true; resolve(v); } };
      m.el.querySelector('#cf-ok').onclick = () => { m.close(); end(true); };
      m.el.addEventListener('click', (e) => { if (e.target === m.el || e.target.closest('[data-close]')) end(false); });
      new MutationObserver((_, ob) => { if (!m.el.isConnected) { ob.disconnect(); end(false); } }).observe(document.body, { childList: true });
    });
  }
  /* Tên bản ghi hiển thị "Tên - Mã" (buildCatalogConfirmParams); danh mục không có Mã/Tên tự khai báo subject. */
  const subjectOf = (c, r) => (c.subject ? c.subject(r) : r.code ? `${r.name} - ${r.code}` : r.name);

  async function del(c, r) {
    const hl = subjectOf(c, r);
    const ok = await confirmDlg({ sev: 'danger', title: 'Bạn chắc chắn muốn xoá không?', desc: `Bạn có chắc chắn muốn xóa ${c.entity}: ${hl} không?`, hl, cancel: 'Hủy', ok: 'Xoá' });
    if (!ok) return;
    if (r.used) {
      // P-33: backend chặn xoá bản ghi đang được hồ sơ dùng.
      toast(`<b>Lỗi</b><br>${esc(cap(c.entity))} ${esc(c.subject ? hl : r.name)} đang được sử dụng trong ${r.used} hồ sơ, không thể xoá. Bạn có thể dừng hoạt động.`, 'warn');
      return;
    }
    const list = rows(c);
    list.splice(list.indexOf(r), 1);
    save();
    toast(`<b>Thành công</b><br>Xoá ${esc(c.entity)} thành công`);
    rerender();
  }

  async function toggle(c, r) {
    const off = r.active, hl = subjectOf(c, r);
    const ok = await confirmDlg(off
      ? { sev: 'warning', title: 'Dừng hoạt động', desc: `Bạn có chắc chắn muốn dừng hoạt động ${c.entity}: ${hl} không?`, hl, cancel: 'Không', ok: 'Có' }
      : { sev: 'info', title: 'Kích hoạt', desc: `Bạn có chắc chắn muốn kích hoạt ${c.entity}: ${hl} không?`, hl, cancel: 'Không', ok: 'Có' });
    if (!ok) return;
    const block = !off && c.canActivate && c.canActivate(r, rows(c));
    if (block) { toast(`<b>Lỗi</b><br>${esc(block)}`, 'warn'); return; }
    r.active = !off;
    save();
    ls(c.key).page = 1;
    toast(`<b>Thành công</b><br>${off ? 'Dừng hoạt động' : 'Kích hoạt'} ${esc(c.entity)} thành công`);
    rerender();
  }

  /* ---------- Nhập từ Excel (vht-import-dialog + bảng Kết quả nhập dữ liệu, như personnel-import-dialog của hr-tools) ----------
     Giả lập file 20 dòng: kiểm tra từng dòng theo quy tắc của hộp thoại; dòng 7 trùng mã số thuế NCC Alpha, dòng 15 thiếu email.
     Nhập lại cùng file thì mọi dòng trùng mã số thuế → không còn dòng hợp lệ. */
  const IMPORT_FILE = { name: 'danh-sach-nha-cung-cap.xlsx', size: '18,4 KB' };
  const IMPORT_ROWS = [
    ['Công ty TNHH Viễn thông Nam Việt', 'VN', '0109000101', 'VN', 'baogia@namvietcom.vn'],
    ['Công ty Cổ phần Điện tử Sao Mai', 'VN', '0109000102', 'VN', 'kinhdoanh@saomai-elec.vn'],
    ['Công ty TNHH Giải pháp Mạng Toàn Cầu', 'VN', '0309000103', 'VN', 'rfq@toancaunet.vn'],
    ['Công ty Cổ phần Cơ điện Thăng Long', 'VN', '0109000104', 'VN', 'baogia@codienthanglong.vn'],
    ['Công ty TNHH Thiết bị Đo Hải Âu', 'VN', '0209000105', 'VN', 'sales@haiau-measure.vn'],
    ['Công ty Cổ phần Phần mềm Bình Minh', 'VN', '0109000106', 'VN', 'contact@binhminhsoft.vn'],
    ['Công ty TNHH Công nghệ Alpha', 'VN', '0101234567', 'VN', 'baogia@alphatech.vn'],
    ['Công ty TNHH Vận tải Sông Hồng', 'VN', '0109000108', 'VN', 'muasam@songhonglogistics.vn'],
    ['Công ty Cổ phần Tư vấn Xây dựng Đại Việt', 'VN', '0109000109', 'VN', 'tuvan@daivietcons.vn'],
    ['Công ty TNHH Linh kiện Phương Nam', 'VN', '0309000110', 'VN', 'order@phuongnamparts.vn'],
    ['Công ty TNHH Bảo trì Kỹ thuật Hoàng Gia', 'VN', '0109000111', 'VN', 'dichvu@hoanggiatech.vn'],
    ['Omega Instruments Ltd.', 'NN', '', 'Anh', 'sales@omega-instruments.co.uk'],
    ['Công ty Cổ phần Thiết bị Văn phòng Ánh Dương', 'VN', '0109000113', 'VN', 'banhang@anhduongoffice.vn'],
    ['Công ty TNHH Anten và Vi ba Sao Việt', 'VN', '0109000114', 'VN', 'baogia@saoviet-rf.vn'],
    ['Công ty Cổ phần Tích hợp Hệ thống Trường Sơn', 'VN', '0109000115', 'VN', ''],
    ['Công ty TNHH Nguồn điện Tân Tiến', 'VN', '0409000116', 'VN', 'sales@tantienpower.vn'],
    ['Sigma Components Co., Ltd.', 'NN', 'TW-84512377', 'Đài Loan', 'rfq@sigma-comp.com.tw'],
    ['Công ty TNHH Đào tạo Công nghệ An Khang', 'VN', '0109000118', 'VN', 'daotao@ankhang-edu.vn'],
    ['Công ty Cổ phần Cơ khí Chính xác Hà Nội', 'VN', '0109000119', 'VN', 'kinhdoanh@cokhihn.vn'],
    ['Công ty TNHH Cáp quang Miền Trung', 'VN', '0409000120', 'VN', 'baogia@capquangmientrung.vn'],
  ];
  const IMPORT_GOODS = ['VTCNTT', 'NCSX', 'VTCNTT', 'NCSX', 'NCSX', 'VTCNTT', 'VTCNTT', 'PTVT_TBQL', 'DVTV', 'NCSX',
    'DVPTV', 'NCSX', 'PTVT_TBQL', 'VTCNTT', 'VTCNTT', 'NCSX', 'NCSX', 'DVPTV', 'NCSX', 'VTCNTT'];
  const CITY = { '01': 'Hà Nội', '02': 'Hải Phòng', '03': 'TP Hồ Chí Minh', '04': 'Đà Nẵng' };
  function importCheck(c) {
    const list = rows(c), seen = new Set(list.map((r) => r.tax).filter(Boolean));
    const f = (k) => c.fields.find((x) => x.key === k);
    return IMPORT_ROWS.map(([name, kind, tax, country, email], i) => {
      const v = { name, kind, tax, country, email, goods: [IMPORT_GOODS[i]], address: kind === 'VN' ? CITY[tax.slice(0, 2)] : labelOf({ options: COUNTRY }, country) };
      const errs = ['name', 'tax', 'email'].map((k) => fieldError(f(k), v[k], v)).filter(Boolean);
      if (tax && seen.has(tax)) errs.push(`Mã số thuế ${tax} đã tồn tại.`);
      if (tax) seen.add(tax);
      else { const d = c.dupOf(v, null, list); if (d) errs.push(d); }
      return { n: i + 1, v, errs };
    });
  }
  function importDlg(c) {
    let file = null;
    // Bước 1 — vht-import-dialog: 780px, dải file mẫu, vùng kéo thả; Nhập dữ liệu chỉ bật khi đã chọn file.
    const pick = () => {
      const m = vModal({ title: 'Nhập dữ liệu', size: 'w780', body: `<div class="imp">
          <div class="imp-banner"><span class="imp-bl">${icon('file')}File mẫu import nhà cung cấp</span>
            <button type="button" class="imp-tpl" data-imp-tpl>${icon('download')}Tải file mẫu</button></div>
          <button type="button" class="imp-zone" data-imp-zone><span class="imp-glyph">${icon('upload')}</span>
            <span class="imp-hint">${file ? esc(file.name) : 'Kéo thả file vào đây hoặc bấm để chọn'}</span>
            <span class="imp-sub">${file ? esc(file.size) : 'Hỗ trợ định dạng .xlsx, .csv (tối đa 10MB)'}</span></button></div>`,
        actions: `<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="imp-go" ${file ? '' : 'disabled'}>Nhập dữ liệu</button>` });
      m.el.querySelector('[data-imp-tpl]').onclick = () => toast('<b>Thành công</b><br>Đã tải file mau-nhap-nha-cung-cap.xlsx');
      m.el.querySelector('[data-imp-zone]').onclick = () => { file = IMPORT_FILE; m.close(); pick(); };
      m.el.querySelector('#imp-go').onclick = () => { m.close(); result(); };
    };
    // Bước 2 — Kết quả nhập dữ liệu: dòng chỉ được ghi khi Xác nhận nhập (bước tải lên là chạy thử).
    const result = () => {
      const res = importCheck(c), ok = res.filter((r) => !r.errs.length);
      const cell = (v) => (v ? esc(v) : '<span class="dash">-</span>');
      const body = res.map((r) => `<tr><td class="ord">${r.n}</td><td class="c">${r.errs.length ? badge('Lỗi', 'error') : badge('Hợp lệ', 'success')}</td>
          <td>${r.errs.length ? `<span class="imp-err">${esc(r.errs.join(' '))}</span>` : '<span class="dash">-</span>'}</td>
          <td>${cell(r.v.name)}</td><td>${cell(r.v.tax)}</td><td>${cell(labelOf({ options: KIND }, r.v.kind))}</td>
          <td>${cell(labelOf({ options: COUNTRY }, r.v.country))}</td><td>${cell(labelOf({ options: goodsOptions, multi: true }, r.v.goods))}</td><td>${cell(r.v.email)}</td></tr>`).join('');
      const m = vModal({ title: 'Kết quả nhập dữ liệu', size: 'xl', body: `<div class="imp-res">
          <div class="imp-top"><span class="imp-sum">${ok.length}/${res.length} dòng hợp lệ</span><button type="button" class="vbtn primary" data-imp-again>${icon('upload')} Nhập file mới</button></div>
          <div class="vtable-vp"><table class="vtable cat"><thead><tr><th class="ord">STT</th><th class="c" style="min-width:110px">Kết quả</th><th style="min-width:260px">Nội dung lỗi</th>
            <th style="min-width:260px">Tên nhà cung cấp</th><th style="min-width:140px">Mã số thuế</th><th style="min-width:110px">Phân loại</th><th style="min-width:110px">Quốc gia</th><th style="min-width:180px">Ngành hàng</th><th style="min-width:220px">Email nhận yêu cầu báo giá</th></tr></thead>
            <tbody>${body}</tbody></table></div></div>`,
        actions: `<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="imp-ok" ${ok.length ? '' : 'disabled'}>Xác nhận nhập</button>` });
      m.el.querySelector('[data-imp-again]').onclick = () => { file = null; m.close(); pick(); };
      m.el.querySelector('#imp-ok').onclick = () => {
        const list = rows(c);
        ok.forEach((r) => {
          const nv = r.v.kind === 'VN';
          list.unshift({ id: Math.max(0, ...list.map((x) => x.id)) + 1, code: c.autoCode(list), name: r.v.name, short: '', nameEn: nv ? '' : r.v.name,
            kind: r.v.kind, tax: r.v.tax, country: r.v.country, address: r.v.address, goods: r.v.goods, email: r.v.email, cc: '', contact: '', phone: '',
            currency: nv ? 'VNĐ' : 'USD', description: '', used: 0, ban: null, active: true });
        });
        save(); m.close();
        ls(c.key).page = 1;
        toast(`<b>Thành công</b><br>Nhập nhà cung cấp thành công (${ok.length} nhà cung cấp)`);
        rerender();
      };
    };
    pick();
  }

  /* ---------- Sự kiện ---------- */
  const curCatalog = () => { const m = location.hash.match(/^#\/dmdc\/([^/?]+)/); return m ? byKey(m[1]) : null; };
  const rowOf = (c, id) => rows(c).find((r) => String(r.id) === String(id));
  document.addEventListener('click', (e) => {
    const t = e.target, c = curCatalog();
    if (!c || !c.built) return;
    const pg = t.closest(`[data-pager="cat-${c.key}"]`);
    const s = ls(c.key);
    if (pg) {
      const b = t.closest('[data-pg]'), z = t.closest('[data-ps]');
      if (b) s.page = Number(b.dataset.pg);
      else if (z) { s.size = Number(z.dataset.ps); s.page = 1; s.psOpen = false; } else if (t.closest('[data-ps-open]')) s.psOpen = !s.psOpen;
      else return;
      rerender(); return;
    }
    if (s.psOpen) { s.psOpen = false; rerender(); }
    if (t.closest('[data-cat-new]')) { openForm(c, null); return; }
    if (t.closest('[data-cat-import]')) { importDlg(c); return; }
    if (t.closest('[data-adv-toggle]')) { s.advOpen = !s.advOpen; rerender(); return; }
    if (t.closest('[data-adv-reset]')) { s.draft = ADV0(); s.adv = ADV0(); s.st = null; s.kw = ''; s.kwInput = ''; s.page = 1; rerender(); return; }
    const ed = t.closest('[data-cat-edit]');
    if (ed) { openForm(c, rowOf(c, ed.dataset.catEdit)); return; }
    const vw = t.closest('[data-cat-view]');
    if (vw) { openForm(c, rowOf(c, vw.dataset.catView), true); return; }
    const dl = t.closest('[data-cat-del]');
    if (dl) { del(c, rowOf(c, dl.dataset.catDel)); return; }
    const tg = t.closest('[data-cat-tg]');
    if (tg) toggle(c, rowOf(c, tg.dataset.catTg));
  });
  document.addEventListener('input', (e) => {
    const k = e.target.closest && e.target.closest('[data-cat-kw]');
    if (k) ls(k.dataset.catKw).kwInput = k.value;
    const a = e.target.closest && e.target.closest('[data-adv]'), c = curCatalog();
    if (a && c) ls(c.key).draft[a.dataset.adv] = a.value;
  });
  document.addEventListener('submit', (e) => {
    const f = e.target.closest('[data-adv-form]'), c = curCatalog();
    if (!f || !c) return;
    e.preventDefault();
    // handleAdvancedSearch: chỉ gửi các trường nâng cao, bỏ từ khoá nhanh.
    const s = ls(c.key);
    s.adv = Object.assign({}, s.draft, { code: s.draft.code.trim(), name: s.draft.name.trim(), tax: s.draft.tax.trim() });
    s.st = s.draft.st; s.kw = ''; s.kwInput = ''; s.page = 1;
    rerender();
  });
  document.addEventListener('keydown', (e) => {
    const k = e.key === 'Enter' && e.target.closest && e.target.closest('[data-cat-kw]');
    if (!k) return;
    const s = ls(k.dataset.catKw);
    s.kwInput = k.value; s.kw = k.value.trim(); s.page = 1;
    // handleQuickSearch của danh mục có tìm kiếm nâng cao: xoá các trường nâng cao.
    const c = byKey(k.dataset.catKw);
    if (c && c.advanced) { s.draft = ADV0(); s.adv = ADV0(); s.st = null; }
    rerender();
    const n = document.querySelector('[data-cat-kw]');
    if (n) { n.focus(); n.setSelectionRange(n.value.length, n.value.length); }
  });

  window.Catalog = { overview, list, activeOptions, canSee, rows: (key) => rows(byKey(key)), CATALOGS, confirm: confirmDlg, reset };
})();
