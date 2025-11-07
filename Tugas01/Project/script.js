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
  // --- KODE ASLI DARI PROJECT/SCRIPT.JS ---
  // ----------------------------------------------------

  // 1. Ambil elemen-elemen yang diperlukan
  const searchInput = document.getElementById("project-search");
  const projectGrid = document.getElementById("project-grid");
  const projectCards = projectGrid.querySelectorAll(".project-card");

  // 2. Tambahkan event listener 'keyup' (dijalankan setiap kali user mengetik)
  searchInput.addEventListener("keyup", (event) => {
    const searchTerm = event.target.value.toLowerCase().trim();

    // 3. Loop melalui setiap kartu proyek
    projectCards.forEach(card => {
      // Ambil teks dari nama & deskripsi proyek
      const projectName = card.querySelector("h5").textContent.toLowerCase();
      const projectDescription = card.querySelector(".description-box p").textContent.toLowerCase();

      // 4. Logika untuk menampilkan atau menyembunyikan kartu
      if (projectName.includes(searchTerm) || projectDescription.includes(searchTerm)) {
        card.style.display = "block"; // Tampilkan jika cocok
      } else {
        card.style.display = "none"; // Sembunyikan jika tidak cocok
      }
    });
  });
});