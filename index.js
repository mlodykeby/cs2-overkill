require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

const { crawlMarket } = require("./collectors/marketCrawler");
const { detectPumpSignals } = require("./analyzer/pumpDetector");

const { buildSteamLink, buildPirateSwapLink } = require("./utils/links");
const config = require("./config");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

let running = false;

client.once("ready", () => {
    console.log("🚀 BOT ONLINE");
});

async function send(channelId, msg) {
    try {
        const ch = await client.channels.fetch(channelId);
        if (ch) await ch.send(msg);
    } catch (e) {
        console.log("SEND ERROR:", e.message);
    }
}

// 🔥 SAFE CYCLE (NO DOUBLE RUN)
async function cycle() {

    if (running) return;
    running = true;

    try {

        const market = await crawlMarket();

        const signals = detectPumpSignals(market);

        for (const s of signals) {

            const msg =
`💎 ${s.name}
💰 $${s.price}
📊 SCORE ${s.score}

🔗 Steam: ${buildSteamLink(s.name)}
🏴 PirateSwap: ${buildPirateSwapLink(s.name, config.affiliate.pirateswap)}`;

            if (s.score > 70) {
                await send(config.privateChannelId, "👑 HIGH VALUE\n" + msg);
            }

            else if (s.score > 50) {
                await send(config.premiumChannelId, "🔥 PUMP\n" + msg);
            }

            else {
                await send(config.publicChannelId, "📦 FLIP\n" + msg);
            }
        }

    } catch (err) {
        console.log("CYCLE ERROR:", err.message);
    }

    running = false;
}


// 🔁 AUTO-RESTART LOOP (SELF-HEAL)
setInterval(() => {
    cycle().catch(err => {
        console.log("CRITICAL LOOP ERROR:", err.message);
        running = false; // reset lock
    });
}, 12000);


// 🧠 FAILSAFE WATCHDOG (JEŚLI BOT ZAWISNIE)
setInterval(() => {
    if (!running) return;

    console.log("🧠 WATCHDOG: cycle took too long → resetting");
    running = false;

}, 30000);

client.login(process.env.DISCORD_TOKEN);
