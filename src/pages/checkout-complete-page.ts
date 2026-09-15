import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base-page";

/**
 * Page Object de /checkout-complete.html: la confirmacion final.
 */
export class CheckoutCompletePage extends BasePage {
  readonly completeHeader: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);

    this.completeHeader = page.locator(".complete-header");
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }
}
