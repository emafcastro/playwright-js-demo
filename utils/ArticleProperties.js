export function getTodayDate() {
    const today = new Date();
    let date = today.toLocaleString("default", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
    let convertedDate = [date.slice(0, 3), ".", date.slice(3)].join("");
    return convertedDate;
}

export function getIDFromURL(url) {
    let separatorArray = url.split("/");
    let articleID = separatorArray[2];
    return articleID;
}
