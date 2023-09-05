import {
   StyleSheet,
   Text,
   View,
   Alert,
   Modal,
   KeyboardAvoidingView,
   Platform,
} from "react-native";
import React, { useState, useEffect, useReducer, useMemo } from "react";
import { Button, TextInput, useTheme } from "react-native-paper";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { ImagePicker } from "expo-image-multiple-picker";
import { useCurrentUser } from "../../utils/CustomHooks";
// import config from "../.././aws-config";
// import AWS from "aws-sdk";
import {
   actions,
   RichEditor,
   RichToolbar,
} from "react-native-pell-rich-editor";
// const s3 = new AWS.S3({
//    accessKeyId: config.accessKeyId,
//    secretAccessKey: config.secretAccessKey,
//    region: config.region,
// });

type NPost = Partial<Omit<Blog, "blogId" | "updatedAt" | "createdAt">>;

const initialState = {};

const postReducer = (state: NPost = initialState, action: Action) => {
   switch (action.type) {
      case "TEXT":
         return { ...state, text: action.payload };
      case "TITLE":
         return {
            ...state,
            title: action.payload,
         };
      case "VIDEO":
         return { ...state, video: action.payload };
      case "IMAGES":
         return { ...state, images: action.payload };
      case "USERID":
         return { ...state, userId: action.payload };
      default:
         return state;
   }
};

const PostForm = () => {
   const [loading, setLoading] = useState<boolean>(false);
   const [postState, postDispatch] = useReducer(postReducer, initialState);
   const [imageOpen, setImageOpen] = useState(false);
   const [videoOpen, setVideoOpen] = useState(false);
   const currentUser = useCurrentUser();
   const theme = useTheme();
   const richText = React.useRef<any>(null);

   const handlePost = async () => {
      let activeUserId = currentUser?.userId;
      setLoading(true);
      let postObj = { ...postState, userId: activeUserId };
      // let images = props.images?.map(image => image?.trimEnd())
      // Upload images to S3
      // const uploadedImageURLs = [];
      // for (const imageUri of postObj.images) {
      //    const imageName = imageUri.substring(imageUri.lastIndexOf("/") + 1);
      //    const imageKey = `${Date.now()}-${imageName}`;
      //    const imageParams = {
      //       Bucket: config.bucketName,
      //       Key: imageKey,
      //       Body: { uri: imageUri },
      //    };

      //    try {
      //       const uploadResponse = await s3.upload(imageParams).promise();
      //       uploadedImageURLs.push(uploadResponse.Location);
      //    } catch (error) {
      //       console.log("Image upload error:", error);
      //       setLoading(false);
      //       Alert.alert("Failed", "Image upload failed");
      //       return;
      //    }
      // }

      // Update product with uploaded image URLs
      // postObj.images = uploadedImageURLs;

      // let finalPostObj = { postObj, sharedPostId: null };
      console.log(postObj);
      try {
         let response = await axios.post(
            "http://192.168.1.93:6000/blogs/",
            postObj,
            { headers: { Authorization: `Bearer ${currentUser?.token}` } }
         );
         if (response.status === 201) {
            console.log(response.data);
            setLoading(false);
            Alert.alert("Successful", "Post successfully");

            // Alert.alert("Successful", "Post successfully");
         } else {
            setLoading(false);
            Alert.alert("Failed", "Post Failed");
         }
      } catch (err) {
         setLoading(false);
         console.log(err);
      }

      // console.log(postState);
   };

   const chooseImage = (assets: any[]) => {
      let imageSrcs = assets.map((asset) => asset.uri);
      console.log(imageSrcs);
      postDispatch({ type: "IMAGES", payload: imageSrcs });
      setImageOpen(false);
   };

   const cancelImage = () => {
      console.log("No permission, canceling image picker");
      setImageOpen(false);
   };

   const chooseVideo = (assets: any[]) => {
      let videoSrc = assets[0]["uri"];
      postDispatch({ type: "VIDEO", payload: videoSrc });
      console.log(videoSrc);
      setVideoOpen(false);
   };

   const cancelVideo = () => {
      console.log("No permission, canceling image picker");
      setImageOpen(false);
   };

   const onValueChangeContent = (v: string): void => {
      console.log("onValueChange", v);
      postDispatch({ type: "TEXT", payload: v });
   };

   const onValueChangeTitle = (v: string): void => {
      console.log("onValueChange", v);
      postDispatch({ type: "TITLE", payload: v });
   };

   return (
      <View
         style={{
            marginVertical: 4,
         }}>
         <Modal visible={imageOpen}>
            <Button
               onPress={() => setImageOpen(false)}
               icon={() => <Feather name="chevron-left" />}>
               Cancel
            </Button>
            <ImagePicker
               onSave={chooseImage}
               onCancel={cancelImage}
               multiple
               limit={8}
            />
         </Modal>
         <Modal visible={videoOpen}>
            <ImagePicker
               onSave={chooseVideo}
               onCancel={cancelVideo}
               video
               timeSlider
               image={false}
            />
         </Modal>
         <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.formContainer}>
            <TextInput
               contentStyle={{ backgroundColor: theme.colors.inverseOnSurface }}
               outlineStyle={{ borderColor:theme.colors.inverseOnSurface}}
               onChangeText={onValueChangeTitle}
               mode="outlined"
               value="Untitled"
            />
            {/* <Text style={{ marginTop:15, fontFamily: "Poppins_400Regular",fontSize:13,color:theme.colors.secondary}}>
               Content
            </Text> */}
            <RichToolbar
               style={{backgroundColor: theme.colors.inverseOnSurface,paddingBottom:0,marginBottom:0}}
               editor={richText}
               actions={[
                  actions.setBold,
                  actions.setItalic,
                  actions.setUnderline,
                  actions.setStrikethrough,
                  actions.blockquote,
                  actions.alignCenter,
                  actions.alignFull,
                  actions.alignLeft,
                  actions.alignRight,
                  actions.insertBulletsList,
                  actions.insertOrderedList,
                  actions.undo,
                  actions.redo,
                  actions.indent,
                  actions.setSuperscript,
                  actions.setSubscript,
               ]}
            />
            <RichEditor
               editorStyle={{ backgroundColor: theme.colors.inverseOnSurface}}
               initialHeight={300}
               style={{padding:0,marginTop:0}}
               initialContentHTML="<b>Write your content here</b>"
               ref={richText}
               onChange={onValueChangeContent}
            />
            <View style={styles.buttonGroup}>
               <Button
                  style={[styles.button,{backgroundColor:theme.colors.inverseOnSurface}]}
                  mode="text"
                  onPress={() => setImageOpen(true)}>
                  <AntDesign size={20} name="picture" />
               </Button>
               <Button
                  style={[styles.button,{backgroundColor:theme.colors.inverseOnSurface}]}
                  mode="text"
                  onPress={() => setVideoOpen(true)}>
                  <AntDesign size={20} name="videocamera" />
               </Button>
               <Button
                  mode="contained"
                  onPress={handlePost}
                  disabled={loading}
                  loading={loading}>
                  Upload 
               </Button>
            </View>
         </KeyboardAvoidingView>
      </View>
   );
};

export default PostForm;

const styles = StyleSheet.create({
   formContainer: {
      padding: 15,
      gap: 5,
   },
   buttonGroup: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      marginVertical: 10,
   },
   button: {
      flex: 1,
      marginHorizontal: 3,
   },
});
