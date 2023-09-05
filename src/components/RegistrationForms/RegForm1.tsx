import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
   Dimensions,
   Image,
   StyleSheet,
   Text,
   View,
   KeyboardAvoidingView,
   Platform,
   ScrollView,
} from "react-native";
import { Button, TextInput, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { setPersonalInfoForm } from "../../redux/action";

type Form1Props = {
   navigation: any;
   setActiveTab: (index: number) => void;
};

const { width, height } = Dimensions.get("window");

const Form1 = ({ navigation, setActiveTab }: Form1Props) => {
   let theme = useTheme();
   let { personalInfo } = useSelector((state: any) => state.rootReducer);
   let dispatch = useDispatch();

   const submitForm1 = (n: number) => {
      console.log("Form 1 submitted", personalInfo);
      setActiveTab(n);
   };

   return (
      <KeyboardAvoidingView
         behavior={Platform.OS === "ios" ? "padding" : "height"}>
         <Image
            resizeMode="stretch"
            style={{
               width: width - 10,
               height: "40%",
               marginBottom: 0,
               marginTop: 12,
               paddingBottom: 0,
            }}
            source={require("../../../assets/Illustrators/ani-signup.gif")}></Image>
         <View style={styles.form}>
            <TextInput
               onChangeText={(value) =>
                  dispatch(setPersonalInfoForm({ firstName: value }))
               }
               outlineStyle={{ borderColor: theme.colors.inverseOnSurface }}
               mode="outlined"
               style={[
                  styles.input,
                  { backgroundColor: theme.colors.inverseOnSurface },
               ]}
               label="FirstName"></TextInput>
            <TextInput
               onChangeText={(value) =>
                  dispatch(setPersonalInfoForm({ middleName: value }))
               }
               outlineStyle={{ borderColor: theme.colors.inverseOnSurface }}
               mode="outlined"
               style={[
                  styles.input,
                  { backgroundColor: theme.colors.inverseOnSurface },
               ]}
               label="MiddleName"></TextInput>
            <TextInput
               onChangeText={(value) =>
                  dispatch(setPersonalInfoForm({ lasttName: value }))
               }
               outlineStyle={{ borderColor: theme.colors.inverseOnSurface }}
               mode="outlined"
               style={[
                  styles.input,
                  { backgroundColor: theme.colors.inverseOnSurface },
               ]}
               label="LastName"></TextInput>
            <View style={styles.buttonGroup}>
               <Button
                  mode="contained"
                  onPress={() => submitForm1(1)}
                  style={styles.button}>
                  NEXT{" "}
                  {/* <MaterialCommunityIcons
                     name="chevron-double-right"
                     color="white"></MaterialCommunityIcons> */}
               </Button>
            </View>
            <View style={styles.signInCon}>
               <Text style={{ fontFamily: "Poppins_300Light_Italic" }}>
                  Already have an account ?
               </Text>
               <Button
                  onPress={() => navigation.navigate("LoginScreen")}
                  mode="contained-tonal">
                  Sign In
               </Button>
            </View>
         </View>
      </KeyboardAvoidingView>
   );
};

export default Form1;

const styles = StyleSheet.create({
   form: {
      paddingTop: 40,
      alignItems: "center",
   },
   input: {
      width: width - 40,
      marginBottom: 10,
      fontFamily: "Poppins_300Light",
   },
   button: {
      width: width - 60,
      marginTop: 10,
      fontFamily: "Poppins_300Light",
   },
   buttonGroup: {
      flexDirection: "row",
      gap: 10,
   },
   signInCon: {
      flexDirection: "row",
      gap: 5,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
   },
});
