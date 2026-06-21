document.addEventListener("DOMContentLoaded", async () => {
  loadDashboard();
});

async function loadDashboard() {
  try {
    // FIX UTAMA: Ubah jalurnya menjadi /vehicle/dashboard agar sesuai dengan Express kamu
    const response = await fetch("http://localhost:3002/vehicle/dashboard");

    const data = await response.json();

    // Menampilkan total kendaraan secara dinamis dari DB kamu
    document.getElementById("stat-kendaraan").textContent =
      data.totalVehicle || 0;

    // Menampilkan total pangkalan hasil Axios microservice
    document.getElementById("stat-pangkalan").textContent =
      data.pangkalan.length;

    // Menampilkan daftar pangkalan ke layar web
    const listContainer = document.getElementById("dash-pangkalan-list");
    listContainer.innerHTML = "";

    data.pangkalan.forEach((item) => {
      const div = document.createElement("div");
      div.className = "pangkalan-item";

      div.innerHTML = `
        <div>
          <div class="name">📍 ${item.nama}</div>
          <div class="meta">
            Kapasitas: ${item.kapasitas ?? "-"} | Wilayah: ${item.wilayah || 'Kauman'}
          </div>
        </div>

        <div class="badge">
          ${item.jenis ?? "-"}
        </div>
      `;

      listContainer.appendChild(div);
    });

  } catch (error) {
    console.error(error);
    document.getElementById("dash-pangkalan-list").innerHTML = `
      <div class="error-msg" style="display:block">
        Gagal memuat data dashboard microservice.
      </div>
    `;
  }
}

// Tambahkan juga fungsi tombol keluar ini di bagian paling bawah file js kamu
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
