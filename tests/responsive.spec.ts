import { test, expect } from "../src/fixtures/test-fixtures";

/**
 * Este spec corre en los tres proyectos definidos en playwright.config.ts
 * (desktop-chrome, mobile-chrome, mobile-safari) porque no tiene un
 * test.use() propio que lo pegue a un solo viewport.
 */
test.describe("Layout responsive", () => {
  test("el login y la navegacion al catalogo funcionan en cualquier tamano de pantalla", async ({
    loginPage,
    page,
  }) => {
    await loginPage.open();

    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();

    await loginPage.login("standard_user", "secret_sauce");

    await expect(page).toHaveURL(/inventory\.html/);
  });

  test("el viewport corresponde al dispositivo del proyecto", async ({ page }) => {
    const viewport = page.viewportSize();
    expect(viewport).not.toBeNull();

    const projectName = test.info().project.name;

    if (projectName === "desktop-chrome") {
      expect(viewport!.width).toBeGreaterThan(1000);
    } else {
      // Los presets mobile de Playwright (Pixel 5, iPhone 13) son angostos
      expect(viewport!.width).toBeLessThan(500);
    }
  });
});
