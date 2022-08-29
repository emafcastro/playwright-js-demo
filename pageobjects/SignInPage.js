const selectors = require("../selectors.json");

export class SignInPage {
    constructor(page) {
        this.page = page;
        this.emailInput = page.locator(selectors.signin.emailInput);
        this.passwordInput = page.locator(selectors.signin.passwordInput);
        this.signInButton = page.locator(selectors.signin.signInButton);
        this.errorMessagesText = page.locator(selectors.signin.errorMessagesText);
    }

    async goTo() {
        await this.page.goto("/login/");
    }

    async signInWithCredentials(email, password) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signInButton.click();
        return this.page;
    }
}