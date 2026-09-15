import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base-page";

/**
 * Page Object de /cart.html.
 */
export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);

    this.cartItems = page.locator(".cart_item");
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async itemsCount(): Promise<number> {
    return this.cartItems.count();
  }

  removeButtonByIndex(index: number): Locator {
    return this.cartItems.nth(index).getByRole("button", { name: /remove/i });
  }

  async removeItemByIndex(index: number): Promise<void> {
    await this.removeButtonByIndex(index).click();
  }

  /**
   * Mismo motivo que en InventoryPage: esperar la URL en vez de solo
   * domcontentloaded evita que el siguiente paso del checkout consulte
   * el DOM mientras la SPA todavia esta a mitad de camino de renderizar
   * checkout-step-one.html.
   */
  async startCheckout(): Promise<void> {
    await this.checkoutButton.click();
    await this.page.waitForURL(/checkout-step-one\.html/);
  }
}
