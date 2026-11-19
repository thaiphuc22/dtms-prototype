/* T33 B2 — Tour hướng dẫn (plan docs/dtms/T33-goi-prototype-khach-ke-hoach.md §3.3). Lớp phủ của prototype như Công cụ demo,
   KHÔNG có trong hệ thống thật (rule prototype-ui A6): ẩn khi ?capture=1 và khi đang ở chế độ comment (T30).
   - 7 tour theo 7 tác vụ của HUONG-DAN.html (thứ tự trên hồ sơ ĐXMS-2026-0117 · MS01.01).
   - Nút "Hướng dẫn" luôn hiện trên thanh trên cùng; ô "Tự hiện danh sách tour mỗi lần mở prototype" (danh sách tour, Công cụ demo) lưu localStorage 'dtms-tour' (bọc try/catch).
   - Bản gửi khách (meta proto-build là ngày, không phải "dev"): mỗi lần mở tự hiện hộp chào. Bản dev / e2e không tự hiện.
   - Bắt đầu tour đưa hồ sơ demo tới bước cần xem (Flow.jumpToScene / jumpTo); hồ sơ đang chạy dở thì hỏi xác nhận trước.
   - Bước có `wait`: tự sang bước sau khi người xem làm xong; nút "Làm hộ" chạy `do`. Không thấy phần tử: popover giữa màn, ghi màn đã đổi.
   - index.html?tour=<1..7>: mở thẳng tour (liên kết từ HUONG-DAN.html).
   T83 (plan docs/dtms/prototype-T83-huong-dan-tour-1911.md): tour chia tab theo cụm tính năng (TABS: Đề xuất mua sắm, Khoản đầu tư; Thầu, Hợp đồng sau T79 / T80);
   mã tour `<tab>-<n>` (vd dxms-8, kdt-2); số 1..7 cũ = dxms-1..7 (?tour=3 vẫn chạy). Tour mới dùng cảnh của bộ demo (Flow.jumpToScene) như Công cụ demo.
   Không làm Quản lý sản xuất (người dùng 19/11). Tab đang xem nhớ ở localStorage 'dtms-tour-tab' (bọc try/catch). */
