import { Page } from "@playwright/test";

/**
 * Clase base para todos los Page Objects.
 * Centraliza lo que es comun a cualquier pagina: navegar y esperar a que cargue.
 */
export class BasePage {
  constructor(protected readonly page: Page) {
    // Cierra sola cualquier dialog nativo (alert/confirm/prompt/beforeunload).
    // Playwright ya los auto-descarta si nadie los escucha, pero dejarlo
    // explicito deja un rastro en los logs de por que se cerro algo.
    this.page.on("dialog", (dialog) => {
      dialog.dismiss().catch(() => {});
    });
  }

  async goto(path = "/"): Promise<void> {
    await this.page.goto(path);
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
  }

  async title(): Promise<string> {
    return this.page.title();
  }
}
