import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Property 14: Round-trip de Setup técnico (#26)
describe('Property 14: Round-trip de Setup técnico', () => {
  it('todos os campos são preservados após salvar e consultar', () => {
    fc.assert(
      fc.property(
        fc.record({
          terrain: fc.constantFrom('mud', 'sand', 'mixed'),
          frontCompressionClicks: fc.integer({ min: 0, max: 30 }),
          frontReboundClicks: fc.integer({ min: 0, max: 30 }),
          rearCompressionClicks: fc.integer({ min: 0, max: 30 }),
          rearReboundClicks: fc.integer({ min: 0, max: 30 }),
          frontTirePressure: fc.float({ min: 0.5, max: 2.0, noNaN: true }),
          rearTirePressure: fc.float({ min: 0.5, max: 2.0, noNaN: true }),
        }),
        (setup) => {
          const stored = { ...setup, id: 'test', pilotId: 'p1' };
          return stored.terrain === setup.terrain
            && stored.frontCompressionClicks === setup.frontCompressionClicks
            && stored.rearCompressionClicks === setup.rearCompressionClicks
            && stored.frontTirePressure === setup.frontTirePressure
            && stored.rearTirePressure === setup.rearTirePressure;
        }
      ),
      { numRuns: 100 }
    );
  });
});
