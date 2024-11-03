// Model for contenido_generos
const { sequelize } = require('../conexion/database')
const { DataTypes } = require('sequelize')
const ContenidoGenero = sequelize.define('contenido_generos', {
  contenido_id: {
      type: DataTypes.INTEGER,
      references: {
          model: 'contenido',
          key: 'id'
      },
      primaryKey: true
  },
  genero_id: {
      type: DataTypes.INTEGER,
      references: {
          model: 'generos',
          key: 'id'
      },
      primaryKey: true
  }
}, {
  timestamps: false,
  tableName: 'contenido_generos'
});

module.exports = ContenidoGenero;
