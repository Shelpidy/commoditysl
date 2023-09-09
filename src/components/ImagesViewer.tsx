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
} from "react-native";
import { useTheme } from "react-native-paper";

type ImageViewerProps = {
  images: any;
};

const { width } = Dimensions.get("window");

const ImagesViewer: React.FC<ImageViewerProps> = ({ images }) => {
  const [postImages, setPostImages] = useState<string[]|null>([]);
  const [imgIndex, setImgIndex] = useState<number>(0);
  const theme = useTheme()

  useEffect(() => {
    setPostImages(images);
  }, [images]);

  const renderItem = ({ item, index }: any) => {
    return (
      <TouchableOpacity
        key={item}
        onPress={() => setImgIndex(index)}
      >
        <Image
          resizeMethod="resize"
          resizeMode="cover"
          style={styles.otherImage}
          source={{ uri: item }}
        />
      </TouchableOpacity>
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
    <View style={{ flex: 1 }}>
      <FlatList
        data={postImages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onScroll={(event) => {
          const offsetX = event.nativeEvent.contentOffset.x;
          const newIndex = Math.ceil((offsetX)/ width);
          setImgIndex(newIndex);
        }}
      />
      <ScrollView horizontal style={styles.indicatorContainer}>
        {postImages.map((_, index) => (
          <View
            key={index.toString()}
            style={[
              styles.indicator,
              { backgroundColor: index === imgIndex ? theme.colors.primary :theme.colors.secondaryContainer },
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
    minHeight:400,
    marginBottom: 5,
    borderRadius: 2,
  },
  indicatorContainer: {
    flexDirection: "row",
    alignSelf: "center",
    position: "absolute",
    bottom: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 5,
    margin: 4,
  },
});
