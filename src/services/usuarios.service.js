import { supabase } from './supabase';

export const usuariosService = {
  async listar() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*, roles(nombre), tipos_de_documentos(nombre, descripcion_doc)')
      .order('id_usuario', { ascending: true });

    if (error) {
      console.error('Error al listar usuarios en Supabase:', error);
      throw error;
    }
    return data || [];
  },

  async cambiarEstado(idUsuario, estado) {
    const { data, error } = await supabase
      .from('usuarios')
      .update({ estado })
      .eq('id_usuario', idUsuario)
      .select();

    if (error) throw error;
    return data[0];
  },

  async actualizarPerfil(idUsuario, { nombre, apellido, correo, telefono, direccion }) {
    const { data, error } = await supabase
      .from('usuarios')
      .update({ nombre, apellido, correo, telefono, direccion })
      .eq('id_usuario', idUsuario)
      .select();

    if (error) throw error;
    return data[0];
  }
};
