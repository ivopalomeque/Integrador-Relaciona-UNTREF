// Model for Actor
const { sequelize } = require('../conexion/database')
const { DataTypes } = require('sequelize')   

const Actor = sequelize.define('Actor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true  // Auto-incrementar ID
    },
    nombre_actor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    apellido_actor: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'actores',
    timestamps: false
  });

  Actor.associate = (models) => {
    Actor.belongsToMany(models.Contenido, {
      through: 'contenido_actores',
      foreignKey: 'actor_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  
module.exports = { Actor }