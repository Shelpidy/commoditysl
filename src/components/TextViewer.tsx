import { StyleSheet, Text, View } from "react-native";
import React from "react";

type TextViewerProps = {
   text?: string;
};

const TextViewer = ({ text }: TextViewerProps) => {
   return (
      <View>
         <Text style={styles.text}>{text}</Text>
      </View>
   );
};

export default TextViewer;

const styles = StyleSheet.create({
   text: {
      fontFamily: "Poppins_300Light",
      fontSize: 15,
      marginHorizontal: 10,
   },
});
