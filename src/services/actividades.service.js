import { supabase } from './supabase';

export const actividadesService = {
  async listarPublicas() {
    const { data, error } = await supabase
      .from('actividades')
      .select('*')
      .eq('activa', true)
      .order('idactividad', { ascending: true });

    if (error) {
      console.error('Error al listar actividades desde Supabase:', error);
      throw error;
    }
    return data || [];
  },

  async crear(actividad) {
    const { data, error } = await supabase
      .from('actividades')
      .insert([actividad])
      .select();

    if (error) throw error;
    return data[0];
  }
};
