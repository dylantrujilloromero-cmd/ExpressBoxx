import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import PerfilView from '../views/PerfilView.vue';
import CatalogoView from '../views/CatalogoView.vue';
import DetalleProductoView from '../views/DetalleProductoView.vue';
import CarritoView from '../views/CarritoView.vue';
import PagoView from '../views/PagoView.vue';
import FacturaView from '../views/FacturaView.vue';
import CotizacionView from '../views/CotizacionView.vue';
import RecuperarClaveView from '../views/RecuperarClaveView.vue';
import SoporteView from '../views/SoporteView.vue';
import SoporteAccesoView from '../views/SoporteAccesoView.vue';
import PoliticaPrivacidadView from '../views/PoliticaPrivacidadView.vue';
import TerminosCondicionesView from '../views/TerminosCondicionesView.vue';
import ReservasView from '../views/ReservasView.vue';

// Admin
import PanelAdminView from '../views/admin/PanelAdminView.vue';
import GestionarUsuariosView from '../views/admin/GestionarUsuariosView.vue';
import GestionarProductosView from '../views/admin/GestionarProductosView.vue';
import GestionarCatalogosView from '../views/admin/GestionarCatalogosView.vue';
import GestionarCotizacionesView from '../views/admin/GestionarCotizacionesView.vue';
import GestionarVentasView from '../views/admin/GestionarVentasView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/registro', name: 'registro', component: RegisterView },
  { path: '/perfil', name: 'perfil', component: PerfilView, meta: { requiresAuth: true } },
  { path: '/catalogo', name: 'catalogo', component: CatalogoView },
  { path: '/catalogo/:id', name: 'detalle-producto', component: DetalleProductoView },
  { path: '/carrito', name: 'carrito', component: CarritoView },
  { path: '/pago', name: 'pago', component: PagoView, meta: { requiresAuth: true } },
  { path: '/factura', name: 'factura', component: FacturaView },
  { path: '/cotizar', name: 'cotizar', component: CotizacionView },
  { path: '/recuperar-clave', name: 'recuperar-clave', component: RecuperarClaveView },
  { path: '/soporte', name: 'soporte', component: SoporteView, meta: { requiresAuth: true } },
  { path: '/soporte-acceso', name: 'soporte-acceso', component: SoporteAccesoView },
  { path: '/politica-privacidad', name: 'politica-privacidad', component: PoliticaPrivacidadView },
  { path: '/terminos-condiciones', name: 'terminos-condiciones', component: TerminosCondicionesView },
  { path: '/reservas', name: 'reservas', component: ReservasView, meta: { requiresAuth: true } },

  // Rutas de administración
  { path: '/admin', name: 'admin-panel', component: PanelAdminView, meta: { requiresAdminOrSeller: true } },
  { path: '/admin/usuarios', name: 'admin-usuarios', component: GestionarUsuariosView, meta: { requiresAdmin: true } },
  { path: '/admin/productos', name: 'admin-productos', component: GestionarProductosView, meta: { requiresAdminOrSeller: true } },
  { path: '/admin/catalogos', name: 'admin-catalogos', component: GestionarCatalogosView, meta: { requiresAdminOrSeller: true } },
  { path: '/admin/cotizaciones', name: 'admin-cotizaciones', component: GestionarCotizacionesView, meta: { requiresAdmin: true } },
  { path: '/admin/ventas', name: 'admin-ventas', component: GestionarVentasView, meta: { requiresAdmin: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ path: '/login' });
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next({ path: '/' });
  }

  if (to.meta.requiresAdminOrSeller && !authStore.isAdminOrVendedor) {
    return next({ path: '/' });
  }

  next();
});

export default router;
