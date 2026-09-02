// contexts/PerfilContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

export type Perfil = 'Marti' | 'Giuli';

interface PerfilContextType {
  perfil: Perfil | null;
  parejaDe: Perfil | null;
  cargando: boolean;
  seleccionarPerfil: (perfil: Perfil) => Promise<void>;
  cambiarPerfil: () => Promise<void>;
}

const PerfilContext = createContext<PerfilContextType | undefined>(undefined);

export function PerfilProvider({ children }: { children: React.ReactNode }) {
  // Arranca siempre en null: el perfil NO se persiste entre aperturas de la app.
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  // Arranca en true para darle tiempo al Root Layout (el <Stack>) a montarse
  // antes de que el Guardián de Navegación intente redirigir.
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(false);
  }, []);

  const seleccionarPerfil = async (nuevoPerfil: Perfil) => {
    setPerfil(nuevoPerfil);
  };

  const cambiarPerfil = async () => {
    setPerfil(null);
  };

  const parejaDe: Perfil | null = perfil === 'Marti' ? 'Giuli' : perfil === 'Giuli' ? 'Marti' : null;

  return (
    <PerfilContext.Provider value={{ perfil, parejaDe, cargando, seleccionarPerfil, cambiarPerfil }}>
      {children}
    </PerfilContext.Provider>
  );
}

export function usePerfil() {
  const context = useContext(PerfilContext);
  if (!context) {
    throw new Error('usePerfil debe usarse dentro de un PerfilProvider');
  }
  return context;
}