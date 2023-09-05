import { StyleSheet, Text, View, Dimensions, Image, Alert } from "react-native";
import React, { useState, useEffect, useReducer } from "react";
import ImagesViewer from "../ImagesViewer";
import VideoPlayer from "../VideoPlayer";
import TextViewer from "../TextViewer";

import {
   TextInput,
   useTheme,
   Button,
   IconButton,
   Avatar,
   Divider,
   Modal,
} from "react-native-paper";
import {
   AntDesign,
   Entypo,
   FontAwesome,
   MaterialCommunityIcons,
   Feather,
   Ionicons,
   SimpleLineIcons,
   MaterialIcons,
} from "@expo/vector-icons";
import axios from "axios";
import UpdatePostForm from "./UpdatePostForm";
import { Pressable } from "react-native";
import TextEllipse from "../TextEllipse";
import { useCurrentUser } from "../../utils/CustomHooks";
import LikesComponent from "../LikesComponent";
import moment from "moment";
import config from "../../aws-config";
import { Skeleton } from "@rneui/themed";
import { useWindowDimensions } from "react-native";
import HTML from "react-native-render-html";
import { useNavigation } from "@react-navigation/native";
import { dateAgo } from "../../utils/util";


type BlogComponentProps = {
   blog: Blog;
   commentsCount: number;
   likesCount: number;
   sharesCount: number;
   createdBy: User;
   ownedBy: User;
   liked: boolean;
};

