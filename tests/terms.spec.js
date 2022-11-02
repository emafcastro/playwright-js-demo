import { test, expect } from "@playwright/test";
import { SignInAPI } from "../api/SignInAPI";
import contactUser from "../input-files/contactUser.json";
import { TermsPage } from "../pageobjects/TermsPage";
import { NavBarPage } from "../pageobjects/NavBarPage";
import { ContactUsPage } from "../pageobjects/ContactUsPage";

test.describe("Terms page tests", () => {
    let page;
    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        page = await context.newPage();
        const signInAPI = new SignInAPI(page);
        const signInResponse = await signInAPI.signInUser(contactUser);
        expect(signInResponse.ok()).toBeTruthy();
    });

    test.only("Verify correct access", async () => {
        const navBarPage = new NavBarPage(page);
        await navBarPage.goTo();
        await navBarPage.goToContactUsPage();
        const contactUsPage = new ContactUsPage(page);
        let newPage = await contactUsPage.goToTermsPage();
        const termsPage = new TermsPage(newPage);
        expect(await termsPage.title.textContent()).toBe("Terms and Conditions");

    });

    test("Take screenshot of page", async () => {
        const termsPage = new TermsPage(page);
        await termsPage.goTo();
        await page.screenshot({ path: "screenshots/terms-page.png", fullPage: true });
    });
});
