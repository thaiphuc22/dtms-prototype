// T33 B2 — tour hướng dẫn (js/tour.js, plan docs/dtms/T33-goi-prototype-khach-ke-hoach.md §3.3).
// Mỗi tour chạy hết bằng Tiếp (bước chờ thao tác thì Tiếp tự Làm hộ); mọi bước tìm thấy phần tử cần chỉ; bật / tắt giữ sau khi tải lại;
// ?capture=1 không hiện tour; ?tour=n mở thẳng; hồ sơ đang chạy dở thì hỏi xác nhận.
// T83: tour chia tab (Đề xuất mua sắm, Khoản đầu tư, Thầu, Hợp đồng); mã tour <tab>-<n>, số 1..7 cũ = dxms-1..7.
import { test, expect } from '@playwright/test';
import { fresh, open, INDEX } from './helpers.mjs';

const pop = (page) => page.locator('.tour-pop');

const IDS = ['dxms-1', 'dxms-2', 'dxms-3', 'dxms-4', 'dxms-5', 'dxms-6', 'dxms-7', 'dxms-8', 'dxms-9', 'dxms-10', 'kdt-1', 'kdt-2', 'kdt-3', 'kdt-4',
  'thau-1', 'thau-2', 'thau-3', 'thau-4', 'thau-5', 'hd-1', 'hd-2', 'hd-3', 'hd-4', 'hd-5', 'hd-6'];
const BA = /SCR-|UC-|task \d|Prototype|minh hoạ|GIẢ LẬP|P-\d{2,3}\b|DX-\d/;
for (const id of IDS) {
  const [tab, n] = id.split('-');
  test(`Tour ${id}: chạy hết các bước, bước nào cũng thấy phần tử cần chỉ`, async ({ page }) => {
    await fresh(page, '#/viec-cua-toi');
    await page.locator('#tour-btn').click();
    await page.locator(`.overlay.tour-menu [data-tour-tab="${tab}"]`).click();
    await page.locator(`[data-tour-start="${id}"]`).click();
    const total = await page.evaluate(() => Tour.state().total);
    expect(total).toBeGreaterThanOrEqual(3);
    for (let i = 1; i <= total; i++) {
      await expect.poll(() => page.evaluate(() => (Tour.state() || {}).step)).toBe(i);
      await expect(pop(page)).toBeVisible();
      await expect(pop(page).locator('.tp-c')).toHaveText(`${i} / ${total}`);
      // Phần tử phải có thật: không hiện cảnh báo "màn đã thay đổi", vòng sáng hiện.
      await expect(pop(page).locator('.tp-miss'), `tour ${id} bước ${i}`).toHaveCount(0);
      await expect(page.locator('.tour-ring')).toBeVisible();
      expect(await pop(page).innerText(), `tour ${id} bước ${i}`).not.toMatch(BA);
      await pop(page).locator('[data-tour="next"]').click();
    }
    await expect(page.locator('.overlay.tour-done')).toBeVisible();
    await expect(page.locator('.overlay.tour-done')).toContainText(`Xong tour ${n}`);
    expect(await page.evaluate(() => Tour.state())).toBeNull();
    expect(page.errors).toEqual([]);
  });
}

