const registerForm = document.getElementById("register-form");
registerForm.addEventListener("submit", registerUser);

async function registerUser(event) {
  event.preventDefault();
  const fname = document.getElementById("inputName").value;
  const email1 = document.getElementById("inputEmailR1").value;
  const email2 = document.getElementById("inputEmailR2").value;
  const password1 = document.getElementById("inputPasswordR1").value;
  const password2 = document.getElementById("inputPasswordR2").value;
  const newsletter = document.getElementById("newsletterCheckChecked").checked;
  console.log(newsletter);
  const data = {
    fname,
    email: email1,
    password: password1,
    newsletter,
  };
  console.log(data);
  const result = await fetch("api/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());

  console.log(result);

  if (result.status === "ok") {
    alert("User registered successfully");
  } else {
    alert(result.error);
  }
}

const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", loginUser);

async function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById("inputEmail1").value;
  const password = document.getElementById("inputPassword1").value;
  const twoFACode = document.getElementById("input2FA").value;
  const data = {
    email,
    password,
    twoFACode,
  };
  console.log(data);
  const result = await fetch("api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());

  console.log(result);

  if (result.status === "ok") {
    localStorage.setItem("token", result.token);
    window.location.href = "home.html";
  } else {
    alert(result.error);
  }
}

const forgotPasswordForm = document.getElementById("forgotPassword-form");
forgotPasswordForm.addEventListener("submit", resetPasswordUser);

async function resetPasswordUser(event) {
  event.preventDefault();
  console.log("reset password");
  const email = document.getElementById("inputEmailReset1").value;
  const data = {
    email,
  };
  console.log(data);
  const result = await fetch("api/user/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());

  console.log(result);

  if (result.status === "ok") {
    //
  } else {
    alert(result.error);
  }
}
