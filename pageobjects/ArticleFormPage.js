const selectors = require("./selectors.json");

export class ArticleFormPage{
    constructor(page){
        this.page = page;
        this.titleInput = this.page.locator(selectors["article-form"].titleInput);
        this.summaryInput = this.page.locator(selectors["article-form"].summaryInput);
        this.contentInput = this.page.locator(selectors["article-form"].contentInput);
        this.tagsInput = this.page.locator(selectors["article-form"].tagsInput);
        this.errorMessagesText = this.page.locator(selectors["article-form"].errorMessagesText);
        this.publishArticleButton = this.page.locator(selectors["article-form"].publishArticleButton);
        this.saveArticleButton = this.page.locator(selectors["article-form"].saveArticleButton);
        this.suggestedTagSection = this.page.locator(selectors["article-form"].suggestedTagSection);
    }

    async completeForm(article, mode){
        await this.titleInput.fill(article.title);
        await this.summaryInput.fill(article.summary);
        await this.contentInput.fill(article.content);
        await this.tagsInput.fill(article.tags);
        switch(mode){
            case "ADD":
                await this.publishArticleButton.click();
                break;
            case "EDIT":
                await this.saveArticleButton.click();
                break;
        }
        await this.page.waitForLoadState("networkidle");
    }

    async goTo(){
        await this.page.goto("/new/");
    }

    async getSuggestedTagList(){
        return this.suggestedTagSection.locator(".tag-list > button");
    }
}
