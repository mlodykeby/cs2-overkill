function calculateArbitrage(items) {

    const results = [];

    for (const item of items) {

        // symulacja: różne “rynki” (w realu możesz dodać cs2cap + skinport + csfloat)
        const buyPrice = item.price;
        const sellPrice = item.price * (1 + Math.random() * 0.25); // 0–25% spread

        const profit = sellPrice - buyPrice;
        const profitPercent = (profit / buyPrice) * 100;

        // 🔥 filtr śmieci
        if (profitPercent < 5) continue;

        let score = 0;

        if (profitPercent > 15) score += 50;
        else if (profitPercent > 10) score += 30;
        else score += 15;

        if (item.listings <= 3) score += 20;

        results.push({
            name: item.name,
            buyPrice,
            sellPrice,
            profit: profit.toFixed(2),
            profitPercent: profitPercent.toFixed(2),
            score,
            signal: profitPercent > 15 ? "HIGH_ARB" : "ARB"
        });
    }

    return results.sort((a, b) => b.score - a.score);
}

module.exports = { calculateArbitrage };