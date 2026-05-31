import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { colors } from '../src/constants/theme';
import { getStoredKey } from '../src/services/storageService';

/**
 * Tela raiz — fluxo de redirecionamento:
 * 1. Se não ativou key → /activate (apenas na primeira vez)
 * 2. Se ativou mas não logou → /login
 * 3. Se logado → /home
 */
export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    checkActivation();
  }, []);

  const checkActivation = async () => {
    try {
      const key = await getStoredKey('license_key');
      setIsActivated(!!key);
    } catch {
      setIsActivated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.splash}>
        <Image
          source={require('../assets/logo-capacete.png')}
          style={styles.splashLogo}
          resizeMode="contain"
        />
        <ActivityIndicator color={colors.primary} size="large" style={styles.loader} />
      </View>
    );
  }

  // Se não ativou, vai para tela de ativação
  if (!isActivated) {
    return <Redirect href="/activate" />;
  }

  // Se já ativou, vai direto para login
  return <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashLogo: {
    width: 150,
    height: 150,
  },
  loader: {
    marginTop: 24,
  },
});
