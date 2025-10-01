import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Partidos from "../../components/partidos";

type Cancha = {
  id: string;
  nombre: string;
  direccion: string;
  hora: string;
  jugadores: string;
  imagen: any;
  usuario: string;
};

const DATA: Cancha[] = [
  {
    id: "1",
    nombre: "Ciudad (Ex-Muni)",
    direccion: "Miguel B. Sanchez 1045",
    jugadores: "2",
    hora: "18:00",
    imagen: require("../../assets/images/pelota.png"),
    usuario: "Usuario",
  },
  {
    id: "2",
    nombre: "Grün FC",
    direccion: "Padre Canavery 1351",
    jugadores: "1",
    hora: "18:00",
    imagen: require("../../assets/images/pelota.png"),
    usuario: "Usuario",
  },
  {
    id: "3",
    nombre: "Grün FC",
    direccion: "Padre Canavery 1351",
    jugadores: "3",
    hora: "20:00",
    imagen: require("../../assets/images/pelota.png"),
    usuario: "Usuario",
  },
];

export default function PartidosTab() {
  const [modalVisible, setModalVisible] = useState(false);

  const usuariosInscritos = [
    { id: "1", nombre: "Ignacio Basara" },
    { id: "2", nombre: "Gonzalo González" },
    { id: "3", nombre: "Carlos" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          placeholder="Buscar partidos..."
          placeholderTextColor="#666"
          style={styles.searchBar}
        />
      </View>

      <Text style={styles.titulo}>Partidos Inscriptos</Text>
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Partidos item={item} />
            <Pressable style={styles.botonDarBaja}>
              <Text style={styles.botonTexto}>Dar de Baja</Text>
            </Pressable>
          </View>
        )}
        contentContainerStyle={styles.lista}
      />

      <Text style={styles.titulo}>Partidos Creados</Text>
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Partidos item={item} />
            <View style={styles.botonesRow}>
              <Pressable style={styles.botonDarBaja}>
                <Text style={styles.botonTexto}>Dar de Baja</Text>
              </Pressable>
              <Pressable
                style={styles.botonVerInscritos}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.botonTexto}>Ver Inscritos</Text>
              </Pressable>
            </View>
          </View>
        )}
        contentContainerStyle={styles.lista}
      />


      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalFondo}>
          <View style={styles.modalContenido}>
            <Text style={styles.modalTitulo}>Usuarios Inscritos</Text>
            {usuariosInscritos.map((usuario) => (
              <Text key={usuario.id} style={styles.usuarioTexto}>
                {usuario.nombre}
              </Text>
            ))}
            <Pressable
              style={styles.botonCerrarModal}
              onPress={() => setModalVisible(false)}
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#2e7d32",
    padding: 20,
    height: 90,
    justifyContent: "center",
  },
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 17,
    paddingVertical: 5,
    fontSize: 14,
  },
  titulo: {
    fontWeight: "bold",
    fontSize: 20,
    padding: 10,
  },
  lista: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  item: {
    marginBottom: 15,
  },
  botonesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  botonDarBaja: {
    backgroundColor: "#c62828",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
    flex: 1,
    marginRight: 5,
  },
  botonVerInscritos: {
    backgroundColor: "#2e7d32",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
    flex: 1,
    marginLeft: 5,
  },
  botonTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
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
    width: "80%",
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 15,
    textAlign: "center",
  },
  usuarioTexto: {
    fontSize: 16,
    marginVertical: 5,
  },
  botonCerrarModal: {
    backgroundColor: "#2e7d32",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
});

