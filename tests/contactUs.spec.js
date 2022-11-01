import {test, expect} from "@playwright/test";
import {SignInAPI} from "../api/SignInAPI";
import contactDetails from "../input-files/contactDetails.json";
import contactUser from "../input-files/contactUser.json";
import { ContactUsPage } from "../pageobjects/ContactUsPage";
import {NavBarPage} from "../pageobjects/NavBarPage";


test.describe("Contact Us Tests", () => {
    let page;
    test.beforeAll(async ({browser}) => {
        const context = await browser.newContext();
        page = await context.newPage();
        const signInAPI = new SignInAPI(page);
        const signInResponse = await signInAPI.signInUser(contactUser);
        expect(signInResponse.ok()).toBeTruthy();
    });

    test("Form fill with correct data", async () => {
        const navBarPage = new NavBarPage(page);
        await navBarPage.goTo();
        await navBarPage.goToContactUsPage();
        const contactUsPage = new ContactUsPage(page);
        await contactUsPage.completeContactForm(contactDetails);
        await expect(page).toHaveURL("/");
    });
})