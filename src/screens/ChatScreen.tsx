// @ts-nocheck
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigationState } from "@react-navigation/native";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import {
   Alert,
   Image,
   KeyboardAvoidingView,
   Pressable,
   StatusBar,
   StyleSheet,
   TextInput,
   TouchableOpacity,
   View,
} from "react-native";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import {
   ActivityIndicator,
   Button,
   Divider,
   IconButton,
   ProgressBar,
   useTheme,
   Text,
} from "react-native-paper";
import TextEllipse from "../components/TextEllipse";
import { useCurrentUser, useNetworkStatus } from "../utils/CustomHooks";
import { Crypt } from "hybrid-crypto-js";
import { AVPlaybackStatus, Audio, ResizeMode, Video } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import config from ".././aws-config";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setSocket } from "../redux/action";
import { dateAgo } from "../utils/util";
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
// import { ImagePicker } from "expo-image-multiple-picker";
// import AWS from "aws-sdk";

let crypt = new Crypt();

type ChatBoxProps = {
   onSend: () => void;
   onTextInput: (v: string) => void;
   getFocused: (v: boolean) => void;
   openMediaPicker: () => void;
   openVideoPicker: () => void;
   handleIsRecording: (v: boolean) => void;
   sent: boolean;
};

// const s3 = new AWS.S3({
//    accessKeyId: config.accessKeyId,
//    secretAccessKey: config.secretAccessKey,
//    region: config.region,
// });

const ChatBox = ({
   onSend,
   onTextInput,
   getFocused,
   sent,
   openMediaPicker,
   handleIsRecording,
   openVideoPicker,
}: ChatBoxProps) => {
   const [text, setText] = useState<any>();
   const textInputRef = useRef<TextInput>(null);
   const [isFocused, setIsFocused] = useState<boolean>(false);
   const [recording, setRecording] = useState<boolean>(false);

   useEffect(() => {
      // console.log("Running");
      if (sent) {
         setText("");
         textInputRef?.current?.clear();
         textInputRef?.current?.blur();
      }
   }, [sent]);

   const handleTextChange = (v: any) => {
      setText(v);
      onTextInput(v);
   };

   const handleSend = () => {
      textInputRef?.current?.clear();
      textInputRef?.current?.blur();
      onSend();
   };

   const handleFocus = (v: any) => {
      // console.log({ focus: v });
      setIsFocused(v);
      getFocused(v);
   };

   const handleRecording = () => {
      setRecording(!recording);
      handleIsRecording(!recording);
   };

   const theme = useTheme();
   return (
      <KeyboardAvoidingView
         style={{
            paddingHorizontal: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
         }}>
         <View
            style={{
               flex: 1,
               flexDirection: "row",
               alignItems: "center",
               justifyContent: "center",
            }}>
            <TouchableOpacity
               style={{
                  paddingHorizontal: 20,
                  height: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  borderTopLeftRadius: 20,
                  borderBottomLeftRadius: 20,
                  backgroundColor: theme.colors.inverseOnSurface,
               }}
               onPress={openMediaPicker}>
               <Ionicons
                  color={theme.colors.secondary}
                  name="camera"
                  size={23}
               />
            </TouchableOpacity>
            <TouchableOpacity
               style={{
                  paddingHorizontal: 4,
                  height: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: theme.colors.inverseOnSurface,
               }}
               onPress={openVideoPicker}>
               <Ionicons
                  color={theme.colors.secondary}
                  name="videocam-outline"
                  size={23}
               />
            </TouchableOpacity>

            <TextInput
               multiline
               ref={textInputRef}
               onFocus={() => handleFocus(true)}
               onBlur={() => handleFocus(false)}
               value={text}
               placeholder="Type here..."
               onChangeText={handleTextChange}
               style={{
                  flex: 1,
                  fontFamily: "Poppins_300Light",
                  backgroundColor: theme.colors.inverseOnSurface,
                  height: 50,
                  paddingHorizontal: 25,
                  fontSize: 16,
               }}
            />
            {isFocused && (
               <TouchableOpacity
                  onPress={handleSend}
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
                     name="send-o"
                     size={23}
                  />
               </TouchableOpacity>
            )}
            {!isFocused && (
               <TouchableOpacity
                  onPress={handleRecording}
                  style={{
                     paddingHorizontal: 20,
                     height: 50,
                     alignItems: "center",
                     justifyContent: "center",
                     borderTopRightRadius: 20,
                     borderBottomRightRadius: 20,
                     backgroundColor: theme.colors.inverseOnSurface,
                  }}>
                  <Feather
                     name="mic"
                     color={recording ? "red" : theme.colors.secondary}
                     size={23}
                  />
               </TouchableOpacity>
            )}
         </View>
      </KeyboardAvoidingView>
   );
};

