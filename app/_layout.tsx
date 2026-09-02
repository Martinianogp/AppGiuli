// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import 'react-native-reanimated';

import { PerfilProvider, usePerfil } from '@/contexts/PerfilContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

function GuardianDeNavegacion() {
  const { perfil, cargando } = usePerfil();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (cargando) return;

    const enPantallaSeleccion = segments[0] === 'seleccionar-perfil';

    if (!perfil && !enPantallaSeleccion) {
      router.replace('/seleccionar-perfil');
    } else if (perfil && enPantallaSeleccion) {
      router.replace('/(tabs)');
    }
  }, [perfil, cargando, segments]);

  // Mientras AsyncStorage carga, mostramos una pantalla en blanco
  // para que Expo Router no muestre (tabs) antes de tiempo
  if (cargando) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFF5F7', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF85A1" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="seleccionar-perfil" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <PerfilProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <GuardianDeNavegacion />
        <StatusBar style="auto" />
      </ThemeProvider>
    </PerfilProvider>
  );
}