import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

type PositionIndicatorProps = {
   position: number;
   numberOfPosition: number;
};

export default function PositionIndicator({
   position,
   numberOfPosition,
}: PositionIndicatorProps) {
   const [activePosition, setActivePositive] = React.useState(0);
   const [positions, setPositions] = React.useState<any[]>([]);
   const theme = useTheme();

   React.useEffect(() => {
      let positions = Array.from(
         {
            length: numberOfPosition || 3,
         },
         (item: any, index: number) => index
      );
      setPositions(positions);
   }, []);
   React.useEffect(() => {
      setActivePositive(position);
   }, [position]);

   return (
      <View style={styles.indicator}>
         {positions.map((item) => {
            return (
               <View
                  key={item}
                  style={{
                     width: 10,
                     height: 10,
                     borderRadius: 10,
                     backgroundColor:
                        item === activePosition
                           ? "green"
                           : item < activePosition
                           ? theme.colors.primary
                           : theme.colors.secondaryContainer,
                  }}></View>
            );
         })}
      </View>
   );
}

const styles = StyleSheet.create({
   indicator: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
   },
});
