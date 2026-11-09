
import { test, expect } from "@playwright/test";
import { LojaPage } from "../../pages/loja.page";

test.describe("Investigação do filtro de preço máximo - LojaQA", () => {

    test("CT10 - Produto com preço igual ao limite máximo deve permanecer visível", async ({ page }) => {

        test.setTimeout(60000);

        // Evita que dados de carrinhos anteriores interfiram no teste.
        await page.addInitScript(() => {
            localStorage.removeItem("lojaqa_cart");
        });

        const loja = new LojaPage(page);

        // 1. Acessar a loja.
        await loja.acessarLoja();

        // 2. Aguardar o catálogo carregar.
        await loja.productCards.first().waitFor({
            state: "visible",
            timeout: 50000
        });

        const nomeProduto = "Teclado Mecânico Aurora RGB";
        const precoMaximo = "289.9";

        // 3. Preparar a espera pela resposta da API.
        const respostaAPI = page.waitForResponse((response) => {
            const url = new URL(response.url());

            return (
                url.pathname.endsWith("/products") &&
                url.searchParams.get("maxPrice") === precoMaximo
            );
        });

        // 4. Informar o preço máximo.
        await loja.definirPrecoMaximo(precoMaximo);

        // 5. Aguardar a resposta da API.
        const resposta = await respostaAPI;

        expect(
            resposta.status(),
            "A consulta do catálogo deveria retornar HTTP 200."
        ).toBe(200);

        // 6. Procurar o produto na vitrine.
        const produto = loja.localizarProdutoNaVitrine(nomeProduto);

        console.log("CT10 - Produto pesquisado:", nomeProduto);
        console.log("CT10 - Preço máximo informado:", precoMaximo);
        console.log("CT10 - Status da API:", resposta.status());

        // 7. Validar o comportamento esperado.
        // O produto custa exatamente R$ 289,90.
        // Portanto, deve aparecer quando o limite máximo é R$ 289,90.
        await expect(
            produto,
            "Defeito investigado: produto com preço igual ao limite máximo não aparece na vitrine."
        ).toBeVisible({ timeout: 5000 });

        console.log("CT10 - Produto permaneceu visível corretamente!");
    });

});
