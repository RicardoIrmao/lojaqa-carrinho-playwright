
import { test as base, expect, Page } from "@playwright/test";
import { LojaQALoginPage as LoginPage } from "../pages/login.page";

type AuthFixture = {
    loginPage: LoginPage;
    loggedPage: Page;
};

export const test = base.extend<AuthFixture>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await use(loginPage);
    },

    loggedPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();

        await loginPage.login(
            "admin@system.com",
            "AdminPassword123"
        );

        await page.waitForURL(/painel.*html/);
        await use(page);
    }
});

export { expect };
