window.addEventListener('load', () => {
  const splash = document.getElementById('splash-screen');
  const appPage = document.getElementById('app-page');

  // Splash tampil selama 5 detik
  setTimeout(() => {
    splash.style.opacity = '0';

    // Setelah fade-out selesai, sembunyikan dan tampilkan app icon
    setTimeout(() => {
      splash.style.display = 'none';
      appPage.classList.add('visible');
    }, 1000); // durasi fade-out = 1 detik
  }, 5000); // tampil selama 5 detik
});
