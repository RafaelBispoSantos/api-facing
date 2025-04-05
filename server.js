const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Importar rotas
const authRoutes = require('./routes/auth');
const spaceRoutes = require('./routes/spaces');
const categoryRoutes = require('./routes/categories');
const storeTypeRoutes = require('./routes/storeTypes');

// Inicializar Express
const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000', // Adicionando esta origem alternativa
  'https://frontend-facings.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Durante desenvolvimento, o origin pode ser null em algumas requisições
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Origem bloqueada pelo CORS:', origin);
      callback(new Error('Bloqueado pelo CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Aplicar CORS como primeiro middleware
app.use(cors(corsOptions));

// Middleware para tratamento de erros CORS
app.use((err, req, res, next) => {
  if (err.message === 'Bloqueado pelo CORS') {
    res.status(403).json({
      status: 'error',
      message: 'Origem não permitida'
    });
  } else {
    next(err);
  }
});
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/facings-db')
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Definir rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/spaces', spaceRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/store-types', storeTypeRoutes);

// Servir o frontend em produção
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Medição de Facings está funcionando',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      spaces: '/api/spaces',
      categories: '/api/categories',
      storeTypes: '/api/store-types'
    }
  });
});

// Tratar erro 404
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

// Definir porta
const PORT = process.env.PORT || 5000;

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));