// ubah teks input jadi hitam tebal saat diisi
const inputs = document.querySelectorAll("input");
inputs.forEach(input => {
  input.addEventListener("input", () => {
    if (input.value.trim() !== "") {
      input.classList.add("filled");
    } else {
      input.classList.remove("filled");
    }
  });
});

// login logic
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

  // cari user yang sesuai
  const matchedUser = storedUsers.find(
    user => user.username === username && user.password === password
  );

  if (matchedUser) {
    alert(`Welcome back, ${matchedUser.username}!`);
    localStorage.setItem("loggedInUser", JSON.stringify(matchedUser));
    window.location.href = "../dashboard/dashboard.html";
  } else {
    alert("Invalid username or password!");
  }
});
