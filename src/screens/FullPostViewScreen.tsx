import {
   StyleSheet,
   Text,
   View,
   Modal,
   Dimensions,
   Image,
   Alert,
   ScrollView,
   Pressable,
   KeyboardAvoidingView,
   TextInput,
   useWindowDimensions,
} from "react-native";
import React, { useState, useEffect, useReducer, useRef } from "react";
import ImagesViewer from "../components/ImagesViewer";
import VideoPlayer from "../components/VideoPlayer";
import TextViewer from "../components/TextViewer";
import Comments from "../components/MediaPosts/Comments";

import {
   useTheme,
   Button,
   IconButton,
   Divider,
   Avatar,
} from "react-native-paper";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import {
   AntDesign,
   Entypo,
   FontAwesome,
   MaterialCommunityIcons,
   Feather,
   Ionicons,
   EvilIcons,
   SimpleLineIcons,
   MaterialIcons,
} from "@expo/vector-icons";
import axios from "axios";
import { useCurrentUser } from "../utils/CustomHooks";
import LikesComponent from "../components/LikesComponent";
import moment from "moment";
import HTML from "react-native-render-html";
import { LoadingBlogComponent } from "../components/MediaPosts/LoadingComponents";
import TextEllipse from "../components/TextEllipse";
import { dateAgo } from "../utils/util";
import { useSelector } from "react-redux";

type FullBlogComponentProps = { navigation: any; route: any };

