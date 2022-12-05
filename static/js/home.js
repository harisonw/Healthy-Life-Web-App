console.log("home.js loaded");
window.onload = function () {
  // get articles from the server
  console.log("window loaded");
  fetch("/api/articles")
    .then((response) => response.json())
    .then((data) => {
      console.log(data.articles);
      //create array of articles from json
      articlesArray = data.articles;
      console.log(articlesArray);
      console.log(articlesArray[0].title);

      document.getElementById("top3Div");
      // loop through the first 3 articles of the array and create a card for each article
      // <div class="col-md">
      //   <div class="card mb-3">
      //     <a href="https://articlelink.com">
      //       <img src="img/grey.jpg" class="card-img-top" alt="..." />
      //       <div class="card-body">
      //         <h5 class="card-title text-dark">Article 1</h5>
      //         <p class="card-text text-dark">Quick article preview</p>
      //       </div>
      //     </a>
      //   </div>
      // </div>
      for (let i = 0; i < 3; i++) {
        let colDiv = document.createElement("div");
        colDiv.classList.add("col-md");
        let cardDiv = document.createElement("div");
        cardDiv.classList.add("card");
        cardDiv.classList.add("mb-3");
        let aTag = document.createElement("a");
        aTag.href = articlesArray[i].url;
        let imgTag = document.createElement("img");
        //imgTag.src = articlesArray[i].image;
        imgTag.classList.add("card-img-top");
        imgTag.alt = "...";
        let cardBodyDiv = document.createElement("div");
        cardBodyDiv.classList.add("card-body");
        let h5Tag = document.createElement("h5");
        h5Tag.classList.add("card-title");
        h5Tag.classList.add("text-dark");
        h5Tag.innerText = articlesArray[i].title;
        let pTag = document.createElement("p");
        pTag.classList.add("card-text");
        pTag.classList.add("text-dark");
        //pTag.innerText = articlesArray[i].description;
        cardBodyDiv.appendChild(h5Tag);
        cardBodyDiv.appendChild(pTag);
        aTag.appendChild(imgTag);
        aTag.appendChild(cardBodyDiv);
        cardDiv.appendChild(aTag);
        colDiv.appendChild(cardDiv);
        top3Div.appendChild(colDiv);
      }
    });

    // setup banner - show if user is not already opted in to the newsletter
    fetch("/api/user/checkNewsletter")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      console.log(data.newsletter);
      if (data.newsletter === true) {
        document.getElementById("newsletterBanner").style.display = "none";
      }
    });
};

// when the user clicks the "opt in" button, send a request to the server to update the user's newsletter status
document.getElementById("newsletterButton").addEventListener("click", function () {
  fetch("/api/user/optInNewsletter")
    .then((response) => {
      console.log(response);
      if (response.status === 200) {
        document.getElementById("newsletterButton").innerHTML = "Opted In!";
        // wait 3 seconds and hide the banner
        setTimeout(function () {
          document.getElementById("newsletterBanner").style.display = "none";
        }, 3000);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
