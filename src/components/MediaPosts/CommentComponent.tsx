import {
   AntDesign,
   FontAwesome,
   Ionicons,
   MaterialCommunityIcons,
   MaterialIcons,
   SimpleLineIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Skeleton } from "@rneui/themed";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
   Alert,
   Dimensions,
   FlatList,
   KeyboardAvoidingView,
   Modal,
   Platform,
   Pressable,
   ScrollView,
   StyleSheet,
   TextInput,
   View,
} from "react-native";
import {
   ActivityIndicator,
   Avatar,
   Button,
   Divider,
   useTheme,
   Text,
   IconButton,
   Card,
} from "react-native-paper";
import { useCurrentUser } from "../../utils/CustomHooks";
import { dateAgo } from "../../utils/util";
import TextEllipse from "../TextEllipse";
import CommentTextEllipse from "./CommentTextEllipse";
import { useToast } from "react-native-toast-notifications";

type CommentProps = {
   comment: BlogComment;
   blogOwnerId?: string;
   size?: "normal" | "small";
};

const { height, width } = Dimensions.get("window");

const CommentComponent = (props: CommentProps) => {
   const currentUser = useCurrentUser();
   const [openModal, setOpenModal] = useState<boolean>(false);
   const [openRepliesModal, setOpenRepliesModal] = useState<boolean>(false);
   const [commentor, setCommentor] = useState<User | null>(null);
   const [loading, setLoading] = useState<boolean>(false);
   const [loadingFetch, setLoadingFetch] = useState<boolean>(false);
   const [commentText, setCommentText] = useState<string>(
      props.comment.content
   );
   const [replyText, setReplyText] = useState<string>("");
   const [comment, setComment] = useState<BlogComment>(props.comment);
   const [replies, setReplies] = useState<BlogComment[]>([]);
   const [likesCount, setLikesCount] = useState<number>(0);
   const [liked, setLiked] = useState<boolean>(false);
   const [repliesCount, setRepliesCount] = useState<number>(0);
   const page = React.useRef<number>(1);
   const [hasMore, setHasMore] = useState(true);
   const [showTextInput, setShowTextInput] = useState<boolean>(false);
   const [showReplies, setShowReplies] = useState<boolean>(false);
   const [openEdit, setOpenEdit] = useState<boolean>(false);
   const [deleted,setDeleted] = useState<boolean>(false)

   const theme = useTheme();
   const inputRef = useRef<TextInput>(null);
   const navigation = useNavigation<any>();
   const toast = useToast()

   let fetchData = async (pageNum?: number) => {
      let pageNumber = pageNum ?? page.current;
      // console.log("Replies PageNumber", pageNumber);
      if (!hasMore) return;
      try {
         setLoadingFetch(true);
         if (currentUser) {
            let commentId = props.comment.commentId;
            // console.log(commentId, currentUser);
            let { status, data } = await axios.get(
               `http://192.168.1.98:6000/comments/${commentId}?pageNumber=${pageNumber}&numberOfRecords=5`,
               { headers: { Authorization: `Bearer ${currentUser?.token}` } }
            );
            if (status === 200) {
               setReplies((prev) =>
                  prev ? [...prev, ...data.data] : data.data
               );
               if (data.data.length > 0) {
                  page.current++;
                  setShowReplies(true);
               }
               console.log("Replies=>", data.data);
               setLoadingFetch(false);
               if (data.data.length < 5) {
                  setHasMore(false);
               }
            } else {
               Alert.alert("Failed", data.message);
               setLoadingFetch(false);
            }
         }
      } catch (err) {
         console.log("From Comment", String(err));
         Alert.alert("Failed Comment", String(err));
         setLoadingFetch(false);
      }
   };

   const loadMore = () => {
      console.log("Getting replies");
      if (loadingFetch) return;
      fetchData();
   };

   useEffect(() => {
      setComment(props.comment);
      setCommentor(props.comment.createdBy);
      setLiked(props.comment.liked);
      setLikesCount(props.comment.likesCount);
      setRepliesCount(props.comment.repliesCount);
   }, []);

   useEffect(() => {
      if (replies.length >= 5) {
         setHasMore(true);
      }
   }, [replies]);

   const handleReplyButton = () => {
      setShowTextInput(!showTextInput);
      inputRef.current?.focus();
   };

   const handleReply = async () => {
      setLoading(true);
      let activeUserId = currentUser?.userId;
      let replyObj = {
         content: replyText,
      };

      console.log("ReplyObj", replyObj);
      try {
         let { data, status } = await axios.post(
            `http://192.168.1.98:6000/comments/${comment.commentId}/replies/`,
            replyObj,
            { headers: { Authorization: `Bearer ${currentUser?.token}` } }
         );
         if (status === 201) {
            // console.log(data.data);
            setReplies((prev) => (prev ? [data.data, ...prev] : [data.data]));
            setReplyText("");
            setRepliesCount((prev) => prev + 1);
            // setComment(comment);
            // Alert.alert("Success", data.message);
         } else {
            Alert.alert("Reply Failed", data.message);
         }
         setLoading(false);
      } catch (err) {
         Alert.alert("Reply Failed", String(err));
         setLoading(false);
      }
   };

   const handleLike = async (commentId: string) => {
      console.log(commentId);
      try {
         setLoading(true);
         let activeUserId = currentUser?.userId;
         let { data, status } = await axios.put(
            `http://192.168.1.98:6000/comments/${commentId}/likes/`,
            { userId: activeUserId },
            { headers: { Authorization: `Bearer ${currentUser?.token}` } }
         );
         if (status === 202) {
            let { liked, likesCount: numberOfLikes } = data.data;
            setLiked(liked);
            setLikesCount(numberOfLikes);

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

   const handleCommentButton = () => {
      if (replies.length < 1) {
         loadMore();
      } else {
         setShowReplies(true);
      }
   };

   const handleUpdateComment = async () => {
      setLoading(true);
      try {
         let putObj = { content: commentText, userId: comment?.userId };
         let response = await axios.put(
            `http://192.168.1.98:6000/comments/${comment.commentId}`,
            putObj,
            { headers: { Authorization: `Bearer ${currentUser?.token}` } }
         );
         if (response.status == 202) {
            setComment({ ...comment, content: commentText });
            setOpenModal(false);
            setOpenEdit(false)
            toast.show("Comment Updated",{
               type:"normal",
               placement:"top"
            })
        
         } else {
            toast.show("Update Failed",{
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

   const handleDeleteComment = async () => {
      setLoading(true);
      try {
         let response = await axios.delete(
            `http://192.168.1.98:6000/comments/${comment.commentId}`,
            { headers: { Authorization: `Bearer ${currentUser?.token}` } }
         );
         if (response.status == 203) {
            setComment({ ...comment, content: commentText });
            setOpenModal(false);
            setOpenEdit(false)
            setDeleted(true)
            toast.show("Comment Deleted",{
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

   const gotoUserProfile = () => {
      if (currentUser?.userId === commentor?.userId) {
         navigation.navigate("ProfileScreen", { userId: commentor?.userId });
      } else {
         navigation.navigate("UserProfileScreen", {
            userId: commentor?.userId,
         });
      }
   };

   const renderFooter = () => {
      if (hasMore) {
         return (
            <Button
               onPress={loadMore}
               disabled={loadingFetch}
               loading={loadingFetch}>
               Load more
            </Button>
         );
      }
      return null;
   };

   const renderItem = ({ item }: any) => (
      <CommentComponent
         size="small"
         comment={item}
         blogOwnerId={props.blogOwnerId}
      />
   );

   const renderSkeleton = () => {
      if (replies.length < 1) return null;
      return (
         <View>
            <View
               style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  gap: 4,
                  margin: 3,
               }}>
               <Skeleton animation="wave" circle width={50} height={50} />
               <Skeleton
                  style={{ borderRadius: 5, marginTop: 4 }}
                  animation="wave"
                  width={width - 70}
                  height={80}
               />
            </View>
            <View
               style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  gap: 4,
                  margin: 3,
               }}>
               <Skeleton animation="wave" circle width={50} height={50} />
               <Skeleton
                  style={{ borderRadius: 5, marginTop: 4 }}
                  animation="wave"
                  width={width - 70}
                  height={80}
               />
            </View>
            <View
               style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  gap: 4,
                  margin: 3,
               }}>
               <Skeleton animation="wave" circle width={50} height={50} />
               <Skeleton
                  style={{ borderRadius: 5, marginTop: 4 }}
                  animation="wave"
                  width={width - 70}
                  height={80}
               />
            </View>
            <View
               style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  gap: 4,
                  margin: 3,
               }}>
               <Skeleton animation="wave" circle width={50} height={50} />
               <Skeleton
                  style={{ borderRadius: 5, marginTop: 4 }}
                  animation="wave"
                  width={width - 70}
                  height={80}
               />
            </View>
         </View>
      );
   };

   if(deleted){
      return null
   }

   return (
      <Pressable onPress={()=> setOpenEdit(false)}>
      <KeyboardAvoidingView
         
         style={[
            styles.container,
            { backgroundColor: theme.colors.background },
         ]}
         behavior="padding">
         <Modal visible={openModal}>
            <View
               style={{
                  flex: 1,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  justifyContent: "center",
                  alignItems: "center",
               }}>
               <View
                  style={{
                     backgroundColor: theme.colors.background,
                     width: "90%",
                     padding: 2,
                     justifyContent: "center",
                     alignItems: "center",
                     borderRadius: 4,
                  }}>
                  <View
                     style={{
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                        width: "100%",
                     }}>
                     <IconButton
                        icon="close"
                        onPress={() => setOpenModal(false)}
                     />
                  </View>

                  {/* <Button  icon='close'></Button> */}
                  <View style={{ margin: 6 }}>
                     <Text
                        style={{
                           fontFamily: "Poppins_400Regular",
                           color: theme.colors.primary,
                           textAlign: "center",
                        }}>
                        Update Comment
                     </Text>
                  </View>
                  <View
                     style={{
                        width: "90%",
                        paddingHorizontal: 10,
                        marginBottom: height * 0.1,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 10,
                     }}>
                     <TextInput
                        multiline
                        value={commentText}
                        placeholder="Comment here..."
                        onChangeText={(v) => setCommentText(v)}
                        style={{
                           flex: 1,
                           backgroundColor: theme.colors.inverseOnSurface,
                           borderTopLeftRadius: 20,
                           borderBottomLeftRadius: 20,
                           height: 50,
                           paddingHorizontal: 25,
                        }}
                     />
                     <View
                        style={{
                           height: 50,
                           alignItems: "center",
                           justifyContent: "center",
                           borderTopRightRadius: 20,
                           borderBottomRightRadius: 20,
                           backgroundColor: theme.colors.inverseOnSurface,
                        }}>
                        <Button onPress={handleUpdateComment}>
                           <FontAwesome
                              color={theme.colors.primary}
                              name="send"
                              size={21}
                           />
                        </Button>
                     </View>
                  </View>
               </View>
            </View>
         </Modal>
         {commentor && (
            <View style={styles.commentorMedia}>
               <Pressable onPress={gotoUserProfile}>
                  <Avatar.Image
                     size={props.size === "small" ? 25 : 35}
                     source={{ uri: commentor.profileImage }}
                  />
                  {/* <Image
                     style={styles.profileImage}
                     
                  /> */}
               </Pressable>
               <View
                  style={{
                     // backgroundColor: "#f5f5f5",
                     flex: 1,
                     borderRadius: 30,
                     paddingLeft: 2,
                     paddingRight: 15,
                     paddingVertical: 2,
                  }}>
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
                           // justifyContent: "space-between",
                        }}>
                        <Text
                           variant="titleSmall"
                           numberOfLines={1}
                           style={{
                              textAlign: "center",
                              marginHorizontal: 3,
                              // fontFamily: "Poppins_500Medium",
                              color: theme.colors.secondary,
                           }}>
                           {commentor.fullName}
                        </Text>
                        {commentor.verificationRank && (
                           <MaterialIcons
                              size={14}
                              color={
                                 commentor.verificationRank === "low"
                                    ? "orange"
                                    : commentor.verificationRank === "medium"
                                    ? "green"
                                    : "blue"
                              }
                              name="verified"
                           />
                        )}
                     </View>
                     {(currentUser?.userId == commentor.userId ||
                        currentUser?.userId == props?.blogOwnerId) && (
                           <Pressable style={{position:"relative"}} onPress={() => setOpenEdit(!openEdit)}>
                           <SimpleLineIcons name="options-vertical" />
                           {
                              openEdit &&
                              <Card style={{position:"absolute",top:0,right:10,zIndex:10}}>
                              <Button icon='pencil' disabled={loading} onPress={() => setOpenModal(true)}>Edit</Button>
                              <Divider/>
                              <Button icon='delete' disabled={loading} loading={loading} onPress={handleDeleteComment}>Delete</Button>
                           </Card>
                           }
   
                        </Pressable>
                     )}
                  </View>
                  <CommentTextEllipse
                     numberOfLines={2}
                     style={{
                        paddingHorizontal: 5,
                     }}
                     text={comment.content}
                     variant="bodyMedium"
                  />
                  {/* <TextEllipse
                     text={comment.content}
                     textLength={80}
                     showViewMore
                     style={{
                        fontFamily: "Poppins_300Light",
                        paddingHorizontal: 5,
                        fontSize: props.size === "small" ? 11 : 13,
                     }}
                  /> */}
                  {/* <Divider/> */}
                  {/* <Text>Comment Likes</Text>  */}
                  <View
                     style={{
                        flex: 1,
                        justifyContent: "flex-start",
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 2,
                        paddingHorizontal: 5,
                        borderRadius: 3,
                        gap: 1,
                     }}>
                     {comment.createdAt && (
                        <Text
                           numberOfLines={1}
                           variant="bodySmall"
                           style={{
                              fontFamily: "Poppins_300Light",
                              marginRight: 5,
                           }}>
                           {dateAgo(comment.createdAt)}
                        </Text>
                     )}

                     {/* <Divider style={{ width: 50 }} /> */}
                     <Button
                        disabled={loading}
                        labelStyle={{
                           fontFamily: "Poppins_300Light",
                           paddingHorizontal: 3,
                           fontSize: 13,
                           color: theme.colors.secondary,
                        }}
                        onPress={handleReplyButton}
                        mode="text">
                        Reply
                     </Button>
                     <Button
                        disabled={loading}
                        labelStyle={{
                           fontFamily: "Poppins_300Light",
                           paddingHorizontal: 3,
                           fontSize: 13,
                           color: theme.colors.secondary,
                        }}
                        onPress={handleCommentButton}>
                        <Ionicons
                           size={15}
                           color={theme.colors.secondary}
                           name="chatbox-outline"
                        />
                        <Text> {Math.max(repliesCount, replies.length)}</Text>
                     </Button>
                     <Button
                        disabled={loading}
                        labelStyle={{
                           fontFamily: "Poppins_300Light",
                           paddingHorizontal: 3,
                           fontSize: 13,
                           color: theme.colors.secondary,
                        }}
                        onPress={() => handleLike(comment.commentId)}>
                        <Ionicons
                           size={18}
                           color={
                              liked
                                 ? theme.colors.primary
                                 : theme.colors.secondary
                           }
                           name={liked ? "heart-sharp" : "heart-outline"}
                        />
                        <Text> {likesCount}</Text>
                     </Button>
                  </View>

                  {showReplies && (
                     <Button onPress={() => setShowReplies(false)}>
                        hide replies
                     </Button>
                  )}
                  {replies.length > 0 && showReplies && (
                     <FlatList
                        data={replies}
                        renderItem={renderItem}
                        keyExtractor={(item) => String(item?.commentId)}
                        ListFooterComponent={renderFooter}
                        ListEmptyComponent={renderSkeleton}
                     />
                  )}
                  {showTextInput && (
                     <View
                        style={{
                           width: "100%",
                           flexDirection: "row",
                           alignItems: "center",
                           justifyContent: "center",
                           marginVertical: 4,
                           zIndex: 1,
                        }}>
                        <TextInput
                           multiline
                           ref={inputRef}
                           value={replyText}
                           placeholder="Reply here..."
                           onChangeText={(v) => setReplyText(v)}
                           style={{
                              flex: 1,
                              borderTopLeftRadius: 20,
                              borderBottomLeftRadius: 20,
                              height: 50,
                              paddingHorizontal: 25,
                              backgroundColor: theme.colors.inverseOnSurface,
                           }}
                        />
                        <Button
                           mode="text"
                           onPress={handleReply}
                           style={{
                              paddingHorizontal: 5,
                              height: 50,
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: theme.colors.inverseOnSurface,
                              borderTopLeftRadius: 0,
                              borderBottomLeftRadius: 0,
                              borderTopRightRadius: 20,
                              borderBottomRightRadius: 20,
                           }}>
                           <FontAwesome
                              color={theme.colors.secondary}
                              name="send"
                              size={20}
                           />
                        </Button>
                     </View>
                  )}
               </View>
            </View>
         )}
         {/* <Divider /> */}
      </KeyboardAvoidingView>
      </Pressable>
   );
};

export default CommentComponent;

const styles = StyleSheet.create({
   container: {
      marginVertical: 3,
   },
   profileImage: {
      width: 28,
      height: 28,
      borderRadius: 15,
   },
   commentorMedia: {
      flexDirection: "row",
      gap: 8,
   },
   userFullName: {
      fontFamily: "Poppins_400Regular",
   },
});
