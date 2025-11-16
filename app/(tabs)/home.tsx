import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import Tarjeta from "../../components/tarjeta";
import { API_URL } from "../../config/config";
import { useAppSelector } from "@/store/hooks";

type UsuarioInscrito = {
  id: number;
  nombre: string;
};

type TarjetaType = {
  id: number;
  nombre: string;
  direccion: string;
  jugadores: number;
  fecha: string;
  image?: string;
  usuario: string;
  inscritos?: UsuarioInscrito[];
};

export default function Home() {
  const [tarjetas, setTarjetas] = useState<TarjetaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();
  const { usuario, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated || !usuario) {
      router.replace("/login");
    }
  }, [isAuthenticated, usuario, router]);

  const fetchTarjetas = useCallback(async (mostrarLoader = false) => {
    try {
      if (mostrarLoader) {
        setLoading(true);
      }

      // Obtener tarjetas (include usuarios inscritos y jugadores faltantes)
      const res = await fetch(`${API_URL}/tarjetas`);
      const data = await res.json();

      // Las tarjetas vienen ya formateadas desde el backend
      setTarjetas(data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudieron obtener los partidos");
    } finally {
      if (mostrarLoader) {
        setLoading(false);
      }
      setRefreshing(false);
    }
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchTarjetas(true);
  }, [fetchTarjetas]);

  // Recargar datos cuando vuelves a esta pantalla
  useFocusEffect(
    useCallback(() => {
      fetchTarjetas(false);
    }, [fetchTarjetas])
  );

  // Función para pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTarjetas(false);
  }, [fetchTarjetas]);

const inscribirse = async (tarjetaId: number) => {
  if (!usuario) return;
  
  try {
    const res = await fetch(`${API_URL}/tarjetas/${tarjetaId}/inscribir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuarioId: usuario.id }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.error ?? "Error al inscribirse al partido");
    }

    // refrescar tarjetas
    await fetchTarjetas();
    Alert.alert("¡Listo!", "Te has inscrito al partido.");
  } catch (err) {
    console.error(err);
    const mensaje = err instanceof Error ? err.message : "No se pudo inscribir al usuario";
    Alert.alert("Error", mensaje);
  }
};

const darseDeBaja = async (tarjetaId: number) => {
  if (!usuario) return;
  
  try {
    const res = await fetch(`${API_URL}/tarjetas/${tarjetaId}/desinscribir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuarioId: usuario.id }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.error ?? "Error al darse de baja del partido");
    }

    await fetchTarjetas();
    Alert.alert("Listo", "Te diste de baja del partido.");
  } catch (err) {
    console.error(err);
    const mensaje = err instanceof Error ? err.message : "No se pudo dar de baja al usuario";
    Alert.alert("Error", mensaje);
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
          <Tarjeta
            item={item}
            onInscribirse={inscribirse}
            onDarseDeBaja={darseDeBaja}
            currentUserId={usuario?.id}
          />
        )}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2e7d32" />
        }
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
