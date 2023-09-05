import React from "react";
import {
   Dimensions,
   KeyboardAvoidingView,
   ScrollView,
   StyleSheet,
   Text,
   View,
} from "react-native";
import { Button, TextInput, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type PersonalInfoRegistrationFormProps = {
   navigation: any;
   setActiveTab?: (index: number) => void;
};

const { width, height } = Dimensions.get("window");

const PersonalInfoRegistrationForm = ({
   navigation,
}: PersonalInfoRegistrationFormProps) => {
   let theme = useTheme();

   return (
      <ScrollView style={styles.form}>
         <TextInput
            mode="outlined"
            style={[
               styles.input,
               { backgroundColor: theme.colors.inverseOnSurface },
            ]}
            label="FirstName"
            inputMode="text"></TextInput>
         <TextInput
            mode="outlined"
            style={[
               styles.input,
               { backgroundColor: theme.colors.inverseOnSurface },
            ]}
            label="MiddleName"
            inputMode="text"></TextInput>
         <TextInput
            mode="outlined"
            style={[
               styles.input,
               { backgroundColor: theme.colors.inverseOnSurface },
            ]}
            label="LastName"
            inputMode="text"></TextInput>
         {/* <TextInput mode='outlined'  style={[styles.input,{backgroundColor: theme.colors.inverseOnSurface,}]} label='Gender' inputMode='text'  ></TextInput> */}
         {/* <RNDateTimePicker style={{backgroundColor:theme.colors.primary}} value={new Date()} mode='date' /> */}
         <TextInput
            mode="outlined"
            style={[
               styles.input,
               { backgroundColor: theme.colors.inverseOnSurface },
            ]}
            label="Password"
            inputMode="text"></TextInput>
         <TextInput
            mode="outlined"
            style={[
               styles.input,
               { backgroundColor: theme.colors.inverseOnSurface },
            ]}
            label="Confirm Password"
            inputMode="text"></TextInput>
         {/* <TextInput mode='outlined'  style={[styles.input,{backgroundColor: theme.colors.inverseOnSurface,}]} label='Pincode' inputMode='text'  ></TextInput>
            <TextInput mode='outlined'  style={[styles.input,{backgroundColor: theme.colors.inverseOnSurface,}]} label='Email' inputMode='email'></TextInput>
            <TextInput mode='outlined'  style={[styles.input,{backgroundColor: theme.colors.inverseOnSurface,}]} label='Permanent Address' inputMode='text'  ></TextInput>
            <TextInput mode='outlined'  style={[styles.input,{backgroundColor: theme.colors.inverseOnSurface,}]} label='Present Address' inputMode='text'></TextInput> */}
         <Button mode="contained" style={{ marginTop: 15 }}>
            Continue{" "}
            <MaterialCommunityIcons
               name="chevron-double-right"
               color="white"></MaterialCommunityIcons>
         </Button>
         <View
            style={{
               flexDirection: "row",
               marginTop: 15,
               gap: 5,
               alignItems: "center",
               justifyContent: "center",
            }}>
            <Text style={{ fontFamily: "Poppins_300Light_Italic" }}>
               Already have an account ?
            </Text>
            <Button
               onPress={() => navigation.navigate("LoginScreen")}
               mode="contained-tonal">
               Sign In
            </Button>
         </View>
      </ScrollView>
   );
};

export default PersonalInfoRegistrationForm;

const styles = StyleSheet.create({
   form: {
      paddingTop: 70,
   },
   input: {
      width: width - 60,
      marginBottom: 10,
      fontFamily: "Poppins_300Light",
   },
});
