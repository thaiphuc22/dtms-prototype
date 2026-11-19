// T80 L4: thẻ Mốc văn bản ở tab Thông tin chung SCR-82 — chỉ xem, đọc lại số / ngày văn bản đã có (KHLCNT, biến hồ sơ MS19, tin công khai, KQLCNT, huỷ thầu);
// mốc chưa tới để trống; hình thức không phát hành hồ sơ mời không có mốc HSMT.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const BA = /SCR-|UC-|task \d|Prototype|minh hoạ|GIẢ LẬP|P-2\d\d|P-THAU|DX-2\d/;
const as = (page, id) => page.evaluate((x) => Flow.setPersona(x), id);
const goto = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const card = (page, title) => page.locator('main section.vcard', { has: page.locator('h3', { hasText: title }) });
const row = (c, label) => c.locator('tbody tr', { has: c.page().locator('td', { hasText: label }) }).first();
const start = (page, code, target) => page.evaluate(([c, t]) => Flow.startLc(c, { name: c, target: t }), [code, target]);

test('Gói tĩnh có KQLCNT (GT-2026-0021): QĐ KHLCNT, mã SAP, TBMT, biên bản mở thầu, QĐ KQLCNT', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'admin');
  await goto(page, '#/goi-thau/GT-2026-0021');
  const c = card(page, 'Mốc văn bản');
  await expect(c).toBeVisible();
  const kh = await page.evaluate(() => { const k = Thau.khOf('KHLCNT-2026-0009'); return [k.docs.bm03[0], k.sap]; });
  await expect(row(c, 'QĐ phê duyệt KHLCNT')).toContainText(kh[0]);
  await expect(row(c, 'Mã KHLCNT trên SAP')).toContainText(kh[1]);
  await expect(row(c, 'Mã gói thầu trên SAP')).toContainText('3000004812');
  await expect(row(c, 'Đăng tải TBMT kèm HSMT')).toContainText('VTB-2609-00122');
  await expect(row(c, 'Biên bản mở thầu')).toContainText('15/09/2026');
  await expect(row(c, 'QĐ phê duyệt KQLCNT')).toContainText(await page.evaluate(() => Thau.pkOf('GT-2026-0021').kq[0]));
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('Gói chạy MS19 (GT-2026-0045 tới 3.5): mốc HSMT, TBMT, đóng / mở thầu lấy từ biến hồ sơ; đánh giá, KQLCNT còn trống', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'admin');
  await start(page, 'GT-2026-0045', '3.5');
  await goto(page, '#/goi-thau/GT-2026-0045');
  const c = card(page, 'Mốc văn bản');
  await expect(row(c, 'Phê duyệt HSMT')).toContainText('Không đánh số');
  await expect(row(c, 'Đăng tải TBMT kèm HSMT')).toContainText('IB260045-00');
  await expect(row(c, 'Biên bản mở thầu')).toContainText(/\d\d\/\d\d\/2026/);
  await expect(row(c, 'Báo cáo đánh giá HSDT')).not.toContainText('/');
  await expect(row(c, 'QĐ phê duyệt KQLCNT')).toContainText('MS19 — 17.');
  await expect(row(c, 'QĐ phê duyệt KQLCNT')).not.toContainText('QĐ-VHT');
  expect(page.errors).toEqual([]);
});

test('Mọi gói mẫu: thẻ Mốc văn bản dựng không lỗi; gói huỷ có Quyết định huỷ thầu', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'admin');
  const codes = await page.evaluate(() => Thau.PK.map((g) => [g.code, (g.events || []).some((e) => e[0] === 'Huỷ thầu')]));
  for (const [code, huy] of codes) {
    await goto(page, '#/goi-thau/' + encodeURIComponent(code));
    const c = card(page, 'Mốc văn bản');
    await expect(c, code).toBeVisible();
    if (huy) await expect(row(c, 'Quyết định huỷ thầu'), code).toContainText('QĐ-VHT');
  }
  expect(page.errors).toEqual([]);
});

test('Gói mật (GT-2026-0031): mốc đăng tải ghi không đăng tải, mã SAP không tạo; không có tin trên màn Công khai (Điều 7 khoản 1)', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'admin');
  await goto(page, '#/goi-thau/GT-2026-0031');
  const c = card(page, 'Mốc văn bản');
  await expect(row(c, 'Đăng tải KHLCNT')).toContainText('Không đăng tải — gói mật');
  await expect(row(c, 'Đăng tải KQLCNT')).toContainText('Không đăng tải — gói mật');
  await expect(row(c, 'Mã gói thầu trên SAP')).toContainText('Không tạo — gói mật');
  await expect(page.locator('main')).toContainText('Mật');
  expect(await page.evaluate(() => CongKhai.items().filter((i) => i.code === 'GT-2026-0031').length)).toBe(0);
  // Gói không mật cùng KHLCNT vẫn có tin.
  expect(await page.evaluate(() => CongKhai.items().filter((i) => i.code === 'GT-2026-0024').length)).toBeGreaterThan(0);
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});
