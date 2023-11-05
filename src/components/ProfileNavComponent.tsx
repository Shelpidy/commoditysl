import { Alert, Dimensions, Pressable, StyleSheet, View } from "react-native";
import React, { useState, useEffect } from "react";
import {
   AntDesign,
   Entypo,
   Feather,
   MaterialCommunityIcons,
   MaterialIcons,
} from "@expo/vector-icons";
import { Button, useTheme, Card, Text } from "react-native-paper";
import { useCurrentUser } from "../utils/CustomHooks";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const ProfileNavComponent = ({ user }: { user: User }) => {
   const currentUser = useCurrentUser();
   const navigation = useNavigation<any>();
   const theme = useTheme();

   return (
      <View style={[styles.navs, { backgroundColor: theme.colors.background }]}>
         {currentUser?.userId === user?.userId && (
            <Pressable
               onPress={() => navigation.navigate("SettingsScreen")}
               style={styles.navLink}>
               <AntDesign
                  name="setting"
                  size={20}
                  color={theme.colors.secondary}
               />
               <Text
                  style={{
                     color: theme.colors.secondary,
                  }}>
                  Settings
               </Text>
            </Pressable>
         )}
         {/* 
         <View style={styles.navLink}>
            <Feather
               name="shopping-cart"
               size={20}
               color={theme.colors.secondary}
            />
            <Text
               style={{
                  
                  color: theme.colors.secondary,
               }}>
               Products
            </Text>
            <Button
               onPress={() =>
                  navigation.navigate("UserProductScreen", { userId:user.userId})
               }>
               <Entypo name="chevron-thin-right" />
            </Button>
         </View> */}
         {currentUser?.userId === user?.userId && (
            <Pressable
               onPress={() => navigation.navigate("TransferMoneyScreen")}
               style={styles.navLink}>
               <MaterialCommunityIcons
                  name="transfer"
                  size={20}
                  color={theme.colors.secondary}
               />
               <Text
                  style={{
                     color: theme.colors.secondary,
                  }}>
                  Send Commodity
               </Text>
            </Pressable>
         )}
         {currentUser?.userId === user?.userId && (
            <Pressable
               style={styles.navLink}
               onPress={() => navigation.navigate("BuyCommodityScreen")}>
               <MaterialCommunityIcons
                  name="transfer"
                  size={20}
                  color={theme.colors.secondary}
               />
               <Text
                  style={{
                     color: theme.colors.secondary,
                  }}>
                  Buy Commodity
               </Text>
            </Pressable>
         )}
         {currentUser?.userId === user?.userId && (
            <Pressable
               style={styles.navLink}
               onPress={() =>
                  Alert.alert("", "Your Commodity blanace is C 20000.00")
               }>
               <MaterialIcons
                  name="account-balance"
                  size={20}
                  color={theme.colors.secondary}
               />
               <Text
                  style={{
                     color: theme.colors.secondary,
                  }}>
                  Check Balance
               </Text>
            </Pressable>
         )}
         {currentUser?.userId === user?.userId && (
            <Pressable style={styles.navLink}>
               <AntDesign
                  name="logout"
                  size={20}
                  color={theme.colors.secondary}
               />
               <Text
                  style={{
                     color: theme.colors.secondary,
                  }}>
                  Logout
               </Text>
            </Pressable>
         )}
      </View>
   );
};

export default ProfileNavComponent;

const styles = StyleSheet.create({
   navs: {
      // flex:1,
      width: width - 30,
      borderRadius: 30,
      flexDirection: "column",
      // marginBottom:120,
      paddingVertical: 15,
      paddingHorizontal: 0,
      gap: 3,
      flexWrap: "wrap",
   },
   navLink: {
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
      // justifyContent: "space-between",
      marginVertical: 0,
      // backgroundColor:"#f5f5f5",
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 20,
   },
});
