export function getTodayDate() {
    const today = new Date();
    let date = today.toLocaleString("default", { year: "numeric", month: "short", day: "numeric" });
    let convertedDate = [date.slice(0, 3), ".", date.slice(3)].join("");
    return convertedDate;
}
