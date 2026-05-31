/**
 * @mentemx/core
 * Lógica de negócio compartilhada entre mobile, desktop e backend.
 *
 * Módulos:
 * - analytics: Consistência, MX Score, Radar
 * - streak: Gamificação e streaks de treino
 * - format: Formatação de tempos e dados
 * - licensing: Validação de License Keys
 */

export * from './format';
export * from './sync';
export * from './analytics/index';
export * from './streak';
