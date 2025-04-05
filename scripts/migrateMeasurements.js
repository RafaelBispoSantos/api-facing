// backend/scripts/migrateMeasurements.js
const mongoose = require('mongoose');
const Space = require('../models/Space');
require('dotenv').config();

/**
 * Script para adicionar o campo totalSpace às medições existentes.
 * Isso é necessário após a atualização do modelo para incluir esse campo.
 */
const migrateMeasurements = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/facings-db');
    console.log('Conectado ao MongoDB para migração');

    // Buscar todos os espaços
    const spaces = await Space.find();
    console.log(`Encontrados ${spaces.length} espaços para migração`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const space of spaces) {
      let isUpdated = false;

      // Verificar e atualizar cada medição
      for (const measurement of space.measurements) {
        // Se já tiver o campo totalSpace, pular
        if (measurement.totalSpace !== undefined) {
          continue;
        }

        // Adicionar o campo totalSpace com o mesmo valor do totalSpace do espaço
        // ou outro valor lógico de acordo com seu caso de uso
        measurement.totalSpace = space.totalSpace;
        isUpdated = true;
      }

      if (isUpdated) {
        // Salvar as alterações
        await space.save();
        updatedCount++;
        console.log(`Espaço ID: ${space._id} atualizado com sucesso`);
      } else {
        skippedCount++;
      }
    }

    console.log(`Migração concluída: ${updatedCount} espaços atualizados, ${skippedCount} espaços ignorados`);
    mongoose.disconnect();
    console.log('Desconectado do MongoDB');
  } catch (error) {
    console.error('Erro durante a migração:', error);
    process.exit(1);
  }
};

// Executar a migração
migrateMeasurements();