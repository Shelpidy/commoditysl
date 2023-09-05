import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Divider, useTheme } from "react-native-paper";
import axios from "axios";
import { useCurrentUser } from "../../utils/CustomHooks";

const MiddleNameForm = () => {
   const [middleName, setMiddleName] = useState("");
   const [loading, setLoading] = useState(false);
   const currentUser = useCurrentUser();
   const theme = useTheme();

   const handleUpdate = async () => {
      setLoading(true);

      try {
         const response = await axios.put(
            "http://192.168.1.93:5000/auth/users/personal/",
            {
               key: "middleName",
               value: middleName,
               userId: currentUser?.userId, // Replace with the actual user ID
            }
         );

         if (response.status === 202) {
            Alert.alert("Success", "Middle name changed successfully");
         } else {
            Alert.alert("Error", "Failed to change middle name");
         }
      } catch (error) {
         console.log(error);
         Alert.alert("Error", "An error occurred while changing middle name");
      }

      setLoading(false);
   };

   return (
      <View>
         <TextInput
            outlineStyle={{ borderColor: theme.colors.inverseOnSurface }}
            label="Middle Name"
            value={middleName}
            onChangeText={setMiddleName}
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
            Save Middle Name
         </Button>
         <Divider />
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

export default MiddleNameForm;
