import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput } from 'react-native';
import { getFirestore, doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';

export default function CollectForm({ onClose, bookdropId, app }) {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [code, setCode] = useState('');
    const [clue, setClue] = useState('');
    const [inputCode, setInputCode] = useState('');
    const [message, setMessage] = useState('');

    const database = getFirestore(app);
    const bookdropsRef = doc(database, 'bookdrops', bookdropId);

    const getBookDropInfo = async () => {
        // get bookdrop infor
        const bookdropDoc = await getDoc(bookdropsRef);
        setClue(bookdropDoc.data().clue)

        // get the book info
        const bookRef = bookdropDoc.data().book;
        const bookDoc = await getDoc(bookRef);

        setTitle(bookDoc.data().title);
        setAuthor(bookDoc.data().author);
        setCode(bookDoc.data().code);
    }

    useEffect(() => {
        getBookDropInfo();
    }, []);

    const handleCollect = async () => {
        if (code === inputCode) {
            await updateDoc(bookdropsRef, {
                collected_at: serverTimestamp(),
            });

            onClose();
        } else {
            setMessage('The code does not match.')
        }
    };

    return (
        <View style={styles.formContainer}>
            <Text style={styles.title}>{title} - {author}</Text>
            <Text>{clue}</Text>

            <Text style={styles.message}>Enter the code on the book:</Text>
            <TextInput
                style={styles.input}
                placeholder="******"
                onChangeText={(text) => setInputCode(text)}
                value={inputCode}
                autoCapitalize={'characters'}
                maxLength={6}
            />

            <TouchableOpacity style={styles.button} onPress={() => handleCollect(bookdropId)}>
                <Text style={styles.buttonText}>Collect</Text> 
            </TouchableOpacity>

            <Text style={styles.message}>{message}</Text>

            <TouchableOpacity onPress={onClose}>
                <Text style={styles.cancelButton}>Go back</Text>
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
    cancelButton: {
        color: 'red',
        marginTop: 30,
    },
    message: {
        marginTop: 20,
    },
    input: {
        width: 200,
        letterSpacing: 18,
        fontSize: 16,
        padding: 10,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        backgroundColor: '#f5f5f5',
        marginTop: 20,
    },
    title: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        elevation: 3,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});