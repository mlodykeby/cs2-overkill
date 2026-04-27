function selectTop(signals) {

    const sorted = signals.sort((a,b)=> b.score - a.score);

    const topPercent = Math.ceil(sorted.length * 0.05);

    return sorted.slice(0, topPercent);
}

module.exports = { selectTop };