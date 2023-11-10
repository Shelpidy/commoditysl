import React, { useEffect, useRef, useState } from "react";
import {
   Alert,
   Modal,
   Pressable,
   ScrollView,
   StyleSheet,
   TextInput,
   View,
   useWindowDimensions
} from "react-native";
import Comments from "../components/MediaPosts/Comments";
import VideoPlayer from "../components/VideoPlayer";

import {
   MaterialIcons,
   SimpleLineIcons
} from "@expo/vector-icons";
import axios from "axios";
import moment from "moment";
import {
   Avatar,
   Button,
   Text,
   useTheme
} from "react-native-paper";
import HTML from "react-native-render-html";
import { useSelector } from "react-redux";
import ImageCarousel from "../components/MediaPosts/ImageCarousel";
import { LoadingBlogComponent } from "../components/MediaPosts/LoadingComponents";
import { useCurrentUser } from "../utils/CustomHooks";

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
   const [reposted, setReposted] = useState<boolean>(false);
   const [createdBy, setCreatedBy] = useState<User | null>(null);
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
      ()=>{
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
                     reposted,
                     commentsCount,
                  } = data.data;
                  setCreatedBy(createdBy);
                  setLiked(liked);
                  setReposted(reposted)
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
         <ScrollView style={[styles.blogContainer,{backgroundColor:theme.colors.background}]}>
            <Modal visible={openModal}>
               <View
                  style={{
                     flex: 1,
                     backgroundColor:theme.colors.background,
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
                  <Text
                     variant="titleSmall"
                     numberOfLines={1}
                     style={{
                        textAlign: "center",
                        marginHorizontal: 3,
                        // fontFamily: "Poppins_500Medium",
                        color: theme.colors.secondary,
                     }}>
                     {createdBy.fullName}
                  </Text>
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

            {blog.images && <ImageCarousel images={blog.images} />}
            {/* {props.blog.images && <SliderBox images={props.blog.images} />} */}
            {blog.video && <VideoPlayer video={blog?.video} />}
            {blog?.title && <Text variant="titleMedium" style={styles.title}>{blog?.title}</Text>}

            {blog?.text && (
               <View style={{ paddingHorizontal: 8 }}>
                  <HTML
                     contentWidth={width}
                     
                     baseStyle={{
                        fontFamily: "Poppins_400Regular",
                        fontSize: 14,
                     }}
                     systemFonts={["Poppins_400Regular", "sans-serif"]}
                     source={{ html: blog.text }}
                  />
               </View>
            )}
            <View style={{ padding: 5, marginBottom: 10 }}>
               <Comments
                  _likesCount={likesCount}
                  _commentsCount={commentsCount}
                  _liked={liked}
                  _reposted = {reposted}
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
      marginTop: 3,
      paddingTop: 10,
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
