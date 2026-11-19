// T80 L7: SCR-31 Nhà cung cấp — trường của Danh mục Đối tác hệ thống cũ (HT-THAU-VID §5: người đại diện, chức vụ, số đăng ký kinh doanh, ngày thành lập,
// tài khoản ngân hàng, fax) và nhà thầu liên danh (QC-12869 Điều 24 khoản 4: thỏa thuận liên danh, thành viên đứng đầu).
import { test, expect } from '@playwright/test';
import { fresh, lastToast } from './helpers.mjs';

const BA = /SCR-\d|UC-\d|task \d|Prototype|minh hoạ|giả lập/i;
const asAdmin = async (page, hash) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => Flow.setPersona('qt'));
  await page.goto(page.url().replace(/#.*$/, '') + hash);
  await expect(page.locator('main')).not.toBeEmpty();
};
const row = (page, code) => page.locator('.vtable tbody tr', { hasText: code });
const pick = async (page, id, label) => {
  await page.evaluate(() => document.activeElement && document.activeElement.blur());
  await page.locator(`[data-vsel="${id}"]`).click();
  await page.locator('.vsel-opt', { hasText: label }).first().click();
};
const ffMsg = (dlg, k) => dlg.locator(`[data-ff="${k}"] .msg`);

test('Danh sách có cột Người đại diện (kèm chức vụ), Liên danh; Xem chi tiết có số đăng ký kinh doanh, tài khoản ngân hàng, fax', async ({ page }) => {
  await asAdmin(page, '#/dmdc/nha-cung-cap');
  await expect(row(page, 'NCC-000001')).toContainText('Nguyễn Văn Hùng');
  await expect(row(page, 'NCC-000001')).toContainText('Giám đốc');
  await row(page, 'NCC-000001').locator('[data-cat-view]').click();
  const dlg = page.locator('.vmodal.lg');
  await expect(dlg.locator('[data-cf="reg"]')).toHaveValue('0101234567');
  await expect(dlg.locator('[data-cf="founded"]')).toHaveValue('15/03/2008');
  await expect(dlg.locator('[data-cf="bank"]')).toHaveValue(/Ngân hàng TMCP Ngoại thương/);
  await expect(dlg.locator('[data-cf="fax"]')).toHaveValue('024 3765 1235');
  await expect(dlg.locator('[data-vsel="cf-jv"]')).toContainText('Không');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('Thêm nhà thầu liên danh: thành viên, thành viên đứng đầu bắt buộc; ít nhất 02 thành viên; không bắt buộc mã số thuế riêng; chức vụ mặc định Giám đốc', async ({ page }) => {
  await asAdmin(page, '#/dmdc/nha-cung-cap');
  await page.locator('[data-cat-new]').click();
  const dlg = page.locator('.vmodal.lg');
  await expect(dlg.locator('[data-cf="position"]')).toHaveValue('Giám đốc');
  await expect(dlg.locator('[data-vsel="cf-members"]')).toHaveClass(/dis/);
  await dlg.locator('[data-cf="name"]').fill('Liên danh Beta - Zeta');
  await dlg.locator('[data-cf="address"]').fill('45 Nguyễn Thị Minh Khai, Quận 1, TP Hồ Chí Minh');
  await pick(page, 'cf-goods', 'Viễn thông - CNTT');
  await dlg.locator('.vmodal-h h3').click();
  await dlg.locator('[data-cf="email"]').fill('liendanh@betaequip.vn');
  await pick(page, 'cf-jv', 'Có');
  await expect(dlg.locator('[data-ff="tax"] .req')).toBeHidden();
  await expect(dlg.locator('[data-vsel="cf-members"]')).not.toHaveClass(/dis/);
  await dlg.locator('#cat-save').click();
  await expect(ffMsg(dlg, 'members')).toHaveText('Bạn cần chọn Thành viên liên danh.');
  await expect(ffMsg(dlg, 'lead')).toHaveText('Bạn cần chọn Thành viên đứng đầu liên danh.');
  await expect(ffMsg(dlg, 'tax')).toBeHidden();
  await pick(page, 'cf-members', 'NCC-000002');
  await dlg.locator('.vmodal-h h3').click();
  await pick(page, 'cf-lead', 'NCC-000002');
  await dlg.locator('#cat-save').click();
  await expect(ffMsg(dlg, 'members')).toHaveText('Nhà thầu liên danh cần ít nhất 02 thành viên.');
  await pick(page, 'cf-members', 'NCC-000006');
  await dlg.locator('.vmodal-h h3').click();
  await dlg.locator('[data-cf="rep"]').fill('Trần Quốc Việt');
  await dlg.locator('#cat-save').click();
  expect(await lastToast(page)).toContain('Thêm mới nhà cung cấp thành công');
  await expect(row(page, 'NCC-000013')).toContainText('Liên danh');
  await expect(row(page, 'NCC-000013')).toContainText('Trần Quốc Việt');
  const r = await page.evaluate(() => { const x = Catalog.rows('nha-cung-cap').find((y) => y.code === 'NCC-000013'); return [x.jv, x.members, x.lead, x.position]; });
  expect(r).toEqual(['CO', ['NCC-000002', 'NCC-000006'], 'NCC-000002', 'Giám đốc']);
  // Nhà thầu liên danh không được chọn làm thành viên của liên danh khác.
  await page.locator('[data-cat-new]').click();
  await pick(page, 'cf-jv', 'Có');
  await page.locator('[data-vsel="cf-members"]').click();
  await expect(page.locator('.vsel-opt', { hasText: 'NCC-000013' })).toHaveCount(0);
  expect(page.errors).toEqual([]);
});
