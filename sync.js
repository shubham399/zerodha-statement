var axios = require('axios');
const fs = require('fs');
require('dotenv').config()
const getData = (page) => {
    // get current date as yyyy-mm-dd
    let date = new Date().toISOString().substr(0, 10);
    var config = {
        method: 'get',
        url: `https://console.zerodha.com/api/ledger?segment=EQ&from_date=2016-04-01&to_date=${date}&page=${page}`,
        headers: {
            'x-csrftoken': process.env.CSRF,
            'cookie': process.env.COOKIE
        }
    };

    return axios(config)
}

const sync = async () => {
    let totalPages = 1;
    let currentPage = 2;
    let data = [];
    let response = await getData(1);
    totalPages = response.data.data.pagination.total_pages;
    data = [...data, ...response.data.data.result.breakdown];
    for (; currentPage <= totalPages; currentPage++) {
        response = await getData(currentPage);
        data = [...data, ...response.data.data.result.breakdown];
    }
    return data;
}

sync().then(data => {
    fs.writeFileSync("./data/ledger.json", JSON.stringify(data, null, 4))
    console.log("Sync Complete.");
}).catch(err => {
    console.log(err.message);
})