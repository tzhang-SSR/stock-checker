export default function getSymbol(params = '') {
    // access params to add to your query. This will help in the next phase.
    const BASE_URL = 'https://finnhub.io/api/v1/search'
    return fetch(BASE_URL + params).then((response) =>
        response.json()
    );
}