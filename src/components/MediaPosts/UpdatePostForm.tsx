import { StyleSheet, Text, View, Alert, Modal } from "react-native";
import React, { useState, useEffect, useReducer, useMemo } from "react";
import { Button, TextInput, useTheme } from "react-native-paper";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { ImagePicker } from "expo-image-multiple-picker";
import { useCurrentUser } from "../../utils/CustomHooks";
import { useNavigation } from "@react-navigation/native";
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

const initialState: Partial<Blog> = {};

const postReducer = (state: Partial<Blog> = initialState, action: Action) => {
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
      case "ID":
         return { ...state, id: action.payload };
      case "USERID":
         return { ...state, userId: action.payload };
      default:
         return state;
   }
};

type NBlogComponentProps = Blog;

const UpdatePostForm = (blog: NBlogComponentProps) => {
   const [loading, setLoading] = useState<boolean>(false);
   const [postState, postDispatch] = useReducer(postReducer, initialState);
   const [imageOpen, setImageOpen] = useState(false);
   const [videoOpen, setVideoOpen] = useState(false);
   const currentUser = useCurrentUser();
   const [progress, setProgress] = useState<number>(0);
   let chooseFile = React.useRef<boolean>(false);
   const theme = useTheme();
   const navigation = useNavigation<any>();
   const richText = React.useRef<any>(null);

   useEffect(() => {
      postDispatch({ type: "TEXT", payload: blog.text });
      postDispatch({ type: "TITLE", payload: blog.title });
      postDispatch({ type: "IMAGES", payload: blog.images });
      postDispatch({ type: "ID", payload: blog.blogId });
      postDispatch({ type: "USERID", payload: blog.userId });
   }, []);

   const handleUpdate = async (
      fileURLs: string[] | null = null,
      fileType: "image" | "video" = "image"
   ) => {
      let activeUserId = currentUser?.userId;
      setLoading(true);
      let postObj = {
         ...postState,
         userId: activeUserId,
         images: fileType === "image" ? fileURLs : postState.images,
         video: fileType === "video" ? fileURLs?.[0] : postState.video,
      };

      console.log(postObj);
      try {
         let response = await axios.put(
            `http://192.168.1.98:6000/blogs/${blog.blogId}`,
            postObj,
            { headers: { Authorization: `Bearer ${currentUser?.token}` } }
         );
         if (response.status === 202) {
            console.log(response.data);
            setLoading(false);
            Alert.alert("Successful", "Update successfully.");
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

   async function firebaseUpload(
      folderName: string = "Image",
      files?: string[]
   ) {
      try {
         if (chooseFile.current === false) {
            handleUpdate();
            return;
         }
         let fileType: "image" | "video" = postState.images
            ? "image"
            : postState.video
            ? "video"
            : "image";
         const metadata = {
            contentType: fileType === "image" ? "image/jpeg" : "video/*",
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

         await handleUpdate(downloadURLs, fileType);
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
      chooseFile.current = true;
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
      chooseFile.current = true;
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
      <View style={{ borderRadius: 3, margin: 8, backgroundColor: "#ffffff" }}>
         <Modal visible={imageOpen}>
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
         <View style={styles.formContainer}>
            <Text
               style={{
                  textAlign: "center",
                  marginBottom: 4,
                  fontFamily: "Poppins_500Medium",
               }}>
               Update Post
            </Text>
            <TextInput
               contentStyle={{ backgroundColor: theme.colors.inverseOnSurface }}
               outlineStyle={{ borderColor: theme.colors.inverseOnSurface }}
               onChangeText={onValueChangeTitle}
               mode="outlined"
               label="Title"
               value={postState.title}
            />

            <Text style={{ marginTop: 5, fontFamily: "Poppins_300Light" }}>
               Content
            </Text>
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
               initialHeight={200}
               initialContentHTML={postState.text}
               ref={richText}
               onChange={onValueChangeContent}
            />
            <Text
               style={{
                  textAlign: "center",
                  marginTop: 10,
                  fontFamily: "Poppins_300Light",
               }}>
               Choose Image or Video
            </Text>
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
                  Update
               </Button>
            </View>
         </View>
      </View>
   );
};

export default UpdatePostForm;

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
