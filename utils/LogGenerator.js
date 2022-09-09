import { writeFileSync, mkdirSync } from "node:fs";

export async function logResponse(response, path) {
    let status = response.status();
    let statusText = response.statusText();
    let headers = response.headers();
    let text = await response.text();
    let logObject = {
        status,
        statusText,
        headers,
        text,
    };
    let sections = path.split("/");
    sections.pop();
    try {
        mkdirSync(sections.join("/"), { recursive: true });
    } catch (error) {
        console.log("Directory already exists");
    }
    writeFileSync(path, JSON.stringify(logObject));
}

export function showResponses() {
    page.on("response", (response) => {
        if (response.url().includes("localhost")) {
            console.log(
                "status: " + response.status() + ", url: " + response.url() + ", headers: " + JSON.stringify(response.headers())
            );
        }
    });
}
