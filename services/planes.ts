// services/planes.ts
import {
  collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc,
  serverTimestamp, query, orderBy,
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import type { Perfil } from '@/contexts/PerfilContext';

export interface Plan {
  id: string;
  texto: string;
  hecho: boolean;
  fecha: number;
  autor: Perfil;
}

export function escucharPlanes(callback: (planes: Plan[]) => void): () => void {
  const q = query(collection(db, 'planes'), orderBy('fecha', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const lista: Plan[] = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        texto: data.texto ?? '',
        hecho: data.hecho ?? false,
        fecha: data.fecha?.toMillis ? data.fecha.toMillis() : Date.now(),
        autor: data.autor,
      };
    });
    callback(lista);
  });
}

export async function crearPlan(texto: string, autor: Perfil): Promise<void> {
  await addDoc(collection(db, 'planes'), {
    texto,
    autor,
    hecho: false,
    fecha: serverTimestamp(),
  });
}

export async function borrarPlan(id: string): Promise<void> {
  await deleteDoc(doc(db, 'planes', id));
}

export async function moverPlan(id: string, hechoActual: boolean): Promise<void> {
  await updateDoc(doc(db, 'planes', id), { hecho: !hechoActual });
}