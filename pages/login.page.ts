
import { Page, Locator } from "@playwright/test";

// ======================================================
// LOGIN DA APLICAÇÃO SAUCEDEMO
// ======================================================

export class SauceDemoLoginPage {
    readonly page: Page;
    readonly alert: Locator;

    constructor(page: Page) {
        this.page = page;
        this.alert = page.getByRole("alert");
    }

    async acessarSite() {
        await this.page.goto("https://www.saucedemo.com/");
    }

    async login(username: string, password: string) {
        await this.page.locator("#user-name").fill(username);
        await this.page.getByLabel("Password").fill(password);
        await this.page.locator("#login-button").click();
    }
}

// ======================================================
// LOGIN DA APLICAÇÃO LOJAQA
// ======================================================

export class LojaQALoginPage {
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    readonly statusMessage: Locator;
    readonly credentialsBox: Locator;

    constructor(private page: Page) {
        this.emailInput = page.locator("#email");
        this.passwordInput = page.locator("#password");
        this.loginButton = page.locator("#loginBtn");
        this.errorMessage = page.locator("#errorMessage");
        this.statusMessage = page.locator("#statusMessage");
        this.credentialsBox = page.locator(".credentials-info");
    }

    async goto() {
        await this.page.goto(
            "https://alisonmelo.github.io/tioalison-pe-t4-fap26/projetos-base/01-sistema-login/login.html"
        );
    }

    async login(username: string, password: string) {
        await this.emailInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async fillEmail(email: string) {
        await this.emailInput.fill(email);
    }

    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async clickSubmit() {
        await this.loginButton.click();
    }
}
