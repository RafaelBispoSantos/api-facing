const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Space = require('../models/Space');
const Category = require('../models/Category');
const mongoose = require('mongoose');

// Middleware de autenticação para todas as rotas
router.use(auth);

// Obter todos os espaços do usuário
router.get('/', async (req, res) => {
  try {
    const spaces = await Space.find({ user: req.user.userId })
      .populate('category');
    res.json(spaces);
  } catch (error) {
    console.error('Erro ao buscar espaços:', error);
    res.status(500).json({ message: 'Erro ao buscar espaços' });
  }
});

// Obter um espaço específico
router.get('/:id', async (req, res) => {
  try {
    const space = await Space.findOne({ 
      _id: req.params.id,
      user: req.user.userId 
    }).populate('category');
    
    if (!space) {
      return res.status(404).json({ message: 'Espaço não encontrado' });
    }
    
    res.json(space);
  } catch (error) {
    console.error('Erro ao buscar espaço:', error);
    res.status(500).json({ message: 'Erro ao buscar espaço' });
  }
});




// Atualizar espaço
router.put('/:id', async (req, res) => {
  try {
    const { name, totalSpace, storeType, categoryId } = req.body;
    
    // Verificar se a categoria existe
    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(400).json({ message: 'Categoria não encontrada' });
      }
    }
    
    // Verificar se o tipo de loja é válido
    if (storeType && !['atacarejo', 'varejo', 'contasGlobais'].includes(storeType)) {
      return res.status(400).json({ message: 'Tipo de loja inválido' });
    }
    
    const updates = {};
    if (name) updates.name = name;
    if (totalSpace) updates.totalSpace = totalSpace;
    if (storeType) updates.storeType = storeType;
    if (categoryId) updates.category = categoryId;
    
    const space = await Space.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      updates,
      { new: true }
    ).populate('category');
    
    if (!space) {
      return res.status(404).json({ message: 'Espaço não encontrado' });
    }
    
    res.json(space);
  } catch (error) {
    console.error('Erro ao atualizar espaço:', error);
    res.status(500).json({ message: 'Erro ao atualizar espaço' });
  }
});

// Excluir espaço
router.delete('/:id', async (req, res) => {
  try {
    const space = await Space.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });
    
    if (!space) {
      return res.status(404).json({ message: 'Espaço não encontrado' });
    }
    
    res.json({ message: 'Espaço excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir espaço:', error);
    res.status(500).json({ message: 'Erro ao excluir espaço' });
  }
});
// Adicionar medição a um espaço
router.post('/:spaceId/measurements', async (req, res) => {
  try {
    console.log('Rota de adicionar medição chamada');
    console.log('Parâmetros da requisição:', {
      spaceId: req.params.spaceId,
      body: req.body,
      user: req.user.userId
    });

    const { productType, totalSpace, allocatedSpace } = req.body;

    // Validações de entrada
    if (!productType || !totalSpace || !allocatedSpace) {
      return res.status(400).json({ message: 'Dados de medição incompletos' });
    }

    // Encontrar o espaço do usuário
    const space = await Space.findOne({ 
      _id: req.params.spaceId,
      user: req.user.userId 
    });
    
    if (!space) {
      console.log('Espaço não encontrado:', {
        spaceId: req.params.spaceId,
        userId: req.user.userId
      });
      return res.status(404).json({ message: 'Espaço não encontrado' });
    }

    // Calcular o espaço já utilizado
    const currentlyUsed = space.measurements.reduce(
      (sum, measurement) => sum + measurement.allocatedSpace,
      0
    );

    // Validar se o novo espaço ultrapassa o total disponível
    if (currentlyUsed + allocatedSpace > space.totalSpace) {
      return res.status(400).json({ 
        message: `Espaço excede o limite disponível. Restante: ${space.totalSpace - currentlyUsed} cm` 
      });
    }

    // Adicionar nova medição
    const newMeasurement = {
      productType,
      totalSpace,
      allocatedSpace,
      date: new Date()
    };

    space.measurements.push(newMeasurement);

    // Atualizar espaço alocado
    space.allocatedSpace = currentlyUsed + allocatedSpace;

    await space.save();
    
    // Popular a categoria para retornar
    await space.populate('category');
    
    res.status(201).json(space);
  } catch (error) {
    console.error('Erro ao adicionar medição:', error);
    res.status(500).json({ 
      message: 'Erro interno do servidor', 
      details: error.message 
    });
  }
});
// Adicionar medição
router.post('/', async (req, res) => {
  try {
    const { name, categoryId, storeType } = req.body;
    
    // Verificar se o nome está presente
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Nome do espaço é obrigatório' });
    }
    
    // Verificar se a categoria existe
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: 'Categoria não encontrada' });
    }
    
    // Verificar se o tipo de loja é válido
    if (!['atacarejo', 'varejo', 'contasGlobais'].includes(storeType)) {
      return res.status(400).json({ message: 'Tipo de loja inválido' });
    }
    
    // Criar o espaço sem o campo totalSpace
    const space = new Space({
      name,
      category: categoryId,
      storeType,
      user: req.user.userId,
      measurements: []
    });
    
    await space.save();
    
    // Populate category para retornar ao cliente
    await space.populate('category');
    
    res.status(201).json(space);
  } catch (error) {
    console.error('Erro ao criar espaço:', error);
    res.status(500).json({ message: 'Erro ao criar espaço' });
  }
});



