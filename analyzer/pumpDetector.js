function detectPumpSignals(items, history = []) {

    const signals = [];

    for (const item of items) {

        const past = history.find(h => h.name === item.name);

        let score = 0;

        // 📈 cena rośnie
        if (past && item.price > past.avgPrice * 1.1) {
            score += 40;
        }

        // 📉 mało listingów
        if (item.listings < 5) {
            score += 20;
        }

        // 💰 droższe itemy często pumpują wolniej
        if (item.price > 50) {
            score += 10;
        }

        if (score >= 50) {
            signals.push({
                name: item.name,
                price: item.price,
                score,
                signal: "POTENTIAL_PUMP"
            });
        }
    }

    return signals;
}

module.exports = { detectPumpSignals };