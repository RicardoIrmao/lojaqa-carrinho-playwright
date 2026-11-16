
import { test, expect } from "@playwright/test";

const API_URL = "https://api-qa-fap2026.onrender.com/api";

// Estrutura dos dados esperados de cada produto
interface Produto {
    _id: string;
    name: string;
    description?: string;
    category: string;
    price: number;
    stock: number;
    active: boolean;
}

test.describe("Módulo 03 - API LojaQA: Catálogo e Estoque", () => {

    // CT-API-01 - Consultar catálogo e validar estrutura dos produtos
    test("CT-API-01 - Consultar catálogo de produtos", async ({ request }) => {

        const resposta = await request.get(`${API_URL}/products`);

        // Validação do status HTTP
        expect(resposta.status()).toBe(200);
        expect(resposta.ok()).toBeTruthy();

        // Validação do cabeçalho da resposta
        const headers = resposta.headers();

        expect(headers["content-type"]).toContain("application/json");

        // Conversão da resposta JSON para uma lista de produtos
        const produtos: Produto[] = await resposta.json();

        // Validação da estrutura geral do catálogo
        expect(Array.isArray(produtos)).toBeTruthy();
        expect(produtos.length).toBeGreaterThan(0);

        // Validação dos dados de cada produto
        for (const produto of produtos) {

            expect(typeof produto._id).toBe("string");
            expect(produto._id.length).toBeGreaterThan(0);

            expect(typeof produto.name).toBe("string");
            expect(produto.name.length).toBeGreaterThan(0);

            expect(typeof produto.category).toBe("string");
            expect(produto.category.length).toBeGreaterThan(0);

            expect(typeof produto.price).toBe("number");
            expect(produto.price).toBeGreaterThan(0);

            expect(typeof produto.stock).toBe("number");
            expect(produto.active).toBe(true);
        }

        // Exibição dos resultados no terminal
        console.log("\n========== CT-API-01 ==========");
        console.log("Consulta do catálogo realizada!");
        console.log("Status HTTP:", resposta.status());
        console.log("Content-Type:", headers["content-type"]);
        console.log("Quantidade de produtos:", produtos.length);

        console.table(
            produtos.map((produto, index) => ({
                numero: index + 1,
                nome: produto.name,
                categoria: produto.category,
                preco: produto.price,
                estoque: produto.stock,
                ativo: produto.active
            }))
        );

        console.log("Estrutura do catálogo validada!");
    });

    // CT-API-02 - Validar se os produtos possuem IDs únicos
    test("CT-API-02 - Validar IDs únicos dos produtos", async ({ request }) => {

        const resposta = await request.get(`${API_URL}/products`);

        expect(resposta.status()).toBe(200);

        const produtos: Produto[] = await resposta.json();

        const ids = produtos.map((produto) => produto._id);

        // Set mantém apenas valores únicos
        const idsUnicos = new Set(ids);

        console.log("\n========== CT-API-02 ==========");
        console.log("Quantidade de produtos:", produtos.length);
        console.log("Quantidade de IDs únicos:", idsUnicos.size);

        // Se houver IDs repetidos, a quantidade será diferente
        expect(idsUnicos.size).toBe(produtos.length);

        console.log("Todos os produtos possuem IDs únicos!");
    });

    // CT-API-03 - Validar integridade e disponibilidade do estoque
    test("CT-API-03 - Validar integridade dos estoques", async ({ request }) => {

        const resposta = await request.get(`${API_URL}/products`);

        expect(resposta.status()).toBe(200);

        const produtos: Produto[] = await resposta.json();

        // Separação dos produtos conforme disponibilidade
        const produtosDisponiveis = produtos.filter(
            (produto) => produto.stock > 0
        );

        const produtosSemEstoque = produtos.filter(
            (produto) => produto.stock === 0
        );

        // Todo estoque deve ser um número inteiro e não negativo
        for (const produto of produtos) {

            expect(
                Number.isInteger(produto.stock),
                `O estoque de "${produto.name}" deve ser um número inteiro.`
            ).toBe(true);

            expect(
                produto.stock,
                `O estoque de "${produto.name}" não pode ser negativo.`
            ).toBeGreaterThanOrEqual(0);
        }

        // O catálogo deve possuir pelo menos um produto disponível
        expect(produtosDisponiveis.length).toBeGreaterThan(0);

        console.log("\n========== CT-API-03 ==========");
        console.log("Status HTTP:", resposta.status());
        console.log("Total de produtos:", produtos.length);
        console.log("Produtos disponíveis:", produtosDisponiveis.length);
        console.log("Produtos sem estoque:", produtosSemEstoque.length);

        console.log("\nESTOQUE DOS PRODUTOS:");

        console.table(
            produtos.map((produto) => ({
                produto: produto.name,
                estoque: produto.stock,
                disponibilidade:
                    produto.stock > 0 ? "Disponível" : "Sem estoque"
            }))
        );

        console.log("Integridade e disponibilidade dos estoques validadas!");
    });

});
