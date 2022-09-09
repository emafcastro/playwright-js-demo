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
            domain: "localhost:8000",
            path: "/",
        }
    }
}
