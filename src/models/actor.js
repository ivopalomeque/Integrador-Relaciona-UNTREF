// Model for Actor
const { sequelize } = require('../conexion/database');
const { DataTypes } = require('sequelize');   

const Actor = sequelize.define('Actor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true  // Auto-incrementar ID
    },
    nombre_actor: {
        type: DataTypes.STRING,
        allowNull: false // Cambia a false si el nombre es obligatorio
    },
    apellido_actor: {
        type: DataTypes.STRING,
        allowNull: false // Cambia a false si el apellido es obligatorio
    }
}, {
    tableName: 'actores',
    timestamps: false
});

// Definición de relaciones
Actor.associate = (models) => {
    Actor.belongsToMany(models.Contenido, {
        through: 'contenido_actores',
        foreignKey: 'actor_id',
        otherKey: 'contenido_id', // Especifica la clave foránea del modelo relacionado
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
};

module.exports = { Actor };
