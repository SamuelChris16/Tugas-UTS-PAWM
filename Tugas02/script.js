document.addEventListener("DOMContentLoaded", () => {
  const splashLayer = document.getElementById("splash-layer");
  
  // Durasi total animasi App Icon: 4000ms (4 detik)
  const SPLASH_DURATION = 4000; 
  
  setTimeout(() => {
    // 1. Terapkan animasi fade-out pada splash screen
    splashLayer.style.opacity = "0";
    splashLayer.style.transform = "translateY(-50px)"; 

    // 2. Tunggu sebentar (durasi transisi CSS: 0.5s)
    setTimeout(() => {
      // 3. Lakukan navigasi/redirect ke halaman Home di Tugas 01
      // Path: dari Tugas02/index.html naik satu level (..) lalu masuk ke Tugas01/Home/index.html
      window.location.href = "../Tugas01/Home/index.html"; 

    }, 500); // 500ms adalah durasi transisi fade-out

  }, SPLASH_DURATION);
  
});