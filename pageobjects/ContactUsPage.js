import selectors from "./selectors.json";


export class ContactUsPage {
    constructor(page){
        this.page = page;
        this.firstNameInput = page.locator(selectors["contact-us"].firstNameInput);
        this.lastNameInput = page.locator(selectors["contact-us"].lastNameInput);
        this.emailInput = page.locator(selectors["contact-us"].emailInput);
        this.countrySelect = page.locator(selectors["contact-us"].countrySelect);
        this.messageInput = page.locator(selectors["contact-us"].messageInput);
        this.conditionsCheckbox = page.locator(selectors["contact-us"].conditionsCheckbox);
        this.submitButton = page.locator(selectors["contact-us"].submitButton);
    }

    async goTo(){
        await this.page.goto("/contact/");
    }

    async completeContactForm(contactDetails){
        await this.firstNameInput.fill(contactDetails.firstName);
        await this.lastNameInput.fill(contactDetails.lastName);
        await this.emailInput.fill(contactDetails.email);
        await this.countrySelect.selectOption({label: `${contactDetails.country}`});
        await this.messageInput.fill(contactDetails.message);
        await this.conditionsCheckbox.check();
        await this.submitButton.click();
        await this.page.waitForLoadState("networkidle");
    }
}