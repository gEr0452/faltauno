import React from "react";
import { FlatList, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Tarjeta, { Cancha } from "../../components/tarjeta";

const DATA: Cancha[] = [
  {
    id: "1",
    nombre: "Ciudad (Ex-Muni)",
    direccion: "Miguel B. Sanchez 1045",
    jugadores: "2",
    fecha: "Sabado 18:00",
    imagen: require("../../assets/images/arco.jpg"),
    usuario: "Juan Juanes",
  },
  {
    id: "2",
    nombre: "Grün FC",
    direccion: "Padre Canavery 1351",
    jugadores: "1",
    fecha: "Viernes 18:00",
    imagen: require("../../assets/images/arco.jpg"),
    usuario: "Juan Juanes",
  },
      {
    id: "3",
    nombre: "Grün FC",
    direccion: "Padre Canavery 1351",
    jugadores: "3",
    fecha: "Domingo 20:00",
    imagen: require("../../assets/images/arco.jpg"),
    usuario: "Juan Juanes",
  },
];

export default function HomeScreen() {
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
        renderItem={({ item }) => <Tarjeta cancha={item} />}
        contentContainerStyle={{ padding: 16 }}
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
    backgroundColor: "#2e7d32",
    padding: 20,
    height: 150, // 👈 aumenté de 90 a 150 (podés ajustar)
    justifyContent: "flex-end", // baja el buscador dentro del área verde
  },
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 6,
    fontSize: 14,
  },
});
