import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { API_URL } from "../../config/config";

export default function Formulario() {
  const [modalVisible, setModalVisible] = useState(false);
  const [cancha, setCancha] = useState("");
  const [lugar, setLugar] = useState("");
  const [fecha, setFecha] = useState(new Date());
  const [hora, setHora] = useState(new Date());
  const [jugadoresFaltantes, setJugadoresFaltantes] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false); 

  const formatearFecha = (date: Date): string => {
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", 
                   "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    return `${dias[date.getDay()]} ${date.getDate()} de ${meses[date.getMonth()]}`;
  };

  const formatearHora = (date: Date): string => {
    const horas = date.getHours().toString().padStart(2, "0");
    const minutos = date.getMinutes().toString().padStart(2, "0");
    return `${horas}:${minutos}`;
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (event.type !== "dismissed" && selectedDate) {
      setFecha(selectedDate);
    }
    if (Platform.OS === "ios") {
      setShowDatePicker(false);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }
    if (event.type !== "dismissed" && selectedTime) {
      setHora(selectedTime);
    }
    if (Platform.OS === "ios") {
      setShowTimePicker(false);
    }
  };

  const crearPartido = async () => {
    if (!cancha || !lugar || !jugadoresFaltantes) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    if (!jugadoresFaltantes || parseInt(jugadoresFaltantes) <= 0) {
      Alert.alert("Error", "Debes ingresar al menos 1 jugador faltante");
      return;
    }

    setLoading(true);

    try {
      const diaFormateado = formatearFecha(fecha);
      const horaFormateada = formatearHora(hora);

      const response = await fetch(`${API_URL}/partidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cancha,
          lugar,
          dia: diaFormateado,
          hora: horaFormateada,
          jugadoresFaltantes: parseInt(jugadoresFaltantes),
          usuarioId: 1,
        }),
      });

      if (!response.ok) throw new Error("Error al crear el partido");

      const data = await response.json();
      Alert.alert("Éxito", "¡Partido creado correctamente!");

      // Limpia formulario y cierra modal
      setCancha("");
      setLugar("");
      setFecha(new Date());
      setHora(new Date());
      setJugadoresFaltantes("");
      setModalVisible(false);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudo crear el partido");
    } finally {
      setLoading(false);
    }
  };

  const handleJugadoresChange = (text: string) => {
    // Solo permite números
    const numericValue = text.replace(/[^0-9]/g, "");
    setJugadoresFaltantes(numericValue);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>FaltaUno</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.titulo}>¿Te falta uno?</Text>

        <Pressable style={styles.boton} onPress={() => setModalVisible(true)}>
          <Text style={styles.botonTexto}>Crear tu Partido</Text>
        </Pressable>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalFondo}>
          <View style={styles.modalContenido}>
            <Text style={styles.label}>Cancha</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Parque Central"
              value={cancha}
              onChangeText={setCancha}
            />

            <Text style={styles.label}>Lugar</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Belgrano"
              value={lugar}
              onChangeText={setLugar}
            />

            <Text style={styles.label}>Día</Text>
            <Pressable
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.pickerText}>
                {formatearFecha(fecha)}
              </Text>
            </Pressable>
            {showDatePicker && (
              <>
                {Platform.OS === "ios" && (
                  <View style={styles.iosPickerContainer}>
                    <View style={styles.iosPickerHeader}>
                      <Pressable onPress={() => setShowDatePicker(false)}>
                        <Text style={styles.iosPickerButton}>Cancelar</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          setShowDatePicker(false);
                        }}
                      >
                        <Text style={[styles.iosPickerButton, styles.iosPickerButtonConfirm]}>
                          Confirmar
                        </Text>
                      </Pressable>
                    </View>
                    <DateTimePicker
                      value={fecha}
                      mode="date"
                      display="spinner"
                      onChange={onDateChange}
                      minimumDate={new Date()}
                      locale="es-ES"
                      style={styles.iosPicker}
                    />
                  </View>
                )}
                {Platform.OS === "android" && (
                  <DateTimePicker
                    value={fecha}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    minimumDate={new Date()}
                    locale="es-ES"
                  />
                )}
              </>
            )}

            <Text style={styles.label}>Hora</Text>
            <Pressable
              style={styles.input}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.pickerText}>
                {formatearHora(hora)}
              </Text>
            </Pressable>
            {showTimePicker && (
              <>
                {Platform.OS === "ios" && (
                  <View style={styles.iosPickerContainer}>
                    <View style={styles.iosPickerHeader}>
                      <Pressable onPress={() => setShowTimePicker(false)}>
                        <Text style={styles.iosPickerButton}>Cancelar</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          setShowTimePicker(false);
                        }}
                      >
                        <Text style={[styles.iosPickerButton, styles.iosPickerButtonConfirm]}>
                          Confirmar
                        </Text>
                      </Pressable>
                    </View>
                    <DateTimePicker
                      value={hora}
                      mode="time"
                      display="spinner"
                      onChange={onTimeChange}
                      is24Hour={true}
                      locale="es-ES"
                      style={styles.iosPicker}
                    />
                  </View>
                )}
                {Platform.OS === "android" && (
                  <DateTimePicker
                    value={hora}
                    mode="time"
                    display="default"
                    onChange={onTimeChange}
                    is24Hour={true}
                    locale="es-ES"
                  />
                )}
              </>
            )}

            <Text style={styles.label}>Jugadores faltantes</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 2"
              keyboardType="number-pad"
              value={jugadoresFaltantes}
              onChangeText={handleJugadoresChange}
              maxLength={2}
            />

            <View style={styles.botonesFila}>
              <Pressable
                style={[
                  styles.boton, 
                  styles.botonConfirmar,
                  loading && styles.botonDisabled
                ]}
                onPress={crearPartido} // Llamada directa a la función
                disabled={loading}
              >
                <Text style={styles.botonTexto}>
                  {loading ? "Creando..." : "Confirmar"}
                </Text>
              </Pressable>

              <Pressable
                style={[styles.boton, styles.botonDescartar]}
                onPress={() => setModalVisible(false)}
                disabled={loading}
              >
                <Text style={styles.botonTexto}>Descartar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#2e7d32",
    paddingVertical: 20,
    alignItems: "center",
  },
  headerTitulo: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 20,
  },
  boton: {
    backgroundColor: "#2e7d32",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 8,
    minWidth: 120,
  },
  botonDisabled: {
    backgroundColor: "#cccccc",
  },
  botonTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  modalFondo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContenido: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "85%",
    elevation: 5,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#2e7d32",
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  botonesFila: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  botonConfirmar: {
    flex: 1,
    marginRight: 8,
  },
  botonDescartar: {
    flex: 1,
    backgroundColor: "#555",
    marginLeft: 8,
  },
  pickerText: {
    fontSize: 14,
    color: "#000",
    paddingVertical: 2,
  },
  iosPickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 10,
    overflow: "hidden",
  },
  iosPickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#f5f5f5",
  },
  iosPickerButton: {
    fontSize: 16,
    color: "#2e7d32",
    fontWeight: "600",
  },
  iosPickerButtonConfirm: {
    color: "#2e7d32",
  },
  iosPicker: {
    height: 200,
  },
});