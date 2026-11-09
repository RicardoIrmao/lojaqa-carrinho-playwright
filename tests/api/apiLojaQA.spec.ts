
import { test, expect } from "@playwright/test";

const APIUrl = "https://api-qa-fap2026.onrender.com/api";

// Define a estrutura esperada de um produto da API
interface Produto {
    _id: string;
    name: string;
    description?: string;
    category: string;
    price: number;
    stock: number;
    active: boolean;
}

test.describe("teste api lojaQA", () => {

    // TESTE 1 - CONSULTAR CATÁLOGO DE PRODUTOS
    test("get catalogo lojaQa", async ({ request }) => {

        const res = await request.get(`${APIUrl}/products`);

        expect(res.status()).toBe(200);
        expect(res.ok()).toBeTruthy();

        const headers = res.headers();

        console.log("Status HTTP:", res.status());
        console.log("Content-Type:", headers["content-type"]);

        expect(headers["content-type"]).toContain("application/json");

        // Agora o TypeScript conhece o tipo dos produtos
        const bodyRes: Produto[] = await res.json();

        expect(Array.isArray(bodyRes)).toBeTruthy();
        expect(bodyRes.length).toBeGreaterThan(0);

        for (const produto of bodyRes) {
            expect(produto).toHaveProperty("_id");

            expect(typeof produto.name).toBe("string");
            expect(produto.name.length).toBeGreaterThan(0);

            expect(typeof produto.price).toBe("number");
            expect(produto.price).toBeGreaterThan(0);

            expect(typeof produto.stock).toBe("number");
            expect(produto.stock).toBeGreaterThanOrEqual(0);

            expect(produto.active).toBe(true);
        }

        console.log("Quantidade de produtos:", bodyRes.length);

        console.log(
            "Primeiro produto:",
            JSON.stringify(bodyRes[0], null, 2)
        );

        console.log("CATÁLOGO COMPLETO:");

        console.table(
            bodyRes.map((produto, index) => ({
                numero: index + 1,
                nome: produto.name,
                preco: produto.price,
                estoque: produto.stock,
                ativo: produto.active
            }))
        );

        const produtosEstoqueBaixo = bodyRes.filter(
            (produto) => produto.stock <= 5
        );

        console.log("PRODUTOS COM ESTOQUE BAIXO:");

        console.table(
            produtosEstoqueBaixo.map((produto) => ({
                nome: produto.name,
                estoque: produto.stock
            }))
        );

        const produtosSemEstoque = bodyRes.filter(
            (produto) => produto.stock === 0
        );

        console.log(
            "Quantidade de produtos sem estoque:",
            produtosSemEstoque.length
        );

        console.table(
            produtosSemEstoque.map((produto) => ({
                nome: produto.name,
                estoque: produto.stock
            }))
        );
    });

    // TESTE 2 - LOGIN VÁLIDO
    test("post login lojaQa valido", async ({ request }) => {

        const res = await request.post(`${APIUrl}/login`, {
            data: {
                email: "admin@system.com",
                password: "AdminPassword123"
            },
            headers: {
                "Content-Type": "application/json"
            }
        });

        expect(res.status()).toBe(200);

        const resBody = await res.json();

        expect(resBody).toHaveProperty("token");
        expect(typeof resBody.token).toBe("string");
        expect(resBody.token.length).toBeGreaterThan(10);

        console.log("Login válido - Status:", res.status());
        console.log("Token recebido:", resBody.token ? "Sim" : "Não");
    });

    // TESTE 3 - LOGIN INVÁLIDO
    test("Login lojaQA invalido", async ({ request }) => {

        const res = await request.post(`${APIUrl}/login`, {
            data: {
                email: "admin@system.com",
                password: "SenhaErrada123"
            }
        });

        expect(res.status()).toBe(401);

        const errorBody = await res.json();

        expect(errorBody.token).toBeUndefined();
        expect(errorBody.error).toBe("Credenciais inválidas.");

        console.log("Login inválido - Status:", res.status());
        console.log("Mensagem:", errorBody.error);
    });

    // TESTE 4 - VALIDAR ESTOQUE DO SUPORTE ARTICULADO
    test("validar estoque do suporte articulado", async ({ request }) => {

        const res = await request.get(`${APIUrl}/products`);

        expect(res.status()).toBe(200);

        const produtos: Produto[] = await res.json();

        const produto = produtos.find(
            (item) =>
                item.name === "Suporte Articulado a Gás para 2 Monitores"
        );

        expect(produto).toBeDefined();

        expect(produto!.price).toBe(269.9);
        expect(produto!.stock).toBe(1);
        expect(produto!.active).toBe(true);

        console.log("Produto:", produto!.name);
        console.log("Preço:", produto!.price);
        console.log("Estoque disponível:", produto!.stock);
        console.log("API: dados do estoque validados!");
    });

    // TESTE 5 - CONSULTAR CATEGORIAS
    test("GET - Consultar categorias dos produtos", async ({ request }) => {

        const res = await request.get(`${APIUrl}/products/categories`);

        console.log("Status das categorias:", res.status());
        console.log("Content-Type:", res.headers()["content-type"]);

        expect(res.status()).toBe(200);
        expect(res.headers()["content-type"]).toContain("application/json");

        const body: string[] = await res.json();

        console.log(
            "Resposta das categorias:",
            JSON.stringify(body, null, 2)
        );

        expect(body).toBeTruthy();

        console.log("Consulta de categorias realizada!");
    });

    // TESTE 6 - VALIDAR CORRESPONDÊNCIA ENTRE CATEGORIAS E PRODUTOS
    test("Validar correspondência entre categorias e produtos", async ({ request }) => {

        const respostaCategorias = await request.get(
            `${APIUrl}/products/categories`
        );

        const respostaProdutos = await request.get(
            `${APIUrl}/products`
        );

        expect(respostaCategorias.status()).toBe(200);
        expect(respostaProdutos.status()).toBe(200);

        const categorias: string[] = await respostaCategorias.json();
        const produtos: Produto[] = await respostaProdutos.json();

        console.log("ANÁLISE DE CATEGORIAS:");

        for (const categoria of categorias) {

            const produtosDaCategoria = produtos.filter(
                (produto) => produto.category === categoria
            );

            console.log(
                `${categoria}: ${produtosDaCategoria.length} produto(s)`
            );

            expect(
                produtosDaCategoria.length,
                `A categoria "${categoria}" não possui produtos no catálogo.`
            ).toBeGreaterThan(0);
        }

        console.log("Todas as categorias possuem produtos!");
    });

    // TESTE 7 - VALIDAR IDs ÚNICOS
    test("Validar se os produtos possuem IDs únicos", async ({ request }) => {

        const res = await request.get(`${APIUrl}/products`);

        expect(res.status()).toBe(200);

        const produtos: Produto[] = await res.json();

        const ids = produtos.map((produto) => produto._id);

        const idsUnicos = new Set(ids);

        console.log("Total de produtos:", produtos.length);
        console.log("Total de IDs únicos:", idsUnicos.size);

        expect(idsUnicos.size).toBe(produtos.length);

        console.log("Todos os produtos possuem IDs únicos!");
    });

    // TESTE 8 - VALIDAR INTEGRIDADE DOS ESTOQUES
    test("Validar integridade dos valores de estoque", async ({ request }) => {

        const res = await request.get(`${APIUrl}/products`);

        expect(res.status()).toBe(200);

        const produtos: Produto[] = await res.json();

        for (const produto of produtos) {

            expect(
                Number.isInteger(produto.stock),
                `Estoque inválido no produto: ${produto.name}`
            ).toBe(true);

            expect(
                produto.stock,
                `Estoque negativo no produto: ${produto.name}`
            ).toBeGreaterThanOrEqual(0);

            console.log(
                `${produto.name}: ${produto.stock} unidade(s)`
            );
        }

        console.log("Integridade dos estoques validada!");
    });

});
