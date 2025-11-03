window.addEventListener("load", () => {
  const splash = document.getElementById("splash-screen");
  const main = document.getElementById("main-page");

  // tampil 5 detik penuh
  setTimeout(() => {
    splash.style.opacity = "0";          // fade out
    setTimeout(() => {
      splash.style.display = "none";     // hilangkan total
      main.classList.add("show");        // tampilkan halaman utama
    }, 1000); // setelah fade out selesai
  }, 5000); // durasi splash = 5 detik
});
