require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

const { crawlMarket } = require("./collectors/marketCrawler");
const { runPipeline } = require("./analyzer/pipeline");
const { detectPumpSignals } = require("./analyzer/pumpDetector");
const { updateData } = require("./dashboard/server");

const config = require("./config");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
    console.log("🚀 TRADING BOT ONLINE");
});


// =======================
// 📤 DISCORD SEND
// =======================
async function send(channelId, msg) {
    try {
        const channel = await client.channels.fetch(channelId);
        if (channel) await channel.send(msg);
    } catch (err) {
        console.log("SEND ERROR:", err.message);
    }
}


// =======================
// 🔥 MAIN LOOP
// =======================
async function cycle() {

    try {

        console.log("CYCLE START");

        // 1. MARKET
        const market = await crawlMarket();

        if (!Array.isArray(market) || market.length === 0) {
            console.log("⚠️ NO MARKET DATA");
            return;
        }

        console.log("MARKET SIZE:", market.length);

        // 2. PIPELINE ANALYSIS
        const signals = runPipeline(market);

        // 3. PUMP DETECTION
        const pumps = detectPumpSignals(market, []);

        if (pumps.length > 0) {
            console.log("🔥 PUMP ALERTS:", pumps.length);

            for (const p of pumps) {
                await send(config.privateChannelId,
                    `🔥 PUMP ALERT\n💎 ${p.name}\n💰 ${p.price}\n📊 SCORE ${p.score}`
                );
            }
        }

        // 4. DISCORD SIGNALS
        for (const s of signals || []) {

            const msg =
`💎 ${s.name}
💰 ${s.price}
📊 SCORE: ${s.score}
🚀 SIGNAL: ${s.signal}`;

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

        // 5. DASHBOARD UPDATE
        updateData(market);

    } catch (err) {
        console.log("CYCLE ERROR:", err.message);
    }
}


// =======================
// 🔁 LOOP SAFE
// =======================
setInterval(() => {
    cycle();
}, 12000);


// =======================
// 🚀 START BOT
// =======================
client.login(process.env.TOKEN);
