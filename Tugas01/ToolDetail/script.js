document.addEventListener("DOMContentLoaded", () => {
  // === DATABASE DETAIL ALAT ===
  const allToolDetails = {
    // (Data detail alat Anda dari langkah sebelumnya ada di sini)
    "Oculus Quest 2": {
      description: "Oculus Quest 2 adalah headset Virtual Reality (VR) all-in-one yang paling canggih dari Meta. Didesain untuk kebebasan bergerak, headset ini tidak memerlukan PC atau kabel eksternal. Nikmati game, pengalaman sosial, dan aplikasi kebugaran imersif dengan resolusi tinggi dan tracking yang responsif.",
      howToUse: `1. Pastikan headset terisi penuh dayanya.
      2. Nyalakan headset dan controller.
      3. Tentukan area bermain (Guardian) Anda dengan mengikuti instruksi di layar.
      4. Gunakan tombol pada controller untuk bernavigasi di menu utama.
      5. Pilih aplikasi atau game yang ingin Anda jalankan.
      6. Selalu waspada dengan lingkungan sekitar Anda saat bermain.`,
      images: [
        "https://i.ebayimg.com/images/g/52MAAOSwJ3Rj6M~q/s-l1200.webp",
        "https://www.popsci.com/uploads/2021/11/17/oculus-quest-2-review-2.jpg?auto=webp",
        "https://www.protocol.com/media-library/oculus-quest-2.jpg?id=24716491&width=1200&height=600&quality=85&coordinates=0%2C0%2C0%2C0"
      ]
    },
    "High-Performance PC": {
      description: "PC ini dirancang khusus untuk pengembangan dan rendering VR/AR. Dilengkapi dengan GPU NVIDIA seri terbaru, CPU multi-core, dan RAM berkecepatan tinggi, PC ini mampu menangani lingkungan Unity dan Unreal Engine yang paling kompleks sekalipun.",
      howToUse: `1. Pastikan semua kabel (power, monitor, keyboard, mouse) terhubung.
      2. Nyalakan PC dengan menekan tombol power di casing.
      3. Login ke sistem operasi.
      4. Buka software pengembangan Anda (misal: Unity Hub, Unreal Engine).
      5. Hubungkan headset VR Anda (jika menggunakan PC-VR) dan pastikan driver terdeteksi.`,
      images: [
        "https://images.tokopedia.net/img/cache/700/VqbcmM/2022/9/22/71e405e3-4f93-47a8-971c-f2f01f8f307e.png",
        "https://dlcdnimgs.asus.com/websites/global/products/g16ch/images/G16CH-p1.png",
        "https://images.samsung.com/is/image/samsung/assets/us/computing/monitors/gaming/odyssey-g9/g95c/01-G95SC-LS49CG954SNXZA-Back-Black-US.jpg?$FB_TYPE_A_JPG$"
      ]
    },
    "3D Scanner": {
      description: "Scanner 3D portabel ini memungkinkan Anda untuk memindai objek di dunia nyata dan mengubahnya menjadi model 3D digital. Sangat berguna untuk membuat aset custom, reverse engineering, atau digitalisasi arsip.",
      howToUse: `1. Hubungkan scanner ke PC atau sumber daya.
      2. Buka software scanning yang sesuai.
      3. Pegang scanner dan arahkan ke objek dengan jarak yang stabil.
      4. Gerakkan scanner secara perlahan mengelilingi objek hingga semua sisi ter-scan.
      5. Proses dan 'stitch' data pindaian di software untuk membuat model utuh.`,
      images: [
        "https://www.creality.com/cdn/shop/files/CR-Scan-Lizard_Standard_1000x.jpg?v=1685002875",
        "https://i.all3dp.com/cdn-cgi/image/fit=cover,w=1284,h=722,gravity=0.5x0.5,format=auto/main/2022/02/17150146/creality-cr-scan-lizard-in-hand-220216.jpg"
      ]
    },
  };

  // === Elemen DOM ===
  const toolNameEl = document.getElementById("tool-name");
  const toolDescEl = document.getElementById("tool-description");
  const toolHowToUseEl = document.getElementById("tool-how-to-use");
  const sliderTrack = document.getElementById("sliderTrack");
  const sliderDots = document.getElementById("sliderDots");
  const prevBtn = document.getElementById("slidePrev");
  const nextBtn = document.getElementById("slideNext");
  const bookBtn = document.querySelector(".book-now-btn"); // <-- Tombol Book

  let toolData;
  let slides = [];
  let dots = [];
  let currentIndex = 0;

  // === FUNGSI 1: MENGISI DATA HALAMAN ===
  function populatePage() {
    const params = new URLSearchParams(window.location.search);
    const toolName = params.get('tool');
    if (!toolName) { /* ... error handling ... */ return; }
    
    toolData = allToolDetails[toolName] || allToolDetails[Object.keys(allToolDetails)[0]];
    if (!toolData) { /* ... error handling ... */ return; }

    toolNameEl.textContent = toolName;
    toolDescEl.textContent = toolData.description;
    toolHowToUseEl.textContent = toolData.howToUse;

    sliderTrack.innerHTML = "";
    sliderDots.innerHTML = "";
    toolData.images.forEach((imgUrl, index) => {
      const slide = document.createElement("div");
      slide.className = "slide";
      slide.style.backgroundImage = `url('${imgUrl}')`;
      sliderTrack.appendChild(slide);
      const dot = document.createElement("button");
      dot.className = "dot";
      dot.addEventListener("click", () => goToSlide(index));
      sliderDots.appendChild(dot);
    });
    slides = Array.from(sliderTrack.children);
    dots = Array.from(sliderDots.children);
  }

  // === FUNGSI 2: LOGIKA SLIDER ===
  function goToSlide(index) {
    if (index >= slides.length) index = 0;
    else if (index < 0) index = slides.length - 1;
    sliderTrack.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    currentIndex = index;
  }

  // === INISIALISASI ===
  populatePage();
  if (slides.length > 0) goToSlide(0);

  // Event Listeners untuk Tombol Slider
  nextBtn.addEventListener("click", () => goToSlide(currentIndex + 1));
  prevBtn.addEventListener("click", () => goToSlide(currentIndex - 1));

  // --- INI BAGIAN YANG DITAMBAHKAN ---
  bookBtn.addEventListener("click", () => {
    const toolName = toolNameEl.textContent; // Ambil nama alat dari H1
    window.location.href = `../ToolBooking/index.html?tool=${encodeURIComponent(toolName)}`;
  });
  // --- BATAS TAMBAHAN ---
});