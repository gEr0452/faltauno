import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { API_URL } from "../../config/config";

export default function Formulario() {
  const [modalVisible, setModalVisible] = useState(false);
  const [cancha, setCancha] = useState("");
  const [lugar, setLugar] = useState("");
  const [dia, setDia] = useState("");
  const [hora, setHora] = useState("");
  const [jugadoresFaltantes, setJugadoresFaltantes] = useState("");
  const [loading, setLoading] = useState(false); 

  const crearPartido = async () => {
    if (!cancha || !lugar || !dia || !hora || !jugadoresFaltantes) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/partidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cancha,
          lugar,
          dia,
          hora,
          jugadoresFaltantes: parseInt(jugadoresFaltantes),
          usuarioId: 1,
        }),
      });

      if (!response.ok) throw new Error("Error al crear el partido");

      const data = await response.json();
      Alert.alert("Éxito", "¡Partido creado correctamente!");

      // Limpia formulario y cierra modal
      setCancha("");
      setLugar("");
      setDia("");
      setHora("");
      setJugadoresFaltantes("");
      setModalVisible(false);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudo crear el partido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>FaltaUno</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.titulo}>¿Te falta uno?</Text>

        <Pressable style={styles.boton} onPress={() => setModalVisible(true)}>
          <Text style={styles.botonTexto}>Crear tu Partido</Text>
        </Pressable>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalFondo}>
          <View style={styles.modalContenido}>
            <Text style={styles.label}>Cancha</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Parque Central"
              value={cancha}
              onChangeText={setCancha}
            />

            <Text style={styles.label}>Lugar</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Belgrano"
              value={lugar}
              onChangeText={setLugar}
            />

            <Text style={styles.label}>Día</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Sábado"
              value={dia}
              onChangeText={setDia}
            />

            <Text style={styles.label}>Hora</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 18:00"
              value={hora}
              onChangeText={setHora}
            />

            <Text style={styles.label}>Jugadores faltantes</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 2"
              keyboardType="numeric"
              value={jugadoresFaltantes}
              onChangeText={setJugadoresFaltantes}
            />

            <View style={styles.botonesFila}>
              <Pressable
                style={[
                  styles.boton, 
                  styles.botonConfirmar,
                  loading && styles.botonDisabled
                ]}
                onPress={crearPartido} // Llamada directa a la función
                disabled={loading}
              >
                <Text style={styles.botonTexto}>
                  {loading ? "Creando..." : "Confirmar"}
                </Text>
              </Pressable>

              <Pressable
                style={[styles.boton, styles.botonDescartar]}
                onPress={() => setModalVisible(false)}
                disabled={loading}
              >
                <Text style={styles.botonTexto}>Descartar</Text>
              </Pressable>
            </View>
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
  },
  headerTitulo: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 20,
  },
  boton: {
    backgroundColor: "#2e7d32",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 8,
    minWidth: 120,
  },
  botonDisabled: {
    backgroundColor: "#cccccc",
  },
  botonTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  modalFondo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContenido: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "85%",
    elevation: 5,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#2e7d32",
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  botonesFila: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  botonConfirmar: {
    flex: 1,
    marginRight: 8,
  },
  botonDescartar: {
    flex: 1,
    backgroundColor: "#555",
    marginLeft: 8,
  },
});