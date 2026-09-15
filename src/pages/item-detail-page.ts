import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base-page";

/**
 * Page Object de /inventory-item.html?id={id}: el detalle de un producto.
 */
export class ItemDetailPage extends BasePage {
  readonly itemName: Locator;
  readonly itemDescription: Locator;
  readonly itemPrice: Locator;
  readonly addToCartButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    super(page);

    this.itemName = page.locator(".inventory_details_name");
    this.itemDescription = page.locator(".inventory_details_desc");
    this.itemPrice = page.locator(".inventory_details_price");
    // Un locator por rol/texto como getByRole("button", { name:
    // /add to cart/i }) matchea CUALQUIER boton "Add to cart" visible en la
    // pagina. Si por una carrera de timing todavia estamos en /inventory.html
    // (que tiene 6), Playwright tira "strict mode violation" en vez de
    // fallar de forma obvia.
    this.addToCartButton = page.locator('[data-test^="add-to-cart-"]');
    this.backButton = page.locator('[data-test="back-to-products"]');
  }

  async goBackToProducts(): Promise<void> {
    await this.backButton.click();
    await this.page.waitForURL(/inventory\.html/);
  }
}
