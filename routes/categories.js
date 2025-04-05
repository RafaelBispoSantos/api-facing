const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Category = require('../models/Category');

// Middleware de autenticação para todas as rotas
router.use(auth);

// Obter todas as categorias
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ message: 'Erro ao buscar categorias' });
  }
});

// Obter uma categoria específica
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    
    res.json(category);
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    res.status(500).json({ message: 'Erro ao buscar categoria' });
  }
});

// Obter regras para um tipo de loja específico
router.get('/rules/:storeType', async (req, res) => {
  try {
    const { storeType } = req.params;
    
    if (!['atacarejo', 'varejo', 'contasGlobais'].includes(storeType)) {
      return res.status(400).json({ message: 'Tipo de loja inválido' });
    }
    
    const categories = await Category.find();
    
    const rules = categories.map(category => ({
      categoryId: category._id,
      categoryName: category.name,
      rule: category.rules[storeType]
    }));
    
    res.json(rules);
  } catch (error) {
    console.error('Erro ao buscar regras:', error);
    res.status(500).json({ message: 'Erro ao buscar regras' });
  }
});

module.exports = router;