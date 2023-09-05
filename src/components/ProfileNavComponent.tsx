import { Alert, Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import {
   AntDesign,
   Entypo,
   Feather,
   MaterialCommunityIcons,
   MaterialIcons,
} from "@expo/vector-icons";
import { Button, useTheme, Card } from "react-native-paper";
import { useCurrentUser } from "../utils/CustomHooks";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const ProfileNavComponent = ({ user }: { user: User }) => {
   const currentUser = useCurrentUser();
   const navigation = useNavigation<any>();
   const theme = useTheme();

   return (
      <Card mode="contained" style={styles.navs}>
         {currentUser?.userId === user?.userId && (
            <View style={styles.navLink}>
               <AntDesign
                  name="setting"
                  size={20}
                  color={theme.colors.secondary}
               />
               <Text
                  style={{
                     fontFamily: "Poppins_500Medium",
                     color: theme.colors.secondary,
                  }}>
                  Settings
               </Text>
               <Button onPress={() => navigation.navigate("SettingsScreen")}>
                  <Entypo name="chevron-thin-right" />
               </Button>
            </View>
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
                  fontFamily: "Poppins_500Medium",
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
            <View style={styles.navLink}>
               <MaterialCommunityIcons
                  name="transfer"
                  size={20}
                  color={theme.colors.secondary}
               />
               <Text
                  style={{
                     fontFamily: "Poppins_500Medium",
                     color: theme.colors.secondary,
                  }}>
                  Send Commodity
               </Text>
               <Button
                  onPress={() => navigation.navigate("TransferMoneyScreen")}>
                  <Entypo name="chevron-thin-right" />
               </Button>
            </View>
         )}
         {currentUser?.userId === user?.userId && (
            <View style={styles.navLink}>
               <MaterialCommunityIcons
                  name="transfer"
                  size={20}
                  color={theme.colors.secondary}
               />
               <Text
                  style={{
                     fontFamily: "Poppins_500Medium",
                     color: theme.colors.secondary,
                  }}>
                  Buy Commodity
               </Text>
               <Button
                  onPress={() => navigation.navigate("BuyCommodityScreen")}>
                  <Entypo name="chevron-thin-right" />
               </Button>
            </View>
         )}
         {currentUser?.userId === user?.userId && (
            <View style={styles.navLink}>
               <MaterialIcons
                  name="account-balance"
                  size={20}
                  color={theme.colors.secondary}
               />
               <Text
                  style={{
                     fontFamily: "Poppins_500Medium",
                     color: theme.colors.secondary,
                  }}>
                  Check Balance
               </Text>
               <Button
                  onPress={() =>
                     Alert.alert("", "Your Commodity blanace is C 20000.00")
                  }>
                  <Entypo name="chevron-thin-right" />
               </Button>
            </View>
         )}
         {currentUser?.userId === user?.userId && (
            <View style={styles.navLink}>
               <AntDesign
                  name="logout"
                  size={20}
                  color={theme.colors.secondary}
               />
               <Text
                  style={{
                     fontFamily: "Poppins_500Medium",
                     color: theme.colors.secondary,
                  }}>
                  Logout
               </Text>
               <Button>
                  <Entypo name="chevron-thin-right" />
               </Button>
            </View>
         )}
      </Card>
   );
};

export default ProfileNavComponent;

const styles = StyleSheet.create({
   navs: {
      backgroundColor: "#fff",
      // flex:1,
      width: width - 30,
      borderRadius: 30,
      // marginBottom:120,
      paddingVertical: 15,
      paddingHorizontal: 10,
   },
   navLink: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: 0,
      // backgroundColor:"#f5f5f5",
      paddingVertical: 1,
      paddingHorizontal: 25,
      borderRadius: 20,
   },
});
