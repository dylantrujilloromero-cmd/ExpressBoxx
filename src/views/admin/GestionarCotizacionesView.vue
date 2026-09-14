<template>
  <main class="seccion-gris py-5">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h1 class="h3 mb-1">Gestionar cotizaciones</h1>
          <p class="text-secondary mb-0">Revisa, aprueba, rechaza o cotiza solicitudes de clientes.</p>
        </div>
        <select v-model="filtroEstado" class="form-select" style="max-width: 200px;">
          <option value="">Todos los estados</option>
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="APROBADA">APROBADA</option>
          <option value="RECHAZADA">RECHAZADA</option>
        </select>
      </div>

      <div class="table-responsive bg-white rounded p-3 border shadow-sm">
        <table class="table table-striped align-middle mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Cantidad</th>
              <th>Dimensiones (L x An x Al)</th>
              <th>Color / Acabado</th>
              <th>Total</th>
              <th>Estado</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in cotizacionesFiltradas" :key="c.id_cotizacion">
              <td>#{{ c.id_cotizacion }}</td>
              <td>{{ c.fecha }}</td>
              <td>
                <div>{{ c.usuarios?.nombre }} {{ c.usuarios?.apellido }}</div>
                <small class="text-secondary">{{ c.usuarios?.correo }}</small>
              </td>
              <td>{{ c.detalles_cotizaciones?.[0]?.cantidad || 1 }}</td>
              <td>
                {{ c.detalles_cotizaciones?.[0]?.largo }} x {{ c.detalles_cotizaciones?.[0]?.ancho }} x {{ c.detalles_cotizaciones?.[0]?.alto }} cm
              </td>
              <td>
                <div>{{ c.detalles_cotizaciones?.[0]?.color }}</div>
                <small class="badge bg-light text-dark">{{ c.detalles_cotizaciones?.[0]?.acabado }}</small>
              </td>
              <td class="fw-bold text-success">${{ Number(c.total || 0).toLocaleString() }}</td>
              <td>
                <span class="badge" :class="{
                  'bg-warning text-dark': c.estado === 'PENDIENTE',
                  'bg-success': c.estado === 'APROBADA',
                  'bg-danger': c.estado === 'RECHAZADA'
                }">{{ c.estado }}</span>
              </td>
              <td>
                <div class="d-flex gap-1 justify-content-center">
                  <button class="btn btn-outline-primary btn-sm" @click="abrirEditar(c)">Cotizar/Editar</button>
                  <button v-if="c.estado !== 'APROBADA'" class="btn btn-success btn-sm" @click="cambiarEstado(c, 'APROBADA')">Aprobar</button>
                  <button v-if="c.estado !== 'RECHAZADA'" class="btn btn-outline-danger btn-sm" @click="cambiarEstado(c, 'RECHAZADA')">Rechazar</button>
                </div>
              </td>
            </tr>
            <tr v-if="cotizacionesFiltradas.length === 0">
              <td colspan="9" class="text-center text-secondary py-4">No hay cotizaciones para mostrar.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Editar Precios Cotización -->
      <div v-if="mostrarModal" class="modal d-block" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Cotizar Solicitud #{{ form.id_cotizacion }}</h5>
              <button class="btn-close" @click="mostrarModal = false"></button>
            </div>
            <form @submit.prevent="guardarPrecios">
              <div class="modal-body">
                <div class="row g-3 mb-3">
                  <div class="col-md-6">
                    <label class="form-label">Valor Unitario</label>
                    <input type="number" step="0.01" class="form-control" v-model="form.valorUnitario" @input="calcularTotales" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">IVA (19%)</label>
                    <input type="number" step="0.01" class="form-control" v-model="form.iva" readonly>
                  </div>
                </div>
                <div class="row g-3 mb-3">
                  <div class="col-md-6">
                    <label class="form-label">Subtotal</label>
                    <input type="number" step="0.01" class="form-control" v-model="form.subtotal" readonly>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Total</label>
                    <input type="number" step="0.01" class="form-control" v-model="form.total" required>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Estado</label>
                  <select class="form-select" v-model="form.estado">
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="APROBADA">APROBADA</option>
                    <option value="RECHAZADA">RECHAZADA</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Observación / Mensaje al cliente</label>
                  <textarea class="form-control" rows="3" v-model="form.observacion"></textarea>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="mostrarModal = false">Cancelar</button>
                <button type="submit" class="btn btn-punto-primario">Guardar Cotización</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { cotizacionesService } from '../../services/cotizaciones.service';

const cotizaciones = ref([]);
const filtroEstado = ref('');
const mostrarModal = ref(false);

const form = ref({
  id_cotizacion: null,
  cantidad: 1,
  valorUnitario: 0,
  iva: 0,
  subtotal: 0,
  total: 0,
  estado: 'PENDIENTE',
  observacion: ''
});

const cargarCotizaciones = async () => {
  cotizaciones.value = await cotizacionesService.listarTodas();
};

onMounted(() => {
  cargarCotizaciones();
});

const cotizacionesFiltradas = computed(() => {
  return cotizaciones.value.filter(c => 
    filtroEstado.value ? c.estado === filtroEstado.value : true
  );
});

const abrirEditar = (c) => {
  const cant = c.detalles_cotizaciones?.[0]?.cantidad || 1;
  form.value = {
    id_cotizacion: c.id_cotizacion,
    cantidad: cant,
    valorUnitario: c.valor_unitario || 0,
    iva: c.iva || 0,
    subtotal: c.subtotal || 0,
    total: c.total || 0,
    estado: c.estado || 'PENDIENTE',
    observacion: c.observacion || ''
  };
  mostrarModal.value = true;
};

const calcularTotales = () => {
  const sub = Number(form.value.valorUnitario) * form.value.cantidad;
  const ivaCalc = sub * 0.19;
  form.value.subtotal = sub;
  form.value.iva = ivaCalc;
  form.value.total = sub + ivaCalc;
};

const guardarPrecios = async () => {
  try {
    await cotizacionesService.actualizarPrecios(form.value.id_cotizacion, form.value);
    mostrarModal.value = false;
    await cargarCotizaciones();
  } catch (err) {
    alert('Error al guardar: ' + err.message);
  }
};

const cambiarEstado = async (c, nuevoEstado) => {
  const obs = prompt(`Confirmar cambio a ${nuevoEstado}. Observación (opcional):`, '');
  if (obs === null) return;
  try {
    await cotizacionesService.actualizarEstado(c.id_cotizacion, nuevoEstado, obs);
    await cargarCotizaciones();
  } catch (err) {
    alert('Error al actualizar estado: ' + err.message);
  }
};
</script>