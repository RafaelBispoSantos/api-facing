const { exec } = require('child_process');

console.log('Iniciando processo de seed do banco de dados...');

// Executa os seeds em sequência
const runSeeds = async () => {
  try {
    // Executa seed de tipos de loja
    await execPromise('node backend/seed/storeTypesSeed.js');
    console.log('Seed de tipos de loja concluído com sucesso');

    // Executa seed de categorias
    await execPromise('node backend/seed/categoriesSeed.js');
    console.log('Seed de categorias concluído com sucesso');

    console.log('Todos os seeds foram executados com sucesso!');
  } catch (error) {
    console.error('Erro ao executar seeds:', error);
    process.exit(1);
  }
};

// Função para executar comando como Promise
function execPromise(command) {
  return new Promise((resolve, reject) => {
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

runSeeds();