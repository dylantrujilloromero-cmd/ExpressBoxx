<template>
  <div class="user-reservations-wrapper">
    <main class="mis-reservas">
      <h2 class="titulo-form">Mis reservas</h2>
      <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
      <p v-if="!cargandoLista && misReservas.length === 0" class="mensaje">No hay ningún registro de reservas.</p>

      <div class="table-scroll" v-if="misReservas.length > 0">
        <table class="crud-table">
          <thead>
            <tr>
              <th>Actividad</th>
              <th>Personas</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in misReservas" :key="r.idreserva">
              <td>{{ r.descripcionActividad }}</td>
              <td>
                <input v-if="r.puedeEditar" type="number" min="1" max="10" v-model="r.num_personas" required>
                <span v-else>{{ r.num_personas }}</span>
              </td>
              <td>
                <input v-if="r.puedeEditar" type="date" v-model="r.fecha" required>
                <span v-else>{{ r.fecha }}</span>
              </td>
              <td>
                <input v-if="r.puedeEditar" type="time" v-model="r.hora" required>
                <span v-else>{{ r.hora }}</span>
              </td>
              <td>{{ r.descripcionEstado }}</td>
              <td class="row-actions">
                <button v-if="r.puedeEditar" type="button" @click="handleActualizar(r)">Actualizar</button>
                <button v-if="r.puedeCancelar" type="button" @click="handleCancelar(r.idreserva)">Cancelar</button>
                <small v-if="!r.puedeEditar && !r.esCancelada">Solo puedes editar o cancelar con más de tres días de anticipación.</small>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <button type="button" class="nuevo-lapiz" id="abrirReserva" aria-label="Crear reserva" @click="mostrarModalReserva = true">&#9998;</button>

    <main id="nuevaReservaModal" class="Formulario modal-nueva-reserva" :class="{ 'activo': mostrarModalReserva }" :aria-hidden="(!mostrarModalReserva).toString()">
      <button type="button" class="cerrar-nueva-reserva" id="cerrarReserva" aria-label="Cerrar" @click="mostrarModalReserva = false">&times;</button>
      <h2 class="titulo-form">Reserva tu actividad</h2>
      <form id="reservaForm" @submit.prevent="abrirConfirmacionReserva">
        <section class="datos">
          <label>Nombre<input :value="authStore.profile?.nombre || ''" readonly></label>
          <label>Apellido<input :value="authStore.profile?.apellido || ''" readonly></label>
          <label>Tipo de documento<input :value="authStore.profile?.tipo_documento?.descripcion_doc || 'Cedula de ciudadania'" readonly></label>
          <label>Documento<input :value="authStore.profile?.documento || authStore.profile?.identificacion_usuario || ''" readonly></label>
          <label>Correo<input :value="authStore.profile?.correo || ''" readonly></label>
        </section>
        
        <label>Personas<input type="number" name="num_personas" min="1" max="10" v-model="form.num_personas" required></label>
        <label>Fecha<input type="date" name="fecha" v-model="form.fecha" :min="fechaMinima" required></label>
        <label>Hora<input type="time" name="hora" v-model="form.hora" required></label>
        <p class="mensaje">El cupo del local es de 30 personas. Las reservas deben hacerse con más de 3 días de anticipación. El pago se realiza en el establecimiento.</p>
        <label>Actividad
          <select name="Actividad_idActividad" v-model="form.actividad_idactividad" required>
            <option value="">Seleccione...</option>
            <option v-for="a in actividades" :key="a.idactividad" :value="a.idactividad">
              {{ a.descripcion_actividad }}
            </option>
          </select>
        </label>
        <button type="submit" id="abrirPago">Confirmar reserva</button>
      </form>
    </main>

    <div id="pagoModal" class="modal-dialog-custom" v-if="mostrarModalPago">
      <div class="caja">
        <h2>Confirmar reserva</h2>
        <p class="mensaje">No se realiza ningún cobro en línea. Al confirmar, tu reserva quedará registrada con pago pendiente.</p>
        <div class="acciones">
          <button type="button" id="cancelar" @click="mostrarModalPago = false">Cancelar</button>
          <button type="button" @click="handleCrearReserva" :disabled="cargandoForm">Registrar reserva</button>
        </div>
      </div>
    </div>

    <div id="exito" class="modal-dialog-custom" v-if="mostrarModalExito">
      <div class="caja">
        <h2>Reserva realizada</h2>
        <p>Tu reserva fue efectuada. El pago queda pendiente para realizarse en el establecimiento.</p>
        <button type="button" @click="cerrarExito">Aceptar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { reservasService } from '../services/reservas.service';
import { actividadesService } from '../services/actividades.service';

const authStore = useAuthStore();

const form = ref({
  actividad_idactividad: '',
  num_personas: 1,
  fecha: '',
  hora: '08:00:00'
});

const actividades = ref([]);
const misReservas = ref([]);

const mensaje = ref('');
const cargandoForm = ref(false);
const cargandoLista = ref(true);

const mostrarModalReserva = ref(false);
const mostrarModalPago = ref(false);
const mostrarModalExito = ref(false);

const fechaMinima = computed(() => {
  const fecha = new Date();
  fecha.setHours(0, 0, 0, 0);
  fecha.setDate(fecha.getDate() + 4);
  return fecha.toISOString().slice(0, 10);
});

onMounted(async () => {
  try {
    actividades.value = await actividadesService.listarPublicas();
  } catch (err) {
    console.error('Error al cargar actividades:', err);
  }
  await cargarMisReservas();
});

