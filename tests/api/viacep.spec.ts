
import { test, expect } from "@playwright/test";

test.describe("API externa - ViaCEP", () => {

    test("CT-EXT-API-01 - Consultar CEP válido", async ({ request }) => {

        const response = await request.get(
            "https://viacep.com.br/ws/01001000/json/"
        );

        const dados = await response.json();

        console.log("\n========== VIA CEP - CEP VÁLIDO ==========");
        console.log("Status HTTP:", response.status());
        console.log("CEP:", dados.cep);
        console.log("Logradouro:", dados.logradouro);
        console.log("Bairro:", dados.bairro);
        console.log("Cidade:", dados.localidade);
        console.log("UF:", dados.uf);

        expect(response.status()).toBe(200);

        expect(dados).toMatchObject({
            cep: "01001-000",
            logradouro: "Praça da Sé",
            bairro: "Sé",
            localidade: "São Paulo",
            uf: "SP"
        });

        console.log("CT-EXT-API-01: Consulta válida aprovada!");
    });

    test("CT-EXT-API-02 - Consultar CEP inexistente", async ({ request }) => {

        const response = await request.get(
            "https://viacep.com.br/ws/00000000/json/"
        );

        const dados = await response.json();

        console.log("\n========== VIA CEP - CEP INEXISTENTE ==========");
        console.log("Status HTTP:", response.status());
        console.log("Resposta:", dados);

        expect(response.status()).toBe(200);

        // O ViaCEP retorna o campo erro como texto: "true"
        expect(dados.erro).toBe("true");

        console.log("CT-EXT-API-02: Tratamento de CEP inexistente aprovado!");
    });

});
