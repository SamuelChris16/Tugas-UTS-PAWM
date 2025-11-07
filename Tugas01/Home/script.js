document.addEventListener("DOMContentLoaded", () => {

  // --- LOGIKA UNTUK TOMBOL EVENT ---
  
  // 1. Tombol "Details" Event
  document.querySelectorAll(".event-detail").forEach(button => {
    button.addEventListener("click", (e) => {
      const eventName = e.target.dataset.eventName;
      if (eventName) {
        window.location.href = `../EventDetail/index.html?event=${encodeURIComponent(eventName)}`;
      }
    });
  });

  // 2. Tombol "Register" Event
  document.querySelectorAll(".event-register").forEach(button => {
    button.addEventListener("click", (e) => {
      const eventName = e.target.dataset.eventName;
      if (eventName) {
        window.location.href = `../EventRegister/index.html?event=${encodeURIComponent(eventName)}`;
      }
    });
  });

  // --- LOGIKA UNTUK TOMBOL TOOLS ---

  // 3. Tombol "Details" Tools
  document.querySelectorAll(".tool-detail").forEach(button => {
    button.addEventListener("click", (e) => {
      const toolName = e.target.dataset.toolName;
      if (toolName) {
        // Asumsi halaman detail tool akan dibuat nanti
        // window.location.href = `../ToolDetail/index.html?tool=${encodeURIComponent(toolName)}`;
        alert(`Navigasi ke Detail untuk: ${toolName}`); // Placeholder
      }
    });
  });

  // 4. Tombol "Book Now" Tools
  document.querySelectorAll(".tool-book").forEach(button => {
    button.addEventListener("click", (e) => {
      const toolName = e.target.dataset.toolName;
      if (toolName) {
        window.location.href = `../ToolBooking/index.html?tool=${encodeURIComponent(toolName)}`;
      }
    });
  });

});