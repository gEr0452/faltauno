import React, { useState } from "react";
import {
    FlatList,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

type Cancha = {
  id: string;
  nombre: string;
  direccion: string;
  precio: string;
  imagen: any;
};

const DATA: Cancha[] = [
  {
    id: "1",
    nombre: "Ciudad (Ex-Muni)",
    direccion: "Miguel B. Sanchez 1045",
    precio: "$71.998",
    imagen: require("../../assets/images/arco.jpg"),
  },
  {
    id: "2",
    nombre: "Grün FC",
    direccion: "Padre Canavery 1351",
    precio: "$93.000",
    imagen: require("../../assets/images/arco.jpg"),
  },
];

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState<Cancha | null>(null);

  const renderItem = ({ item }: { item: Cancha }) => (
    <Pressable
      style={styles.card}
      onPress={() => {
        setSelected(item);
        setModalVisible(true);
      }}
    >
      <Image source={item.imagen} style={styles.cardImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.precio}>{item.precio}</Text>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.direccion}>{item.direccion}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
        <View style={styles.header}>
        <TextInput
          placeholder="Buscar partidos..."
          placeholderTextColor="#666"
          style={styles.searchBar}
        />
      </View>
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selected && (
              <>
                <Text style={styles.modalTitle}>{selected.nombre}</Text>
                <Text>{selected.direccion}</Text>
                <Text>Precio: {selected.precio}</Text>
              </>
            )}
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
   header: {
    backgroundColor: "#4CAF50",
    padding: 20,
    height: 90,
    justifyContent: "center",
  },
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    fontSize: 14,
  },
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
