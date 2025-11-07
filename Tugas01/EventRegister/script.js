document.addEventListener("DOMContentLoaded", () => {
  // === BLOK PROTEKSI LOGIN ===
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    alert("Anda harus login untuk mengakses formulir pendaftaran event.");
    window.location.href = "../Login/index.html";
    return; // Hentikan eksekusi script
  }
  // === AKHIR BLOK PROTEKSI LOGIN ===
  
  // Sisa kode asli EventRegister/script.js di sini (sudah dimodifikasi dari jawaban sebelumnya)
  // ...
});

document.addEventListener("DOMContentLoaded", () => {
  // === FUNGSI PROTEKSI LOGIN (HARUS ADA DI PALING ATAS) ===
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    alert("Anda harus login untuk mengakses formulir pendaftaran event.");
    window.location.href = "../Login/index.html";
    return; // Hentikan eksekusi script jika belum login
  }
  // === BATAS PROTEKSI LOGIN ===
  
  const eventQuestion = document.getElementById("event-question");
  const registerForm = document.getElementById("registerForm");

  // 1. Ambil nama event dari URL
  const params = new URLSearchParams(window.location.search);
  const eventName = params.get('event');

  if (eventName) {
    eventQuestion.textContent = `Would you be attending the ${eventName} event?`;
  } else {
    eventQuestion.textContent = "Would you be attending the event?";
  }

  // 2. Handle submit form
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Ambil semua data dari form
    const attending = document.querySelector('input[name="attending"]:checked').value;
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const guests = document.getElementById("guests").value;

    if (attending === 'no') {
      alert("Thanks for letting us know!");
      window.location.href = "../Event/index.html"; // Kembali ke daftar event
      return;
    }

    // Buat objek pendaftaran
    const newRegistration = {
      eventName: eventName || "Unknown Event",
      firstName,
      lastName,
      email,
      phone,
      guests,
      username: loggedInUser.username, // Tambahkan username dari loggedInUser
      timestamp: new Date().toISOString()
    };

    // Simpan ke localStorage
    const registrations = JSON.parse(localStorage.getItem("eventRegistrations")) || [];
    registrations.push(newRegistration);
    localStorage.setItem("eventRegistrations", JSON.stringify(registrations));

    // Beri notifikasi dan redirect
    alert(`Registration for ${eventName} successful! Thank you, ${firstName}.`);
    window.location.href = "../Event/index.html"; // Kembali ke daftar event
  });
});