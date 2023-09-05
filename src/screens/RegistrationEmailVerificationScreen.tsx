import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { withTheme, Button, Theme } from "@rneui/themed";
import { useTheme } from "react-native-paper";

type RegistrationEmailVerificationScreenProps = {
   navigation: any;
};

const RegistrationEmailVerificationScreen = ({
   navigation,
}: RegistrationEmailVerificationScreenProps) => {
   const theme = useTheme();
   return (
      <View
         style={[
            styles.container,
            { backgroundColor: theme.colors.background },
         ]}>
         <Button
            onPress={() => navigation.navigate("LoginScreen")}
            title="Login"></Button>
         <Button
            onPress={() => navigation.navigate("RegistrationScreen")}
            title="Register"></Button>
         <Button
            onPress={() =>
               navigation.navigate("HomeStack", { screen: "HomeScreen" })
            }
            title="Home"></Button>
         <Text>RegistrationEmailVerificationScreen</Text>
      </View>
   );
};

export default RegistrationEmailVerificationScreen;

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Poppins_300Light",
   },
});
