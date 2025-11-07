document.addEventListener("DOMContentLoaded", () => {
  // === FUNGSI PROTEKSI LOGIN (HARUS ADA DI PALING ATAS) ===
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    alert("Anda harus login untuk mengakses formulir booking alat.");
    window.location.href = "../Login/index.html";
    return; // Hentikan eksekusi script jika belum login
  }
  // === BATAS PROTEKSI LOGIN ===

// === Konfigurasi Supabase ===
const SUPABASE_URL = "https://rbjijrdsyvudbpefovoc.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiamlqcmRzeXZ1ZGJwZWZvdm9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0OTA3MzIsImV4cCI6MjA3ODA2NjczMn0.mOFA2ni0VRbLk1CWS_80LBRHCVdtLWQ8ouOKqrkZLtU";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", async () => {
  const bookingForm = document.getElementById("bookingForm");
  const bookingHeader = document.getElementById("booking-header");
  const fileInput = document.getElementById("file-upload");
  const fileNameDisplay = document.getElementById("file-name-display");

  // Ambil parameter dari URL
  const params = new URLSearchParams(window.location.search);
  const toolId = params.get("id");
  const toolName = params.get("tool");

  if (!toolId || !toolName) {
    alert("No tool selected. Please choose a tool first.");
    window.location.href = "../Facility/index.html";
    return;
  }

  // 🧾 Cek data alat dari database Supabase
  const { data: toolData, error: toolError } = await supabase
    .from("tools")
    .select("id_tools, name, quantity")
    .eq("id_tools", toolId)
    .single();

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

  // === Submit handler ===
  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const first_name = document.getElementById("first-name").value.trim();
    const last_name = document.getElementById("last-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const student_number = document.getElementById("student-number").value.trim();
    const campus = document.querySelector('input[name="campus"]:checked').value;
    const phone = document.getElementById("phone").value.trim();
    const pdfFile = document.getElementById("file-upload").files[0];

    if (!pdfFile) {
      alert("Please upload your responsibility letter (PDF file)!");
      return;
    }

    if (pdfFile.type !== "application/pdf") {
      alert("Only PDF files are allowed!");
      return;
    }

    try {
      // === 1️⃣ Upload PDF ke Supabase Storage ===
      const filePath = `${toolId}/${Date.now()}_${pdfFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("borrow-pdfs")
        .upload(filePath, pdfFile);

      if (uploadError) {
        console.error("Upload Error:", uploadError);
        alert("Failed to upload file: " + uploadError.message);
        return;
      }

      // Ambil public URL
      const { data: publicUrlData } = supabase.storage
        .from("borrow-pdfs")
        .getPublicUrl(filePath);
      const pdf_url = publicUrlData.publicUrl;

      // === 2️⃣ Simpan data ke tabel borrow_requests ===
      const { data: insertData, error: insertError } = await supabase
        .from("borrow_requests")
        .insert([
          {
            id_tools: toolId,
            first_name,
            last_name,
            email,
            student_number,
            campus,
            phone,
            pdf_url,
            status: "pending",
          },
        ])
        .select();

      if (insertError) {
        console.error("Insert Error:", insertError);
        alert("Error saving booking: " + insertError.message);
        return;
      }

      console.log("Booking saved:", insertData);

      // === 3️⃣ Kurangi stok alat di tabel tools ===
      const newQuantity = Math.max(toolData.quantity - 1, 0);
      const { error: updateError } = await supabase
        .from("tools")
        .update({ quantity: newQuantity })
        .eq("id_tools", toolId);

      if (updateError) {
        console.error("Update Error:", updateError);
        alert("Booking saved but failed to update stock.");
        return;
      }

      alert(`Booking for ${toolData.name} successful!`);
      window.location.href = "../Facility/index.html";
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Unexpected error: " + err.message);
    }
  });
});
