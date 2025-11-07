document.addEventListener("DOMContentLoaded", () => {
  // === BLOK PROTEKSI LOGIN (DIPASTIKAN DI PALING ATAS) ===
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    alert("Anda harus login untuk mengakses formulir pendaftaran event.");
    window.location.href = "../Login/index.html";
    return; // Hentikan eksekusi script
  }
  // === AKHIR BLOK PROTEKSI LOGIN ===
  
  // === FUNGSI UNIVERSAL CEK & TAMPILKAN STATUS LOGIN UNTUK NAVBAR ===
  // (Tambahkan fungsi ini untuk memastikan Navbar berfungsi setelah login)
  function checkLoginStatus() {
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const userProfileContainer = document.getElementById("userProfileContainer");
    const userNameDisplay = document.getElementById("userNameDisplay");
    const logoutBtn = document.getElementById("logoutBtn");

    if (loggedInUser) {
      if (loginBtn) loginBtn.style.display = 'none';
      if (registerBtn) registerBtn.style.display = 'none';
      if (userProfileContainer) userProfileContainer.classList.remove('hidden');
      if (userNameDisplay) userNameDisplay.textContent = loggedInUser.username;
      
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem("loggedInUser");
          alert("Anda telah berhasil keluar (Logout).");
          window.location.href = "../Home/index.html"; 
        });
      }
    }
  }
  checkLoginStatus();
  // === BATAS FUNGSI NAVBAR ===

  const eventQuestion = document.getElementById("event-question");
  const registerForm = document.getElementById("registerForm");

  // 1. Ambil nama event dari URL
  const params = new URLSearchParams(window.location.search);
  const eventName = params.get('event');

  if (eventName) {
    eventQuestion.textContent = `Would you be attending the ${eventName} event?`;
  } else {
    eventQuestion.textContent = "Would you be attending the event?";
  }

  // 2. Handle submit form
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Ambil semua data dari form
    const attendingEl = document.querySelector('input[name="attending"]:checked');
    if (!attendingEl) {
        alert("Please select 'Yes' or 'No'.");
        return;
    }
    const attending = attendingEl.value;
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const guests = document.getElementById("guests").value;

    if (attending === 'no') {
      alert("Thanks for letting us know!");
      window.location.href = "/Tugas01/Event/index.html"; // Kembali ke daftar event
      return;
    }

    // Buat objek pendaftaran
    const newRegistration = {
      eventName: eventName || "Unknown Event",
      firstName,
      lastName,
      email,
      phone,
      guests,
      username: loggedInUser.username, 
      timestamp: new Date().toISOString()
    };

    // Simpan ke localStorage
    const registrations = JSON.parse(localStorage.getItem("eventRegistrations")) || [];
    registrations.push(newRegistration);
    localStorage.setItem("eventRegistrations", JSON.stringify(registrations));

    // Beri notifikasi dan redirect
    alert(`Registration for ${eventName} successful! Thank you, ${firstName}.`);
    window.location.href = "../Event/index.html"; // Kembali ke daftar event
  });
});