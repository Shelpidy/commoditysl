import {
   ActivityIndicator,
   Alert,
   Dimensions,
   ScrollView,
   StyleSheet,
   Text,
   View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Divider } from "react-native-paper";
import BlogsComponent from "../components/MediaPosts/BlogsComponent";
import FindFriendsComponent from "../components/FindFriendsComponent";
import PostProductFormNav from "components/PostProductFormNav";
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
import axios from "axios";
import { LoadingBlogComponent } from "../components/MediaPosts/LoadingComponents";
// import { withTheme,Button,Theme } from "@rneui/themed";
// import { Theme, Button } from "@rneui/base";

type HomeScreenProps = {
   theme?: any;
   navigation: any;
};

type BlogComponentProps = {
   blog: Blog;
   createdBy: User;
   ownedBy: User;
   commentsCount: number;
   likesCount: number;
   sharesCount: number;
   liked: boolean;
   reposted:boolean;
};

const { width, height } = Dimensions.get("window");

const HomeScreen = ({ navigation }: HomeScreenProps) => {
   const [blogs, setBlogs] = useState<BlogComponentProps[] | null>(null);
   const [forYouBlogs, setForYouBlogs] = useState<BlogComponentProps[] | null>(null);
   const currentUser = useCurrentUser();

   useEffect(()=>{

      let fetchData = async (pageNum?: number) => {
         
         try {
            if (currentUser) {
             
               let activeUserId = currentUser?.userId;
               let { data, status } = await axios.get(
                  `http://192.168.1.98:6000/blogs?pageNumber=1&numberOfRecords=5`,
                  { headers: { Authorization: `Bearer ${currentUser?.token}` } }
               );
   
               if (status === 200) {
                  console.log(data);
                  // setBlogs(data.data);
                  let fetchedPost: BlogComponentProps[] = data.data;
   
                  setForYouBlogs((prev) =>
                     prev ? [...prev, ...fetchedPost] : fetchedPost
                  );
                 
               } else {
                  Alert.alert("For U Failed", data.message);
                 
               }
            }
         } catch (err) {
            Alert.alert("For U Failed", String(err));
            console.log(err);
         }
      };
      if (currentUser) {
         fetchData();
      }

   },[currentUser])

   useEffect(
      function () {
         let fetchData = async (pageNum?: number) => {
            try {
               if (currentUser) {
                  let { data, status } = await axios.get(
                     `http://192.168.1.98:6000/sessions/blogs/?pageNumber=1&numberOfRecords=5`,
                     {
                        headers: {
                           Authorization: `Bearer ${currentUser?.token}`,
                        },
                     }
                  );

                  if (status === 200) {
                     // console.log(data);
                     // setBlogs(data.data);
                     let fetchedPost: BlogComponentProps[] = data.data;

                     // setAllBlogs((prev) =>
                     //    prev ? [...prev, ...fetchedPost] : fetchedPost
                     // );
                     setBlogs((prev) =>
                        prev ? [...prev, ...fetchedPost] : fetchedPost
                     );
                  } else {
                     Alert.alert("Blogs Failed", data.message);
                     console.log(data.message);
                  }
               }
            } catch (err) {
               Alert.alert("Blog Fetching", String(err));
               console.log(err);
            }
         };

         if (currentUser) {
            fetchData();
         }
      },
      [currentUser]
   );

   if (!currentUser) {
      return (
         <View>
            <ActivityIndicator />
         </View>
      );
   }

   return (
      <TabsProvider defaultIndex={1}>
         <Tabs
            disableSwipe={false}
            style={{
               justifyContent: "center",
               width: width - 30,
               padding: 0,
               marginHorizontal: 0,
               marginBottom: 15,
            }}
            tabLabelStyle={{
               fontSize: 12,
               textAlignVertical: "center",
               marginBottom: 0,
               textAlign: "center",
            }}
            uppercase={false}
            mode="fixed"
            tabHeaderStyle={{
               justifyContent: "center",
               alignSelf: "center",
               padding: 0,
               margin: 0,
               height: 0.05 * height,
               marginBottom: 5,
            }}>
            <TabScreen label="Following">
               <ScrollView>
                  {/* <PostProductFormNav page="post" navigation={navigation} /> */}
                  <FindFriendsComponent navigation={navigation} />
                  {!blogs && (
                     <View style={{ padding: 2 }}>
                        <LoadingBlogComponent />
                        <Divider />
                        <LoadingBlogComponent />
                        <Divider />
                        <LoadingBlogComponent />
                     </View>
                  )}
                  {blogs && <BlogsComponent blogs={blogs} />}
               </ScrollView>
            </TabScreen>
            <TabScreen label="For You">
               <ScrollView>
                  {/* <PostProductFormNav page="post" navigation={navigation} /> */}
                  <FindFriendsComponent navigation={navigation} />
                  {!forYouBlogs && (
                     <View style={{ padding: 2 }}>
                        <LoadingBlogComponent />
                        <Divider />
                        <LoadingBlogComponent />
                        <Divider />
                        <LoadingBlogComponent />
                     </View>
                  )}
                  {forYouBlogs && <BlogsComponent blogs={forYouBlogs} />}
               </ScrollView>
            </TabScreen>
            <TabScreen icon="plus" label="New">
               <PostForm />
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
