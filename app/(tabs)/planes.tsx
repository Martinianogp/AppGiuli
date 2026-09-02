// app/(tabs)/planes.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { usePerfil } from '@/contexts/PerfilContext';
import { escucharPlanes, crearPlan, borrarPlan, moverPlan, type Plan } from '@/services/planes';

export default function PlanesScreen() {
  const { perfil } = usePerfil();
  const [plan, setPlan] = useState('');
  const [todosLosPlanes, setTodosLosPlanes] = useState<Plan[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [planABorrar, setPlanABorrar] = useState<string | null>(null);

  useEffect(() => {
    const cancelar = escucharPlanes(setTodosLosPlanes);
    return cancelar;
  }, []);

  const pendientes = todosLosPlanes.filter((p) => !p.hecho);
  const hechos = todosLosPlanes.filter((p) => p.hecho);

  const agregarPlan = () => {
    if (plan.trim() && perfil) {
      crearPlan(plan.trim(), perfil);
      setPlan('');
    }
  };

  const confirmarBorrado = (id: string) => {
    setPlanABorrar(id);
    setModalVisible(true);
  };

  const ejecutarBorrado = () => {
    if (planABorrar) {
      borrarPlan(planABorrar);
    }
    setModalVisible(false);
  };

  const renderPlan = (item: Plan) => (
    <View style={styles.planCard}>
      <Text style={[styles.planText, item.hecho && styles.hechoText]}>{item.texto}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => moverPlan(item.id, item.hecho)} style={styles.actionBtn}>
          <Text style={{fontSize: 18}}>{!item.hecho ? '✔️' : '❌'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmarBorrado(item.id)} style={styles.actionBtn}>
          <Text style={{fontSize: 18}}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nuestros Planes 📋</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="¿Que te gustaria hacer?"
          value={plan}
          onChangeText={setPlan}
        />
        <TouchableOpacity style={styles.addButton} onPress={agregarPlan}>
          <FontAwesome name="plus" size={16} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Nuestra lista de planes</Text>
      <FlatList
        data={pendientes}
        renderItem={({ item }) => renderPlan(item)}
        keyExtractor={(item) => item.id}
      />

      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Planes ya hechos ✅</Text>
      <FlatList
        data={hechos}
        renderItem={({ item }) => renderPlan(item)}
        keyExtractor={(item) => item.id}
      />

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>¿Querés borrar este plan?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.btn, styles.btnNo]}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={ejecutarBorrado} style={[styles.btn, styles.btnSi]}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>Sí</Text>
              </TouchableOpacity>
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
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, backgroundColor: 'white', padding: 12, borderRadius: 12, marginRight: 10 },
  addButton: { backgroundColor: '#FF85A1', width: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#666', marginBottom: 10 },
  planCard: { backgroundColor: 'white', padding: 12, borderRadius: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  planText: { fontSize: 14, flex: 1 },
  hechoText: { textDecorationLine: 'line-through', color: '#888' },
  buttonContainer: { flexDirection: 'row' },
  actionBtn: { padding: 5, marginLeft: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', padding: 25, borderRadius: 20, alignItems: 'center', width: '80%' },
  modalText: { fontSize: 18, marginBottom: 20, color: '#333' },
  modalButtons: { flexDirection: 'row', gap: 20 },
  btn: {
    paddingVertical: 10,
    borderRadius: 10,
    width: 100,
    alignItems: 'center',
  },
  btnNo: { backgroundColor: '#FF85A1' },
  btnSi: { backgroundColor: '#FF85A1' }
});