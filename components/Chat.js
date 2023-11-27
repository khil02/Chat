import {
  StyleSheet,
  View,
  Text,
  Button,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useEffect, useState } from "react";
import { Bubble, GiftedChat } from "react-native-gifted-chat";

const Chat = ({ navigation, route }) => {
  const { name, bgColor } = route.params;
  const [messages, setMessages] = useState([]);

  //sets initial message and title of chat page
  useEffect(() => {
    navigation.setOptions({ title: name });
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        CreatedAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
      {
        _id: 2,
        //{ name: name } + seems like should have added name, it didn't
        text: "You have entered the chat",
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, []);

  //sends and adds message to array
  const onSend = (newMessages) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
  };
  //Gifted Chat example MUST import useCallback if using
  // const onSend = useCallback((messages = []) => {
  //   setMessages(previousMessages =>
  //     GiftedChat.append(previousMessages, messages),
  //   )
  // }, [])

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
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
      />

      {/* Adjust for keyboard on Andriod */}
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
      {/* duplicate, needs to be removed final release */}
      {/* {Platform.OS === "android" && <KeyboardAvoidingView behavior="height" />} */}

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
