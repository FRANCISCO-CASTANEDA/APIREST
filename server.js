const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Datos en memoria
let usuarios = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    correo: 'juan@gmail.com'
  }
];


// RUTA PRINCIPAL

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API REST funcionando',
    rutas: [
      '/usuarios',
      '/api-docs'
    ]
  });
});


// SWAGGER

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// RUTAS USUARIOS

// GET todos
app.get('/usuarios', (req, res) => {
  res.status(200).json(usuarios);
});

// GET por ID
app.get('/usuarios/:id', (req, res) => {
  const usuario = usuarios.find(
    u => u.id === parseInt(req.params.id)
  );

  if (!usuario) {
    return res.status(404).json({
      mensaje: 'Usuario no encontrado'
    });
  }

  res.status(200).json(usuario);
});

// POST
app.post('/usuarios', (req, res) => {
  const { nombre, correo } = req.body;

  if (!nombre || !correo) {
    return res.status(400).json({
      mensaje: 'Nombre y correo son obligatorios'
    });
  }

  const nuevoUsuario = {
    id: usuarios.length + 1,
    nombre,
    correo
  };

  usuarios.push(nuevoUsuario);

  res.status(201).json(nuevoUsuario);
});

// PUT
app.put('/usuarios/:id', (req, res) => {
  const usuario = usuarios.find(
    u => u.id === parseInt(req.params.id)
  );

  if (!usuario) {
    return res.status(404).json({
      mensaje: 'Usuario no encontrado'
    });
  }

  usuario.nombre = req.body.nombre || usuario.nombre;
  usuario.correo = req.body.correo || usuario.correo;

  res.status(200).json(usuario);
});

// DELETE
app.delete('/usuarios/:id', (req, res) => {
  const index = usuarios.findIndex(
    u => u.id === parseInt(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      mensaje: 'Usuario no encontrado'
    });
  }

  usuarios.splice(index, 1);

  res.status(200).json({
    mensaje: 'Usuario eliminado correctamente'
  });
});


// START SERVER

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});