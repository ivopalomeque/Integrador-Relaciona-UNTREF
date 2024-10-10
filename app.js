const express = require('express');
const app = express();
const contenidoRoutes = require('./src/routes/contenidoRoutes');
const { sequelize } = require('./src/conexion/database');
const { Op } = require('sequelize')

const { Actor } = require('./src/models/actor')
const { Categoria } = require('./src/models/categoria')
const { Contenido } = require('./src/models/contenido')
const { Genero } = require('./src/models/genero')
const { ContenidoActorView } = require('./src/models/contenido_actor')
const { ContenidoGeneroView } = require('./src/models/contenido_genero')

// Middlewares
app.use(express.json());
app.use('/contenido', contenidoRoutes);

app.use(async (req, res, next) => {
  try {
    await sequelize.authenticate()
    console.log('Conexión establecida con exito ! =)')
    next()
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: `, description: error.message })
  }
})

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
    