
import { test, expect } from "@playwright/test";

const APIUrl = "https://api-qa-fap2026.onrender.com/api";

test.describe("Investigação de parâmetros inválidos - LojaQA", () => {

    test("CT17 - Investigar o comportamento com preços não numéricos", async ({ request }) => {

        // Consulta normal para servir de referência
        const respostaBase = await request.get(`${APIUrl}/products`);

        expect(respostaBase.status()).toBe(200);

        const produtosBase = await respostaBase.json();

        expect(Array.isArray(produtosBase)).toBe(true);

        // Consulta com maxPrice inválido
        const respostaMaximo = await request.get(
            `${APIUrl}/products?maxPrice=abc`
        );

        const corpoMaximo = await respostaMaximo.text();

        // Consulta com minPrice inválido
        const respostaMinimo = await request.get(
            `${APIUrl}/products?minPrice=abc`
        );

        const corpoMinimo = await respostaMinimo.text();

        console.log("--------------------------------");
        console.log("CT17 - Parâmetros de preço inválidos");

        console.log("Consulta normal:");
        console.log("Status:", respostaBase.status());
        console.log("Quantidade:", produtosBase.length);

        console.log("--------------------------------");
        console.log("Consulta maxPrice=abc");
        console.log("Status:", respostaMaximo.status());
        console.log("Resposta:", corpoMaximo);

        console.log("--------------------------------");
        console.log("Consulta minPrice=abc");
        console.log("Status:", respostaMinimo.status());
        console.log("Resposta:", corpoMinimo);

        // Se a API aceitar as consultas, vamos comparar os resultados.
        if (respostaMaximo.ok()) {
            const produtosMaximo = JSON.parse(corpoMaximo);

            expect(Array.isArray(produtosMaximo)).toBe(true);

            console.log(
                "Quantidade com maxPrice inválido:",
                produtosMaximo.length
            );
        }

        if (respostaMinimo.ok()) {
            const produtosMinimo = JSON.parse(corpoMinimo);

            expect(Array.isArray(produtosMinimo)).toBe(true);

            console.log(
                "Quantidade com minPrice inválido:",
                produtosMinimo.length
            );
        }

        console.log("--------------------------------");
        console.log("CT17 - Investigação concluída.");
    });

});
