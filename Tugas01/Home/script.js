// Carousel looping logic
function initCarousel(trackId, nextBtnId, visibleCount) {
  const track = document.getElementById(trackId);
  const nextBtn = document.getElementById(nextBtnId);
  const cards = Array.from(track.children);
  let index = 0;

  nextBtn.addEventListener("click", () => {
    index += visibleCount;
    if (index >= cards.length) index = 0;
    const offset = -index * (cards[0].offsetWidth + 30);
    track.style.transform = `translateX(${offset}px)`;
    track.style.transition = "transform 0.6s ease";
  });
}

initCarousel("eventTrack", "eventNext", 2);
initCarousel("toolsTrack", "toolsNext", 3);

// Redirect buttons
document.querySelectorAll(".register-btn-card").forEach(btn => {
  btn.addEventListener("click", () => {
    window.location.href = "../registernoew/registernoew.html";
  });
});

document.querySelectorAll(".book-btn-card").forEach(btn => {
  btn.addEventListener("click", () => {
    window.location.href = "../booknow/booknow.html";
  });
});
