import { supabase } from './supabase';

export const catalogosService = {
  async listar() {
    const { data, error } = await supabase
      .from('catalogos')
      .select('*')
      .order('id_catalogo', { ascending: true });

    if (error) {
      console.error('Error al listar catálogos en Supabase:', error);
      throw error;
    }

    return (data || []).map(c => ({
      idCatalogo: c.id_catalogo,
      nombre: c.nombre
    }));
  },

  async crear(nombre) {
    const { data, error } = await supabase
      .from('catalogos')
      .insert([{ nombre }])
      .select();

    if (error) throw error;
    return data[0];
  },

  async eliminar(id) {
    const { error } = await supabase
      .from('catalogos')
      .delete()
      .eq('id_catalogo', id);

    if (error) throw error;
    return true;
  }
};
