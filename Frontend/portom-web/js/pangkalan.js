// Mengarah ke endpoint integrasi dashboard gabungan Express Anda
const API_URL = "http://localhost:3002/vehicle/dashboard"; 

window.onload = () => {
    loadPangkalan();
};

async function loadPangkalan() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        const tbody = document.getElementById("tbody-pangkalan");
        const badge = document.getElementById("badge-pangkalan");

        // Membaca array data pangkalan dari respon microservice
        const daftarPangkalan = data.pangkalan || [];

        badge.textContent = `${daftarPangkalan.length} pangkalan aktif`;

        if (daftarPangkalan.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="empty">Tidak ada data pangkalan yang tersedia</td></tr>`;
            return;
        }

        tbody.innerHTML = "";

        daftarPangkalan.forEach((item, index) => {
            const googleMapsUrl = "https://google.com" + item.latitude + "," + item.longitude;

            tbody.innerHTML += "<tr>" +
                "<td>" + (index + 1) + "</td>" +
                "<td><strong>📍 " + item.nama + "</strong></td>" +
                "<td><span class='badge' style='background:#ecf39e; color:#31472c;'>" + item.jenis.toUpperCase() + "</span></td>" +
                "<td>" + item.kapasitas + " Unit</td>" +
                "<td>Jember (" + (item.wilayah || 'Kauman') + ")</td>" +
                "<td>" +
                    // Tombol diganti menjadi link <a> murni, target='_blank' otomatis buka tab baru
                    "<a href='" + googleMapsUrl + "' target='_blank' class='btn-save' style='display:inline-block; text-decoration:none; padding: 6px 12px; font-size: 12px; margin: 0; text-align:center;'>" +
                        "Buka Peta" +
                    "</a>" +
                "</td>" +
            "</tr>";
        });

    } catch (error) {
        console.error(error);
        tbody.innerHTML = "<tr><td colspan='6' class='empty' style='color:#c0392b;'>⚠️ Gagal memuat data dari server</td></tr>";
    }
}