const cargarMisReservas = async () => {
  if (!authStore.idUsuario) return;
  cargandoLista.value = true;
  try {
    misReservas.value = await reservasService.listarPorUsuario(authStore.idUsuario);
  } catch (err) {
    console.error('Error al listar reservas:', err);
  } finally {
    cargandoLista.value = false;
  }
};

const handleCrearReserva = async () => {
  mensaje.value = '';
  cargandoForm.value = true;
  try {
    await reservasService.crearReserva({
      ...form.value,
      usuarios_idusuarios: authStore.idUsuario
    });
    mostrarModalPago.value = false;
    mostrarModalReserva.value = false;
    mostrarModalExito.value = true;
    form.value = { actividad_idactividad: '', num_personas: 1, fecha: '', hora: '08:00:00' };
    await cargarMisReservas();
  } catch (err) {
    alert(err.message || 'Error al procesar la reserva');
  } finally {
    cargandoForm.value = false;
  }
};

const abrirConfirmacionReserva = () => {
  mensaje.value = '';
  if (!form.value.fecha || !form.value.actividad_idactividad) {
    mensaje.value = 'Completa la fecha y la actividad antes de confirmar.';
    return;
  }
  mostrarModalPago.value = true;
};

const handleActualizar = async (r) => {
  try {
    await reservasService.actualizarReserva({
      idreserva: r.idreserva,
      num_personas: r.num_personas,
      fecha: r.fecha,
      hora: r.hora,
      usuarios_idusuarios: authStore.idUsuario,
      actividad_idactividad: r.actividad_idactividad
    });
    alert('Reserva actualizada correctamente');
    await cargarMisReservas();
  } catch (err) {
    alert('Error al actualizar reserva: ' + err.message);
  }
};

const handleCancelar = async (idReserva) => {
  if (!confirm('¿Está seguro de que desea cancelar esta reserva?')) return;
  try {
    await reservasService.cancelarReserva(idReserva, authStore.idUsuario);
    await cargarMisReservas();
  } catch (err) {
    alert('Error al cancelar reserva: ' + err.message);
  }
};

const cerrarExito = () => {
  mostrarModalExito.value = false;
};
</script>

<style scoped>
.user-reservations-wrapper {
  min-height: calc(100vh - 200px);
  padding-bottom: 3rem;
}
.mis-reservas { max-width: 1100px; margin: 40px auto 2rem; padding: 0 1rem; }
.titulo-form { color: #1f5936; margin-bottom: 1.5rem; font-weight: 600; }
.mensaje { background: #e7f4ec; color: #1f5936; padding: 12px; border-radius: 6px; margin-bottom: 1rem; }
.nuevo-lapiz { position: fixed; right: 1.5rem; bottom: 1.5rem; z-index: 20; width: 54px; height: 54px; border: 0; border-radius: 50%; background: #166534; color: #fff; font-size: 1.6rem; cursor: pointer; box-shadow: 0 4px 12px #0005; }
.modal-nueva-reserva { display: none; position: fixed; inset: 0; z-index: 1050; overflow: auto; margin: 0; padding: 4rem max(1rem, calc((100vw - 700px) / 2)); background: rgba(0,0,0,.55); }
.modal-nueva-reserva.activo { display: block; }
.modal-nueva-reserva > form, .modal-nueva-reserva > .titulo-form, .modal-nueva-reserva > section, .modal-nueva-reserva > label { background: #fff; }
.modal-nueva-reserva form { padding: 24px; border-radius: 8px; }
.modal-nueva-reserva form label { display: block; margin-bottom: 12px; font-weight: 500; color: #24312b; }
.modal-nueva-reserva form input, .modal-nueva-reserva form select { width: 100%; padding: 8px 12px; margin-top: 4px; border: 1px solid #dde3e0; border-radius: 4px; }
.modal-nueva-reserva form button[type="submit"] { background: #2f7a4d; color: white; border: none; padding: 10px 20px; border-radius: 4px; width: 100%; margin-top: 16px; font-weight: 600; cursor: pointer; }
.modal-nueva-reserva .datos { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
.cerrar-nueva-reserva { position: fixed; top: 1rem; right: 1.5rem; z-index: 1060; border: 0; border-radius: 50%; width: 40px; height: 40px; font-size: 1.8rem; cursor: pointer; background: #fff; color: #333; }
.modal-dialog-custom { z-index: 3000; position: fixed; inset: 0; background: rgba(0,0,0,0.55); display: flex; align-items: center; justify-content: center; }
.modal-dialog-custom .caja { background: white; padding: 30px; border-radius: 12px; max-width: 450px; text-align: center; }
.modal-dialog-custom .acciones { display: flex; justify-content: center; gap: 12px; margin-top: 20px; }
.modal-dialog-custom .acciones button { padding: 8px 16px; border-radius: 4px; border: none; cursor: pointer; font-weight: 500; }
.modal-dialog-custom .acciones button:first-child { background: #dde3e0; color: #333; }
.modal-dialog-custom .acciones button:last-child { background: #2f7a4d; color: white; }
@media (max-width: 700px) { .mis-reservas { margin-top: 20px; } .mis-reservas .crud-table { font-size: .85rem; } .modal-nueva-reserva { padding: 4.5rem 1rem 2rem; } .modal-nueva-reserva .datos { grid-template-columns: 1fr; } }
</style>
