const { chromium, expect } = require("@playwright/test");
import { SignUpAPI } from "./api/SignUpAPI";
import { SignInAPI } from "./api/SignInAPI";
const detailUser = require("./input-files/detailUser.json");
const authorUser = require("./input-files/authorUser.json");
const likeUser = require("./input-files/likeUser.json");
const signInUser = require("./input-files/signInUser.json");
import { existErrorMessage } from "./utils/BodyResponseHandler";

module.exports = async (config) => {
    const users = [ authorUser, signInUser, likeUser, detailUser ];
    for (let user of users){
        const browser = await chromium.launch();
        const page = await browser.newPage();
        const signInAPI = new SignInAPI(page);
        const signInResponse = await signInAPI.signInUser(user);
    
        if (await existErrorMessage(signInResponse)) {
            console.log("Users does not exist. Creating user...");
            const signUpAPI = new SignUpAPI(page);
            const signUpResponse = await signUpAPI.signUpUser(user);
            expect(signUpResponse.ok()).toBeTruthy();
        } else {
            console.log("User already exist, no additional method will be executed");
        }
        await browser.close();
    }
    
};
