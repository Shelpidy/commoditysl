import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTheme, Text } from "react-native-paper";
import { LayoutChangeEvent } from "react-native";
import { VariantProp } from "react-native-paper/lib/typescript/components/Typography/types";

const CommentTextEllipse = ({
   text,
   numberOfLines: _linesNumber,
   style,
   children,
   containerStyle,
   variant,
}: {
   text: string;
   numberOfLines: number;
   style?: TextStyle;
   containerStyle?: ViewStyle;
   children?: any;
   variant: VariantProp<string>;
}) => {
   const [numberOfLines, setNumberOfLines] = useState<number>(0);
   const [buttonText, setButtonText] = useState<"show more" | "show less">(
      "show more"
   );
   const [isExpandable, setIsExpandable] = useState<boolean>(false);
   const [_style, _setStyle] = useState<TextStyle>({
      fontFamily: "Poppins_300Light",
   });
   const theme = useTheme();

   const viewRef = useRef<View>(null);

   useEffect(() => {
      setNumberOfLines(_linesNumber);
      if (style) {
         _setStyle(style);
      }
   }, [_linesNumber, text, style]);

   const hanldeViewMore = () => {
      if (buttonText === "show more") {
         setNumberOfLines(0);
         setButtonText("show less");
      } else {
         setNumberOfLines(_linesNumber);
         setButtonText("show more");
      }
   };

   const handleLayout = (event: LayoutChangeEvent) => {
      const textHeight = event.nativeEvent.layout.height;
      viewRef.current?.measureInWindow((x, y, w, h) => {
         setIsExpandable(textHeight >= h);
      });
   };
   return (
      <View ref={viewRef} style={containerStyle}>
         <Text
            style={style}
            variant={variant}
            onLayout={handleLayout}
            numberOfLines={numberOfLines}>
            {text}
            {isExpandable && (
               <Text
                  variant={variant}
                  onPress={hanldeViewMore}
                  style={{ color: theme.colors.primary }}>
                  {buttonText}
               </Text>
            )}
         </Text>

         {children}
      </View>
   );
};

export default CommentTextEllipse;

const styles = StyleSheet.create({});
