// === KONFIGURASI SUPABASE ===
const SUPABASE_URL = "https://rbjijrdsyvudbpefovoc.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiamlqcmRzeXZ1ZGJwZWZvdm9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0OTA3MzIsImV4cCI6MjA3ODA2NjczMn0.mOFA2ni0VRbLk1CWS_80LBRHCVdtLWQ8ouOKqrkZLtU";
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", async () => {

  // === FUNGSI UNIVERSAL CEK & TAMPILKAN STATUS LOGIN (Untuk Navbar) ===
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

  // Panggil fungsi cek status di awal pemuatan halaman
  checkLoginStatus();


  // === AMBIL ELEMEN DOM DAN INISIALISASI VARIABEL ===
  const toolGrid = document.getElementById("toolGrid");
  const searchInput = document.getElementById("searchInput");
  const categoryButtons = document.querySelectorAll(".category-btn");
  let activeCategory = "all";
  let allTools = [];

  // === AMBIL DATA DARI SUPABASE ===
  async function fetchTools() {
    try {
      const { data, error } = await client
        .from("tools")
        .select("id_tools, name, quantity, category, image_url, description")
        .order("name");
      if (error) throw error;

      allTools = data || [];
      console.log("Fetched tools:", allTools); // 🧠 Debug
      filterTools();
    } catch (err) {
      console.error("Error fetching tools:", err.message);
      if (toolGrid) {
        toolGrid.innerHTML = "<p>Failed to load tools. Please try again later.</p>";
      }
    }
  }

  // === RENDER ALAT ===
  function renderTools(tools) {
    if (!toolGrid) return;
    toolGrid.innerHTML = "";

    if (tools.length === 0) {
      toolGrid.innerHTML = "<p>No tools found matching your criteria.</p>";
      return;
    }

    tools.forEach((tool) => {
      console.log("Tool:", tool); // 🧠 Debug

      const card = document.createElement("div");
      card.className = "tool-card";
      
      // Cek ketersediaan
      const isAvailable = tool.quantity > 0;
      const bookButtonText = isAvailable ? "Book Now" : "Unavailable";
      
      // Catatan: Saya menggunakan 'image_url' atau 'imgUrl' (jika masih ada dari local storage)
      card.innerHTML = `
        <div class="card-img" style="background-image: url('${tool.image_url || tool.imgUrl || "../assets/default.png"}')"></div>
        <div class="card-body">
          <h4>${tool.name}</h4>
          <p class="card-description">${tool.description || "No description available."}</p>
          <p class="card-quantity">Quantity: ${tool.quantity}</p>
          <div class="card-buttons">
            <button class="btn-details">Details</button>
            <button class="btn-book" data-tool-name="${tool.name}" ${!isAvailable ? "disabled" : ""}>
              ${bookButtonText}
            </button>
          </div>
        </div>
      `;
      toolGrid.appendChild(card);

      // --- Logika Tombol ---
      card.querySelector(".btn-details").addEventListener("click", () => {
        // Menggunakan nama alat untuk navigasi ke ToolDetail
        window.location.href = `../ToolDetail/index.html?tool=${encodeURIComponent(tool.name)}`;
      });

      const bookButton = card.querySelector(".btn-book");
      if (isAvailable) {
        bookButton.addEventListener("click", () => {
          // Menggunakan nama alat untuk navigasi ke ToolBooking
          window.location.href = `../ToolBooking/index.html?tool=${encodeURIComponent(tool.name)}`;
        });
      } else {
        // Styling untuk tombol yang tidak tersedia
        bookButton.style.backgroundColor = "#555";
        bookButton.style.cursor = "not-allowed";
      }
    });
  }

  // === FILTER ===
  function filterTools() {
    const searchTerm = searchInput?.value?.toLowerCase() || "";
    
    const filteredTools = allTools.filter((tool) => {
      // Asumsi properti category sudah di-set di database
      const categoryMatch =
        activeCategory === "all"
          ? true
          : activeCategory === "available"
          ? tool.quantity > 0
          : tool.category?.toLowerCase() === activeCategory.toLowerCase();

      const searchMatch =
        tool.name?.toLowerCase().includes(searchTerm) ||
        tool.description?.toLowerCase().includes(searchTerm);

      return categoryMatch && searchMatch;
    });

    renderTools(filteredTools);
  }

  // === EVENT LISTENER FILTER ===
  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      categoryButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      activeCategory = button.getAttribute("data-category");
      filterTools();
    });
  });

  if (searchInput) searchInput.addEventListener("input", filterTools);

  // === INISIALISASI ===
  await fetchTools();
});