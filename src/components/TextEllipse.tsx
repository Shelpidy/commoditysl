import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "react-native-paper";

const TextEllipse = ({
   text,
   textLength,
   style,
   children,
   containerStyle,
   showViewMore,
   onPressViewMore,
}: {
   text: string;
   textLength: number;
   style?: TextStyle;
   containerStyle?: ViewStyle;
   children?: any;
   showViewMore?: boolean;
   onPressViewMore?: () => void;
}) => {
   const [shortenText, setShortenText] = useState<string>("");
   const [buttonText, setButtonText] = useState<"show more" | "show less">(
      "show more"
   );
   const [loading, setLoading] = useState<boolean>(true);
   const [_style, _setStyle] = useState<TextStyle>({
      fontFamily: "Poppins_300Light",
   });
   const theme = useTheme();

   useEffect(() => {
      let txts = text.slice(0, textLength);
      if (text.length <= textLength) {
         setShortenText(text);
      } else {
         setShortenText(txts + "...");
      }
      if (style) {
         _setStyle(style);
      }
      setLoading(false);
   }, [textLength, text, style]);

   const hanldeViewMore = () => {
      if (buttonText === "show more") {
         setShortenText(text);
         onPressViewMore?.();
         setButtonText("show less");
      } else {
         let txts = text.slice(0, textLength);
         if (text.length <= textLength) {
            setShortenText(text);
         } else {
            setShortenText(txts + "...");
         }
         setButtonText("show more");
      }
   };

   if (loading) return <Text>...</Text>;
   return showViewMore && text.length > textLength ? (
      <View style={containerStyle}>
         <Text style={_style}>
            {shortenText}{" "}
            <Text
               onPress={hanldeViewMore}
               style={{ color: theme.colors.primary }}>
               {buttonText}
            </Text>
         </Text>
         {children}
      </View>
   ) : (
      <View style={containerStyle}>
         <Text style={_style}>
            {shortenText}
            <Text></Text>
         </Text>
         {children}
      </View>
   );
};

export default TextEllipse;

const styles = StyleSheet.create({});
