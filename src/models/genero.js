// Model for Genero
const { sequelize } = require('../conexion/database')
const { DataTypes } = require('sequelize')   
const Genero = sequelize.define('Genero', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true  // Auto-incrementar ID
    },
    nombre_genero: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'generos',
    timestamps: false
  });

  Genero.associate = (models) => {
    Genero.belongsToMany(models.Contenido, {
      through: 'contenido_generos',
      foreignKey: 'genero_id',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
  };

module.exports = { Genero }
