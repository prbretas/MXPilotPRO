import { Router } from 'express';
import { authMiddleware, type AuthenticatedRequest } from '../auth/auth.middleware.js';
import { listKeys, findKey, updateKey, revokeKey, saveKey } from './licensing.store.js';
import { generateLicenseKey } from './licensing.service.js';

const router = Router();

/**
 * GET /api/admin/keys/dashboard
 * Métricas do painel admin
 */
router.get('/dashboard', authMiddleware, (_req, res) => {
  const allKeys = listKeys();
  const metrics = {
    total: allKeys.length,
    active: allKeys.filter(k => k.status === 'active').length,
    inactive: allKeys.filter(k => k.status === 'inactive').length,
    expired: allKeys.filter(k => k.status === 'expired').length,
    revoked: allKeys.filter(k => k.status === 'revoked').length,
  };
  res.json(metrics);
});

/**
 * GET /api/admin/keys
 * Lista todas as keys com filtros
 */
router.get('/', authMiddleware, (req: AuthenticatedRequest, res) => {
  let keys = listKeys();
  const { status, plan } = req.query;

  if (status && typeof status === 'string') {
    keys = keys.filter(k => k.status === status);
  }
  if (plan && typeof plan === 'string') {
    keys = keys.filter(k => k.plan === plan);
  }

  res.json({ keys, total: keys.length });
});

/**
 * POST /api/admin/keys/generate-batch
 * Gera múltiplas keys de uma vez
 */
router.post('/generate-batch', authMiddleware, (req: AuthenticatedRequest, res) => {
  const { count = 1, plan = 'one-time', expiresInDays } = req.body;
  const qty = Math.min(Math.max(1, count), 50); // max 50 por vez

  const generated: string[] = [];
  const now = new Date().toISOString();
  const expiresAt = expiresInDays
    ? new Date(Date.now() + expiresInDays * 86400000).toISOString()
    : null;

  for (let i = 0; i < qty; i++) {
    const code = generateLicenseKey();
    saveKey({
      code,
      status: 'inactive',
      plan,
      userId: null,
      mobileDeviceId: null,
      desktopDeviceId: null,
      createdAt: now,
      activatedAt: null,
      expiresAt,
    });
    generated.push(code);
  }

  res.status(201).json({ generated, count: generated.length });
});

/**
 * POST /api/admin/keys/:code/extend
 * Estende validade de uma key
 */
router.post('/:code/extend', authMiddleware, (req: AuthenticatedRequest, res) => {
  const { code } = req.params;
  const { days } = req.body;

  if (!days || days < 1) {
    res.status(400).json({ error: 'days deve ser >= 1' });
    return;
  }

  const key = findKey(code);
  if (!key) {
    res.status(404).json({ error: 'Key não encontrada' });
    return;
  }

  const baseDate = key.expiresAt ? new Date(key.expiresAt) : new Date();
  const newExpires = new Date(baseDate.getTime() + days * 86400000).toISOString();

  updateKey(code, { expiresAt: newExpires, status: 'active' });
  res.json({ code, expiresAt: newExpires });
});

/**
 * GET /api/admin/keys/export
 * Exporta keys em formato CSV
 */
router.get('/export', authMiddleware, (_req, res) => {
  const keys = listKeys();
  const csv = [
    'code,status,plan,mobileDeviceId,desktopDeviceId,createdAt,activatedAt,expiresAt',
    ...keys.map(k =>
      `${k.code},${k.status},${k.plan},${k.mobileDeviceId || ''},${k.desktopDeviceId || ''},${k.createdAt},${k.activatedAt || ''},${k.expiresAt || ''}`
    ),
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=license-keys.csv');
  res.send(csv);
});

export default router;
