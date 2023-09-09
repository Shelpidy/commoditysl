import {
   StyleSheet,
   Text,
   View,
   Modal,
   Dimensions,
   Image,
   Alert,
   useWindowDimensions,
} from "react-native";
import React, { useState, useEffect, useReducer } from "react";
import ImagesViewer from "../ImagesViewer";
import VideoPlayer from "../VideoPlayer";
import TextViewer from "../TextViewer";
import Comments from "./Comments";
import { postComments, postLikes, users } from "../../data";
import {
   TextInput,
   useTheme,
   Button,
   IconButton,
   Avatar,
   Divider,
} from "react-native-paper";
import {
   AntDesign,
   Entypo,
   FontAwesome,
   MaterialCommunityIcons,
   Feather,
   Ionicons,
   SimpleLineIcons,
} from "@expo/vector-icons";
import axios from "axios";
import UpdatePostForm from "./UpdatePostForm";
import { Pressable } from "react-native";
import TextEllipse from "../TextEllipse";
import { useCurrentUser } from "../../utils/CustomHooks";
import LikesComponent from "../LikesComponent";
import moment from "moment";
import config from "../../aws-config";
import UserComponent from "../UserComponent";
import HTML from "react-native-render-html";
import { LoadingBlogComponent } from "./LoadingComponents";
import { useNavigation } from "@react-navigation/native";
import { dateAgo } from "../../utils/util";

type NSharedBlogComponentProps = {
   blog: Blog;
   commentsCount: number;
   createdBy: User;
   ownedBy: User;
   likesCount: number;
   sharesCount: number;
   liked: boolean;
};
const initialState: Partial<Comment> = {};

const postCommentReducer = (
   state: Partial<Comment> = initialState,
   action: Action
) => {
   switch (action.type) {
      case "BLOGID":
         return {
            ...state,
            userId: action.payload,
         };
      case "USERID":
         return {
            ...state,
            userId: action.payload,
         };
      case "TEXT":
         return {
            ...state,
            text: action.payload,
         };
      default:
         return state;
   }
};

const SharedBlogComponent = (props: NSharedBlogComponentProps) => {
   const [postCommentState, dispatchPostComment] = useReducer(
      postCommentReducer,
      initialState
   );
   const currentUser = useCurrentUser();
   const [openModal, setOpenModal] = useState<boolean>(false);
   const [openShareModal, setOpenShareModal] = useState<boolean>(false);
   const [commentsCount, setCommentsCount] = useState<number>(0);
   const [comments, setComments] = useState<Comment[]>([]);
   const [likesCount, setLikesCount] = useState<number>(0);
   const [sharesCount, setSharesCount] = useState<number>(0);
   const [liked, setLiked] = useState<boolean>(false);
   const [createdBy, setCreatedBy] = useState<User | null>(null);
   const [ownedBy, setOwnedBy] = useState<User | null>(null);
   const [shared, setShared] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(false);
   const [loadingShare, setLoadingShare] = useState<boolean>(false);
   const theme = useTheme();
   const [reloadCLS, setRelaodCLS] = useState<number>(0);
   const { width } = useWindowDimensions();
   const navigation = useNavigation<any>();

   useEffect(() => {
      setLiked(props.liked);
      setSharesCount(props.sharesCount);
      setLikesCount(props.likesCount);
      setCommentsCount(props.commentsCount);
      setOwnedBy(props.ownedBy);
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
      console.log(blogId);
      try {
         setLoading(true);
         let activeUserId = currentUser?.userId;
         let { data, status } = await axios.put(
            `http://192.168.1.98:5000/blogs/${blogId}/likes/`,
            { userId: activeUserId }
         );
         if (status === 202) {
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

   if (!createdBy) {
      return <LoadingBlogComponent />;
   }

   return (
      <View style={styles.postContainer}>
         {createdBy && <UserComponent _user={createdBy} />}
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
            <MaterialCommunityIcons
               size={20}
               style={{ marginRight: 10 }}
               name="share-all-outline"
            />
            <AntDesign color={theme.colors.secondary} name="clockcircleo" />
            <Text
               style={{
                  textAlignVertical: "center",
                  color: theme.colors.secondary,
                  fontFamily: "Poppins_300Light",
                  fontSize: 13,
               }}>
               {dateAgo(props.blog.createdAt)}
            </Text>
         </View>
         <View style={{ flexDirection: "row" }}></View>
         <Divider />
         {ownedBy && (
            <View
               style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 8,
               }}>
               <Pressable onPress={gotoUserProfile}>
                  <Avatar.Image
                     size={45}
                     source={{ uri: ownedBy.profileImage }}
                  />
               </Pressable>

               <Text style={{ fontFamily: "Poppins_400Regular", margin: 5 }}>
                  {ownedBy.fullName}
               </Text>
            </View>
         )}
         <View>
            {props.blog?.images && <ImagesViewer images={props.blog?.images} />}

            {/* {props?.video && <VideoPlayer video={props?.video}/>} */}
         </View>
         <View
            style={{
               flex: 1,
               flexDirection: "row",
               justifyContent: "flex-end",
               paddingHorizontal: 4,
            }}>
            <Button
               labelStyle={{
                  color: theme.colors.secondary,
                  fontFamily: "Poppins_300Light",
                  fontSize: 13,
               }}
               style={{
                  borderColor: theme.colors.secondary,
                  minWidth: 100,
                  borderRadius: 4,
               }}
               mode="text"
               onPress={() =>
                  navigation.navigate("FullPostViewScreen", {
                     ...props.blog,
                     userId: props.blog.fromUserId,
                     blogId: props.blog.fromBlogId,
                  })
               }>
               View Post
            </Button>
         </View>
         {props.blog?.title && (
            <Text style={styles.title}>{props.blog?.title}</Text>
         )}

         {props.blog?.text && (
            <View style={{ paddingHorizontal: 8 }}>
               <HTML
                  contentWidth={width}
                  baseStyle={{ fontFamily: "Poppins_300Light" }}
                  systemFonts={["Poppins_300Light", "sans-serif"]}
                  source={{ html: props.blog?.text }}
               />
            </View>
         )}
         <Divider style={{ marginVertical: 10 }} />
         <View style={{ marginBottom: 1 }}>
            <View style={{ paddingHorizontal: 8, marginVertical: 5 }}>
               <Text>
                  <LikesComponent
                     blogId={props.blog?.blogId}
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
                  onPress={() => handleLike(props.blog?.blogId)}
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
                     backgroundColor: theme.colors.inverseOnSurface,
                     flex: 1,
                     alignItems: "center",
                     flexDirection: "row",
                  }}
                  onPress={() =>
                     navigation.navigate("FullSharedPostViewScreen", {
                        ...props.blog,
                     })
                  }
                  textColor={theme.colors.secondary}
                  style={{
                     backgroundColor: theme.colors.inverseOnSurface,
                     flex: 1,
                     alignItems: "center",
                  }}>
                  <Ionicons
                     size={18}
                     color={theme.colors.secondary}
                     name="chatbox-outline"
                  />
               </Button>
            </View>
         </View>
      </View>
   );
};

export default SharedBlogComponent;

const styles = StyleSheet.create({
   postContainer: {
      backgroundColor: "#ffffff",
      // marginHorizontal:6,
      marginVertical: 3,
      paddingVertical: 10,
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
