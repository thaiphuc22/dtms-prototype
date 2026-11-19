// T80 L9 + L2b: trường HSMT (hiệu lực HSDT ≤ 180 ngày — QC-12869 Điều 30 khoản 4; hiệu lực bảo đảm = hiệu lực HSDT + 30 ngày — Điều 27 khoản 4; năng lực
// kinh nghiệm, tỷ lệ khối lượng theo A-HSMT hệ thống cũ) và đánh giá: hiệu lực HSDT ngắn hơn yêu cầu thì không hợp lệ (Phụ lục 2); ưu đãi xếp hạng cao hơn
// khi đánh giá ngang nhau (Điều 31 khoản 5).
import { test, expect } from '@playwright/test';
import { fresh, lastToast } from './helpers.mjs';

const BA = /SCR-|UC-|task \d|Prototype|minh hoạ|GIẢ LẬP|P-2\d\d|P-THAU|DX-2\d/;
const as = (page, id) => page.evaluate((x) => Flow.setPersona(x), id);
const goto = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const card = (page, title) => page.locator('main section.vcard', { has: page.locator('h3', { hasText: title }) });
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

test('HSMT (GT-2026-0050): hiệu lực HSDT quá 180 ngày bị chặn; hiệu lực bảo đảm tự tính; tab Hồ sơ mời hiện các yêu cầu', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'admin');
  await start(page, 'GT-2026-0050', '3.1');
  await openTask(page, '3.1');
  await act(page, 'Trình thẩm định HSMT');
  const m = page.locator('.vmodal');
  await expect(m.locator('[data-ef="lcHieuLucHsdt"]')).toHaveValue('120');
  await expect(m).toContainText('hiệu lực bảo đảm dự thầu: 150 ngày');
  await expect(m).toContainText('Giá trị bảo đảm dự thầu: 0,47 tỷ đồng');
  await m.locator('[data-ef="lcNgayDong"]').fill('30/12/2026');
  await m.locator('[data-ef="lcHieuLucHsdt"]').fill('200');
  await ok(page);
  expect(await lastToast(page)).toContain('từ 1 đến 180 ngày');
  await m.locator('[data-ef="lcHieuLucHsdt"]').fill('90');
  await m.locator('[data-ef="lcHdTuongTu"]').click();
  await expect(m).toContainText('hiệu lực bảo đảm dự thầu: 120 ngày');
  await m.locator('[data-ef="lcHdTuongTu"]').fill('12.5');
  await ok(page); await done(page);
  await goto(page, '#/goi-thau/GT-2026-0050');
  await page.locator('.dx-tabs [data-ttab="hs"]').click();
  await expect(page.locator('main')).toContainText('90 ngày');
  await expect(page.locator('main')).toContainText('120 ngày');
  await expect(card(page, 'Yêu cầu năng lực, kinh nghiệm và khối lượng')).toContainText('12,50 tỷ đồng');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('Đánh giá (GT-2026-0045): hiệu lực HSDT ngắn hơn yêu cầu bị chặn; hai nhà thầu ngang giá thì nhà thầu ưu đãi xếp trên', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'admin');
  const HS = await start(page, 'GT-2026-0045', '3.5');
  await openTask(page, '3.5');
  await act(page, 'Hoàn thành đánh giá');
  const m = page.locator('.vmodal');
  await expect(m.locator('[data-ef="lcDanhGia::0::hieuLuc"]')).toHaveValue('120');
  await m.locator('[data-ef="lcDanhGia::0::hieuLuc"]').fill('60');
  await ok(page);
  expect(await lastToast(page)).toContain('có hiệu lực 60 ngày, ngắn hơn yêu cầu 120 ngày');
  await m.locator('[data-ef="lcDanhGia::0::hieuLuc"]').fill('120');
  // Dòng 2 (37,10) giảm 2,3 → 34,8 = dòng 4 (34,80); dòng 4 thuộc đối tượng ưu đãi → xếp thứ nhất.
  await m.locator('[data-ef="lcDanhGia::1::giamGia"]').fill('2.3');
  await m.locator('[data-ef-chk="lcDanhGia::3::uuDai"]').check();
  await ok(page); await done(page);
  const r = await page.evaluate((c) => Flow.caseOf(c).ui.lcDanhGia.map((x) => [x.ma, x.giaSau, x.xepHang, !!x.uuDai]), HS);
  expect(r).toEqual([['NCC-000009', 36.4, 4, false], ['NCC-000003', 34.8, 2, false], ['NCC-000001', 35.2, 3, false], ['NCC-000010', 34.8, 1, true]]);
  await goto(page, '#/goi-thau/GT-2026-0045');
  await page.locator('.dx-tabs [data-ttab="dg"]').click();
  await expect(card(page, 'Kết quả đánh giá nhà thầu')).toContainText('Ưu đãi');
  expect(page.errors).toEqual([]);
});
