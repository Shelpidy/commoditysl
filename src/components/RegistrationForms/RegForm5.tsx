import React from "react";
import {
   Dimensions,
   KeyboardAvoidingView,
   Image,
   StyleSheet,
   Text,
   View,
   Alert,
} from "react-native";
import {
   ActivityIndicator,
   Button,
   IconButton,
   TextInput,
   useTheme,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import OTPTextInput from "../OTPTextInput";
import { TouchableHighlight } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";

type Form5Props = {
   navigation: any;
   setActiveTab: (index: number) => void;
};

const { width, height } = Dimensions.get("window");

const Form5 = ({ navigation, setActiveTab }: Form5Props) => {
   const [resetTimer, setResetTimer] = React.useState<any>("0");
   const [timer, setTimer] = React.useState<any>(60 * 3 + 1);
   let state = useSelector((state: any) => state.rootReducer);
   let theme = useTheme();
   const [verificationCode, setVerificationCode] = React.useState<
      string | number | null
   >(null);
   React.useEffect(() => {
      /// send email for verification
      console.log("Registration Data =>", state);
      let email = state?.personalInfo?.email;
   }, []);

   const verifyEmailCode = () => {
      Alert.alert("Email verified", "You have successfully verified");
      navigation.navigate("HomeStack", { screen: "HomeScreen" });
   };

   const submitForm5 = (n: number) => {
      console.log("Registraion Object =>", state);
      setActiveTab(n);
   };

   if (!verificationCode) {
      return (
         <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator />
         </View>
      );
   }
   return (
      <View>
         {/* <Image
            resizeMode="stretch"
            style={{
               width: width - 10,
               height: "40%",
               marginBottom: 0,
               marginTop: 12,
               paddingBottom: 0,
            }}
            source={require("../../../assets/Illustrators/ani-signup.gif")}></Image> */}
         <View style={styles.form}>
            <View style={{ flexDirection: "row", paddingHorizontal: 30 }}>
               <Text
                  style={{
                     fontFamily: "Poppins_300Light",
                     marginVertical: 10,
                  }}>
                  Enter the confirmation sent to the email{" "}
                  {state?.personalInfo?.emal}
               </Text>
               <TouchableHighlight>
                  <Text
                     style={{
                        fontFamily: "Poppins_300Light",
                        marginVertical: 10,
                        color: theme.colors.primary,
                     }}>
                     Edit Email
                  </Text>
               </TouchableHighlight>
            </View>
            <CountdownCircleTimer
               isPlaying
               duration={90}
               size={50}
               strokeWidth={5}
               colors={["#2047AA", "#FF0023"]}
               colorsTime={[60, 0]}>
               {({ remainingTime }) => (
                  <Text style={{ fontFamily: "Poppins_300Light" }}>
                     {remainingTime}
                  </Text>
               )}
            </CountdownCircleTimer>
            <OTPTextInput numberOfInput={5} size={45} />
            {/* <TextInput inputMode='numeric'  style={[styles.input,{backgroundColor: theme.colors.inverseOnSurface,}]} label='000000' mode='outlined'></TextInput> */}
            <Button mode="text" style={{ marginVertical: 15 }}>
               RESEND
            </Button>
            <View style={styles.buttonGroup}>
               <Button
                  mode="contained"
                  onPress={() => submitForm5(6)}
                  style={styles.button}>
                  <MaterialCommunityIcons
                     name="chevron-double-left"
                     color="white"></MaterialCommunityIcons>
                  BACK
               </Button>
               <Button
                  onPress={() => verifyEmailCode()}
                  mode="contained"
                  style={styles.button}>
                  CONTINUE
               </Button>
            </View>
         </View>
      </View>
   );
};

export default Form5;

const styles = StyleSheet.create({
   form: {
      paddingTop: 40,
      alignItems: "center",
   },
   input: {
      width: width - 40,
      marginBottom: 10,
      fontFamily: "Poppins_300Light",
   },
   button: {
      width: width / 2.5,
      marginTop: 10,
      fontFamily: "Poppins_300Light",
   },
   buttonGroup: {
      flexDirection: "row",
      gap: 10,
   },
});
