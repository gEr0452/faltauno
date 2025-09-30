import React from "react";
import {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";

type Cancha = {
  id: string;
  nombre: string;
  direccion: string;
  hora: string;
  jugadores: string;
  imagen: any;
};

const DATA: Cancha[] = [
  {
    id: "1",
    nombre: "Ciudad (Ex-Muni)",
    direccion: "Miguel B. Sanchez 1045",
    jugadores: "2",
    hora: "18:00",
    imagen: require("../../assets/images/pelota.png"),
  },
  {
    id: "2",
    nombre: "Grün FC",
    direccion: "Padre Canavery 1351",
    jugadores: "1",
    hora: "18:00",
    imagen: require("../../assets/images/pelota.png"),
  },
    {
    id: "3",
    nombre: "Grün FC",
    direccion: "Padre Canavery 1351",
    jugadores: "3",
    hora: "20:00",
    imagen: require("../../assets/images/pelota.png"),
  },
];

const Tarjeta = ({ item }: { item: Cancha }) => {
  return (
    <View>
        <Pressable style={styles.card}>
      <Image source={item.imagen} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.text}>{item.direccion}</Text>
        <Text style={styles.text}>⏰ {item.hora}</Text>
      </View>
    </Pressable>
    </View>
  );
};

export default function App() {
  return (
        <View style ={styles.container}>
            <View style ={styles.header}>
                <TextInput
                    placeholder="Buscar partidos..."
                    placeholderTextColor="#666"
                    style={styles.searchBar}
                />
            </View>
            <View>
                <Text style ={styles.texto}>Partidos Inscriptos</Text>
            </View>
            <FlatList
                data={DATA}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <Tarjeta item={item} />}
            />
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
    paddingHorizontal: 17,
    paddingVertical: 5,
    fontSize: 14,
  },
  texto:{
    fontWeight: "bold",
    fontSize: 20,
    paddingBottom: 10,
    paddingTop: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    alignItems: "center",
    elevation: 3, 
    shadowColor: "#000", 
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    paddingVertical: 20
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  text: {
    fontSize: 14,
    color: "#555",
  },
});
