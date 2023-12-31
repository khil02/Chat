import {
  StyleSheet,
  View,
  Text,
  Button,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import {
  Bubble,
  GiftedChat,
  SystemMessage,
  Day,
  InputToolbar,
} from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import CustomActions from "./CustomActions";
import MapView from "react-native-maps";
//import { async } from "@firebase/util";

const Chat = ({ navigation, route, db, isConnected, storage }) => {
  const { userID, name, bgColor } = route.params;
  const [messages, setMessages] = useState([]);
  let soundObject = null;

  //Declared for use in useEffect
  let unsubMessages;
  //sets initial message and title of chat page
  useEffect(() => {
    navigation.setOptions({ title: name });
    //tests if connected to internet
    if (isConnected === true) {
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

      unsubMessages = onSnapshot(q, (docs) => {
        let newMessages = [];
        docs.forEach((doc) => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          });
        });
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
    } else loadCachedMessages();

    //clean up code
    return () => {
      if (unsubMessages) unsubMessages();
      if (soundObject) soundObject.unloadAsync();
    };
  }, [isConnected]);

  //Stores/Caches messages
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  //Loads cached messages
  const loadCachedMessages = async () => {
    const storedMessages = (await AsyncStorage.getItem("messages")) || [];
    setMessages(JSON.parse(storedMessages));
  };

  //sends and adds message to array
  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  //Message bubble configurations
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        //Change message bubble colors
        wrapperStyle={{
          right: {
            backgroundColor: "lightblue",
          },
          left: {
            backgroundColor: "#FFF",
          },
        }}
        //Changes text in bubbles
        textStyle={{
          right: {
            color: "black",
          },
          left: {
            color: "blue",
          },
        }}
      />
    );
  };

  //Changes Time/date display color based on the background color
  const renderDay = (props) => {
    let sysText = bgColor == "#B9C6AE" ? "black" : "white";
    return <Day {...props} textStyle={{ color: sysText }} />;
  };

  //Changes system message color based on the background color
  const renderSystemMessage = (props) => {
    let sysText = bgColor == "#B9C6AE" ? "black" : "white";
    return <SystemMessage {...props} textStyle={{ color: sysText }} />;
  };

  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };
  // renders photo/location options
  const renderCustomActions = (props) => {
    return <CustomActions storage={storage} userID={userID} {...props} />;
  };

  const renderAudioBubble = (props) => {
    return (
      <View {...props}>
        <TouchableOpacity
          style={{ backgroundColor: "#FF0", borderRadius: 10, margin: 5 }}
          onPress={async () => {
            if (soundObject) soundObject.unloadAsync();
            const { sound } = await Audio.Sound.createAsync({
              uri: props.currentMessage.audio,
            });

            soundObject = sound;
            await sound.playAsync();
          }}
        >
          <Text style={{ textAlign: "center", color: "black", padding: 5 }}>
            Play Sound
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  // Render map for location sharing
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3,
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Message at top of page */}
      <Text style={{ alignSelf: "center", fontWeight: 800 }}>
        {" "}
        Hello, {name}, you can chat here.
      </Text>

      {/* Chat component */}
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderDay={renderDay}
        renderSystemMessage={renderSystemMessage}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        renderMessageAudio={renderAudioBubble}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userID,
          name: name,
        }}
      />

      {/* Adjust for keyboard on Andriod */}
      {Platform.OS === "android" && <KeyboardAvoidingView behavior="height" />}

      {/* Adjusts for keyboard on ios */}
      {Platform.OS === "ios" && <KeyboardAvoidingView behavior="padding" />}

      <Button
        title="Return to Start screen"
        onPress={() => navigation.navigate("Start")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "Center",
  },
});

export default Chat;
