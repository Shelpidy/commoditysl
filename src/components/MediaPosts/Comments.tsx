import {
   StyleSheet,
   View,
   Alert,
   FlatList,
   Dimensions,
   TextInput,
   Modal,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import CommentComponent from "./CommentComponent";
import {
   Button,
   Divider,
   ActivityIndicator,
   useTheme,
   Text,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useCurrentUser } from "../../utils/CustomHooks";
import { Skeleton } from "@rneui/themed";
import axios from "axios";
import {
   AntDesign,
   Feather,
   FontAwesome,
   Ionicons,
   MaterialCommunityIcons,
} from "@expo/vector-icons";
import LikesComponent from "../LikesComponent";
import { useHandler } from "react-native-reanimated";

type CommentsProps = {
   blogId: string;
   userId?: string;
   // setNewCommentsCount: (count: number) => void;
   _commentsCount: number;
   _likesCount: number;
   _liked: boolean;
   _reposted: boolean;
};

type FetchComment = {
   comment: BlogComment;
   commentsCount: number;
   likesCount: number;
   liked: boolean;
   user: User;
};

const { width, height } = Dimensions.get("window");

const Comments = ({
   blogId,
   userId,
   _liked,
   _commentsCount,
   _likesCount,
   _reposted,
}: CommentsProps) => {
   const [comments, setComments] = useState<BlogComment[] | null>(null);
   const [loadingFetch, setLoadingFetch] = useState<boolean>(false);
   const page = React.useRef<number>(1);
   const [hasMore, setHasMore] = useState(true);
   const [textValue, setTextValue] = useState<string>("");
   const [showTextInput, setShowTextInput] = useState<boolean>(false);
   const navigation = useNavigation<any>();
   const currentUser = useCurrentUser();

   const [openModal, setOpenModal] = useState<boolean>(false);
   const [openShareModal, setOpenShareModal] = useState<boolean>(false);
   const [commentsCount, setCommentsCount] = useState<number>(_commentsCount);
   const [blog, setBlog] = useState<Blog | null>(null);
   const [likesCount, setLikesCount] = useState<number>(_likesCount);
   const [sharesCount, setSharesCount] = useState<number>(0);
   const [liked, setLiked] = useState<boolean>(_liked);
   const [reposted, setReposted] = useState<boolean>(_reposted);
   const [createdBy, setCreatedBy] = useState<User | null>(null);
   const [shared, setShared] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(false);
   const [loadingShare, setLoadingShare] = useState<boolean>(false);
   const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
   const theme = useTheme();

   const inputRef = React.useRef<TextInput>(null);

   const fetchComments = useCallback(
      async (pageNum?: number) => {
         let pageNumber = pageNum ?? page.current;
         console.log("New Page number", pageNumber);
         if (!hasMore) return;

         try {
            if (currentUser && blogId) {
               setLoadingFetch(true);
               let { data, status } = await axios.get(
                  `http://192.168.1.98:6000/blogs/${blogId}/comments?pageNumber=${pageNumber}&numberOfRecords=5`,
                  { headers: { Authorization: `Bearer ${currentUser?.token}` } }
               );

               if (status === 200) {
                  setComments((prevComments) =>
                     prevComments
                        ? [...prevComments, ...data?.data]
                        : data?.data
                  );
                  if (data?.data.length > 0) {
                     page.current++;
                  }
                  // console.log("Comments=>", data.data);
                  if (data?.data.length < 5) {
                     setHasMore(false);
                  }
                  setLoadingFetch(false);
               } else {
                  Alert.alert("c Failed", data.message);
                  setLoadingFetch(false);
               }
            }
            // setLoadingFetch(false);
         } catch (err) {
            console.log("From Comments", String(err));
            Alert.alert("c Failed", String(err));
            setLoadingFetch(false);
         }
      },
      [page.current, currentUser, blogId]
   );

   useEffect(() => {
      console.log("Fetching comments");
      if (currentUser) {
         fetchComments(1);
      }
   }, [currentUser]);

   useEffect(() => {
      setLiked(_liked);
   }, [_liked]);

   const handleLoadMore = useCallback(() => {
      console.log("Comments reached end");
      if (loadingFetch) return;
      fetchComments();
   }, [page.current]);

   const handleShowTextInput = () => {
      inputRef.current?.focus();
      setShowTextInput(true);
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
         title: blog?.title,
         images: JSON.parse(String(blog?.images)),
         video: blog?.video,
         text: blog?.text,
         fromUserId: blog?.userId,
         fromBlogId: blog?.blogId,
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

   const handleComment = async () => {
      setLoading(true);
      let commentObj = {
         content: textValue,
      };
      console.log("CommentObj", commentObj);
      try {
         let { data, status } = await axios.post(
            `http://192.168.1.98:6000/blogs/${blogId}/comments/`,
            commentObj,
            { headers: { Authorization: `Bearer ${currentUser?.token}` } }
         );
         if (status === 201) {
            // console.log(data.data);
            // setComments([...comments, data.data]);
            setTextValue("");
            setComments((prev) => (prev ? [data.data, ...prev] : [data.data]));
            setCommentsCount(commentsCount + 1);

            // Alert.alert("Success", data.message);
         } else {
            Alert.alert("l Failed", data.message);
         }
         setLoading(false);
      } catch (err) {
         Alert.alert("l Failed", String(err));
         setLoading(false);
      }
   };

   const renderFooter = () => {
      if (!loadingFetch) return null;
      return (
         <View
            style={{
               flexDirection: "row",
               padding: 15,
               justifyContent: "center",
               alignItems: "center",
               backgroundColor: theme.colors.background,
            }}>
            <ActivityIndicator color="#cecece" size="small" />
            <Text style={{ color: "#cecece", marginLeft: 5 }}>Loading</Text>
         </View>
      );
   };

   const renderItem = ({ item }: { item: BlogComment }) => (
      <CommentComponent
         key={String(item.commentId)}
         blogOwnerId={userId}
         comment={item}
      />
   );

   return (
      <View
         style={{ flex: 1, gap: 4, backgroundColor: theme.colors.background }}>
         <View style={{ backgroundColor: theme.colors.background }}>
            <LikesComponent blogId={blogId} numberOfLikes={likesCount} />
            <View style={styles.likeCommentAmountCon}>
               <Button
                  disabled={loading}
                  onPress={() => handleLike(blogId)}
                  // textColor={theme.colors.secondary}
                  textColor={
                     liked ? theme.colors.primary : theme.colors.secondary
                  }
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
                  onPress={handleShowTextInput}
                  textColor={theme.colors.secondary}
                  style={{
                     backgroundColor: theme.colors.inverseOnSurface,
                     flex: 1,
                  }}>
                  <MaterialCommunityIcons
                     name="comment-outline"
                     size={16}
                     color={theme.colors.secondary}
                  />
                  <Text> {commentsCount}</Text>
               </Button>
               <Button
                  onPress={() => setOpenShareModal(true)}
                  textColor={theme.colors.secondary}
                  style={{
                     backgroundColor: theme.colors.inverseOnSurface,
                     flex: 1,
                  }}>
                  <AntDesign
                     color={
                        reposted ? theme.colors.primary : theme.colors.secondary
                     }
                     size={18}
                     name="retweet"
                  />
                  <Text> {sharesCount}</Text>
               </Button>
               <Button
                  onPress={handleRepost}
                  textColor={theme.colors.secondary}
                  style={{
                     backgroundColor: theme.colors.inverseOnSurface,
                     flex: 1,
                  }}>
                  <Ionicons size={18} name="share-outline" />
                  <Text> {sharesCount}</Text>
               </Button>
            </View>

            {/* <View
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
               </View> */}
            {/* <Divider style={{ width: width - 40, alignSelf: "center" }} /> */}
            {/* <View style={styles.likeCommentAmountCon}>
                  <Ionicons
                     onPress={() => handleLike(blogId)}
                     size={30}
                     color={theme.colors.secondary}
                     name={liked ? "heart-sharp" : "heart-outline"}
                  />

                  <Ionicons
                     onPress={handleShowTextInput}
                     size={30}
                     color={theme.colors.secondary}
                     name="chatbox-outline"
                  />

                  <MaterialCommunityIcons
                     onPress={() => setOpenShareModal(true)}
                     size={25}
                     name="share-outline"
                  />
               </View> */}
         </View>
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
                     backgroundColor: "#ffffff",
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
                     onPress={handleRepost}
                     mode="contained">
                     <Ionicons />
                     <Ionicons
                        style={{ marginHorizontal: 4 }}
                        size={18}
                        name={shared ? "checkmark" : "share-social-outline"}
                     />
                     <Text>
                        {shared
                           ? "Shared blog Successfully"
                           : "Continue to share as a blog"}
                     </Text>
                  </Button>
               </View>
            </View>
         </Modal>
         {showTextInput && (
            <View
               style={{
                  marginVertical: 5,
                  paddingHorizontal: 0.1 * width,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
               }}>
               <TextInput
                  ref={inputRef}
                  multiline
                  value={textValue}
                  placeholder="Comment here..."
                  onChangeText={(v) => setTextValue(v)}
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
                  onPress={handleComment}
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

         <View>
            <FlatList
               data={comments}
               renderItem={renderItem}
               keyExtractor={(item) => String(item?.commentId)}
               onEndReached={handleLoadMore}
               onEndReachedThreshold={0.9}
               ListFooterComponent={renderFooter}
               style={{ padding: 8, marginTop: 3 }}
               // ListEmptyComponent={renderSkeleton}
            />
         </View>
      </View>
   );
};

export default React.memo(Comments);

const styles = StyleSheet.create({
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
});
