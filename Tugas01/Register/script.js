// === Konfigurasi Supabase ===
const SUPABASE_URL = "https://rbjijrdsyvudbpefovoc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiamlqcmRzeXZ1ZGJwZWZvdm9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0OTA3MzIsImV4cCI6MjA3ODA2NjczMn0.mOFA2ni0VRbLk1CWS_80LBRHCVdtLWQ8ouOKqrkZLtU";
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// === REGISTER HANDLER ===
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!username || !email || !password || !phone) {
    alert("Please fill in all fields!");
    return;
  }

  try {
    const { data: existing, error: checkError } = await client
      .from("users")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (checkError) {
      console.error("Check error:", checkError);
      alert("Error checking user: " + checkError.message);
      return;
    }

    if (existing) {
      alert("This email is already registered!");
      return;
    }

    const { data, error } = await client
      .from("users")
      .insert([{ username, email, password, phone }])
      .select();

    if (error) {
      alert("Error: " + error.message);
      console.error("Insert error:", error);
    } else {
      alert("Registration successful!");
      window.location.href = '../Login/index.html';
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("Unexpected error: " + err.message);
  }
});
