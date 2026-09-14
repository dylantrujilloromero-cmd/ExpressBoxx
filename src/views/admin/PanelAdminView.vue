<template>
  <main class="seccion-gris py-5">
    <div class="container">
      <h1 class="h3 mb-1">Panel de administración</h1>
      <p class="text-secondary mb-5">Selecciona la sección que deseas gestionar.</p>

      <div class="row g-4">
        <!-- GESTIONAR USUARIOS -->
        <div v-if="authStore.isAdmin" class="col-md-6 col-lg-4">
          <div class="tarjeta-servicio">
            <div class="icono-servicio">👤</div>
            <h2 class="h5">Gestionar usuarios</h2>
            <p class="text-secondary">Consulta, activa o inactiva las cuentas registradas.</p>
            <router-link class="btn btn-punto-primario" to="/admin/usuarios">Ir a usuarios</router-link>
          </div>
        </div>

        <!-- GESTIONAR COTIZACIONES -->
        <div v-if="authStore.isAdmin" class="col-md-6 col-lg-4">
          <div class="tarjeta-servicio">
            <div class="icono-servicio">📄</div>
            <h2 class="h5">Gestionar cotizaciones</h2>
            <p class="text-secondary">Consulta y administra las cotizaciones de los clientes.</p>
            <router-link class="btn btn-punto-primario" to="/admin/cotizaciones">Ir a cotizaciones</router-link>
          </div>
        </div>

        <!-- GESTIONAR PRODUCTOS -->
        <div v-if="authStore.isAdminOrVendedor" class="col-md-6 col-lg-4">
          <div class="tarjeta-servicio">
            <div class="icono-servicio">📦</div>
            <h2 class="h5">Gestionar productos</h2>
            <p class="text-secondary">Administra los productos disponibles en inventario.</p>
            <router-link class="btn btn-punto-primario" to="/admin/productos">Ir a productos</router-link>
          </div>
        </div>

        <!-- GESTIONAR CATALOGOS -->
        <div v-if="authStore.isAdminOrVendedor" class="col-md-6 col-lg-4">
          <div class="tarjeta-servicio">
            <div class="icono-servicio">📁</div>
            <h2 class="h5">Gestionar catálogos</h2>
            <p class="text-secondary">Crea las categorías que agrupan los productos del catálogo.</p>
            <router-link class="btn btn-punto-primario" to="/admin/catalogos">Ir a catálogos</router-link>
          </div>
        </div>

        <!-- GESTIONAR VENTAS -->
        <div v-if="authStore.isAdmin" class="col-md-6 col-lg-4">
          <div class="tarjeta-servicio">
            <div class="icono-servicio">📜</div>
            <h2 class="h5">Gestionar ventas</h2>
            <p class="text-secondary">Consulta los pedidos, pagos y facturas generadas.</p>
            <router-link class="btn btn-punto-primario" to="/admin/ventas">Ir a ventas</router-link>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { useAuthStore } from '../../stores/authStore';

const authStore = useAuthStore();
</script>