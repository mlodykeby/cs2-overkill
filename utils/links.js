function buildSteamLink(name) {
    return `https://steamcommunity.com/market/listings/730/${encodeURIComponent(name)}`;
}

function buildPirateSwapLink(name, ref) {
    return `https://pirateswap.com/?ref=${ref}&item=${encodeURIComponent(name)}`;
}

module.exports = {
    buildSteamLink,
    buildPirateSwapLink
};