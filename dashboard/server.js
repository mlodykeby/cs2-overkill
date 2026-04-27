const express = require("express");
const app = express();

let marketData = [];

function updateData(data) {
    marketData = data;
}

app.get("/api/market", (req, res) => {
    res.json(marketData);
});

app.listen(3000, () => {
    console.log("📊 Dashboard running on port 3000");
});

module.exports = { updateData };