// Excluir uma medição
router.delete('/:spaceId/measurements/:measurementId', async (req, res) => {
  try {
    const space = await Space.findOne({ 
      _id: req.params.spaceId,
      user: req.user.userId 
    }).populate('category');
    
    if (!space) {
      return res.status(404).json({ message: 'Espaço não encontrado' });
    }
    
    // Verificar se a medição existe
    const measurementIndex = space.measurements.findIndex(
      measurement => measurement._id.toString() === req.params.measurementId
    );
    
    if (measurementIndex === -1) {
      return res.status(404).json({ message: 'Medição não encontrada' });
    }
    
    // Remover a medição
    space.measurements.splice(measurementIndex, 1);
    
    await space.save();
    res.json(space);
  } catch (error) {
    console.error('Erro ao excluir medição:', error);
    res.status(500).json({ message: 'Erro ao excluir medição' });
  }
});

// Verificar se a meta da categoria foi atingida
router.get('/:id/check-goal', async (req, res) => {
  try {
    const space = await Space.findOne({
      _id: req.params.id,
      user: req.user.userId
    }).populate('category');
    
    if (!space) {
      return res.status(404).json({ message: 'Espaço não encontrado' });
    }
    
    // Obter a regra para o tipo de loja e categoria
    const rule = space.category.rules[space.storeType];
    
    // Se não houver regras definidas
    if (!rule) {
      return res.json({
        achieved: false,
        message: 'Nenhuma regra definida para esta combinação de categoria e tipo de loja',
        percentage: 0,
        goalPercentage: null
      });
    }
    
    // Se não houver medições
    if (!space.measurements || space.measurements.length === 0) {
      return res.json({
        achieved: false,
        message: 'Sem medições registradas para avaliar',
        percentage: 0,
        goalPercentage: rule.minimumPercentage || rule.maximumPercentage,
        isMinimum: rule.minimumPercentage !== null,
        description: rule.description
      });
    }
    
    // Para cada medição, calcular a porcentagem baseada nos seus próprios valores
    // Calcular a média das porcentagens ou usar uma abordagem específica conforme necessário
    let totalPercentage = 0;
    
    // Podemos decidir usar a medição mais recente para a avaliação
    const latestMeasurement = space.measurements[space.measurements.length - 1];
    
    // Calcular a porcentagem baseada na medição mais recente
    const percentage = (latestMeasurement.allocatedSpace / latestMeasurement.totalSpace) * 100;
    
    let achieved = false;
    let message = '';
    
    // Verificar se a meta foi atingida
    if (rule.minimumPercentage !== null) {
      achieved = percentage >= rule.minimumPercentage;
      message = achieved 
        ? `Meta atingida! (${percentage.toFixed(2)}% ≥ ${rule.minimumPercentage}%)`
        : `Meta não atingida. (${percentage.toFixed(2)}% < ${rule.minimumPercentage}%)`;
    } else if (rule.maximumPercentage !== null) {
      achieved = percentage <= rule.maximumPercentage;
      message = achieved 
        ? `Meta atingida! (${percentage.toFixed(2)}% ≤ ${rule.maximumPercentage}%)`
        : `Meta não atingida. (${percentage.toFixed(2)}% > ${rule.maximumPercentage}%)`;
    }
    
    res.json({
      achieved,
      message,
      percentage: parseFloat(percentage.toFixed(2)),
      goalPercentage: rule.minimumPercentage || rule.maximumPercentage,
      isMinimum: rule.minimumPercentage !== null,
      description: rule.description
    });
  } catch (error) {
    console.error('Erro ao verificar meta:', error);
    res.status(500).json({ message: 'Erro ao verificar meta' });
  }
});

module.exports = router;