import { test, expect } from "@playwright/test";
import { NavBarPage } from "../pageobjects/NavBarPage";
import { ArticleFormPage } from "../pageobjects/ArticleFormPage";
import { ArticleDetailPage } from "../pageobjects/ArticleDetailPage";
import { SignInAPI } from "../api/SignInAPI";
import { maketoken } from "../utils/TextGenerator";
import { ArticleAPI } from "../api/ArticleAPI";
import article from "../input-files/article.json";
import articleOptionals from "../input-files/articleOptionals.json";
import authorUser from "../input-files/authorUser.json";
import config from "../playwright.config";

test.describe("Article tests", () => {
    let page;
    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        page = await context.newPage();
        const signInAPI = new SignInAPI(page);
        const signInResponse = await signInAPI.signInUser(authorUser);
        expect(signInResponse.ok()).toBeTruthy();
    });
    test.describe("Access", () => {
        test("Verify correct access", async () => {
            const navBarPage = new NavBarPage(page);
            await navBarPage.goTo();
            await navBarPage.goToNewArticlePage();
            expect(page).toHaveURL(`${config.use.baseURL}/new/`);
        });
    });
    test.describe("Article creation tests", () => {
        let articleFormPage;
        test.beforeEach(async () => {
            articleFormPage = new ArticleFormPage(page);
            await articleFormPage.goTo();
        });

        test("Create an article with valid data", async () => {
            await articleFormPage.completeForm(article, "ADD");
            const articleDetailPage = new ArticleDetailPage(page);
            expect(await articleDetailPage.titleText.textContent()).toBe(article.title);
            const articleID = await articleDetailPage.getArticleID();
            let articleAPI = new ArticleAPI(page);
            await articleAPI.deleteArticle(articleID);
        });

        for (const optional of articleOptionals) {
            test("Create article with " + optional.type, async () => {
                await articleFormPage.completeForm(optional, "ADD");
                const articleDetailPage = new ArticleDetailPage(page);
                expect(await articleDetailPage.titleText.textContent()).toBe(optional.title);
                const articleID = await articleDetailPage.getArticleID();
                let articleAPI = new ArticleAPI(page);
                await articleAPI.deleteArticle(articleID);
            });
        }

        test("Title field is required", async () => {
            expect(articleFormPage.titleInput).toHaveAttribute("required", "");
        });
        // Create article with different options
        test("Autocomplete tags", async () => {
            await articleFormPage.tagsInput.type("testTag", {delay: 100});
            await expect(await articleFormPage.getSuggestedTagList()).toContainText(["testTag"]);
        });
    });
    test.describe("Invalid interactions", () => {
        let articleFormPage;
        test.beforeEach(async () => {
            articleFormPage = new ArticleFormPage(page);
            await articleFormPage.goTo();
        });
        test("should not allow to create an article with empty spaces on the title", async () => {
            await articleFormPage.titleInput.fill("  ");
            await articleFormPage.publishArticleButton.click();
            await expect(articleFormPage.errorMessagesText).toHaveText("* This field is required.");
        });
        test("should not autocomplete tags if there are not matching tags", async () => {
            await articleFormPage.tagsInput.type("sarasa", {delay: 100});
            await expect(articleFormPage.suggestedTagSection).not.toBeVisible();
        });
        test("should allow it add only 120 characters in title field", async () => {
            const textTitle = maketoken(120);
            await articleFormPage.titleInput.fill(textTitle);
            await expect(articleFormPage.titleInput).toHaveValue(textTitle);
            const newTextTitle = textTitle + "morecharacters";
            await articleFormPage.titleInput.fill(newTextTitle);
            await expect(articleFormPage.titleInput).toHaveValue(textTitle);
        });
    });
});
