import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export type TarjetaType = {
  id: number;
  nombre: string;
  direccion: string;
  jugadores: number;
  fecha: string;
  image?: string;
  usuario: string;
  usuarioId: number;
  inscritos?: { id: number; nombre: string }[];
};

type Props = {
  item: TarjetaType;
  onInscribirse?: (tarjetaId: number) => Promise<void> | void;
  onDarseDeBaja?: (tarjetaId: number) => Promise<void> | void;
  currentUserId?: number;
};

export default function Tarjeta({ item, onInscribirse, onDarseDeBaja, currentUserId }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const estaInscrito = currentUserId != null && item.inscritos?.some((usuario) => usuario.id === currentUserId);
  const esCreador = currentUserId != null && item.usuarioId === currentUserId;
  const hayCupo = item.jugadores > 0;

  return (
    <View>
      <Pressable
        style={styles.card}
        onPress={() => setModalVisible(true)}
      >
        <Image 
          source={item.image 
            ? { uri: item.image } 
            : require("../assets/images/arco.jpg")
          } 
          style={styles.cardImage} 
        />
        <View style={styles.infoContainer}>
          <Text style={styles.precio}>{item.jugadores > 0 ? `Falta(n): ${item.jugadores}` : "COMPLETADO"}</Text>
          {estaInscrito && <Text style={styles.inscripto}>Ya estás inscripto</Text>}
          <Text style={styles.nombre}>{item.nombre}</Text>
          <Text style={styles.nombre}>{item.fecha}</Text>
          <Text style={styles.direccion}>{item.direccion}</Text>
          <Text style={styles.direccion}>Creado por: {item.usuario}</Text>
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
            <Image 
              source={item.image 
                ? { uri: item.image } 
                : require("../assets/images/arco.jpg")
              } 
              style={styles.cardImage} 
            />
            <Text style={styles.modalTitle}>{item.nombre}</Text>
            <Text>{item.direccion}</Text>
            <Text>{item.jugadores > 0 ? `Falta(n): ${item.jugadores}` : "COMPLETADO"}</Text>
            <Text>Fecha: {item.fecha}</Text>
            <Text>Creado por: {item.usuario}</Text>
            {estaInscrito && <Text style={styles.inscriptoModal}>Ya estás inscripto a este partido</Text>}
            {esCreador && <Text style={styles.inscriptoModal}>Tú creaste este partido</Text>}

            {esCreador ? (
              <View style={styles.disabledButton}>
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Partido creado por ti</Text>
              </View>
            ) : estaInscrito ? (
              <Pressable
                style={[styles.closeButton, { backgroundColor: "#c62828" }]}
                onPress={async () => {
                  if (onDarseDeBaja) {
                    await onDarseDeBaja(item.id);
                  }
                  setModalVisible(false);
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Darse de baja</Text>
              </Pressable>
            ) : hayCupo && !esCreador ? (
              <Pressable
                style={styles.closeButton}
                onPress={async () => {
                  if (onInscribirse && !esCreador) {
                    await onInscribirse(item.id);
                  }
                  setModalVisible(false);
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Inscribirse</Text>
              </Pressable>
            ) : (
              <View style={styles.disabledButton}>
                <Text style={{ color: "#fff", fontWeight: "bold" }}>COMPLETADO</Text>
              </View>
            )}

            <Pressable
              style={[styles.closeButton, { backgroundColor: "#c62828", marginTop: 10 }]}
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
  inscripto: {
    fontSize: 14,
    color: "#2e7d32",
    marginTop: 4,
    fontWeight: "600",
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
    paddingTop: 10,
  },
  closeButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#2e7d32",
    borderRadius: 8,
  },
  disabledButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#9e9e9e",
    borderRadius: 8,
    alignItems: "center",
  },
  inscriptoModal: {
    marginTop: 12,
    fontSize: 14,
    color: "#2e7d32",
    fontWeight: "600",
  },
});