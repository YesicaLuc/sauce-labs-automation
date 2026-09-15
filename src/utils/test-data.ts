/**
 * Usuarios y datos de prueba de SauceDemo.
 */
const password = "secret_sauce";

export const standardUser = { username: "standard_user", password };
export const lockedOutUser = { username: "locked_out_user", password };
// problem_user tiene un bug conocido y reproducible: todas las imagenes
// de producto muestran la misma foto sin importar el producto real.
export const problemUser = { username: "problem_user", password };

export const checkoutInfo = {
  firstName: "Michael",
  lastName: "Scott",
  postalCode: "5500",
};
