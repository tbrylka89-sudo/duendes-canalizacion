// ═══════════════════════════════════════════════════════════════
// COMPONENTES DE MI MAGIA - ÍNDICE DE EXPORTACIONES
// ═══════════════════════════════════════════════════════════════

// Componentes principales
export { Tito, TitoBurbuja } from './Tito';
export { default as SeccionInicio } from './SeccionInicio';
export { default as SeccionCanalizaciones } from './SeccionCanalizaciones';
export { default as SeccionRegalos } from './SeccionRegalos';
export { default as SeccionGrimorio } from './SeccionGrimorio';
export { default as SeccionCirculo } from './SeccionCirculo';

// Componentes existentes
export { default as CofreDiario } from './CofreDiario';
export { AccesoRestringido, BadgeNivelAcceso, BannerUpgrade, BannerCompletarPerfil } from './AccesoRestringido';
export { BannerPromociones } from './BannerPromociones';

// Tooltips de información
export { default as TooltipInfo, InfoTooltip, TOOLTIPS } from './TooltipInfo';

// Constantes y utilidades
export * from './constants';

// Estilos
export { estilos } from './styles';
