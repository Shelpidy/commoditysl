import {
   MaterialIcons
} from "@expo/vector-icons";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
   Alert,
   Dimensions,
   // TextInput,
   FlatList,
   ScrollView,
   StyleSheet,
   View,
} from "react-native";
import {
   ActivityIndicator,
   Avatar,
   Button,
   Text,
   TextInput,
   useTheme
} from "react-native-paper";
import { useSelector } from "react-redux";
import BlogComponent from "../components/MediaPosts/BlogComponent";
import {
   LoadingBlogComponent,
   LoadingProfileComponent,
} from "../components/MediaPosts/LoadingComponents";
import ProfileNavComponent from "../components/ProfileNavComponent";
import SearchForm from "../components/SearchForm";
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
   reposted:boolean
};

const ProfileScreen = ({ navigation, route }: any) => {
   const theme = useTheme();
   const [posts, setPosts] = useState<BlogComponent[] | null>(null);
   const [allPosts, setAllPosts] = useState<BlogComponent[]>([]);
   const [user, setUser] = useState<any>(null);
   const page = React.useRef<number>(1);
   const [numberOfBlogsPerPage, setNumberOfBlogsPerPage] = useState<number>(5);
   const [loading, setLoading] = useState<boolean>(false);
   const [hasMore, setHasMore] = useState(true);
   const [loadingFetch, setLoadingFetch] = useState<boolean>(false);
   const [lastSeen, setLastSeen] = useState<"online" | any>("");
   const [searchValue, setSearchValue] = useState<string>("");
   const [bio, setBio] = useState<string>("");
   const [showEditBio, setShowEditBio] = useState<boolean>(false);
   const currentUser = useCurrentUser();
   const { socket } = useSelector((state: any) => state.rootReducer);

   const searchPosts = (_token: string) => {
      setSearchValue(_token);
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
               `http://192.168.1.98:6000/blogs/users/${userId}?pageNumber=${pageNumber}&numberOfRecords=${numberOfBlogsPerPage}`,
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
               if (data.length < numberOfBlogsPerPage) {
                  setHasMore(false);
               }
               setLoadingFetch(false);
            } else {
               Alert.alert("Failed", "Error");
            }
            setLoadingFetch(false);
         } catch (err) {
            console.log(err);
            Alert.alert("Failed", "Blog Error");
            setLoadingFetch(false);
         }
      };
      console.log("blogs Reached end");
      if (loadingFetch) {
      } else if (posts && posts.length < numberOfBlogsPerPage) {
      } else {
         fetchData();
      }
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

   const handleEditBio = async () => {};

   // FETCHING USER PROFILE INFO ////

   useEffect(
      function () {
         console.log("Fetching user profile details");
         setLoading(true);
         let _fetchData = async () => {
            // console.log("Fetching user")
            //  let activeUserId = 1
            // if(!route.params.userId) return
            try {
               let { status, data } = await axios.get(
                  `http://192.168.1.98:5000/auth/users/${route.params.userId}`,
                  { headers: { Authorization: `Bearer ${currentUser?.token}` } }
               );
               if (status === 200) {
                  console.log("User----", data.data);
                  setUser(data.data);
                  setBio(data.data.personal.bio);
                  setLastSeen(data.data.personal.lastSeenStatus);
                  // Alert.alert("Success",data.message)
                  setLoading(false);
               } else {
                  Alert.alert("Failed", "My message");
               }
               setLoading(false);
            } catch (err) {
               console.log(err);
               Alert.alert("Failed", "New Error");
               setLoading(false);
            }
         };
         _fetchData();
      },
      [route.params.userId]
   );

   useEffect(
      function () {
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
                  `http://192.168.1.98:6000/blogs/users/${userId}?pageNumber=${pageNumber}&numberOfRecords=${numberOfBlogsPerPage}`,
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
                  if (data.length < numberOfBlogsPerPage) {
                     setHasMore(false);
                  }
                  setLoadingFetch(false);
               } else {
                  Alert.alert("Failed", "Error");
               }
               setLoadingFetch(false);
            } catch (err) {
               console.log(err);
               Alert.alert("Failed", "Blog Error");
               setLoadingFetch(false);
            }
         };
         if (currentUser && route.params.userId) {
            fetchData(1);
         }
      },
      [currentUser, route.params.userId]
   );

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
               style={{
                  flexDirection: "row",
                  gap: 3,
                  alignItems: "center",
                  marginTop: 5,
               }}>
               <Text
                  variant="titleMedium"
                  numberOfLines={1}
                  style={{
                     textAlign: "center",
                     marginHorizontal: 3,
                     marginVertical: 10,
                     // fontFamily: "Poppins_500Medium",
                     color: theme.colors.secondary,
                  }}>
                  {user?.personal?.fullName}
               </Text>
               {user.personal.verificationRank && (
                  <MaterialIcons
                     size={15}
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
                  variant="titleMedium"
                  style={{
                     textAlign: "center",

                     // color: theme.colors.secondary,
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
                     variant="bodyMedium"
                     style={{
                        // fontWeight: "bold",
                        textAlign: "center",
                        // fontFamily: "Poppins_300Light",
                        color: theme.colors.secondary,
                        // fontSize: 13,
                     }}>
                     Followers
                  </Text>
               </Button>
            </View>

            <View style={{ alignItems: "center", margin: 4 }}>
               <Text
                  variant="titleMedium"
                  style={{
                     textAlign: "center",

                     // color: theme.colors.secondary,
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
                     variant="bodyMedium"
                     style={{
                        textAlign: "center",
                        // fontFamily: "Poppins_300Light",
                        color: theme.colors.secondary,
                        //  color:theme.colors.secondary,
                        // fontSize: 13,
                     }}>
                     Following
                  </Text>
               </Button>
            </View>

            <View style={{ alignItems: "center", margin: 4 }}>
               <Text
                  variant="titleMedium"
                  style={{
                     textAlign: "center",

                     // color: theme.colors.secondary,
                  }}>
                  {user?.totalPosts}
               </Text>
               <Button mode="text">
                 <Text
                     variant="bodyMedium"
                     style={{
                        textAlign: "center",
                        // fontFamily: "Poppins_300Light",
                        color: theme.colors.secondary,
                        //  color:theme.colors.secondary,
                        // fontSize: 13,
                     }}>
                     Posts
                  </Text>
               </Button>
            </View>
            <View style={{ alignItems: "center", margin: 4 }}>
               <Text
                  variant="titleMedium"
                  style={{
                     textAlign: "center",

                     // color: theme.colors.secondary,
                  }}>
                  {user?.totalLikes}
               </Text>
               <Button>
                 <Text
                     variant="bodyMedium"
                     style={{
                        textAlign: "center",
                        // fontFamily: "Poppins_300Light",
                        color: theme.colors.secondary,
                        //  color:theme.colors.secondary,
                        // fontSize: 13,
                     }}>
                     Likes
                  </Text>
               </Button>
            </View>
         </View>
         <View
            style={{
               flexDirection: "row",
               justifyContent: "center",
               alignItems: "center",
               gap: 8,
            }}>
            {showEditBio && (
               <View
                  style={{
                     paddingHorizontal: 10,
                     flexDirection: "row",
                     alignItems: "center",
                     justifyContent: "center",
                     gap: 5,
                  }}>
                  <TextInput
                     label="Bio"
                     value={bio}
                     multiline
                     mode="flat"
                     onChangeText={(v) => setBio(v)}
                     style={{
                        width: 0.7 * width,
                     }}
                  />
                  <Button
                     elevation={0}
                     mode="contained"
                     onPress={handleEditBio}>
                     Done
                  </Button>
                  {/* <AntDesign  onPress={handleEditBio} name="checkcircleo" size={30} /> */}
               </View>
            )}
            {user?.personal.bio && !showEditBio && (
               <View
                  style={{
                     alignItems: "center",
                     justifyContent: "center",
                     flexDirection: "row",
                  }}>
                  <Text variant="bodyLarge" style={{ textAlign: "center" }}>
                     {user?.personal.bio}
                  </Text>
                  <Button
                     onPress={()=> setShowEditBio(true)}
                     style={{
                        justifyContent: "center",
                        alignItems: "center",
                     }}
                     icon="pencil"></Button>
               </View>
            )}
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
            <View style={{paddingHorizontal:10}}>
               <SearchForm setSearchValue={(v) => searchPosts(v)} />
 
            </View>
            // <Searchbar style={{marginHorizontal:20}} value={searchValue} onChangeText={searchPosts} placeholder="Search" />
         )}
         {posts && (
            <FlatList
               keyExtractor={(item) => String(item.blog.blogId)}
               data={posts}
               renderItem={({ item, index, separators }) => {
                  return (
                     <BlogComponent
                        // key={String(item.blog.blogId)}
                        {...item}
                     />
                  );
               }}
               onEndReached={handleLoadMore}
               onEndReachedThreshold={0.9}
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
      gap: 4,
      marginTop: 8,
      marginBottom: 5,
   },
   profileImage: {
      width: 100,
      height: 100,
      borderRadius: 100,
      borderWidth: 4,
   },
});
