const fs = require("fs");

function load() {
    return JSON.parse(fs.readFileSync("./db/history.json"));
}

function save(data) {
    fs.writeFileSync("./db/history.json", JSON.stringify(data, null, 2));
}

function snapshot(items) {

    const db = load();

    db.push({
        time: Date.now(),
        items
    });

    if (db.length > 400) db.shift();

    save(db);
}

function getHistory(name) {

    const db = load();

    return db
        .flatMap(x => x.items)
        .filter(i => i.name === name)
        .map(i => i.price);
}

module.exports = { snapshot, getHistory };