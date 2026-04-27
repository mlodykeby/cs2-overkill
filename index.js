require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

const { crawlMarket } = require("./collectors/marketCrawler");
const { runPipeline } = require("./analyzer/pipeline");

const config = require("./config");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
    console.log("🚀 BOT ONLINE");
});

// 📤 SEND SAFE
async function send(channelId, msg) {
    try {
        const channel = await client.channels.fetch(channelId);
        if (channel) await channel.send(msg);
    } catch (err) {
        console.log("SEND ERROR:", err.message);
    }
}

// 🔥 SAFE CYCLE (NO CRASH)
async function cycle() {
    try {

        console.log("CYCLE START");

        const market = await crawlMarket();

        if (!Array.isArray(market) || market.length === 0) {
            console.log("⚠️ NO MARKET DATA");
            return;
        }

        console.log("MARKET SIZE:", market.length);

        const signals = runPipeline(market);

        console.log("SIGNALS:", signals.length);

        for (const s of signals || []) {

            const msg =
`💎 ${s.name}
💰 ${s.price}
📊 SCORE: ${s.score}
🚀 ${s.signal}`;

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

// 🔁 LOOP SAFE (NO await HERE EVER)
setInterval(() => {
    cycle();
}, 15000);

// 🚀 START BOT
client.login(process.env.TOKEN);
