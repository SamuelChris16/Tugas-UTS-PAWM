window.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash-screen');
  const app = document.getElementById('app-page');

  // Pastikan background terpasang (jika Anda ingin fallback dari <img>)
  const splashImg = splash.querySelector('img');
  if (splashImg && !getComputedStyle(splash).backgroundImage.includes('url')) {
    splash.style.backgroundImage = `url('${splashImg.src}')`;
    splashImg.style.display = 'none';
  }

  // Tampilkan app icon setelah 5 detik
  setTimeout(() => {
    splash.classList.add('hidden');
    app.classList.add('visible');

    // optional: hapus node splash setelah transisi selesai
    splash.addEventListener('transitionend', () => {
      if (splash.parentNode) splash.parentNode.removeChild(splash);
    }, { once: true });
  }, 5000);
});
