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
// Configuração do CORS
const corsOptions = {
  origin: [
    'http://localhost:3000', // substitua pelo seu domínio real
    /\.vercel\.app$/ // permite todos os domínios vercel.app
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
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
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

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