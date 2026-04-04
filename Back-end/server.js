require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./src/app');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || process.env.DB_URI;

async function start() {
  if (MONGO_URI) {
    try {
      await mongoose.connect(MONGO_URI);
      console.log('MongoDB conectado');
    } catch (error) {
      console.error('Error conectando a MongoDB:', error);
      process.exit(1);
    }
  } else {
    console.warn('MONGO_URI no definido; sesiones en memoria');
  }

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}

start();
