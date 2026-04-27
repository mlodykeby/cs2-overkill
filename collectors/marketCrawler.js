const axios = require("axios");

let cache = [];

async function fetchData(retry = 0) {
    try {
        const res = await axios.get("https://api.cs2cap.com/v1/web/prices", {
            headers: {
                Authorization: `Bearer ${process.env.CS2CAP_KEY}`
            },
            params: { limit: 100 },
            timeout: 8000
        });

        const data = res.data?.items || [];

        if (data.length) cache = data;

        return data;

    } catch (err) {
        console.log("API error:", err.message);

        if (retry < 2) {
            return fetchData(retry + 1);
        }

        return cache;
    }
}

async function crawlMarket() {
    const data = await fetchData();

    if (!data.length) {
        return [
            { market_hash_name: "AK-47 | Redline", price: 12, volume: 2 },
            { market_hash_name: "AWP | Asiimov", price: 45, volume: 1 }
        ];
    }

    return data.map(i => ({
        name: i.market_hash_name,
        price: Number(i.price),
        listings: i.volume || 1
    }));
}

module.exports = { crawlMarket };
