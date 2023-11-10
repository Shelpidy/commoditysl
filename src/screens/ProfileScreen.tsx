import { MaterialIcons } from "@expo/vector-icons";
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
   IconButton,
   Text,
   TextInput,
   useTheme,
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
import * as ImagePicker from "expo-image-picker";
import {
   getStorage,
   ref,
   uploadBytesResumable,
   getDownloadURL,
   uploadBytes,
} from "firebase/storage";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
   apiKey: "AIzaSyAoNT04_z-qCC4PeIaLXDJcMdpYX5Hvw_I",
   authDomain: "commodity-aca4d.firebaseapp.com",
   projectId: "commodity-aca4d",
   storageBucket: "commodity-aca4d.appspot.com",
   messagingSenderId: "966126498365",
   appId: "1:966126498365:web:fe492c3f15370783813054",
   measurementId: "G-2TCKRYHYB5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const storage = getStorage();

const { width, height } = Dimensions.get("window");

type BlogComponent = {
   blog: Blog;
   commentsCount: number;
   likesCount: number;
   sharesCount: number;
   createdBy: User;
   ownedBy: User;
   liked: boolean;
   reposted: boolean;
};

const ProfileScreen = ({ navigation, route }: any) => {
   const theme = useTheme();
   const [posts, setPosts] = useState<BlogComponent[] | null>(null);
   const [allPosts, setAllPosts] = useState<BlogComponent[]>([]);
   const [user, setUser] = useState<any>(null);
   const page = React.useRef<number>(1);
   const [numberOfBlogsPerPage, setNumberOfBlogsPerPage] = useState<number>(5);
   const [loading, setLoading] = useState<boolean>(false);
   const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
   const [loadingProfileImage, setLoadingProfileImage] =
      useState<boolean>(false);
   const [hasMore, setHasMore] = useState(true);
   const [loadingFetch, setLoadingFetch] = useState<boolean>(false);
   const [lastSeen, setLastSeen] = useState<"online" | any>("");
   const [searchValue, setSearchValue] = useState<string>("");
   const [bio, setBio] = useState<string>("");
   const [profileImage, setProfileImage] = useState<string>("");
   const [showEditBio, setShowEditBio] = useState<boolean>(false);
   const currentUser = useCurrentUser();
   const { socket } = useSelector((state: any) => state.rootReducer);

   const pickImage = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         allowsEditing: true,
         aspect: [4, 3],
         quality: 1,
      });

      if (result.assets) {
         let image = result.assets[0];
         uploadImage(image.uri);
      }
   };

   const uploadImage = async (uri: string) => {
      const storageRef = ref(storage, "ProfileImages/" + uri.split("/").pop());
      const response = await fetch(uri);
      const blob = await response.blob();

      try {
         setLoadingProfileImage(true);
         await uploadBytes(storageRef, blob);
         const url = await getDownloadURL(storageRef);
         console.log("File available at", url);

         let imageData = {
            key: "profileImage",
            value: url,
         };

         let { status, data } = await axios.put(
            `http://192.168.1.98:5000/auth/users/personal`,
            imageData,
            { headers: { Authorization: `Bearer ${currentUser?.token}` } }
         );

         if (status === 202) {
            // Alert.alert("Update Successful","You have successfully updated a comment")
            setProfileImage(data.data.profileImage);
         } else {
            console.log(data);

            Alert.alert("Update Failed", data.message);
         }

         // You can now save the URL to your database or perform other actions
      } catch (error) {
         setLoadingProfileImage(false);
         console.error("Error uploading image: ", error);
      } finally {
         setLoadingProfileImage(false);
      }
   };

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

   const handleEditBio = async () => {
      try {
         setLoadingUpdate(true);
         let bioData = {
            key: "bio",
            value: bio,
         };

         let { status, data } = await axios.put(
            `http://192.168.1.98:5000/auth/users/personal`,
            bioData,
            { headers: { Authorization: `Bearer ${currentUser?.token}` } }
         );

         if (status === 202) {
            // Alert.alert("Update Successful","You have successfully updated a comment")
            setBio(data.data.bio);
            setShowEditBio(false);
         } else {
            console.log(data);
            Alert.alert("Update Failed", data.message);
         }
      } catch (err) {
         console.log(err);

         Alert.alert("Update Failed", String(err));
         setShowEditBio(false);
      } finally {
         setLoadingUpdate(false);
      }
   };

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
                  setProfileImage(data.data.personal.profileImage);
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
                  style={{ position: "relative" }}
                  size={100}
                  source={{ uri: profileImage }}></Avatar.Image>
               {loadingProfileImage && (
                  <View
                     style={{
                        width: "auto",
                        top: 0,
                        height: "auto",
                        borderRadius: 100,
                        backgroundColor: "rgba(255,255,255,0.3)",
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        left: 0,
                        zIndex: 999,
                        justifyContent: "center",
                        alignItems: "center",
                     }}>
                     <ActivityIndicator />
                  </View>
               )}

               <View
                  style={{
                     width: 35,
                     height: 35,
                     borderRadius: 20,
                     backgroundColor: theme.colors.inverseOnSurface,
                     position: "absolute",
                     bottom: 0,
                     right: 3,
                     zIndex: 10,
                     justifyContent: "center",
                     alignItems: "center",
                  }}>
                  <IconButton onPress={pickImage} size={18} icon="camera" />
               </View>
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
                     loading={loadingUpdate}
                     disabled={loadingUpdate}
                     elevation={0}
                     mode="contained"
                     onPress={handleEditBio}>
                     Done
                  </Button>
                  {/* <AntDesign  onPress={handleEditBio} name="checkcircleo" size={30} /> */}
               </View>
            )}
            {bio && !showEditBio && (
               <View
                  style={{
                     // alignItems: "center",
                     justifyContent: "center",
                     flexDirection: "row",
                     width: "70%",
                  }}>
                  <View>
                     <Text variant="bodyLarge" style={{ textAlign: "center" }}>
                        {bio}
                     </Text>
                  </View>
                  <Button
                     onPress={() => setShowEditBio(true)}
                     style={{
                        justifyContent: "center",
                        alignItems: "center",
                     }}
                     icon="pencil">{}</Button>
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
            <View style={{ paddingHorizontal: 10 }}>
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
