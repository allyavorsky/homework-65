const getUsersBtn = document.getElementById("get-users-btn");
const usersListContainer = document.getElementById("users-list-container");

const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");

const registerEmail = document.getElementById("register-email");
const registerPassword = document.getElementById("register-password");

const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");

const protectedBtn = document.getElementById("protected-btn");
const logoutBtn = document.getElementById("logout-btn");

const statusMessage = document.getElementById("status-message");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = {
    email: registerEmail.value,
    password: registerPassword.value,
  };

  const response = await fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const message = await response.text();
  statusMessage.textContent = message;
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = {
    email: loginEmail.value,
    password: loginPassword.value,
  };

  const response = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const message = await response.text();
  statusMessage.textContent = message;
});

protectedBtn.addEventListener("click", async () => {
  const response = await fetch("/protected", {
    method: "GET",
  });

  const message = await response.text();
  statusMessage.textContent = message;
});

logoutBtn.addEventListener("click", async () => {
  const response = await fetch("/logout", {
    method: "POST",
  });

  const message = await response.text();
  statusMessage.textContent = message;
});

getUsersBtn.addEventListener("click", async () => {
  statusMessage.textContent = "Отримання списку користувачів...";
  usersListContainer.innerHTML = "";

  const response = await fetch("/api/users", {
    method: "GET",
  });

  if (response.status === 401) {
    statusMessage.textContent = "Будь ласка, увійдіть, щоб побачити список.";
    return;
  }

  if (!response.ok) {
    statusMessage.textContent = "Не вдалося отримати список користувачів.";
    return;
  }

  const users = await response.json();

  if (users.length === 0) {
    statusMessage.textContent = "Не знайдено зареєстрованих користувачів.";
    return;
  }

  statusMessage.textContent = "Список зареєстрованих користувачів:";

  const ul = document.createElement("ul");
  users.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = user.email;
    ul.appendChild(li);
  });
  usersListContainer.appendChild(ul);
});
