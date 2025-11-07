document.addEventListener("DOMContentLoaded", () => {
  
  // === FUNGSI UNIVERSAL CEK & TAMPILKAN STATUS LOGIN ===
  function checkLoginStatus() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    
    // Ambil elemen-elemen navbar
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const userProfileContainer = document.getElementById("userProfileContainer");
    const userNameDisplay = document.getElementById("userNameDisplay");
    const logoutBtn = document.getElementById("logoutBtn");

    if (loggedInUser) {
      // User sudah login
      if (loginBtn) loginBtn.style.display = 'none';
      if (registerBtn) registerBtn.style.display = 'none';
      if (userProfileContainer) userProfileContainer.classList.remove('hidden');
      if (userNameDisplay) userNameDisplay.textContent = loggedInUser.username;
      
      // Tambahkan event listener untuk Logout
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem("loggedInUser"); // Hapus data login
          alert("Anda telah berhasil keluar (Logout).");
          window.location.href = "/index.html"; 
        });
      }
    } else {
      // User belum login
      if (loginBtn) loginBtn.style.display = 'block';
      if (registerBtn) registerBtn.style.display = 'block';
      if (userProfileContainer) userProfileContainer.classList.add('hidden');
    }
  }

  // Panggil fungsi cek status di awal pemuatan halaman (WAJIB)
  checkLoginStatus();

  // ----------------------------------------------------
  // --- KODE ASLI DARI ORGANIZATION/SCRIPT.JS ---
  // ----------------------------------------------------
  // console.log("Halaman Organization dimuat!");
});