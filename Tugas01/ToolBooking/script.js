// === Konfigurasi Supabase ===
const SUPABASE_URL = "https://rbjijrdsyvudbpefovoc.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiamlqcmRzeXZ1ZGJwZWZvdm9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0OTA3MzIsImV4cCI6MjA3ODA2NjczMn0.mOFA2ni0VRbLk1CWS_80LBRHCVdtLWQ8ouOKqrkZLtU";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const client = supabase; // Gunakan alias client untuk konsistensi

document.addEventListener("DOMContentLoaded", async () => {
  // === 1. FUNGSI PROTEKSI LOGIN ===
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    alert("Anda harus login untuk mengakses formulir booking alat.");
    window.location.href = "../Login/index.html";
    return;
  }

  // === 2. AMBIL ELEMEN & PARAMETER URL ===
  const bookingForm = document.getElementById("bookingForm");
  const bookingHeader = document.getElementById("booking-header");
  const fileInput = document.getElementById("file-upload");
  const fileNameDisplay = document.getElementById("file-name-display");

  const params = new URLSearchParams(window.location.search);
  const toolId = params.get("id");
  const toolName = params.get("tool");

  if (!toolName) {
    alert("No tool selected. Please choose a tool first.");
    window.location.href = "../Facility/index.html";
    return;
  }

  // PERMINTAAN #1: Ganti Judul
  bookingHeader.textContent = `${toolName}'s Booking`;

  let toolData = null;

  try {
    // Cari data alat di Supabase
    let query = client
      .from("tools")
      .select("id_tools, name, quantity")
      .maybeSingle();

    if (toolId) {
      // Prioritas: cari berdasarkan ID
      query = query.eq("id_tools", toolId);
    } else {
      // Fallback: cari berdasarkan Nama
      query = query.eq("name", toolName);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    if (!data) throw new Error("Tool data not found.");

    toolData = data;

    if (toolData.quantity === 0) {
      alert(`The tool '${toolName}' is currently unavailable (quantity: 0).`);
      window.location.href = "../Facility/index.html";
      return;
    }
  } catch (toolError) {
    console.error("Error fetching tool data:", toolError.message);
    alert(`Failed to load tool data for ${toolName}. Please try again later.`);
    window.location.href = "../Facility/index.html";
    return;
  }
  
  // === 3. EVENT LISTENER FILE UPLOAD ===
  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      fileNameDisplay.textContent = fileInput.files[0].name;
    } else {
      fileNameDisplay.innerHTML = "Browse Files<br>Drag and drop files here";
    }
  });

  // === 4. SUBMIT HANDLER ===
  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const first_name = document.getElementById("first-name").value.trim();
    const last_name = document.getElementById("last-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const student_number = document.getElementById("student-number").value.trim();
    const campus = document.querySelector('input[name="campus"]:checked').value;
    const phone = document.getElementById("phone").value.trim();
    const pdfFile = document.getElementById("file-upload").files[0];

    // Check pre-conditions again
    if (!toolData || toolData.quantity <= 0) {
        alert("Booking failed: Tool is currently unavailable.");
        window.location.href = "../Facility/index.html";
        return;
    }
    
    if (!pdfFile || pdfFile.type !== "application/pdf") {
      alert("Please upload your responsibility letter (PDF file)!");
      return;
    }
    
    const toolIdToBook = toolData.id_tools;

    try {
      // 1) Upload PDF ke Supabase Storage
      const filePath = `${toolIdToBook}/${Date.now()}_${pdfFile.name}`;
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

      // 2) Simpan data ke tabel borrow_requests
      const { data: insertData, error: insertError } = await supabase
        .from("borrow_requests")
        .insert([
          {
            id_tools: toolIdToBook,
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

      // 3) Kurangi stok alat di tabel tools
      const newQuantity = Math.max(toolData.quantity - 1, 0);
      const { error: updateError } = await supabase
        .from("tools")
        .update({ quantity: newQuantity })
        .eq("id_tools", toolIdToBook);

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