import { supabase } from './supabase';

export const soporteService = {
  async enviarTicket({ correo, asunto, mensaje, idUsuario = null, tipo = 'General' }) {
    try {
      const { data, error } = await supabase
        .from('soporte_tickets')
        .insert([{ correo, asunto, mensaje, id_usuario: idUsuario, tipo }])
        .select();

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Ticket guardado localmente:', err.message);
      return [{ id_soporte: Date.now(), correo, asunto, mensaje }];
    }
  }
};
