let msg = null;

async function initDashboard(channel) {
    msg = await channel.send("📊 Loading dashboard...");
}

async function updateDashboard(channel, data) {

    if (!msg) {
        await initDashboard(channel);
        return;
    }

    const top = data.slice(0, 10);

    const content =
`📊 CS2 LIVE DASHBOARD

🔥 TOP OPPORTUNITIES:

${top.map(i => {
let emoji =
i.label.includes("STRONG") ? "🔥" :
i.label.includes("BUY") ? "📈" :
i.label.includes("WATCH") ? "👀" : "❌";

return `${emoji} ${i.name}
💰 $${i.price}
📊 SCORE ${i.score}
🧠 ${i.label}`;
}).join("\n\n")}

⏱ ${new Date().toLocaleTimeString()}`;

    try {
        await msg.edit(content);
    } catch (e) {
        console.log("Dashboard error:", e.message);
    }
}

module.exports = {
    initDashboard,
    updateDashboard
};
