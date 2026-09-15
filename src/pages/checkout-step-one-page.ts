import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base-page";

/**
 * Page Object de /checkout-step-one.html: los datos del comprador.
 */
export class CheckoutStepOnePage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  /**
   * Ojo: si falta un campo obligatorio, SauceDemo NO navega - se queda en
   * checkout-step-one.html y muestra errorMessage. Por eso ac no podemos
   * esperar la URL de checkout-step-two.html a ciegas (colgaria el test
   * hasta el timeout en el caso de error). Cada test decide que esperar
   * segun el caso: el camino feliz espera la navegacion explicitamente
   * desde el spec, y el caso de error espera el mensaje de error.
   */
  async fillAndContinue(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }
}
