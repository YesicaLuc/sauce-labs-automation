import { test, expect } from "../src/fixtures/test-fixtures";
import { standardUser, lockedOutUser } from "../src/utils/test-data";

test.describe("Login", () => {
  test("un usuario valido entra al catalogo de productos", async ({ loginPage, page }) => {
    await loginPage.open();
    await loginPage.login(standardUser.username, standardUser.password);

    await expect(page).toHaveURL(/inventory\.html/);
  });

  test("una password incorrecta muestra un error", async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(standardUser.username, "password-incorrecta");

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(/username and password do not match/i);
  });

  test("un usuario bloqueado no puede entrar", async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(lockedOutUser.username, lockedOutUser.password);

    await expect(loginPage.errorMessage).toContainText(/locked out/i);
  });

  test("dejar los campos vacios pide usuario", async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.loginButton.click();

    await expect(loginPage.errorMessage).toContainText(/username is required/i);
  });
});
