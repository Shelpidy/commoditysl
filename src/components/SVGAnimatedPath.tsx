import * as React from "react";
import { useTheme } from "react-native-paper";
import Animated, { useAnimatedProps } from "react-native-reanimated";
import { Path } from "react-native-svg";

interface AnimatedStrokeProps {
   d: string;
   progress: Animated.SharedValue<number>;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

const SVGAnimatedPath = ({ d, progress }: AnimatedStrokeProps) => {
   const [length, setLength] = React.useState<number>(0);
   const pathRef = React.useRef<any>(null);

   const theme = useTheme();

   //  console.log(length)
   const strokeAnimatedProps = useAnimatedProps(() => {
      return {
         strokeDashoffset: length - length * progress.value,
      };
   });
   return (
      <AnimatedPath
         d={d}
         ref={pathRef}
         onLayout={() => setLength(pathRef.current?.getTotalLength())}
         strokeDasharray={length}
         stroke={theme.colors.primary}
         strokeWidth={2}
         animatedProps={strokeAnimatedProps}
      />
   );
};

export default SVGAnimatedPath;
