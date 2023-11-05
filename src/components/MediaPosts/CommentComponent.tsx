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
} from "react-native-paper";
import { useCurrentUser } from "../../utils/CustomHooks";
import { dateAgo } from "../../utils/util";
import TextEllipse from "../TextEllipse";
import CommentTextEllipse from "./CommentTextEllipse";

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
   const [commentText, setCommentText] = useState<string>("");
   const [replyText, setReplyText] = useState<string>("");
   const [comment, setComment] = useState<BlogComment>(props.comment);
   const [replies, setReplies] = useState<BlogComment[]>([]);
   const [likesCount, setLikesCount] = useState<number>(0);
   const [liked, setLiked] = useState<boolean>(false);
   const [repliesCount, setRepliesCount] = useState<number>(0);
   const page = React.useRef<number>(1);
   const [hasMore, setHasMore] = useState(true);

   const theme = useTheme();
   const inputRef = useRef<TextInput>(null);
   const navigation = useNavigation<any>();

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

   const handleLoadMore = () => {
      console.log("Replies end reached");
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

   useEffect(
      function () {
         fetchData(1);
      },
      [currentUser, repliesCount]
   );

   const handleReplyModal = () => {
      setOpenRepliesModal(true);
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

   const handleUpdateComment = () => {
      setLoading(true);
      async function UpdateComment() {
         try {
            let putObj = { text: commentText, userId: comment?.userId };
            let response = await axios.put(
               "`http://192.168.1.98:6000/comments",
               putObj
            );
            if (response.status == 202) {
               setComment({ ...comment, content: commentText });
               Alert.alert("Success", "Comment Updated");
            } else {
               Alert.alert("Failed", response.data.message);
            }
            setLoading(false);
         } catch (err) {
            console.log(err);
            Alert.alert("Failed", String(err));
            setLoading(false);
         }
      }
      UpdateComment();
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
      if (!loadingFetch) return null;
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
            <Text style={{ color: "#cecece", marginLeft: 5 }}>Loading</Text>
         </View>
      );
   };

   const renderItem = ({ item }: any) => (
      <CommentComponent comment={item} blogOwnerId={props.blogOwnerId} />
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

   return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
         <Modal visible={openRepliesModal}>
            <View
               style={{
                  backgroundColor: "#00000099",
               }}>
               <View
                  style={{
                     top: height * 0.1,
                     borderTopRightRadius: 12,
                     borderTopLeftRadius: 8,
                     backgroundColor: "#fff",
                     overflow: "hidden",
                     height: height,
                  }}>
                  <View
                     style={{
                        backgroundColor: "#fff",
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                        paddingVertical: 6,
                     }}>
                     <Button onPress={() => setOpenRepliesModal(false)}>
                        <AntDesign size={20} name="close" />
                     </Button>
                  </View>

                  {replies.length < 1 && (
                     <View
                        style={{
                           width: "100%",
                           alignItems: "center",
                           paddingVertical: height * 0.15,
                        }}>
                        <MaterialCommunityIcons
                           name="comment-outline"
                           style={{ opacity: 0.6 }}
                           size={80}
                           color={theme.colors.secondary}
                        />
                        <Text
                           style={{
                              fontFamily: "Poppins_300Light",
                              textAlign: "center",
                              margin: 10,
                           }}>
                           Be the first to comment
                        </Text>
                     </View>
                  )}
                  <FlatList
                     style={{
                        paddingHorizontal: 10,
                        maxHeight: height * 0.7,
                        marginVertical: height * 0.1,
                     }}
                     data={replies}
                     renderItem={renderItem}
                     keyExtractor={(item) => String(item?.commentId)}
                     onEndReached={handleLoadMore}
                     onEndReachedThreshold={0.2}
                     ListFooterComponent={renderFooter}
                     ListEmptyComponent={renderSkeleton}
                  />
                  <View
                     style={{
                        position: "absolute",
                        top: height * 0.075,
                        width: "100%",
                        paddingHorizontal: 35,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1,
                     }}>
                     <TextInput
                        multiline
                        ref={inputRef}
                        value={replyText}
                        placeholder="Comment here..."
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
               </View>
            </View>
         </Modal>
         <Modal visible={openModal}>
            <View
               style={{
                  flex: 1,
                  backgroundColor: "#00000099",
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
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        paddingHorizontal: 10,
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
                     <Pressable
                        onPress={handleUpdateComment}
                        style={{
                           paddingHorizontal: 20,
                           height: 50,
                           alignItems: "center",
                           justifyContent: "center",
                           borderTopRightRadius: 20,
                           borderBottomRightRadius: 20,
                           backgroundColor: theme.colors.inverseOnSurface,
                        }}>
                        <FontAwesome
                           color={theme.colors.primary}
                           name="send"
                           size={21}
                        />
                     </Pressable>
                  </View>
               </View>
            </View>
         </Modal>
         {commentor && (
            <View style={styles.commentorMedia}>
               <Pressable onPress={gotoUserProfile}>
                  <Avatar.Image
                     size={props.size === "small"?30:35}
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
                           variant="titleMedium"
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
                        <SimpleLineIcons
                           style={{ alignSelf: "center", right: 5 }}
                           onPress={() => setOpenModal(true)}
                           name="options-vertical"
                        />
                     )}
                  </View>
                  <CommentTextEllipse
                     numberOfLines={2}
                     style={{
                        fontFamily: "Poppins_300Light",
                        fontSize:14,
                        paddingHorizontal: 5,
                     }}
                     text={comment.content}
                     variant={
                        props.size === "small" ? "bodyMedium" : "bodyLarge"
                     }
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
                        onPress={handleReplyModal}
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
                        onPress={() => setOpenRepliesModal(true)}>
                        <Ionicons
                           size= {15}
                           color={theme.colors.secondary}
                           name="chatbox-outline"
                        />
                        {replies.length}
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
                        <AntDesign
                           size={15}
                           name={liked ? "like1" : "like2"}
                           color={theme.colors.secondary}
                        />
                        {likesCount}
                     </Button>
                  </View>
                  {replies.length > 0 && (
                     <View>
                        <CommentComponent
                           size="small"
                           comment={replies[0]}
                           blogOwnerId={props.blogOwnerId}
                        />
                     </View>
                  )}
               </View>
            </View>
         )}
         <Divider />
      </KeyboardAvoidingView>
   );
};

export default CommentComponent;

const styles = StyleSheet.create({
   container: {
      backgroundColor: "#ffffff",
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
