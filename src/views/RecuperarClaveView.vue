<template>
  <main class="seccion-gris py-5">
    <div class="container">
      <div class="contenedor-formulario text-center">
        <div class="mb-3">
          <span style="font-size: 3rem;">🔒</span>
        </div>
        <h1>Recuperar contraseña</h1>
        <p class="subtitulo">Ingresa tu correo electrónico registrado para enviarte un enlace de recuperación.</p>

        <div v-if="mensaje" class="alert alert-success">{{ mensaje }}</div>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <form @submit.prevent="handleRecuperar">
          <div class="mb-3 text-start">
            <label class="form-label">Correo electrónico</label>
            <input type="email" class="form-control" v-model="correo" placeholder="ejemplo@correo.com" required>
          </div>

          <button type="submit" class="btn btn-punto-primario w-100" :disabled="cargando">
            {{ cargando ? 'Enviando...' : 'Enviar enlace de recuperación' }}
          </button>
        </form>

        <p class="text-center mt-4 mb-0">
          ¿Recordaste tu contraseña? 
          <router-link to="/login">Inicia sesión</router-link>
        </p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';

const correo = ref('');
const mensaje = ref('');
const error = ref('');
const cargando = ref(false);

const handleRecuperar = () => {
  cargando.value = true;
  setTimeout(() => {
    mensaje.value = 'Se ha enviado un enlace de recuperación a ' + correo.value;
    cargando.value = false;
  }, 1000);
};
</script>