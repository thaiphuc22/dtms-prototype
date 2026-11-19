// T80 L2: báo cáo đánh giá hồ sơ theo QC-12869 Điều 32 — giá dự thầu sau sửa lỗi, hiệu chỉnh sai lệch, trừ giảm giá; xếp hạng nhà thầu đạt theo phương pháp
// của HSMT; nhà thầu không đạt phải có lý do (Điều 33 khoản 3); tỷ trọng điểm kỹ thuật của phương pháp kết hợp (Điều 32 khoản 4 điểm b).
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
const start = (page, code, target) => page.evaluate(([c, t]) => Flow.startLc(c, { name: c, target: t }), [code, target]);
async function openTask(page, n) {
  const [who, id] = await page.evaluate((k) => { for (const p of D.personas) { const t = Flow.caseTokens(p.id).find((x) => String(x.task) === String(k)); if (t) return [p.id, t.id]; } return []; }, n);
  expect(id, `việc bước ${n}`).toBeTruthy();
  await as(page, who);
  await goto(page, '#/task/' + id);
  await expect(page.locator('.task-acts [data-act]').first()).toBeVisible();
}

test('Gói tĩnh GT-2026-0045: bảng đánh giá có sửa lỗi / hiệu chỉnh / giảm giá và giá sau hiệu chỉnh', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'admin');
  await goto(page, '#/goi-thau/GT-2026-0045');
  await tab(page, 'dg');
  const c = card(page, 'Kết quả đánh giá nhà thầu');
  await expect(c).toContainText('Giá sau sửa lỗi, hiệu chỉnh, giảm giá');
  await expect(c.locator('tbody tr').first()).toContainText(/35[,.]5/);
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('MS19 3.5 (GT-2026-0045): giảm giá đổi xếp hạng; không đạt phải có lý do; thương thảo mặc định nhà thầu xếp hạng 1 với giá sau hiệu chỉnh', async ({ page }) => {
  const G = 'GT-2026-0045';
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'admin');
  const HS = await start(page, G, '3.5');
  await openTask(page, '3.5');
  await act(page, 'Hoàn thành đánh giá');
  const m = page.locator('.vmodal');
  await expect(m).toContainText('Phương pháp đánh giá (theo hồ sơ mời đã duyệt): Giá thấp nhất');
  await expect(m.locator('[data-ef="lcDanhGia::0::diemKt"]')).toHaveCount(0);
  // Dòng 1 (37,10 tỷ) giảm giá 2,5 → 34,6 tỷ — thấp nhất.
  await m.locator('[data-ef="lcDanhGia::1::giamGia"]').fill('2.5');
  await m.locator('[data-ef="lcDanhGia::1::hieuLuc"]').click();
  await expect(m).toContainText('trừ giảm giá: 34,6 tỷ đồng');
  await m.locator(`[data-ef-radio="lcDanhGia::2::hopLe"][data-v='"Không đạt"']`).click();
  await ok(page);
  expect(await lastToast(page)).toContain('Ghi lý do không đạt');
  await m.locator('[data-ef="lcDanhGia::2::ghiChu"]').fill('Không có giấy uỷ quyền bán hàng của hãng sản xuất');
  await ok(page); await done(page);

  const r = await page.evaluate((c) => Flow.caseOf(c).ui.lcDanhGia.map((x) => [x.ma, x.giaSau, x.xepHang]), HS);
  expect(r).toEqual([['NCC-000009', 36.4, 3], ['NCC-000003', 34.6, 1], ['NCC-000001', 35.2, null], ['NCC-000010', 34.8, 2]]);

  await goto(page, '#/goi-thau/' + G);
  await tab(page, 'dg');
  await expect(card(page, 'Kết quả đánh giá nhà thầu')).toContainText('Số nhà thầu đạt');
  await expect(card(page, 'Nhà thầu không đạt và lý do')).toContainText('Không có giấy uỷ quyền bán hàng');
  expect(await page.locator('main').innerText()).not.toMatch(BA);

  await openTask(page, '3.6');
  await act(page, 'Hoàn thành thương thảo');
  expect(await page.evaluate(() => [document.querySelector('[data-vsel="ef-lcNhaThau"]').textContent, document.querySelector('[data-ef="lcGiaTT"]').value])).toEqual([expect.stringContaining('NCC-000003'), '34.6']);
  expect(page.errors).toEqual([]);
});

test('HSMT kết hợp kỹ thuật và giá: tỷ trọng điểm kỹ thuật ngoài 10%–30% bị chặn (Điều 32 khoản 4 điểm b)', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'admin');
  await start(page, 'GT-2026-0050', '3.1');
  await openTask(page, '3.1');
  await act(page, 'Trình thẩm định HSMT');
  const m = page.locator('.vmodal');
  await expect(m.locator('[data-ef="lcTyTrongKt"]')).toHaveCount(0);
  await page.locator('[data-vsel="ef-lcPpDanhGia"]').click();
  await expect(page.locator('.vsel-panel [data-opt]')).toHaveCount(5);
  await page.locator('.vsel-panel [data-opt="Kết hợp giữa kỹ thuật và giá"]').click();
  await expect(m).toContainText('10%–30% (Điều 32 khoản 4 điểm b)');
  await m.locator('[data-ef="lcNgayDong"]').fill('30/12/2026');
  await m.locator('[data-ef="lcTyTrongKt"]').fill('50');
  await ok(page);
  expect(await lastToast(page)).toContain('từ 10% đến 30%');
  await m.locator('[data-ef="lcTyTrongKt"]').fill('25');
  await ok(page); await done(page);
  expect(page.errors).toEqual([]);
});
