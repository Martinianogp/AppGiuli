import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AmorScreen() {
  const [besitosHoy, setBesitosHoy] = useState(0);
  const [recordBesitos, setRecordBesitos] = useState(0);
  const [miEstado, setMiEstado] = useState('Aún no dice');
  const [diaActual, setDiaActual] = useState(new Date().getDate());
  const [tiempoJuntos, setTiempoJuntos] = useState({ meses: 0, dias: 0, horas: 0 });

  // Lógica del contador de días y meses (19 de Mayo 2026)
  useEffect(() => {
    const calcularTiempo = () => {
      const inicio = new Date('2026-05-19T00:00:00');
      const ahora = new Date();
      
      let meses = (ahora.getFullYear() - inicio.getFullYear()) * 12 + (ahora.getMonth() - inicio.getMonth());
      let dias = ahora.getDate() - inicio.getDate();
      
      // Ajuste si no llegamos al día 19 del mes actual
      if (dias < 0) {
        meses--;
        const mesAnterior = new Date(ahora.getFullYear(), ahora.getMonth(), 0);
        dias += mesAnterior.getDate();
      }

      const horas = ahora.getHours(); // O si prefieres las horas transcurridas desde las 00hs
      
      setTiempoJuntos({ meses, dias, horas });
    };

    calcularTiempo();
    const interval = setInterval(calcularTiempo, 60000);
    return () => clearInterval(interval);
  }, []);

  // Lógica de reinicio diario
  useEffect(() => {
    const interval = setInterval(() => {
      const ahora = new Date();
      if (ahora.getDate() !== diaActual) {
        if (besitosHoy > recordBesitos) setRecordBesitos(besitosHoy);
        setBesitosHoy(0);
        setDiaActual(ahora.getDate());
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [besitosHoy, diaActual, recordBesitos]);

  const enviarBesito = () => {
    const nuevoTotal = besitosHoy + 1;
    setBesitosHoy(nuevoTotal);
    if (nuevoTotal > recordBesitos) setRecordBesitos(nuevoTotal);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nuestro Rinconcito ✨</Text>
        <Text style={styles.subtitle}>Te amo mucho mucho muchoo ❤️</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>MANDAR UN BESITO</Text>
        <TouchableOpacity style={styles.heartCircle} onPress={enviarBesito}>
          <FontAwesome name="heart" size={60} color="white" />
        </TouchableOpacity>
        <Text style={styles.count}>{besitosHoy}</Text>
        <Text style={styles.countLabel}>Besos enviados hoy</Text>
        <View style={styles.recordContainer}>
          <Text style={styles.recordLabel}>Record de besitos: </Text>
          <Text style={styles.recordValue}>{recordBesitos}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>¿CÓMO ESTAMOS HOY?</Text>
        <View style={styles.statusRow}>
          <View style={styles.avatar}><Text style={{fontSize: 24}}>👦</Text></View>
          <View><Text style={styles.statusName}>Marti</Text><Text style={styles.statusText}>{miEstado}</Text></View>
        </View>
        
        {/* Espacio extra solicitado */}
        <View style={{ height: 20 }} />

        <View style={styles.statusRow}>
          <View style={styles.avatar}><Text style={{fontSize: 24}}>👧</Text></View>
          <View><Text style={styles.statusName}>Giuli</Text><Text style={styles.statusText}>Aún no dice</Text></View>
        </View>
        
        <Text style={styles.changeStatusLabel}>Cambiar mi estado:</Text>
        <View style={styles.emojiRow}>
          {['🥰', '😋', '😢', '😴', '😍', '🍟'].map((e) => (
            <TouchableOpacity key={e} onPress={() => setMiEstado(e)}>
              <Text style={{fontSize: 28}}>{e}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Contador de tiempo mejorado */}
      <View style={{ alignItems: 'center', marginVertical: 30 }}>
        <Text style={{ color: '#999', fontSize: 16 }}>Juntos hace:</Text>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#E11D48', marginTop: 5, textAlign: 'center' }}>
          {tiempoJuntos.meses > 0 ? `${tiempoJuntos.meses} mes${tiempoJuntos.meses > 1 ? 'es' : ''}, ` : ''}
          {tiempoJuntos.dias > 0 ? `${tiempoJuntos.dias} día${tiempoJuntos.dias > 1 ? 's' : ''} y ` : ''}
          {tiempoJuntos.horas} {tiempoJuntos.horas === 1 ? 'hora' : 'horas'}
        </Text>
      </View>
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
  emojiRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }
});