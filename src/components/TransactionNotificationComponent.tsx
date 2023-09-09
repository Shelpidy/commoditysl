import {
   StyleSheet,
   Text,
   View,
   Pressable,
   Dimensions,
   Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Skeleton } from "@rneui/base";
import { Avatar, useTheme } from "react-native-paper";
import { Image } from "react-native";
import axios from "axios";
import moment from "moment";
import TextEllipse from "./TextEllipse";
import { useCurrentUser } from "../utils/CustomHooks";
import { useNavigation } from "@react-navigation/native";

type TransactionNotificationComponentProps = {
   notification: CustomNotification;
};

const { width, height } = Dimensions.get("window");

const TransactionNotificationComponent = ({
   notification,
}: TransactionNotificationComponentProps) => {
   const [notFrom, setNotFrom] = useState<User | null>(null);
   const [loading, setLoading] = useState<boolean>(false);
   const theme = useTheme();
   const currentUser = useCurrentUser();
   const navigation = useNavigation<any>();

   useEffect(function () {
      console.log("Fetching user profile details");
      setLoading(true);
      let fetchData = async () => {
         // console.log("Fetching user")
         //  let activeUserId = 1
         try {
            let { status, data } = await axios.get(
               `http://192.168.1.98:5000/auth/users/${notification.notificationFromId}`,
               { headers: { Authorization: `Bearer ${currentUser?.token}` } }
            );
            if (status === 200) {
               console.log("Users-----", data.data);
               setNotFrom(data.data);
               // Alert.alert("Success",data.message)
               setLoading(false);
            } else {
               Alert.alert("Failed", data.message);
            }
            setLoading(false);
         } catch (err) {
            console.log(err);
            Alert.alert("Failed", String(err));
            setLoading(false);
         }
      };
      fetchData();
   }, []);

   // useEffect(function () {
   //    console.log("Fetching user");
   //    setLoading(true);
   //    let fetchData = async () => {
   //       // console.log("Fetching user")
   //       //  let activeUserId = 1
   //       try {
   //          let response = await fetch(
   //             `http://192.168.1.98:5000/auth/users/${notification.notificationFrom}`,
   //             { method: "GET" }
   //          );
   //          let data = await response.json();
   //          if (data.status == "success") {
   //             // console.log("Users-----", data.data);
   //             setNotFrom(data.data.personal);
   //             // Alert.alert("Success",data.message)
   //             setLoading(false);
   //          } else {
   //             Alert.alert("Failed", data.message);
   //          }
   //          setLoading(false);
   //       } catch (err) {
   //          console.log(err);
   //          Alert.alert("Failed", String(err));
   //          setLoading(false);
   //       }
   //    };
   //    fetchData();
   // }, []);

   const handleNotification = async () => {
      let notId = notification.notificationId;
      try {
         let { data } = await axios.get(
            `http://192.168.1.98:5000/notifications/read/${notId}`,
            { headers: { Authorization: `Bearer ${currentUser?.token}` } }
         );
         if (data.status == "success") {
            navigation.navigate("UserProfileScreen", {
               userId: notification.notificationFromId,
            });
            Alert.alert("Failed", data.message);
         }
      } catch (err) {
         Alert.alert("Failed", "Connection failed.");
      }
   };

   if (!notFrom) {
      return (
         <View style={{ flexDirection: "row", margin: 2 }}>
            <Skeleton animation="wave" width={50} height={50} circle />
            <Skeleton
               animation="wave"
               style={{ borderRadius: 2, marginHorizontal: 2 }}
               width={300}
               height={80}
            />
         </View>
      );
   }
   return (
      <Pressable
         onPress={handleNotification}
         style={[
            styles.notContainer,
            {
               backgroundColor: notification.readStatus
                  ? theme.colors.primaryContainer
                  : theme.colors.background,
            },
         ]}
         key={String(notification.notificationId)}>
         <View>
            <Avatar.Image size={40} source={{ uri: notFrom.profileImage }} />
         </View>
         <View>
            <View style={styles.notHeader}>
               <Text style={styles.notTitle}>{notification.title}</Text>
            </View>
            <View style={{ width: 300, paddingRight: 5 }}>
               <TextEllipse
                  style={styles.notMessage}
                  textLength={90}
                  text={notification?.message}
               />
            </View>
            {/* <Text style={styles.notMessage}>{notification?.message}</Text> */}
            <Text
               style={[
                  styles.notDate,
                  { color: theme.colors.secondary, flex: 1 },
               ]}>
               {moment(notification?.createdAt, "YYYYMMDD").fromNow()}
            </Text>
         </View>
      </Pressable>
   );
};

export default TransactionNotificationComponent;

const styles = StyleSheet.create({
   notContainer: {
      flexDirection: "row",
      padding: 5,
      marginVertical: 1,
      marginHorizontal: 2,
      borderRadius: 4,
   },

   notTitle: {
      fontFamily: "Poppins_500Medium",
   },
   notMessage: {
      fontFamily: "Poppins_300Light",
      paddingHorizontal: 2,
      flexWrap: "wrap",
   },
   notDate: {
      fontFamily: "Poppins_300Light_Italic",
      paddingHorizontal: 2,
      textAlign: "right",
      fontSize: 13,
   },
   notHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
   },
});
