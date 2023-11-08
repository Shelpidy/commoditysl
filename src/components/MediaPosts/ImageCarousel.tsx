import React, { useState } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import Carousel, { Pagination } from 'react-native-snap-carousel';

interface ImageCarouselProps {
  images: string[]; // Array of image URLs
}

const {width,height} = Dimensions.get("window")

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const theme = useTheme()

  const renderItem = ({ item }: { item: string }) => (
    <View style={{ flex: 1 ,marginVertical:6}}>
      <Image
        source={{ uri: item}}
        style={{
          flex: 1,
          resizeMode: 'contain',
          width:width,
          height:height * 0.6
        }}
      />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        data={images}
        renderItem={renderItem}
        sliderWidth={Dimensions.get('window').width}
        itemWidth={Dimensions.get('window').width}
        onSnapToItem={(index) => setActiveSlide(index)}
      />
      <Pagination
        dotsLength={images.length}
        activeDotIndex={activeSlide}
       
      dotColor="black"
      inactiveDotColor={theme.colors.secondary}
      inactiveDotOpacity={0.4}
      inactiveDotScale={0.6}
        
      />
      <View
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius:10,
          padding: 5,
        }}
      >
        <Text style={{ color: 'white' }}>
          {activeSlide + 1}/{images.length}
        </Text>
      </View>
    </View>
  );
};

export default ImageCarousel;
