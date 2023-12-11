import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Map from './screens/MapScreen';
import { initializeApp } from 'firebase/app'
import firebaseConfig from './config/firebaseConfig.js';

const app = initializeApp(firebaseConfig);

export default function App() {

  return (
    <View style={styles.container}>
      <Map app={app}/>
      <StatusBar translucent={false} style='light' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
