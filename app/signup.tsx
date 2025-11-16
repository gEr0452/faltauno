import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { registerAsync, clearError } from '@/store/slices/authSlice';

export default function SignupScreen() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    nombre?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated, usuario } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && usuario) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, usuario]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const validateForm = (): boolean => {
    const newErrors: {
      nombre?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    // Validar nombre
    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else if (nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar email
    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'El formato del correo electrónico no es válido';
      }
    }

    // Validar password
    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar confirmación de password
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Debes confirmar la contraseña';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    dispatch(registerAsync({ nombre: nombre.trim(), correo: email.trim(), password }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrarse</Text>

      <TextInput
        style={[styles.input, errors.nombre && styles.inputError]}
        placeholder="Nombre completo"
        placeholderTextColor="#999"
        value={nombre}
        onChangeText={(text) => {
          setNombre(text);
          if (errors.nombre) {
            setErrors((prev) => ({ ...prev, nombre: undefined }));
          }
        }}
        editable={!isLoading}
      />
      {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}

      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        placeholder="Correo electrónico"
        placeholderTextColor="#999"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (errors.email) {
            setErrors((prev) => ({ ...prev, email: undefined }));
          }
        }}
        editable={!isLoading}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        style={[styles.input, errors.password && styles.inputError]}
        placeholder="Contraseña (mínimo 6 caracteres)"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (errors.password) {
            setErrors((prev) => ({ ...prev, password: undefined }));
          }
          // Si cambia la contraseña, también limpiar error de confirmación
          if (errors.confirmPassword && text === confirmPassword) {
            setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
          }
        }}
        editable={!isLoading}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <TextInput
        style={[styles.input, errors.confirmPassword && styles.inputError]}
        placeholder="Confirmar contraseña"
        placeholderTextColor="#999"
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          if (errors.confirmPassword) {
            setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
          }
        }}
        editable={!isLoading}
      />
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

      <Pressable
        style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.registerButtonText}>Registrarse</Text>
        )}
      </Pressable>

      <Pressable
        style={styles.loginLink}
        onPress={() => router.push('/login')}
        disabled={isLoading}
      >
        <Text style={styles.loginText}>
          ¿Ya tienes cuenta? <Text style={styles.loginTextBold}>Inicia sesión</Text>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#2e7d32',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputError: {
    borderColor: '#c62828',
    borderWidth: 2,
  },
  errorText: {
    width: '100%',
    color: '#c62828',
    fontSize: 12,
    marginBottom: 10,
    marginTop: -5,
  },
  registerButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#2e7d32',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonDisabled: {
    backgroundColor: '#9e9e9e',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loginLink: {
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#666',
  },
  loginTextBold: {
    color: '#2e7d32',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
