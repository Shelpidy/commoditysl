import {
   Alert,
   Dimensions,
   Image,
   Pressable,
   StyleSheet,
   Text,
   View,
} from "react-native";
import React, { useState } from "react";
import { Avatar, Button, Card, IconButton, useTheme } from "react-native-paper";
import { MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import axios from "axios";
import { useCurrentUser } from "../utils/CustomHooks";
import TextEllipse from "./TextEllipse";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

type FindFriendProps = {
   user: User;
};

const FindFriendComponent = ({ user }: FindFriendProps) => {
   const theme = useTheme();
   const [followed, setFollowed] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(false);
   const currentUser = useCurrentUser();
   const navigation = useNavigation<any>();

   const gotoUserProfile = () => {
      console.log(user.userId);
      navigation.navigate("UserProfileScreen", { userId: user.userId });
   };

   const handleFollow = async () => {
      setLoading(true);
      try {
         let { data, status } = await axios.put(
            `http://192.168.1.98:6000/follows/`,
            { followerId: currentUser?.userId, followingId: user?.userId },
            {
               headers: {
                  Accept: "application/json",
                  Authorization: `Bearer ${currentUser?.token}`,
               },
            }
         );
         if (status === 202) {
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

   return (
      <Pressable onPress={gotoUserProfile}>
         <Card
            mode="contained"
            style={[
               styles.container,
               { backgroundColor: theme.colors.background },
            ]}>
            <Image
               style={styles.profileImage}
               source={{ uri: user.profileImage }}
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
               <TextEllipse
                  style={styles.nameText}
                  text={user.fullName}
                  textLength={15}
               />

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
            </View>

            {/* <Text style={styles.nameText}>{user.lastName}</Text> */}
            <View style={styles.followerContainer}>
               <Button
                  style={{ justifyContent: "center", alignItems: "center" }}
                  labelStyle={{
                     textAlign: "center",
                     textAlignVertical: "center",
                     fontFamily: "Poppins_300Light",
                     fontSize: 12,
                  }}
                  loading={loading}
                  disabled={loading}
                  onPress={handleFollow}
                  mode={followed ? "text" : "contained"}>
                  {/* <SimpleLineIcons
                     size={13}
                     name={followed ? "user-following" : "user-follow"}
                  /> */}

                  {followed ? " Unfollow" : " Follow"}
               </Button>
            </View>
         </Card>
      </Pressable>
   );
};

export default React.memo(FindFriendComponent);

const styles = StyleSheet.create({
   profileImage: {
      width: width * 0.35,
      height: height * 0.21,
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5,
   },
   container: {
      borderRadius: 5,
      margin: 4,
      alignItems: "center",
      paddingBottom: 6,
      overflow: "hidden",
   },
   followerContainer: {
      padding: 4,
   },
   nameText: {
      fontFamily: "Poppins_400Regular",
      margin: 5,
      fontSize: 11,
   },
});
