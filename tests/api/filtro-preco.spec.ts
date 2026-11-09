
import { test, expect } from "@playwright/test";

const APIUrl = "https://api-qa-fap2026.onrender.com/api";

// Estrutura do vendedor retornado pela API
interface Vendedor {
    _id: string;
    name?: string;
    storeName?: string;
}

// Estrutura do produto retornado pela API
interface Produto {
    _id: string;
    name: string;
    description?: string;
    category: string;
    price: number;
    stock: number;
    active: boolean;
    sellerId?: Vendedor | string;
}

test.describe("Investigação dos filtros da API LojaQA", () => {

    test("CT01 - Produto com preço igual ao limite máximo deve aparecer", async ({ request }) => {
        const precoLimite = 289.90;

        const resposta = await request.get(
            `${APIUrl}/products?maxPrice=${precoLimite}`
        );

        expect(resposta.status()).toBe(200);

        const produtos: Produto[] = await resposta.json();

        for (const produto of produtos) {
            expect(produto.price).toBeLessThanOrEqual(precoLimite);
        }

        const teclado = produtos.find(
            (produto) => produto.name === "Teclado Mecânico Aurora RGB"
        );

        expect(teclado).toBeDefined();

        console.log("CT01 - Produtos retornados:", produtos.length);
        console.log("Teclado encontrado:", teclado?.name);
    });

    test("CT02 - Produto com preço igual ao limite mínimo deve aparecer", async ({ request }) => {
        const precoLimite = 289.90;

        const resposta = await request.get(
            `${APIUrl}/products?minPrice=${precoLimite}`
        );

        expect(resposta.status()).toBe(200);

        const produtos: Produto[] = await resposta.json();

        for (const produto of produtos) {
            expect(produto.price).toBeGreaterThanOrEqual(precoLimite);
        }

        const teclado = produtos.find(
            (produto) => produto.name === "Teclado Mecânico Aurora RGB"
        );

        expect(teclado).toBeDefined();

        console.log("CT02 - Produtos retornados:", produtos.length);
        console.log("Teclado encontrado:", teclado?.name);
    });

    test("CT03 - API deve combinar categoria e faixa de preço", async ({ request }) => {
        const respostaCompleta = await request.get(`${APIUrl}/products`);

        expect(respostaCompleta.status()).toBe(200);

        const todosProdutos: Produto[] = await respostaCompleta.json();

        const categoria = "Periféricos";
        const precoMinimo = 100;
        const precoMaximo = 300;

        const produtosEsperados = todosProdutos.filter((produto) =>
            produto.category === categoria &&
            produto.price >= precoMinimo &&
            produto.price <= precoMaximo
        );

        const respostaFiltrada = await request.get(
            `${APIUrl}/products?category=${encodeURIComponent(categoria)}&minPrice=${precoMinimo}&maxPrice=${precoMaximo}`
        );

        expect(respostaFiltrada.status()).toBe(200);

        const produtosRecebidos: Produto[] = await respostaFiltrada.json();

        const idsEsperados = produtosEsperados
            .map((produto) => produto._id)
            .sort();

        const idsRecebidos = produtosRecebidos
            .map((produto) => produto._id)
            .sort();

        expect(idsRecebidos).toEqual(idsEsperados);

        console.log("CT03 - Quantidade esperada:", idsEsperados.length);
        console.log("CT03 - Quantidade recebida:", idsRecebidos.length);
    });

    test("CT04 - API deve localizar produto por parte do nome", async ({ request }) => {
        const termoBusca = "Teclado";

        const resposta = await request.get(
            `${APIUrl}/products?search=${encodeURIComponent(termoBusca)}`
        );

        expect(resposta.status()).toBe(200);

        const produtos: Produto[] = await resposta.json();

        expect(Array.isArray(produtos)).toBe(true);
        expect(produtos.length).toBeGreaterThan(0);

        for (const produto of produtos) {
            const nome = produto.name.toLowerCase();
            const descricao = (produto.description || "").toLowerCase();
            const categoria = (produto.category || "").toLowerCase();

            const encontrouTermo =
                nome.includes(termoBusca.toLowerCase()) ||
                descricao.includes(termoBusca.toLowerCase()) ||
                categoria.includes(termoBusca.toLowerCase());

            expect(
                encontrouTermo,
                `Produto não corresponde à busca: ${produto.name}`
            ).toBe(true);
        }

        console.log("CT04 - Termo pesquisado:", termoBusca);
        console.log("CT04 - Resultados encontrados:", produtos.length);

        console.table(
            produtos.map((produto) => ({
                nome: produto.name,
                categoria: produto.category,
                preco: produto.price
            }))
        );
    });

    test("CT05 - API deve localizar produto pelo ID exato", async ({ request }) => {
        const respostaCatalogo = await request.get(`${APIUrl}/products`);

        expect(respostaCatalogo.status()).toBe(200);

        const catalogo: Produto[] = await respostaCatalogo.json();

        expect(catalogo.length).toBeGreaterThan(0);

        const produtoReferencia = catalogo[0];

        const respostaBusca = await request.get(
            `${APIUrl}/products?search=${encodeURIComponent(produtoReferencia._id)}`
        );

        expect(respostaBusca.status()).toBe(200);

        const produtosEncontrados: Produto[] = await respostaBusca.json();

        const produtoEncontrado = produtosEncontrados.find(
            (produto) => produto._id === produtoReferencia._id
        );

        expect(
            produtoEncontrado,
            "A busca pelo ID deveria retornar o produto correspondente."
        ).toBeDefined();

        console.log("CT05 - ID pesquisado:", produtoReferencia._id);
        console.log("CT05 - Produto encontrado:", produtoEncontrado!.name);
    });

    // CT06 - INVESTIGAR CONSISTÊNCIA DO ESTOQUE DO TECLADO
    test("CT06 - Investigar consistência do estoque do teclado", async ({ request }) => {

        const resposta = await request.get(`${APIUrl}/products`);

        expect(resposta.status()).toBe(200);

        const produtos: Produto[] = await resposta.json();

        const teclado = produtos.find(
            (produto) => produto.name === "Teclado Mecânico Aurora RGB"
        );

        expect(teclado).toBeDefined();

        console.log("Produto:", teclado!.name);
        console.log("ID:", teclado!._id);
        console.log("Preço:", teclado!.price);
        console.log("Estoque informado:", teclado!.stock);
        console.log("Tipo do estoque:", typeof teclado!.stock);
        console.log("Produto ativo:", teclado!.active);

        expect(typeof teclado!.stock).toBe("number");
        expect(Number.isInteger(teclado!.stock)).toBe(true);
        expect(teclado!.stock).toBeGreaterThanOrEqual(0);
        expect(teclado!.active).toBe(true);

        console.log("CT06 - Estrutura e integridade dos dados validadas.");
    });

    // CT07 - VERIFICAR CONSISTÊNCIA DO ESTOQUE ENTRE CONSULTAS
    test("CT07 - Verificar consistência do estoque entre consultas", async ({ request }) => {

        const nomeProduto = "Teclado Mecânico Aurora RGB";
        const estoques: number[] = [];

        for (let tentativa = 1; tentativa <= 3; tentativa++) {

            const resposta = await request.get(`${APIUrl}/products`);

            expect(resposta.status()).toBe(200);

            const produtos: Produto[] = await resposta.json();

            const produto = produtos.find(
                (item) => item.name === nomeProduto
            );

            expect(produto).toBeDefined();

            estoques.push(produto!.stock);

            console.log(
                `Consulta ${tentativa} - Estoque:`,
                produto!.stock
            );
        }

        expect(
            estoques[1],
            "O estoque mudou entre a primeira e a segunda consulta."
        ).toBe(estoques[0]);

        expect(
            estoques[2],
            "O estoque mudou entre a segunda e a terceira consulta."
        ).toBe(estoques[0]);

        console.log("CT07 - Estoque consistente nas três consultas.");
    });

    test("CT08 - API deve retornar lista vazia para faixa de preço impossível", async ({ request }) => {

        const precoMinimo = 300;
        const precoMaximo = 100;

        const resposta = await request.get(
            `${APIUrl}/products?minPrice=${precoMinimo}&maxPrice=${precoMaximo}`
        );

        expect(resposta.status()).toBe(200);

        const produtos: Produto[] = await resposta.json();

        expect(Array.isArray(produtos)).toBe(true);

        console.log("Preço mínimo:", precoMinimo);
        console.log("Preço máximo:", precoMaximo);
        console.log("Produtos retornados:", produtos.length);

        expect(
            produtos.length,
            "Uma faixa impossível não deveria retornar produtos."
        ).toBe(0);

        console.log("CT08 - Faixa impossível tratada corretamente.");
    });

    test("CT09 - API deve filtrar produtos pelo identificador do vendedor", async ({ request }) => {

        const respostaCatalogo = await request.get(`${APIUrl}/products`);

        expect(respostaCatalogo.status()).toBe(200);

        const catalogo: Produto[] = await respostaCatalogo.json();

        const produtoReferencia = catalogo.find(
            (produto) => produto.sellerId !== undefined
        );

        expect(produtoReferencia).toBeDefined();

        // O sellerId pode vir como objeto ou como string.
        // Aqui extraímos somente o identificador.
        const vendedorId =
            typeof produtoReferencia!.sellerId === "object"
                ? produtoReferencia!.sellerId?._id
                : produtoReferencia!.sellerId;

        expect(typeof vendedorId).toBe("string");

        // Identificamos os produtos que pertencem a esse vendedor.
        const produtosEsperados = catalogo
            .filter((produto) => {
                const idVendedor =
                    typeof produto.sellerId === "object"
                        ? produto.sellerId?._id
                        : produto.sellerId;

                return idVendedor === vendedorId;
            })
            .map((produto) => produto._id)
            .sort();

        // Consultamos a API usando o ID correto.
        const respostaFiltrada = await request.get(
            `${APIUrl}/products?sellerId=${encodeURIComponent(vendedorId!)}`
        );

        expect(respostaFiltrada.status()).toBe(200);

        const produtosRecebidos: Produto[] = await respostaFiltrada.json();

        const idsRecebidos = produtosRecebidos
            .map((produto) => produto._id)
            .sort();

        console.log("CT09 - ID do vendedor:", vendedorId);
        console.log("CT09 - Quantidade esperada:", produtosEsperados.length);
        console.log("CT09 - Quantidade recebida:", idsRecebidos.length);

        expect(
            idsRecebidos,
            "A API deve retornar somente os produtos do vendedor informado."
        ).toEqual(produtosEsperados);

        console.log("CT09 - Filtro por vendedor validado!");
    });

});
