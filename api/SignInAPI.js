import { SessionHandler } from "../session/SessionHandler";
import { logResponse } from "../utils/LogGenerator";
import config from "../playwright.config";

export class SignInAPI{
    constructor(page){
        this.page = page;
        this.session = new SessionHandler(this.page.context());
        this.csrftoken = "";
    }

    async signInUser(user){
        await this.getCSRFToken();
        let payload = await this.generatePayload(user);
        let headersRequest = await this.generateHeaders();
        const signInResponse = await this.page.request.post(`${config.use.baseURL}/login/`, {
            form: payload,
            headers: headersRequest,
        });
        await logResponse(signInResponse, "debugging/signin/signin.json")
        return signInResponse;
    }

    async generatePayload(user){
        return {
            csrfmiddlewaretoken: this.csrftoken,
            username: user.email,
            password: user.password,
        }
    }

    async generateHeaders(){
        return {
            "X-CSRFToken": this.csrftoken,
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        }
    }

    async getCSRFToken(){
        this.csrftoken = await this.session.addCSRFToken();
    }
}