import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";

type Cancha = {
  id: string;
  nombre: string;
  direccion: string;
  hora: string;
  jugadores: string;
  imagen: any;
  usuario: string;
};


export default function Partidos({ item }: { item: Cancha }){
  return (
    <Pressable style={styles.card}>
      <Image source={item.imagen} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.text}>{item.direccion}</Text>
        <Text style={styles.text}>⏰ {item.hora}</Text>
        <Text style={styles.text}>{item.usuario}</Text>
      </View>
    </Pressable>
  );
};

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