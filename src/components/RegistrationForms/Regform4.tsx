import { Theme } from "@rneui/themed";
import React from "react";
import {
   Dimensions,
   KeyboardAvoidingView,
   Image,
   StyleSheet,
   Text,
   View,
} from "react-native";
import { Button, TextInput, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setContactInfoForm } from "../../redux/action";

type Form4Props = {
   navigation: any;
   setActiveTab: (index: number) => void;
};

const { width, height } = Dimensions.get("window");

const Form4 = ({ navigation, setActiveTab }: Form4Props) => {
   let theme = useTheme();
   let state = useSelector((state: any) => state.rootReducer);
   let dispatch = useDispatch();

   const submitForm4 = () => {
      console.log("Form 4 submitted", state);
      setActiveTab(4);
   };

   return (
      <View>
         <Image
            resizeMode="stretch"
            style={{
               width: width - 10,
               height: "40%",
               marginBottom: 0,
               paddingBottom: 0,
            }}
            source={require("../../../assets/Illustrators/signin.png")}></Image>
         <View style={styles.form}>
            <TextInput
               onChangeText={(value) =>
                  dispatch(setContactInfoForm({ city: value }))
               }
               outlineStyle={{ borderColor: theme.colors.inverseOnSurface }}
               mode="outlined"
               style={[
                  styles.input,
                  { backgroundColor: theme.colors.inverseOnSurface },
               ]}
               label="city"
               inputMode="text"></TextInput>
            <TextInput
               onChangeText={(value) =>
                  dispatch(setContactInfoForm({ permanentAddress: value }))
               }
               outlineStyle={{ borderColor: theme.colors.inverseOnSurface }}
               mode="outlined"
               style={[
                  styles.input,
                  { backgroundColor: theme.colors.inverseOnSurface },
               ]}
               label="Permanent Adress"
               inputMode="text"></TextInput>
            <TextInput
               onChangeText={(value) =>
                  dispatch(setContactInfoForm({ currentAddress: value }))
               }
               outlineStyle={{ borderColor: theme.colors.inverseOnSurface }}
               mode="outlined"
               style={[
                  styles.input,
                  { backgroundColor: theme.colors.inverseOnSurface },
               ]}
               label="Current Address"
               inputMode="text"></TextInput>
            <View style={styles.buttonGroup}>
               <Button
                  mode="contained"
                  onPress={() => setActiveTab(2)}
                  style={styles.button}>
                  {/* <MaterialCommunityIcons
                     name="chevron-double-left"
                     color="white"></MaterialCommunityIcons>{" "} */}
                  BACK
               </Button>
               <Button
                  mode="contained"
                  onPress={() => submitForm4()}
                  style={styles.button}>
                  NEXT{" "}
                  {/* <MaterialCommunityIcons
                     name="chevron-double-right"
                     color="white"></MaterialCommunityIcons> */}
               </Button>
            </View>
            <Button
               mode="contained"
               onPress={submitForm4}
               style={{ marginTop: 15 }}>
               Continue{" "}
               {/* <MaterialCommunityIcons
                  name="chevron-double-right"
                  color="white"></MaterialCommunityIcons> */}
            </Button>
         </View>
      </View>
   );
};

export default Form4;

const styles = StyleSheet.create({
   form: {
      paddingTop: 0,
      alignItems: "center",
   },
   input: {
      width: width - 40,
      marginBottom: 10,
      fontFamily: "Poppins_300Light",
   },
   button: {
      width: width / 3,
      marginTop: 10,
      fontFamily: "Poppins_300Light",
   },
   buttonGroup: {
      flexDirection: "row",
      gap: 10,
   },
   checkBoxGroup: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      left: 0,
      gap: 20,
   },
   checkBoxGroupInner: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      gap: 0,
      margin: 10,
   },
});
