import {
   StyleSheet,
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
import { Avatar, Button, useTheme, Text } from "react-native-paper";
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
      if (_user.following) {
         setFollowed(_user?.following);
      }
      // dispatchPostComment({ type: "", payload: "" });
      SetUser(_user);
   }, [_user]);

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
            `http://192.168.1.98:5000/media/follows/`,
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
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            backgroundColor: theme.colors.background,
         }}>
         <Pressable onPress={gotoUserProfile}>
            <View style={{ position: "relative", alignItems: "center" }}>
               <Avatar.Image
                  size={40}
                  source={{ uri: "https://picsum.photos/200/300" }}
               />
               {lastSeen === "online" && (
                  <View
                     style={{
                        width: 17,
                        height: 17,
                        borderRadius: 8,
                        backgroundColor: "#fff",
                        position: "absolute",
                        bottom: -2,
                        right: -2,
                        zIndex: 10,
                        justifyContent: "center",
                        alignItems: "center",
                     }}>
                     <View
                        style={{
                           width: 12,
                           height: 12,
                           borderRadius: 8,
                           backgroundColor: "#11a100",
                        }}></View>
                  </View>
               )}
            </View>
         </Pressable>

         <Text
            onPress={gotoUserProfile}
            variant="titleMedium"
            numberOfLines={1}
            style={{
               textAlign: "center",
               marginHorizontal: 4,
               verticalAlign: "middle",
               // fontFamily: "Poppins_500Medium",
               color: theme.colors.secondary,
            }}>
            {user.fullName}
         </Text>
         {/* <TextEllipse
                  style={{
                     fontFamily: "Poppins_400Regular",
                     margin: 5,
                     color: theme.colors.secondary,
                     fontSize: 12,
                  }}
                  textLength={23}
                  text={user.fullName}
               /> */}
         {user.verificationRank && (
            <MaterialIcons
               size={14}
               color={
                  user.verificationRank === "low"
                     ? "orange"
                     : user.verificationRank === "medium"
                     ? "green"
                     : "blue"
               }
               name="verified"
            />
         )}
         <View
            style={{
               flex: 1,
               justifyContent: "flex-end",
               alignItems: "flex-end",
               marginBottom: 2,
               paddingHorizontal: 0,
               borderRadius: 3,
            }}>
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
