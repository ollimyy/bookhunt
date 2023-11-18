import React, { useState, useEffect } from 'react'

import Book from '../models/Book';
import { getBookByISBN } from '../utils/BookUtils';
import { Button, TextInput, Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import BarCodeScannerComponent from './BarCodeScannerComponent';

export default function ChooseBookForm({ onBookSelected, onClose }) {
    const [ISBN, setISBN] = useState('');
    const [bookData, setBookData] = useState('');
    const [message, setMessage] = useState('');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [scannerOpen, setScannerOpen] = useState(false);
    const [barcodeScanned, setBarcodeScanned] = useState(false);

    // search isbn from open library api
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

    const handleBarcodeScanned = (data) => {
        setScannerOpen(false);
        setISBN(data);
        setBarcodeScanned(true)
    };

    // do the isbn search after scanning the barcode
    useEffect(() => {
        if (barcodeScanned) {
            handleISBNSearch();
            setBarcodeScanned(false);
        }
    }, [barcodeScanned]);

    const openScanner = () => {
        setScannerOpen(true);
        setISBN(''); // Clear ISBN when opening scanner
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

    const renderScannerView = () => (
        <BarCodeScannerComponent
            onClose={() => setScannerOpen(false)} onBarCodeScanned={handleBarcodeScanned}
        />
    );

    return (
        <View style={styles.formContainer}>

            {scannerOpen ? (
                renderScannerView()
                ) : (
                <View>
                    <Text style={styles.heading}>Select a book for your bookdrop:</Text>
                
                    <TextInput
                        style={styles.input}
                        placeholder="Enter book ISBN"
                        onChangeText={(text) => setISBN(text)}
                        value={ISBN}
                    />

                    <TouchableOpacity onPress={() => openScanner()}>
                        <Text style={styles.scanButton}>Scan Barcode</Text>
                    </TouchableOpacity>

                    <Button title="Search" onPress={handleISBNSearch} style={styles.button}/>

                    <TouchableOpacity onPress={showISBNInstructions}>
                        <Text style={styles.touchableText}>What is an ISBN?</Text>
                    </TouchableOpacity>

                    { /* If search successful show results */
                        bookData && (
                            <View>
                                <Text>Title: {bookData.title}</Text>
                                <Text>Author: {bookData.author}</Text>
                                <Button title="Choose this book" onPress={handleSubmit} style={styles.button}/>
                            </View>
                        )}

                    { /* If search unsuccessful, show form to enter data */
                        bookData === null && (
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
                        )}

                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.cancelButton}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            )}
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
    button: {
        marginTop: 20,
    },
    touchableText: {
        color: 'blue',
        marginTop: 20,
    },
    message: {
        marginTop: 20,
    },
    input: {
        borderBottomWidth: 1,
        width: '80%',
        marginTop: 20,
    },
    scanButton: {
        color: 'blue',
        marginTop: 20,
    },
    cancelButton: {
        color: 'red',
        marginTop: 20,
    },
});