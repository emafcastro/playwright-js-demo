const selectors = require("./selectors.json");

export class ArticleDetailPage{
    constructor(page){
        this.page = page;
        this.titleText = this.page.locator(selectors["article-detail"].titleText);
        this.authorLink = this.page.locator(selectors["article-detail"].authorLink);
        this.postDateText = this.page.locator(selectors["article-detail"].postDateText);
        this.followAuthorButton = this.page.locator(selectors["article-detail"].followAuthorButton);
        this.favoritePostButton = this.page.locator(selectors["article-detail"].favoritePostButton);
        this.editPostButton = this.page.locator(selectors["article-detail"].editPostButton);
        this.deletePostButton = this.page.locator(selectors["article-detail"].deletePostButton);
    }

    async getArticleID(){
        let url = this.page.url();
        let separatorArray = url.split("/");
        return separatorArray[4];
    }

    async getElementInArticle(element){
        return this.page.locator(`text=${element}`);
    }

    async waitForCallsMade(){
        await this.page.waitForLoadState("networkidle");
    }
}