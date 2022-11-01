import jsdom from "jsdom";
export async function existErrorMessage(response) {
    let text = await response.text();
    const dom = new jsdom.JSDOM(text);
    if (dom.window.document.querySelector(".error-messages") != null) {
        return true;
    } else {
        return false;
    }
}
