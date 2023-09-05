import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, useTheme } from "react-native-paper";
import axios from "axios";
import { useCurrentUser } from "../../utils/CustomHooks";

const LastNameForm = () => {
   const [lastName, setLastName] = useState("");
   const [loading, setLoading] = useState(false);
   const currentUser = useCurrentUser();
   const theme = useTheme();

   const handleUpdate = async () => {
      setLoading(true);

      try {
         const response = await axios.put(
            "http://192.168.1.93:5000/auth/users/personal/",
            {
               key: "lastName",
               value: lastName,
               userId: currentUser?.userId, // Replace with the actual user ID
            }
         );

         if (response.status === 202) {
            Alert.alert("Success", "Last name changed successfully");
         } else {
            Alert.alert("Error", "Failed to change last name");
         }
      } catch (error) {
         console.log(error);
         Alert.alert("Error", "An error occurred while changing last name");
      }

      setLoading(false);
   };

   return (
      <View>
         <TextInput
            label="Last Name"
            outlineStyle={{ borderColor: theme.colors.inverseOnSurface }}
            value={lastName}
            onChangeText={setLastName}
            mode="outlined"
            style={[
               styles.input,
               { backgroundColor: theme.colors.inverseOnSurface },
            ]}
         />

         <Button
            mode="contained"
            onPress={handleUpdate}
            loading={loading}
            disabled={loading}>
            Save Last Name
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

export default LastNameForm;
