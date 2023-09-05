import {
   StyleSheet,
   Text,
   View,
   ScrollView,
   KeyboardAvoidingView,
   Platform,
} from "react-native";
import React from "react";
import PersonalInfoRegistrationForm from "../components/MediaPosts/RegistrationFormPersonal";
import { Button } from "react-native-paper";
import Form1 from "../components/RegistrationForms/RegForm1";
import PositionIndicator from "../components/PositionIndicator";
import Form2 from "../components/RegistrationForms/RegForm2";
import Form3 from "../components/RegistrationForms/RegForm3";
import Form4 from "../components/RegistrationForms/Regform4";
import Form5 from "../components/RegistrationForms/RegForm5";
import PhoneNumberForm from "../components/RegistrationForms/PhoneNumberForm";

// import { ScrollView } from "react-native-gesture-handler";

type RegistrationScreenProps = {
   navigation: any;
};

const RegistrationScreen = (props: RegistrationScreenProps) => {
   const [activeFormPosition, setActiveFormPosition] = React.useState(0);
   return (
      <KeyboardAvoidingView
         behavior={Platform.OS === "ios" ? "padding" : "height"}
         style={styles.container}>
         <View>
            <PositionIndicator
               position={activeFormPosition}
               numberOfPosition={5}
            />
         </View>
         {activeFormPosition === 0 && (
            <Form1 setActiveTab={setActiveFormPosition} {...props} />
         )}
         {activeFormPosition === 1 && (
            <Form2 setActiveTab={setActiveFormPosition} {...props} />
         )}
         {activeFormPosition === 2 && (
            <Form3 setActiveTab={setActiveFormPosition} {...props} />
         )}
         {activeFormPosition === 3 && (
            <Form4 setActiveTab={setActiveFormPosition} {...props} />
         )}
         {activeFormPosition === 4 && (
            <PhoneNumberForm
               formPosition={5}
               logo="../../../assets/Illustrators/siginin.png"
               setActiveTab={setActiveFormPosition}
               {...props}
            />
         )}
         {/* {activeFormPosition === 5 && (
            <PhoneNumberForm
               formPosition={6}
               logo="siginin.png"
               setActiveTab={setActiveFormPosition}
               {...props}
            />
         )}
         {activeFormPosition === 6 && (
            <PhoneNumberForm
               formPosition={7}
               logo="siginin.png"
               setActiveTab={setActiveFormPosition}
               {...props}
            />
         )} */}
         {activeFormPosition === 5 && (
            <Form5 setActiveTab={setActiveFormPosition} {...props} />
         )}
      </KeyboardAvoidingView>
   );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      top: 70,
      //   justifyContent: "center",
      fontFamily: "Poppins_300Light",
   },
});
