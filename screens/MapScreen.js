import MapView, { Marker } from "react-native-maps";
import * as Location from 'expo-location';
import { useState, useEffect } from "react";
import { Alert } from "react-native";

export default function Map() {

    const [userLocation, setUserLocation] = useState(null);
    const [mapRegion, setMapRegion] = useState({
        latitude: '60.192059', 
        longitude: '24.945831',
        latitudeDelta: 0.012,
        longitudeDelta: 0.011,
    })

    useEffect(() => {
        // check location permission
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('No permission to get location');

                return ;
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

    return (
        <MapView
            style={{ flex: 1 }}
            showsUserLocation={ true }
            region = { mapRegion }>
        </MapView>
    )
}