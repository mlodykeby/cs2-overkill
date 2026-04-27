require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

const { crawlMarket } = require("./collectors/marketCrawler");
const { scoreMarket } = require("./analyzer/aiScoring");

const { initDashboard, updateDashboard } = require("./dashboard/discordDashboard");

const config = require("./config");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

let dashboardChannel;

client.once("ready", async () => {
    console.log("🚀 TRADING UI V2 ONLINE");

    dashboardChannel = await client.channels.fetch(config.dashboardChannelId);

    await initDashboard(dashboardChannel);
});

async function send(channelId, msg) {
    try {
        const ch = await client.channels.fetch(channelId);
        if (ch) await ch.send(msg);
    } catch (e) {
        console.log("SEND ERROR:", e.message);
    }
}

async function cycle() {

    try {

        const market = await crawlMarket();

        const scored = scoreMarket(market);

        // 📊 UPDATE DASHBOARD
        if (dashboardChannel) {
            await updateDashboard(dashboardChannel, scored);
        }

        // 🔥 ALERT SYSTEM (TOP 3 ONLY)
        for (const item of scored.slice(0, 3)) {

            if (item.score < 50) continue;

            const msg =
`💎 ${item.name}
💰 $${item.price}
📊 SCORE: ${item.score}
🧠 AI: ${item.label}`;

            if (item.score >= 70) {
                await send(config.privateChannelId, "🔥 STRONG BUY\n" + msg);
            } else {
                await send(config.premiumChannelId, "📈 OPPORTUNITY\n" + msg);
            }
        }

    } catch (err) {
        console.log("CYCLE ERROR:", err.message);
    }
}

setInterval(cycle, 12000);

client.login(process.env.DISCORD_TOKEN);
