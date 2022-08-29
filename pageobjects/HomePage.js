const selectors = require("./selectors.json");

export class HomePage{
    constructor(page){
        this.page = page;
        this.yourFeedLink = page.locator(selectors.home.yourFeedLink);
        this.posts = page.locator(selectors.home.posts);
    }

    async getFirstPostTitle(){
        return this.posts.first().locator(".preview-link > h1").textContent();
    }
}