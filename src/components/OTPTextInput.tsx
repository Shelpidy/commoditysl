import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TextInput } from "react-native-paper";

type OTPTextInputProps = {
   numberOfInput: number;
   size: number;
   onInputChange?: (code: any) => void;
};

const OTPTextInput = ({
   numberOfInput,
   size,
   onInputChange,
}: OTPTextInputProps) => {
   const [inputs, setInputs] = React.useState<any[]>([]);
   React.useEffect(() => {
      let inputs = Array.from(
         {
            length: numberOfInput || 3,
         },
         (item: any, index: number) => index
      );
      setInputs(inputs);
   }, []);
   return (
      <View style={styles.optContainer}>
         {inputs.map((input) => {
            return (
               <TextInput
                  keyboardType="number-pad"
                  style={[
                     styles.optInput,
                     { width: size, height: size, fontSize: size - 20 },
                  ]}
                  mode="outlined"
                  key={input}></TextInput>
            );
         })}
      </View>
   );
};

export default OTPTextInput;

const styles = StyleSheet.create({
   optContainer: {
      flexDirection: "row",
      gap: 15,
      alignItems: "center",
      justifyContent: "center",
      margin: 10,
   },
   optInput: {
      fontFamily: "Poppins_300Light",
   },
});
