import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { getFirestore, collection, addDoc, doc, serverTimestamp, updateDoc, arrayUnion } from 'firebase/firestore'

import Book from '../models/Book';
import Bookdrop from '../models/Bookdrop';

export default function BookdropForm({ onClose, userLocation, app }) {
  const [bookISBN, setBookISBN] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [clue, setClue] = useState('');

  const database = getFirestore(app);

  const submitBookdrop = async () => {
    try {
      // create the book
      const newBook = new Book(bookISBN, bookTitle, bookAuthor);

      // add the book to the database
      const booksCollection = collection(database, 'books');
      bookDocRef = await addDoc(booksCollection, {
        ...newBook,
        created_at: serverTimestamp(),
      })

      // create bookdrop with reference to book
      const newBookdrop = new Bookdrop(
        userLocation.longitude,
        userLocation.latitude,
        doc(database, 'books', bookDocRef.id),
        clue
      );

      // add bookdrop to database
      const bookdropsCollection = collection(database, 'bookdrops');
      addDoc(bookdropsCollection, {
        ...newBookdrop,
        created_at: serverTimestamp(),
      })

      // add the bookdrop to the book doc
      await updateDoc(bookDocRef, {
        bookdrops: arrayUnion(doc(database, 'bookdrops', bookDocRef.id))
      });

      onClose();

    } catch (error) {
      console.error('Error saving bookdrop: ', error)
    }

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
        style={styles.input}
        placeholder="Title"
        onChangeText={(text) => setBookTitle(text)}
        value={bookTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Author"
        onChangeText={(text) => setBookAuthor(text)}
        value={bookAuthor}
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