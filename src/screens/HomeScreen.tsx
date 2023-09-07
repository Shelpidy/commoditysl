import {
   ActivityIndicator,
   Dimensions,
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
import * as Linking from "expo-linking";
import PostForm from "../components/MediaPosts/PostForm";
import { Fontisto } from "@expo/vector-icons";
// import { withTheme,Button,Theme } from "@rneui/themed";
// import { Theme, Button } from "@rneui/base";

type HomeScreenProps = {
   theme?: any;
   navigation: any;
};

const {width,height} = Dimensions.get("window")

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
       
         <TabsProvider defaultIndex={1}>
            <Tabs style={{justifyContent:"center",width:width - 30}} tabLabelStyle={{fontFamily:"Poppins_400Regular",fontSize:12}} uppercase={false} mode='fixed'  tabHeaderStyle={{justifyContent:'center',alignSelf:'center',padding:0,height:0.05*height,marginBottom:5}}>
               <TabScreen  label="Following">
               <ScrollView>
                  <Button  onPress={()=> Linking.openURL("com.commodity.sl:/notifications")}>Go to Notification</Button>
               <PostProductFormNav page="post" navigation={navigation} />
               <FindFriendsComponent navigation={navigation} />
                  <BlogsComponent />

               </ScrollView>
               
               </TabScreen>
               <TabScreen label="For You">
                  <ScrollView>
                  <PostProductFormNav page="post" navigation={navigation} />
                 <FindFriendsComponent navigation={navigation} />
                  <ForYouBlogsComponent />
                  </ScrollView>
              
               </TabScreen>
               <TabScreen icon='plus' label="New">
                  <PostForm/>
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
