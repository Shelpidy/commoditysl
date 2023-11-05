import {
   Alert,
   Dimensions,
   Image,
   Pressable,
   StyleSheet,
   View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Button, IconButton, useTheme, Text, List } from "react-native-paper";
import { SimpleLineIcons } from "@expo/vector-icons";
import axios from "axios";
import { useCurrentUser } from "../utils/CustomHooks";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

type FollowerComponentProps = { user: any };

const FollowerComponent = ({ user }: FollowerComponentProps) => {
   const theme = useTheme();
   const [followed, setFollowed] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(false);
   const navigation = useNavigation<any>();
   const currentUser = useCurrentUser();

   useEffect(() => {
      if (currentUser?.followingIds?.includes(user.userId)) {
         setFollowed(true);
      }
   }, [currentUser]);

   const handleFollow = async (userId: string) => {
      try {
         let { data } = await axios.put(
            `http://192.168.1.98:5000/media/follows/`,
            { followerId: 1, followingId: userId },
            { headers: { Accept: "application/json" } }
         );
         if (data.status == "success") {
            console.log(data.data);
            setFollowed(!followed);
            Alert.alert("Success", data.message);
         } else {
            Alert.alert("Failed", data.message);
         }
         setLoading(false);
      } catch (err) {
         Alert.alert("Failed", String(err));
         setLoading(false);
      }
   };

   const gotoUserProfile = () => {
      if (currentUser?.userId === user.userId) {
         navigation.navigate("ProfileScreen", { userId: user.userId });
      } else {
         navigation.navigate("UserProfileScreen", { userId: user.userId });
      }
   };

   return (
      <List.Item
         onPress={gotoUserProfile}
         left={() => (
            <List.Image
               style={styles.profileImage}
               source={{ uri: user.profileImage }}
            />
         )}
         titleStyle={{ color: "red" }}
         title={user.fullName}
         titleNumberOfLines={1}
         right={() => (
            <Button onPress={() => handleFollow(user.userId)}>
               <SimpleLineIcons
                  name={followed ? "user-following" : "user-follow"}
               />
               <Text
                  style={{
                     fontFamily: "Poppins_500Medium",
                  }}>
                  {followed ? " Unfollow" : " Follow"}
               </Text>
            </Button>
         )}
      />
   );
};

export default FollowerComponent;

const styles = StyleSheet.create({
   profileImage: {
      width: 40,
      height: 40,
      borderRadius: 30,
   },
   container: {
      width: width / 1.5,
      borderRadius: 5,
      backgroundColor: "#fff",
      margin: 5,
   },
   followerContainer: {
      padding: 5,
   },
   nameText: {
      fontFamily: "Poppins_600SemiBold",
      margin: 5,
   },
});
