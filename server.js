const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/fetch-bbc', (req, res) => {
    axios.get('https://bbc.com')
        .then(response => {
            const $ = cheerio.load(response.data);
            const articles = $('a')
                .map((_, el) => {
                    const title = $(el).text().trim();
                    const description = $(el).attr('href');
                    return title && description ? { title, description } : null;
                })
                .get();
            res.json(articles);
        })
        .catch(() => res.status(500).send('Error fetching or parsing BBC data'));
});

app.listen(3000, () => console.log('Proxy running on http://localhost:3000'));
