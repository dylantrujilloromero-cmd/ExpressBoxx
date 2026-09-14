<template>
  <main class="d-flex align-items-center seccion-gris py-5">
    <div class="container">
      <div class="contenedor-formulario">
        <h1>Iniciar sesión</h1>
        <p class="subtitulo">Ingresa con tu correo y contraseña registrados</p>

        <div v-if="mensaje" class="alert alert-success text-center" role="alert">
          {{ mensaje }}
        </div>

        <div v-if="error" class="alert alert-danger text-center" role="alert">
          {{ error }}
          <div v-if="esInactiva" class="text-center mt-3">
            <p class="mb-2">¿Necesitas contactar al administrador?</p>
            <router-link to="/soporte-acceso" class="btn btn-punto-secundario btn-sm">Solicitar soporte</router-link>
          </div>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="correo" class="form-label">Correo</label>
            <input type="email" v-model="correo" id="correo" class="form-control" placeholder="ejemplo@correo.com" required>
          </div>

          <div class="mb-3">
            <label for="clave" class="form-label">Contraseña</label>
            <input :type="mostrarPassword ? 'text' : 'password'" v-model="clave" id="clave" class="form-control" placeholder="Ingresa tu contraseña" required>
          </div>

          <div class="form-check mb-3">
            <input class="form-check-input" type="checkbox" v-model="mostrarPassword" id="mostrarContrasena">
            <label class="form-check-label" for="mostrarContrasena">Mostrar contraseña</label>
          </div>

          <div class="d-flex justify-content-between align-items-center mb-4">
            <router-link to="/recuperar-clave" class="small">¿Olvidaste tu contraseña?</router-link>
          </div>

          <button type="submit" class="btn btn-punto-primario w-100" :disabled="cargando">
            {{ cargando ? 'Iniciando...' : 'Iniciar sesión' }}
          </button>
        </form>

        <p class="text-center mt-4 mb-0">
          ¿Aún no tienes cuenta? 
          <router-link to="/registro">Regístrate aquí</router-link>
        </p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const correo = ref('');
const clave = ref('');
const mostrarPassword = ref(false);
const error = ref('');
const mensaje = ref('');
const esInactiva = ref(false);
const cargando = ref(false);

const handleLogin = async () => {
  error.value = '';
  mensaje.value = '';
  cargando.value = true;
  try {
    const res = await authStore.login(correo.value, clave.value);
    if (res.profile.id_rol === 1 || res.profile.id_rol === 3) {
      router.push('/admin');
    } else {
      router.push('/');
    }
  } catch (err) {
    error.value = err.message || 'Error al iniciar sesión';
    if (err.message.includes('inactiva')) {
      esInactiva.value = true;
    }
  } finally {
    cargando.value = false;
  }
};
</script>
