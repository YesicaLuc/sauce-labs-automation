import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base-page";

/**
 * Page Object de /checkout-step-two.html: el resumen de la orden.
 */
export class CheckoutStepTwoPage extends BasePage {
  readonly summaryItems: Locator;
  readonly itemTotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    super(page);

    this.summaryItems = page.locator(".cart_item");
    this.itemTotalLabel = page.locator(".summary_subtotal_label");
    this.taxLabel = page.locator(".summary_tax_label");
    this.totalLabel = page.locator(".summary_total_label");
    this.finishButton = page.locator('[data-test="finish"]');
  }

  private parseAmount(text: string): number {
    const match = text.match(/[\d.]+/);
    return match ? Number(match[0]) : NaN;
  }

  async itemTotal(): Promise<number> {
    return this.parseAmount(await this.itemTotalLabel.textContent().then((t) => t ?? ""));
  }

  async tax(): Promise<number> {
    return this.parseAmount(await this.taxLabel.textContent().then((t) => t ?? ""));
  }

  async total(): Promise<number> {
    return this.parseAmount(await this.totalLabel.textContent().then((t) => t ?? ""));
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
    await this.page.waitForURL(/checkout-complete\.html/);
  }
}
