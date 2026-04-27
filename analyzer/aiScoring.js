function scoreItem(item) {

    let score = 0;
    let label = "HOLD";

    // 💰 profit / value logic
    if (item.price < 10) score += 10;
    if (item.price >= 10 && item.price <= 50) score += 30;
    if (item.price > 50) score += 20;

    // 📉 liquidity (mało listingów = pump potential)
    if (item.listings <= 2) score += 40;
    else if (item.listings <= 5) score += 20;

    // 🔥 bonus for volatility (simulated)
    if (Math.random() > 0.7) score += 10;

    // 🧠 AI LABEL LOGIC
    if (score >= 70) label = "STRONG BUY 🔥";
    else if (score >= 50) label = "BUY 📈";
    else if (score >= 30) label = "WATCH 👀";
    else label = "IGNORE ❌";

    return {
        ...item,
        score,
        label
    };
}

function scoreMarket(items) {
    return items.map(scoreItem).sort((a, b) => b.score - a.score);
}

module.exports = { scoreMarket };