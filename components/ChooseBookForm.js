import React, { useState } from 'react'

import Book from '../models/Book';
import { getBookByISBN } from '../utils/BookUtils';
import { Button, TextInput, Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function ChooseBookForm({ onBookSelected, onClose }) {
    const [ISBN, setISBN] = useState('');
    const [bookData, setBookData] = useState('');
    const [message, setMessage] = useState('');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    

    const handleISBNSearch = async () => {
        try {
            const book = await getBookByISBN(ISBN);
            setBookData(book);

            if (book === null) {
                setMessage('Cannot find a book. Please enter book info.')
            }
        } catch (error) {
            console.error(error);
        }
    };

    const showISBNInstructions = () => {
        Alert.alert(
            'Where to find ISBN',
            'ISBN is a series of numbers, either 10 or 13 digits long. \n\n' +
            'You can usually find it in the backcover, under the barcode, spine, first few pages, or near the title and author information.'
        )
    };

    const handleSubmit = () => {
        let selectedBook;

        if (bookData !== null) {
            selectedBook = bookData;
        } else {
            selectedBook = new Book(ISBN, title, author)
        }

        onBookSelected(selectedBook);
    }

    return (
        <View style={styles.formContainer}>
            <Text style={styles.heading}>Select a book for your bookdrop:</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter book ISBN"
                onChangeText={(text) => setISBN(text)}
                value={ISBN}
            />

            <Button title="Search" onPress={handleISBNSearch} />

            <TouchableOpacity onPress={showISBNInstructions}>
                <Text style={styles.touchableText}>What is an ISBN?</Text>
            </TouchableOpacity>

            { /* If search succesful show results */
                bookData && (
                    <View>
                        <Text>Title: {bookData.title}</Text>
                        <Text>Author: {bookData.author}</Text>
                        <Button title="Choose this book" onPress={handleSubmit} />
                    </View>
                )}

            { /* If search unsuccessful, show form to enter data */
                bookData === null ? (
                    <View>
                        <Text style={styles.message}>{message}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Title"
                            onChangeText={(text) => setTitle(text)}
                            value={title}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Enter Author"
                            onChangeText={(text) => setAuthor(text)}
                            value={author}
                        />

                        {title && author && (
                            <Button title="Choose this book" onPress={handleSubmit} />
                        )}

                    </View>
                ) : null}

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
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    touchableText: {
        color: 'blue',
        marginTop: 10,
    },
    message: {
        marginTop: 10,
    },
    input: {
        borderBottomWidth: 1,
        width: '80%',
        margin: 10,
    },
    cancelButton: {
        color: 'red',
        marginTop: 10,
    },
});