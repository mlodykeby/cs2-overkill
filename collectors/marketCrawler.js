const axios = require("axios");


// ======================
// 🔥 SOURCE 1: DMARKET
// ======================
async function fetchDMarket() {
    try {
        const res = await axios.get(
            "https://api.dmarket.com/exchange/v1/market/items",
            {
                params: {
                    limit: 100,
                    offset: 0
                },
                timeout: 10000
            }
        );

        const items = res.data?.objects || [];

        return items.map(i => ({
            name: i.title || "unknown",
            price: i.price?.USD || 0,
            listings: i.count || 1,
            source: "dmarket"
        }));

    } catch (err) {
        console.log("DMarket error:", err.response?.status || err.message);
        return [];
    }
}


// ======================
// 🔥 SOURCE 2: SKINPORT (light scrape)
// ======================
async function fetchSkinport() {
    try {
        const res = await axios.get(
            "https://skinport.com/market?sort=price&order=asc",
            {
                timeout: 10000,
                headers: {
                    "User-Agent": "Mozilla/5.0"
                }
            }
        );

        const html = res.data;

        // ⚠️ minimalistyczny fallback parser (strona się zmienia często)
        const matches = [...html.matchAll(/"market_hash_name":"(.*?)".*?"min_price":(.*?)[,}]/g)];

        return matches.map(m => ({
            name: m[1],
            price: parseFloat(m[2]) || 0,
            listings: 1,
            source: "skinport"
        }));

    } catch (err) {
        console.log("Skinport error:", err.message);
        return [];
    }
}


// ======================
// 🔥 MAIN CRAWLER (SAFE)
// ======================
async function crawlMarket() {

    try {

        const [dmarket, skinport] = await Promise.all([
            fetchDMarket(),
            fetchSkinport()
        ]);

        const combined = [...dmarket, ...skinport];

        // safety filter
        return combined.filter(i =>
            i.name &&
            i.price &&
            i.price > 0 &&
            i.price < 100000
        );

    } catch (err) {
        console.log("CRAWLER GLOBAL ERROR:", err.message);

        // fallback żeby bot nigdy nie padł
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
