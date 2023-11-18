import React, { useState, useEffect } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function BarCodeScannerComponent({ onClose, onBarCodeScanned }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(true);

  // handle permission to use camera
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanning(false);
    onBarCodeScanned(data);
  };

  if (hasPermission === null) {
    return <Text>Checking camera permission.</Text>;
  }

  if (hasPermission === false) {
    return <Text>Bar code scanning needs camera permission.</Text>;
  }

  return (
    <View style={styles.container}>
          <Text style={styles.instruction}>Point the camera at the barcode on the book.</Text>
          <BarCodeScanner
            onBarCodeScanned={handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close Scanner</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instruction: {
    top: -200,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 600,
    left: 80,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
  },
});
