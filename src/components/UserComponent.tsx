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
import {
   AntDesign,
   EvilIcons,
   Fontisto,
   MaterialIcons,
} from "@expo/vector-icons";
import { Skeleton } from "@rneui/base";
import { Avatar, Button, useTheme } from "react-native-paper";
import TextEllipse from "./TextEllipse";
import axios from "axios";
import { useCurrentUser } from "../utils/CustomHooks";
import { useSelector } from "react-redux";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";

type UserComponentProps = {
   _user: User;
};
const { width } = Dimensions.get("window");
const UserComponent = ({ _user }: UserComponentProps) => {
   const [user, SetUser] = useState<User | null>(null);
   const [loading, setLoading] = useState<boolean>(false);
   const currentUser = useCurrentUser();
   const { width, height } = Dimensions.get("window");
   const [followed, setFollowed] = useState<boolean>(false);
   const [lastSeen, setLastSeen] = useState<"online" | any>("");
   const navigation = useNavigation<any>();
   const { socket } = useSelector((state: any) => state.rootReducer);
   let theme = useTheme();

   useEffect(() => {
      console.log("USER COMPONENT");
      console.log(_user.userId);
      console.log(currentUser?.followingIds);
      if (currentUser?.followingIds?.includes(_user.userId)) {
         console.log(_user.userId, currentUser?.followingIds);
         setFollowed(true);
      }
      // dispatchPostComment({ type: "", payload: "" });
      SetUser(_user);
   }, [currentUser, _user]);

   useEffect(() => {
      socket.on(String(_user.userId), (data: any) => {
         if (data.online) {
            setLastSeen("online");
         } else {
            let lastSeenDate = moment(data.updatedAt).fromNow();
            setLastSeen(lastSeenDate);
         }
      });
   }, []);

   const handleFollow = async () => {
      try {
         let { data } = await axios.put(
            `http://192.168.1.93:5000/media/follows/`,
            { followerId: currentUser?.userId, followingId: user?.userId },
            { headers: { Accept: "application/json" } }
         );
         if (data.status == "success") {
            console.log(data.data);
            setFollowed(data.data.followed);
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
      if (currentUser?.userId === user?.userId) {
         navigation.navigate("ProfileScreen", { userId: user?.userId });
      } else {
         navigation.navigate("UserProfileScreen", { userId: user?.userId });
      }
   };

   if (!user) {
      return (
         <View>
            <Skeleton
               circle
               height={50}
               style={{ marginRight: 5 }}
               animation="wave"
               width={50}
            />
            <Skeleton height={50} animation="wave" width={width - 10} />
         </View>
      );
   }
   return (
      <View
         style={{
            backgroundColor: theme.colors.background,
            margin: 0,
            width: width,
         }}>
         <View
            style={{
               flexDirection: "row",
               alignItems: "center",
               paddingHorizontal: 5,
               paddingVertical: 5,
            }}>
            <Pressable
               style={{ position: "relative" }}
               onPress={gotoUserProfile}>
               <Avatar.Image
                  style={{
                     position: "absolute",
                     top: 0,
                     bottom: 0,
                     left: 0,
                     right: 0,
                  }}
                  size={45}
                  source={{ uri: user.profileImage }}
               />
               {lastSeen === "online" ? (
                  <View
                     style={{
                        width: 4,
                        height: 4,
                        borderRadius: 4,
                        backgroundColor: "green",
                        position: "absolute",
                        bottom: 0,
                        left: "90%",
                     }}></View>
               ) : (
                  <Text>{lastSeen}</Text>
               )}
            </Pressable>
            <View
               style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  margin: 4,
                  paddingHorizontal: 2,
               }}>
               {/* <View><Text style={{fontFamily:"Poppins_400Regular"}}>{user?.firstName} {user?.lastName}</Text> </View> */}
               <View>
                  <TextEllipse
                     text={user.fullName}
                     style={{
                        fontFamily: "Poppins_400Regular",
                        marginHorizontal: 3,
                     }}
                     textLength={18}
                  />
                  {user.verified && (
                     <MaterialIcons
                        size={15}
                        color={
                           user.verificationRank === "low"
                              ? "yellow"
                              : user.verificationRank === "medium"
                              ? "green"
                              : "blue"
                        }
                        name="verified"
                     />
                  )}
               </View>
               {/* <Pressable style={{marginHorizontal:5}}><Text><EvilIcons name='external-link' size={26} /></Text></Pressable> */}
               {user.userId !== currentUser?.userId && (
                  <Button
                     onPress={handleFollow}
                     style={{ marginVertical: 5, alignSelf: "flex-end" }}
                     mode={followed ? "text" : "contained"}>
                     {followed ? "unfollow" : "follow"}
                  </Button>
               )}
            </View>
         </View>
      </View>
   );
};

export default UserComponent;

const styles = StyleSheet.create({
   profileImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
   },
});
