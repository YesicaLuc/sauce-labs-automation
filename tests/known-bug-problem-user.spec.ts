import { test, expect } from "../src/fixtures/test-fixtures";
import { problemUser } from "../src/utils/test-data";

/**
 * SauceDemo incluye a proposito un usuario ("problem_user") con un bug
 * reproducible: todas las imagenes de producto muestran la misma foto
 * sin importar el producto real.
 */
test.describe("Bug conocido: problem_user", () => {
  test("con problem_user todas las imagenes de producto son iguales (bug)", async ({
    loginPage,
    inventoryPage,
    page,
  }) => {
    await loginPage.open();
    await loginPage.login(problemUser.username, problemUser.password);
    await page.waitForURL(/inventory\.html/);

    const sources = await inventoryPage.imageSources();
    const uniqueSources = new Set(sources);

    // Si este test alguna vez empieza a fallar porque las imagenes
    // vuelven a ser distintas entre si, es buena noticia: significa que
    // Sauce Labs corrigio el bug de demo, no que la suite se rompio.
    expect(uniqueSources.size).toBe(1);
  });

  test("con standard_user las imagenes si son distintas entre si (control)", async ({
    inventoryPage,
    loggedInAsStandardUser,
  }) => {
    void loggedInAsStandardUser;

    const sources = await inventoryPage.imageSources();
    const uniqueSources = new Set(sources);

    expect(uniqueSources.size).toBeGreaterThan(1);
  });
});
