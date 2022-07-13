const realJSON = {
    "room one": {
        "room_id": "1004890",
        "price": 100,
        "type": "single"
    },
    "room two": {
        "room_id": "1005604",
        "price": 50,
        "type": "single"
    },
    "room three": {
        "room_id": "1004891",
        "price": 1,
        "type": "double"
    }
}

const keyword = "room t";
let result = {};
for (const room of Object.entries(realJSON)) {
    if (room[0].toUpperCase().includes(keyword.toUpperCase())) {
        result[room[0]] = room[1];
    }
}
console.log(result)
console.log(Object.keys(result).length);
console.log("slice");
console.log(Object.entries(result).slice(0, 2).map(entry => entry[0]))