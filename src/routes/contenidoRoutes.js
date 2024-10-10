const express = require('express');
const router = express.Router();
const { getAllContent, getContentById, filterContent, addContent, updateContent, deleteContent } = require('../controllers/contenidoController');


// Definimos las rutas

// Obtener todos los contenidos
router.get('/contenido', getAllContent);

// Obtener un contenido por ID
router.get('/:id', getContentById);

// Filtrar contenidos (por título, genero o categoría)
router.get('/filtrar', filterContent);

// Agregar un nuevo contenido
router.post('/nuevocontenido', addContent);

// Actualizar un contenido
router.put('/:id', updateContent);

// Eliminar un contenido
router.delete('/:id', deleteContent);

module.exports = router;
    