import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";

type Tarjeta = {
  id: number;
  partido?: {
    cancha?: string;
    lugar?: string;
    dia?: string;
    hora?: string;
    jugadoresFaltantes?: number;
    usuarioId?: number;
  };
  imagen?: string;
};

export default function Partidos({ item }: { item: Tarjeta }) {
  const nombre = item.partido?.cancha ?? "Sin nombre";
  const direccion = item.partido?.lugar ?? "Sin dirección";
  const fecha = `${item.partido?.dia ?? ""} ${item.partido?.hora ?? ""}`.trim();
  const jugadores = item.partido?.jugadoresFaltantes ?? 0;
  const usuario = `Usuario ${item.partido?.usuarioId ?? "?"}`;
  const image = item.imagen && typeof item.imagen === "string" ? item.imagen : null;

  return (
    <Pressable style={styles.card}>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Image
          source={require("../assets/images/pelota.png")}
          style={styles.image}
        />
      )}

      <View style={styles.info}>
        <Text style={styles.nombre}>{nombre}</Text>
        <Text style={styles.text}>{direccion}</Text>
        <Text style={styles.text}>📅 {fecha}</Text>
        <Text style={styles.text}>👥 {jugadores} jugadores</Text>
        <Text style={styles.text}>{usuario}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
