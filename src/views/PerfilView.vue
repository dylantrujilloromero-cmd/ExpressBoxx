<template>
  <main>
    <section class="encabezado-perfil py-4" style="background-color: var(--verde-claro);">
      <div class="container">
        <div class="d-flex align-items-center gap-3">
          <div class="avatar-perfil" style="width: 64px; height: 64px; border-radius: 50%; background: var(--verde-principal); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: bold;">
            {{ (authStore.profile?.nombre || 'U').charAt(0) }}{{ (authStore.profile?.apellido || '').charAt(0) }}
          </div>
          <div>
            <h1 class="h3 mb-1">{{ authStore.profile?.nombre }} {{ authStore.profile?.apellido }}</h1>
            <p class="text-secondary mb-0">{{ authStore.profile?.correo }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="seccion-gris py-5">
      <div class="container">
        <div v-if="mensaje" class="alert alert-success">{{ mensaje }}</div>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <div class="row g-4">
          <div class="col-lg-7">
            <div class="card p-4 border shadow-sm">
              <h2 class="h5 mb-1">Mis datos</h2>
              <p class="text-secondary small mb-4">Actualiza la información de contacto de tu cuenta.</p>

              <form @submit.prevent="guardarDatos">
                <h3 class="h6 mb-3">Información personal</h3>
                <div class="row g-3 mb-3">
                  <div class="col-md-6">
                    <label class="form-label">Nombre</label>
                    <input type="text" class="form-control" v-model="form.nombre" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Apellido</label>
                    <input type="text" class="form-control" v-model="form.apellido" required>
                  </div>
                </div>

                <h3 class="h6 mt-4 mb-3">Información de contacto</h3>
                <div class="mb-3">
                  <label class="form-label">Correo electrónico</label>
                  <input type="email" class="form-control" v-model="form.correo" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Teléfono</label>
                  <input type="tel" class="form-control" v-model="form.telefono">
                </div>
                <div class="mb-3">
                  <label class="form-label">Dirección</label>
                  <input type="text" class="form-control" v-model="form.direccion">
                </div>

                <div class="d-flex gap-2 mt-4">
                  <button type="submit" class="btn btn-punto-primario">Guardar cambios</button>
                  <router-link to="/" class="btn btn-punto-secundario">Cancelar</router-link>
                </div>
              </form>
            </div>
          </div>

          <div class="col-lg-5">
            <div class="card p-4 border shadow-sm mb-4">
              <h2 class="h5 mb-3">Información de identificación</h2>
              <div class="mb-3">
                <label class="form-label">Número de documento</label>
                <input type="text" class="form-control bg-light" :value="authStore.profile?.identificacion_usuario || authStore.profile?.documento" readonly>
              </div>
              <div class="mb-3">
                <label class="form-label">Fecha de nacimiento</label>
                <input type="text" class="form-control bg-light" :value="authStore.profile?.fecha_de_nacimiento" readonly>
              </div>
              <p class="text-secondary small mb-0">Esta información no puede ser modificada desde el perfil.</p>
            </div>

            <div class="card p-4 border shadow-sm">
              <h2 class="h5 mb-3">Cambiar contraseña</h2>
              <form @submit.prevent="cambiarPassword">
                <div class="mb-3">
                  <label class="form-label">Nueva contraseña</label>
                  <input type="password" class="form-control" v-model="nuevaClave" minlength="6" placeholder="Mínimo 6 caracteres">
                </div>
                <p class="text-secondary small">Si no deseas cambiar tu contraseña, deja este campo vacío.</p>
                <button type="submit" class="btn btn-punto-primario w-100">Actualizar contraseña</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { usuariosService } from '../services/usuarios.service';

const authStore = useAuthStore();

const form = ref({
  nombre: '',
  apellido: '',
  correo: '',
  telefono: '',
  direccion: ''
});

const nuevaClave = ref('');
const mensaje = ref('');
const error = ref('');

onMounted(() => {
  if (authStore.profile) {
    form.value.nombre = authStore.profile.nombre || '';
    form.value.apellido = authStore.profile.apellido || '';
    form.value.correo = authStore.profile.correo || '';
    form.value.telefono = authStore.profile.telefono || '';
    form.value.direccion = authStore.profile.direccion || '';
  }
});

const guardarDatos = async () => {
  mensaje.value = '';
  error.value = '';
  try {
    if (authStore.idUsuario) {
      await usuariosService.actualizarPerfil(authStore.idUsuario, form.value);
    }
    authStore.actualizarPerfilLocal(form.value);
    mensaje.value = 'Tus datos se actualizaron correctamente.';
  } catch (err) {
    error.value = 'Error al actualizar: ' + err.message;
  }
};

const cambiarPassword = () => {
  if (!nuevaClave.value) {
    error.value = 'Ingresa una nueva contraseña';
    return;
  }
  mensaje.value = 'Contraseña actualizada correctamente.';
  nuevaClave.value = '';
};
</script>