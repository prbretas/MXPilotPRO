import { Router } from 'express';
import { generateKeySchema, activateKeySchema } from './licensing.schema.js';
import { generateLicenseKey, isValidKeyFormat } from './licensing.service.js';
import { saveKey, findKey, updateKey, listKeys, revokeKey, checkRateLimit } from './licensing.store.js';
import { authMiddleware, type AuthenticatedRequest } from '../auth/auth.middleware.js';

const router = Router();

/**
 * POST /api/keys/generate
 * Gera uma nova License Key (admin)
 */
router.post('/generate', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const input = generateKeySchema.parse(req.body);
    const code = generateLicenseKey();
    const now = new Date().toISOString();

    let expiresAt: string | null = null;
    if (input.expiresInDays) {
      expiresAt = new Date(Date.now() + input.expiresInDays * 86400000).toISOString();
    }

    saveKey({
      code,
      status: 'inactive',
      plan: input.plan,
      userId: null,
      mobileDeviceId: null,
      desktopDeviceId: null,
      createdAt: now,
      activatedAt: null,
      expiresAt,
    });

    res.status(201).json({ code, plan: input.plan, status: 'inactive', createdAt: now, expiresAt });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * POST /api/keys/activate
 * Ativa key e vincula ao device (1 mobile + 1 desktop)
 */
router.post('/activate', (req, res) => {
  // Rate limiting
  const ip = req.ip || 'unknown';
  if (!checkRateLimit(ip)) {
    res.status(429).json({ error: 'Muitas tentativas. Aguarde 1 minuto.' });
    return;
  }

  try {
    const input = activateKeySchema.parse(req.body);
    const key = findKey(input.code);

    if (!key) {
      res.status(404).json({ error: 'Key não encontrada' });
      return;
    }

    if (key.status === 'revoked') {
      res.status(403).json({ error: 'Key revogada' });
      return;
    }

    if (key.status === 'expired' || (key.expiresAt && new Date(key.expiresAt) < new Date())) {
      res.status(403).json({ error: 'Key expirada' });
      return;
    }

    // Verificar limite de devices
    if (input.deviceType === 'mobile' && key.mobileDeviceId && key.mobileDeviceId !== input.deviceId) {
      res.status(409).json({ error: 'Key já vinculada a outro dispositivo mobile' });
      return;
    }
    if (input.deviceType === 'desktop' && key.desktopDeviceId && key.desktopDeviceId !== input.deviceId) {
      res.status(409).json({ error: 'Key já vinculada a outro dispositivo desktop' });
      return;
    }

    // Ativar e vincular
    const updates: any = { status: 'active', activatedAt: new Date().toISOString() };
    if (input.deviceType === 'mobile') updates.mobileDeviceId = input.deviceId;
    if (input.deviceType === 'desktop') updates.desktopDeviceId = input.deviceId;

    const updated = updateKey(input.code, updates);

    res.json({
      code: input.code,
      status: 'active',
      deviceType: input.deviceType,
      activatedAt: updated?.activatedAt,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * GET /api/keys/validate?code=MXPRO-XXXX-XXXX-XXXX
 * Valida status de uma key
 */
router.get('/validate', (req, res) => {
  const { code } = req.query;
  if (!code || typeof code !== 'string') {
    res.status(400).json({ error: 'Parâmetro code é obrigatório' });
    return;
  }

  if (!isValidKeyFormat(code)) {
    res.status(400).json({ error: 'Formato de key inválido' });
    return;
  }

  const key = findKey(code);
  if (!key) {
    res.status(404).json({ error: 'Key não encontrada' });
    return;
  }

  // Verificar expiração
  if (key.expiresAt && new Date(key.expiresAt) < new Date()) {
    res.json({ code, status: 'expired', plan: key.plan });
    return;
  }

  res.json({ code, status: key.status, plan: key.plan });
});

/**
 * POST /api/keys/revoke
 * Revoga uma key (admin)
 */
router.post('/revoke', authMiddleware, (req: AuthenticatedRequest, res) => {
  const { code } = req.body;
  if (!code) {
    res.status(400).json({ error: 'code é obrigatório' });
    return;
  }

  const success = revokeKey(code);
  if (!success) {
    res.status(404).json({ error: 'Key não encontrada' });
    return;
  }

  res.json({ code, status: 'revoked' });
});

/**
 * GET /api/keys
 * Lista todas as keys (admin)
 */
router.get('/', authMiddleware, (_req, res) => {
  res.json(listKeys());
});

export default router;
