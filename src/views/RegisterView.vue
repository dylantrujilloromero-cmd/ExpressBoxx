<template>
  <main class="seccion-gris py-5">
    <div class="container">
      <div class="contenedor-formulario formulario-ancho">
        <div class="text-center">
          <h1>Crear cuenta</h1>
          <p class="subtitulo">Regístrate para cotizar, comprar y reservar tus actividades.</p>
        </div>

        <div v-if="mensaje" class="alert alert-success text-center">{{ mensaje }}</div>
        <div v-if="error" class="alert alert-danger text-center">{{ error }}</div>

        <form @submit.prevent="handleRegister">
          <h2 class="h6 border-bottom pb-2 mb-3 text-muted">Datos personales</h2>
          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <label class="form-label">Nombre</label>
              <input type="text" class="form-control" v-model="form.nombre" placeholder="Tu nombre" minlength="2" maxlength="50" required>
            </div>
            <div class="col-md-6">
              <label class="form-label">Apellido</label>
              <input type="text" class="form-control" v-model="form.apellido" placeholder="Tu apellido" minlength="2" maxlength="50" required>
            </div>
          </div>

          <h2 class="h6 border-bottom pb-2 mb-3 text-muted">Documento de identidad</h2>
          <div class="row g-3 mb-3">
            <div class="col-md-5">
              <label class="form-label">Tipo de documento</label>
              <select class="form-select" v-model="form.id_documento" required>
                <option value="" disabled>Selecciona...</option>
                <option value="1">Cédula de Ciudadanía</option>
                <option value="2">Tarjeta de Identidad</option>
                <option value="3">Pasaporte</option>
                <option value="4">Cédula de Extranjería</option>
                <option value="5">Registro Civil</option>
                <option value="6">NIT</option>
                <option value="7">Documento Nacional de Identidad</option>
                <option value="8">Carné de Extranjería</option>
                <option value="9">PEP</option>
                <option value="10">Permiso por Protección Temporal</option>
              </select>
            </div>
            <div class="col-md-7">
              <label class="form-label">Número de documento</label>
              <input type="text" class="form-control" v-model="form.identificacion_usuario" placeholder="Ej: 1020304050" minlength="5" maxlength="20" required>
            </div>
          </div>

          <h2 class="h6 border-bottom pb-2 mb-3 text-muted">Información de contacto</h2>
          <div class="mb-3">
            <label class="form-label">Correo electrónico</label>
            <input type="email" class="form-control" v-model="form.correo" placeholder="nombre@correo.com" maxlength="100" required>
          </div>

          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <label class="form-label">Teléfono</label>
              <input type="tel" class="form-control" v-model="form.telefono" placeholder="Ej: 3001234567" maxlength="15">
            </div>
            <div class="col-md-6">
              <label class="form-label">Fecha de nacimiento</label>
              <input type="date" class="form-control" v-model="form.fecha_de_nacimiento" required>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Dirección</label>
            <input type="text" class="form-control" v-model="form.direccion" placeholder="Ej: Calle 10 # 20-30" maxlength="150">
          </div>

          <h2 class="h6 border-bottom pb-2 mb-3 text-muted">Seguridad</h2>
          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <label class="form-label">Contraseña</label>
              <input :type="mostrarPassword ? 'text' : 'password'" class="form-control" v-model="form.clave" placeholder="Mínimo 6 caracteres" minlength="6" required>
            </div>
            <div class="col-md-6">
              <label class="form-label">Confirmar contraseña</label>
              <input :type="mostrarPassword ? 'text' : 'password'" class="form-control" v-model="form.confirmarClave" placeholder="Repite tu contraseña" minlength="6" required>
            </div>
          </div>

          <div class="form-check mb-3">
            <input class="form-check-input" type="checkbox" v-model="mostrarPassword" id="mostrarClaveReg">
            <label class="form-check-label" for="mostrarClaveReg">Mostrar contraseña</label>
          </div>

          <div class="form-check mb-4">
            <input class="form-check-input" type="checkbox" v-model="form.autorizacionDatos" id="autorizacionDatos" required>
            <label class="form-check-label" for="autorizacionDatos">
              Autorizo el tratamiento de mis datos personales conforme a la 
              <router-link to="/politica-privacidad">política de privacidad</router-link>.
            </label>
          </div>

          <button type="submit" class="btn btn-punto-primario w-100" :disabled="cargando">
            {{ cargando ? 'Registrando...' : 'Crear cuenta' }}
          </button>
        </form>

        <p class="text-center mt-4 mb-0">
          ¿Ya tienes cuenta?
          <router-link to="/login">Inicia sesión aquí</router-link>
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

const form = ref({
  nombre: '',
  apellido: '',
  id_documento: '1',
  identificacion_usuario: '',
  correo: '',
  telefono: '',
  fecha_de_nacimiento: '',
  direccion: '',
  clave: '',
  confirmarClave: '',
  autorizacionDatos: false
});

const mostrarPassword = ref(false);
const error = ref('');
const mensaje = ref('');
const cargando = ref(false);

const handleRegister = async () => {
  error.value = '';
  mensaje.value = '';

  if (form.value.clave !== form.value.confirmarClave) {
    error.value = 'Las contraseñas no coinciden.';
    return;
  }

  cargando.value = true;
  try {
    await authStore.register(form.value);
    mensaje.value = 'Registro exitoso. Ya puedes iniciar sesión con tu cuenta.';
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (err) {
    error.value = err.message || 'Error al procesar el registro.';
  } finally {
    cargando.value = false;
  }
};
</script>
