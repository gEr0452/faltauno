import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View, } from "react-native";
import Partidos from "../../components/partidos";
import { API_URL } from "../../config/config";

type UsuarioInscrito = {
  id: number;
  nombre: string;
};

type Tarjeta = {
  id: number;
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
  const [modalVisible, setModalVisible] = useState(false);
  const [usuariosInscritos, setUsuariosInscritos] = useState<UsuarioInscrito[]>([]);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState<number | null>(null);

  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        // Obtener partidos creados por el usuario (endpoint /partidos)
        const res = await fetch(`${API_URL}/partidos`);
        const data = await res.json();

        // Mapear al shape que espera el componente Partidos
        const mapped = data.map((p: any) => ({
          id: p.id,
          cancha: p.cancha,
          lugar: p.lugar,
          dia: p.dia,
          hora: p.hora,
          jugadoresFaltantes: p.jugadoresFaltantes,
          usuarioId: p.usuarioId,
          imagen: null,
        }));

        setTarjetas(mapped);
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "No se pudieron obtener los partidos");
      } finally {
        setLoading(false);
      }
    };
    fetchPartidos();
  }, []);

  // Nota: la inscripción se realiza en la pantalla Home (partidos de otros usuarios)

  const verInscritos = async (partidoId: number) => {
    try {
      // Buscar la tarjeta asociada al partido para obtener su id
      const resTarjetas = await fetch(`${API_URL}/tarjetas`);
      const tarjetasData: any[] = await resTarjetas.json();
      const found = tarjetasData.find((t) => t.partidoId === partidoId || t.id === partidoId);
      if (!found) {
        Alert.alert("Info", "No hay tarjeta asociada a este partido");
        return;
      }

      const res = await fetch(`${API_URL}/tarjetas/${found.id}/inscritos`);
      const data = await res.json();
      setUsuariosInscritos(data);
      setTarjetaSeleccionada(found.id);
      setModalVisible(true);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudieron obtener los usuarios inscritos");
    }
  };

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
        />
      </View>

      <Text style={styles.titulo}>Partidos Creados</Text>
      <FlatList
        data={tarjetas}
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
              <Pressable style={styles.botonDarBaja}>
                <Text style={styles.botonTexto}>Dar de Baja</Text>
              </Pressable>
              {/* Inscribirse aquí no aplica; la inscripción se hace desde Home */}
              <Pressable
                style={styles.botonVerInscritos}
                onPress={() => verInscritos(item.id)}
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
            <Text style={styles.modalTitulo}>
              Usuarios Inscritos ({usuariosInscritos.length})
            </Text>
            {usuariosInscritos.length > 0 ? (
              usuariosInscritos.map((usuario) => (
                <Text key={usuario.id} style={styles.usuarioTexto}>
                  {usuario.nombre}
                </Text>
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
  botonCerrarModal: {
    backgroundColor: "#2e7d32",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
});