import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { API_URL } from "../../config/config";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutAsync } from "@/store/slices/authSlice";

type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  diasDisponibles?: string;
  horariosDisponibles?: string;
  barriosPreferidos?: string;
};

type Partido = {
  id: number;
  cancha: string;
  lugar: string;
  dia: string;
  hora: string;
  jugadoresFaltantes: number;
  usuarioId: number;
};

type TarjetaInscrita = {
  id: number;
  cancha: string;
  lugar: string;
  dia: string;
  hora: string;
  jugadoresFaltantes: number;
};

type Preferencias = {
  diasDisponibles: string;
  horariosDisponibles: string;
  barriosPreferidos: string;
};

export default function PerfilUsuario() {
  const [modalPref, setModalPref] = useState(false);
  const [modalHistorial, setModalHistorial] = useState(false);
  const [historialPartidos, setHistorialPartidos] = useState<Partido[]>([]);
  const [tarjetasInscritas, setTarjetasInscritas] = useState<TarjetaInscrita[]>([]);
  const [preferencias, setPreferencias] = useState<Preferencias>({
    diasDisponibles: "",
    horariosDisponibles: "",
    barriosPreferidos: ""
  });
  const [loading, setLoading] = useState(true);
  
  const dispatch = useAppDispatch();
  const { usuario: usuarioRedux, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !usuarioRedux) {
      router.replace("/login");
      return;
    }
  }, [isAuthenticated, usuarioRedux, router]);

  useEffect(() => {
    if (usuarioRedux) {
      cargarDatosUsuario();
    }
  }, [usuarioRedux]);

  // Recargar datos cuando vuelves a esta pantalla
  useFocusEffect(
    useCallback(() => {
      if (usuarioRedux) {
        cargarDatosUsuario();
      }
    }, [usuarioRedux])
  );

  const esFechaPasada = (dia: string, hora: string): boolean => {
    try {
      // Parsear la fecha en formato "Lunes 15 de enero" y hora "10:37"
      const meses: { [key: string]: number } = {
        "enero": 0, "febrero": 1, "marzo": 2, "abril": 3, "mayo": 4, "junio": 5,
        "julio": 6, "agosto": 7, "septiembre": 8, "octubre": 9, "noviembre": 10, "diciembre": 11
      };

      // Extraer día y mes de la fecha (ej: "Lunes 15 de enero" -> día: 15, mes: "enero")
      const diaLower = dia.toLowerCase().trim();
      const partesDia = diaLower.split(" de ");
      
      if (partesDia.length < 2) {
        console.log("Error: formato de fecha inválido:", dia);
        return false;
      }
      
      const numeroDia = parseInt(partesDia[0].match(/\d+/)?.[0] || "0");
      const mesTexto = partesDia[1].trim();
      const mes = meses[mesTexto];
      
      if (isNaN(numeroDia) || mes === undefined) {
        console.log("Error: no se pudo parsear día o mes", { numeroDia, mesTexto, mes });
        return false;
      }

      // Extraer hora y minutos (ej: "10:37" -> hora: 10, minutos: 37)
      const [horaStr, minutosStr] = hora.split(":");
      const horaNum = parseInt(horaStr || "0");
      const minutosNum = parseInt(minutosStr || "0");

      if (isNaN(horaNum) || isNaN(minutosNum)) {
        console.log("Error: no se pudo parsear hora", { hora, horaStr, minutosStr });
        return false;
      }

      // Crear fecha del partido
      const ahora = new Date();
      let fechaPartido = new Date(ahora.getFullYear(), mes, numeroDia, horaNum, minutosNum);
      
      // Si el mes del partido es menor al mes actual, asumimos que es del próximo año
      // Si es el mismo mes pero el día ya pasó, comparamos con el año actual
      // Si el día es hoy o futuro, comparamos normalmente
      if (mes < ahora.getMonth()) {
        // El mes del partido ya pasó este año, debe ser del próximo año
        fechaPartido.setFullYear(ahora.getFullYear() + 1);
      } else if (mes === ahora.getMonth()) {
        // Mismo mes: si el día ya pasó este mes, comparamos normalmente
        // Si el día es hoy, comparamos solo la hora
        if (numeroDia < ahora.getDate()) {
          // El día ya pasó este mes, comparamos normalmente
        } else if (numeroDia === ahora.getDate()) {
          // Es hoy, comparamos solo la hora
          fechaPartido.setFullYear(ahora.getFullYear());
          fechaPartido.setMonth(ahora.getMonth());
          fechaPartido.setDate(ahora.getDate());
        } else {
          // El día aún no ha llegado este mes
          fechaPartido.setFullYear(ahora.getFullYear());
        }
      } else {
        // El mes del partido es futuro este año
        fechaPartido.setFullYear(ahora.getFullYear());
      }

      const esPasado = fechaPartido < ahora;
      console.log("Comparación de fecha:", {
        dia,
        hora,
        fechaPartido: fechaPartido.toLocaleString(),
        ahora: ahora.toLocaleString(),
        esPasado
      });
      
      return esPasado;
    } catch (error) {
      console.error("Error al parsear fecha:", error, { dia, hora });
      return false;
    }
  };

  const cargarDatosUsuario = async () => {
    if (!usuarioRedux) return;
    
    try {
      const userResponse = await fetch(`${API_URL}/usuario/${usuarioRedux.id}`);
      const userData = await userResponse.json();
      setPreferencias({
        diasDisponibles: userData.diasDisponibles || "",
        horariosDisponibles: userData.horariosDisponibles || "",
        barriosPreferidos: userData.barriosPreferidos || ""
      });

      // Obtener partidos inscritos (tarjetas inscritas)
      const tarjetasResponse = await fetch(`${API_URL}/usuario/${usuarioRedux.id}/tarjetas-inscritas`);
      const tarjetasData = await tarjetasResponse.json();
      
      // Separar entre partidos jugados (fecha pasada) y partidos futuros (fecha futura)
      const partidosJugados = tarjetasData.filter((partido: TarjetaInscrita) => 
        esFechaPasada(partido.dia, partido.hora)
      );
      const partidosFuturos = tarjetasData.filter((partido: TarjetaInscrita) => 
        !esFechaPasada(partido.dia, partido.hora)
      );

      setHistorialPartidos(partidosJugados);
      setTarjetasInscritas(partidosFuturos);

    } catch (error) {
      console.error("Error al cargar datos:", error);
      Alert.alert("Error", "No se pudo cargar la información del usuario");
    } finally {
      setLoading(false);
    }
  };

  const guardarPreferencias = async () => {
    if (!usuarioRedux) return;
    
    try {
      const response = await fetch(`${API_URL}/usuario/${usuarioRedux.id}/preferencias`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferencias),
      });

      if (response.ok) {
        await cargarDatosUsuario();
        setModalPref(false);
        Alert.alert("Éxito", "Preferencias guardadas correctamente");
      } else {
        throw new Error("Error al guardar preferencias");
      }
    } catch (error) {
      console.error("Error al guardar preferencias:", error);
      Alert.alert("Error", "No se pudieron guardar las preferencias");
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            await dispatch(logoutAsync());
            router.replace("/login");
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!usuarioRedux || !isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text>Error al cargar el usuario</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>FaltaUno</Text>
      </View>

      <View style={styles.contenido}>
        <Text style={styles.titulo}>Perfil del Usuario</Text>
        <Text style={styles.dato}>Nombre: {usuarioRedux.nombre}</Text>
        <Text style={styles.dato}>Email: {usuarioRedux.correo}</Text>

        <Pressable style={styles.boton} onPress={() => setModalHistorial(true)}>
          <Text style={styles.botonTexto}>
            Mis Partidos ({historialPartidos.length + tarjetasInscritas.length})
          </Text>
        </Pressable>

        <Pressable style={styles.botonCerrar} onPress={handleLogout}>
          <Text style={styles.botonTexto}>Cerrar Sesión</Text>
        </Pressable>
      </View>

      <Modal visible={modalPref} animationType="slide" transparent>
        <View style={styles.modalFondo}>
          <View style={styles.modalContenido}>
            <Text style={styles.tituloModal}>Preferencias</Text>

            <TextInput
              style={styles.input}
              placeholder="Días disponibles"
              placeholderTextColor="#999"
              value={preferencias.diasDisponibles}
              onChangeText={(text) => setPreferencias(prev => ({...prev, diasDisponibles: text}))}
            />
            <TextInput
              style={styles.input}
              placeholder="Horarios disponibles"
              placeholderTextColor="#999"
              value={preferencias.horariosDisponibles}
              onChangeText={(text) => setPreferencias(prev => ({...prev, horariosDisponibles: text}))}
            />
            <TextInput
              style={styles.input}
              placeholder="Barrios preferidos"
              placeholderTextColor="#999"
              value={preferencias.barriosPreferidos}
              onChangeText={(text) => setPreferencias(prev => ({...prev, barriosPreferidos: text}))}
            />

            <View style={styles.botonesModal}>
              <Pressable style={[styles.boton, styles.botonCancelar]} onPress={() => setModalPref(false)}>
                <Text style={styles.botonTexto}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.boton} onPress={guardarPreferencias}>
                <Text style={styles.botonTexto}>Guardar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>


      <Modal visible={modalHistorial} animationType="slide" transparent>
        <View style={styles.modalFondo}>
          <View style={styles.modalContenido}>
            <Text style={styles.tituloModal}>Mis Partidos</Text>

            <Text style={styles.subtitulo}>Partidos Jugados</Text>
            {historialPartidos.length === 0 ? (
              <Text style={styles.sinHistorial}>No has participado en partidos aún</Text>
            ) : (
              <FlatList
                data={historialPartidos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.item}>
                    <Text style={styles.partidoTitulo}>{item.cancha}</Text>
                    <Text style={styles.partidoInfo}>📍 Ubicación: {item.lugar}</Text>
                    <Text style={styles.partidoInfo}>📅 Fecha: {item.dia}</Text>
                    <Text style={styles.partidoInfo}>🕐 Hora: {item.hora}</Text>
                    <Text style={styles.partidoInfo}>👥 Jugadores faltantes: {item.jugadoresFaltantes}</Text>
                  </View>
                )}
              />
            )}

            <Text style={styles.subtitulo}>Partidos Futuros</Text>
            {tarjetasInscritas.length === 0 ? (
              <Text style={styles.sinHistorial}>No hay partidos futuros inscritos</Text>
            ) : (
              <FlatList
                data={tarjetasInscritas}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.item}>
                    <Text style={styles.partidoTitulo}>{item.cancha}</Text>
                    <Text style={styles.partidoInfo}>📍 Ubicación: {item.lugar}</Text>
                    <Text style={styles.partidoInfo}>📅 Fecha: {item.dia}</Text>
                    <Text style={styles.partidoInfo}>🕐 Hora: {item.hora}</Text>
                    <Text style={styles.partidoInfo}>👥 Jugadores faltantes: {item.jugadoresFaltantes}</Text>
                  </View>
                )}
              />
            )}

            <Pressable style={styles.boton} onPress={() => setModalHistorial(false)}>
              <Text style={styles.botonTexto}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#2e7d32",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  headerTitulo: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  contenido: { flex: 1, padding: 20 },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 15,
  },
  dato: { fontSize: 16, marginVertical: 4 },
  boton: {
    backgroundColor: "#2e7d32",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 8,
  },
  botonTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  botonCerrar: {
    backgroundColor: "#c62828",
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalFondo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContenido: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "90%",
    maxHeight: "85%",
  },
  tituloModal: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#2e7d32",
    marginBottom: 15,
    textAlign: "center"
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
    marginTop: 15,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  item: { 
    marginBottom: 15,
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#2e7d32",
  },
  partidoTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 6,
  },
  partidoInfo: {
    fontSize: 14,
    marginVertical: 3,
    color: "#555",
  },
  botonesModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  botonCancelar: {
    backgroundColor: "#666",
  },
  sinHistorial: {
    textAlign: "center",
    color: "#666",
    marginVertical: 10,
    fontStyle: "italic",
  },
});