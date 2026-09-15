import { test, expect } from "../src/fixtures/test-fixtures";

test.describe("Catalogo de productos", () => {
  test("el catalogo muestra los 6 productos", async ({ inventoryPage, loggedInAsStandardUser }) => {
    void loggedInAsStandardUser;
    // expect(locator).toHaveCount() reintenta hasta que matchea o hace
    // timeout. Un expect(await inventoryPage.itemsCount()).toBe(6) lee el
    // DOM una sola vez en el instante en que se llama, sin reintentar - si
    // React todavia no termino de pintar la lista en ese instante, da 0 y
    // el test explota aunque el catalogo cargue bien dos milisegundos
    // despues.
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test("ordenar por precio de menor a mayor deja los precios ascendentes", async ({
    inventoryPage,
    loggedInAsStandardUser,
  }) => {
    void loggedInAsStandardUser;
    await inventoryPage.sortBy("lohi");

    const prices = await inventoryPage.priceValues();
    const sorted = [...prices].sort((a, b) => a - b);

    expect(prices).toEqual(sorted);
  });

  test("ordenar por precio de mayor a menor deja los precios descendentes", async ({
    inventoryPage,
    loggedInAsStandardUser,
  }) => {
    void loggedInAsStandardUser;
    await inventoryPage.sortBy("hilo");

    const prices = await inventoryPage.priceValues();
    const sorted = [...prices].sort((a, b) => b - a);

    expect(prices).toEqual(sorted);
  });

  test("agregar un producto actualiza el contador del carrito", async ({
    inventoryPage,
    loggedInAsStandardUser,
  }) => {
    void loggedInAsStandardUser;
    // El badge del carrito ni siquiera se renderiza cuando esta vacio, asi
    // que "0" se confirma con toHaveCount(0) sobre el locator del badge,
    // no comparando un numero leido a mano.
    await expect(inventoryPage.cartBadge).toHaveCount(0);

    await inventoryPage.addToCartByIndex(0);

    await expect(inventoryPage.cartBadge).toHaveText("1");
  });

  test("agregar varios productos suma el contador del carrito", async ({
    inventoryPage,
    loggedInAsStandardUser,
  }) => {
    void loggedInAsStandardUser;
    await inventoryPage.addToCartByIndex(0);
    await inventoryPage.addToCartByIndex(1);
    await inventoryPage.addToCartByIndex(2);

    await expect(inventoryPage.cartBadge).toHaveText("3");
  });
});
