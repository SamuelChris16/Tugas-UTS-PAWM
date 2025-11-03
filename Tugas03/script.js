window.addEventListener('load', () => {
  // Delay sedikit untuk simulasi loading
  setTimeout(() => {
    document.getElementById('splash-screen').style.display = 'none';
    const main = document.getElementById('main-content');
    main.style.opacity = '1';
    main.style.transform = 'translateY(0)';
  }, 3000); // splash muncul selama 3 detik
});
