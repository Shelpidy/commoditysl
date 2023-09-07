import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegistrationScreen from "../screens/RegistrationScreen";
import RegistrationEmailVerificationScreen from "../screens/RegistrationEmailVerificationScreen";
import * as Notifications from "expo-notifications";
import { useCurrentUser } from "../utils/CustomHooks";
import { useTheme } from "react-native-paper";
import * as Linking from "expo-linking"

Notifications.setNotificationHandler({
   handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
   }),
});

const authStack = createNativeStackNavigator();

export default function AuthStack() {
   const [notifications, setNotifications] = useState<
      CustomNotification[] | null
   >(null);
   const [loading, setLoading] = useState<boolean>(false);
   const [reloadNot, setReloadNot] = useState<number>(0);
   const currentUser = useCurrentUser();
   const theme = useTheme();
   const [notification, setNotification] =
      useState<Notifications.Notification | null>(null);
   let notificationListener = useRef<Notifications.Subscription>(null).current;
   let responseListener = useRef<Notifications.Subscription>(null).current;

   useEffect(() => {
      
     notificationListener = Notifications.addNotificationReceivedListener(notification => {
       setNotification(notification);
     });

     responseListener  = Notifications.addNotificationResponseReceivedListener(response => {
       let {data}= response.notification.request.content
       console.log(response.notification.request.content);
       if(data.url){
         Linking.canOpenURL(data?.url).then(()=>{
            Linking.openURL(data?.url)
          })

       }
     });

     return () => {
       Notifications.removeNotificationSubscription(notificationListener!);
       Notifications.removeNotificationSubscription(responseListener!);
     };
   }, []);
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
