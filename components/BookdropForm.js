import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { getDatabase, push, ref } from 'firebase/database'

export default function BookdropForm({ onClose, userLocation, app }) {
  const [bookISBN, setBookISBN] = useState('');
  const [clue, setClue] = useState(''); // Add state for the clue

  const database = getDatabase(app);

  const submitBookdrop = () => {
    const bookdropData = {
      bookISBN,
      clue,
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
    };

    push(ref(database, 'bookdrops/'), bookdropData)
      .then(() => {
        onClose();
      })
      .catch((error) => {
        console.error('Error saving bookdrop: ', error);
      })
  };

  return (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder="Latitude"
        value={userLocation ? userLocation.latitude.toString() : ''}
        editable={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Longitude"
        value={userLocation ? userLocation.longitude.toString() : ''}
        editable={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Book ISBN"
        onChangeText={(text) => setBookISBN(text)}
        value={bookISBN}
      />

      <TextInput
        style={styles.multilineInput}
        placeholder="Write a clue (optional)"
        onChangeText={(text) => setClue(text)}
        value={clue}
        multiline={true}
        numberOfLines={20}
      />

      <Button title="Submit" onPress={submitBookdrop} />

      <TouchableOpacity onPress={onClose}>
        <Text style={styles.cancelButton}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderBottomWidth: 1,
    width: '80%',
    marginBottom: 10,
  },
  multilineInput: {
    borderWidth: 1,
    width: '80%',
    height: 100, // Adjust the height as needed
    marginBottom: 10,
  },
  cancelButton: {
    color: 'red',
    marginTop: 10,
  },
});