const selectors = require("./selectors.json");

export class NavBarPage{
    constructor(page){
        this.page = page;
        this.homeLink = page.locator(selectors.navbar.homeLink);
        this.newArticleLink = page.locator(selectors.navbar.newArticleLink);
        this.settingsLink = page.locator(selectors.navbar.settingsLink);
        this.profileLink = page.locator(selectors.navbar.profileLink);
        this.signInLink = page.locator(selectors.navbar.signInLink);
        this.signOutLink = page.locator(selectors.navbar.signOutLink);
        this.searchInput = page.locator(selectors.navbar.searchInput);
        this.searchButton = page.locator(selectors.navbar.searchButton);
    }

    async goTo(){
        await this.page.goto("/");
    }

    async goToSignInPage(){
        await this.signInLink.click();
        await this.page.waitForLoadState("networkidle");
    }

    async goToNewArticlePage(){
        await this.newArticleLink.click();
        await this.page.waitForLoadState("networkidle");
    }

    async isUserLoggedIn(){
        await this.page.waitForLoadState("networkidle")
        return await this.signOutLink.isVisible();
    }
}