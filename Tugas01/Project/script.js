// Isi file Tugas01/Project/script.js (Pastikan sudah ada)

document.addEventListener("DOMContentLoaded", () => {
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