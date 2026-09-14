<template>
  <main class="seccion-gris py-5">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h1 class="h3 mb-1">Gestionar catálogos</h1>
          <p class="text-secondary mb-0">Crea y administra las categorías de productos.</p>
        </div>
        <button class="btn btn-punto-primario" @click="mostrarModal = true">+ Nueva Categoría</button>
      </div>

      <div class="table-responsive bg-white rounded p-3 border shadow-sm" style="max-width: 800px;">
        <table class="table table-striped align-middle mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre de la categoría</th>
              <th class="text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in catalogos" :key="c.idCatalogo">
              <td>{{ c.idCatalogo }}</td>
              <td class="fw-bold">{{ c.nombre }}</td>
              <td class="text-center">
                <button class="btn btn-outline-danger btn-sm" @click="eliminarCatalogo(c.idCatalogo)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Crear Catálogo -->
      <div v-if="mostrarModal" class="modal d-block" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Nueva Categoría</h5>
              <button class="btn-close" @click="mostrarModal = false"></button>
            </div>
            <form @submit.prevent="crearCatalogo">
              <div class="modal-body">
                <label class="form-label">Nombre de la categoría</label>
                <input type="text" class="form-control" v-model="nuevoNombre" placeholder="Ej: Cajas para mudanza" required>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="mostrarModal = false">Cancelar</button>
                <button type="submit" class="btn btn-punto-primario">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { catalogosService } from '../../services/catalogos.service';

const catalogos = ref([]);
const mostrarModal = ref(false);
const nuevoNombre = ref('');

const cargarCatalogos = async () => {
  catalogos.value = await catalogosService.listar();
};

onMounted(() => {
  cargarCatalogos();
});

const crearCatalogo = async () => {
  try {
    await catalogosService.crear(nuevoNombre.value);
    nuevoNombre.value = '';
    mostrarModal.value = false;
    await cargarCatalogos();
  } catch (err) {
    alert('Error al crear catálogo: ' + err.message);
  }
};

const eliminarCatalogo = async (id) => {
  if (!confirm('¿Seguro de eliminar esta categoría? Los productos asociados podrían verse afectados.')) return;
  try {
    await catalogosService.eliminar(id);
    await cargarCatalogos();
  } catch (err) {
    alert('Error al eliminar: ' + err.message);
  }
};
</script>