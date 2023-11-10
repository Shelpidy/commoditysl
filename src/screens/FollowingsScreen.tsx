import { ScrollView, StyleSheet, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { users as commodityUsers } from "../data";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import UserComponent from "../components/UserComponent";
import SearchForm from "../components/SearchForm";

const FollowingsScreen = ({ navigation, route }: any) => {
   const [users, setUsers] = useState<User[]>([]);
   const [loading, setLoading] = useState<boolean>(false);
   const theme = useTheme();

   useEffect(function () {
      console.log("Fetching user");
      setLoading(true);
      let fetchData = async () => {
         // console.log("Fetching user")
         let userId = route.params.userId;
         try {
            let response = await fetch(
               `http://192.168.1.98:6000/follows/followings/${userId}`,
               { method: "GET" }
            );
            let data = await response.json();
            if (data.status == "success") {
               console.log("Users-----", data.data);
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

   if (loading)
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
      <View>
         <Text
            style={{ marginLeft: 15, marginBottom: 10 }}
            variant="titleSmall">
            Followings
         </Text>

         <View style={{ marginHorizontal: 8 }}>
            <SearchForm setSearchValue={(v) => console.log(v)} />
         </View>
         {users.length < 1 && (
            <View>
               <Text>No Follower</Text>
            </View>
         )}

         {/* <Text
            style={{ fontFamily: "Poppins_600SemiBold", marginHorizontal: 15 }}>
            <Feather size={20} name="users" /> Users
         </Text> */}
         <ScrollView
            style={{
               backgroundColor: theme.colors.background,
               paddingHorizontal: 6,
            }}>
            {users?.map((user) => {
               return <UserComponent key={String(user.userId)} _user={user} />;
            })}
         </ScrollView>
      </View>
   );
};

export default FollowingsScreen;
