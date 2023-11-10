import React, { useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, View } from "react-native";
import ImagesViewer from "../ImagesViewer";
import VideoPlayer from "../VideoPlayer";
// import {SliderBox} from "react-native-image-slider-box"

import {
   AntDesign,
   Feather,
   Ionicons,
   MaterialCommunityIcons,
   MaterialIcons,
   SimpleLineIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import moment from "moment";
import { Pressable, useWindowDimensions } from "react-native";
import { Avatar, Button, Text, useTheme } from "react-native-paper";
import HTML from "react-native-render-html";
import { useSelector } from "react-redux";
import { useCurrentUser } from "../../utils/CustomHooks";
import LikesComponent from "../LikesComponent";
import UpdatePostForm from "./UpdatePostForm";

type NewBlogComponentProps = {
   blog: Blog;
   commentsCount: number;
   likesCount: number;
   sharesCount: number;
   createdBy: User;
   ownedBy: User;
   liked: boolean;
};

const NewBlogComponent = (props: NewBlogComponentProps) => {
   const currentUser = useCurrentUser();
   const [openModal, setOpenModal] = useState<boolean>(false);
   const [openShareModal, setOpenShareModal] = useState<boolean>(false);
   const [commentsCount, setCommentsCount] = useState<number>(
      props.commentsCount
   );
   const [likesCount, setLikesCount] = useState<number>(props.likesCount);
   const [sharesCount, setSharesCount] = useState<number>(props.sharesCount);
   const [liked, setLiked] = useState<boolean>(props.liked);
   const [createdBy, setCreatedBy] = useState<User | null>(props.createdBy);
   const [shared, setShared] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(false);
   const [loadingShare, setLoadingShare] = useState<boolean>(false);
   const [lastSeen, setLastSeen] = useState<"online" | any>(
      props.createdBy.lastSeenStatus
   );
   const theme = useTheme();
   const [reloadCLS, setRelaodCLS] = useState<number>(0);
   const { socket } = useSelector((state: any) => state.rootReducer);
   const { width } = useWindowDimensions();
   const navigation = useNavigation<any>();

   // useEffect(() => {
   //    setLiked(props.liked);
   //    setSharesCount(props.sharesCount);
   //    setLikesCount(props.likesCount);
   //    setCommentsCount(props.commentsCount);
   //    setCreatedBy(props.createdBy);
   //    setLastSeen(props.createdBy.lastSeenStatus);
   // }, [props]);

   const gotoUserProfile = () => {
      if (currentUser?.userId === createdBy?.userId) {
         navigation.navigate("ProfileScreen", { userId: createdBy?.userId });
      } else {
         navigation.navigate("UserProfileScreen", {
            userId: createdBy?.userId,
         });
      }
   };

   useEffect(() => {
      if (createdBy) {
         console.log("Socket is running", String(createdBy?.userId));
         socket.on(String(createdBy?.userId), (data: any) => {
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

   const handleLike = async (blogId: string) => {
      console.log("Like function runnning...");
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
            let { liked, likesCount: _likesCount } = data.data;
            console.log(data.data);
            setLiked(liked);
            setLikesCount(_likesCount);
         } else {
            Alert.alert("Liked Failed", data.message);
         }
         setLoading(false);
      } catch (err) {
         console.log(err);
         Alert.alert("Failed", "Like failed");
         setLoading(false);
      }
   };

   const handleSharedPost = async () => {
      setLoadingShare(true);
      setShared(false);
      // let images = props.blog.images?.map(image => image?.trimEnd())
      let postObj = {
         title: props.blog.title,
         images: JSON.parse(String(props.blog.images)),
         video: props.blog.video,
         text: props.blog.text,
         fromUserId: props.blog.userId,
         fromblogId: props.blog.blogId,
         shared: true,
      };
      console.log(postObj);
      try {
         let response = await axios.post(
            "http://192.168.1.98:6000/blogs/",
            postObj
         );
         if (response.status === 201) {
            console.log(response.data);

            setLoadingShare(false);
            setShared(true);
            setRelaodCLS(reloadCLS + 1);
            // Alert.alert("Successful", "Post successfully");
         } else {
            setLoadingShare(false);
            Alert.alert("Failed", "Post Failed");
         }
      } catch (err) {
         setLoadingShare(false);
         console.log(err);
      }

      // console.log(postState);
   };

   return (
      <View
         style={[
            styles.postContainer,
            { backgroundColor: theme.colors.background },
         ]}>
         <Modal visible={openShareModal}>
            <View
               style={{
                  flex: 1,
                  backgroundColor: theme.colors.background,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 4,
               }}>
               <View
                  style={{
                     backgroundColor: theme.colors.background,
                     padding: 10,
                     width: width * 0.95,
                     borderRadius: 5,
                     gap: 20,
                  }}>
                  {/* <IconButton name='plus'/> */}
                  <Button mode="text" onPress={() => setOpenShareModal(false)}>
                     <Feather size={26} name="x" />
                  </Button>
                  <Button
                     style={{
                        backgroundColor: shared
                           ? "green"
                           : theme.colors.primary,
                     }}
                     disabled={loadingShare}
                     loading={loadingShare}
                     onPress={handleSharedPost}
                     mode="contained">
                     <Ionicons />
                     <Ionicons
                        style={{ marginHorizontal: 4 }}
                        size={18}
                        name={shared ? "checkmark" : "share-social-outline"}
                     />
                     <Text>
                        {shared
                           ? "Shared Post Successfully"
                           : "Continue to share as a post"}
                     </Text>
                  </Button>
               </View>
            </View>
         </Modal>
         <Modal
            visible={openModal}
            style={{
               position: "absolute",
               top: 0,
               backgroundColor: "red",
               zIndex: 100,
               flex: 1,
            }}>
            <View
               style={{
                  flex: 1,
                  backgroundColor: theme.colors.background,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 4,
                  zIndex: 100,
               }}>
               <View
                  style={{
                     backgroundColor: theme.colors.background,
                     paddingTop: 10,
                  }}>
                  <View
                     style={{
                        width: "100%",
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                     }}>
                     <Button onPress={() => setOpenModal(false)}>
                        <AntDesign size={18} name="close" />
                     </Button>
                  </View>
                  <UpdatePostForm {...props.blog} />
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
                  variant="titleMedium"
                  numberOfLines={1}
                  style={{
                     textAlign: "center",
                     marginHorizontal: 3,
                     // fontFamily: "Poppins_500Medium",
                     color: theme.colors.secondary,
                  }}>
                  {createdBy.fullName}
               </Text>
               {/* <TextEllipse
                  style={{
                     fontFamily: "Poppins_400Regular",
                     margin: 5,
                     color: theme.colors.secondary,
                     fontSize: 12,
                  }}
                  textLength={23}
                  text={createdBy.fullName}
               /> */}
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
                  {currentUser?.userId == props.blog?.userId && (
                     <Pressable onPress={() => setOpenModal(true)}>
                        <SimpleLineIcons name="options-vertical" />
                     </Pressable>
                  )}
               </View>
            </View>
         )}
         <View>
            <View
               style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 8,
                  paddingBottom: 8,
                  gap: 4,
               }}>
               {/* <Text style={{textAlignVertical:"center",color:theme.colors.secondary,fontFamily:"Poppins_300Light",marginRight:2}}>posted</Text> */}
               <AntDesign color={theme.colors.secondary} name="clockcircleo" />
               <Text
                  variant="bodySmall"
                  style={{
                     textAlignVertical: "center",
                     color: theme.colors.secondary,
                     fontFamily: "Poppins_300Light",
                  }}>
                  {moment(props.blog.createdAt).fromNow()}
               </Text>
            </View>
         </View>

         {props.blog.images && <ImagesViewer images={props.blog.images} />}
         {/* {props.blog.images && <SliderBox images={props.blog.images} />} */}
         {props?.blog.video && <VideoPlayer video={props.blog?.video} />}

         {props.blog.title && (
            <Text style={styles.title}>{props.blog?.title}</Text>
         )}

         {props.blog?.text && (
            <View style={{ paddingHorizontal: 8 }}>
               <HTML
                  contentWidth={width}
                  baseStyle={{ fontFamily: "Poppins_300Light", fontSize: 15 }}
                  systemFonts={["Poppins_300Light", "sans-serif"]}
                  source={{ html: props.blog.text }}
               />
            </View>
         )}
         <View style={{ marginBottom: 1 }}>
            <View style={{ paddingHorizontal: 8, marginVertical: 4 }}>
               <Text>
                  <LikesComponent
                     blogId={props.blog.blogId}
                     numberOfLikes={likesCount}
                  />
               </Text>
            </View>
            <View style={styles.likeCommentAmountCon}>
               <Button
                  disabled={loading}
                  onPress={() => handleLike(props.blog.blogId)}
                  textColor={theme.colors.secondary}
                  style={{
                     backgroundColor: theme.colors.background,
                     flex: 1,
                     justifyContent: "center",
                     alignItems: "center",
                  }}>
                  <Ionicons
                     size={18}
                     color={theme.colors.secondary}
                     name={liked ? "heart-sharp" : "heart-outline"}
                  />
                  <Text style={{ fontSize: 16, fontWeight: "300" }}>
                     {likesCount}
                  </Text>
               </Button>

               <Button
                  contentStyle={{
                     flex: 1,
                     alignItems: "center",
                     flexDirection: "row",
                  }}
                  onPress={() =>
                     navigation.navigate("FullPostViewScreen", {
                        ...props.blog,
                     })
                  }
                  textColor={theme.colors.secondary}
                  style={{
                     backgroundColor: theme.colors.background,
                     flex: 1,
                  }}>
                  <MaterialCommunityIcons
                     name="comment-outline"
                     size={16}
                     color={theme.colors.secondary}
                  />
                  <Text style={{ fontSize: 16, fontWeight: "300" }}>
                     {commentsCount}
                  </Text>
               </Button>
               <Button
                  onPress={() => setOpenShareModal(true)}
                  textColor={theme.colors.secondary}
                  style={{
                     backgroundColor: theme.colors.background,
                     flex: 1,
                  }}>
                  <AntDesign size={18} name="retweet" />
                  <Text style={{ fontSize: 16, fontWeight: "300" }}>
                     {sharesCount}
                  </Text>
               </Button>
               <Button
                  onPress={() => setOpenShareModal(true)}
                  textColor={theme.colors.secondary}
                  style={{
                     backgroundColor: theme.colors.background,
                     flex: 1,
                  }}>
                  <Ionicons size={18} name="share-outline" />
                  <Text style={{ fontSize: 16, fontWeight: "300" }}>
                     {sharesCount}
                  </Text>
               </Button>
            </View>
         </View>
      </View>
   );
};

export default NewBlogComponent;

const styles = StyleSheet.create({
   postContainer: {
      marginVertical: 3,
      paddingVertical: 10,
      paddingHorizontal: 5,
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
      gap: 10,
      paddingVertical: 5,
      paddingHorizontal: 8,

      // justifyContent:'center',
   },
   commentAmountText: {
      fontFamily: "Poppins_200ExtraLight",
      fontSize: 12,
   },
   profileImage: {
      width: 35,
      height: 35,
      borderRadius: 20,
   },
});
