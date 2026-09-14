<template>
  <main class="seccion-gris py-5">
    <div class="container">
      <div class="contenedor-formulario">
        <h1 class="h4 mb-2 text-danger">Soporte de Acceso a Cuenta</h1>
        <p class="text-secondary mb-4">Si tu cuenta fue desactivada o tienes problemas para ingresar, déjanos tus datos.</p>

        <div v-if="mensaje" class="alert alert-success">{{ mensaje }}</div>

        <form @submit.prevent="enviarSolicitud">
          <div class="mb-3">
            <label class="form-label">Correo de tu cuenta</label>
            <input type="email" class="form-control" v-model="correo" placeholder="correo@ejemplo.com" required>
          </div>

          <div class="mb-3">
            <label class="form-label">Asunto</label>
            <input type="text" class="form-control" v-model="asunto" placeholder="Reactiva mi cuenta..." required>
          </div>

          <div class="mb-4">
            <label class="form-label">Descripción</label>
            <textarea class="form-control" rows="4" v-model="cuerpo" placeholder="Explica la situación..." required></textarea>
          </div>

          <div class="d-flex gap-2">
            <router-link to="/login" class="btn btn-secondary flex-fill">Volver al login</router-link>
            <button type="submit" class="btn btn-punto-primario flex-fill" :disabled="cargando">
              {{ cargando ? 'Enviando...' : 'Enviar solicitud' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { soporteService } from '../services/soporte.service';

const correo = ref('');
const asunto = ref('Solicitud de reactivación de cuenta');
const cuerpo = ref('');
const mensaje = ref('');
const cargando = ref(false);

const enviarSolicitud = async () => {
  cargando.value = true;
  try {
    await soporteService.enviarTicket({
      correo: correo.value,
      asunto: asunto.value,
      mensaje: cuerpo.value,
      tipo: 'Acceso'
    });
    mensaje.value = 'Solicitud enviada al administrador. Recibirás respuesta en tu correo.';
  } finally {
    cargando.value = false;
  }
};
</script>