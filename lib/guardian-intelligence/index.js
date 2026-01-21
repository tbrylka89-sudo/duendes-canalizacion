/**
 * GUARDIAN INTELLIGENCE - EXPORTACIONES CENTRALES
 * El cerebro de Duendes del Uruguay
 */

// Configuración
export * from './config.js';

// Analizador de historias
export * from './analyzer.js';

// Generador de contenido
export * from './generator.js';

// Monitor 24/7
export * from './monitor.js';

// Reporte diario
export * from './daily-report.js';

// Sistema de promociones y banners
export * from './promotions.js';

// Sistema de cross-selling
export * from './cross-selling.js';

// Re-exportar defaults
import config from './config.js';
import analyzer from './analyzer.js';
import generator from './generator.js';
import monitor from './monitor.js';
import dailyReport from './daily-report.js';

export const GuardianIntelligence = {
  config,
  analyzer,
  generator,
  monitor,
  dailyReport
};

export default GuardianIntelligence;
