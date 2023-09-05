import { ScrollView, StyleSheet, Text, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { users as commodityUsers } from "../data";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { ActivityIndicator } from "react-native-paper";
import UserComponent from "../components/UserComponent";

const FollowersScreen = ({ navigation, route }: any) => {
   const [users, setUsers] = useState<User[] | null>(null);
   const [loading, setLoading] = useState<boolean>(false);

   useEffect(function () {
      console.log("Fetching user's followers");
      setLoading(true);
      let fetchData = async () => {
         // console.log("Fetching user")
         let userId = route.params.userId;
         try {
            let response = await fetch(
               `http://192.168.1.93:6000/follows/followers/${userId}`,
               { method: "GET" }
            );
            let data = await response.json();
            if (data.status == "success") {
               console.log("Followers-----", data.data);
               setUsers(data.data?.sort(() => 0.5 - Math.random()));
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

   if (!users)
      return (
         <View
            style={{
               flex: 1,
               justifyContent: "center",
               alignItems: "center",
               padding: 15,
            }}>
            <Text>
               <ActivityIndicator />
            </Text>
         </View>
      );
   return (
      <ScrollView style={styles.container}>
         <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <Text
               style={{
                  fontFamily: "Poppins_400Regular",
                  marginHorizontal: 5,
                  fontSize: 18,
               }}>
               Followers
            </Text>
            <Text style={{ fontFamily: "Poppins_400Regular", fontSize: 18 }}>
               {users.length}
            </Text>
         </View>
         {users.map((user) => {
            return <UserComponent key={String(user.userId)} _user={user} />;
         })}
      </ScrollView>
   );
};

export default FollowersScreen;

const styles = StyleSheet.create({
   container: {
      padding: 5,
   },
});
