<template>
  <main class="seccion-gris py-5">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h1 class="h3 mb-1">Gestionar usuarios</h1>
          <p class="text-secondary mb-0">Consulta y administra el estado de los usuarios registrados.</p>
        </div>
        <div class="input-group" style="max-width: 300px;">
          <input type="text" v-model="busqueda" class="form-control" placeholder="Buscar por correo...">
        </div>
      </div>

      <div class="table-responsive bg-white rounded p-3 border shadow-sm">
        <table class="table table-striped align-middle mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Documento</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Estado</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in usuariosFiltrados" :key="u.id_usuario">
              <td>{{ u.id_usuario }}</td>
              <td>{{ u.nombre }} {{ u.apellido }}</td>
              <td>{{ u.identificacion_usuario }}</td>
              <td>{{ u.correo }}</td>
              <td>{{ u.telefono || 'N/A' }}</td>
              <td>
                <span class="badge bg-secondary">{{ u.roles?.nombre || (u.id_rol === 1 ? 'Admin' : 'Cliente') }}</span>
              </td>
              <td>
                <span class="badge" :class="u.estado ? 'bg-success' : 'bg-danger'">
                  {{ u.estado ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="text-center">
                <button class="btn btn-sm" :class="u.estado ? 'btn-outline-danger' : 'btn-outline-success'" @click="toggleEstado(u)">
                  {{ u.estado ? 'Inactivar' : 'Activar' }}
                </button>
              </td>
            </tr>
            <tr v-if="usuariosFiltrados.length === 0">
              <td colspan="8" class="text-center text-secondary py-4">No se encontraron usuarios.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { usuariosService } from '../../services/usuarios.service';

const usuarios = ref([]);
const busqueda = ref('');

const cargarUsuarios = async () => {
  usuarios.value = await usuariosService.listar();
};

onMounted(() => {
  cargarUsuarios();
});

const usuariosFiltrados = computed(() => {
  return usuarios.value.filter(u => 
    (u.correo || '').toLowerCase().includes(busqueda.value.toLowerCase()) ||
    (u.nombre || '').toLowerCase().includes(busqueda.value.toLowerCase())
  );
});

const toggleEstado = async (u) => {
  try {
    await usuariosService.cambiarEstado(u.id_usuario, !u.estado);
    u.estado = !u.estado;
  } catch (err) {
    alert('Error al cambiar estado: ' + err.message);
  }
};
</script>