<template>
  <main>
    <section class="hero-punto">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-7">
            <template v-if="authStore.isAuthenticated">
              <h1 class="display-6 fw-bold">Bienvenido a Punto Cajas, {{ authStore.profile?.nombre }}</h1>
              <p class="lema fs-5">"Donde cada caja encaja contigo."</p>
              <p class="text-secondary">En Punto Cajas puedes solicitar cotizaciones según las medidas, color y acabado que necesites, realizar compras, reservar actividades y recibir atención cuando la necesites.</p>
              <div class="d-flex gap-3 mt-4 flex-wrap">
                <router-link to="/cotizar" class="btn btn-punto-primario btn-lg px-4">Cotizar ahora</router-link>
                <router-link to="/catalogo" class="btn btn-punto-secundario btn-lg px-4">Ver catálogo</router-link>
                <router-link to="/reservas" class="btn btn-punto-primario btn-lg px-4">Reservas</router-link>
              </div>
            </template>
            <template v-else>
              <h1 class="display-6 fw-bold">Bienvenido a Punto Cajas</h1>
              <p class="lema fs-5">"Donde cada caja encaja contigo."</p>
              <p class="text-secondary">En Punto Cajas puedes consultar nuestro catálogo y solicitar una cotización según las medidas, color y acabado que necesites.</p>
              <div class="d-flex gap-3 mt-4 flex-wrap">
                <router-link to="/catalogo" class="btn btn-punto-primario btn-lg px-4">Ver catálogo</router-link>
                <router-link to="/login" class="btn btn-punto-secundario btn-lg px-4">Iniciar sesión</router-link>
                <router-link to="/registro" class="btn btn-punto-secundario btn-lg px-4">Registrarse</router-link>
              </div>
            </template>

            <div class="franja-cajas">
              <span class="caja-decorativa"></span>
              <span class="caja-decorativa"></span>
              <span class="caja-decorativa"></span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="seccion-gris">
      <div class="container">
        <h2 class="text-center mb-5">¿Qué puedes hacer en Punto Cajas?</h2>
        <div class="row g-4">
          <div class="col-md-3 col-sm-6">
            <div class="tarjeta-servicio">
              <div class="icono-servicio">📐</div>
              <h3 class="h5">Cotizaciones</h3>
              <p class="text-secondary mb-0">Indica cantidad, medidas, color y acabado de la caja que necesitas.</p>
            </div>
          </div>
          <div class="col-md-3 col-sm-6">
            <div class="tarjeta-servicio">
              <div class="icono-servicio">📦</div>
              <h3 class="h5">Catálogo</h3>
              <p class="text-secondary mb-0">Consulta nuestros productos disponibles y conoce sus características.</p>
            </div>
          </div>
          <div class="col-md-3 col-sm-6">
            <div class="tarjeta-servicio">
              <div class="icono-servicio">🛒</div>
              <h3 class="h5">Compras</h3>
              <p class="text-secondary mb-0">Agrega productos al carrito y realiza tu pedido fácilmente.</p>
            </div>
          </div>
          <div class="col-md-3 col-sm-6">
            <div class="tarjeta-servicio">
              <div class="icono-servicio">🏋️</div>
              <h3 class="h5">Reservas</h3>
              <p class="text-secondary mb-0">Reserva actividades y talleres de acondicionamiento y empaque.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();
</script>
