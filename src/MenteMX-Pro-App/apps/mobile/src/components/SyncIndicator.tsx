import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../constants/theme';
import { onStatusChange, getStatus, getPendingCount, type SyncStatus } from '../services/offlineQueue';

const statusConfig: Record<SyncStatus, { icon: string; label: string; color: string }> = {
  offline: { icon: '☁️✕', label: 'Offline', color: colors.warning },
  syncing: { icon: '🔄', label: 'Sincronizando...', color: colors.primary },
  synced: { icon: '☁️✓', label: 'Sincronizado', color: colors.success },
  error: { icon: '⚠️', label: 'Erro de sync', color: colors.error },
};

export function SyncIndicator() {
  const [status, setStatus] = useState<SyncStatus>(getStatus());
  const [pending, setPending] = useState(getPendingCount());

  useEffect(() => {
    const unsubscribe = onStatusChange((newStatus) => {
      setStatus(newStatus);
      setPending(getPendingCount());
    });
    return unsubscribe;
  }, []);

  // Não mostrar quando está tudo sincronizado
  if (status === 'synced' && pending === 0) return null;

  const config = statusConfig[status];

  return (
    <View style={[styles.container, { borderColor: config.color }]}>
      <Text style={styles.icon}>{config.icon}</Text>
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
      {pending > 0 && (
        <Text style={styles.count}>({pending} pendente{pending > 1 ? 's' : ''})</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    gap: spacing.xs,
  },
  icon: {
    fontSize: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  count: {
    fontSize: 11,
    color: colors.textMuted,
  },
});
