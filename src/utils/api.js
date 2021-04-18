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

export { getQuotes, getSymbol }