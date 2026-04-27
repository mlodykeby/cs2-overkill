function detectPumpSignals(items, history = []) {

    const signals = [];

    for (const item of items) {

        let score = 0;

        // 🔥 low liquidity = easy pump
        if (item.listings <= 3) score += 40;

        // 💰 mid price sweet spot
        if (item.price > 10 && item.price < 100) score += 20;

        // 📈 rare items boost
        if (item.liquidity === "LOW") score += 20;

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
