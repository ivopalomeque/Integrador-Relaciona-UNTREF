const { Op } = require('sequelize');
const {sequelize} = require('../conexion/database.js');

const {Actor} = require ("../models/actor.js")
const {Contenido} = require ("../models/contenido.js")
const {Categoria} = require ("../models/categoria.js")
const {Genero} = require  ("../models/genero.js")
const {ContenidoActorView} = require  ("../models/contenido_actor.js")
const {ContenidoGeneroView} = require  ("../models/contenido_genero.js")


// Controlador para obtener todos los contenidos
const getAllContent = async (req, res) => {
    try {
        const contents = await Contenido.findAll({
            include: [
                { model: Categoria, attributes: ["nombre_categoria"] },
                { model: Actor, attributes: ["nombre_actor", "apellido_actor"], through: { attributes: [] } },
                { model: Genero, attributes: ["nombre_genero"], through: { attributes: [] } }
            ]
        });

        if (contents.length === 0) {
            return res.status(404).json({ message: 'No se encontraron contenidos en la base de datos.' });
        }

        // Procesar los datos para estructurarlos de forma más clara
        const formattedContents = contents.map(content => ({
            id: content.id,
            titulo: content.titulo,
            poster: content.poster,
            busqueda: content.busqueda,
            resumen: content.resumen,
            temporadas: content.temporadas,
            duracion: content.duracion,
            trailer: content.trailer,
            categoria: content.Categoria ? content.Categoria.nombre_categoria : null,
            actores: content.Actors.map(actor => `${actor.nombre_actor} ${actor.apellido_actor}`).join(', '), // Concatenar nombres de actores
            generos: content.Generos.map(genero => genero.nombre_genero).join(', ') // Concatenar géneros
        }));

        res.status(200).json(formattedContents);
    } catch (err) {
        console.error('Error al obtener los contenidos:', err);
        res.status(500).json({ message: 'Error al obtener los contenidos.' });
    }
};


// Obtener contenido por ID
const getContentById = async (req, res) => {
    const { id } = req.params;

    try {
        const content = await Contenido.findByPk(id, {
            include: [
                { model: Categoria, attributes: ["nombre_categoria"] },
                { model: Actor, attributes: ["nombre_actor", "apellido_actor"], through: { attributes: [] } },
                { model: Genero, attributes: ["nombre_genero"], through: { attributes: [] } }
            ]
        });

        if (!content) {
            return res.status(404).json({ message: `No se encontró contenido con el ID: ${id}` });
        }

        // Formatear la respuesta
        const formattedContent = {
            id: content.id,
            titulo: content.titulo,
            poster: content.poster,
            busqueda: content.busqueda,
            resumen: content.resumen,
            temporadas: content.temporadas,
            duracion: content.duracion,
            trailer: content.trailer,
            categoria: content.Categoria ? content.Categoria.nombre_categoria : null,
            actores: content.Actors.map(actor => `${actor.nombre_actor} ${actor.apellido_actor}`).join(', '),
            generos: content.Generos.map(genero => genero.nombre_genero).join(', ')
        };

        res.status(200).json(formattedContent);
    } catch (err) {
        console.error(`Error al obtener el contenido con ID (${id}):`, err);
        res.status(500).json({ message: 'Error al obtener el contenido.' });
    }
};

// Filtrar contenido por título, género o categoría
const filterContent = async (req, res) => {
    const { titulo, genero, categoria } = req.query;
    let whereClause = {};

    if (titulo) {
        whereClause.titulo = { [Op.like]: `%${titulo}%` };
    }

    try {
        const filteredContent = await Contenido.findAll({
            where: whereClause,
            include: [
                {
                    model: Categoria,
                    attributes: ["nombre_categoria"],
                    where: categoria ? { nombre_categoria: { [Op.like]: `%${categoria}%` } } : {}
                },
                {
                    model: Genero,
                    attributes: ["nombre_genero"],
                    where: genero ? { nombre_genero: { [Op.like]: `%${genero}%` } } : {},
                    through: { attributes: [] }
                },
                {
                    model: Actor,
                    attributes: ["nombre_actor", "apellido_actor"],
                    through: { attributes: [] }
                }
            ]
        });

        if (filteredContent.length === 0) {
            return res.status(404).json({ message: 'No se encontraron contenidos con los filtros aplicados.' });
        }

        const formattedContent = filteredContent.map(content => ({
            id: content.id,
            titulo: content.titulo,
            poster: content.poster,
            busqueda: content.busqueda,
            resumen: content.resumen,
            temporadas: content.temporadas,
            duracion: content.duracion,
            trailer: content.trailer,
            categoria: content.Categorium ? content.Categorium.nombre_categoria : null,
            actores: content.Actors.map(actor => `${actor.nombre_actor} ${actor.apellido_actor}`).join(', '),
            generos: content.Generos.map(genero => genero.nombre_genero).join(', ')
        }));

        res.status(200).json(formattedContent);
    } catch (err) {
        console.error('Error al filtrar los contenidos:', err);
        res.status(500).json({ message: 'Error al filtrar los contenidos.' });
    }
};


// Agregar nuevo contenido
const addContent = async (req, res) => {
    // Asegúrate de que `categoria_id` se extrae correctamente de `req.body`
    const { 
        poster, titulo, busqueda, resumen, temporadas, duracion, trailer, categoria_id, actores, generos
    } = req.body;

    // Log para verificar los datos recibidos
    console.log('Datos recibidos:', req.body);
    console.log('Categoria ID:', categoria_id);  // Verifica que `categoria_id` no esté indefinido aquí

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
                await nuevoContenido.addActor(actor);
            }
        }

        // Vincular géneros
        if (generos && Array.isArray(generos)) {
            for (const genero_id of generos) {
                const genero = await Genero.findByPk(genero_id);
                if (!genero) {
                    return res.status(400).json({ message: `El género con ID ${genero_id} no existe.` });
                }
                await nuevoContenido.addGenero(genero);
            }
        }

        res.status(201).json({ message: 'Contenido agregado exitosamente.', nuevoContenido });
    } catch (err) {
        console.error('Error al agregar el contenido:', err);
        res.status(500).json({ message: 'Error al agregar el contenido.' });
    }
};



// Actualizar contenido por ID
const updateContent = async (req, res) => {
    const { id } = req.params;
    const { poster, titulo, busqueda, resumen, temporadas, duracion, trailer, categoria_id, actores, generos } = req.body;

    try {
        // Buscar el contenido
        const contenido = await Contenido.findByPk(id);
        if (!contenido) {
            return res.status(404).json({ message: `No se encontró contenido con el ID: ${id}` });
        }

        // Verificar si la categoría existe
        const categoria = await Categoria.findByPk(categoria_id);
        if (!categoria) {
            return res.status(400).json({ message: `La categoría con ID ${categoria_id} no existe.` });
        }

        // Actualizar los datos del contenido
        await contenido.update({ poster, titulo, busqueda, resumen, temporadas, duracion, trailer, categoria_id });

        // Actualizar relaciones con actores
        if (actores && Array.isArray(actores)) {
            const actoresExistentes = await Actor.findAll({ where: { id: actores } });
            await contenido.setActors(actoresExistentes);
        }

        // Actualizar relaciones con géneros
        if (generos && Array.isArray(generos)) {
            const generosExistentes = await Genero.findAll({ where: { id: generos } });
            await contenido.setGeneros(generosExistentes);
        }

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
