document.addEventListener("DOMContentLoaded", () => {
  
  function updateToolQuantities() {
    // 1. Ambil database alat dari localStorage
    const allTools = JSON.parse(localStorage.getItem("labTools")) || [];

    // 2. Jika databasenya tidak ada, jangan lakukan apa-apa
    if (allTools.length === 0) {
      console.warn("Database labTools tidak ditemukan. Kuantitas di Home mungkin statis.");
      return;
    }

    // 3. Loop setiap kartu alat yang ada di Halaman Home
    document.querySelectorAll(".tools-container .preview-card").forEach(card => {
      const bookButton = card.querySelector(".btn-primary.tool-book");
      const quantityElement = card.querySelector(".card-quantity");
      
      // 4. Dapatkan nama alat dari data-*"attribute"*
      const toolName = bookButton?.dataset.toolName;

      if (toolName && quantityElement) {
        // 5. Cari data alat yang sesuai di database
        const toolData = allTools.find(t => t.name === toolName);

        if (toolData) {
          // 6. PERBARUI TEKS KUANTITAS dengan data asli
          quantityElement.textContent = `Quantity: ${toolData.quantity}`;

          // 7. Nonaktifkan tombol jika kuantitas 0
          if (toolData.quantity === 0) {
            bookButton.textContent = "Unavailable";
            bookButton.disabled = true;
            bookButton.style.backgroundColor = "#555";
            bookButton.style.cursor = "not-allowed";
          } else {
            // Pastikan tombol aktif jika kuantitas > 0
            bookButton.textContent = "Book Now";
            bookButton.disabled = false;
            bookButton.style.backgroundColor = ""; // Kembali ke style CSS
            bookButton.style.cursor = "pointer";
          }
        }
      }
    });
  }

  
  // Panggil fungsi baru tersebut saat halaman dimuat
  updateToolQuantities();
  

  // --- LOGIKA UNTUK KARTU EVENT (Sudah benar) ---
  document.querySelectorAll(".event-card").forEach(card => {
    card.addEventListener("click", () => {
      const eventName = card.dataset.eventName;
      if (eventName) {
        window.location.href = `../EventDetail/index.html?event=${encodeURIComponent(eventName)}`;
      }
    });
  });

  // 1. Tombol "Details" Tools
  document.querySelectorAll(".tool-detail").forEach(button => {
    button.addEventListener("click", (e) => {
      e.stopPropagation(); 
      const toolName = e.target.dataset.toolName;
      if (toolName) {
        window.location.href = `../ToolDetail/index.html?tool=${encodeURIComponent(toolName)}`;
      }
    });
  });

  // 2. Tombol "Book Now" Tools
  document.querySelectorAll(".tool-book").forEach(button => {
    button.addEventListener("click", (e) => {
      e.stopPropagation(); 
      const toolName = e.target.dataset.toolName;
      if (toolName) {
        // Logika ini sudah ada di dalam updateToolQuantities(),
        // tapi biarkan saja untuk memastikan navigasi tetap berjalan
        window.location.href = `../ToolBooking/index.html?tool=${encodeURIComponent(toolName)}`;
      }
    });
  });

});