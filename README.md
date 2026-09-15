# Suite E2E - SauceDemo (Playwright + TypeScript)

Suite de pruebas end-to-end contra [saucedemo.com](https://www.saucedemo.com), armada en Page Object Model, con corridas en viewport de escritorio y de celular (Chrome, Chrome mobile y Safari mobile) e integración continua en GitHub Actions.

## Cobertura

- **Login** (`login.spec.ts`): usuario válido, contraseña incorrecta, usuario bloqueado, campos vacíos.
- **Catálogo** (`inventory.spec.ts`): cantidad de productos, orden ascendente/descendente por precio, contador del carrito al agregar uno o varios productos.
- **Detalle de producto** (`item-detail.spec.ts`): consistencia de datos entre el listado y el detalle, agregar al carrito desde el detalle.
- **Carrito y checkout** (`cart-and-checkout.spec.ts`): sacar un producto del carrito, validación de campo requerido, y el flujo completo de punta a punta (agregar, carrito, checkout, confirmar que subtotal + impuesto = total, pantalla de confirmación).
- **Bug conocido** (`known-bug-problem-user.spec.ts`): SauceDemo incluye a propósito un usuario (`problem_user`) con un bug reproducible (todas las imágenes de producto son iguales). El test lo detecta, con un caso de control usando `standard_user` para probar que la aserción distingue el caso con bug del caso sin bug.
- **Responsive** (`responsive.spec.ts`): login y navegación funcionando en los tres proyectos, más el chequeo de viewport.

54 tests en total (18 por proyecto x 3 proyectos).

## Estructura del proyecto

```
src/
  fixtures/         # fixtures compartidos (login, etc.)
  pages/            # Page Objects, una clase por pantalla
  utils/            # datos de prueba
tests/               # specs, uno por area funcional
.github/workflows/   # pipeline de CI (GitHub Actions)
```

## Cómo correrla

```bash
npm install
npx playwright install        # descarga los navegadores la primera vez
npm test                      # corre los 3 proyectos (desktop + 2 mobile)
npm run test:desktop          # solo desktop
npm run test:mobile           # solo los dos proyectos mobile
npm run test:ui               # modo UI interactivo de Playwright
npm run report                # abre el ultimo reporte HTML
```

La URL base sale de la variable `BASE_URL` (ver `.env.example`).

## Desafíos

**Elección del sitio objetivo.** La suite pasó por un sitio antes de asentarse en SauceDemo:

1. Mercado Libre: sitio real, pero con detección de bots activa (esperable en un sitio de pagos); cualquier corrida repetida disparaba el captcha.
2. SauceDemo: demo oficial de Sauce Labs, sin publicidad ni captcha, con atributos `data-test` pensados a propósito para testing. Es el sitio de referencia de la documentación oficial de Playwright.

**Bugs de timing encontrados en corridas reales.** Tres clases de problema aparecieron al correr la suite de verdad (no en la escritura del código):

- *Lecturas que no reintentan.* Patrones como `expect(await locator.count()).toBe(n)` leen el DOM una sola vez; si React todavía no terminó de renderizar en ese instante, el test falla aunque el estado final sea correcto. Se reemplazaron por assertions que reintentan solas sobre el locator (`expect(locator).toHaveCount(n)`, `.toHaveText(...)`).
- *Espera de navegación insuficiente.* `waitForLoadState("domcontentloaded")` dispara antes de que la SPA termine de renderizar la pantalla nueva. Se reemplazó por `page.waitForURL(/patron/)` en cada transición de pantalla.
- *DOM anterior que persiste tras el cambio de URL.* Incluso esperando la URL, se detectó un caso (abrir el detalle de un producto y agregarlo al carrito) donde la dirección ya había cambiado a `inventory-item.html` pero el listado anterior (6 botones "Add to cart") todavía no se había desmontado del DOM, lo que producía un `strict mode violation` al intentar clickear el botón del detalle. El fix agrega una espera explícita a que el listado anterior desaparezca del DOM antes de continuar, además de esperar la URL.

