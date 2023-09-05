import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegistrationScreen from "../screens/RegistrationScreen";
import RegistrationEmailVerificationScreen from "../screens/RegistrationEmailVerificationScreen";

const authStack = createNativeStackNavigator();

export default function AuthStack() {
   return (
      <authStack.Navigator screenOptions={{ headerShown: false }}>
         <authStack.Screen
            name="LoginScreen"
            component={LoginScreen}></authStack.Screen>
         <authStack.Screen
            name="RegistrationScreen"
            component={RegistrationScreen}></authStack.Screen>
         <authStack.Screen
            name="RegistrationEmailVerificationScreen"
            component={RegistrationEmailVerificationScreen}></authStack.Screen>
      </authStack.Navigator>
   );
}
