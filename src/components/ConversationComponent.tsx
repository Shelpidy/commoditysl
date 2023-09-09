import {
   StyleSheet,
   Text,
   View,
   Pressable,
   Dimensions,
   Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Skeleton } from "@rneui/base";
import { Avatar, Badge, useTheme } from "react-native-paper";
import { Image } from "react-native";
import axios from "axios";
import moment from "moment";
import TextEllipse from "./TextEllipse";
import { useNavigation } from "@react-navigation/native";
import { io, Socket } from "socket.io-client";
import { useCurrentUser } from "../utils/CustomHooks";
import { useSelector } from "react-redux";

type ConversationComponentProps = {
   conversation: Room;
   setTopConvId: (id: any) => void;
};

const { width, height } = Dimensions.get("window");

const generateRoomId = (secUserId: any, activeUserId: any) => {
   let maxId = Math.max(secUserId, activeUserId);
   let minId = Math.min(secUserId, activeUserId);
   return Number(`${maxId}${minId}`);
};

const ConversationComponent = ({
   conversation,
   setTopConvId,
}: ConversationComponentProps) => {
   const [secondUser, setSecondUser] = useState<User | null>(null);
   const [loading, setLoading] = useState<boolean>(false);
   const theme = useTheme();
   const navigation = useNavigation<any>();
   // const [socket, setSocket] = useState<Socket | null>(null);
   const [lastSeen, setLastSeen] = useState<any>("");
   const [gesture, setGesture] = useState<string>("");
   const [typing, setTyping] = useState<boolean | null>(false);
   const [recording, setRecording] = useState<boolean | null>(false);
   const [resetLastSeen, setResetLastSeen] = useState<number>(0);
   const currentUser = useCurrentUser();
   const [newConversation, setNewConversation] = useState<Room>(conversation);
   const { socket } = useSelector((state: any) => state.rootReducer);

   //////////////////  GET SECOND USER ///////////////
   useEffect(
      function () {
         if (currentUser) {
            console.log("Fetching user");
            let fetchData = async () => {
               // console.log("Fetching user")
               //  let activeUserId = 1
               let userIds = [conversation.senderId, conversation.recipientId];
               let secondUserId = userIds.filter(
                  (userId) => userId != currentUser.userId
               )[0];
               try {
                  let response = await fetch(
                     `http://192.168.1.98:5000/users/${secondUserId}`,
                     { method: "GET" }
                  );
                  let data = await response.json();
                  if (data.status == "success") {
                     console.log("User-----", data.data.personal);
                     setSecondUser(data.data.personal);
                     // Alert.alert("Success",data.message)
                  } else {
                     Alert.alert("Failed", data.message);
                  }
               } catch (err) {
                  console.log(err);
                  Alert.alert("Failed", String(err));
               }
            };
            fetchData();
         }
      },
      [currentUser]
   );

   ///////////////////////////////// Join a room //////////////////////////////
   useEffect(() => {
      if (socket && conversation && currentUser) {
         socket.emit("joinRoom", {
            room: conversation.roomId,
            userId: currentUser.userId,
         });
      }
   }, [conversation, socket, currentUser]);

   //////////////////////////////// GET SECOND USER STATUS ///////////////////////////

   useEffect(() => {
      if (secondUser) {
         console.log("Fetching status");

         let fetchData = async () => {
            try {
               let resp = await fetch(
                  `http://192.168.1.98:8080/userstatus/${secondUser.userId}`,
                  { method: "GET" }
               );
               if (resp.ok) {
                  let data = await resp.json();
                  console.log("Status", data);
                  if (data.data.online) {
                     setLastSeen("online");
                  } else {
                     let lastSeenDate = moment(data.data.updatedAt).fromNow();
                     setLastSeen(lastSeenDate);
                  }
               } else {
                  let data = await resp.json();
                  Alert.alert("Failed", data.message);
               }
            } catch (err) {
               console.log(err);
               Alert.alert("Failed", String(err));
               setLoading(false);
            }
         };
         fetchData();
      }
   }, [secondUser, resetLastSeen]);

   useEffect(() => {
      if (socket && currentUser && secondUser) {
         let secUserId = secondUser.userId;
         let activeUser = currentUser?.userId;
         let roomId = generateRoomId(secUserId, activeUser);
         console.log(roomId);
         console.log("Socket connecting");
         socket.on("message", (msg: any) => {
            console.log("Message from the server", msg);
         });

         //////////  Chat message listener ///////

         /////// Online Status listener ///////////

         socket.on("online", (data: any) => {
            if (data.userId == secondUser?.userId) {
               console.log("From Online", data);
               if (data.online) {
                  setLastSeen("online");
               } else {
                  let lastSeenDate = moment(data.updatedAt).fromNow();
                  setLastSeen(lastSeenDate);
               }
               setResetLastSeen(resetLastSeen + 1);
            }
         });

         //////// Check or listen for typing status //////////

         socket.on("typing", (data: any) => {
            console.log("From Typing", { typing: data.typing });
            if (data.userId == secUserId) {
               setGesture(data.typing ? "typing..." : "");
               // setTyping(data.typing);
            }
         });

         ///////// check or listen for recording ///////////////

         socket.on("recording", (data: any) => {
            console.log("From Recording", { recording: data.recording });
            if (data.userId == secUserId) {
               setGesture(data.recording ? "recording..." : "");
               // setRecording(data.recording);
            }
         });

         ////////////// check for conversation /////////////////

         socket.on("conversation", (data: any) => {
            console.log("From Conversation", { conversation: data });
            setNewConversation(data);
            setTopConvId(data.id);
         });
      }
   }, [socket, currentUser, secondUser]);

   const gotoChatScreen = async () => {
      if (
         conversation.recipientId === currentUser?.userId &&
         !conversation.recipientReadStatus
      ) {
         try {
            let { data, status } = await axios.put(
               `http://192.168.1.98:8080/messages/chats/read/${conversation.roomId}/${conversation.recipientId}`
            );
            if (status === 202) {
               setNewConversation({
                  ...newConversation,
                  numberOfUnreadText: null,
                  recipientReadStatus: true,
               });
               navigation.navigate("ChatScreen", {
                  user: secondUser,
                  roomId: conversation.roomId,
               });
            } else {
               console.log(data.messages);
               navigation.navigate("ChatScreen", {
                  user: secondUser,
                  roomId: conversation.roomId,
               });
            }
         } catch (error) {}
      } else {
         navigation.navigate("ChatScreen", {
            user: secondUser,
            roomId: conversation.roomId,
         });
      }
   };
   if (!newConversation) {
      return (
         <View>
            <Text>No Text</Text>
         </View>
      );
   }
   if (!secondUser) {
      return (
         <View style={{ flexDirection: "row", margin: 2 }}>
            <Skeleton animation="wave" width={50} height={50} circle />
            <Skeleton
               animation="wave"
               style={{ borderRadius: 4, marginHorizontal: 2 }}
               width={300}
               height={50}
            />
         </View>
      );
   }
   return (
      <Pressable
         onPress={gotoChatScreen}
         style={styles.container}
         key={String(conversation.roomId)}>
         <View>
            <Avatar.Image
               style={{ marginTop: 3 }}
               size={42}
               source={{ uri: secondUser.profileImage }}
            />
            {/* <Image
               resizeMode="cover"
               source={{ uri: secondUser.profileImage }}
               style={{
                  width: 50,
                  height: 50,
                  borderRadius: 30,
                  marginRight: 3,
               }}
            /> */}
         </View>
         <View>
            <View
               style={{
                  width: 300,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingRight: 5,
                  alignItems: "center",
                  paddingTop: 1,
               }}>
               <TextEllipse
                  text={
                     secondUser.firstName +
                     " " +
                     secondUser.middleName +
                     " " +
                     secondUser.lastName
                  }
                  style={{
                     fontFamily:
                        currentUser?.userId == newConversation.recipientId &&
                        !newConversation.recipientReadStatus
                           ? "Poppins_500Medium"
                           : "Poppins_300Light",
                     marginHorizontal: 3,
                  }}
                  textLength={15}
               />

               <Text
                  style={{
                     fontFamily: "Poppins_300Light",
                     color: theme.colors.secondary,
                     marginLeft: 10,
                  }}>
                  {gesture}
               </Text>

               <Text>{lastSeen}</Text>
            </View>

            {newConversation.lastText && (
               <View
                  style={{
                     width: 300,
                     flexDirection: "row",
                     justifyContent: "flex-start",
                     paddingLeft: 5,
                     alignItems: "center",
                     paddingTop: 2,
                     height: "auto",
                  }}>
                  {currentUser?.userId == newConversation.recipientId &&
                     newConversation.numberOfUnreadText && (
                        <Badge
                           style={{
                              marginBottom: 5,
                           }}
                           size={18}>
                           {newConversation.numberOfUnreadText}
                        </Badge>
                     )}
                  <TextEllipse
                     text={newConversation.lastText}
                     style={{
                        fontFamily:
                           currentUser?.userId == newConversation.recipientId &&
                           !newConversation.recipientReadStatus
                              ? "Poppins_500Medium"
                              : "Poppins_300Light",
                        marginHorizontal: 3,
                     }}
                     textLength={38}
                  />
               </View>
            )}
         </View>
      </Pressable>
   );
};

export default ConversationComponent;

const styles = StyleSheet.create({
   container: {
      backgroundColor: "#ffffff",
      flexDirection: "row",
      padding: 5,
      height: "auto",
      marginVertical: 0,
   },

   notTitle: {
      fontFamily: "Poppins_500Medium",
   },
   notMessage: {
      fontFamily: "Poppins_300Light",
      paddingHorizontal: 2,
      flexWrap: "wrap",
   },
   notDate: {
      fontFamily: "Poppins_300Light_Italic",
      paddingHorizontal: 2,
      textAlign: "right",
      fontSize: 13,
   },
   notHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
   },
});
