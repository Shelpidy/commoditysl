import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Badge, Button } from "react-native-paper";

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
});

type IconBadgeProps = {
   children?: JSX.Element;
   value: number | string;
   onPress: () => void;
};

const IconBadge = ({ children, value, onPress }: IconBadgeProps) => {
   return (
      <TouchableOpacity
         style={{ marginHorizontal: 25, paddingHorizontal: 2 }}
         onPress={onPress}>
         <View style={{ position: "relative" }}>
            <Badge
               size={20}
               style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: 10,
               }}>
               {value}
            </Badge>
            {children}
         </View>
      </TouchableOpacity>
   );
};

export default IconBadge;
