const { getHistory } = require("../engine/historyDB");

function score(item) {

    const history = getHistory(item.name);

    if (history.length < 5) return 0;

    const momentum = (history.at(-1) - history[0]) / history[0];

    const volatility = Math.max(...history.map((v,i,a)=> i? Math.abs(v-a[i-1]):0));

    let s = 0;

    if (momentum > 0.1) s += 40;
    if (momentum < -0.1) s += 20;

    if (volatility > 15) s += 25;

    if (item.listings < 30) s += 20;

    if (item.price < 50) s += 10;

    return s;
}

function classify(s) {

    if (s >= 85) return "BREAKOUT";
    if (s >= 70) return "PUMP";
    if (s >= 50) return "FLIP";
    if (s >= 30) return "ACC";

    return "IGNORE";
}

module.exports = { score, classify };