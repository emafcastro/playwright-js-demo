const { test, expect } = require("@playwright/test");
const { generateEmailForCharacters } = require("./../utils/TextGenerator");
import { SignInPage } from "../pageobjects/SignInPage";
import { NavBarPage } from "../pageobjects/NavBarPage";
const signInUser = require("../input-files/signInUser.json");

test.describe("Login access", () => {
    test("Expected url", async ({ page }) => {
        // Verification of access to correct url
        const navBarPage = new NavBarPage(page);
        await navBarPage.goTo();
        await navBarPage.goToSignInPage();
        await expect(page).toHaveURL("https://realworld-djangoapp.herokuapp.com/login/");
    });
});

test.describe("Login tests", () => {
    let signInPage;
    test.beforeEach(async ({ page }) => {
        // Access directly to sign in page before each test
        signInPage = new SignInPage(page);
        await signInPage.goTo();
    });

    test.describe("Valid interactions in Sign In", () => {
        test("Valid Credentials", async () => {
            // Sign in with valid credentials and verification that the user is logged in
            let page = await signInPage.signInWithCredentials(signInUser.email, signInUser.password);
            const userIsLoggedIn = await new NavBarPage(page).isUserLoggedIn();
            expect(userIsLoggedIn).toBeTruthy();
        });

        test("Required fields", async () => {
            // Verification of required attribute in fields
            await expect(signInPage.emailInput).toHaveAttribute("required", "");
            await expect(signInPage.passwordInput).toHaveAttribute("required", "");
        });
    });

    test.describe("Forcing validations and fields limitations", () => {
        test("Verify limit of email field", async () => {
            // Verification of limit in email field
            let emailTest = generateEmailForCharacters(254);
            let newEmail = emailTest + "morecharacters";

            await signInPage.emailInput.fill(emailTest);
            await expect(signInPage.emailInput).toHaveValue(emailTest);

            await signInPage.emailInput.fill(newEmail);
            await expect(signInPage.emailInput).toHaveValue(emailTest);
        });

        // Parametrized test
        const invalidOptions = [
            {
                type: "empty required field",
                email: " ",
                password: "Test1234",
                errorMessage: "* This field is required."
            },
            {
                type: "incorrect credentials",
                email: "automation@test.com",
                password: "Test",
                errorMessage: "* Please enter a correct Email Address and password. Note that both fields may be case-sensitive."
            }
        ]
        for(const option of invalidOptions){
            test("Verify error message with " + option.type, async () => {
                await signInPage.signInWithCredentials(option.email, option.password);
                await expect(signInPage.errorMessagesText).toBeVisible();
                await expect(signInPage.errorMessagesText).toHaveText(option.errorMessage);
            });
        }
    });
});