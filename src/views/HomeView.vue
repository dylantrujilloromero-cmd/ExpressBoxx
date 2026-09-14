<template>
  <main>
    <section class="hero-punto">
      <div class="container position-relative z-1">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <p class="lema mb-2">CATEGORÍAS DESTACADAS</p>
            <h1 class="mb-3">Cajas Personalizadas</h1>
            <p class="fs-5 mb-4">Diseña tus cajas con las medidas exactas, colores y acabados que necesites. Encuentra la solución perfecta para tus necesidades de empaque.</p>
            <router-link to="/catalogo" class="btn btn-punto-primario btn-lg px-5">IR AL CATÁLOGO</router-link>
          </div>
        </div>
      </div>
    </section>

    <section class="seccion-destacados">
      <div class="container">
        <h2>Artículos Destacados</h2>
        <div class="row g-4">
          <div class="col-md-4 col-sm-6">
            <div class="producto-destacado-card">
              <img src="/img/caja_de_almacenamiento.jpg" :alt="`Caja Premium`" class="img-fluid">
              <p class="text-white fw-bold mb-2">Caja Premium</p>
              <p class="text-muted small">Desde $50.00</p>
            </div>
          </div>
          <div class="col-md-4 col-sm-6">
            <div class="producto-destacado-card">
              <img src="/img/caja_feliz_cumple.jpg" :alt="`Caja Estándar`" class="img-fluid">
              <p class="text-white fw-bold mb-2">Caja Estándar</p>
              <p class="text-muted small">Desde $30.00</p>
            </div>
          </div>
          <div class="col-md-4 col-sm-6">
            <div class="producto-destacado-card">
              <img src="/img/cajas_para_zapatos.jpg" :alt="`Caja Económica`" class="img-fluid">
              <p class="text-white fw-bold mb-2">Caja Económica</p>
              <p class="text-muted small">Desde $15.00</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="seccion-gris">
      <div class="container">
        <h2 class="text-center mb-5">¿Qué puedes hacer en ExpressBoxx?</h2>
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
