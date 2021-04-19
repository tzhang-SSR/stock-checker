function getSymbol(params = '') {
    const BASE_URL = 'https://finnhub.io/api/v1/search'
    return fetch(BASE_URL + params).then((response) =>
        response.json()
    );
}

function getQuotes(params = '') {
    const BASE_URL = 'https://finnhub.io/api/v1/quote'
    return fetch(BASE_URL + params).then((response) =>
        response.json()
    );
}

function getCandles(params = '') {
    const BASE_URL = 'https://finnhub.io/api/v1/stock/candle'
    return fetch(BASE_URL + params, {mode: 'cors'}).then((response) =>
        response.json()
    );
}

function getUSSymbols(params = '') {
    const BASE_URL = 'https://finnhub.io/api/v1/stock/symbol?exchange=US&'
    return fetch(BASE_URL + params).then((response) =>
        response.json()
    );
}

function getCompanyPeers(params = '') {
    const BASE_URL = 'https://finnhub.io/api/v1/stock/peers'
    return fetch(BASE_URL + params).then((response) =>
        response.json()
    );
}

export { getQuotes, getSymbol, getCandles, getUSSymbols, getCompanyPeers }