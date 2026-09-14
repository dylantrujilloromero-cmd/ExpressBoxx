import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCarritoStore = defineStore('carrito', () => {
  const items = ref(JSON.parse(localStorage.getItem('carrito_items') || '[]'));

  const totalItems = computed(() => items.value.reduce((acc, it) => acc + it.cantidad, 0));
  const totalPrecio = computed(() => items.value.reduce((acc, it) => acc + (it.precioUnitario * it.cantidad), 0));

  function persistir() {
    localStorage.setItem('carrito_items', JSON.stringify(items.value));
  }

  function agregar(producto, cantidad = 1) {
    const id = producto.idProducto || producto.id_producto;
    const precio = Number(producto.precio || 0);
    const descripcion = producto.descripcion || 'Producto';
    const index = items.value.findIndex(it => it.idProducto === id);

    if (index !== -1) {
      items.value[index].cantidad += cantidad;
      items.value[index].subtotal = items.value[index].cantidad * precio;
    } else {
      items.value.push({
        idProducto: id,
        descripcion,
        precioUnitario: precio,
        cantidad,
        subtotal: cantidad * precio
      });
    }
    persistir();
  }

  function quitar(idProducto) {
    items.value = items.value.filter(it => it.idProducto !== idProducto);
    persistir();
  }

  function vaciar() {
    items.value = [];
    persistir();
  }

  return {
    items,
    totalItems,
    totalPrecio,
    agregar,
    quitar,
    vaciar
  };
});
