import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, TextInput, View } from "react-native";
import Tarjeta, { Cancha } from "../../components/tarjeta";

export default function HomeScreen() {
  const [tarjetas, setTarjetas] = useState<Cancha[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTarjetas = async () => {
      try {
        const response = await fetch("http://192.168.1.3:3000/tarjetas");
        const data = await response.json();
        setTarjetas(data);
      } catch (error) {
        console.error("Error al traer tarjetas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTarjetas();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

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
        data={tarjetas}
        keyExtractor={(item) => item.id.toString()}
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
    height: 150, 
    justifyContent: "flex-end", 
  },
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 6,
    fontSize: 14,
  },
});
