## 🚀 Puesta en Marcha

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar Supabase:**
   - Abre el archivo `.env`
   - Reemplaza `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` con las credenciales de tu proyecto Supabase.
   - En el panel SQL de Supabase, ejecuta el contenido de `supabase/schema.sql`.

3. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```

4. **Compilar para producción:**
   ```bash
   npm run build
   ```

## 📦 Estructura y Módulos
- **Vistas Públicas:** Inicio, Catálogo, Detalle de Producto, Cotizaciones, Soporte de Acceso, Políticas y Términos.
- **Vistas de Usuario Autenticado:** Mi Perfil, Carrito, Pasarela de Pago, Factura Electrónica, Soporte y **Módulo de Reservas**.
- **Panel de Administración (Roles 1 y 3):** Gestión de Usuarios, Catálogos, Productos, Cotizaciones y Ventas.
