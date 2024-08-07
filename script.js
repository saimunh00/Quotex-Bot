function goToBot() {
    document.getElementById("home-page").classList.add("hidden");
    document.getElementById("bot").classList.remove("hidden");
}

function generateSignal() {
    const market = document.getElementById("market").value;
    const timeframe = document.getElementById("timeframe").value;
    const timezone = document.getElementById("timezone").value;
    const signal = applyStrategies(market, timeframe, timezone);
    const signalElement = document.getElementById("signal");
    signalElement.innerHTML = `<p class="trade-animation">Signal: ${signal}</p>`;
    signalElement.classList.add("animate");
    setTimeout(() => {
        signalElement.classList.remove("animate");
    }, 1000);
}

function applyStrategies(market, timeframe, timezone) {
    const strategies = [macdStrategy, rsiStrategy, bollingerBands, supportResistance, candlestickPattern, fiftyPercentLevel];
    let signals = strategies.map(strategy => strategy(market, timeframe, timezone));

    signals = signals.filter(signal => signal !== null);

    return signals.length > 0 ? signals[Math.floor(Math.random() * signals.length)] : 'Hold';
}

function getRecentPrices(market, timeframe, timezone) {
    // Dummy data for demonstration purposes
    return [100, 102, 101, 103, 105, 104, 106];
}

function getCurrentPrice(market, timezone) {
    // Dummy data for demonstration purposes
    return 105;
}

function macdStrategy(market, timeframe, timezone) {
    const recentPrices = getRecentPrices(market, timeframe, timezone);
    const macd = calculateMACD(recentPrices);
    if (macd.signal > macd.macd) {
        return 'Buy';
    } else if (macd.signal < macd.macd) {
        return 'Sell';
    }
    return null;
}

function calculateMACD(prices) {
    const emaShort = calculateEMA(prices, 12);
    const emaLong = calculateEMA(prices, 26);
    const macd = emaShort - emaLong;
    const signal = calculateEMA([macd], 9);
    return { macd, signal };
}

function calculateEMA(prices, period) {
    const k = 2 / (period + 1);
    return prices.reduce((acc, price, index) => {
        return index === 0 ? price : price * k + acc * (1 - k);
    }, 0);
}

function rsiStrategy(market, timeframe, timezone) {
    const recentPrices = getRecentPrices(market, timeframe, timezone);
    const rsi = calculateRSI(recentPrices);
    if (rsi > 70) {
        return 'Sell';
    } else if (rsi < 30) {
        return 'Buy';
    }
    return null;
}

function calculateRSI(prices) {
    let gains = 0;
    let losses = 0;
    for (let i = 1; i < prices.length; i++) {
        const difference = prices[i] - prices[i - 1];
        if