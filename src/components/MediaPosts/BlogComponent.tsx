import React, { useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, View } from "react-native";
import VideoPlayer from "../VideoPlayer";
// import {SliderBox} from "react-native-image-slider-box"

import {
   AntDesign,
   Ionicons,
   MaterialCommunityIcons,
   MaterialIcons,
   SimpleLineIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import moment from "moment";
import { Pressable, useWindowDimensions } from "react-native";
import { Avatar, Button, Card, Divider, Text, useTheme } from "react-native-paper";
import HTML from "react-native-render-html";
import { useSelector } from "react-redux";
import { useCurrentUser } from "../../utils/CustomHooks";
import LikesComponent from "../LikesComponent";
import ImageCarousel from "./ImageCarousel";
import UpdatePostForm from "./UpdatePostForm";
import { useToast } from "react-native-toast-notifications";

type BlogComponentProps = {
   blog: Blog;
   commentsCount: number;
   likesCount: number;
   sharesCount: number;
   createdBy: User;
   ownedBy: User;
   liked: boolean;
   reposted: boolean;
};

const BlogComponent = (props: BlogComponentProps) => {
   const currentUser = useCurrentUser();
   const [openModal, setOpenModal] = useState<boolean>(false);
   const [openShareModal, setOpenShareModal] = useState<boolean>(false);
   const [openEdit, setOpenEdit] = useState<boolean>(false);
   const [commentsCount, setCommentsCount] = useState<number>(
      props.commentsCount
   );
   const [likesCount, setLikesCount] = useState<number>(props.likesCount);
   const [sharesCount, setSharesCount] = useState<number>(props.sharesCount);
   const [liked, setLiked] = useState<boolean>(props.liked);
   const [reposted, setReposted] = useState<boolean>(props.reposted);
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
   const [blog, setBlog] = useState<Blog>(props.blog);
   const navigation = useNavigation<any>();
   const [deleted,setDeleted] = useState<boolean>(false)

   const toast = useToast()


   // useEffect(() => {
   //    setLiked(props.liked);
   //    setSharesCount(props.sharesCount);
   //    setLikesCount(props.likesCount);
   //    setCommentsCount(props.commentsCount);
   //    setCreatedBy(props.createdBy);
   //    setLastSeen(props.createdBy.lastSeenStatus);
   // }, [props]);

   const handleUpdateComplete = (blog: Blog) => {
      setBlog(blog);
      setOpenModal(false);
   };

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

   const handleRepost = async () => {
      if (reposted) {
         Alert.alert(
            "Repost Limit Reached",
            "You can only repost once per a post"
         );
         return;
      }
      setLoadingShare(true);

      // let images = props.blog.images?.map(image => image?.trimEnd())
      let postObj = {
         title: props.blog.title,
         images: props.blog.images,
         video: props.blog.video,
         text: props.blog.text,
         fromUserId: props.blog.userId,
         fromBlogId: props.blog.blogId,
         shared: true,
      };
      console.log(postObj);
      try {
         let { data, status } = await axios.post(
            "http://192.168.1.98:6000/blogs/",
            postObj,
            { headers: { Authorization: `Bearer ${currentUser?.token}` } }
         );
         if (status === 201) {
            console.log(data);

            setLoadingShare(false);
            setReposted(true);
            setSharesCount((prev) => prev + 1);
            // setRelaodCLS(reloadCLS + 1);
            // Alert.alert("Successful", "Repost successfully");
         } else {
            setLoadingShare(false);
            Alert.alert("Failed", "Repost Failed");
         }
      } catch (err) {
         setLoadingShare(false);
         console.log({ Error: String(err) });
      }

      // console.log(postState);
   };


   const handleDeleteBlog = async () => {
      setLoading(true);
      try {
     
         let response = await axios.delete(
            `http://192.168.1.98:6000/blogs/${blog.blogId}`,
            { headers: { Authorization: `Bearer ${currentUser?.token}` } }
         );
         if (response.status == 203) {
          
            setOpenModal(false);
            setOpenEdit(false)
            setDeleted(true)
            toast.show("Blog Deleted",{
               type:"normal",
               placement:"top"
            })
        
         } else {
            toast.show("Delete Failed",{
               type:"warning",
               placement:"top"
            })
          
         }
         setLoading(false);
      } catch (err) {
         console.log(err);
         toast.show("Delete Failed",{
            type:"warning",
            placement:"top"
         })
         setLoading(false);
      }
   };

   if(deleted){
      return null
   }

   return (
      <Pressable onPress={()=> setOpenEdit(false)}>
      <View
        
         style={[
            styles.postContainer,
            { backgroundColor: theme.colors.background },
         ]}>
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
                  <UpdatePostForm
                     onUpdateComplete={handleUpdateComplete}
                     blog={blog}
                  />
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
                        source={{ uri: createdBy.profileImage }}
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
                     <Pressable style={{position:"relative"}} onPress={() => setOpenEdit(!openEdit)}>
                        <SimpleLineIcons name="options-vertical" />
                        {
                              openEdit &&
                              <Card style={{position:"absolute",top:-5,right:20,zIndex:2147483649}}>
                              <Button icon='pencil' disabled={loading} onPress={() => setOpenModal(true)}>Edit</Button>
                              <Divider/>
                              <Button icon='delete' disabled={loading} loading={loading} onPress={handleDeleteBlog}>Delete</Button>
                           </Card>
                           }

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
                  paddingBottom: 25,
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
                     width: width,
                  }}>
                  {moment(blog.createdAt).fromNow()}
               </Text>
            </View>
         </View>

         {blog.images && <ImageCarousel images={blog.images} />}
         {/* {props.blog.images && <SliderBox images={props.blog.images} />} */}
         {blog.video && <VideoPlayer video={blog?.video} />}

         {blog.title && (
            <Text style={styles.title} variant="titleMedium">
               {blog?.title}
            </Text>
         )}

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
                     backgroundColor: theme.colors.inverseOnSurface,
                     flex: 1,
                     justifyContent: "center",
                     alignItems: "center",
                  }}>
                  <Ionicons
                     size={18}
                     color={
                        liked ? theme.colors.primary : theme.colors.secondary
                     }
                     name={liked ? "heart-sharp" : "heart-outline"}
                  />
                  <Text> {likesCount}</Text>
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
                     size={16}
                     style={{ marginHorizontal: 2 }}
                     color={theme.colors.secondary}
                  />
                  <Text> {commentsCount}</Text>
               </Button>
               <Button
                  onPress={handleRepost}
                  textColor={
                     reposted ? theme.colors.primary : theme.colors.secondary
                  }
                  style={{
                     backgroundColor: theme.colors.inverseOnSurface,
                     flex: 1,
                  }}>
                  <AntDesign
                     size={18}
                     color={
                        reposted ? theme.colors.primary : theme.colors.secondary
                     }
                     name="retweet"
                  />
                  <Text> {sharesCount}</Text>
               </Button>
               <Button
                  onPress={() => setOpenShareModal(true)}
                  textColor={theme.colors.secondary}
                  style={{
                     backgroundColor: theme.colors.inverseOnSurface,
                     flex: 1,
                  }}>
                  <Ionicons size={18} name="share-outline" />
                  {/* <Text>
                  {" "}{sharesCount}
                  </Text> */}
               </Button>
            </View>
         </View>
      </View>
      </Pressable>
   );
};

export default BlogComponent;

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
      marginHorizontal: 8,
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
