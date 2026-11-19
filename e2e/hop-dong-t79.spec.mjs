// T79 (D-131): phần còn lại so với hệ thống cũ — PAC / FAC, Hóa đơn, Xuất nhập khẩu, Mã tài sản, lọc Phân loại / Nguồn hình thành,
// hợp đồng từ tờ trình / ĐXMS (theo đề xuất DX-17), các trường / cột nhóm 3.
import { test, expect } from '@playwright/test';
import { fresh } from './helpers.mjs';

const goto = (page, hash) => page.evaluate((h) => { location.hash = h; }, hash);
const tab = async (page, code, t) => { await page.evaluate(([c, x]) => { window.HopDong.openTab(c, x); window.App.render(); }, [code, t]); await expect(page.locator('main .vcard').first()).toBeVisible(); };
const pick = async (page, id, opt) => { await page.locator(`[data-vsel="${id}"]`).click(); await page.locator(`.vsel-panel [data-opt="${opt}"]`).click(); };

test('SCR-84: cột Số hợp đồng / Đồng tiền ký; lọc Phân loại gộp thỏa thuận khung, đơn hàng; lọc Nguồn hình thành; lọc ngày PAC', async ({ page }) => {
  await fresh(page, '#/hop-dong');
  const head = page.locator('main thead');
  await expect(head).toContainText('Số hợp đồng');
  await expect(head).toContainText('Đồng tiền ký');
  await expect(page.locator('main tbody')).toContainText('012/2026/HĐMB-VHT');
  await expect(page.locator('main tbody')).not.toContainText('TTK-2026-0003');
  await page.locator('[data-tl="hdl:adv"]').click();
  await expect(page.locator('main form.adv')).toContainText('Ngày ký PAC');
  await expect(page.locator('main form.adv')).toContainText('Ngày ký FAC / nghiệm thu');
  await pick(page, 'tf-hdl-kind', 'TTK');
  await page.locator('main form.adv button[type="submit"]').click();
  await expect(page.locator('main tbody')).toContainText('TTK-2026-0003');
  await expect(page.locator('main tbody')).not.toContainText('HĐ-2026-0012');
  await page.locator('main tbody a.link', { hasText: 'TTK-2026-0003' }).click();
  await expect(page).toHaveURL(/#\/thoa-thuan-khung\/TTK-2026-0003/);
  expect(page.errors).toEqual([]);
});

test('SCR-86: PAC / FAC, người phụ trách, Loại chi phí, ID / Mô tả, Hóa đơn, XNK, Mã tài sản, Tài liệu', async ({ page }) => {
  await fresh(page, '#/hop-dong');
  const code = 'HĐ-2026-0012';
  await tab(page, code, 'info');
  const m = page.locator('main');
  for (const t of ['Người chuyển tiền', 'Đầu mối dự án, đơn vị', 'Đầu mối KCS', 'Mức nghiệm thu áp dụng', 'PAC / TAM → FAC / TAC', 'File CTKT', 'Loại chi phí', 'Chi phí nghiên cứu KHCN']) await expect(m).toContainText(t);
  await tab(page, code, 'hm');
  await expect(m.locator('thead').first()).toContainText('ID hàng hóa');
  await expect(m.locator('thead').first()).toContainText('Mô tả');
  await expect(m).toContainText('64 cổng 400G QSFP-DD');
  await tab(page, code, 'td');
  for (const t of ['HOC — Biên bản bàn giao', 'PAC — Biên bản kiểm tra kỹ thuật sơ bộ', 'FAC — Biên bản nghiệm thu kỹ thuật cuối cùng', 'Thời hạn theo hợp đồng', '15 ngày kể từ HOC']) await expect(m).toContainText(t);
  await tab(page, code, 'bg');
  for (const t of ['Loại nghiệm thu', 'PAC / TAM', 'Mã tài sản (SAP)', 'Chưa ghi tăng', 'Xuất nhập khẩu', 'Số tờ khai hải quan', 'Tỉ giá của tờ khai hải quan']) await expect(m).toContainText(t);
  // Lọc Hàng hóa đã nhận theo từ khóa
  await m.locator('[data-hd-rf-kw]').fill('Spirent-khong-co');
  await m.locator('[data-hd-rf-kw]').press('Enter');
  await m.locator('[data-hd-rf-kw]').blur();
  await expect(m).not.toContainText('N9KC93642601001');
  await tab(page, code, 'pay');
  await expect(m.locator('.vcard', { hasText: 'Phòng Hợp đồng cung cấp ở bước 5' })).toContainText('HĐGTGT-2026-0109B');
  await tab(page, code, 'doc');
  for (const t of ['Ngày sao CC/CT', 'Ghi chú', 'Chứng nhận xuất xứ (CO)', 'Bản sao chứng thực', 'Xuất Excel']) await expect(m).toContainText(t);
  // Hợp đồng dịch vụ: nghiệm thu dịch vụ, không XNK, không PAC
  await tab(page, 'HĐ-2025-0152', 'td');
  await expect(m).toContainText('Biên bản nghiệm thu dịch vụ');
  await tab(page, 'HĐ-2025-0152', 'bg');
  await expect(m).not.toContainText('Số tờ khai hải quan');
  expect(page.errors).toEqual([]);
});

test('SCR-85: tạo hợp đồng từ tờ trình / ĐXMS đã phê duyệt (theo đề xuất DX-17) — kiểm lỗi, phân bổ, chi tiết, lọc Nguồn hình thành', async ({ page }) => {
  await fresh(page, '#/hop-dong/create');
  await goto(page, '#/hop-dong/create');
  await expect(page.locator('main')).toContainText('Người chuyển tiền');
  await pick(page, 'hd-srck', 'TTR');
  await expect(page.locator('main')).toContainText('Tờ trình / ĐXMS đã phê duyệt');
  await page.locator('#hd-save').click();
  await expect(page.locator('main')).toContainText('Bạn cần chọn Tờ trình / ĐXMS đã phê duyệt.');
  await expect(page.locator('main')).toContainText('Bạn cần chọn Khoản mục chi phí.');
  // Nguồn: ĐXMS đã phê duyệt có phần công việc không áp dụng LCNT trong KHLCNT (Điều 23 khoản 2 điểm e).
  await page.locator('[data-vsel="hd-dx"]').click();
  const opt = page.locator('.vsel-panel [data-opt]').first();
  const dx = await opt.getAttribute('data-opt');
  expect(dx).toMatch(/^ĐXMS-/);
  await opt.click();
  await expect(page.locator('main input[title*="phần không áp dụng LCNT"]')).toHaveCount(1);
  await pick(page, 'hd-km', 'Chi phí thiết bị');
  await page.keyboard.press('Escape');
  await page.locator('[data-vsel="hd-ncc"]').click();
  await page.locator('.vsel-panel [data-opt]').first().click();
  await pick(page, 'hd-type', 'TRON_GOI');
  await page.locator('#hd-val').fill('999999');
  await page.locator('#hd-save').click();
  await expect(page.locator('main')).toContainText('vượt giá trị được phép');
  await page.locator('#hd-val').fill('0.5');
  await expect(page.locator('main')).toContainText('Phân bổ nguồn vốn / đề tài, dự án (theo ĐXMS và khoản mục đã chọn)');
  await page.locator('#hd-save').click();
  await expect(page).toHaveURL(/#\/hop-dong\/H%C4%90-2026-/);
  await expect(page.locator('main')).toContainText('Từ tờ trình / ĐXMS đã phê duyệt (theo đề xuất)');
  await expect(page.locator('main')).toContainText(dx);
  await expect(page.locator('main')).toContainText('Không qua LCNT');
  await goto(page, '#/hop-dong');
  await page.locator('[data-tl="hdl:adv"]').click();
  await pick(page, 'tf-hdl-srcK', 'TTR');
  await page.locator('main form.adv button[type="submit"]').click();
  await expect(page.locator('main tbody tr')).toHaveCount(1);
  expect(page.errors).toEqual([]);
});
