import {
  StyleSheet,
  View,
  Text,
  Button,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useEffect, useState } from "react";
import {
  Bubble,
  GiftedChat,
  SystemMessage,
  Day,
} from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const Chat = ({ navigation, route, db }) => {
  const { userID, name, bgColor } = route.params;
  const [messages, setMessages] = useState([]);

  //sets initial message and title of chat page
  useEffect(() => {
    navigation.setOptions({ title: name });
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

    const unsubMessages = onSnapshot(q, (docs) => {
      let newMessages = [];
      docs.forEach((doc) => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis()),
        });
      });
      setMessages(newMessages);
    });

    //clean up code
    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, []);

  //sends and adds message to array
  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };

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
    //alignItems: "center",
  },
});

export default Chat;
