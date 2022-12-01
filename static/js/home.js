console.log("home.js loaded");
window.onload = function() {
    // get articles from the server
    console.log("window loaded");
    fetch("/api/articles")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // data is an array of articles
            // data[0].title
            // data[0].description
            // data[0].url
            // data[0].urlToImage
            // data[0].publishedAt
            // data[0].source.name
            // data[0].content
            // populate the page with the articles
            let top3Div = document.getElementById("top3Div");
            
        });
    }