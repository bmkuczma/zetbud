// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Formularz kontaktowy (E2E)', () => {
  test('wysłanie — widoczny komunikat sukcesu lub ostrzeżenia, bez wiszącego przycisku', async ({ page }) => {
    await page.goto('/index.html#kontakt');

    await page.locator('#name').fill('Test automatyczny ZetBud');
    await page.locator('#phone-national').fill('601234567');
    await page.locator('#email').fill('e2e-zetbud@example.invalid');
    await page.locator('#topic').selectOption('t1');
    await page
      .locator('#message')
      .fill(
        'Wiadomość testowa automatycznego formularza — minimum dziesięć znaków wymaganych przez serwer.'
      );

    const hp = page.locator('#zetbud_hp');
    if ((await hp.count()) > 0) {
      await expect(hp).toHaveValue('');
    }

    await page.locator('#form-submit').click();

    const fb = page.locator('#form-feedback');
    await expect(fb).toBeVisible({ timeout: 25_000 });

    const cls = (await fb.getAttribute('class')) || '';
    expect(cls).toMatch(/form-alert--(ok|warn)/);

    const busy = await page.locator('#form-submit').getAttribute('aria-busy');
    expect(busy).not.toBe('true');

    const ok = await fb.evaluate((el) => el.classList.contains('form-alert--ok'));
    if (!ok) {
      const t = (await fb.textContent()) || '';
      expect(t.length).toBeGreaterThan(20);
    }
  });
});
