const axios = require("axios");

let cache = [];

// 🔁 SAFE FETCH (retry + timeout + fallback)
async function fetchMarket(retry = 0) {
    try {
        const res = await axios.get(
            "https://api.cs2c.app/v1/web/prices",
            {
                headers: {
                    Authorization: `Bearer ${process.env.CS2CAP_KEY}`
                },
                params: {
                    limit: 100
                },
                timeout: 8000
            }
        );

        const data = res.data?.items || [];

        if (data.length > 0) {
            cache = data;
        }

        return data;

    } catch (err) {
        console.log("API error:", err.message);

        // 🔁 retry logic
        if (retry < 2) {
            return fetchMarket(retry + 1);
        }

        return cache;
    }
}

// 🧠 MAIN EXPORT
async function crawlMarket() {
    const data = await fetchMarket();

    // 🛡 fallback if API dead
    if (!data || data.length === 0) {
        console.log("Using fallback market data...");

        return [
            {
                name: "AK-47 | Redline",
                price: 12.5,
                listings: 3
            },
            {
                name: "AWP | Asiimov",
                price: 45.0,
                listings: 1
            },
            {
                name: "M4A1-S | Printstream",
                price: 78.0,
                listings: 2
            }
        ];
    }

    // 📊 normalize data
    return data.map(item => ({
        name: item.market_hash_name || item.name,
        price: Number(item.price) || 0,
        listings: item.volume || item.listings || 1
    }));
}

module.exports = { crawlMarket };
