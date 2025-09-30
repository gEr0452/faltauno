import React, { useState } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";

export default function Formulario(){
    const [modalVisible, setModalVisible] = useState(false);

    return(
        <View style = {styles.container}>
            <Text style = {styles.texto}>¿Te falta uno?</Text>
            <Pressable onPress={()=> setModalVisible(true)}>
            <View>
                <Text style = {styles.texto}>
                    Crear tu Partido
                </Text>
            </View>
            </Pressable>

            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}>
                    <View>
                        <View>
                            <Text style = {styles.texto}>Ubicacion</Text>
                            <TextInput></TextInput>
                        </View>
                        <View>
                            <Text style = {styles.texto}>Lugar</Text>
                            <TextInput></TextInput>
                        </View>
                        <View>
                            <Text style = {styles.texto}>Hora</Text>
                            <TextInput></TextInput>
                        </View>
                        <View>
                            <Text style = {styles.texto}>Jugador(es) faltante(s):</Text>
                            <TextInput></TextInput>
                        </View>

                        <Pressable onPress={()=> setModalVisible(false)}>
                            <Text style = {styles.texto}>Confirmar</Text>
                        </Pressable>

                        <Pressable onPress={()=> setModalVisible(false)}>
                            <Text style = {styles.texto} >Descartar</Text>
                        </Pressable>
                    </View>
            </Modal>
        </View>

    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center"
    },
    texto:{
        fontWeight: "bold"
    }
}
)