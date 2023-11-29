import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
//import the screens
import Start from "./components/Start";
import Chat from "./components/Chat";

//create the navigator
const Stack = createNativeStackNavigator();

export default function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyBfnD98z8mzbVIEnX1CWJLyxLsqqOQRcAw",
    authDomain: "chat-demo-7111f.firebaseapp.com",
    projectId: "chat-demo-7111f",
    storageBucket: "chat-demo-7111f.appspot.com",
    messagingSenderId: "316123474321",
    appId: "1:316123474321:web:c1d2c6235dac7382271230",
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => <Chat db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
