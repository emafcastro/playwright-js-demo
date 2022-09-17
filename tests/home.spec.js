import { test, expect } from "@playwright/test";

test.describe("Home tests", () => {

    test.beforeAll(() => {
        // Log in user. TODO: Create new homeUser
    });

    test("should be able to see my feed", async () => {
        // Check all articles in my feed belong to the logged user
    });

    test("should be able to like an Article with a different user", async () => {
        // Create a new article and like it with another user
    });

    test("should be able to verify if the count of articles decreases when an article is deleted", async () => {
        // create and delete an article, checking before and after the length of the list of articles
    });

    test("should be able to filter by tag", async () => {
        // This test create a new article with a different tag, then verify the filter by tag
    });

    test("should be able to log out", async () => {
        // Sign out and check the user is no longer logged in
    });

    test("should be able to search for articles", async () => {
        // Create two different articles and search one, the results should at least bring up the created article
    });

    test("should be able to see message when no articles are found", async () => {
        // Create an article and search for a different criteria, the message "No article found" should be displayed
    });

    test("should be able to access all links in navbar", async () => {
        // Click all links by one and check the url is correct
    });
});