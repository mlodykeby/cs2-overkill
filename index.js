require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

const { crawlMarket } = require("./collectors/marketCrawler");
const { detectPumpSignals } = require("./analyzer/pumpDetector");
const { updateData } = require("./dashboard/server");

const config = require("./config");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
    console.log("🚀 BOT ONLINE");
});

async function send(channelId, msg) {
    try {
        const channel = await client.channels.fetch(channelId);
        if (channel) await channel.send(msg);
    } catch (e) {
        console.log("SEND ERROR:", e.message);
    }
}

async function cycle() {

    console.log("CYCLE START");

    const market = await crawlMarket();

    console.log("MARKET SIZE:", market.length);

    const pumps = detectPumpSignals(market);

    if (pumps.length > 0) {
        console.log("🔥 PUMP SIGNALS:", pumps.length);

        for (const p of pumps) {
            await send(config.privateChannelId,
                `🔥 PUMP ALERT\n💎 ${p.name}\n💰 $${p.price}\n📊 SCORE ${p.score}`
            );
        }
    }

    updateData(market);
}

setInterval(cycle, 15000);

client.login(process.env.TOKEN);
