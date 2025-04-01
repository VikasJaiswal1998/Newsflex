// API Key and URL (You need to get an API key from https://newsapi.org/)
const API_KEY = 'pub_76578ed0f33cda2b01bf26af43d43e0cd1ee9'; // Replace this with your real key
const BASE_URL = 'https://newsdata.io/api/1/news';
const BACKEND_URL = "http://127.0.0.1:5000/get_filtered_news"; // Flask API ka URL

// Selecting elements
const newsContainer = document.getElementById("news-container");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const IMG404 = "./img/404.jpg"

// Fetch news articles
async function fetchNews(query = "") {
    let url = `${BACKEND_URL}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query: query})
        });

        const data = await response.json();
        console.log("Filtered News:", data);
        
        if (!data.filtered_news) {
            newsContainer.innerHTML = "<p>No relevant news found based on filter.</p>";
            return;
        }

        displayNews(data.filtered_news);
    } catch (error) {
        console.error("Error fetching news:", error);
        newsContainer.innerHTML = "<p>Failed to load news. Please try again later.</p>";
    }
}

// Display news on the webpage
function displayNews(articles) {
    newsContainer.innerHTML = ""; // Clear previous news

    articles.forEach((article) => {
        const newsCard = document.createElement("div"); //separate code 
        newsCard.classList.add("news-card");
        newsCard.innerHTML = `
            <img src="${article.image_url || IMG404}" 
            onerror=${
                function() {
                this.src = IMG404;
                }
            
        } alt="News Image">
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
    fetchNews("");
};