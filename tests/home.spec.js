import { test, expect } from "@playwright/test";
import { SignInAPI } from "../api/SignInAPI";
import { ArticleAPI } from "../api/ArticleAPI";
const homeUser = require("../input-files/homeUser.json");
const likeUser = require("../input-files/likeUser.json");
const article = require("../input-files/article.json");
const editedArticle = require("../input-files/articleEdit.json");
import { NavBarPage } from "../pageobjects/NavBarPage";
import { HomePage } from "../pageobjects/HomePage";
import { getIDFromURL } from "../utils/ArticleProperties";

test.describe("Home tests", () => {
    let page;
    test.beforeAll(async ({ browser }) => {
        // Log in user.
        const context = await browser.newContext();
        page = await context.newPage();
        const signInAPI = new SignInAPI(page);
        const signInResponse = await signInAPI.signInUser(homeUser);
        expect(signInResponse.ok()).toBeTruthy();
    });

    test.describe("Involving article creation as precondition", () => {
        let articleAPI;
        let articleURL;

        test.beforeEach(async () => {
            // Create an article before each test
            articleAPI = new ArticleAPI(page);
            articleURL = await articleAPI.createArticle(article);
        });

        test.afterEach(async () => {
            // Clear cookies and signin with homeUser
            await page.context().clearCookies();
            const signInAPI = new SignInAPI(page);
            const signInResponse = await signInAPI.signInUser(homeUser);
            expect(signInResponse.ok()).toBeTruthy();
            // Delete the created article
            let articleID = getIDFromURL(articleURL);
            await articleAPI.deleteArticle(articleID);
        });

        test("should be able to see my feed", async () => {
            // Check all articles in 'my feed' belong to the logged user
            const navBarPage = new NavBarPage(page);
            await navBarPage.goTo();
            const homePage = new HomePage(page);
            await homePage.yourFeedLink.click();
            expect(
                await homePage.allAuthorLinksHaveText(homeUser.username)
            ).toBeTruthy();
        });

        test("should be able to like an Article with a different user", async () => {
            // Create a new article and like it with another user
            await page.context().clearCookies();
            const signInAPI = new SignInAPI(page);
            const signInResponse = await signInAPI.signInUser(likeUser);
            expect(signInResponse.ok()).toBeTruthy();
            const navBarPage = new NavBarPage(page);
            await navBarPage.goTo();
            const homePage = new HomePage(page);
            const firstPostLikeButton = await homePage.getFirstPostLikeButton();
            firstPostLikeButton.click();
            await page.waitForLoadState("networkidle");
            await expect(firstPostLikeButton).toHaveClass(/btn-outline-secondary/);
        });

        test("should be able to see message when no articles are found", async () => {
            // Create an article and search for a different criteria, the message "No article found" should be displayed
            const navBarPage = new NavBarPage(page);
            await navBarPage.goTo();
            await navBarPage.searchArticle("Nonexistent");
            const homePage = new HomePage(page);
            await expect(homePage.noArticlesFoundText).toBeVisible();
            await expect(homePage.noArticlesFoundText).toHaveText("No articles found");
        });

        test("should hide article headers when searching and display it when clearing results", async () => {
            const navBarPage = new NavBarPage(page);
            await navBarPage.goTo();
            await navBarPage.searchArticle("Test");
            const homePage = new HomePage(page);
            await expect(homePage.yourFeedLink).not.toBeVisible();
            await expect(homePage.globalFeedLink).not.toBeVisible();
            await expect(homePage.clearResultsLink).toBeVisible();
            await homePage.clearResultsLink.click();
            await expect(homePage.yourFeedLink).toBeVisible();
            await expect(homePage.globalFeedLink).toBeVisible();
            await expect(homePage.clearResultsLink).not.toBeVisible();
        });
    });

    test.describe("tests creating two articles", () => {
        let articleAPI;
        let firstArticleURL;
        let secondArticleURL;
        test.beforeEach(async () => {
            // Create an article before each test
            articleAPI = new ArticleAPI(page);
            firstArticleURL = await articleAPI.createArticle(article);
            secondArticleURL = await articleAPI.createArticle(editedArticle);
        });

        test("should be able to search for articles", async () => {
            // Create two different articles and search one, the results should at least bring up the created article
            const navBarPage = new NavBarPage(page);
            await navBarPage.goTo();
            await navBarPage.searchArticle("Edited");
            const homePage = new HomePage(page);
            expect(await homePage.getFirstPostTitle()).toBe(editedArticle.title);
        });

        test("should be able to verify if the count of articles decreases when an article is deleted", async () => {
            // create and delete an article, checking before and after the length of the list of articles
        });

        test("should be able to filter by tag", async () => {
            // This test create a new article with a different tag, then verify the filter by tag
        });

        test.afterEach(async () => {
            // Clear cookies and signin with homeUser
            await page.context().clearCookies();
            const signInAPI = new SignInAPI(page);
            const signInResponse = await signInAPI.signInUser(homeUser);
            expect(signInResponse.ok()).toBeTruthy();
            // Delete the created article
            let firstArticleID = getIDFromURL(firstArticleURL);
            await articleAPI.deleteArticle(firstArticleID);
            let secondArticleID = getIDFromURL(secondArticleURL);
            await articleAPI.deleteArticle(secondArticleID);
        });
    });

    test("should be able to log out", async () => {
        // Sign out and check the user is no longer logged in
        const navBarPage = new NavBarPage(page);
        await navBarPage.goTo();
        await navBarPage.usernameLink.hover();
        await navBarPage.signOutLink.click();
        await expect(navBarPage.signUpLink).toBeVisible();
        
    });

    test("should be able to access all links in navbar", async () => {
        // Click all links by one and check the url is correct
    });
});
