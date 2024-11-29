const express = require('express'); // Web framework for building the server
const axios = require('axios'); // Library for making HTTP requests
const cheerio = require('cheerio'); // Library for parsing and extracting data from HTML
const cors = require('cors'); // Middleware to allow cross-origin requests

const app = express();
app.use(cors()); // Enable CORS so the server can handle requests from other origins
// Route to fetch and return articles from BBC
app.get('/fetch-bbc', (req, res) => {
    // Fetch the BBC homepage
    axios.get('https://bbc.com')
        .then(({ data }) => {
            const $ = cheerio.load(data); // Load the HTML content into Cheerio for parsing
            const articles = [];
            // Loop through all anchor tags to find articles
            $('a').each((_, element) => {
                const title = $(element).text().trim(); // Get the text inside the anchor tag
                const link = $(element).attr('href'); // Get the URL from the href attribute
                // If a valid title and relative link exist, add it to the articles list
                if (title && link?.startsWith('/')) {
                    articles.push({
                        title,
                        description: `https://bbc.com${link}`, // Build the full URL
                    });
                }
            });
            res.json(articles); // Send the list of articles as a JSON response
        })
        .catch(() => {
            res.status(500).send('Error fetching BBC data'); // Handle errors and respond with status 500
        });
});
// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server is running!');
    console.log('Visit: http://localhost:3000');
});
