// === Konfigurasi Supabase ===
const SUPABASE_URL = "https://rbjijrdsyvudbpefovoc.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiamlqcmRzeXZ1ZGJwZWZvdm9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0OTA3MzIsImV4cCI6MjA3ODA2NjczMn0.mOFA2ni0VRbLk1CWS_80LBRHCVdtLWQ8ouOKqrkZLtU";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Nama bucket tempat menyimpan gambar (ubah kalau kamu pakai nama lain)
const IMAGE_BUCKET_NAME = "tool-images";

document.addEventListener("DOMContentLoaded", async () => {
  // === Elemen DOM ===
  const toolNameEl = document.getElementById("tool-name");
  const toolDescEl = document.getElementById("tool-description");
  const toolHowToUseEl = document.getElementById("tool-how-to-use");
  const sliderTrack = document.getElementById("sliderTrack");
  const sliderDots = document.getElementById("sliderDots");
  const prevBtn = document.getElementById("slidePrev");
  const nextBtn = document.getElementById("slideNext");
  const bookBtn = document.querySelector(".book-now-btn");

  let slides = [];
  let dots = [];
  let currentIndex = 0;

  // Ambil parameter dari URL (mendukung beberapa nama param)
  const params = new URLSearchParams(window.location.search);
  const toolIdParam = params.get("id") || params.get("id_tools");
  const toolNameParam = params.get("tool") || params.get("name");

  console.log("URL Parameters:", { toolIdParam, toolNameParam });

  if (!toolIdParam && !toolNameParam) {
    toolNameEl.textContent = "Error: Tool not found";
    toolDescEl.textContent = "No tool specified in URL.";
    toolHowToUseEl.textContent = "-";
    bookBtn.disabled = true;
    return;
  }

  try {
    let tool = null;

    // 1) Ambil data tool berdasarkan id_tools (prioritas)
    if (toolIdParam) {
      console.log("Fetching tool by id_tools:", toolIdParam);
      const { data, error } = await supabase
        .from("tools")
        .select("id_tools, name, quantity, category, image_url, description, how_to_use")
        .eq("id_tools", toolIdParam)
        .maybeSingle();

      if (error) console.warn("Fetch by id_tools error:", error.message);
      else if (data) tool = data;
    }

    // 2) Jika belum ada, cari berdasarkan nama (case-insensitive)
    if (!tool && toolNameParam) {
      console.log("Fetching tool by name:", toolNameParam);
      const { data, error } = await supabase
        .from("tools")
        .select("id_tools, name, quantity, category, image_url, description, how_to_use")
        .ilike("name", toolNameParam)
        .maybeSingle();

      if (error) console.warn("Fetch by name error:", error.message);
      else if (data) tool = data;
    }

    // 3) Jika tidak ditemukan -> tampilkan pesan
    if (!tool) {
      console.error("Tool not found in database.");
      toolNameEl.textContent = "Tool not found in database.";
      toolDescEl.textContent = "-";
      toolHowToUseEl.textContent = "-";
      bookBtn.disabled = true;
      bookBtn.textContent = "Unavailable";
      return;
    }

    console.log("Tool data loaded:", tool);

    // Isi teks di halaman
    toolNameEl.textContent = tool.name || "Unnamed Tool";
    toolDescEl.textContent = tool.description || "No description available.";
    toolHowToUseEl.textContent = tool.how_to_use || "No usage instructions available.";

    // === Ambil semua gambar terkait
    // Kita akan: (a) pakai tools.image_url jika ada, (b) ambil semua record di tool_images untuk tool_id = id_tools
    let imageUrls = [];

    if (tool.image_url) imageUrls.push(tool.image_url);

    // Ambil records tool_images
    try {
      const { data: imgs, error: imgErr } = await supabase
        .from("tool_images")
        .select("image_url")
        .eq("tool_id", tool.id_tools)
        .order("created_at", { ascending: true });

      if (imgErr) {
        console.warn("tool_images fetch warning:", imgErr.message);
      } else if (imgs && imgs.length) {
        imgs.forEach((r) => {
          if (r.image_url && !imageUrls.includes(r.image_url)) imageUrls.push(r.image_url);
        });
      }
    } catch (imgFetchErr) {
      console.warn("Failed to fetch tool_images:", imgFetchErr);
    }

    // === Convert setiap image entry jadi URL publik
    // Rules:
    // - jika sudah full URL (http/https) -> pakai langsung
    // - else coba dapatkan publicUrl dari supabase.storage.from(IMAGE_BUCKET_NAME).getPublicUrl(path)
    // - kalau gagal, fallback ke /Tugas01/assets/<filename>
    async function normalizeToPublicUrls(list) {
      const out = [];
      for (const u of list) {
        if (!u) continue;
        if (/^https?:\/\//i.test(u)) {
          out.push(u);
          continue;
        }
        // jika path sudah relatif (mulai dengan "/Tugas01/" atau "/"), gunakan langsung
        if (u.startsWith("/Tugas01/") || u.startsWith("/")) {
          out.push(u);
          continue;
        }

        // coba getPublicUrl dari bucket terlebih dahulu
        try {
          const { data: publicData, error: pubErr } = supabase.storage
            .from(IMAGE_BUCKET_NAME)
            .getPublicUrl(u);
          // getPublicUrl tidak me-throw; pubErr biasanya null. publicData.publicUrl ada walau file mungkin tidak ada.
          if (publicData && publicData.publicUrl) {
            out.push(publicData.publicUrl);
            continue;
          }
        } catch (e) {
          console.warn("getPublicUrl error for", u, e);
        }

        // fallback: anggap filename dan prefix /Tugas01/assets/
        out.push(`/Tugas01/assets/${u}`);
      }
      return out;
    }

    imageUrls = await normalizeToPublicUrls(imageUrls);
    // hilangkan duplikat & null
    imageUrls = Array.from(new Set(imageUrls)).filter(Boolean);

    // Build slider DOM
    sliderTrack.innerHTML = "";
    sliderDots.innerHTML = "";

    if (imageUrls.length === 0) {
      sliderTrack.innerHTML = "<p>No image available for this tool.</p>";
    } else {
      // buat slide elements
      imageUrls.forEach((url, index) => {
        const slide = document.createElement("div");
        slide.className = "slide";
        slide.style.backgroundImage = `url('${url}')`;
        slide.style.minWidth = "100%";
        slide.style.backgroundSize = "cover";
        slide.style.backgroundPosition = "center";
        slide.setAttribute("role", "img");
        slide.setAttribute("aria-label", `Slide ${index + 1}`);
        sliderTrack.appendChild(slide);

        const dot = document.createElement("button");
        dot.className = "dot";
        dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
        dot.addEventListener("click", () => goToSlide(index));
        sliderDots.appendChild(dot);
      });

      slides = Array.from(sliderTrack.children);
      dots = Array.from(sliderDots.children);
      goToSlide(0);
    }

    // === Slider functions & handlers
    function goToSlide(index) {
      if (!slides.length) return;
      if (index >= slides.length) index = 0;
      else if (index < 0) index = slides.length - 1;
      sliderTrack.style.transition = "transform 300ms ease";
      sliderTrack.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
      currentIndex = index;
    }

    nextBtn.addEventListener("click", () => goToSlide(currentIndex + 1));
    prevBtn.addEventListener("click", () => goToSlide(currentIndex - 1));

    // keyboard
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") goToSlide(currentIndex + 1);
      if (e.key === "ArrowLeft") goToSlide(currentIndex - 1);
    });

    // touch swipe
    let startX = 0;
    sliderTrack.addEventListener("touchstart", (e) => {
      startX = e.changedTouches[0].screenX;
    }, { passive: true });
    sliderTrack.addEventListener("touchend", (e) => {
      const endX = e.changedTouches[0].screenX;
      const dx = endX - startX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) goToSlide(currentIndex + 1);
        else goToSlide(currentIndex - 1);
      }
    });

    // Book now navigation (kirim id_tools)
    bookBtn.addEventListener("click", () => {
      const idToSend = tool.id_tools;
      if (!idToSend) return alert("Tool ID not available.");
      window.location.href = `/Tugas01/ToolBooking/index.html?id=${encodeURIComponent(idToSend)}&tool=${encodeURIComponent(tool.name)}`;
    });

  } catch (err) {
    console.error("Unexpected error:", err);
    toolNameEl.textContent = "Error loading data.";
    toolDescEl.textContent = "-";
    toolHowToUseEl.textContent = "-";
    bookBtn.disabled = true;
  }
});
