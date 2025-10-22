import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View, } from "react-native";
import Partidos from "../../components/partidos";
import { API_URL } from "../../config/config";

type Tarjeta = {
  id: number;
  nombre: string;
  direccion: string;
  jugadores: number;
  fecha: string;
  image?: string;
  usuario: string;
};

export default function PerfilUsuario() {
  const [modalPref, setModalPref] = useState(false);
  const [modalHistorial, setModalHistorial] = useState(false);
  const [historial, setHistorial] = useState<Tarjeta[]>([]);


  useEffect(() => {
    fetch(`${API_URL}/tarjetas`)
      .then((res) => res.json())
      .then(setHistorial)
      .catch((err) => console.error("Error al cargar historial:", err));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>FaltaUno</Text>
      </View>

      <View style={styles.contenido}>
        <Text style={styles.titulo}>Perfil del Usuario</Text>
        <Text style={styles.dato}>Nombre: Geronimo</Text>
        <Text style={styles.dato}>Apellido: Gibaja</Text>
        <Text style={styles.dato}>Email: gerogibaja@gmail.com</Text>

        <Pressable style={styles.boton} onPress={() => setModalPref(true)}>
          <Text style={styles.botonTexto}>Preferencias</Text>
        </Pressable>

        <Pressable style={styles.boton} onPress={() => setModalHistorial(true)}>
          <Text style={styles.botonTexto}>Historial de Partidos</Text>
        </Pressable>

        <Link href="/login" asChild>
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
            />
            <TextInput
              style={styles.input}
              placeholder="Horarios disponibles"
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              placeholder="Barrios preferidos"
              placeholderTextColor="#999"
            />

            <Pressable style={styles.boton} onPress={() => setModalPref(false)}>
              <Text style={styles.botonTexto}>Guardar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={modalHistorial} animationType="slide" transparent>
        <View style={styles.modalFondo}>
          <View style={styles.modalContenido}>
            <Text style={styles.tituloModal}>Historial de Partidos</Text>

            <FlatList
              data={historial}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Partidos item={item} /> 
                  <Pressable style={styles.botonResena}>
                    <Text style={styles.botonTexto}>Valorar / Reseñar</Text>
                  </Pressable>
                </View>
              )}
            />

            <Pressable
              style={styles.boton}
              onPress={() => setModalHistorial(false)}
            >
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
  tituloModal: { fontSize: 18, fontWeight: "bold", color: "#2e7d32" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  item: { marginBottom: 15 },
  botonResena: {
    backgroundColor: "#2e7d32",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },
});
