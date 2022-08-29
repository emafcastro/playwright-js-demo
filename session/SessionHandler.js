import { maketoken } from "../utils/TextGenerator";

export class SessionHandler {
    constructor(context){
        this.context = context;
    }

    async addCSRFToken(){
        let csrftoken = this.generateCSRFToken()
        await this.context.addCookies([csrftoken]);
        return csrftoken.value;
    }

    generateCSRFToken(){
        return {
            name: "csrftoken",
            value: maketoken(64),
            domain: "realworld-djangoapp.herokuapp.com",
            path: "/",
        }
    }
}
