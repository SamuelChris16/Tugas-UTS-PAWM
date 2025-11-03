window.addEventListener("load", () => {
  const splash = document.getElementById("splash-screen");
  const appPage = document.getElementById("app-page");

  // Splash tampil selama 5 detik
  setTimeout(() => {
    splash.style.opacity = "0"; // fade-out
    setTimeout(() => {
      splash.style.display = "none"; // sembunyikan splash
      appPage.style.opacity = "1";   // tampilkan app icon
    }, 1000); // tunggu animasi fade selesai
  }, 5000); // durasi splash: 5 detik
});
