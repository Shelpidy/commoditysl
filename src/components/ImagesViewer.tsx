import {
   StyleSheet,
   Text,
   View,
   Image,
   ActivityIndicator,
   ScrollView,
   Touchable,
   Pressable,
   Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
// import { ScrollView } from "react-native-gesture-handler";

type ImageViewerProps = {
   images: any;
};

const { width, height } = Dimensions.get("window");

const ImagesViewer: any = ({ images }: ImageViewerProps) => {
   const [postImages, setPostImages] = useState<any>(null);
   const [imgIndex, setImgIndex] = useState<number>(0);

   useEffect(() => {
      setPostImages(images);
      console.log(images);
   }, []);

   if (!postImages) {
      return (
         <View>
            <ActivityIndicator />
         </View>
      );
   }
   return (
      <View>
         {JSON.parse(postImages).length > 1 && (
            <ScrollView horizontal={true} style={{ width: "100%" }}>
               {JSON.parse(postImages).map((image: string, index: number) => {
                  return (
                     <Pressable
                        key={index.toString()}
                        onPress={() => setImgIndex(index)}>
                        {/* <Text>Image Listing kkk kkfkfkkk</Text> */}
                        <Image
                           resizeMode="cover"
                           style={styles.otherImage}
                           source={{ uri: image }}
                        />
                     </Pressable>
                  );
               })}
            </ScrollView>
         )}

         <Image
            resizeMode="cover"
            style={styles.image}
            source={{ uri: JSON.parse(postImages)[imgIndex] }}
         />
      </View>
   );
};

export default ImagesViewer;

const styles = StyleSheet.create({
   image: {
      width: "100%",
      height: 380,
      marginBottom: 5,
      borderRadius: 2,
   },
   otherImage: {
      width: width / 2,
      height: 200,
      marginBottom: 5,
      margin: 3,
      borderRadius: 2,
   },
});
