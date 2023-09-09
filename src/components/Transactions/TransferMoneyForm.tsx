import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View, Alert } from "react-native";
import { Button, TextInput, useTheme } from "react-native-paper";
import axios from "axios";
import { useCurrentUser } from "../../utils/CustomHooks";

type TransferMoneyFormProps = {
   navigation: any;
};

const { width, height } = Dimensions.get("window");

const TransferMoneyForm = ({ navigation }: TransferMoneyFormProps) => {
   let theme = useTheme();
   const [showPassword, setShowPassword] = React.useState<boolean>(false);
   const [transfereeAccountNumber, setTransfereeAccountNumber] =
      useState<string>("");
   const currentUser = useCurrentUser();
   const [amount, setAmount] = useState<string>("");
   const [loading, setLoading] = useState<boolean>(false);

   const handleTransferMoney = async () => {
      setLoading(true);

      let postObj = {
         transfereeAccountNumber,
         transferorAccountNumber: currentUser?.accountNumber,
         amount,
      };
      try {
         let resp = await fetch(
            "http://192.168.1.98:5000/transactions/sendcommodity",
            {
               method: "POST",
               body: JSON.stringify(postObj),
               headers: { "Content-Type": "application/json" },
            }
         );
         let responseData = await resp.json();
         console.log(responseData);
         if (resp.status === 202) {
            console.log(responseData);
            setLoading(false);
            Alert.alert("Successful", responseData.message);
         } else {
            setLoading(false);
            Alert.alert("Failed", responseData.message);
         }
      } catch (err) {
         setLoading(false);
         console.log(err);
         Alert.alert("Failed", String(err));
      }

      // console.log(postState);
   };

   return (
      <View>
         <View style={styles.form}>
            <TextInput
               mode="outlined"
               outlineStyle={{ borderColor: theme.colors.inverseOnSurface }}
               style={[
                  styles.input,
                  { backgroundColor: theme.colors.inverseOnSurface },
               ]}
               label="To"
               value={transfereeAccountNumber}
               onChangeText={(value) => setTransfereeAccountNumber(value)}
               // inputMode="email"
               right={
                  <TextInput.Affix text="XXCOM.."></TextInput.Affix>
               }></TextInput>
            <TextInput
               mode="outlined"
               outlineStyle={{ borderColor: theme.colors.inverseOnSurface }}
               value={amount}
               style={[
                  styles.input,
                  { backgroundColor: theme.colors.inverseOnSurface },
               ]}
               onChangeText={(value) => setAmount(value)}
               label="Amount"
               //    inputMode='none'
               right={
                  <TextInput.Affix text="C 0.00"></TextInput.Affix>
               }></TextInput>
            <TextInput
               mode="outlined"
               outlineStyle={{ borderColor: theme.colors.inverseOnSurface }}
               style={[
                  styles.input,
                  { backgroundColor: theme.colors.inverseOnSurface },
               ]}
               label="Password"
               // inputMode="text"
               secureTextEntry={!showPassword}
               right={
                  <TextInput.Icon
                     icon={showPassword ? "eye" : "eye-off"}
                     onPress={() =>
                        setShowPassword(!showPassword)
                     }></TextInput.Icon>
               }></TextInput>
            <Button
               loading={loading}
               disabled={loading}
               onPress={handleTransferMoney}
               mode="contained"
               style={{ marginTop: 15 }}>
               Send
            </Button>
         </View>
      </View>
   );
};

export default TransferMoneyForm;

const styles = StyleSheet.create({
   form: {
      padding: 0,
   },
   input: {
      width: width - 40,
      marginBottom: 10,
      fontFamily: "Poppins_300Light",
   },
});