test('Tour 1: bước chờ thao tác tự sang khi người xem tự bấm; Quay lại dựng lại màn', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => Tour.start(1));
  await expect.poll(() => page.evaluate(() => Tour.state().step)).toBe(1);
  await expect(page).toHaveURL(/#\/luong$/);
  await pop(page).locator('[data-tour="next"]').click();
  await expect(pop(page).locator('[data-tour="do"]')).toBeVisible();
  // Người xem tự bấm Thêm mới → tour tự sang bước 3.
  await page.locator('[data-go="luong/create"]').click();
  await expect.poll(() => page.evaluate(() => Tour.state().step)).toBe(3);
  await expect(page).toHaveURL(/#\/luong\/create$/);
  await pop(page).locator('[data-tour="prev"]').click();
  await expect.poll(() => page.evaluate(() => Tour.state().step)).toBe(2);
  await pop(page).locator('[data-tour="stop"]').click();
  await expect(page.locator('.tour-layer')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('Nút Hướng dẫn luôn hiện; bỏ chọn "Tự hiện" không làm mất nút, giữ sau khi tải lại; chọn lại ở Công cụ demo', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await expect(page.locator('#tour-btn')).toBeVisible();
  await page.locator('#tour-btn').click();
  // T83: tab Đề xuất mua sắm (10 tour) mặc định; đổi tab Khoản đầu tư (4 tour), mở lại vẫn ở tab đã chọn.
  await expect(page.locator('.overlay.tour-menu [data-tour-tab]')).toHaveText(['Đề xuất mua sắm', 'Khoản đầu tư', 'Thầu', 'Hợp đồng']);
  await expect(page.locator('.tour-list button')).toHaveCount(10);
  await page.locator('.overlay.tour-menu [data-tour-tab="kdt"]').click();
  await expect(page.locator('.tour-list button')).toHaveCount(4);
  await expect(page.locator('.overlay.tour-menu [data-tour-tab="kdt"]')).toHaveClass(/\bon\b/);
  await page.locator('.overlay.tour-menu [data-close]').click();
  await page.locator('#tour-btn').click();
  await expect(page.locator('.tour-list button')).toHaveCount(4);
  await page.locator('.overlay.tour-menu [data-tour-tab="dxms"]').click();
  const auto = page.locator('.overlay.tour-menu [data-tour-auto]');
  await expect(auto).toBeChecked();
  await auto.uncheck();
  await page.locator('.overlay.tour-menu [data-close]').click();
  await expect(page.locator('#tour-btn')).toBeVisible();
  await page.reload();
  await expect(page.locator('#app')).not.toBeEmpty();
  await expect(page.locator('#tour-btn')).toBeVisible();
  expect(await page.evaluate(() => Tour.enabled())).toBe(false);
  await page.locator('#demo').click();
  await page.locator('.demo-panel [data-tour-auto]').check();
  expect(await page.evaluate(() => Tour.enabled())).toBe(true);
  await page.locator('.demo-panel [data-tour-menu]').click();
  await expect(page.locator('.overlay.tour-menu')).toBeVisible();
  expect(page.errors).toEqual([]);
});

test('?capture=1 không hiện nút, không hiện lớp tour; ?tour=3 mở thẳng tour 3', async ({ page }) => {
  await open(page, '#/viec-cua-toi');
  await page.evaluate(() => localStorage.clear());
  await page.goto(INDEX.replace(/index\.html$/, 'index.html?capture=1') + '#/viec-cua-toi');
  await expect(page.locator('#app')).not.toBeEmpty();
  await expect(page.locator('#tour-btn')).toBeHidden();
  await page.evaluate(() => Tour.start(4, { force: true }));
  await expect(page.locator('.tour-pop')).toBeHidden();
  await page.goto('about:blank');
  await page.goto(INDEX.replace(/index\.html$/, 'index.html?tour=3') + '#/viec-cua-toi');
  // Hồ sơ đã chạy dở (tour 4 ở trên) → hỏi xác nhận trước.
  await page.locator('.overlay.tour-confirm #tour-go').click();
  await expect.poll(() => page.evaluate(() => (Tour.state() || {}).tour)).toBe(3);
  await expect(pop(page)).toContainText('Bước 8 — Khởi tạo YCBG');
  expect(page.errors).toEqual([]);
});

test('Hồ sơ đang chạy dở: hỏi xác nhận trước khi tour thay hồ sơ; Huỷ giữ nguyên', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => Flow.jumpTo(10, 'minh'));
  await page.locator('#tour-btn').click();
  await page.locator('[data-tour-start="dxms-1"]').click();
  const dlg = page.locator('.overlay.tour-confirm');
  await expect(dlg).toContainText('sẽ được thay');
  await dlg.locator('[data-close]').click();
  expect(await page.evaluate(() => [Tour.state(), Flow.state.tokens.map((t) => t.task)])).toEqual([null, [10]]);
  await page.evaluate(() => Tour.start(2));
  await page.locator('.overlay.tour-confirm #tour-go').click();
  await expect.poll(() => page.evaluate(() => (Tour.state() || {}).tour)).toBe(2);
  expect(page.errors).toEqual([]);
});

test('Bản gửi khách (proto-build là ngày): mỗi lần mở hiện danh sách tour; bỏ chọn Tự hiện thì lần sau không hiện', async ({ page }) => {
  await fresh(page, '#/viec-cua-toi');
  await page.evaluate(() => { document.querySelector('meta[name="proto-build"]').content = '2026-11-06'; localStorage.removeItem('dtms-tour'); Tour.menu(); Tour.menu(); });
  // Mở hai lần không chồng hai danh sách.
  await expect(page.locator('.overlay.tour-menu')).toHaveCount(1);
  await page.locator('.overlay.tour-menu [data-close]').click();
  await page.evaluate(() => Tour._reboot());
  await expect(page.locator('.overlay.tour-menu')).toBeVisible();
  await page.locator('.overlay.tour-menu [data-tour-auto]').uncheck();
  await page.locator('.overlay.tour-menu [data-close]').click();
  await page.evaluate(() => Tour._reboot());
  await page.waitForTimeout(400);
  await expect(page.locator('.overlay.tour-menu')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});

test('T83: ?tour=kdt-2 mở thẳng tour mới theo mã; tour cuối của tab không gợi ý tour tab khác', async ({ page }) => {
  await open(page, '#/viec-cua-toi');
  await page.evaluate(() => localStorage.clear());
  await page.goto(INDEX.replace(/index\.html$/, 'index.html?tour=kdt-2') + '#/viec-cua-toi');
  await expect.poll(() => page.evaluate(() => (Tour.state() || {}).id)).toBe('kdt-2');
  await expect(pop(page)).toContainText('Chủ trương đầu tư BM-01');
  await page.evaluate(() => Tour.start('kdt-4', { force: true }));
  const total = await page.evaluate(() => Tour.state().total);
  for (let i = 0; i < total; i++) await pop(page).locator('[data-tour="next"]').click();
  await expect(page.locator('.overlay.tour-done')).toContainText('Đã xem hết tour của mục Khoản đầu tư');
  await expect(page.locator('.overlay.tour-done #tour-next')).toHaveCount(0);
  expect(page.errors).toEqual([]);
});
