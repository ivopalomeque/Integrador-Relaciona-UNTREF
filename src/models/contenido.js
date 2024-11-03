// Model for Contenido
const { sequelize } = require('../conexion/database')
const { DataTypes } = require('sequelize')   

const Contenido = sequelize.define('Contenido', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true  // Auto-incrementar ID
    },
    poster: {
      type: DataTypes.STRING,
      allowNull: true
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    busqueda: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    resumen: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    temporadas: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    duracion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    trailer: {
      type: DataTypes.STRING,
      allowNull: true
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'contenido',
    timestamps: false
  });

    // Configuración de las relaciones 

  Contenido.associate = (models) => {
    Contenido.belongsTo(models.Categoria, {
      foreignKey: 'categoria_id',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });

    Contenido.belongsToMany(models.Actor, {
      through: 'contenido_actores',
      foreignKey: 'contenido_id',
      otherKey: 'actor_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
  });

    Contenido.belongsToMany(models.Genero, {
      through: 'contenido_generos',
      foreignKey: 'contenido_id',
      otherKey: 'genero_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
  });
  };

module.exports = { Contenido }