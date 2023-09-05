import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/ProfileScreen";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import FollowingsScreen from "../screens/FollowingsScreen";
import CustomHeader from "../components/CustomHeader";
import PostScreen from "../screens/PostScreen";
import FollowersScreen from "../screens/FollowersScreen";
import UserProfileScreen from "../screens/UserProfileScreen";
import TransferMoneyScreen from "../screens/TransferMoneyScreen";
import NotificationScreen from "../screens/NotificationScreen";
import TransfereesScreen from "../screens/TransfereesScreen";
import FullBlogComponent from "../screens/FullPostViewScreen";
import ChatScreen from "../screens/ChatScreen";
import SearchScreen from "../screens/SearchScreen";
// import ProductNotificationScreen from "../screens/ProductNotificationScreen";
// import ProductPostScreen from "../screens/ProductPostScreen";
import ConversationsScreen from "../screens/ConversationsScreen";
import { useNavigationState, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setPersonalInfoForm, setSocket } from "../redux/action";
import { useCurrentUser, useNetworkStatus } from "../utils/CustomHooks";
import { io, Socket } from "socket.io-client";
import { Alert } from "react-native";
import BuyCommodityScreen from "../screens/BuyCommodityScreen";
import FullSharedBlogComponent from "../screens/FullSharedPostViewScreen";

// import { createDrawerNavigator } from '@react-navigation/drawer';

const Stack = createNativeStackNavigator();
type HomeStackProps = {
   navigation: any;
};

// const drawer = createDrawerNavigator()

// const HomeStack = ()=>{
//   return( <drawer.Navigator>
//       <drawer.Screen name="HomeDrawer" component={DrawerContainer}></drawer.Screen>
//    </drawer.Navigator>)
// }

const RenderHeader = () => {
   const navigationState = useNavigationState((state) => state);
   const router = useRoute();

   if (router.name === "ChatScreen" || router.name === "CommentsViewerScreen")
      return null;
   return <CustomHeader />;
};

const HomeStack = (props: HomeStackProps) => {
   const [socket, _setSocket] = React.useState<Socket | null>(null);
   const isConnectedToInternet = useNetworkStatus();
   const currentUser = useCurrentUser();
   const dispatch = useDispatch();

   React.useEffect(() => {
      if (currentUser) {
         let newSocket = io(
            `http://192.168.1.93:8080/?userId=${currentUser.userId}`
         );
         _setSocket(newSocket);
         dispatch(setSocket(newSocket));

         // cleanup function to close the socket connection when the component unmounts
         return () => {
            newSocket.close();
         };
      }
   }, [currentUser]);

   return (
      <Stack.Navigator screenOptions={{ header: RenderHeader }}>
         <Stack.Screen name="HomeScreen" component={HomeScreen}></Stack.Screen>
         <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}></Stack.Screen>
         <Stack.Screen
            name="SettingsScreen"
            component={SettingsScreen}></Stack.Screen>
         <Stack.Screen name="PostScreen" component={PostScreen}></Stack.Screen>
         <Stack.Screen
            name="TransferMoneyScreen"
            component={TransferMoneyScreen}></Stack.Screen>
         <Stack.Screen
            name="NotificationScreen"
            component={NotificationScreen}></Stack.Screen>
         <Stack.Screen
            name="FollowersScreen"
            component={FollowersScreen}></Stack.Screen>
         <Stack.Screen
            name="TransfereesScreen"
            component={TransfereesScreen}></Stack.Screen>
         <Stack.Screen
            name="FollowingsScreen"
            component={FollowingsScreen}></Stack.Screen>
         <Stack.Screen
            name="UserProfileScreen"
            component={UserProfileScreen}></Stack.Screen>
         <Stack.Screen name="ChatScreen" component={ChatScreen}></Stack.Screen>
         <Stack.Screen
            name="FullPostViewScreen"
            component={FullBlogComponent}></Stack.Screen>
         <Stack.Screen
            name="FullSharedPostViewScreen"
            component={FullSharedBlogComponent}></Stack.Screen>
         <Stack.Screen
            name="ConversationsScreen"
            component={ConversationsScreen}></Stack.Screen>
         <Stack.Screen
            name="BuyCommodityScreen"
            component={BuyCommodityScreen}></Stack.Screen>
         <Stack.Screen
            name="SearchScreen"
            component={SearchScreen}></Stack.Screen>
      </Stack.Navigator>
   );
};

export default HomeStack;
