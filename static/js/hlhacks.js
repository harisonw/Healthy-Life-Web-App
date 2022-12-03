// get user for like/unlike view
var user = fetch("http://localhost:3000/api/user/get-user", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    placeholder: "placeholder",
  }),
})
  .then((response) => response.json())
  .then((data) => {
    user = data;
  });

function getPosts() {
  console.log("starting");
  // get posts from database
  var posts = fetch("http://localhost:3000/api/posts/get-all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // reverse loop through posts and display them
      for (var i = data.length - 1; i >= 0; i--) {
        var post = data[i];
        var postRow = document.getElementById("postRow");
        var postCol = document.createElement("div");
        postCol.className = "col-md-4 my-2 d-flex align-items-stretch";
        var card = document.createElement("div");
        card.className = "card";
        card.id = post._id; // use for like function
        var cardBody = document.createElement("div");
        cardBody.className = "card-body";
        var title = document.createElement("h5");
        title.className = "mt-1";
        title.innerHTML = post.title;
        var description = document.createElement("p");
        description.className = "mx-auto";
        description.innerHTML = post.body;
        var image = document.createElement("img");
        image.className = "img-fluid card-img-top mb-2";
        image.src = "api/posts/uploads/" + post.photo;
        //image.src = "http://localhost:3000/api/posts/uploads/" + post.photo;
        var likeButton = document.createElement("button");
        likeButton.id = post._id; // use for like function
        likeButton.className = "likeButton mt-auto btn btn-primary mt-2 ";
        // if user has liked post, show unlike button
        //console.log("id", user._id)
        console.log("likes: " + post.likes);
        if (post.likes.includes(user._id)) {
          likeButton.innerHTML =
            "Unlike <small>(" + post.likes.length + ")</small>";
        } else {
          likeButton.innerHTML =
            "Like <small>(" + post.likes.length + ")</small>";
        }

        var time = document.createElement("p");
        time.className = "text-secondary mb-0 mx-auto";
        // calculate time since post
        var timeSince = new Date() - new Date(post.createdAt);
        timeSince = Math.floor(timeSince / 1000 / 60);
        if (timeSince < 60) {
          time.innerHTML = timeSince + " Minutes Ago";
        } else if (timeSince < 1440) {
          timeSince = Math.floor(timeSince / 60);
          time.innerHTML = timeSince + " Hours Ago";
        } else {
          timeSince = Math.floor(timeSince / 1440);
          time.innerHTML = timeSince + " Days Ago";
        }

        // add user who posted
        var userPosted = document.createElement("p");
        userPosted.className = "text-secondary mb-0 mx-auto";
        userPosted.innerHTML = "Posted by: " + post.user.fname;

        cardBody.appendChild(title);
        cardBody.appendChild(description);
        cardBody.appendChild(image);
        cardBody.appendChild(likeButton);
        cardBody.appendChild(time);
        cardBody.appendChild(userPosted);
        card.appendChild(cardBody);
        postCol.appendChild(card);
        postRow.appendChild(postCol);
      }
    })
    .then(() => {
      // add event listeners to like buttons
      var likeButtons = document.getElementsByClassName("likeButton");
      for (var i = 0; i < likeButtons.length; i++) {
        console.log("like button: :", likeButtons[i]);
        likeButtons[i].addEventListener("click", function () {
          likePost(this.id);
          location.reload();
        });
      }
    });
}

getPosts();

// when user likes a post, update the database
function likePost(postID) {
  console.log("like post", postID);
  var post = fetch("http://localhost:3000/api/posts/like", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      postID: postID,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
}

// wait for dom to load
document.addEventListener("DOMContentLoaded", function () {
  console.log("dom loaded");
  // add event listener to submit post button
  document
    .getElementById("submitPostButton")
    .addEventListener("click", function () {
      console.log("submit post button clicked");
      // get values from form
      var title = document.getElementById("titleTextarea").value;
      var body = document.getElementById("postTextarea").value;
      var image = document.getElementById("formFile").files[0];
      // check values are not empty
      if (title == "" || body == "" || image == null) {
        alert("Please fill in all fields");
        return;
      }

      // create form data
      const formData = new FormData();
      //console.log("title: ", title);
      //console.log("body: ", body);
      //console.log("image: ", image);
      formData.append("title", title);
      formData.append("body", body);
      formData.append("image", image);
      //console.log("form data: ", formData);
      // send post to database
      var post = fetch("http://localhost:3000/api/posts/upload", {
        method: "POST",
        body: formData,
      }).then((response) => {
        json = response.json();
        console.log(json);
        if (response.status == 200) {
          alert("Post uploaded successfully");
          location.reload();
        } else {
          alert("Error uploading post");
        }
      });
    });
});
