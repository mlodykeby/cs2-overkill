function scoreMarket(items) {

    return items.map(item => {

        let score = 0;
        let label = "IGNORE ❌";

        if (item.price < 10) score += 10;
        else if (item.price <= 50) score += 30;
        else score += 20;

        if (item.listings <= 2) score += 40;
        else if (item.listings <= 5) score += 20;

        if (Math.random() > 0.7) score += 10;

        if (score >= 70) label = "STRONG BUY 🔥";
        else if (score >= 50) label = "BUY 📈";
        else if (score >= 30) label = "WATCH 👀";

        return {
            ...item,
            score,
            label
        };
    }).sort((a, b) => b.score - a.score);
}

module.exports = { scoreMarket };
