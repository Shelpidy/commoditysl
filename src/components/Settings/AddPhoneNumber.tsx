import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Divider, useTheme } from "react-native-paper";
import axios from "axios";
import { useCurrentUser } from "../../utils/CustomHooks";

const PhoneNumberForm = () => {
   const [phoneNumber, setPhoneNumber] = useState("");
   const [loading, setLoading] = useState(false);
   const currentUser = useCurrentUser();
   const theme = useTheme();

   const handleAddPhoneNumber = async () => {
      setLoading(true);

      try {
         const response = await axios.put(
            "http://192.168.1.98:5000/auth/users/contact/",
            {
               key: "phoneNumbers",
               value: phoneNumber,
               userId: currentUser?.userId, // Replace with the actual user ID
            }
         );

         if (response.status === 202) {
            Alert.alert("Success", "Phone number added successfully");
         } else {
            Alert.alert("Error", "Failed to add phone number");
         }
      } catch (error) {
         console.log(error);
         Alert.alert("Error", "An error occurred while adding phone number");
      }

      setLoading(false);
   };

   return (
      <View style={styles.container}>
         <TextInput
            outlineStyle={{ borderColor: theme.colors.inverseOnSurface }}
            label="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            mode="outlined"
            style={[
               styles.input,
               { backgroundColor: theme.colors.inverseOnSurface },
            ]}
         />

         <Button
            mode="contained"
            onPress={handleAddPhoneNumber}
            loading={loading}
            disabled={loading}>
            Add Phone Number
         </Button>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      marginVertical: 5,
   },
   input: {
      marginBottom: 10,
   },
});

export default PhoneNumberForm;
