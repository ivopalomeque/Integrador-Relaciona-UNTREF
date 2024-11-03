// Model for contenido_actores (Tabla Intermedia entre Contenido y Actor)
const { sequelize } = require('../conexion/database')
const { DataTypes } = require('sequelize');

const ContenidoActor = sequelize.define('contenido_actores', {
    contenido_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'contenido',
            key: 'id'
        },
        primaryKey: true
    },
    actor_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'actores',
            key: 'id'
        },
        primaryKey: true
    }
}, {
    timestamps: false,
    tableName: 'contenido_actores'
});

module.exports = ContenidoActor;
