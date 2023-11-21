import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function BookdropInstructions({ onClose, code }) {
  return (
    <View style={styles.container}>
      <Text style={styles.code}>{code}</Text>

      <Text style={styles.instruction}>
        Write this code somewhere easy to find on your book!
      </Text>

      <TouchableOpacity style={styles.button} onPress={onClose}>
        <Text style={styles.buttonText}>Got it</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  code: {
    marginTop: 20,
    fontSize: 30,
  },
  instruction: {
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textTransform: "uppercase"
  },
});
