import { useState } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";

type CardProps = {
  text: string;
};

export default function Card({ text }: CardProps) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      
      <Pressable
        onPress={() => setModalVisible(true)}
        style={styles.tarjeta}
      >
        <Image source={require("../assets/images/arco.jpg")} style ={styles.imagen}/>
        <Text style={styles.tarjetaText}>{text}</Text>
      </Pressable>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              {`Este es el modal de "${text}"`}
            </Text>

            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
imagen: {
  width: 200,       
  height: 200,      
  resizeMode: "cover", 
},

  tarjetaText: {
    fontSize: 18,
    color: "#000",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
  },
  closeButton: {
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
