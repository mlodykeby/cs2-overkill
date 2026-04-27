require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

const { crawlMarket } = require("./collectors/marketCrawler");
const { calculateArbitrage } = require("./analyzer/arbitrageEngine");

const { buildSteamLink, buildPirateSwapLink } = require("./utils/links");
const config = require("./config");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
    console.log("🚀 ARBITRAGE BOT ONLINE");
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

    const market = await crawlMarket();

    const arb = calculateArbitrage(market);

    for (const a of arb.slice(0, 10)) {

        const msg =
`💎 ${a.name}

💰 BUY: $${a.buyPrice}
💸 SELL: $${a.sellPrice}
📈 PROFIT: $${a.profit} (${a.profitPercent}%)
📊 SCORE: ${a.score}

🔗 Steam: ${buildSteamLink(a.name)}
🏴 PirateSwap: ${buildPirateSwapLink(a.name, config.affiliate.pirateswap)}`;

        if (a.signal === "HIGH_ARB") {
            await send(config.privateChannelId, "👑 HIGH ARBITRAGE\n" + msg);
        }

        else if (a.score > 40) {
            await send(config.premiumChannelId, "🔥 ARBITRAGE\n" + msg);
        }

        else {
            await send(config.publicChannelId, "📦 OPPORTUNITY\n" + msg);
        }
    }
}

// 🔁 SAFE LOOP
setInterval(() => {
    cycle().catch(err => {
        console.log("CYCLE ERROR:", err.message);
    });
}, 15000);

client.login(process.env.DISCORD_TOKEN);
