document.addEventListener("DOMContentLoaded", () => {
  // === DATABASE DETAIL ALAT (DALAM BAHASA INGGRIS) ===
  const allToolDetails = {
    "Oculus Quest 2": {
      description: "Oculus Quest 2 is Meta's most advanced all-in-one Virtual Reality (VR) headset. Designed for freedom of movement, this headset does not require an external PC or cables. Enjoy immersive games, social experiences, and fitness apps with high resolution and responsive tracking.",
      howToUse: `1. Ensure the headset is fully charged.
2. Turn on the headset and controllers.
3. Define your play area (Guardian) by following the on-screen instructions.
4. Use the buttons on the controllers to navigate the main menu.
5. Select the application or game you want to run.
6. Always be aware of your surroundings while playing.`,
      images: [
        "https://i.ebayimg.com/images/g/52MAAOSwJ3Rj6M~q/s-l1200.webp",
        "https://www.popsci.com/uploads/2021/11/17/oculus-quest-2-review-2.jpg?auto=webp",
        "https://www.protocol.com/media-library/oculus-quest-2.jpg?id=24716491&width=1200&height=600&quality=85&coordinates=0%2C0%2C0%2C0"
      ]
    },
    "High-Performance PC": {
      description: "This PC is specifically designed for VR/AR development and rendering. Equipped with the latest NVIDIA series GPU, a multi-core CPU, and high-speed RAM, this PC can handle even the most complex Unity and Unreal Engine environments.",
      howToUse: `1. Ensure all cables (power, monitor, keyboard, mouse) are connected.
2. Turn on the PC by pressing the power button on the case.
3. Log in to the operating system.
4. Open your development software (e.g., Unity Hub, Unreal Engine).
5. Connect your VR headset (if using PC-VR) and ensure the drivers are detected.`,
      images: [
        "https://images.tokopedia.net/img/cache/700/VqbcmM/2022/9/22/71e405e3-4f93-47a8-971c-f2f01f8f307e.png",
        "https://dlcdnimgs.asus.com/websites/global/products/g16ch/images/G16CH-p1.png",
        "https://images.samsung.com/is/image/samsung/assets/us/computing/monitors/gaming/odyssey-g9/g95c/01-G95SC-LS49CG954SNXZA-Back-Black-US.jpg?$FB_TYPE_A_JPG$"
      ]
    },
    "3D Scanner": {
      description: "This portable 3D scanner allows you to scan real-world objects and turn them into digital 3D models. It is very useful for creating custom assets, reverse engineering, or digitizing archives.",
      howToUse: `1. Connect the scanner to a PC or power source.
2. Open the corresponding scanning software.
3. Hold the scanner and aim it at the object from a stable distance.
4. Move the scanner slowly around the object until all sides are scanned.
5. Process and 'stitch' the scan data in the software to create a complete model.`,
      images: [
        "https://www.creality.com/cdn/shop/files/CR-Scan-Lizard_Standard_1000x.jpg?v=1685002875",
        "https://i.all3dp.com/cdn-cgi/image/fit=cover,w=1284,h=722,gravity=0.5x0.5,format=auto/main/2022/02/17150146/creality-cr-scan-lizard-in-hand-220216.jpg"
      ]
    },
    // Menambahkan data untuk alat lain yang ada di Facility/script.js
    "Motion Capture Suit": {
        description: "A full-body tracking suit to bring your real-world movements into virtual reality. Ideal for character animation and interaction.",
        howToUse: `1. Wear the suit, ensuring all sensors are properly placed on your joints.
2. Turn on the suit's power pack and connect it to the tracking software.
3. Calibrate the suit by holding a T-pose.
4. Begin capturing motion data.
5. Export the data (e.g., as FBX or BVH) for use in your 3D engine.`,
        images: [
          "../assets/MotionCaptureSuit.webp", // Menggunakan gambar lokal
          "https://m.media-amazon.com/images/I/61P+u3-aLPL.jpg",
          "https://www.bhs-vfx.co.uk/wp-content/uploads/2022/07/MVN_Link_3-scaled.jpg"
        ]
    },
    "VR Treadmill": {
        description: "An omni-directional treadmill that allows you to walk, jog, and run in any direction in virtual reality without leaving your spot.",
        howToUse: `1. Step onto the platform (usually with special shoes).
2. Secure the harness or safety ring around your waist.
3. Put on your VR headset and start the compatible game.
4. Begin walking or running; the low-friction surface will detect your movement.`,
        images: [
          "../assets/VRTreadmill.webp", // Menggunakan gambar lokal
          "https://arvrtips.com/wp-content/uploads/2020/02/virtuix-omni-vr-treadmill-1024x576.jpg"
        ]
    },
    "Haptic Gloves": {
        description: "Feel the virtual world. These gloves provide high-fidelity tactile feedback for your hands, allowing you to feel texture, shape, and resistance.",
        howToUse: `1. Put on the gloves and adjust the straps for a snug fit.
2. Connect the gloves to your PC or headset (wired or wireless).
3. Run the calibration software.
4. Start a compatible application that supports haptic feedback.
5. Interact with virtual objects and feel the sensations.`,
        images: [
          "../assets/HapticGloves.jpg", // Menggunakan gambar lokal
          "https://www.wareable.com/media/imager/202107/35163-original.jpg",
          "https://manus-vrm.com/wp-content/uploads/2022/10/MANUS-METAGLOVES-QUANTUM-USECASE-1-scaled.jpg"
        ]
    }
  };

  // === Elemen DOM ===
  const toolNameEl = document.getElementById("tool-name");
  const toolDescEl = document.getElementById("tool-description");
  const toolHowToUseEl = document.getElementById("tool-how-to-use");
  const sliderTrack = document.getElementById("sliderTrack");
  const sliderDots = document.getElementById("sliderDots");
  const prevBtn = document.getElementById("slidePrev");
  const nextBtn = document.getElementById("slideNext");
  const bookBtn = document.querySelector(".book-now-btn");

  let toolData;
  let slides = [];
  let dots = [];
  let currentIndex = 0;

  // === FUNGSI 1: MENGISI DATA HALAMAN ===
  function populatePage() {
    const params = new URLSearchParams(window.location.search);
    const toolName = params.get('tool');
    
    // Fallback jika tidak ada nama alat atau alat tidak ditemukan
    if (!toolName || !allToolDetails[toolName]) { 
      toolNameEl.textContent = "Error: Tool Not Found";
      toolDescEl.textContent = "Please select a valid tool from the Facility page.";
      toolHowToUseEl.textContent = "-";
      bookBtn.disabled = true;
      bookBtn.textContent = "Unavailable";
      bookBtn.style.backgroundColor = "#555";
      return; 
    }
    
    toolData = allToolDetails[toolName];

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
    if (!slides.length) return; // Jaga-jaga jika tidak ada gambar
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

  // Event Listener untuk Tombol Book
  bookBtn.addEventListener("click", () => {
    const toolName = toolNameEl.textContent; // Ambil nama alat dari H1
    if (toolName && toolName !== "Error: Tool Not Found") {
      window.location.href = `../ToolBooking/index.html?tool=${encodeURIComponent(toolName)}`;
    }
  });
});