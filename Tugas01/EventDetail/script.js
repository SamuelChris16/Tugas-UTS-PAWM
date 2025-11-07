document.addEventListener("DOMContentLoaded", () => {
  // Panggil fungsi navbar di sini juga (disarankan untuk konsistensi)
  function checkLoginStatus() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const userProfileContainer = document.getElementById("userProfileContainer");
    const userNameDisplay = document.getElementById("userNameDisplay");
    const logoutBtn = document.getElementById("logoutBtn");

    if (loggedInUser) {
      if (loginBtn) loginBtn.style.display = 'none';
      if (registerBtn) registerBtn.style.display = 'none';
      if (userProfileContainer) userProfileContainer.classList.remove('hidden');
      if (userNameDisplay) userNameDisplay.textContent = loggedInUser.username;
      
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem("loggedInUser");
          alert("Anda telah berhasil keluar (Logout).");
          window.location.href = "/Tugas01/Home/index.html"; 
        });
      }
    } else {
      if (loginBtn) loginBtn.style.display = 'block';
      if (registerBtn) registerBtn.style.display = 'block';
      if (userProfileContainer) userProfileContainer.classList.add('hidden');
    }
  }
  checkLoginStatus();

  // === DATABASE EVENT (VERSI LENGKAP & DENGAN GAMBAR ASLI) ===
  
  const allEvents = [
    {
      name: "VR Development Workshop",
      date: "2025-11-15",
      location: "Aula Barat",
      category: "weekly",
      img: "https://www.automationalley.com/wp-content/uploads/620c0d2e51cac31b68588bec_202202_04-AutomationAlley-Articles-VR.jpg",
      tag: "Featured",
      description: "Join us for a hands-on workshop focused on Virtual Reality development. Learn the basics of Unity, C#, and building immersive experiences from scratch. This session is perfect for beginners and intermediate developers looking to step into the world of VR.",
      speakers: [
        { name: "Dr. Elara Vance", expertise: "VR/AR Specialist", photo: "https://randomuser.me/api/portraits/women/68.jpg" },
        { name: "Prof. Kenji Tanaka", expertise: "Unity Lead Developer", photo: "https://randomuser.me/api/portraits/men/32.jpg" },
        { name: "Anya Petrova", expertise: "3D Modeler", photo: "https://randomuser.me/api/portraits/women/41.jpg" }
      ],
      sponsors: [
        { name: "Meta", category: "Gold Sponsor", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Meta-logo-black.svg/1200px-Meta-logo-black.svg.png" },
        { name: "Unity", category: "Silver Sponsor", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Unity_Technologies_logo.svg/1200px-Unity_Technologies_logo.svg.png" },
        { name: "ITB", category: "Bronze Sponsor", logo: "https://upload.wikimedia.org/wikipedia/id/thumb/a/a4/Logo_ITB.svg/1200px-Logo_ITB.svg.png" }
      ]
    },
    {
      name: "Intro to Metaverse",
      date: "2025-11-20",
      location: "Aula Timur",
      category: "monthly",
      img: "https://www.learntek.org/blog/wp-content/uploads/2021/11/Metaverse-Technology.png",
      tag: "Coming Soon",
      description: "What is the Metaverse? This introductory guest lecture will cover the fundamental concepts, technologies, and future potential of the Metaverse. We will explore its impact on social interaction, business, and entertainment.",
      speakers: [
        { name: "Prof. Rian Adhi", expertise: "Metaverse Ethicist", photo: "https://randomuser.me/api/portraits/men/45.jpg" }
      ],
      sponsors: [
        { name: "ITB", category: "Main Sponsor", logo: "https://upload.wikimedia.org/wikipedia/id/thumb/a/a4/Logo_ITB.svg/1200px-Logo_ITB.svg.png" }
      ]
    },
    {
      name: "Guest Lecture: AI in XR",
      date: "2025-11-28",
      location: "Gedung STEI",
      category: "monthly",
      img: "https://media.licdn.com/dms/image/v2/D4D22AQGQarVRlx9X9A/feedshare-shrink_800/B4DZXJIcA.HIAg-/0/1742836197667?e=2147483647&v=beta&t=Sf7S8MifI7kbB7ProN5qRARmva--0BHLWt6QTWJwEP4",
      description: "Discover the intersection of Artificial Intelligence and Extended Reality (XR). This lecture will explore how AI algorithms are used to create smarter, more responsive, and more realistic virtual environments and interactions.",
      speakers: [
        { name: "Dr. Benua", expertise: "AI Researcher", photo: "https://randomuser.me/api/portraits/men/50.jpg" },
        { name: "Lina Santoso", expertise: "Machine Learning Eng.", photo: "https://randomuser.me/api/portraits/women/50.jpg" }
      ],
      sponsors: [
        { name: "NVIDIA", category: "Tech Partner", logo: "https://1000logos.net/wp-content/uploads/2017/03/Nvidia-logo.png" },
        { name: "Google AI", category: "Research Partner", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Google_AI_Logo.svg/1200px-Google_AI_Logo.svg.png" }
      ]
    },
    {
      name: "Annual Tech Showcase",
      date: "2025-12-10",
      location: "Aula Barat",
      category: "yearly",
      img: "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNTA5OHwwfDF8c2VhcmNofDV8fHRlY2hlJTIBjb25mZXJlbmNlfGVufDB8fHx8MTcyMDc0MjQ0N3ww&ixlib=rb-4.0.3&q=80&w=400",
      tag: "Popular",
      description: "Our biggest event of the year! Explore cutting-edge projects from our lab members, industry partners, and student groups. Experience live demos, network with creators, and see the future of metaverse tech.",
      speakers: [
        { name: "Prof. Dr. Ir. Arlindo", expertise: "Head of Metaverse Lab", photo: "https://randomuser.me/api/portraits/men/60.jpg" },
        { name: "Siti Rahma", expertise: "Lead Project Winner 2024", photo: "https://randomuser.me/api/portraits/women/61.jpg" },
        { name: "Perwakilan Industri", expertise: "CEO TechNova", photo: "https://randomuser.me/api/portraits/men/62.jpg" }
      ],
      sponsors: [
        { name: "Telkom Indonesia", category: "Platinum Sponsor", logo: "https://upload.wikimedia.org/wikipedia/id/thumb/2/29/Telkom_Indonesia_2013.svg/1200px-Telkom_Indonesia_2013.svg.png" },
        { name: "Samsung", category: "Gold Sponsor", logo: "https://images.samsung.com/is/image/samsung/assets/global/about-us/brand/logo/360_197_1.png?$FB_TYPE_B_PNG$" },
        { name: "ITB", category: "Host", logo: "https://upload.wikimedia.org/wikipedia/id/thumb/a/a4/Logo_ITB.svg/1200px-Logo_ITB.svg.png" }
      ]
    },
    {
      name: "Weekly Dev Meetup",
      date: "2025-11-22",
      location: "Metaverse Lab",
      category: "weekly",
      img: "https://live.staticflickr.com/65535/48146091897_2b9194bf03_b.jpg",
      description: "Our casual weekly gathering for all lab members and enthusiasts. Bring your projects, share your challenges, and collaborate. This week's focus: Real-time physics in VR. Free pizza and drinks!",
      speakers: [
        { name: "Budi Santoso", expertise: "Lab Assistant & Moderator", photo: "https://randomuser.me/api/portraits/men/75.jpg" }
      ],
      sponsors: [
        { name: "Metaverse Lab", category: "Host & Pizza Provider", logo: "https://cdn.logo.com/hotlink-ok/logo-social.png" }
      ]
    },
  ];

  // === FUNGSI UNTUK MENGISI HALAMAN ===
  function populateEventDetails() {
    // 1. Ambil nama event dari URL
    const params = new URLSearchParams(window.location.search);
    const eventName = params.get('event');

    if (!eventName) {
      document.body.innerHTML = "<h1>Error: Event not specified.</h1>";
      return;
    }

    // 2. Cari data event di database
    const eventData = allEvents.find(e => e.name === eventName);

    if (!eventData) {
      document.body.innerHTML = "<h1>Error: Event not found.</h1>";
      return;
    }

    // 3. Format tanggal
    const eventDate = new Date(eventData.date + 'T00:00:00');
    const formattedDate = eventDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // 4. Isi data ke elemen HTML
    document.getElementById("event-image").style.backgroundImage = `url('${eventData.img}')`;
    document.getElementById("event-name").textContent = eventData.name;
    document.getElementById("event-date").textContent = formattedDate;
    document.getElementById("event-title-description").textContent = eventData.name;
    document.getElementById("event-description").textContent = eventData.description;

    // 5. Generate Speaker Cards
    const speakerGrid = document.getElementById("speaker-grid");
    speakerGrid.innerHTML = "";
    if (eventData.speakers && eventData.speakers.length > 0) {
      eventData.speakers.forEach(speaker => {
        const card = document.createElement("div");
        card.className = "speaker-card";
        card.innerHTML = `
          <div class="speaker-photo" style="background-image: url('${speaker.photo}')"></div>
          <h5>${speaker.name}</h5>
          <p>${speaker.expertise}</p>
        `;
        speakerGrid.appendChild(card);
      });
    }

    // 6. Generate Sponsor Cards
    const sponsorGrid = document.getElementById("sponsor-grid");
    sponsorGrid.innerHTML = "";
    if (eventData.sponsors && eventData.sponsors.length > 0) {
      eventData.sponsors.forEach(sponsor => {
        const card = document.createElement("div");
        card.className = "sponsor-card";
        card.innerHTML = `
          <div class="sponsor-photo" style="background-image: url('${sponsor.logo}')"></div>
          <h5>${sponsor.name}</h5>
          <p>${sponsor.category}</p>
        `;
        sponsorGrid.appendChild(card);
      });
    }
    
    // === LOGIC PROTEKSI TOMBOL DAFTAR (BARU) ===
    const registerBtn = document.querySelector(".register-now-btn");
    
    registerBtn.addEventListener("click", () => {
      const loggedInUser = localStorage.getItem("loggedInUser");
      
      if (loggedInUser) {
        window.location.href = `/Tugas01/EventRegister/index.html?event=${encodeURIComponent(eventData.name)}`;
      } else {
        alert("Anda harus login untuk mendaftar acara ini!");
        window.location.href = "/Tugas01/Login/index.html";
      }
    });
    // === BATAS LOGIC PROTEKSI ===
  }

  // Panggil fungsi utamanya
  populateEventDetails();
});