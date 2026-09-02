// services/notitas.ts
import {
  collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc,
  serverTimestamp, query, orderBy,
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import type { Perfil } from '@/contexts/PerfilContext';

export interface Notita {
  id: string;
  texto: string;
  fecha: number;
  favorita: boolean;
  color: string;
  autor: Perfil;
}

export function escucharNotitas(callback: (notitas: Notita[]) => void): () => void {
  const q = query(collection(db, 'notitas'), orderBy('fecha', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const lista: Notita[] = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        texto: data.texto ?? '',
        fecha: data.fecha?.toMillis ? data.fecha.toMillis() : Date.now(),
        favorita: data.favorita ?? false,
        color: data.color ?? '#FFF9C4',
        autor: data.autor,
      };
    });
    callback(lista);
  });
}

export async function crearNotita(texto: string, color: string, autor: Perfil): Promise<void> {
  await addDoc(collection(db, 'notitas'), {
    texto,
    color,
    autor,
    favorita: false,
    fecha: serverTimestamp(),
  });
}

export async function borrarNotita(id: string): Promise<void> {
  await deleteDoc(doc(db, 'notitas', id));
}

export async function toggleFavoritaNotita(id: string, favoritaActual: boolean): Promise<void> {
  await updateDoc(doc(db, 'notitas', id), { favorita: !favoritaActual });
}