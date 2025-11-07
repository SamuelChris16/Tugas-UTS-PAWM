// === KONFIGURASI SUPABASE ===
const SUPABASE_URL = "https://rbjijrdsyvudbpefovoc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiamlqcmRzeXZ1ZGJwZWZvdm9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0OTA3MzIsImV4cCI6MjA3ODA2NjczMn0.mOFA2ni0VRbLk1CWS_80LBRHCVdtLWQ8ouOKqrkZLtU";
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", async () => {
  // === Ambil elemen DOM ===
  const toolGrid = document.getElementById("toolGrid");
  const searchInput = document.getElementById("searchInput");
  const categoryButtons = document.querySelectorAll(".category-btn");
  let activeCategory = "all";

  // === Variabel global data alat ===
  let allTools = [];

  // === 1️⃣ AMBIL DATA DARI SUPABASE ===
  async function fetchTools() {
    try {
      const { data, error } = await client.from("tools").select("*").order("name");
      if (error) throw error;
      allTools = data || [];
      filterTools(); // render pertama kali
    } catch (err) {
      console.error("Error fetching tools:", err.message);
      toolGrid.innerHTML = "<p>Failed to load tools. Please try again later.</p>";
    }
  }

  // === 2️⃣ FUNGSI UNTUK MERENDER ALAT ===
  function renderTools(tools) {
    if (!toolGrid) return;
    toolGrid.innerHTML = "";
    if (tools.length === 0) {
      toolGrid.innerHTML = "<p>No tools found matching your criteria.</p>";
      return;
    }

    tools.forEach((tool) => {
      const card = document.createElement("div");
      card.className = "tool-card";
      card.innerHTML = `
        <div class="card-img" style="background-image: url('${tool.image_url || "../assets/default.png"}')"></div>
        <div class="card-body">
          <h4>${tool.name}</h4>
          <p class="card-description">${tool.description || "No description available."}</p>
          <p class="card-quantity">Quantity: ${tool.quantity}</p>
          <div class="card-buttons">
            <button class="btn-details">Details</button>
            <button class="btn-book" ${tool.quantity <= 0 ? "disabled" : ""}>
              ${tool.quantity > 0 ? "Book Now" : "Unavailable"}
            </button>
          </div>
        </div>
      `;
      toolGrid.appendChild(card);

      // === EVENT DETAIL ===
      card.querySelector(".btn-details").addEventListener("click", () => {
        window.location.href = `../ToolDetail/index.html?id=${tool.id}`;
      });

      // === EVENT BOOK ===
      const bookButton = card.querySelector(".btn-book");
      if (tool.quantity > 0) {
        bookButton.addEventListener("click", () => {
          // Arahkan ke halaman ToolBooking dengan id & nama
          window.location.href = `../ToolBooking/index.html?id=${tool.id}&tool=${encodeURIComponent(tool.name)}`;
        });
      } else {
        // Styling untuk unavailable
        bookButton.disabled = true;
        bookButton.style.backgroundColor = "#555";
        bookButton.style.cursor = "not-allowed";
      }
    });
  }

  // === 3️⃣ FILTER BERDASARKAN SEARCH & CATEGORY ===
  function filterTools() {
    const searchTerm = searchInput?.value?.toLowerCase() || "";
    const filteredTools = allTools.filter((tool) => {
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

  // === 4️⃣ EVENT LISTENER UNTUK CATEGORY & SEARCH ===
  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      categoryButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      activeCategory = button.getAttribute("data-category");
      filterTools();
    });
  });

  if (searchInput) searchInput.addEventListener("input", filterTools);

  // === 5️⃣ INISIALISASI: AMBIL DATA DARI SUPABASE ===
  await fetchTools();
});
