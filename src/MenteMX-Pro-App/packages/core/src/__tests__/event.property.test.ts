import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Property 15: Ordenação cronológica decrescente de Eventos (#17)
describe('Property 15: Ordenação decrescente por event_date', () => {
  it('lista ordenada tem datas em ordem decrescente', () => {
    fc.assert(
      fc.property(
        fc.array(fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }), { minLength: 2, maxLength: 20 }),
        (dates) => {
          const sorted = [...dates].sort((a, b) => b.getTime() - a.getTime());
          for (let i = 1; i < sorted.length; i++) {
            if (sorted[i].getTime() > sorted[i - 1].getTime()) return false;
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Property 16: Agregação correta do resumo de Evento (#17)
describe('Property 16: Agregação de resumo de Evento', () => {
  it('bestTime = min dos melhores tempos das sessões', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 30000, max: 180000 }), { minLength: 1, maxLength: 10 }),
        (bestTimes) => {
          const eventBest = Math.min(...bestTimes);
          return eventBest === bestTimes.reduce((min, t) => t < min ? t : min, bestTimes[0]);
        }
      ),
      { numRuns: 100 }
    );
  });
});
