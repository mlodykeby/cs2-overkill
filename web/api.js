const express = require("express");
const { load } = require("../engine/indexDB");

const app = express();

app.get("/", (req,res) => {

    const data = load();

    res.json({
        marketSize: data.length,
        sample: data.slice(0, 50)
    });
});

app.listen(3000, () => {
    console.log("API running on 3000");
});