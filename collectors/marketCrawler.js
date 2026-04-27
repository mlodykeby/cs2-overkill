const axios = require("axios");

let lastGoodData = [];

async function fetchCS2Cap(retry = 0) {
    try {
        const res = await axios.get("https://api.cs2cap.com/v1/web/prices", {
            headers: {
                Authorization: `Bearer ${process.env.CS2CAP_KEY}`
            },
            params: { limit: 100 },
            timeout: 8000
        });

        const items = res.data?.items || [];

        if (items.length) {
            lastGoodData = items;
        }

        return items;

    } catch (err) {
        console.log("CS2Cap error:", err.message);

        // 🔁 AUTO RETRY (max 3)
        if (retry < 3) {
            console.log("Retrying CS2Cap...", retry + 1);
            return fetchCS2Cap(retry + 1);
        }

        // 🧠 fallback cache
        console.log("Using last good data fallback");
        return lastGoodData;
    }
}

async function crawlMarket() {
    const items = await fetchCS2Cap();

    // 🧪 HARD FALLBACK jeśli wszystko padnie
    if (!items || items.length === 0) {
        return [
            { market_hash_name: "AK-47 | Redline", price: 12, volume: 3 },
            { market_hash_name: "AWP | Asiimov", price: 45, volume: 2 }
        ];
    }

    return items.map(i => ({
        name: i.market_hash_name,
        price: Number(i.price),
        listings: i.volume || 1
    }));
}

module.exports = { crawlMarket };
