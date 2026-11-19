// T80 L5: đóng thầu chỉ có 01 HSDT (QC-12869 Điều 36 khoản 5) — đấu thầu rộng rãi / hạn chế: Chủ đầu tư gia hạn thời điểm đóng thầu (tối thiểu 03 ngày
// làm việc; bước 3.4 mở lại — GIẢ LẬP P-THAU-01, DX-20) hoặc mở thầu ngay. Gói nhiều HSDT không hiện nhóm xử lý tình huống.
import { test, expect } from '@playwright/test';
import { fresh, lastToast } from './helpers.mjs';

const BA = /SCR-|UC-|task \d|Prototype|minh hoạ|GIẢ LẬP|P-2\d\d|P-THAU|DX-20/;
const as = (page, id) => page.evaluate((x) => Flow.setPersona(x), id);
const goto = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const card = (page, title) => page.locator('main section.vcard', { has: page.locator('h3', { hasText: title }) });
const tab = (page, key) => page.locator(`.dx-tabs [data-ttab="${key}"]`).click();
const act = (page, label) => page.locator('.task-acts [data-act]', { hasText: label }).click();
const ok = (page) => page.locator('.vmodal #ok').click();
const done = (page) => expect(page).toHaveURL(/#\/viec-cua-toi$/);
const start = (page, code, target) => page.evaluate(([c, t]) => Flow.startLc(c, { name: c, target: t }), [code, target]);
const steps3 = (page, hs) => page.evaluate((c) => Flow.caseOf(c).history.map((h) => String(h.task)).filter((t) => t.startsWith('3.')), hs);
/* Ngày dd/mm/yyyy sau n ngày lịch kể từ đồng hồ prototype. */
const plus = (page, n) => page.evaluate((k) => Flow.dateOf(Flow.state.clock + k), n);
async function openTask(page, n) {
  const [who, id] = await page.evaluate((k) => { for (const p of D.personas) { const t = Flow.caseTokens(p.id).find((x) => String(x.task) === String(k)); if (t) return [p.id, t.id]; } return []; }, n);
  expect(id, `việc bước ${n}`).toBeTruthy();
  await as(page, who);
  await goto(page, '#/task/' + id);
  await expect(page.locator('.task-acts [data-act]').first()).toBeVisible();
}

test('GT-2026-0029 (01 HSDT): gia hạn dưới 03 ngày làm việc bị chặn; gia hạn hợp lệ mở lại bước 3.4 và ghi tình huống; lần sau mở thầu ngay', async ({ page }) => {
  const G = 'GT-2026-0029';
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'admin');
  const HS = await start(page, G, '3.4');
  await openTask(page, '3.4');
  await act(page, 'Hoàn thành mở thầu');
  const m = page.locator('.vmodal');
  await expect(m).toContainText('chỉ có 01 nhà thầu nộp HSDT');
  await m.locator(`[data-ef-radio="lcXlTh"][data-v='"GIA_HAN"']`).click();
  await expect(m.locator('[data-ef="lcNgayMo"]')).toHaveCount(0);
  await m.locator('[data-ef="lcLyDoGh"]').fill('Tăng số lượng nhà thầu tham dự.');
  await m.locator('[data-ef="lcDongMoi"]').fill(await plus(page, 1));
  await m.locator('[data-ef="lcMoMoi"]').fill(await plus(page, 1));
  await m.locator('[data-ef="lcSoVbGh"]').fill('IB2600029-01');
  await m.locator('[data-ef="lcSoTtrXlth"]').fill('0712/TTr-TCG');
  await m.locator('[data-ef="lcSoCvGh"]').fill('0713/VHT-MS');
  await ok(page);
  expect(await lastToast(page)).toContain('tối thiểu 03 ngày làm việc');
  await m.locator('[data-ef="lcDongMoi"]').fill(await plus(page, 7));
  await m.locator('[data-ef="lcMoMoi"]').fill(await plus(page, 7));
  await ok(page); await done(page);
  expect(await steps3(page, HS)).toEqual(['3.1', '3.2', '3.3', '3.4']);
  expect(await page.evaluate((c) => Flow.caseOf(c).tokens.map((t) => String(t.task)), HS)).toEqual(['3.4']);
  expect(await page.evaluate((c) => Thau.pkRow(Thau.pkOf(c)).prog.issue, G)).toContain('Gia hạn đóng thầu đến');

  await goto(page, '#/goi-thau/' + G);
  await tab(page, 'th');
  const th = card(page, 'Tình huống & kiến nghị');
  await expect(th).toContainText('Chỉ có 01 HSDT — gia hạn thời điểm đóng thầu');
  await expect(th).toContainText('IB2600029-01');
  await expect(th).toContainText('0712/TTr-TCG');
  await expect(th).toContainText('0713/VHT-MS');
  // T80 L5b: thẻ Mốc văn bản có tờ trình xử lý tình huống và công văn gia hạn.
  await page.locator('.dx-tabs [data-ttab="info"]').click();
  const moc = card(page, 'Mốc văn bản');
  await expect(moc.locator('tr', { hasText: 'Tờ trình xử lý tình huống' })).toContainText('0712/TTr-TCG');
  await expect(moc.locator('tr', { hasText: 'Công văn gia hạn đóng thầu' })).toContainText('0713/VHT-MS');
  await page.locator('.dx-tabs [data-ttab="th"]').click();
  await expect(th).toContainText('Đã xử lý trong tổ chức LCNT');
  expect(await page.locator('main').innerText()).not.toMatch(BA);

  await openTask(page, '3.4');
  await act(page, 'Hoàn thành mở thầu');
  await expect(m).toContainText('Đã gia hạn thời điểm đóng thầu lần 1');
  await m.locator(`[data-ef-radio="lcXlTh"][data-v='"MO"']`).click();
  await expect(m.locator('[data-ef="lcSoCvGh"]')).toHaveCount(0);
  await m.locator('[data-ef="lcSoTtrXlth"]').fill('0731/TTr-TCG');
  await ok(page); await done(page);
  expect(await page.evaluate((c) => Flow.caseOf(c).tokens.map((t) => String(t.task)), HS)).toEqual(['3.5']);
  await goto(page, '#/goi-thau/' + G);
  await tab(page, 'th');
  await expect(card(page, 'Tình huống & kiến nghị')).toContainText('Chỉ có 01 HSDT — mở thầu ngay');
  await expect(card(page, 'Tình huống & kiến nghị')).toContainText('0731/TTr-TCG');
  expect(page.errors).toEqual([]);
});

test('GT-2026-0045 (4 HSDT): không hiện nhóm xử lý tình huống, mở thầu đi thẳng đánh giá', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'admin');
  const HS = await start(page, 'GT-2026-0045', '3.4');
  await openTask(page, '3.4');
  await act(page, 'Hoàn thành mở thầu');
  const m = page.locator('.vmodal');
  await expect(m).not.toContainText('chỉ có 01 nhà thầu');
  await expect(m.locator('[data-ef-radio="lcXlTh"]')).toHaveCount(0);
  await expect(m.locator('[data-ef="lcSoTtrXlth"]')).toHaveCount(0);
  await ok(page); await done(page);
  expect(await page.evaluate((c) => Flow.caseOf(c).tokens.map((t) => String(t.task)), HS)).toEqual(['3.5']);
  expect(page.errors).toEqual([]);
});
