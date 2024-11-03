const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const contenidoRoutes = require('./src/routes/contenidoRoutes');
const { sequelize } = require('./src/conexion/database');

const {Actor} = require ("./src/models/actor.js")
const {Contenido} = require ("./src/models/contenido.js")
const {Categoria} = require ("./src/models/categoria.js")
const {Genero} = require  ("./src/models/genero.js")

// Middlewares
app.use(express.json());
//Usado por problemas con express a la hora de hacer peticiones
app.use(bodyParser.json());

app.use('/', contenidoRoutes);

app.use(async (req, res, next) => {
  try {
    await sequelize.authenticate()
    console.log('Conexión establecida con exito!')
    next()
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: `, description: error.message })
  }
})

Contenido.associate({ Categoria, Actor, Genero });
Categoria.associate({ Contenido });
Actor.associate({ Contenido });
Genero.associate({ Contenido });

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
    