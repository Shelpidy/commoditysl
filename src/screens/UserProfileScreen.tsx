import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
   Alert,
   Dimensions,
   FlatList,
   ScrollView,
   StyleSheet,
   Text,
   View,
} from "react-native";
import {
   ActivityIndicator,
   Avatar,
   Button,
   useTheme,
} from "react-native-paper";
import { useSelector } from "react-redux";
import BlogComponent from "../components/MediaPosts/BlogComponent";
import {
   LoadingBlogComponent,
   LoadingProfileComponent,
} from "../components/MediaPosts/LoadingComponents";
import SharedBlogComponent from "../components/MediaPosts/SharedBlogComponent";
import ProfileNavComponent from "../components/ProfileNavComponent";
import { useCurrentUser } from "../utils/CustomHooks";
import moment from "moment";

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

const UserProfileScreen = ({ navigation, route }: any) => {
   const theme = useTheme();
   const [posts, setPosts] = useState<BlogComponent[] | null>(null);
   const [allPosts, setAllPosts] = useState<BlogComponent[]>([]);
   const [user, setUser] = useState<any>(null);
   const page = React.useRef<number>(1);
   const [numberOfPostsPerPage, setNumberOfPostsPerPage] = useState<number>(20);
   const [loading, setLoading] = useState<boolean>(false);
   const currentUser = useCurrentUser();
   const [followed, setFollowed] = useState<boolean>(false);
   const [roomId, setRoomId] = useState<number | null>(null);
   const [hasMore, setHasMore] = useState(true);
   const [loadingFetch, setLoadingFetch] = useState<boolean>(false);
   const [lastSeen, setLastSeen] = useState<"online" | any>("");
   const { socket } = useSelector((state: any) => state.rootReducer);

   //////////////////// GET ROOM ID /////////////////

   useEffect(
      function () {
         let fetchData = async () => {
            // console.log("Fetching user")
            //  let activeUserId = 1
            try {
               let { data, status } = await axios.get(
                  `http://192.168.1.98:8080/room/${route.params?.userId}/${currentUser?.userId}`,
                  { headers: { Authorization: `Bearer ${currentUser?.token}` } }
               );
               if (status === 200) {
                  console.log("RoomId", data.data.roomId);
                  setRoomId(data.data.roomId);
               }
            } catch (err) {
               console.log(err);
               Alert.alert("Failed", String(err));
            }
         };
         if (currentUser) {
            fetchData();
         }
      },
      [currentUser]
   );

   // LISTEN FOR CHANGE IN ONLINE STATUS

   useEffect(() => {
      if (socket) {
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
      }
   }, [socket]);

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
               console.log("Users-----", data.data);
               setUser(data.data);
               setLastSeen(data.data.personal.lastSeenStatus);

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

   let fetchPostsData = async (pageNum?: number) => {
      console.log("Fetching post data...");
      let pageNumber = pageNum ?? page.current;
      if (!hasMore) return;
      let userId = route.params.userId;
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
         Alert.alert("Failed", String(err));
         setLoadingFetch(false);
      }
   };

   useEffect(
      function () {
         if (currentUser) {
            fetchPostsData(1);
         }
      },
      [currentUser]
   );

   const handleFollow = async () => {
      setLoading(true);
      try {
         let { data } = await axios.put(
            `http://192.168.1.98:6000/follows/`,
            {
               followerId: currentUser?.userId,
               followingId: user?.personal.userId,
            },
            { headers: { Authorization: `Bearer ${currentUser?.token}` } }
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

   const handleLoadMore = () => {
      console.log("Posts Reached end");
      if (loadingFetch) return;
      fetchPostsData();
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

   if (!user) {
      return <LoadingProfileComponent />;
   }

   return (
      <ScrollView
         style={{
            flex: 1,
            backgroundColor: theme.colors.background,
            paddingTop: 5,
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
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        backgroundColor: "#fff",
                        position: "absolute",
                        bottom: 2,
                        right: 6,
                        zIndex: 10,
                        justifyContent: "center",
                        alignItems: "center",
                     }}>
                     <View
                        style={{
                           width: 16,
                           height: 16,
                           borderRadius: 9,
                           backgroundColor: "#11a100",
                        }}></View>
                  </View>
               )}
            </View>
            <View
               style={{ flexDirection: "row", gap: 3, alignItems: "center" }}>
               <Text
                  style={{
                     textAlign: "center",
                     marginTop: 5,
                     fontFamily: "Poppins_500Medium",
                     fontSize: 14,
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
                     fontFamily: "Poppins_500Medium",
                     // color: theme.colors.secondary,
                     fontSize: 16,
                  }}>
                  {user?.followers?.count}
               </Text>
               <Button
                  onPress={() =>
                     navigation.navigate("FollowersScreen", {
                        userId: user?.personal.userId,
                     })
                  }>
                  <Text
                     style={{
                        // fontWeight: "bold",
                        textAlign: "center",
                        fontFamily: "Poppins_300Light",
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
                     fontFamily: "Poppins_500Medium",
                     // color:theme.colors.secondary,
                     fontSize: 16,
                  }}>
                  {user?.followings?.count}
               </Text>
               <Button
                  onPress={() =>
                     navigation.navigate("FollowingsScreen", {
                        userId: user?.personal.userId,
                     })
                  }>
                  <Text
                     style={{
                        textAlign: "center",
                        fontFamily: "Poppins_300Light",
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
                     fontFamily: "Poppins_500Medium",
                     //  color:theme.colors.secondary,
                     fontSize: 15,
                  }}>
                  {user?.totalPosts}
               </Text>
               <Button>
                  <Text
                     style={{
                        // fontWeight: "bold",
                        textAlign: "center",
                        fontFamily: "Poppins_300Light",
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
                     fontFamily: "Poppins_500Medium",
                     // color:theme.colors.secondary,
                     fontSize: 15,
                  }}>
                  {user?.totalLikes}
               </Text>
               <Button>
                  <Text
                     style={{
                        // fontWeight: "bold",
                        textAlign: "center",
                        fontFamily: "Poppins_300Light",
                        color: theme.colors.secondary,
                        fontSize: 13,
                     }}>
                     Likes
                  </Text>
               </Button>
            </View>
         </View>
         <View
            style={{
               flex: 1,
               flexDirection: "row",
               justifyContent: "center",
               marginHorizontal: 10,
               gap: 4,
            }}>
            <Button
               loading={loading}
               disabled={loading}
               labelStyle={{ color: theme.colors.primary }}
               onPress={handleFollow}
               style={{ flex: 1, borderColor: theme.colors.primary }}
               mode={followed ? "outlined" : "contained-tonal"}>
               {followed ? "unfollow" : "follow"}
            </Button>
            <Button
               mode="contained"
               style={{ flex: 2 }}
               onPress={() =>
                  navigation.navigate("ChatScreen", {
                     user: user?.personal as User,
                     roomId,
                  })
               }>
               <AntDesign name="message1" /> message
            </Button>
         </View>
         <View style={{ alignItems: "center", marginBottom: 5 }}>
            <ProfileNavComponent user={user?.personal} />
         </View>
         {!posts && (
            <ScrollView>
               <LoadingBlogComponent />
               <LoadingBlogComponent />
               <LoadingBlogComponent />
            </ScrollView>
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

export default UserProfileScreen;

const styles = StyleSheet.create({
   container: {
      paddingTop: 20,
      flex: 1,
      alignItems: "center",
      // justifyContent: "center",
      fontFamily: "Poppins_300Light",
   },
   mediaContainer: {
      // display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      gap: 2,
      marginTop: 10,
      marginBottom: 15,
   },
   profileImage: {
      width: 100,
      height: 100,
      borderRadius: 100,
      borderWidth: 4,
   },
});
