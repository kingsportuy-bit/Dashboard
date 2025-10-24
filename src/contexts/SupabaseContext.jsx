import React, { createContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Obtener las credenciales de Supabase desde las variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Configuración de Supabase:', { supabaseUrl, supabaseAnonKey: supabaseAnonKey ? 'Configurada' : 'No configurada' });

// Verificar que las credenciales estén presentes
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Faltan las credenciales de Supabase. Verifica tus variables de entorno.');
}

export const SupabaseContext = createContext();

export const SupabaseProvider = ({ children }) => {
  const [supabase, setSupabase] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Crear cliente de Supabase
      const client = createClient(supabaseUrl, supabaseAnonKey);
      setSupabase(client);
      
      console.log('Cliente de Supabase creado exitosamente');
      
      // Obtener sesión actual
      const getSession = async () => {
        try {
          const { data: { session } } = await client.auth.getSession();
          setSession(session);
        } catch (error) {
          console.error('Error getting session:', error);
        } finally {
          setLoading(false);
        }
      };

      getSession();

      // Escuchar cambios de autenticación
      const { data: { subscription } } = client.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
        }
      );

      return () => {
        if (subscription && subscription.unsubscribe) {
          subscription.unsubscribe();
        }
      };
    } catch (error) {
      console.error('Error al crear el cliente de Supabase:', error);
      setLoading(false);
    }
  }, []);

  const value = {
    supabase,
    session,
    loading
  };

  return (
    <SupabaseContext.Provider value={value}>
      {!loading && children}
    </SupabaseContext.Provider>
  );
};