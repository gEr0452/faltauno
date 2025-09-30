import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export type Cancha = {
  id: string;
  nombre: string;
  direccion: string;
  hora: string;
  jugadores: string;
  imagen: any;
};

type Props = {
  cancha: Cancha;
};

export default function Tarjeta({ cancha }: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <Pressable
        style={styles.card}
        onPress={() => setModalVisible(true)}
      >
        <Image source={cancha.imagen} style={styles.cardImage} />
        <View style={styles.infoContainer}>
          <Text style={styles.precio}>Falta(n): {cancha.jugadores}</Text>
          <Text style={styles.nombre}>{cancha.nombre}</Text>
          <Text style={styles.nombre}>{cancha.hora}</Text>
          <Text style={styles.direccion}>{cancha.direccion}</Text>
        </View>
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{cancha.nombre}</Text>
            <Text>{cancha.direccion}</Text>
            <Text> Falta(n): {cancha.jugadores}</Text>

            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Inscribirse</Text>
            </Pressable>

            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardImage: {
    width: "100%",
    height: 180,
  },
  infoContainer: {
    padding: 12,
  },
  precio: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
    color: "#000",
  },
  direccion: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  closeButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#2e7d32",
    borderRadius: 8,
  },
});
