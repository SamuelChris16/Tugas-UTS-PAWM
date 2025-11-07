document.addEventListener("DOMContentLoaded", () => {
  // === FUNGSI PROTEKSI LOGIN (HARUS ADA DI PALING ATAS) ===
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    alert("Anda harus login untuk mengakses formulir booking alat.");
    window.location.href = "../Login/index.html";
    return; // Hentikan eksekusi script jika belum login
  }
  // === BATAS PROTEKSI LOGIN ===

  const bookingForm = document.getElementById("bookingForm");
  const bookingHeader = document.getElementById("booking-header");
  const fileInput = document.getElementById("file-upload");
  const fileNameDisplay = document.getElementById("file-name-display");

  let toolToBook = "Unknown Tool";
  let allTools = JSON.parse(localStorage.getItem("labTools")) || [];
  let toolData = null;

  // 1. Ambil nama alat dari URL dan validasi ketersediaan
  const params = new URLSearchParams(window.location.search);
  const toolName = params.get('tool');

  if (toolName) {
    toolToBook = toolName;
    bookingHeader.textContent = `Booking for: ${toolName}`;
    
    // Cari data alat di database
    toolData = allTools.find(t => t.name === toolToBook);

    // PENTING: Cek ketersediaan
    if (!toolData || toolData.quantity === 0) {
      alert("Sorry, this tool is currently unavailable or doesn't exist.");
      // Redirect kembali ke halaman facility jika tidak tersedia
      window.location.href = "../Facility/index.html";
      return; // Hentikan eksekusi script
    }

  } else {
    alert("No tool selected for booking.");
    window.location.href = "../Facility/index.html";
    return;
  }

  // 2. Handle submit form
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Ambil semua data dari form
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const email = document.getElementById("email").value;
    const studentNumber = document.getElementById("student-number").value;
    const campus = document.querySelector('input[name="campus"]:checked').value;
    const phone = document.getElementById("phone").value;
    const file = fileInput.files[0];

    if (!file) {
        alert("Please upload the letter of responsibility!");
        return;
    }

    // --- LOGIKA PENGURANGAN KUANTITAS (BARU) ---
    // 1. Cari index alat yang di-booking
    const toolIndex = allTools.findIndex(t => t.name === toolToBook);
    
    if (toolIndex !== -1 && allTools[toolIndex].quantity > 0) {
      // 2. Kurangi kuantitasnya
      allTools[toolIndex].quantity -= 1;
      
      // 3. Simpan kembali database yang sudah diupdate ke localStorage
      localStorage.setItem("labTools", JSON.stringify(allTools));
      
    } else {
      // Ini sebagai pengaman ganda jika terjadi race condition
      alert("Failed to book. Tool might have just become unavailable.");
      window.location.href = "../Facility/index.html";
      return;
    }
    // --- BATAS LOGIKA BARU ---

    // Buat objek pendaftaran
    const newBooking = {
      toolName: toolToBook,
      firstName,
      lastName,
      email,
      studentNumber,
      campus,
      phone,
      fileName: file.name,
      username: loggedInUser.username, // Tambahkan username dari loggedInUser
      timestamp: new Date().toISOString()
    };

    // Simpan ke localStorage (untuk catatan booking)
    const bookings = JSON.parse(localStorage.getItem("toolBookings")) || [];
    bookings.push(newBooking);
    localStorage.setItem("toolBookings", JSON.stringify(bookings));

    // Beri notifikasi dan redirect
    alert(`Booking for ${toolToBook} successful! Thank you, ${firstName}.`);
    window.location.href = "../Facility/index.html"; // Kembali ke daftar alat
  });

  // 3. Tampilkan nama file yang di-upload
  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      fileNameDisplay.textContent = fileInput.files[0].name;
    } else {
      fileNameDisplay.innerHTML = "Browse Files<br>Drag and drop files here";
    }
  });
});