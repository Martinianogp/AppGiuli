// app/(tabs)/notitas.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Modal } from 'react-native';

import { usePerfil } from '@/contexts/PerfilContext';
import { escucharNotitas, crearNotita, borrarNotita, toggleFavoritaNotita, type Notita } from '@/services/notitas';

const COLORES_PASTELES = ['#FFF9C4', '#B3E5FC', '#C8E6C9', '#F8BBD0', '#E1BEE7', '#BBDEFB', '#D1C4E9', '#FFFFFF'];

export default function NotitasScreen() {
  const { perfil } = usePerfil();
  const [nota, setNota] = useState('');
  const [colorSeleccionado, setColorSeleccionado] = useState('#FFF9C4');
  const [listaNotitas, setListaNotitas] = useState<Notita[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [notaAAccion, setNotaAAccion] = useState<{id: string, tipo: 'borrar' | 'desfavoritar'} | null>(null);

  useEffect(() => {
    const cancelar = escucharNotitas(setListaNotitas);
    return cancelar;
  }, []);

  const agregarNota = () => {
    if (nota.trim() && perfil) {
      crearNotita(nota.trim(), colorSeleccionado, perfil);
      setNota('');
    }
  };

  const toggleFavorito = (id: string, favoritaActual: boolean) => {
    toggleFavoritaNotita(id, favoritaActual);
  };

  const confirmarAccion = (id: string, tipo: 'borrar' | 'desfavoritar') => {
    setNotaAAccion({ id, tipo });
    setModalVisible(true);
  };

  const ejecutarAccion = () => {
    if (notaAAccion) {
      if (notaAAccion.tipo === 'borrar') {
        borrarNotita(notaAAccion.id);
      } else {
        toggleFavoritaNotita(notaAAccion.id, true);
      }
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notitas para nosotros 💬</Text>

      <View style={styles.colorRow}>
        {COLORES_PASTELES.map((c) => (
          <TouchableOpacity key={c} onPress={() => setColorSeleccionado(c)} style={[styles.colorCircle, {backgroundColor: c, borderWidth: colorSeleccionado === c ? 2 : 0, borderColor: '#555'}]} />
        ))}
      </View>

      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Escribe algo lindo..." value={nota} onChangeText={setNota} />
        <TouchableOpacity style={styles.addButton} onPress={agregarNota}><Text style={styles.addButtonText}>+</Text></TouchableOpacity>
      </View>

      <FlatList
        data={listaNotitas}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.notaCard, { backgroundColor: item.color }]}>
            <Text style={styles.notaText}>{item.texto}</Text>
            <Text style={styles.autorText}>{item.autor}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => item.favorita ? confirmarAccion(item.id, 'desfavoritar') : toggleFavorito(item.id, item.favorita)}>
                <Text style={styles.actionIcon}>{item.favorita ? '💖' : '🩶'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => confirmarAccion(item.id, 'borrar')}>
                <Text style={styles.actionIcon}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{notaAAccion?.tipo === 'borrar' ? '¿Borrar nota?' : '¿Quitar de favoritas?'}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.btn, styles.btnNo]}><Text style={styles.btnText}>No</Text></TouchableOpacity>
              <TouchableOpacity onPress={ejecutarAccion} style={[styles.btn, styles.btnSi]}><Text style={styles.btnText}>Sí</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7', padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#E11D48', marginBottom: 20 },
  colorRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  colorCircle: { width: 30, height: 30, borderRadius: 15 },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, backgroundColor: 'white', padding: 12, borderRadius: 12, marginRight: 10 },
  addButton: { backgroundColor: '#FF85A1', width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  addButtonText: { color: 'white', fontSize: 24, fontWeight: 'bold' },

  notaCard: { flex: 1, margin: 5, padding: 10, borderRadius: 12, minHeight: 80, justifyContent: 'space-between' },
  notaText: { fontSize: 15, color: '#333', fontWeight: '600' },
  autorText: { fontSize: 10, color: '#888', marginTop: 5 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 5 },
  actionIcon: { fontSize: 18, marginLeft: 8 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', padding: 25, borderRadius: 20, alignItems: 'center', width: '80%' },
  modalText: { fontSize: 18, marginBottom: 20, color: '#333' },
  modalButtons: { flexDirection: 'row', gap: 20 },
  btn: { paddingVertical: 10, borderRadius: 10, width: 100, alignItems: 'center' },
  btnNo: { backgroundColor: '#FF85A1' },
  btnSi: { backgroundColor: '#FF85A1' },
  btnText: { color: 'white', fontWeight: 'bold' }
});