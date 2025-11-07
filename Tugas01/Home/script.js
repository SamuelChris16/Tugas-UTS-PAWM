document.addEventListener("DOMContentLoaded", () => {

  // --- LOGIKA UNTUK KARTU EVENT (BARU) ---
  // Membuat seluruh kartu event bisa diklik
  document.querySelectorAll(".event-card").forEach(card => {
    card.addEventListener("click", () => {
      const eventName = card.dataset.eventName;
      if (eventName) {
        // Arahkan ke halaman EventDetail
        window.location.href = `../EventDetail/index.html?event=${encodeURIComponent(eventName)}`;
      }
    });
  });

  // --- LOGIKA UNTUK TOMBOL TOOLS (Sama seperti sebelumnya) ---

  // 1. Tombol "Details" Tools
  document.querySelectorAll(".tool-detail").forEach(button => {
    button.addEventListener("click", (e) => {
      // Menghentikan event 'click' agar tidak 'bubble up' ke kartu
      e.stopPropagation(); 
      
      const toolName = e.target.dataset.toolName;
      if (toolName) {
        // Arahkan ke halaman ToolDetail
        window.location.href = `../ToolDetail/index.html?tool=${encodeURIComponent(toolName)}`;
      }
    });
  });

  // 2. Tombol "Book Now" Tools
  document.querySelectorAll(".tool-book").forEach(button => {
    button.addEventListener("click", (e) => {
      // Menghentikan event 'click' agar tidak 'bubble up' ke kartu
      e.stopPropagation(); 
      
      const toolName = e.target.dataset.toolName;
      if (toolName) {
        window.location.href = `../ToolBooking/index.html?tool=${encodeURIComponent(toolName)}`;
      }
    });
  });

});