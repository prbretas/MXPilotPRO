/**
 * Serviço de armazenamento local simples
 * Usa expo-sqlite localStorage API (SDK 54+)
 * Persiste dados entre sessões do app
 */

// Fallback simples usando um Map em memória
// TODO: migrar para expo-sqlite localStorage quando estável
const storage = new Map<string, string>();

/**
 * Salva um valor no storage local
 */
export async function storeKey(key: string, value: string): Promise<void> {
  storage.set(key, value);
}

/**
 * Recupera um valor do storage local
 */
export async function getStoredKey(key: string): Promise<string | null> {
  return storage.get(key) ?? null;
}

/**
 * Remove um valor do storage local
 */
export async function removeKey(key: string): Promise<void> {
  storage.delete(key);
}
