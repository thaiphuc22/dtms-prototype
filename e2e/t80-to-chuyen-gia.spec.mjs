// T80 L6: Tổ chuyên gia / Tổ thẩm định — vị trí trong Tổ, phân công công việc, chứng chỉ đào tạo về đấu thầu (QC-12869 Điều 2 khoản 27, 28):
// tab Thành phần tham gia SCR-82, bảng ở eForm MS19 bước 1, Tổ thẩm định KHLCNT (MS18 bước 6) chặn thành viên chưa có chứng chỉ.
import { test, expect } from '@playwright/test';
import { fresh, lastToast } from './helpers.mjs';

const BA = /SCR-|UC-|task \d|Prototype|minh hoạ|GIẢ LẬP|P-2\d\d|P-THAU|DX-2\d/;
const as = (page, id) => page.evaluate((x) => Flow.setPersona(x), id);
const goto = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const card = (page, title) => page.locator('main section.vcard', { has: page.locator('h3', { hasText: title }) });
const act = (page, label) => page.locator('.task-acts [data-act]', { hasText: label }).click();
const ok = (page) => page.locator('.vmodal #ok').click();
const done = (page) => expect(page).toHaveURL(/#\/viec-cua-toi$/);
async function openTask(page, n) {
  const [who, id] = await page.evaluate((k) => { for (const p of D.personas) { const t = Flow.caseTokens(p.id).find((x) => String(x.task) === String(k)); if (t) return [p.id, t.id]; } return []; }, n);
  expect(id, `việc bước ${n}`).toBeTruthy();
  await as(page, who);
  await goto(page, '#/task/' + id);
  await expect(page.locator('.task-acts [data-act]').first()).toBeVisible();
}

test('SCR-82 tab Thành phần tham gia: vị trí, phân công, chứng chỉ; chuyên gia chuyên ngành không yêu cầu', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'admin');
  await goto(page, '#/goi-thau/GT-2026-0021');
  await page.locator('.dx-tabs [data-ttab="tp"]').click();
  const c = card(page, 'Tổ chuyên gia và Tổ thẩm định');
  await expect(c).toContainText('Tổ phó phụ trách kỹ thuật');
  await expect(c).toContainText('Phụ trách chung');
  await expect(c).toContainText('Không yêu cầu — chuyên gia chuyên ngành');
  await expect(c).toContainText('CC-ĐT-');
  await expect(c.locator('tbody tr')).toHaveCount(6);
  await expect(card(page, 'Kiểm tra thành phần')).toContainText('Đủ');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('MS19 bước 1 hiện Tổ chuyên gia kèm chứng chỉ; thiếu chứng chỉ thì không khởi tạo được', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'admin');
  await page.evaluate(() => Flow.startLc('GT-2026-0050', { name: 'x', target: 1 }));
  await openTask(page, 1);
  await act(page, 'Khởi tạo tổ chức LCNT');
  const m = page.locator('.vmodal');
  await expect(m).toContainText('Tổ chuyên gia và Tổ thẩm định');
  await expect(m).toContainText('Không yêu cầu — chuyên gia chuyên ngành');
  // Bỏ chứng chỉ của Tổ trưởng (giả lập dữ liệu nhân sự thay đổi) → bộ xử lý hành động chặn.
  const lead = await page.evaluate(() => { const r = Thau.lcTeam(Thau.pkOf('GT-2026-0050'))[0]; delete D.lcCert[r.ten]; return r.ten; });
  await page.locator('[data-ef-chk="lcDaKiemTra"]').check();
  await ok(page);
  expect(await lastToast(page)).toContain('chưa có chứng chỉ đào tạo về đấu thầu: ' + lead);
  expect(page.errors).toEqual([]);
});

test('MS18 bước 6: thành viên Tổ thẩm định chưa có chứng chỉ bị chặn (Điều 2 khoản 28)', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'admin');
  await page.evaluate(() => { const k = Thau.khOf('KHLCNT-2026-0016'); Flow.startKh(k.code, { level: Thau.levelOf(k), name: k.title, target: 6 }); });
  await openTask(page, 6);
  await act(page, 'Gửi Tổ thẩm định xác nhận');
  const m = page.locator('.vmodal');
  await expect(m).toContainText('Phải có chứng chỉ đào tạo về đấu thầu');
  await page.locator('[data-vsel="ef-khTtd::1::nguoi"]').click();
  await page.locator('.vsel-panel [data-opt="dvsd"]').click();
  await ok(page);
  expect(await lastToast(page)).toContain('chưa có chứng chỉ đào tạo về đấu thầu: Tạ Quỳnh Anh');
  await page.locator('[data-vsel="ef-khTtd::1::nguoi"]').click();
  await page.locator('.vsel-panel [data-opt="tckt"]').click();
  await ok(page); await done(page);
  await goto(page, '#/khlcnt/KHLCNT-2026-0016');
  await page.locator('.dx-tabs [data-ttab]', { hasText: 'TTr KHLCNT' }).click();
  await expect(card(page, 'Thành viên Tổ thẩm định')).toContainText('CC-ĐT-2025-0188');
  expect(page.errors).toEqual([]);
});
