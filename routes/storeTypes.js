const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const StoreType = require('../models/StoreType');

// Middleware de autenticação para todas as rotas
router.use(auth);

// Obter todos os tipos de loja
router.get('/', async (req, res) => {
  try {
    const storeTypes = await StoreType.find();
    res.json(storeTypes);
  } catch (error) {
    console.error('Erro ao buscar tipos de loja:', error);
    res.status(500).json({ message: 'Erro ao buscar tipos de loja' });
  }
});

module.exports = router;