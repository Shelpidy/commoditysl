import React, { useEffect, useState } from "react";
import {
   Alert,
   Dimensions,
   ScrollView,
   StyleSheet,
   Text,
   View,
   FlatList,
} from "react-native";
import {
   ActivityIndicator,
   Avatar,
   Button,
   useTheme,
} from "react-native-paper";
import BlogComponent from "../components/MediaPosts/BlogComponent";
import ProfileNavComponent from "../components/ProfileNavComponent";
import {
   EvilIcons,
   MaterialCommunityIcons,
   MaterialIcons,
} from "@expo/vector-icons";
import SearchForm from "../components/SearchForm";
import SharedBlogComponent from "../components/MediaPosts/SharedBlogComponent";
import {
   LoadingBlogComponent,
   LoadingProfileComponent,
} from "../components/MediaPosts/LoadingComponents";
import { useSelector } from "react-redux";
import moment from "moment";
import axios from "axios";
import { useCurrentUser } from "../utils/CustomHooks";

const { width, height } = Dimensions.get("window");

type BlogComponent = {
   blog: Blog;
   commentsCount: number;
   likesCount: number;
   sharesCount: number;
   createdBy: User;
   ownedBy: User;
   liked: boolean;
};

const ProfileScreen = ({ navigation, route }: any) => {
   const theme = useTheme();
   const [posts, setPosts] = useState<BlogComponent[] | null>(null);
   const [allPosts, setAllPosts] = useState<BlogComponent[]>([]);
   const [user, setUser] = useState<any>(null);
   const page = React.useRef<number>(1);
   const [numberOfPostsPerPage, setNumberOfPostsPerPage] = useState<number>(5);
   const [loading, setLoading] = useState<boolean>(false);
   const [hasMore, setHasMore] = useState(true);
   const [loadingFetch, setLoadingFetch] = useState<boolean>(false);
   const [lastSeen, setLastSeen] = useState<"online" | any>("");
   const currentUser = useCurrentUser();
   const { socket } = useSelector((state: any) => state.rootReducer);

   // GETTING POSTS

   let fetchData = async (pageNum?: number) => {
      console.log("Fetching user blogs...");
      let pageNumber = pageNum ?? page.current;
      if (!hasMore) return;
      let userId = route.params.userId;
      if (!userId) return;
      console.log({ userId });
      try {
         let { status, data } = await axios.get(
            `http://192.168.1.98:6000/blogs/users/${userId}?pageNumber=${pageNumber}&numberOfRecords=${numberOfPostsPerPage}`,
            { headers: { Authorization: `Bearer ${currentUser?.token}` } }
         );

         if (status === 200) {
            // console.log(data.data)
            // setPosts(data.data);
            let fetchedPost: BlogComponent[] = data.data;

            setAllPosts((prev) =>
               prev ? [...prev, ...fetchedPost] : fetchedPost
            );
            setPosts((prev) =>
               prev ? [...prev, ...fetchedPost] : fetchedPost
            );

            if (fetchedPost.length > 0) page.current++;
            if (data.length < numberOfPostsPerPage) {
               setHasMore(false);
            }
            setLoadingFetch(false);
         } else {
            Alert.alert("Failed", data.message);
         }
         setLoadingFetch(false);
      } catch (err) {
         console.log(err);
         Alert.alert("Failed", String(err));
         setLoadingFetch(false);
      }
   };

   const searchPosts = (_token: string) => {
      console.log("From profile", _token);
      let token = _token.toLowerCase();
      let newPosts = allPosts?.filter(
         (post) =>
            post.blog?.text?.toLowerCase().includes(token) ||
            post.blog?.title?.toLowerCase().includes(token)
      );
      setPosts(newPosts);
   };

   const handleLoadMore = () => {
      console.log("Posts Reached end");
      if (loadingFetch) return;
      fetchData();
   };

   const renderFooter = () => {
      if (!loading) return null;
      return (
         <View
            style={{
               flexDirection: "row",
               padding: 10,
               justifyContent: "center",
               alignItems: "center",
               backgroundColor: "white",
            }}>
            <ActivityIndicator color="#cecece" size="small" />
            <Text style={{ color: "#cecece", marginLeft: 5 }}>
               Loading more posts
            </Text>
         </View>
      );
   };

   // FETCHING USER PROFILE INFO ////

   useEffect(function () {
      console.log("Fetching user profile details");
      setLoading(true);
      let fetchData = async () => {
         // console.log("Fetching user")
         //  let activeUserId = 1
         try {
            let { status, data } = await axios.get(
               `http://192.168.1.98:5000/auth/users/${route.params.userId}`,
               { headers: { Authorization: `Bearer ${currentUser?.token}` } }
            );
            if (status === 200) {
               console.log("User----", data.data);
               setUser(data.data);
               // Alert.alert("Success",data.message)
               setLoading(false);
            } else {
               Alert.alert("Failed", data.message);
            }
            setLoading(false);
         } catch (err) {
            console.log(err);
            Alert.alert("Failed", String(err));
            setLoading(false);
         }
      };
      fetchData();
   }, []);

   useEffect(function () {
      fetchData(1);
   }, []);

   useEffect(() => {
      console.log("Socket is running", String(route.params.userId));
      socket.on(String(route.params.userId), (data: any) => {
         console.log("From socket", data);
         if (data.online) {
            setLastSeen("online");
         } else {
            let lastSeenDate = moment(data.updatedAt).fromNow();
            setLastSeen(lastSeenDate);
         }
      });
   }, [socket]);

   if (!user) {
      return <LoadingProfileComponent />;
   }

   return (
      <ScrollView
         style={{
            flex: 1,
            backgroundColor: theme.colors.background,
            paddingTop: 10,
         }}>
         <View style={{ justifyContent: "center", alignItems: "center" }}>
            <View style={{ position: "relative" }}>
               <Avatar.Image
                  size={100}
                  source={{ uri: "https://picsum.photos/200/300" }}
               />
               {lastSeen === "online" && (
                  <View
                     style={{
                        width: 15,
                        height: 15,
                        borderRadius: 15,
                        backgroundColor: "green",
                        position: "absolute",
                        bottom: 2,
                        right: 15,
                        zIndex: 10,
                     }}></View>
               )}
            </View>
            <View
               style={{ flexDirection: "row", gap: 3, alignItems: "center" }}>
               <Text
                  style={{
                     textAlign: "center",
                     marginTop: 10,
                     fontFamily: "Poppins_500Medium",
                     color: theme.colors.secondary,
                  }}>
                  {user?.personal?.fullName}
               </Text>
               {user.personal.verificationRank && (
                  <MaterialIcons
                     size={17}
                     color={
                        user.personal.verificationRank === "low"
                           ? "orange"
                           : user.personal.verificationRank === "medium"
                           ? "green"
                           : "blue"
                     }
                     name="verified"
                  />
               )}
            </View>
         </View>
         <View style={styles.mediaContainer}>
            <View style={{ alignItems: "center", margin: 4 }}>
               <Text
                  style={{
                     textAlign: "center",
                     fontFamily: "Poppins_400Regular",
                     color: theme.colors.secondary,
                     fontSize: 16,
                  }}>
                  {user?.followers?.count}
               </Text>
               <Button
                  style={{ backgroundColor: theme.colors.inverseOnSurface }}
                  onPress={() =>
                     navigation.navigate("FollowersScreen", {
                        userId: user?.personal.userId,
                     })
                  }>
                  <Text
                     style={{
                        // fontWeight: "bold",
                        textAlign: "center",
                        fontFamily: "Poppins_400Regular",
                        color: theme.colors.secondary,
                        fontSize: 13,
                     }}>
                     Followers
                  </Text>
               </Button>
            </View>

            <View style={{ alignItems: "center", margin: 4 }}>
               <Text
                  style={{
                     textAlign: "center",
                     fontFamily: "Poppins_400Regular",
                     // color:theme.colors.secondary,
                     fontSize: 16,
                  }}>
                  {user?.followings?.count}
               </Text>
               <Button
                  style={{ backgroundColor: theme.colors.inverseOnSurface }}
                  onPress={() =>
                     navigation.navigate("FollowingsScreen", {
                        userId: user?.personal.userId,
                     })
                  }>
                  <Text
                     style={{
                        textAlign: "center",
                        fontFamily: "Poppins_400Regular",
                        color: theme.colors.secondary,
                        //  color:theme.colors.secondary,
                        fontSize: 13,
                     }}>
                     Following
                  </Text>
               </Button>
            </View>

            <View style={{ alignItems: "center", margin: 4 }}>
               <Text
                  style={{
                     textAlign: "center",
                     fontFamily: "Poppins_400Regular",
                     //  color:theme.colors.secondary,
                     fontSize: 15,
                  }}>
                  {user?.totalPosts}
               </Text>
               <Button
                  style={{ backgroundColor: theme.colors.inverseOnSurface }}>
                  <Text
                     style={{
                        // fontWeight: "bold",
                        textAlign: "center",
                        fontFamily: "Poppins_400Regular",
                        color: theme.colors.secondary,
                        fontSize: 13,
                     }}>
                     Posts
                  </Text>
               </Button>
            </View>
            <View style={{ alignItems: "center", margin: 4 }}>
               <Text
                  style={{
                     textAlign: "center",
                     fontFamily: "Poppins_400Regular",
                     // color:theme.colors.secondary,
                     fontSize: 13,
                  }}>
                  {user?.totalLikes}
               </Text>
               <Button
                  style={{ backgroundColor: theme.colors.inverseOnSurface }}>
                  <Text
                     style={{
                        // fontWeight: "bold",
                        textAlign: "center",
                        fontFamily: "Poppins_400Regular",
                        color: theme.colors.secondary,
                     }}>
                     Likes
                  </Text>
               </Button>
            </View>
         </View>

         <View style={{ alignItems: "center", marginBottom: 5 }}>
            <ProfileNavComponent user={user?.personal} />
         </View>

         {!posts && (
            <ScrollView>
               <LoadingBlogComponent />
               <LoadingBlogComponent />
            </ScrollView>
         )}
         {posts && posts.length > 1 && (
            <SearchForm setSearchValue={(v) => searchPosts(v)} />
         )}
         {posts && (
            <FlatList
               keyExtractor={(item) => String(item.blog.blogId)}
               data={posts}
               renderItem={({ item, index, separators }) => {
                  if (item.blog?.fromBlogId) {
                     return (
                        <SharedBlogComponent
                           key={String(item.blog.blogId)}
                           {...item}
                        />
                     );
                  } else {
                     return (
                        <BlogComponent
                           key={String(item.blog.blogId)}
                           {...item}
                        />
                     );
                  }
               }}
               onEndReached={handleLoadMore}
               onEndReachedThreshold={0.3}
               ListFooterComponent={renderFooter}
            />
         )}
      </ScrollView>
   );
};

export default ProfileScreen;

const styles = StyleSheet.create({
   mediaContainer: {
      // display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      gap: 10,
      marginTop: 8,
      marginBottom: 10,
   },
   profileImage: {
      width: 100,
      height: 100,
      borderRadius: 100,
      borderWidth: 4,
   },
});
