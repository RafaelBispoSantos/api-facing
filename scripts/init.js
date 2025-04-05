const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Carregando o .env com caminho explícito
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Determinar o caminho raiz do projeto (um nível acima do diretório scripts)
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Diretório do arquivo de controle
const CONTROL_DIR = path.join(PROJECT_ROOT, '.control');
const SEED_CONTROL_FILE = path.join(CONTROL_DIR, 'seed-status.json');

// Verificar e criar diretório de controle se não existir
if (!fs.existsSync(CONTROL_DIR)) {
  fs.mkdirSync(CONTROL_DIR, { recursive: true });
}

// Verificar status do seed
let seedStatus = { executed: false, date: null };
if (fs.existsSync(SEED_CONTROL_FILE)) {
  try {
    seedStatus = JSON.parse(fs.readFileSync(SEED_CONTROL_FILE, 'utf8'));
  } catch (error) {
    console.error('Erro ao ler arquivo de controle:', error);
  }
}

// Função principal
const init = async () => {
  try {
    console.log('MONGODB_URI está definido?', process.env.MONGODB_URI ? 'Sim' : 'Não');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI não está definido no arquivo .env');
    }
    
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conectado ao MongoDB');

    // Verificar se os seeds já foram executados
    if (!seedStatus.executed) {
      console.log('Executando scripts de seed...');
      
      // Caminhos para os scripts de seed
      const storeTypesSeedPath = path.join(PROJECT_ROOT, 'seed', 'storeTypesSeed.js');
      const categoriesSeedPath = path.join(PROJECT_ROOT, 'seed', 'categoriesSeed.js');
      
      // Verificar se os arquivos existem
      if (fs.existsSync(storeTypesSeedPath)) {
        console.log(`Arquivo ${storeTypesSeedPath} encontrado`);
      } else {
        console.error(`Arquivo ${storeTypesSeedPath} não encontrado`);
      }
      
      if (fs.existsSync(categoriesSeedPath)) {
        console.log(`Arquivo ${categoriesSeedPath} encontrado`);
      } else {
        console.error(`Arquivo ${categoriesSeedPath} não encontrado`);
      }
      
      // Executar seeds com caminhos entre aspas para lidar com espaços
      await execPromise(`node "${storeTypesSeedPath}"`);
      await execPromise(`node "${categoriesSeedPath}"`);
      
      // Atualizar status
      seedStatus.executed = true;
      seedStatus.date = new Date().toISOString();
      fs.writeFileSync(SEED_CONTROL_FILE, JSON.stringify(seedStatus, null, 2));
      
      console.log('Seeds executados com sucesso!');
    } else {
      console.log(`Seeds já foram executados em ${seedStatus.date}`);
    }

    // Desconectar do MongoDB
    await mongoose.disconnect();
    console.log('Inicialização concluída com sucesso!');
    
    process.exit(0);
  } catch (error) {
    console.error('Erro durante a inicialização:', error);
    process.exit(1);
  }
};

// Executar comando como Promise
function execPromise(command) {
  return new Promise((resolve, reject) => {
    console.log(`Executando comando: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro de execução: ${error}`);
        return reject(error);
      }
      console.log(stdout);
      if (stderr) console.error(stderr);
      resolve();
    });
  });
}

// Executar inicialização
init();