import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import Tarjeta from "../../components/tarjeta"; // Asegúrate de que la ruta sea correcta
import { API_URL } from "../../config/config";

type TarjetaType = {
  id: number;
  nombre: string;
  direccion: string;
  jugadores: number;
  fecha: string;
  image?: string;
  usuario: string;
};

export default function Home() {
  const [tarjetas, setTarjetas] = useState<TarjetaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchTarjetas();
  }, []);

const fetchTarjetas = async () => {
  try {
    // Obtener tarjetas (include usuarios inscritos y jugadores faltantes)
    const res = await fetch(`${API_URL}/tarjetas`);
    const data = await res.json();

    // Las tarjetas vienen ya formateadas desde el backend
    setTarjetas(data);
  } catch (err) {
    console.error(err);
    Alert.alert("Error", "No se pudieron obtener los partidos");
  } finally {
    setLoading(false);
  }
};

const inscribirse = async (tarjetaId: number) => {
  try {
    // TODO: usar el usuario autenticado en vez de id 1
    const res = await fetch(`${API_URL}/tarjetas/${tarjetaId}/inscribir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuarioId: 1 }),
    });

    if (!res.ok) throw new Error("Error al inscribir");

    // refrescar tarjetas
    await fetchTarjetas();
    Alert.alert("¡Listo!", "Te has inscrito al partido.");
  } catch (err) {
    console.error(err);
    Alert.alert("Error", "No se pudo inscribir al usuario");
  }
};


const filteredTarjetas = tarjetas.filter(tarjeta =>
  (tarjeta.nombre?.toLowerCase() ?? "").includes(searchText.toLowerCase()) ||
  (tarjeta.direccion?.toLowerCase() ?? "").includes(searchText.toLowerCase())
);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text>Cargando partidos...</Text>
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
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        data={filteredTarjetas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Tarjeta item={item} onInscribirse={inscribirse} />
        )}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchText ? "No se encontraron partidos" : "No hay partidos disponibles"}
          </Text>
        }
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
  lista: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    paddingTop: 10,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 50,
    fontSize: 16,
  },
});
