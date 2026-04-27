const axios = require("axios");


// =========================
// 🥇 CSFLOAT (BEST SOURCE)
// =========================
async function fetchCSFloat() {
    try {
        const res = await axios.get(
            "https://csfloat.com/api/v1/listings",
            { timeout: 10000 }
        );

        const data = res.data?.data || [];

        return data.map(i => ({
            name: i.item?.market_hash_name,
            price: i.price / 100,
            listings: 1,
            source: "csfloat"
        }));

    } catch (err) {
        console.log("CSFloat error:", err.message);
        return [];
    }
}


// =========================
// 🥈 CS2CAP (AGGREGATOR)
// =========================
async function fetchCS2Cap() {
    try {
        const res = await axios.get(
            "https://api.cs2cap.com/v1/web/prices?limit=50",
            { timeout: 10000 }
        );

        const items = res.data?.items || [];

        return items.map(i => ({
            name: i.market_hash_name,
            price: i.price,
            listings: 1,
            source: "cs2cap"
        }));

    } catch (err) {
        console.log("CS2Cap error:", err.message);
        return [];
    }
}


// =========================
// 🔥 MAIN CRAWLER
// =========================
async function crawlMarket() {

    try {

        const [csfloat, cs2cap] = await Promise.all([
            fetchCSFloat(),
            fetchCS2Cap()
        ]);

        const combined = [...csfloat, ...cs2cap];

        return combined.filter(i =>
            i.name &&
            i.price &&
            i.price > 0 &&
            i.price < 100000
        );

    } catch (err) {
        console.log("CRAWLER ERROR:", err.message);
        return [];
    }
}

module.exports = { crawlMarket };
