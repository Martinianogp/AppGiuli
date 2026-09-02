// app/seleccionar-perfil.tsx
import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { usePerfil, type Perfil } from '@/contexts/PerfilContext';

const PERFILES: { nombre: Perfil; emoji: string; color: string; colorSuave: string }[] = [
  { nombre: 'Marti', emoji: '👦', color: '#FF85A1', colorSuave: '#FFD6E0' },
  { nombre: 'Giuli', emoji: '👧', color: '#A78BFA', colorSuave: '#EDE9FE' },
];

export default function SeleccionarPerfilScreen() {
  const { seleccionarPerfil } = usePerfil();
  const [cargando, setCargando] = useState(false);
  const [seleccionado, setSeleccionado] = useState<Perfil | null>(null);

  const elegir = async (nombre: Perfil) => {
    setSeleccionado(nombre);
    setCargando(true);
    await seleccionarPerfil(nombre);
    // La navegación la maneja GuardianDeNavegacion automáticamente
  };

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <FontAwesome name="heart" size={40} color="#FF85A1" />
        <Text style={styles.titulo}>Nuestro Rinconcito</Text>
        <Text style={styles.subtitulo}>¿Quién sos?</Text>
      </View>

      {/* Botones de perfil */}
      <View style={styles.perfilesRow}>
        {PERFILES.map((p) => (
          <TouchableOpacity
            key={p.nombre}
            style={[
              styles.perfilCard,
              { borderColor: p.color, backgroundColor: p.colorSuave },
              seleccionado === p.nombre && { backgroundColor: p.color },
            ]}
            onPress={() => elegir(p.nombre)}
            disabled={cargando}
            activeOpacity={0.8}
          >
            {cargando && seleccionado === p.nombre ? (
              <ActivityIndicator size="large" color="white" />
            ) : (
              <>
                <Text style={styles.emoji}>{p.emoji}</Text>
                <Text
                  style={[
                    styles.perfilNombre,
                    { color: p.color },
                    seleccionado === p.nombre && { color: 'white' },
                  ]}
                >
                  {p.nombre}
                </Text>
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.nota}>¿Sabias que te amo mucho mucho mucho?</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  subtitulo: {
    fontSize: 18,
    color: '#999',
    marginTop: 8,
  },
  perfilesRow: {
    flexDirection: 'row',
    gap: 20,
  },
  perfilCard: {
    width: 130,
    height: 150,
    borderRadius: 24,
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  perfilNombre: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  nota: {
    marginTop: 40,
    fontSize: 13,
    color: '#bbb',
  },
});
