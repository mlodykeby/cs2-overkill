const axios = require("axios");


// =========================
// 🏴 PIRATESWAP SCRAPER
// =========================
async function fetchPirateSwap() {

    try {

        const res = await axios.get(
            "https://pirateswap-io.com/",
            {
                timeout: 10000,
                headers: {
                    "User-Agent": "Mozilla/5.0"
                }
            }
        );

        const html = res.data;

        // 🔥 PROSTE WYCIĄGANIE ITEMÓW (fallback regex)
        const names = [...html.matchAll(/market_hash_name":"(.*?)"/g)];
        const prices = [...html.matchAll(/price":"(.*?)"/g)];

        let items = [];

        for (let i = 0; i < Math.min(names.length, prices.length); i++) {
            items.push({
                name: names[i][1],
                price: parseFloat(prices[i][1]) || 0,
                listings: 1,
                source: "pirateswap"
            });
        }

        return items;

    } catch (err) {
        console.log("PirateSwap error:", err.message);
        return [];
    }
}


// =========================
// 🔥 MAIN CRAWLER
// =========================
async function crawlMarket() {

    try {

        const pirateswap = await fetchPirateSwap();

        console.log("PirateSwap items:", pirateswap.length);

        const combined = [...pirateswap];

        // safety filter
        return combined.filter(i =>
            i.name &&
            i.price &&
            i.price > 0 &&
            i.price < 100000
        );

    } catch (err) {
        console.log("CRAWLER ERROR:", err.message);

        return [
            {
                name: "FALLBACK ITEM",
                price: 1,
                listings: 1,
                source: "fallback"
            }
        ];
    }
}

module.exports = { crawlMarket };
