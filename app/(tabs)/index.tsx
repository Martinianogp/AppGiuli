// app/(tabs)/index.tsx
import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { usePerfil } from '@/contexts/PerfilContext';
import { enviarBesito, escucharBesitosDeHoy, escucharRecords, type BesitosDelDia, type Records } from '@/services/besitos';
import { actualizarMiEstado, escucharEstados, type Estados } from '@/services/estados';


export default function AmorScreen() {
  const { perfil, cambiarPerfil } = usePerfil();
  const [besitos, setBesitos] = useState<BesitosDelDia>({ Marti: 0, Giuli: 0 });
  const [records, setRecords] = useState<Records>({ Marti: 0, Giuli: 0 });
  const [estados, setEstados] = useState<Estados>({ Marti: 'Aún no dice', Giuli: 'Aún no dice' });
  const [tiempoJuntos, setTiempoJuntos] = useState({ meses: 0, dias: 0, horas: 0 });

  useEffect(() => {
    const cancelarBesitos = escucharBesitosDeHoy(setBesitos);
    const cancelarRecords = escucharRecords(setRecords);
    const cancelarEstados = escucharEstados(setEstados);
    return () => {
      cancelarBesitos();
      cancelarRecords();
      cancelarEstados();
    };
  }, []);

  useEffect(() => {
    const calcularTiempo = () => {
      const inicio = new Date('2026-05-19T00:00:00');
      const ahora = new Date();

      let meses = (ahora.getFullYear() - inicio.getFullYear()) * 12 + (ahora.getMonth() - inicio.getMonth());
      let dias = ahora.getDate() - inicio.getDate();

      if (dias < 0) {
        meses--;
        const mesAnterior = new Date(ahora.getFullYear(), ahora.getMonth(), 0);
        dias += mesAnterior.getDate();
      }

      const horas = ahora.getHours();
      setTiempoJuntos({ meses, dias, horas });
    };

    calcularTiempo();
    const interval = setInterval(calcularTiempo, 60000);
    return () => clearInterval(interval);
  }, []);

  const enviarBesitoClick = () => {
    if (!perfil) return;
    enviarBesito(perfil);
  };

  const elegirEstado = (emoji: string) => {
    if (!perfil) return;
    actualizarMiEstado(perfil, emoji);
  };

  if (!perfil) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nuestro Rinconcito ✨</Text>
        <Text style={styles.subtitle}>Te amo mucho mucho muchoo ❤️</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>MANDAR UN BESITO</Text>
        <TouchableOpacity style={styles.heartCircle} onPress={enviarBesitoClick}>
          <FontAwesome name="heart" size={60} color="white" />
        </TouchableOpacity>
        <Text style={styles.count}>{besitos.Marti + besitos.Giuli}</Text>
        <Text style={styles.countLabel}>Besos enviados hoy entre los dos 💕</Text>
        <View style={styles.recordContainer}>
          <Text style={styles.recordLabel}>Record Marti: </Text>
          <Text style={styles.recordValue}>{records.Marti}</Text>
        </View>
        <View style={styles.recordContainer}>
          <Text style={styles.recordLabel}>Record Giuli: </Text>
          <Text style={styles.recordValue}>{records.Giuli}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>¿CÓMO ESTAMOS HOY?</Text>
        <View style={styles.statusRow}>
          <View style={styles.avatar}><Text style={{fontSize: 24}}>👦</Text></View>
          <View><Text style={styles.statusName}>Marti</Text><Text style={styles.statusText}>{estados.Marti}</Text></View>
        </View>

        <View style={{ height: 20 }} />

        <View style={styles.statusRow}>
          <View style={styles.avatar}><Text style={{fontSize: 24}}>👧</Text></View>
          <View><Text style={styles.statusName}>Giuli</Text><Text style={styles.statusText}>{estados.Giuli}</Text></View>
        </View>

        <Text style={styles.changeStatusLabel}>Cambiar mi estado:</Text>
        <View style={styles.emojiRow}>
          {['🥰', '😋', '😢', '😴', '😍', '🍟'].map((e) => (
            <TouchableOpacity key={e} onPress={() => elegirEstado(e)}>
              <Text style={{fontSize: 28}}>{e}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ alignItems: 'center', marginVertical: 30 }}>
        <Text style={{ color: '#999', fontSize: 16 }}>Juntos hace:</Text>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#E11D48', marginTop: 5, textAlign: 'center' }}>
          {tiempoJuntos.meses > 0 ? `${tiempoJuntos.meses} mes${tiempoJuntos.meses > 1 ? 'es' : ''}, ` : ''}
          {tiempoJuntos.dias > 0 ? `${tiempoJuntos.dias} día${tiempoJuntos.dias > 1 ? 's' : ''} y ` : ''}
          {tiempoJuntos.horas} {tiempoJuntos.horas === 1 ? 'hora' : 'horas'}
        </Text>
      </View>

      {/* Botón para cambiar de perfil */}
      <TouchableOpacity onPress={cambiarPerfil} style={styles.cambiarPerfilBtn}>
        <Text style={styles.cambiarPerfilText}>Cambiar perfil</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7', padding: 20 },
  header: { marginTop: 40, marginBottom: 30 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 16, color: '#666' },
  card: { backgroundColor: 'white', borderRadius: 25, padding: 25, marginBottom: 20, elevation: 3 },
  cardLabel: { fontSize: 12, fontWeight: 'bold', color: '#999', marginBottom: 15 },
  heartCircle: { backgroundColor: '#FF85A1', width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' },
  count: { fontSize: 40, fontWeight: 'bold', textAlign: 'center', marginTop: 10 },
  countLabel: { fontSize: 14, color: '#999', textAlign: 'center' },
  recordContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  recordLabel: { fontSize: 14, color: '#999' },
  recordValue: { fontSize: 14, fontWeight: 'bold', color: '#E11D48' },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { backgroundColor: '#FFF0F3', width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  statusName: { fontSize: 12, color: '#999' },
  statusText: { fontSize: 16 },
  changeStatusLabel: { fontSize: 12, color: '#999', textAlign: 'center', marginTop: 20 },
  emojiRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  cambiarPerfilBtn: { alignItems: 'center', padding: 10, marginBottom: 30 },
  cambiarPerfilText: { color: '#ccc', fontSize: 12 },
});