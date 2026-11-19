// T67 dữ liệu demo Thầu – Hợp đồng: mọi KHLCNT, gói thầu, hợp đồng mẫu mở được mọi tab không lỗi, không chữ BA; đủ trạng thái KHL / LC;
// mọi luồng mẫu (KHLCNT, gói) chạy được tới bước của mẫu; quan hệ nguồn – KHLCNT – gói – hợp đồng khớp.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const BA = /SCR-|UC-|task \d|Prototype|minh hoạ|GIẢ LẬP|P-2\d\d|ngoài BPMN/;
const goto = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
async function allTabs(page, hash) {
  await goto(page, hash);
  await expect(page.locator('main h1, main .pg-h, main h2').first()).toBeVisible();
  const keys = await page.locator('.dx-tabs [data-ttab]').evaluateAll((els) => els.map((e) => e.dataset.ttab));
  for (const k of keys) {
    await page.locator(`.dx-tabs [data-ttab="${k}"]`).click();
    expect(await page.locator('main').innerText(), `${hash} tab ${k}`).not.toMatch(BA);
  }
}

test('Quan hệ dữ liệu và độ phủ trạng thái', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  const r = await page.evaluate(() => {
    const ks = Thau.khAll(), gs = Thau.PK;
    return {
      khl: [...new Set(ks.map((k) => k.prog.khl))].sort(),
      // Mỗi gói thuộc đúng KHLCNT có liệt kê nó; mỗi KHLCNT (trừ huỷ) có ít nhất một gói.
      orphan: gs.filter((g) => !(Thau.khOf(g.kh) || { pkgs: [] }).pkgs.includes(g.code)).map((g) => g.code),
      empty: ks.filter((k) => k.st !== 'CANCEL' && !Thau.pkgsOf(k).length).map((k) => k.code),
      // Nguồn đã phê duyệt; KHLCNT đang hiệu lực không trùng nguồn.
      noSrc: ks.filter((k) => !(Thau.srcInfo(k.src[0], k.src[1]) || {}).approved).map((k) => k.code),
      dupSrc: ks.filter((k) => k.st !== 'CANCEL').map((k) => k.src[1]).filter((s, i, a) => a.indexOf(s) !== i),
      // Tổng giá gói = giá trị được duyệt (trừ phần không thuộc KHLCNT).
      diff: ks.filter((k) => k.st !== 'CANCEL' && Thau.totals(k).diff).map((k) => [k.code, Thau.totals(k).diff]),
      forms: [...new Set(gs.map((g) => g.form))].length,
      hdPkg: HopDong.all().filter((h) => h.pkg && !Thau.pkOf(h.pkg)).map((h) => h.code),
      mau: [...new Set(HopDong.all().map((h) => (HopDong.mauHd(h) || {}).tt).filter(Boolean))].sort(),
    };
  });
  expect(r.khl).toEqual(['KHL-01', 'KHL-02', 'KHL-04', 'KHL-05', 'KHL-06', 'KHL-07', 'KHL-08', 'KHL-10', 'KHL-X']); // 17/11: + KHL-02 (0012 đang điều chỉnh), KHL-07 (0010)
  expect(r.orphan).toEqual([]);
  expect(r.empty).toEqual([]);
  expect(r.noSrc).toEqual([]);
  expect(r.dupSrc).toEqual([]);
  expect(r.diff).toEqual([]);
  expect(r.forms).toBe(11);
  expect(r.hdPkg).toEqual([]);
  expect(r.mau).toEqual(['10 / 30 / 60', '10 / 90', '100']);
  expect(page.errors).toEqual([]);
});

test('Mọi KHLCNT, gói thầu, hợp đồng mẫu: mở mọi tab không lỗi', async ({ page }) => {
  test.setTimeout(180000);
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => Flow.setPersona('admin'));
  const codes = await page.evaluate(() => ({ kh: Thau.khAll().map((k) => k.code), pk: Thau.PK.map((g) => g.code), hd: HopDong.all().map((h) => h.code) }));
  for (const c of codes.kh) await allTabs(page, '#/khlcnt/' + encodeURIComponent(c));
  for (const c of codes.pk) await allTabs(page, '#/goi-thau/' + encodeURIComponent(c));
  for (const c of codes.hd) await allTabs(page, '#/hop-dong/' + encodeURIComponent(c));
  for (const h of ['#/khlcnt', '#/goi-thau', '#/hop-dong']) { await goto(page, h); expect(await page.locator('main').innerText()).not.toMatch(BA); }
  expect(page.errors).toEqual([]);
});

test('Mọi luồng mẫu KHLCNT và gói chạy tới bước của mẫu', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => Flow.setPersona('admin'));
  const res = await page.evaluate(() => {
    const out = [];
    Object.entries(Thau.KH_SAMPLE).forEach(([c, s]) => { const k = Thau.khOf(c); const code = Flow.startKh(c, { level: Thau.levelOf(k), name: k.title, target: s.target });
      out.push([c, Flow.caseOf(code).tokens.map((t) => String(t.task)).join(','), Thau.khProg(Thau.khOf(c)).khl]); });
    Object.entries(Thau.PK_SAMPLE).forEach(([c, s]) => { const code = Flow.startLc(c, { name: c, target: s.target });
      out.push([c, Flow.caseOf(code).tokens.map((t) => String(t.task)).join(','), Thau.pkRow(Thau.pkOf(c)).lc]); });
    return out;
  });
  expect(res).toEqual([
    ['KHLCNT-2026-0016', '12', 'KHL-04'], ['KHLCNT-2026-0019', '13', 'KHL-06'], ['KHLCNT-2026-0020', '21', 'KHL-08'],
    // T80 L1 (D-132): chỉ định thầu rút gọn GT-2026-0031 không qua HSYC — mẫu dừng ở 7.5 thư mời thương thảo; GT-2026-0048 mua sắm trực tiếp dừng ở 7.6.
    ['GT-2026-0029', '3.5', 'LC-06'], ['GT-2026-0022', '7.3', 'LC-06'], ['GT-2026-0031', '7.5', 'LC-04'], ['GT-2026-0048', '7.6', 'LC-01'], ['GT-2026-0024', '5', 'LC-01'], ['GT-2026-0026', '14', 'LC-08']]);
  expect(page.errors).toEqual([]);
});
