import React, { useEffect, useState } from "react";
import {
   StyleSheet,
   Text,
   View,
   Image,
   ActivityIndicator,
   FlatList,
   Dimensions,
   TouchableOpacity,
   ScrollView,
   Pressable,
} from "react-native";
import { useTheme } from "react-native-paper";

type ImageViewerProps = {
   images: any;
};

const { width, height } = Dimensions.get("screen");

const ImagesViewer: React.FC<ImageViewerProps> = ({ images }) => {
   const [postImages, setPostImages] = useState<string[] | null>([]);
   const [imgIndex, setImgIndex] = useState<number>(0);
   const theme = useTheme();

   useEffect(() => {
      setPostImages(images);
   }, [images]);

   const renderItem = ({ item, index }: any) => {
      return (
         <Pressable
            style={{ padding: 0, margin: 0 }}
            key={item}
            onPress={() => setImgIndex(index)}>
            <Image
               // resizeMethod="auto"
               resizeMode="cover"
               style={styles.otherImage}
               source={{ uri: item }}
            />
         </Pressable>
      );
   };

   if (!postImages || postImages.length === 0) {
      return (
         <View>
            <ActivityIndicator />
         </View>
      );
   }

   return (
      <View style={{ position: "relative", marginBottom: 20 }}>
         <FlatList
            snapToStart
            data={postImages}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            onScroll={(event) => {
               const offsetX = event.nativeEvent.contentOffset.x;
               const newIndex = Math.floor(offsetX / width);
               setImgIndex(newIndex);
            }}
            snapToAlignment="center" // Align images to the center
            snapToInterval={width} // Set the snap interval to the width of the screen
            decelerationRate="normal" // Adjust the deceleration rate for a snappier scroll
            contentContainerStyle={{ width: width * postImages.length }}
         />
         <ScrollView horizontal style={styles.indicatorContainer}>
            {postImages.map((_, index) => (
               <View
                  key={index.toString()}
                  style={[
                     styles.indicator,
                     {
                        backgroundColor:
                           index === imgIndex
                              ? theme.colors.primary
                              : theme.colors.secondaryContainer,
                     },
                  ]}
               />
            ))}
         </ScrollView>
      </View>
   );
};

export default ImagesViewer;

const styles = StyleSheet.create({
   otherImage: {
      width,
      height: "auto",
      minHeight: height / 2,
      marginBottom: 5,
      borderRadius: 2,
      resizeMode: "cover",
      padding: 0,
      margin: 0,
   },
   indicatorContainer: {
      flexDirection: "row",
      alignSelf: "center",
      position: "absolute",
      bottom: -15,
   },
   indicator: {
      width: 6,
      height: 6,
      borderRadius: 5,
      margin: 4,
   },
});
