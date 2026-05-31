/**
 * Store de License Keys — MenteMX Pro
 * Em produção, usar tabela dedicada no PostgreSQL.
 * Para o MVP, store em memória com interface pronta para migrar.
 */

export interface LicenseKey {
  code: string;
  status: 'inactive' | 'active' | 'expired' | 'revoked';
  plan: 'one-time' | 'monthly' | 'yearly';
  userId: string | null;
  mobileDeviceId: string | null;
  desktopDeviceId: string | null;
  createdAt: string;
  activatedAt: string | null;
  expiresAt: string | null;
}

// Store em memória (MVP)
const keys: Map<string, LicenseKey> = new Map();

export function saveKey(key: LicenseKey): void {
  keys.set(key.code, key);
}

export function findKey(code: string): LicenseKey | undefined {
  return keys.get(code);
}

export function updateKey(code: string, updates: Partial<LicenseKey>): LicenseKey | undefined {
  const existing = keys.get(code);
  if (!existing) return undefined;
  const updated = { ...existing, ...updates };
  keys.set(code, updated);
  return updated;
}

export function listKeys(): LicenseKey[] {
  return Array.from(keys.values());
}

export function revokeKey(code: string): boolean {
  const key = keys.get(code);
  if (!key) return false;
  key.status = 'revoked';
  return true;
}

// Rate limiting em memória
const attempts: Map<string, { count: number; resetAt: number }> = new Map();

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);

  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + 60000 }); // 1 minuto
    return true;
  }

  if (entry.count >= 5) return false; // max 5 tentativas/minuto
  entry.count++;
  return true;
}
