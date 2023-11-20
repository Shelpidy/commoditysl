import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, useTheme } from "react-native-paper";
import axios from "axios";
import { useCurrentUser } from "../../utils/CustomHooks";
import { useToast } from "react-native-toast-notifications";

const FirstNameForm = () => {
   const [firstName, setFirstName] = useState("");
   const [loading, setLoading] = useState(false);
   const currentUser = useCurrentUser();
   const theme = useTheme();
   const toast = useToast()
  

   const handleUpdate = async () => {
      setLoading(true);

      try {
         const response = await axios.put(
            "http://192.168.1.98:5000/auth/users/personal/",
            {
               key: "firstName",
               value: firstName,
            },
            { headers: { Authorization: `Bearer ${currentUser?.token}` } }
         );

         if (response.status === 202) {
            toast.show("Firstname updated", {
               type: "normal",
               placement: "top",
               duration:2000
            });
         } else {
            toast.show("Update Failed", {
               type: "normal",
               placement: "top",
               duration:2000
            });
         }
      } catch (error) {
         console.log(error);
         toast.show("Update Failed", {
            type: "normal",
            placement: "top",
            duration:2000
         });
      }finally{
         setLoading(false);
      };

   }

   return (
      <View>
         <TextInput
            outlineStyle={{ borderColor: theme.colors.inverseOnSurface }}
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
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
            Save
         </Button>
      </View>
   );
};

const styles = StyleSheet.create({
   input: {
      marginBottom: 10,
   },
});

export default FirstNameForm;
