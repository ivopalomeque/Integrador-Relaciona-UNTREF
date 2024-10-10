const express = require('express');
const app = express();
const contenidoRoutes = require('./src/routes/contenidoRoutes');
const { sequelize } = require('./src/conexion/database');

// Middlewares
app.use(express.json());

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

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
    