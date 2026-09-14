import { supabase } from './supabase';

export const productosService = {
  async listar() {
    const { data, error } = await supabase
      .from('productos')
      .select('*, catalogos(nombre)')
      .order('id_producto', { ascending: true });

    if (error) {
      console.error('Error al consultar productos en Supabase:', error);
      throw error;
    }

    return (data || []).map(p => ({
      idProducto: p.id_producto,
      descripcion: p.descripcion,
      precio: Number(p.precio),
      stockActual: p.stock_actual,
      idCatalogo: p.id_catalogo,
      categoria: p.catalogos?.nombre || 'General',
      urlImagen: p.url_imagen || 'https://via.placeholder.com/200',
      estado: p.estado
    }));
  },

  async obtenerPorId(id) {
    const { data, error } = await supabase
      .from('productos')
      .select('*, catalogos(nombre)')
      .eq('id_producto', id)
      .single();

    if (error) {
      console.error('Error al obtener producto en Supabase:', error);
      throw error;
    }

    return {
      idProducto: data.id_producto,
      descripcion: data.descripcion,
      precio: Number(data.precio),
      stockActual: data.stock_actual,
      idCatalogo: data.id_catalogo,
      categoria: data.catalogos?.nombre || 'General',
      urlImagen: data.url_imagen || 'https://via.placeholder.com/200',
      estado: data.estado
    };
  },

  async crear(p) {
    const { data, error } = await supabase
      .from('productos')
      .insert([{
        descripcion: p.descripcion,
        precio: Number(p.precio),
        stock_actual: Number(p.stockActual),
        id_catalogo: p.idCatalogo ? Number(p.idCatalogo) : null,
        url_imagen: p.urlImagen,
        estado: true
      }])
      .select();

    if (error) throw error;
    return data[0];
  },

  async actualizar(p) {
    const { data, error } = await supabase
      .from('productos')
      .update({
        descripcion: p.descripcion,
        precio: Number(p.precio),
        stock_actual: Number(p.stockActual),
        id_catalogo: p.idCatalogo ? Number(p.idCatalogo) : null,
        url_imagen: p.urlImagen
      })
      .eq('id_producto', p.idProducto)
      .select();

    if (error) throw error;
    return data[0];
  },

  async cambiarEstado(id, estado) {
    const { data, error } = await supabase
      .from('productos')
      .update({ estado })
      .eq('id_producto', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  async eliminar(id) {
    const { error } = await supabase
      .from('productos')
      .delete()
      .eq('id_producto', id);

    if (error) throw error;
    return true;
  }
};
