<template>
  <main>
    <section class="seccion-gris py-5">
      <div class="container">
        <h1 class="h3 mb-1">Catálogo de productos</h1>
        <p class="text-secondary mb-4">Elige tus cajas y agrégalas al carrito.</p>

        <div class="row g-2 mb-4">
          <div class="col-md-8">
            <input type="text" v-model="busqueda" class="form-control" placeholder="Buscar producto por nombre...">
          </div>
          <div class="col-md-4">
            <select v-model="filtroCategoria" class="form-select">
              <option value="">Todas las categorías</option>
              <option v-for="cat in categorias" :key="cat.idCatalogo" :value="cat.nombre">
                {{ cat.nombre }}
              </option>
            </select>
          </div>
        </div>

        <div v-if="cargando" class="text-center py-5 text-secondary">
          Cargando catálogo...
        </div>

        <div v-else class="row g-4">
          <div v-for="p in productosFiltrados" :key="p.idProducto" class="col-sm-6 col-lg-4">
            <div class="card h-100 shadow-sm border-0">
              <router-link :to="'/catalogo/' + p.idProducto">
                <img :src="p.urlImagen" class="card-img-top" :alt="p.descripcion" style="height: 200px; object-fit: cover;">
              </router-link>
              <div class="card-body d-flex flex-column">
                <span v-if="p.categoria" class="badge bg-secondary align-self-start mb-1">{{ p.categoria }}</span>
                <h2 class="h6">
                  <router-link :to="'/catalogo/' + p.idProducto" class="text-decoration-none text-dark">
                    {{ p.descripcion }}
                  </router-link>
                </h2>
                <p class="text-secondary mb-1">Stock disponible: {{ p.stockActual }}</p>
                <p class="fw-bold mb-3 text-success fs-5">${{ p.precio.toLocaleString() }}</p>

                <div class="mt-auto">
                  <div class="input-group mb-2" style="max-width: 140px; margin: 0 auto;">
                    <button type="button" class="btn btn-outline-secondary px-2" @click="cambiarCantidad(p.idProducto, -1)">-</button>
                    <input type="number" :value="cantidades[p.idProducto] || 1" min="1" :max="p.stockActual" class="form-control text-center" readonly>
                    <button type="button" class="btn btn-outline-secondary px-2" @click="cambiarCantidad(p.idProducto, 1, p.stockActual)">+</button>
                  </div>

                  <div class="d-flex gap-2">
                    <button type="button" class="btn btn-punto-primario flex-fill" @click="agregarAlCarrito(p)">Agregar</button>
                    <button type="button" class="btn btn-outline-danger btn-sm px-3" @click="quitarDelCarrito(p.idProducto)">Quitar</button>
                  </div>

                  <div v-if="notificaciones[p.idProducto]" class="mt-2 text-center text-success fw-bold small">
                    {{ notificaciones[p.idProducto] }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="productosFiltrados.length === 0" class="col-12 text-center py-5 text-secondary">
            No se encontraron productos con ese criterio.
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { productosService } from '../services/productos.service';
import { catalogosService } from '../services/catalogos.service';
import { useCarritoStore } from '../stores/carritoStore';

const carritoStore = useCarritoStore();

const productos = ref([]);
const categorias = ref([]);
const busqueda = ref('');
const filtroCategoria = ref('');
const cantidades = ref({});
const notificaciones = ref({});
const cargando = ref(true);

onMounted(async () => {
  try {
    const [prods, cats] = await Promise.all([
      productosService.listar(),
      catalogosService.listar()
    ]);
    productos.value = prods;
    categorias.value = cats;
    prods.forEach(p => { cantidades.value[p.idProducto] = 1; });
  } catch (err) {
    console.error('Error al cargar catálogo:', err);
  } finally {
    cargando.value = false;
  }
});

const productosFiltrados = computed(() => {
  return productos.value.filter(p => {
    const matchNombre = p.descripcion.toLowerCase().includes(busqueda.value.toLowerCase());
    const matchCat = filtroCategoria.value ? p.categoria === filtroCategoria.value : true;
    return matchNombre && matchCat && p.estado !== false;
  });
});

const cambiarCantidad = (id, delta, max = 999) => {
  const actual = cantidades.value[id] || 1;
  const nuevo = actual + delta;
  if (nuevo >= 1 && nuevo <= max) {
    cantidades.value[id] = nuevo;
  }
};

const agregarAlCarrito = (producto) => {
  const cant = cantidades.value[producto.idProducto] || 1;
  carritoStore.agregar(producto, cant);
  notificaciones.value[producto.idProducto] = '¡Agregado al carrito!';
  setTimeout(() => {
    delete notificaciones.value[producto.idProducto];
  }, 2500);
};

const quitarDelCarrito = (idProducto) => {
  carritoStore.quitar(idProducto);
  notificaciones.value[idProducto] = 'Producto quitado';
  setTimeout(() => {
    delete notificaciones.value[idProducto];
  }, 2000);
};
</script>