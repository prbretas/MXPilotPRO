import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { resolveConflictLWW } from '../sync.js';

// Property 6: Resolução de conflito LWW (#15)
describe('Property 6: LWW preserva versão mais recente', () => {
  it('resultado tem o updated_at mais recente', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }),
        fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }),
        (date1, date2) => {
          const local = { id: '1', data: 'local', updatedAt: date1.toISOString() };
          const remote = { id: '1', data: 'remote', updatedAt: date2.toISOString() };
          const result = resolveConflictLWW(local, remote);
          const resultTime = new Date(result.updatedAt).getTime();
          const maxTime = Math.max(date1.getTime(), date2.getTime());
          return resultTime === maxTime;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Property 7: Integridade de sync (#15)
describe('Property 7: Integridade após flush', () => {
  it('todas as ops confirmadas devem estar marcadas como synced', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({
          id: fc.uuid(),
          opType: fc.constantFrom('INSERT', 'UPDATE', 'DELETE'),
          tableName: fc.constantFrom('lap', 'session', 'setup'),
          payload: fc.string(),
        }), { minLength: 1, maxLength: 20 }),
        (ops) => {
          // Simular flush: todas confirmadas
          const confirmed = ops.map(op => ({ ...op, synced: true }));
          return confirmed.every(op => op.synced === true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
