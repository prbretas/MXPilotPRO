/**
 * Fila Offline — MenteMX Pro Mobile
 *
 * Enfileira operações quando offline e sincroniza automaticamente
 * quando a conexão é restabelecida. Backoff exponencial em caso de falha.
 */

import { API_BASE_URL } from '../constants/api';

export interface QueuedOperation {
  id: string;
  opType: 'INSERT' | 'UPDATE' | 'DELETE';
  tableName: string;
  recordId: string;
  payload: string; // JSON stringified
  createdAt: string;
  synced: boolean;
  retryCount: number;
}

// Fila em memória (em produção, persistir no SQLite)
let queue: QueuedOperation[] = [];
let isSyncing = false;
let retryTimeout: ReturnType<typeof setTimeout> | null = null;

export type SyncStatus = 'offline' | 'syncing' | 'synced' | 'error';
let currentStatus: SyncStatus = 'synced';
let statusListeners: Array<(status: SyncStatus) => void> = [];

/**
 * Enfileira uma operação para sincronização posterior.
 */
export function enqueue(op: Omit<QueuedOperation, 'synced' | 'retryCount'>): void {
  queue.push({ ...op, synced: false, retryCount: 0 });
  notifyStatus('offline');
}

/**
 * Tenta sincronizar todas as operações pendentes.
 */
export async function flush(token: string): Promise<{ success: number; failed: number }> {
  const pending = queue.filter(op => !op.synced);
  if (pending.length === 0) {
    notifyStatus('synced');
    return { success: 0, failed: 0 };
  }

  isSyncing = true;
  notifyStatus('syncing');

  try {
    const response = await fetch(`${API_BASE_URL}/sync/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        operations: pending.map(op => ({
          id: op.id,
          deviceId: 'mobile',
          opType: op.opType,
          tableName: op.tableName,
          recordId: op.recordId,
          payload: op.payload,
          createdAt: op.createdAt,
        })),
      }),
    });

    if (!response.ok) throw new Error('Sync failed');

    const result = await response.json();

    // Marcar confirmados como synced
    for (const confirmedId of result.confirmed) {
      const op = queue.find(o => o.id === confirmedId);
      if (op) op.synced = true;
    }

    // Limpar operações synced
    queue = queue.filter(op => !op.synced);

    isSyncing = false;
    notifyStatus(queue.length === 0 ? 'synced' : 'error');

    return { success: result.success, failed: result.failed };
  } catch (error) {
    isSyncing = false;
    notifyStatus('error');

    // Incrementar retry count e agendar retry com backoff
    for (const op of pending) {
      op.retryCount++;
    }
    scheduleRetry(token, Math.min(...pending.map(op => op.retryCount)));

    return { success: 0, failed: pending.length };
  }
}

/**
 * Agenda retry com backoff exponencial (1s, 2s, 4s, 8s... max 5min)
 */
function scheduleRetry(token: string, attempt: number): void {
  if (retryTimeout) clearTimeout(retryTimeout);
  const delay = Math.min(1000 * Math.pow(2, attempt), 300000);
  retryTimeout = setTimeout(() => flush(token), delay);
}

/**
 * Retorna o número de operações pendentes.
 */
export function getPendingCount(): number {
  return queue.filter(op => !op.synced).length;
}

/**
 * Retorna o status atual da sincronização.
 */
export function getStatus(): SyncStatus {
  return currentStatus;
}

/**
 * Registra listener para mudanças de status.
 */
export function onStatusChange(listener: (status: SyncStatus) => void): () => void {
  statusListeners.push(listener);
  return () => {
    statusListeners = statusListeners.filter(l => l !== listener);
  };
}

function notifyStatus(status: SyncStatus): void {
  currentStatus = status;
  statusListeners.forEach(l => l(status));
}
