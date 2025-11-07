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

  if (toolError || !toolData) {
    alert("Tool not found in database!");
    console.error("Error fetching tool:", toolError);
    window.location.href = "../Facility/index.html";
    return;
  }

  // Kalau quantity = 0, user tidak boleh booking
  if (toolData.quantity <= 0) {
    alert("Sorry, this tool is currently unavailable.");
    window.location.href = "../Facility/index.html";
    return;
  }

  bookingHeader.textContent = `Booking for: ${toolData.name} (Stock: ${toolData.quantity})`;

  // === Preview nama file upload ===
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
