import MapView, { Circle } from "react-native-maps";
import * as Location from 'expo-location';
import { useState, useEffect } from "react";
import { Alert, View, Button, StyleSheet, Modal } from "react-native";
import { getDatabase, ref, onValue } from "firebase/database"
import BookdropForm from "../components/BookdropForm";

export default function Map({ app }) {

    const [userLocation, setUserLocation] = useState(null);
    const [mapRegion, setMapRegion] = useState({
        latitude: '60.192059',
        longitude: '24.945831',
        latitudeDelta: 0.012,
        longitudeDelta: 0.011,
    })
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [bookdrops, setBookdrops] = useState([]);
    const database = getDatabase(app);


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
        });
    }, []);

    useEffect(() => {
        const bookdropsRef = ref(database, 'bookdrops/');

        const unsubscribe = onValue(bookdropsRef, (snapshot) => {
            const data = snapshot.val();

            if(data) {
                setBookdrops(data);
            }
        
        });
        
        return () => {
            unsubscribe();
        }

    }, []);

    const handleCreateBookdrop = () => {
        setIsFormVisible(true);
    };

    return (
        <View style={{ flex: 1 }}>
            <MapView style={{ flex: 1 }} showsUserLocation={true} region={mapRegion}>
            
            {Object.keys(bookdrops).map((bookdropId) => {
                const bookdrop = bookdrops[bookdropId];

                return(
                    <Circle 
                        key={bookdropId}
                        center={{
                            latitude: bookdrop.latitude,
                            longitude: bookdrop.longitude,
                        }}
                        radius={10}
                        strokeWidth={2}
                        strokeColor="rgba(0, 0, 255, 0.5)"
                        fillColor="rgba(0,0, 255, 0.2)"
                    />
                );
            })}
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