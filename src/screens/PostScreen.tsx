import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import PostForm from "../components/MediaPosts/PostForm";

const PostScreen = () => {
   return (
      <ScrollView style={styles.container}>
         {/* <Text>PostScreen</Text> */}
         <PostForm />
      </ScrollView>
   );
};

export default PostScreen;

const styles = StyleSheet.create({
   container: {
      backgroundColor: "#ffffff",
      flex: 1,
   },
});
