import { StyleSheet, View, Text, Button } from "react-native";
import { useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";

const Chat = ({ navigation, route }) => {
  const { name, bgColor } = route.params;

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text> Hello, {name}, you can chat here.</Text>
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
    alignItems: "center",
  },
});

export default Chat;
