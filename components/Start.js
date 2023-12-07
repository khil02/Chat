import {
  StyleSheet,
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useState } from "react";
import { getAuth, signInAnonymously } from "firebase/auth";

const bgImage = require("../assets/Background-Image.png");

const Start = ({ navigation }) => {
  const [name, setName] = useState("");
  const [bgColor, setBgColor] = useState("#8A95A5");
  //color array for selecting Chat page background
  const bgColors = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];

  const auth = getAuth();

  //Checks if name is blank and navigates to Chat page
  const login = () => {
    name.length > 0
      ? signInAnonymously(auth)
          .then((result) => {
            navigation.navigate("Chat", {
              userID: result.user.uid,
              name: name,
              bgColor: bgColor,
            });
          })
          .catch((error) => {
            Alert.alert("Unable to sign in, try later again.");
          })
      : Alert.alert("Please enter a username.");
  };

  return (
    <ImageBackground source={bgImage} style={styles.bgImage}>
      <Text style={styles.title}> Chat App</Text>
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          value={name}
          onChangeText={setName}
          placeholder="Type your username here"
        />
        <Text>Choose Background Color:</Text>
        <View style={styles.options}>
          {/* This maps the background array into buttons */}
          {bgColors.map((color, index) => (
            //This view adds the "selected" ring around the chosen color
            <View
              key={index + 10}
              style={[
                styles.outline,
                bgColor === color && styles.outlineSelected,
              ]}
            >
              {/* This adds the "button" for each color */}
              <TouchableOpacity
                accessible={true}
                accessibilityLabel="Color Options"
                accessibilityHint="Lets you choose which a background color for the chat screen."
                accessibilityRole="button"
                key={index}
                style={[styles.colorButton, { backgroundColor: color }]}
                onPress={() => setBgColor(color)}
              />
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.chatButton} onPress={login}>
          <Text style={styles.buttonText}>Start Chatting</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    resizeMode: "cover",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "6%",
  },
  title: {
    fontSize: 45,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 70,
    justifyContent: "center",
  },
  //Box holding everything but the title and background image
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    width: "88%",
    height: "44%",
  },
  //Username input box
  textInput: {
    width: "88%",
    padding: 15,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 15,
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
  },
  //Background color section
  options: {
    flexDirection: "row",
    backgroundColor: "white",
    width: "88%",
    justifyContent: "space-between",
  },
  colorButton: {
    borderRadius: 25,
    width: 50,
    height: 50,
    opacity: "100%",
    backgroundColor: "red",
  },
  //Adds a border to inner color selected
  //   selected: {
  //     borderWidth: 1,
  //     borderColor: "#757083",
  //   },
  outline: {
    backgroundColor: "white",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    width: 60,
    height: 60,
    borderColor: "white",
    borderWidth: 2,
  },
  outlineSelected: {
    borderColor: "#757083",
  },
  //Start Chatting button
  chatButton: {
    backgroundColor: "#757083",
    opacity: "100%",
    width: "88%",
    height: "22%",
    alignItems: "center",
    justifyContent: "center",
    margin: "6%",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default Start;
