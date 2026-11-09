
import { test, expect } from "@playwright/test";
import { LojaPage } from "../../pages/loja.page";

test.describe("Módulo 03 - Carrinho de Compras", () => {

    test.setTimeout(60000);

    let loja: LojaPage;

    test.beforeEach(async ({ page }) => {

        await page.addInitScript(() => {
            localStorage.removeItem("lojaqa_cart");
        });

        loja = new LojaPage(page);

        await loja.acessarLoja();

    });

    test("CT01 - Adicionar produto ao carrinho", async ({ page }) => {

        const nomeProduto = "Teclado Mecânico Aurora RGB";

        const produto = page
            .locator(".product-card")
            .filter({ hasText: nomeProduto });

        await expect(produto).toBeVisible({ timeout: 50000 });

        await loja.adicionarProduto(nomeProduto);
        await loja.abrirCarrinho();

        await expect(loja.cartItems).toContainText(nomeProduto);
        await expect(loja.cartCount).toHaveText("1");

        console.log("CT01: Produto adicionado com sucesso!");

    });

    test("CT02 - Aumentar quantidade e atualizar total", async ({ page }) => {

        const nomeProduto = "Teclado Mecânico Aurora RGB";

        const produto = page
            .locator(".product-card")
            .filter({ hasText: nomeProduto });

        await expect(produto).toBeVisible({ timeout: 50000 });

        await loja.adicionarProduto(nomeProduto);
        await loja.abrirCarrinho();
        await loja.aumentarQuantidade(nomeProduto);

        const quantidade = loja.cartItems.locator(".quantity b");

        await expect(quantidade).toHaveText("2");
        await expect(loja.cartTotal).toHaveText("R$ 579,80");

        console.log("CT02: Quantidade atualizada para 2 unidades!");
        console.log("CT02: Total atualizado para R$ 579,80!");

    });

    test("CT03 - Diminuir quantidade e atualizar total", async ({ page }) => {

        const nomeProduto = "Teclado Mecânico Aurora RGB";

        const produto = page
            .locator(".product-card")
            .filter({ hasText: nomeProduto });

        await expect(produto).toBeVisible({ timeout: 50000 });

        await loja.adicionarProduto(nomeProduto);
        await loja.abrirCarrinho();
        await loja.aumentarQuantidade(nomeProduto);

        const quantidade = loja.cartItems.locator(".quantity b");

        await expect(quantidade).toHaveText("2");

        await loja.diminuirQuantidade(nomeProduto);

        await expect(quantidade).toHaveText("1");
        await expect(loja.cartTotal).toHaveText("R$ 289,90");

        console.log("CT03: Quantidade reduzida para 1 unidade!");
        console.log("CT03: Total atualizado para R$ 289,90!");

    });

    test("CT04 - Remover produto ao chegar a zero", async ({ page }) => {

        const nomeProduto = "Teclado Mecânico Aurora RGB";

        const produto = page
            .locator(".product-card")
            .filter({ hasText: nomeProduto });

        await expect(produto).toBeVisible({ timeout: 50000 });

        await loja.adicionarProduto(nomeProduto);
        await loja.abrirCarrinho();

        await expect(loja.cartItems).toContainText(nomeProduto);

        await loja.diminuirQuantidade(nomeProduto);

        await expect(loja.cartItems).not.toContainText(nomeProduto);
        await expect(loja.cartCount).toHaveText("0");

        console.log("CT04: Produto removido do carrinho!");
        console.log("CT04: Contador do carrinho zerado!");

    });

    test("CT05 - Impedir quantidade acima do estoque disponível", async ({ page }) => {

        const nomeProduto = "Suporte Articulado a Gás para 2 Monitores";

        const produto = page
            .locator(".product-card")
            .filter({ hasText: nomeProduto });

        await expect(produto).toBeVisible({ timeout: 50000 });

        await loja.adicionarProduto(nomeProduto);
        await loja.abrirCarrinho();

        const quantidade = loja.cartItems.locator(".quantity b");

        // O estoque disponível é de apenas uma unidade
        await expect(quantidade).toHaveText("1");

        // Tenta aumentar a quantidade além do estoque
        await loja.aumentarQuantidade(nomeProduto);

        // A quantidade deve permanecer limitada a uma unidade
        await expect(quantidade).toHaveText("1");

        // O total não deve ser alterado
        await expect(loja.cartTotal).toHaveText("R$ 269,90");

        console.log("CT05: Limite de estoque respeitado!");
        console.log("CT05: Quantidade permaneceu em 1 unidade!");
        console.log("CT05: Total permaneceu em R$ 269,90!");

    });

});
