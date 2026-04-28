const express = require('express');
const router = express.Router();
const { Pangkalan } = require('../models');

// lihat data
router.get('/', async (req, res) => {
  try {
    const data = await Pangkalan.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: 'Terjadi kesalahan',
      error
    });
  }
});

// nambah data
router.post('/', async (req, res) => {
    try {
        const { nama, jenis, kapasitas, latitude, longitude
        } = req.body;

        const newData = await Pangkalan.create({
            nama,
            jenis,
            kapasitas,
            latitude,
            longitude
        });
        res.status(201).json(newData);
    } catch (error){
        res.status(500).json({
            message: 'Gagal menambahkan data',
        });
    }
});

// update data
router.put ('/:id', async (req, res) => {
    try {
        const{id} = req.params;
        const{ nama, jenis, kapasitas, latitude, longitude
        } = req.body;

        const data  = await Pangkalan.findByPk(id);

        if(!data) {
            return res.status(404).json({
                message: 'Data tidak ditemukan'
            });
        }
        await data.update({ nama, jenis, kapasitas, latitude, longitude
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({
            message: 'Gagal update data',
            error
        });
    }
});

// hapus data

router.delete('/:id', async (req, res) => {
    try {
        const{id} = req.params;

        const data = await Pangkalan.findByPk(id);

        if(!data) {
            return res.status(404).json({
                message: 'Data tidak ditemukan'
            });
        }

        await data.destroy();

        res.json ({
            message: 'Data berhasil dihapus'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Gagal menghapus data',
            error
        });
    }
});

module.exports = router;