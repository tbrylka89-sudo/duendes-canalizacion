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

// Sistema de promociones y banners
export * from './promotions.js';

// Sistema de cross-selling
export * from './cross-selling.js';

// Re-exportar defaults
import config from './config.js';
import analyzer from './analyzer.js';
import generator from './generator.js';
import monitor from './monitor.js';

export const GuardianIntelligence = {
  config,
  analyzer,
  generator,
  monitor
};

export default GuardianIntelligence;
