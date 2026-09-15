import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base-page";

/**
 * Page Object de /inventory.html: el catalogo de productos.
 */
export class InventoryPage extends BasePage {
  readonly pageTitle: Locator;
  readonly inventoryItems: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly sortDropdown: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly burgerMenuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.locator(".title");
    this.inventoryItems = page.locator(".inventory_item");
    this.itemNames = page.locator(".inventory_item_name");
    this.itemPrices = page.locator(".inventory_item_price");
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartLink = page.locator(".shopping_cart_link");
    this.cartBadge = page.locator(".shopping_cart_badge");
    this.burgerMenuButton = page.locator("#react-burger-menu-btn");
    this.logoutLink = page.locator("#logout_sidebar_link");
  }

  async itemsCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  async sortBy(option: "az" | "za" | "lohi" | "hilo"): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async priceValues(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((text) => Number(text.replace("$", "")));
  }

  async imageSources(): Promise<string[]> {
    const images = this.page.locator(".inventory_item_img img");
    return images.evaluateAll((imgs) => imgs.map((img) => img.getAttribute("src") ?? ""));
  }

  addToCartButtonByIndex(index: number): Locator {
    return this.inventoryItems.nth(index).getByRole("button", { name: /add to cart/i });
  }

  async addToCartByIndex(index: number): Promise<void> {
    await this.addToCartButtonByIndex(index).click();
  }

  async openItemByIndex(index: number): Promise<void> {
    await this.itemNames.nth(index).click();
    await this.page.waitForURL(/inventory-item\.html/);
    await expect(this.inventoryItems).toHaveCount(0);
  }

  async cartCount(): Promise<number> {
    const visible = await this.cartBadge.isVisible().catch(() => false);
    if (!visible) return 0;
    return Number(await this.cartBadge.textContent());
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
    await this.page.waitForURL(/cart\.html/);
  }

  async logout(): Promise<void> {
    await this.burgerMenuButton.click();
    await this.logoutLink.click();
  }
}
