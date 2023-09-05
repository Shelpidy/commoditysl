import React, { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { Alert } from "react-native";
import jwtDecode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import NetInfo from "@react-native-community/netinfo";

export const useNetworkStatus = () => {
   const [isOnline, setIsOnline] = useState<boolean | null>(false);

   useEffect(() => {
      const checkOnlineStatus = async () => {
         try {
            const netInfoState = await NetInfo.fetch();
            setIsOnline(
               netInfoState.isConnected && netInfoState.isInternetReachable
            );
         } catch (error) {
            console.error("Error checking online status:", error);
         }
      };

      checkOnlineStatus();

      const unsubscribe = NetInfo.addEventListener(checkOnlineStatus);

      return () => {
         unsubscribe();
      };
   }, []);

   return isOnline;
};

export const useCurrentUser = () => {
   const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
   const navigation = useNavigation();
   useEffect(() => {
      async function getToken() {
         try {
            let loginToken = await AsyncStorage.getItem("loginToken");
            if (loginToken) {
               const decodedToken: Omit<CurrentUser, "token"> =
                  jwtDecode(loginToken);
               setCurrentUser({ ...decodedToken, token: loginToken });
            }
         } catch (err) {
            console.log(err);
         }
      }
      getToken();
   }, []);

   return currentUser;
};

export const usePushNotificationToken = <T>(): T => {
   const [token, setToken] = useState<any>(null);
   useEffect(() => {
      const registerForPushNotificationsAsync = async () => {
         try {
            let { status } = await Notifications.getPermissionsAsync();
            if (status !== "granted") {
               let { status } = await Notifications.requestPermissionsAsync();
               if (status !== "granted") {
                  Alert.alert(
                     "Failed",
                     "Failed to get push notification permissions"
                  );
                  return;
               }
            }
            let expoPushToken = await Notifications.getExpoPushTokenAsync();
            setToken(expoPushToken.data);
         } catch (err) {
            console.log(err);
         }
      };

      registerForPushNotificationsAsync();
   }, []);

   return token || "expoToken";
};
