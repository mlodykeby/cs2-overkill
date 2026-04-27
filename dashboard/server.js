const express = require("express");
const app = express();

let latestData = [];

function updateData(data) {
    latestData = data;
}

app.get("/api/market", (req, res) => {
    res.json(latestData);
});

app.get("/", (req, res) => {
    res.send(`
        <html>
        <head>
            <title>CS2 Dashboard</title>
        </head>
        <body style="background:#111;color:white;font-family:Arial">

            <h1>📊 CS2 Market Live</h1>
            <div id="data"></div>

            <script>
                async function load() {
                    const res = await fetch('/api/market');
                    const data = await res.json();

                    document.getElementById("data").innerHTML =
                        data.map(i =>
                            "<p>💎 " + i.name + " | $" + i.price + "</p>"
                        ).join("");
                }

                setInterval(load, 3000);
                load();
            </script>

        </body>
        </html>
    `);
});

app.listen(3000, () => console.log("Dashboard running"));
module.exports = { updateData };