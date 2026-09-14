import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '../services/supabase';

export const useAuthStore = defineStore('auth', () => {
  const profile = ref(JSON.parse(localStorage.getItem('auth_profile') || 'null'));

  const isAuthenticated = computed(() => !!profile.value);
  const idUsuario = computed(() => profile.value?.id_usuario || null);
  const idRol = computed(() => profile.value?.id_rol || 2);
  const isAdmin = computed(() => idRol.value === 1);
  const isVendedor = computed(() => idRol.value === 3);
  const isAdminOrVendedor = computed(() => idRol.value === 1 || idRol.value === 3);

  async function login(correo, clave) {
    // 1. Consultar usuario directamente en la base de datos Supabase
    const { data: usuario, error: dbError } = await supabase
      .from('usuarios')
      .select('*, roles(nombre), tipos_de_documentos(nombre, descripcion_doc)')
      .eq('correo', correo)
      .single();

    if (dbError || !usuario) {
      throw new Error('Correo o contraseña incorrectos, o usuario no registrado en Supabase.');
    }

    if (!usuario.estado) {
      throw new Error('Tu cuenta se encuentra inactiva. Contacta al soporte.');
    }

    profile.value = usuario;
    localStorage.setItem('auth_profile', JSON.stringify(usuario));
    return { success: true, profile: usuario };
  }

  async function register(datos) {
    const nuevoUsuario = {
      nombre: datos.nombre,
      apellido: datos.apellido,
      id_documento: Number(datos.id_documento || 1),
      identificacion_usuario: datos.identificacion_usuario,
      correo: datos.correo,
      telefono: datos.telefono || null,
      fecha_de_nacimiento: datos.fecha_de_nacimiento,
      direccion: datos.direccion || null,
      id_rol: 2,
      estado: true
    };

    const { data, error } = await supabase
      .from('usuarios')
      .insert([nuevoUsuario])
      .select('*, roles(nombre), tipos_de_documentos(nombre, descripcion_doc)')
      .single();

    if (error) {
      console.error('Error al registrar usuario en Supabase:', error);
      throw error;
    }

    return data;
  }

  function logout() {
    profile.value = null;
    localStorage.removeItem('auth_profile');
  }

  function actualizarPerfilLocal(nuevosDatos) {
    if (profile.value) {
      profile.value = { ...profile.value, ...nuevosDatos };
      localStorage.setItem('auth_profile', JSON.stringify(profile.value));
    }
  }

  return {
    profile,
    isAuthenticated,
    idUsuario,
    idRol,
    isAdmin,
    isVendedor,
    isAdminOrVendedor,
    login,
    register,
    logout,
    actualizarPerfilLocal
  };
});
