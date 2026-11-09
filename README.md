# LojaQA — Automação de Testes E2E e API

Projeto de automação de testes desenvolvido com **Playwright e TypeScript**, com foco no Módulo 03 — **Carrinho de Compras e Limite de Estoque** da aplicação LojaQA.

## Integrantes

- Ricardo Alexandre
- Heveny Gomes

## Objetivo do projeto

Desenvolver e executar testes automatizados para verificar o funcionamento do carrinho de compras, o controle de quantidades e a integridade das informações disponibilizadas pela API.

## Tecnologias utilizadas

- Node.js
- TypeScript
- Playwright
- API REST
- Git e GitHub

## Escopo dos testes

### Testes E2E — Interface

Os testes verificam:

- Adição de produtos ao carrinho.
- Aumento da quantidade de produtos.
- Redução da quantidade de produtos.
- Atualização do subtotal.
- Remoção do produto quando a quantidade chega a zero.
- Respeito ao limite de estoque disponível.

### Testes de API

Os testes verificam:

- Consulta do catálogo de produtos.
- Consulta das categorias.
- Busca de produtos.
- Aplicação de filtros de preço.
- Combinação de filtros.
- Validação da estrutura dos dados.
- Integridade das informações de estoque.
- Comportamento diante de parâmetros inválidos.

## Estrutura do projeto

```text
carrinho-drawer-limite-estoque/
├── data/
├── fixtures/
├── pages/
├── presentation/
├── tests/
│   ├── api/
│   └── e2e/
├── utils/
├── .gitignore
├── package.json
├── playwright.config.ts
├── README.md
└── tsconfig.json
```

## Pré-requisitos

Para executar o projeto, é necessário ter instalado:

- Node.js
- npm
- Git

## Instalação

Clone o repositório e entre na pasta do projeto:

```bash
git clone URL_DO_REPOSITORIO
cd carrinho-drawer-limite-estoque
```

Instale as dependências:

```bash
npm install
```

Instale o navegador Chromium utilizado pelo Playwright:

```bash
npx playwright install chromium
```

## Executando os testes

Executar todos os testes:

```bash
npm test
```

Executar somente os testes E2E:

```bash
npm run test:e2e
```

Executar somente os testes de API:

```bash
npm run test:api
```

Executar os testes específicos do carrinho:

```bash
npm run test:carrinho
```

Executar o teste do carrinho com o navegador visível:

```bash
npx playwright test tests/e2e/carrinho-lojaqa.spec.ts --headed --workers=1 --retries=0
```

## Relatório de testes

Após a execução, o relatório HTML pode ser aberto com:

```bash
npm run report
```

## Investigação de comportamentos

Durante a investigação foram identificados comportamentos que merecem atenção:

- **Filtro de preço na interface:** foi observado que um produto com preço exatamente igual ao limite máximo informado não aparece na vitrine.
- **Parâmetros inválidos na API:** consultas com valores não numéricos para filtros de preço retornaram erro HTTP 500.

Esses cenários foram registrados como oportunidades de melhoria e validação da aplicação.

## Considerações finais

O projeto permite praticar conceitos de automação de testes E2E e API, organização de código com TypeScript, utilização do Playwright e aplicação do padrão Page Object Model (POM).

A proposta é demonstrar como testes automatizados podem contribuir para identificar falhas, verificar regras de negócio e aumentar a confiabilidade de uma aplicação.