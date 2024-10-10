// Model for contenido_actores
const { sequelize } = require('../conexion/database')
const { DataTypes } = require('sequelize')

const ContenidoActorView = sequelize.define('ContenidoActorView', {
    actor_id: {
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
    tableName: 'contenido_actores',
    timestamps: false
  });

module.exports = { ContenidoActorView }