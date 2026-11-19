// T80 L1 (D-132 Q3 = A): mua sắm trực tiếp theo QC-12869 Điều 15 (7.6 kiểm tra 4 điều kiện với gói tham chiếu → 7.5 thư mời thương thảo kèm dự thảo
// hợp đồng → 7.4 thương thảo; không thành thì mời nhà thầu xếp hạng tiếp theo — khoản 3) và chỉ định thầu rút gọn theo Điều 16 khoản 5 (7.5 → 7.4,
// không HSYC / HSĐX). BPMN-MS19 chưa có nhánh này — đề xuất DX-19.
import { test, expect } from '@playwright/test';
import { fresh, lastToast } from './helpers.mjs';

const BA = /SCR-|UC-|task \d|Prototype|minh hoạ|GIẢ LẬP|P-2\d\d|DX-19/;
const as = (page, id) => page.evaluate((x) => Flow.setPersona(x), id);
const goto = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const card = (page, title) => page.locator('main section.vcard', { has: page.locator('h3', { hasText: title }) });
const tab = (page, key) => page.locator(`.dx-tabs [data-ttab="${key}"]`).click();
const act = (page, label) => page.locator('.task-acts [data-act]', { hasText: label }).click();
const ok = (page) => page.locator('.vmodal #ok').click();
const done = (page) => expect(page).toHaveURL(/#\/viec-cua-toi$/);
const lc = (page, code) => page.evaluate((c) => Thau.pkRow(Thau.pkOf(c)).lc, code);
const steps7 = (page, hs) => page.evaluate((c) => Flow.caseOf(c).history.map((h) => String(h.task)).filter((t) => t.startsWith('7')), hs);
async function openTask(page, who, n) {
  await as(page, who);
  const id = await page.evaluate(([w, k]) => (Flow.caseTokens(w).find((t) => String(t.task) === String(k)) || {}).id, [who, n]);
  expect(id, `việc bước ${n} của ${who}`).toBeTruthy();
  await goto(page, '#/task/' + id);
  await expect(page.locator('.task-acts [data-act]').first()).toBeVisible();
}

test('Chỉ định thầu rút gọn (GT-2026-0031): thư mời thương thảo kèm dự thảo hợp đồng → thương thảo, không qua HSYC', async ({ page }) => {
  const G = 'GT-2026-0031';
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'thau');
  await goto(page, '#/goi-thau/' + G);
  await page.locator(`[data-lc-sample="${G}"]`).click();
  await expect(page).toHaveURL(/#\/task\/HSLC-2026-0031:k/);
  expect(await lc(page, G)).toBe('LC-04');
  expect(await steps7(page, 'HSLC-2026-0031')).toEqual([]);
  await expect(page.locator('main')).not.toContainText('Lập, phê duyệt HSYC');
  await openTask(page, 'thau', '7.5');
  await act(page, 'Gửi thư mời thương thảo');
  await expect(page.locator('.vmodal')).toContainText('Tỷ lệ giảm giá yêu cầu');
  await ok(page); await done(page);
  await goto(page, '#/goi-thau/' + G);
  await tab(page, 'hs');
  await expect(card(page, 'Thư mời thương thảo và dự thảo hợp đồng')).toContainText('Đã gửi');
  await openTask(page, 'thau', '7.4');
  await act(page, 'Hoàn thành thương thảo');
  await expect(page.locator('.vmodal')).not.toContainText('Kết quả thương thảo');
  await page.locator('[data-ef="lcNoiDungTT"]').fill('Thống nhất giá và tiến độ 45 ngày.');
  await ok(page); await done(page);
  expect(await lc(page, G)).toBe('LC-08');
  expect(await steps7(page, 'HSLC-2026-0031')).toEqual(['7.5', '7.4']);
  expect(page.errors).toEqual([]);
});

test('Mua sắm trực tiếp (GT-2026-0048): kiểm tra Điều 15 khoản 2 chặn khi đơn giá vượt; thương thảo không thành mời nhà thầu xếp hạng tiếp theo', async ({ page }) => {
  const G = 'GT-2026-0048', HS = 'HSLC-2026-0048';
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'thau');
  await goto(page, '#/goi-thau/' + G);
  await tab(page, 'pa');
  await expect(card(page, 'Gói thầu tham chiếu')).toContainText('GT-2025-0207');
  await expect(card(page, 'Trình tự thực hiện')).toContainText('Gửi thư mời thương thảo kèm dự thảo hợp đồng');
  await page.locator(`[data-lc-sample="${G}"]`).click();
  await expect(page).toHaveURL(/#\/task\/HSLC-2026-0048:k/);
  expect(await lc(page, G)).toBe('LC-01');
  // 7.6: đơn giá dự kiến vượt đơn giá gói tham chiếu → không chuyển bước.
  await act(page, 'Xác nhận đủ điều kiện');
  await expect(page.locator('.vmodal')).toContainText('Vận chuyển cảng Hải Phòng');
  await page.locator('[data-ef="lcSoSanh::0::dgNay"]').fill('130');
  await ok(page);
  expect(await lastToast(page)).toContain('Không đủ điều kiện mua sắm trực tiếp');
  await page.locator('[data-ef="lcSoSanh::0::dgNay"]').fill('110');
  await ok(page); await done(page);
  expect(await lc(page, G)).toBe('LC-04');
  await goto(page, '#/goi-thau/' + G);
  await tab(page, 'pa');
  await expect(card(page, 'Gói thầu tham chiếu')).toContainText('120%');
  await expect(card(page, 'Gói thầu tham chiếu').locator('tbody .badge, tbody [class*="badge"]', { hasText: 'Không đạt' })).toHaveCount(0);
  // 7.5 → 7.4 không thành → quay lại 7.5 mời nhà thầu xếp hạng thứ hai (Delta HN).
  await openTask(page, 'thau', '7.5');
  await act(page, 'Gửi thư mời thương thảo');
  await expect(page.locator('.vmodal')).not.toContainText('Tỷ lệ giảm giá yêu cầu');
  await ok(page); await done(page);
  await openTask(page, 'thau', '7.4');
  await act(page, 'Hoàn thành thương thảo');
  await page.locator(`[data-ef-radio="lcTtKq"][data-v='"KHONG"']`).click();
  await page.locator('[data-ef="lcNoiDungTT"]').fill('Nhà thầu không chấp nhận đơn giá của gói tham chiếu.');
  await ok(page); await done(page);
  await openTask(page, 'thau', '7.5');
  await act(page, 'Gửi thư mời thương thảo');
  await expect(page.locator('.vmodal')).toContainText('lần mời 2');
  await ok(page); await done(page);
  await goto(page, '#/goi-thau/' + G);
  await tab(page, 'hs');
  await expect(card(page, 'Thư mời thương thảo và dự thảo hợp đồng')).toContainText('Delta');
  // Hết danh sách xếp hạng (2 nhà thầu) → không mời tiếp; thương thảo thành công → KQLCNT.
  await openTask(page, 'thau', '7.4');
  await act(page, 'Hoàn thành thương thảo');
  await page.locator(`[data-ef-radio="lcTtKq"][data-v='"KHONG"']`).click();
  await page.locator('[data-ef="lcNoiDungTT"]').fill('Không thành.');
  await ok(page);
  expect(await lastToast(page)).toContain('không còn nhà thầu xếp hạng tiếp theo');
  await page.locator(`[data-ef-radio="lcTtKq"][data-v='"OK"']`).click();
  await ok(page); await done(page);
  expect(await lc(page, G)).toBe('LC-08');
  expect(await steps7(page, HS)).toEqual(['7.6', '7.5', '7.4', '7.5', '7.4']);
  await goto(page, '#/goi-thau/' + G);
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});
