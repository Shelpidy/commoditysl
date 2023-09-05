import { StyleSheet, Text, View, Dimensions } from "react-native";
import React, { useState } from "react";
import PhoneInput from "react-native-phone-number-input";
import { Button, TextInput, useTheme } from "react-native-paper";

const { width, height } = Dimensions.get("window");

const BuyCommodityScreen = ({ navigation }: any) => {
   const [loading, setLoading] = useState<boolean>(false);
   const [phoneNumber, setPhoneNumber] = React.useState<string>("");
   const [showPassword, setShowPassword] = React.useState<boolean>(false);
   const [showPincode, setShowPincode] = React.useState<boolean>(false);
   const theme = useTheme();

   const handleBuyCommodity = async () => {};

   return (
      <View>
         <Text>BuyCommodityScreen</Text>
         <View style={styles.form}>
            <PhoneInput
               containerStyle={[
                  styles.input,
                  { backgroundColor: theme.colors.inverseOnSurface },
               ]}
               onChangeFormattedText={(text) => setPhoneNumber(text)}
               defaultCode="SL"
               textInputProps={{
                  placeholder: "Enter Phonenumber",
               }}></PhoneInput>
            <TextInput
               outlineStyle={{ borderColor: theme.colors.inverseOnSurface }}
               mode="outlined"
               keyboardType="numeric"
               style={[
                  styles.input,
                  { backgroundColor: theme.colors.inverseOnSurface },
               ]}
               label="Amount in commodity"
               right={
                  <TextInput.Affix
                     text="c"
                     textStyle={{ fontFamily: "Poppins_300Medium" }}
                  />
               }></TextInput>
            <TextInput
               outlineStyle={{ borderColor: theme.colors.inverseOnSurface }}
               mode="outlined"
               style={[
                  styles.input,
                  { backgroundColor: theme.colors.inverseOnSurface },
               ]}
               label="Password"
               // inputMode="text"
               secureTextEntry={!showPassword}
               right={
                  <TextInput.Icon
                     icon={showPassword ? "eye" : "eye-off"}
                     onPress={() =>
                        setShowPassword(!showPassword)
                     }></TextInput.Icon>
               }></TextInput>
            <TextInput
               outlineStyle={{ borderColor: theme.colors.inverseOnSurface }}
               mode="outlined"
               keyboardType="numeric"
               style={[
                  styles.input,
                  { backgroundColor: theme.colors.inverseOnSurface },
               ]}
               label="TeleCom Pincode"
               // inputMode="text"
               secureTextEntry={!showPincode}
               right={
                  <TextInput.Icon
                     icon={showPincode ? "eye" : "eye-off"}
                     onPress={() =>
                        setShowPincode(!showPincode)
                     }></TextInput.Icon>
               }></TextInput>
            <View>
               <Button
                  mode="contained"
                  onPress={() => handleBuyCommodity}
                  style={styles.button}>
                  Buy Commodity
               </Button>
            </View>
         </View>
      </View>
   );
};

export default BuyCommodityScreen;

const styles = StyleSheet.create({
   form: {
      paddingTop: 40,
      alignItems: "center",
   },
   input: {
      width: width - 60,
      marginBottom: 10,
      fontFamily: "Poppins_300Light",
   },
   button: {
      width: width - 60,
      marginTop: 10,
      fontFamily: "Poppins_300Light",
   },
});
