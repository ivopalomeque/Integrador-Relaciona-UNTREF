const { Op } = require('sequelize');
const db = require('../conexion/database.js');

const { Actor } = require('../models/actor');
const { Categoria } = require('../models/categoria');
const { Contenido } = require('../models/contenido');
const { Genero } = require('../models/genero');


// Controlador para obtener todos los contenidos
const getAllContent = async (req, res) => {
    try {
        const rows = await Contenido.findAll({
            include: [{ all: true }]
        });
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron contenidos en la base de datos.' });
        }
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error al obtener los contenidos:', err);
        res.status(500).json({ message: 'Error al obtener los contenidos.' });
    }
};

// Controlador para obtener contenido por ID
const getContentById = async (req, res) => {
    const { id } = req.params;

    try {
        const contenido = await Contenido.findByPk(id, {
            include: [{ all: true }]
        });

        if (!contenido) {
            return res.status(404).json({ message: `No se encontró contenido con el ID: ${id}` });
        }

        res.status(200).json(contenido);
    } catch (err) {
        console.error(`Error al obtener el contenido por ID (${id}):`, err);
        res.status(500).json({ message: 'Error al obtener el contenido.' });
    }
};

// Controlador para filtrar contenido
const filterContent = async (req, res) => {
    const { titulo, genero, categoria } = req.query;

    let whereClause = {};

    if (titulo) {
        whereClause.titulo = { [Op.like]: `%${titulo}%` };
    }

    if (genero) {
        whereClause['$generos.nombre_genero$'] = { [Op.like]: `%${genero}%` };
    }

    if (categoria) {
        whereClause['$categorias.nombre_categoria$'] = { [Op.like]: `%${categoria}%` };
    }

    try {
        const contenido = await Contenido.findAll({
            where: whereClause,
            include: [{ all: true }]
        });

        if (contenido.length === 0) {
            return res.status(404).json({ message: 'No se encontraron contenidos con esos filtros.' });
        }

        res.status(200).json(contenido);
    } catch (err) {
        console.error('Error al filtrar los contenidos:', err);
        res.status(500).json({ message: 'Error al filtrar los contenidos.' });
    }
};

// Controlador para agregar contenido
const addContent = async (req, res) => {
    const { 
        poster, titulo, busqueda, resumen, temporadas, duracion, trailer, categoria_id, actores, generos
    } = req.body;

    // Log para verificar los datos recibidos
    console.log('Datos recibidos:', req.body);

    try {
        // Verificar si la categoría existe
        const categoria = await Categoria.findByPk(categoria_id);
        if (!categoria) {
            return res.status(400).json({ message: `La categoría con ID ${categoria_id} no existe.` });
        }

        // Crear el nuevo contenido
        const nuevoContenido = await Contenido.create({
            poster, titulo, busqueda, resumen, temporadas, duracion, trailer, categoria_id
        });

        // Vincular actores
        if (actores && Array.isArray(actores)) {
            for (const actor_id of actores) {
                const actor = await Actor.findByPk(actor_id);
                if (!actor) {
                    return res.status(400).json({ message: `El actor con ID ${actor_id} no existe.` });
                }
                await nuevoContenido.addActor(actor); // Asumiendo que la relación ahora funciona
            }
        }

        // Vincular géneros
        if (generos && Array.isArray(generos)) {
            for (const genero_id of generos) {
                const genero = await Genero.findByPk(genero_id);
                if (!genero) {
                    return res.status(400).json({ message: `El género con ID ${genero_id} no existe.` });
                }
                await nuevoContenido.addGenero(genero); // Asumiendo que la relación ahora funciona
            }
        }

        res.status(201).json({ message: 'Contenido agregado exitosamente.', nuevoContenido });
    } catch (err) {
        console.error('Error al agregar el contenido:', err);
        res.status(500).json({ message: 'Error al agregar el contenido.' });
    }
};



// Controlador para actualizar contenido
const updateContent = async (req, res) => {
    const { id } = req.params;
    const { poster, titulo, busqueda, resumen, temporadas, duracion, trailer, categoria_id } = req.body;

    try {
        const contenido = await Contenido.findByPk(id);

        if (!contenido) {
            return res.status(404).json({ message: `No se encontró contenido con el ID: ${id}` });
        }

        await contenido.update({
            poster, titulo, busqueda, resumen, temporadas, duracion, trailer, categoria_id
        });

        res.status(200).json({ message: 'Contenido actualizado exitosamente.', contenido });
    } catch (err) {
        console.error(`Error al actualizar el contenido con ID (${id}):`, err);
        res.status(500).json({ message: 'Error al actualizar el contenido.' });
    }
};

// Controlador para eliminar contenido
const deleteContent = async (req, res) => {
    const { id } = req.params;

    try {
        const contenido = await Contenido.findByPk(id);

        if (!contenido) {
            return res.status(404).json({ message: `No se encontró contenido con el ID: ${id}` });
        }

        await contenido.destroy();
        res.status(200).json({ message: 'Contenido eliminado exitosamente.' });
    } catch (err) {
        console.error(`Error al eliminar el contenido con ID (${id}):`, err);
        res.status(500).json({ message: 'Error al eliminar el contenido.' });
    }
};

module.exports = { getAllContent, getContentById, filterContent, addContent, updateContent, deleteContent };
