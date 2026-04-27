const axios = require("axios");


// ============================
// 🔥 CS2CAP (PRIMARY SOURCE)
// ============================
async function fetchCS2Cap() {
    try {
        const res = await axios.get("https://api.cs2cap.com/v1/web/prices", {
            params: {
                limit: 100
            },
            timeout: 10000
        });

        const items = res.data?.items || [];

        return items.map(i => ({
            name: i.market_hash_name,
            price: Number(i.price),
            listings: i.volume || 1,
            source: "cs2cap"
        }));

    } catch (err) {
        console.log("CS2Cap error:", err.message);
        return [];
    }
}


// ============================
// 🧠 NORMALIZER (SAFE CLEAN)
// ============================
function normalize(items) {
    return items
        .filter(i => i.name && i.price > 0)
        .map(i => ({
            name: i.name,
            price: i.price,
            listings: i.listings || 1,
            liquidity: i.listings < 5 ? "LOW" : "OK",
            source: i.source
        }));
}


// ============================
// 🧪 FALLBACK (ALWAYS SAFE)
// ============================
function fallbackData() {
    return [
        { name: "AK-47 | Redline", price: 12.5, listings: 4, source: "fallback" },
        { name: "AWP | Asiimov", price: 45, listings: 2, source: "fallback" },
        { name: "M4A1-S | Printstream", price: 38, listings: 3, source: "fallback" },
        { name: "Gloves | Fade", price: 120, listings: 1, source: "fallback" }
    ];
}


// ============================
// 🚀 MAIN CRAWLER
// ============================
async function crawlMarket() {

    const cs2cap = await fetchCS2Cap();

    let data = cs2cap.length > 0 ? cs2cap : fallbackData();

    return normalize(data);
}

module.exports = { crawlMarket };
