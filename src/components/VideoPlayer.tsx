import { StyleSheet, Text, View } from "react-native";
import React from "react";

type VideoPlayerProps = {
   video?: string;
};

const VideoPlayer: any = (video: VideoPlayerProps) => {
   return (
      <View>
         <Text>VideoPlayer</Text>
      </View>
   );
};

export default VideoPlayer;

const styles = StyleSheet.create({});
