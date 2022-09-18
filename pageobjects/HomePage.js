const selectors = require("./selectors.json");

export class HomePage {
    constructor(page) {
        this.page = page;
        this.yourFeedLink = page.locator(selectors.home.yourFeedLink);
        this.posts = page.locator(selectors.home.posts);
        this.globalFeedLink = page.locator(selectors.home.globalFeedLink);
        this.authorLinks = page.locator(selectors.home.authorLinks);
        this.favoriteButtons = page.locator(selectors.home.favoriteButtons);
        this.popularTagsSection = page.locator(
            selectors.home.popularTagsSection
        );
    }

    async getFirstPostTitle() {
        return this.posts.first().locator(".preview-link > h1").textContent();
    }

    async getFirstPostLikeButton() {
        return this.posts.first().locator(".article-meta > button");
    }

    async allAuthorLinksHaveText(text) {
        let answer = true;
        const linksTexts = await this.authorLinks.allTextContents();
        for (let authorName of linksTexts) {
            if (authorName !== text) {
                answer = false;
            }
        }
        return answer;
    }
}
