
import { test, expect } from "@playwright/test";

const APIUrl = "https://api-qa-fap2026.onrender.com/api";

test.describe("Investigação dos filtros combinados - LojaQA", () => {

    test("CT13 - API deve combinar vendedor, categoria e faixa de preço", async ({ request }) => {

        test.setTimeout(60000);

        // 1. Busca o catálogo completo para usar como referência.
        const respostaBase = await request.get(`${APIUrl}/products`);

        expect(respostaBase.status()).toBe(200);

        const produtosBase = await respostaBase.json();

        expect(Array.isArray(produtosBase)).toBe(true);
        expect(produtosBase.length).toBeGreaterThan(0);

        // 2. Escolhe um produto real como referência.
        const produtoReferencia = produtosBase[0];

        const sellerId = produtoReferencia.sellerId._id;
        const categoria = produtoReferencia.category;
        const preco = produtoReferencia.price;

        // 3. Calcula quais produtos deveriam aparecer,
        // aplicando os quatro critérios no catálogo original.
        const produtosEsperados = produtosBase.filter((produto: any) =>
            produto.sellerId._id === sellerId &&
            produto.category === categoria &&
            produto.price >= preco &&
            produto.price <= preco
        );

        // 4. Monta a consulta com todos os filtros.
        const parametros = new URLSearchParams({
            sellerId: sellerId,
            category: categoria,
            minPrice: String(preco),
            maxPrice: String(preco)
        });

        const respostaFiltrada = await request.get(
            `${APIUrl}/products?${parametros.toString()}`
        );

        expect(respostaFiltrada.status()).toBe(200);

        const produtosRecebidos = await respostaFiltrada.json();

        expect(Array.isArray(produtosRecebidos)).toBe(true);

        // 5. Compara os IDs esperados com os IDs recebidos.
        const idsEsperados = produtosEsperados
            .map((produto: any) => produto._id)
            .sort();

        const idsRecebidos = produtosRecebidos
            .map((produto: any) => produto._id)
            .sort();

        console.log("--------------------------------");
        console.log("CT13 - Filtros combinados");
        console.log("Vendedor:", sellerId);
        console.log("Categoria:", categoria);
        console.log("Preço mínimo:", preco);
        console.log("Preço máximo:", preco);
        console.log("Quantidade esperada:", idsEsperados.length);
        console.log("Quantidade recebida:", idsRecebidos.length);
        console.log("IDs esperados:", idsEsperados);
        console.log("IDs recebidos:", idsRecebidos);

        expect(idsRecebidos).toEqual(idsEsperados);

        console.log("CT13 - Todos os filtros combinados funcionaram!");
    });

});
