import {
   Dimensions,
   StyleSheet,
   Text,
   View,
   Image,
   KeyboardAvoidingView,
   Platform,
} from "react-native";
import React from "react";
import { TextInput, Button, useTheme } from "react-native-paper";
import LoginForm from "../components/LoginForm";
import { StatusBar } from "expo-status-bar";

type LoginScreenProps = {
   navigation: any;
};

const { width, height } = Dimensions.get("window");

const LoginScreen = (props: LoginScreenProps) => {
   let theme = useTheme();

   return (
      <KeyboardAvoidingView
         style={[
            styles.container,
            { backgroundColor: theme.colors.background },
         ]}>
         <Image
            resizeMode="stretch"
            style={{
               width: width - 10,
               height: "40%",
               marginBottom: 0,
               paddingBottom: 0,
            }}
            source={require("../../assets/Illustrators/signin.png")}></Image>
         <LoginForm {...props} />
      </KeyboardAvoidingView>
   );
};

export default LoginScreen;

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Poppins_300Light",
   },
   form: {
      padding: 0,
   },
   input: {
      width: width - 60,
      marginBottom: 10,
      fontFamily: "Poppins_300Light",
   },
});
