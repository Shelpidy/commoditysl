import {
   Dimensions,
   StyleSheet,
   Text,
   View,
   Image,
   KeyboardAvoidingView,
} from "react-native";
import React from "react";
import { TextInput, Button, useTheme } from "react-native-paper";
import LoginForm from "../components/LoginForm";
import { StatusBar } from "expo-status-bar";
import TransferMoneyForm from "../components/Transactions/TransferMoneyForm";

type TransferMoneyProps = {
   navigation: any;
};

const { width, height } = Dimensions.get("window");

const TransferMoneyScreen = (props: TransferMoneyProps) => {
   let theme = useTheme();

   return (
      <KeyboardAvoidingView style={styles.container}>
         <View style={{ paddingHorizontal: 10, marginVertical: 5 }}>
            <Text
               style={{
                  fontFamily: "Poppins_300Light",
                  color: theme.colors.secondary,
               }}>
               Safely transfer commodity to another user
            </Text>
         </View>
         {/* <Image
            resizeMode="stretch"
            style={{
               width: width - 10,
               height: "40%",
               marginBottom: 0,
               paddingBottom: 0,
            }}
            source={require("../../assets/Illustrators/signin.png")}></Image> */}
         <TransferMoneyForm navigation={props.navigation} />
      </KeyboardAvoidingView>
   );
};

export default TransferMoneyScreen;

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      fontFamily: "Poppins_300Light",
      paddingTop: 45,
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
