import { SessionHandler } from "../session/SessionHandler";
import { logResponse } from "../utils/LogGenerator";
import config from "../playwright.config";

export class SignUpAPI {
    constructor(page) {
        this.page = page;
        this.session = new SessionHandler(this.page.context());
        this.csrftoken = "";
    }

    async signUpUser(user){
        await this.getCSRFToken();
        let payload = this.generatePayload(user);
        let headersRequest = this.generateHeaders();
        const signUpResponse = await this.page.request.post(`${config.use.baseURL}/register/`, {
            form: payload,
            headers: headersRequest,
        });
        await logResponse(signUpResponse, "debugging/signup/signup.json")
        return signUpResponse;
    }

    generatePayload(user){
        return {
            csrfmiddlewaretoken: this.csrftoken,
            name: user.username,
            email: user.email,
            password: user.password,
        }
    }

    generateHeaders(){
        return {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        }
    }

    async getCSRFToken(){
        this.csrftoken = await this.session.addCSRFToken();
    }
}
