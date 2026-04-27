require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

const { crawlMarket } = require("./collectors/marketCrawler");
const { update } = require("./engine/indexDB");
const { snapshot } = require("./engine/historyDB");

const { runPipeline } = require("./analyzer/pipeline");

const config = require("./config");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
    console.log("🚀 OVERKILL SYSTEM ONLINE");
});

// helper do wysyłania wiadomości
async function send(channelId, msg) {
    try {
        const channel = await client.channels.fetch(channelId);
        if (channel) await channel.send(msg);
    } catch (err) {
        console.log("SEND ERROR:", err.message);
    }
}

// 🔥 MAIN LOOP (ASYNC FIX)
async function cycle() {
    try {

        // 1. POBIERZ RYNEK (REAL DATA)
        let market = await crawlMarket();

        console.log("MARKET SIZE:", market.length);

        if (!market || market.length === 0) {
            console.log("⚠️ NO MARKET DATA");
            return;
        }

        // 2. ZAPIS DO BAZY
        update(market);

        // 3. HISTORIA
        snapshot(market);

        // 4. ANALIZA
        let signals = runPipeline(market);

        console.log("SIGNALS:", signals.length);

        // 5. DISCORD OUTPUT
        for (const s of signals) {

            const msg = `
💎 ${s.name}
💰 ${s.price.toFixed(2)}
📊 SCORE: ${s.score}
🚀 SIGNAL: ${s.signal}
            `;

            if (s.signal === "BREAKOUT") {
                await send(config.privateChannelId, "👑 BREAKOUT\n" + msg);
            }

            else if (s.signal === "PUMP") {
                await send(config.premiumChannelId, "🔥 PUMP\n" + msg);
            }

            else {
                await send(config.freeChannelId, "📦 FLIP\n" + msg);
            }
        }

    } catch (err) {
        console.log("CYCLE ERROR:", err.message);
    }
}

// 🔁 LOOP
setInterval(cycle, 12000);

// 🚀 START
client.login(process.env.TOKEN);