document.addEventListener("DOMContentLoaded", () => {
  // === DATA SIMULASI (Database Event) ===
  // Anda bisa tambahkan event sebanyak mungkin di sini
  // Pastikan format tanggal YYYY-MM-DD
  const allEvents = [
    {
      name: "VR Development Workshop",
      date: "2025-11-15",
      location: "Aula Barat",
      category: "weekly",
      img: "", // Biarkan kosong untuk placeholder abu-abu
    },
    {
      name: "Intro to Metaverse",
      date: "2025-11-20",
      location: "Aula Timur",
      category: "monthly",
      img: "",
    },
    {
      name: "Guest Lecture: AI in XR",
      date: "2025-11-28",
      location: "Gedung STEI",
      category: "monthly",
      img: "",
    },
    {
      name: "Annual Tech Showcase",
      date: "2025-12-10",
      location: "Aula Barat",
      category: "yearly",
      img: "",
    },
    {
      name: "Weekly Dev Meetup",
      date: "2025-11-22",
      location: "Metaverse Lab",
      category: "weekly",
      img: "",
    },
  ];

  // === Elemen DOM ===
  const eventGrid = document.getElementById("eventGrid");
  const searchInput = document.getElementById("searchInput");
  const dateFromInput = document.getElementById("dateFrom");
  const dateToInput = document.getElementById("dateTo");
  const categoryButtons = document.querySelectorAll(".category-btn");

  let activeCategory = "all"; // Kategori aktif saat ini

  // === FUNGSI UNTUK MERENDER EVENT KE LAYAR ===
  function renderEvents(events) {
    eventGrid.innerHTML = ""; // Kosongkan grid

    if (events.length === 0) {
      eventGrid.innerHTML = "<p>No events found matching your criteria.</p>";
      return;
    }

    events.forEach(event => {
      const card = document.createElement("div");
      card.className = "event-card";
      
      // Format tanggal ke format yang lebih cantik (e.g., 15 November 2025)
      const eventDate = new Date(event.date + 'T00:00:00'); // Atasi timezone
      const formattedDate = eventDate.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      card.innerHTML = `
        <div class="card-img" ${event.img ? `style="background-image: url('${event.img}')"` : ''}></div>
        <div class="card-body">
          <h4>${event.name}</h4>
          <div class="card-info">
            <p>${formattedDate}</p>
            <p>${event.location}</p>
          </div>
          <div class="card-buttons">
            <button class="btn-details">Details</button>
            <button class="btn-register">Register Now</button>
          </div>
        </div>
      `;
      eventGrid.appendChild(card);
    });
  }

  // === FUNGSI UTAMA UNTUK FILTER ===
  function filterEvents() {
    const searchTerm = searchInput.value.toLowerCase();
    const dateFrom = dateFromInput.value;
    const dateTo = dateToInput.value;

    const filteredEvents = allEvents.filter(event => {
      // 1. Filter Kategori
      const categoryMatch = activeCategory === "all" || event.category === activeCategory;

      // 2. Filter Search Term (berdasarkan nama event)
      const searchMatch = event.name.toLowerCase().includes(searchTerm);

      // 3. Filter Tanggal
      const eventDate = new Date(event.date);
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo) : null;
      
      let dateMatch = true;
      if (fromDate && toDate) {
        dateMatch = eventDate >= fromDate && eventDate <= toDate;
      } else if (fromDate) {
        dateMatch = eventDate >= fromDate;
      } else if (toDate) {
        dateMatch = eventDate <= toDate;
      }

      // Event harus lolos semua filter
      return categoryMatch && searchMatch && dateMatch;
    });

    renderEvents(filteredEvents);
  }

  // === EVENT LISTENERS ===

  // Listener untuk Kategori
  categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Hapus kelas 'active' dari semua tombol
      categoryButtons.forEach(btn => btn.classList.remove("active"));
      // Tambah kelas 'active' ke tombol yang diklik
      button.classList.add("active");
      // Set kategori aktif
      activeCategory = button.getAttribute("data-category");
      // Render ulang event
      filterEvents();
    });
  });

  // Listener untuk semua input filter
  searchInput.addEventListener("input", filterEvents);
  dateFromInput.addEventListener("change", filterEvents);
  dateToInput.addEventListener("change", filterEvents);

  // === TAMPILKAN SEMUA EVENT SAAT AWAL BUKA ===
  renderEvents(allEvents);
});