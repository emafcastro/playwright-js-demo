export class ArticleAPI {
    constructor(page) {
        this.page = page;
    }

    async deleteArticle(articleID) {
        let url = "https://realworld-djangoapp.herokuapp.com/article/delete/" + articleID + "/";
        let headers = await this.generateHeaders();
        const deleteArticleResponse = await this.page.request.delete(url, { headers: headers });
        return deleteArticleResponse;
    }

    async createArticle(article) {
        let payload = await this.generatePayload(article);
        let headers = await this.generateHeaders();
        const postArticleResponse = await this.page.request.post("https://realworld-djangoapp.herokuapp.com/new/", {
            form: payload,
            headers: headers,
        });
        let headersResponse = postArticleResponse.headers();
        let urlRedirect = headersResponse["hx-redirect"];
        return urlRedirect;
    }

    async generatePayload(article) {
        let csrftoken = await this.getCSRFToken();
        return {
            title: article.title,
            summary: article.summary,
            content: article.content,
            tags: article.tags,
            csrfmiddlewaretoken: csrftoken.value,
        };
    }

    async generateHeaders() {
        let csrftoken = await this.getCSRFToken();
        return {
            "X-CSRFToken": csrftoken.value,
        };
    }

    async getCSRFToken() {
        const cookies = await this.page.context().cookies();
        const csrftoken = cookies[0];
        return csrftoken;
    }
}
