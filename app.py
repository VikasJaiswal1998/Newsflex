from flask import Flask, request, jsonify
import requests
from google import genai

app = Flask(__name__)

# Gemini API Key
client = genai.Client(api_key="AIzaSyCA4fa7oLURemvr92Jo0hdDoWJweIOYXtg")

# News API Key
NEWS_API_KEY = "pub_7724393bc1767e7c704eabb315c3881ddbc6e"
NEWS_API_URL = "https://newsdata.io/api/1/news"

# Function to get news from News API
def get_news(query=""):
    params = {"apikey": NEWS_API_KEY}
    if query:
        params["q"] = query

    response = requests.get(NEWS_API_URL, params=params)
    return response.json()

# Function to filter news using Gemini AI
def filter_news(articles, query):
    # model = genai.GenerativeModel("gemini-2.0-flash")
    filter_prompt = f"""You are given a list of news article objects: {articles}. Each article object has various fields such as "article_id", "title", "link", "keywords", "creator", "description", etc. 

Filter the array to include only the 5 articles that are most relevant to the following query: "{query}". 

Important:
1. Do not add any additional text or JSON formatting wrappers like json: [].
2. Do not change the structure or format of the JSON object.
3. The output must still be a JSON object with a "results" key.
4. Each article object in the output must include all the original keys and values exactly as in the input (only filtered).
5. If fewer than 5 articles are relevant, return only those that match.

Return only the filtered JSON object list.
"""
    # prompt = f"{filter_prompt}\n\n {articles}"
    
    response = client.models.generate_content(
        model="gemini-2.0-flash", contents=filter_prompt
    )
    # response = model.generate_content(prompt)
    
    # print(response.text)
    with open("geminioutput.txt", 'w', encoding='utf-8') as f:
        f.write(str(response.text))
    return response.text

# API Endpoint to fetch and filter news
@app.route("/get_filtered_news", methods=["POST"])
def get_filtered_news():
    data = request.json
    query = data.get("query", "")

    news_data = get_news(query)

    if not news_data or "results" not in news_data:
        return jsonify({"error": "Failed to fetch news"}), 500

    # print(news_data)
    articles = news_data["results"]
    print(len(articles))
    filtered_news = filter_news(articles, query)

    return jsonify({"filtered_news": filtered_news})

if __name__ == "__main__":
    app.run(debug=True)
