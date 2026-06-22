const API_URL = "http://localhost:3002/vehicle";

window.onload = () => {
    loadKendaraan();
};

// Fungsi untuk membuka modal edit dan mengisi otomatis data lama ke inputan
function bukaModalEdit(id, nama, jenis, wilayah) {
    document.getElementById('editModal').style.display = 'block';
    document.getElementById('edit-v-id').value = id;
    document.getElementById('edit-v-nama').value = nama;
    document.getElementById('edit-v-jenis').value = jenis;
    document.getElementById('edit-v-wilayah').value = wilayah;
}

// Fungsi untuk menutup modal
function tutupModalEdit() {
    document.getElementById('editModal').style.display = 'none';
}

async function loadKendaraan() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        const tbody = document.getElementById("tbody-kendaraan");
        const badge = document.getElementById("badge-kendaraan");
        const alarmBox = document.getElementById("slot-alarm");
        const parkingLot = document.getElementById("parking-lot");

        badge.textContent = `${data.length} data`;

        // ════════ LOGIKA VISUALISASI PARKING LOT DIGITAL ════════
        parkingLot.innerHTML = ""; 
        alarmBox.innerHTML = "";   

        const MAX_SLOT_GRATIS = 1; 

        if (data.length >= 1) {
            parkingLot.innerHTML += `
                <div class="slot-card filled">
                    <div class="slot-icon">🚗</div>
                    <div class="slot-title">Slot 1: Terisi</div>
                    <div class="slot-owner">${data[0].namaPemilik} (${data[0].jenisKendaraan})</div>
                </div>
            `;
        } else {
            parkingLot.innerHTML += `
                <div class="slot-card">
                    <div class="slot-icon">🟢</div>
                    <div class="slot-title">Slot 1: Kosong</div>
                    <div class="slot-owner">Siap digunakan</div>
                </div>
            `;
        }

        if (data.length > MAX_SLOT_GRATIS) {
            alarmBox.innerHTML = `
                <div class="alarm-box">
                    ⚠️ ALARM SISTEM: KK Anda terdeteksi melebihi kuota lahan parkir resmi (Maks ${MAX_SLOT_GRATIS} Kendaraan). 
                    Berdasarkan Perda PORTOM, kendaraan tambahan wajib dikenakan Pajak Progresif Lahan Publik sebesar 5%!
                </div>
            `;

            for (let i = 1; i < data.length; i++) {
                parkingLot.innerHTML += `
                    <div class="slot-card locked">
                        <div class="slot-icon">🔒</div>
                        <div class="slot-title">Slot ${i + 1}: OVER QUOTA</div>
                        <div class="slot-owner">${data[i].namaPemilik} (${data[i].jenisKendaraan})</div>
                    </div>
                `;
            }
        } else {
            parkingLot.innerHTML += `
                <div class="slot-card" style="border-color: #ccc; color: #999;">
                    <div class="slot-icon">🚌</div>
                    <div class="slot-title">Slot 2: Batas Kuota</div>
                    <div class="slot-owner">Utamakan Transportasi Umum</div>
                </div>
            `;
        }
        // ══════════════════════════════════════════════════════════════════

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="empty">Belum ada data</td></tr>`;
            return;
        }

        tbody.innerHTML = "";
        data.forEach((item, index) => {
            // DI SINI SAYA SUDAH MENYISIPKAN TOMBOL EDIT DI SAMPING HAPUS
            tbody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td><strong>${item.namaPemilik}</strong></td>
                    <td>${item.jenisKendaraan}</td>
                    <td>${item.wilayah}</td>
                    <td>
                        <button class="btn-edit" onclick="bukaModalEdit('${item.id}', '${item.namaPemilik}', '${item.jenisKendaraan}', '${item.wilayah}')">Edit</button>
                        <button class="btn-delete" onclick="hapusKendaraan('${item.id}')">Hapus</button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Gagal memuat:", error);
    }
}

async function tambahKendaraan() {
    const namaPemilik = document.getElementById("v-nama").value.trim();
    const jenisKendaraan = document.getElementById("v-jenis").value;
    const wilayah = document.getElementById("v-wilayah").value.trim();

    if (!namaPemilik || !jenisKendaraan || !wilayah) {
        alert("Semua kolom input harus diisi terlebih dahulu!");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ namaPemilik, jenisKendaraan, wilayah })
        });

        if (response.ok) {
            document.getElementById("v-nama").value = "";
            document.getElementById("v-jenis").value = "";
            document.getElementById("v-wilayah").value = "";
            loadKendaraan();
        }
    } catch (error) {
        console.error(error);
    }
}

// Fungsi Simpan Perubahan yang disesuaikan dengan skema nama API backend Anda (API_URL)
async function simpanPerubahanKendaraan() {
    const id = document.getElementById('edit-v-id').value;
    const namaPemilik = document.getElementById('edit-v-nama').value;
    const jenisKendaraan = document.getElementById('edit-v-jenis').value;
    const wilayah = document.getElementById('edit-v-wilayah').value;

    try {
        // Menggunakan API_URL yang sama (port 3002) dan struktur kolom database Anda
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ namaPemilik, jenisKendaraan, wilayah })
        });
        
        if (response.ok) {
            alert('Data kendaraan berhasil diperbarui!');
            tutupModalEdit();
            loadKendaraan(); // Memuat ulang data tabel tanpa harus reload penuh
        } else {
            alert('Gagal memperbarui data.');
        }
    } catch (error) {
        console.error('Error saat update data:', error);
        alert('Terjadi kesalahan koneksi ke server.');
    }
}

async function hapusKendaraan(id) {
    if (!confirm("Yakin ingin menghapus data kendaraan ini?")) return;
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (response.ok) {
            loadKendaraan();
        }
    } catch (error) {
        console.error(error);
    }
}
