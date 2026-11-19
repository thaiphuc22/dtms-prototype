// T8 — Danh mục dùng chung (D-14: menu cấp cha): Tổng quan SCR-30 + khuôn danh mục (thử với Nguồn vốn SCR-32) theo ecat common-catalog;
// B2 7 danh mục SCR-33…39; B3 Nhà cung cấp SCR-31 (hộp thoại lg, tìm kiếm nâng cao, nhập Excel); B4 Ngưỡng phân luồng SCR-40.
import { test, expect } from '@playwright/test';
import { fresh, lastToast, openForm, closeForm, aiApply } from './helpers.mjs';

const BA = /SCR-\d|UC-\d|task \d|Prototype|minh hoạ|giả lập/i;
const mainText = (page) => page.evaluate(() => {
  const m = document.querySelector('main').cloneNode(true);
  m.querySelectorAll('.info-i').forEach((x) => x.remove());
  return m.innerText;
});
const asAdmin = async (page, hash) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => Flow.setPersona('qt'));
  await page.goto(page.url().replace(/#.*$/, '') + hash);
  await expect(page.locator('main')).not.toBeEmpty();
};
const row = (page, code) => page.locator('.vtable tbody tr', { hasText: code });

test('D-42: Danh mục dùng chung là phân hệ riêng — menu ĐTMS không có; sidebar riêng: Tổng quan, E-form, danh mục chung, nhóm Đầu tư mua sắm (21 danh mục — thêm SCR-110…112 khi rà tìm kiếm Đề tài / dự án 11/11/2026); mục sáng theo route; không có nút quay lại', async ({ page }) => {
  await asAdmin(page, '#/viec-cua-toi');
  const tops = await page.locator('.sb-nav > .nav:not(.child) .l').allInnerTexts();
  expect(tops).not.toContain('Danh mục dùng chung');
  await expect(page.locator('.sb-nav [data-go="eform"]')).toHaveCount(0);
  await page.evaluate(() => { location.hash = '#/dmdc/nguon-von'; });
  await expect(page.locator('.sb-head .t')).toHaveText('Danh mục dùng chung');
  await expect(page.locator('.sb-nav [data-go^="dmdc/"]')).toHaveCount(22); // T67 H1: + Mẫu hợp đồng
  await expect(page.locator('.sb-nav [data-go="dmdc"] .l')).toHaveText('Tổng quan');
  await expect(page.locator('.sb-nav [data-go="dmdc"] + .nav')).toHaveAttribute('data-go', 'eform');
  await page.locator('.sb-nav [data-go="dmdc"]').click();
  await expect(page).toHaveURL(/#\/dmdc$/);
  await expect(page.locator('.ov-title')).toHaveText('Các module trong phân hệ');
  await expect(page.locator('.ov-tile')).toHaveCount(28); // T67 H1: + Mẫu hợp đồng; T71 S0: + 5 danh mục Quản lý sản xuất; T71 S11: + Biểu mẫu tài liệu sản xuất
  await expect(page.locator('.ov-tile').nth(5)).toContainText('Danh mục Nguồn vốn');
  await expect(page.locator('.ov-tile').nth(5).locator('.n')).toHaveText('6');
  await page.locator('.ov-tile', { hasText: 'Nguồn vốn' }).click();
  await expect(page).toHaveURL(/#\/dmdc\/nguon-von$/);
  await expect(page.locator('.sb-nav [data-go="dmdc/nguon-von"]')).toHaveClass(/active/);
  await expect(page.locator('.pg-head .vbtn.back')).toHaveCount(0);
  await page.locator('.sb-nav [data-go="dmdc/loai-hop-dong"]').click();
  await expect(page).toHaveURL(/#\/dmdc\/loai-hop-dong$/);
  await expect(page.locator('.pg-title')).toHaveText('Danh sách loại hợp đồng');
});

test('P-36: menu con lọc theo vai; vào thẳng danh mục không được xem thì báo chưa được cấp quyền', async ({ page }) => {
  await fresh(page, '#/dmdc/nguon-von');
  await expect(page.locator('main .ov-empty')).toHaveText('Bạn chưa được cấp quyền truy cập chức năng này');
  await page.evaluate(() => Flow.setPersona('lan'));
  await expect(page.locator('.sb-nav [data-go^="dmdc"] .l')).toHaveText(['Tổng quan', 'Nhà cung cấp / Nhà thầu', 'Loại đối tác', 'Đơn vị tính', 'Tiền tệ', 'Loại hàng hoá / dịch vụ']);
  await expect(page.locator('.sb-nav [data-go="eform"]')).toHaveCount(1);
});

test('P-36: Tổng quan lọc ô theo vai', async ({ page }) => {
  await fresh(page, '#/dmdc');
  await expect(page.locator('.ov-tile')).toHaveCount(0);
  await expect(page.locator('.ov-empty')).toHaveText('Bạn chưa được cấp quyền truy cập module nào trong phân hệ này');
  await page.evaluate(() => Flow.setPersona('lan'));
  await expect(page.locator('.ov-tile .t')).toHaveText(['Danh mục Nhà cung cấp / Nhà thầu', 'Danh mục Loại đối tác', 'Danh mục Loại hàng hoá / dịch vụ', 'Danh mục Đơn vị tính', 'Danh mục Tiền tệ']);
});

test('B1 ecat: danh sách Nguồn vốn — cột, lọc Trạng thái, tìm kiếm, phân trang 10/25/50', async ({ page }) => {
  await asAdmin(page, '#/dmdc/nguon-von');
  await expect(page.locator('.pg-title')).toHaveText('Danh sách nguồn vốn');
  await expect(page.locator('.vtable th')).toHaveText(['STT', 'Thao tác', 'Trạng thái', 'Mã nguồn vốn', 'Tên nguồn vốn', 'Mô tả']);
  await expect(page.locator('.vtable tbody tr')).toHaveCount(6);
  await expect(row(page, 'VAY').locator('.vswitch')).not.toHaveClass(/on/);
  await expect(row(page, 'SXKD').locator('td').last()).toHaveText('Vốn sản xuất kinh doanh');
  await expect(row(page, 'VAY').locator('td').last()).toHaveText('-');
  // Trạng thái áp ngay khi chọn.
  await page.locator('[data-vsel="cat-st-nguon-von"]').click();
  await page.locator('.vsel-opt', { hasText: 'Dừng hoạt động' }).click();
  await expect(page.locator('.vtable tbody tr')).toHaveCount(1);
  await page.locator('[data-vsel-clear="cat-st-nguon-von"]').click();
  // Tìm kiếm theo mã hoặc tên, không dấu, khi nhấn Enter.
  await page.locator('[data-cat-kw]').fill('dau tu');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(6);
  await page.locator('[data-cat-kw]').press('Enter');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(1);
  await expect(page.locator('.vtable tbody')).toContainText('DTPT');
  await page.locator('[data-ps-open]').click();
  await expect(page.locator('.ps-l li')).toHaveText(['10', '25', '50']);
});

test('B1 ecat: Thêm mới — bắt buộc, định dạng, mã tự viết hoa bỏ dấu, trùng mã, thành công', async ({ page }) => {
  await asAdmin(page, '#/dmdc/nguon-von');
  await page.locator('[data-cat-new]').click();
  const dlg = page.locator('.vmodal.w520');
  await expect(dlg.locator('.vmodal-h h3')).toHaveText('Thêm mới nguồn vốn');
  await dlg.locator('#cat-save').click();
  await expect(dlg.locator('[data-ff="code"] .msg')).toHaveText('Bạn cần nhập Mã nguồn vốn.');
  await expect(dlg.locator('[data-ff="name"] .msg')).toHaveText('Bạn cần nhập Tên nguồn vốn.');
  await dlg.locator('[data-cf="code"]').pressSequentially('khcn');
  await expect(dlg.locator('[data-cf="code"]')).toHaveValue('KHCN');
  await dlg.locator('[data-cf="name"]').fill('Vốn / sai');
  await dlg.locator('#cat-save').click();
  await expect(dlg.locator('[data-ff="name"] .msg')).toHaveText('Tên nguồn vốn không đúng định dạng.');
  await dlg.locator('[data-cf="name"]').fill('Vốn tài trợ');
  await dlg.locator('#cat-save').click();
  await expect(dlg).toBeVisible();
  expect(await lastToast(page)).toContain('đã tồn tại');
  await dlg.locator('[data-cf="code"]').fill('');
  await dlg.locator('[data-cf="code"]').pressSequentially('tài trợ');
  await expect(dlg.locator('[data-cf="code"]')).toHaveValue('TAITRO');
  await dlg.locator('#cat-save').click();
  await expect(page.locator('.overlay')).toHaveCount(0);
  expect(await lastToast(page)).toContain('Thêm mới nguồn vốn thành công');
  await expect(page.locator('.vtable tbody tr').first()).toContainText('TAITRO');
  // Lưu trên trình duyệt: tải lại vẫn còn.
  await page.reload();
  await expect(row(page, 'TAITRO')).toHaveCount(1);
});

test('B1 ecat: Chỉnh sửa — mã khoá, cập nhật tên', async ({ page }) => {
  await asAdmin(page, '#/dmdc/nguon-von');
  await row(page, 'CPTX').locator('[data-cat-edit]').click();
  const dlg = page.locator('.vmodal.w520');
  await expect(dlg.locator('.vmodal-h h3')).toHaveText('Chỉnh sửa nguồn vốn');
  await expect(dlg.locator('[data-cf="code"]')).toBeDisabled();
  await dlg.locator('[data-cf="name"]').fill('Chi phí thường xuyên năm');
  await dlg.locator('#cat-save').click();
  expect(await lastToast(page)).toContain('Cập nhật nguồn vốn thành công');
  await expect(row(page, 'CPTX')).toContainText('Chi phí thường xuyên năm');
});

test('B1 ecat: Dừng hoạt động / Kích hoạt qua hộp thoại xác nhận; Không thì giữ nguyên', async ({ page }) => {
  await asAdmin(page, '#/dmdc/nguon-von');
  await row(page, 'SXKD').locator('.vswitch').click();
  const cf = page.locator('.vconfirm.warning');
  await expect(cf.locator('h2')).toHaveText('Dừng hoạt động');
  await expect(cf.locator('p')).toHaveText('Bạn có chắc chắn muốn dừng hoạt động nguồn vốn: Chi phí sản xuất kinh doanh - SXKD không?');
  await expect(cf.locator('p b')).toHaveText('Chi phí sản xuất kinh doanh - SXKD');
  await cf.locator('.vconfirm-b.ghost').click();
  await expect(row(page, 'SXKD').locator('.vswitch')).toHaveClass(/on/);
  await row(page, 'SXKD').locator('.vswitch').click();
  await page.locator('.vconfirm #cf-ok').click();
  expect(await lastToast(page)).toContain('Dừng hoạt động nguồn vốn thành công');
  await expect(row(page, 'SXKD').locator('.vswitch')).not.toHaveClass(/on/);
  await row(page, 'SXKD').locator('.vswitch').click();
  await expect(page.locator('.vconfirm.info h2')).toHaveText('Kích hoạt');
  await page.locator('.vconfirm #cf-ok').click();
  await expect(row(page, 'SXKD').locator('.vswitch')).toHaveClass(/on/);
});

test('P-33: xoá bản ghi đang dùng bị chặn; bản ghi chưa dùng xoá được', async ({ page }) => {
  await asAdmin(page, '#/dmdc/nguon-von');
  await row(page, 'KHCN').locator('[data-cat-del]').click();
  await expect(page.locator('.vconfirm.danger h2')).toHaveText('Bạn chắc chắn muốn xoá không?');
  await expect(page.locator('.vconfirm .vconfirm-b')).toHaveText(['Hủy', 'Xoá']);
  await page.locator('.vconfirm #cf-ok').click();
  expect(await lastToast(page)).toContain('không thể xoá');
  await expect(row(page, 'KHCN')).toHaveCount(1);
  await row(page, 'SXKD').locator('[data-cat-del]').click();
  await page.locator('.vconfirm #cf-ok').click();
  expect(await lastToast(page)).toContain('Xoá nguồn vốn thành công');
  await expect(row(page, 'SXKD')).toHaveCount(0);
  // Công cụ demo › Khôi phục dữ liệu mẫu đưa danh mục về dữ liệu mẫu.
  await page.locator('#demo').click();
  await page.locator('#reset-eform').click();
  expect(await lastToast(page)).toContain('DMDC');
  await expect(row(page, 'SXKD')).toHaveCount(1);
});

const B2 = [
  ['linh-vuc', 'Danh sách lĩnh vực đầu tư', ['Mã lĩnh vực', 'Tên lĩnh vực', 'Mô tả'], 4],
  ['loai-kdt', 'Danh sách loại khoản đầu tư', ['Mã loại khoản đầu tư', 'Tên loại khoản đầu tư', 'Cấp xử lý', 'Mô tả'], 6],
  ['tinh-chat-tai-san', 'Danh sách tính chất tài sản', ['Mã tính chất tài sản', 'Tên tính chất tài sản', 'Mô tả'], 2],
  ['loai-hang-hoa', 'Danh sách loại hàng hoá, dịch vụ', ['Mã loại hàng hoá, dịch vụ', 'Tên loại hàng hoá, dịch vụ', 'Nhóm', 'Mô tả'], 6],
  ['hinh-thuc-lcnt', 'Danh sách hình thức lựa chọn nhà thầu', ['Mã hình thức', 'Tên hình thức', 'Tên viết tắt', 'Mô tả'], 10],
  ['phuong-thuc-lcnt', 'Danh sách phương thức lựa chọn nhà thầu', ['Mã phương thức', 'Tên phương thức', 'Mô tả'], 2],
  ['loai-hop-dong', 'Danh sách loại hợp đồng', ['Mã loại hợp đồng', 'Tên loại hợp đồng', 'Mô tả'], 8],
];

test('B2: 7 danh mục SCR-33…39 — tiêu đề, cột, dữ liệu mẫu; số bản ghi trên Tổng quan khớp', async ({ page }) => {
  await asAdmin(page, '#/dmdc');
  await expect(page.locator('.ov-tile', { hasText: 'Hình thức lựa chọn nhà thầu' }).locator('.n')).toHaveText('11');
  for (const [key, title, cols, n] of B2) {
    await page.goto(page.url().replace(/#.*$/, '') + '#/dmdc/' + key);
    await expect(page.locator('.pg-title')).toHaveText(title);
    await expect(page.locator('.vtable th')).toHaveText(['STT', 'Thao tác', 'Trạng thái', ...cols]);
    await expect(page.locator('.vtable tbody tr')).toHaveCount(n);
  }
  // Trang cuối vòng lặp là Loại hợp đồng.
  await expect(page.locator('.vpager .tot')).toHaveText('Tổng số bản ghi: 8');
});

test('B2: trường thêm của nhóm A+ hiện nhãn — Cấp xử lý, Nhóm, Tên viết tắt', async ({ page }) => {
  await asAdmin(page, '#/dmdc/loai-kdt');
  await expect(row(page, 'SXKD')).toContainText('Luôn cấp Tập đoàn');
  await expect(row(page, 'KHCN')).toContainText('Theo ngưỡng');
  // QT-8.6.5: KĐT bất động sản luôn là KĐT phức tạp → cấp Tập đoàn.
  await expect(row(page, 'BDS')).toContainText('Luôn cấp Tập đoàn');
  await page.goto(page.url().replace(/#.*$/, '') + '#/dmdc/loai-hang-hoa');
  await expect(row(page, 'DVTV')).toContainText('Dịch vụ');
  await page.goto(page.url().replace(/#.*$/, '') + '#/dmdc/hinh-thuc-lcnt');
  await expect(row(page, 'CDT_RG')).toContainText('CĐT RG');
  // QC-12869 Điều 15: Mua sắm trực tiếp (không phải trực tuyến).
  await expect(row(page, 'MSTT')).toContainText('Mua sắm trực tiếp');
  await expect(page.locator('.vpager .tot')).toHaveText('Tổng số bản ghi: 11');
});

test('B2: Thêm mới loại khoản đầu tư — Cấp xử lý bắt buộc chọn, lưu nhãn', async ({ page }) => {
  await asAdmin(page, '#/dmdc/loai-kdt');
  await page.locator('[data-cat-new]').click();
  const dlg = page.locator('.vmodal.w520');
  await dlg.locator('[data-cf="code"]').pressSequentially('nlmt');
  await dlg.locator('[data-cf="name"]').fill('Năng lượng mặt trời');
  await dlg.locator('#cat-save').click();
  await expect(dlg.locator('[data-ff="level"] .msg')).toHaveText('Bạn cần chọn Cấp xử lý.');
  await expect(dlg.locator('[data-vsel="cf-level"]')).toHaveClass(/invalid/);
  await dlg.locator('[data-vsel="cf-level"]').click();
  await page.locator('.vsel-opt', { hasText: 'Luôn cấp Tập đoàn' }).click();
  await expect(dlg.locator('[data-ff="level"] .msg')).toBeHidden();
  await expect(dlg.locator('[data-vsel="cf-level"] .vsel-label')).toHaveText('Luôn cấp Tập đoàn');
  await dlg.locator('#cat-save').click();
  expect(await lastToast(page)).toContain('Thêm mới loại khoản đầu tư thành công');
  await expect(row(page, 'NLMT')).toContainText('Luôn cấp Tập đoàn');
  // Chỉnh sửa: ô chọn giữ giá trị cũ, đổi được.
  await row(page, 'NLMT').locator('[data-cat-edit]').click();
  await expect(dlg.locator('[data-vsel="cf-level"] .vsel-label')).toHaveText('Luôn cấp Tập đoàn');
  await dlg.locator('[data-vsel="cf-level"]').click();
  await page.locator('.vsel-opt', { hasText: 'Theo ngưỡng' }).click();
  await dlg.locator('#cat-save').click();
  await expect(row(page, 'NLMT')).toContainText('Theo ngưỡng');
});

test('B2: Tên viết tắt — bắt buộc, nhận "." ; ký tự "/" sai định dạng', async ({ page }) => {
  await asAdmin(page, '#/dmdc/hinh-thuc-lcnt');
  await page.locator('[data-cat-new]').click();
  const dlg = page.locator('.vmodal.w520');
  await dlg.locator('[data-cf="code"]').pressSequentially('ch');
  await dlg.locator('[data-cf="name"]').fill('Chào hàng cạnh tranh');
  await dlg.locator('#cat-save').click();
  await expect(dlg.locator('[data-ff="abbreviation"] .msg')).toHaveText('Bạn cần nhập Tên viết tắt.');
  await dlg.locator('[data-cf="abbreviation"]').fill('CH/CT');
  await dlg.locator('#cat-save').click();
  await expect(dlg.locator('[data-ff="abbreviation"] .msg')).toHaveText('Tên viết tắt không đúng định dạng.');
  await dlg.locator('[data-cf="abbreviation"]').fill('CH.CT');
  await dlg.locator('#cat-save').click();
  expect(await lastToast(page)).toContain('Thêm mới hình thức lựa chọn nhà thầu thành công');
  await expect(row(page, 'CH.CT')).toHaveCount(1);
});

// Blur ô đang nhập trước (kiểm tra khi blur làm lỗi ẩn/hiện, xê dịch hộp thoại) rồi mới mở ô chọn.
const pick = async (page, id, label) => {
  await page.evaluate(() => document.activeElement && document.activeElement.blur());
  await page.locator(`[data-vsel="${id}"]`).click();
  await page.locator('.vsel-opt', { hasText: label }).first().click();
};
const ffMsg = (dlg, k) => dlg.locator(`[data-ff="${k}"] .msg`);

test('B3: danh sách nhà cung cấp — cột, Tình trạng, nút Nhập từ Excel; Tổng quan đếm 12', async ({ page }) => {
  await asAdmin(page, '#/dmdc');
  await expect(page.locator('.ov-tile', { hasText: 'Nhà cung cấp' }).locator('.n')).toHaveText('12');
  await page.locator('.ov-tile', { hasText: 'Nhà cung cấp' }).click();
  await expect(page.locator('.pg-title')).toHaveText('Danh sách nhà cung cấp');
  await expect(page.locator('.pg-head .r .vbtn')).toHaveText(['Nhập từ Excel', 'Thêm mới']);
  await expect(page.locator('.vtable th')).toHaveText(['STT', 'Thao tác', 'Trạng thái', 'Mã nhà cung cấp', 'Tên nhà cung cấp', 'Mã số thuế',
    'Phân loại', 'Quốc gia', 'Ngành hàng', 'Email nhận yêu cầu báo giá', 'Người liên hệ', 'Người đại diện', 'Liên danh', 'Tình trạng']);
  await expect(page.locator('.vtable tbody tr')).toHaveCount(10);
  await expect(page.locator('.vpager .tot')).toHaveText('Tổng số bản ghi: 12');
  await expect(row(page, 'NCC-000001')).toContainText('Viễn thông - CNTT, Nghiên cứu sản xuất');
  await expect(row(page, 'NCC-000003')).toContainText('Nước ngoài');
  await expect(row(page, 'NCC-000003')).toContainText('Singapore');
  await expect(row(page, 'NCC-000007').locator('.vbadge')).toHaveText('Cấm đến 31/12/2026');
  await expect(row(page, 'NCC-000010').locator('.vbadge')).toHaveText('Hạn chế');
  await expect(row(page, 'NCC-000001').locator('.vbadge')).toHaveText('Bình thường');
  await expect(page.locator('[data-cat-kw]')).toHaveAttribute('placeholder', 'Tìm kiếm theo mã, tên, mã số thuế nhà cung cấp');
});

test('B3: tìm kiếm nâng cao như Đối tác ecat — loại trừ ô tìm nhanh, Tìm kiếm, Làm mới; tìm nhanh theo mã số thuế', async ({ page }) => {
  await asAdmin(page, '#/dmdc/nha-cung-cap');
  await page.locator('[data-cat-kw]').fill('0301234568');
  await page.locator('[data-cat-kw]').press('Enter');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(1);
  await expect(row(page, 'NCC-000002')).toHaveCount(1);
  await page.locator('[data-adv-toggle]').click();
  await expect(page.locator('[data-adv-toggle]')).toHaveText('Ẩn tìm kiếm nâng cao');
  await expect(page.locator('[data-cat-kw]')).toHaveCount(0);
  await expect(page.locator('.adv-panel .vfield label')).toHaveText(['Mã nhà cung cấp', 'Tên nhà cung cấp', 'Mã số thuế', 'Phân loại', 'Quốc gia', 'Ngành hàng', 'Trạng thái']);
  // Danh sách giữ kết quả lần tìm trước cho tới khi bấm Tìm kiếm.
  await expect(page.locator('.vtable tbody tr')).toHaveCount(1);
  await pick(page, 'adv-kind', 'Nước ngoài');
  await page.locator('.adv-panel button[type="submit"]').click();
  await expect(page.locator('.vpager .tot')).toHaveText('Tổng số bản ghi: 3');
  await pick(page, 'adv-goods', 'Nghiên cứu sản xuất');
  await page.locator('.adv-panel button[type="submit"]').click();
  await expect(page.locator('.vpager .tot')).toHaveText('Tổng số bản ghi: 2');
  await page.locator('[data-adv-reset]').click();
  await expect(page.locator('.vpager .tot')).toHaveText('Tổng số bản ghi: 12');
  await pick(page, 'adv-st', 'Dừng hoạt động');
  await page.locator('[data-adv="name"]').fill('mang');
  await page.locator('[data-adv="name"]').press('Enter');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(1);
  await expect(row(page, 'NCC-000012')).toHaveCount(1);
});

test('B3: Thêm mới — hộp thoại lg 2 cột, mã tự sinh, bắt buộc, quy tắc Trong nước / Nước ngoài', async ({ page }) => {
  await asAdmin(page, '#/dmdc/nha-cung-cap');
  await page.locator('[data-cat-new]').click();
  const dlg = page.locator('.vmodal.lg');
  await expect(dlg.locator('.vmodal-h h3')).toHaveText('Thêm mới nhà cung cấp');
  await expect(dlg.locator('.cat-form.g2')).toHaveCount(1);
  await expect(dlg.locator('[data-cf="code"]')).toBeDisabled();
  await expect(dlg.locator('[data-cf="code"]')).toHaveAttribute('placeholder', 'Hệ thống tự sinh');
  await expect(dlg.locator('[data-vsel="cf-kind"]')).toContainText('Trong nước');
  await expect(dlg.locator('[data-vsel="cf-country"]')).toContainText('Việt Nam');
  await expect(dlg.locator('[data-vsel="cf-country"]')).toHaveClass(/dis/);
  await dlg.locator('#cat-save').click();
  await expect(dlg.locator('.vfield.invalid .msg')).toHaveText(['Bạn cần nhập Tên nhà cung cấp.', 'Bạn cần nhập Mã số thuế.', 'Bạn cần nhập Địa chỉ.',
    'Bạn cần chọn Ngành hàng cung cấp.', 'Bạn cần nhập Email nhận yêu cầu báo giá.']);
  // Trong nước: 10 số hoặc 10 số-3 số.
  await dlg.locator('[data-cf="tax"]').fill('01012345');
  await dlg.locator('[data-cf="tax"]').blur();
  await expect(ffMsg(dlg, 'tax')).toHaveText('Mã số thuế không đúng định dạng.');
  // Nước ngoài: MST tuỳ chọn, tự do; Quốc gia mở và phải chọn lại.
  await pick(page, 'cf-kind', 'Nước ngoài');
  await expect(dlg.locator('[data-ff="tax"] .req')).toBeHidden();
  await expect(ffMsg(dlg, 'tax')).toBeHidden();
  await expect(dlg.locator('[data-vsel="cf-country"]')).not.toHaveClass(/dis/);
  await dlg.locator('#cat-save').click();
  await expect(ffMsg(dlg, 'country')).toHaveText('Bạn cần chọn Quốc gia.');
  await pick(page, 'cf-country', 'Nhật Bản');
  await expect(ffMsg(dlg, 'country')).toBeHidden();
  await dlg.locator('[data-cf="name"]').fill('Nu Precision Co., Ltd. (Osaka) & Partners');
  await dlg.locator('[data-cf="address"]').fill('2-1 Umeda, Kita-ku, Osaka');
  await pick(page, 'cf-goods', 'Nghiên cứu sản xuất');
  await dlg.locator('.vmodal-h h3').click();
  await dlg.locator('[data-cf="email"]').fill('sales@nu-precision');
  await dlg.locator('[data-cf="phone"]').fill('abc');
  await dlg.locator('[data-cf="cc"]').fill('a@nu.jp; sai');
  await dlg.locator('#cat-save').click();
  await expect(ffMsg(dlg, 'email')).toHaveText('Email nhận yêu cầu báo giá không đúng định dạng.');
  await expect(ffMsg(dlg, 'phone')).toHaveText('Số điện thoại không đúng định dạng.');
  await expect(ffMsg(dlg, 'cc')).toHaveText('Email CC không đúng định dạng.');
  await expect(ffMsg(dlg, 'name')).toBeHidden();
  await expect(ffMsg(dlg, 'goods')).toBeHidden();
  await dlg.locator('[data-cf="email"]').fill('sales@nu-precision.jp');
  await dlg.locator('[data-cf="phone"]').fill('+81 6 1234 5678');
  await dlg.locator('[data-cf="cc"]').fill('a@nu.jp; b@nu.jp');
  await dlg.locator('#cat-save').click();
  expect(await lastToast(page)).toContain('Thêm mới nhà cung cấp thành công');
  await expect(row(page, 'NCC-000013')).toContainText('Nu Precision Co., Ltd. (Osaka) & Partners');
  await expect(row(page, 'NCC-000013')).toContainText('Nhật Bản');
});

test('B3: mã số thuế không được trùng; Chỉnh sửa giữ mã, Trong nước khoá Việt Nam', async ({ page }) => {
  await asAdmin(page, '#/dmdc/nha-cung-cap');
  await page.locator('[data-cat-new]').click();
  const dlg = page.locator('.vmodal.lg');
  await dlg.locator('[data-cf="name"]').fill('Công ty TNHH Thử Trùng');
  await dlg.locator('[data-cf="tax"]').fill('0101234567');
  await dlg.locator('[data-cf="address"]').fill('Hà Nội');
  await pick(page, 'cf-goods', 'Dịch vụ tư vấn');
  await dlg.locator('.vmodal-h h3').click();
  await dlg.locator('[data-cf="email"]').fill('a@b.vn');
  await dlg.locator('#cat-save').click();
  expect(await lastToast(page)).toContain('Mã số thuế 0101234567 đã tồn tại.');
  await expect(dlg).toBeVisible();
  await dlg.locator('.vmodal-x').click();
  await row(page, 'NCC-000002').locator('[data-cat-edit]').click();
  await expect(dlg.locator('.vmodal-h h3')).toHaveText('Chỉnh sửa nhà cung cấp');
  await expect(dlg.locator('[data-cf="code"]')).toHaveValue('NCC-000002');
  await expect(dlg.locator('[data-vsel="cf-country"]')).toHaveClass(/dis/);
  await dlg.locator('[data-cf="contact"]').fill('Trần Thị Mai Anh');
  await dlg.locator('#cat-save').click();
  expect(await lastToast(page)).toContain('Cập nhật nhà cung cấp thành công');
  await expect(row(page, 'NCC-000002')).toContainText('Trần Thị Mai Anh');
});

test('B3: Nhập từ Excel — chọn file, kết quả từng dòng (2 lỗi), Xác nhận nhập 18; nhập lại thì trùng hết', async ({ page }) => {
  await asAdmin(page, '#/dmdc/nha-cung-cap');
  await page.locator('[data-cat-import]').click();
  const dlg = page.locator('.vmodal.w780');
  await expect(dlg.locator('.vmodal-h h3')).toHaveText('Nhập dữ liệu');
  await expect(dlg.locator('.imp-bl')).toHaveText('File mẫu import nhà cung cấp');
  await expect(dlg.locator('#imp-go')).toBeDisabled();
  await dlg.locator('[data-imp-zone]').click();
  await expect(dlg.locator('.imp-hint')).toHaveText('danh-sach-nha-cung-cap.xlsx');
  await dlg.locator('#imp-go').click();
  const res = page.locator('.vmodal.xl');
  await expect(res.locator('.vmodal-h h3')).toHaveText('Kết quả nhập dữ liệu');
  await expect(res.locator('tbody tr')).toHaveCount(20);
  await expect(res.locator('tbody .vbadge.error')).toHaveCount(2);
  await expect(res.locator('tbody tr').nth(6)).toContainText('Mã số thuế 0101234567 đã tồn tại.');
  await expect(res.locator('tbody tr').nth(14)).toContainText('Bạn cần nhập Email nhận yêu cầu báo giá.');
  await res.locator('#imp-ok').click();
  expect(await lastToast(page)).toContain('Nhập nhà cung cấp thành công (18 nhà cung cấp)');
  await expect(page.locator('.vpager .tot')).toHaveText('Tổng số bản ghi: 30');
  await page.locator('[data-cat-import]').click();
  await page.locator('[data-imp-zone]').click();
  await page.locator('#imp-go').click();
  await expect(res.locator('tbody .vbadge.error')).toHaveCount(20);
  await expect(res.locator('#imp-ok')).toBeDisabled();
});

test('B3 P-33: NCC Alpha đang dùng trong luồng MS01 không xoá được', async ({ page }) => {
  await asAdmin(page, '#/dmdc/nha-cung-cap');
  await row(page, 'NCC-000001').locator('[data-cat-del]').click();
  await expect(page.locator('.vconfirm p')).toContainText('Công ty TNHH Công nghệ Alpha - NCC-000001');
  await page.locator('.vconfirm #cf-ok').click();
  expect(await lastToast(page)).toContain('đang được sử dụng trong 3 hồ sơ, không thể xoá');
});

for (const r of ['#/dmdc', '#/dmdc/nguon-von', '#/dmdc/nha-cung-cap', '#/dmdc/nguong-phan-luong', ...B2.map(([k]) => '#/dmdc/' + k)]) {
  test(`A1: không có chữ BA ngoài nút (i) — ${r}`, async ({ page }) => {
    await asAdmin(page, r);
    await expect(page.locator('main .info-i').first()).toBeVisible();
    expect(await mainText(page)).not.toMatch(BA);
    expect(page.errors).toEqual([]);
  });
}

// B4 — Ngưỡng phân luồng SCR-40 (tài liệu chuẩn bị §5).
const TH = (page, id) => page.locator(`.vtable tbody tr[data-id="${id}"]`);
const thNew = async (page) => {
  await page.locator('[data-cat-new]').click();
  return page.locator('.vmodal.w520');
};

test('B4: danh sách ngưỡng phân luồng — cột, thứ tự theo nhóm/lĩnh vực/giá trị, không giới hạn, tìm theo quy trình', async ({ page }) => {
  await asAdmin(page, '#/dmdc');
  await expect(page.locator('.ov-tile', { hasText: 'Ngưỡng phân luồng' }).locator('.n')).toHaveText('6');
  await page.locator('.ov-tile', { hasText: 'Ngưỡng phân luồng' }).click();
  await expect(page).toHaveURL(/#\/dmdc\/nguong-phan-luong$/);
  await expect(page.locator('.sb-nav [data-go="dmdc/nguong-phan-luong"]')).toHaveClass(/active/);
  await expect(page.locator('.pg-title')).toHaveText('Danh sách ngưỡng phân luồng');
  await expect(page.locator('.vtable th')).toHaveText(['STT', 'Thao tác', 'Trạng thái', 'Nhóm quy trình', 'Lĩnh vực', 'Tính chất tài sản',
    'Khoảng giá trị (tỷ đồng)', 'Quy trình áp dụng', 'Hiệu lực từ ngày']);
  await expect(page.locator('.vtable tbody tr')).toHaveCount(6);
  expect(await page.locator('.vtable tbody tr').evaluateAll((trs) => trs.map((t) => t.dataset.id))).toEqual(['1', '2', '4', '6', '3', '5']);
  await expect(TH(page, 1).locator('td')).toHaveText(['1', '', '', 'Đề xuất mua sắm', 'Tất cả', 'Tất cả', '0 – dưới 160', 'MS01.03', '01/07/2026']);
  await expect(TH(page, 2)).toContainText('Từ 160 trở lên');
  await expect(TH(page, 2)).toContainText('MS01.01, MS01.02');
  await expect(TH(page, 5)).toContainText('160 – dưới 1.000');
  // KĐT: MS13 là một quy trình, áp cho mọi tính chất tài sản (plan KĐT §6 #1).
  await expect(TH(page, 3).locator('td')).toHaveText(['5', '', '', 'Khoản đầu tư', 'Viễn thông - CNTT', 'Tất cả', '0 – dưới 160', 'MS13', '01/07/2026']);
  // 7 cột dữ liệu vừa bảng ở màn 1440 (không cuộn ngang).
  await page.setViewportSize({ width: 1440, height: 900 });
  expect(await page.locator('.vtable-vp').evaluate((v) => v.scrollWidth <= v.clientWidth)).toBe(true);
  await expect(page.locator('[data-cat-kw]')).toHaveAttribute('placeholder', 'Tìm kiếm theo lĩnh vực, tính chất tài sản, quy trình');
  await page.locator('[data-cat-kw]').fill('ms14');
  await page.locator('[data-cat-kw]').press('Enter');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(2);
  expect(page.errors).toEqual([]);
});

test('B4: Thêm mới — bắt buộc, định dạng số và ngày, Đến dưới > Giá trị từ, quy trình theo nhóm, chồng khoảng', async ({ page }) => {
  await asAdmin(page, '#/dmdc/nguong-phan-luong');
  const dlg = await thNew(page);
  await expect(dlg.locator('.vmodal-h h3')).toHaveText('Thêm mới ngưỡng phân luồng');
  await expect(dlg.locator('[data-vsel="cf-field"]')).toContainText('Tất cả');
  await expect(dlg.locator('[data-vsel="cf-asset"]')).toContainText('Tất cả');
  await expect(dlg.locator('[data-cf="eff"]')).toHaveValue('01/10/2026');
  await expect(dlg.locator('[data-cf="eff"]')).toHaveAttribute('placeholder', 'DD/MM/YYYY');
  await dlg.locator('#cat-save').click();
  await expect(dlg.locator('.vfield.invalid .msg')).toHaveText(['Bạn cần chọn Nhóm quy trình.', 'Bạn cần nhập Giá trị từ (tỷ đồng).', 'Bạn cần chọn Quy trình áp dụng.']);
  // Quy trình áp dụng lọc theo nhóm; đổi nhóm bỏ quy trình không thuộc nhóm mới.
  await pick(page, 'cf-group', 'Đề xuất mua sắm');
  await page.locator('[data-vsel="cf-procs"]').click();
  await expect(page.locator('.vsel-opt')).toHaveCount(3);
  await page.locator('.vsel-opt', { hasText: 'MS01.03' }).click();
  await expect(dlg.locator('[data-vsel="cf-procs"]')).toContainText('MS01.03');
  await pick(page, 'cf-group', 'Khoản đầu tư');
  await expect(dlg.locator('[data-vsel="cf-procs"] .vsel-label')).toHaveClass(/ph/);
  await page.locator('[data-vsel="cf-procs"]').click();
  await expect(page.locator('.vsel-opt')).toHaveText([/^MS13 — /, /^MS14 — /]);
  await page.locator('.vsel-opt', { hasText: 'MS14' }).click();
  await dlg.locator('.vmodal-h h3').click();
  // Số kiểu Việt Nam: chấm phân nghìn, phẩy thập phân; chữ bị bỏ khi gõ.
  await dlg.locator('[data-cf="from"]').pressSequentially('12a,5');
  await expect(dlg.locator('[data-cf="from"]')).toHaveValue('12,5');
  await dlg.locator('[data-cf="to"]').fill('1,234');
  await dlg.locator('[data-cf="to"]').blur();
  await expect(ffMsg(dlg, 'to')).toHaveText('Đến dưới (tỷ đồng) không đúng định dạng.');
  await dlg.locator('[data-cf="to"]').fill('10');
  await dlg.locator('[data-cf="eff"]').fill('');
  await dlg.locator('[data-cf="eff"]').pressSequentially('31022027');
  await expect(dlg.locator('[data-cf="eff"]')).toHaveValue('31/02/2027');
  await dlg.locator('[data-cf="eff"]').blur();
  await expect(ffMsg(dlg, 'eff')).toHaveText('Hiệu lực từ ngày không đúng định dạng.');
  await dlg.locator('[data-cf="eff"]').fill('15/09/2026');
  await dlg.locator('#cat-save').click();
  await expect(ffMsg(dlg, 'to')).toHaveText('Đến dưới phải lớn hơn Giá trị từ.');
  await expect(ffMsg(dlg, 'eff')).toHaveText('Hiệu lực từ ngày không được trước ngày hiện tại (01/10/2026).');
  // Lĩnh vực khác · Tất cả · [400, ∞) giao với MS14 lĩnh vực khác [90, 500).
  await dlg.locator('[data-cf="from"]').fill('400');
  await dlg.locator('[data-cf="to"]').fill('');
  await dlg.locator('[data-cf="eff"]').fill('01/01/2027');
  await pick(page, 'cf-field', 'Lĩnh vực khác');
  await dlg.locator('#cat-save').click();
  await expect(ffMsg(dlg, 'from')).toHaveText('Khoảng giá trị giao với ngưỡng đang hoạt động: Khoản đầu tư (MS13, MS14) · Lĩnh vực khác · Tất cả · 90 – dưới 500 tỷ.');
  await expect(ffMsg(dlg, 'to')).toBeHidden();
  await expect(ffMsg(dlg, 'eff')).toBeHidden();
  await dlg.locator('[data-cf="from"]').fill('500');
  await dlg.locator('#cat-save').click();
  await expect(dlg).toHaveCount(0);
  expect(await lastToast(page)).toContain('Thêm mới ngưỡng phân luồng thành công');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(7);
  const added = TH(page, 7);
  await expect(added).toContainText('Từ 500 trở lên');
  await expect(added.locator('.vbadge')).toHaveText('Chưa hiệu lực');
  // Lưu trên trình duyệt.
  await page.reload();
  await expect(page.locator('.vtable tbody tr')).toHaveCount(7);
  expect(page.errors).toEqual([]);
});

test('B4 P-34: sửa ngưỡng MS01 160 → 150 — đổi giá trị thì hiệu lực không được trước ngày hiện tại', async ({ page }) => {
  await asAdmin(page, '#/dmdc/nguong-phan-luong');
  await TH(page, 1).locator('[data-cat-edit]').click();
  const dlg = page.locator('.vmodal.w520');
  await expect(dlg.locator('.vmodal-h h3')).toHaveText('Chỉnh sửa ngưỡng phân luồng');
  await expect(dlg.locator('[data-cf="to"]')).toHaveValue('160');
  await expect(dlg.locator('[data-cf="eff"]')).toHaveValue('01/07/2026');
  await dlg.locator('[data-cf="to"]').fill('150');
  await dlg.locator('#cat-save').click();
  await expect(ffMsg(dlg, 'eff')).toHaveText('Hiệu lực từ ngày không được trước ngày hiện tại (01/10/2026).');
  await dlg.locator('[data-cf="eff"]').fill('01/10/2026');
  await dlg.locator('#cat-save').click();
  await expect(dlg).toHaveCount(0);
  await expect(TH(page, 1).locator('td').nth(6)).toHaveText('0 – dưới 150');
  // Hạ ngưỡng của quy tắc ≥ 160: xuống dưới 150 thì chồng với quy tắc vừa sửa.
  await TH(page, 2).locator('[data-cat-edit]').click();
  await dlg.locator('[data-cf="from"]').fill('149');
  await dlg.locator('[data-cf="eff"]').fill('01/10/2026');
  await dlg.locator('#cat-save').click();
  await expect(ffMsg(dlg, 'from')).toContainText('Đề xuất mua sắm (MS01) · Tất cả · Tất cả · 0 – dưới 150 tỷ');
  await dlg.locator('[data-cf="from"]').fill('150');
  await dlg.locator('#cat-save').click();
  await expect(dlg).toHaveCount(0);
  await expect(TH(page, 2).locator('td').nth(6)).toHaveText('Từ 150 trở lên');
});

test('B4: kích hoạt lại ngưỡng bị chồng khoảng thì bị chặn; ngưỡng đang dùng không xoá được (P-33)', async ({ page }) => {
  await asAdmin(page, '#/dmdc/nguong-phan-luong');
  // Dừng MS14 VT-CNTT [160, 1000), thêm [160, 900) thay thế.
  await TH(page, 5).locator('[data-cat-tg]').click();
  await expect(page.locator('.vconfirm p')).toContainText('Khoản đầu tư (MS13, MS14) · Viễn thông - CNTT · Tất cả · 160 – dưới 1.000 tỷ');
  await page.locator('.vconfirm #cf-ok').click();
  await expect(TH(page, 5).locator('.vswitch')).not.toHaveClass(/on/);
  const dlg = await thNew(page);
  await pick(page, 'cf-group', 'Khoản đầu tư');
  await pick(page, 'cf-field', 'Viễn thông - CNTT');
  await dlg.locator('[data-cf="from"]').fill('160');
  await dlg.locator('[data-cf="to"]').fill('900');
  await pick(page, 'cf-procs', 'MS14');
  await dlg.locator('.vmodal-h h3').click();
  await dlg.locator('[data-cf="eff"]').fill('01/10/2026');
  await dlg.locator('#cat-save').click();
  await expect(dlg).toHaveCount(0);
  await TH(page, 5).locator('[data-cat-tg]').click();
  await expect(page.locator('.vconfirm h2')).toHaveText('Kích hoạt');
  await page.locator('.vconfirm #cf-ok').click();
  expect(await lastToast(page)).toContain('Không thể kích hoạt: khoảng giá trị giao với ngưỡng đang hoạt động Khoản đầu tư (MS13, MS14) · Viễn thông - CNTT · Tất cả · 160 – dưới 900 tỷ.');
  await expect(TH(page, 5).locator('.vswitch')).not.toHaveClass(/on/);
  // Ngưỡng của ĐXMS đang được hồ sơ dùng.
  await TH(page, 1).locator('[data-cat-del]').click();
  await page.locator('.vconfirm #cf-ok').click();
  expect(await lastToast(page)).toContain('Ngưỡng phân luồng Đề xuất mua sắm (MS01) · Tất cả · Tất cả · 0 – dưới 160 tỷ đang được sử dụng trong 9 hồ sơ, không thể xoá');
  // Ngưỡng chưa dùng xoá được.
  await TH(page, 5).locator('[data-cat-del]').click();
  await page.locator('.vconfirm #cf-ok').click();
  expect(await lastToast(page)).toContain('Xoá ngưỡng phân luồng thành công');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(6);
  expect(page.errors).toEqual([]);
});

// B5 — nối DMDC vào luồng MS01 (tài liệu chuẩn bị §5.4, §6).
const openTask = (page, task, who) => page.evaluate(([t, w]) => {
  Flow.jumpTo(t, w, {});
  const k = Flow.state.tokens.find((x) => String(x.task) === String(t));
  Flow.setPersona(k.who);
  location.hash = '#/task/' + k.id;
}, [task, who]);
const optLabels = async (page, id) => {
  await page.evaluate(() => document.activeElement && document.activeElement.blur());
  await page.locator(`[data-vsel="${id}"]`).click();
  const out = await page.locator('.vsel-panel .vsel-opt').allInnerTexts();
  await page.locator(`[data-vsel="${id}"]`).click();
  await expect(page.locator('.vsel-panel')).toHaveCount(0);
  return out.map((s) => s.trim());
};
/* Quản trị sửa ngưỡng ĐXMS 160 → 150, hiệu lực 01/10/2026 (sửa dòng dưới trước để không chồng khoảng). */
const setDxms150 = async (page) => {
  await page.evaluate(() => { location.hash = '#/dmdc/nguong-phan-luong'; });
  const dlg = page.locator('.vmodal.w520');
  for (const [id, k, v] of [[1, 'to', '150'], [2, 'from', '150']]) {
    await TH(page, id).locator('[data-cat-edit]').click();
    await dlg.locator(`[data-cf="${k}"]`).fill(v);
    await dlg.locator('[data-cf="eff"]').fill('01/10/2026');
    await dlg.locator('#cat-save').click();
    await expect(dlg).toHaveCount(0);
  }
};

test('B5 §5.4: ngưỡng phân luồng là biến cổng của MS01 (T29 B1); hồ sơ đã tạo giữ ngưỡng lúc tạo (P-34)', async ({ page }) => {
  await asAdmin(page, '#/viec-cua-toi');
  // ĐXMS-2026-0119 chưa có hồ sơ → loại Phê duyệt chọn sẵn, Quy trình MS01 chỉ đọc (D-54).
  // T34 (D-90): Lập ĐXMS trên ĐXMS-2026-0119 (chưa có hồ sơ) thay SCR-25.
  await page.evaluate(() => { Flow.setPersona('minh'); location.hash = '#/luong/create/%C4%90XMS-2026-0119'; });
  await page.locator('[data-luong-form]').waitFor();
  // Hồ sơ tạo trước khi đổi ngưỡng.
  await page.locator('#lf-draft').click();
  await expect(page).toHaveURL(/#\/task\//);
  await page.evaluate(() => Flow.setPersona('qt'));
  await setDxms150(page);
  expect(await page.evaluate(() => Flow.condOf('MS01.03'))).toBe('< 160 tỷ · mọi loại căn cứ');
  // Hồ sơ mới thấy nhãn đổi theo ngưỡng.
  await page.evaluate(() => { Flow.setPersona('minh'); const c = Flow.createDxms({ title: 'ĐXMS thử ngưỡng', nv: 'NV-KHCN-2026-014', unit: 'Trung tâm Vô tuyến', priority: 'Thường' }); /* T34: Lập ĐXMS bắt Đề tài / dự án, Đơn vị */ location.hash = '#/luong/create/' + encodeURIComponent(c); });
  await page.locator('[data-luong-form]').waitFor();
  await page.locator('#lf-draft').click();
  await expect(page).toHaveURL(/#\/task\//);
  expect(await page.evaluate(() => [Flow.condOf('MS01.01'), Flow.inRange('MS01.01', 155)])).toEqual(['≥ 150 tỷ · căn cứ chưa được CT/TGĐ TĐ duyệt', true]);
  expect(page.errors).toEqual([]);
});

test('B5 §5.4: ngưỡng dừng hoạt động không áp dụng; cổng kiểm tra khớp đọc ngưỡng của hồ sơ', async ({ page }) => {
  await asAdmin(page, '#/dmdc/nguong-phan-luong');
  // Dừng ngưỡng ĐXMS < 160 → MS01.03 chưa có ngưỡng.
  await TH(page, 1).locator('[data-cat-tg]').click();
  await page.locator('.vconfirm #cf-ok').click();
  await expect(TH(page, 1).locator('.vswitch')).not.toHaveClass(/on/);
  expect(await page.evaluate(() => D.procCond('MS01.03', D.dxmsRules()))).toBe('chưa có ngưỡng · mọi loại căn cứ');
  // Hồ sơ 182,9 tỷ theo MS01.01: khớp ngưỡng ≥ 160.
  const r = await page.evaluate(() => { Flow.jumpTo(10, 'minh', {}); return Flow.matchCheck(); });
  expect([r.ok, r.cond]).toEqual([true, '≥ 160 tỷ · căn cứ chưa được CT/TGĐ TĐ duyệt']);
  expect(page.errors).toEqual([]);
});

test('B5 §6: Nguồn vốn ở bước 04 (màn Lập ĐXMS, T29 B19) chọn từ danh mục; nguồn vốn dừng hoạt động không hiện; mặc định theo gợi ý AI (Quỹ phát triển khoa học công nghệ)', async ({ page }) => {
  await asAdmin(page, '#/viec-cua-toi');
  await openTask(page, 4, 'minh');
  await aiApply(page);
  // Màn Lập ĐXMS: ô Nguồn vốn chọn từ danh mục Nguồn vốn; mặc định là nguồn vốn AI trích từ căn cứ.
  await expect(page.locator('[data-vsel="lf-fund"] .vsel-label')).toHaveText('Quỹ phát triển khoa học công nghệ');
  expect(await optLabels(page, 'lf-fund')).toEqual(['Quỹ phát triển khoa học công nghệ', 'Đầu tư phát triển', 'Chi phí sản xuất kinh doanh', 'Vốn góp của chủ sở hữu', 'Chi phí thường xuyên']);
  await pick(page, 'lf-fund', 'Chi phí sản xuất kinh doanh');
  await expect(page.locator('[data-vsel="lf-fund"] .vsel-label')).toHaveText('Chi phí sản xuất kinh doanh');
  // Hồ sơ đang giữ Chi phí sản xuất kinh doanh; Quản trị dừng hoạt động Chi phí sản xuất kinh doanh: màn vẫn hiện giá trị đang giữ; lựa chọn mới không còn Chi phí sản xuất kinh doanh (P-33).
  await page.evaluate(() => Flow.setUi('fund', 'SXKD'));
  await page.evaluate(() => { Flow.setPersona('qt'); location.hash = '#/dmdc/nguon-von'; });
  await row(page, 'SXKD').locator('[data-cat-tg]').click();
  await page.locator('.vconfirm #cf-ok').click();
  await expect(row(page, 'SXKD').locator('.vswitch')).not.toHaveClass(/on/);
  await page.evaluate(() => { Flow.setPersona('minh'); location.hash = '#/task/' + Flow.state.tokens.find((k) => k.task === 4).id; });
  await expect(page.locator('[data-vsel="lf-fund"] .vsel-label')).toHaveText('Chi phí sản xuất kinh doanh');
  await page.evaluate(() => { Flow.setUi('fund', 'KHCN'); location.hash = '#/viec-cua-toi'; });
  await page.evaluate(() => { location.hash = '#/task/' + Flow.state.tokens.find((k) => k.task === 4).id; });
  expect(await optLabels(page, 'lf-fund')).toEqual(['Quỹ phát triển khoa học công nghệ', 'Đầu tư phát triển', 'Vốn góp của chủ sở hữu', 'Chi phí thường xuyên']);
  expect(page.errors).toEqual([]);
});

test('B5 §6: task 08 chọn nhà cung cấp nhận YCBG từ danh mục — lọc ngành hàng, bị cấm không chọn được, dừng hoạt động không hiện', async ({ page }) => {
  await asAdmin(page, '#/viec-cua-toi');
  await openTask(page, 8, 'minh');
  const f = await openForm(page);
  // T29 B18 (màn YCBG cũ): ô chọn đối tác (options = nccOptions do BE lọc theo ngành hàng của hạng mục) → bảng đối tác đã chọn có Email.
  const tb = f.locator('.ef-table', { hasText: 'Danh sách đối tác nhận yêu cầu báo giá' });
  await expect(tb.locator('thead th')).toHaveText(['Mã đối tác', 'Tên đối tác', 'Email đối tác', 'Ngành hàng', 'Tình trạng']);
  await expect(tb.locator('tbody tr')).toHaveCount(3);
  await expect(tb.locator('tbody tr', { hasText: 'NCC-000003' })).toContainText('quotation@gammatech.sg');
  await expect(f).toContainText('Đã chọn 3 nhà cung cấp');
  // Lựa chọn: 7 NCC đúng ngành hàng; bị cấm (NCC-000007) và dừng hoạt động (Mu Network) không có.
  await f.locator('[data-vsel="ef-nccSel"]').click();
  const panel = page.locator('.vsel-panel');
  await expect(panel.locator('.vsel-opt')).toHaveCount(7);
  await expect(panel.locator('[data-opt="NCC-000007"]')).toHaveCount(0);
  await expect(panel).not.toContainText('Mu Network');
  await panel.locator('[data-opt="NCC-000004"]').click();
  await expect(tb.locator('tbody tr')).toHaveCount(4);
  await expect(f).toContainText('Đã chọn 4 nhà cung cấp');
  for (const c of ['NCC-000001', 'NCC-000002', 'NCC-000003', 'NCC-000004']) await page.locator(`.vsel-panel [data-opt="${c}"]`).click();
  await f.locator('.ef-text h4').first().click();
  await expect(f).toContainText('Đã chọn 0 nhà cung cấp');
  await f.locator('#ok').click();
  await expect(f.locator('.vfield.invalid .msg')).toHaveText('Bạn cần chọn đối tác nhận ycbg');
  expect(page.errors).toEqual([]);
});

test('B5 §6: báo giá lấy tên và loại tiền của nhà cung cấp từ danh mục', async ({ page }) => {
  await asAdmin(page, '#/dmdc/nha-cung-cap');
  await row(page, 'NCC-000001').locator('[data-cat-edit]').click();
  const dlg = page.locator('.vmodal.lg');
  await dlg.locator('[data-cf="short"]').fill('Alpha Tech');
  await dlg.locator('#cat-save').click();
  await expect(dlg).toHaveCount(0);
  await openTask(page, 10, 'minh');
  const f = await openForm(page);
  // Review nhi 06/11 #3: popup không còn bảng so sánh — tên NCC từ danh mục ở dòng tệp báo giá (Tài liệu đính kèm).
  await expect(f.locator('.ef-docs')).toContainText('Báo giá — Alpha Tech');
  await expect(f.locator('.ef-docs')).toContainText('Báo giá — NCC Gamma');
  expect(page.errors).toEqual([]);
});

test('T18 SCR-100 Phân cấp thẩm quyền KĐT: 7 quy tắc giả lập P-90 (UQ-GUQ §1.2), bước 13 đọc quy tắc đang hoạt động', async ({ page }) => {
  await asAdmin(page, '#/dmdc/phan-cap-tham-quyen');
  await expect(page.locator('.pg-head').first()).toContainText('Danh sách quy tắc phân cấp thẩm quyền');
  await expect(page.locator('.vtable tbody tr')).toHaveCount(7);
  const heads = await page.locator('.vtable thead th').allInnerTexts();
  for (const h of ['Loại khoản đầu tư', 'Lĩnh vực', 'Tổng mức vốn (tỷ đồng)', 'Cấp duyệt chủ trương', 'Cấp duyệt KĐT', 'Căn cứ']) expect(heads.join('|')).toContain(h);
  await expect(page.locator('.vtable tbody tr', { hasText: 'UQ-GUQ §1.2.1' })).toContainText('Tập đoàn');
  const r = await page.evaluate(() => [D.kdtAuthRules().length, D.kdtAuthOf({ type: 'KHCN', field: 'VTCNTT' }, 30).ct, D.kdtAuthOf({ type: 'KHCN', field: 'VTCNTT' }, 118.5).ct]);
  expect(r).toEqual([7, 'TD', 'VHT']);
  expect(page.errors).toEqual([]);
});
