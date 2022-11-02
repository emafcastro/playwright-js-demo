import selectors from "./selectors.json";

export class TermsPage {
    constructor(page) {
        this.page = page;
        this.title = page.locator(selectors.terms.title);
    }

    async goTo() {
        await this.page.goto("/terms/");
    }
}
