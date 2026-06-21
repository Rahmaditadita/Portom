async function doLogin() {
  const emailInp = document.getElementById("inp-email");
  const passInp  = document.getElementById("inp-pass");
  const btn      = document.getElementById("btn-login");
  const errorBox = document.getElementById("login-error");

  const email = emailInp.value.trim();
  const password = passInp.value.trim();

  if (!email || !password) {
    errorBox.textContent = "Isi email dan password terlebih dahulu.";
    errorBox.style.display = "block";
    return;
  }

  // Kunci tombol agar tidak dobel submit saat diklik
  btn.disabled = true;
  btn.textContent = "Memproses…";
  errorBox.style.display = "none";

  try {
    const response = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      // 1. Simpan Token JWT ke localStorage browser
      localStorage.setItem("token", data.token);
      localStorage.setItem("user_email", email);

      // 2. Alihkan secara halus langsung ke halaman dashboard
      window.location.href = "dashboard.html";
    } else {
      // Tampilkan error bawaan Laravel (misal: "Unauthorized")
      errorBox.textContent = data.error || "Email atau password salah.";
      errorBox.style.display = "block";
    }
  } catch (error) {
    errorBox.textContent = "Gagal terhubung ke server Auth Laravel.";
    errorBox.style.display = "block";
  } finally {
    // Kembalikan tombol ke kondisi semula jika gagal
    btn.disabled = false;
    btn.textContent = "Masuk";
  }
}

function togglePassword() {
  const passwordInput = document.getElementById("inp-pass");
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
}
