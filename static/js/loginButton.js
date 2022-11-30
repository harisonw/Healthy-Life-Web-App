// when user logged in change the login button to logout
function checkLogin() {
  console.log("checkLogin");
  try {
    fetch("/api/user/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.status === 200) {
        console.log("logged in");
        document.getElementById("loginButton").hidden = true;
        document.getElementById("logoutButton").hidden = false;
      } else {
        console.log("not logged in");
        document.getElementById("loginButton").hidden = false;
        document.getElementById("logoutButton").hidden = true;
      }
    });
  } catch (error) {
    console.log(error);
  }
}
checkLogin();
