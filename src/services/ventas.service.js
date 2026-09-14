import { supabase } from './supabase';

export const ventasService = {
  async listarTodas() {
    const { data, error } = await supabase
      .from('pedidos_cabeceras')
      .select('*, usuarios(nombre, apellido, correo), pedidos_detalles(*, productos(descripcion))')
      .order('id_pedido', { ascending: false });

    if (error) {
      console.error('Error al listar ventas en Supabase:', error);
      throw error;
    }
    return data || [];
  },

  async crearPedido({ idUsuario, direccionEnvio, total, medioPago, items }) {
    const { data: pedido, error: errPed } = await supabase
      .from('pedidos_cabeceras')
      .insert([{
        id_usuario: idUsuario,
        direccion_envio: direccionEnvio,
        total: Number(total),
        estado_pedido: 'Pendiente',
        fecha: new Date().toISOString().slice(0, 10)
      }])
      .select()
      .single();

    if (errPed) throw errPed;

    const detalles = items.map(item => ({
      id_pedido: pedido.id_pedido,
      id_producto: item.idProducto,
      cantidad: Number(item.cantidad),
      precio_unitario: Number(item.precioUnitario),
      subtotal: Number(item.subtotal)
    }));

    const { error: errDet } = await supabase.from('pedidos_detalles').insert(detalles);
    if (errDet) throw errDet;

    const numFactura = 'FV-' + String(Date.now()).slice(-6);
    const { data: factura, error: errFact } = await supabase
      .from('facturas_cabeceras')
      .insert([{
        numero_factura: numFactura,
        id_pedido: pedido.id_pedido,
        total: Number(total),
        fecha: new Date().toISOString().slice(0, 10)
      }])
      .select()
      .single();

    if (errFact) throw errFact;

    // Registrar pago
    await supabase.from('pagos').insert([{
      id_factura: factura.id_factura,
      id_medio_pago: Number(medioPago || 1),
      monto: Number(total),
      estado: 'Completado'
    }]);

    return { pedido, factura, numeroFactura: numFactura };
  },

  async actualizarEstado(idPedido, estadoPedido) {
    const { data, error } = await supabase
      .from('pedidos_cabeceras')
      .update({ estado_pedido: estadoPedido })
      .eq('id_pedido', idPedido)
      .select();

    if (error) throw error;
    return data[0];
  }
};
