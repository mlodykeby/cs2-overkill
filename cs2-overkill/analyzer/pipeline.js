const { filter } = require("../ai/filter");
const { score, classify } = require("../ai/scorer");
const { selectTop } = require("../ai/selector");

function runPipeline(items) {

    const clean = filter(items);

    let signals = [];

    for (const i of clean) {

        const s = score(i);
        const sig = classify(s);

        if (sig !== "IGNORE") {

            signals.push({
                name: i.name,
                price: i.price,
                score: s,
                signal: sig
            });
        }
    }

    return selectTop(signals);
}

module.exports = { runPipeline };