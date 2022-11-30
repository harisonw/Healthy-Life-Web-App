async function getUserData() {
  const response = await fetch("http://localhost:3000/api/user/get-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: localStorage.getItem("token"),
    }),
  });

  return await response.json();
}

user = getUserData().then((user) => {
  document.getElementById("userNameGreeting").innerHTML = user.fname;

  idValues = {
    sexFormControl: "sex",
    ageFormControl: "age",
    heightFormControl: "height",
    weightFormControl: "weight",
    exerciseFormControl: "avgHrsExercisePW",
    stepsFormControl: "avgStepsPD",
    eatingFormControl: "eatingHabits",
    sleepFormControl: "avgHrsSleepPD",
    alcoholFormControl: "avgUnitsAlcoholPW",
    occupationControl: "occupation",
    //"restingHRFormControl": "restingHR",
    inputName: "fname",
    inputEmail: "email",
    //"newsletterCheck": "newsletter"
  };
  console.log(idValues);

  // for loop
  for (const [key, value] of Object.entries(idValues)) {
    if (typeof document.getElementById(key).value == null) {
      console.log("null document element ID");
    } else {
      if (typeof user[value] == "undefined") {
        console.log(key, "undefined user value");
      } else {
        document.getElementById(key).value = user[value];
      }
    }
  }

  document.getElementById("newsletterCheck").checked = user.newsletter;
});

//when save user info button pressed print
document
  .getElementById("userSaveButton")
  .addEventListener("click", function (event) {
    event.preventDefault();
    console.log("User Save Button Pressed");
    //get values from form
    var fname = document.getElementById("inputName").value;
    var email = document.getElementById("inputEmail").value;
    var newsletter = document.getElementById("newsletterCheck").checked;
    //send to server
    fetch("http://localhost:3000/api/user/update-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
        fname: fname,
        email: email,
        newsletter: newsletter,
      }),
    });
    document.getElementById("userSavedMessage").style.display = "block";
    //wait 3 seconds then hide message
    setTimeout(function () {
      document.getElementById("userSavedMessage").style.display = "none";
    }, 3000);
  });

//when update password button pressed print
document
  .getElementById("updatePasswordButton")
  .addEventListener("click", function (event) {
    event.preventDefault();
    console.log("Update Password Button Pressed");
    //get values from form
    var oldPassword = document.getElementById("inputCurrentPassword").value;
    var newPassword1 = document.getElementById("inputNewPassword1").value;
    var newPassword2 = document.getElementById("inputNewPassword2").value;
    // check if new passwords match
    if (newPassword1 != newPassword2) {
      alert("New passwords do not match");
    } else if (newPassword1.length < 8) {
      alert("New password must be at least 8 characters!");
    } else {
      fetch("http://localhost:3000/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: localStorage.getItem("token"),
          oldPassword: oldPassword,
          newPassword: newPassword1,
        }),
      });
      document.getElementById("updatePasswordMessage").style.display = "block";
      //wait 3 seconds then hide message
      setTimeout(function () {
        document.getElementById("updatePasswordMessage").style.display = "none";
      }, 3000);
      var oldPassword = (document.getElementById("inputCurrentPassword").value =
        "");
      var newPassword1 = (document.getElementById("inputNewPassword1").value =
        "");
      var newPassword2 = (document.getElementById("inputNewPassword2").value =
        "");
    }
  });

//when save health info button pressed print
document
  .getElementById("heathInfoSaveButton")
  .addEventListener("click", function (event) {
    event.preventDefault();
    console.log("Health Info Save Button Pressed");
    //get values from form
    var sex = document.getElementById("sexFormControl").value;
    var age = document.getElementById("ageFormControl").value;
    var height = document.getElementById("heightFormControl").value;
    var weight = document.getElementById("weightFormControl").value;
    var avgHrsExercisePW = document.getElementById("exerciseFormControl").value;
    var avgStepsPD = document.getElementById("stepsFormControl").value;
    var eatingHabits = document.getElementById("eatingFormControl").value;
    var avgHrsSleepPD = document.getElementById("sleepFormControl").value;
    var avgUnitsAlcoholPW = document.getElementById("alcoholFormControl").value;
    var occupation = document.getElementById("occupationControl").value;
    //var restingHR = document.getElementById("restingHRFormControl").value;

    //check if values are valid
    // check if age is integer
    if (Number.isInteger(parseInt(age)) == false) {
      alert("Age must be an integer");
      return;
    } else if (age < 0) {
      alert("Age must be greater than 0");
      return;
    } else if (age > 120) {
      alert("Age must be less than 120");
      return;
    } else if (Number.isInteger(parseInt(height)) == false) {
      alert("Height must be an integer");
      return;
    } else if (height < 10) {
      alert("Height must be greater than 10 cm");
      return;
    } else if (height > 300) {
      alert("Height must be less than 300 cm");
      return;
    } else if (Number.isInteger(parseInt(weight)) == false) {
      alert("Weight must be an integer");
      return;
    } else if (weight < 1) {
      alert("Weight must be greater than 1 kg");
      return;
    } else if (weight > 500) {
      alert("Weight must be less than 500 kg");
      return;
    }

    //send to server
    fetch("http://localhost:3000/api/user/update-user-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
        sex: sex,
        age: age,
        height: height,
        weight: weight,
        avgHrsExercisePW: avgHrsExercisePW,
        avgStepsPD: avgStepsPD,
        eatingHabits: eatingHabits,
        avgHrsSleepPD: avgHrsSleepPD,
        avgUnitsAlcoholPW: avgUnitsAlcoholPW,
        occupation: occupation,
        //restingHR: restingHR
      }),
    });
    document.getElementById("heathInfoSavedMessage").style.display = "block";
    //wait 3 seconds then hide message
    setTimeout(function () {
      document.getElementById("heathInfoSavedMessage").style.display = "none";
    }, 3000);
  });

//when delete account button pressed send to server
document
  .getElementById("deleteAccountButton")
  .addEventListener("click", function (event) {
    event.preventDefault();
    console.log("Delete Account Button Pressed");
    //send to server
    fetch("http://localhost:3000/api/user/delete-account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // logout user
    fetch("http://localhost:3000/api/user/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    alert("Account Deleted!");
    window.location.href = "../";
  });
