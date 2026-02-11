require('dotenv').config();

const app = require('./app');
const { syncDatabase } = require('./models');

const PORT = process.env.PORT || 3000;

const start = async () => {
  await syncDatabase();

  app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📌 Entorno: ${process.env.NODE_ENV}`);
  });
};

start();
