console.log("category.js loaded");
window.onload = function () {
  // get articles from the server
  console.log("window loaded");
  // get categories from the url query string
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");
  console.log("category: " + category);

  // set the category title
  // make category title first letter uppercase
  document.getElementById("categoryTitle").innerHTML =
    "Category: " + category.charAt(0).toUpperCase() + category.slice(1);

  fetch("/api/articles/category/" + category)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.articles);
      //create array of articles from json
      articlesArray = data.articles;
      console.log(articlesArray);
      console.log(articlesArray[0].title);

      categoryCardDiv = document.getElementById("categoryCardDiv");
      //create a card for each article
      for (let i = 0; i < articlesArray.length; i++) {
        //create card
        let card = document.createElement("div");
        card.classList.add("col");
        let cardDiv = document.createElement("div");
        cardDiv.classList.add("card");
        //create image - news api doesn't have image url despite the docs saying it does
        let cardImg = document.createElement("img");
        cardImg.classList.add("card-img-top");
        cardImg.src = articlesArray[i].image;
        cardImg.alt = "...";
        //create card body
        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        //create card title
        let cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.innerHTML = articlesArray[i].title;
        //create card text - news api has no description
        // let cardText = document.createElement("p");
        // cardText.classList.add("card-text");
        // cardText.innerHTML = articlesArray[i].description;
        //create card link
        let cardLink = document.createElement("a");
        cardLink.classList.add("btn");
        cardLink.classList.add("btn-primary");
        cardLink.href = "/article.html?id=" + articlesArray[i]._id;
        cardLink.innerHTML = "Read More";
        //append elements
        cardBody.appendChild(cardTitle);
        //cardBody.appendChild(cardText);
        cardBody.appendChild(cardLink);
        cardDiv.appendChild(cardImg);
        cardDiv.appendChild(cardBody);
        card.appendChild(cardDiv);
        categoryCardDiv.appendChild(card);
      }
    });
};
