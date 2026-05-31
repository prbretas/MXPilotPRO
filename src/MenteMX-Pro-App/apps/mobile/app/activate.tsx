import { useState } from 'react';
import { View, Text, Image, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button } from '../src/components/Button';
import { Input } from '../src/components/Input';
import { colors, spacing, fonts } from '../src/constants/theme';
import { API_BASE_URL } from '../src/constants/api';
import { storeKey } from '../src/services/storageService';

/**
 * Keys de desenvolvimento válidas (aceitas offline)
 */
const DEV_KEYS = [
  'MXPR-ADMN-2024-TEST',
  'MXPR-DEV0-0000-0001',
];

/**
 * Formata a key automaticamente com hífens: MXPR-XXXX-XXXX-XXXX
 */
function formatKeyInput(text: string): string {
  const clean = text.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

  let formatted = clean;
  if (formatted.length > 4) {
    formatted = formatted.slice(0, 4) + '-' + formatted.slice(4);
  }
  if (formatted.length > 9) {
    formatted = formatted.slice(0, 9) + '-' + formatted.slice(9);
  }
  if (formatted.length > 14) {
    formatted = formatted.slice(0, 14) + '-' + formatted.slice(14);
  }

  return formatted.slice(0, 19);
}

export default function ActivateScreen() {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleKeyChange = (text: string) => {
    setError('');
    setKey(formatKeyInput(text));
  };

  const validateFormat = (): boolean => {
    if (key.length < 19) {
      setError('Key incompleta. Formato: MXPR-XXXX-XXXX-XXXX');
      return false;
    }
    return true;
  };

  const handleActivate = async () => {
    if (!validateFormat()) return;

    setLoading(true);
    setError('');

    // Verificar se é uma key de dev (funciona offline)
    if (DEV_KEYS.includes(key)) {
      await storeKey('license_key', key);
      Alert.alert(
        '✅ Ativado!',
        'MenteMX Pro ativado com sucesso. Faça login para continuar.',
        [{ text: 'OK', onPress: () => router.replace('/login') }]
      );
      setLoading(false);
      return;
    }

    // Tentar ativar via API
    try {
      const response = await fetch(`${API_BASE_URL}/api/keys/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: key,
          deviceId: 'mobile-' + Date.now(),
          deviceType: 'mobile',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Key inválida');
      }

      // Salvar key localmente
      await storeKey('license_key', key);

      Alert.alert(
        '✅ Ativado!',
        'MenteMX Pro ativado com sucesso. Faça login para continuar.',
        [{ text: 'OK', onPress: () => router.replace('/login') }]
      );
    } catch (err: any) {
      if (err.message === 'Network request failed') {
        setError('Sem internet. Use uma key de desenvolvimento para testar offline.');
      } else {
        setError(err.message || 'Erro ao ativar key');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Image
            source={require('../assets/logo-mentemx-oficial.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>Ative sua licença</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.instruction}>
            Insira a License Key que você recebeu após a compra:
          </Text>

          <Input
            label="License Key"
            value={key}
            onChangeText={handleKeyChange}
            placeholder="MXPR-XXXX-XXXX-XXXX"
            autoCapitalize="none"
            error={error}
          />

          <Text style={styles.hint}>
            Formato: MXPR-XXXX-XXXX-XXXX
          </Text>
        </View>

        <View style={styles.buttons}>
          <Button title="Ativar" onPress={handleActivate} loading={loading} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fonts.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  instruction: {
    fontSize: fonts.body,
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  hint: {
    fontSize: fonts.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  buttons: {
    gap: spacing.md,
  },
});
