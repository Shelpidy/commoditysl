import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Divider, useTheme } from "react-native-paper";
import axios from "axios";
import { useCurrentUser } from "../../utils/CustomHooks";
import { useToast } from "react-native-toast-notifications";

const PhoneNumberForm = () => {
   const [phoneNumber, setPhoneNumber] = useState("");
   const [loading, setLoading] = useState(false);
   const currentUser = useCurrentUser();
   const theme = useTheme();
   const toast = useToast()

   const handleAddPhoneNumber = async () => {
      setLoading(true);

      try {
         const response = await axios.put(
            "http://192.168.1.98:5000/auth/users/contact/",
            {
               key: "phoneNumber",
               value:phoneNumber,
            },
            { headers: { Authorization: `Bearer ${currentUser?.token}` } }
         );

         if (response.status === 202) {
            toast.show("Phonenumber updated", {
               type: "normal",
               placement: "top",
               duration:2000
            });
         } else {
            toast.show("Failed to update", {
               type: "normal",
               placement: "top",
               duration:2000
            });
         }
      } catch (error) {
         console.log(error);
         toast.show("Failed to update", {
            type: "normal",
            placement: "top",
            duration:2000
         });
      }finally{
         setLoading(false);
      }

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
            Save
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
