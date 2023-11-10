import React, { useState, useEffect } from "react";
import { View, Text, Animated, Dimensions } from "react-native";

const CustomToast = ({ message }:{message:string}) => {
  const [toastVisible, setToastVisible] = useState(false);
  const translateY = new Animated.Value(100);

  useEffect(() => {
    if (message) {
      console.log("Toaste Running...")
     
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(()=>{
        setToastVisible(true);
      });

      setToastVisible(false);

      // Hide the toast after 3 seconds (adjust the duration as needed)
      // setTimeout(() => {
      //   Animated.timing(translateY, {
      //     toValue: 100,
      //     duration: 300,
      //     useNativeDriver: true,
      //   }).start(() => {
      //     setToastVisible(false);
      //   });
      // }, 3000);
    }

  },[message]);

  if (!toastVisible) {
    return  null
  }

  return (
    <Animated.View
      style={{
        position: "absolute",
        bottom: 50,
        left: 50,
        right: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius:10,
        width:"auto",
        transform: [{ translateY }],
        zIndex: 999,
      }}
    >
      <Text style={{ color: "#fff",textAlign:"center"}}>{message}</Text>
    </Animated.View>
  );
};

export default CustomToast;
