import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, useTheme } from "react-native-paper";
import axios, { AxiosError } from "axios";
import { useCurrentUser } from "../../utils/CustomHooks";

const ChangePasswordForm = () => {
   const [oldPassword, setOldPassword] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);
   const [loading, setLoading] = useState(false);
   const currentUser = useCurrentUser();
   const theme = useTheme();

   const handleCheckPassword = async () => {
      try {
         const response = await axios.post(
            "http://192.168.1.93:5000/auth/users/checkpassword/",
            {
               password: oldPassword,
               userId: currentUser?.userId, // Replace with the actual user ID
            }
         );

         if (response.status === 422) {
            Alert.alert("Error", response.data.message);
         } else if (response.status === 202) {
            // Password is valid, proceed with the update
            await handleUpdate();
         } else {
            Alert.alert("Error", response.data.message);
         }
      } catch (error) {
         if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response && axiosError.response.status === 422) {
               console.log("Validation Error:", axiosError.response.data);
               // You can access the error response data, such as error messages, from axiosError.response.data
            } else {
               console.log("Error:", axiosError.message);
            }
         } else {
            console.log("Error:", error);
         }
         console.log(error);
      }
   };

   const handleUpdate = async () => {
      if (password !== confirmPassword) {
         Alert.alert("Error", "Passwords do not match");
         return;
      }

      setLoading(true);

      try {
         const response = await axios.put(
            "http://192.168.1.93:5000/auth/users/personal/",
            {
               key: "password",
               value: password,
               userId: currentUser?.userId, // Replace with the actual user ID
            }
         );

         if (response.status === 202) {
            Alert.alert("Success", "Password changed successfully");
         } else {
            Alert.alert("Error", "Failed to change password");
         }
      } catch (error) {
         console.log(error);
         Alert.alert("Error", "An error occurred while changing password");
      }

      setLoading(false);
   };

   return (
      <View style={styles.container}>
         <TextInput
            outlineStyle={{ borderColor: theme.colors.inverseOnSurface }}
            label="Old Password"
            value={oldPassword}
            onChangeText={setOldPassword}
            mode="outlined"
            style={[
               styles.input,
               { backgroundColor: theme.colors.inverseOnSurface },
            ]}
            secureTextEntry={!showPassword}
            right={
               <TextInput.Icon
                  icon={showPassword ? "eye" : "eye-off"}
                  onPress={() => setShowPassword(!showPassword)}
               />
            }
         />

         <TextInput
            outlineStyle={{ borderColor: theme.colors.inverseOnSurface }}
            label="New Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={[
               styles.input,
               { backgroundColor: theme.colors.inverseOnSurface },
            ]}
            secureTextEntry={!showPassword}
            right={
               <TextInput.Icon
                  icon={showPassword ? "eye" : "eye-off"}
                  onPress={() => setShowPassword(!showPassword)}
               />
            }
         />

         <TextInput
            outlineStyle={{ borderColor: theme.colors.inverseOnSurface }}
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            style={[
               styles.input,
               { backgroundColor: theme.colors.inverseOnSurface },
            ]}
            secureTextEntry={!showPassword}
            right={
               <TextInput.Icon
                  icon={showPassword ? "eye" : "eye-off"}
                  onPress={() => setShowPassword(!showPassword)}
               />
            }
         />

         <Button
            mode="contained"
            onPress={handleCheckPassword}
            loading={loading}
            disabled={loading}>
            Save Password
         </Button>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      marginVertical: 10,
   },
   input: {
      marginBottom: 10,
   },
});

export default ChangePasswordForm;
