export function getGuestRoom(guestsParam) {
    let ls = guestsParam.split('|');
    let result = [0, 0, 0, 0];
    for (let i = 0; i < ls.length; i++) {
        let curr = ls[i];
        switch (curr) {
            case "1" :
                result[0] += 1;
                break;
            case "2":
                result[1] += 1;
                break;
            case "3":
                result[2] += 1;
                break;
            case "4":
                result[3] += 1;
                break;
            default:
                break;
        }
    }
    return result;
}

export function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

export function formatDate(date) { // Date -> YYYY-MM-DD
    return [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
    ].join('-');
}

export function displayedDate(date) { //YYYY-MM-DD -> MMM(Jul) DD YYYY
    let temp_date = new Date(date.split('-')[0],
        date.split('-')[1] - 1,
        date.split('-')[2])
    return temp_date.toString().split(" ").slice(1, 4).join(" ");
}
