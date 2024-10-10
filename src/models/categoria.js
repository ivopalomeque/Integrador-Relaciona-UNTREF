// Model for Categoria
const { sequelize } = require('../conexion/database')
const { DataTypes } = require('sequelize')   


const Categoria = sequelize.define('Categoria', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true  // Auto-incrementar ID
    },
    nombre_categoria: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'categorias',
    timestamps: false
  });

  Categoria.associate = (models) => {
    Categoria.hasMany(models.Contenido, {
      foreignKey: 'categoria_id',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
  };
  
module.exports = { Categoria }