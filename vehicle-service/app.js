const express = require('express');
const cors = require('cors');

const vehicleRouter = require('./routes/vehicle');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/vehicle', vehicleRouter);

module.exports = app;