
import { test, expect } from "@playwright/test";

const APIUrl = "https://api-qa-fap2026.onrender.com/api";

test.describe("Contrato OpenAPI - Catálogo LojaQA", () => {

    test("CT12 - Todos os produtos devem respeitar o contrato Product", async ({ request }) => {

        const resposta = await request.get(`${APIUrl}/products`);

        expect(resposta.status()).toBe(200);
        expect(resposta.headers()["content-type"]).toContain("application/json");

        const produtos = await resposta.json();

        expect(Array.isArray(produtos)).toBe(true);
        expect(produtos.length).toBeGreaterThan(0);

        for (const produto of produtos) {

            console.log("--------------------------------");
            console.log("Validando:", produto.name);

            expect(typeof produto._id).toBe("string");
            expect(produto._id.length).toBeGreaterThan(0);

            expect(typeof produto.name).toBe("string");
            expect(typeof produto.description).toBe("string");
            expect(typeof produto.category).toBe("string");

            expect(typeof produto.price).toBe("number");
            expect(produto.price).toBeGreaterThan(0);

            expect(Number.isInteger(produto.stock)).toBe(true);
            expect(produto.stock).toBeGreaterThanOrEqual(0);

            // Verifica o tipo do campo active.
            expect(typeof produto.active).toBe("boolean");

            // Regra documentada: o catálogo público retorna produtos ativos.
            expect(
                produto.active,
                `Produto retornado pela API está inativo: ${produto.name}`
            ).toBe(true);

            expect(produto.sellerId).toBeDefined();
            expect(typeof produto.sellerId).toBe("object");
            expect(produto.sellerId).not.toBeNull();

            expect(typeof produto.sellerId._id).toBe("string");
            expect(typeof produto.sellerId.name).toBe("string");
            expect(typeof produto.sellerId.storeName).toBe("string");

            console.log("Preço:", produto.price);
            console.log("Estoque:", produto.stock);
            console.log("Produto ativo:", produto.active);
            console.log("Estrutura validada!");
        }

        console.log("--------------------------------");
        console.log("Quantidade de produtos validados:", produtos.length);
        console.log("CT12 - Validação do contrato concluída.");
    });

});
