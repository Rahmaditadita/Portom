const express = require('express');
const router = express.Router();
const { Vehicle } = require('../models');

// GET all
router.get('/', async (req, res) => {
  const data = await Vehicle.findAll();
  res.json(data);
});

// POST
router.post('/', async (req, res) => {
  const data = await Vehicle.create(req.body);
  res.status(201).json(data);
});

// PUT
router.put('/:id', async (req, res) => {
  const data = await Vehicle.findByPk(req.params.id);
  if (!data) return res.status(404).json({ message: "not found" });

  await data.update(req.body);
  res.json(data);
});

// DELETE
router.delete('/:id', async (req, res) => {
  const data = await Vehicle.findByPk(req.params.id);
  if (!data) return res.status(404).json({ message: "not found" });

  await data.destroy();
  res.json({ message: "deleted" });
});

// Dashboard
const dashboardController = require('../controllers/dashboardController');

router.get('/dashboard', dashboardController.getDashboard);

module.exports = router;