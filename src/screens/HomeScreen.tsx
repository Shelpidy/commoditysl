import {
   ActivityIndicator,
   ScrollView,
   StyleSheet,
   Text,
   View,
} from "react-native";
import React, { useEffect } from "react";
import { Button } from "react-native-paper";
import BlogsComponent from "../components/MediaPosts/BlogsComponent";
import FindFriendsComponent from "../components/FindFriendsComponent";
import PostProductFormNav from "../components/PostProductFormNav";
import { useCurrentUser } from "../utils/CustomHooks";
import {
   Tabs,
   TabScreen,
   useTabIndex,
   useTabNavigation,
   TabsProvider,
} from "react-native-paper-tabs";
import ForYouBlogsComponent from "../components/MediaPosts/ForYourBlogsComponent";
// import { withTheme,Button,Theme } from "@rneui/themed";
// import { Theme, Button } from "@rneui/base";

type HomeScreenProps = {
   theme?: any;
   navigation: any;
};

const HomeScreen = ({ navigation }: HomeScreenProps) => {
   const currentUser = useCurrentUser();

   if (!currentUser) {
      return (
         <View>
            <ActivityIndicator />
         </View>
      );
   }

   return (
       
         <TabsProvider defaultIndex={0}>
            <Tabs>
               <TabScreen label="Following">
               <PostProductFormNav page="post" navigation={navigation} />
         <FindFriendsComponent navigation={navigation} />
                  <BlogsComponent />
               </TabScreen>
               <TabScreen label="For You">
               <PostProductFormNav page="post" navigation={navigation} />
         <FindFriendsComponent navigation={navigation} />
                  <ForYouBlogsComponent />
               </TabScreen>
            </Tabs>
         </TabsProvider>
   );
};

export default HomeScreen;

const styles = StyleSheet.create({
   container: {
      backgroundColor: "#f5f5f5",
   },
});
