const signupButton = document.querySelector(".cta-btn");
const errorFname = document.getElementById("errorfname");
const errorLname = document.getElementById("errorlname");
const errorEmail = document.getElementById("erroremail");
const errorPassword = document.getElementById("errorpassword");
const errorCpassword = document.getElementById("errorcpassword");

const firstNameInput = document.getElementById("fname");
const lastNameInput = document.getElementById("lname");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("cpassword");

const clearError = (inputElement, errorElement) => {
  inputElement.addEventListener("input", () => {
    errorElement.textContent = "";
  });
};

clearError(firstNameInput, errorFname);
clearError(lastNameInput, errorLname);
clearError(emailInput, errorEmail);
clearError(passwordInput, errorPassword);
clearError(confirmPasswordInput, errorCpassword);

signupButton.addEventListener("click", (e) => {
  e.preventDefault();

  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  errorFname.textContent = "";
  errorLname.textContent = "";
  errorEmail.textContent = "";
  errorPassword.textContent = "";
  errorCpassword.textContent = "";

  let isValid = true;

  if (!firstName) {
    errorFname.textContent = "First name is required.";
    isValid = false;
  }

  if (!lastName) {
    errorLname.textContent = "Last name is required.";
    isValid = false;
  }

  if (!email) {
    errorEmail.textContent = "Email is required.";
    isValid = false;
  } else if (!emailRegex.test(email)) {
    errorEmail.textContent = "Enter a valid email address.";
    isValid = false;
  }

  if (!password) {
    errorPassword.textContent = "Password is required.";
    isValid = false;
  } else if (!passwordRegex.test(password)) {
    errorPassword.textContent =
      "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, and a number.";
    isValid = false;
  }

  if (!confirmPassword) {
    errorCpassword.textContent = "Confirm password is required.";
    isValid = false;
  } else if (password !== confirmPassword) {
    errorCpassword.textContent = "Passwords do not match.";
    isValid = false;
  }

  if (isValid) {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      alert("This email is already registered. Please log in.");
    } else {
      users.push({
        email: email,
        password: password,
      });

      localStorage.setItem("users", JSON.stringify(users));

      alert("Sign-up successful! Redirecting to login page...");
      window.location.href = "./login.html";
    }
  }
});
