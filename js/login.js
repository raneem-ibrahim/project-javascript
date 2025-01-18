document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.querySelector(".cta-btn");

  const errorEmail = document.getElementById("erroremail");
  const errorPassword = document.getElementById("errorpassword");

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  emailInput.addEventListener("input", () => (errorEmail.textContent = ""));
  passwordInput.addEventListener(
    "input",
    () => (errorPassword.textContent = "")
  );

  loginButton.addEventListener("click", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    errorEmail.textContent = "";
    errorPassword.textContent = "";

    let isValid = true;

    if (!email) {
      errorEmail.textContent = "Email is required.";
      isValid = false;
    }

    if (!password) {
      errorPassword.textContent = "Password is required.";
      isValid = false;
    }

    if (isValid) {
      const storedUsers = JSON.parse(localStorage.getItem("users"));

      if (storedUsers) {
        const user = storedUsers.find((u) => u.email === email);

        if (user) {
          if (user.password === password) {
            alert("Login successful! Redirecting...");
            window.location.href = "dashboard.html";
          } else {
            errorPassword.textContent = "Incorrect password.";
          }
        } else {
          errorEmail.textContent =
            "No account found with that email. Please sign up first.";
        }
      } else {
        errorEmail.textContent = "No accounts found. Please sign up first.";
      }
    }
  });
});
