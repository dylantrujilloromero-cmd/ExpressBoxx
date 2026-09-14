<template>
  <main class="seccion-gris py-5">
    <div class="container">
      <div class="contenedor-formulario formulario-ancho">
        <h1 class="h3 mb-2">Finalizar Pedido y Pago</h1>
        <p class="text-secondary mb-4">Confirma tus datos de entrega y selecciona el medio de pago.</p>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <form @submit.prevent="procesarPago">
          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <label class="form-label">Nombre del destinatario</label>
              <input type="text" class="form-control" v-model="form.nombre" required>
            </div>
            <div class="col-md-6">
              <label class="form-label">Correo electrónico</label>
              <input type="email" class="form-control" v-model="form.correo" required>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Dirección de entrega</label>
            <input type="text" class="form-control" v-model="form.direccionEnvio" placeholder="Ej: Carrera 15 # 45-20, Apto 302" required>
          </div>

          <div class="mb-4">
            <label class="form-label">Medio de pago</label>
            <select class="form-select" v-model="form.medioPago" required>
              <option value="1">Tarjeta de Crédito / Débito</option>
              <option value="2">Nequi</option>
              <option value="3">Transferencia Bancaria</option>
              <option value="4">Pago en Establecimiento</option>
            </select>
            <small class="text-secondary d-block mt-1">Este sistema no almacena números completos de tarjeta ni CVV.</small>
          </div>

          <div class="card bg-light p-3 mb-4">
            <h5 class="h6 mb-2">Resumen de la compra:</h5>
            <div class="d-flex justify-content-between mb-1">
              <span>Total de artículos:</span>
              <span>{{ carritoStore.totalItems }}</span>
            </div>
            <div class="d-flex justify-content-between fw-bold fs-5 text-success">
              <span>Total a pagar:</span>
              <span>${{ carritoStore.totalPrecio.toLocaleString() }}</span>
            </div>
          </div>

          <button type="submit" class="btn btn-punto-primario w-100 py-2" :disabled="cargando">
            {{ cargando ? 'Procesando...' : 'Confirmar y pagar' }}
          </button>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useCarritoStore } from '../stores/carritoStore';
import { ventasService } from '../services/ventas.service';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const carritoStore = useCarritoStore();
const router = useRouter();

const form = ref({
  nombre: '',
  correo: '',
  direccionEnvio: '',
  medioPago: '1'
});

const cargando = ref(false);
const error = ref('');

onMounted(() => {
  if (carritoStore.items.length === 0) {
    router.push('/carrito');
    return;
  }
  if (authStore.profile) {
    form.value.nombre = (authStore.profile.nombre || '') + ' ' + (authStore.profile.apellido || '');
    form.value.correo = authStore.profile.correo || '';
    form.value.direccionEnvio = authStore.profile.direccion || '';
  }
});

const procesarPago = async () => {
  error.value = '';
  cargando.value = true;
  try {
    const res = await ventasService.crearPedido({
      idUsuario: authStore.idUsuario || 1,
      direccionEnvio: form.value.direccionEnvio,
      total: carritoStore.totalPrecio,
      medioPago: form.value.medioPago,
      items: carritoStore.items
    });

    sessionStorage.setItem('ultimo_pedido', JSON.stringify({
      ...res,
      cliente: form.value,
      items: [...carritoStore.items],
      total: carritoStore.totalPrecio,
      fecha: new Date().toLocaleDateString()
    }));

    carritoStore.vaciar();
    router.push('/factura');
  } catch (err) {
    error.value = err.message || 'Error al procesar el pedido';
  } finally {
    cargando.value = false;
  }
};
</script>