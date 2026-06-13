import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function PlanesScreen() {
  const [plan, setPlan] = useState('');
  const [pendientes, setPendientes] = useState<string[]>([]);
  const [hechos, setHechos] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [planABorrar, setPlanABorrar] = useState<{index: number, esPendiente: boolean} | null>(null);

  const agregarPlan = () => {
    if (plan.trim()) {
      setPendientes([plan, ...pendientes]);
      setPlan('');
    }
  };

  const confirmarBorrado = (index: number, esPendiente: boolean) => {
    setPlanABorrar({ index, esPendiente });
    setModalVisible(true);
  };

  const ejecutarBorrado = () => {
    if (planABorrar) {
      const { index, esPendiente } = planABorrar;
      if (esPendiente) {
        setPendientes(pendientes.filter((_, i) => i !== index));
      } else {
        setHechos(hechos.filter((_, i) => i !== index));
      }
    }
    setModalVisible(false);
  };

  const moverPlan = (index: number, esPendiente: boolean) => {
    if (esPendiente) {
      const p = pendientes[index];
      setHechos([p, ...hechos]);
      setPendientes(pendientes.filter((_, i) => i !== index));
    } else {
      const h = hechos[index];
      setPendientes([h, ...pendientes]);
      setHechos(hechos.filter((_, i) => i !== index));
    }
  };

  const renderPlan = (item: string, index: number, esPendiente: boolean) => (
    <View style={styles.planCard}>
      <Text style={[styles.planText, !esPendiente && styles.hechoText]}>{item}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => moverPlan(index, esPendiente)} style={styles.actionBtn}>
          <Text style={{fontSize: 18}}>{esPendiente ? '✔️' : '❌'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmarBorrado(index, esPendiente)} style={styles.actionBtn}>
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
        renderItem={({ item, index }) => renderPlan(item, index, true)}
        keyExtractor={(_, index) => 'p' + index}
      />

      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Planes ya hechos ✅</Text>
      <FlatList 
        data={hechos}
        renderItem={({ item, index }) => renderPlan(item, index, false)}
        keyExtractor={(_, index) => 'h' + index}
      />

      {/* Modal de Confirmación */}
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
    width: 100, // <--- ESTO ES LA CLAVE: fijamos un ancho igual para ambos
    alignItems: 'center', // <--- Esto centra el texto adentro
  },
  btnNo: { backgroundColor: '#FF85A1' },
  btnSi: { backgroundColor: '#FF85A1' }
});