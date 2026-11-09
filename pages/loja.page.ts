
import { Page, Locator } from "@playwright/test";

export class LojaPage {
    readonly page: Page;
    readonly cartButton: Locator;
    readonly cartItems: Locator;
    readonly cartCount: Locator;
    readonly cartTotal: Locator;
    readonly maxPriceInput: Locator;
    readonly productCards: Locator;

    constructor(page: Page) {
        this.page = page;

        this.cartButton = page.locator("#cartButton");
        this.cartItems = page.locator("#cartItems");
        this.cartCount = page.locator("#cartCount");
        this.cartTotal = page.locator("#cartTotal");

        this.maxPriceInput = page.locator("#maxPrice");
        this.productCards = page.locator(".product-card");
    }

    async acessarLoja() {
        await this.page.goto(
            "https://alisonmelo.github.io/tioalison-pe-t4-fap26/projetos-base/01-sistema-login/loja.html"
        );
    }

    async adicionarProduto(nomeProduto: string) {
        const produto = this.productCards.filter({
            hasText: nomeProduto
        });

        await produto
            .getByRole("button", { name: "Adicionar ao carrinho" })
            .click();
    }

    async abrirCarrinho() {
        await this.cartButton.click();
    }

    async aumentarQuantidade(nomeProduto: string) {
        const item = this.cartItems
            .locator(".cart-item")
            .filter({ hasText: nomeProduto });

        await item.locator(".quantity button").nth(1).click();
    }

    async diminuirQuantidade(nomeProduto: string) {
        const item = this.cartItems
            .locator(".cart-item")
            .filter({ hasText: nomeProduto });

        await item.locator(".quantity button").nth(0).click();
    }

    async definirPrecoMaximo(preco: string) {
        await this.maxPriceInput.fill(preco);
    }

    localizarProdutoNaVitrine(nomeProduto: string): Locator {
        return this.productCards.filter({
            hasText: nomeProduto
        });
    }
}
