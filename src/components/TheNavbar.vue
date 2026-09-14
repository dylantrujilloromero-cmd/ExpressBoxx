<template>
  <nav class="navbar navbar-expand-md navbar-punto py-3">
    <div class="container">
      <router-link class="navbar-brand" to="/">
        <svg class="logo-caja" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
          <path d="M3 7l9-4 9 4-9 4-9-4z"/>
          <path d="M3 7v10l9 4 9-4V7"/>
          <path d="M12 11v10"/>
        </svg>
        ExpressBoxx
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuPrincipal" aria-controls="menuPrincipal" aria-expanded="false" aria-label="Mostrar menú">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="menuPrincipal">
        <ul class="navbar-nav ms-auto align-items-md-center gap-md-2">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Inicio</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/catalogo">Catálogo</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/cotizar">Cotizar</router-link>
          </li>

          <template v-if="authStore.isAuthenticated">
            <li class="nav-item">
              <router-link class="nav-link" to="/reservas">Reservas</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/soporte">Soporte</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link position-relative" to="/carrito">
                Carrito
                <span v-if="carritoStore.totalItems > 0" class="badge rounded-pill bg-success ms-1">
                  {{ carritoStore.totalItems }}
                </span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/perfil">Mi perfil</router-link>
            </li>
            <li v-if="authStore.isAdminOrVendedor" class="nav-item">
              <router-link class="nav-link" to="/admin">Administración</router-link>
            </li>
            <li class="nav-item ms-md-3">
              <span class="nav-link">Hola, <strong>{{ authStore.profile?.nombre }}</strong></span>
            </li>
            <li class="nav-item">
              <button class="btn btn-punto-secundario btn-sm" @click="handleLogout">Cerrar sesión</button>
            </li>
          </template>

          <template v-else>
            <li class="nav-item">
              <router-link class="nav-link position-relative" to="/carrito">
                Carrito
                <span v-if="carritoStore.totalItems > 0" class="badge rounded-pill bg-success ms-1">
                  {{ carritoStore.totalItems }}
                </span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="btn btn-punto-primario btn-sm" to="/login">Iniciar sesión</router-link>
            </li>
            <li class="nav-item">
              <router-link class="btn btn-punto-secundario btn-sm" to="/registro">Registrarse</router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore';
import { useCarritoStore } from '../stores/carritoStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const carritoStore = useCarritoStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
