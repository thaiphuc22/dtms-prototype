/* Quản lý hợp đồng theo Backlog W1_T10 (T16 B3, plan docs/dtms/prototype-W1T10-backlog-chuan-bi.md §2k). Màn tĩnh; riêng HĐ-2026-0052 chạy luồng (T25, D-48): dữ liệu lấy từ hồ sơ con (live()). 
   Hợp đồng là đối tượng cha (như KHLCNT): hình thành từ KQLCNT của gói thầu (MS22 bước 1) hoặc nhập từ dữ liệu cũ (Backlog 427).
   Vòng đời theo BPMN-DTMS 07/10: MS22 Thương thảo & ký → MS23 Theo dõi thực hiện (.01 Văn bản phát sinh, .02 Bàn giao, .03 Nghiệm thu, .04 Thanh lý) → MS24 Thanh toán theo đợt.
   SCR-84 #/hop-dong, SCR-85 #/hop-dong/create[/<mã gói>], SCR-86 #/hop-dong/<mã>, SCR-87 #/thoa-thuan-khung[/<mã>]. */
(function () {
  const D = window.D, Flow = window.Flow, S = window.Screens;
  const { esc, icon, ty, vSelect, badge, toast, vModal, persona } = window.UI;
  const rerender = () => window.App.render();
  const head = (o) => S.head(o);
  const K = () => window.Thau.kit;
  const T = () => window.Thau;
  const TODAY = '07/10/2026';
  const dk = (s) => { const [d, m, y] = String(s || '').split('/'); return y ? `${y}${m}${d}` : ''; };
  const days = (a, b) => { const p = (s) => { const [d, m, y] = s.split('/').map(Number); return new Date(y, m - 1, d).getTime(); }; return Math.round((p(b) - p(a)) / 86400000); };
  const r2 = (n) => Math.round(n * 1000) / 1000;
  const m3 = (v) => (v == null ? K().dash : ty(v, 2));

  const HD_ST = { TT: ['Đang thương thảo', 'info'], KY: ['Đang trình ký', 'warning'], TH: ['Đang thực hiện', 'success'], TL: ['Đang thanh lý', 'warning'], DONG: ['Đã thanh lý', 'default'], CD: ['Chấm dứt', 'error'] };
  const HD_STEP = { TT: 'MS22 · Thương thảo, soạn thảo hợp đồng', KY: 'MS22 · Trình ký hợp đồng', TH: 'MS23 · Theo dõi thực hiện hợp đồng', TL: 'MS23.04 · Thanh lý hợp đồng', DONG: 'Kết thúc', CD: 'Kết thúc' };
  const SRC_HD = { KQ: 'Từ KQLCNT', TTR: 'Từ tờ trình / ĐXMS đã phê duyệt (theo đề xuất)', IMPORT: 'Nhập từ dữ liệu cũ' };

  /* ---------- Dữ liệu mẫu ----------
     Tiền: tỷ đồng (đã gồm thuế GTGT). items: [tên, ĐVT, số lượng, đơn giá (tỷ đồng), hạng mục gói thầu tương ứng]. */
  const H0 = [
    { code: 'HĐ-2026-0052', src: 'KQ', pkg: 'GT-2026-0021', mau: '1.6', title: 'Hợp đồng cung cấp dây chuyền lắp ráp bo mạch trạm thu phát', ncc: 'NCC-000009',
      jv: [['NCC-000009', 'Thành viên đứng đầu — cung cấp thiết bị', 82], ['NCC-000011', 'Thành viên — lắp đặt, chuyển giao', 18]],
      type: 'TRON_GOI', form: 'DTRR', value: 191.2, cap: 195.0, cur: 'VND', vat: 10, unit: 'Nhà máy sản xuất thử nghiệm', owner: 'Phan Văn Lộc', st: 'TT', held: 'Tạm dừng ký hợp đồng đến khi có văn bản giải quyết kiến nghị về KQLCNT (07/10/2026).',
      created: '05/10/2026', updated: '07/10/2026', exec: '210 ngày kể từ ngày hợp đồng có hiệu lực',
      items: [['Máy gắn linh kiện tốc độ cao', 'Máy', 4, 24.5], ['Lò hàn đối lưu 10 vùng nhiệt', 'Máy', 2, 9.3], ['Máy kiểm tra quang học tự động (AOI)', 'Máy', 2, 11.8], ['Máy kiểm tra X-ray 3D', 'Máy', 1, 51.0]],
      neg: { rounds: [['1', '06/10/2026', 'Phụ lục kỹ thuật (đơn vị sử dụng) và body, phụ lục giá (Phòng Hợp đồng)', 'Danh mục, cấu hình thiết bị; đơn giá theo HSDT; điều kiện thanh toán', 'Tiến độ giao hàng đợt 2; thời gian bảo hành lò hàn', 'BB-TT01-HĐ-2026-0052.pdf'],
        ['2', '07/10/2026', 'Thương thảo qua email về tiến độ và bảo hành', 'Tiến độ giao hàng đợt 2: 210 ngày', 'Bảo hành lò hàn: nhà thầu đề xuất 18 tháng (HSMT yêu cầu tối thiểu 24 tháng)', '']],
        check: [['KQLCNT', 'Giá hợp đồng bằng giá trúng thầu 191,20 tỷ đồng', 'Khớp'], ['KQLCNT', 'Phạm vi 4 hạng mục bằng phạm vi gói thầu', 'Khớp'], ['HSMT', 'Bảo hành thiết bị tối thiểu 24 tháng — dự thảo ghi 18 tháng cho lò hàn', 'Lệch'],
          ['HSDT trúng thầu', 'Tiến độ cam kết 240 ngày — dự thảo 210 ngày (rút ngắn)', 'Khớp'], ['KQLCNT', 'Loại hợp đồng Trọn gói', 'Khớp']],
        ai: ['Chưa đạt', 'Dự thảo v2 có 01 điều khoản trái HSMT (bảo hành lò hàn 18 tháng). Đề nghị thương thảo lại với nhà thầu trước khi trình ký nháy.'],
        versions: [['v1', '06/10/2026', 'Dự thảo theo mẫu hợp đồng mua sắm thiết bị (theo loại HĐ Trọn gói)', 'Phòng Hợp đồng'], ['v2', '07/10/2026', 'Cập nhật sau thương thảo vòng 2', 'Phòng Hợp đồng']],
        diff: [['Điều 5 — Tiến độ giao hàng đợt 2', '240 ngày kể từ ngày hợp đồng có hiệu lực', '210 ngày kể từ ngày hợp đồng có hiệu lực'], ['Điều 9 — Bảo hành lò hàn đối lưu', '24 tháng kể từ ngày nghiệm thu', '18 tháng kể từ ngày nghiệm thu']],
        sign: [] } },
    { code: 'HĐ-2025-0187', mau: '10', src: 'IMPORT', pkgText: 'GT-2025-0161', khText: 'KHLCNT-2025-0044', originText: 'ĐXMS-2025-0213', title: 'Hợp đồng cung cấp máy phân tích phổ và máy phân tích mạng vector', ncc: 'NCC-000008',
      type: 'TRON_GOI', form: 'DTRR', value: 45.6, cap: 47.0, cur: 'EUR', fx: 27450, vat: 10, unit: 'Phòng Chất lượng', owner: 'Bùi Minh Quang', st: 'TH', esign: false, no: '187/2025/HĐMB-VHT',
      sign: '15/12/2025', eff: '22/12/2025', end: '30/11/2026', created: '12/12/2025', updated: '05/09/2026', exec: '11 tháng kể từ ngày hợp đồng có hiệu lực',
      items: [['Máy phân tích phổ 50 GHz', 'Máy', 3, 6.2], ['Máy phân tích mạng vector 4 cổng', 'Máy', 2, 9.8], ['Bộ hiệu chuẩn điện tử', 'Bộ', 2, 1.5], ['Lắp đặt, đào tạo vận hành', 'Gói', 1, 4.4]],
      ms: [['Giao đợt 1: máy phân tích phổ', '30/04/2026', '28/04/2026', 40], ['Giao đợt 2: máy phân tích mạng vector, bộ hiệu chuẩn', '30/08/2026', null, 50], ['Lắp đặt, đào tạo vận hành', '30/10/2026', null, 10], ['Nghiệm thu tổng thể', '15/11/2026', null, 0]],
      dl: [['BG-01', 'Đợt 1', '30/04/2026', '28/04/2026', 'Phòng đo RF — Khu CNC Hòa Lạc', 'Máy phân tích phổ 50 GHz × 3', 'Đạt'], ['BG-02', 'Đợt 2', '30/08/2026', null, 'Phòng đo RF — Khu CNC Hòa Lạc', 'Máy phân tích mạng vector × 2; Bộ hiệu chuẩn × 2', null]],
      acc: [['NT-01', 'Đợt 1', '10/05/2026', 'Máy phân tích phổ 50 GHz × 3', 18.6, 'Đạt', '']],
      guar: [['BL_NH', 4.56, 10, '20/12/2025', '31/10/2026', 'Deutsche Bank AG — Chi nhánh Singapore']], adv: [['BL_NH', 13.68, '20/12/2025', '31/08/2026', 'Deutsche Bank AG — Chi nhánh Singapore', 'Đã hết hạn — đã thu hồi một phần tạm ứng']],
      warr: [['Máy phân tích phổ 50 GHz × 3', '24 tháng', '10/05/2026', '10/05/2028', 'Sửa chữa, thay thế trong 07 ngày làm việc']],
      plan: [['Tạm ứng', 'Ký hợp đồng và nộp bảo lãnh tạm ứng', 30, 13.68], ['Thanh toán đợt 1', 'Nghiệm thu đợt 1', 40, 18.6], ['Thanh toán đợt 2', 'Nghiệm thu đợt 2', 50, 22.6], ['Thanh toán cuối', 'Nghiệm thu tổng thể, hết hạn bảo hành phần giữ lại', 10, 4.4]],
      pays: [['TT-2026-0031', 'Tạm ứng', null, 13.68, 0, 0, 0, 'PAID', '05/01/2026'], ['TT-2026-0118', 'Thanh toán đợt 1', 'NT-01', 18.6, 5.58, 0, 0.93, 'PAID', '05/06/2026']],
      docs: [['Biên bản làm việc', 'BBLV-HĐ0187-02', '05/09/2026', 'Làm việc với nhà thầu về chậm giao đợt 2: nhà thầu nêu lý do chờ giấy phép xuất khẩu, cam kết giao trước 15/10/2026', null, 'Đã ký'],
        ['Biên bản phạt', 'BBP-HĐ0187-01', '07/10/2026', 'Phạt chậm giao đợt 2: 0,1%/ngày × 38 ngày × 22,60 tỷ đồng (tối đa 8% giá trị phần chậm)', -0.859, 'Dự thảo']],
      penalty: [['Phạt chậm tiến độ giao đợt 2', 0.859, 'Khấu trừ khi thanh toán đợt 2', 'Chưa khấu trừ']] },
    { code: 'HĐ-2026-0012', mau: '1.1', src: 'IMPORT', pkgText: 'GT-2026-0007', khText: 'KHLCNT-2026-0003', originText: 'ĐXMS-2025-0198', title: 'Hợp đồng cung cấp thiết bị mạng cho phòng lab kiểm thử 5G', ncc: 'NCC-000003',
      type: 'DG_DC', form: 'DTHC', value: 30.5, value0: 28.4, cap: 32.0, cur: 'VND', vat: 10, unit: 'Trung tâm Mạng lõi', owner: 'Đặng Thu Trang', st: 'TH', esign: true, no: '012/2026/HĐMB-VHT',
      sign: '20/03/2026', eff: '20/03/2026', end: '31/01/2027', end0: '31/12/2026', created: '16/03/2026', updated: '03/10/2026', exec: '10 tháng 11 ngày (sau Phụ lục 01)',
      items: [['Switch lõi 400G', 'Bộ', 5, 2.1], ['Router biên 100G', 'Bộ', 2, 4.5], ['Bộ phát lưu lượng kiểm thử', 'Bộ', 2, 5.5]],
      ms: [['Giao đợt 1: switch lõi, router biên', '30/05/2026', '25/05/2026', 45], ['Giao đợt 2: bộ phát lưu lượng', '30/09/2026', '26/09/2026', 36], ['Giao switch bổ sung (Phụ lục 01)', '30/11/2026', null, 7], ['Nghiệm thu tổng thể', '20/12/2026', null, 12]],
      dl: [['BG-01', 'Đợt 1', '30/05/2026', '25/05/2026', 'Lab 5G — Tòa nhà VHT, Hòa Lạc', 'Switch lõi 400G × 4; Router biên 100G × 2', 'Đạt'], ['BG-02', 'Đợt 2', '30/09/2026', '26/09/2026', 'Lab 5G — Tòa nhà VHT, Hòa Lạc', 'Bộ phát lưu lượng kiểm thử × 2', 'Không đạt 01 bộ'], ['BG-03', 'Bổ sung', '30/11/2026', null, 'Lab 5G — Tòa nhà VHT, Hòa Lạc', 'Switch lõi 400G × 1', null]],
      acc: [['NT-01', 'Đợt 1', '05/06/2026', 'Switch lõi × 4; Router biên × 2', 17.4, 'Đạt', ''], ['NT-02', 'Đợt 2', '03/10/2026', 'Bộ phát lưu lượng × 2', 11.0, 'Chưa đạt', '01 bộ lỗi cổng 100G số 3 — nhà thầu thay thế trong 07 ngày, nghiệm thu lại']],
      guar: [['BL_NH', 1.525, 5, '18/03/2026', '28/02/2027', 'Ngân hàng TMCP Quân đội']], warr: [['Thiết bị đợt 1', '12 tháng', '05/06/2026', '05/06/2027', 'Đổi mới thiết bị lỗi phần cứng']],
      plan: [['Thanh toán đợt 1', 'Nghiệm thu đợt 1', 57, 17.4], ['Thanh toán đợt 2', 'Nghiệm thu đợt 2', 36, 11.0], ['Thanh toán đợt 3', 'Nghiệm thu tổng thể (gồm thiết bị bổ sung)', 7, 2.1]],
      pays: [['TT-2026-0109', 'Thanh toán đợt 1', 'NT-01', 17.4, 0, 0, 0, 'PAID', '25/06/2026']],
      docs: [['Phụ lục hợp đồng', 'PL01/012/2026', '05/08/2026', 'Bổ sung 01 switch lõi 400G cho mở rộng phòng lab; gia hạn thời gian thực hiện 31 ngày', 2.1, 'Đã ký'],
        ['Biên bản làm việc', 'BBLV-HĐ0012-01', '03/10/2026', 'Thống nhất phương án thay thế bộ phát lưu lượng lỗi cổng 100G', null, 'Đã ký']],
      annex: [['Giá trị hợp đồng', '28,40 tỷ đồng', '30,50 tỷ đồng'], ['Switch lõi 400G — số lượng', '4 bộ', '5 bộ'], ['Ngày kết thúc hợp đồng', '31/12/2026', '31/01/2027']] },
    /* T67 dữ liệu demo: hợp đồng theo mẫu 1.8 (10 / 90, có tạm ứng — đã nghiệm thu chưa lập hồ sơ thanh toán) và 7.2 (100, không tạm ứng — giao hàng chậm). */
    { code: 'HĐ-2026-0058', src: 'IMPORT', mau: '1.8', pkgText: 'GT-2026-0019', khText: 'KHLCNT-2026-0008', originText: 'ĐXMS-2026-0061', title: 'Hợp đồng mở rộng bản quyền phần mềm điều khiển đo', ncc: 'NCC-000001',
      type: 'DG_CD', form: 'MSTT', value: 12.3, cap: 12.5, cur: 'VND', vat: 10, unit: 'Trung tâm Vô tuyến', owner: 'Trần Đức Hải', st: 'TH', esign: true, no: '058/2026/HĐMB-VHT',
      sign: '05/09/2026', eff: '05/09/2026', end: '05/12/2026', created: '28/08/2026', updated: '01/10/2026', exec: '30 ngày kể từ ngày hợp đồng có hiệu lực',
      items: [['Bản quyền mô-đun đo trường xa', 'Bản quyền', 6, 2.05]],
      ms: [['Bàn giao bản quyền, kích hoạt', '20/09/2026', '18/09/2026', 90], ['Nghiệm thu', '30/09/2026', '29/09/2026', 10]],
      dl: [['BG-01', 'Đợt 1', '20/09/2026', '18/09/2026', 'Phòng đo kiểm — Trung tâm Vô tuyến', 'Bản quyền mô-đun đo trường xa × 6', 'Đạt']],
      acc: [['NT-01', 'Tổng thể', '29/09/2026', 'Toàn bộ bản quyền đã kích hoạt', 12.3, 'Đạt', '']],
      guar: [['BL_NH', 0.37, 3, '04/09/2026', '05/01/2027', 'Ngân hàng TMCP Quân đội']], adv: [['BL_NH', 1.23, '04/09/2026', '31/12/2026', 'Ngân hàng TMCP Quân đội', 'Bảo lãnh tạm ứng 10% giá trị hợp đồng']],
      warr: [['Bản quyền phần mềm (hỗ trợ, cập nhật)', '12 tháng', '29/09/2026', '29/09/2027', 'Cập nhật bản vá trong 30 ngày']],
      pays: [['TT-2026-0231', 'Tạm ứng', null, 1.23, 0, 0, 0, 'PAID', '12/09/2026']], docs: [] },
    { code: 'HĐ-2026-0035', src: 'IMPORT', mau: '7.2', pkgText: 'GT-2026-0015', khText: 'KHLCNT-2026-0006', originText: 'ĐXMS-2026-0058', title: 'Hợp đồng cung cấp bộ nguồn, phụ kiện đo kiểm hiện trường', ncc: 'NCC-000010', noFile: true,
      type: 'TRON_GOI', form: 'CGTT', value: 2.4, cap: 2.6, cur: 'VND', vat: 10, unit: 'Phòng Chất lượng', owner: 'Bùi Minh Quang', st: 'TH', esign: false, no: '035/2026/HĐMB-VHT',
      sign: '20/07/2026', eff: '20/07/2026', end: '30/11/2026', created: '15/07/2026', updated: '05/10/2026', exec: '60 ngày kể từ ngày hợp đồng có hiệu lực',
      items: [['Bộ nguồn di động 2 kW', 'Bộ', 8, 0.18], ['Phụ kiện cáp, giá đỡ', 'Bộ', 8, 0.12]],
      ms: [['Giao hàng đợt 1', '20/08/2026', '18/08/2026', 50], ['Giao hàng đợt 2', '30/09/2026', null, 50]],
      dl: [['BG-01', 'Đợt 1', '20/08/2026', '18/08/2026', 'Kho Phòng Chất lượng', 'Bộ nguồn × 4; phụ kiện × 4', 'Đạt'], ['BG-02', 'Đợt 2', '30/09/2026', null, 'Kho Phòng Chất lượng', 'Bộ nguồn × 4; phụ kiện × 4', null]],
      acc: [], guar: [], warr: [['Bộ nguồn di động', '12 tháng', '18/08/2026', '18/08/2027', 'Đổi mới trong 15 ngày nếu lỗi kỹ thuật']], pays: [], docs: [] },
    { code: 'HĐ-2026-0021', src: 'IMPORT', pkgText: 'GT-2026-0011', khText: 'KHLCNT-2026-0004', originText: 'ĐXMS-2026-0031', title: 'Hợp đồng cung cấp máy chủ, lưu trữ cho phòng lab AI giai đoạn 1', ncc: 'NCC-000001',
      type: 'TRON_GOI', form: 'CGTT', value: 9.6, cap: 10.0, cur: 'VND', vat: 10, unit: 'Trung tâm Phần mềm', owner: 'Lương Thị Hạnh', st: 'TL', esign: true, no: '021/2026/HĐMB-VHT',
      sign: '15/04/2026', eff: '15/04/2026', end: '15/09/2026', created: '10/04/2026', updated: '02/10/2026', exec: '5 tháng',
      items: [['Máy chủ GPU 8 card', 'Máy', 2, 3.6], ['Hệ thống lưu trữ NVMe 200 TB', 'Hệ thống', 1, 2.4]],
      ms: [['Giao hàng, lắp đặt', '30/07/2026', '22/07/2026', 90], ['Nghiệm thu tổng thể', '10/09/2026', '10/09/2026', 10]],
      dl: [['BG-01', 'Đợt 1', '30/07/2026', '22/07/2026', 'Phòng máy chủ — Tòa nhà VHT', 'Máy chủ GPU × 2; Hệ thống lưu trữ × 1', 'Đạt']],
      acc: [['NT-01', 'Tổng thể', '10/09/2026', 'Toàn bộ hạng mục', 9.6, 'Đạt', '']],
      guar: [['BL_NH', 0.48, 5, '12/04/2026', '15/10/2026', 'Ngân hàng TMCP Ngoại thương Việt Nam']], warr: [['Máy chủ GPU, hệ thống lưu trữ', '36 tháng', '10/09/2026', '10/09/2029', 'Hỗ trợ tại chỗ 4 giờ']],
      plan: [['Thanh toán', 'Nghiệm thu tổng thể', 95, 9.12], ['Giữ lại', 'Hết thời hạn bảo hành năm đầu', 5, 0.48]],
      pays: [['TT-2026-0207', 'Thanh toán theo nghiệm thu tổng thể', 'NT-01', 9.6, 0, 0, 0.48, 'SIGN', null]],
      docs: [], liq: { cond: [['Hoàn thành giao hàng, nghiệm thu toàn bộ hạng mục', true], ['Thanh toán đủ giá trị nghiệm thu (trừ phần giữ lại)', false], ['Không còn vi phạm, phạt chưa xử lý', true], ['Nghĩa vụ bảo hành chuyển sang theo dõi riêng', true]],
        file: ['HSTL-2026-0009', '02/10/2026', 'Đang lập — chờ thanh toán đợt cuối (MS24) trước khi ký biên bản thanh lý'], final: 9.6 } },
    { code: 'HĐ-2025-0152', src: 'IMPORT', pkgText: 'GT-2025-0102', khText: 'KHLCNT-2025-0031', originText: 'ĐXMS-2025-0127', title: 'Hợp đồng dịch vụ bảo trì, hiệu chuẩn hệ thống buồng đo anten', ncc: 'NCC-000004',
      type: 'TRON_GOI', form: 'CDT_TT', value: 3.8, cap: 4.0, cur: 'VND', vat: 10, unit: 'Trung tâm Vô tuyến', owner: 'Nguyễn Văn Minh', st: 'DONG', esign: true, no: '152/2025/HĐDV-VHT',
      sign: '05/06/2025', eff: '05/06/2025', end: '05/06/2026', created: '30/05/2025', updated: '20/08/2026', exec: '12 tháng',
      items: [['Bảo trì định kỳ buồng đo (4 quý)', 'Quý', 4, 0.75], ['Hiệu chuẩn hệ thống đo, cấp chứng chỉ', 'Lần', 2, 0.4]],
      ms: [['Bảo trì quý III/2025', '30/09/2025', '26/09/2025', 20], ['Bảo trì quý IV/2025, hiệu chuẩn lần 1', '31/12/2025', '19/12/2025', 30], ['Bảo trì quý I/2026', '31/03/2026', '27/03/2026', 20], ['Bảo trì quý II/2026, hiệu chuẩn lần 2', '05/06/2026', '03/06/2026', 30]],
      dl: [], acc: [['NT-01', 'Quý III/2025', '02/10/2025', 'Bảo trì quý III/2025', 0.75, 'Đạt', ''], ['NT-02', 'Quý IV/2025', '24/12/2025', 'Bảo trì quý IV/2025; hiệu chuẩn lần 1', 1.15, 'Đạt', ''],
        ['NT-03', 'Quý I/2026', '31/03/2026', 'Bảo trì quý I/2026', 0.75, 'Đạt', ''], ['NT-04', 'Quý II/2026', '10/06/2026', 'Bảo trì quý II/2026 (hiệu chuẩn lần 2 không thực hiện do buồng đo đang nâng cấp)', 1.07, 'Đạt', 'Giảm trừ 0,08 tỷ đồng phần hiệu chuẩn lần 2']],
      guar: [['BL_NH', 0.19, 5, '03/06/2025', '05/07/2026', 'Ngân hàng TMCP Quân đội']], warr: [],
      plan: [['Thanh toán theo quý', 'Nghiệm thu từng quý', 100, 3.8]],
      pays: [['TT-2025-0281', 'Quý III/2025', 'NT-01', 0.75, 0, 0, 0, 'PAID', '15/10/2025'], ['TT-2026-0004', 'Quý IV/2025', 'NT-02', 1.15, 0, 0, 0, 'PAID', '08/01/2026'],
        ['TT-2026-0098', 'Quý I/2026', 'NT-03', 0.75, 0, 0, 0, 'PAID', '15/04/2026'], ['TT-2026-0161', 'Quý II/2026 (quyết toán)', 'NT-04', 1.07, 0, 0, 0, 'PAID', '15/08/2026']],
      docs: [['Biên bản làm việc', 'BBLV-HĐ0152-01', '20/05/2026', 'Thống nhất không thực hiện hiệu chuẩn lần 2, giảm trừ giá trị tương ứng khi quyết toán', -0.08, 'Đã ký']],
      liq: { cond: [['Hoàn thành giao hàng, nghiệm thu toàn bộ hạng mục', true], ['Thanh toán đủ giá trị nghiệm thu (trừ phần giữ lại)', true], ['Không còn vi phạm, phạt chưa xử lý', true], ['Nghĩa vụ bảo hành chuyển sang theo dõi riêng', true]],
        file: ['HSTL-2026-0007', '20/08/2026', 'Đã ký biên bản thanh lý — hợp đồng đã đóng'], final: 3.72, closed: '20/08/2026' } },
    /* 17/11 (phuctd7 "mock thêm dữ liệu cho phần Hợp đồng và Thầu"): 5 hợp đồng từ KQLCNT của gói mới (đang trình ký, đang thực hiện đúng / chậm tiến độ,
       đang thanh lý, đã thanh lý) + 9 hợp đồng nhập từ dữ liệu cũ (EUR / USD, chấm dứt do không nộp bảo đảm, phạt chậm giao, bảo đảm sắp hết hạn, hợp đồng sắp hết hạn, nghiệm thu chưa đạt). */
    { code: 'HĐ-2026-0047', src: 'KQ', pkg: 'GT-2026-0049', title: 'Hợp đồng dịch vụ kiểm định, hiệu chuẩn thiết bị đo năm 2026', ncc: 'NCC-000004',
      type: 'DG_CD', form: 'CGTT', value: 5.05, cap: 5.4, cur: 'VND', vat: 10, unit: 'Phòng Chất lượng', owner: 'Bùi Minh Quang', st: 'KY',
      created: '28/09/2026', updated: '06/10/2026', exec: '150 ngày kể từ ngày hợp đồng có hiệu lực',
      items: [['Hiệu chuẩn máy phân tích phổ, máy phát tín hiệu', 'Thiết bị', 46, 0.065], ['Kiểm định thiết bị đo điện, nguồn', 'Thiết bị', 80, 0.02575]],
      neg: { rounds: [['1', '30/09/2026', 'Phụ lục kỹ thuật (Phòng Chất lượng) và body, phụ lục giá (Phòng Hợp đồng)', 'Danh mục 126 thiết bị; đơn giá theo HSĐX; lịch hiệu chuẩn theo quý', '', 'BB-TT01-HĐ-2026-0047.pdf']],
        check: [['KQLCNT', 'Giá hợp đồng bằng giá trúng thầu 5,05 tỷ đồng', 'Khớp'], ['KQLCNT', 'Phạm vi 126 thiết bị bằng phạm vi gói thầu', 'Khớp'], ['HSYC', 'Chứng chỉ hiệu chuẩn có dấu công nhận VILAS', 'Khớp'], ['KQLCNT', 'Loại hợp đồng Theo đơn giá cố định', 'Khớp']],
        ai: ['Đạt', 'Dự thảo khớp KQLCNT, HSYC và hồ sơ đề xuất trúng thầu.'],
        versions: [['v1', '01/10/2026', 'Dự thảo theo mẫu hợp đồng dịch vụ phi tư vấn', 'Phòng Hợp đồng']], diff: [],
        sign: [['Ký soạn thảo', 'Trưởng phòng Hợp đồng', '01/10/2026', '02/10/2026', 'Đã ký'], ['Ký nháy Trung tâm Mua sắm, Đơn vị sử dụng', 'Trung tâm Mua sắm; Phòng Chất lượng', '02/10/2026', '05/10/2026', 'Đã ký'],
          ['Ký hợp đồng', 'Thủ trưởng VHT', '05/10/2026', null, 'Chờ ký']] } },
    { code: 'HĐ-2026-0014', src: 'KQ', pkg: 'GT-2026-0040', title: 'Hợp đồng cung cấp thiết bị truyền dẫn quang DWDM 400G', ncc: 'NCC-000002',
      type: 'TRON_GOI', form: 'DTRR', value: 25.1, cap: 26.4, cur: 'VND', vat: 10, unit: 'Trung tâm Mạng lõi', owner: 'Đặng Thu Trang', st: 'TH', esign: true, no: '014/2026/HĐMB-VHT',
      sign: '28/05/2026', eff: '28/05/2026', end: '31/10/2026', created: '22/05/2026', updated: '04/09/2026', exec: '150 ngày kể từ ngày hợp đồng có hiệu lực',
      items: [['Thiết bị ROADM 400G 20 hướng', 'Bộ', 4, 3.85], ['Card transponder 400G', 'Card', 16, 0.52], ['Phần mềm quản lý mạng quang', 'Bản quyền', 1, 1.38]],
      ms: [['Giao thiết bị ROADM, card transponder', '30/07/2026', '27/07/2026', 60], ['Lắp đặt, cài đặt phần mềm quản lý', '30/08/2026', '04/09/2026', 30], ['Nghiệm thu tổng thể', '15/10/2026', null, 10]],
      dl: [['BG-01', 'Đợt 1', '30/07/2026', '27/07/2026', 'Phòng lab mạng lõi — Tòa nhà VHT, Hòa Lạc', 'ROADM 400G × 4; Card transponder × 16', 'Đạt'],
        ['BG-02', 'Đợt 2', '30/08/2026', '04/09/2026', 'Phòng lab mạng lõi — Tòa nhà VHT, Hòa Lạc', 'Phần mềm quản lý mạng quang × 1', 'Đạt']],
      acc: [['NT-01', 'Đợt 1', '10/08/2026', 'ROADM 400G × 4; Card transponder × 16', 23.72, 'Đạt', '']],
      guar: [['BL_NH', 1.255, 5, '26/05/2026', '30/11/2026', 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam']], adv: [['BL_NH', 2.51, '26/05/2026', '31/10/2026', 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam', 'Bảo lãnh tạm ứng 10% giá trị hợp đồng']],
      warr: [['Thiết bị ROADM, card transponder', '36 tháng', '10/08/2026', '10/08/2029', 'Thay thế card lỗi trong 48 giờ']],
      plan: [['Tạm ứng', 'Ký hợp đồng và nộp bảo lãnh tạm ứng', 10, 2.51], ['Thanh toán đợt 1', 'Nghiệm thu đợt 1 — trừ tạm ứng tương ứng', 60, 15.06], ['Thanh toán đợt 2', 'Nghiệm thu tổng thể — trừ tạm ứng còn lại', 30, 7.53]],
      pays: [['TT-2026-0142', 'Tạm ứng', null, 2.51, 0, 0, 0, 'PAID', '05/06/2026'], ['TT-2026-0219', 'Thanh toán đợt 1', 'NT-01', 16.73, 1.67, 0, 0, 'PAID', '28/08/2026']],
      docs: [['Biên bản làm việc', 'BBLV-HĐ0014-01', '25/08/2026', 'Thống nhất lùi lắp đặt phần mềm quản lý 05 ngày do phòng lab chưa bàn giao mặt bằng — không phạt nhà thầu', null, 'Đã ký']],
      qty: { 'BG-01': [[0, 4], [1, 16]], 'BG-02': [[2, 1]], 'NT-01': [[0, 4], [1, 16]] } },
    { code: 'HĐ-2026-0016', src: 'KQ', pkg: 'GT-2026-0041', title: 'Hợp đồng cung cấp module quang, dây nhảy quang', ncc: 'NCC-000001',
      type: 'TRON_GOI', form: 'CGTT', value: 3.86, cap: 4.2, cur: 'VND', vat: 10, unit: 'Trung tâm Mạng lõi', owner: 'Đặng Thu Trang', st: 'TL', esign: true, no: '016/2026/HĐMB-VHT',
      sign: '15/05/2026', eff: '15/05/2026', end: '30/06/2026', created: '11/05/2026', updated: '30/09/2026', exec: '45 ngày kể từ ngày hợp đồng có hiệu lực',
      items: [['Module quang QSFP-DD 400G', 'Cái', 32, 0.105], ['Dây nhảy quang LC-LC 5 m', 'Sợi', 100, 0.005]],
      ms: [['Giao hàng', '15/06/2026', '12/06/2026', 100]],
      dl: [['BG-01', 'Đợt 1', '15/06/2026', '12/06/2026', 'Kho Trung tâm Mạng lõi', 'Module quang × 32; Dây nhảy quang × 100', 'Đạt']],
      acc: [['NT-01', 'Tổng thể', '19/06/2026', 'Toàn bộ hạng mục', 3.86, 'Đạt', '']], guar: [],
      warr: [['Module quang QSFP-DD 400G', '12 tháng', '19/06/2026', '19/06/2027', 'Đổi mới trong 07 ngày']],
      plan: [['Thanh toán', 'Bàn giao và nghiệm thu', 100, 3.86]],
      pays: [['TT-2026-0168', 'Thanh toán theo nghiệm thu', 'NT-01', 3.86, 0, 0, 0, 'PAID', '10/07/2026']], docs: [],
      liq: { cond: [['Hoàn thành giao hàng, nghiệm thu toàn bộ hạng mục', true], ['Thanh toán đủ giá trị nghiệm thu (trừ phần giữ lại)', true], ['Không còn vi phạm, phạt chưa xử lý', true], ['Nghĩa vụ bảo hành chuyển sang theo dõi riêng', false]],
        file: ['HSTL-2026-0011', '30/09/2026', 'Đang lập — chờ nhà thầu xác nhận cam kết bảo hành sau thanh lý'], final: 3.86 },
      qty: { 'BG-01': [[0, 32], [1, 100]], 'NT-01': [[0, 32], [1, 100]] } },
    { code: 'HĐ-2026-0018', src: 'KQ', pkg: 'GT-2026-0042', title: 'Hợp đồng tư vấn thẩm tra thiết kế vi mạch ASIC 28 nm', ncc: 'NCC-000006',
      type: 'THOI_GIAN', form: 'DTHC', value: 9.2, cap: 9.5, cur: 'VND', vat: 10, unit: 'Trung tâm Thiết kế vi mạch', owner: 'Trịnh Quốc Việt', st: 'TH', esign: true, no: '018/2026/HĐTV-VHT',
      sign: '06/07/2026', eff: '06/07/2026', end: '31/01/2027', created: '29/06/2026', updated: '02/10/2026', exec: '180 ngày kể từ ngày hợp đồng có hiệu lực',
      items: [['Thẩm tra thiết kế RTL, kiểm chứng chức năng', 'Tháng chuyên gia', 20, 0.31], ['Thẩm tra thiết kế vật lý, timing sign-off', 'Tháng chuyên gia', 12, 0.25]],
      ms: [['Báo cáo thẩm tra RTL đợt 1', '31/08/2026', '28/08/2026', 30], ['Báo cáo thẩm tra RTL đợt 2', '30/09/2026', null, 30], ['Báo cáo timing sign-off', '30/11/2026', null, 30], ['Báo cáo tổng hợp, bàn giao', '15/01/2027', null, 10]],
      dl: [], acc: [['NT-01', 'Đợt 1', '04/09/2026', 'Báo cáo thẩm tra RTL đợt 1 (6 tháng chuyên gia)', 1.86, 'Đạt', '']],
      guar: [['BL_NH', 0.276, 3, '03/07/2026', '28/02/2027', 'Ngân hàng TMCP Kỹ thương Việt Nam']], adv: [['BL_NH', 0.92, '03/07/2026', '31/12/2026', 'Ngân hàng TMCP Kỹ thương Việt Nam', 'Bảo lãnh tạm ứng 10% giá trị hợp đồng']],
      warr: [], plan: [['Tạm ứng', 'Ký hợp đồng và nộp bảo lãnh tạm ứng', 10, 0.92], ['Thanh toán theo tháng chuyên gia', 'Nghiệm thu từng báo cáo thẩm tra — trừ tạm ứng tương ứng', 90, 8.28]],
      pays: [['TT-2026-0187', 'Tạm ứng', null, 0.92, 0, 0, 0, 'PAID', '15/07/2026'], ['TT-2026-0241', 'Thanh toán đợt 1', 'NT-01', 1.86, 0.186, 0, 0, 'PAY', null]],
      docs: [['Biên bản làm việc', 'BBLV-HĐ0018-01', '02/10/2026', 'Nhà thầu đề nghị lùi báo cáo RTL đợt 2 đến 20/10/2026 do Chủ đầu tư đổi netlist; chờ đơn vị sử dụng xác nhận nguyên nhân', null, 'Dự thảo']] },
    { code: 'HĐ-2026-0023', src: 'KQ', pkg: 'GT-2026-0043', title: 'Hợp đồng đào tạo quy trình thiết kế vật lý (physical design)', ncc: 'NCC-000011',
      type: 'TRON_GOI', form: 'CDT_RG', value: 1.55, cap: 1.6, cur: 'VND', vat: 10, unit: 'Trung tâm Thiết kế vi mạch', owner: 'Trịnh Quốc Việt', st: 'DONG', esign: true, no: '023/2026/HĐDV-VHT',
      sign: '01/06/2026', eff: '01/06/2026', end: '31/07/2026', created: '27/05/2026', updated: '20/08/2026', exec: '60 ngày kể từ ngày hợp đồng có hiệu lực',
      items: [['Khoá đào tạo thiết kế vật lý nâng cao', 'Khoá', 2, 0.7], ['Tài liệu, bài thực hành', 'Bộ', 30, 0.005]],
      ms: [['Khoá 1', '30/06/2026', '26/06/2026', 50], ['Khoá 2', '31/07/2026', '24/07/2026', 50]], dl: [],
      acc: [['NT-01', 'Khoá 1', '29/06/2026', 'Khoá đào tạo 1; tài liệu × 15', 0.775, 'Đạt', ''], ['NT-02', 'Khoá 2', '28/07/2026', 'Khoá đào tạo 2; tài liệu × 15', 0.775, 'Đạt', '']],
      guar: [], warr: [], plan: [['Tạm ứng', 'Ký hợp đồng', 10, 0.155], ['Thanh toán', 'Nghiệm thu từng khoá — trừ tạm ứng tương ứng', 90, 1.395]],
      pays: [['TT-2026-0151', 'Tạm ứng', null, 0.155, 0, 0, 0, 'PAID', '08/06/2026'], ['TT-2026-0176', 'Khoá 1', 'NT-01', 0.775, 0.0775, 0, 0, 'PAID', '10/07/2026'],
        ['TT-2026-0203', 'Khoá 2 (quyết toán)', 'NT-02', 0.775, 0.0775, 0, 0, 'PAID', '12/08/2026']], docs: [],
      liq: { cond: [['Hoàn thành giao hàng, nghiệm thu toàn bộ hạng mục', true], ['Thanh toán đủ giá trị nghiệm thu (trừ phần giữ lại)', true], ['Không còn vi phạm, phạt chưa xử lý', true], ['Nghĩa vụ bảo hành chuyển sang theo dõi riêng', true]],
        file: ['HSTL-2026-0010', '20/08/2026', 'Đã ký biên bản thanh lý — hợp đồng đã đóng'], final: 1.55, closed: '20/08/2026' },
      qty: { 'NT-01': [[0, 1], [1, 15]], 'NT-02': [[0, 1], [1, 15]] } },
    { code: 'HĐ-2026-0039', src: 'IMPORT', mau: '10', pkgText: 'GT-2026-0017', khText: 'KHLCNT-2026-0008', originText: 'ĐXMS-2026-0061', title: 'Hợp đồng cung cấp hệ thống đo kiểm giao thức O-RAN', ncc: 'NCC-000003',
      type: 'TRON_GOI', form: 'DTRR', value: 52.8, cap: 55.0, cur: 'USD', fx: 25400, vat: 10, unit: 'Trung tâm Vô tuyến', owner: 'Nguyễn Văn Minh', st: 'TH', esign: false, no: '039/2026/HĐMB-VHT',
      sign: '10/07/2026', eff: '20/07/2026', end: '20/04/2027', created: '03/07/2026', updated: '06/10/2026', exec: '9 tháng kể từ ngày hợp đồng có hiệu lực',
      items: [['Hệ thống mô phỏng O-DU / O-RU', 'Hệ thống', 1, 31.5], ['Bộ kiểm thử giao diện fronthaul', 'Bộ', 3, 5.6], ['Đào tạo, chuyển giao', 'Gói', 1, 4.5]],
      ms: [['Giao bộ kiểm thử fronthaul', '30/09/2026', '22/09/2026', 30], ['Giao hệ thống mô phỏng O-DU / O-RU', '15/12/2026', null, 60], ['Đào tạo, nghiệm thu tổng thể', '31/03/2027', null, 10]],
      dl: [['BG-01', 'Đợt 1', '30/09/2026', '22/09/2026', 'Lab O-RAN — Tòa nhà VHT, Hòa Lạc', 'Bộ kiểm thử fronthaul × 3', 'Đạt'], ['BG-02', 'Đợt 2', '15/12/2026', null, 'Lab O-RAN — Tòa nhà VHT, Hòa Lạc', 'Hệ thống mô phỏng O-DU / O-RU × 1', null]],
      acc: [['NT-01', 'Đợt 1', '02/10/2026', 'Bộ kiểm thử fronthaul × 3', 16.8, 'Đạt', '']],
      guar: [['BL_NH', 5.28, 10, '15/07/2026', '20/06/2027', 'Standard Chartered Bank — Chi nhánh Singapore']], adv: [['BL_NH', 10.56, '15/07/2026', '31/12/2026', 'Standard Chartered Bank — Chi nhánh Singapore', 'Bảo lãnh tạm ứng 20% giá trị hợp đồng']],
      warr: [['Bộ kiểm thử fronthaul × 3', '24 tháng', '02/10/2026', '02/10/2028', 'Thay thế trong 15 ngày']],
      plan: [['Tạm ứng', 'Ký hợp đồng, nộp bảo lãnh tạm ứng', 20, 10.56], ['Thanh toán theo nghiệm thu', 'Nghiệm thu từng đợt — trừ tạm ứng tương ứng', 70, 36.96], ['Thanh toán cuối', 'Nghiệm thu tổng thể', 10, 5.28]],
      pays: [['TT-2026-0198', 'Tạm ứng', null, 10.56, 0, 0, 0, 'PAID', '30/07/2026'], ['TT-2026-0244', 'Thanh toán đợt 1', 'NT-01', 16.8, 3.36, 0, 0, 'DRAFT', null]], docs: [],
      qty: { 'BG-01': [[1, 3]], 'NT-01': [[1, 3]] } },
    { code: 'HĐ-2026-0031', src: 'IMPORT', mau: '7.1', pkgText: 'GT-2026-0014', khText: 'KHLCNT-2026-0003', originText: 'ĐXMS-2025-0198', title: 'Hợp đồng cung cấp máy tính trạm thiết kế và màn hình chuyên dụng', ncc: 'NCC-000002',
      type: 'TRON_GOI', form: 'CGTT', value: 4.62, cap: 4.8, cur: 'VND', vat: 10, unit: 'Trung tâm Thiết kế vi mạch', owner: 'Trịnh Quốc Việt', st: 'TL', esign: true, no: '031/2026/HĐMB-VHT',
      sign: '04/05/2026', eff: '04/05/2026', end: '04/08/2026', created: '28/04/2026', updated: '01/10/2026', exec: '60 ngày kể từ ngày hợp đồng có hiệu lực',
      items: [['Máy tính trạm thiết kế (32 nhân, RAM 256 GB)', 'Máy', 8, 0.48], ['Màn hình 32 inch 4K hiệu chuẩn màu', 'Cái', 16, 0.04875]],
      ms: [['Giao hàng, cài đặt', '15/06/2026', '12/06/2026', 90], ['Nghiệm thu', '25/06/2026', '24/06/2026', 10]],
      dl: [['BG-01', 'Đợt 1', '15/06/2026', '12/06/2026', 'Trung tâm Thiết kế vi mạch — Tòa nhà VHT', 'Máy tính trạm × 8; Màn hình × 16', 'Đạt']],
      acc: [['NT-01', 'Tổng thể', '24/06/2026', 'Toàn bộ hạng mục', 4.62, 'Đạt', '']],
      guar: [['BL_NH', 0.139, 3, '02/05/2026', '04/09/2026', 'Ngân hàng TMCP Quân đội']], warr: [['Máy tính trạm, màn hình', '36 tháng', '24/06/2026', '24/06/2029', 'Bảo hành tại chỗ ngày làm việc kế tiếp']],
      plan: [['Tạm ứng', 'Ký hợp đồng và nộp bảo lãnh tạm ứng', 10, 0.462], ['Thanh toán', 'Bàn giao và nghiệm thu — trừ tạm ứng', 90, 4.158]],
      pays: [['TT-2026-0121', 'Tạm ứng', null, 0.462, 0, 0, 0, 'PAID', '12/05/2026'], ['TT-2026-0172', 'Thanh toán', 'NT-01', 4.62, 0.462, 0, 0, 'PAID', '10/07/2026']], docs: [],
      liq: { cond: [['Hoàn thành giao hàng, nghiệm thu toàn bộ hạng mục', true], ['Thanh toán đủ giá trị nghiệm thu (trừ phần giữ lại)', true], ['Không còn vi phạm, phạt chưa xử lý', true], ['Nghĩa vụ bảo hành chuyển sang theo dõi riêng', true]],
        file: ['HSTL-2026-0012', '01/10/2026', 'Đang lập — chờ ký biên bản thanh lý'], final: 4.62 },
      qty: { 'BG-01': [[0, 8], [1, 16]], 'NT-01': [[0, 8], [1, 16]] } },
    { code: 'HĐ-2026-0027', src: 'IMPORT', mau: '1.8', pkgText: 'GT-2025-0229', khText: 'KHLCNT-2025-0066', originText: 'ĐXMS-2025-0258', title: 'Hợp đồng cung cấp bản quyền phần mềm mô phỏng điện từ trường 3D', ncc: 'NCC-000001',
      type: 'TRON_GOI', form: 'CDT_TT', value: 7.8, cap: 8.0, cur: 'VND', vat: 10, unit: 'Trung tâm Vô tuyến', owner: 'Trần Đức Hải', st: 'TH', esign: true, no: '027/2026/HĐMB-VHT',
      sign: '20/04/2026', eff: '20/04/2026', end: '20/04/2027', created: '14/04/2026', updated: '29/09/2026', exec: '12 tháng (thuê bao bản quyền)',
      items: [['Bản quyền phần mềm mô phỏng điện từ trường 3D (thuê bao năm)', 'Bản quyền', 4, 1.65], ['Mô-đun tối ưu anten mảng', 'Bản quyền', 2, 0.6]],
      ms: [['Kích hoạt bản quyền', '30/04/2026', '24/04/2026', 90], ['Nghiệm thu', '10/05/2026', '08/05/2026', 10]],
      dl: [['BG-01', 'Đợt 1', '30/04/2026', '24/04/2026', 'Trung tâm Vô tuyến (kích hoạt trực tuyến)', 'Bản quyền mô phỏng × 4; Mô-đun tối ưu × 2', 'Đạt']],
      acc: [['NT-01', 'Tổng thể', '08/05/2026', 'Toàn bộ bản quyền đã kích hoạt', 7.8, 'Đạt', '']],
      guar: [['BL_NH', 0.234, 3, '18/04/2026', '20/05/2027', 'Ngân hàng TMCP Quân đội']], adv: [['BL_NH', 0.78, '18/04/2026', '31/05/2026', 'Ngân hàng TMCP Quân đội', 'Đã hết hạn — đã thu hồi toàn bộ tạm ứng']],
      warr: [['Bản quyền phần mềm (hỗ trợ kỹ thuật, cập nhật)', '12 tháng', '08/05/2026', '20/04/2027', 'Phản hồi sự cố trong 01 ngày làm việc']],
      pays: [['TT-2026-0103', 'Tạm ứng', null, 0.78, 0, 0, 0, 'PAID', '28/04/2026'], ['TT-2026-0131', 'Thanh toán', 'NT-01', 7.8, 0.78, 0, 0, 'PAID', '05/06/2026']],
      docs: [['Phụ lục hợp đồng', 'PL01/027/2026', '29/09/2026', 'Bổ sung 01 bản quyền mô phỏng cho nhóm anten mảng pha, thời hạn đến 20/04/2027', 1.65, 'Dự thảo']],
      qty: { 'BG-01': [[0, 4], [1, 2]], 'NT-01': [[0, 4], [1, 2]] } },
    { code: 'HĐ-2026-0009', src: 'IMPORT', mau: '3.0', pkgText: 'GT-2025-0233', khText: 'KHLCNT-2025-0072', originText: 'ĐXMS-2025-0263', title: 'Hợp đồng dịch vụ bảo trì hệ thống UPS, máy phát điện năm 2026', ncc: 'NCC-000011',
      type: 'TRON_GOI', form: 'CDT_RG', value: 2.88, cap: 3.0, cur: 'VND', vat: 10, unit: 'Nhà máy sản xuất thử nghiệm', owner: 'Phan Văn Lộc', st: 'TH', esign: true, no: '009/2026/HĐDV-VHT',
      sign: '05/01/2026', eff: '05/01/2026', end: '31/12/2026', created: '29/12/2025', updated: '04/10/2026', exec: '12 tháng',
      items: [['Bảo trì định kỳ UPS 400 kVA', 'Quý', 4, 0.42], ['Bảo trì máy phát điện 1.250 kVA', 'Quý', 4, 0.3]],
      ms: [['Bảo trì quý I/2026', '31/03/2026', '27/03/2026', 25], ['Bảo trì quý II/2026', '30/06/2026', '26/06/2026', 25], ['Bảo trì quý III/2026', '30/09/2026', '29/09/2026', 25], ['Bảo trì quý IV/2026', '31/12/2026', null, 25]],
      dl: [], acc: [['NT-01', 'Quý I/2026', '02/04/2026', 'Bảo trì quý I/2026', 0.72, 'Đạt', ''], ['NT-02', 'Quý II/2026', '01/07/2026', 'Bảo trì quý II/2026', 0.72, 'Đạt', ''],
        ['NT-03', 'Quý III/2026', '03/10/2026', 'Bảo trì quý III/2026', 0.72, 'Chưa đạt', 'Máy phát điện chưa đạt thử tải 100% — nhà thầu thay bộ lọc nhiên liệu, thử lại trước 15/10/2026']],
      guar: [['BL_NH', 0.144, 5, '02/01/2026', '31/01/2027', 'Ngân hàng TMCP Quân đội']], warr: [],
      plan: [['Thanh toán theo quý', 'Nghiệm thu từng quý', 100, 2.88]],
      pays: [['TT-2026-0101', 'Quý I/2026', 'NT-01', 0.72, 0, 0, 0, 'PAID', '15/04/2026'], ['TT-2026-0183', 'Quý II/2026', 'NT-02', 0.72, 0, 0, 0, 'PAID', '15/07/2026']], docs: [],
      qty: { 'NT-01': [[0, 1], [1, 1]], 'NT-02': [[0, 1], [1, 1]], 'NT-03': [[0, 1], [1, 1]] } },
    { code: 'HĐ-2026-0003', src: 'IMPORT', mau: '1.2', pkgText: 'GT-2025-0214', khText: 'KHLCNT-2025-0061', originText: 'ĐXMS-2025-0252', title: 'Hợp đồng cung cấp nguồn DC lập trình và tải điện tử', ncc: 'NCC-000004',
      type: 'TRON_GOI', form: 'CGTT', value: 3.36, cap: 3.5, cur: 'VND', vat: 10, unit: 'Nhà máy sản xuất thử nghiệm', owner: 'Phan Văn Lộc', st: 'TH', esign: true, no: '003/2026/HĐMB-VHT',
      sign: '14/01/2026', eff: '14/01/2026', end: '15/11/2026', created: '09/01/2026', updated: '18/09/2026', exec: '10 tháng kể từ ngày hợp đồng có hiệu lực',
      items: [['Nguồn DC lập trình 1,5 kW', 'Bộ', 12, 0.18], ['Tải điện tử DC 600 W', 'Bộ', 12, 0.1]],
      ms: [['Giao hàng đợt 1', '31/03/2026', '27/03/2026', 50], ['Giao hàng đợt 2', '15/09/2026', '11/09/2026', 50]],
      dl: [['BG-01', 'Đợt 1', '31/03/2026', '27/03/2026', 'Xưởng lắp ráp — Nhà máy sản xuất thử nghiệm', 'Nguồn DC × 6; Tải điện tử × 6', 'Đạt'],
        ['BG-02', 'Đợt 2', '15/09/2026', '11/09/2026', 'Xưởng lắp ráp — Nhà máy sản xuất thử nghiệm', 'Nguồn DC × 6; Tải điện tử × 6', 'Đạt']],
      acc: [['NT-01', 'Đợt 1', '03/04/2026', 'Nguồn DC × 6; Tải điện tử × 6', 1.68, 'Đạt', ''], ['NT-02', 'Đợt 2', '17/09/2026', 'Nguồn DC × 6; Tải điện tử × 6', 1.68, 'Đạt', '']],
      guar: [['BL_NH', 0.168, 5, '12/01/2026', '15/12/2026', 'Ngân hàng TMCP Á Châu']], warr: [['Nguồn DC, tải điện tử', '24 tháng', '17/09/2026', '17/09/2028', 'Đổi mới trong 10 ngày']],
      plan: [['Thanh toán đợt 1', 'Nghiệm thu đợt 1', 50, 1.68], ['Thanh toán đợt 2', 'Nghiệm thu đợt 2', 50, 1.68]],
      pays: [['TT-2026-0094', 'Thanh toán đợt 1', 'NT-01', 1.68, 0, 0, 0, 'PAID', '20/04/2026'], ['TT-2026-0236', 'Thanh toán đợt 2', 'NT-02', 1.68, 0, 0, 0, 'DRAFT', null]], docs: [],
      qty: { 'BG-01': [[0, 6], [1, 6]], 'BG-02': [[0, 6], [1, 6]], 'NT-01': [[0, 6], [1, 6]], 'NT-02': [[0, 6], [1, 6]] } },
    { code: 'HĐ-2025-0266', src: 'IMPORT', mau: '3.0', pkgText: 'GT-2025-0199', khText: 'KHLCNT-2025-0057', originText: 'ĐXMS-2025-0244', title: 'Hợp đồng dịch vụ bảo trì hệ thống điện nhẹ toà nhà R&D', ncc: 'NCC-000007',
      type: 'TRON_GOI', form: 'CGTT', value: 2.1, cap: 2.3, cur: 'VND', vat: 10, unit: 'Nhà máy sản xuất thử nghiệm', owner: 'Phan Văn Lộc', st: 'CD', esign: false, no: '266/2025/HĐDV-VHT',
      sign: '10/11/2025', eff: '10/11/2025', end: '10/11/2026', created: '05/11/2025', updated: '05/01/2026', exec: '12 tháng',
      items: [['Bảo trì hệ thống điện nhẹ (camera, kiểm soát ra vào, báo cháy)', 'Quý', 4, 0.525]],
      ms: [], dl: [], acc: [], guar: [], warr: [], pays: [],
      docs: [['Văn bản khác', 'CV-0012/VHT-HĐ', '25/11/2025', 'Thông báo nhà thầu vi phạm: quá hạn 15 ngày chưa nộp bảo đảm thực hiện hợp đồng', null, 'Đã ký'],
        ['Biên bản làm việc', 'BBLV-HĐ0266-01', '05/12/2025', 'Nhà thầu xác nhận không thu xếp được bảo lãnh ngân hàng; hai bên thống nhất chấm dứt hợp đồng trước thời hạn', null, 'Đã ký'],
        ['Văn bản khác', '0004/QĐ-VHT', '05/01/2026', 'Quyết định chấm dứt hợp đồng; chuyển xử lý vi phạm nhà thầu (0415/QĐ-VHT ngày 02/01/2026)', null, 'Đã ký']] },
    { code: 'HĐ-2025-0241', src: 'IMPORT', mau: '8.1', pkgText: 'GT-2025-0034', khText: 'KHLCNT-2025-0009', originText: 'ĐXMS-2025-0041', title: 'Hợp đồng dịch vụ vận chuyển trạm đo kiểm lưu động năm 2025', ncc: 'NCC-000005',
      type: 'DG_CD', form: 'CDT_RG', value: 1.25, cap: 1.3, cur: 'VND', vat: 10, unit: 'Trung tâm Vô tuyến', owner: 'Nguyễn Văn Minh', st: 'DONG', esign: true, no: '241/2025/HĐDV-VHT',
      sign: '03/03/2025', eff: '03/03/2025', end: '31/12/2025', created: '25/02/2025', updated: '20/02/2026', exec: '10 tháng',
      items: [['Vận chuyển trạm đo lưu động nội tỉnh', 'Chuyến', 20, 0.025], ['Vận chuyển trạm đo lưu động liên tỉnh', 'Chuyến', 15, 0.05]],
      ms: [['Vận chuyển 6 tháng đầu năm 2025', '30/06/2025', '30/06/2025', 45], ['Vận chuyển 6 tháng cuối năm 2025', '31/12/2025', '26/12/2025', 55]], dl: [],
      acc: [['NT-01', '6 tháng đầu năm', '05/07/2025', '16 chuyến (9 nội tỉnh, 7 liên tỉnh)', 0.575, 'Đạt', ''], ['NT-02', '6 tháng cuối năm', '05/01/2026', '17 chuyến (10 nội tỉnh, 7 liên tỉnh)', 0.6, 'Đạt', 'Thực hiện 33 / 35 chuyến — quyết toán theo khối lượng thực tế']],
      guar: [], warr: [], plan: [['Thanh toán theo đợt', 'Nghiệm thu khối lượng 6 tháng', 100, 1.25]],
      pays: [['TT-2025-0207', '6 tháng đầu năm', 'NT-01', 0.575, 0, 0, 0, 'PAID', '20/07/2025'], ['TT-2026-0021', '6 tháng cuối năm (quyết toán)', 'NT-02', 0.6, 0, 0, 0, 'PAID', '22/01/2026']], docs: [],
      liq: { cond: [['Hoàn thành giao hàng, nghiệm thu toàn bộ hạng mục', true], ['Thanh toán đủ giá trị nghiệm thu (trừ phần giữ lại)', true], ['Không còn vi phạm, phạt chưa xử lý', true], ['Nghĩa vụ bảo hành chuyển sang theo dõi riêng', true]],
        file: ['HSTL-2026-0002', '20/02/2026', 'Đã ký biên bản thanh lý — hợp đồng đã đóng'], final: 1.175, closed: '20/02/2026' },
      qty: { 'NT-01': [[0, 9], [1, 7]], 'NT-02': [[0, 10], [1, 7]] } },
    { code: 'HĐ-2025-0219', src: 'IMPORT', mau: '10', pkgText: 'GT-2025-0061', khText: 'KHLCNT-2025-0018', originText: 'ĐXMS-2025-0077', title: 'Hợp đồng cung cấp module RF front-end cho mẫu thử trạm vô tuyến', ncc: 'NCC-000009',
      type: 'TRON_GOI', form: 'DTHC', value: 6.4, cap: 6.8, cur: 'USD', fx: 25400, vat: 10, unit: 'Trung tâm Vô tuyến', owner: 'Nguyễn Văn Minh', st: 'DONG', esign: false, no: '219/2025/HĐMB-VHT',
      sign: '08/04/2025', eff: '15/04/2025', end: '15/12/2025', created: '01/04/2025', updated: '30/03/2026', exec: '8 tháng kể từ ngày hợp đồng có hiệu lực',
      items: [['Module RF front-end 3,5 GHz', 'Bộ', 40, 0.1], ['Module RF front-end 4,9 GHz', 'Bộ', 40, 0.06]],
      ms: [['Giao module 3,5 GHz', '31/07/2025', '25/07/2025', 60], ['Giao module 4,9 GHz', '30/10/2025', '14/11/2025', 40]],
      dl: [['BG-01', 'Đợt 1', '31/07/2025', '25/07/2025', 'Kho Trung tâm Vô tuyến', 'Module 3,5 GHz × 40', 'Đạt'], ['BG-02', 'Đợt 2', '30/10/2025', '14/11/2025', 'Kho Trung tâm Vô tuyến', 'Module 4,9 GHz × 40', 'Đạt']],
      acc: [['NT-01', 'Đợt 1', '05/08/2025', 'Module 3,5 GHz × 40', 4.0, 'Đạt', ''], ['NT-02', 'Đợt 2', '20/11/2025', 'Module 4,9 GHz × 40', 2.4, 'Đạt', 'Giao chậm 15 ngày so với tiến độ hợp đồng']],
      guar: [['BL_NH', 0.64, 10, '10/04/2025', '15/01/2026', 'Woori Bank — Chi nhánh Hà Nội']], warr: [['Module RF front-end', '12 tháng', '20/11/2025', '20/11/2026', 'Đổi mới module lỗi trong 30 ngày']],
      plan: [['Thanh toán đợt 1', 'Nghiệm thu đợt 1', 62.5, 4.0], ['Thanh toán đợt 2', 'Nghiệm thu đợt 2', 37.5, 2.4]],
      pays: [['TT-2025-0198', 'Thanh toán đợt 1', 'NT-01', 4.0, 0, 0, 0, 'PAID', '20/08/2025'], ['TT-2025-0312', 'Thanh toán đợt 2', 'NT-02', 2.4, 0, 0.036, 0, 'PAID', '10/12/2025']],
      docs: [['Biên bản phạt', 'BBP-HĐ0219-01', '20/11/2025', 'Phạt chậm giao đợt 2: 0,1%/ngày × 15 ngày × 2,40 tỷ đồng', -0.036, 'Đã ký']],
      penalty: [['Phạt chậm giao đợt 2', 0.036, 'Khấu trừ khi thanh toán đợt 2', 'Đã khấu trừ']],
      liq: { cond: [['Hoàn thành giao hàng, nghiệm thu toàn bộ hạng mục', true], ['Thanh toán đủ giá trị nghiệm thu (trừ phần giữ lại)', true], ['Không còn vi phạm, phạt chưa xử lý', true], ['Nghĩa vụ bảo hành chuyển sang theo dõi riêng', true]],
        file: ['HSTL-2026-0004', '30/03/2026', 'Đã ký biên bản thanh lý — hợp đồng đã đóng'], final: 6.364, closed: '30/03/2026' },
      qty: { 'BG-01': [[0, 40]], 'BG-02': [[1, 40]], 'NT-01': [[0, 40]], 'NT-02': [[1, 40]] } },
    { code: 'HĐ-2025-0203', src: 'IMPORT', mau: '10', pkgText: 'GT-2025-0176', khText: 'KHLCNT-2025-0049', originText: 'ĐXMS-2025-0221', title: 'Hợp đồng cung cấp máy thu đo nhiễu EMI và anten đo chuẩn', ncc: 'NCC-000008',
      type: 'TRON_GOI', form: 'DTRR', value: 28.4, cap: 29.5, cur: 'EUR', fx: 27450, vat: 10, unit: 'Phòng Chất lượng', owner: 'Bùi Minh Quang', st: 'TH', esign: false, no: '203/2025/HĐMB-VHT',
      sign: '22/12/2025', eff: '05/01/2026', end: '30/11/2026', created: '18/12/2025', updated: '30/09/2026', exec: '10 tháng kể từ ngày hợp đồng có hiệu lực',
      items: [['Máy thu đo nhiễu EMI 9 kHz – 40 GHz', 'Máy', 2, 9.6], ['Anten đo chuẩn log-periodic, horn', 'Bộ', 3, 2.2], ['Bàn xoay, cột anten tự động', 'Bộ', 1, 2.6]],
      ms: [['Giao máy thu đo nhiễu EMI', '31/05/2026', '29/05/2026', 60], ['Giao anten, bàn xoay, cột anten', '31/08/2026', '26/08/2026', 30], ['Lắp đặt, nghiệm thu tổng thể', '30/10/2026', null, 10]],
      dl: [['BG-01', 'Đợt 1', '31/05/2026', '29/05/2026', 'Phòng đo EMC — Khu CNC Hòa Lạc', 'Máy thu đo nhiễu EMI × 2', 'Đạt'], ['BG-02', 'Đợt 2', '31/08/2026', '26/08/2026', 'Phòng đo EMC — Khu CNC Hòa Lạc', 'Anten đo chuẩn × 3; Bàn xoay, cột anten × 1', 'Đạt']],
      acc: [['NT-01', 'Đợt 1', '12/06/2026', 'Máy thu đo nhiễu EMI × 2', 19.2, 'Đạt', ''], ['NT-02', 'Đợt 2', '08/09/2026', 'Anten đo chuẩn × 3; Bàn xoay, cột anten × 1', 9.2, 'Đạt', '']],
      guar: [['BL_NH', 2.84, 10, '30/12/2025', '25/10/2026', 'Commerzbank AG — Chi nhánh Frankfurt']], adv: [['BL_NH', 5.68, '30/12/2025', '31/08/2026', 'Commerzbank AG — Chi nhánh Frankfurt', 'Đã hết hạn — đã thu hồi toàn bộ tạm ứng']],
      warr: [['Máy thu đo nhiễu EMI × 2', '24 tháng', '12/06/2026', '12/06/2028', 'Kỹ sư hãng sang sửa chữa trong 10 ngày'], ['Anten, bàn xoay, cột anten', '24 tháng', '08/09/2026', '08/09/2028', 'Thay thế linh kiện trong 15 ngày']],
      plan: [['Tạm ứng', 'Ký hợp đồng và nộp bảo lãnh tạm ứng', 20, 5.68], ['Thanh toán theo nghiệm thu', 'Nghiệm thu từng đợt — trừ tạm ứng, giữ lại 10%', 70, 19.88], ['Thanh toán cuối', 'Nghiệm thu tổng thể, hoàn trả phần giữ lại', 10, 2.84]],
      pays: [['TT-2026-0012', 'Tạm ứng', null, 5.68, 0, 0, 0, 'PAID', '12/01/2026'], ['TT-2026-0149', 'Thanh toán đợt 1', 'NT-01', 19.2, 3.84, 0, 1.92, 'PAID', '30/06/2026'],
        ['TT-2026-0228', 'Thanh toán đợt 2', 'NT-02', 9.2, 1.84, 0, 0.92, 'SIGN', null]],
      docs: [['Phụ lục hợp đồng', 'PL01/203/2025', '15/04/2026', 'Đổi model cột anten tự động theo thông báo ngừng sản xuất của hãng, giữ nguyên giá và tính năng', null, 'Đã ký']],
      qty: { 'BG-01': [[0, 2]], 'BG-02': [[1, 3], [2, 1]], 'NT-01': [[0, 2]], 'NT-02': [[1, 3], [2, 1]] } },
  ];

  const FW = [
    { code: 'TTK-2026-0003', title: 'Thỏa thuận khung cung cấp linh kiện điện tử cho sản xuất thử nghiệm', ncc: 'NCC-000009', value: 30.0, from: '01/02/2026', to: '31/01/2028', unit: 'Nhà máy sản xuất thử nghiệm', basis: 'KQLCNT GT-2025-0177 (0042/QĐ-VHT ngày 20/01/2026)',
      orders: [['ĐH-2026-0003-01', '15/03/2026', 'Linh kiện thụ động, IC nguồn cho lô mẫu RRU', 6.2, 'Đã giao đủ'], ['ĐH-2026-0003-02', '20/05/2026', 'FPGA, bộ nhớ DDR cho lô sản xuất thử', 8.4, 'Đã giao đủ'],
        ['ĐH-2026-0003-03', '25/08/2026', 'Linh kiện RF, bộ lọc cho lô RRU tháng 9', 7.1, 'Đang giao'], ['ĐH-2026-0003-04', '02/10/2026', 'Linh kiện bổ sung lô RRU tháng 11', 5.0, 'Chờ nhà thầu xác nhận']] },
    { code: 'TTK-2025-0007', title: 'Thỏa thuận khung cung cấp vật tư tiêu hao cho phòng đo kiểm', ncc: 'NCC-000004', value: 4.5, from: '01/01/2025', to: '31/12/2026', unit: 'Phòng Chất lượng', basis: 'KQLCNT GT-2024-0230 (0918/QĐ-VHT ngày 20/12/2024)',
      orders: [['ĐH-2025-0007-01', '10/02/2025', 'Cáp RF, đầu nối đo kiểm năm 2025', 1.4, 'Đã giao đủ'], ['ĐH-2025-0007-02', '15/09/2025', 'Bộ suy hao, tải giả', 1.1, 'Đã giao đủ'], ['ĐH-2025-0007-03', '12/03/2026', 'Cáp RF, đầu nối đo kiểm năm 2026', 1.4, 'Đã giao đủ']] },
    { code: 'TTK-2026-0005', title: 'Thỏa thuận khung dịch vụ vận chuyển thiết bị đo kiểm', ncc: 'NCC-000005', value: 2.0, from: '01/06/2026', to: '31/05/2027', unit: 'Phòng Chất lượng', basis: 'KQLCNT GT-2026-0009 (0398/QĐ-VHT ngày 25/05/2026)',
      orders: [['ĐH-2026-0005-01', '18/07/2026', 'Vận chuyển buồng đo di động đến hiện trường Đà Nẵng', 0.35, 'Đã hoàn thành']] },
    /* 17/11 dữ liệu demo: thỏa thuận khung dịch vụ (đào tạo) và một thỏa thuận hàng hoá sắp hết hạn. */
    { code: 'TTK-2026-0008', title: 'Thỏa thuận khung dịch vụ đào tạo kỹ năng thiết kế, kiểm thử', ncc: 'NCC-000011', value: 3.2, from: '01/04/2026', to: '31/03/2028', unit: 'Trung tâm Thiết kế vi mạch', basis: 'KQLCNT GT-2026-0010 (0233/QĐ-VHT ngày 20/03/2026)',
      orders: [['ĐH-2026-0008-01', '15/04/2026', 'Khoá kiểm chứng thiết kế bằng UVM (2 lớp)', 0.42, 'Đã hoàn thành'], ['ĐH-2026-0008-02', '10/08/2026', 'Khoá kiểm thử phần mềm nhúng thời gian thực', 0.36, 'Đã hoàn thành'],
        ['ĐH-2026-0008-03', '01/10/2026', 'Khoá thiết kế anten mảng pha cơ bản', 0.28, 'Chờ nhà thầu xác nhận']] },
    { code: 'TTK-2025-0004', title: 'Thỏa thuận khung cung cấp thiết bị mạng văn phòng', ncc: 'NCC-000012', value: 6.0, from: '01/01/2025', to: '30/11/2026', unit: 'Trung tâm Phần mềm', basis: 'KQLCNT GT-2024-0211 (0861/QĐ-VHT ngày 18/12/2024)',
      orders: [['ĐH-2025-0004-01', '20/02/2025', 'Switch truy nhập, bộ phát Wi-Fi tầng 3–5', 1.8, 'Đã giao đủ'], ['ĐH-2025-0004-02', '05/09/2025', 'Tường lửa chi nhánh, switch lõi văn phòng', 2.1, 'Đã giao đủ'],
        ['ĐH-2026-0004-03', '14/05/2026', 'Bộ phát Wi-Fi 7 cho khu thử nghiệm', 0.9, 'Đang giao']] },
  ];

  /* Số lượng theo hạng mục (chỉ số dòng items) của từng biên bản bàn giao / nghiệm thu — dữ liệu biên bản do MS23.02 / 23.03 ghi. */
  const QTY = {
    'HĐ-2025-0187': { 'BG-01': [[0, 3]], 'BG-02': [[1, 2], [2, 2]], 'NT-01': [[0, 3]] },
    'HĐ-2026-0012': { 'BG-01': [[0, 4], [1, 2]], 'BG-02': [[2, 2]], 'BG-03': [[0, 1]], 'NT-01': [[0, 4], [1, 2]], 'NT-02': [[2, 2]] },
    'HĐ-2026-0021': { 'BG-01': [[0, 2], [1, 1]], 'NT-01': [[0, 2], [1, 1]] },
    'HĐ-2025-0152': { 'NT-01': [[0, 1]], 'NT-02': [[0, 1], [1, 1]], 'NT-03': [[0, 1]], 'NT-04': [[0, 1]] },
  };
  /* T67 H4 (T66 L4): mẫu hợp đồng của hợp đồng = mẫu đính kèm HSMT của gói (hoặc gợi ý theo gói); hợp đồng nhập từ dữ liệu cũ không có mẫu.
     Kế hoạch thanh toán sinh theo phương thức của mẫu khi hợp đồng chưa có kế hoạch riêng; kế hoạch đã ký (dữ liệu cũ) giữ nguyên. */
  const mauHd = (h) => { if (h.mau) return D.mauOf(h.mau); const g = h.pkg && T().pkOf(h.pkg); return g ? D.mauOf(g.mau || T().mauGoiY(g)) : null; };
  const TT_PLAN = { '10 / 30 / 60': [['Tạm ứng', 'Sau ký hợp đồng và nộp bảo lãnh tạm ứng', 10], ['Thanh toán đợt 1', 'Sau Biên bản bàn giao — 40% giá trị hợp đồng, trừ tạm ứng', 40], ['Thanh toán đợt 2', 'Sau nghiệm thu', 60]],
    '10 / 90': [['Tạm ứng', 'Sau ký hợp đồng và nộp bảo lãnh tạm ứng', 10], ['Thanh toán', 'Sau bàn giao và nghiệm thu — 90% giá trị hợp đồng, trừ tạm ứng', 90]],
    '100': [['Thanh toán', 'Sau bàn giao và nghiệm thu', 100]] };
  const planOf = (h) => { if ((h.plan || []).length) return { rows: h.plan, own: true }; const m = mauHd(h);
    return { rows: m ? TT_PLAN[m.tt].map(([a, b, r]) => [a, b, r, Math.round(h.value * r) / 100]) : [], own: false }; };
  const hasAdv = (h) => { const m = mauHd(h); return !m || m.tt !== '100'; };
  const qtyOf = (h, doc, i) => ((h.qty || QTY[h.code] || {})[doc] || []).filter((x) => x[0] === i).reduce((s0, x) => s0 + x[1], 0);

  /* ---------- T75 (D-128): bổ sung theo ảnh hệ thống cũ chụp 17/11 (HT-HD-IMG2) ----------
     Phân bổ nguồn: hợp đồng từ KQLCNT sao chép nguồn gói thầu (srcs / nguồn KHLCNT), chia theo tỷ lệ giá trị; hợp đồng nhập lấy từ tệp nhập
     (GIẢ LẬP P-274: bảng ALLOC — [mã đề tài / dự án, khoản mục chi phí, tỷ lệ %]). */
  const ALLOC = {
    'HĐ-2025-0187': [['KHN-2026-VHT', 'Chi phí thiết bị', 100]], 'HĐ-2026-0012': [['NV-KHCN-2025-031', 'Chi phí thiết bị', 70], ['KHN-2026-VHT', 'Chi phí thiết bị', 30]],
    'HĐ-2026-0058': [['NV-KHCN-2026-006', 'Chi phí bản quyền phần mềm', 100]], 'HĐ-2026-0035': [['KHN-2026-VHT', 'Chi phí thiết bị', 100]],
    'HĐ-2026-0021': [['009-26-VHT-RDP-DS', 'Chi phí thiết bị', 60], ['004-26-VHT-RDP-DS', 'Chi phí thiết bị', 40]], 'HĐ-2025-0152': [['KHN-2026-TTVT', 'Chi phí dịch vụ', 100]],
    'HĐ-2026-0039': [['NV-KHCN-2026-014', 'Chi phí thiết bị', 100]], 'HĐ-2026-0031': [['KHN-2026-VHT', 'Chi phí thiết bị', 100]],
    'HĐ-2026-0027': [['NV-KHCN-2026-006', 'Chi phí bản quyền phần mềm', 100]], 'HĐ-2026-0009': [['DA-2026-002', 'Chi phí dịch vụ', 100]],
    'HĐ-2026-0003': [['DA-2026-002', 'Chi phí thiết bị', 100]], 'HĐ-2025-0266': [['KHN-2026-VHT', 'Chi phí dịch vụ', 100]], 'HĐ-2025-0241': [['KHN-2026-TTVT', 'Chi phí dịch vụ', 100]],
    'HĐ-2025-0219': [['NV-KHCN-2026-014', 'Chi phí thiết bị', 100]], 'HĐ-2025-0203': [['005-26-VHT-BP-M', 'Chi phí thiết bị', 50], ['KHN-2026-VHT', 'Chi phí thiết bị', 50]],
  };
  const pkCtx = (h) => { const g = h.pkg && T().pkOf(h.pkg); if (!g) return null; const kh = T().khAll().find((x) => x.code === g.kh); return { g, kh, x: T().pkExtra(g, kh) }; };
  function allocOf(h) {
    const c = pkCtx(h);
    if (c) {
      const srcs = c.g.srcs || [[c.kh ? c.kh.src[0] : 'DXMS', c.kh ? c.kh.src[1] : '', c.g.price]], tot = srcs.reduce((s0, r) => s0 + r[2], 0) || 1;
      return srcs.map((r) => { const o = T().srcInfo(r[0], r[1]) || {}, nv = D.nvOf(o.nv) || {};
        return { src: r[1], nv: nv.code || o.nv || '', nvName: nv.name || '', loai: nv.loai || '', fund: o.fund || nv.fund || '', cost: c.x.cost, value: r2(h.value * r[2] / tot) }; });
    }
    return (h.alloc || ALLOC[h.code] || [['KHN-2026-VHT', 'Chi phí khác', 100]]).map(([nvc, cost, pct]) => { const nv = D.nvOf(nvc) || {};
      return { src: h.originText || '', nv: nvc, nvName: nv.name || '', loai: nv.loai || '', fund: nv.fund || '', cost, value: r2(h.value * pct / 100) }; });
  }
  /* T79 G4: Loại chi phí theo loại đề tài / dự án của dòng phân bổ (GIẢ LẬP P-HD-05 — bảng ánh xạ, thật là thuộc tính của khoản mục chi phí). */
  const COST_KIND = { KHCN: 'Chi phí nghiên cứu KHCN', 'Hoạt động TX': 'Chi phí hoạt động thường xuyên', 'Dự án đầu tư': 'Chi phí đầu tư', SXKD: 'Chi phí sản xuất kinh doanh' };
  const costKind = (a) => COST_KIND[a.loai] || 'Chi phí khác';
  const MAU_FLD = { HANG_HOA: 'Hàng hóa', PHI_TU_VAN: 'Phi tư vấn', TU_VAN: 'Tư vấn' };
  const fieldOf = (h) => { const c = pkCtx(h); if (c && c.x.field) return c.x.field; const m = mauHd(h); return m ? MAU_FLD[m.field] || 'Hàng hóa' : /HĐDV/.test(h.no || '') ? 'Phi tư vấn' : /HĐTV/.test(h.no || '') ? 'Tư vấn' : 'Hàng hóa'; };
  const blockOf = (h) => D.unitBlock[h.unit] || 'Khối cơ quan';
  /* Thông số hàng hoá theo Phụ lục 1 (ảnh 6536–6537): [Part number, Hãng sản xuất, Xuất xứ / Nhà phân phối, Chủng loại, Năm sản xuất, Bảo hành (tháng)] theo chỉ số dòng items. */
  const SPEC = {
    'HĐ-2026-0052': [['NXT-M3III', 'Fuji', 'Nhật Bản', 'Máy gắn chip', 2026, 24], ['VXP+ 10Z', 'Rehm', 'Đức', 'Lò hàn đối lưu', 2026, 18], ['S3088 ULTRA', 'Saki', 'Nhật Bản', 'AOI 3D', 2026, 24], ['XD7600NT', 'Nordson', 'Mỹ', 'X-ray 3D', 2026, 24]],
    'HĐ-2025-0187': [['N9041B', 'Keysight', 'Malaysia', 'Máy phân tích phổ', 2025, 24], ['P5024B', 'Keysight', 'Malaysia', 'Máy phân tích mạng vector', 2025, 24], ['N4694D', 'Keysight', 'Mỹ', 'Bộ hiệu chuẩn', 2025, 24]],
    'HĐ-2026-0012': [['N9K-C9364D-GX2A', 'Cisco', 'Trung Quốc / Cisco Việt Nam', 'Switch lõi', 2026, 12], ['ASR-9903', 'Cisco', 'Mỹ / Cisco Việt Nam', 'Router biên', 2026, 12], ['XGS2-SFP28', 'Spirent', 'Mỹ', 'Bộ phát lưu lượng', 2025, 12]],
    'HĐ-2026-0014': [['1830 PSI-M', 'Nokia', 'Phần Lan', 'ROADM', 2026, 36], ['400G-ZR+', 'Nokia', 'Trung Quốc', 'Card transponder', 2026, 36], ['NSP 24.4', 'Nokia', 'Phần Lan', 'Phần mềm', 2026, 12]],
    'HĐ-2026-0003': [['IT6015C-80-450', 'ITECH', 'Trung Quốc', 'Nguồn DC', 2025, 24], ['IT8512G+', 'ITECH', 'Trung Quốc', 'Tải điện tử', 2025, 24]],
    'HĐ-2025-0203': [['ESW44', 'Rohde & Schwarz', 'Đức', 'Máy thu đo EMI', 2025, 24], ['HL050E / HF907', 'Rohde & Schwarz', 'Đức', 'Anten đo chuẩn', 2025, 24], ['HCT / HCM-4', 'Maturo', 'Đức', 'Bàn xoay, cột anten', 2025, 24]],
  };
  const hdNum = (h) => h.code.slice(3).replace('-', '');
  /* GIẢ LẬP P-273: số biên bản, serial, số đề nghị thanh toán, số SAP suy từ mã; ngày dự kiến thanh toán = mốc điều kiện + 15 ngày. */
  const bbbgNo = (h, d) => (d[3] ? `BBBG-${hdNum(h)}-${d[0].slice(3)}` : null);
  const dlValue = (h, d) => { const q = h.items.map((r, i) => qtyOf(h, d[0], i) * r[3]).reduce((s0, v) => s0 + v, 0); return q ? r2(q / (1 + (h.vat || 10) / 100)) : null; };
  const dlPenalty = (h, d) => { const n = (d[1].match(/\d+/) || [])[0]; const p = n && (h.penalty || []).find((x) => new RegExp('đợt ' + n, 'i').test(x[0])); return p ? p[1] : null; };
  function recvRows(h) {
    const out = [];
    (h.dl || []).filter((d) => d[3]).forEach((d) => h.items.forEach((r, i) => {
      const q = qtyOf(h, d[0], i); if (!q) return;
      const sp = (SPEC[h.code] || [])[i], pre = (sp ? sp[0] : 'SN').replace(/[^A-Za-z0-9]/g, '').slice(0, 8).toUpperCase(), base = `${pre}${d[3].slice(-2)}${String(i + 1).padStart(2, '0')}`;
      const unit = r2(r[3] / (1 + (h.vat || 10) / 100));
      /* T79 G7 / L4: thêm Hãng, Xuất xứ, Đơn giá chưa VAT, Thành tiền (nối Phụ lục 1), Mã tài sản (SAP), ID hàng hoá. */
      out.push([d[1], r[0], sp ? sp[0] : null, q > 1 ? `${base}001 … ${base}${String(q).padStart(3, '0')}` : `${base}001`, q, r[1], d[2], d[3], Math.max(0, days(d[2], d[3])),
        sp ? sp[1] : null, sp ? sp[2] : null, unit, r2(unit * q), assetOf(h, d, i), itemId(h, i)]);
    }));
    return out;
  }
  function payPlanDates(h, rows) {
    const ms = h.ms || [], n = rows.filter((p) => p[0] !== 'Tạm ứng').length;
    let k = 0;
    return rows.map((p) => { if (p[0] === 'Tạm ứng') return h.eff || h.sign ? dateAdd(h.eff || h.sign, 15) : null;
      const j = !ms.length ? -1 : n <= 1 ? ms.length - 1 : Math.round(k * (ms.length - 1) / (n - 1)); k++; return j >= 0 ? dateAdd(ms[j][1], 15) : h.end || null; });
  }
  function payExt(h, p) {
    const a = (h.acc || []).find((x) => x[0] === p[2]), num = p[0].slice(3);
    const req = p[7] === 'PAID' && p[8] ? dateAdd(p[8], -10) : a ? dateAdd(a[2], 5) : h.sign ? dateAdd(h.sign, 3) : null;
    return { no: p[7] === 'DRAFT' ? null : 'ĐNTT-' + num, req: p[7] === 'DRAFT' ? null : req, dnct: p[7] === 'PAID' && p[8] ? dateAdd(p[8], -5) : null, paidAt: p[7] === 'PAID' ? p[8] : null,
      inv: p[2] && p[7] !== 'DRAFT' ? `HĐGTGT-${num}` : null };
  }
  const sapOf = (h) => { const paid = (h.pays || []).filter((p) => p[7] === 'PAID'); if (!paid.length) return null; const n = hdNum(h), last = paid[paid.length - 1];
    return { hd: '46' + n, po: '45' + n, inv: invOf(h, last).map((v) => v[0]).join('; ') || '-', bth: 'BTH-' + last[0].slice(3), at: last[8] }; };
  const blNo = (g, h, kind) => `${kind}-${String(g[3] || g[2] || '').slice(-4)}/${hdNum(h)}`;
  /* Bảo lãnh bảo hành: mẫu 1.x (BM-HD-2026) có phụ lục mẫu bảo lãnh bảo hành. GIẢ LẬP P-273: 3% giá trị hợp đồng, hiệu lực từ nghiệm thu đến hết bảo hành, cùng ngân hàng bảo lãnh thực hiện. */
  const wgOf = (h) => { const m = mauHd(h); if (!m || !/^1\./.test(m.code) || !(h.warr || []).length || !(h.guar || []).length) return [];
    const a = (h.acc || []).filter((x) => x[5] === 'Đạt').pop(); if (!a) return [];
    return [['BL_NH', r2(h.value * 0.03), 3, a[2], h.warr[0][3], h.guar[0][5]]]; };
  /* ---------- T79 (D-131): phần còn lại so với hệ thống cũ (file Convert 19/11, ảnh HT-HD-IMG2) ---------- */
  /* G5: cột 7 "Mô tả" của Phụ lục 1 (mô tả kỹ thuật với hàng hoá, kết quả đạt được với dịch vụ) — theo chỉ số dòng items. */
  const DESC = {
    'HĐ-2026-0052': ['Gắn linh kiện 0201–55 mm, 4 đầu gắn, tốc độ ≥ 35.000 cph', 'Lò hàn đối lưu 10 vùng nhiệt, khí N2, băng tải kép', 'Kiểm tra quang học 3D, độ phân giải 10 µm', 'X-ray 3D CT, phân tích BGA / QFN tự động'],
    'HĐ-2025-0187': ['Dải tần 2 Hz – 50 GHz, băng phân tích 160 MHz', 'Dải tần 100 kHz – 26,5 GHz, 4 cổng', 'Bộ hiệu chuẩn điện tử 4 cổng, đầu nối 3,5 mm'],
    'HĐ-2026-0012': ['64 cổng 400G QSFP-DD, chuyển mạch 25,6 Tbps', 'Router biên 100G, 2 card dòng, nguồn dự phòng', 'Phát lưu lượng 8 cổng 25/10G, kiểm thử RFC 2544'],
    'HĐ-2026-0014': ['ROADM 20 hướng, C-band 96 kênh', 'Card transponder 400G ZR+ cự ly 1.200 km', 'Phần mềm quản lý mạng quang, bản quyền 1 năm'],
    'HĐ-2026-0003': ['Nguồn DC lập trình 80 V / 450 A', 'Tải điện tử DC 150 V / 30 A'],
    'HĐ-2025-0203': ['Máy thu đo EMI 2 Hz – 44 GHz theo CISPR 16', 'Anten đo chuẩn 30 MHz – 6 GHz, 1 – 18 GHz', 'Bàn xoay 2 tấn, cột anten 1 – 4 m điều khiển tự động'],
  };
  const itemId = (h, i) => `${hdNum(h).slice(-5)}${String(i + 1).padStart(2, '0')}`;
  /* L1 PAC / FAC (QT-10.2.5 thuật ngữ, bước 11; DG-MS23.03 mục 5 "loại hồ sơ nghiệm thu được lựa chọn theo hợp đồng") — đóng P-272.
     Mức nghiệm thu là trường của hợp đồng (AI trích ở MS23, sửa được — D-131 Q3). GIẢ LẬP P-HD-06: hàng hoá cần lắp đặt / tích hợp → PAC + FAC;
     hàng hoá khác → FAC; dịch vụ → nghiệm thu dịch vụ. */
  const NT_PAC = ['HĐ-2026-0052', 'HĐ-2026-0012', 'HĐ-2026-0014', 'HĐ-2025-0187', 'HĐ-2025-0203'];
  const ntLoai = (h) => h.ntLoai || (fieldOf(h) !== 'Hàng hóa' ? ['DV'] : NT_PAC.includes(h.code) ? ['PAC', 'FAC'] : ['FAC']);
  const NT_LB = { PAC: 'PAC / TAM', FAC: 'FAC / TAC', DV: 'Nghiệm thu dịch vụ' };
  /* Loại của đợt nghiệm thu: cột thứ 8 của dòng acc nếu có; hợp đồng có PAC → đợt theo đợt giao là PAC, đợt "Tổng thể" là FAC. */
  const accType = (h, a) => a[7] || (ntLoai(h)[0] === 'DV' ? 'DV' : ntLoai(h).includes('PAC') && !/Tổng thể/.test(a[1]) ? 'PAC' : 'FAC');
  const bbntNo = (h, a) => `BBNT-${hdNum(h)}-${a[0].slice(3)}`;
  /* G6: Thời hạn theo hợp đồng của từng biên bản (chữ — AI trích từ điều khoản hợp đồng ở MS23; GIẢ LẬP P-HD-06). */
  function milestones(h) {
    const dl = h.dl || [], ms = h.ms || [], acc = h.acc || [], L = ntLoai(h), allDl = dl.length && dl.every((d) => d[3]), lastDl = dl[dl.length - 1];
    const ok = (t) => acc.filter((a) => accType(h, a) === t), allOk = (t) => ok(t).length && ok(t).every((a) => a[5] === 'Đạt');
    const pacDone = L.includes('PAC') && allOk('PAC') && allDl, lastPac = ok('PAC').slice(-1)[0];
    const fin = L.includes('PAC') ? 'FAC' : L[0], finDone = ms.length && ms.every((m) => m[2]) && allOk(fin), lastFin = ok(fin).slice(-1)[0];
    const hocPlan = dl.length ? lastDl[2] : null, finPlan = ms.length ? ms[ms.length - 1][1] : null;
    return [['HOC — Biên bản bàn giao', 'Theo tiến độ giao hàng của hợp đồng', hocPlan, allDl ? lastDl[3] : null, allDl ? bbbgNo(h, lastDl) + '.pdf' : null, !dl.length],
      ['PAC — Biên bản kiểm tra kỹ thuật sơ bộ', L.includes('PAC') ? '15 ngày kể từ HOC' : 'Hợp đồng không áp dụng', L.includes('PAC') && hocPlan ? dateAdd(hocPlan, 15) : null, pacDone ? lastPac[2] : null, pacDone ? bbntNo(h, lastPac) + '.pdf' : null, !L.includes('PAC')],
      [fin === 'DV' ? 'Biên bản nghiệm thu dịch vụ' : 'FAC — Biên bản nghiệm thu kỹ thuật cuối cùng', fin === 'DV' ? 'Theo kết quả thực hiện dịch vụ' : L.includes('PAC') ? 'Sau vận hành thử, theo mốc nghiệm thu tổng thể' : 'Sau bàn giao, theo mốc nghiệm thu',
        finPlan, finDone ? lastFin[2] : null, finDone ? bbntNo(h, lastFin) + '.pdf' : null, false],
      ['Biên bản thanh lý', '30 ngày kể từ khi hết hạn hợp đồng', h.end ? dateAdd(h.end, 30) : null, h.liq && h.liq.closed ? h.liq.closed : null, h.liq && h.liq.closed ? `BB-thanh-ly-${h.code}.pdf` : null, false]];
  }
  /* L2 Hoá đơn (DG-MS24 bước 5 "Cung cấp hoá đơn thanh toán"): một hồ sơ thanh toán có thể nhiều hoá đơn. GIẢ LẬP P-273: số / ngày suy từ hồ sơ;
     hồ sơ trên 15 tỷ đồng tách hai hoá đơn 60 / 40. Hàng: [số, ngày, mã hồ sơ, giá trị, tệp, ngày tải lên]. */
  function invOf(h, p) {
    const x = payExt(h, p);
    if (!x.inv) return [];
    const up = x.req ? dateAdd(x.req, 1) : null;
    return p[3] > 15 ? [[x.inv + 'A', x.req, p[0], r2(p[3] * 0.6), x.inv + 'A.xml', up], [x.inv + 'B', x.req, p[0], r2(p[3] - r2(p[3] * 0.6)), x.inv + 'B.xml', up]]
      : [[x.inv, x.req, p[0], p[3], x.inv + '.xml', up]];
  }
  const invAll = (h) => (h.pays || []).flatMap((p) => invOf(h, p));
  /* L3 Xuất nhập khẩu (DX-18, theo đề xuất; GIẢ LẬP P-HD-01): hợp đồng có hàng nhập khẩu = nhà thầu nước ngoài hoặc mẫu hợp đồng quốc tế (9 / 10).
     Thông tin nhập ở bước giao nhận MS23.02 khi hàng thông quan. */
  const isImport = (h) => D.nccOf(h.ncc).kind === 'NN' || ['9', '10'].includes(h.mau);
  function xnkOf(h) {
    const d = (h.dl || []).find((x) => x[3]);
    if (!isImport(h) || !d || fieldOf(h) !== 'Hàng hóa') return null;
    const pre = r2(h.value / (1 + (h.vat || 10) / 100)), tax = r2(pre * 0.05), n = hdNum(h), day = dateAdd(d[3], -6);
    return { tk: `10${n}0${d[0].slice(3)}`, tkDate: day, hs: `HQ-${n}-${d[0].slice(3)}`, tax, vat: r2((pre + tax) * 0.1), fx: h.fx ? `${h.fx.toLocaleString('vi-VN')} VNĐ/${h.cur}` : '25.380 VNĐ/USD',
      qd: `${n.slice(-3)}/QĐ-VHT`, qdDate: h.sign, gp: 'Không thuộc danh mục phải có giấy phép', anqp: 'Không áp dụng', euc: `GCN-NSDCC-${n}`, eucDate: dateAdd(h.sign, 7), file: `XNK-${n}-${d[0].slice(3)}.zip` };
  }
  /* L4 Mã tài sản: chỉ xem, đồng bộ từ SAP sau khi ghi tăng (QLTS / SAP — tích hợp chưa giao PIC; GIẢ LẬP P-HD-02). Ghi tăng sau nghiệm thu Đạt của đợt. */
  const assetOf = (h, d, i) => { const a = (h.acc || []).find((x) => x[5] === 'Đạt' && qtyOf(h, x[0], i) > 0 && dk(x[2]) >= dk(d[3]));
    return fieldOf(h) !== 'Hàng hóa' ? 'Không áp dụng' : a ? `${String(Number(hdNum(h).slice(-4)) * 37 % 900 + 100)}${String(i + 1).padStart(3, '0')}` : 'Chưa ghi tăng'; };
  /* G2 / G3: Người chuyển tiền (nhân sự chuyên thanh toán — DG-MS24), Đầu mối dự án, đơn vị (ĐVSD — QT-10.2.5 bước 10), Đầu mối KCS (DG-MS23.03),
     File CTKT, Ghi chú. Chọn khi tạo hợp đồng (SCR-85), sửa ở MS22 bước 1 (D-131 Q5). Hợp đồng mẫu: GIẢ LẬP P-HD-04 theo persona. */
  const UNIT_FOCAL = { 'Nhà máy sản xuất thử nghiệm': 'Tạ Quỳnh Anh', 'Trung tâm Vô tuyến': 'Nguyễn Văn Minh', 'Phòng Chất lượng': 'Phạm Hồng Sơn' };
  const KCS_HH = 'Phòng Đảm bảo hàng hóa (Trung tâm Mua sắm)';
  const PAYERS = ['Trịnh Thị Yến', 'Mạc Văn Kiên'];
  const staffOf = (h) => ({ payer: h.payer || PAYERS[0], focal: h.focal || UNIT_FOCAL[h.unit] || h.owner,
    kcs: h.kcs || (fieldOf(h) === 'Hàng hóa' ? KCS_HH : 'Đơn vị sử dụng — ' + (h.focal || UNIT_FOCAL[h.unit] || h.owner)),
    ctkt: h.ctkt || (h.pkg ? `YCKT-HSMT-${h.pkg}.pdf` : h.src === 'IMPORT' ? `CTKT-${hdNum(h)}.pdf` : null), note: h.note || null });
  /* T80 L3 (phần hợp đồng): thông tin chuyển giao để ký hợp đồng — đọc MS19 bước 22 của gói (Thau.lcTrao; GIẢ LẬP P-THAU-04). Gói mẫu chưa chạy MS19 không có
     thư trao → null (không bịa). Người đại diện / chức vụ nhà thầu: biên bản thương thảo MS19 (lcDaiDienNt) → danh mục Nhà cung cấp SCR-31. */
  const nccRep = (code, u) => { u = u || {}; if (u.lcDaiDienNt) return { rep: u.lcDaiDienNt, position: u.lcChucVuNt || '' };
    const r = (window.Catalog ? window.Catalog.rows('nha-cung-cap') : []).find((x) => x.code === code) || {}; return { rep: r.rep || '', position: r.rep ? r.position || '' : '' }; };
  const traoOf = (pkg) => { const g = pkg && T().pkOf(pkg), C = g && Flow.caseOf(D.hdCaseCode(g.code, 'MS19')), u = C && C.ui;
    if (!u || !u.lcNgayThu) return null;
    const t = T().lcTrao(g, u, u.lcNgayThu), r = nccRep(t.win, u);
    return { win: t.win, gia: t.gia, ngayThu: t.ngayThu, hoanThien: t.hoanThien, kyKet: t.kyKet, hanKy: t.hanKy, tv: t.tv, baoLanh: t.baoLanh, hetHl: t.hetHl, quaHl: t.quaHl,
      ngayBanGiao: t.ngayBanGiao, tgGiaoHang: t.tgGiaoHang, dkTt: t.dkTt, dauMoi: t.dauMoi.map((x) => Object.assign({}, x)), rep: r.rep, position: r.position }; };
  const traoCard = (t, foot) => K().card('Thông tin chuyển giao để ký hợp đồng (từ gói thầu)', `<div class="ginfo c3">${K().kv('Ngày thư chấp thuận HSDT và trao hợp đồng', esc(t.ngayThu))}
      ${K().kv('Ký hợp đồng trước ngày', esc(t.hanKy))}${K().kv('Ngày hết hiệu lực HSDT', t.hetHl ? esc(t.hetHl) + (t.quaHl ? ' ' + badge('Trước hạn ký hợp đồng — đề nghị nhà thầu gia hạn', 'warning') : '') : null)}
      ${K().kv('Bảo đảm thực hiện hợp đồng', t.tv ? 'Không yêu cầu — gói tư vấn' : `${ty(t.baoLanh, 1)}% giá hợp đồng`)}${K().kv('Thời gian giao hàng', esc(t.tgGiaoHang))}${K().kv('Điều kiện thanh toán', esc(t.dkTt))}
      ${K().kv('Người đại diện nhà thầu', t.rep ? esc(t.rep) + (t.position ? ` — ${esc(t.position)}` : '') : null)}</div>`
    + K().table([['Đầu mối', 240], ['Họ và tên', 260], ['Điện thoại / email', 320]], t.dauMoi, (r) => `<td>${esc(r.vaiTro)}</td><td>${r.ten ? esc(r.ten) : '<span class="dash">-</span>'}</td><td>${r.lienHe ? esc(r.lienHe) : '<span class="dash">-</span>'}</td>`), foot);
  /* Nhật ký tác động (Lịch sử tác động) — audit log của hợp đồng và hồ sơ con. */
  function logOf(h) {
    const L = [[h.created, h.owner, h.src === 'IMPORT' ? 'Nhập hợp đồng từ dữ liệu cũ' : 'Tạo hợp đồng từ KQLCNT ' + (h.pkg || '')]];
    if (h.sign) L.push([h.sign, 'Thủ trưởng VHT', `Ký hợp đồng ${h.no || ''} (${h.esign ? 'ký điện tử' : 'ký giấy'})`]);
    (h.dl || []).filter((d) => d[3]).forEach((d) => L.push([d[3], h.owner, `Ghi nhận bàn giao ${d[0]} (${d[1]}) — ${bbbgNo(h, d)}`]));
    (h.acc || []).forEach((a) => L.push([a[2], h.owner, `Biên bản nghiệm thu ${a[0]} (${a[1]}) — ${a[5]}`]));
    (h.pays || []).filter((p) => p[8]).forEach((p) => L.push([p[8], 'Phòng Tài chính', `Thanh toán ${p[0]} — ${p[1]}`]));
    (h.docs || []).forEach((d) => L.push([d[2], h.owner, `${d[0]} ${d[1]} — ${d[5]}`]));
    if (h.liq && h.liq.closed) L.push([h.liq.closed, h.owner, 'Ký biên bản thanh lý, khoá dữ liệu hợp đồng']);
    if (h.updated) L.push([h.updated, h.owner, 'Cập nhật thông tin hợp đồng']);
    return L.filter((x) => x[0]).sort((a, b) => dk(b[0]).localeCompare(dk(a[0])));
  }
  /* Tab Tài liệu (B6, checklist hồ sơ của hệ thống cũ → card Danh sách tài liệu): [loại, số hiệu, ngày, cơ quan ban hành / người ký, số tiền, số bản, loại chứng từ, tệp]. */
  function docRows(h) {
    const R = [], n = nccName(h.ncc);
    (h.neg ? h.neg.rounds.filter((r) => r[5]) : []).forEach((r) => R.push(['Biên bản thương thảo', 'Vòng ' + r[0], r[1], 'VHT; ' + n, null, 2, 'Bản gốc', r[5]]));
    if (h.no) R.push(['Hợp đồng', h.no, h.sign, 'Thủ trưởng VHT; ' + n, h.value, h.esign ? 1 : 4, h.esign ? 'Bản điện tử (VContract)' : 'Bản gốc', h.noFile ? null : h.no.replace(/\//g, '-') + '.pdf', null, h.noFile ? 'Chưa tải bản đã ký lên hệ thống' : null]);
    (h.guar || []).forEach((g) => R.push(['Bảo lãnh thực hiện hợp đồng', blNo(g, h, 'BLTH'), g[3], g[5], g[1], 1, 'Bản gốc', blNo(g, h, 'BLTH').replace(/\//g, '-') + '.pdf']));
    (h.adv && hasAdv(h) ? h.adv : []).forEach((g) => R.push(['Bảo lãnh tạm ứng', blNo(g, h, 'BLTU'), g[2], g[4], g[1], 1, 'Bản gốc', blNo(g, h, 'BLTU').replace(/\//g, '-') + '.pdf']));
    (h.dl || []).filter((d) => d[3]).forEach((d) => {
      R.push(['Biên bản bàn giao', bbbgNo(h, d), d[3], 'VHT; ' + n, dlValue(h, d), 2, 'Bản gốc', bbbgNo(h, d) + '.pdf']);
      /* T79 G8: chứng từ bản sao của hàng nhập khẩu (CO / CQ) có Ngày sao CC/CT (GIẢ LẬP P-HD-01). */
      if (isImport(h) && fieldOf(h) === 'Hàng hóa') ['CO', 'CQ'].forEach((t) => R.push([t === 'CO' ? 'Chứng nhận xuất xứ (CO)' : 'Chứng nhận chất lượng (CQ)', `${t}-${hdNum(h)}-${d[0].slice(3)}`, dateAdd(d[3], -10), n, null, 1,
        'Bản sao chứng thực', `${t}-${hdNum(h)}-${d[0].slice(3)}.pdf`, dateAdd(d[3], -2), 'Kèm bộ chứng từ giao hàng ' + d[1].toLowerCase()]));
    });
    (h.acc || []).forEach((a) => R.push(['Biên bản nghiệm thu ' + NT_LB[accType(h, a)], bbntNo(h, a), a[2], 'VHT; ' + n, a[4], 2, 'Bản gốc', bbntNo(h, a) + '.pdf']));
    (h.pays || []).forEach((p) => { const x = payExt(h, p);
      invOf(h, p).forEach((v) => R.push(['Hóa đơn GTGT', v[0], v[1], n, v[3], 1, 'Hóa đơn điện tử', v[4], null, 'Hồ sơ thanh toán ' + p[0]]));
      if (x.no) R.push(['Đề nghị thanh toán', x.no, x.req, 'Trung tâm Mua sắm', net(p), 1, 'Bản gốc', x.no + '.pdf']); });
    (h.docs || []).forEach((d) => R.push([d[0], d[1], d[2], 'VHT; ' + n, d[4] == null ? null : Math.abs(d[4]), 2, d[5] === 'Đã ký' ? 'Bản gốc' : 'Dự thảo', d[5] === 'Đã ký' ? d[1].replace(/\//g, '-') + '.pdf' : null, null, d[5] === 'Đã ký' ? null : 'Chưa ký — chờ hoàn tất hồ sơ MS23.01']));
    if (h.liq && h.liq.file && h.liq.file[0] !== '-') R.push(['Hồ sơ thanh lý', h.liq.file[0], h.liq.file[1], 'VHT; ' + n, h.liq.final, 2, h.liq.closed ? 'Bản gốc' : 'Đang lập', h.liq.closed ? `BB-thanh-ly-${h.code}.pdf` : null]);
    return R;
  }

  const allocCard = (rows, title, cap) => K().card(title || 'Phân bổ nguồn vốn / đề tài, dự án', K().table([['Đối tượng nguồn', 120], ['Mã đề tài / dự án', 140], ['Tên đề tài / dự án', 220], ['Loại', 90], ['Nguồn vốn', 150], ['Loại chi phí', 170], ['Khoản mục chi phí', 150], ['Giá trị phân bổ (tỷ đồng)', 150, 'r']], rows,
    (a) => `<td>${esc(a.src || '-')}</td><td>${esc(a.nv)}</td><td>${K().clamp(a.nvName)}</td><td>${esc(a.loai)}</td><td>${K().clamp(K().cat('nguon-von', a.fund))}</td><td>${K().clamp(costKind(a))}</td><td>${K().clamp(a.cost)}</td><td class="r num">${m3(a.value)}</td>`,
    `<tfoot><tr><td></td><td colspan="7"><b>Tổng</b></td><td class="r num"><b>${m3(r2(rows.reduce((s0, a) => s0 + a.value, 0)))}</b></td></tr></tfoot>`), cap || 'Giá trị hợp đồng phân bổ theo tỷ lệ nguồn của gói thầu');
  /* T79 G7 / L4: Hàng hóa đã nhận — lọc Đợt + Từ khóa (như màn Hàng hóa nhận hệ thống cũ, ảnh 6530), thêm Hãng, Xuất xứ, Đơn giá chưa VAT, Thành tiền, Mã tài sản (SAP). */
  const RF = {};
  function recvCard(h) {
    const k = K(), all0 = recvRows(h);
    if (!all0.length) return '';
    const f = RF[h.code] || (RF[h.code] = { dot: null, kw: '' }), kw = f.kw.trim().toLowerCase();
    const rows = all0.filter((r) => (!f.dot || r[0] === f.dot) && (!kw || `${r[1]} ${r[2] || ''} ${r[3]} ${r[13]}`.toLowerCase().includes(kw)));
    const dots = [...new Set(all0.map((r) => r[0]))];
    const bar = `<div class="grid3 mb8">${k.field('Đợt giao hàng', vSelect({ id: 'hd-rf-dot-' + hdNum(h), value: f.dot, placeholder: 'Tất cả', options: dots.map((x) => ({ value: x, label: x })), onChange: (x) => { f.dot = x; rerender(); } }))}
      ${k.field('Từ khóa', `<input class="vctl" data-hd-rf-kw="${esc(h.code)}" placeholder="Tên hàng, Part number, serial, mã tài sản" value="${esc(f.kw)}">`)}</div>`;
    return k.card('Hàng hóa đã nhận', bar + k.table([['Đợt', 100], ['ID hàng hóa', 110], ['Hàng hoá', 280], ['Ký mã hiệu / Part number', 170], ['Serial', 260], ['Hãng sản xuất', 140], ['Xuất xứ / Nhà phân phối', 170], ['Số lượng', 100, 'r'], ['Đơn vị tính', 110],
      ['Đơn giá chưa VAT (tỷ đồng)', 180, 'r'], ['Thành tiền chưa VAT (tỷ đồng)', 190, 'r'], ['Ngày giao theo HĐ', 140], ['Ngày giao thực tế', 140], ['Số ngày giao chậm', 140, 'r'], ['Mã tài sản (SAP)', 150]], rows,
    (r) => `<td>${esc(r[0])}</td><td class="num">${esc(r[14])}</td><td>${k.clamp(r[1])}</td><td>${r[2] ? esc(r[2]) : k.dash}</td><td>${esc(r[3])}</td><td>${r[9] ? esc(r[9]) : k.dash}</td><td>${r[10] ? k.clamp(r[10]) : k.dash}</td><td class="r num">${r[4]}</td><td>${esc(r[5])}</td>
      <td class="r num">${ty(r[11], 3)}</td><td class="r num">${ty(r[12], 3)}</td><td class="num">${esc(r[6])}</td><td class="num">${esc(r[7])}</td><td class="r num">${r[8] ? `<span class="due-over">${r[8]}</span>` : '0'}</td>
      <td>${/^\d/.test(r[13]) ? esc(r[13]) : `<span class="cap">${esc(r[13])}</span>`}</td>`),
    'Bảng lặp của bước bàn giao MS23.02 — nhập Excel danh sách hàng hóa nhận (serial) theo Phụ lục 1; mã tài sản chỉ xem, đồng bộ từ SAP sau khi ghi tăng');
  }
  /* T79 L3: card Xuất nhập khẩu (theo đề xuất DX-18) — chỉ hiện với hợp đồng có hàng nhập khẩu. */
  function xnkCard(h) {
    const k = K();
    if (!isImport(h) || fieldOf(h) !== 'Hàng hóa') return '';
    const x = xnkOf(h), cap = 'Theo đề xuất, chờ BA — nhập ở bước giao nhận MS23.02 khi hàng thông quan';
    if (!x) return k.emptyCard('Xuất nhập khẩu', 'Chưa có tờ khai hải quan — thông tin nhập khi hàng thông quan (bước giao nhận MS23.02).');
    const t = (v) => ty(v, 3) + ' tỷ đồng';
    return k.card('Xuất nhập khẩu', `<div class="ginfo c3">
      ${k.kv('Số tờ khai hải quan', esc(x.tk))}${k.kv('Ngày tờ khai hải quan', esc(x.tkDate))}${k.kv('Mã hồ sơ hải quan', esc(x.hs))}
      ${k.kv('Thuế nhập khẩu', t(x.tax))}${k.kv('Thuế VAT hàng nhập khẩu', t(x.vat))}${k.kv('Tỉ giá của tờ khai hải quan', esc(x.fx))}
      ${k.kv('Số / ngày QĐ phê duyệt hợp đồng', esc(x.qd + ' ngày ' + x.qdDate))}${k.kv('Giấy phép nhập khẩu', esc(x.gp))}${k.kv('Giấy xác nhận hàng ANQP', esc(x.anqp))}
      ${k.kv('Giấy chứng nhận người sử dụng cuối cùng', esc(x.euc + ' ngày ' + x.eucDate))}${k.kv('File xuất nhập khẩu', `<a class="link-red" href="#" data-dl="${esc(x.file)}">${esc(x.file)}</a>`, 'span2')}</div>`, cap);
  }
  /* Bản ghi tạo trên prototype (localStorage riêng). */
  const KEY = 'dtms-proto-hop-dong';
  let U = { hd: [], add: {} };
  try { U = Object.assign(U, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* bỏ qua */ }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(U)); } catch (e) { /* bỏ qua */ } };
  const all = () => U.hd.concat(H0).map((h) => { const a = U.add[h.code] || {}; return live(Object.assign({}, h, { docs: (h.docs || []).concat(a.docs || []), pays: (h.pays || []).concat(a.pays || []) })); });
  const hdOf = (code) => all().find((h) => h.code === code) || null;
  const byPkg = (pkg) => all().find((h) => h.pkg === pkg) || null;

  /* ---------- T25: hợp đồng chạy luồng (D-47, D-48) ----------
     Hồ sơ MS22 của hợp đồng ghi trạng thái, số / ngày ký, dữ liệu tab Thương thảo & ký kết. Chưa tạo hồ sơ thì hợp đồng giữ dữ liệu mẫu. */
  const RUN = 'HĐ-2026-0052', dateAdd = (s, n) => { const [d, m, y] = s.split('/').map(Number); return new Date(y, m - 1, d + n).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }); };
  const case22 = (code) => Flow.caseOf(D.hdCaseCode(code));
  const wOf = (c) => (c.ui.hdWarranty != null ? c.ui.hdWarranty : c.vars.hdFixed ? D.hdWarrantyMin : 18);
  /* Đối chiếu dự thảo: giá, phạm vi, tiến độ khớp theo KQLCNT; dòng bảo hành đọc kết quả thương thảo. */
  const checkRows = (w) => [{ canCu: 'KQLCNT', noiDung: 'Giá hợp đồng bằng giá trúng thầu 191,20 tỷ đồng', ketQua: 'Khớp' }, { canCu: 'KQLCNT', noiDung: 'Phạm vi 4 hạng mục bằng phạm vi gói thầu', ketQua: 'Khớp' },
    { canCu: 'HSMT', noiDung: `Bảo hành thiết bị tối thiểu ${D.hdWarrantyMin} tháng — dự thảo ghi ${w} tháng cho lò hàn`, ketQua: w >= D.hdWarrantyMin ? 'Khớp' : 'Không khớp' }, { canCu: 'KQLCNT', noiDung: 'Loại hợp đồng Trọn gói', ketQua: 'Khớp' }];
  function live(h) {
    if (h.code !== RUN) return h;
    const c = case22(h.code);
    if (!c) return h;
    const at = (n) => { const x = c.history.filter((y) => String(y.task) === String(n) && y.who).pop(); return x ? Flow.dateOf(x.t) : null; };
    const w = wOf(c), ai = c.vars.aiHd, st = c.status === 'approved' ? 'TH' : c.tokens.some((t) => Number(t.task) >= 9) ? 'KY' : 'TT';
    const rounds = [].concat(at(4) ? [['1', at(4), 'Phụ lục kỹ thuật (đơn vị sử dụng) và body, phụ lục giá (Phòng Hợp đồng)', c.ui.hdThongNhat || 'Danh mục, cấu hình thiết bị; đơn giá theo HSDT; điều kiện thanh toán', c.vars.hdFixed || (c.ui.hdWarranty || 0) >= D.hdWarrantyMin ? '' : `Bảo hành lò hàn: nhà thầu đề xuất ${w} tháng`, c.ui.hdBb1 ? `Bien-ban-thuong-thao-${h.code.replace('Đ', 'D')}.pdf` : '']] : [],
      at(6) ? [['2', at(6), 'Thống nhất lại qua email theo cảnh báo AI', c.ui.hdThongNhatLai || `Bảo hành lò hàn ${w} tháng`, '', '']] : []);
    const ver = 1 + c.history.filter((y) => ['6', '7'].includes(String(y.task)) && y.who).length;
    const sign = [['Ký soạn thảo', 'Trưởng phòng Hợp đồng', at(5) || at(4), at(8), at(8) ? 'Đã ký' : 'Chờ ký'], ['Ký nháy Trung tâm Mua sắm, Đơn vị sử dụng', 'Trung tâm Mua sắm; Đơn vị sử dụng', at(8), at(9), at(9) ? 'Đã ký' : 'Chờ ký'],
      ['Ký hợp đồng', 'Thủ trưởng VHT', at(9), at(10), at(10) ? 'Đã ký' : 'Chờ ký'], ['Nhà thầu ký', K().nccName(h.ncc), at(12), c.status === 'approved' ? at(13) : null, c.status === 'approved' ? 'Đã ký' : 'Chờ ký']].filter((r) => r[2]);
    const out = Object.assign({}, h, { st, stepName: c.tokens.length ? 'MS22 · ' + [...new Set(c.tokens.map((t) => window.BPMN_FLOWS.MS22.tasks[t.task].name))].join(', ') : null,
      neg: { rounds, check: checkRows(w).map((r) => [r.canCu, r.noiDung, r.ketQua === 'Khớp' ? 'Khớp' : 'Lệch']), ai: ai ? [ai.ok ? 'Đạt' : 'Chưa đạt', ai.ok ? 'Dự thảo khớp KQLCNT, HSMT và HSDT trúng thầu.' : ai.issues.map((x) => x.noiDung).join(' ')] : null,
        versions: at(4) ? [['v' + ver, at(6) || at(7) || at(4), `Dự thảo theo ${c.ui.hdMau || 'mẫu hợp đồng mua sắm thiết bị'}`, 'Phòng Hợp đồng']] : [], diff: [], sign } });
    /* T79 (D-131 Q5): người phụ trách sửa ở MS22 bước 1 ghi lại vào hợp đồng. */
    [['hdNguoiChuyenTien', 'payer'], ['hdDauMoi', 'focal'], ['hdDauMoiKcs', 'kcs'], ['hdGhiChu', 'note']].forEach(([a, b]) => { if (c.ui[a]) out[b] = c.ui[a]; });
    /* Gỡ tạm dừng ký: xong bước 9 (đã nhập số văn bản giải quyết kiến nghị — GIẢ LẬP P-134). */
    if (at(9)) delete out.held;
    if (c.status === 'approved') {
      const d = c.ui.hdNgayKy || at(13);
      Object.assign(out, { no: c.ui.hdSo || `${h.code.slice(-3)}/2026/HĐMB-VHT`, sign: d, eff: d, end: dateAdd(d, 210), esign: c.vars.hdSign !== 'GIAY', updated: at(13) });
      liveDocs(out);
      liveTrack(out);
      livePays(out);
      liveClose(out);
      liveBg(out);
    }
    return out;
  }
  /* MS23.01: hồ sơ đã xong là văn bản đã ký của hợp đồng (bất biến). Phụ lục đổi giá trị, ngày hết hạn, thêm dòng hạng mục để bảng Hạng mục khớp giá trị; Biên bản phạt ghi Phạt / bồi thường. */
  const casesOfP = (code, p) => Flow.cases(code).filter((c) => c.vars.process === p), casesOf01 = (code) => casesOfP(code, 'MS23.01');
  function liveDocs(out) {
    const list = casesOf01(out.code).filter((c) => c.status === 'approved');
    if (!list.length) return;
    const sua = list.filter((c) => D.hdVbSua(c.ui)), pen = list.filter((c) => c.ui.vbLoai === D.hdVbTypes[2]), v0 = out.value, e0 = out.end;
    const delta = (c) => Number(c.ui.vbGiaTri) || 0, day = (c) => Number(c.ui.vbGiaHan) || 0, sum = sua.reduce((s0, c) => s0 + delta(c), 0), ext = sua.reduce((s0, c) => s0 + day(c), 0);
    out.docs = (out.docs || []).concat(list.map((c) => [c.ui.vbLoai || D.hdVbTypes[0], c.ui.vbSo || c.code, c.ui.vbNgayKy || Flow.dateOf(c.clock), c.ui.vbNoiDung || c.name, D.hdVbSua(c.ui) ? delta(c) || null : pen.includes(c) ? -Number(c.ui.vbGiaPhat) || null : null, 'Đã ký']));
    if (pen.length) out.penalty = (out.penalty || []).concat(pen.map((c) => [c.ui.vbNoiDung || c.name, Number(c.ui.vbGiaPhat) || 0, 'Khấu trừ khi thanh toán', 'Chưa khấu trừ']));
    if (!sua.length) return;
    Object.assign(out, { value: r2(v0 + sum), end: ext ? dateAdd(e0, ext) : e0, exec: ext ? `${out.exec}; gia hạn ${ext} ngày theo phụ lục` : out.exec, annexName: sua.length > 1 ? `${sua.length} phụ lục` : `Phụ lục ${sua[0].ui.vbSo || sua[0].code}`,
      annex: [['Giá trị hợp đồng', `${ty(v0, 2)} tỷ đồng`, `${ty(r2(v0 + sum), 2)} tỷ đồng`], ['Ngày kết thúc hợp đồng', e0, ext ? dateAdd(e0, ext) : e0]], items: out.items.concat(sua.filter((c) => delta(c)).map((c) => [`Điều chỉnh theo ${c.ui.vbSo || c.code}`, 'Gói', 1, delta(c)])) });
    if (sum) out.value0 = v0;
    if (ext) out.end0 = e0;
  }
  /* MS23.02: trạng thái đợt theo hồ sơ bàn giao (cột thứ 8 của dòng đợt), không gộp các kết quả thành đã bàn giao (DG-MS23.02 §C.24). Hủy toàn bộ: hợp đồng Chấm dứt (GIẢ LẬP P-123). */
  function liveBg(out) {
    const list = casesOfP(out.code, 'MS23.02');
    if (!list.length || !out.track) return;
    const gi = out.track.vars.track.ms.filter((m) => m.kind === 'GIAO');
    const label = (c) => (c.vars.hold ? [c.vars.hold, 'warning'] : c.status !== 'approved' ? ['Đang bàn giao', 'info'] : c.ui.bgLoai === 'Dịch vụ' ? ['Đã chuyển nghiệm thu', 'info'] : ['Đã hủy', 'error']);
    (out.dl || []).forEach((d, i) => { const c = list.find((x) => x.vars.msName === gi[i].name); if (c && !d[3]) d[7] = label(c); });
    if (list.some((c) => c.status === 'approved' && c.ui.bgPhamVi === D.hdBgHuy[1])) out.st = 'CD';
  }
  /* MS24: kế hoạch thanh toán có sau khi ký; mỗi hồ sơ con là một dòng hồ sơ thanh toán. Đã qua bước 18 là đã chi tiền; cột SAP theo bước 20. */
  function livePays(out) {
    const plan = D.hdPayPlan[out.code], at = (c, n) => { const x = c.history.filter((y) => String(y.task) === String(n) && y.who).pop(); return x ? Flow.dateOf(x.t) : null; };
    const stOf = (c) => { const n = c.tokens.map((t) => Number(t.task)); return at(c, 18) ? 'PAID' : n.includes(18) ? 'PAY' : n.some((x) => (x >= 7 && x <= 10) || (x >= 13 && x <= 16)) ? 'SIGN' : 'DRAFT'; };
    const base = (p) => (!p.need ? null : p.need[0] === 'GIAO' ? 'BG-' + String(p.need[1] + 1).padStart(2, '0') : 'NT-01');
    out.plan = plan.map((p) => [p.name, p.cond, p.rate, p.value]);
    out.pays = (out.pays || []).concat(casesOf24(out.code).map((c) => { const p = plan[c.vars.dot], st = stOf(c);
      return [c.code, p.name, base(p), p.value, p.adv, 0, p.hold, st, c.ui.ttNgayTT || at(c, 18), c.status === 'approved' ? ['Đã đồng bộ ' + at(c, 19), 'success'] : c.tokens.some((t) => Number(t.task) === 20) ? ['Lỗi đồng bộ', 'error'] : ['Chưa đồng bộ', 'default'], true]; }));
  }
  /* MS23.04: có hồ sơ thanh lý thì hợp đồng Đang thanh lý, xong là Đã thanh lý; không yêu cầu thanh lý thì giữ nguyên. */
  function liveClose(out) {
    const c = Flow.caseOf(D.hdCaseCode(out.code, 'MS23.04'));
    if (!c || c.vars.plan === 'KHONG') return;
    const closed = c.status === 'approved', done = (out.ms || []).every((m) => m[2]), hold = D.hdPayPlan[out.code].slice(-1)[0].value;
    out.st = closed ? 'DONG' : 'TL';
    out.liq = { cond: [['Hoàn thành giao hàng, nghiệm thu toàn bộ hạng mục', done], ['Thanh toán đủ giá trị nghiệm thu (trừ phần giữ lại)', out.value - paidSum(out) <= hold + 0.001], ['Không còn vi phạm, phạt chưa xử lý', true], ['Nghĩa vụ bảo hành chuyển sang theo dõi riêng', true]],
      file: [c.code, Flow.dateOf(c.history[0].t), closed ? 'Đã ký biên bản thanh lý — hợp đồng đã đóng' : c.vars.hold || 'Đang lập'], final: c.ui.tlQuyetToan != null ? Number(c.ui.tlQuyetToan) : out.value, closed: closed ? c.ui.tlNgay || Flow.dateOf(c.clock) : null };
  }
  const casesOf24 = (code) => Flow.cases(code).filter((c) => c.vars.process === 'MS24');
  /* Đợt tạo được hồ sơ: chưa có hồ sơ, mốc điều kiện đã có ngày thực tế (GIẢ LẬP P-147). */
  function nextPays(h) {
    const ms = h.track ? h.track.vars.track.ms : [], kind = (k) => ms.filter((m) => m.kind === k), used = casesOf24(h.code).map((c) => c.vars.dot);
    return D.hdPayPlan[h.code].map((p, i) => Object.assign({ i }, p)).filter((p) => !used.includes(p.i) && (!p.need || (p.need[0] !== 'HOLD' && (kind(p.need[0])[p.need[1]] || {}).actual)));
  }
  /* MS23 Tổng quan: hồ sơ theo dõi ghi mốc, đợt bàn giao, nghiệm thu về hợp đồng (DG-MS23 §B.5). Bàn giao, nghiệm thu chi tiết do MS23.02, MS23.03 ghi từ B4, B6. */
  function liveTrack(out) {
    const t = Flow.caseOf(D.hdCaseCode(out.code, 'MS23')), tr = t && t.vars.track;
    if (!tr) return;
    const gi = tr.ms.filter((m) => m.kind === 'GIAO'), nt = tr.ms.filter((m) => m.kind === 'NT' && m.actual), bg = (i) => 'BG-' + String(i + 1).padStart(2, '0');
    Object.assign(out, { track: t, ms: tr.ms.map((m) => [m.name, m.plan, m.actual, m.rate]),
      dl: gi.map((m, i) => [bg(i), `Đợt ${i + 1}`, m.plan, m.actual, m.site, m.goods, m.actual ? 'Đạt' : null]),
      acc: nt.map((m) => ['NT-01', 'Tổng thể', m.actual, 'Toàn bộ hạng mục', out.value, 'Đạt', '']),
      qty: Object.assign({}, ...gi.map((m, i) => ({ [bg(i)]: m.qty })), nt.length ? { 'NT-01': out.items.map((r, i) => [i, r[2]]) } : {}) });
  }

  /* ---------- Chỉ số suy ra (S4: từ mốc / nghiệm thu / thanh toán của chính hợp đồng) ---------- */
  function eff(h) {
    if (h.st === 'TT' || h.st === 'KY') return ['Chưa hiệu lực', 'default'];
    if (h.st === 'CD') return ['Chấm dứt', 'error'];
    if (h.st === 'DONG' || dk(h.end) < dk(TODAY)) return ['Hết hiệu lực', 'default'];
    return ['Đang hiệu lực', 'success'];
  }
  const lateMs = (h) => (h.ms || []).filter((m) => !m[2] && dk(m[1]) < dk(TODAY));
  function prog(h) {
    if (h.st === 'TT' || h.st === 'KY') return ['Chưa thực hiện', 'default'];
    if ((h.ms || []).length && h.ms.every((m) => m[2])) return ['Hoàn thành', 'success'];
    return lateMs(h).length ? ['Chậm tiến độ', 'error'] : ['Đúng tiến độ', 'info'];
  }
  const doneRate = (h) => (h.ms || []).filter((m) => m[2]).reduce((s, m) => s + m[3], 0);
  const accSum = (h) => r2((h.acc || []).filter((a) => a[5] === 'Đạt').reduce((s, a) => s + a[4], 0));
  const net = (p) => r2(p[3] - p[4] - p[5] - p[6]);
  const paidSum = (h) => r2((h.pays || []).filter((p) => p[7] === 'PAID').reduce((s, p) => s + net(p), 0));
  const advOf = (h) => (h.pays || []).filter((p) => p[1] === 'Tạm ứng' && p[7] === 'PAID').reduce((s, p) => s + p[3], 0);
  const advBack = (h) => r2((h.pays || []).filter((p) => p[7] === 'PAID').reduce((s, p) => s + p[4], 0));
  /* Đã thanh toán (ròng) gồm tạm ứng; còn phải thanh toán = giá trị HĐ - đã thanh toán ròng - phạt / giảm trừ đã chốt. */
  const remain = (h) => r2(h.value - paidSum(h));
  /* P-80 (giả lập, D-44): ngưỡng cảnh báo = tham số hệ thống (sys_config) — bảo đảm 30, hợp đồng 90, thỏa thuận khung 90 ngày. */
  const WARN = { guar: 30, hd: 90, fw: 90 };
  const warnDays = (k) => WARN[k];
  const guarWarn = (h) => (h.guar || []).filter((g) => ['TH', 'TL'].includes(h.st) && dk(g[4]) >= dk(TODAY) && days(TODAY, g[4]) <= warnDays('guar'));
  const hdSoon = (h) => !!h.end && ['TH', 'TL'].includes(h.st) && dk(h.end) >= dk(TODAY) && days(TODAY, h.end) <= warnDays('hd');
  const nccName = (c) => K().nccName(c);
  const pkgLink = (h) => (h.pkg ? `<a class="link" data-go="goi-thau/${encodeURIComponent(h.pkg)}">${esc(h.pkg)}</a>` : esc(h.pkgText || '-'));
  function srcObj(h) {
    if (!h.pkg) return { kh: h.khText, origin: h.originText, originHref: h.src === 'TTR' && h.originText ? T().srcHref('DXMS', h.originText) : null };
    const g = T().pkOf(h.pkg), k = g && T().khAll().find((x) => x.code === g.kh);
    return { g, kh: g && g.kh, origin: k ? k.src[1] : '', originHref: k ? T().srcHref(k.src[0], k.src[1]) : null };
  }
  /* T67 H5 (T66 L5, H-Q4 = A): cột / lọc theo màn Hợp đồng của hệ thống cũ (HT-HD-IMG), chỉ thứ đã có nguồn. Thanh toán chậm GIẢ LẬP = có biên bản nghiệm thu Đạt
     chưa lập hồ sơ thanh toán; Giao hàng chậm = mốc quá hạn chưa có ngày thực tế (lateMs). */
  const signForm = (h) => (!h.sign ? '' : h.esign ? 'Ký điện tử' : 'Ký giấy');
  const row = (h) => { const pre = Math.round((h.value / (1 + (h.vat || 10) / 100)) * 1000) / 1000;
    const al = allocOf(h), pl = planOf(h).rows;
    return Object.assign({}, h, { eff: eff(h)[0], prog: prog(h)[0], nccN: nccName(h.ncc), signF: signForm(h), pre, paid: paidSum(h), left: remain(h),
      rate: h.value ? Math.round(paidSum(h) / h.value * 100) : 0, payLate: payable(h).length > 0, dlLate: lateMs(h).length > 0,
      /* T75: dữ liệu cho bộ lọc theo hệ thống cũ (HT-HD-IMG2 6505). */
      block: blockOf(h), field: fieldOf(h), funds: al.map((a) => a.fund), loais: al.map((a) => a.loai), nvs: al.map((a) => a.nv), itemsText: h.items.map((r) => r[0]).join(' '),
      dPayPlan: payPlanDates(h, pl), dPayAct: (h.pays || []).filter((p) => p[7] === 'PAID').map((p) => p[8]), dGhPlan: (h.ms || []).map((m) => m[1]).concat((h.dl || []).map((d) => d[2])),
      dGhAct: (h.ms || []).map((m) => m[2]).concat((h.dl || []).map((d) => d[3])), dHoc: (h.dl || []).map((d) => d[3]), dTl: [h.liq && h.liq.closed],
      /* T79: PAC / FAC tách hai lọc (L1); Phân loại (L5), Nguồn hình thành (L6). */
      dPac: (h.acc || []).filter((a) => a[5] === 'Đạt' && accType(h, a) === 'PAC').map((a) => a[2]), dFac: (h.acc || []).filter((a) => a[5] === 'Đạt' && accType(h, a) !== 'PAC').map((a) => a[2]),
      kind: 'HD', srcK: h.src }); };
  /* T79 L5 (D-131 Q4): lưới SCR-84 gộp dòng thỏa thuận khung / đơn hàng (PO) khi chọn Phân loại — mã dòng mở SCR-87. */
  const fwRows = () => FW.flatMap((f) => [Object.assign({ kind: 'TTK', code: f.code, title: f.title, ncc: f.ncc, nccN: nccName(f.ncc), value: f.value, sign: f.from, unit: f.unit, cur: 'VND', fwCode: f.code, fwSt: fwSt(f) })]
    .concat(ordersOf(f).map((o) => ({ kind: 'PO', code: o[0], title: o[2], ncc: f.ncc, nccN: nccName(f.ncc), value: o[3], sign: o[1], unit: f.unit, cur: 'VND', fwCode: f.code, ordSt: o[4] }))));
  const KIND_LB = { HD: 'Hợp đồng', PO: 'Đơn hàng (PO) theo thỏa thuận khung', TTK: 'Thỏa thuận khung' };
  const fwCell = (k, h) => { const d = k.dash, go = 'thoa-thuan-khung/' + encodeURIComponent(h.fwCode);
    return `<td class="c">${h.kind === 'TTK' ? badge(...h.fwSt) : ordBadge(h.ordSt)}</td><td><a class="link" data-go="${go}">${esc(h.code)}</a></td><td>${d}</td><td>${k.clamp(h.title)}</td><td>${k.clamp(h.nccN)}</td>
      <td>${h.kind === 'PO' ? esc(h.fwCode) : d}</td><td>${esc(KIND_LB[h.kind])}</td><td class="r num">${m3(h.value)}</td><td class="r num">${d}</td><td>${esc(h.cur)}</td><td class="num">${esc(h.sign)}</td><td>${d}</td><td class="c">${d}</td><td class="c">${d}</td>
      <td class="r num">${d}</td><td class="r num">${d}</td><td class="r num">${d}</td><td>${k.clamp(h.unit)}</td><td>${d}</td>`; };
  const inAny = (arr, from, to) => (!from && !to) || (arr || []).some((d) => d && (!from || dk(d) >= K().dkey(from)) && (!to || dk(d) <= K().dkey(to)));
  const anyIn = (sel, arr) => !sel || !sel.length || (Array.isArray(sel) ? sel : [sel]).some((v) => (arr || []).includes(v));

  /* ---------- SCR-84 Danh sách hợp đồng ---------- */
  const hdHref = (h) => 'hop-dong/' + encodeURIComponent(h.code);
  function hdList() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/task-management.component.html (hợp đồng = đối tượng cha)
    const k = K();
    const A = all(), units = [...new Set(A.map((h) => h.unit))], uniq = (f) => [...new Set(A.flatMap(f).filter(Boolean))];
    const opt = (arr, lab) => arr.map((v) => ({ value: v, label: lab ? lab(v) : v }));
    const DR = [['pp', 'Ngày TT dự kiến', 'dPayPlan'], ['pa', 'Ngày TT thực tế', 'dPayAct'], ['gp', 'Ngày GH dự kiến', 'dGhPlan'], ['ga', 'Ngày GH thực tế', 'dGhAct'],
      ['hoc', 'Ngày ký biên bản bàn giao (HOC)', 'dHoc'], ['pac', 'Ngày ký PAC', 'dPac'], ['fac', 'Ngày ký FAC / nghiệm thu', 'dFac'], ['tl', 'Ngày ký biên bản thanh lý', 'dTl']];
    return k.listPage({
      id: 'hdl', title: 'Danh sách hợp đồng', ph: 'Tìm kiếm theo mã, tên hợp đồng, nhà thầu', exp: 'danh-sach-hop-dong',
      right: `<button class="vbtn secondary" data-hd-import>${icon('upload')} Nhập hợp đồng</button><button class="vbtn primary" data-go="hop-dong/create">${icon('add')} Thêm mới</button>`,
      rows: () => all().map(row).concat(fwRows()), kwText: (h) => `${h.code} ${h.no || ''} ${h.title} ${h.nccN}`,
      empty: () => Object.assign({ kind: [], srcK: null, code: '', title: '', pkg: '', ncc: null, type: null, st: [], eff: null, prog: null, unit: null, block: null, owner: [], signF: null, from: '', to: '', payLate: null, dlLate: null,
        cur: null, field: null, fund: null, loai: null, nv: null, hh: '' }, ...DR.map(([x]) => ({ [x + 'F']: '', [x + 'T']: '' }))),
      match: (h, f) => ((f.kind || []).length ? f.kind.includes(h.kind) : h.kind === 'HD') && (!f.srcK || h.srcK === f.srcK) && k.has(f.code, h.code) && k.has(f.title, h.title) && k.has(f.pkg, h.pkg || h.pkgText) && (!f.ncc || h.ncc === f.ncc) && (!f.type || h.type === f.type)
        && k.inSet(f.st, h.st) && (!f.eff || h.eff === f.eff) && (!f.prog || h.prog === f.prog) && (!f.unit || h.unit === f.unit) && (!f.block || h.block === f.block) && k.inSet(f.owner, h.owner)
        && (!f.signF || h.signF === f.signF) && (!f.from || (h.sign && k.dkey(h.sign) >= k.dkey(f.from))) && (!f.to || (h.sign && k.dkey(h.sign) <= k.dkey(f.to)))
        && (!f.payLate || (f.payLate === 'CO') === h.payLate) && (!f.dlLate || (f.dlLate === 'CO') === h.dlLate)
        && (!f.cur || h.cur === f.cur) && (!f.field || h.field === f.field) && anyIn(f.fund, h.funds) && anyIn(f.loai, h.loais) && anyIn(f.nv, h.nvs) && k.has(f.hh, h.itemsText)
        && DR.every(([x, , key]) => inAny(h[key], f[x + 'F'], f[x + 'T'])),
      adv: (txt, sel, range) => `${sel('kind', 'Phân loại', { multi: true, searchable: false, placeholder: 'Hợp đồng', options: Object.entries(KIND_LB).map(([value, label]) => ({ value, label })) })}
        ${sel('srcK', 'Nguồn hình thành', { searchable: false, options: Object.entries(SRC_HD).map(([value, label]) => ({ value, label })) })}
        ${txt('code', 'Mã hợp đồng')}${txt('title', 'Tên hợp đồng')}${txt('pkg', 'Mã gói thầu')}
        ${sel('ncc', 'Nhà thầu', { options: [...new Set(A.map((h) => h.ncc))].map((c) => ({ value: c, label: nccName(c) })) })}
        ${sel('type', 'Loại hợp đồng', { options: k.catOpts('loai-hop-dong') })}
        ${sel('st', 'Trạng thái', { multi: true, searchable: false, options: Object.entries(HD_ST).map(([value, [label]]) => ({ value, label })) })}
        ${sel('eff', 'Hiệu lực', { searchable: false, options: ['Chưa hiệu lực', 'Đang hiệu lực', 'Hết hiệu lực', 'Chấm dứt'].map((x) => ({ value: x, label: x })) })}
        ${sel('prog', 'Tiến độ', { searchable: false, options: ['Chưa thực hiện', 'Đúng tiến độ', 'Chậm tiến độ', 'Hoàn thành'].map((x) => ({ value: x, label: x })) })}
        ${sel('block', 'Khối', { searchable: false, options: opt(D.blocks) })}
        ${sel('unit', 'Đơn vị sử dụng', { options: opt(units) })}
        ${sel('owner', 'Người thực hiện', { multi: true, options: opt(uniq((h) => [h.owner])) })}
        ${sel('signF', 'Hình thức ký', { searchable: false, options: ['Ký điện tử', 'Ký giấy'].map((x) => ({ value: x, label: x })) })}
        ${sel('payLate', 'Thanh toán chậm', { searchable: false, options: [{ value: 'CO', label: 'Có' }, { value: 'KHONG', label: 'Không' }] })}
        ${sel('dlLate', 'Giao hàng chậm', { searchable: false, options: [{ value: 'CO', label: 'Có' }, { value: 'KHONG', label: 'Không' }] })}
        ${sel('cur', 'Đồng tiền ký', { searchable: false, options: k.catOpts('tien-te') })}
        ${sel('field', 'Lĩnh vực', { searchable: false, options: opt(uniq((h) => [fieldOf(h)])) })}
        ${sel('fund', 'Nguồn vốn', { options: opt(uniq((h) => allocOf(h).map((a) => a.fund)), (v) => k.cat('nguon-von', v)) })}
        ${sel('loai', 'Loại đề tài / dự án', { searchable: false, options: opt(uniq((h) => allocOf(h).map((a) => a.loai))) })}
        ${sel('nv', 'Tên đề tài / dự án', { options: opt(uniq((h) => allocOf(h).map((a) => a.nv)), (v) => `${v} — ${(D.nvOf(v) || {}).name || ''}`) })}
        ${txt('hh', 'Hàng hóa')}
        ${range('from', 'to', 'Ngày ký')}${DR.map(([x, l]) => range(x + 'F', x + 'T', l)).join('')}`,
      cols: [['Trạng thái', 170, 'c'], ['Mã hợp đồng', 150], ['Số hợp đồng', 170], ['Tên hợp đồng', 320], ['Nhà thầu', 240], ['Gói thầu', 140], ['Loại hợp đồng', 180],
        ['Giá trị (tỷ đồng)', 140, 'r'], ['Giá trị trước thuế (tỷ đồng)', 190, 'r'], ['Đồng tiền ký', 120], ['Ngày ký', 120], ['Hình thức ký', 130], ['Hiệu lực', 150, 'c'], ['Tiến độ', 150, 'c'],
        ['Đã thanh toán (tỷ đồng)', 170, 'r'], ['Còn phải thanh toán (tỷ đồng)', 200, 'r'], ['Tỷ lệ thanh toán', 130, 'r'], ['Đơn vị sử dụng', 200], ['Người thực hiện', 180]],
      href: (h) => (h.kind === 'HD' ? hdHref(h) : 'thoa-thuan-khung/' + encodeURIComponent(h.fwCode)),
      cell: (h) => (h.kind !== 'HD' ? fwCell(k, h) : `<td class="c">${badge(...HD_ST[h.st])}</td><td><a class="link" data-go="${hdHref(h)}">${esc(h.code)}</a></td><td>${h.no ? esc(h.no) : k.dash}</td><td>${k.clamp(h.title)}</td><td>${k.clamp(h.nccN)}</td><td>${h.pkg ? pkgLink(h) : esc(h.pkgText)}</td>
        <td>${k.clamp(k.cat('loai-hop-dong', h.type))}</td><td class="r num">${m3(h.value)}</td><td class="r num">${m3(h.pre)}</td><td>${esc(h.cur || 'VND')}</td><td class="num">${h.sign ? esc(h.sign) : k.dash}</td><td>${h.signF ? esc(h.signF) : k.dash}</td><td class="c">${badge(...eff(h))}</td><td class="c">${badge(...prog(h))}</td>
        <td class="r num">${m3(h.paid)}</td><td class="r num">${m3(h.left)}</td><td class="r num">${h.rate}%</td><td>${k.clamp(h.unit)}</td><td>${k.clamp(h.owner)}</td>`),
      info: {
        scr: 'SCR-84', name: 'Danh sách hợp đồng', uc: 'Backlog W1_T10 › Quản lý hợp đồng › Thông tin hợp đồng (dòng 422–429)', bpmn: 'MS22 → MS23 → MS24 (BPMN-DTMS 07/10)',
        notes: [
          'Hợp đồng là <b>đối tượng cha</b> (như KHLCNT): hình thành từ KQLCNT của gói thầu (Thêm mới / nút Tạo hợp đồng ở Chi tiết gói thầu = MS22 bước 1 tiếp nhận) hoặc <b>Nhập hợp đồng</b> cho hợp đồng đã ký trước khi có hệ thống (migration, Backlog 427 — không phải luồng chính; gói thầu của hợp đồng nhập là mã văn bản, không liên kết).',
          'Trạng thái theo BPMN: Đang thương thảo (MS22) → Đang trình ký (MS22 ký nháy, Thủ trưởng ký, VContract) → Đang thực hiện (MS23 / MS24) → Đang thanh lý (MS23.04) → Đã thanh lý. <b>Hiệu lực</b> và <b>Tiến độ</b> là chỉ số suy ra: hiệu lực theo ngày hiệu lực / hết hạn; chậm tiến độ khi có mốc quá ngày kế hoạch chưa hoàn thành (job quét mốc, sự kiện CONTRACT_MILESTONE_LATE).',
          'Hợp đồng mẫu xem tĩnh; HĐ-2026-0052 chạy luồng (T25, D-48): Tạo hồ sơ ở tab Thương thảo & ký kết; ký xong tự có hồ sơ theo dõi MS23 ở tab Tiến độ thực hiện, tạo hồ sơ thanh toán MS24 ở tab Thanh toán; đến hạn nghiệm thu thì tạo hồ sơ MS23.03 ở tab Tiến độ, hồ sơ MS23.04 tự sinh từ G1. văn bản phát sinh MS23.01 tạo hồ sơ ở tab Văn bản phát sinh; hồ sơ bàn giao MS23.02 tự sinh khi ghi nhận thông báo giao hàng của nhà thầu (MS23 bước 3, 4).',
          'Không có cột Thao tác (D-43, team BA 30/10/2026: chưa có thao tác trên dòng).',
          '<b>T67 H5</b> (T66 L5): thêm cột theo màn Hợp đồng của hệ thống cũ (HT-HD-IMG) — Giá trị trước thuế, Hình thức ký, Đã thanh toán, Còn phải thanh toán, Tỷ lệ thanh toán; lọc Ngày ký, Hình thức ký, Thanh toán chậm (GIẢ LẬP: có biên bản nghiệm thu Đạt chưa lập hồ sơ thanh toán), Giao hàng chậm (mốc quá hạn chưa có ngày thực tế). Không làm HOC / FAC, Cập nhật mã tài sản, Hóa đơn, Xuất nhập khẩu, SAP — hệ thống cũ có, chưa có quy trình mới.',
          '<b>T75</b> (D-128, ảnh hệ thống cũ 17/11 HT-HD-IMG2): thêm lọc khoảng ngày TT dự kiến / thực tế, GH dự kiến / thực tế, ký biên bản bàn giao (HOC), nghiệm thu, thanh lý (ngày biên bản do MS23.02 / 23.03 / 23.04 ghi); Khối, Người thực hiện (chọn nhiều), Đồng tiền ký, Lĩnh vực, Nguồn vốn, Loại / Tên đề tài dự án (theo phân bổ nguồn của hợp đồng), Hàng hóa; nút Xuất Excel. "Đơn vị quản lý" đổi thành <b>Đơn vị sử dụng</b>, thêm cột <b>Người thực hiện</b> (B2). Không thêm Hình thức ký Ký MSC / Đặc biệt (B1). Mã tài sản, Xuất nhập khẩu vẫn là phần hệ thống cũ có, chưa có quy trình mới.',
          '<b>T79</b> (D-131, đối chiếu file Convert 19/11 với ảnh HT-HD-IMG2): lọc <b>Phân loại</b> (Hợp đồng · Đơn hàng PO · Thỏa thuận khung — chọn thì lưới gộp dòng thỏa thuận khung / đơn hàng, mở sang SCR-87; mặc định chỉ hợp đồng), <b>Nguồn hình thành</b> (KQLCNT · Tờ trình / ĐXMS theo đề xuất · Nhập dữ liệu cũ — như nút HĐ / TTr của hệ thống cũ), lọc ngày ký <b>PAC</b> và <b>FAC</b> tách riêng (QT-10.2.5, DG-MS23.03); cột <b>Số hợp đồng</b>, <b>Đồng tiền ký</b>; tìm theo số hợp đồng. Vẫn không có cột Thao tác (D-43).',
          '<b>Nhập hợp đồng</b> từ hệ thống cũ — quy tắc chuyển đổi: Trạng thái Soạn HĐ → Đang thương thảo; Trình ký → Đang trình ký; Đôn đốc giao hàng, Nghiệm thu → Đang thực hiện; Thanh lý → Đang thanh lý; Hoàn thành → Đã thanh lý; Hủy hợp đồng → Chấm dứt. Loại hợp đồng 12 giá trị cũ → 8 loại QC-12869 Điều 43: ba kiểu "Trọn gói và / Theo đơn giá … và …" → Hỗn hợp; Thỏa thuận khung → SCR-87. Phân loại HĐ Thường → hợp đồng; HĐ Khung → thỏa thuận khung; HĐ PO → đơn hàng của thỏa thuận khung.',
        ],
        q: ['P-80', 'P-274', 'P-HD-03', 'P-HD-06'], src: 'task-management/task-management.component · /task-management',
      },
    });
  }

  /* ---------- SCR-85 Khởi tạo hợp đồng từ KQLCNT / tờ trình (T79 L6 — theo đề xuất DX-17) ---------- */
  const F = { v: {}, err: {} };
  const eligible = () => T().PK.filter((g) => T().pkRow(g).stx === 'KQ' && g.bidders && g.winner && !byPkg(g.code) && !(g.events || []).some((e) => /Tạm dừng/.test(e[0]) && /hiệu lực/.test(e[3])));
  /* T79 L6 (D-131 Q2): nhánh tờ trình chọn ĐXMS đã phê duyệt chưa đưa vào KHLCNT nào và chưa có hợp đồng (GIẢ LẬP P-HD-03 — các trường hợp được không qua LCNT). */
  const KM = ['Chi phí thiết bị', 'Chi phí dịch vụ', 'Chi phí bản quyền phần mềm', 'Chi phí mua sắm thường xuyên', 'Chi phí khác'];
  /* Nguồn: ĐXMS đã phê duyệt chưa đưa vào KHLCNT (giá trị = giá trị ĐXMS) hoặc phần công việc không áp dụng LCNT của KHLCNT (Điều 23 khoản 2 điểm e —
     BM01 "công việc không áp dụng KHLCNT"; giá trị = tổng phần đó). */
  function ttrSrc(code) {
    const s = T().srcInfo('DXMS', code);
    if (!s || !s.approved || !s.value) return null;
    const ks = T().khAll().filter((kh) => kh.src[1] === code && kh.st !== 'CANCEL');
    if (!ks.length) return Object.assign({}, s, { cap: s.value, basis: s.doc });
    const na = ks.flatMap((kh) => ((kh.parts || {}).na || []).map((x) => Object.assign({ kh: kh.code }, x)));
    return na.length ? Object.assign({}, s, { cap: r2(na.reduce((a, x) => a + x.value, 0)), basis: `${s.doc} · ${na[0].kh}: phần không áp dụng LCNT — ${na.map((x) => x.name).join('; ')}`, naName: na[0].name }) : null;
  }
  const ttrList = () => Flow.dxmsAll().map((x) => ttrSrc(x.code)).filter((s) => s && !all().some((h) => h.src === 'TTR' && h.originText === s.code));
  function resetForm(pkg) { F.err = {}; F.v = { srcK: 'KQ', pkg: pkg || null, title: '', unit: null, cur: 'VND', dx: null, km: [], ncc: null, val: '', type: null, payer: PAYERS[0], focal: null, kcs: null, note: '' }; if (pkg) fill(pkg); }
  function fill(pkg) {
    const g = T().pkOf(pkg);
    if (!g) return;
    F.v.title = 'Hợp đồng ' + g.name.replace(/^./, (c) => c.toLowerCase());
    F.v.unit = (T().srcInfo(...(T().khAll().find((k) => k.code === g.kh) || { src: ['DXMS', ''] }).src) || {}).unit || null;
    F.v.focal = UNIT_FOCAL[F.v.unit] || null;
    const t = traoOf(pkg), dm = t && (t.dauMoi.find((x) => /đơn vị sử dụng/i.test(x.vaiTro)) || {}).ten;
    if (dm && D.personas.some((p) => p.name === dm)) F.v.focal = dm;
  }
  function fillDx(code) {
    const s = ttrSrc(code);
    if (!s) return;
    F.v.title = 'Hợp đồng ' + (s.naName || s.title).replace(/^./, (c) => c.toLowerCase());
    F.v.unit = s.unit || null; F.v.focal = UNIT_FOCAL[F.v.unit] || null; F.v.val = String(s.cap);
  }
  /* Giữ giá trị ô nhập trước khi vẽ lại (vSelect onChange). */
  const grab = () => { [['hd-title', 'title'], ['hd-val', 'val'], ['hd-note', 'note']].forEach(([id, key]) => { const e = document.getElementById(id); if (e) F.v[key] = e.value; }); };
  const ttrAlloc = (v) => { const s = v.dx && ttrSrc(v.dx); return s && v.km.length ? v.km.map((km) => [s.nv, km, 100 / v.km.length]) : null; };
  function hdForm() {
    // Theo: fe/repo-khcn-bpmn-fe/src/app/features/task-management/components/task-create/task-create.component.html (mode create)
    const k = K(), v = F.v, err = F.err, ttr = v.srcK === 'TTR';
    const g = !ttr && v.pkg ? T().pkOf(v.pkg) : null, win = g && g.bidders.find((b) => b[0] === g.winner), tr0 = g && traoOf(g.code);
    const units = [...new Set(T().khAll().map((x) => (T().srcInfo(...x.src) || {}).unit).concat(v.unit ? [v.unit] : []).filter(Boolean))];
    const sx = ttr && v.dx ? ttrSrc(v.dx) : null;
    const people = D.personas.filter((p) => !p.all && p.id !== 'td').map((p) => ({ value: p.name, label: `${p.name} — ${p.role}` }));
    const ch = (key, fn) => (x) => { grab(); v[key] = x; delete err[key]; if (fn) fn(x); rerender(); };
    const info = {
      scr: 'SCR-85', name: 'Thêm mới hợp đồng', uc: 'Backlog W1_T10 › Hợp đồng › Khởi tạo hợp đồng từ KQLCNT; Sao chép thông tin từ gói thầu / KQLCNT; Liên kết gói thầu, đối tượng nguồn (dòng 425–429)', bpmn: 'MS22 bước 1 — Tiếp nhận kết quả LCNT',
      notes: [
        'Theo task-create (mode create). Chỉ chọn được gói thầu <b>Đã có KQLCNT</b>, chưa có hợp đồng, không bị tạm dừng ký (kiến nghị). Nhà thầu, giá trúng thầu, phạm vi (hạng mục), hình thức LCNT, loại hợp đồng <b>sao chép từ KQLCNT, chỉ xem</b> — tránh nhập lại (Backlog 426).',
        'Lưu = tạo hợp đồng ở trạng thái Đang thương thảo. Thật: khởi tạo MS22 ngay; prototype chỉ HĐ-2026-0052 chạy luồng (D-48). Số hợp đồng cấp khi ký.',
        'Giá trị hợp đồng không được vượt giá trúng thầu / giá gói thầu (kiểm tra ở bước đối chiếu MS22 và khi lập phụ lục).',
        '<b>T75</b> (D-128): <b>Phân bổ nguồn vốn / đề tài, dự án</b> sao chép từ nguồn gói thầu, chia theo tỷ lệ giá trị (hệ thống cũ cho một hợp đồng phân bổ nhiều dự án / nguồn vốn — HT-HD-IMG2 6541). Nhãn theo hệ thống cũ: <b>Đơn vị sử dụng</b>, <b>Người thực hiện</b>.',
        '<b>T79 — Nguồn hình thành Tờ trình / ĐXMS</b> (D-131, dựng <b>theo đề xuất DX-17, chờ BA</b>; hệ thống cũ tạo hợp đồng / TTr MS từ tờ trình + khoản mục chi phí — HT-HD-IMG2 6507, 6508, 6540): chọn ĐXMS đã phê duyệt chưa đưa vào KHLCNT hoặc <b>phần công việc không áp dụng LCNT</b> của KHLCNT (Điều 23 khoản 2 điểm e; BM01), khoản mục chi phí (một hoặc nhiều), nhà thầu từ danh mục, giá trị (không vượt giá trị ĐXMS / phần không áp dụng LCNT), loại hợp đồng. Thật: cổng <code>nguonHopDong</code> ở MS22 bước 1, nhánh tờ trình bỏ bước đối chiếu KQLCNT; các bước sau giữ nguyên. GIẢ LẬP: các trường hợp được không qua LCNT chưa có nguồn.',
        '<b>T80 L3 — Thông tin chuyển giao</b> (GIẢ LẬP P-THAU-04, theo tab Trao HĐ / TT Ký HĐ hệ thống cũ — HT-THAU-CONV): gói đã qua MS19 bước 22 thì sao chép thư chấp thuận HSDT và trao hợp đồng (ngày thư, hạn ký, bảo đảm thực hiện hợp đồng), đầu mối, thời gian giao hàng, điều kiện thanh toán, người đại diện nhà thầu (biên bản thương thảo / danh mục Nhà cung cấp) — chỉ xem; Đầu mối dự án, đơn vị gợi ý theo đầu mối đơn vị sử dụng; thời gian thực hiện hợp đồng lấy thời gian giao hàng. Gói chưa có thư trao: không hiện.',
        '<b>T79 — Người chuyển tiền</b> (nhân sự chuyên thanh toán của Phòng Hợp đồng — DG-MS24), <b>Đầu mối dự án, đơn vị</b> (Đơn vị sử dụng — QT-10.2.5 bước 10), <b>Đầu mối KCS</b> (Phòng Đảm bảo hàng hóa với hàng hoá, Đơn vị sử dụng với dịch vụ — DG-MS23.03), <b>File CTKT</b> (yêu cầu kỹ thuật lấy từ HSMT của gói; nhánh tờ trình tải lên), <b>Ghi chú</b>: chọn khi tạo, sửa ở MS22 bước 1 (D-131 Q5).',
      ],
      q: ['P-HD-03', 'P-HD-04'], src: 'task-management/components/task-create · /task-management/create',
    };
    const opts = eligible().concat(g && !eligible().includes(g) ? [g] : []).map((x) => ({ value: x.code, label: `${x.code} - ${x.name}` }));
    const ncc = window.Catalog.rows('nha-cung-cap').filter((r) => r.active && !r.ban).map((r) => ({ value: r.code, label: r.name }));
    const kq = `
          ${k.field('Gói thầu (đã có KQLCNT)', vSelect({ id: 'hd-pkg', value: v.pkg, searchable: true, placeholder: 'Chọn gói thầu', invalid: !!err.pkg, options: opts, onChange: (x) => { grab(); v.pkg = x; delete err.pkg; fill(x); rerender(); } }), { req: true, err: err.pkg, cls: 'span2' })}
          ${k.field('Tên hợp đồng', `<input class="vctl" id="hd-title" maxlength="500" placeholder="Nhập tên hợp đồng" value="${esc(v.title)}" ${err.title ? 'aria-invalid="true"' : ''}>`, { req: true, err: err.title, cls: 'span3' })}
          ${k.field('Nhà thầu ký hợp đồng', `<input class="vctl" value="${esc(win ? nccName(win[0]) : '')}" placeholder="Lấy từ KQLCNT" disabled>`, { cls: 'span2' })}
          ${k.field('Giá trúng thầu (tỷ đồng)', `<input class="vctl" value="${win ? ty(win[1], 2) : ''}" placeholder="Lấy từ KQLCNT" disabled>`)}
          ${k.field('Hình thức lựa chọn nhà thầu', `<input class="vctl" value="${esc(g ? k.cat('hinh-thuc-lcnt', g.form) : '')}" placeholder="Lấy từ gói thầu" disabled>`)}
          ${k.field('Loại hợp đồng', `<input class="vctl" value="${esc(g ? k.cat('loai-hop-dong', g.contract) : '')}" placeholder="Lấy từ gói thầu" disabled>`)}
          ${k.field('Quyết định phê duyệt KQLCNT', `<input class="vctl" value="${esc(g && g.kq ? g.kq[0] + ' ngày ' + g.kq[1] : '')}" placeholder="Lấy từ KQLCNT" disabled>`)}`;
    const tr = `
          ${k.field('Tờ trình / ĐXMS đã phê duyệt', vSelect({ id: 'hd-dx', value: v.dx, searchable: true, placeholder: 'Chọn ĐXMS đã phê duyệt', invalid: !!err.dx, options: ttrList().map((s) => ({ value: s.code, label: `${s.code} - ${s.title}` })), onChange: ch('dx', fillDx) }), { req: true, err: err.dx, cls: 'span2' })}
          ${k.field('Căn cứ', `<input class="vctl" value="${esc(sx ? sx.basis : '')}" title="${esc(sx ? sx.basis : '')}" placeholder="Lấy từ ĐXMS / KHLCNT" disabled>`)}
          ${k.field('Tên hợp đồng', `<input class="vctl" id="hd-title" maxlength="500" placeholder="Nhập tên hợp đồng" value="${esc(v.title)}" ${err.title ? 'aria-invalid="true"' : ''}>`, { req: true, err: err.title, cls: 'span3' })}
          ${k.field('Khoản mục chi phí', vSelect({ id: 'hd-km', value: v.km, multi: true, searchable: false, placeholder: 'Chọn khoản mục chi phí', invalid: !!err.km, options: KM.map((x) => ({ value: x, label: x })), onChange: ch('km') }), { req: true, err: err.km, cls: 'span2' })}
          ${k.field('Giá trị được phép (tỷ đồng)', `<input class="vctl" value="${sx ? ty(sx.cap, 2) : ''}" placeholder="Lấy từ ĐXMS / KHLCNT" disabled>`)}
          ${k.field('Nhà thầu ký hợp đồng', vSelect({ id: 'hd-ncc', value: v.ncc, searchable: true, placeholder: 'Chọn nhà thầu', invalid: !!err.ncc, options: ncc, onChange: ch('ncc') }), { req: true, err: err.ncc, cls: 'span2' })}
          ${k.field('Giá trị hợp đồng (tỷ đồng)', `<input class="vctl" id="hd-val" type="number" step="0.001" min="0" placeholder="Nhập giá trị" value="${esc(v.val)}" ${err.val ? 'aria-invalid="true"' : ''}>`, { req: true, err: err.val })}
          ${k.field('Loại hợp đồng', vSelect({ id: 'hd-type', value: v.type, placeholder: 'Chọn loại hợp đồng', invalid: !!err.type, options: k.catOpts('loai-hop-dong'), onChange: ch('type') }), { req: true, err: err.type })}`;
    const kcsOpts = [KCS_HH, 'Đơn vị sử dụng'].map((x) => ({ value: x, label: x }));
    const kcsDef = ttr || !g || T().pkExtra(g).field === 'Hàng hóa' ? KCS_HH : 'Đơn vị sử dụng';
    const alloc = ttr ? (ttrAlloc(v) ? allocCard(allocOf({ code: '', value: Number(v.val) || 0, originText: v.dx, alloc: ttrAlloc(v) }), 'Phân bổ nguồn vốn / đề tài, dự án (theo ĐXMS và khoản mục đã chọn)', 'Chia đều giá trị hợp đồng cho các khoản mục đã chọn') : '')
      : g ? k.card('Hạng mục hợp đồng (sao chép từ phạm vi gói thầu)', k.table([['Hàng hoá / dịch vụ / công việc', 460], ['Đơn vị tính', 140], ['Khối lượng', 120, 'r']], g.items || [],
        (r) => `<td>${k.clamp(r[0])}</td><td>${esc(r[1])}</td><td class="r num">${ty(r[2], 0)}</td>`), 'Đơn giá cập nhật khi thương thảo')
        + (tr0 ? traoCard(tr0, 'Sao chép từ thư trao hợp đồng của gói (MS19 bước 22), chỉ xem') : '')
        + allocCard(allocOf({ pkg: g.code, value: win ? win[1] : g.price }), 'Phân bổ nguồn vốn / đề tài, dự án (sao chép từ nguồn gói thầu)') : '';
    return `<form class="pg" data-hd-form>
      ${head({ title: 'Thêm mới hợp đồng', back: 'hop-dong', lg: true, info, right: `<button type="button" class="vbtn secondary grey" data-go="hop-dong">Huỷ</button><button type="submit" class="vbtn primary" id="hd-save">Lưu</button>` })}
      <section class="vcard"><h3>Thông tin chung hợp đồng</h3>
        <div class="grid3">
          ${k.field('Mã hợp đồng', '<input class="vctl" placeholder="Hệ thống tự sinh" disabled>')}
          ${k.field('Nguồn hình thành', vSelect({ id: 'hd-srck', value: v.srcK, searchable: false, options: [{ value: 'KQ', label: 'Gói thầu (đã có KQLCNT)' }, { value: 'TTR', label: 'Tờ trình / ĐXMS đã phê duyệt (theo đề xuất)' }],
            onChange: (x) => { grab(); const keep = { payer: v.payer, note: v.note }; resetForm(); Object.assign(F.v, keep, { srcK: x }); rerender(); } }), { cls: 'span2' })}
          ${ttr ? tr : kq}
          ${k.field('Đơn vị sử dụng', vSelect({ id: 'hd-unit', value: v.unit, searchable: true, placeholder: 'Chọn đơn vị', invalid: !!err.unit, options: units.map((u) => ({ value: u, label: u })), onChange: (x) => { grab(); v.unit = x; delete err.unit; v.focal = UNIT_FOCAL[x] || v.focal; rerender(); } }), { req: true, err: err.unit })}
          ${k.field('Tiền tệ', vSelect({ id: 'hd-cur', value: v.cur, options: k.catOpts('tien-te'), onChange: (x) => { grab(); v.cur = x; rerender(); } }))}
          ${k.field('Người thực hiện', `<input class="vctl" value="${esc(persona(Flow.state.persona).name)}" disabled>`)}
          ${k.field('Người chuyển tiền', vSelect({ id: 'hd-payer', value: v.payer, searchable: false, options: PAYERS.map((x) => ({ value: x, label: x + ' — Phòng Hợp đồng' })), onChange: ch('payer') }))}
          ${k.field('Đầu mối dự án, đơn vị', vSelect({ id: 'hd-focal', value: v.focal, searchable: true, placeholder: 'Chọn người của đơn vị sử dụng', options: people, onChange: ch('focal') }))}
          ${k.field('Đầu mối KCS', vSelect({ id: 'hd-kcs', value: v.kcs || kcsDef, searchable: false, options: kcsOpts, onChange: ch('kcs') }))}
          ${k.field('File CTKT (yêu cầu kỹ thuật)', ttr ? '<input class="vctl" id="hd-ctkt" type="file">' : `<input class="vctl" value="${g ? `YCKT-HSMT-${esc(g.code)}.pdf (từ HSMT gói thầu)` : ''}" placeholder="Lấy từ HSMT gói thầu" disabled>`, { cls: 'span2' })}
          ${k.field('Ghi chú', `<textarea class="vctl ta" id="hd-note" rows="2" maxlength="1000" placeholder="Nhập ghi chú">${esc(v.note)}</textarea>`, { cls: 'span3' })}
        </div></section>
      ${alloc}</form>`;
  }
  function saveHd() {
    grab();
    const v = F.v, err = F.err = {}, ttr = v.srcK === 'TTR', sx = ttr && v.dx ? ttrSrc(v.dx) : null, val = Number(v.val) || 0;
    if (ttr) {
      if (!v.dx) err.dx = 'Bạn cần chọn Tờ trình / ĐXMS đã phê duyệt.';
      if (!v.km.length) err.km = 'Bạn cần chọn Khoản mục chi phí.';
      if (!v.ncc) err.ncc = 'Bạn cần chọn Nhà thầu ký hợp đồng.';
      if (!(val > 0)) err.val = 'Bạn cần nhập Giá trị hợp đồng.';
      else if (sx && val > sx.cap + 1e-9) err.val = `Giá trị hợp đồng vượt giá trị được phép ${ty(sx.cap, 2)} tỷ đồng (ĐXMS đã phê duyệt / phần không áp dụng LCNT).`;
      if (!v.type) err.type = 'Bạn cần chọn Loại hợp đồng.';
    } else if (!v.pkg) err.pkg = 'Bạn cần chọn Gói thầu.';
    else if (byPkg(v.pkg)) err.pkg = `Gói thầu đã có hợp đồng ${byPkg(v.pkg).code}.`;
    if (!v.title.trim()) err.title = 'Bạn cần nhập Tên hợp đồng.';
    if (!v.unit) err.unit = 'Bạn cần chọn Đơn vị sử dụng.';
    if (Object.keys(err).length) { rerender(); return; }
    const n = Math.max(...all().filter((h) => h.code.startsWith('HĐ-2026')).map((h) => Number(h.code.slice(-4)))) + 1;
    const code = 'HĐ-2026-' + String(n).padStart(4, '0'), now = Flow.dateOf(Flow.state.clock);
    const staff = { payer: v.payer };
    if (v.focal) staff.focal = v.focal;
    if (v.kcs) staff.kcs = v.kcs;
    if (v.note.trim()) staff.note = v.note.trim();
    if (ttr) {
      U.hd.unshift(Object.assign({ code, src: 'TTR', pkgText: '-', khText: '-', originText: v.dx, title: v.title.trim(), ncc: v.ncc, type: v.type, form: null, value: r2(val), cap: sx.cap, cur: v.cur, vat: 10, unit: v.unit,
        owner: persona(Flow.state.persona).name, st: 'TT', created: now, updated: now, exec: 'Theo hợp đồng', alloc: ttrAlloc(v), ctkt: `CTKT-${code.slice(3).replace('-', '')}.pdf`,
        items: [[v.title.trim().replace(/^Hợp đồng /, ''), 'Gói', 1, r2(val)]], neg: { rounds: [], check: [], versions: [], diff: [], sign: [] } }, staff));
    } else {
      const g = T().pkOf(v.pkg), win = g.bidders.find((b) => b[0] === g.winner), q = (g.items || []).reduce((s, r) => s + r[2], 0) || 1;
      U.hd.unshift(Object.assign({ code, src: 'KQ', pkg: g.code, mau: g.mau || T().mauGoiY(g), title: v.title.trim(), ncc: g.winner, type: g.contract, form: g.form, value: win[1], cap: g.price, cur: v.cur, vat: 10, unit: v.unit,
        owner: persona(Flow.state.persona).name, st: 'TT', created: now, updated: now, exec: (traoOf(g.code) || {}).tgGiaoHang || g.execTime, trao: traoOf(g.code) || undefined,
        items: (g.items || []).map((r) => [r[0], r[1], r[2], r2(win[1] / q)]), neg: { rounds: [], check: [], versions: [], diff: [], sign: [] } }, staff));
    }
    persist();
    toast('<b>Thành công</b><br>Thêm mới hợp đồng thành công!');
    location.hash = '#/hop-dong/' + encodeURIComponent(code);
  }

  /* ---------- SCR-86 Chi tiết hợp đồng ---------- */
  const PAY_ST = { DRAFT: ['Đang lập', 'default'], SIGN: ['Đang ký đề nghị', 'warning'], PAY: ['Chờ thanh toán', 'warning'], PAID: ['Đã thanh toán', 'success'] };
  function hdDetail(code) {
    // Theo: task-create (mode detail) + app-tabs, như SCR-80 Chi tiết KHLCNT
    const k = K(), h = hdOf(code);
    if (!h) return `<div class="pg">${head({ title: 'Xem chi tiết hợp đồng', back: 'hop-dong', lg: true })}${k.emptyCard('Thông tin chung', 'Không tìm thấy hợp đồng.')}</div>`;
    const s = srcObj(h), locked = h.st === 'DONG', fx = h.cur !== 'VND' && h.fx;
    const info = {
      scr: 'SCR-86', name: 'Chi tiết hợp đồng', uc: 'Backlog W1_T10 › Quản lý hợp đồng (dòng 424–504)', bpmn: 'MS22 Thương thảo & ký; MS23 Theo dõi thực hiện (.01–.04); MS24 Thanh toán theo đợt',
      notes: [
        'Khuôn task-create (mode detail) + app-tabs; các tab chỉ xem, dữ liệu do bước BPMN ghi: <b>Thương thảo & ký kết</b> = MS22 (vòng thương thảo email, AI kiểm tra dự thảo — Not OK thì làm lại với NCC / sửa nội bộ, ký nháy TTMS + ĐVSD, Thủ trưởng VHT ký, gửi NCC ký VContract / giấy); <b>Tiến độ</b> = MS23 tổng quan (AI đọc HĐ trích mốc, đôn đốc giao hàng, cập nhật ngày thực tế); <b>Bàn giao & nghiệm thu</b> = MS23.02 / 23.03; <b>Văn bản phát sinh</b> = MS23.01; <b>Thanh lý</b> = MS23.04; <b>Thanh toán</b> = MS24 (hồ sơ thanh toán → đề nghị chuyển tiền ký 4 cấp → thanh toán → đồng bộ SAP).',
        'Bản đã ký là <b>bất biến</b>; thay đổi sau ký chỉ bằng phụ lục (MS23.01). Kiểm soát điều chỉnh: giá trị sau điều chỉnh không vượt giá gói thầu / giá trị nguồn; thời gian phù hợp dự án — validate khi lập phụ lục.',
        'So sánh phiên bản dự thảo / phụ lục = DEV-1 (như ĐXMS). Đồng bộ SAP = tích hợp tài chính (chưa giao PIC).',
        `Cảnh báo: bảo đảm thực hiện sắp hết hạn trong ${warnDays('guar')} ngày khi nghĩa vụ chưa xong; hợp đồng sắp hết hạn trong ${warnDays('hd')} ngày; mốc quá hạn → Chậm tiến độ (sự kiện CONTRACT_GUARANTEE_EXPIRING / CONTRACT_EXPIRING / CONTRACT_MILESTONE_LATE).`,
        '<b>Giả lập P-80</b>: ngưỡng là tham số hệ thống (sys_config) cố định — bảo đảm 30 ngày, hợp đồng 90 ngày (D-44: bỏ màn Trigger thông báo). Khách chưa chốt số ngày, chưa chốt có tách theo loại hợp đồng hay không.',
        '<b>MS23 Tổng quan không có màn riêng (D-49):</b> HĐ-2026-0052 ký xong (MS22 bước 13) tự sinh hồ sơ theo dõi; tab Tiến độ thực hiện đọc hồ sơ này. Hệ thống thật cần API tổng hợp theo mã hợp đồng từ các hồ sơ con (plan T25 §5).',
        '<b>Giả lập:</b> các sự kiện đến mốc, nhà thầu thông báo, đến hạn, biên bản đã ký bấm ở công cụ demo; bộ phận nhận thông báo, thời điểm nhắc 7 ngày trước hạn, mốc AI trích xuất là giả định, ngày thực tế lấy bằng ngày kế hoạch (P-120, P-135…P-143). HOC, biên bản nghiệm thu, thanh lý đã nối thật: MS23.02 bước 22, MS23.03 và MS23.04 bước 14 phát sự kiện bước 5.',
        '<b>MS23.04 không có nút Tạo hồ sơ:</b> sự kiện bắt đầu trên bản vẽ là G1 từ MS23.03 bước 6. Hợp đồng sang Đang thanh lý khi có hồ sơ thanh lý, Đã thanh lý khi hồ sơ xong; không yêu cầu thanh lý thì giữ nguyên (P-155, P-160).',
        '<b>MS23.02 (HĐ-2026-0052):</b> Không có nút Tạo hồ sơ: mỗi đợt một hồ sơ, tự sinh từ MS23 bước 4. Đợt chỉ có ngày thực tế khi HOC đã ký đủ; nhánh dịch vụ, phạt, xin ý kiến, hủy hiện trạng thái riêng ở bảng Đợt bàn giao. <b>Giả lập P-122, P-123, P-178, P-179:</b> hạn 7 ngày làm việc; hủy toàn bộ thì hợp đồng Chấm dứt; nhánh phạt và xin ý kiến giữ trạng thái chờ.',
        '<b>MS23.01 (HĐ-2026-0052):</b> Tạo hồ sơ ở tab Văn bản phát sinh hoặc dòng Luồng con cần khởi tạo; mỗi văn bản một hồ sơ con. Bảng Văn bản phát sinh chỉ gồm bản đã ký. Phụ lục xong thì giá trị, ngày hết hạn đổi, mốc chưa hoàn thành dời theo số ngày gia hạn (MS23 bước 5). <b>Giả lập P-171, P-173:</b> mốc có hiệu lực ngay sau bước 12; kế hoạch thanh toán giữ nguyên, chênh lệch hiện ở Còn phải thanh toán.',
        '<b>T75</b> (D-128, ảnh hệ thống cũ 17/11 HT-HD-IMG2): Thông tin chung thêm Khối, Đơn vị sử dụng / Người thực hiện (đổi tên từ Đơn vị quản lý / Đầu mối theo dõi), Lĩnh vực, Người / Ngày tạo + <b>Lịch sử tác động</b> (audit log), Giá trị tiết kiệm (giá gói thầu − giá trúng thầu), card <b>Phân bổ nguồn vốn / đề tài, dự án</b> (sao chép nguồn gói thầu; hợp đồng nhập lấy từ tệp nhập — GIẢ LẬP P-274). Hạng mục theo <b>Phụ lục 1</b> (Part number, hãng, xuất xứ, chủng loại, năm SX, bảo hành; nhập Excel khi thương thảo). Bảo đảm thêm Số văn bản và <b>Bảo lãnh bảo hành</b> (mẫu 1.x). Tiến độ thêm <b>Mốc biên bản</b> HOC / nghiệm thu / thanh lý (P-272: chưa tách PAC / FAC). Bàn giao thêm ngày theo thông báo, người giao, số biên bản, giá trị đợt, phạt và bảng <b>Hàng hóa đã nhận</b> (serial, số ngày chậm — bảng lặp eForm MS23.02). Thanh toán thêm ngày dự kiến, số / ngày đề nghị, ĐNCT, ngày thanh toán, hóa đơn (tài liệu của hồ sơ thanh toán) và card <b>Thông tin SAP</b> chỉ xem. Tab <b>Tài liệu</b> thay checklist hồ sơ của hệ thống cũ. Không làm tab Hóa đơn / Tài sản / Xuất nhập khẩu / SAP riêng (D-118, D-128). Số biên bản, serial, số đề nghị, số SAP, ngày dự kiến thanh toán là dữ liệu minh hoạ (GIẢ LẬP P-273).',
        '<b>T79</b> (D-131, đối chiếu file Convert 19/11 với ảnh HT-HD-IMG2): <b>PAC / FAC</b> có nguồn (QT-10.2.5 thuật ngữ, bước 11; DG-MS23.03 mục 5 — loại hồ sơ nghiệm thu chọn theo hợp đồng): Thông tin chung có <b>Mức nghiệm thu áp dụng</b> (AI trích ở MS23, sửa được; GIẢ LẬP hàng hoá cần lắp đặt → PAC → FAC, hàng hoá khác → FAC, dịch vụ → nghiệm thu dịch vụ), Mốc biên bản HOC · PAC · FAC · Thanh lý có cột <b>Thời hạn theo hợp đồng</b>, Đợt nghiệm thu có cột <b>Loại nghiệm thu</b> (trường <code>tnLoai</code> eForm MS23.03 bước 3). Thông tin chung thêm <b>Người chuyển tiền</b>, <b>Đầu mối dự án, đơn vị</b>, <b>Đầu mối KCS</b>, <b>File CTKT</b>, <b>Ghi chú</b> (chọn ở SCR-85, sửa ở MS22 bước 1). Phân bổ nguồn thêm cột <b>Loại chi phí</b>. Hạng mục thêm <b>ID hàng hóa</b>, <b>Mô tả</b> (cột 7 Phụ lục 1). Tab Thanh toán thêm card <b>Hóa đơn</b> (MS24 bước 5, nhiều hoá đơn / hồ sơ). Tab Bàn giao: Hàng hóa đã nhận có lọc đợt / từ khóa, thêm hãng, xuất xứ, đơn giá, thành tiền, <b>Mã tài sản</b> chỉ xem (đồng bộ SAP sau ghi tăng — tích hợp chưa giao PIC); card <b>Xuất nhập khẩu</b> cho hợp đồng có hàng nhập khẩu (theo đề xuất DX-18 — nhóm trường eForm ở bước giao nhận MS23.02). Tab Tài liệu thêm <b>Ngày sao CC/CT</b>, <b>Ghi chú</b>, Xuất Excel. Nguồn hình thành <b>Tờ trình / ĐXMS</b> theo đề xuất DX-17. Không có tab Tài sản / Hóa đơn / XNK riêng.',
        '<b>MS24 (HĐ-2026-0052):</b> Tạo hồ sơ thanh toán ở tab Thanh toán = phát sinh một đợt, mỗi đợt một hồ sơ con. <b>Giả lập P-147:</b> kế hoạch và số tiền từng đợt đặt trong dữ liệu mẫu; đợt có mốc chưa có ngày thực tế thì chưa tạo được hồ sơ. Đợt Giữ lại bảo hành chưa tới kỳ.',
      ],
      q: ['P-80', 'P-273', 'P-274', 'P-HD-01', 'P-HD-02', 'P-HD-04', 'P-HD-05', 'P-HD-06', 'P-120', 'P-135', 'P-136', 'P-138', 'P-139', 'P-140', 'P-141', 'P-142', 'P-143', 'P-147', 'P-122', 'P-123', 'P-171', 'P-173', 'P-178', 'P-179'], src: 'task-management/components/task-create (mode detail) · /task-management/detail/:id',
    };
    const warn = [];
    if (h.held) warn.push(['error', h.held]);
    guarWarn(h).forEach((g) => warn.push(['warning', `Bảo đảm thực hiện hợp đồng hết hiệu lực ngày ${g[4]} (còn ${days(TODAY, g[4])} ngày) trong khi nghĩa vụ hợp đồng chưa hoàn thành.`]));
    if (hdSoon(h)) warn.push(['warning', `Hợp đồng hết hạn ngày ${h.end} (còn ${days(TODAY, h.end)} ngày) — rà soát nghĩa vụ còn lại, lập phụ lục gia hạn hoặc chuẩn bị thanh lý.`]);
    lateMs(h).forEach((m) => warn.push(['error', `Mốc "${m[0]}" quá hạn ${days(m[1], TODAY)} ngày (kế hoạch ${m[1]}).`]));
    if (h.noFile && ['TH', 'TL'].includes(h.st)) warn.push(['warning', 'Chưa có bản hợp đồng đã ký trên hệ thống — tải lên bản chính thức ở tab Tài liệu.']);
    if (locked) warn.push(['info', `Hợp đồng đã thanh lý ngày ${h.liq.closed} — dữ liệu đã khoá chỉnh sửa.`]);
    const alerts = warn.length ? `<div class="hd-alerts">${warn.map(([t, x]) => `<div class="hd-alert ${t}">${icon('info')}<span>${esc(x)}</span></div>`).join('')}</div>` : '';

    const tInfo = () => k.card('Thông tin chung hợp đồng', `<div class="ginfo c3">
        ${k.kv('Mã hợp đồng', esc(h.code))}${k.kv('Tên hợp đồng', esc(h.title), 'span2')}
        ${k.kv('Số hợp đồng', h.no ? esc(h.no) : null)}${k.kv('Trạng thái', badge(...HD_ST[h.st]))}${k.kv('Bước hiện tại', esc(h.stepName || HD_STEP[h.st]))}
        ${k.kv('Nguồn hình thành', esc(SRC_HD[h.src]))}${k.kv('Gói thầu', pkgLink(h))}${k.kv('KHLCNT', h.pkg && s.kh ? `<a class="link-red" href="#/khlcnt/${encodeURIComponent(s.kh)}">${esc(s.kh)}</a>` : esc(s.kh || '-'))}
        ${k.kv('Đối tượng nguồn (ĐXMS / KĐT)', s.originHref ? `<a class="link-red" href="#/${s.originHref}">${esc(s.origin)}</a>` : esc(s.origin || '-'))}${k.kv('Hình thức lựa chọn nhà thầu', h.src === 'TTR' ? 'Không qua LCNT — theo tờ trình / ĐXMS (theo đề xuất)' : esc(k.cat('hinh-thuc-lcnt', h.form)))}${k.kv('Loại hợp đồng', esc(k.cat('loai-hop-dong', h.type)))}
        ${k.kv('Khối', esc(blockOf(h)))}${k.kv('Đơn vị sử dụng', esc(h.unit))}${k.kv('Người thực hiện', esc(h.owner))}${k.kv('Lĩnh vực', esc(fieldOf(h)))}${k.kv('Hình thức ký', h.sign ? (h.esign ? 'Ký điện tử (VContract)' : 'Ký giấy') : null)}
        ${((m) => k.kv('Mẫu hợp đồng', m ? `<a class="link-red" href="#" data-dl="${esc(m.file || m.code + '.docx')}">${esc(m.code)} — ${esc(m.name)}</a>` : null, 'span2') + k.kv('Phương thức thanh toán', m ? esc(m.tt) : null))(mauHd(h))}
        ${((st) => `${k.kv('Người chuyển tiền', esc(st.payer))}${k.kv('Đầu mối dự án, đơn vị', esc(st.focal))}${k.kv('Đầu mối KCS', esc(st.kcs))}
        ${k.kv('Mức nghiệm thu áp dụng', esc(ntLoai(h).map((x) => NT_LB[x]).join(' → ')))}${k.kv('File CTKT', st.ctkt ? `<a class="link-red" href="#" data-dl="${esc(st.ctkt)}">${esc(st.ctkt)}</a>` : null)}${k.kv('Ghi chú', st.note ? esc(st.note) : null)}`)(staffOf(h))}
        ${k.kv('Người / Ngày tạo', `${esc(h.owner)} / ${esc(h.created)} · <a class="link-red" href="#" data-hd-log="${esc(h.code)}">Lịch sử tác động</a>`, 'span2')}</div>`)
      + k.card('Giá trị hợp đồng', `<div class="ginfo c3">
        ${k.kv('Giá trị hợp đồng (đã gồm thuế GTGT)', ty(h.value, 2) + ' tỷ đồng')}${k.kv('Thuế GTGT', h.vat + '%')}${k.kv('Tiền tệ', esc(k.cat('tien-te', h.cur)))}
        ${k.kv('Giá trị theo nguyên tệ', fx ? `${Math.round(h.value * 1e9 / h.fx).toLocaleString('vi-VN')} ${esc(h.cur)}` : null)}${k.kv('Tỷ giá quy đổi', fx ? `${h.fx.toLocaleString('vi-VN')} VNĐ/${esc(h.cur)} (ngày ký)` : null)}
        ${k.kv('Giá trị ban đầu (trước phụ lục)', h.value0 ? ty(h.value0, 2) + ' tỷ đồng' : null)}
        ${k.kv('Giới hạn giá trị (giá gói thầu / nguồn)', ty(h.cap, 2) + ' tỷ đồng')}${k.kv('Giá trị tiết kiệm', ty(r2(h.cap - (h.value0 || h.value)), 2) + ' tỷ đồng (giá gói thầu − giá trúng thầu)')}${k.kv('Đã thanh toán', ty(paidSum(h), 2) + ' tỷ đồng')}${k.kv('Còn phải thanh toán', ty(remain(h), 2) + ' tỷ đồng')}</div>`)
      + k.card('Thời gian', `<div class="ginfo c3">
        ${k.kv('Ngày ký', h.sign || null)}${k.kv('Ngày hiệu lực', h.eff || null)}${k.kv('Ngày hết hạn', h.end ? esc(h.end) + (h.end0 ? ` (ban đầu ${esc(h.end0)})` : '') : null)}
        ${k.kv('Thời gian thực hiện', esc(h.exec))}${k.kv('Hiệu lực', badge(...eff(h)))}${k.kv('Tiến độ', badge(...prog(h)))}</div>`)
      + allocCard(allocOf(h));
    const tDt = () => {
      const jv = h.jv || [[h.ncc, 'Nhà thầu ký hợp đồng', 100]];
      return k.card(h.jv ? 'Liên danh nhà thầu' : 'Nhà thầu ký hợp đồng', k.table([['Mã nhà thầu', 140], ['Tên nhà thầu', 320], ['Vai trò', 300], ['Tỷ lệ phần việc', 140, 'r'], ['Giá trị phần việc (tỷ đồng)', 190, 'r']], jv,
        (r) => `<td>${esc(r[0])}</td><td>${k.clamp(nccName(r[0]))}</td><td>${esc(r[1])}</td><td class="r num">${r[2]}%</td><td class="r num">${m3(r2(h.value * r[2] / 100))}</td>`), h.jv ? 'Thỏa thuận liên danh ghi trong HSDT trúng thầu' : 'Nhà thầu trúng thầu trở thành bên ký hợp đồng')
        + k.card('Đại diện ký hợp đồng', `<div class="ginfo c3">${k.kv('Bên mua', 'Tổng công ty Công nghiệp Công nghệ cao Viettel')}${k.kv('Người đại diện bên mua', 'Thủ trưởng VHT (hoặc người được uỷ quyền)')}${k.kv('Bên bán', esc(nccName(h.ncc)))}
          ${k.kv('Người đại diện bên bán', (() => { const r = h.trao && h.trao.rep ? h.trao : nccRep(h.ncc); return r.rep ? esc(r.rep) + (r.position ? ` — ${esc(r.position)}` : '') : null; })())}</div>`)
        + (h.trao ? traoCard(h.trao, 'Sao chép khi tạo hợp đồng từ gói thầu (MS19 bước 22)') : '');
    };
    const tHm = () => {
      const accQ = (i) => (h.acc || []).filter((a) => a[5] === 'Đạt').reduce((s0, a) => s0 + qtyOf(h, a[0], i), 0);
      const tot = r2(h.items.reduce((s0, r) => s0 + r[2] * r[3], 0));
      /* T75: cột theo Phụ lục 1 — Danh mục hàng hóa và giá cả (mẫu hợp đồng BM-HD-2026; ảnh hệ thống cũ 6534, 6536–6537). */
      const sp = SPEC[h.code] || [], pre = (v) => ty(v / (1 + (h.vat || 10) / 100), 3), canImp = h.st === 'TT';
      return `<section class="vcard pad24"><div class="vcard-h"><h3>Danh sách hàng hoá / dịch vụ / công việc (Phụ lục 1)</h3><div class="r"><a class="link-red" href="#" data-dl="Mau-Phu-luc-1-Danh-muc-hang-hoa.xlsx">Tải mẫu Phụ lục 1</a>
          ${canImp ? `<button type="button" class="vbtn secondary" data-hd-pl1="${esc(h.code)}">${icon('upload')} Nhập từ Excel Phụ lục 1</button>` : ''}</div></div>
        ${k.table([['ID hàng hóa', 110], ['Hàng hoá / dịch vụ / công việc', 300], ['Ký mã hiệu / Part number', 170], ['Hãng sản xuất', 140], ['Xuất xứ / Nhà phân phối', 170], ['Chủng loại', 150], ['Mô tả', 280], ['Năm sản xuất', 110, 'r'], ['Bảo hành (tháng)', 120, 'r'],
          ['Đơn vị tính', 110], ['Số lượng', 100, 'r'], ['Đơn giá chưa VAT (tỷ đồng)', 180, 'r'], ['Đơn giá (tỷ đồng)', 140, 'r'], ['Thành tiền (tỷ đồng)', 150, 'r'], ['Hạng mục gói thầu', 200], ['Đã nghiệm thu', 130, 'r']], h.items,
        (r, i) => { const x = sp[i] || [], ds = (DESC[h.code] || [])[i]; return `<td class="num">${esc(itemId(h, i))}</td><td>${k.clamp(r[0])}</td><td>${x[0] ? esc(x[0]) : k.dash}</td><td>${x[1] ? esc(x[1]) : k.dash}</td><td>${x[2] ? k.clamp(x[2]) : k.dash}</td><td>${x[3] ? esc(x[3]) : k.dash}</td><td>${ds ? k.clamp(ds) : k.dash}</td><td class="r num">${x[4] || k.dash}</td><td class="r num">${x[5] || k.dash}</td>
          <td>${esc(r[1])}</td><td class="r num">${ty(r[2], 0)}</td><td class="r num">${pre(r[3])}</td><td class="r num">${ty(r[3], 3)}</td><td class="r num">${ty(r2(r[2] * r[3]), 3)}</td>
          <td>${h.pkg ? esc(h.pkg + ' · ' + r[0]) : esc((h.pkgText || '') + ' · ' + r[0])}</td><td class="r num">${accQ(i)} / ${r[2]}</td>`; },
        `<tfoot><tr><td></td><td colspan="13"><b>Cộng (đã gồm thuế GTGT ${h.vat || 10}%)</b></td><td class="r num"><b>${ty(tot, 3)}</b></td><td colspan="2">${Math.abs(tot - h.value) < 0.01 ? badge('Khớp giá trị hợp đồng', 'success') : badge('Lệch giá trị hợp đồng', 'error')}</td></tr></tfoot>`)}
        <p class="cap">Hạng mục hợp đồng liên kết hạng mục gói thầu — không vượt phạm vi KQLCNT. Thông số (Part number, hãng, xuất xứ…) nhập theo Phụ lục 1 khi thương thảo; hợp đồng nhập từ dữ liệu cũ có thể trống.</p></section>`;
    };
    const tTt = () => {
      const n = h.neg;
      if (!n) {
        return k.emptyCard('Thương thảo & ký kết', 'Hợp đồng nhập từ dữ liệu cũ: không có hồ sơ thương thảo trên hệ thống.')
          + k.card('Hợp đồng đã ký', `<div class="ginfo c3">${k.kv('Số hợp đồng', esc(h.no))}${k.kv('Ngày ký', esc(h.sign))}${k.kv('Bản chính thức', `<a class="link-red" href="#" data-dl="${esc(h.no.replace(/\//g, '-'))}.pdf">${esc(h.no.replace(/\//g, '-'))}.pdf</a> · bất biến`)}</div>`);
      }
      return caseCard(h) + k.card('Các vòng thương thảo', k.table([['Vòng', 70, 'c'], ['Ngày', 110], ['Nội dung', 300], ['Đã thống nhất', 280], ['Chưa thống nhất', 280], ['Biên bản', 200]], n.rounds,
          (r) => `<td class="c">${esc(r[0])}</td><td class="num">${esc(r[1])}</td><td>${k.clamp(r[2])}</td><td>${k.clamp(r[3])}</td><td>${k.clamp(r[4])}</td><td>${r[5] ? `<a class="link-red" href="#" data-dl="${esc(r[5])}">${esc(r[5])}</a>` : k.dash}</td>`), 'Chưa có vòng thương thảo thì để trống')
        + k.card('Đối chiếu dự thảo hợp đồng', k.table([['Căn cứ', 160], ['Nội dung đối chiếu', 560], ['Kết quả', 120, 'c']], n.check,
          (r) => `<td>${esc(r[0])}</td><td>${k.clamp(r[1])}</td><td class="c">${r[2] === 'Khớp' ? badge('Khớp', 'success') : badge('Lệch', 'error')}</td>`), 'Với KQLCNT, HSMT / HSYC / HSMCG, HSDT / HSĐX / HSCG trúng thầu')
        + (n.ai ? k.card('Gợi ý AI — kiểm tra dự thảo hợp đồng', `<div class="ginfo c3">${k.kv('Kết quả', n.ai[0] === 'Đạt' ? badge('Đạt', 'success') : badge('Chưa đạt', 'error'))}${k.kv('Nhận xét', esc(n.ai[1]), 'span2')}</div>`) : '')
        + k.card('Phiên bản dự thảo hợp đồng', k.table([['Phiên bản', 100], ['Ngày', 120], ['Nội dung', 460], ['Người soạn', 200]], n.versions,
          (r) => `<td>${esc(r[0])}</td><td class="num">${esc(r[1])}</td><td>${k.clamp(r[2])}</td><td>${esc(r[3])}</td>`))
        + (n.diff.length ? k.card('So sánh dự thảo v1 / v2', k.table([['Điều khoản', 280], ['Phiên bản trước', 360], ['Phiên bản sau', 360]], n.diff,
          (d) => `<td>${k.clamp(d[0])}</td><td><span class="diff-old">${esc(d[1])}</span></td><td><span class="diff-new">${esc(d[2])}</span></td>`), 'Chỉ liệt kê điều khoản thay đổi') : '')
        + k.card('Trình ký hợp đồng', k.table([['Bước ký', 260], ['Người ký', 220], ['Trình ký lúc', 150], ['Ký lúc', 150], ['Kết quả', 140, 'c']], n.sign,
          (r) => `<td>${esc(r[0])}</td><td>${esc(r[1])}</td><td class="num">${esc(r[2] || '-')}</td><td class="num">${esc(r[3] || '-')}</td><td class="c">${badge(r[4], r[4] === 'Đã ký' ? 'success' : r[4] === 'Từ chối' ? 'error' : 'info')}</td>`),
          h.held ? 'Tạm dừng trình ký theo kiến nghị' : 'Ký nháy TTMS + đơn vị sử dụng → Thủ trưởng VHT → nhà thầu (VContract / giấy)');
    };
    const tBd = () => k.card('Bảo đảm thực hiện hợp đồng', k.table([['Hình thức', 260], ['Số văn bản bảo lãnh', 170], ['Giá trị (tỷ đồng)', 150, 'r'], ['Tỷ lệ', 80, 'r'], ['Hiệu lực từ', 120], ['Hiệu lực đến', 120], ['Tổ chức phát hành', 280], ['Tình trạng', 190, 'c']], h.guar || [],
        (g) => { const left = days(TODAY, g[4]); return `<td>${esc(k.cat('hinh-thuc-bao-dam', g[0]))}</td><td>${esc(blNo(g, h, 'BLTH'))}</td><td class="r num">${ty(g[1], 3)}</td><td class="r num">${g[2]}%</td><td class="num">${esc(g[3])}</td><td class="num">${esc(g[4])}</td><td>${k.clamp(g[5])}</td>
          <td class="c">${h.st === 'DONG' ? badge('Đã giải toả', 'default') : left < 0 ? badge('Hết hiệu lực', 'default') : left <= warnDays('guar') && ['TH', 'TL'].includes(h.st) ? badge(`Sắp hết hạn (${left} ngày)`, 'warning') : badge('Còn hiệu lực', 'success')}</td>`; }),
        h.guar ? 'Tỷ lệ theo Quy chế, tính trên giá trị hợp đồng' : 'Lập khi ký hợp đồng')
      + (h.adv && hasAdv(h) ? k.card('Bảo lãnh tạm ứng', k.table([['Hình thức', 260], ['Số văn bản bảo lãnh', 170], ['Giá trị (tỷ đồng)', 150, 'r'], ['Hiệu lực từ', 120], ['Hiệu lực đến', 120], ['Tổ chức phát hành', 280], ['Ghi chú', 260]], h.adv,
        (g) => `<td>${esc(k.cat('hinh-thuc-bao-dam', g[0]))}</td><td>${esc(blNo(g, h, 'BLTU'))}</td><td class="r num">${ty(g[1], 3)}</td><td class="num">${esc(g[2])}</td><td class="num">${esc(g[3])}</td><td>${k.clamp(g[4])}</td><td>${k.clamp(g[5])}</td>`)) : '')
      + (wgOf(h).length ? k.card('Bảo lãnh bảo hành', k.table([['Hình thức', 260], ['Số văn bản bảo lãnh', 170], ['Giá trị (tỷ đồng)', 150, 'r'], ['Tỷ lệ', 80, 'r'], ['Hiệu lực từ', 120], ['Hiệu lực đến', 120], ['Tổ chức phát hành', 280]], wgOf(h),
        (g) => `<td>${esc(k.cat('hinh-thuc-bao-dam', g[0]))}</td><td>${esc(blNo(g, h, 'BLBH'))}</td><td class="r num">${ty(g[1], 3)}</td><td class="r num">${g[2]}%</td><td class="num">${esc(g[3])}</td><td class="num">${esc(g[4])}</td><td>${k.clamp(g[5])}</td>`),
        'Theo phụ lục mẫu bảo lãnh bảo hành của mẫu hợp đồng 1.x (BM-HD-2026)') : '')
      + k.card('Bảo hành', k.table([['Hạng mục', 300], ['Thời gian bảo hành', 150], ['Từ ngày', 120], ['Đến ngày', 120], ['Điều kiện', 300], ['Trạng thái', 160, 'c']], h.warr || [],
        (w) => `<td>${k.clamp(w[0])}</td><td>${esc(w[1])}</td><td class="num">${esc(w[2])}</td><td class="num">${esc(w[3])}</td><td>${k.clamp(w[4])}</td><td class="c">${dk(w[3]) >= dk(TODAY) ? badge('Đang bảo hành', 'info') : badge('Hết bảo hành', 'default')}</td>`), 'Nghĩa vụ kéo dài sau nghiệm thu');
    const tTd = () => {
      if (!(h.ms || []).length) return k.emptyCard('Kế hoạch / mốc thực hiện', 'Mốc thực hiện được lập sau khi hợp đồng có hiệu lực (AI đọc hợp đồng trích mốc — MS23).');
      const rate = doneRate(h);
      return caseCard(h, 'MS23') + trackInfo(h) + k.card('Tình hình thực hiện', `<div class="ginfo c3">${k.kv('Tỷ lệ hoàn thành (theo khối lượng mốc)', rate + '%')}${k.kv('Giá trị đã nghiệm thu', ty(accSum(h), 2) + ' tỷ đồng (' + Math.round(accSum(h) / h.value * 100) + '%)')}${k.kv('Tiến độ', badge(...prog(h)))}</div>
          <div class="hd-bar" role="img" aria-label="Tỷ lệ hoàn thành ${rate}%"><span style="width:${rate}%"></span></div>`)
        + k.card('Mốc biên bản', k.table([['Biên bản', 300], ['Thời hạn theo hợp đồng', 260], ['Ngày dự kiến', 130], ['Ngày thực tế', 130], ['Tệp biên bản', 280], ['Trạng thái', 170, 'c']], milestones(h),
          (m) => `<td>${esc(m[0])}</td><td>${k.clamp(m[1])}</td><td class="num">${m[2] ? esc(m[2]) : k.dash}</td><td class="num">${m[3] ? esc(m[3]) : k.dash}</td><td>${m[4] ? `<a class="link-red" href="#" data-dl="${esc(m[4])}">${esc(m[4])}</a>` : k.dash}</td>
            <td class="c">${m[5] ? badge('Không áp dụng', 'default') : m[3] ? badge('Đã ký', 'success') : m[2] && dk(m[2]) < dk(TODAY) ? badge('Quá hạn', 'error') : badge('Chưa ký', 'default')}</td>`),
          'HOC (MS23.02) · PAC / FAC theo mức nghiệm thu của hợp đồng (MS23.03; QT-10.2.5) · thanh lý (MS23.04)')
        + k.card('Kế hoạch / mốc thực hiện', k.table([['Mốc', 360], ['Kế hoạch', 120], ['Thực tế', 120], ['Khối lượng', 110, 'r'], ['Trạng thái', 190, 'c']], h.ms,
          (m) => { const late = !m[2] && dk(m[1]) < dk(TODAY), lateDone = m[2] && dk(m[2]) > dk(m[1]);
            return `<td>${k.clamp(m[0])}</td><td class="num">${esc(m[1])}</td><td class="num">${m[2] ? esc(m[2]) : k.dash}</td><td class="r num">${m[3]}%</td>
            <td class="c">${m[2] ? (lateDone ? badge(`Hoàn thành chậm ${days(m[1], m[2])} ngày`, 'warning') : badge('Hoàn thành', 'success')) : late ? badge(`Quá hạn ${days(m[1], TODAY)} ngày`, 'error') : badge('Chưa đến hạn', 'default')}</td>`; }), 'So sánh kế hoạch và thực tế')
        + k.card('Kết quả kiểm tra chất lượng (KCS)', k.table([['Đợt', 100], ['Ngày', 120], ['Hàng hoá', 360], ['Kết quả', 170, 'c']], (h.dl || []).filter((d) => d[3]),
          (d) => `<td>${esc(d[1])}</td><td class="num">${esc(d[3])}</td><td>${k.clamp(d[5])}</td><td class="c">${d[6] === 'Đạt' ? badge('Đạt', 'success') : badge(d[6] || 'Chưa kiểm tra', d[6] ? 'error' : 'default')}</td>`))
        + trackCards(h);
    };
    /* MS23 Tổng quan: kết quả AI trích xuất và các sự kiện đã ghi về hồ sơ theo dõi. */
    const trackInfo = (x) => (x.track ? k.card('Thông tin AI trích xuất từ hợp đồng đã ký', `<div class="ginfo c3">${k.kv('Số hợp đồng', esc(x.no))}${k.kv('Ngày ký', esc(x.sign))}${k.kv('Nhà thầu', esc(nccName(x.ncc)))}
        ${k.kv('Giá trị hợp đồng', ty(x.value, 2) + ' tỷ đồng')}${k.kv('Thời gian thực hiện', esc(x.exec))}${k.kv('Số mốc theo dõi', String(x.ms.length))}</div>`) : '');
    const trackCards = (x) => {
      if (!x.track) return '';
      const v = x.track.vars;
      return ((v.reminds || []).length ? k.card('Nhắc giao hàng đã gửi', k.table([['Mốc', 360], ['Hạn', 120], ['Ngày gửi', 120], ['Người nhận', 240], ['Kênh', 240]], v.reminds,
          (r) => `<td>${k.clamp(r.ms)}</td><td class="num">${esc(r.plan)}</td><td class="num">${esc(r.at)}</td><td>${k.clamp(r.to)}</td><td>${k.clamp(r.ch)}</td>`)) : '')
        + ((v.notices || []).length ? k.card('Thông báo giao hàng của nhà thầu', k.table([['Đợt', 260], ['Ngày dự kiến giao', 130], ['Địa điểm', 230], ['Kênh tiếp nhận', 120], ['Đã thông báo', 280]], v.notices,
          (r) => `<td>${k.clamp(r.dot)}</td><td class="num">${esc(r.ngay)}</td><td>${k.clamp(r.site)}</td><td>${esc(r.kenh)}</td><td>${k.clamp(r.to)}</td>`), 'Hồ sơ giao hàng chuyển sang Bàn giao hàng hoá / dịch vụ') : '')
        + ((v.triggers || []).length ? k.card('Luồng con cần khởi tạo', k.table([['Quy trình', 120], ['Tên', 200], ['Lý do', 280], ['Ngày', 120], ['Trạng thái', 150, 'c'], ['Hồ sơ', 170]], v.triggers,
          (r, i) => { const P = D.hdProcesses[r.flow], cc = !P ? null : P.many ? casesOfP(x.code, r.flow).find((c) => c.vars.trg === i) : Flow.caseOf(D.hdCaseCode(x.code, r.flow)), can = P && !cc && (Flow.state.persona === 'phd' || D.allAccess(Flow.state.persona));
            return `<td>${esc(r.flow)}</td><td>${esc(r.name)}</td><td>${k.clamp(r.why)}</td><td class="num">${esc(r.at)}</td><td class="c">${cc ? badge('Đã khởi tạo', 'success') : badge('Chờ khởi tạo', 'warning')}</td>
            <td>${cc ? `<a class="link" data-go="ho-so-hd/${esc(cc.code)}">${esc(cc.code)}</a>` : can ? `<button type="button" class="vbtn sm primary" data-hd-newnt="${esc(r.flow)}" data-trg="${i}"${r.kcs ? ` data-kcs="${esc(r.kcs)}"` : ''}>Tạo hồ sơ</button>` : k.dash}</td>`; }), 'Phòng Hợp đồng khởi tạo') : '')
        + k.card('Nhật ký theo dõi', k.table([['Ngày', 120], ['Sự kiện', 340], ['Kết quả', 560]], v.trackLog || [], (r) => `<td class="num">${esc(r[0])}</td><td>${k.clamp(r[1])}</td><td>${k.clamp(r[2])}</td>`));
    };
    const tBg = () => {
      const cases = caseCard(h, 'MS23.02', 'Hồ sơ bàn giao') + caseCard(h, 'MS23.03', 'Hồ sơ nghiệm thu');
      const remainItems = h.items.map((r, i) => [r[0], r[1], r[2], (h.dl || []).filter((d) => d[3]).reduce((s0, d) => s0 + qtyOf(h, d[0], i), 0)]);
      return cases + k.card('Đợt bàn giao', k.table([['Mã', 90], ['Đợt', 100], ['Kế hoạch', 110], ['Ngày giao theo thông báo', 170], ['Thực tế', 110], ['Người giao', 220], ['Địa điểm giao nhận', 260], ['Hàng hoá / dịch vụ bàn giao', 320],
          ['Giá trị đợt chưa VAT (tỷ đồng)', 200, 'r'], ['Giá trị phạt (tỷ đồng)', 160, 'r'], ['Số biên bản bàn giao', 190], ['KCS', 150, 'c']], h.dl || [],
          (d) => { const no = bbbgNo(h, d), v = dlValue(h, d), pn = dlPenalty(h, d);
            return `<td>${esc(d[0])}</td><td>${esc(d[1])}</td><td class="num">${esc(d[2])}</td><td class="num">${esc(d[2])}</td><td class="num">${d[3] ? esc(d[3]) : k.dash}</td><td>${k.clamp('Đại diện ' + nccName(h.ncc))}</td><td>${k.clamp(d[4])}</td><td>${k.clamp(d[5])}</td>
            <td class="r num">${v == null ? k.dash : ty(v, 3)}</td><td class="r num">${pn == null ? k.dash : ty(pn, 3)}</td><td>${no ? `<a class="link-red" href="#" data-dl="${esc(no)}.pdf">${esc(no)}</a>` : k.dash}</td>
            <td class="c">${d[7] ? badge(...d[7]) : !d[3] ? badge('Chưa giao', 'default') : d[6] === 'Đạt' ? badge('Đạt', 'success') : badge(d[6], 'error')}</td>`; }), 'MS23.02 — hàng không đạt xử lý trong 07 ngày')
        + recvCard(h)
        + xnkCard(h)
        + (h.dl && h.dl.length ? k.card('Phần còn phải bàn giao', k.table([['Hàng hoá', 360], ['Đơn vị tính', 120], ['Theo hợp đồng', 140, 'r'], ['Đã bàn giao', 140, 'r'], ['Còn lại', 120, 'r']], remainItems,
          (r) => `<td>${k.clamp(r[0])}</td><td>${esc(r[1])}</td><td class="r num">${r[2]}</td><td class="r num">${r[3]}</td><td class="r num">${r[2] - r[3]}</td>`)) : '')
        + k.card('Đợt nghiệm thu', k.table([['Mã', 90], ['Đợt', 120], ['Loại nghiệm thu', 160], ['Ngày', 110], ['Khối lượng nghiệm thu', 320], ['Giá trị (tỷ đồng)', 140, 'r'], ['Kết quả', 120, 'c'], ['Nội dung chưa đạt / cần khắc phục', 300]], h.acc || [],
          (a) => `<td>${esc(a[0])}</td><td>${esc(a[1])}</td><td>${esc(NT_LB[accType(h, a)])}</td><td class="num">${esc(a[2])}</td><td>${k.clamp(a[3])}</td><td class="r num">${m3(a[4])}</td><td class="c">${a[5] === 'Đạt' ? badge('Đạt', 'success') : badge('Chưa đạt', 'error')}</td><td>${k.clamp(a[6])}</td>`),
          `Lũy kế đã nghiệm thu: ${ty(accSum(h), 2)} / ${ty(h.value, 2)} tỷ đồng (${h.value ? Math.round(accSum(h) / h.value * 100) : 0}%)`);
    };
    const tPay = () => {
      const pid = Flow.state.persona, can = h.code === RUN ? ['TH', 'TL'].includes(h.st) && (pid === 'phd' || D.allAccess(pid)) && nextPays(h).length : ['TH', 'TL'].includes(h.st) && payable(h).length;
      return k.card('Tổng hợp thanh toán', `<div class="ginfo c3">${k.kv('Giá trị hợp đồng', ty(h.value, 2) + ' tỷ đồng')}${k.kv('Đã tạm ứng', ty(advOf(h), 2) + ' tỷ đồng')}${k.kv('Đã thu hồi tạm ứng', ty(advBack(h), 2) + ' tỷ đồng')}
          ${k.kv('Đã thanh toán (lũy kế, ròng)', ty(paidSum(h), 2) + ' tỷ đồng')}${k.kv('Còn phải thanh toán', ty(remain(h), 2) + ' tỷ đồng')}${k.kv('Tỷ lệ thanh toán', (h.value ? Math.round(paidSum(h) / h.value * 100) : 0) + '%')}</div>`)
        + ((pl) => { const dd = payPlanDates(h, pl.rows); return k.card('Kế hoạch thanh toán', k.table([['Mốc', 220], ['Điều kiện thanh toán', 380], ['Ngày thanh toán dự kiến', 170], ['Tỷ lệ', 90, 'r'], ['Giá trị (tỷ đồng)', 150, 'r']], pl.rows,
          (p, i) => `<td>${esc(p[0])}</td><td>${k.clamp(p[1])}</td><td class="num">${dd[i] ? esc(dd[i]) : k.dash}</td><td class="r num">${p[2]}%</td><td class="r num">${m3(p[3])}</td>`),
          !mauHd(h) ? '' : pl.own && h.code !== RUN ? 'Kế hoạch theo hợp đồng đã ký' : 'Theo phương thức thanh toán của mẫu hợp đồng'); })(planOf(h))
        + `<section class="vcard pad24"><div class="vcard-h"><h3>Hồ sơ thanh toán</h3>${can ? `<button type="button" class="vbtn primary" data-hd-pay="${esc(h.code)}">${icon('add')} Tạo hồ sơ thanh toán</button>` : ''}</div>
          ${k.table([['Trạng thái', 160, 'c'], ['Đồng bộ SAP', 190, 'c'], ['Mã hồ sơ', 180], ['Đợt', 200], ['Căn cứ nghiệm thu', 130], ['Đề nghị (tỷ đồng)', 130, 'r'], ['Khấu trừ tạm ứng', 130, 'r'], ['Phạt', 100, 'r'], ['Giữ lại', 100, 'r'], ['Thanh toán ròng', 130, 'r'],
            ['Số đề nghị thanh toán', 170], ['Ngày đề nghị', 120], ['Ngày ban hành ĐNCT', 150], ['Ngày thanh toán', 130], ['Hóa đơn', 170]], h.pays || [],
            (p) => `<td class="c">${badge(...PAY_ST[p[7]])}</td><td class="c">${p[9] ? badge(...p[9]) : p[7] === 'PAID' ? badge('Đã đồng bộ ' + p[8], 'success') : badge('Chưa đồng bộ', 'default')}</td><td>${p[10] ? `<a class="link" data-go="ho-so-hd/${esc(p[0])}">${esc(p[0])}</a>` : esc(p[0])}</td><td>${k.clamp(p[1])}</td><td>${p[2] ? esc(p[2]) : k.dash}</td><td class="r num">${ty(p[3], 3)}</td><td class="r num">${ty(p[4], 3)}</td><td class="r num">${ty(p[5], 3)}</td><td class="r num">${ty(p[6], 3)}</td>
              <td class="r num">${ty(net(p), 3)}</td>${((x) => `<td>${x.no ? esc(x.no) : k.dash}</td><td class="num">${x.req ? esc(x.req) : k.dash}</td><td class="num">${x.dnct ? esc(x.dnct) : k.dash}</td><td class="num">${x.paidAt ? esc(x.paidAt) : k.dash}</td>
              <td>${((iv) => (iv.length ? `<a class="link-red" href="#" data-dl="${esc(iv[0][4])}">${esc(iv[0][0])}</a>${iv.length > 1 ? ` +${iv.length - 1}` : ''}` : k.dash))(invOf(h, p))}</td>`)(payExt(h, p))}`)}</section>`
        /* T79 L2 (D-131): card Hoá đơn — MS24 bước 5 "Cung cấp hoá đơn thanh toán" ghi; một hồ sơ có thể nhiều hoá đơn. */
        + (invAll(h).length ? k.card('Hóa đơn', k.table([['Số hóa đơn', 180], ['Ngày hóa đơn', 130], ['Hồ sơ thanh toán', 170], ['Giá trị (tỷ đồng)', 150, 'r'], ['Tệp hóa đơn', 240], ['Ngày tải lên', 130]], invAll(h),
          (v) => `<td>${esc(v[0])}</td><td class="num">${v[1] ? esc(v[1]) : k.dash}</td><td>${esc(v[2])}</td><td class="r num">${ty(v[3], 3)}</td><td><a class="link-red" href="#" data-dl="${esc(v[4])}">${esc(v[4])}</a></td><td class="num">${v[5] ? esc(v[5]) : k.dash}</td>`),
          'Phòng Hợp đồng cung cấp ở bước 5 của hồ sơ thanh toán (MS24) — đầu vào bảng tổng hợp thanh toán') : '')
        + ((x) => k.card('Thông tin SAP', x ? `<div class="ginfo c3">${k.kv('Số hợp đồng trên SAP', esc(x.hd))}${k.kv('Số PO trên SAP', esc(x.po))}${k.kv('Số hóa đơn', esc(x.inv))}${k.kv('Số bảng tổng hợp thanh toán', esc(x.bth))}${k.kv('Đồng bộ lần cuối', esc(x.at))}</div>`
          : '<p class="cap">Chưa đồng bộ SAP — các số được ghi khi hồ sơ thanh toán đầu tiên hoàn tất.</p>', 'Chỉ xem — đồng bộ từ SAP (tích hợp tài chính, chưa giao PIC)'))(sapOf(h))
        + ((h.penalty || []).length ? k.card('Phạt / bồi thường', k.table([['Nội dung', 360], ['Giá trị (tỷ đồng)', 150, 'r'], ['Cách xử lý', 260], ['Trạng thái', 160, 'c']], h.penalty,
          (p) => `<td>${k.clamp(p[0])}</td><td class="r num">${ty(p[1], 3)}</td><td>${k.clamp(p[2])}</td><td class="c">${badge(p[3], 'warning')}</td>`)) : '');
    };
    const tVb = () => {
      const can = h.st === 'TH' && h.code !== RUN;
      return caseCard(h, 'MS23.01') + `<section class="vcard pad24"><div class="vcard-h"><h3>Văn bản phát sinh</h3>${can ? `<button type="button" class="vbtn primary" data-hd-annex="${esc(h.code)}">${icon('add')} Thêm phụ lục</button>` : ''}</div>
          ${k.table([['Loại văn bản', 170], ['Số văn bản', 170], ['Ngày', 110], ['Nội dung', 400], ['Ảnh hưởng giá trị (tỷ đồng)', 180, 'r'], ['Trạng thái', 130, 'c']], h.docs || [],
            (d) => `<td>${esc(d[0])}</td><td>${esc(d[1])}</td><td class="num">${esc(d[2])}</td><td>${k.clamp(d[3])}</td><td class="r num">${d[4] == null ? k.dash : (d[4] > 0 ? '+' : '') + ty(d[4], 3)}</td><td class="c">${badge(d[5], d[5] === 'Đã ký' ? 'success' : 'default')}</td>`)}</section>`
        + (h.annex ? k.card(`So sánh trước / sau điều chỉnh (${h.annexName || 'Phụ lục 01'})`, k.table([['Nội dung', 300], ['Trước điều chỉnh', 300], ['Sau điều chỉnh', 300]], h.annex,
          (d) => `<td>${k.clamp(d[0])}</td><td><span class="diff-old">${esc(d[1])}</span></td><td><span class="diff-new">${esc(d[2])}</span></td>`)) : '')
        + k.card('Kiểm soát điều chỉnh', `<div class="ginfo c3">${k.kv('Giá trị hợp đồng sau điều chỉnh', ty(h.value, 2) + ' tỷ đồng')}${k.kv('Giới hạn (giá gói thầu / nguồn)', ty(h.cap, 2) + ' tỷ đồng')}
          ${k.kv('Kết quả kiểm tra giá trị', h.value <= h.cap ? badge('Không vượt giới hạn', 'success') : badge('Vượt giới hạn', 'error'))}${k.kv('Ngày kết thúc sau điều chỉnh', h.end ? esc(h.end) : null)}${k.kv('Kết quả kiểm tra thời gian', h.end ? badge('Phù hợp thời gian thực hiện dự án', 'success') : null)}</div>`);
    };
    const tTl = () => {
      const l = h.liq;
      const docs = [].concat(h.neg ? h.neg.rounds.filter((r) => r[5]).map((r) => ['Biên bản thương thảo vòng ' + r[0], r[1]]) : [], h.no ? [['Hợp đồng ' + h.no + ' (bản chính thức)', h.sign]] : [],
        (h.dl || []).filter((d) => d[3]).map((d) => ['Biên bản bàn giao ' + d[0], d[3]]), (h.acc || []).map((a) => ['Biên bản nghiệm thu ' + a[0], a[2]]),
        (h.pays || []).map((p) => ['Hồ sơ thanh toán ' + p[0], p[8] || '-']), (h.docs || []).map((d) => [d[0] + ' ' + d[1], d[2]]), l && l.file ? [['Hồ sơ thanh lý ' + l.file[0], l.file[1]]] : []);
      return caseCard(h, 'MS23.04') + (l ? k.card('Điều kiện thanh lý', k.table([['Nghĩa vụ', 520], ['Kết quả', 160, 'c']], l.cond, (c) => `<td>${esc(c[0])}</td><td class="c">${c[1] ? badge('Đã hoàn thành', 'success') : badge('Chưa hoàn thành', 'warning')}</td>`))
          + k.card('Hồ sơ thanh lý', `<div class="ginfo c3">${k.kv('Mã hồ sơ thanh lý', esc(l.file[0]))}${k.kv('Ngày lập', esc(l.file[1]))}${k.kv('Tình trạng', esc(l.file[2]))}
            ${k.kv('Giá trị quyết toán cuối cùng', ty(l.final, 2) + ' tỷ đồng')}${k.kv('Biên bản thanh lý', l.closed ? `<a class="link-red" href="#" data-dl="BB-thanh-ly-${esc(h.code)}.pdf">BB-thanh-ly-${esc(h.code)}.pdf</a>` : null)}${k.kv('Trạng thái dữ liệu', l.closed ? badge('Đã khoá chỉnh sửa', 'default') : badge('Đang mở', 'info'))}</div>`)
        : k.emptyCard('Thanh lý hợp đồng', 'Hồ sơ thanh lý được lập khi các nghĩa vụ của hợp đồng đã hoàn thành (MS23.04).'))
        + `<p class="cap">Hồ sơ vòng đời hợp đồng (${docs.length} văn bản) xem ở tab <b>Tài liệu</b>.</p>`;
    };
    /* T75 B6: checklist hồ sơ của hệ thống cũ → card Danh sách tài liệu (S3 loại 4), thêm Số bản / Loại chứng từ. */
    const tDoc = () => {
      const R0 = docRows(h);
      return `<section class="vcard pad24"><div class="vcard-h"><h3>Danh sách tài liệu</h3><div class="r"><button type="button" class="vbtn secondary" data-hd-docxls="${esc(h.code)}">${icon('download')} Xuất Excel</button>${!locked ? `<button type="button" class="vbtn secondary" data-hd-upload="${esc(h.code)}">${icon('upload')} Tải lên</button>` : ''}</div></div>
        ${k.table([['Loại tài liệu', 220], ['Số hiệu văn bản', 190], ['Ngày', 110], ['Cơ quan ban hành / người ký', 280], ['Số tiền (tỷ đồng)', 150, 'r'], ['Số bản', 90, 'r'], ['Loại chứng từ', 190], ['Ngày sao CC/CT', 130], ['Tệp', 260], ['Ghi chú', 260]], R0,
          (d) => `<td>${esc(d[0])}</td><td>${esc(d[1] || '-')}</td><td class="num">${d[2] ? esc(d[2]) : k.dash}</td><td>${k.clamp(d[3])}</td><td class="r num">${d[4] == null ? k.dash : ty(d[4], 3)}</td><td class="r num">${d[5]}</td><td>${esc(d[6])}</td>
            <td class="num">${d[8] ? esc(d[8]) : k.dash}</td><td>${d[7] ? `<a class="link-red" href="#" data-dl="${esc(d[7])}">${esc(d[7])}</a>` : badge('Chưa có tệp', 'warning')}</td><td>${d[9] ? k.clamp(d[9]) : k.dash}</td>`)}
        <p class="cap">Gồm tài liệu của hợp đồng và các hồ sơ con (thương thảo, bàn giao, nghiệm thu, thanh toán, văn bản phát sinh, thanh lý) — phục vụ checklist thanh toán, hậu kiểm, audit.</p></section>`;
    };
    return `<div class="pg">
      ${head({ title: 'Xem chi tiết hợp đồng', back: 'hop-dong', lg: true, info })}${alerts}
      ${k.tabs('hd:' + h.code, [['info', 'Thông tin chung'], ['dt', 'Đối tác'], ['hm', 'Hạng mục'], ['tt', 'Thương thảo & ký kết'], ['bd', 'Bảo đảm & bảo hành'], ['td', 'Tiến độ thực hiện'],
        ['bg', 'Bàn giao & nghiệm thu'], ['pay', 'Thanh toán'], ['vb', 'Văn bản phát sinh'], ['tl', 'Thanh lý'], ['doc', 'Tài liệu']],
        { info: tInfo, dt: tDt, hm: tHm, tt: tTt, bd: tBd, td: tTd, bg: tBg, pay: tPay, vb: tVb, tl: tTl, doc: tDoc })}</div>`;
  }
  /* Danh sách hồ sơ của hợp đồng (như card Danh sách hồ sơ của ĐXMS / KĐT): Tạo hồ sơ = start MS22, giao Phòng Hợp đồng (D-48: chỉ HĐ-2026-0052). */
  function caseCard(h, proc, title) {
    if (h.code !== RUN) return '';
    const k = K(), many = proc && D.hdProcesses[proc].many, c = many ? null : Flow.caseOf(D.hdCaseCode(h.code, proc || 'MS22')), pid = Flow.state.persona, canNew = (many ? !D.hdProcesses[proc].auto && ['TH', 'TL'].includes(h.st) : !proc && !c) && (pid === 'phd' || D.allAccess(pid));
    const rows = many ? casesOfP(h.code, proc) : c ? [c] : [];
    if (proc && !rows.length && !canNew) return '';
    return `<section class="vcard pad24" data-hd-cases><div class="vcard-h"><h3>${esc(title || 'Danh sách hồ sơ')}</h3>${canNew ? `<button type="button" class="vbtn primary" ${many ? `data-hd-newnt="${esc(proc)}"` : `data-hd-newcase="${esc(h.code)}"`}>${icon('add')} Tạo hồ sơ</button>` : ''}</div>
      ${k.table([['Mã hồ sơ', 170], ['Quy trình', 300], ['Trạng thái', 130, 'c'], ['Bước hiện tại', 320]], rows,
    (x) => `<td><a class="link" data-go="ho-so-hd/${esc(x.code)}">${esc(x.code)}</a></td><td>${esc(x.vars.process)} — ${esc(D.hdProcesses[x.vars.process].name)}</td><td class="c">${x.status === 'approved' ? badge('Hoàn thành', 'success') : badge('Đang xử lý', 'info')}</td>
          <td>${k.clamp(x.tokens.length ? [...new Set(x.tokens.map((t) => window.BPMN_FLOWS[x.vars.process].tasks[t.task].name))].join(', ') : x.vars.hold || x.vars.endText || D.hdProcesses[x.vars.process].end)}</td>`)}</section>`;
  }
  /* Nghiệm thu Đạt chưa có hồ sơ thanh toán → khởi tạo hồ sơ thanh toán (Backlog 491: lấy trực tiếp khối lượng đã nghiệm thu). */
  const payable = (h) => (h.acc || []).filter((a) => a[5] === 'Đạt' && !(h.pays || []).some((p) => p[2] === a[0]));
  function payDlg(code) {
    const h = hdOf(code), list = payable(h);
    let pick = list[0][0];
    const calc = () => { const a = list.find((x) => x[0] === pick), advLeft = r2(advOf(h) - advBack(h)), ded = r2(Math.min(advLeft, a[4] * (advOf(h) / h.value || 0))), pen = r2((h.penalty || []).filter((p) => p[3] !== 'Đã khấu trừ').reduce((s0, p) => s0 + p[1], 0));
      return { a, ded, pen, hold: r2(a[4] * 0.05) }; };
    const body = () => { const c = calc(); return `<div class="tb-grid2">
        <div class="vfield"><div class="lr"><label>Căn cứ nghiệm thu</label><span class="req">*</span></div>${vSelect({ id: 'pay-acc', value: pick, options: list.map((a) => ({ value: a[0], label: `${a[0]} — ${a[1]} (${ty(a[4], 2)} tỷ đồng)` })), onChange: (x) => { pick = x; m.el.querySelector('.vmodal-b').firstElementChild.outerHTML = body(); } })}</div>
        <div class="vfield"><div class="lr"><label>Giá trị đề nghị (tỷ đồng)</label></div><input class="vctl" value="${ty(c.a[4], 3)}" disabled></div>
        <div class="vfield"><div class="lr"><label>Khấu trừ tạm ứng</label></div><input class="vctl" value="${ty(c.ded, 3)}" disabled></div>
        <div class="vfield"><div class="lr"><label>Khấu trừ phạt</label></div><input class="vctl" value="${ty(c.pen, 3)}" disabled></div>
        <div class="vfield"><div class="lr"><label>Giữ lại bảo hành (5%)</label></div><input class="vctl" value="${ty(c.hold, 3)}" disabled></div>
        <div class="vfield"><div class="lr"><label>Thanh toán ròng</label></div><input class="vctl" value="${ty(r2(c.a[4] - c.ded - c.pen - c.hold), 3)}" disabled></div></div>`; };
    const m = vModal({ title: 'Tạo hồ sơ thanh toán', size: 'w780', body: body(), actions: '<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="pay-ok">Lưu</button>' });
    m.el.querySelector('#pay-ok').onclick = () => {
      const c = calc(), a = U.add[code] = U.add[code] || {};
      const n = 300 + Object.values(U.add).reduce((s0, x) => s0 + (x.pays || []).length, 0);
      a.pays = (a.pays || []).concat([[`TT-2026-0${n}`, 'Thanh toán ' + c.a[1].toLowerCase(), c.a[0], c.a[4], c.ded, c.pen, c.hold, 'DRAFT', null]]);
      persist(); m.close();
      toast('<b>Thành công</b><br>Tạo hồ sơ thanh toán thành công');
      rerender();
    };
  }
  /* MS24: Tạo hồ sơ thanh toán = phát sinh đợt thanh toán, start một hồ sơ con (T25 B3). Đồng hồ hồ sơ bắt đầu từ ngày mốc điều kiện, chưa có mốc thì từ lúc ký. */
  function payCaseDlg(code) {
    const h = hdOf(code), list = nextPays(h);
    let pick = list[0].i;
    const body = () => { const p = list.find((x) => x.i === pick); return `<div class="tb-grid2">
        <div class="vfield"><div class="lr"><label>Đợt thanh toán</label><span class="req">*</span></div>${vSelect({ id: 'pay-dot', value: pick, options: list.map((x) => ({ value: x.i, label: x.name })), onChange: (x) => { pick = Number(x); m.el.querySelector('.vmodal-b').firstElementChild.outerHTML = body(); } })}</div>
        <div class="vfield"><div class="lr"><label>Điều kiện thanh toán</label></div><input class="vctl" value="${esc(p.cond)}" disabled></div>
        <div class="vfield"><div class="lr"><label>Giá trị đề nghị (tỷ đồng)</label></div><input class="vctl" value="${ty(p.value, 3)}" disabled></div>
        <div class="vfield"><div class="lr"><label>Khấu trừ tạm ứng</label></div><input class="vctl" value="${ty(p.adv, 3)}" disabled></div>
        <div class="vfield"><div class="lr"><label>Giữ lại bảo hành</label></div><input class="vctl" value="${ty(p.hold, 3)}" disabled></div>
        <div class="vfield"><div class="lr"><label>Thanh toán ròng</label></div><input class="vctl" value="${ty(r2(p.value - p.adv - p.hold), 3)}" disabled></div></div>`; };
    const m = vModal({ title: 'Tạo hồ sơ thanh toán', size: 'w780', body: body(), actions: '<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="pay-ok">Lưu</button>' });
    m.el.querySelector('#pay-ok').onclick = () => {
      const p = list.find((x) => x.i === pick), ms = p.need ? h.track.vars.track.ms.filter((x) => x.kind === p.need[0])[p.need[1]] : null;
      const cc = D.hdCaseCode(code, 'MS24', casesOf24(code).length + 1);
      m.close();
      Flow.startCase('MS24', { code: cc, parent: code, name: p.name, clock: Math.max(h.track.clock, ms ? Flow.clockOf(ms.actual) : 0), vars: { dot: p.i } });
      toast('<b>Thành công</b><br>Thêm mới hồ sơ thành công');
      location.hash = '#/task/' + Flow.caseOf(cc).tokens[0].id;
    };
  }
  /* Phụ lục điều chỉnh (MS23.01): kiểm tra giá trị sau điều chỉnh không vượt giới hạn (Backlog 473). */
  function annexDlg(code) {
    const h = hdOf(code);
    const m = vModal({ title: 'Thêm phụ lục hợp đồng', size: 'w580', body: `
        <div class="vfield" id="ax-f1"><div class="lr"><label>Nội dung điều chỉnh</label><span class="req">*</span></div><textarea class="vctl ta" id="ax-c" rows="3" maxlength="1000" placeholder="Nhập nội dung điều chỉnh"></textarea><p class="msg" hidden>Bạn cần nhập Nội dung điều chỉnh.</p></div>
        <div class="tb-grid2"><div class="vfield" id="ax-f2"><div class="lr"><label>Giá trị điều chỉnh (tỷ đồng)</label></div><input class="vctl" id="ax-v" type="number" step="0.001" value="0"><p class="msg" hidden></p></div>
        <div class="vfield"><div class="lr"><label>Gia hạn (ngày)</label></div><input class="vctl" id="ax-d" type="number" min="0" value="0"></div></div>
        <p class="tb-hint">Giá trị hiện tại ${ty(h.value, 2)} tỷ đồng · giới hạn ${ty(h.cap, 2)} tỷ đồng (giá gói thầu / nguồn).</p>`,
      actions: '<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="ax-ok">Lưu</button>' });
    m.el.querySelector('#ax-ok').onclick = () => {
      const c = m.el.querySelector('#ax-c').value.trim(), v = Number(m.el.querySelector('#ax-v').value || 0), d = Number(m.el.querySelector('#ax-d').value || 0);
      const f1 = m.el.querySelector('#ax-f1'), f2 = m.el.querySelector('#ax-f2');
      f1.classList.toggle('invalid', !c); f1.querySelector('.msg').hidden = !!c;
      const over = h.value + v > h.cap + 1e-9;
      f2.classList.toggle('invalid', over); f2.querySelector('.msg').hidden = !over;
      f2.querySelector('.msg').textContent = `Giá trị hợp đồng sau điều chỉnh ${ty(r2(h.value + v), 2)} tỷ đồng vượt giới hạn ${ty(h.cap, 2)} tỷ đồng.`;
      if (!c || over) return;
      const a = U.add[code] = U.add[code] || {};
      const no = `PL${String((h.docs || []).filter((x) => x[0] === 'Phụ lục hợp đồng').length + 1).padStart(2, '0')}/${(h.no || h.code).split('/')[0]}`;
      a.docs = (a.docs || []).concat([['Phụ lục hợp đồng', no, Flow.dateOf(Flow.state.clock), c + (d ? `; gia hạn ${d} ngày` : ''), v || null, 'Dự thảo']]);
      persist(); m.close();
      toast('<b>Thành công</b><br>Thêm phụ lục hợp đồng thành công');
      rerender();
    };
  }
  /* Nhập hợp đồng (vht-import-dialog 2 bước, như Nhập biểu mẫu). */
  /* T75: bảng chuyển đổi khi nhập hợp đồng từ hệ thống cũ (HT-HD-IMG2 6511, 6539, 6542). */
  const IMP_MAP = [['Trạng thái', 'Soạn Hợp đồng', 'Đang thương thảo'], ['Trạng thái', 'Trình ký', 'Đang trình ký'], ['Trạng thái', 'Đôn đốc giao hàng; Nghiệm thu', 'Đang thực hiện'],
    ['Trạng thái', 'Thanh lý', 'Đang thanh lý'], ['Trạng thái', 'Hoàn thành', 'Đã thanh lý'], ['Trạng thái', 'Hủy hợp đồng', 'Chấm dứt'],
    ['Loại hợp đồng', 'Trọn gói; Theo đơn giá cố định; Theo đơn giá điều chỉnh; Theo thời gian; Theo chi phí cộng phí; Theo kết quả đầu ra; Theo tỉ lệ phần trăm; Hỗn hợp', 'Giữ nguyên (8 loại QC-12869 Điều 43)'],
    ['Loại hợp đồng', 'Trọn gói và Theo đơn giá cố định; Trọn gói và Theo đơn giá điều chỉnh; Theo đơn giá cố định và Theo đơn giá điều chỉnh', 'Hỗn hợp'],
    ['Loại hợp đồng', 'Thỏa thuận khung', 'Nhập vào Thỏa thuận khung (SCR-87)'], ['Phân loại HĐ', 'HĐ Thường', 'Hợp đồng'], ['Phân loại HĐ', 'HĐ Khung', 'Thỏa thuận khung'], ['Phân loại HĐ', 'HĐ PO', 'Đơn hàng của thỏa thuận khung']];
  /* T75: Lịch sử tác động (Xem Logs của hệ thống cũ) — audit log của hợp đồng và hồ sơ con. */
  function logDlg(code) {
    const h = hdOf(code), k = K();
    vModal({ title: 'Lịch sử tác động — ' + h.code, size: 'lg', body: k.table([['Ngày', 120], ['Người thực hiện', 200], ['Nội dung', 520]], logOf(h),
      (r) => `<td class="num">${esc(r[0])}</td><td>${esc(r[1])}</td><td>${k.clamp(r[2])}</td>`), actions: '<button class="vbtn secondary" data-close>Đóng</button>' });
  }
  function importDlg() {
    const rows = [['HĐ-2024-0233', 'Hợp đồng thuê kênh truyền dẫn phòng lab', 'NCC-000012', 1.8, ''], ['HĐ-2025-0055', 'Hợp đồng cung cấp tủ rack, PDU phòng máy chủ', 'NCC-000001', 2.6, ''],
      ['HĐ-2025-0187', 'Hợp đồng cung cấp máy phân tích phổ và máy phân tích mạng vector', 'NCC-000008', 45.6, 'Mã hợp đồng HĐ-2025-0187 đã tồn tại.']];
    const m = vModal({ title: 'Kết quả nhập dữ liệu', size: 'xl', body: `<div class="imp-res"><div class="imp-top"><span class="imp-sum">2/3 hợp đồng hợp lệ · tệp hop-dong-da-ky-2024-2025.xlsx</span></div>
        <div class="vtable-vp"><table class="vtable cat"><thead><tr><th class="ord">STT</th><th class="c" style="min-width:110px">Kết quả</th><th style="min-width:220px">Nội dung lỗi</th><th style="min-width:140px">Mã hợp đồng</th><th style="min-width:300px">Tên hợp đồng</th><th style="min-width:240px">Nhà thầu</th><th class="r" style="min-width:140px">Giá trị (tỷ đồng)</th></tr></thead>
        <tbody>${rows.map((r, i) => `<tr><td class="ord">${i + 1}</td><td class="c">${r[4] ? badge('Lỗi', 'error') : badge('Hợp lệ', 'success')}</td><td>${r[4] ? `<span class="imp-err">${esc(r[4])}</span>` : K().dash}</td><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(nccName(r[2]))}</td><td class="r num">${ty(r[3], 2)}</td></tr>`).join('')}</tbody></table></div>
        <h4 style="margin:16px 0 8px">Quy tắc chuyển đổi dữ liệu hệ thống cũ</h4>
        ${K().table([['Trường', 160], ['Giá trị hệ thống cũ', 340], ['Giá trị hệ thống mới', 300]], IMP_MAP, (m) => `<td>${esc(m[0])}</td><td>${esc(m[1])}</td><td>${esc(m[2])}</td>`)}</div>`,
      actions: '<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="imp-ok">Xác nhận nhập</button>' });
    m.el.querySelector('#imp-ok').onclick = () => {
      rows.filter((r) => !r[4] && !hdOf(r[0])).forEach((r) => U.hd.push({ code: r[0], src: 'IMPORT', pkgText: '-', khText: '-', originText: '-', title: r[1], ncc: r[2], type: 'TRON_GOI', form: 'CGTT', value: r[3], cap: r[3], cur: 'VND', vat: 10,
        unit: 'Trung tâm Phần mềm', owner: persona(Flow.state.persona).name, st: 'DONG', esign: false, no: r[0].replace('HĐ-', '') + '/HĐ-VHT', sign: '15/03/2025', eff: '15/03/2025', end: '15/12/2025', created: Flow.dateOf(Flow.state.clock), updated: Flow.dateOf(Flow.state.clock),
        exec: '9 tháng', items: [[r[1].replace(/^Hợp đồng /, ''), 'Gói', 1, r[3]]], ms: [], dl: [], acc: [], plan: [], pays: [], docs: [], liq: { cond: [['Đã thanh lý trước khi nhập hệ thống', true]], file: ['-', '-', 'Nhập từ dữ liệu cũ'], final: r[3], closed: '15/12/2025' } }));
      persist(); m.close();
      toast('<b>Thành công</b><br>Nhập hợp đồng thành công (2 hợp đồng)');
      rerender();
    };
  }

  /* ---------- SCR-87 Thỏa thuận khung & đơn hàng ---------- */
  /* P-81 (giả lập): đơn hàng tạo trên prototype lưu ở U.ord[mã khung], trạng thái đã chuyển ở U.ordSt[mã đơn]. */
  const ORD_ST = ['Chờ nhà thầu xác nhận', 'Đang giao', 'Đã giao đủ', 'Đã thanh toán'];
  const ordersOf = (f) => f.orders.concat((U.ord || {})[f.code] || []).map((o) => (U.ordSt && U.ordSt[o[0]] ? o.slice(0, 4).concat([U.ordSt[o[0]]]) : o));
  const ordBadge = (st) => badge(st, /Đã/.test(st) ? 'success' : /Chờ/.test(st) ? 'warning' : 'info');
  const called = (f) => r2(ordersOf(f).reduce((s0, o) => s0 + o[3], 0));
  const fwSt = (f) => (dk(f.to) < dk(TODAY) ? ['Hết hạn', 'default'] : days(TODAY, f.to) <= warnDays('fw') ? [`Sắp hết hạn (${days(TODAY, f.to)} ngày)`, 'warning'] : ['Đang hiệu lực', 'success']);
  function fwList() {
    // Theo: task-management (danh sách đối tượng cha)
    const k = K();
    return k.listPage({
      id: 'ttk', title: 'Danh sách thỏa thuận khung', ph: 'Tìm kiếm theo mã, tên thỏa thuận khung, nhà thầu',
      rows: () => FW.map((f) => Object.assign({}, f, { nccN: nccName(f.ncc) })), kwText: (f) => `${f.code} ${f.title} ${f.nccN}`,
      empty: () => ({ code: '', title: '', ncc: null }),
      match: (f, x) => k.has(x.code, f.code) && k.has(x.title, f.title) && (!x.ncc || f.ncc === x.ncc),
      adv: (txt, sel) => `${txt('code', 'Mã thỏa thuận khung')}${txt('title', 'Tên thỏa thuận khung')}${sel('ncc', 'Nhà thầu', { options: FW.map((f) => ({ value: f.ncc, label: nccName(f.ncc) })) })}`,
      cols: [['Trạng thái', 200, 'c'], ['Mã thỏa thuận khung', 160], ['Tên thỏa thuận khung', 320], ['Nhà thầu', 240], ['Giá trị khung (tỷ đồng)', 160, 'r'], ['Đã gọi (tỷ đồng)', 140, 'r'], ['Còn lại (tỷ đồng)', 140, 'r'], ['Thời hạn', 200]],
      href: (f) => 'thoa-thuan-khung/' + encodeURIComponent(f.code),
      cell: (f) => `<td class="c">${badge(...fwSt(f))}</td><td><a class="link" data-go="thoa-thuan-khung/${encodeURIComponent(f.code)}">${esc(f.code)}</a></td><td>${k.clamp(f.title)}</td><td>${k.clamp(f.nccN)}</td>
        <td class="r num">${m3(f.value)}</td><td class="r num">${m3(called(f))}</td><td class="r num">${m3(r2(f.value - called(f)))}</td><td class="num">${esc(f.from)} – ${esc(f.to)}</td>`,
      info: {
        scr: 'SCR-87', name: 'Thỏa thuận khung & đơn hàng', uc: 'Backlog W1_T10 › Thỏa thuận khung & Đơn hàng (dòng 465–469)',
        notes: ['Khuôn task-management. Thỏa thuận khung hình thành từ KQLCNT (Quy chế cho phép); đơn hàng là các lần gọi hàng trong phạm vi khung. BE chặn đơn hàng làm tổng giá trị đã gọi vượt giá trị khung.',
          `Cảnh báo sắp hết hạn trong ${warnDays('fw')} ngày (tham số hệ thống — giả lập P-80).`,
          '<b>Giả lập P-81</b>: quy trình đơn hàng chưa có BPMN. Prototype đặt luồng 4 bước Chờ nhà thầu xác nhận → Đang giao → Đã giao đủ → Đã thanh toán, chuyển bước ở hộp thoại đơn hàng; đơn hàng là dòng của thỏa thuận khung, không phải hợp đồng con.'],
        q: ['P-81'], src: 'task-management/task-management.component · /task-management',
      },
    });
  }
  function fwDetail(code) {
    const k = K(), f = FW.find((x) => x.code === code);
    if (!f) return `<div class="pg">${head({ title: 'Xem chi tiết thỏa thuận khung', back: 'thoa-thuan-khung', lg: true })}${k.emptyCard('Thông tin chung', 'Không tìm thấy thỏa thuận khung.')}</div>`;
    const c = called(f), left = r2(f.value - c);
    const info = { scr: 'SCR-87', name: 'Chi tiết thỏa thuận khung', uc: 'Backlog W1_T10 › Thỏa thuận khung & Đơn hàng (dòng 465–469)',
      notes: ['Khuôn task-create (detail). Bấm mã đơn hàng mở hộp thoại chi tiết (vht-modal). Giá trị đã gọi = tổng đơn hàng; còn lại = giá trị khung − đã gọi.'], q: ['P-81'], src: 'task-management/components/task-create (mode detail)' };
    return `<div class="pg">${head({ title: 'Xem chi tiết thỏa thuận khung', back: 'thoa-thuan-khung', lg: true, info })}
      ${k.card('Thông tin chung', `<div class="ginfo c3">${k.kv('Mã thỏa thuận khung', esc(f.code))}${k.kv('Tên thỏa thuận khung', esc(f.title), 'span2')}${k.kv('Nhà thầu', esc(nccName(f.ncc)))}${k.kv('Căn cứ', esc(f.basis), 'span2')}
        ${k.kv('Hiệu lực từ', esc(f.from))}${k.kv('Hiệu lực đến', esc(f.to))}${k.kv('Tình trạng', badge(...fwSt(f)))}${k.kv('Đơn vị quản lý', esc(f.unit))}</div>`)}
      ${k.card('Giá trị thỏa thuận khung', `<div class="ginfo c3">${k.kv('Giá trị khung', ty(f.value, 2) + ' tỷ đồng')}${k.kv('Đã gọi (tổng đơn hàng)', ty(c, 2) + ' tỷ đồng (' + Math.round(c / f.value * 100) + '%)')}${k.kv('Còn lại', ty(left, 2) + ' tỷ đồng')}</div>
        <div class="hd-bar" role="img" aria-label="Đã gọi ${Math.round(c / f.value * 100)}%"><span style="width:${Math.round(c / f.value * 100)}%"></span></div>`)}
      ${k.card('Danh sách đơn hàng', `${dk(f.to) >= dk(TODAY) ? `<div class="ord-act"><button class="vbtn primary" data-fw-new="${esc(f.code)}">Thêm đơn hàng</button></div>` : ''}${k.table([['Mã đơn hàng', 170], ['Ngày đặt', 120], ['Nội dung', 380], ['Giá trị (tỷ đồng)', 150, 'r'], ['Trạng thái', 200, 'c']], ordersOf(f),
        (o) => `<td><a class="link" href="#" data-fw-order="${esc(f.code)}|${esc(o[0])}">${esc(o[0])}</a></td><td class="num">${esc(o[1])}</td><td>${k.clamp(o[2])}</td><td class="r num">${ty(o[3], 2)}</td><td class="c">${ordBadge(o[4])}</td>`)}`, `${ordersOf(f).length} đơn hàng`)}</div>`;
  }
  function orderDlg(fc, oc) {
    const f = FW.find((x) => x.code === fc), o = ordersOf(f).find((x) => x[0] === oc), k = K();
    const i = ORD_ST.indexOf(o[4]), next = i >= 0 && i < ORD_ST.length - 1 ? ORD_ST[i + 1] : null;
    const steps = `<ol class="ord-steps">${ORD_ST.map((st, j) => `<li class="${i < 0 || j <= i ? 'done' : ''}${j === i ? ' cur' : ''}">${esc(st)}</li>`).join('')}</ol>`;
    const m = vModal({ title: 'Chi tiết đơn hàng ' + o[0], size: 'w580', body: `${steps}<div class="ginfo">${k.kv('Thỏa thuận khung', esc(f.code))}${k.kv('Nhà thầu', esc(nccName(f.ncc)))}${k.kv('Ngày đặt', esc(o[1]))}${k.kv('Giá trị', ty(o[3], 2) + ' tỷ đồng')}
      ${k.kv('Nội dung', esc(o[2]), 'full')}${k.kv('Trạng thái', ordBadge(o[4]))}${k.kv('Địa điểm giao', esc(f.unit))}</div>
      <p class="tb-hint">Luồng đơn hàng giả lập (P-81 — chưa có BPMN): Chờ nhà thầu xác nhận → Đang giao → Đã giao đủ → Đã thanh toán.</p>`,
      actions: `<button class="vbtn secondary" data-close>Đóng</button>${next ? `<button class="vbtn primary" id="ord-next">Chuyển: ${esc(next)}</button>` : ''}` });
    const b = m.el.querySelector('#ord-next');
    if (b) b.onclick = () => {
      U.ordSt = U.ordSt || {}; U.ordSt[o[0]] = next; persist(); m.close();
      toast(`<b>Thành công</b><br>Đơn hàng ${esc(o[0])} chuyển sang ${esc(next)}`);
      rerender();
    };
  }
  /* Thêm đơn hàng (P-81 giả lập): BE chặn tổng giá trị đã gọi vượt giá trị khung. */
  function orderNewDlg(fc) {
    const f = FW.find((x) => x.code === fc), left = r2(f.value - called(f));
    const m = vModal({ title: 'Thêm đơn hàng', size: 'w580', body: `
        <div class="vfield" id="od-f1"><div class="lr"><label>Nội dung đơn hàng</label><span class="req">*</span></div><textarea class="vctl ta" id="od-c" rows="3" maxlength="1000" placeholder="Nhập hàng hoá / dịch vụ gọi"></textarea><p class="msg" hidden>Bạn cần nhập Nội dung đơn hàng.</p></div>
        <div class="vfield" id="od-f2"><div class="lr"><label>Giá trị đơn hàng (tỷ đồng)</label><span class="req">*</span></div><input class="vctl" id="od-v" type="number" step="0.001" min="0" placeholder="Nhập giá trị"><p class="msg" hidden></p></div>
        <p class="tb-hint">Giá trị còn lại của thỏa thuận khung: ${ty(left, 2)} tỷ đồng.</p>`,
      actions: '<button class="vbtn secondary" data-close>Hủy</button><button class="vbtn primary" id="od-ok">Lưu</button>' });
    m.el.querySelector('#od-ok').onclick = () => {
      const c = m.el.querySelector('#od-c').value.trim(), v = Number(m.el.querySelector('#od-v').value || 0);
      const f1 = m.el.querySelector('#od-f1'), f2 = m.el.querySelector('#od-f2');
      f1.classList.toggle('invalid', !c); f1.querySelector('.msg').hidden = !!c;
      const e2 = !(v > 0) ? 'Bạn cần nhập Giá trị đơn hàng.' : v > left + 1e-9 ? `Giá trị đơn hàng vượt giá trị còn lại ${ty(left, 2)} tỷ đồng của thỏa thuận khung.` : '';
      f2.classList.toggle('invalid', !!e2); f2.querySelector('.msg').hidden = !e2; f2.querySelector('.msg').textContent = e2;
      if (!c || e2) return;
      U.ord = U.ord || {};
      const list = U.ord[f.code] = U.ord[f.code] || [];
      const no = `ĐH-${f.code.slice(4)}-${String(ordersOf(f).length + 1).padStart(2, '0')}`;
      list.push([no, Flow.dateOf(Flow.state.clock), c, r2(v), ORD_ST[0]]);
      persist(); m.close();
      toast(`<b>Thành công</b><br>Thêm đơn hàng ${esc(no)} thành công`);
      rerender();
    };
  }

  /* ---------- Sự kiện ---------- */
  document.addEventListener('submit', (e) => { if (e.target.matches('[data-hd-form]')) { e.preventDefault(); saveHd(); } });
  /* T79 G7: từ khóa lọc Hàng hóa đã nhận (đổi khi rời ô / Enter). */
  document.addEventListener('change', (e) => { const x = e.target.closest && e.target.closest('[data-hd-rf-kw]'); if (x) { (RF[x.dataset.hdRfKw] = RF[x.dataset.hdRfKw] || { dot: null, kw: '' }).kw = x.value; rerender(); } });
  document.addEventListener('click', async (e) => {
    const t = e.target;
    if (t.closest('[data-hd-import]')) { importDlg(); return; }
    const lg = t.closest('[data-hd-log]');
    if (lg) { e.preventDefault(); logDlg(lg.dataset.hdLog); return; }
    const pl1 = t.closest('[data-hd-pl1]');
    if (pl1) { const h = hdOf(pl1.dataset.hdPl1); toast(`<b>Thành công</b><br>Nhập Phụ lục 1: ${h.items.length} dòng hàng hóa hợp lệ, đã cập nhật Part number, hãng, xuất xứ, chủng loại, bảo hành`); return; }
    if (t.closest('[data-hd-upload]')) { toast('<b>Thành công</b><br>Tải lên tài liệu thành công'); return; }
    if (t.closest('[data-hd-docxls]')) { toast('<b>Thành công</b><br>Xuất Excel danh sách tài liệu thành công'); return; }
    const nn = t.closest('[data-hd-newnt]');
    if (nn) {
      const cc = Flow.startHd(nn.dataset.hdNewnt, RUN, Object.assign(nn.dataset.trg != null ? { trg: Number(nn.dataset.trg) } : {}, nn.dataset.kcs ? { kcs: nn.dataset.kcs } : {}));
      toast('<b>Thành công</b><br>Thêm mới hồ sơ thành công');
      location.hash = '#/ho-so-hd/' + cc;
      return;
    }
    const nc = t.closest('[data-hd-newcase]');
    if (nc) {
      const hd = nc.dataset.hdNewcase;
      Flow.startCase('MS22', { code: D.hdCaseCode(hd), parent: hd, clock: D.hdCaseClock });
      toast('<b>Thành công</b><br>Thêm mới hồ sơ thành công');
      location.hash = '#/task/' + Flow.caseTokens(Flow.state.persona, hd)[0].id;
      return;
    }
    const p = t.closest('[data-hd-pay]');
    if (p) { if (p.dataset.hdPay === RUN) payCaseDlg(RUN); else payDlg(p.dataset.hdPay); return; }
    const a = t.closest('[data-hd-annex]');
    if (a) { annexDlg(a.dataset.hdAnnex); return; }
    const nw = t.closest('[data-fw-new]');
    if (nw) { orderNewDlg(nw.dataset.fwNew); return; }
    const o = t.closest('[data-fw-order]');
    if (o) { e.preventDefault(); e.stopImmediatePropagation(); orderDlg(...o.dataset.fwOrder.split('|')); return; }
  }, true);

  function route(parts) {
    const [a, b] = parts;
    if (a === 'thoa-thuan-khung') return b ? fwDetail(decodeURIComponent(b)) : fwList();
    return b === 'create' ? hdForm() : b ? hdDetail(decodeURIComponent(b)) : hdList();
  }
  function enter(parts) { if (parts[0] === 'hop-dong' && parts[1] === 'create') resetForm(parts[2] && decodeURIComponent(parts[2])); }
  function reset() { U = { hd: [], add: {}, ord: {}, ordSt: {} }; persist(); }
  /* Cho Tổng quan / Báo cáo (S4: cùng một nguồn dữ liệu). */
  /* Mở một tab của Chi tiết hợp đồng (công cụ demo). */
  const setTab = (code, tab) => K().setTab('hd:' + code, tab);
  const openTab = (code, tab) => { setTab(code, tab); location.hash = '#/hop-dong/' + encodeURIComponent(code); };
  window.HopDong = { mauHd, planOf, find: hdOf, kit: K, pkgOf: (h) => (h.pkg ? T().pkOf(h.pkg) : null), checkRows, setTab, openTab, route, enter, reset, byPkg, all, eff, prog, paidSum, remain, advOf, accSum, lateMs, guarWarn, doneRate, HD_ST, PAY_ST, FW, called, ordersOf, hdSoon, warnDays, TODAY, days, dk,
    /* T79: dùng ở eForm MS22 bước 1, MS23.02 bước 3. */
    isImport, staffOf, ntLoai, PAYERS, KCS_HH,
    /* T80 L3: dùng ở eForm MS22 (người đại diện nhà thầu, thư trao hợp đồng). */
    nccRep, traoOf };
})();
