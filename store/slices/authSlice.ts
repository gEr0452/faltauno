import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../../config/config';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  diasDisponibles?: string;
  horariosDisponibles?: string;
  barriosPreferidos?: string;
}

interface AuthState {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  usuario: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Guardar usuario en almacenamiento seguro
const saveUserToStorage = async (usuario: Usuario) => {
  try {
    const usuarioJson = JSON.stringify(usuario);
    if (Platform.OS === 'web') {
      localStorage.setItem('usuario', usuarioJson);
    } else {
      await SecureStore.setItemAsync('usuario', usuarioJson);
    }
  } catch (error) {
    console.error('Error al guardar usuario:', error);
  }
};

// Cargar usuario del almacenamiento
const loadUserFromStorage = async (): Promise<Usuario | null> => {
  try {
    let usuarioJson: string | null = null;
    if (Platform.OS === 'web') {
      usuarioJson = localStorage.getItem('usuario');
    } else {
      usuarioJson = await SecureStore.getItemAsync('usuario');
    }
    return usuarioJson ? JSON.parse(usuarioJson) : null;
  } catch (error) {
    console.error('Error al cargar usuario:', error);
    return null;
  }
};

// Eliminar usuario del almacenamiento
const removeUserFromStorage = async () => {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem('usuario');
    } else {
      await SecureStore.deleteItemAsync('usuario');
    }
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
  }
};

// Async thunk para login
export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ correo, password }: { correo: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Error al iniciar sesión');
      }

      await saveUserToStorage(data.usuario);
      return data.usuario;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al iniciar sesión');
    }
  }
);

// Async thunk para registro
export const registerAsync = createAsyncThunk(
  'auth/register',
  async ({ nombre, correo, password }: { nombre: string; correo: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Error al registrar usuario');
      }

      await saveUserToStorage(data.usuario);
      return data.usuario;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al registrar usuario');
    }
  }
);

// Async thunk para cargar usuario guardado
export const loadUserAsync = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const usuario = await loadUserFromStorage();
      if (!usuario) {
        return rejectWithValue('No hay usuario guardado');
      }
      return usuario;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cargar usuario');
    }
  }
);

// Async thunk para logout
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await removeUserFromStorage();
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al cerrar sesión');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action: PayloadAction<Usuario>) => {
        state.isLoading = false;
        state.usuario = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.usuario = null;
      });

    // Register
    builder
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action: PayloadAction<Usuario>) => {
        state.isLoading = false;
        state.usuario = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.usuario = null;
      });

    // Load User
    builder
      .addCase(loadUserAsync.fulfilled, (state, action: PayloadAction<Usuario>) => {
        state.usuario = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loadUserAsync.rejected, (state) => {
        state.usuario = null;
        state.isAuthenticated = false;
      });

    // Logout
    builder
      .addCase(logoutAsync.fulfilled, (state) => {
        state.usuario = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

