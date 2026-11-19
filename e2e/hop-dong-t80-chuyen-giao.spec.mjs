// T80 L3 (phần hợp đồng): tạo hợp đồng từ gói đã qua MS19 bước 22 sao chép thông tin chuyển giao để ký hợp đồng (thư chấp thuận HSDT và trao hợp đồng,
// đầu mối, thời gian giao hàng, điều kiện thanh toán, người đại diện nhà thầu — GIẢ LẬP P-THAU-04); MS22 bước 4 gợi ý người đại diện / chức vụ nhà thầu.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const BA = /SCR-|UC-|task \d|Prototype|minh hoạ|GIẢ LẬP|P-2\d\d|P-THAU|DX-\d/;
const as = (page, id) => page.evaluate((x) => Flow.setPersona(x), id);
const goto = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const card = (page, title) => page.locator('main section.vcard', { has: page.locator('h3', { hasText: title }) });
const put = async (page, loc, v) => { await loc.fill(v); await loc.evaluate((e) => e.blur()); await page.evaluate(() => new Promise((r) => setTimeout(r, 20))); };

test('GT-2026-0045: bước 22 xong → Tạo hợp đồng sao chép thông tin chuyển giao; Chi tiết hợp đồng hiện người đại diện bên bán', async ({ page }) => {
  const G = 'GT-2026-0045';
  await fresh(page, '#/viec-cua-toi');
  await as(page, 'admin');
  // Gói mẫu chưa chạy MS19: không có thẻ chuyển giao (không bịa dữ liệu).
  await goto(page, '#/hop-dong/create/GT-2026-0040');
  await expect(page.locator('main')).toContainText('Người chuyển tiền');
  await expect(card(page, 'Thông tin chuyển giao để ký hợp đồng')).toHaveCount(0);

  await page.evaluate((c) => Flow.startLc(c, { name: c, target: 22 }), G);
  const id = await page.evaluate(() => { for (const p of D.personas) { const t = Flow.caseTokens(p.id).find((x) => String(x.task) === '22'); if (t) { Flow.setPersona(p.id); return t.id; } } return null; });
  expect(id).toBeTruthy();
  await goto(page, '#/task/' + id);
  await page.locator('.task-acts [data-act]', { hasText: 'Đăng tải KQLCNT' }).click();
  const m = page.locator('.vmodal');
  await put(page, m.locator('[data-ef="lcDauMoi::1::ten"]'), 'Lê Văn Đầu Mối');
  await put(page, m.locator('[data-ef="lcTgGiaoHang"]'), '90 ngày kể từ ngày hợp đồng có hiệu lực');
  await m.locator('[data-ef-chk="lcDangTai"]').check();
  await m.locator('#ok').click();
  await expect(m).toHaveCount(0);
  const [win, rep, dvsd] = await page.evaluate((c) => { const g = Thau.pkOf(c), r = Catalog.rows('nha-cung-cap').find((x) => x.code === g.winner) || {};
    return [g.winner, [r.rep, r.position], (D.personas.find((p) => p.id === 'dvsd') || {}).name]; }, G);
  expect(win).toBeTruthy();

  await as(page, 'admin');
  await goto(page, '#/hop-dong/create/' + G);
  const cg = card(page, 'Thông tin chuyển giao để ký hợp đồng');
  await expect(cg).toBeVisible();
  for (const t of ['Ngày thư chấp thuận HSDT và trao hợp đồng', 'Ký hợp đồng trước ngày', '3,0% giá hợp đồng', '90 ngày kể từ ngày hợp đồng có hiệu lực', 'Lê Văn Đầu Mối', rep[0], rep[1]]) await expect(cg).toContainText(t);
  // Đầu mối dự án, đơn vị gợi ý theo đầu mối đơn vị sử dụng của thư trao.
  await expect(page.locator('[data-vsel="hd-focal"]')).toContainText(dvsd);
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  await page.locator('#hd-save').click();
  await expect(page).toHaveURL(/#\/hop-dong\/H%C4%90-|#\/hop-dong\/HĐ-/);
  const h = await page.evaluate((c) => HopDong.byPkg(c), G);
  expect(h.exec).toBe('90 ngày kể từ ngày hợp đồng có hiệu lực');
  expect(h.trao.rep).toBe(rep[0]);
  await page.evaluate(([c]) => { HopDong.openTab(c, 'dt'); App.render(); }, [h.code]);
  await expect(page.locator('main')).toContainText('Người đại diện bên bán');
  await expect(page.locator('main')).toContainText(rep[0]);
  await expect(card(page, 'Thông tin chuyển giao để ký hợp đồng')).toContainText('Lê Văn Đầu Mối');
  expect(await page.locator('main').innerText()).not.toMatch(BA);
  expect(page.errors).toEqual([]);
});

test('MS22 bước 4 (HĐ-2026-0052): người đại diện / chức vụ nhà thầu gợi ý từ danh mục Nhà cung cấp', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => Flow.jumpToScene('H3', 'MS22'));
  const id = await page.evaluate(() => Flow.caseTokens('phd').find((t) => String(t.task) === '4').id);
  const rep = await page.evaluate(() => { const h = HopDong.find('HĐ-2026-0052'), r = Catalog.rows('nha-cung-cap').find((x) => x.code === h.ncc) || {}; return [r.rep, r.position]; });
  expect(rep[0]).toBeTruthy();
  await goto(page, '#/task/' + id);
  await page.locator('.task-acts [data-act]').first().click();
  const m = page.locator('.vmodal');
  await expect(m.locator('[data-ef="hdDaiDien"]')).toHaveValue(rep[0]);
  await expect(m.locator('[data-ef="hdChucVu"]')).toHaveValue(rep[1]);
  expect(page.errors).toEqual([]);
});
