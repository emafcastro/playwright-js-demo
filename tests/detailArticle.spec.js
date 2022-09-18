const { test, expect } = require("@playwright/test");
import { SignInAPI } from "../api/SignInAPI";
import { ArticleAPI } from "../api/ArticleAPI";
import { ArticleDetailPage } from "../pageobjects/ArticleDetailPage";
import { HomePage } from "../pageobjects/HomePage";
const article = require("../input-files/article.json");
const editArticle = require("../input-files/articleEdit.json");
const detailUser = require("../input-files/detailUser.json");
const likeUser = require("../input-files/likeUser.json");
import { getTodayDate } from "../utils/ArticleProperties";
import { ArticleFormPage } from "../pageobjects/ArticleFormPage";

test.describe("Article detail tests", () => {
    let page;
    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        page = await context.newPage();
        const signInAPI = new SignInAPI(page);
        const signInResponse = await signInAPI.signInUser(detailUser);
        expect(signInResponse.ok()).toBeTruthy();
    });
    test.describe("Tests using the author of the article", () => {
        let articleDetailPage;
        test.beforeEach(async () => {
            const articleAPI = new ArticleAPI(page);
            const articleUrl = await articleAPI.createArticle(article);
            await page.goto(articleUrl);
            articleDetailPage = new ArticleDetailPage(page);
        });
        test("Verify elements in article details are correct", async () => {
            expect(await articleDetailPage.getElementInArticle(article.title)).toBeVisible();
            expect(await articleDetailPage.getElementInArticle(article.summary)).toBeVisible();

            // There are two author elements present in the page, so the validation needs to be done against an array of elements
            await expect(articleDetailPage.authorLink).toHaveCount(2);
            await expect(articleDetailPage.authorLink).toHaveText([detailUser.username, detailUser.username]);

            // The same applies for the dates  - TODO skipped for now
            // let today = getTodayDate();
            // await expect(articleDetailPage.postDateText).toHaveText([today, today]);

            await expect(articleDetailPage.editPostButton).toHaveCount(2);
            await expect(articleDetailPage.deletePostButton).toHaveCount(2);
            await expect(articleDetailPage.followAuthorButton).not.toBeVisible();
            await expect(articleDetailPage.favoritePostButton).not.toBeVisible();

            const articleID = await articleDetailPage.getArticleID();
            let articleAPI = new ArticleAPI(page);
            await articleAPI.deleteArticle(articleID);
        });

        test("Edit an article", async () => {
            await articleDetailPage.editPostButton.first().click();
            const articleFormPage = new ArticleFormPage(page);
            await articleFormPage.completeForm(editArticle, "EDIT");

            expect(await articleDetailPage.getElementInArticle(editArticle.title)).toBeVisible();
            expect(await articleDetailPage.getElementInArticle(editArticle.summary)).toBeVisible();

            const articleID = await articleDetailPage.getArticleID();
            let articleAPI = new ArticleAPI(page);
            await articleAPI.deleteArticle(articleID);
        });

        test("Delete an article", async () => {
            page.on("dialog", (dialog) => dialog.accept());
            await articleDetailPage.deletePostButton.first().click();
            const homePage = new HomePage(page);
            expect(await homePage.getFirstPostTitle()).not.toBe(editArticle.title);
        });
    });

    test.describe("Tests using a different role", () => {
        let articleURL;
        let articleDetailPage;
        test.beforeEach(async () => {
            const articleAPI = new ArticleAPI(page);
            articleURL = await articleAPI.createArticle(article);
            await page.context().clearCookies();
            articleDetailPage = new ArticleDetailPage(page);
        });

        test.afterEach(async () => {
            await page.context().clearCookies();
            const signInAPI = new SignInAPI(page);
            const signInResponse = await signInAPI.signInUser(detailUser);
            expect(signInResponse.ok()).toBeTruthy();
            await page.goto(articleURL);
            const articleID = await articleDetailPage.getArticleID();
            let articleAPI = new ArticleAPI(page);
            await articleAPI.deleteArticle(articleID);
        });

        test("Verify elements with logged out user", async () => {
            await page.goto(articleURL);
            expect(await articleDetailPage.getElementInArticle(article.title)).toBeVisible();
            expect(await articleDetailPage.getElementInArticle(article.summary)).toBeVisible();

            // There are two author elements present in the page, so the validation needs to be done against an array of elements
            await expect(articleDetailPage.authorLink).toHaveCount(2);
            await expect(articleDetailPage.authorLink).toHaveText([detailUser.username, detailUser.username]);

            // The same applies for the dates - TODO skipped for now
            // let today = getTodayDate(); // May fail if the article date is different
            // await expect(articleDetailPage.postDateText).toHaveText([today, today]);

            await expect(articleDetailPage.followAuthorButton).toBeVisible();
            await expect(articleDetailPage.favoritePostButton).toBeVisible();
            await expect(articleDetailPage.editPostButton).not.toBeVisible();
            await expect(articleDetailPage.deletePostButton).not.toBeVisible();
        });

        test("Follow author with different user", async () => {
            const signInAPI = new SignInAPI(page);
            const signInResponse = await signInAPI.signInUser(likeUser);
            expect(signInResponse.ok()).toBeTruthy();
            await page.goto(articleURL);
            await articleDetailPage.followAuthorButton.click();
            await articleDetailPage.waitForCallsMade();
            await expect(articleDetailPage.followAuthorButton).toHaveClass(/btn-outline-secondary/);
        });

        test("Favorite article with different user", async () => {
            const signInAPI = new SignInAPI(page);
            const signInResponse = await signInAPI.signInUser(likeUser);
            expect(signInResponse.ok()).toBeTruthy();
            await page.goto(articleURL);
            await articleDetailPage.favoritePostButton.click();
            await articleDetailPage.waitForCallsMade();
            await expect(articleDetailPage.favoritePostButton).toHaveClass(/btn-outline-secondary/);
        });
    });
});