const ChatScreen = ({ route, navigation }: any) => {
   const [messages, setMessages] = useState<IMessage[] | null>(null);
   const theme = useTheme();
   const [fileUri, setFileUri] = useState<any>(null);
   const [textValue, setTextValue] = useState<string>("");
   const [inputFocus, setInputFocus] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(true);
   const [recording, setRecording] = useState<Audio.Recording | null>(null);
   const [socketRecording, setSocketRecording] = useState<boolean | null>(
      false
   );
   const currentUser = useCurrentUser();
   const [secondUser, setSecondUser] = useState<User>(route.params.user);
   const [sound, setSound] = useState<Audio.Sound | null>(null);
   const { socket } = useSelector((state: any) => state.rootReducer);
   const isOnline = useNetworkStatus();
   const [lastSeen, setLastSeen] = useState<string | Date>(
      route.params.user.lastSeenStatus
   );
   const [typing, setTyping] = useState<boolean | null>(false);
   const [gesture, setGesture] = useState<string>("");
   const [sent, setSent] = useState<boolean>(false);
   const [currentPage, setCurrentPage] = useState<number>(1);
   const [totalChats, setTotalChats] = useState<number>(0);
   const [numberOfChatsRecord, setNumberOfChatsRecord] = useState<number>(30);
   const navigationState = useNavigationState((state) => state);
   // const navigation = useNavigation<any>();
   const [imageOpen, setImageOpen] = useState<boolean>(false);
   const [videoOpen, setVideoOpen] = useState<boolean>(false);
   const [image, setImage] = useState<string | null>(null);
   const [audioRecording, setAudioRecording] = useState<boolean>(false);
   const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
   const [audio, setAudio] = useState<string | null>(null);
   const [downloadVideoProgress, setVideoDownloadProgress] = useState<
      number | null
   >(null);
   const [downloadImageProgress, setImageDownloadProgress] = useState<
      number | null
   >(null);
   const [downloadId, setDownloadId] = useState<number | string | null>(null);
   const [resetLastSeen, setResetLastSeen] = useState<number>(0);
   const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
   const [audioDuration, setAudioDuration] = useState<number | null>(null);
   const [audioCurentMillis, setAudioCurrentMillis] = useState<number | null>(
      null
   );
   const dispatch = useDispatch();

   ////// RECONNECT TO SOCKET FOR CHAT ////////////////////////////

   // React.useEffect(() => {
   //    if (currentUser) {
   //       let newSocket = io(
   //          `http://192.168.1.98:8080/?userId=${currentUser.userId}&roomId=${route.params?.roomId}`
   //       );
   //       dispatch(setSocket(newSocket));
   //       // cleanup function to close the socket connection when the component unmounts
   //       return () => {
   //          newSocket.close();
   //       };
   //    }
   // }, [currentUser]);

   //////////////////// ADD USER STATUS TO AS BEING IN THIS ROOM/////////////////

   useEffect(() => {
      if (socket && currentUser) {
         console.log("Activating room for ", currentUser.userId);
         let roomId = route.params?.roomId;
         socket.emit("activeRoom", {
            userId: currentUser.userId,
            roomId: roomId,
         });
      }
   }, [socket, currentUser]);

   //////////////////////////////// GET SECOND USER STATUS ///////////////////////////

   // useEffect(() => {
   //    if (route.params) {
   //       // console.log("Fetching status");
   //       let secUserId = route.params.userId;

   //       let fetchData = async () => {
   //          try {
   //             let {data,status} = await axios.get(
   //                `http://192.168.1.98:8080/status/${secUserId}`,
   //                {headers:{Authorization:`Bearer ${currentUser?.token}`}}

   //             );
   //             if (status === 200) {
   //                if (data.data.online) {
   //                   setLastSeen("online");
   //                } else {
   //                   let lastSeenDate = moment(data.data.updatedAt).fromNow();
   //                   setLastSeen(lastSeenDate);
   //                }
   //             } else {
   //                Alert.alert("Failed", data.message);
   //                setLoading(false)
   //             }
   //          } catch (err) {
   //             // console.log(err);
   //             Alert.alert("Failed", String(err));
   //             setLoading(false);
   //          }
   //       };
   //       fetchData();
   //    }
   // }, [resetLastSeen]);

   ///// LISTEN FOR WHEN A USER LEAVES THE SCREEN //////////

   useEffect(() => {
      const unsubscribe = navigation.addListener("blur", () => {
         console.log("User left the screen");
         // Perform actions when user leaves the screen
         if (socket && currentUser) {
            socket.emit("activeRoom", {
               userId: currentUser.userId,
               roomId: null,
            });
         }
      });

      return unsubscribe;
   }, [navigation, socket, currentUser]);

   // useEffect(() => {
   //    let secUser = route.params.user;
   //    // console.log(secUser);
   //    setSecondUser(secUser);
   // }, []);

   useEffect(() => {
      //// Updating Online Status//////////
      if (socket) {
         if (isOnline && currentUser) {
            socket.emit("online", {
               userId: currentUser.userId,
               online: isOnline,
            });
         }
      }
   }, [socket, isOnline, currentUser]);

   useEffect(() => {
      //// Updating Typing Status //////////
      if (socket) {
         console.log("Typing");
         if (currentUser) {
            socket.emit("typing", {
               userId: currentUser.userId,
               typing: inputFocus,
               roomId: route.params.roomId || "Didnt read roomId",
            });
         }
      }
   }, [socket, inputFocus]);

   useEffect(() => {
      //// Updating Typing Status //////////
      if (socket) {
         console.log("Recording");
         if (currentUser) {
            socket.emit("recording", {
               userId: currentUser.userId,
               typing: recording,
               roomId: route.params.roomId,
            });
         }
      }
   }, [socket, inputFocus]);

   useEffect(() => {
      if (secondUser) {
         console.log("Socket is running", String(secondUser?.userId));
         socket.on(String(secondUser?.userId), (data: any) => {
            console.log("From socket", data);
            if (data.online) {
               setLastSeen("online");
            } else {
               // let lastSeenDate = moment(data.updatedAt).fromNow();
               setLastSeen(moment(data.updatedAt).fromNow());
            }
         });
      }
   }, [socket, secondUser]);

   useEffect(() => {
      let secUserId = route.params.user.id;
      let activeUser = currentUser?.userId;
      let roomId = route.params.roomId;
      // console.log(roomId);
      // console.log("Socket connecting");

      if (socket) {
         socket.on("message", (msg: any) => {
            // console.log("Message from the server", msg);
         });

         ////////////////////  Chat message listener ///////////////

         socket.on("msg", async (message: IMessage) => {
            try {
               // Decrypt data with the private key
               console.log({ "From Server": message });
               if (message.text && currentUser) {
                  const privateKey = currentUser?.keys.privateKey;
                  console.log({ privateKey });
                  const decryptedData = await crypt.decrypt(
                     privateKey,
                     message.text
                  );

                  // console.log('Encrypted Data:', encryptedData);
                  console.log("Decrypted Data:", decryptedData);
                  message.text = decryptedData.message;
               }

               console.log("Decrypted From Server", message);

               setMessages((previousMessages) => {
                  if (previousMessages) {
                     return GiftedChat.append(previousMessages, [message]);
                  }
                  return GiftedChat.append([], [message]);
               });
            } catch (err) {
               console.log(err);
            }
         });

         ///////////// Online Status listener ///////////

         // socket.on("online", (data: any) => {
         //    // console.log("From Online", { online: data.online });
         //    if (data.userId == secondUser?.userId) {
         //       console.log("From Online", data);
         //       if (data.online) {
         //          setLastSeen("online");
         //       } else {
         //          let lastSeenDate = moment(data.updatedAt).fromNow();
         //          setLastSeen(data.updatedAt);
         //       }
         //       // setResetLastSeen(resetLastSeen + 1);
         //    }
         // });

         //////// Check or listen for typing status //////////

         socket.on("typing", (data: any) => {
            console.log("From Typing", { typing: data.typing });
            // if (data.userId == secUserId) {
            //    setGesture(data.typing ? "typing..." : "")
            //    // setTyping(data.typing);
            // }
         });

         ///////// check or listen for recording ///////////////

         socket.on("recording", (data: any) => {
            console.log("From Recording", { recording: data.recording });
            if (data.userId == secUserId) {
               setGesture(data.recording ? "recording..." : "");
               // setSocketRecording(data.recording);
            }
         });
      }
   }, [socket, currentUser]);

   /// GET ALL MESSAGES /////

   useEffect(() => {
      if (currentUser && currentPage) {
         // console.log("Fetching chats");
         let secUser = route.params.user.id;
         let activeUser = currentUser?.userId;
         let roomId = route.params?.roomId;

         let fetchData = async () => {
            try {
               let { data, status } = await axios.get(
                  `http://192.168.1.98:8080/messages/${roomId}?pageNumber=${currentPage}&numberOfRecords=${numberOfChatsRecord}`,
                  { headers: { Authorization: `Bearer ${currentUser?.token}` } }
               );
               if (status === 200) {
                  let privateKey = currentUser.keys.privateKey;
                  let { messages: chatMessages, count } = data.data;
                  // console.log("Chats Messages", chatMessages);
                  let decryptedMessages = await Promise.all(
                     chatMessages.map(async (message: IMessage) => {
                        if (message.text) {
                           message.text = crypt.decrypt(
                              privateKey,
                              message.text
                           ).message;
                        }
                        return message;
                     })
                  );

                  setTotalChats(count);
                  if (messages && currentPage > 1) {
                     setMessages([...messages, ...decryptedMessages]);
                  } else {
                     setMessages(decryptedMessages);
                  }
               } else {
                  Alert.alert("Failed", data.message);
               }
               setLoading(false);
            } catch (err) {
               // console.log(err);
               Alert.alert("Failed", String(err));
               setLoading(false);
            }
         };
         fetchData();
      }
   }, [currentUser, currentPage]);

   //////// REFRESH SOUND ////////////////////////////////

   useEffect(() => {
      return () => {
         if (sound) {
            sound.unloadAsync();
         }
      };
   }, []);

   /////////////// Pick Image ////////////////////////////
   const openImagePickerAsync = async () => {
      const permissionResult =
         await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
         Alert.alert(
            "Permission required",
            "Permission to access the media library is required."
         );
         return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync();

      if (pickerResult.canceled === true) {
         return;
      }

      // setImage(pickerResult.assets[0].uri);
      let image = await getFirebaseFileURL(
         "ChatFiles",
         pickerResult.assets[0].uri,
         "image"
      );
      await onSend(null, null, image);
      console.log("Image", image);
   };

   ////////////// Take picture /////////////////////////

   // const takePictureWithPermission = async () => {
   //    const { status } = await Camera.requestMicrophonePermissionsAsync();

   //    if (status !== "granted") {
   //       console.log("Camera permission not granted");
   //       return;
   //    }

   //    const camera = await Camera.getAvailableCameraTypesAsync();
   //    const uri = await camera[0];
   //    //  setImage(uri)
   //    console.log(uri);
   //    // Do something with the captured photo
   // };

   ////////////////////////////// Choose a video /////////////////////////

   const openVideoPickerAsync = async () => {
      const permissionResult =
         await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
         console.log("Permission to access the media library is required.");
         return;
      }
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      });
      if (!pickerResult.canceled) {
         // setSelectedVideo(pickerResult.assets[0].uri);
         let video = await getFirebaseFileURL(
            "ChatFiles",
            pickerResult.assets[0].uri,
            "video"
         );
         await onSend(null, video, null);
         console.log("Video", video);
      }
   };

   ///////////////////// Upload to firebase ///////////////////////

   async function getFirebaseFileURL(
      folderName: string = "ChatFiles",
      file: string,
      fileType: "image" | "video" | "audio"
   ) {
      try {
         const metadata = {
            contentType:
               fileType === "image"
                  ? "image/jpeg"
                  : fileType === "audio"
                  ? "audio/*"
                  : "video/*",
         };
         // var downloadURLs: string[] | null = null;
         console.log({ Images: file });

         // setProgress(0);
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
                     (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log("Upload is " + progress + "% done");
                  // setProgress(progress);
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
                  if (error) {
                     console.log("Firebase Error", { error });
                     Alert.alert("Failed to send file, try again");
                     return;
                  }
                  // Handle errors as before
               },
               async () => {
                  let downloadURL = await getDownloadURL(
                     uploadTask.snapshot.ref
                  );
                  // if (Array.isArray(downloadURLs)) {
                  //    downloadURLs.push(downloadURL);
                  // } else {
                  //    downloadURLs = [downloadURL];
                  // }

                  console.log("File available at", downloadURL);
                  resolve(downloadURL);
               }
            );
         });
      } catch (err) {
         setLoading(false);
         console.log({ Error: err });
         return Promise.reject("Failed to upload file to firebase");
      }
   }

   ///////////////////// start recording ///////////////////////////

   async function startRecording() {
      try {
         console.log("Requesting permissions..");
         await Audio.requestPermissionsAsync();
         await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
         });
         if (socket) {
            socket.emit("recording", {
               userId: currentUser?.userId,
               recording: true,
            });
         }
         console.log("Starting recording..");
         const { recording } = await Audio.Recording.createAsync(
            Audio.RecordingOptionsPresets.HIGH_QUALITY
         );
         setRecording(recording);
         console.log("Recording started");
      } catch (err) {
         console.error("Failed to start recording", err);
      }
   }

   ////////////////////////// stop recording //////////////////////////////////

   async function stopRecording() {
      try {
         console.log("Stopping recording..");
         if (socket) {
            socket.emit("recording", {
               userId: currentUser?.userId,
               recording: false,
            });
         }
         if (recording) {
            setRecording(null);
            await recording.stopAndUnloadAsync();
            await Audio.setAudioModeAsync({
               allowsRecordingIOS: false,
            });
            const uri = recording.getURI();
            if (uri) {
               let audio = await getFirebaseFileURL("ChatFiles", uri, "audio");
               await onSend(audio, null, null);
            }
            // setAudio(uri);

            console.log("Recording stopped and stored at", uri);
         }
      } catch (err) {
         console.log(err);
      }
   }

   const onSend = async (_audio?: any, _video?: any, _image?: any) => {
      try {
         console.log("Onsend loading");

         const secondUserPublicKey = secondUser?.EncryptionKey?.publicKey;
         let encryptedText = crypt.encrypt(secondUserPublicKey!, textValue);
         let roomId = route.params.roomId;
         let sendData = {
            senderId: currentUser?.userId,
            recipientId: route.params.user.userId,
            text: encryptedText,
            roomId: roomId,
            image: _image,
            video: _video,
            audio: _audio,
            notificationTokens: currentUser?.notificationTokens,
         };
         console.log(sendData, roomId);
         socket?.emit("msg", sendData);
         setTextValue("");
         setSent(true);
      } catch (err) {
         console.log(err);
      }
   };

   const handleEmojiSelect = (emoji: any) => {
      setTextValue(textValue + emoji);
   };

   const handleFocus = (val: boolean) => {
      // console.log({ Focused: val });
      if (socket && currentUser) {
         socket.emit("typing", { userId: currentUser.userId, typing: val });
      }
   };

   const gotoUserProfile = () => {
      if (currentUser?.userId === secondUser?.userId) {
         navigation.navigate("ProfileScreen", { userId: secondUser?.userId });
      } else {
         navigation.navigate("UserProfileScreen", {
            userId: secondUser?.userId,
         });
      }
   };

   if (!messages || !currentUser) {
      return (
         <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size={42} />
         </View>
      );
   }
   return (
      <View
         style={{
            flex: 1,
            marginBottom: 10,
            marginTop: StatusBar.currentHeight,
         }}>
         <View>
            {secondUser && (
               <View
                  style={{
                     flexDirection: "row",
                     alignItems: "center",
                     paddingTop: 18,
                     paddingBottom: 10,
                     paddingLeft: 15,
                     backgroundColor: theme.colors.primary,
                  }}>
                  <Ionicons
                     onPress={() => navigation.goBack()}
                     style={{ marginRight: 5 }}
                     name="md-arrow-back"
                     color={theme.colors.onPrimary}
                     size={20}
                  />
                  <Pressable onPress={gotoUserProfile}>
                     <Image
                        style={styles.profileImage}
                        source={{ uri: secondUser.profileImage }}
                     />
                  </Pressable>

                  <Text
                     variant="titleMedium"
                     numberOfLines={1}
                     style={{
                        textAlign: "center",
                        marginHorizontal: 3,
                        marginVertical: 10,
                        // fontFamily: "Poppins_500Medium",
                        color: theme.colors.inversePrimary,
                     }}>
                     {secondUser.fullName}
                  </Text>
                  {/* <TextEllipse
                        style={{
                           fontFamily: "Poppins_500Medium",
                           marginLeft: 5,
                           color: theme.colors.inverseOnSurface,
                        }}
                        text={secondUser.fullName}
                        textLength={10}
                     /> */}
                  <View
                     style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginRight: 2,
                     }}>
                     <Text
                        variant="bodySmall"
                        style={{
                           fontFamily: "Poppins_300Light",
                           color: theme.colors.secondary,
                           marginLeft: 10,
                        }}>
                        {gesture}
                     </Text>
                     {typeof lastSeen === typeof Date ? (
                        <Text
                           variant="bodySmall"
                           style={{
                              fontFamily: "Poppins_300Light",
                              color: theme.colors.inversePrimary,
                              marginRight: 10,
                              alignSelf: "flex-end",
                           }}>
                           {dateAgo(lastSeen as Date)}
                        </Text>
                     ) : (
                        <Text
                           variant="bodySmall"
                           style={{
                              fontFamily: "Poppins_300Light",
                              color: theme.colors.inversePrimary,
                              marginRight: 10,
                              alignSelf: "flex-end",
                           }}>
                           {lastSeen as string}
                        </Text>
                     )}
                  </View>
               </View>
            )}
         </View>
         <Divider />
         <View style={{ flex: 1, marginBottom: 20 }}>
            <GiftedChat
               renderInputToolbar={() => (
                  <ChatBox
                     openVideoPicker={async () => await openVideoPickerAsync()}
                     handleIsRecording={async (val: boolean) =>
                        val ? await startRecording() : await stopRecording()
                     }
                     openMediaPicker={async () => await openImagePickerAsync()}
                     sent={sent}
                     getFocused={handleFocus}
                     onSend={onSend}
                     onTextInput={(v) => setTextValue(v)}
                  />
               )}
               showUserAvatar
               // alwaysShowSend
               // renderAvatarOnTop
               // renderAvatar={}

               // renderAvatar = {() => null }
               renderBubble={(props) => {
                  ///////// Audion Playing ///////////////////////

                  const hanldeAudioModulation = async () => {};
                  const handlePlayAudio = async (audioUri: any) => {
                     try {
                        if (sound) {
                           await sound.unloadAsync();
                        }
                        const { sound: audioSound } =
                           await Audio.Sound.createAsync(
                              { uri: audioUri },
                              { shouldPlay: true },
                              onPlaybackStatusUpdate
                           );
                        setSound(audioSound);
                        setIsPlayingAudio(true);
                     } catch (error) {
                        console.log("Error playing audio:", error);
                     }
                  };
                  const handlePauseAudio = async () => {
                     try {
                        if (sound) {
                           setIsPlayingAudio(false);
                           await sound.pauseAsync();
                        }
                     } catch (error) {
                        console.log("Error pausing audio:", error);
                     }
                  };

                  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
                     if (
                        status.isLoaded &&
                        !status.isBuffering &&
                        status.durationMillis
                     ) {
                        setAudioDuration(
                           status.positionMillis / status.durationMillis
                        );
                     }
                  };

                  const handleDownload = async (name: string) => {
                     if (props.currentMessage) {
                        const { video, image, _id } = props.currentMessage;

                        if (video && name === "video") {
                           try {
                              const downloadResumable =
                                 FileSystem.createDownloadResumable(
                                    video,
                                    `${FileSystem.cacheDirectory}${
                                       video.split("/")[-1]
                                    }`,
                                    {},
                                    (downloadProgress) => {
                                       const progress =
                                          downloadProgress.totalBytesWritten /
                                          downloadProgress.totalBytesExpectedToWrite;
                                       setVideoDownloadProgress(progress);
                                       console.log(
                                          "New Video Progress",
                                          progress
                                       );
                                    }
                                 );

                              const downloadResult =
                                 await downloadResumable.downloadAsync();

                              console.log("Video downloaded:", downloadResult);
                              // Do something with the downloaded video file
                           } catch (error) {
                              console.log("Video download error:", error);
                           }
                        } else if (image && name === "image") {
                           try {
                              const downloadResumable =
                                 FileSystem.createDownloadResumable(
                                    image,
                                    `${FileSystem.cacheDirectory}${
                                       image.split("/")[-1]
                                    }`,
                                    {},
                                    (downloadProgress) => {
                                       const progress =
                                          downloadProgress.totalBytesWritten /
                                          downloadProgress.totalBytesExpectedToWrite;
                                       console.log(
                                          "New Image Progress",
                                          progress
                                       );
                                       setVideoDownloadProgress(progress);
                                    }
                                 );

                              const imgDownloadResult =
                                 await downloadResumable.downloadAsync();

                              console.log(
                                 "Image downloaded:",
                                 imgDownloadResult
                              );
                              // Do something with the downloaded image file
                           } catch (error) {
                              console.log("Image download error:", error);
                           }
                        }
                     }
                  };
                  return (
                     <Bubble
                        {...props}
                        textStyle={{
                           right: {
                              color: "#f9f9f9",
                              fontFamily: "Poppins_300Light",
                           },
                           left: {
                              color: theme.colors.primary,
                              fontFamily: "Poppins_300Light",
                           },
                        }}
                        renderMessageAudio={({ currentMessage }) =>
                           currentMessage &&
                           currentMessage?.audio !== undefined ? (
                              <View
                                 style={{
                                    paddingHorizontal: 15,
                                    flexDirection: "row",
                                    alignItems: "center",
                                 }}>
                                 <ProgressBar
                                    color={theme.colors.inversePrimary}
                                    style={{
                                       height: 6,
                                       borderRadius: 8,
                                       width: 200,
                                    }}
                                    progress={audioDuration ? audioDuration : 0}
                                 />
                                 <Text>{audioCurentMillis}</Text>
                                 {isPlayingAudio ? (
                                    <IconButton
                                       onPress={() => handlePauseAudio()}
                                       iconColor={theme.colors.inversePrimary}
                                       icon={"pause-circle"}
                                       size={30}
                                    />
                                 ) : (
                                    <IconButton
                                       onPress={() =>
                                          handlePlayAudio(currentMessage.audio)
                                       }
                                       iconColor={theme.colors.inversePrimary}
                                       icon={"play-circle"}
                                       size={30}
                                    />
                                 )}
                              </View>
                           ) : null
                        }
                        renderMessageImage={({ currentMessage }) => (
                           <View>
                              {/* <View style={{ paddingHorizontal: 5 }}>
                                 {!downloadImageProgress &&
                                    currentUser?.userId ==
                                       currentMessage?.user._id && (
                                       <Button
                                          onPress={async () =>
                                             await handleDownload("image")
                                          }
                                          mode="text">
                                          Download{" "}
                                          <Feather name="download" size={23} />
                                       </Button>
                                    )}
                                 {downloadImageProgress &&
                                    downloadImageProgress < 1 &&
                                    currentUser?.userId ==
                                       currentMessage?.user._id && (
                                       <View>
                                          <Text
                                             style={{
                                                textAlign: "center",
                                                color: theme.colors.secondary,
                                                fontFamily: "Poppins_300Light",
                                                marginVertical: 3,
                                             }}>
                                             Downloading...
                                          </Text>
                                          <ProgressBar
                                             style={{
                                                height: 12,
                                                borderRadius: 8,
                                             }}
                                             progress={downloadImageProgress}
                                          />
                                       </View>
                                    )}
                              </View> */}
                              <Image
                                 source={{ uri: currentMessage?.image }}
                                 style={{ width: 200, height: 200 }}
                              />
                           </View>
                        )}
                        renderMessageVideo={({ currentMessage }) =>
                           currentMessage && currentMessage?.video ? (
                              <View>
                                 {/* {!downloadVideoProgress &&
                                    currentUser?.userId ==
                                       currentMessage?.user._id && (
                                       <Button
                                          onPress={async () =>
                                             await handleDownload("video")
                                          }
                                          mode="text">
                                          Download{" "}
                                          <Feather name="download" size={23} />
                                       </Button>
                                    )}
                                 {downloadVideoProgress &&
                                    downloadVideoProgress < 1 &&
                                    currentUser?.userId ==
                                       currentMessage?.user._id && (
                                       <View>
                                          <Text
                                             style={{
                                                textAlign: "center",
                                                color: theme.colors.secondary,
                                                fontFamily: "Poppins_300Light",
                                                marginVertical: 3,
                                             }}>
                                             Downloading...
                                          </Text>
                                          <ProgressBar
                                             style={{
                                                height: 12,
                                                borderRadius: 8,
                                             }}
                                             progress={downloadVideoProgress}
                                          />
                                       </View>
                                    )} */}

                                 <Video
                                    useNativeControls
                                    resizeMode={ResizeMode.CONTAIN}
                                    isLooping
                                    source={{ uri: currentMessage?.video }}
                                    style={{
                                       width: 270,
                                       height: 200,
                                       margin: 0,
                                    }}
                                 />
                              </View>
                           ) : null
                        }
                        wrapperStyle={{
                           left: {
                              backgroundColor: theme.colors.secondaryContainer, // set your desired background color here
                           },
                           right: {
                              backgroundColor: theme.colors.primary, // set your desired background color here
                           },
                        }}
                     />
                  );
               }}
               inverted
               showAvatarForEveryMessage={true}
               messages={messages}
               user={{
                  _id: route.params.user.userId,
               }}
            />
         </View>
      </View>
   );
};

export default ChatScreen;

const styles = StyleSheet.create({
   profileImage: {
      width: 30,
      height: 30,
      borderRadius: 15,
   },
});
