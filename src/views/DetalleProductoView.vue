<template>
  <main class="seccion-gris py-5">
    <div class="container">
      <div v-if="cargando" class="text-center py-5 text-secondary">Cargando detalle del producto...</div>
      <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-else class="card border-0 shadow p-4 rounded-4 bg-white">
        <div class="row align-items-center g-5">
          <div class="col-md-6 text-center">
            <img :src="producto.urlImagen" :alt="producto.descripcion" class="img-fluid rounded-3 shadow-sm" style="max-height: 380px; object-fit: cover;">
          </div>
          <div class="col-md-6">
            <span class="badge bg-secondary mb-2">{{ producto.categoria }}</span>
            <h1 class="h3 fw-bold text-dark">{{ producto.descripcion }}</h1>
            <h2 class="text-success fw-bold my-3 fs-3">${{ producto.precio.toLocaleString() }}</h2>

            <table class="table table-sm my-4">
              <tbody>
                <tr>
                  <th class="text-secondary">Categoría:</th>
                  <td>{{ producto.categoria }}</td>
                </tr>
                <tr>
                  <th class="text-secondary">Stock disponible:</th>
                  <td>{{ producto.stockActual }} unidades</td>
                </tr>
                <tr>
                  <th class="text-secondary">Código:</th>
                  <td>#{{ producto.idProducto }}</td>
                </tr>
              </tbody>
            </table>

            <div class="d-flex align-items-center gap-3 mb-4">
              <div class="input-group" style="max-width: 140px;">
                <button class="btn btn-outline-secondary" @click="cambiarCantidad(-1)">-</button>
                <input type="number" class="form-control text-center" :value="cantidad" readonly>
                <button class="btn btn-outline-secondary" @click="cambiarCantidad(1)">+</button>
              </div>

              <button class="btn btn-punto-primario px-4" @click="agregarCarrito">
                Agregar al carrito
              </button>
            </div>

            <div v-if="mensaje" class="alert alert-success py-2">{{ mensaje }}</div>

            <router-link to="/catalogo" class="btn btn-link text-secondary p-0 mt-3 d-inline-block">
              &larr; Volver al catálogo
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { productosService } from '../services/productos.service';
import { useCarritoStore } from '../stores/carritoStore';

const route = useRoute();
const carritoStore = useCarritoStore();

const producto = ref({});
const cantidad = ref(1);
const cargando = ref(true);
const error = ref('');
const mensaje = ref('');

onMounted(async () => {
  try {
    producto.value = await productosService.obtenerPorId(route.params.id);
  } catch (err) {
    error.value = err.message || 'Error al cargar el producto';
  } finally {
    cargando.value = false;
  }
});

const cambiarCantidad = (delta) => {
  const nuevo = cantidad.value + delta;
  if (nuevo >= 1 && nuevo <= (producto.value.stockActual || 999)) {
    cantidad.value = nuevo;
  }
};

const agregarCarrito = () => {
  carritoStore.agregar(producto.value, cantidad.value);
  mensaje.value = '¡Producto agregado al carrito exitosamente!';
  setTimeout(() => { mensaje.value = ''; }, 3000);
};
</script>