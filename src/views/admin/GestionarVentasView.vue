<template>
  <main class="seccion-gris py-5">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h1 class="h3 mb-1">Gestionar ventas y pedidos</h1>
          <p class="text-secondary mb-0">Consulta los pedidos realizados, totales y estados de entrega.</p>
        </div>
      </div>

      <div class="table-responsive bg-white rounded p-3 border shadow-sm">
        <table class="table table-striped align-middle mb-0">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Dirección de envío</th>
              <th>Total</th>
              <th>Estado</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in ventas" :key="v.id_pedido">
              <td>#{{ v.id_pedido }}</td>
              <td>{{ v.fecha }}</td>
              <td>
                <div>{{ v.usuarios?.nombre }} {{ v.usuarios?.apellido }}</div>
                <small class="text-secondary">{{ v.usuarios?.correo }}</small>
              </td>
              <td>{{ v.direccion_envio }}</td>
              <td class="fw-bold text-success">${{ Number(v.total || 0).toLocaleString() }}</td>
              <td>
                <span class="badge" :class="{
                  'bg-success': v.estado_pedido === 'Entregado' || v.estado_pedido === 'Completado',
                  'bg-warning text-dark': v.estado_pedido === 'En proceso',
                  'bg-info text-dark': v.estado_pedido === 'Enviado',
                  'bg-primary': v.estado_pedido === 'Pendiente',
                  'bg-danger': v.estado_pedido === 'Cancelado'
                }">{{ v.estado_pedido }}</span>
              </td>
              <td class="text-center">
                <select class="form-select form-select-sm d-inline-block" style="width: 140px;" :value="v.estado_pedido" @change="cambiarEstado(v.id_pedido, $event.target.value)">
                  <option value="Pendiente">Pendiente</option>
                  <option value="En proceso">En proceso</option>
                  <option value="Enviado">Enviado</option>
                  <option value="Entregado">Entregado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </td>
            </tr>
            <tr v-if="ventas.length === 0">
              <td colspan="7" class="text-center text-secondary py-4">No hay ventas registradas.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ventasService } from '../../services/ventas.service';

const ventas = ref([]);

const cargarVentas = async () => {
  ventas.value = await ventasService.listarTodas();
};

onMounted(() => {
  cargarVentas();
});

const cambiarEstado = async (idPedido, nuevoEstado) => {
  try {
    await ventasService.actualizarEstado(idPedido, nuevoEstado);
    await cargarVentas();
  } catch (err) {
    alert('Error al cambiar estado: ' + err.message);
  }
};
</script>