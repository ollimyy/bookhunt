import MapView, { Circle, Marker } from "react-native-maps";
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

    const getUserLocation = async () => {
        try {
          // Check location permission
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('No permission to get location');
            return null; // Return null if permission is not granted
          }
      
          // Get location
          let userLocation = await Location.getCurrentPositionAsync();
          return userLocation.coords; // Return the user's location coordinates
        } catch (error) {
          // Handle any potential errors here
          console.error('Error getting location:', error);
          return null; // Return null in case of an error
        }
    };

    useEffect(() => {
        const setupLocationAndMapRegion = async () => {
          const locationCoords = await getUserLocation();
          if (locationCoords) {
            setMapRegion((prevRegion) => ({
              ...prevRegion,
              latitude: locationCoords.latitude,
              longitude: locationCoords.longitude,
            }));
          }
        };
      
        // Call the async function to set up location and map region
        setupLocationAndMapRegion();
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

    const handleCreateBookdrop = async () => {
        const locationCoords = await getUserLocation();
        
        if (locationCoords) {
            setUserLocation(locationCoords);
            setIsFormVisible(true);
        } else {
            Alert.alert('Location data needed to create a bookdrop.');
        }
    };

    const handleMarkerPress = (bookdropId) => {
        Alert.alert(bookdropId)
    }

    return (
        <View style={{ flex: 1 }}>
            <MapView style={{ flex: 1 }} showsUserLocation={true} region={mapRegion}>
            
            {Object.keys(bookdrops).map((bookdropId) => {
                const bookdrop = bookdrops[bookdropId];

                return(
                    <View key={bookdropId}>
                    <Marker
                        coordinate={{
                            latitude: bookdrop.latitude,
                            longitude: bookdrop.longitude,
                        }}
                        onPress={() => handleMarkerPress(bookdropId)}
                    />

                    <Circle
                        center={{
                            latitude: bookdrop.latitude,
                            longitude: bookdrop.longitude,
                        }}
                        radius={50}
                        strokeWidth={2}
                        strokeColor="rgba(0, 0, 255, 0.5)"
                        fillColor="rgba(0,0, 255, 0.2)"
                        />
                    </View>
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