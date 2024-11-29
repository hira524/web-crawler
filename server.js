const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio');
const app = express();

app.use(cors());


app.get('/fetch-bbc', async (req, res) => {
    try {
        // Fetch the HTML content from the BBC website
        const response = await axios.get('https://bbc.com');

        // Load the HTML into Cheerio
        const $ = cheerio.load(response.data);

        // Initialize an array to hold the article data
        const articles = [];

        // Loop through each article (adjust selector if necessary)
        $('a').each((index, element) => {
            const title = $(element).text().trim();
            const description = $(element).attr('href'); // If description is in the link
            // Check if we got a valid title and description
            if (title && description) {
                articles.push({ title, description });
            }
        });

        // Send the articles back in the response
        res.json(articles);
    } catch (err) {
        res.status(500).send('Error fetching or parsing BBC data');
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Proxy running on port ${PORT}`);
    console.log(`Access it at: http://localhost:${PORT}`);
});
