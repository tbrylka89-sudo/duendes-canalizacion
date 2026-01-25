/**
 * TITO 3.0 - Módulo Principal
 * El Duende Maestro de Duendes del Uruguay
 *
 * Sistema de agentes con Tools nativas de Claude
 */

// Conocimiento y datos
export * from './conocimiento';

// Personalidad y prompts
export * from './personalidad';

// Sistema de Tools
export * from './tools';

// Ejecutor de Tools
export { ejecutarTool, default as toolExecutor } from './tool-executor';

// Manual de persuasión (para referencia)
export { MANUAL_PERSUASION } from './manual-persuasion';
