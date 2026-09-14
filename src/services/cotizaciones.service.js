import { supabase } from './supabase';

export const cotizacionesService = {
  async listarTodas() {
    const { data, error } = await supabase
      .from('cotizaciones_cabeceras')
      .select('*, usuarios(nombre, apellido, correo), detalles_cotizaciones(*)')
      .order('id_cotizacion', { ascending: false });

    if (error) {
      console.error('Error al listar cotizaciones en Supabase:', error);
      throw error;
    }
    return data || [];
  },

  async listarPorUsuario(idUsuario) {
    const { data, error } = await supabase
      .from('cotizaciones_cabeceras')
      .select('*, detalles_cotizaciones(*)')
      .eq('id_usuario', idUsuario)
      .order('id_cotizacion', { ascending: false });

    if (error) {
      console.error('Error al listar cotizaciones del usuario en Supabase:', error);
      throw error;
    }
    return data || [];
  },

  async crearCliente({ idUsuario, cantidad, alto, largo, ancho, color, acabado, descripcionUsoCaja }) {
    const { data: cabecera, error: errCab } = await supabase
      .from('cotizaciones_cabeceras')
      .insert([{
        id_usuario: idUsuario,
        fecha: new Date().toISOString().slice(0, 10),
        estado: 'PENDIENTE',
        total: 0
      }])
      .select()
      .single();

    if (errCab) throw errCab;

    const { error: errDet } = await supabase
      .from('detalles_cotizaciones')
      .insert([{
        id_cotizacion: cabecera.id_cotizacion,
        cantidad: Number(cantidad),
        alto: Number(alto),
        largo: Number(largo),
        ancho: Number(ancho),
        color,
        acabado,
        descripcion_uso_caja: descripcionUsoCaja
      }]);

    if (errDet) throw errDet;

    return cabecera.id_cotizacion;
  },

  async actualizarEstado(idCotizacion, estado, observacion = '') {
    const { data, error } = await supabase
      .from('cotizaciones_cabeceras')
      .update({ estado, observacion })
      .eq('id_cotizacion', idCotizacion)
      .select();

    if (error) throw error;
    return data[0];
  },

  async actualizarPrecios(idCotizacion, { valorUnitario, iva, subtotal, total, estado, observacion }) {
    const { data, error } = await supabase
      .from('cotizaciones_cabeceras')
      .update({
        valor_unitario: Number(valorUnitario),
        iva: Number(iva),
        subtotal: Number(subtotal),
        total: Number(total),
        estado,
        observacion
      })
      .eq('id_cotizacion', idCotizacion)
      .select();

    if (error) throw error;
    return data[0];
  },

  async eliminar(idCotizacion) {
    const { error } = await supabase
      .from('cotizaciones_cabeceras')
      .delete()
      .eq('id_cotizacion', idCotizacion);

    if (error) throw error;
    return true;
  }
};
