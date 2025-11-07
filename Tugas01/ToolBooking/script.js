// === Konfigurasi Supabase ===
const SUPABASE_URL = "https://rbjijrdsyvudbpefovoc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiamlqcmRzeXZ1ZGJwZWZvdm9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0OTA3MzIsImV4cCI6MjA3ODA2NjczMn0.mOFA2ni0VRbLk1CWS_80LBRHCVdtLWQ8ouOKqrkZLtU";
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

  bookingHeader.textContent = `Booking for: ${toolName}`;

  // === Event: tampilkan nama file PDF ===
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

    if (!pdfFile || pdfFile.type !== "application/pdf") {
      alert("Please upload a valid PDF file!");
      return;
    }

    try {
      // === 1️⃣ Upload file ke storage Supabase ===
      const fileName = `${Date.now()}_${pdfFile.name}`;
      const { error: uploadError } = await client.storage
        .from("borrow-pdfs")
        .upload(fileName, pdfFile, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        alert("Failed to upload file: " + uploadError.message);
        return;
      }

      const { data: publicUrlData } = client.storage
        .from("borrow-pdfs")
        .getPublicUrl(fileName);

      const pdf_url = publicUrlData.publicUrl;

      // === 2️⃣ Simpan ke tabel borrow_requests ===
      const { error: insertError } = await client.from("borrow_requests").insert([
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
      ]);

      if (insertError) {
        console.error(insertError);
        alert("Error saving booking: " + insertError.message);
        return;
      }

      // === 3️⃣ Kurangi quantity alat di tabel tools ===
      const { data: toolData } = await client
        .from("tools")
        .select("quantity")
        .eq("id", toolId)
        .single();

      if (toolData && toolData.quantity > 0) {
        await client
          .from("tools")
          .update({ quantity: toolData.quantity - 1 })
          .eq("id", toolId);
      }

      alert(`Booking for ${toolName} successful!`);
      window.location.href = "../Facility/index.html";
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Unexpected error: " + err.message);
    }
  });
});
