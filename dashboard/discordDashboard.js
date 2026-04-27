let dashboardMessage = null;

async function initDashboard(channel) {
    dashboardMessage = await channel.send("📊 Initializing TRADING UI...");
}

async function updateDashboard(channel, data) {

    if (!dashboardMessage) {
        await initDashboard(channel);
        return;
    }

    const top = data.slice(0, 10);

    const content =
`📊 **CS2 TRADING UI V2**

🔥 TOP OPPORTUNITIES

${top.map(i => {

let emoji =
i.label?.includes("STRONG") ? "🔥" :
i.label?.includes("BUY") ? "📈" :
i.label?.includes("WATCH") ? "👀" : "❌";

return `
${emoji} ${i.name}
💰 $${i.price}
📊 SCORE: ${i.score}
🧠 AI: ${i.label}
`;
}).join("\n")}

────────────────────
⏱ LIVE UPDATE: ${new Date().toLocaleTimeString()}`;

    try {
        await dashboardMessage.edit(content);
    } catch (err) {
        console.log("Dashboard error:", err.message);
    }
}

module.exports = {
    initDashboard,
    updateDashboard
};