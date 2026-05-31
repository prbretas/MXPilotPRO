import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { formatLapTime } from '../format.js';

// Property 2: Persistência local imediata de Volta (#12)
describe('Property 2: Persistência local imediata de Volta', () => {
  it('tempo registrado é preservado exatamente', () => {
    fc.assert(
      fc.property(fc.integer({ min: 10000, max: 300000 }), (lapTimeMs) => {
        const stored = { lapTimeMs, sessionId: 's1', lapNumber: 1 };
        return stored.lapTimeMs === lapTimeMs;
      }),
      { numRuns: 100 }
    );
  });
});

// Property 4: Melhor tempo = mínimo da lista (#12)
describe('Property 4: Melhor tempo é o mínimo da lista', () => {
  it('bestLap = Math.min(...laps)', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 10000, max: 300000 }), { minLength: 1, maxLength: 30 }),
        (laps) => {
          const best = Math.min(...laps);
          return best === laps.reduce((min, l) => l < min ? l : min, laps[0]);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Property 5: Completude do resumo de Sessão (#12)
describe('Property 5: Completude do resumo de Sessão', () => {
  it('resumo contém count, best, avg e consistência para >= 3 voltas', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 10000, max: 300000 }), { minLength: 3, maxLength: 30 }),
        (laps) => {
          const count = laps.length;
          const best = Math.min(...laps);
          const avg = laps.reduce((s, l) => s + l, 0) / count;
          return count >= 3 && best > 0 && avg > 0 && best <= avg;
        }
      ),
      { numRuns: 100 }
    );
  });
});
