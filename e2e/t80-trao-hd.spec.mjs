// T80 L3 (phần thầu): biên bản thương thảo dạng bảng; MS19 bước 22 — Thư chấp thuận HSDT và trao hợp đồng, Thông tin chuyển giao để ký hợp đồng
// (tab Trao HĐ, TT Ký HĐ của hệ thống cũ — HT-THAU-CONV; GIẢ LẬP P-THAU-04). Bảo đảm thực hiện hợp đồng 2%–10% (QC-12869 Điều 44 khoản 3), gói tư vấn
// không yêu cầu (khoản 1); hoàn thiện hợp đồng 10 / 20 ngày (Điều 27 khoản 8 điểm e); ngày hết hiệu lực HSDT = đóng thầu + hiệu lực (Điều 30 khoản 4).
import { test, expect } from '@playwright/test';
import { fresh, lastToast } from './helpers.mjs';

const BA = /SCR-|UC-|task \d|Prototype|minh hoạ|GIẢ LẬP|P-2\d\d|P-THAU|DX-2\d/;
const as = (page, id) => page.evaluate((x) => Flow.setPersona(x), id);
const goto = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const card = (page, title) => page.locator('main section.vcard', { has: page.locator('h3', { hasText: title }) });
const act = (page, label) => page.locator('.task-acts [data-act]', { hasText: label }).click();
const ok = (page) => page.locator('.vmodal #ok').click();
const done = (page) => expect(page).toHaveURL(/#\/viec-cua-toi$/);
/* Điền ô rồi rời ô, chờ lượt vẽ lại eForm (change → setTimeout) xong mới điền ô kế tiếp. */
const put = async (page, loc, v) => { await loc.fill(v); await loc.evaluate((e) => e.blur()); await page.evaluate(() => new Promise((r) => setTimeout(r, 20))); };
const closed = (page) => expect(page.locator('.vmodal')).toHaveCount(0);
/* Tua luồng tới bước target; keep = giữ dữ liệu eForm đã nhập (startLc mở lại hồ sơ từ đầu). */
const run = (page, code, target, keep) => page.evaluate(([c, t, k]) => { const o = k && Flow.caseOf('HSLC-' + c.slice(3)); return Flow.startLc(c, { name: c, target: t, ui: o ? JSON.parse(JSON.stringify(o.ui)) : undefined }); }, [code, target, !!keep]);
async function openTask(page, n) {
  const [who, id] = await page.evaluate((k) => { for (const p of D.personas) { const t = Flow.caseTokens(p.id).find((x) => String(x.task) === String(k)); if (t) return [p.id, t.id]; } return []; }, n);
  expect(id, `việc bước ${n}`).toBeTruthy();
  await as(page, who);
  await goto(page, '#/task/' + id);
  await expect(page.locator('.task-acts [data-act]').first()).toBeVisible();
}

test('GT-2026-0045 (quốc tế): biên bản thương thảo dạng bảng; bước 22 kiểm bảo đảm thực hiện hợp đồng, đầu mối; tab Đánh giá & KQLCNT, Mốc văn bản đọc lại', async ({ page }) => {
  const G = 'GT-2026-0045';
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'admin');
  const HS = await run(page, G, '3.1');
  await openTask(page, '3.1');
  await act(page, 'Trình thẩm định HSMT');
  await page.locator('.vmodal [data-ef="lcNgayDong"]').fill('30/11/2026');
  await ok(page); await done(page);

  await run(page, G, '3.6', true);
  await openTask(page, '3.6');
  await act(page, 'Hoàn thành thương thảo');
  const m = page.locator('.vmodal');
  // Dòng gợi ý từ mẫu hợp đồng và phạm vi gói; thời gian thực hiện hợp đồng theo KHLCNT.
  await expect(m.locator('[data-ef="lcBbTt::0::noiDung"]')).toHaveValue('Kết cấu hợp đồng');
  await expect(m.locator('[data-ef="lcBbTt::0::thongNhat"]')).toHaveValue(/^Theo mẫu /);
  await expect(m.locator('[data-ef="lcBbTt::3::noiDung"]')).toHaveValue('Điều kiện thanh toán');
  await expect(m.locator('[data-ef="lcTgThHd"]')).toHaveValue('120 ngày');
  // Người đại diện / chức vụ của nhà thầu đang chọn đọc từ danh mục Nhà cung cấp (T80 L7).
  await expect(m.getByRole('combobox').filter({ hasText: 'NCC-000010' })).toBeVisible();
  const rep = await page.evaluate(() => { const r = Catalog.rows('nha-cung-cap').find((x) => x.code === 'NCC-000010') || {}; return [r.rep, r.position]; });
  expect(rep[0]).toBeTruthy();
  await expect(m).toContainText('Đại diện nhà thầu (danh mục Nhà cung cấp)');
  await expect(m).toContainText(rep[0]);
  await expect(m).toContainText(rep[1]);
  await expect(m).not.toContainText('chưa khai báo người đại diện');
  await put(page, m.locator('[data-ef="lcTgThHd"]'), '100 ngày');
  await put(page, m.locator('[data-ef="lcBbTt::2::yKien"]'), 'Đề nghị giao làm 02 đợt.');
  await put(page, m.locator('[data-ef="lcBbTt::2::thongNhat"]'), 'Giao 02 đợt, đợt cuối trong 100 ngày.');
  await ok(page); await done(page);
  const bb = await page.evaluate((c) => Flow.caseOf(c).ui.lcBbTt.map((r) => [r.noiDung, r.yKien, r.thongNhat]), HS);
  expect(bb[2]).toEqual(['Tiến độ thực hiện', 'Đề nghị giao làm 02 đợt.', 'Giao 02 đợt, đợt cuối trong 100 ngày.']);
  expect(await page.evaluate((c) => [Flow.caseOf(c).ui.lcDaiDienNt, Flow.caseOf(c).ui.lcChucVuNt], HS)).toEqual(rep);

  await run(page, G, 22, true);
  await openTask(page, '22');
  await act(page, 'Đăng tải KQLCNT');
  await expect(m).toContainText('Thư chấp thuận hồ sơ dự thầu và trao hợp đồng');
  await expect(m.locator('[data-ef="lcTgHoanThien"]')).toHaveValue('20');
  await expect(m.locator('[data-ef="lcBaoLanh"]')).toHaveValue('3');
  // Hiệu lực HSDT 120 ngày (mặc định HSMT) kể từ thời điểm đóng thầu 30/11/2026.
  await expect(m).toContainText('Ngày hết hiệu lực HSDT của nhà thầu trúng thầu: 30/03/2027');
  await expect(m.locator('[data-ef="lcDauMoi::0::ten"]')).toHaveValue('Tạ Quỳnh Anh');
  // Đầu mối nhà thầu gợi ý = người đại diện ở biên bản thương thảo; xoá đi thì bộ kiểm tra bắt nhập.
  await expect(m.locator('[data-ef="lcDauMoi::1::ten"]')).toHaveValue(rep[0]);
  await put(page, m.locator('[data-ef="lcDauMoi::1::ten"]'), '');
  await m.locator('[data-ef-chk="lcDangTai"]').check();
  await put(page, m.locator('[data-ef="lcBaoLanh"]'), '12');
  await ok(page);
  expect(await lastToast(page)).toContain('từ 2% đến 10%');
  await put(page, m.locator('[data-ef="lcBaoLanh"]'), '5');
  await ok(page);
  expect(await lastToast(page)).toContain('Đầu mối nhà thầu');
  await put(page, m.locator('[data-ef="lcDauMoi::1::ten"]'), 'Đại diện nhà thầu');
  await put(page, m.locator('[data-ef="lcNgayThu"]'), '01/12/2026');
  await put(page, m.locator('[data-ef="lcTgKyKet"]'), '7');
  await put(page, m.locator('[data-ef="lcNgayBanGiao"]'), '02/12/2026');
  await ok(page); await closed(page);
  // Bước 22 xong → 23, 24 (hệ thống) đóng tổ chức LCNT.
  expect(await page.evaluate((c) => [Flow.caseOf(c).status, Flow.caseOf(c).ui.lcHanKy], HS)).toEqual(['approved', '28/12/2026']);
  await goto(page, '#/goi-thau/' + G);
  await page.locator('.dx-tabs [data-ttab="dg"]').click();
  const thu = card(page, 'Thư chấp thuận HSDT và trao hợp đồng');
  await expect(thu).toContainText('01/12/2026');
  await expect(thu).toContainText('28/12/2026');
  await expect(thu).toContainText('5,0% giá hợp đồng');
  const cg = card(page, 'Thông tin chuyển giao để ký hợp đồng');
  await expect(cg).toContainText('30/03/2027');
  await expect(cg).toContainText('Đại diện nhà thầu');
  await expect(cg).toContainText('Giá trúng thầu phân bổ');
  await expect(cg).not.toContainText('đề nghị nhà thầu gia hạn');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  await page.locator('.dx-tabs [data-ttab="info"]').click();
  const moc = card(page, 'Mốc văn bản');
  await expect(moc.locator('tr', { hasText: 'Thư chấp thuận HSDT và trao hợp đồng' })).toContainText('01/12/2026');
  await expect(moc.locator('tr', { hasText: 'Bàn giao thông tin để ký hợp đồng' })).toContainText('02/12/2026');
  expect(page.errors).toEqual([]);
});

test('GT-2026-0042 (tư vấn): bước 22 không yêu cầu bảo đảm thực hiện hợp đồng; gói không có thời điểm đóng thầu thì ngày hết hiệu lực HSDT chưa xác định', async ({ page }) => {
  const G = 'GT-2026-0042';
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'admin');
  await run(page, G, 22);
  await openTask(page, '22');
  await act(page, 'Đăng tải KQLCNT');
  const m = page.locator('.vmodal');
  await expect(m.locator('[data-ef="lcBaoLanh"]')).toHaveCount(0);
  await expect(m).toContainText('không phải nộp bảo đảm thực hiện hợp đồng');
  await expect(m).toContainText('chưa xác định');
  await put(page, m.locator('[data-ef="lcDauMoi::1::ten"]'), 'Đại diện nhà thầu tư vấn');
  await m.locator('[data-ef-chk="lcDangTai"]').check();
  await ok(page); await closed(page);
  await goto(page, '#/goi-thau/' + G);
  await page.locator('.dx-tabs [data-ttab="dg"]').click();
  await expect(card(page, 'Thư chấp thuận HSDT và trao hợp đồng')).toContainText('Không yêu cầu — gói tư vấn');
  expect(page.errors).toEqual([]);
});
