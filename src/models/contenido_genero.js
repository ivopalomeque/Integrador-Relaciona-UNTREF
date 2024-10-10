// Model for contenido_generos
const { sequelize } = require('../conexion/database')
const { DataTypes } = require('sequelize')

const ContenidoGeneroView = sequelize.define('ContenidoGeneroView', {
    genero_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    contenido_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    }
  }, {
    tableName: 'contenido_generos',
    timestamps: false
  });

module.exports = { ContenidoGeneroView }