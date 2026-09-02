// services/besitos.ts
import { doc, onSnapshot, setDoc, increment, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import type { Perfil } from '@/contexts/PerfilContext';

function fechaDeHoy(): string {
  const ahora = new Date();
  const año = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia}`;
}

export interface BesitosDelDia {
  Marti: number;
  Giuli: number;
}

export interface Records {
  Marti: number;
  Giuli: number;
}

// Escucha los besitos del día de hoy en tiempo real
export function escucharBesitosDeHoy(callback: (besitos: BesitosDelDia) => void): () => void {
  const ref = doc(db, 'besitos', fechaDeHoy());
  return onSnapshot(ref, (snapshot) => {
    const data = snapshot.data();
    callback({ Marti: data?.Marti ?? 0, Giuli: data?.Giuli ?? 0 });
  });
}

// Escucha los récords históricos de ambos en tiempo real
export function escucharRecords(callback: (records: Records) => void): () => void {
  const ref = doc(db, 'meta', 'records');
  return onSnapshot(ref, (snapshot) => {
    const data = snapshot.data();
    callback({ Marti: data?.Marti ?? 0, Giuli: data?.Giuli ?? 0 });
  });
}

// Suma un besito de `perfil` para hoy, y si supera su récord histórico, lo actualiza
export async function enviarBesito(perfil: Perfil): Promise<void> {
  const refHoy = doc(db, 'besitos', fechaDeHoy());
  await setDoc(
    refHoy,
    { [perfil]: increment(1), ultimaActualizacion: serverTimestamp() },
    { merge: true }
  );

  // Leemos el nuevo total de hoy para comparar contra el récord
  const snapHoy = await getDoc(refHoy);
  const totalHoy = snapHoy.data()?.[perfil] ?? 0;

  const refRecords = doc(db, 'meta', 'records');
  const snapRecords = await getDoc(refRecords);
  const recordActual = snapRecords.data()?.[perfil] ?? 0;

  if (totalHoy > recordActual) {
    await setDoc(refRecords, { [perfil]: totalHoy }, { merge: true });
  }
}