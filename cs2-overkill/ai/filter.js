function filter(items) {

    return items.filter(i => {

        if (i.price < 1) return false;
        if (i.listings < 5) return false;

        const liquidity = i.listings / i.price;

        if (liquidity < 0.03) return false;

        return true;
    });
}

module.exports = { filter };