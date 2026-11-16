# LojaQA — Automação de Testes E2E e API

Projeto de automação de testes desenvolvido com **Playwright e TypeScript**, com foco no Módulo 03 — **Carrinho de Compras e Limite de Estoque** da aplicação LojaQA.

O projeto contempla testes automatizados de interface (E2E) e testes de API, além de verificações complementares em serviços externos.

## Integrantes

- Ricardo Alexandre
- Heveny Gomes

## Repositório

[GitHub — LojaQA Carrinho Playwright](https://github.com/RicardoIrmao/lojaqa-carrinho-playwright)

## Objetivo do projeto

Desenvolver e executar testes automatizados para avaliar o funcionamento do carrinho de compras, incluindo adição de produtos, alteração de quantidades, atualização dos valores e respeito aos limites de estoque.

Também são realizados testes de API para verificar respostas HTTP, estrutura dos dados, filtros, categorias, integridade das informações e tratamento de parâmetros inválidos.

## Tecnologias utilizadas

- Node.js
- TypeScript
- Playwright
- API REST
- Git e GitHub

## Estrutura do projeto

```text
carrinho-drawer-limite-estoque/
│
├── data/
│   └── login.data.ts
│
├── fixtures/
│   ├── auth.fixture.ts
│   └── loja.fixture.ts
│
├── pages/
│   ├── login.page.ts
│   └── loja.page.ts
│
├── presentation/
│   └── README.md
│
├── tests/
│   ├── api/
│   │   ├── apiLojaQA.spec.ts
│   │   ├── busca-produtos.spec.ts
│   │   ├── categorias.spec.ts
│   │   ├── contrato-produtos.spec.ts
│   │   ├── filtro-preco.spec.ts
│   │   ├── filtros-combinados.spec.ts
│   │   ├── parametros-invalidos.spec.ts
│   │   └── viacep.spec.ts
│   │
│   └── e2e/
│       ├── carrinho-lojaqa.spec.ts
│       ├── filtro-preco.spec.ts
│       ├── login-lojaqa-e2e.spec.ts
│       ├── login.spec.ts
│       ├── loginDataDriven.spec.ts
│       └── loginPOM.spec.ts
│
├── utils/
│   └── helpers.ts
│
├── loja.html
├── loja.js
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tsconfig.json
├── .gitignore
└── README.md
```

## Escopo dos testes E2E

O foco principal dos testes de interface é o Módulo 03 — Carrinho de Compras e Limite de Estoque.

Os cenários contemplam:

- Adição de produtos ao carrinho.
- Aumento da quantidade de produtos.
- Redução da quantidade de produtos.
- Recálculo do subtotal conforme a quantidade.
- Remoção do produto quando a quantidade chega a zero.
- Respeito ao limite de estoque disponível.

### Testes E2E complementares

Também foram executados testes na aplicação externa SauceDemo, contemplando:

- Login com credenciais válidas.
- Tentativa de login com credenciais inválidas.

Esses cenários são complementares e não representam o foco principal do projeto.

## Escopo dos testes de API

Os testes da API da LojaQA contemplam:

- Consulta ao catálogo de produtos.
- Validação da estrutura dos dados retornados.
- Consulta às categorias.
- Busca de produtos.
- Aplicação de filtros por preço e categoria.
- Combinação de filtros.
- Verificação da integridade dos dados.
- Investigação do comportamento diante de parâmetros inválidos.

### Teste de API externa — ViaCEP

Foram implementados dois cenários de integração com a API pública ViaCEP:

- Consulta de um CEP válido, verificando os dados de endereço retornados.
- Consulta de um CEP inexistente, verificando o tratamento informado pela API.

## Arquitetura de automação

O projeto utiliza o padrão **Page Object Model (POM)** para organizar as interações com a aplicação.

Essa abordagem separa os elementos e as ações da interface dos arquivos de testes, facilitando a manutenção, a reutilização de métodos e a organização do código.

Também são utilizadas fixtures do Playwright para preparar os cenários de teste e disponibilizar objetos e condições necessários à execução.

Os arquivos de dados e helpers auxiliam na organização e reutilização de informações e funções.

## Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

- [Node.js](https://nodejs.org/) — versão 18 ou superior recomendada.
- npm — instalado junto com o Node.js.
- [Git](https://git-scm.com/).
- Visual Studio Code (opcional, recomendado).

## Como executar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/RicardoIrmao/lojaqa-carrinho-playwright.git
```

### 2. Acessar a pasta

```bash
cd lojaqa-carrinho-playwright
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Instalar o navegador Chromium

```bash
npx playwright install chromium
```

## Comandos de execução

### Executar todos os testes

```bash
npm test
```

### Executar os testes E2E

```bash
npm run test:e2e
```

### Executar os testes de API

```bash
npm run test:api
```

### Executar os testes do carrinho

```bash
npx playwright test tests/e2e/carrinho-lojaqa.spec.ts --workers=1
```

### Executar os testes do carrinho com o navegador visível

```bash
npx playwright test tests/e2e/carrinho-lojaqa.spec.ts --headed --workers=1
```

### Executar os testes da API externa ViaCEP

```bash
npx playwright test tests/api/viacep.spec.ts --workers=1
```

### Executar os testes E2E externos no SauceDemo

```bash
npx playwright test tests/e2e/login.spec.ts --headed --workers=1
```

### Abrir o relatório HTML

```bash
npm run report
```

## Investigação de defeitos

Durante a execução e investigação dos testes, foram identificados comportamentos que merecem atenção.

### 1. Filtro de preço na interface

Foi observado que a condição de comparação do preço máximo utiliza o operador `<`, excluindo produtos cujo preço é exatamente igual ao valor informado.

A comparação esperada para incluir o limite informado seria `<=`.

O cenário foi reproduzido durante a execução dos testes E2E, evidenciando uma divergência entre o comportamento esperado e o apresentado pela interface.

### 2. Parâmetros inválidos na API

Durante a investigação dos filtros, foi observado que o envio de valores não numéricos em parâmetros de preço, como `maxPrice=abc` e `minPrice=abc`, pode resultar em resposta HTTP 500.

Esse comportamento indica uma oportunidade de melhoria na validação dos parâmetros recebidos pela API e no tratamento de erros.

Os comportamentos identificados foram documentados como resultados da investigação, sem alterações no código-fonte da aplicação avaliada.

## Considerações finais

O projeto tem como objetivo aplicar conceitos de qualidade de software e automação de testes, utilizando Playwright e TypeScript para validar comportamentos da interface e da API.

A atividade proporciona experiência prática com organização de projetos, arquitetura POM, fixtures, execução de testes automatizados, análise de resultados, investigação de defeitos e versionamento de código com Git e GitHub.
