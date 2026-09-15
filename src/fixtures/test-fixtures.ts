import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/login-page";
import { InventoryPage } from "../pages/inventory-page";
import { ItemDetailPage } from "../pages/item-detail-page";
import { CartPage } from "../pages/cart-page";
import { CheckoutStepOnePage } from "../pages/checkout-step-one-page";
import { CheckoutStepTwoPage } from "../pages/checkout-step-two-page";
import { CheckoutCompletePage } from "../pages/checkout-complete-page";
import { standardUser } from "../utils/test-data";

/**
 * Fixtures propias que extienden el test base de Playwright para
 * inyectar los Page Objects ya instanciados. Cada test pide solo lo
 * que necesita; si un page object necesita setup propio mas adelante,
 * se cambia en un solo lugar y no en cada test.
 *
 * "loggedInAsStandardUser" es una fixture de setup: no devuelve nada
 * util por si misma, pero un test que la pide como parametro arranca
 * ya logueado en /inventory.html, sin repetir el login en cada spec
 * que no esta probando el login en si.
 */
type Pages = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  itemDetailPage: ItemDetailPage;
  cartPage: CartPage;
  checkoutStepOnePage: CheckoutStepOnePage;
  checkoutStepTwoPage: CheckoutStepTwoPage;
  checkoutCompletePage: CheckoutCompletePage;
  loggedInAsStandardUser: void;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  loggedInAsStandardUser: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(standardUser.username, standardUser.password);
    await page.waitForURL(/inventory\.html/);
    await use();
  },
  itemDetailPage: async ({ page }, use) => {
    await use(new ItemDetailPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutStepOnePage: async ({ page }, use) => {
    await use(new CheckoutStepOnePage(page));
  },
  checkoutStepTwoPage: async ({ page }, use) => {
    await use(new CheckoutStepTwoPage(page));
  },
  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },
});

export { expect } from "@playwright/test";
