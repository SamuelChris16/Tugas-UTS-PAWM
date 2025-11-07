document.addEventListener("DOMContentLoaded", () => {
  // === FUNGSI UNTUK MENGAMBIL/INISIALISASI DATABASE ALAT ===
  function getToolsDatabase() {
    // 1. Coba ambil data dari localStorage
    let toolsData = JSON.parse(localStorage.getItem("labTools"));

    // 2. Jika tidak ada (kunjungan pertama), buat database default
    if (!toolsData) {
      console.log("Initializing tools database in localStorage...");
      
      // --- INI BAGIAN YANG SAYA SESUAIKAN ---
      // Saya gunakan link YouTube Anda (bagus!) dan link lain yang PASTI MUNCUL.
      // Link dari digitalstorm, d3f, dan deusens diblokir oleh server mereka.
      const defaultTools = [
        {
           name: "Oculus Quest 2",
           quantity: 5,
           category: "available",
           imgUrl: "../assets/oculus.jpg"
          },
        {
          name: "High-Performance PC",
          quantity: 10,
          category: "oldest",
          // Menggunakan link yang bisa tampil (bukan digitalstorm):
          imgUrl: "../assets/HighPerformancePC.webp"
        },
        {
          name: "3D Scanner",
          quantity: 2,
          category: "latest",
          // Menggunakan link yang bisa tampil:
          imgUrl: "../assets/3dScanner.webp"
        },
        {
          name: "Motion Capture Suit",
          quantity: 1,
          category: "latest",
          // Menggunakan link yang bisa tampil (bukan deusens):
          imgUrl: "../assets/MotionCaptureSuit.webp"
        },
        {
          // Menyesuaikan nama sesuai daftar Anda:
          name: "VR Treadmill", 
          quantity: 0,
          category: "oldest",
          // Link Anda (unboundxr) juga diblokir, saya gunakan yang ini:
          imgUrl: "../assets/VRTreadmill.webp"
        },
        {
          name: "Haptic Gloves",
          quantity: 3,
          category: "oldest",
          // Link Anda (assets.rbl.ms) juga diblokir, saya gunakan yang ini:
          imgUrl: "../assets/HapticGloves.jpg"
        },
      ];
      // --- BATAS PENYESUAIAN ---
      
      localStorage.setItem("labTools", JSON.stringify(defaultTools));
      toolsData = defaultTools;
    }
    
    // 3. Kembalikan data yang ada
    return toolsData;
  }

  // === Ambil data dari database (localStorage) ===
  const allTools = getToolsDatabase();

  // === Elemen DOM ===
  const toolGrid = document.getElementById("toolGrid");
  const searchInput = document.getElementById("searchInput");
  const categoryButtons = document.querySelectorAll(".category-btn");
  let activeCategory = "all";

  // === FUNGSI UNTUK MERENDER ALAT KE LAYAR ===
  function renderTools(tools) {
    if (!toolGrid) return;
    toolGrid.innerHTML = "";
    if (tools.length === 0) {
      toolGrid.innerHTML = "<p>No tools found matching your criteria.</p>";
      return;
    }
    tools.forEach(tool => {
      const card = document.createElement("div");
      card.className = "tool-card";
      
      card.innerHTML = `
        <div class="card-img" style="background-image: url('${tool.imgUrl}')"></div>
        <div class="card-body">
          <h4>${tool.name}</h4>
          <p class="card-quantity">Quantity: ${tool.quantity}</p>
          <div class="card-buttons">
            <button class="btn-details">Details</button>
            <button class="btn-book">Book Now</button>
          </div>
        </div>
      `;
      
      toolGrid.appendChild(card);

      const detailsButton = card.querySelector(".btn-details");
      detailsButton.addEventListener("click", () => {
        window.location.href = `../ToolDetail/index.html?tool=${encodeURIComponent(tool.name)}`;
      });

      const bookButton = card.querySelector(".btn-book");

      // --- LOGIKA TOMBOL BOOK (BARU) ---
      if (tool.quantity === 0) {
        bookButton.textContent = "Unavailable";
        bookButton.disabled = true;
        bookButton.style.backgroundColor = "#555"; // Warna abu-abu
        bookButton.style.cursor = "not-allowed";
      } else {
        bookButton.addEventListener("click", () => {
          window.location.href = `../ToolBooking/index.html?tool=${encodeURIComponent(tool.name)}`;
        });
      }
      // --- BATAS LOGIKA BARU ---
    });
  }

  // === FUNGSI UTAMA UNTUK FILTER ===
  function filterTools() {
    if (!searchInput) return;
    const searchTerm = searchInput.value.toLowerCase();
    
    // Ambil versi terbaru dari database setiap kali filter
    const currentToolsData = getToolsDatabase(); 
    
    const filteredTools = currentToolsData.filter(tool => {
      let categoryMatch = false;
      if (activeCategory === "all") {
        categoryMatch = true;
      } else if (activeCategory === "available") {
        categoryMatch = tool.quantity > 0;
      } else {
        categoryMatch = tool.category === activeCategory;
      }
      const searchMatch = tool.name.toLowerCase().includes(searchTerm);
      return categoryMatch && searchMatch;
    });
    renderTools(filteredTools);
  }

  // === EVENT LISTENERS (Filter) ===
  categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
      categoryButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      activeCategory = button.getAttribute("data-category");
      filterTools();
    });
  });
  if (searchInput) searchInput.addEventListener("input", filterTools);
  
  // === INISIALISASI HALAMAN ===
  filterTools();
});