const { Vehicle } = require('../models');
const axios = require('axios');

// Ini fungsi getDashboard yang dipanggil di routes/vehicle.js
exports.getDashboard = async (req, res) => {
  try {

    const totalVehicle = await Vehicle.count();

    const pangkalanResponse = await axios.get('http://localhost:8080/pangkalan');

    return res.json({
      message: "Dashboard Vehicle Service",
      totalVehicle: totalVehicle, 
      pangkalan: pangkalanResponse.data
    });

  } catch (error) {
    return res.status(500).json({
      message: "Gagal memuat dashboard microservice",
      error: error.message
    });
  }
};
