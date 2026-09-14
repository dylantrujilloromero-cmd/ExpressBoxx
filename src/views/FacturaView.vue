<template>
  <main class="seccion-gris py-5">
    <div class="container">
      <div class="card p-5 border shadow-lg mx-auto bg-white rounded-4" style="max-width: 720px;">
        <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
          <div>
            <h1 class="h4 fw-bold text-success mb-0">PUNTO CAJAS</h1>
            <small class="text-secondary">Comprobante de Venta Electrónico</small>
          </div>
          <div class="text-end">
            <span class="badge bg-success fs-6">{{ factura.numeroFactura || 'FV-100234' }}</span>
            <div class="small text-secondary mt-1">Fecha: {{ factura.fecha || new Date().toLocaleDateString() }}</div>
          </div>
        </div>

        <div class="row mb-4">
          <div class="col-6">
            <h6 class="text-secondary mb-1">Cliente:</h6>
            <p class="fw-bold mb-0">{{ factura.cliente?.nombre || authStore.profile?.nombre }}</p>
            <p class="text-secondary small mb-0">{{ factura.cliente?.correo || authStore.profile?.correo }}</p>
          </div>
          <div class="col-6 text-end">
            <h6 class="text-secondary mb-1">Dirección de entrega:</h6>
            <p class="mb-0">{{ factura.cliente?.direccionEnvio || 'Dirección registrada' }}</p>
          </div>
        </div>

        <table class="table table-bordered mb-4">
          <thead class="table-light">
            <tr>
              <th>Descripción</th>
              <th class="text-center">Cant.</th>
              <th class="text-end">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in factura.items" :key="idx">
              <td>{{ item.descripcion }}</td>
              <td class="text-center">{{ item.cantidad }}</td>
              <td class="text-end">${{ item.subtotal?.toLocaleString() }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th colspan="2" class="text-end">TOTAL:</th>
              <th class="text-end text-success fs-5">${{ factura.total?.toLocaleString() }}</th>
            </tr>
          </tfoot>
        </table>

        <div class="alert alert-light text-center small text-secondary mb-4">
          Gracias por tu compra en Punto Cajas. Guarda este comprobante para cualquier reclamo.
        </div>

        <div class="text-center">
          <router-link to="/catalogo" class="btn btn-punto-primario px-4">Volver al catálogo</router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();
const factura = ref({ items: [], total: 0 });

onMounted(() => {
  const guardado = sessionStorage.getItem('ultimo_pedido');
  if (guardado) {
    factura.value = JSON.parse(guardado);
  }
});
</script>