const BlogComponent = (props: BlogComponentProps) => {
   const currentUser = useCurrentUser();
   const [openModal, setOpenModal] = useState<boolean>(false);
   const [openShareModal, setOpenShareModal] = useState<boolean>(false);
   const [commentsCount, setCommentsCount] = useState<number>(0);
   const [likesCount, setLikesCount] = useState<number>(0);
   const [sharesCount, setSharesCount] = useState<number>(0);
   const [liked, setLiked] = useState<boolean>(false);
   const [createdBy, setCreatedBy] = useState<User | null>(null);
   const [shared, setShared] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(false);
   const [loadingShare, setLoadingShare] = useState<boolean>(false);
   const theme = useTheme();
   const [reloadCLS, setRelaodCLS] = useState<number>(0);
   const { width } = useWindowDimensions();
   const navigation = useNavigation<any>();

   const source = {
      html: `
    <p style='text-align:center;'>
      Hello World!
    </p>`,
   };

   useEffect(() => {
      setLiked(props.liked);
      setSharesCount(props.sharesCount);
      setLikesCount(props.likesCount);
      setCommentsCount(props.commentsCount);
      setCreatedBy(props.createdBy);
   }, []);

   const gotoUserProfile = () => {
      if (currentUser?.userId === createdBy?.userId) {
         navigation.navigate("ProfileScreen", { userId: createdBy?.userId });
      } else {
         navigation.navigate("UserProfileScreen", {
            userId: createdBy?.userId,
         });
      }
   };

   const handleLike = async (blogId: string) => {
      console.log("Like function runnning...");
      console.log(blogId);
      try {
         setLoading(true);
         let activeUserId = currentUser?.userId;
         let { data, status } = await axios.put(
            `http://192.168.1.93:6000/blogs/${blogId}/likes/`,
            { userId: activeUserId },
            { headers: { Authorization: `Bearer ${currentUser?.token}` } }
         );
         if (status === 202) {
            let { liked, likesCount: _likesCount } = data.data;
            console.log(data.data);
            setLiked(liked);
            setLikesCount(_likesCount);

            // Alert.alert("Success", data.message);
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
            "http://192.168.1.93:6000/blogs/",
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

   if (!props) {
      return (
         <View>
            <View
               style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
               <Skeleton circle width={40} height={40} />
            </View>
            <View>
               <Skeleton width={350} height={400} />
            </View>
         </View>
      );
   }

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
                  backgroundColor: "#00000068",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 4,
               }}>
               <View
                  style={{
                     backgroundColor: theme.colors.background,
                     padding: 10,
                     width: width - 20,
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
         <Modal visible={openModal}>
            <View
               style={{
                  flex: 1,
                  backgroundColor: "#00000068",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 4,
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
                  <Avatar.Image
                     size={45}
                     source={{ uri: createdBy.profileImage }}
                  />
                  {/* <Image
                     style={styles.profileImage}
                     
                  /> */}
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
                  {currentUser?.userId == props.blog?.userId && (
                     <View>
                        <Button mode="text" onPress={() => setOpenModal(true)}>
                           <SimpleLineIcons name="options-vertical" />
                        </Button>
                     </View>
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
                  style={{
                     textAlignVertical: "center",
                     color: theme.colors.secondary,
                     fontFamily: "Poppins_300Light",
                     fontSize: 12,
                  }}>
                  {moment(props.blog.createdAt).fromNow()}
               </Text>
            </View>

            {props.blog.images && <ImagesViewer images={props.blog.images} />}
            {/* {props?.video && <VideoPlayer video={props?.video}/>} */}
         </View>

         {props.blog.title && (
            <Text style={styles.title}>{props.blog?.title}</Text>
         )}

         {props.blog?.text && (
            <View style={{ paddingHorizontal: 8 }}>
               <HTML
                  contentWidth={width}
                  baseStyle={{ fontFamily: "Poppins_300Light" }}
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
            <View
               style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
               }}>
               <View
                  style={{
                     flex: 1,
                     flexDirection: "row",
                     alignItems: "center",
                     justifyContent: "center",
                  }}>
                  <Text
                     style={{
                        fontFamily: "Poppins_300Light",
                        fontSize: 12,
                        marginHorizontal: 1,
                     }}>
                     {likesCount}
                  </Text>
                  <Text
                     style={{
                        fontFamily: "Poppins_300Light",
                        fontSize: 12,
                        marginHorizontal: 2,
                     }}>
                     Likes
                  </Text>
               </View>

               <View
                  style={{
                     flex: 1,
                     flexDirection: "row",
                     alignItems: "center",
                     justifyContent: "center",
                  }}>
                  <Text
                     style={{
                        fontFamily: "Poppins_300Light",
                        fontSize: 12,
                        marginHorizontal: 1,
                     }}>
                     {commentsCount}
                  </Text>
                  <Text
                     style={{
                        fontFamily: "Poppins_300Light",
                        fontSize: 12,
                        marginHorizontal: 2,
                     }}>
                     Comments
                  </Text>
               </View>
               <View
                  style={{
                     flex: 1,
                     flexDirection: "row",
                     alignItems: "center",
                     justifyContent: "center",
                  }}>
                  <Text
                     style={{
                        fontFamily: "Poppins_300Light",
                        fontSize: 12,
                        marginHorizontal: 1,
                     }}>
                     {sharesCount}
                  </Text>
                  <Text
                     style={{
                        fontFamily: "Poppins_300Light",
                        fontSize: 12,
                        marginHorizontal: 2,
                     }}>
                     Shares
                  </Text>
               </View>
            </View>
            <Divider style={{ width: width - 40, alignSelf: "center" }} />
            <View style={styles.likeCommentAmountCon}>
               <Button
                  disabled={loading}
                  onPress={() => handleLike(props.blog.blogId)}
                  textColor={theme.colors.secondary}
                  style={{
                     backgroundColor: theme.colors.inverseOnSurface,
                     flex: 1,
                  }}>
                  <Ionicons
                     size={20}
                     color={theme.colors.secondary}
                     name={liked ? "heart-sharp" : "heart-outline"}
                  />
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
                     backgroundColor: theme.colors.inverseOnSurface,
                     flex: 1,
                  }}>
                  <MaterialCommunityIcons
                     name="comment-outline"
                     size={20}
                     color={theme.colors.secondary}
                  />
                  {/* <Ionicons
                     size={20}
                     color={theme.colors.secondary}
                     name="chatbox-outline"
                  /> */}
               </Button>
               <Button
                  onPress={() => setOpenShareModal(true)}
                  textColor={theme.colors.secondary}
                  style={{
                     backgroundColor: theme.colors.inverseOnSurface,
                     flex: 1,
                  }}>
                  <MaterialCommunityIcons size={25} name="share-outline" />
               </Button>
            </View>
         </View>
      </View>
   );
};

export default React.memo(BlogComponent);

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
      gap: 14,
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
