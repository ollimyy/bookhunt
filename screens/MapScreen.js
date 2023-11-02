import MapView, { Marker } from "react-native-maps";
import * as Location from 'expo-location';
import { useState, useEffect } from "react";
import { Alert, View, Button, StyleSheet, Modal } from "react-native";
import BookdropForm from "../components/BookdropForm";

export default function Map(app) {

    const [userLocation, setUserLocation] = useState(null);
    const [mapRegion, setMapRegion] = useState({
        latitude: '60.192059',
        longitude: '24.945831',
        latitudeDelta: 0.012,
        longitudeDelta: 0.011,
    })
    const [isFormVisible, setIsFormVisible] = useState(false);


    useEffect(() => {
        // check location permission
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('No permission to get location');

                return;
            }

            // get location
            let userLocation = await Location.getCurrentPositionAsync({});
            setUserLocation(userLocation);

            // center map on user's location
            setMapRegion(prevRegion => ({
                ...prevRegion,
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
            }))
        })();
    }, []);

    const handleCreateBookdrop = () => {
        setIsFormVisible(true);
    };

    return (
        <View style={{ flex: 1 }}>
            <MapView style={{ flex: 1 }} showsUserLocation={true} region={mapRegion}>
                {/* You can add markers for existing bookdrops here */}
            </MapView>
            <View style={styles.buttonContainer}>
                <Button title="Create Bookdrop" onPress={handleCreateBookdrop} />
            </View>

            <Modal visible={isFormVisible} animationType="slide">
                <BookdropForm onClose={() => setIsFormVisible(false)} userLocation={userLocation} />
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        position: 'absolute',
        bottom: 16,
        right: 16,
    },
});