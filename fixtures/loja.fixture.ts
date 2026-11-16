
import { test as base, expect } from "@playwright/test";
import { LojaPage } from "../pages/loja.page";

type LojaFixtures = {
    lojaPage: LojaPage;
    lojaAberta: LojaPage;
};

export const test = base.extend<LojaFixtures>({
    // Instancia o Page Object da LojaQA
    lojaPage: async ({ page }, use) => {
        const lojaPage = new LojaPage(page);
        await use(lojaPage);
    },

    // Limpa o carrinho e abre a loja antes de cada teste
    lojaAberta: async ({ page, lojaPage }, use) => {
        await page.addInitScript(() => {
            localStorage.removeItem("lojaqa_cart");
        });

        await lojaPage.acessarLoja();
        await use(lojaPage);
    }
});

export { expect };
