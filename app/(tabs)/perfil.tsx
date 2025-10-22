import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { API_URL } from "../../config/config";

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
  fecha: string;
  ubicacion: string;
  resultado?: string;
};

type TarjetaInscrita = {
  id: number;
  nombre: string;
  direccion: string;
  fecha: string;
  tarjetaId: number;
};

type Preferencias = {
  diasDisponibles: string;
  horariosDisponibles: string;
  barriosPreferidos: string;
};

export default function PerfilUsuario() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
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

  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  const cargarDatosUsuario = async () => {
    try {
      const userId = 1;

      const userResponse = await fetch(`${API_URL}/usuario/${userId}`);
      const userData = await userResponse.json();
      setUsuario(userData);
      setPreferencias({
        diasDisponibles: userData.diasDisponibles || "",
        horariosDisponibles: userData.horariosDisponibles || "",
        barriosPreferidos: userData.barriosPreferidos || ""
      });

      const partidosResponse = await fetch(`${API_URL}/usuario/${userId}/partidos`);
      const partidosData = await partidosResponse.json();
      setHistorialPartidos(partidosData);

      const tarjetasResponse = await fetch(`${API_URL}/usuario/${userId}/tarjetas-inscritas`);
      const tarjetasData = await tarjetasResponse.json();
      setTarjetasInscritas(tarjetasData);

    } catch (error) {
      console.error("Error al cargar datos:", error);
      Alert.alert("Error", "No se pudo cargar la información del usuario");
    } finally {
      setLoading(false);
    }
  };

  const guardarPreferencias = async () => {
    try {
      const response = await fetch(`${API_URL}/usuario/1/preferencias`, {
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

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!usuario) {
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
        <Text style={styles.dato}>Nombre: {usuario.nombre}</Text>
        <Text style={styles.dato}>Email: {usuario.correo}</Text>

        <Pressable style={styles.boton} onPress={() => setModalPref(true)}>
          <Text style={styles.botonTexto}>
            {usuario.diasDisponibles ? "Editar Preferencias" : "Agregar Preferencias"}
          </Text>
        </Pressable>

        <Pressable style={styles.boton} onPress={() => setModalHistorial(true)}>
          <Text style={styles.botonTexto}>
            Historial ({historialPartidos.length + tarjetasInscritas.length})
          </Text>
        </Pressable>

        <Link href="/login" replace asChild>
          <Pressable style={styles.botonCerrar}>
            <Text style={styles.botonTexto}>Cerrar Sesión</Text>
          </Pressable>
        </Link>
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
            <Text style={styles.tituloModal}>Historial</Text>

            <Text style={styles.subtitulo}>Partidos Jugados</Text>
            {historialPartidos.length === 0 ? (
              <Text style={styles.sinHistorial}>No hay partidos en el historial</Text>
            ) : (
              <FlatList
                data={historialPartidos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.item}>
                    <Text style={styles.partidoInfo}>Fecha: {new Date(item.fecha).toLocaleDateString()}</Text>
                    <Text style={styles.partidoInfo}>Ubicación: {item.ubicacion}</Text>
                    {item.resultado && <Text style={styles.partidoInfo}>Resultado: {item.resultado}</Text>}
                  </View>
                )}
              />
            )}

            <Text style={styles.subtitulo}>Tarjetas Inscritas</Text>
            {tarjetasInscritas.length === 0 ? (
              <Text style={styles.sinHistorial}>No hay tarjetas inscritas</Text>
            ) : (
              <FlatList
                data={tarjetasInscritas}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.item}>
                    <Text style={styles.partidoInfo}>Cancha: {item.nombre}</Text>
                    <Text style={styles.partidoInfo}>Dirección: {item.direccion}</Text>
                    <Text style={styles.partidoInfo}>Fecha: {item.fecha}</Text>
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
    width: "85%",
    maxHeight: "80%",
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
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  partidoInfo: {
    fontSize: 14,
    marginVertical: 2,
    color: "#333",
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