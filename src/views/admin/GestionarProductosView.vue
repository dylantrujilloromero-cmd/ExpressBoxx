<template>
  <main class="seccion-gris py-5">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h1 class="h3 mb-1">Gestionar productos</h1>
          <p class="text-secondary mb-0">Administra los productos disponibles en el catálogo.</p>
        </div>
        <div class="d-flex gap-2">
          <input type="text" v-model="busqueda" class="form-control" placeholder="Buscar por descripción..." style="max-width: 250px;">
          <button class="btn btn-punto-primario text-nowrap" @click="abrirCrear">+ Nuevo Producto</button>
        </div>
      </div>

      <div class="table-responsive bg-white rounded p-3 border shadow-sm">
        <table class="table table-striped align-middle mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Estado</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in productosFiltrados" :key="p.idProducto">
              <td>{{ p.idProducto }}</td>
              <td class="fw-semibold">{{ p.descripcion }}</td>
              <td>${{ p.precio.toLocaleString() }}</td>
              <td><span class="badge bg-secondary">{{ p.categoria }}</span></td>
              <td>{{ p.stockActual }}</td>
              <td>
                <span class="badge" :class="p.estado ? 'bg-success' : 'bg-secondary'">
                  {{ p.estado ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>
                <div class="d-flex gap-1 justify-content-center">
                  <button class="btn btn-outline-primary btn-sm" @click="abrirEditar(p)">Editar</button>
                  <button class="btn btn-sm" :class="p.estado ? 'btn-outline-warning' : 'btn-outline-success'" @click="toggleEstado(p)">
                    {{ p.estado ? 'Inactivar' : 'Activar' }}
                  </button>
                  <button class="btn btn-danger btn-sm" @click="eliminar(p.idProducto)">Eliminar</button>
                </div>
              </td>
            </tr>
            <tr v-if="productosFiltrados.length === 0">
              <td colspan="7" class="text-center text-secondary py-4">No hay productos registrados.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Crear / Editar -->
      <div v-if="mostrarModal" class="modal d-block" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ modoEdicion ? 'Editar Producto' : 'Registrar Nuevo Producto' }}</h5>
              <button class="btn-close" @click="mostrarModal = false"></button>
            </div>
            <form @submit.prevent="guardarProducto">
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Descripción</label>
                  <input type="text" class="form-control" v-model="form.descripcion" required>
                </div>
                <div class="row g-3 mb-3">
                  <div class="col-md-6">
                    <label class="form-label">Precio</label>
                    <input type="number" step="0.01" class="form-control" v-model="form.precio" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Stock inicial</label>
                    <input type="number" class="form-control" v-model="form.stockActual" required>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Categoría</label>
                  <select class="form-select" v-model="form.idCatalogo" required>
                    <option value="">Seleccione una categoría</option>
                    <option v-for="cat in catalogos" :key="cat.idCatalogo" :value="cat.idCatalogo">
                      {{ cat.nombre }}
                    </option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">URL de imagen</label>
                  <input type="url" class="form-control" v-model="form.urlImagen" placeholder="https://...">
                </div>
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
import { ref, computed, onMounted } from 'vue';
import { productosService } from '../../services/productos.service';
import { catalogosService } from '../../services/catalogos.service';

const productos = ref([]);
const catalogos = ref([]);
const busqueda = ref('');
const mostrarModal = ref(false);
const modoEdicion = ref(false);

const form = ref({
  idProducto: null,
  descripcion: '',
  precio: 0,
  stockActual: 0,
  idCatalogo: '',
  urlImagen: ''
});

const cargarDatos = async () => {
  const [prods, cats] = await Promise.all([
    productosService.listar(),
    catalogosService.listar()
  ]);
  productos.value = prods;
  catalogos.value = cats;
};

onMounted(() => {
  cargarDatos();
});

const productosFiltrados = computed(() => {
  return productos.value.filter(p =>
    (p.descripcion || '').toLowerCase().includes(busqueda.value.toLowerCase())
  );
});

const abrirCrear = () => {
  modoEdicion.value = false;
  form.value = { idProducto: null, descripcion: '', precio: 0, stockActual: 0, idCatalogo: '', urlImagen: '' };
  mostrarModal.value = true;
};

const abrirEditar = (p) => {
  modoEdicion.value = true;
  form.value = { ...p };
  mostrarModal.value = true;
};

const guardarProducto = async () => {
  try {
    if (modoEdicion.value) {
      await productosService.actualizar(form.value);
    } else {
      await productosService.crear(form.value);
    }
    mostrarModal.value = false;
    await cargarDatos();
  } catch (err) {
    alert('Error al guardar producto: ' + err.message);
  }
};

const toggleEstado = async (p) => {
  try {
    await productosService.cambiarEstado(p.idProducto, !p.estado);
    p.estado = !p.estado;
  } catch (err) {
    alert('Error: ' + err.message);
  }
};

const eliminar = async (id) => {
  if (!confirm('¿Estás seguro de eliminar este producto?')) return;
  try {
    await productosService.eliminar(id);
    await cargarDatos();
  } catch (err) {
    alert('Error al eliminar: ' + err.message);
  }
};
</script>