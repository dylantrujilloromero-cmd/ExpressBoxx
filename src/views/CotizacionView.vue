<template>
  <main class="seccion-gris py-5">
    <div class="container">
      <div class="contenedor-formulario formulario-ancho">
        <h1 class="h3 mb-1">Solicitar Cotización</h1>
        <p class="text-secondary mb-4">Indícanos las dimensiones y especificaciones de las cajas que requieres.</p>

        <div v-if="mensajeExito" class="alert alert-success">
          {{ mensajeExito }}
        </div>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <form @submit.prevent="enviarCotizacion">
          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <label class="form-label">Cantidad requerida</label>
              <input type="number" class="form-control" v-model="form.cantidad" min="1" placeholder="Ej: 50" required>
            </div>
            <div class="col-md-6">
              <label class="form-label">Color / Material</label>
              <input type="text" class="form-control" v-model="form.color" placeholder="Ej: Cartón Kraft / Blanco" required>
            </div>
          </div>

          <h2 class="h6 border-bottom pb-2 mb-3 mt-4 text-muted">Dimensiones (en centímetros)</h2>
          <div class="row g-3 mb-3">
            <div class="col-md-4">
              <label class="form-label">Largo (cm)</label>
              <input type="number" step="0.1" class="form-control" v-model="form.largo" placeholder="Ej: 40" required>
            </div>
            <div class="col-md-4">
              <label class="form-label">Ancho (cm)</label>
              <input type="number" step="0.1" class="form-control" v-model="form.ancho" placeholder="Ej: 30" required>
            </div>
            <div class="col-md-4">
              <label class="form-label">Alto (cm)</label>
              <input type="number" step="0.1" class="form-control" v-model="form.alto" placeholder="Ej: 25" required>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Acabado / Impresión</label>
            <select class="form-select" v-model="form.acabado" required>
              <option value="Sin Estampar">Sin Estampar (Plano)</option>
              <option value="1 Tinta">Impresión 1 Tinta</option>
              <option value="Full Color">Impresión Full Color</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="form-label">Descripción o Uso de la Caja</label>
            <textarea class="form-control" rows="3" v-model="form.descripcionUsoCaja" placeholder="Describe para qué productos se utilizará la caja..."></textarea>
          </div>

          <button type="submit" class="btn btn-punto-primario w-100" :disabled="cargando">
            {{ cargando ? 'Enviando...' : 'Enviar Solicitud de Cotización' }}
          </button>
        </form>
      </div>

      <!-- Mis cotizaciones -->
      <div v-if="authStore.isAuthenticated && misCotizaciones.length > 0" class="card border-0 shadow-sm p-4 mt-5 bg-white">
        <h3 class="h5 mb-3">Mis cotizaciones anteriores</h3>
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Total</th>
                <th>Observación</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in misCotizaciones" :key="c.id_cotizacion">
                <td>#{{ c.id_cotizacion }}</td>
                <td>{{ c.fecha }}</td>
                <td>
                  <span class="badge" :class="{
                    'bg-warning text-dark': c.estado === 'PENDIENTE',
                    'bg-success': c.estado === 'APROBADA',
                    'bg-danger': c.estado === 'RECHAZADA'
                  }">{{ c.estado }}</span>
                </td>
                <td>${{ Number(c.total || 0).toLocaleString() }}</td>
                <td>{{ c.observacion || 'En revisión' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { cotizacionesService } from '../services/cotizaciones.service';

const authStore = useAuthStore();

const form = ref({
  cantidad: 10,
  color: 'Cartón Kraft',
  largo: 30,
  ancho: 20,
  alto: 15,
  acabado: 'Sin Estampar',
  descripcionUsoCaja: ''
});

const misCotizaciones = ref([]);
const cargando = ref(false);
const mensajeExito = ref('');
const error = ref('');

const cargarMisCotizaciones = async () => {
  if (authStore.idUsuario) {
    misCotizaciones.value = await cotizacionesService.listarPorUsuario(authStore.idUsuario);
  }
};

onMounted(() => {
  cargarMisCotizaciones();
});

const enviarCotizacion = async () => {
  error.value = '';
  mensajeExito.value = '';
  cargando.value = true;
  try {
    const id = await cotizacionesService.crearCliente({
      idUsuario: authStore.idUsuario || 1,
      ...form.value
    });
    mensajeExito.value = `¡Cotización #${id} enviada con éxito! En un plazo de 24 a 36 horas te enviaremos respuesta al correo.`;
    form.value.descripcionUsoCaja = '';
    await cargarMisCotizaciones();
  } catch (err) {
    error.value = err.message || 'Error al enviar cotización';
  } finally {
    cargando.value = false;
  }
};
</script>