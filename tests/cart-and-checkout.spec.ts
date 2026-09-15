import { test, expect } from "../src/fixtures/test-fixtures";
import { checkoutInfo } from "../src/utils/test-data";

test.describe("Carrito y checkout", () => {
  test("sacar un producto del carrito lo saca de la lista", async ({
    inventoryPage,
    cartPage,
    loggedInAsStandardUser,
  }) => {
    void loggedInAsStandardUser;

    await inventoryPage.addToCartByIndex(0);
    await inventoryPage.addToCartByIndex(1);
    await inventoryPage.openCart();

    await expect(cartPage.cartItems).toHaveCount(2);

    await cartPage.removeItemByIndex(0);

    await expect(cartPage.cartItems).toHaveCount(1);
  });

  test("checkout sin apellido muestra un error y no deja continuar", async ({
    inventoryPage,
    cartPage,
    checkoutStepOnePage,
    loggedInAsStandardUser,
  }) => {
    void loggedInAsStandardUser;

    await inventoryPage.addToCartByIndex(0);
    await inventoryPage.openCart();
    await cartPage.startCheckout();

    await checkoutStepOnePage.fillAndContinue(checkoutInfo.firstName, "", checkoutInfo.postalCode);

    await expect(checkoutStepOnePage.errorMessage).toContainText(/last name is required/i);
  });

  test("flujo completo: agregar, comprar y llegar a la confirmacion", async ({
    inventoryPage,
    cartPage,
    checkoutStepOnePage,
    checkoutStepTwoPage,
    checkoutCompletePage,
    loggedInAsStandardUser,
    page,
  }) => {
    void loggedInAsStandardUser;

    await inventoryPage.addToCartByIndex(0);
    await inventoryPage.addToCartByIndex(1);

    await inventoryPage.openCart();
    await expect(cartPage.cartItems).toHaveCount(2);

    await cartPage.startCheckout();
    await checkoutStepOnePage.fillAndContinue(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.postalCode,
    );
    // fillAndContinue no espera navegacion por si mismo (con datos invalidos
    // SauceDemo ni siquiera navega, se queda en checkout-step-one.html
    // mostrando error). 
    // esperamos explicitamente a checkout-step-two.html antes de leer nada.
    await page.waitForURL(/checkout-step-two\.html/);

    // El total final tiene que ser exactamente subtotal + impuesto
    const subtotal = await checkoutStepTwoPage.itemTotal();
    const tax = await checkoutStepTwoPage.tax();
    const total = await checkoutStepTwoPage.total();

    expect(Math.round((subtotal + tax) * 100) / 100).toBeCloseTo(total, 2);

    await checkoutStepTwoPage.finish();

    await expect(checkoutCompletePage.completeHeader).toContainText(/thank you for your order/i);
  });
});