const FullBlogComponent = ({ navigation, route }: FullBlogComponentProps) => {
   const currentUser = useCurrentUser();
   const [openModal, setOpenModal] = useState<boolean>(false);
   const [openShareModal, setOpenShareModal] = useState<boolean>(false);
   const [commentsCount, setCommentsCount] = useState<number>(0);
   const [blog, setBlogs] = useState<Blog | null>(null);
   const [likesCount, setLikesCount] = useState<number>(0);
   const [sharesCount, setSharesCount] = useState<number>(0);
   const [liked, setLiked] = useState<boolean>(false);
   const [createdBy, setCreatedBy] = useState<User | null>(null);
   const [shared, setShared] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(false);
   const [loadingShare, setLoadingShare] = useState<boolean>(false);
   const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
   const { socket } = useSelector((state: any) => state.rootReducer);
   const [lastSeen, setLastSeen] = useState<"online" | any>("online");
   const theme = useTheme();
   const { width } = useWindowDimensions();
   let inputRef = useRef<TextInput>(null);

   useEffect(() => {
      if (createdBy) {
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
   }, [socket, createdBy]);

   useEffect(
      function () {
         let fetchData = async () => {
            let activeUserId = currentUser?.userId;
            let blogId = route.params.blogId;
            console.log("blogId", blogId);
            console.log("blog", route.params);
            // setBlogs(route.params)
            try {
               let { data, status } = await axios.get(
                  `http://192.168.1.98:6000/blogs/${blogId}`,
                  { headers: { Authorization: `Bearer ${currentUser?.token}` } }
               );
               if (status === 200) {
                  console.log(data.data);
                  let {
                     createdBy,
                     blog,
                     liked,
                     likesCount,
                     sharesCount,
                     commentsCount,
                  } = data.data;
                  setCreatedBy(createdBy);
                  setLiked(liked);
                  setLikesCount(likesCount);
                  setSharesCount(sharesCount);
                  setCommentsCount(commentsCount);
                  setBlogs(blog);
                  setLastSeen(createdBy.lastSeenStatus);

                  // Alert.alert("Success",data.message)
               } else {
                  Alert.alert("Failed 1", data.message);
               }
            } catch (err) {
               Alert.alert("Failed 2", String(err));
            }
         };
         fetchData();
      },
      [currentUser]
   );

   // const toggleEmojiPicker = () => {
   //    setShowEmojiPicker(!showEmojiPicker);
   // };

   // const handleEmojiSelect = (emoji: any) => {
   //    setTextValue(textValue + emoji);
   // };

   const gotoUserProfile = () => {
      if (currentUser?.userId === createdBy?.userId) {
         navigation.navigate("ProfileScreen", { userId: createdBy?.userId });
      } else {
         navigation.navigate("UserProfileScreen", {
            userId: createdBy?.userId,
         });
      }
   };

   const handleShareBlog = async () => {
      let activeUserId = currentUser?.userId;
      setLoadingShare(true);
      setShared(false);
      // let images = props.blog.images?.map(image => image?.trimEnd())
      let blogObj = {
         title: blog?.title,
         images: JSON.parse(String(blog?.images)),
         video: blog?.video,
         text: blog?.text,
         fromUserId: blog?.userId,
         fromblogId: blog?.blogId,
         shared: true,
      };
      console.log(blogObj);
      try {
         let response = await axios.post(
            "http://192.168.1.98:6000/blogs/",
            blogObj
         );
         if (response.status === 201) {
            console.log(response.data);
            setLoadingShare(false);
            setShared(true);
            setSharesCount((prev) => prev + 1);
         } else {
            setLoadingShare(false);
            Alert.alert("Failed", "blog Failed");
         }
      } catch (err) {
         setLoadingShare(false);
         console.log(err);
      }

      // console.log(blogState);
   };

   const handleLike = async (blogId: string) => {
      console.log(blogId);
      try {
         setLoading(true);
         let activeUserId = currentUser?.userId;
         let { data, status } = await axios.put(
            `http://192.168.1.98:6000/blogs/${blogId}/likes/`,
            { userId: activeUserId },
            { headers: { Authorization: `Bearer ${currentUser?.token}` } }
         );
         if (status === 202) {
            let { liked, likesCount: numberOfLikes } = data.data;
            setLiked(liked);
            setLikesCount(numberOfLikes);

            Alert.alert("Success", data.message);
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

   const toggleEmojiPicker = () => {
      setShowEmojiPicker(!showEmojiPicker);
   };

   if (!blog) {
      return (
         <ScrollView>
            <LoadingBlogComponent />
         </ScrollView>
      );
   }

   return (
      <View>
         <ScrollView style={styles.blogContainer}>
            <Modal visible={openModal}>
               <View
                  style={{
                     flex: 1,
                     backgroundColor: "#ffffff88",
                     justifyContent: "center",
                     alignItems: "center",
                  }}>
                  <View
                     style={{
                        backgroundColor: "#ffffff",
                        padding: 5,
                        borderRadius: 4,
                     }}>
                     <Button onPress={() => setOpenModal(false)}>Back</Button>
                     <Text>Comment Editor</Text>
                  </View>
               </View>
            </Modal>
            {createdBy && (
               <View
                  style={{
                     flexDirection: "row",
                     alignItems: "center",
                     padding: 8,
                  }}>
                  <Pressable onPress={gotoUserProfile}>
                     <View style={{ position: "relative" }}>
                        <Avatar.Image
                           size={35}
                           source={{ uri: "https://picsum.photos/200/300" }}
                        />
                        {lastSeen === "online" && (
                           <View
                              style={{
                                 width: 17,
                                 height: 17,
                                 borderRadius: 8,
                                 backgroundColor: "#fff",
                                 position: "absolute",
                                 bottom: -2,
                                 right: -2,
                                 zIndex: 10,
                                 justifyContent: "center",
                                 alignItems: "center",
                              }}>
                              <View
                                 style={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: 8,
                                    backgroundColor: "#11a100",
                                 }}></View>
                           </View>
                        )}
                     </View>
                  </Pressable>
                  <TextEllipse
                     style={{
                        fontFamily: "Poppins_400Regular",
                        margin: 5,
                        color: theme.colors.secondary,
                        fontSize: 12,
                     }}
                     textLength={23}
                     text={createdBy.fullName}
                  />
                  {createdBy.verificationRank && (
                     <MaterialIcons
                        size={14}
                        color={
                           createdBy.verificationRank === "low"
                              ? "orange"
                              : createdBy.verificationRank === "medium"
                              ? "green"
                              : "blue"
                        }
                        name="verified"
                     />
                  )}
                  <View
                     style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                        marginBottom: 2,
                        paddingHorizontal: 0,
                        borderRadius: 3,
                     }}>
                     {currentUser?.userId == blog?.userId && (
                        <View>
                           <SimpleLineIcons
                              onPress={() => setOpenModal(false)}
                              name="options-vertical"
                           />
                        </View>
                     )}
                  </View>
               </View>
            )}

            {blog.images && <ImagesViewer images={blog.images} />}
            {/* {props.blog.images && <SliderBox images={props.blog.images} />} */}
            {blog.video && <VideoPlayer video={blog?.video} />}
            {blog?.title && <Text style={styles.title}>{blog?.title}</Text>}

            {blog?.text && (
               <View style={{ paddingHorizontal: 8 }}>
                  <HTML
                     contentWidth={width}
                     baseStyle={{ fontFamily: "Poppins_300Light" }}
                     systemFonts={["Poppins_300Light", "sans-serif"]}
                     source={{ html: blog.text }}
                  />
               </View>
            )}
            <View style={{ padding: 5, marginBottom: 10 }}>
               <Comments
                  _likesCount={likesCount}
                  _commentsCount={commentsCount}
                  _liked={liked}
                  userId={blog?.userId}
                  blogId={blog.blogId}
               />
            </View>
         </ScrollView>
      </View>
   );
};

export default FullBlogComponent;

const styles = StyleSheet.create({
   blogContainer: {
      backgroundColor: "#ffffff",
      // marginHorizontal:6,
      marginTop: 3,
      borderRadius: 4,
      paddingTop: 10,
      borderWidth: 1,
      borderColor: "#f3f3f3",
      // paddingBottom:20,
      // marginBottom:30
   },
   commentBox: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 15,
   },
   title: {
      fontFamily: "Poppins_500Medium",
      marginHorizontal: 10,
      marginTop: 6,
   },
   commentInputField: {
      flex: 1,
      marginHorizontal: 5,
   },
   likeCommentAmountCon: {
      flex: 1,
      flexDirection: "row",
      gap: 14,
      paddingVertical: 5,
      justifyContent: "space-around",
      paddingHorizontal: 8,

      // justifyContent:'center',
   },
   commentAmountText: {
      fontFamily: "Poppins_200ExtraLight",
      fontSize: 16,
   },
   profileImage: {
      width: 35,
      height: 35,
      borderRadius: 20,
   },
});
