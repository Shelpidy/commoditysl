import React from "react";
import {
   Dimensions,
   KeyboardAvoidingView,
   Image,
   StyleSheet,
   Text,
   View,
   Alert,
} from "react-native";
import { Button, IconButton, TextInput, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setPersonalInfoForm } from "../../redux/action";

type Form2Props = {
   navigation: any;
   setActiveTab: (index: number) => void;
};

const { width, height } = Dimensions.get("window");

const Form2 = ({ navigation, setActiveTab }: Form2Props) => {
   let theme = useTheme();
   let { personalInfo } = useSelector((state: any) => state.rootReducer);
   let dispatch = useDispatch();
   const [showPassword, setShowPassword] = React.useState<boolean>(false);
   const [showConPassword, setShowConPassword] = React.useState<boolean>(false);
   const [showPincode, setShowPincode] = React.useState<boolean>(false);
   const [showConPincode, setShowConPincode] = React.useState<boolean>(false);
   const [password, setPassword] = React.useState<string>("");
   const [conPassword, setConPassword] = React.useState<string>("");
   const [pinCode, setPinCode] = React.useState<string>("");
   const [conPinCode, setConPinCode] = React.useState<string>("");

   const submitForm2 = (n: number) => {
      if (password.length < 5) {
         Alert.alert(
            "Password Invalid",
            "password must be greater than five characters"
         );
      } else if (password !== conPassword) {
         Alert.alert("Password Invalid", "passwords must match");
      } else if (pinCode.length < 5) {
         Alert.alert(
            "Pincode Invalid",
            "pincode must be greater than four characters"
         );
      } else if (pinCode !== conPinCode) {
         Alert.alert("Pincode Invalid", "pincodes must match");
      } else {
         dispatch(setPersonalInfoForm({ password }));
         dispatch(setPersonalInfoForm({ pinCode }));
         console.log("Form 2 submitted", personalInfo);
         setActiveTab(n);
      }
   };

   const goBack = (n: number) => {
      setActiveTab(n);
   };
   return (
      <KeyboardAvoidingView>
         <Image
            resizeMode="stretch"
            style={{
               width: width - 10,
               height: "44%",
               marginBottom: 0,
               marginTop: 12,
               paddingBottom: 0,
            }}
            source={require("../../../assets/Illustrators/ani-signup.gif")}></Image>
         <View style={styles.form}>
            <TextInput
               onChangeText={(value) => setPassword(value)}
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
               onChangeText={(value) => setConPassword(value)}
               outlineStyle={{ borderColor: theme.colors.inverseOnSurface }}
               mode="outlined"
               style={[
                  styles.input,
                  { backgroundColor: theme.colors.inverseOnSurface },
               ]}
               label="Confirm Password"
               // inputMode="text"
               secureTextEntry={!showConPassword}
               right={
                  <TextInput.Icon
                     icon={showConPassword ? "eye" : "eye-off"}
                     onPress={() =>
                        setShowConPassword(!showConPassword)
                     }></TextInput.Icon>
               }></TextInput>
            <TextInput
               onChangeText={(value) => setPinCode(value)}
               outlineStyle={{ borderColor: theme.colors.inverseOnSurface }}
               mode="outlined"
               style={[
                  styles.input,
                  { backgroundColor: theme.colors.inverseOnSurface },
               ]}
               label="Pincode"
               // inputMode="text"
               secureTextEntry={!showPincode}
               right={
                  <TextInput.Icon
                     icon={showPincode ? "eye" : "eye-off"}
                     onPress={() =>
                        setShowPincode(!showPincode)
                     }></TextInput.Icon>
               }></TextInput>
            <TextInput
               onChangeText={(value) => setConPinCode(value)}
               outlineStyle={{ borderColor: theme.colors.inverseOnSurface }}
               mode="outlined"
               style={[
                  styles.input,
                  { backgroundColor: theme.colors.inverseOnSurface },
               ]}
               label="Confirm Pincode"
               // inputMode="text"
               secureTextEntry={!showConPincode}
               right={
                  <TextInput.Icon
                     icon={showConPincode ? "eye" : "eye-off"}
                     onPress={() =>
                        setShowConPincode(!showConPincode)
                     }></TextInput.Icon>
               }></TextInput>
            <View style={styles.buttonGroup}>
               <Button
                  mode="contained"
                  onPress={() => goBack(0)}
                  style={styles.button}>
                  {/* <MaterialCommunityIcons
                     name="chevron-double-left"
                     color="white"></MaterialCommunityIcons>{" "} */}
                  BACK
               </Button>
               <Button
                  mode="contained"
                  onPress={() => submitForm2(2)}
                  style={styles.button}>
                  NEXT{" "}
                  {/* <MaterialCommunityIcons
                     name="chevron-double-right"
                     color="white"></MaterialCommunityIcons> */}
               </Button>
            </View>
         </View>
      </KeyboardAvoidingView>
   );
};

export default Form2;

const styles = StyleSheet.create({
   form: {
      paddingTop: 15,
      alignItems: "center",
   },
   input: {
      width: width - 40,
      marginBottom: 10,
      fontFamily: "Poppins_300Light",
   },
   button: {
      width: width / 3,
      marginTop: 10,
      fontFamily: "Poppins_300Light",
   },
   buttonGroup: {
      flexDirection: "row",
      gap: 10,
   },
});