(function () {
  const D = window.D, Flow = window.Flow;
  const { esc } = window.UI;
  const KEY = 'dtms-tour';
  const SET = 'MS01.01';

  /* ---------- Lưu lựa chọn ---------- */
  function pref() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function setPref(p) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) { /* không lưu được: vẫn chạy trong phiên */ } MEM = p; }
  let MEM = null;
  const enabled = () => { const p = pref() || MEM; return !p || p.on !== false; };
  /* Bản gửi khách: proto-build là ngày (index.html nguồn ghi "dev"). */
  const release = () => { const m = document.querySelector('meta[name="proto-build"]'); return !!m && !!m.content && m.content !== 'dev'; };
  const hidden = () => document.body.classList.contains('cap') || document.body.classList.contains('rv-mode');

  /* ---------- Thao tác dùng chung ---------- */
  const go = (h) => { if (location.hash !== h) location.hash = h; else window.App.render(); };
  const tokOf = (n, cqcm) => Flow.state.tokens.find((k) => String(k.task) === String(n) && (!cqcm || k.cqcm === cqcm));
  /* Tua hồ sơ demo tới bước n, đứng ở vai được giao, mở màn việc. */
  function goTask(n, cqcm) {
    Flow.jumpTo(n, 'minh');
    const t = tokOf(n, cqcm);
    if (!t) return;
    Flow.setPersona(t.who);
    go('#/task/' + t.id);
  }
  const closeModals = () => document.querySelectorAll('.overlay').forEach((o) => { if (!o.closest('.tour-layer')) o.remove(); });
  const branch = (name) => (Flow.demoSet().branches || []).find((b) => b.name.startsWith(name));
  const visible = (el) => !!el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
  /* sel: chuỗi CSS, hoặc [CSS, chữ phải có] — lấy phần tử hiện đầu tiên khớp. */
  function find(sel) {
    if (!sel) return null;
    const [q, txt] = Array.isArray(sel) ? sel : [sel, null];
    return [...document.querySelectorAll(q)].find((e) => visible(e) && (!txt || e.textContent.includes(txt))) || null;
  }
  const act = (label) => ['.task-acts [data-act]', label];
  const actPrimary = '.task-acts [data-act].primary';
  const modalOpen = () => !!document.querySelector('.overlay .vmodal.ef');
  const route = (re) => () => re.test(location.hash);
  const click = (sel) => () => { const e = find(sel); if (e) e.click(); };
  /* T83: tua bộ demo `set` tới cảnh `n` rồi mở màn như Công cụ demo — cảnh NEW mở màn khởi tạo của bộ, END mở `go` của cảnh, còn lại việc ở bước bắt đầu. */
  const pname = (id) => { const p = D.personas.find((x) => x.id === id); return p ? `${p.name} — ${p.role}` : ''; };
  function scene(set, n) {
    const sc = Flow.jumpToScene(n, set), ds = D.demoSets.find((d) => d.key === set);
    if (sc.start === 'NEW') { go(ds.kdt ? '#/kdt/create' : (set === 'MS02' ? '#/dieu-chinh-dxms/create/' : '#/luong/create/') + encodeURIComponent(ds.dxms)); return; }
    if (sc.start === 'END') { go(sc.go ? '#/' + sc.go : '#/luong/' + encodeURIComponent(sc.dxms || ds.dxms)); return; }
    const t = Flow.state.tokens.find((k) => String(k.task) === String(sc.start)) || Flow.state.tokens[0];
    if (!t) return;
    Flow.setPersona(t.who);
    go('#/task/' + t.id);
  }
  const sceneTab = (set, n, tab) => () => { scene(set, n); setTimeout(() => { const b = find(`[data-ltab="${tab}"]`); if (b) b.click(); }, 0); };
  /* Màn Lập ĐXMS: bấm ✦ Gợi ý từ AI của khối rồi Áp dụng popup (popup đang mở thì chỉ Áp dụng). */
  const aiDo = (sec) => () => { if (!find('[data-lf-ai-apply]')) click(`[data-lf-ai-sec="${sec}"]`)(); click('[data-lf-ai-apply]')(); };

  /* ---------- Tour — tab Đề xuất mua sắm (1–7: ĐXMS-2026-0117 · MS01.01, T33; 8–10: T83) ---------- */
  const TOURS = [
    { n: 1, name: 'Khởi tạo luồng và hồ sơ', who: 'Chuyên quản ĐVĐX', steps: [
      { enter: () => { Flow.jumpToScene(1, SET); if (!window.Luong.isGop()) window.Luong.setMode('gop'); Flow.setPersona('minh'); go('#/luong'); },
        sel: '.sb-nav [data-go="luong"]', title: 'Đề xuất mua sắm', text: 'Danh sách đề xuất mua sắm (ĐXMS) nằm ở menu <b>Quản lý đề xuất mua sắm &gt; Đề xuất mua sắm</b>.' },
      { sel: '[data-go="luong/create"]', title: 'Thêm mới', text: '<b>Bấm vào đây</b> để lập đề xuất mua sắm mới.', wait: route(/#\/luong\/create$/), do: () => go('#/luong/create') },
      { sel: '#lf-title', title: 'Thông tin chung', text: 'Nhập Tên đề xuất mua sắm. Các trường có dấu <b>*</b> là bắt buộc.' },
      { sel: '[data-vsel="lf-nv"]', title: 'Bước 1 — Đề tài / dự án', text: 'Chọn đề tài / dự án và văn bản căn cứ. Chọn xong, hệ thống tự bóc tách hàng hoá của căn cứ vào bảng chi phí; khối Thông tin chung, Căn cứ pháp lý có nút <b>✦ Gợi ý từ AI</b> — AI chỉ chạy khi bấm. Bước 1 đến 5 làm trên cùng màn này.' },
      { sel: '#lf-draft', title: 'Lưu nháp', text: '<b>Bấm Lưu nháp</b>: hệ thống tạo luồng (mã ĐXMS tự sinh), hồ sơ Phê duyệt và giữ việc <b>Lập đề xuất mua sắm</b> để làm tiếp. Bấm <i>Làm hộ</i> để dùng hồ sơ mẫu.',
        wait: route(/#\/task\//), do: () => goTask(1) },
      /* [T72 #83, D-122 Q4] bỏ bước "Gợi ý từ AI: Bóc tách và đối chiếu" (nút [data-lf-ai-sec="boc"], aiDo('boc')) — hệ thống bóc tách khi chọn đề tài. */
      { enter: () => { if (!tokOf(1)) goTask(1); }, sel: '[data-lf-cost]', title: 'Bước 2, 5, 6 — Bóc tách hạng mục', text: 'Chọn đề tài / dự án xong, <b>hệ thống</b> lấy dữ liệu căn cứ, ghép hàng hoá vào khoản mục dự toán còn khả dụng và điền <b>bảng bóc tách</b> (cột SL còn được mua, Còn lại khả dụng). Sửa, xoá, thêm dòng ngay trên bảng.' },
      /* Review nhi 06/11 #1: bỏ khối Thông tin cơ bản — Nhóm mục đích, Nguồn vốn ở Thông tin chung. */
      { sel: '[data-lf-chung]', title: 'Bước 3, 4 — Thông tin chung', text: '<b>Nhóm mục đích mua sắm</b> và <b>Nguồn vốn</b> điền sẵn theo đề tài / dự án, sửa được; nút <b>✦ Gợi ý từ AI</b> của khối gợi ý cả Tên luồng, Giá trị dự kiến, Thời gian thực hiện. Nội dung các mục Tờ trình nhập ở bước lập dự thảo (tour 4).' },
      { sel: '#lf-save', title: 'Gửi', text: '<b>Bấm Gửi</b>: hoàn thành bước 1–5, hồ sơ chuyển <b>Chỉ huy ĐVĐX xác nhận khởi tạo</b>, rồi Phòng Quản lý tài sản rà soát tồn kho (tour 2).',
        wait: route(/#\/viec-cua-toi$/), do: click('#lf-save') }] },

    { n: 2, name: 'Thủ kho rà soát tồn kho', who: 'Phòng Quản lý tài sản / Thủ kho', steps: [
      /* T59 Q4, Q8, Q9 (D-114): việc bước 7 mở sẵn tab Rà soát tồn kho của màn xử lý việc (không còn màn riêng); hai ô tệp; không sinh biên bản. */
      { enter: () => { Flow.jumpToScene('1b', SET); const t = tokOf(7); if (t) go('#/task/' + t.id); }, sel: '[data-rsk-ed]', title: 'Việc Rà soát tồn kho',
        text: 'Vai <b>Hà Văn Tiến — Phòng Quản lý tài sản</b>. Màn xử lý việc mở sẵn tab <b>Rà soát tồn kho</b>: tải <b>Tệp kết quả</b> Excel theo mẫu BM-RSTK thì hệ thống đọc và điền sẵn bảng (sửa được mọi ô), tải <b>Biên bản kiểm đếm có ký</b>; SL xuất kho không vượt tồn khả dụng, SL cần mua tự tính.' },
      { sel: actPrimary, title: 'Gửi Chỉ huy Kho', text: 'Nhập xong bấm <b>Gửi Chỉ huy Kho</b> trên thanh trạng thái: hệ thống kiểm dữ liệu của tab, lưu kết quả và chuyển <b>Chỉ huy Kho duyệt</b>. Phần còn phải mua là đầu vào của yêu cầu báo giá.' },
      { enter: () => { closeModals(); goTask('7.1'); }, sel: act('Duyệt'), title: 'Chỉ huy Kho duyệt', text: 'Vai <b>Lưu Văn Thắng</b>. Xem kết quả rà soát, tệp kết quả và biên bản kiểm đếm ở tab Rà soát tồn kho; <b>Duyệt</b> thì Thầu TTMS lấy báo giá, <b>Trả lại</b> (có lý do) thì Kho rà soát lại.' }] },

    { n: 3, name: 'Tổng hợp yêu cầu báo giá', who: 'Thầu Trung tâm Mua sắm', steps: [
      { enter: () => goTask(8), sel: actPrimary, title: 'Bước 8 — Khởi tạo YCBG', text: '<b>Bấm Hoàn thành</b> để mở phiếu yêu cầu báo giá.', wait: modalOpen, do: click(actPrimary) },
      { sel: '.vmodal.ef [data-ef-field="nccSel"]', title: 'Nhà cung cấp nhận YCBG', text: 'Danh sách lọc theo ngành hàng của hạng mục; nhà cung cấp bị cấm không hiện. Thêm được nhà cung cấp mới.' },
      { sel: '.vmodal.ef [data-ef-field="dkThanhToan"]', title: 'Điều khoản trên phiếu', text: 'Điều kiện thanh toán, Địa điểm giao hàng, Đầu mối tiếp nhận báo giá, Các yêu cầu khác — in trên phiếu và email gửi nhà cung cấp.' },
      /* Review nhi 06/11 #2, #3, #7: không so sánh báo giá trên hệ thống — Thầu tải tệp báo giá, nhập giá trị cuối cùng; Chỉ huy Thầu Đồng ý / Từ chối. */
      { enter: () => { closeModals(); goTask(10); }, sel: act('Báo giá đạt'), title: 'Bước 10 — Tổng hợp báo giá',
        text: 'Hệ thống đã gửi email (bước 9). Thầu so sánh, đánh giá báo giá ngoài hệ thống. <b>Báo giá đạt</b>: tải tệp báo giá của từng nhà cung cấp và nhập giá trị báo giá cuối cùng; <b>Không đạt — tạo YCBG mới</b> kèm lý do.' },
      { enter: () => { closeModals(); goTask('10.1'); }, sel: act('Đồng ý'), title: 'Chỉ huy Thầu TTMS phê duyệt', text: 'Vai <b>Phí Đức Long</b>. Xem tệp báo giá và giá trị cuối cùng; <b>Đồng ý</b> thì hệ thống rẽ theo tổng giá trị (dưới 160 tỷ sang bước 11, từ 160 tỷ sang bước 12), <b>Từ chối</b> kèm lý do thì về bước 10.' }] },

    { n: 4, name: 'Soạn thảo hồ sơ ĐXMS', who: 'Chuyên quản, Chỉ huy ĐVĐX', steps: [
      { enter: () => goTask(12), sel: act('Soạn thảo tờ trình ĐXMS'), title: 'Bước 12 — Soạn thảo tờ trình', text: 'Hoàn thiện tờ trình, phụ lục theo mẫu (điền sẵn từ các bước trước), tải tài liệu bắt buộc rồi <b>Gửi chỉ huy duyệt</b>.' },
      /* T34 v0.2 (D-92): lịch sử nằm ở tab Tiến trình, khối "Lịch sử xử lý". */
      { enter: () => { const tb = find('[data-ltab="tien-trinh"]'); if (tb) tb.click(); }, sel: ['.vcard', 'Lịch sử xử lý'], title: 'Lịch sử xử lý', text: 'Tab <b>Tiến trình</b>: các bước đã xử lý, ai xử lý, khi nào.' },
      { enter: () => goTask(13), sel: act('Phê duyệt'), title: 'Bước 13 — Chỉ huy ĐVĐX duyệt', text: 'Vai <b>Trần Đức Hải</b>. Duyệt từng phần: mọi phần Đạt thì Đồng ý; có phần Không đạt thì <b>Không đồng ý</b> kèm lý do, hồ sơ về bước 12.' },
      { enter: () => goTask(16), sel: actPrimary, title: 'Bước 16 — Phiếu yêu cầu thẩm định', text: 'Chọn cơ quan chuyên môn thẩm định, hạn góp ý, đầu mối tiếp nhận; bấm <b>Lập phiếu yêu cầu thẩm định</b>, điền nội dung BM-03 (xem trước được) rồi trình Chỉ huy ĐVĐX phê duyệt trước khi chuyển TTMS (tour 5).' },
      { enter: () => goTask('16.1'), sel: act('Phê duyệt phiếu yêu cầu thẩm định'), title: 'Chỉ huy ĐVĐX phê duyệt phiếu', text: 'Vai <b>Trần Đức Hải</b>. Phê duyệt phiếu yêu cầu thẩm định và các bên thẩm định; Trả lại thì về bước 16.' }] },

    { n: 5, name: 'TTMS rà soát', who: 'Chuyên viên TTMS', steps: [
      { enter: () => goTask(17), sel: act('Xác nhận danh sách CQCM'), title: 'Bước 17 — Xác nhận danh sách CQCM', text: 'Vai <b>Phạm Thị Lan</b>. Kiểm danh sách rồi nhập nhận xét: <b>Đồng ý</b> thì hệ thống tự gửi yêu cầu thẩm định và trình ký BM-03; <b>Từ chối</b> thì về bước 16.' },
      { enter: () => goTask(42), sel: act('Hoàn tất rà soát BM-05'), title: 'Bước 42 — Rà soát BM-05', text: 'Sau thẩm định: rà soát Báo cáo kết quả thẩm định (BM-05) do AI soạn từ ý kiến các CQCM.' },
      { enter: () => goTask(43), sel: actPrimary, title: 'Bước 43 — Đủ điều kiện', text: 'Xác nhận hồ sơ đủ điều kiện và ký BM-05 — sang trình ký (tour 7).' }] },

    { n: 6, name: 'Thẩm định và giải trình', who: 'CQCM, Chuyên quản ĐVĐX', steps: [
      { enter: () => goTask(19, 'PC'), sel: ['.vcard', 'Thẩm định của cơ quan chuyên môn'], title: 'Bước 19 — CQCM thẩm định',
        text: 'Vai <b>Lê Thanh Hòa — Ban Pháp chế</b> (mỗi CQCM một việc). Xem hồ sơ thẩm định theo tab, ghi ý kiến theo từng mục, xem lịch sử ý kiến các lần.' },
      { sel: act('Hoàn thành phiếu'), title: 'Hoàn thành phiếu', text: '<b>Ghi lại</b> để lưu dở; <b>Hoàn thành phiếu, trình chỉ huy</b> khi xong. Trưởng ban CQCM đồng ý và trình ký BM-04 ở bước 20.' },
      { enter: () => goTask(28), sel: act('Gửi giải trình'), title: 'Bước 28 — ĐVĐX giải trình', text: 'ĐVĐX tiếp thu hoặc giải trình từng ý kiến, hoàn chỉnh hồ sơ. Quá số vòng cho phép thì hệ thống cảnh báo, yêu cầu họp.' },
      { enter: () => goTask(35, 'PC'), sel: act('Đạt'), title: 'Bước 35 — Kiểm tra lại', text: 'CQCM kiểm tra hồ sơ đã hoàn chỉnh: Đạt thì xác nhận ký BM-04 và Checklist.' }] },

    { n: 7, name: 'Trình ký và phê duyệt', who: 'TTMS, Tổng Giám đốc VHT', steps: [
      /* T56 (review Nhi 12/11 #27): bước tour mở hộp thoại Trình ký VOffice (SCR-21) — chỉ xem, đóng không hoàn thành bước. */
      { enter: () => { goTask(43); setTimeout(() => { if (!document.querySelector('.overlay .vmodal')) window.TrinhKy.signDialog('BM-05', Flow.state.persona); }, 400); },
        sel: '.overlay .vmodal', title: 'Bước 43 — Trình ký VOffice',
        text: 'Nút ký của bước (vd <b>Xác nhận đủ điều kiện &amp; ký BM-05</b>) mở hộp thoại <b>Trình ký VOffice</b>: chọn Hình thức trình, đăng nhập VOffice, kiểm Thông tin văn bản, tệp trình ký và bảng người ký theo nhóm rồi bấm <b>Trình ký</b>. Kết quả theo dõi ở menu <b>Trình ký</b>.' },
      { enter: () => { closeModals(); goTask(48); }, sel: act('Có báo cáo TGĐ Tập đoàn'), title: 'Bước 48 — Báo cáo Tập đoàn?', text: 'Sau khi BM-05 được ký (bước 43–47), TTMS chọn có báo cáo TGĐ Tập đoàn hay không. Chọn sẵn theo "Căn cứ đã được phê duyệt" của luồng.' },
      { enter: () => goTask(59), sel: act('Trình phê duyệt'), title: 'Bước 59 — Trình phê duyệt', text: 'Hệ thống sinh dự thảo Quyết định phê duyệt; TTMS rà soát và <b>Trình phê duyệt</b>.' },
      { enter: () => goTask(60), sel: act('Phê duyệt'), title: 'Bước 60 — Tổng Giám đốc', text: 'Vai <b>Ngô Đình Khôi</b>. <b>Phê duyệt</b>, hoặc Yêu cầu hoàn chỉnh. Bước 61 hệ thống gửi ký duyệt trên VOffice; hồ sơ Hoàn thành.' }] },

    /* T83 — các quy trình MS01 khác và điều chỉnh (bộ demo MS01.02, MS01.03, MS02). */
    { n: 8, name: 'Căn cứ đã được phê duyệt (MS01.02)', who: 'Chuyên quản ĐVĐX, TTMS', doc: 'ĐXMS-2026-0124', steps: [
      { enter: () => scene('MS01.02', '2-1'), sel: '[data-vsel="lf-basis-td"]', title: 'Căn cứ đã được phê duyệt',
        text: 'Lập ĐXMS-2026-0124 trên màn Lập đề xuất mua sắm như tour 1. Căn cứ của ĐXMS <b>đã được phê duyệt</b> thì hệ thống chọn quy trình <b>MS01.02</b>: không phải báo cáo Tổng Giám đốc Tập đoàn.' },
      { sel: '#lf-save', title: 'Gửi', text: '<b>Gửi</b> để bắt đầu hồ sơ. Các bước rà soát tồn kho, báo giá, soạn thảo, thẩm định đi như MS01.01 (tour 2–6).' },
      { enter: () => scene('MS01.02', '2-2'), sel: act('Không báo cáo TGĐ Tập đoàn'), title: 'Bước 48 — Không báo cáo Tập đoàn',
        text: `Vai <b>${pname('lan')}</b>. Lựa chọn <b>Không báo cáo TGĐ Tập đoàn</b> đã chọn sẵn theo căn cứ đã được phê duyệt; vẫn đổi được nếu cần báo cáo.` },
      { enter: () => scene('MS01.02', '2-3'), sel: actPrimary, title: 'Bước 58 — Quyết định phê duyệt',
        text: 'Dự thảo Quyết định phê duyệt <b>BM-08</b> không kèm báo cáo BM-06, BM-07; TTMS hoàn thành rồi trình Tổng Giám đốc phê duyệt (bước 59–61).' },
      { enter: sceneTab('MS01.02', '2-4', 'tien-trinh'), sel: '[data-ltab="tien-trinh"]', title: 'Tổng kết',
        text: 'Chi tiết đề xuất mua sắm, tab <b>Tiến trình</b>: các bước đã đi của MS01.02, ai xử lý, khi nào.' }] },

    { n: 9, name: 'Dưới ngưỡng — tờ trình BM-09 (MS01.03)', who: 'Chuyên quản ĐVĐX, CQCM, TTMS, Phó TGĐ, Thủ trưởng', doc: 'ĐXMS-2026-0098', steps: [
      { enter: () => scene('MS01.03', '3-1'), sel: '#lf-est', title: 'Giá trị dưới ngưỡng',
        text: 'ĐXMS-2026-0098 lập trên căn cứ Kế hoạch SXKD, giá trị dự kiến <b>dưới ngưỡng</b> phân luồng → hệ thống chọn quy trình <b>MS01.03</b> (tờ trình BM-09, Phó Tổng Giám đốc ký thẩm định).' },
      { enter: () => scene('MS01.03', '3-2'), sel: act('Soạn thảo tờ trình ĐXMS'), title: 'Bước 11 — Dự thảo BM-09',
        text: `Vai <b>${pname('minh')}</b>. Soạn tờ trình <b>BM-09</b> và Checklist 02, chọn cơ quan chuyên môn góp ý.` },
      { enter: () => scene('MS01.03', '3-3'), sel: act('Hoàn thành phiếu'), title: 'Bước 19 — CQCM góp ý BM-04',
        text: `Vai <b>${pname('thu')}</b> (mỗi CQCM một việc). Ghi ý kiến theo từng mục của phiếu <b>BM-04</b> rồi hoàn thành phiếu, trình chỉ huy.` },
      { enter: () => scene('MS01.03', '3-5'), sel: act('Ký thẩm định BM-09'), title: 'Bước 38 — TTMS ‖ Phó TGĐ ký',
        text: `Vai <b>${pname('lan')}</b>. TTMS và <b>${pname('binh')}</b> ký thẩm định BM-09 song song; Không đồng ý thì hồ sơ về ĐVĐX hoàn chỉnh.` },
      { enter: () => scene('MS01.03', '3-6'), sel: act('Phê duyệt'), title: 'Bước 60 — Thủ trưởng phê duyệt',
        text: `Vai <b>${pname('tgd')}</b>. Phê duyệt trên tờ trình BM-09, hoặc Yêu cầu hoàn chỉnh.` }] },

    { n: 10, name: 'Điều chỉnh đề xuất mua sắm (MS02)', who: 'Chuyên quản ĐVĐX, TTMS', doc: 'ĐXMS-2026-0103', steps: [
      { enter: () => scene('MS02', 'A1'), sel: ['.vcard h3', 'Điều chỉnh'], title: 'Tạo hồ sơ điều chỉnh',
        text: 'Từ ĐXMS đã phê duyệt (ĐXMS-2026-0103), nút <b>Điều chỉnh ĐXMS</b> mở màn này: khối <b>Điều chỉnh</b> ghi lần điều chỉnh, giá trị trước điều chỉnh, lý do; các khối còn lại sao chép từ ĐXMS cũ, sửa được.' },
      { sel: '#lf-adjReason', title: 'Lý do điều chỉnh', text: 'Nhập lý do điều chỉnh rồi <b>Lưu</b> để bắt đầu hồ sơ điều chỉnh (quy trình MS02).' },
      { enter: () => scene('MS02', 'A2'), sel: ['.vcard h3', 'Lịch sử điều chỉnh'], title: 'Bước 4 — Phạm vi, giá trị trước – sau',
        text: `Vai <b>${pname('minh')}</b>. Xác nhận lý do, phạm vi, giá trị và bảng trước – sau. Thẻ <b>Lịch sử điều chỉnh</b> cho thấy chuỗi ĐXMS gốc và các lần điều chỉnh.` },
      { enter: () => scene('MS02', 'A4'), sel: act('Không báo cáo TGĐ Tập đoàn'), title: 'Bước 48 — MS02.02',
        text: 'Giá trị sau điều chỉnh vẫn trên ngưỡng, căn cứ cũ đã được phê duyệt → <b>MS02.02</b>, lựa chọn không báo cáo Tập đoàn chọn sẵn. Giá trị giảm xuống dưới ngưỡng thì đi MS02.03 (BM-09), tăng lên trên ngưỡng thì MS02.01 (báo cáo Tập đoàn).' },
      { enter: () => scene('MS02', 'A6'), sel: ['.vcard h3', 'Lịch sử điều chỉnh'], title: 'Tổng kết — ĐXMS điều chỉnh',
        text: 'Phê duyệt xong, điều chỉnh tạo <b>ĐXMS mới</b> (điều chỉnh lần 1); ĐXMS cũ giữ nguyên, hai bản nối nhau trong Lịch sử điều chỉnh.' }] },
  ];

  /* ---------- Tour — tab Khoản đầu tư (T83; bộ demo MS13, KĐT-2026-0032 / 0031) ---------- */
  const TOURS_KDT = [
    { n: 1, name: 'Khởi tạo khoản đầu tư, phân luồng', who: 'Chuyên quản ĐVĐX, Ban Tài chính, TTMS', doc: 'KĐT-2026-0032', steps: [
      { enter: () => scene('MS13', 'K1'), sel: '[data-vsel="k-nv"]', title: 'Thêm mới khoản đầu tư',
        text: 'Menu <b>Quản lý khoản đầu tư &gt; Khoản đầu tư</b>, Thêm mới: chọn đề tài / dự án căn cứ, hệ thống bóc tách hạng mục như ĐXMS.' },
      { sel: '#k-est', title: 'Thông tin chung KĐT', text: 'Tổng mức vốn sơ bộ, thời gian, hình thức đầu tư… quyết định cấp thẩm quyền và quy trình của KĐT.' },
      { sel: '#k-save', title: 'Lưu', text: '<b>Lưu</b> để tạo KĐT và hồ sơ chủ trương (quy trình MS13).' },
      { enter: () => scene('MS13', 'K2'), sel: actPrimary, title: 'Bước 7 — Tồn kho, báo giá',
        text: `Vai <b>${pname('minh')}</b>. Kết quả rà soát tồn kho và báo giá đi như ĐXMS (tour 2, 3 mục Đề xuất mua sắm).` },
      { enter: () => scene('MS13', 'K3'), sel: act('Xác nhận OK'), title: 'Bước 11 — Xác nhận song song',
        text: `Vai <b>${pname('thu')}</b>. Ban Tài chính và TTMS xác nhận song song; hệ thống xác định thẩm quyền và phân luồng (vượt ngưỡng thì chuyển MS14).` }] },
    { n: 2, name: 'Chủ trương đầu tư BM-01', who: 'Chuyên quản ĐVĐX, CQCM, TTMS', doc: 'KĐT-2026-0032', steps: [
      { enter: () => scene('MS13', 'K4'), sel: act('Hoàn thành dự thảo'), title: 'Bước 15 — Dự thảo chủ trương',
        text: `Vai <b>${pname('minh')}</b>. Dự thảo tờ trình chủ trương <b>BM-01</b>, chọn cơ quan chuyên môn thẩm định rồi trình.` },
      { enter: () => scene('MS13', 'K5'), sel: ['.vcard h3', 'Thẩm định của cơ quan chuyên môn'], title: 'Bước 27 — Thẩm định chủ trương',
        text: `Vai <b>${pname('lan')}</b>. Các CQCM ghi ý kiến theo từng mục; chưa thống nhất thì ĐVĐX giải trình, quá số vòng thì họp.` },
      { sel: act('Hoàn thành thẩm định'), title: 'Hoàn thành thẩm định', text: 'Hoàn thành vòng thẩm định BM-01 để sang ký chủ trương.' },
      { enter: () => scene('MS13', 'K6'), sel: act('Ký thẩm định trên tờ trình'), title: 'Bước 47 — Ký chủ trương',
        text: 'Ký thẩm định trên tờ trình BM-01 (VOffice; hồ sơ Mật ký bản cứng). Chủ trương được duyệt → KĐT <b>Đã phê duyệt chủ trương</b>.' }] },
    { n: 3, name: 'Hồ sơ phê duyệt khoản đầu tư BM-03', who: 'Chuyên quản, Chỉ huy ĐVĐX, TTMS', doc: 'KĐT-2026-0032', steps: [
      { enter: () => scene('MS13', 'K7'), sel: act('Hoàn thành hồ sơ phê duyệt KĐT'), title: 'Bước 50 — Hồ sơ KĐT BM-03',
        text: `Vai <b>${pname('minh')}</b>. Hồ sơ phê duyệt KĐT kế thừa chủ trương đã duyệt: tờ trình <b>BM-03</b> và Checklist 02, thẩm định vòng BM-03.` },
      { enter: () => scene('MS13', 'K8'), sel: act('Ký tờ trình phê duyệt KĐT'), title: 'Bước 56 — Ký tờ trình',
        text: `Vai <b>${pname('hai')}</b>. Ký tờ trình BM-03; TTMS lập báo cáo <b>BM-14</b>, Tổng Giám đốc ký Quyết định <b>BM-18</b>.` },
      { enter: () => scene('MS13', 'K10'), sel: ['.vcard h3', 'Danh sách hồ sơ'], title: 'Tổng kết — Chi tiết KĐT',
        text: 'Chi tiết khoản đầu tư: bóc tách hạng mục và <b>Danh sách hồ sơ</b> (chủ trương, phê duyệt KĐT) — mở từng hồ sơ để xem tài liệu, BPMN.' }] },
    { n: 4, name: 'Hồ sơ gộp chủ trương và KĐT (BM-00)', who: 'Chuyên quản ĐVĐX', doc: 'KĐT-2026-0031', steps: [
      { enter: () => scene('MS13', 'K9'), sel: act('Hoàn thành dự thảo BM-00'), title: 'Bước 19 — Dự thảo BM-00',
        text: `KĐT-2026-0031 đủ điều kiện gộp: vai <b>${pname('minh')}</b> lập một tờ trình <b>BM-00</b> cho cả chủ trương và phê duyệt KĐT, thẩm định một vòng.` },
      { sel: ['.vcard h3', 'Văn bản đầu ra'], title: 'Văn bản đầu ra', text: 'Văn bản bước sinh ra (dự thảo BM-00) xem trước, tải về ở thẻ <b>Văn bản đầu ra</b>.' },
      { sel: ['.vcard h3', 'Lịch sử hồ sơ'], title: 'Lịch sử hồ sơ', text: 'Các bước đã xử lý của hồ sơ gộp, ai xử lý, khi nào. Sau thẩm định, Tổng Giám đốc VHT duyệt hồ sơ gộp (không đồng ý thì về sửa BM-00).' }] },
  ];
  /* id = <tab>-<n>; tab = cụm tính năng hiện ở hộp Hướng dẫn. */
  const TABS = [
    { key: 'dxms', name: 'Đề xuất mua sắm', tours: TOURS },
    { key: 'kdt', name: 'Khoản đầu tư', tours: TOURS_KDT },
  ];
  TABS.forEach((tb) => tb.tours.forEach((t) => { t.tab = tb.key; t.id = `${tb.key}-${t.n}`; t.doc = t.doc || D.dxmsCode0; }));
  const ALL = TABS.flatMap((tb) => tb.tours);
  const tourOf = (id) => ALL.find((t) => t.id === (/^\d+$/.test(String(id)) ? 'dxms-' + id : String(id)));
  const TAB_KEY = 'dtms-tour-tab';
  let TAB_MEM = null;
  const curTab = () => { let k = TAB_MEM; try { k = localStorage.getItem(TAB_KEY) || k; } catch (e) { /* bỏ qua */ } return TABS.some((t) => t.key === k) ? k : TABS[0].key; };
  const setTab = (k) => { TAB_MEM = k; try { localStorage.setItem(TAB_KEY, k); } catch (e) { /* không lưu được: giữ trong phiên */ } };

  /* ---------- Chạy tour ---------- */
  let cur = null; /* { t: tour, i: chỉ số bước, scrolled } */
  let timer = null;
  let layer = null;

  function ensureLayer() {
    if (layer && document.body.contains(layer)) return layer;
    layer = document.createElement('div');
    layer.className = 'tour-layer';
    layer.innerHTML = '<div class="tour-ring"></div><div class="tour-pop" role="dialog" aria-live="polite"></div>';
    document.body.appendChild(layer);
    layer.addEventListener('click', onClick);
    return layer;
  }
  const running = () => !!cur;
  const busy = () => (Flow.state.history || []).some((h) => h.who) && !cur;

  function start(n, opts) {
    const t = tourOf(n);
    if (!t) return false;
    const go0 = () => { stop(); cur = { t, i: -1 }; ensureLayer(); next(); timer = setInterval(tick, 250); };
    if (opts && opts.force) { go0(); return true; }
    if (busy()) {
      const m = window.UI.modal(`<div class="modal-h"><h3>Bắt đầu tour "${esc(t.name)}"?</h3></div>
        <div class="modal-b">Tour đưa hồ sơ demo ${esc(t.doc)} tới bước cần xem. Hồ sơ đang chạy dở trên máy này sẽ được thay bằng trạng thái của tour.</div>
        <div class="modal-f"><button class="btn secondary" data-close>Huỷ</button><button class="btn primary" id="tour-go">Bắt đầu</button></div>`);
      m.el.classList.add('tour-confirm');
      m.el.querySelector('#tour-go').onclick = () => { m.close(); go0(); };
      return true;
    }
    go0();
    return true;
  }
  function stop() {
    cur = null;
    if (timer) clearInterval(timer);
    timer = null;
    if (layer) layer.remove();
    layer = null;
  }
  function next() {
    if (!cur) return;
    cur.i += 1;
    if (cur.i >= cur.t.steps.length) { finish(); return; }
    const s = cur.t.steps[cur.i];
    cur.scrolled = false;
    if (s.enter) { try { s.enter(); } catch (e) { /* bước vẫn hiện, popover báo không thấy phần tử */ } }
    tick();
  }
  function prev() {
    if (!cur || cur.i <= 0) return;
    /* Lùi về bước gần nhất có enter (dựng lại màn), rồi tiến tới bước trước bước hiện tại. */
    const target = cur.i - 1;
    let k = target;
    while (k > 0 && !cur.t.steps[k].enter) k -= 1;
    cur.i = k - 1;
    next();
    while (cur && cur.i < target) { const s = cur.t.steps[cur.i]; if (s.do) s.do(); cur.i += 1; cur.scrolled = false; }
    tick();
  }
  function finish() {
    const t = cur.t, tb = TABS.find((x) => x.key === t.tab), nx = tb.tours.find((x) => x.n === t.n + 1);
    stop();
    const m = window.UI.modal(`<div class="modal-h"><h3>Xong tour ${t.n}: ${esc(t.name)}</h3></div>
      <div class="modal-b">${nx ? `Tour tiếp theo: <b>${nx.n}. ${esc(nx.name)}</b>.` : `Đã xem hết tour của mục ${esc(tb.name)}.`} Mở lại danh sách tour bằng nút <b>Hướng dẫn</b> trên thanh trên cùng.</div>
      <div class="modal-f"><button class="btn secondary" data-close>Đóng</button>${nx ? `<button class="btn primary" id="tour-next">Tour tiếp theo</button>` : ''}</div>`);
    m.el.classList.add('tour-done');
    const b = m.el.querySelector('#tour-next');
    if (b) b.onclick = () => { m.close(); start(nx.id, { force: true }); };
  }

  function tick() {
    if (!cur) return;
    ensureLayer();
    layer.classList.toggle('off', hidden());
    const s = cur.t.steps[cur.i];
    if (s.wait && s.wait()) { next(); return; }
    const el = find(s.sel);
    if (el && !cur.scrolled) { el.scrollIntoView({ block: 'center', inline: 'nearest' }); cur.scrolled = true; }
    place(s, el);
  }

  function place(s, el) {
    const ring = layer.querySelector('.tour-ring'), pop = layer.querySelector('.tour-pop');
    const last = cur.i === cur.t.steps.length - 1;
    const html = `<div class="tp-h"><span class="tp-n">${cur.t.n}</span><b>${esc(cur.t.name)}</b><span class="tp-c">${cur.i + 1} / ${cur.t.steps.length}</span></div>
      <div class="tp-t">${esc(s.title)}</div><div class="tp-b">${s.text}${el ? '' : '<div class="tp-miss">Không thấy phần tử cần chỉ — màn này có thể đã thay đổi. Bấm Tiếp để đi tiếp.</div>'}</div>
      <div class="tp-f"><button type="button" class="tp-x" data-tour="stop">Thoát</button><span class="sp"></span>
        ${cur.i > 0 ? '<button type="button" class="btn sm secondary" data-tour="prev">Quay lại</button>' : ''}
        ${s.wait && s.do ? '<button type="button" class="btn sm secondary" data-tour="do">Làm hộ</button>' : ''}
        <button type="button" class="btn sm primary" data-tour="next">${last ? 'Kết thúc' : 'Tiếp'}</button></div>`;
    const sig = `${cur.t.id}:${cur.i}:${!!el}`;
    if (pop.dataset.sig !== sig) { pop.innerHTML = html; pop.dataset.sig = sig; }
    pop.dataset.step = String(cur.i + 1);
    layer.dataset.tour = cur.t.id;
    const W = innerWidth, H = innerHeight, pw = Math.min(360, W - 32);
    pop.style.width = pw + 'px';
    if (!el) { ring.style.display = 'none'; pop.style.left = Math.round((W - pw) / 2) + 'px'; pop.style.top = Math.round(H / 2 - pop.offsetHeight / 2) + 'px'; pop.classList.add('center'); return; }
    pop.classList.remove('center');
    const r = el.getBoundingClientRect(), pad = 6;
    Object.assign(ring.style, { display: 'block', left: r.left - pad + 'px', top: r.top - pad + 'px', width: r.width + pad * 2 + 'px', height: r.height + pad * 2 + 'px' });
    const ph = pop.offsetHeight;
    let top = r.bottom + 14;
    if (top + ph > H - 8) top = r.top - ph - 14;
    if (top < 8) top = Math.min(H - ph - 8, Math.max(8, r.top + 8));
    const left = Math.max(16, Math.min(W - pw - 16, r.left + r.width / 2 - pw / 2));
    pop.style.left = Math.round(left) + 'px';
    pop.style.top = Math.round(top) + 'px';
  }

  function onClick(e) {
    const b = e.target.closest('[data-tour]');
    if (!b || !cur) return;
    const k = b.dataset.tour, s = cur.t.steps[cur.i];
    if (k === 'stop') stop();
    else if (k === 'next') { if (s.wait && s.do && !s.wait()) s.do(); next(); }
    else if (k === 'prev') prev();
    else if (k === 'do' && s.do) { s.do(); setTimeout(tick, 50); }
  }

  /* ---------- Danh sách tour, hộp chào, bật / tắt ---------- */
  function listHtml() {
    const k = curTab(), tb = TABS.find((x) => x.key === k);
    return `<nav class="tabs tour-tabs" role="tablist">${TABS.map((x) => `<button type="button" class="tab ${x.key === k ? 'on' : ''}" role="tab" aria-selected="${x.key === k}" data-tour-tab="${x.key}">${esc(x.name)}</button>`).join('')}</nav>`
      + `<ol class="tour-list">${tb.tours.map((t) => `<li><button type="button" data-tour-start="${t.id}"><span class="n">${t.n}</span><span class="l"><b>${esc(t.name)}</b><span>${esc(t.who)} · ${t.steps.length} bước</span></span></button></li>`).join('')}</ol>`;
  }
  function menu() {
    /* Không mở chồng: đang có danh sách tour thì giữ cái đó. */
    const open0 = document.querySelector('.overlay.tour-menu');
    if (open0) return { el: open0, close: () => open0.remove() };
    const m = window.UI.modal(`<div class="modal-h"><h3>Hướng dẫn theo tác vụ</h3></div>
      <div class="modal-b"><p class="tour-note">Chọn nhóm chức năng rồi chọn tác vụ muốn xem. Tour đưa hồ sơ demo tới đúng bước và chỉ từng chỗ cần bấm. Đây là công cụ của prototype, không có trong hệ thống thật.</p><div class="tour-body">${listHtml()}</div></div>
      <div class="modal-f"><label class="check tour-auto"><input type="checkbox" data-tour-auto ${enabled() ? 'checked' : ''}> Tự hiện danh sách tour mỗi lần mở prototype</label><button class="btn secondary" data-close>Đóng</button></div>`);
    m.el.classList.add('tour-menu');
    m.el.addEventListener('click', (e) => {
      const s = e.target.closest('[data-tour-start]');
      if (s) { m.close(); start(s.dataset.tourStart); return; }
      const tb = e.target.closest('[data-tour-tab]');
      if (tb) { setTab(tb.dataset.tourTab); m.el.querySelector('.tour-body').innerHTML = listHtml(); }
    });
    m.el.addEventListener('change', (e) => { const c = e.target.closest('[data-tour-auto]'); if (c) setOn(c.checked); });
    return m;
  }
  /* on = tự hiện danh sách tour mỗi lần mở prototype (bản gửi khách). Nút Hướng dẫn luôn hiện — người dùng góp ý 05/11: tắt mà mất hẳn nút là khó hiểu. */
  function setOn(on) { const p = Object.assign({}, pref() || MEM || {}, { on, seen: true }); setPref(p); window.App.render(); }
  const topBtn = () => '<button class="tour-btn" id="tour-btn" title="Hướng dẫn theo tác vụ (công cụ của prototype)">Hướng dẫn</button>';
  const demoRow = () => `<h4>Hướng dẫn (tour)</h4><div class="row"><button class="btn sm secondary" data-tour-menu>Danh sách tour</button><label class="check sm"><input type="checkbox" data-tour-auto ${enabled() ? 'checked' : ''}> Tự hiện khi mở</label></div>`;

  document.addEventListener('click', (e) => {
    if (e.target.closest('#tour-btn')) { menu(); return; }
    if (e.target.closest('[data-tour-menu]')) menu();
  });
  document.addEventListener('change', (e) => { const c = e.target.closest('.demo-panel [data-tour-auto]'); if (c) setOn(c.checked); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && cur && !document.querySelector('.overlay')) stop(); });
  addEventListener('resize', () => tick());
  addEventListener('hashchange', () => setTimeout(tick, 0));

  /* Khởi động: ?tour=n mở thẳng; bản gửi khách hiện danh sách tour mỗi lần mở, trừ khi người xem bỏ chọn "Tự hiện". */
  let booted = false;
  function boot() {
    if (booted) return;
    booted = true;
    const m = /[?&]tour=([\w-]+)/.exec(location.search);
    if (m && !document.body.classList.contains('cap')) { setTimeout(() => start(m[1]), 0); return; }
    const p = pref();
    if (release() && (!p || p.on !== false) && !document.body.classList.contains('cap')) setTimeout(menu, 300);
  }

  window.Tour = { TOURS, TABS, ALL, start, stop, running, menu, topBtn, demoRow, enabled, setOn, boot, _reboot: () => { booted = false; boot(); }, state: () => (cur ? { tour: cur.t.n, id: cur.t.id, step: cur.i + 1, total: cur.t.steps.length } : null) };
})();
