// firebaseConfig.ts
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDe7mnk1EKEYQm3diT5JaHTOX_wc4lw7U0",
  authDomain: "app-giuli.firebaseapp.com",
  projectId: "app-giuli",
  storageBucket: "app-giuli.firebasestorage.app",
  messagingSenderId: "1021785518168",
  appId: "1:1021785518168:web:6d766c006382db74b25a2d",
};

// Evita inicializar Firebase dos veces (pasa con hot-reload en desarrollo)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);