const mongoose = require('mongoose');
const StoreType = require('../models/StoreType');
require('dotenv').config();

const storeTypesData = [
  {
    name: 'atacarejo',
    description: 'Lojas de atacado e varejo'
  },
  {
    name: 'varejo',
    description: 'Lojas de varejo'
  },
  {
    name: 'contasGlobais',
    description: 'Contas globais'
  }
];

const seedStoreTypes = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/facings-db');
    console.log('Conectado ao MongoDB para seed');

    // Limpar tipos de loja existentes
    await StoreType.deleteMany({});
    console.log('Tipos de loja existentes removidos');

    // Adicionar novos tipos de loja
    await StoreType.insertMany(storeTypesData);
    console.log('Tipos de loja populados com sucesso');

    mongoose.disconnect();
    console.log('Desconectado do MongoDB');
  } catch (error) {
    console.error('Erro ao popular tipos de loja:', error);
    process.exit(1);
  }
};

seedStoreTypes();