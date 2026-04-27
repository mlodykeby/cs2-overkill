const express = require("express");
const { getState } = require("./state");

const app = express();

// 🔥 API
app.get("/api/data", (req, res) => {
    res.json(getState());
});

// 📊 UI
app.get("/", (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
<title>CS2 Trading Dashboard</title>
<style>
body { background:#0f0f0f; color:white; font-family:Arial; }
.card { padding:10px; margin:10px; border:1px solid #333; }
.green { color:#00ff88; }
.red { color:#ff4444; }
</style>
</head>

<body>

<h1>📊 CS2 LIVE DASHBOARD</h1>

<div id="arb"></div>

<script>
async function load() {
    const res = await fetch('/api/data');
    const data = await res.json();

    document.getElementById("arb").innerHTML =
        "<h2>🔥 Arbitrage</h2>" +
        data.arbitrage.map(i =>
            "<div class='card'>" +
            "💎 " + i.name + "<br>" +
            "📈 Profit: <span class='green'>$" + i.profit + "</span><br>" +
            "📊 Score: " + i.score +
            "</div>"
        ).join("");
}

setInterval(load, 3000);
load();
</script>

</body>
</html>
    `);
});

app.listen(3000, () => {
    console.log("📊 Dashboard running on port 3000");
});

module.exports = app;
