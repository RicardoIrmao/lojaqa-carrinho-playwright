
import { test, expect } from "@playwright/test";

const APIUrl = "https://api-qa-fap2026.onrender.com/api";

test.describe("Investigação das categorias - LojaQA", () => {

    test("CT14 - A lista de categorias deve corresponder ao catálogo", async ({ request }) => {

        // 1. Consultar as categorias
        const respostaCategorias = await request.get(
            `${APIUrl}/products/categories`
        );

        expect(respostaCategorias.status()).toBe(200);

        const categoriasAPI = await respostaCategorias.json();

        // 2. Consultar o catálogo
        const respostaProdutos = await request.get(
            `${APIUrl}/products`
        );

        expect(respostaProdutos.status()).toBe(200);

        const produtos = await respostaProdutos.json();

        // 3. Verificar os formatos das respostas
        expect(Array.isArray(categoriasAPI)).toBe(true);
        expect(Array.isArray(produtos)).toBe(true);

        expect(categoriasAPI.length).toBeGreaterThan(0);
        expect(produtos.length).toBeGreaterThan(0);

        // 4. Extrair as categorias existentes nos produtos
        const categoriasDoCatalogo = [
            ...new Set(
                produtos.map((produto: any) => produto.category)
            )
        ];

        // 5. Organizar as listas para comparação
        const categoriasRecebidas = [...categoriasAPI].sort();
        const categoriasEsperadas = [...categoriasDoCatalogo].sort();

        console.log("--------------------------------");
        console.log("CT14 - Investigação de categorias");
        console.log("Categorias retornadas pela API:", categoriasRecebidas);
        console.log("Categorias encontradas no catálogo:", categoriasEsperadas);
        console.log("Quantidade retornada:", categoriasRecebidas.length);
        console.log("Quantidade esperada:", categoriasEsperadas.length);

        // 6. Verificar se não existem categorias repetidas
        const categoriasUnicas = new Set(categoriasAPI);

        expect(categoriasUnicas.size).toBe(categoriasAPI.length);

        // 7. Comparar as duas listas
        expect(categoriasRecebidas).toEqual(categoriasEsperadas);

        console.log("CT14 - Categorias correspondem ao catálogo!");
    });

});
