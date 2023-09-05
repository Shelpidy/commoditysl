import {
   StyleSheet,
   View,
   Alert,
   ScrollView,
   FlatList,
   Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useCurrentUser } from "../utils/CustomHooks";
import ConversationComponent from "../components/ConversationComponent";
import { LoadingConversationComponent } from "../components/MediaPosts/LoadingComponents";
import { Skeleton } from "@rneui/themed";

const { width } = Dimensions.get("window");

const NewConversationsScreen = () => {
   const [conversations, setConversations] = useState<Room[] | null>(null);
   const [currentPage, setCurrentPage] = useState<number>(1);
   const [convId, setConvId] = useState<any>(1);
   const [totalConversations, setTotalConversations] = useState<number>(0);
   const [numberOfConversationsRecord, setNumberOfConversationsRecord] =
      useState<number>(30);
   const currentUser = useCurrentUser();

   useEffect(() => {
      if (currentUser && currentPage) {
         console.log("Fetching Chats");
         let userId = currentUser?.userId;

         let fetchData = async () => {
            try {
               let resp = await fetch(
                  `http://192.168.1.93:8080/messages/chats/${userId}/${currentPage}/${numberOfConversationsRecord}`,
                  { method: "GET" }
               );
               let { chats: newConversations, count } = await resp.json();
               // console.log("conversations Messages", chatMessages);
               setTotalConversations(count);
               if (conversations && currentPage > 1) {
                  setConversations([...conversations, ...newConversations]);
               } else {
                  setConversations([...newConversations]);
               }
            } catch (err) {
               console.log(err);
               Alert.alert("Failed", String(err));
            }
         };
         fetchData();
      }
   }, [currentUser, currentPage, convId]);

   if (!conversations)
      return (
         <ScrollView style={{ marginBottom: 10 }}>
            <View
               style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  marginVertical: 4,
               }}>
               <Skeleton
                  style={{ borderRadius: 4, marginTop: 4 }}
                  animation="wave"
                  width={width - 14}
                  height={53}
               />
            </View>
            <LoadingConversationComponent />
            <LoadingConversationComponent />
            <LoadingConversationComponent />
            <LoadingConversationComponent />
            <LoadingConversationComponent />
            <LoadingConversationComponent />
            <LoadingConversationComponent />
            <LoadingConversationComponent />
            <LoadingConversationComponent />
            <LoadingConversationComponent />
            <LoadingConversationComponent />
            <LoadingConversationComponent />
            <LoadingConversationComponent />
            <LoadingConversationComponent />
            <LoadingConversationComponent />
            <LoadingConversationComponent />
         </ScrollView>
      );

   return (
      <FlatList
         data={conversations}
         keyExtractor={(item) => String(item.roomId)}
         renderItem={({ item, index, separators }) => (
            <View key={String(item.roomId)}>
               <ConversationComponent
                  setTopConvId={(id) => setConvId(id)}
                  conversation={item}
               />
            </View>
         )}
      />
   );
};

let MemoScreen = React.memo(NewConversationsScreen);

const ConversationsScreen = () => {
   return <MemoScreen />;
};

export default NewConversationsScreen;

const styles = StyleSheet.create({});
