import selectors from "./selectors.json";
import signInUser from "../input-files/signInUser.json";

export class NavBarPage{
    constructor(page){
        this.page = page;
        this.homeLink = page.locator(selectors.navbar.homeLink);
        this.newArticleLink = page.locator(selectors.navbar.newArticleLink);
        this.settingsLink = page.locator(selectors.navbar.settingsLink);
        this.signInLink = page.locator(selectors.navbar.signInLink);
        this.signOutLink = page.locator(selectors.navbar.signOutLink);
        this.signUpLink = page.locator(selectors.navbar.signUpLink);
        this.searchInput = page.locator(selectors.navbar.searchInput);
        this.searchButton = page.locator(selectors.navbar.searchButton);
        this.usernameLink = page.locator(selectors.navbar.usernameLink);
        this.contactUsLink = page.locator(selectors.navbar.contactUsLink);
    }

    async goTo(){
        await this.page.goto("/");
    }

    async refresh(){
        await this.page.reload();
    }

    async goToSignInPage(){
        await this.signInLink.click();
        await this.page.waitForLoadState("networkidle");
    }

    async goToNewArticlePage(){
        await this.newArticleLink.click();
        await this.page.waitForLoadState("networkidle");
    }

    async goToSettingsPage(){
        await this.settingsLink.click();
        await this.page.waitForLoadState("networkidle");
    }

    async goToProfilePage(){
        await this.usernameLink.click();
        await this.page.waitForLoadState("networkidle");
    }

    async goToHomePage(){
        await this.homeLink.click();
        await this.page.waitForLoadState("networkidle");
    }

    async goToContactUsPage(){
        await this.usernameLink.hover();
        await this.contactUsLink.click();
        await this.page.waitForLoadState("networkidle");
    }

    async goToSignUpPage(){
        await this.signUpLink.click();
        await this.page.waitForLoadState("networkidle");
    }

    async signOutUser(){
        await this.usernameLink.hover();
        await this.signOutLink.click();
        await this.page.waitForLoadState("networkidle");
    }

    async isUserLoggedIn(){
        await this.page.waitForLoadState("networkidle")
        return await this.usernameLink.isVisible();
    }

    async searchArticle(criteria){
        await this.searchInput.fill(criteria);
        await this.searchButton.click();
        await this.page.waitForLoadState("networkidle");
    }
}