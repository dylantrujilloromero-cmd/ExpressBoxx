<template>
  <main class="container my-5">
    <div class="card shadow-lg border-0 rounded-4 p-4 bg-white">
      <h1 class="h3 mb-4 fw-bold text-dark">🛒 Tu Carrito de Compras</h1>

      <div class="table-responsive mb-4">
        <table class="table align-middle table-hover mb-0">
          <thead class="table-success text-dark">
            <tr>
              <th>Producto</th>
              <th>Precio Unitario</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th class="text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in carritoStore.items" :key="item.idProducto">
              <td class="fw-semibold text-secondary">{{ item.descripcion }}</td>
              <td>${{ item.precioUnitario.toLocaleString() }}</td>
              <td><span class="badge bg-secondary px-3 py-2">{{ item.cantidad }}</span></td>
              <td class="fw-bold text-success">${{ item.subtotal.toLocaleString() }}</td>
              <td class="text-center">
                <button class="btn btn-outline-danger btn-sm px-3 rounded-pill" @click="carritoStore.quitar(item.idProducto)">
                  Quitar
                </button>
              </td>
            </tr>
            <tr v-if="carritoStore.items.length === 0">
              <td colspan="5" class="text-center text-muted py-5 fs-5">
                Tu carrito está actualmente vacío.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="d-flex flex-wrap justify-content-between align-items-center pt-3 border-top gap-3">
        <button class="btn btn-outline-secondary px-4 rounded-pill" @click="carritoStore.vaciar" :disabled="carritoStore.items.length === 0">
          Vaciar carrito
        </button>

        <div class="text-end">
          <h4 class="fw-bold mb-3">Total: <span class="text-success">${{ carritoStore.totalPrecio.toLocaleString() }}</span></h4>
          <router-link to="/catalogo" class="btn btn-outline-success px-4 rounded-pill me-2">Seguir comprando</router-link>
          <router-link v-if="carritoStore.items.length > 0" to="/pago" class="btn btn-success px-5 rounded-pill shadow">
            Finalizar compra
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { useCarritoStore } from '../stores/carritoStore';

const carritoStore = useCarritoStore();
</script>