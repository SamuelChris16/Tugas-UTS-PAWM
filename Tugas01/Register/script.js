document.addEventListener('DOMContentLoaded', () => {
  const selectors = 'input[type="text"], input[type="email"], input[type="password"], input[type="tel"], textarea';
  const inputs = document.querySelectorAll(selectors);

  function updateField(el) {
    if (el.value.trim() !== '') el.classList.add('filled');
    else el.classList.remove('filled');
  }

  inputs.forEach(el => {
    updateField(el); // inisialisasi (jika ada nilai awal)
    el.addEventListener('input', () => updateField(el));
    el.addEventListener('blur', () => updateField(el));
  });
});

document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const phone = document.getElementById("phone").value;

  if (!username || !email || !password || !phone) {
    alert("Please fill in all fields!");
    return;
  }

  alert(`Welcome, ${username}! Registration successful.`);
  this.reset();
});
