-- ==============================================================================
-- SCRIPT DE BASE DE DATOS PARA SUPABASE: PUNTO CAJAS + MÓDULO DE RESERVAS
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ROLES
CREATE TABLE IF NOT EXISTS public.roles (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO public.roles (id_rol, nombre) VALUES 
(1, 'Administrador'),
(2, 'Cliente'),
(3, 'Vendedor')
ON CONFLICT (id_rol) DO NOTHING;

-- TIPOS DE DOCUMENTO
CREATE TABLE IF NOT EXISTS public.tipos_de_documentos (
    id_documento SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion_doc VARCHAR(100)
);

INSERT INTO public.tipos_de_documentos (id_documento, nombre, descripcion_doc) VALUES 
(1, 'CC', 'Cédula de Ciudadanía'),
(2, 'TI', 'Tarjeta de Identidad'),
(3, 'PAS', 'Pasaporte'),
(4, 'CE', 'Cédula de Extranjería'),
(5, 'RC', 'Registro Civil'),
(6, 'NIT', 'NIT'),
(7, 'DNI', 'Documento Nacional de Identidad'),
(8, 'CE_CARNE', 'Carné de Extranjería'),
(9, 'PEP', 'PEP'),
(10, 'PPT', 'Permiso por Protección Temporal')
ON CONFLICT (id_documento) DO NOTHING;

-- USUARIOS
CREATE TABLE IF NOT EXISTS public.usuarios (
    id_usuario SERIAL PRIMARY KEY,
    auth_user_id UUID,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    id_documento INT REFERENCES public.tipos_de_documentos(id_documento) DEFAULT 1,
    identificacion_usuario VARCHAR(30) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(30),
    fecha_de_nacimiento DATE,
    direccion VARCHAR(200),
    id_rol INT REFERENCES public.roles(id_rol) DEFAULT 2,
    estado BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- CATALOGOS
CREATE TABLE IF NOT EXISTS public.catalogos (
    id_catalogo SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.catalogos (nombre) VALUES 
('Cajas para Mudanza'),
('Cajas de Regalo'),
('Cajas para Envíos'),
('Cajas de Archivo')
ON CONFLICT DO NOTHING;

-- PRODUCTOS
CREATE TABLE IF NOT EXISTS public.productos (
    id_producto SERIAL PRIMARY KEY,
    descripcion VARCHAR(150) NOT NULL,
    precio NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    stock_actual INT NOT NULL DEFAULT 0,
    id_catalogo INT REFERENCES public.catalogos(id_catalogo) ON DELETE SET NULL,
    url_imagen VARCHAR(500),
    estado BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.productos (descripcion, precio, stock_actual, id_catalogo, url_imagen, estado) VALUES
('Caja de Cartón Grande 60x40x40', 12500.00, 50, 1, 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=60', true),
('Caja para Regalo Elegante Negra', 8900.00, 30, 2, 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=60', true),
('Caja Automontable para Envíos E-commerce', 4500.00, 120, 3, 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500&auto=format&fit=crop&q=60', true),
('Caja de Archivo con Tapa', 9800.00, 40, 4, 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=60', true)
ON CONFLICT DO NOTHING;

-- COTIZACIONES
CREATE TABLE IF NOT EXISTS public.cotizaciones_cabeceras (
    id_cotizacion SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE,
    fecha DATE DEFAULT CURRENT_DATE,
    valor_unitario NUMERIC(12, 2) DEFAULT 0.00,
    iva NUMERIC(12, 2) DEFAULT 0.00,
    subtotal NUMERIC(12, 2) DEFAULT 0.00,
    total NUMERIC(12, 2) DEFAULT 0.00,
    estado VARCHAR(30) DEFAULT 'PENDIENTE',
    observacion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.detalles_cotizaciones (
    id_detalle SERIAL PRIMARY KEY,
    id_cotizacion INT REFERENCES public.cotizaciones_cabeceras(id_cotizacion) ON DELETE CASCADE,
    cantidad INT NOT NULL DEFAULT 1,
    alto NUMERIC(8, 2),
    largo NUMERIC(8, 2),
    ancho NUMERIC(8, 2),
    color VARCHAR(50),
    acabado VARCHAR(50),
    descripcion_uso_caja TEXT
);

-- PEDIDOS
CREATE TABLE IF NOT EXISTS public.pedidos_cabeceras (
    id_pedido SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE,
    id_cotizacion INT REFERENCES public.cotizaciones_cabeceras(id_cotizacion) ON DELETE SET NULL,
    fecha DATE DEFAULT CURRENT_DATE,
    direccion_envio VARCHAR(200) NOT NULL,
    total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    estado_pedido VARCHAR(50) DEFAULT 'Pendiente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.pedidos_detalles (
    id_detalle SERIAL PRIMARY KEY,
    id_pedido INT REFERENCES public.pedidos_cabeceras(id_pedido) ON DELETE CASCADE,
    id_producto INT REFERENCES public.productos(id_producto) ON DELETE SET NULL,
    cantidad INT NOT NULL DEFAULT 1,
    precio_unitario NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00
);

-- MEDIOS DE PAGO Y FACTURAS
CREATE TABLE IF NOT EXISTS public.medios_de_pagos (
    id_medio_pago SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

INSERT INTO public.medios_de_pagos (id_medio_pago, nombre) VALUES 
(1, 'Tarjeta de Crédito / Débito'),
(2, 'Nequi'),
(3, 'Transferencia Bancaria'),
(4, 'Pago en Establecimiento')
ON CONFLICT (id_medio_pago) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.facturas_cabeceras (
    id_factura SERIAL PRIMARY KEY,
    numero_factura VARCHAR(50) UNIQUE NOT NULL,
    id_pedido INT REFERENCES public.pedidos_cabeceras(id_pedido) ON DELETE CASCADE,
    fecha DATE DEFAULT CURRENT_DATE,
    total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.pagos (
    id_pago SERIAL PRIMARY KEY,
    id_factura INT REFERENCES public.facturas_cabeceras(id_factura) ON DELETE CASCADE,
    id_medio_pago INT REFERENCES public.medios_de_pagos(id_medio_pago),
    monto NUMERIC(12, 2) NOT NULL,
    fecha_pago TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    estado VARCHAR(30) DEFAULT 'Completado'
);

-- SOPORTE TICKETS
CREATE TABLE IF NOT EXISTS public.soporte_tickets (
    id_soporte SERIAL PRIMARY KEY,
    correo VARCHAR(150) NOT NULL,
    asunto VARCHAR(150) NOT NULL,
    mensaje TEXT NOT NULL,
    id_usuario INT REFERENCES public.usuarios(id_usuario) ON DELETE SET NULL,
    tipo VARCHAR(50) DEFAULT 'General',
    estado VARCHAR(30) DEFAULT 'Abierto',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- MÓDULO DE RESERVAS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.actividades (
    idactividad SERIAL PRIMARY KEY,
    descripcion_actividad VARCHAR(150) NOT NULL,
    cupo_maximo INT DEFAULT 30,
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.actividades (idactividad, descripcion_actividad, cupo_maximo, activa) VALUES 
(1, 'Crossfit & Acondicionamiento Físico', 30, true),
(2, 'Spinning Indoor', 25, true),
(3, 'Yoga & Movilidad', 20, true),
(4, 'Pilates Mat', 20, true),
(5, 'Entrenamiento Funcional', 30, true),
(6, 'Taller de Diseño y Empaque de Cajas', 15, true)
ON CONFLICT (idactividad) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.estados_reserva (
    idestado SERIAL PRIMARY KEY,
    descripcion_estado VARCHAR(50) NOT NULL
);

INSERT INTO public.estados_reserva (idestado, descripcion_estado) VALUES 
(1, 'Confirmada'),
(2, 'Pendiente'),
(3, 'Cancelada'),
(4, 'Completada')
ON CONFLICT (idestado) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.reservas (
    idreserva SERIAL PRIMARY KEY,
    usuarios_idusuarios INT REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE,
    actividad_idactividad INT REFERENCES public.actividades(idactividad) ON DELETE RESTRICT,
    num_personas INT NOT NULL CHECK (num_personas >= 1 AND num_personas <= 10),
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado_idestado INT REFERENCES public.estados_reserva(idestado) DEFAULT 2,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY Y POLÍTICAS
-- ==============================================================================
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipos_de_documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cotizaciones_cabeceras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detalles_cotizaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos_cabeceras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos_detalles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facturas_cabeceras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medios_de_pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soporte_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actividades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estados_reserva ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura roles" ON public.roles FOR SELECT USING (true);
CREATE POLICY "Lectura tipos_doc" ON public.tipos_de_documentos FOR SELECT USING (true);
CREATE POLICY "Lectura catalogos" ON public.catalogos FOR SELECT USING (true);
CREATE POLICY "Lectura productos" ON public.productos FOR SELECT USING (true);
CREATE POLICY "Lectura actividades" ON public.actividades FOR SELECT USING (true);
CREATE POLICY "Lectura estados_reserva" ON public.estados_reserva FOR SELECT USING (true);
CREATE POLICY "Lectura medios_pagos" ON public.medios_de_pagos FOR SELECT USING (true);

CREATE POLICY "Acceso usuarios" ON public.usuarios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso cotizaciones" ON public.cotizaciones_cabeceras FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso detalles_cotizaciones" ON public.detalles_cotizaciones FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso pedidos" ON public.pedidos_cabeceras FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso pedidos_detalles" ON public.pedidos_detalles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso facturas" ON public.facturas_cabeceras FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso pagos" ON public.pagos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso soporte" ON public.soporte_tickets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso reservas" ON public.reservas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso admin catalogos" ON public.catalogos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso admin productos" ON public.productos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso admin actividades" ON public.actividades FOR ALL USING (true) WITH CHECK (true);
