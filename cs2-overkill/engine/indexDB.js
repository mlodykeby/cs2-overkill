const fs = require("fs");

function load() {
    return JSON.parse(fs.readFileSync("./db/market.json"));
}

function save(data) {
    fs.writeFileSync("./db/market.json", JSON.stringify(data, null, 2));
}

function update(items) {

    const db = load();

    for (const item of items) {

        if (!db.find(x => x.name === item.name)) {
            db.push(item);
        }
    }

    save(db);
}

module.exports = { load, update };