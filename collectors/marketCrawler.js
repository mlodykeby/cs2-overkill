const axios = require("axios");
const cheerio = require("cheerio");

// 1. SKINPORT SCRAPER
async function fetchSkinport() {

    try {
        const res = await axios.get("https://skinport.com/market?sort=price&order=asc");

        const $ = cheerio.load(res.data);

        let items = [];

        $(".ItemTile").each((i, el) => {

            const name = $(el).find(".ItemName").text().trim();
            const priceText = $(el).find(".ItemPrice").text().replace("$", "").trim();
            const price = parseFloat(priceText);

            if (name && price) {
                items.push({
                    name,
                    price,
                    listings: 10,
                    source: "skinport"
                });
            }
        });

        return items;

    } catch (e) {
        console.log("Skinport error:", e.message);
        return [];
    }
}

// 2. DMARKET API (prostsze, działa częściej)
async function fetchDMarket() {

    try {
        const res = await axios.get(
            "https://api.dmarket.com/exchange/v1/market/items",
            {
                params: {
                    limit: 100,
                    offset: 0
                }
            }
        );

        const data = res.data?.objects || [];

        return data.map(i => ({
            name: i.title || "unknown",
            price: i.price?.USD || 0,
            listings: i.count || 1,
            source: "dmarket"
        }));

    } catch (e) {
        console.log("DMarket error:", e.response?.data || e.message);
        return [];
    }
}

// 3. COMBINE ALL MARKETS
async function crawlMarket() {

    const dmarket = await fetchDMarket();

    console.log("DMarket items:", dmarket.length);

    if (dmarket.length > 0) return dmarket;

    console.log("⚠️ fallback activated");

    return [
        {
            name: "NO DATA",
            price: 1,
            listings: 1,
            source: "fallback"
        }
    ];
}

    const [skinport, dmarket] = await Promise.all([
        fetchSkinport(),
        fetchDMarket()
    ]);

    return [...skinport, ...dmarket];
}

module.exports = { crawlMarket };