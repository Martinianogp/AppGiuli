// services/estados.ts
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import type { Perfil } from '@/contexts/PerfilContext';

export interface Estados {
  Marti: string;
  Giuli: string;
}

const ESTADO_POR_DEFECTO = 'Aún no dice';

export function escucharEstados(callback: (estados: Estados) => void): () => void {
  const ref = doc(db, 'meta', 'estados');
  return onSnapshot(ref, (snapshot) => {
    const data = snapshot.data();
    callback({
      Marti: data?.Marti ?? ESTADO_POR_DEFECTO,
      Giuli: data?.Giuli ?? ESTADO_POR_DEFECTO,
    });
  });
}

export async function actualizarMiEstado(perfil: Perfil, emoji: string): Promise<void> {
  const ref = doc(db, 'meta', 'estados');
  await setDoc(ref, { [perfil]: emoji }, { merge: true });
}