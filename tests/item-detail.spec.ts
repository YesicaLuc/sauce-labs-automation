import { test, expect } from "../src/fixtures/test-fixtures";

test.describe("Detalle de producto", () => {
  test("el detalle muestra el mismo nombre y precio que el listado", async ({
    inventoryPage,
    itemDetailPage,
    loggedInAsStandardUser,
  }) => {
    void loggedInAsStandardUser;

    const nameInList = await inventoryPage.itemNames.nth(0).textContent();
    const priceInList = await inventoryPage.itemPrices.nth(0).textContent();

    await inventoryPage.openItemByIndex(0);

    await expect(itemDetailPage.itemName).toHaveText(nameInList ?? "");
    await expect(itemDetailPage.itemPrice).toHaveText(priceInList ?? "");
  });

  test("agregar al carrito desde el detalle actualiza el contador", async ({
    inventoryPage,
    itemDetailPage,
    loggedInAsStandardUser,
  }) => {
    void loggedInAsStandardUser;

    await inventoryPage.openItemByIndex(0);
    await itemDetailPage.addToCartButton.click();
    await itemDetailPage.goBackToProducts();

    await expect(inventoryPage.cartBadge).toHaveText("1");
  });
});
