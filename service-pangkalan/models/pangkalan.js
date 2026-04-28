'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pangkalan extends Model {
    static associate(models) {
      // define association here
    }
  }
  Pangkalan.init({
    nama: DataTypes.STRING,
    jenis: DataTypes.STRING,
    kapasitas: DataTypes.INTEGER,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Pangkalan',
  });
  return Pangkalan;
};