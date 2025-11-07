// === Konfigurasi Supabase ===
const SUPABASE_URL = "https://rbjijrdsyvudbpefovoc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiamlqcmRzeXZ1ZGJwZWZvdm9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0OTA3MzIsImV4cCI6MjA3ODA2NjczMn0.mOFA2ni0VRbLk1CWS_80LBRHCVdtLWQ8ouOKqrkZLtU";
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // cari user berdasarkan username
  const { data: users, error } = await client
    .from("users")
    .select("*")
    .eq("username", username)
    .eq("password", password);

  if (error) {
    alert("Error checking user: " + error.message);
    return;
  }

  if (users.length > 0) {
    const user = users[0];
    
    // === PERUBAHAN UTAMA: SIMPAN USERNAME UNTUK NAVBAR ===
    localStorage.setItem(
        "loggedInUser", 
        JSON.stringify({ 
            username: user.username,
            timestamp: new Date().toISOString()
        })
    );
    
    alert(`Welcome back, ${user.username}!`);
    window.location.href = "/Tugas01/Home/index.html";
  } else {
    alert("Invalid username or password!");
  }
});