import {
   StyleSheet,
   Text,
   View,
   Alert,
   Pressable,
   Image,
   TextInput,
   Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Fontisto } from "@expo/vector-icons";
import { Skeleton } from "@rneui/base";
import { useCurrentUser } from "../utils/CustomHooks";
import { Avatar } from "react-native-paper";
import axios from "axios";

type PostProductFormNavProps = {
   navigation: any;
   page: "product" | "post";
};

const PostProductFormNav = ({ navigation, page }: PostProductFormNavProps) => {
   const [user, setUser] = useState<any>(null);
   const [loading, setLoading] = useState<boolean>(false);
   const currentUser = useCurrentUser();
   const { width, height } = Dimensions.get("window");

   useEffect(
      function () {
         console.log("Fetching a user");

         let fetchData = async () => {
            // console.log("Fetching user")
            //  let activeUserId = 1
            console.log(currentUser?.userId);
            try {
               if (currentUser) {
                  let { data, status } = await axios.get(
                     `http://192.168.1.93:5000/auth/users/${currentUser?.userId}`
                  );

                  if (status === 200) {
                     console.log("User Top-----", data.data);
                     setUser(data.data.personal);
                  } else {
                     Alert.alert("Failed", data.message);
                  }
               }
            } catch (err) {
               console.log(err);
               Alert.alert("Failed", String(err));
            }
         };
         fetchData();
      },
      [currentUser]
   );

   const gotoUploadScreen = () => {
      if (page === "product") {
         navigation.navigate("ProductPostScreen", {
            openImagePicker: true,
         });
      } else {
         navigation.navigate("PostScreen", {
            openImagePicker: true,
         });
      }
   };

   const gotoUserProfile = () => {
      if (currentUser?.userId === user.id) {
         navigation.navigate("ProfileScreen", { userId: user.id });
      } else {
         navigation.navigate("UserProfileScreen", { userId: user.id });
      }
   };

   if (!user) {
      return (
         <View
            style={{
               justifyContent: "center",
               flexDirection: "row",
               marginVertical: 5,
            }}>
            <Skeleton height={50} animation="wave" circle width={50} />
            <Skeleton
               height={50}
               style={{ borderRadius: 20, marginLeft: 4 }}
               animation="wave"
               width={width - 70}
            />
         </View>
      );
   }
   return (
      <View
         style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
            paddingVertical: 5,
         }}>
         <Pressable onPress={gotoUserProfile}>
            <Avatar.Image source={{ uri: user.profileImage }} size={40} />
         </Pressable>
         <View
            style={{
               paddingRight: 20,
               flexDirection: "row",
               alignItems: "center",
               justifyContent: "center",
               marginRight: 20,
               marginLeft: 3,
            }}>
            <TextInput
               placeholder={
                  page === "product"
                     ? "Upload Your Product..."
                     : "Upload Your Post..."
               }
               style={{
                  flex: 1,
                  backgroundColor: "#FFFFFF",
                  borderTopLeftRadius: 20,
                  borderBottomLeftRadius: 20,
                  height: 50,
                  paddingHorizontal: 25,
               }}
            />
            <Pressable
               onPress={gotoUploadScreen}
               style={{
                  paddingHorizontal: 15,
                  height: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  borderTopRightRadius: 20,
                  borderBottomRightRadius: 20,
                  backgroundColor: "#ffffff",
               }}>
               <Fontisto size={20} name="photograph" />
            </Pressable>
         </View>
      </View>
   );
};

export default PostProductFormNav;

const styles = StyleSheet.create({
   profileImage: {
      width: 35,
      height: 35,
      borderRadius: 20,
   },
});
