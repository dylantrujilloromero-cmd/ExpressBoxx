import { supabase } from './supabase';

export const reservasService = {
  async listarPorUsuario(idUsuario) {
    const { data, error } = await supabase
      .from('reservas')
      .select('idreserva, num_personas, fecha, hora, estado_idestado, actividad_idactividad, actividades(descripcion_actividad), estados_reserva(descripcion_estado)')
      .eq('usuarios_idusuarios', idUsuario)
      .order('fecha', { ascending: false });

    if (error) {
      console.error('Error al consultar reservas en Supabase:', error);
      throw error;
    }

    return (data || []).map(r => {
      const fechaReserva = new Date(r.fecha + 'T' + (r.hora || '00:00:00'));
      const hoy = new Date();
      const diffDias = (fechaReserva - hoy) / (1000 * 60 * 60 * 24);
      const puedeModificar = diffDias > 3 && r.estado_idestado !== 3;

      return {
        idreserva: r.idreserva,
        num_personas: r.num_personas,
        fecha: r.fecha,
        hora: r.hora,
        actividad_idactividad: r.actividad_idactividad,
        descripcionActividad: r.actividades?.descripcion_actividad || 'Actividad #' + r.actividad_idactividad,
        descripcionEstado: r.estados_reserva?.descripcion_estado || 'Confirmada',
        puedeEditar: puedeModificar,
        puedeCancelar: puedeModificar,
        esCancelada: r.estado_idestado === 3
      };
    });
  },

  async crearReserva(reserva) {
    const { data, error } = await supabase
      .from('reservas')
      .insert([{
        usuarios_idusuarios: reserva.usuarios_idusuarios,
        actividad_idactividad: reserva.actividad_idactividad,
        num_personas: Number(reserva.num_personas),
        fecha: reserva.fecha,
        hora: reserva.hora,
        estado_idestado: 1
      }])
      .select();

    if (error) {
      console.error('Error al registrar reserva en Supabase:', error);
      throw error;
    }
    return data;
  },

  async actualizarReserva(reserva) {
    const { data, error } = await supabase
      .from('reservas')
      .update({
        num_personas: Number(reserva.num_personas),
        fecha: reserva.fecha,
        hora: reserva.hora
      })
      .eq('idreserva', reserva.idreserva)
      .select();

    if (error) {
      console.error('Error al actualizar reserva en Supabase:', error);
      throw error;
    }
    return data;
  },

  async cancelarReserva(idReserva) {
    const { data, error } = await supabase
      .from('reservas')
      .update({ estado_idestado: 3 })
      .eq('idreserva', idReserva)
      .select();

    if (error) {
      console.error('Error al cancelar reserva en Supabase:', error);
      throw error;
    }
    return data;
  }
};
