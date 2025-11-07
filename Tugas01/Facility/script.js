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
          window.location.href = "../Home/index.html"; 
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

  // === FUNGSI UNTUK MENGAMBIL/INISIALISASI DATABASE ALAT ===
  function getToolsDatabase() {
    let toolsData = JSON.parse(localStorage.getItem("labTools"));

    // 2. Jika tidak ada (kunjungan pertama), buat database default
    if (!toolsData) {
      console.log("Initializing tools database in localStorage...");
      
      const defaultTools = [
        {
           name: "Oculus Quest 2",
           quantity: 5,
           category: "available",
           imgUrl: "../assets/oculus.jpg",
           // DESKRIPSI DITAMBAHKAN
           description: "A standalone VR headset with 6DOF tracking for a fully immersive experience."
        },
        {
          name: "High-Performance PC",
          quantity: 10,
          category: "oldest",
          imgUrl: "../assets/HighPerformancePC.webp",
          // DESKRIPSI DITAMBAHKAN
          description: "Powerful PC built for high-end VR development and rendering complex scenes."
        },
        {
          name: "3D Scanner",
          quantity: 2,
          category: "latest",
          imgUrl: "../assets/3dScanner.webp",
          // DESKRIPSI DITAMBAHKAN
          description: "Handheld 3D scanner to capture real-world objects into digital 3D models."
        },
        {
          name: "Motion Capture Suit",
          quantity: 1,
          category: "latest",
          imgUrl: "../assets/MotionCaptureSuit.webp",
          // DESKRIPSI DITAMBAHKAN
          description: "Full-body tracking suit to bring real-world movements into virtual reality."
        },
        {
          name: "VR Treadmill", 
          quantity: 0,
          category: "oldest",
          imgUrl: "../assets/VRTreadmill.webp",
          // DESKRIPSI DITAMBAHKAN
          description: "Omni-directional treadmill that allows you to walk and run in any direction in VR."
        },
        {
          name: "Haptic Gloves",
          quantity: 3,
          category: "oldest",
          imgUrl: "../assets/HapticGloves.jpg",
          // DESKRIPSI DITAMBAHKAN
          description: "Feel the virtual world with high-fidelity tactile feedback for your hands."
        },
      ];
      
      localStorage.setItem("labTools", JSON.stringify(defaultTools));
      toolsData = defaultTools;
    }
    
    return toolsData;
  }

  // === Ambil data dari database (localStorage) ===
  const allTools = getToolsDatabase();

  // === Elemen DOM ===
  const toolGrid = document.getElementById("toolGrid");
  const searchInput = document.getElementById("searchInput");
  const categoryButtons = document.querySelectorAll(".category-btn");
  let activeCategory = "all";

  // === FUNGSI UNTUK MERENDER ALAT KE LAYAR (DIPERBARUI) ===
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
      
      // --- innerHTML DIPERBARUI DENGAN DESKRIPSI ---
      card.innerHTML = `
        <div class="card-img" style="background-image: url('${tool.imgUrl}')"></div>
        <div class="card-body">
          <h4>${tool.name}</h4>
          
          <p class="card-description">${tool.description}</p>
          
          <p class="card-quantity">Quantity: ${tool.quantity}</p>
          <div class="card-buttons">
            <button class="btn-details">Details</button>
            <button class="btn-book">Book Now</button>
          </div>
        </div>
      `;
      // --- BATAS PERUBAHAN ---
      
      toolGrid.appendChild(card);

      // --- Logika Tombol ---
      const detailsButton = card.querySelector(".btn-details");
      detailsButton.addEventListener("click", () => {
        window.location.href = `../ToolDetail/index.html?tool=${encodeURIComponent(tool.name)}`;
      });

      const bookButton = card.querySelector(".btn-book");

      if (tool.quantity === 0) {
        bookButton.textContent = "Unavailable";
        bookButton.disabled = true;
        bookButton.style.backgroundColor = "#555"; 
        bookButton.style.cursor = "not-allowed";
      } else {
        // Logika booking akan diproteksi di ToolBooking/script.js
        bookButton.addEventListener("click", () => {
          window.location.href = `../ToolBooking/index.html?tool=${encodeURIComponent(tool.name)}`;
        });
      }
    });
  }

  // === FUNGSI UTAMA UNTUK FILTER ===
  function filterTools() {
    if (!searchInput) return;
    const searchTerm = searchInput.value.toLowerCase();
    
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
      
      // Update filter agar mencari di deskripsi juga
      const searchMatch = tool.name.toLowerCase().includes(searchTerm) || 
                          (tool.description && tool.description.toLowerCase().includes(searchTerm));
                          
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