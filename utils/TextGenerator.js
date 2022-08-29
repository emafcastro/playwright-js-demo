export function generateEmailForCharacters(amount) {
    let chars = "abcdefghijklmnopqrstuvwxyz1234567890";
    let emailUsername = "";
    let emailUsernameLength = amount - 10;
    for (let ii = 0; ii < emailUsernameLength; ii++) {
        emailUsername += chars[Math.floor(Math.random() * chars.length)];
    }
    return emailUsername + "@gmail.com";
}

export function maketoken(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}