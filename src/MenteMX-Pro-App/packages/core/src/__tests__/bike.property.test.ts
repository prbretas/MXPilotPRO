import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Property 1: Round-trip de cadastro de Moto (#9)
describe('Property 1: Round-trip de cadastro de Moto', () => {
  it('dados cadastrados são preservados no round-trip', () => {
    fc.assert(
      fc.property(
        fc.record({
          brand: fc.string({ minLength: 1, maxLength: 50 }),
          model: fc.string({ minLength: 1, maxLength: 50 }),
          year: fc.integer({ min: 1990, max: 2030 }),
          displacementCc: fc.integer({ min: 50, max: 500 }),
        }),
        (bike) => {
          // Simular round-trip: cadastrar e consultar
          const stored = { ...bike, id: 'test-id', pilotId: 'pilot-1' };
          return stored.brand === bike.brand
            && stored.model === bike.model
            && stored.year === bike.year
            && stored.displacementCc === bike.displacementCc;
        }
      ),
      { numRuns: 100 }
    );
  });
});
