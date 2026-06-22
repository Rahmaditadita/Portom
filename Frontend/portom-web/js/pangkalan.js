const API_BASE_URL = "http://localhost:8080/pangkalan"; 
const DASHBOARD_URL = "http://localhost:3002/vehicle/dashboard"; 

window.onload = () => {
    loadPangkalan();
};

// Fungsi membuka modal edit dan mengisikan data lama ke form modal
function bukaModalEdit(id, nama, jenis, kapasitas, wilayah) {
    document.getElementById('editModal').style.display = 'block';
    document.getElementById('edit-p-id').value = id;
    document.getElementById('edit-p-nama').value = nama;
    document.getElementById('edit-p-jenis').value = jenis;
    document.getElementById('edit-p-kapasitas').value = kapasitas;
    document.getElementById('edit-p-wilayah').value = wilayah;
}

// Fungsi menutup modal edit
function tutupModalEdit() {
    document.getElementById('editModal').style.display = 'none';
}

// 1. FUNGSI READ (MEMUAT DATA)
async function loadPangkalan() {
    try {
        const response = await fetch(DASHBOARD_URL);
        const data = await response.json();

        const tbody = document.getElementById("tbody-pangkalan");
        const badge = document.getElementById("badge-pangkalan");

        const daftarPangkalan = data.pangkalan || [];
        badge.textContent = `${daftarPangkalan.length} pangkalan aktif`;

        if (daftarPangkalan.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="empty">Tidak ada data pangkalan yang tersedia</td></tr>`;
            return;
        }

        tbody.innerHTML = "";

        daftarPangkalan.forEach((item, index) => {
            // Ambil data wilayah dengan fallback 'Kauman' seperti bawaan Anda
            const currentWilayah = item.wilayah || 'Kauman';

            tbody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td><strong>📍 ${item.nama}</strong></td>
                    <td><span class='badge' style='background:#ecf39e; color:#31472c;'>${item.jenis.toUpperCase()}</span></td>
                    <td>${item.kapasitas} Unit</td>
                    <td>Jember (${currentWilayah})</td>
                    <td>
                        <!-- Tombol aksi edit disisipkan di samping hapus -->
                        <button class="btn-edit" onclick="bukaModalEdit('${item.id}', '${item.nama}', '${item.jenis}', '${item.kapasitas}', '${currentWilayah}')">Edit</button>
                        <button class="btn-delete" onclick="hapusPangkalan('${item.id}')">Hapus</button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error(error);
        const tbody = document.getElementById("tbody-pangkalan");
        if (tbody) {
            tbody.innerHTML = "<tr><td colspan='6' class='empty' style='color:#c0392b;'>⚠️ Gagal memuat data dari server</td></tr>";
        }
    }
}

// 2. FUNGSI CREATE (TAMBAH DATA)
async function tambahPangkalan() {
    const nama = document.getElementById("p-nama").value.trim();
    const jenis = document.getElementById("p-jenis").value;
    const kapasitas = document.getElementById("p-kapasitas").value.trim();
    const wilayah = document.getElementById("p-wilayah").value.trim();

    if (!nama || !jenis || !kapasitas || !wilayah) {
        alert("Semua kolom data pangkalan wajib diisi!");
        return;
    }

    try {
        const response = await fetch(API_BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                nama: nama, 
                jenis: jenis, 
                kapasitas: parseInt(kapasitas), 
                wilayah: wilayah,
                latitude: -7.12345,
                longitude: 112.12345
            })
        });

        if (response.ok) {
            alert("Pangkalan baru berhasil ditambahkan!");
            // Mengosongkan form kembali
            document.getElementById("p-nama").value = "";
            document.getElementById("p-jenis").value = "";
            document.getElementById("p-kapasitas").value = "";
            document.getElementById("p-wilayah").value = "";
            loadPangkalan(); // Refresh tabel data
        } else {
            alert("Gagal menambahkan pangkalan.");
        }
    } catch (error) {
        console.error("Error saat tambah data:", error);
    }
}

// 3. FUNGSI UPDATE (SIMPAN PERUBAHAN)
async function simpanPerubahanPangkalan() {
    const id = document.getElementById('edit-p-id').value;
    const nama = document.getElementById('edit-p-nama').value;
    const jenis = document.getElementById('edit-p-jenis').value;
    const wilayah = document.getElementById('edit-p-wilayah').value;

    try {
        // KITA GUNAKAN PORT 3002 DENGAN ROUTE /pangkalan/
        const response = await fetch(`http://localhost:3002/pangkalan/${id}`, {
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' },
            // Mengirimkan key murni pangkalan yang disukai oleh microservice
            body: JSON.stringify({ 
                nama: nama, 
                jenis: jenis, 
                kapasitas: 10, 
                wilayah: wilayah,
                latitude: -7.12345,
                longitude: 112.12345
            })
        });
        
        if (response.ok) {
            alert('Data pangkalan berhasil diperbarui!');
            tutupModalEdit();
            loadPangkalan(); // Muat ulang tabel data otomatis
        } else {
            alert('Gagal memperbarui data pangkalan. Cek kesesuaian ID atau status rute backend.');
        }
    } catch (error) {
        console.error('Error saat update data:', error);
        alert('Terjadi kesalahan koneksi ke server.');
    }
}



// 4. FUNGSI DELETE (HAPUS DATA)
async function hapusPangkalan(id) {
    if (!confirm("Apakah Anda yakin ingin menghapus data pangkalan ini?")) return;
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, { 
            method: "DELETE" 
        });
        if (response.ok) {
            alert("Data pangkalan berhasil dihapus!");
            loadPangkalan();
        } else {
            alert("Gagal menghapus data.");
        }
    } catch (error) {
        console.error("Error saat menghapus data:", error);
    }
}
