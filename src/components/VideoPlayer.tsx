import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import { ResizeMode, Video } from "expo-av";
type VideoPlayerProps = {
   video: string;
};
const {width,height} = Dimensions.get("window")

const VideoPlayer: any = (video: VideoPlayerProps) => {
   return (
      <View>
          <Video
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            source={{ uri: video.video }}
            style={{
               width: width,
               height: 0.45 * height,
               margin: 0,
               
            }}
         />
      </View>
   );
};

export default VideoPlayer;

const styles = StyleSheet.create({});
