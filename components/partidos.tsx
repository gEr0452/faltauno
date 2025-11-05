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
  cancha?: string;
  lugar?: string;
  dia?: string;
  hora?: string;
  jugadoresFaltantes?: number;
  usuarioId?: number;
  imagen?: string;
};

export default function Partidos({ item }: { item: Tarjeta }) {
  const nombre = item.cancha ?? "Sin nombre";
  const direccion = item.lugar ?? "Sin dirección";
  const fecha = `${item.dia ?? ""} ${item.hora ?? ""}`.trim();
  const jugadores = item.jugadoresFaltantes ?? 0;
  const usuario = `Usuario ${item.usuarioId ?? "?"}`;
  // image puede venir como string (url), como objeto { uri } o como fuente require();
  let imageSource: any = require("../assets/images/pelota.png");
  if (item.imagen) {
    if (typeof item.imagen === "string") {
      imageSource = { uri: item.imagen };
    } else if (typeof item.imagen === "object" && (item.imagen as any).uri) {
      imageSource = item.imagen;
    }
  }

  return (
    <Pressable style={styles.card}>
      <Image source={imageSource} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.nombre}>{nombre}</Text>
        <Text style={styles.text}>{direccion}</Text>
        <Text style={styles.text}>📅 {fecha}</Text>
  <Text style={styles.text}>{jugadores > 0 ? `👥 ${jugadores} jugadores` : "COMPLETADO"}</Text>
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
