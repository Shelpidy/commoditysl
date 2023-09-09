import {
   Dimensions,
   StyleSheet,
   Text,
   View,
   ScrollView,
   Alert,
   TouchableHighlight,
   Pressable,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Skeleton, ThemeConsumer } from "@rneui/themed";
import { Button, useTheme, ActivityIndicator } from "react-native-paper";
import TransactionNotificationComponent from "../components/TransactionNotificationComponent";
import { useCurrentUser } from "../utils/CustomHooks";
import { LoadingNotificationComponent } from "../components/MediaPosts/LoadingComponents";
import axios from "axios";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
   handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
   }),
});

const { width, height } = Dimensions.get("screen");

const NotificationScreen = ({ navigation }: any) => {
   const [notifications, setNotifications] = useState<
      CustomNotification[] | null
   >(null);
   const [loading, setLoading] = useState<boolean>(false);
   const [reloadNot, setReloadNot] = useState<number>(0);
   const currentUser = useCurrentUser();
   const theme = useTheme();
   const [notification, setNotification] =
      useState<Notifications.Notification | null>(null);
   let notificationListener = useRef<Notifications.Subscription>(null);
   let responseListener = useRef<Notifications.Subscription>(null);

   // useEffect(() => {
   //   notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
   //     setNotification(notification);
   //   });

   //   responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
   //     console.log(response);
   //   });

   //   return () => {
   //     Notifications.removeNotificationSubscription(notificationListener.current);
   //     Notifications.removeNotificationSubscription(responseListener.current);
   //   };
   // }, []);

   useEffect(
      function () {
         console.log("Fetching Notifications");

         let fetchData = async () => {
            let activeUserId = currentUser?.userId;
            try {
               let { data, status } = await axios.get(
                  `http://192.168.1.98:5000/notifications/${activeUserId}`,
                  { headers: { Authorization: `Bearer ${currentUser?.token}` } }
               );
               if (status === 200) {
                  // console.log("User Notifications-----", data.data);
                  setNotifications(data.data);
               } else {
                  Alert.alert("Failed", data.message);
               }
            } catch (err) {
               console.log(err);
               Alert.alert("Failed", String(err));
            }
         };
         fetchData();
      },
      [currentUser, notification]
   );

   if (!notifications)
      return (
         <ScrollView style={styles.container}>
            <LoadingNotificationComponent />
            <LoadingNotificationComponent />
            <LoadingNotificationComponent />
            <LoadingNotificationComponent />
            <LoadingNotificationComponent />
            <LoadingNotificationComponent />
            <LoadingNotificationComponent />
         </ScrollView>
      );

   return (
      <ScrollView style={styles.container}>
         {notifications.map((notification) => {
            return (
               <TransactionNotificationComponent
                  key={String(notification.notificationId)}
                  notification={notification}
               />
            );
         })}
      </ScrollView>
   );
};

export default NotificationScreen;

const styles = StyleSheet.create({
   container: {
      backgroundColor: "#f5f5f5",
      paddingBottom: 10,
   },
   notContainer: {
      backgroundColor: "#ffffff",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
   },
});
