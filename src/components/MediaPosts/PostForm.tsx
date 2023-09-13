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
import {
   getStorage,
   ref,
   uploadBytesResumable,
   getDownloadURL,
} from "firebase/storage";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
   apiKey: "AIzaSyAoNT04_z-qCC4PeIaLXDJcMdpYX5Hvw_I",
   authDomain: "commodity-aca4d.firebaseapp.com",
   projectId: "commodity-aca4d",
   storageBucket: "commodity-aca4d.appspot.com",
   messagingSenderId: "966126498365",
   appId: "1:966126498365:web:fe492c3f15370783813054",
   measurementId: "G-2TCKRYHYB5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const storage = getStorage();

// Create the file metadata
/** @type {any} */
const metadata = {
   contentType: "image/jpeg",
};
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

type UploadFile = {
   filePath: string;
   fileName: string;
};

const PostForm = () => {
   const [loading, setLoading] = useState<boolean>(false);
   const [postState, postDispatch] = useReducer(postReducer, initialState);
   const [imageOpen, setImageOpen] = useState(false);
   const [videoOpen, setVideoOpen] = useState(false);
   const [progress, setProgress] = useState<number>(0);
   const currentUser = useCurrentUser();
   const theme = useTheme();
   const richText = React.useRef<any>(null);

   const handlePost = async (
      fileURLs: string[] | null = null,
      fileType: "image" | "video" = "image"
   ) => {
      let activeUserId = currentUser?.userId;
      setLoading(true);
      let postObj = {
         ...postState,
         userId: activeUserId,
         images: fileType === "image" ? fileURLs : null,
         video: fileType === "video" ? fileURLs?.[0] : null,
      };

      console.log(postObj);

      try {
         let response = await axios.post(
            "http://192.168.1.98:6000/blogs/",
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

   // UPLOAD FILE TO FIREBASE

   async function firebaseUpload(
      folderName: string = "Image",
      files?: string[]
   ) {
      try {
         let fileType: "image" | "video" = postState.images
         ? "image"
         : postState.video
         ? "video"
         : "image";
         const metadata = {
            contentType: fileType === 'image'?"image/jpeg":"video/*",
         };
         var downloadURLs: string[] | null = null;
         console.log({ Images: files });

         if (files) {
            setLoading(true);
            await Promise.all(
               files.map(async (file) => {
                  setProgress(0);
                  const fileResponse = await fetch(file);
                  const fileBlob = await fileResponse.blob();
                  const storageRef = ref(
                     storage,
                     folderName + "/" + file.split("/").pop() ||
                        `${String(new Date().toISOString())}.png`
                  );
                  const uploadTask = uploadBytesResumable(
                     storageRef,
                     fileBlob,
                     metadata
                  );
                  return new Promise((resolve) => {
                     uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                           const progress =
                              (snapshot.bytesTransferred /
                                 snapshot.totalBytes) *
                              100;
                           console.log("Upload is " + progress + "% done");
                           setProgress(progress);
                           switch (snapshot.state) {
                              case "paused":
                                 console.log("Upload is paused");
                                 break;
                              case "running":
                                 console.log("Upload is running");
                                 break;
                           }
                        },
                        (error) => {
                           if (error) setLoading(false);
                           // Handle errors as before
                        },
                        async () => {
                           let downloadURL = await getDownloadURL(
                              uploadTask.snapshot.ref
                           );
                           if (Array.isArray(downloadURLs)) {
                              downloadURLs.push(downloadURL);
                           } else {
                              downloadURLs = [downloadURL];
                           }

                           console.log("File available at", downloadURL);
                           resolve(null);
                        }
                     );
                  });
               })
            );
            // At this point, all uploads have completed
            console.log("All uploads have completed");
            console.log("Download URLs:", downloadURLs);
         }

         await handlePost(downloadURLs, fileType);
      } catch (err) {
         setLoading(false);
         console.log({ Error: err });
      }
   }

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
      // console.log("onValueChange", v);
      postDispatch({ type: "TEXT", payload: v });
   };

   const onValueChangeTitle = (v: string): void => {
      // console.log("onValueChange", v);
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
            <View style={{flex:1}}>
            <View>
               <Button onPress={()=> setVideoOpen(false)}>Cancel</Button>
            </View>
            <ImagePicker
               galleryColumns={4}
               onSave={chooseVideo}
               onCancel={cancelVideo}
               video
               multiple={false}
               timeSlider
               image={false}
            />
            </View>
           
         </Modal>
         <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.formContainer}>
            <TextInput
               contentStyle={{ backgroundColor: theme.colors.inverseOnSurface }}
               outlineStyle={{ borderColor: theme.colors.inverseOnSurface }}
               onChangeText={onValueChangeTitle}
               mode="outlined"
               label="Untitled"
               // value={postState.title ? postState.title : "untitled"}
            />
            {/* <Text style={{ marginTop:15, fontFamily: "Poppins_400Regular",fontSize:13,color:theme.colors.secondary}}>
               Content
            </Text> */}
            <RichToolbar
               style={{
                  backgroundColor: theme.colors.inverseOnSurface,
                  paddingBottom: 0,
                  marginBottom: 0,
               }}
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
               editorStyle={{ backgroundColor: theme.colors.inverseOnSurface }}
               initialHeight={300}
               style={{ padding: 0, marginTop: 0 }}
               initialContentHTML="<b>Write your content here</b>"
               ref={richText}
               onChange={onValueChangeContent}
            />
            <View style={styles.buttonGroup}>
               <Button
                  style={[
                     styles.button,
                     { backgroundColor: theme.colors.inverseOnSurface },
                  ]}
                  mode="text"
                  onPress={() => setImageOpen(true)}>
                  <AntDesign size={20} name="picture" />
               </Button>
               <Button
                  style={[
                     styles.button,
                     { backgroundColor: theme.colors.inverseOnSurface },
                  ]}
                  mode="text"
                  onPress={() => setVideoOpen(true)}>
                  <AntDesign size={20} name="videocamera" />
               </Button>
               <Button
                  mode="contained"
                  onPress={() =>
                     firebaseUpload(
                        "BlogFiles",
                        postState.images || [postState.video]
                     )
                  }
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
