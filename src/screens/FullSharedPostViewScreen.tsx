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
import { postComments, postLikes, users } from "../data";
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
} from "@expo/vector-icons";
import axios from "axios";
import { useCurrentUser } from "../utils/CustomHooks";
import LikesComponent from "../components/LikesComponent";
import moment from "moment";
import HTML from "react-native-render-html";
import { LoadingBlogComponent } from "../components/MediaPosts/LoadingComponents";
import TextEllipse from "../components/TextEllipse";
import { dateAgo } from "../utils/util";

type FullSharedBlogComponentpost = { navigation: any; route: any };

const FullSharedBlogComponent = ({
   navigation,
   route,
}: FullSharedBlogComponentpost) => {
   const currentUser = useCurrentUser();
   const [openModal, setOpenModal] = useState<boolean>(false);
   const [openShareModal, setOpenShareModal] = useState<boolean>(false);
   const [commentsCount, setCommentsCount] = useState<number>(0);
   const [blog, setBlogs] = useState<Blog | null>(null);
   const [likesCount, setLikesCount] = useState<number>(0);
   const [sharesCount, setSharesCount] = useState<number>(0);
   const [refetchId, setRefetchId] = useState<number>(0);
   const [liked, setLiked] = useState<boolean>(false);
   const [createdBy, setCreatedBy] = useState<User | null>(null);
   const [shared, setShared] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(false);
   const [loadingShare, setLoadingShare] = useState<boolean>(false);
   const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
   const [textValue, setTextValue] = useState<string>("");
   const theme = useTheme();
   const { width } = useWindowDimensions();
   let inputRef = useRef<TextInput>(null);

   useEffect(
      function () {
         let fetchData = async () => {
            let activeUserId = currentUser?.userId;
            let blogId = route.params.blogId;
            console.log("blogId", blogId);
            console.log("blog", route.params);
            try {
               let { data, status } = await axios.get(
                  `http://192.168.1.98:6000/blogs/${blogId}/users/${activeUserId}`
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

                  // Alert.alert("Success",data.message)
               } else {
                  Alert.alert("Failed", data.message);
               }
            } catch (err) {
               Alert.alert("Failed", String(err));
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

   const handleComment = async () => {
      setLoading(true);

      let activeUserId = currentUser?.userId;
      let commentObj = {
         text: textValue,
         blogId: blog?.userId,
         userId: activeUserId,
      };
      console.log("CommentObj", commentObj);
      try {
         let { data, status } = await axios.post(
            `http://192.168.1.98:6000/comments/`,
            commentObj
         );
         if (status === 201) {
            // console.log(data.data);
            // setComments([...comments, data.data]);
            setTextValue("");
            setCommentsCount((prev) => prev + 1);

            setRefetchId(refetchId + 1);

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

   // const handleShareBlog = async () => {
   //    let activeUserId = currentUser?.userId;
   //    setLoadingShare(true);
   //    setShared(false);
   //    // let images = props.images?.map(image => image?.trimEnd())
   //    let blogObj = {
   //       blogObj: {
   //          userId: activeUserId,
   //          title: blog?.title,
   //          images: JSON.parse(String(blog?.images)),
   //          video: blog?.video,
   //          text: blog?.text,
   //          fromId: blog?.userId,
   //          shared: true,
   //       },
   //       sharedblogId: blog?.blogId,
   //    };
   //    console.log(blogObj);
   //    try {
   //       let response = await axios.blog(
   //          "http://192.168.1.98:5000/media/blogs/",
   //          blogObj
   //       );
   //       if (response.status === 201) {
   //          console.log(response.data);
   //          setLoadingShare(false);
   //          setShared(true);
   //          setSharesCount((prev) => prev + 1);
   //       } else {
   //          setLoadingShare(false);
   //          Alert.alert("Failed", "blog Failed");
   //       }
   //    } catch (err) {
   //       setLoadingShare(false);
   //       console.log(err);
   //    }
   // };

   const handleLike = async (blogId: string | number) => {
      console.log(blogId);
      try {
         setLoading(true);
         let activeUserId = currentUser?.userId;
         let { data } = await axios.put(
            `http://192.168.1.98:5000/media/blogs/likes/`,
            { userId: activeUserId, blogId: blogId }
         );
         if (data.status == "success") {
            let { liked, numberOfLikes } = data.data;
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

   const handleEmojiSelect = (emoji: any) => {
      setTextValue(textValue + emoji);
   };

   if (!blog) {
      return <LoadingBlogComponent />;
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
                     <Avatar.Image
                        size={45}
                        source={{ uri: createdBy.profileImage }}
                     />
                  </Pressable>
                  <TextEllipse
                     style={{ fontFamily: "Poppins_400Regular", margin: 5 }}
                     textLength={25}
                     text={createdBy.fullName}
                  />
                  <View
                     style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        alignItems: "flex-end",
                        marginBottom: 2,
                        paddingHorizontal: 1,
                        borderRadius: 3,
                     }}>
                     {currentUser?.userId == blog?.userId && (
                        <View>
                           <Button onPress={() => setOpenModal(true)}>
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
                  {/* <Text style={{textAlignVertical:"center",color:theme.colors.secondary,fontFamily:"Poppins_300Light",marginRight:2}}>bloged</Text> */}
                  <AntDesign
                     color={theme.colors.secondary}
                     name="clockcircleo"
                  />
                  <Text
                     style={{
                        textAlignVertical: "center",
                        color: theme.colors.secondary,
                        fontFamily: "Poppins_300Light",
                        fontSize: 11,
                     }}>
                     {dateAgo(blog.createdAt)}
                  </Text>
               </View>
               {blog?.images && <ImagesViewer images={blog?.images} />}
               {/* {blog?.video && <VideoPlayer video={blog?.video}/>} */}
            </View>
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
            <View>
               <View style={{ marginBottom: 1 }}>
                  <View style={{ paddingHorizontal: 8, marginVertical: 5 }}>
                     <Text>
                        <LikesComponent
                           blogId={blog?.blogId}
                           numberOfLikes={likesCount}
                        />
                     </Text>
                  </View>
                  <View style={{ flex: 1, flexDirection: "row" }}>
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
                              marginHorizontal: 1,
                           }}>
                           Like
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
                              marginHorizontal: 1,
                           }}>
                           Comments
                        </Text>
                     </View>
                  </View>
                  <Divider style={{ width: width - 40, alignSelf: "center" }} />
                  <View style={styles.likeCommentAmountCon}>
                     <Button
                        disabled={loading}
                        onPress={() => handleLike(blog?.blogId)}
                        textColor={theme.colors.secondary}
                        style={{
                           backgroundColor: theme.colors.inverseOnSurface,
                           flex: 1,
                           alignItems: "center",
                        }}>
                        <Ionicons
                           size={18}
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
                        onPress={() => inputRef?.current?.focus()}
                        textColor={theme.colors.secondary}
                        style={{
                           backgroundColor: theme.colors.inverseOnSurface,
                           flex: 1,
                        }}>
                        <Ionicons
                           size={20}
                           color={theme.colors.secondary}
                           name="chatbox-outline"
                        />
                     </Button>
                  </View>
               </View>
               <View
                  style={{
                     marginTop: 5,
                     paddingHorizontal: 15,
                     flexDirection: "row",
                     alignItems: "center",
                     justifyContent: "center",
                  }}>
                  <TextInput
                     ref={inputRef}
                     value={textValue}
                     placeholder="Comment here..."
                     onChangeText={(v) => setTextValue(v)}
                     style={{
                        flex: 1,
                        borderTopLeftRadius: 20,
                        borderBottomLeftRadius: 20,
                        height: 50,
                        paddingHorizontal: 25,
                     }}
                  />
                  <Pressable
                     onPress={handleComment}
                     style={{
                        paddingHorizontal: 20,
                        height: 50,
                        alignItems: "center",
                        justifyContent: "center",
                        borderTopRightRadius: 20,
                        borderBottomRightRadius: 20,
                     }}>
                     <FontAwesome
                        color={theme.colors.secondary}
                        name="send"
                        size={20}
                     />
                  </Pressable>
               </View>
               {/* <KeyboardAvoidingView style={styles.commentBox}>
                   <TextInput
                      value={textValue}
                      onChangeText={(v) => setTextValue(v)}
                      style={[
                         styles.commentInputField,
                         { color: theme.colors.primary },
                      ]}
                      right={
                         <TextInput.Icon
                            disabled={loading}
                            onPress={handleComment}
                            icon="send"
                         />
                      }
                      mode="outlined"
                      multiline
                   />
                   <Entypo
                      onPress={toggleEmojiPicker}
                      size={26}
                      name="emoji-neutral"
                   />
                </KeyboardAvoidingView> */}
               <View style={{ padding: 5, marginBottom: 10 }}>
                  <Comments
                     refetchId={refetchId}
                     userId={blog?.userId}
                     blogId={blog.blogId}
                  />
               </View>
            </View>
         </ScrollView>
         {showEmojiPicker && (
            <View
               style={{
                  position: "absolute",
                  flex: 1,
                  top: 60,
                  left: 0,
                  right: 0,
                  height: 350,
                  zIndex: 10,
                  backgroundColor: "#ffffff",
               }}>
               <EmojiSelector
                  onEmojiSelected={handleEmojiSelect}
                  showHistory={true}
                  showSearchBar={false}
                  showTabs={false}
                  showSectionTitles={false}
                  category={Categories.all}
                  columns={8}
               />
            </View>
         )}
      </View>
   );
};

export default FullSharedBlogComponent;

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
