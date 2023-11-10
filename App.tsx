// import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { View, Text, LogBox } from "react-native";
import {
   NavigationContainer,
   // adaptNavigationTheme,
   DarkTheme as NavigationDarkTheme,
   DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import {
   MD3Colors,
   MD3DarkTheme,
   MD3LightTheme,
   adaptNavigationTheme,
   useTheme,
} from "react-native-paper";
import merge from "deepmerge";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
   Provider as PaperProvider,
   MD3LightTheme as DefaultTheme,
} from "react-native-paper";
import React, { useState } from "react";
import * as Notifications from "expo-notifications";
import {
   useFonts,
   Poppins_100Thin,
   Poppins_100Thin_Italic,
   Poppins_200ExtraLight,
   Poppins_200ExtraLight_Italic,
   Poppins_300Light,
   Poppins_300Light_Italic,
   Poppins_400Regular,
   Poppins_400Regular_Italic,
   Poppins_500Medium,
   Poppins_500Medium_Italic,
   Poppins_600SemiBold,
   Poppins_600SemiBold_Italic,
   Poppins_700Bold,
   Poppins_700Bold_Italic,
   Poppins_800ExtraBold,
   Poppins_800ExtraBold_Italic,
   Poppins_900Black,
   Poppins_900Black_Italic,
} from "@expo-google-fonts/poppins";
import HomeStack from "./src/stacks/HomeStack";
import AuthStack from "./src/stacks/AuthStack";
import StartUpLoadingScreen from "./src/screens/StartUpLoadingScreen";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import * as Linking from "expo-linking";
import * as TaskManager from "expo-task-manager";
import { ToastProvider } from "react-native-toast-notifications";

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

TaskManager.defineTask(
   BACKGROUND_NOTIFICATION_TASK,
   ({ data, error, executionInfo }) => {
      console.log("Received a notification in the background!");
      // Do something with the notification data
   }
);

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

// 192.168.0.102

const MainStack = createNativeStackNavigator();

const { LightTheme, DarkTheme } = adaptNavigationTheme({
   reactNavigationLight: NavigationDefaultTheme,
   reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);

const linking = {
   prefixes: [Linking.createURL("/"), "com.commodity.sl"],
   config: {
      screens: {
         AuthStack: {
            path: "auth",
            screens: {
               LoginScreen: "login",
               RegistrationScreen: "register",
               RegistrationEmailVerificationScreen: "register/verify",
            },
         },
         HomeStack: {
            path: "/",
            screens: {
               HomeScreen: "home",
               ProfileScreen: "profile",
               SettingsScreen: "settings",
               PostScreen: "posts",
               TransferMoneyScreen: "transfer-money",
               NotificationScreen: "notifications",
               FollowersScreen: "followers",
               TransfereesScreen: "transferees",
               FollowingsScreen: "followings",
               UserProfileScreen: "user-profile",
               CommentsViewerScreen: "comments-viewer",
               FullPostViewScreen: "full-post-view",
               FullSharedPostViewScreen: "full-shared-post-view",
               ConversationsScreen: "conversations",
               BuyCommodityScreen: "buy-commodity",
               SearchScreen: "search",
               ChatScreen: "chats",
            },
            // Add other route names and their corresponding URLs here
         },
      },
   },
   async getInitialURL() {
      // First, you may want to do the default deep link handling
      // Check if app was opened from a deep link
      const url = await Linking.getInitialURL();

      if (url != null) {
         return url;
      }

      // Handle URL from expo push notifications
      const response = await Notifications.getLastNotificationResponseAsync();

      return response?.notification.request.content.data.url;
   },
   subscribe(listener: any) {
      const onReceiveURL = ({ url }: { url: string }) => listener(url);

      // Listen to incoming links from deep linking
      const eventListenerSubscription = Linking.addEventListener(
         "url",
         onReceiveURL
      );

      // Listen to expo push notifications
      const subscription =
         Notifications.addNotificationResponseReceivedListener((response) => {
            const url = response.notification.request.content.data.url;

            // Any custom logic to see whether the URL needs to be handled
            //...

            // Let React Navigation handle the URL
            listener(url);
         });
      return () => {
         // Clean up the event listeners
         eventListenerSubscription.remove();
         subscription.remove();
      };
   },
};

function LayoutContainer({ toggleTheme }: { toggleTheme: () => void }) {
   const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

   const hanleToggleTheme = () => {
      setIsDarkMode(!isDarkMode);
      toggleTheme();
   };

   let newTheme = useTheme();
   return (
      <NavigationContainer
         theme={isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme}
         linking={linking}>
         <StatusBar
            backgroundColor={newTheme.colors.primary}
            style="light"></StatusBar>
         <MainStack.Navigator screenOptions={{ headerShown: false }}>
            <MainStack.Screen
               name="AuthStack"
               component={AuthStack}></MainStack.Screen>
            <MainStack.Screen
               name="HomeStack"
               component={HomeStack}></MainStack.Screen>
         </MainStack.Navigator>
      </NavigationContainer>
   );
}

//////////////////////////////// MAIN APP//////////////////////////

export default function App() {
   const [loading, setLoading] = React.useState(true);
   const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
   LogBox.ignoreAllLogs();
   let [fontsLoaded] = useFonts({
      Poppins_100Thin,
      Poppins_100Thin_Italic,
      Poppins_200ExtraLight,
      Poppins_200ExtraLight_Italic,
      Poppins_300Light,
      Poppins_300Light_Italic,
      Poppins_400Regular,
      Poppins_400Regular_Italic,
      Poppins_500Medium,
      Poppins_500Medium_Italic,
      Poppins_600SemiBold,
      Poppins_600SemiBold_Italic,
      Poppins_700Bold,
      Poppins_700Bold_Italic,
      Poppins_800ExtraBold,
      Poppins_800ExtraBold_Italic,
      Poppins_900Black,
      Poppins_900Black_Italic,
   });

   React.useEffect(() => {
      setTimeout(() => {
         setLoading(false);
      }, 4000);
   }, []);

   if (loading && !fontsLoaded) {
      return <StartUpLoadingScreen />;
   }
   return (
      <Provider store={store}>
         <PaperProvider theme={CombinedDefaultTheme}>
            <ToastProvider offset={50} normalColor="rgba(0,0,0,0.5)">
               <LayoutContainer
                  toggleTheme={() => setIsDarkMode(!isDarkMode)}
               />
            </ToastProvider>
         </PaperProvider>
      </Provider>
   );
}
