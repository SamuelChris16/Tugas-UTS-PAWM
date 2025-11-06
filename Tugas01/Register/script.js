document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!username || !email || !password || !phone) {
    alert("Please fill in all fields!");
    return;
  }

  // Cek apakah email sudah terdaftar sebelumnya
  const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
  const userExists = existingUsers.some(user => user.email === email);

  if (userExists) {
    alert("This email is already registered! Please use another one.");
    return;
  }

  // Simpan data user baru ke localStorage
  const newUser = { username, email, password, phone };
  existingUsers.push(newUser);
  localStorage.setItem("users", JSON.stringify(existingUsers));

  alert(`Welcome, ${username}! Registration successful.`);
  this.reset();

  // Redirect otomatis ke halaman login
  window.location.href = "../login/login.html";
});
