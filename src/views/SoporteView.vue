<template>
  <main class="seccion-gris py-5">
    <div class="container">
      <div class="contenedor-formulario formulario-ancho">
        <div class="text-center mb-4">
          <span style="font-size: 2.5rem;">🎧</span>
          <h1 class="h3 mt-2">Centro de Soporte</h1>
          <p class="text-secondary">¿Tienes dudas o problemas con tus pedidos o reservas? Envíanos un mensaje.</p>
        </div>

        <div v-if="mensaje" class="alert alert-success">{{ mensaje }}</div>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <form @submit.prevent="enviarTicket">
          <div class="mb-3">
            <label class="form-label">Correo de contacto</label>
            <input type="email" class="form-control bg-light" :value="authStore.profile?.correo" readonly>
          </div>

          <div class="mb-3">
            <label class="form-label">Asunto</label>
            <input type="text" class="form-control" v-model="asunto" placeholder="Ej: Consulta sobre el pedido #102" maxlength="100" required>
          </div>

          <div class="mb-3">
            <label class="form-label">Mensaje</label>
            <textarea class="form-control" rows="6" v-model="cuerpo" maxlength="1000" placeholder="Escribe aquí tu consulta detalladamente..." required></textarea>
            <div class="text-end text-secondary small mt-1">{{ cuerpo.length }} / 1000</div>
          </div>

          <button type="submit" class="btn btn-punto-primario w-100" :disabled="cargando">
            {{ cargando ? 'Enviando...' : 'Enviar mensaje a soporte' }}
          </button>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { soporteService } from '../services/soporte.service';

const authStore = useAuthStore();
const asunto = ref('');
const cuerpo = ref('');
const mensaje = ref('');
const error = ref('');
const cargando = ref(false);

const enviarTicket = async () => {
  error.value = '';
  mensaje.value = '';
  cargando.value = true;
  try {
    await soporteService.enviarTicket({
      correo: authStore.profile?.correo || 'cliente@correo.com',
      asunto: asunto.value,
      mensaje: cuerpo.value,
      idUsuario: authStore.idUsuario,
      tipo: 'General'
    });
    mensaje.value = 'Tu mensaje ha sido enviado al equipo de soporte. Te responderemos a la brevedad.';
    asunto.value = '';
    cuerpo.value = '';
  } catch (err) {
    error.value = err.message || 'Error al enviar ticket';
  } finally {
    cargando.value = false;
  }
};
</script>