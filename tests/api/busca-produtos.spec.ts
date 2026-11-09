
import { test, expect } from "@playwright/test";

const APIUrl = "https://api-qa-fap2026.onrender.com/api";

test.describe("Investigação da busca de produtos - LojaQA", () => {

    test("CT15 - Comparar busca com letras maiúsculas e minúsculas", async ({ request }) => {

        const respostaMaiuscula = await request.get(
            `${APIUrl}/products?search=Teclado`
        );

        expect(respostaMaiuscula.status()).toBe(200);

        const produtosMaiuscula = await respostaMaiuscula.json();

        const respostaMinuscula = await request.get(
            `${APIUrl}/products?search=teclado`
        );

        expect(respostaMinuscula.status()).toBe(200);

        const produtosMinuscula = await respostaMinuscula.json();

        const idsMaiuscula = produtosMaiuscula
            .map((produto: any) => produto._id)
            .sort();

        const idsMinuscula = produtosMinuscula
            .map((produto: any) => produto._id)
            .sort();

        console.log("--------------------------------");
        console.log("CT15 - Investigação da busca");
        console.log("Resultados com Teclado:", produtosMaiuscula.length);
        console.log("Resultados com teclado:", produtosMinuscula.length);
        console.log("IDs com maiúscula:", idsMaiuscula);
        console.log("IDs com minúscula:", idsMinuscula);

        expect(idsMinuscula).toEqual(idsMaiuscula);

        console.log("CT15 - Busca equivalente nas duas consultas!");
    });


    test("CT16 - API deve localizar produto por trecho intermediário do nome", async ({ request }) => {

        // 1. Termo que aparece no meio do nome do produto
        const termoBusca = "Aurora RGB";

        // 2. Consultar o catálogo completo
        const respostaCatalogo = await request.get(
            `${APIUrl}/products`
        );

        expect(respostaCatalogo.status()).toBe(200);

        const catalogo = await respostaCatalogo.json();

        // 3. Identificar os produtos que deveriam corresponder à busca
        const termoNormalizado = termoBusca.toLowerCase();

        const produtosEsperados = catalogo.filter((produto: any) => {

            const nome = (produto.name || "").toLowerCase();
            const descricao = (produto.description || "").toLowerCase();
            const categoria = (produto.category || "").toLowerCase();

            return (
                nome.includes(termoNormalizado) ||
                descricao.includes(termoNormalizado) ||
                categoria.includes(termoNormalizado)
            );
        });

        // 4. Consultar a API usando o termo pesquisado
        const parametros = new URLSearchParams({
            search: termoBusca
        });

        const respostaBusca = await request.get(
            `${APIUrl}/products?${parametros.toString()}`
        );

        expect(respostaBusca.status()).toBe(200);

        const produtosRecebidos = await respostaBusca.json();

        // 5. Organizar os IDs para comparação
        const idsEsperados = produtosEsperados
            .map((produto: any) => produto._id)
            .sort();

        const idsRecebidos = produtosRecebidos
            .map((produto: any) => produto._id)
            .sort();

        console.log("--------------------------------");
        console.log("CT16 - Busca por trecho intermediário");
        console.log("Termo pesquisado:", termoBusca);
        console.log("Quantidade esperada:", idsEsperados.length);
        console.log("Quantidade recebida:", idsRecebidos.length);
        console.log("IDs esperados:", idsEsperados);
        console.log("IDs recebidos:", idsRecebidos);

        // 6. Verificar se a API retornou exatamente os produtos esperados
        expect(idsRecebidos).toEqual(idsEsperados);

        console.log("CT16 - Busca por trecho intermediário validada!");
    });

});
