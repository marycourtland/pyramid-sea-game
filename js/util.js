function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function randomValue(list) {
    return list[Math.floor(Math.random() * list.length)];
}
