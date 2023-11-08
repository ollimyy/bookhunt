import React from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { getFirestore, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export default function CollectForm({ onClose, bookdropId, app }) {
    
    const database = getFirestore(app);
    
    const handleCollect = async (bookdropId) => {
        const bookdropsRef = doc(database, 'bookdrops', bookdropId);

        await updateDoc(bookdropsRef, {
            collected_at: serverTimestamp(),
        });

        onClose();
    };
      

    return (
        <View style={styles.formContainer}>
            <Text>{bookdropId}</Text>
            <Button title="Collect" onPress={() => handleCollect(bookdropId)}/>

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
        marginTop: 10,
    },
});