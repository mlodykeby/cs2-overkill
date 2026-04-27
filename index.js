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
    console.log("🚀 BOT ONLINE");
});

// 📤 SEND FUNCTION
async function send(channelId, msg) {
    try {
        const channel = await client.channels.fetch(channelId);
        if (channel) await channel.send(msg);
    } catch (err) {
        console.log("SEND ERROR:", err.message);
    }
}

// 🔥 MAIN LOOP (ONLY PLACE WITH AWAIT)
async function cycle() {

    try {

        console.log("CYCLE START");

        // 1. MARKET DATA
        const market = await crawlMarket();

        console.log("MARKET SIZE:", market.length);

        if (!market || market.length === 0) {
            console.log("⚠️ NO MARKET DATA");
            return;
        }

        // 2. SAVE DATA
        update(market);
        snapshot(market);

        // 3. ANALYZE
        const signals = runPipeline(market);

        console.log("SIGNALS:", signals.length);

        // 4. DISCORD OUTPUT
        for (const s of signals) {

            const msg = `
💎 ${s.name}
💰 ${s.price}
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

// 🔁 LOOP (NO TOP-LEVEL AWAIT BUG)
setInterval(() => {
    cycle();
}, 12000);

// 🚀 START BOT
client.login(process.env.TOKEN);
