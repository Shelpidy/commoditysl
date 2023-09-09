import {
   ScrollView,
   StyleSheet,
   Text,
   View,
   Alert,
   FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { users as commodityUsers } from "../data";
import FindFriendComponent from "./FindFriendComponent";
import axios from "axios";
import { ActivityIndicator } from "react-native-paper";
import { useCurrentUser } from "../utils/CustomHooks";
import { LoadingFindFriendComponent } from "./MediaPosts/LoadingComponents";

const FindFriendsComponent = ({ navigation }: any) => {
   const [users, setUsers] = useState<User[] | null>(null);
   const [loading, setLoading] = useState<boolean>(false);
   const currentUser = useCurrentUser();

   useEffect(
      function () {
         console.log("Fetching ff user");
         setLoading(true);
         let fetchData = async () => {
            // console.log("Fetching user")

            try {
               if (currentUser) {
                  let activeUserId = currentUser?.userId;
                  console.log(currentUser);
                  let { status, data } = await axios.get(
                     `http://192.168.1.98:6000/follows/unfollowing/${activeUserId}`,
                     {
                        headers: {
                           Authorization: `Bearer ${currentUser?.token}`,
                        },
                     }
                  );
                  if (status === 200) {
                     console.log("Users-----", data.data);
                     setUsers(data.data?.sort(() => 0.5 - Math.random()));
                     // Alert.alert("Success",data.message)
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

   if (!users)
      return (
         <FlatList
            data={["1", "2", "3", "4"]}
            horizontal
            keyExtractor={(item) => item}
            indicatorStyle="white"
            renderItem={({ item, index, separators }) => (
               <LoadingFindFriendComponent key={item} />
            )}
         />
      );
   return (
      <FlatList
         data={users}
         horizontal
         keyExtractor={(item) => String(item.userId)}
         indicatorStyle="white"
         renderItem={({ item, index, separators }) => (
            <FindFriendComponent key={String(item.userId)} user={item} />
         )}
      />
   );
};

export default React.memo(FindFriendsComponent);
