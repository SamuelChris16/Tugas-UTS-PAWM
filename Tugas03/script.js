window.addEventListener("load", () => {
  const splash = document.getElementById("splash-screen");
  const appPage = document.getElementById("app-page");

  // Splash tampil selama 5 detik
  setTimeout(() => {
    splash.style.opacity = "0"; // mulai fade out

    setTimeout(() => {
      splash.style.display = "none"; // hilangkan splash
      appPage.style.opacity = "1";   // tampilkan app icon
    }, 1000); // tunggu fade-out selesai
  }, 5000); // durasi splash: 5 detik
});
