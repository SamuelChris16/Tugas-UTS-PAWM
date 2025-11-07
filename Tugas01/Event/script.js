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
          // Redirect ke Home
          window.location.href = "/Home/index.html"; 
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

  // === DATA SIMULASI (Database Event) ===
  const allEvents = [
    {
      name: "VR Development Workshop",
      date: "2025-11-15",
      location: "Aula Barat",
      category: "weekly",
      img: "https://www.automationalley.com/wp-content/uploads/620c0d2e51cac31b68588bec_202202_04-AutomationAlley-Articles-VR.jpg",
      tag: "Featured"
    },
    {
      name: "Intro to Metaverse",
      date: "2025-11-20",
      location: "Aula Timur",
      category: "monthly",
      img: "https://www.learntek.org/blog/wp-content/uploads/2021/11/Metaverse-Technology.png",
      tag: "Coming Soon"
    },
    {
      name: "Guest Lecture: AI in XR",
      date: "2025-11-28",
      location: "Gedung STEI",
      category: "monthly",
      img: "https://media.licdn.com/dms/image/v2/D4D22AQGQarVRlx9X9A/feedshare-shrink_800/B4DZXJIcA.HIAg-/0/1742836197667?e=2147483647&v=beta&t=Sf7S8MifI7kbB7ProN5qRARmva--0BHLWt6QTWJwEP4",
    },
    {
      name: "Annual Tech Showcase",
      date: "2025-12-10",
      location: "Aula Barat",
      category: "yearly",
      img: "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNTA5OHwwfDF8c2VhcmNofDV8fHRlY2hlJTIBjb25mZXJlbmNlfGVufDB8fHx8MTcyMDc0MjQ0N3ww&ixlib=rb-4.0.3&q=80&w=400",
      tag: "Popular"
    },
    {
      name: "Weekly Dev Meetup",
      date: "2025-11-22",
      location: "Metaverse Lab",
      category: "weekly",
      img: "https://live.staticflickr.com/65535/48146091897_2b9194bf03_b.jpg",
    },
  ];

  // === Elemen DOM (Filter) ===
  const eventGrid = document.getElementById("eventGrid");
  const searchInput = document.getElementById("searchInput");
  const dateFromInput = document.getElementById("dateFrom");
  const dateToInput = document.getElementById("dateTo");
  const categoryButtons = document.querySelectorAll(".category-btn");
  let activeCategory = "all";

  // === Elemen DOM (Carousel) ===
  const recommendTrack = document.getElementById("recommendTrack");
  const recommendPrev = document.getElementById("recommendPrev");
  const recommendNext = document.getElementById("recommendNext");
  const dotsContainer = document.getElementById("recommendDots");

  // === FUNGSI UNTUK MERENDER KARTU REKOMENDASI ===
  function renderRecommendEvents() {
    if (!recommendTrack) return;
    
    const recommended = allEvents.filter(event => event.tag);
    
    recommendTrack.innerHTML = "";
    if (dotsContainer) dotsContainer.innerHTML = "";

    recommended.forEach((event, index) => {
      const eventDate = new Date(event.date + 'T00:00:00');
      const formattedDate = eventDate.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const card = document.createElement("div");
      card.className = "recommend-card";
      card.innerHTML = `
        <div class="rec-card-img" style="background-image: url('${event.img}')">
          <span class="rec-card-tag">${event.tag}</span>
        </div>
        <div class="rec-card-body">
          <h5>${event.name}</h5>
          <p>
            <i class="fa-solid fa-calendar-day"></i>
            ${formattedDate}
          </p>
        </div>
      `;
      recommendTrack.appendChild(card);

      if (dotsContainer) {
        const dot = document.createElement("button");
        dot.className = "dot";
        dot.setAttribute("data-index", index);
        if (index === 0) dot.classList.add("active");
        dotsContainer.appendChild(dot);
      }
    });
  }

  // === LOGIKA SLIDER REKOMENDASI ===
  function setupCarousel() {
    if (!recommendTrack || !dotsContainer) return;

    const dots = Array.from(dotsContainer.children);
    const cardWidth = 320; 
    const cardGap = 20;    
    const scrollAmount = cardWidth + cardGap;

    if (recommendNext) {
      recommendNext.addEventListener("click", () => {
        recommendTrack.scrollLeft += scrollAmount;
      });
    }

    if (recommendPrev) {
      recommendPrev.addEventListener("click", () => {
        recommendTrack.scrollLeft -= scrollAmount;
      });
    }

    dots.forEach(dot => {
      dot.addEventListener("click", (e) => {
        const index = parseInt(e.target.getAttribute("data-index"));
        recommendTrack.scrollLeft = index * scrollAmount;
      });
    });

    recommendTrack.addEventListener("scroll", () => {
      const currentIndex = Math.round(recommendTrack.scrollLeft / scrollAmount);
      
      dots.forEach((dot, index) => {
        if (index === currentIndex) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });
    });
  }

  // === FUNGSI UNTUK MERENDER EVENT KE LAYAR ===
  function renderEvents(events) {
    if (!eventGrid) return;
    eventGrid.innerHTML = "";

    if (events.length === 0) {
      eventGrid.innerHTML = "<p>No events found matching your criteria.</p>";
      return;
    }

    events.forEach(event => {
      const card = document.createElement("div");
      card.className = "event-card";
      
      const eventDate = new Date(event.date + 'T00:00:00');
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

      // 1. Ambil tombol Details
      const detailsButton = card.querySelector(".btn-details");
      detailsButton.addEventListener("click", () => {
        window.location.href = `/EventDetail/index.html?event=${encodeURIComponent(event.name)}`;
      });

      // 2. Ambil tombol Register (BARU)
      const registerButton = card.querySelector(".btn-register");
      registerButton.addEventListener("click", () => {
        // Arahkan ke halaman registrasi baru (akan diproteksi di EventDetail/script.js)
        window.location.href = `/EventRegister/index.html?event=${encodeURIComponent(event.name)}`;
      });
    });
  }

  // === FUNGSI UTAMA UNTUK FILTER ===
  function filterEvents() {
    if (!searchInput || !dateFromInput || !dateToInput) return; // Guard clause
    
    const searchTerm = searchInput.value.toLowerCase();
    const dateFrom = dateFromInput.value;
    const dateTo = dateToInput.value;

    const filteredEvents = allEvents.filter(event => {
      const categoryMatch = activeCategory === "all" || event.category === activeCategory;
      const searchMatch = event.name.toLowerCase().includes(searchTerm);
      const eventDate = new Date(event.date + 'T00:00:00');
      const fromDate = dateFrom ? new Date(dateFrom + 'T00:00:00') : null;
      const toDate = dateTo ? new Date(dateTo + 'T00:00:00') : null;
      
      let dateMatch = true;
      if (fromDate && toDate) {
        dateMatch = eventDate >= fromDate && eventDate <= toDate;
      } else if (fromDate) {
        dateMatch = eventDate >= fromDate;
      } else if (toDate) {
        dateMatch = eventDate <= toDate;
      }

      return categoryMatch && searchMatch && dateMatch;
    });

    renderEvents(filteredEvents);
  }

  // === EVENT LISTENERS (Filter) ===
  categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
      categoryButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      activeCategory = button.getAttribute("data-category");
      filterEvents();
    });
  });

  if (searchInput) searchInput.addEventListener("input", filterEvents);
  if (dateFromInput) dateFromInput.addEventListener("change", filterEvents);
  if (dateToInput) dateToInput.addEventListener("change", filterEvents);

  // === INISIALISASI HALAMAN ===
  renderEvents(allEvents);
  renderRecommendEvents();
  setupCarousel();
  
});