import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useEffect, useRef } from "react";
import {
   StyleSheet,
   Text,
   View,
   Button,
   Alert,
   ScrollView,
   Pressable,
   StatusBar,
   Dimensions,
} from "react-native";
import { Appbar, Avatar, Badge, FAB, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
   AntDesign,
   Feather,
   Ionicons,
   MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Image } from "react-native";
import { useCurrentUser } from "../utils/CustomHooks";
import IconBadge from "./IconBadge";

type CustomHeaderProps = {
   navigation?: any;
};

const CustomHeader = () => {
   const [loading, setLoading] = useState<boolean>(false);
   const [user, setUser] = useState<User>();
   const currentUser = useCurrentUser();
   // const [activeTab, setActiveTab] = useState<number>(0);
   const theme = useTheme();
   const navigation = useNavigation<any>();
   const router = useRoute();
   let notRef = useRef<any>(null);
   let chatRef = useRef<any>(null);

   useEffect(
      function () {
         console.log("Fetching header user");
         setLoading(true);
         let _fetchData = async () => {
            // console.log("Fetching user")
            try {
               if (currentUser) {
                  let response = await fetch(
                     `http://192.168.1.98:5000/auth/users/${currentUser?.userId}`,
                     { method: "GET" }
                  );

                  if (response.ok) {
                     let data = await response.json();
                     // console.log("Users-----", data.data);
                     setUser(data.data.personal);
                     // Alert.alert("Success",data.message)
                     setLoading(false);
                  } else {
                     let data = await response.json();
                     Alert.alert("Header Failed", data.message);
                  }
               }

               setLoading(false);
            } catch (err) {
               console.log(err);
               Alert.alert("Header Failed", String(err));
               setLoading(false);
            }
         };
         _fetchData();
      },
      [currentUser]
   );

   const gotoNextScreen = (screenName: string, params?: any) => {
      if (screenName === "HomeScreen") {
         if (params) {
            navigation.navigate(screenName, params);
         } else {
            navigation.navigate(screenName);
         }
      } else if (screenName === "NotificationScreen") {
         if (params) {
            navigation.navigate(screenName, params);
         } else {
            navigation.navigate(screenName);
         }
      } else if (screenName === "MarketingScreen") {
         if (params) {
            navigation.navigate(screenName, params);
         } else {
            navigation.navigate(screenName);
         }
         //   setActiveTab(2);
      } else if (screenName === "ProductsRequestScreen") {
         if (params) {
            navigation.navigate(screenName, params);
         } else {
            navigation.navigate(screenName);
         }
         // setActiveTab(3);
      } else if (screenName === "SearchScreen") {
         if (params) {
            navigation.navigate(screenName, params);
         } else {
            navigation.navigate(screenName);
         }
         //  setActiveTab(4);
      } else if (screenName === "ProfileScreen") {
         if (params) {
            navigation.navigate(screenName, params);
         } else {
            navigation.navigate(screenName);
         }
         //  setActiveTab(5);
      } else if (screenName === "ConversationsScreen") {
         if (params) {
            navigation.navigate(screenName, params);
         } else {
            navigation.navigate(screenName);
         }
         //  setActiveTab(6);
      }
   };
   if (router.name === "ChatScreen") return null;
   return (
      <Appbar.Header style={{ alignItems: "center" }}>
         <View
            style={{
               justifyContent: "center",
               gap: 5,
               flexDirection: "row",
               width: Dimensions.get("window").width,
            }}>
            {/* <Appbar.Content title="C" /> */}
            {navigation.canGoBack() && router.name !== "HomeScreen" && (
               <Appbar.BackAction onPress={() => navigation.goBack()} />
            )}
            <Appbar.Action
               icon={() => (
                  <Ionicons
                     color={
                        router.name === "HomeScreen"
                           ? theme.colors.primary
                           : theme.colors.secondary
                     }
                     size={20}
                     name={
                        router.name === "HomeScreen"
                           ? "home-sharp"
                           : "home-outline"
                     }></Ionicons>
               )}
               onPress={() => gotoNextScreen("HomeScreen")}
            />

            <IconBadge
               onPress={() => gotoNextScreen("ConversationsScreen")}
               value={20}>
               <Ionicons
                  style={{ position: "absolute", top: 15 }}
                  color={
                     router.name === "ConversationsScreen"
                        ? theme.colors.primary
                        : theme.colors.secondary
                  }
                  size={20}
                  name={
                     router.name === "ConversationsScreen"
                        ? "md-chatbubbles"
                        : "md-chatbubbles-outline"
                  }
               />
            </IconBadge>
            <IconBadge
               onPress={() => gotoNextScreen("NotificationScreen")}
               value={10}>
               <Ionicons
                  style={{ position: "absolute", top: 15 }}
                  color={
                     router.name === "NotificationScreen"
                        ? theme.colors.primary
                        : theme.colors.secondary
                  }
                  size={20}
                  name={
                     router.name === "NotificationScreen"
                        ? "notifications-sharp"
                        : "notifications-outline"
                  }
               />
            </IconBadge>

            {/* <Appbar.Action
               ref={chatRef}
               style={{ alignItems: "center", flexDirection: "row" }}
               icon={() => (
                  <Ionicons
                     color={
                        router.name === "ConversationsScreen"
                           ? theme.colors.primary
                           : theme.colors.secondary
                     }
                     size={20}
                     name={
                        router.name === "ConversationsScreen"
                           ? "md-chatbubbles"
                           : "md-chatbubbles-outline"
                     }
                  />
               )}
               onPress={() => gotoNextScreen("ConversationsScreen")}
            /> */}
            {/* <Appbar.Action
               ref={notRef}
               style={{ alignItems: "center", flexDirection: "row" }}
               icon={() => (
                  <Ionicons
                     color={
                        router.name === "NotificationScreen"
                           ? theme.colors.primary
                           : theme.colors.secondary
                     }
                     size={20}
                     name={
                        router.name === "NotificationScreen"
                           ? "notifications-sharp"
                           : "notifications-outline"
                     }
                  />
               )}
               onPress={() => gotoNextScreen("NotificationScreen")}
            /> */}
            {/* <Badge
               size={20}
               style={{
                  position: "absolute",
                  top: 0,
                  left: router.name === "HomeScreen" ? 70 : 120,
               }}>
               5
            </Badge>
            <Badge
               size={20}
               style={{
                  position: "absolute",
                  top: 0,
                  left: router.name === "HomeScreen" ? 120 : 170,
               }}>
               5
            </Badge> */}
            {/* <Appbar.Action
               icon={() => (
                  <MaterialCommunityIcons
                     color={
                        router.name === "MarketingScreen"
                           ? theme.colors.primary
                           : theme.colors.secondary
                     }
                     size={20}
                     name={
                        router.name === "MarketingScreen"
                           ? "shopping"
                           : "shopping-outline"
                     }
                  />
               )}
               onPress={() => gotoNextScreen("MarketingScreen")}
            /> */}
            {/* <Appbar.Action
               icon={() => (
                  <Ionicons
                     color={
                        router.name === "ProductsRequestScreen"
                           ? theme.colors.primary
                           : theme.colors.secondary
                     }
                     size={20}
                     name={
                        router.name === "ProductsRequestScreen"
                           ? "md-cart"
                           : "md-cart-outline"
                     }
                  />
               )}
               onPress={() => gotoNextScreen("ProductsRequestScreen")}
            /> */}
            <Appbar.Action
               icon={() => (
                  <Ionicons
                     color={
                        router.name === "SearchScreen"
                           ? theme.colors.primary
                           : theme.colors.secondary
                     }
                     size={20}
                     name={
                        router.name === "SearchScreen"
                           ? "md-search-sharp"
                           : "md-search-outline"
                     }
                  />
               )}
               onPress={() => gotoNextScreen("SearchScreen")}
            />
            {/* <Appbar.Action icon={()=><Feather size={20} name='users'/>} onPress={() =>setOpen(!open)} /> */}
            <Pressable
               style={{ marginTop: 9, marginRight: 10, right: 5 }}
               onPress={() =>
                  gotoNextScreen("ProfileScreen", {
                     userId: currentUser?.userId,
                  })
               }>
               <Avatar.Image size={25} source={{ uri: user?.profileImage }} />
               {/* <Text style={styles.profileImage}>
                  <Image
                     resizeMode="cover"
                     style={styles.profileImage}
                     source={{ uri: user?.profileImage }}
                  />
                
               </Text> */}
            </Pressable>
         </View>
      </Appbar.Header>
   );
};

export default CustomHeader;

const styles = StyleSheet.create({
   profileImage: {
      width: 28,
      height: 28,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
   },
});
