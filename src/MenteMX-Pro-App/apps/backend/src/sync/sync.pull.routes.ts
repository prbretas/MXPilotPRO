import { Router } from 'express';
import { gt } from 'drizzle-orm';
import { authMiddleware, type AuthenticatedRequest } from '../auth/auth.middleware.js';
import { db, schema } from '../db/index.js';

const router = Router();

/**
 * GET /sync/pull?since=ISO_TIMESTAMP
 * Retorna dados atualizados desde o timestamp fornecido.
 * Usado pelo desktop para puxar dados do mobile (via servidor).
 */
router.get('/pull', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { since } = req.query;
    const sinceDate = since ? new Date(since as string) : new Date(0);

    // Buscar operações sincronizadas desde o timestamp
    const operations = await db
      .select()
      .from(schema.pendingOperation)
      .where(gt(schema.pendingOperation.createdAt, sinceDate))
      .limit(100);

    res.json({
      operations,
      count: operations.length,
      syncedAt: new Date().toISOString(),
    });
  } catch {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * POST /sync/push
 * Recebe dados do desktop para sincronizar com o servidor.
 * Protocolo baseado em timestamps (last_synced_at).
 */
router.post('/push', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { operations } = req.body;

    if (!Array.isArray(operations) || operations.length === 0) {
      res.status(400).json({ error: 'operations array é obrigatório' });
      return;
    }

    const confirmedIds: string[] = [];

    for (const op of operations) {
      try {
        await db
          .insert(schema.pendingOperation)
          .values({
            id: op.id,
            deviceId: op.deviceId || 'desktop',
            opType: op.opType,
            tableName: op.tableName,
            recordId: op.recordId,
            payload: op.payload,
            createdAt: new Date(op.createdAt),
            synced: true,
          })
          .onConflictDoNothing();

        confirmedIds.push(op.id);
      } catch {
        // Skip individual failures
      }
    }

    res.json({
      confirmed: confirmedIds,
      total: operations.length,
      success: confirmedIds.length,
    });
  } catch {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
