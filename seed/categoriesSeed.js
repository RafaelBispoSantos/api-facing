const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

const categoriesData = [
  {
    name: 'Maionese',
    rules: {
      atacarejo: {
        description: 'MAIONESE SQUEEZES REPRESENTA NO MÍNIMO 35% DO TOTAL DE MAIONESES',
        minimumPercentage: 35,
        maximumPercentage: null
      },
      varejo: {
        description: 'HELLMANNS SQUEEZES REPRESENTA NO MÍNIMO 35% DO TOTAL DE MAIONESES HELLMANN\'S',
        minimumPercentage: 35,
        maximumPercentage: null
      },
      contasGlobais: {
        description: 'HELLMANNS SQUEEZES REPRESENTA NO MÍNIMO 35% DO TOTAL DE MAIONESES HELLMANN\'S',
        minimumPercentage: 35,
        maximumPercentage: null
      }
    }
  },
  {
    name: 'Desodorante',
    rules: {
      atacarejo: {
        description: 'DESODORANTE ROLL ON + CREME + STICK REPRESENTA NO MÍNIMO 10%',
        minimumPercentage: 10,
        maximumPercentage: null
      },
      varejo: {
        description: 'REXONA CLINICAL (AERO+CREME STICK) REPRESENTAM NO MÍNIMO 7% DO ESPAÇO DE DESODORANTES UNILEVER',
        minimumPercentage: 7,
        maximumPercentage: null
      },
      contasGlobais: {
        description: 'REXONA CLINICAL (AERO+CREME STICK) REPRESENTAM NO MÍNIMO 7% DO ESPAÇO DE DESODORANTES UNILEVER',
        minimumPercentage: 7,
        maximumPercentage: null
      }
    }
  },
  {
    name: 'Sabonetes',
    rules: {
      atacarejo: {
        description: 'REXONA BARRAS (UNITÁRIO E MULTIPACK) REPRESENTA NO MÍNIMO 12% OU MAIS DO TOTAL DE SABONETES BARRAS UNILEVER',
        minimumPercentage: 12,
        maximumPercentage: null
      },
      varejo: {
        description: 'REXONA BARRAS (UNITÁRIO E MULTIPACK) REPRESENTA NO MÍNIMO 12% OU MAIS DO TOTAL DE SABONETES BARRAS UNILEVER',
        minimumPercentage: 12,
        maximumPercentage: null
      },
      contasGlobais: {
        description: 'REXONA BARRAS (UNITÁRIO E MULTIPACK) REPRESENTA NO MÍNIMO 12% OU MAIS DO TOTAL DE SABONETES BARRAS UNILEVER',
        minimumPercentage: 12,
        maximumPercentage: null
      }
    }
  },
  {
    name: 'Amaciantes',
    rules: {
      atacarejo: {
        description: 'AMACIANTES CONCENTRADOS FOFO REPRESENTA NO MÍNIMO 20% DO TOTAL DE AMACIANTES CONCENTRADOS UNILEVER',
        minimumPercentage: 20,
        maximumPercentage: null
      },
      varejo: {
        description: 'VARIANTE AZUL REPRESENTA NO MÁXIMO 50% DO TOTAL DE COMFORT CONCENTRADOS',
        minimumPercentage: null,
        maximumPercentage: 50
      },
      contasGlobais: {
        description: 'VARIANTE AZUL REPRESENTA NO MÁXIMO 50% DO TOTAL DE COMFORT CONCENTRADOS',
        minimumPercentage: null,
        maximumPercentage: 50
      }
    }
  },
  {
    name: 'Detergente Líquido',
    rules: {
      atacarejo: {
        description: 'DETERGENTE LÍQUIDO REPRESENTA NO MÍNIMO 35% DO TOTAL',
        minimumPercentage: 35,
        maximumPercentage: null
      },
      varejo: {
        description: 'DETERGENTE LÍQUIDO REPRESENTA NO MÍNIMO 35% DO TOTAL DA CATEGORIA DE DETERGENTES UNILEVER (LÍQUIDO + PÓ)',
        minimumPercentage: 35,
        maximumPercentage: null
      },
      contasGlobais: {
        description: 'DETERGENTE LÍQUIDO REPRESENTA NO MÍNIMO 35% DO TOTAL DA CATEGORIA DE DETERGENTES UNILEVER (LÍQUIDO + PÓ)',
        minimumPercentage: 35,
        maximumPercentage: null
      }
    }
  },
  {
    name: 'Detergente em Pó',
    rules: {
      atacarejo: {
        description: 'DETERGENTE BRILHANTE PÓ (TODOS OS TAMANHOS) REPRESENTA NO MÍNIMO 35% DO TOTAL DE DETERGENTES PÓS UNILEVER',
        minimumPercentage: 35,
        maximumPercentage: null
      },
      varejo: {
        description: 'DETERGENTE BRILHANTE PÓ (TODOS OS TAMANHOS) REPRESENTA NO MÍNIMO 35% DO TOTAL DE DETERGENTES PÓS UNILEVER',
        minimumPercentage: 35,
        maximumPercentage: null
      },
      contasGlobais: {
        description: 'DETERGENTE BRILHANTE PÓ (TODOS OS TAMANHOS) REPRESENTA NO MÍNIMO 27% DO TOTAL DE DETERGENTES PÓS UNILEVER',
        minimumPercentage: 27,
        maximumPercentage: null
      }
    }
  },
  {
    name: 'Cabelos',
    rules: {
      atacarejo: {
        description: 'DOVE CO, CTR e CPE E FINALIZADORES REPRESENTA 50% OU MAIS DO TOTAL DOVE (DESCONSIDERANDO OFERTAS)',
        minimumPercentage: 50,
        maximumPercentage: null
      },
      varejo: {
        description: 'DOVE CO, CTR e CPE E FINALIZADORES REPRESENTA 50% OU MAIS DO TOTAL DOVE (DESCONSIDERANDO OFERTAS)',
        minimumPercentage: 50,
        maximumPercentage: null
      },
      contasGlobais: {
        description: 'DOVE CO, CTR e CPE E FINALIZADORES REPRESENTA 50% OU MAIS DO TOTAL DOVE (DESCONSIDERANDO OFERTAS)',
        minimumPercentage: 50,
        maximumPercentage: null
      }
    }
  }
];

const seedCategories = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/facings-db');
    console.log('Conectado ao MongoDB para seed');

    // Limpar categorias existentes
    await Category.deleteMany({});
    console.log('Categorias existentes removidas');

    // Adicionar novas categorias
    await Category.insertMany(categoriesData);
    console.log('Categorias populadas com sucesso');

    mongoose.disconnect();
    console.log('Desconectado do MongoDB');
  } catch (error) {
    console.error('Erro ao popular categorias:', error);
    process.exit(1);
  }
};

seedCategories();