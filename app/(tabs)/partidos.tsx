import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Modal, Pressable, RefreshControl, StyleSheet, Text, TextInput, View, } from "react-native";
import { useFocusEffect } from "expo-router";
import Partidos from "../../components/partidos";
import { API_URL } from "../../config/config";

type UsuarioInscrito = {
  id: number;
  nombre: string;
};

type Tarjeta = {
  id: number;
  tarjetaId?: number | null;
  cancha?: string;
  lugar?: string;
  dia?: string;
  hora?: string;
  jugadoresFaltantes?: number;
  usuarioId?: number;
  imagen?: string | { uri: string } | null;
  inscritos?: UsuarioInscrito[];
};

export default function PartidosTab() {
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [usuariosInscritos, setUsuariosInscritos] = useState<UsuarioInscrito[]>([]);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState<number | null>(null);
  const [procesandoUsuarioId, setProcesandoUsuarioId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");

  const fetchPartidos = useCallback(async (mostrarLoader = false) => {
    try {
      if (mostrarLoader) {
        setLoading(true);
      }

      const res = await fetch(`${API_URL}/partidos`);
      if (!res.ok) {
        throw new Error("No se pudieron obtener los partidos");
      }

      const data = await res.json();

      const mapped = data.map((p: any) => ({
        id: p.id,
        tarjetaId: p.tarjeta?.id ?? null,
        cancha: p.cancha,
        lugar: p.lugar,
        dia: p.dia,
        hora: p.hora,
        jugadoresFaltantes: p.jugadoresFaltantes,
        usuarioId: p.usuarioId,
        imagen: null,
        inscritos: (p.tarjeta?.usuarios ?? []).map((usuario: any) => ({
          id: usuario.id,
          nombre: usuario.nombre,
        })),
      }));

      setTarjetas(mapped);
    } catch (err) {
      console.error(err);
      const mensaje = err instanceof Error ? err.message : "Error al obtener los partidos";
      Alert.alert("Error", mensaje);
    } finally {
      if (mostrarLoader) {
        setLoading(false);
      }
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPartidos(true);
  }, [fetchPartidos]);

  // Recargar datos cuando vuelves a esta pantalla
  useFocusEffect(
    useCallback(() => {
      fetchPartidos(false);
    }, [fetchPartidos])
  );

  // Función para pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPartidos(false);
  }, [fetchPartidos]);

  // Nota: la inscripción se realiza en la pantalla Home (partidos de otros usuarios)

  const verInscritos = async (tarjetaInfo: Tarjeta) => {
    try {
      if (!tarjetaInfo.tarjetaId) {
        Alert.alert("Info", "No se encontró la tarjeta asociada a este partido");
        return;
      }

      const res = await fetch(`${API_URL}/tarjetas/${tarjetaInfo.tarjetaId}/inscritos`);
      if (!res.ok) {
        throw new Error("No se pudieron obtener los usuarios inscritos");
      }

      const data = await res.json();
      setUsuariosInscritos(data);
      setTarjetaSeleccionada(tarjetaInfo.tarjetaId);
      setModalVisible(true);
    } catch (err) {
      console.error(err);
      const mensaje = err instanceof Error ? err.message : "No se pudieron obtener los usuarios inscritos";
      Alert.alert("Error", mensaje);
    }
  };

  const eliminarPartido = async (partidoId: number) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar este partido? Esta acción no se puede deshacer.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await fetch(`${API_URL}/partidos/${partidoId}`, {
                method: "DELETE",
              });

              const data = await res.json().catch(() => null);

              if (!res.ok) {
                throw new Error(data?.error ?? "No se pudo eliminar el partido");
              }

              await fetchPartidos(true);
              Alert.alert("Listo", "Partido eliminado correctamente.");
            } catch (err) {
              console.error(err);
              const mensaje = err instanceof Error ? err.message : "No se pudo eliminar el partido";
              Alert.alert("Error", mensaje);
            }
          },
        },
      ]
    );
  };

  const darDeBajaInscrito = async (usuarioId: number) => {
    if (!tarjetaSeleccionada) return;

    try {
      setProcesandoUsuarioId(usuarioId);
      const res = await fetch(`${API_URL}/tarjetas/${tarjetaSeleccionada}/desinscribir`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error ?? "No se pudo dar de baja al usuario");
      }

      setUsuariosInscritos((prev) => prev.filter((usuario) => usuario.id !== usuarioId));
      await fetchPartidos();
      Alert.alert("Listo", "Usuario dado de baja correctamente.");
    } catch (err) {
      console.error(err);
      const mensaje = err instanceof Error ? err.message : "No se pudo dar de baja al usuario";
      Alert.alert("Error", mensaje);
    } finally {
      setProcesandoUsuarioId(null);
    }
  };

  const tarjetasFiltradas = tarjetas.filter((tarjeta) => {
    if (!searchText.trim()) return true;
    const busqueda = searchText.toLowerCase();
    return (
      (tarjeta.cancha ?? "").toLowerCase().includes(busqueda) ||
      (tarjeta.lugar ?? "").toLowerCase().includes(busqueda)
    );
  });

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

      <Text style={styles.titulo}>Partidos Creados</Text>
      <FlatList
        data={tarjetasFiltradas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Partidos
              item={{
                id: item.id,
                cancha: item.cancha,
                lugar: item.lugar,
                dia: item.dia,
                hora: item.hora,
                jugadoresFaltantes: item.jugadoresFaltantes,
                usuarioId: item.usuarioId,
                imagen: item.imagen ? { uri: item.imagen } : require("../../assets/images/pelota.png"),
              }}
            />
            <View style={styles.botonesRow}>
              <Pressable
                style={styles.botonDarBaja}
                onPress={() => eliminarPartido(item.id)}
              >
                <Text style={styles.botonTexto}>Eliminar Partido</Text>
              </Pressable>
              {/* Inscribirse aquí no aplica; la inscripción se hace desde Home */}
              <Pressable
                style={styles.botonVerInscritos}
                onPress={() => verInscritos(item)}
              >
                <Text style={styles.botonTexto}>Ver Inscritos</Text>
              </Pressable>
            </View>
          </View>
        )}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2e7d32" />
        }
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalFondo}>
          <View style={styles.modalContenido}>
            <Text style={styles.modalTitulo}>
              Usuarios Inscritos ({usuariosInscritos.length})
            </Text>
            {usuariosInscritos.length > 0 ? (
              usuariosInscritos.map((usuario) => (
                <View key={usuario.id} style={styles.usuarioRow}>
                  <Text style={styles.usuarioTexto}>{usuario.nombre}</Text>
                  <Pressable
                    style={[
                      styles.usuarioBajaButton,
                      procesandoUsuarioId === usuario.id && styles.usuarioBajaButtonDisabled,
                    ]}
                    disabled={procesandoUsuarioId === usuario.id}
                    onPress={() => darDeBajaInscrito(usuario.id)}
                  >
                    <Text style={styles.usuarioBajaTexto}>
                      {procesandoUsuarioId === usuario.id ? "Procesando..." : "Dar de baja"}
                    </Text>
                  </Pressable>
                </View>
              ))
            ) : (
              <Text style={{ textAlign: "center", color: "#666" }}>
                No hay usuarios inscritos aún
              </Text>
            )}
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
    height: 150, // 👈 aumenté de 90 a 150 (podés ajustar)
    justifyContent: "flex-end", // baja el buscador dentro del área verde
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
  usuarioRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
  },
  usuarioBajaButton: {
    backgroundColor: "#c62828",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  usuarioBajaButtonDisabled: {
    opacity: 0.6,
  },
  usuarioBajaTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  botonCerrarModal: {
    backgroundColor: "#2e7d32",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
});