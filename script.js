// API Key and URL (You need to get an API key from https://newsapi.org/)
const API_KEY = 'pub_76578ed0f33cda2b01bf26af43d43e0cd1ee9'; // Replace this with your real key
const BASE_URL = 'https://newsdata.io/api/1/news';
// Selecting elements
const newsContainer = document.getElementById("news-container");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

// Fetch news articles
async function fetchNews(query = "") {
    let url;
    
    if (query) {
        url = `${BASE_URL}?apikey=${API_KEY}&q=${query}`;       
    } else {
        url = `${BASE_URL}?apikey=${API_KEY}`;
    }

    console.log(url);

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

        if (!data.results || data.results.length === 0) {
            newsContainer.innerHTML = "<p>No news found. Try a different search!</p>";
            return;
        }

        displayNews(data.results);
    } catch (error) {
        console.error("Error fetching news:", error);
        newsContainer.innerHTML = "<p>Failed to load news. Please try again later.</p>";
    }
}

// Display news on the webpage
function displayNews(articles) {
    newsContainer.innerHTML = ""; // Clear previous news

    articles.forEach((article) => {
        const newsCard = document.createElement("div");
        newsCard.classList.add("news-card");

        newsCard.innerHTML = `
            <img src="${article.image_url || 'https://via.placeholder.com/300'}" alt="News Image">
            <h3>${article.title}</h3>
            <p>${article?.description?.substring(0,500) || "No description available."}</p>
            <a href="${article.source_url}" target="_blank">Read more</a>
        `;

        newsContainer.appendChild(newsCard);
    });
}

// This is the comment for differnce
// Fetch news when search button is clicked
searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    fetchNews(query);
});

// Load default news when page opens
window.onload = () => {
    console.log("on refersh it will load");
    fetchNews();
};