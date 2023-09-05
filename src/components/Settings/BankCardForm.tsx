import React, { useReducer, useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, useTheme } from "react-native-paper";
import axios from "axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type BankCardState = {
   cardNumber: string;
   expiryDate: string;
   cvv: string;
   cardType: string;
   billingAddress: string;
   cashHolderName: string;
};

type BankCardAction = { type: string; payload: string };

const initialState: BankCardState = {
   cardNumber: "",
   expiryDate: "",
   cvv: "",
   cardType: "",
   billingAddress: "",
   cashHolderName: "",
};

const reducer = (
   state: BankCardState,
   action: BankCardAction
): BankCardState => {
   switch (action.type) {
      case "SET_CARD_NUMBER":
         return { ...state, cardNumber: action.payload };
      case "SET_EXPIRY_DATE":
         return { ...state, expiryDate: action.payload };
      case "SET_CVV":
         return { ...state, cvv: action.payload };
      case "SET_CARD_TYPE":
         return { ...state, cardType: action.payload };
      case "SET_BILLING_ADDRESS":
         return { ...state, billingAddress: action.payload };
      case "SET_CASH_HOLDER_NAME":
         return { ...state, cashHolderName: action.payload };
      case "RESET_FORM":
         return initialState;
      default:
         return state;
   }
};

const BankCardForm = () => {
   const [state, dispatch] = useReducer(reducer, initialState);
   const [loading, setLoading] = useState(false);
   const { colors } = useTheme();
   const theme = useTheme();

   const handleInputChange = (type: string, value: string) => {
      dispatch({ type, payload: value });
   };

   const handleAddBankCard = async () => {
      setLoading(true);

      try {
         const response = await axios.post(
            "http://192.168.1.93:5000/auth/bcards/",
            { ...state }
         );
         // Handle success
         setLoading(false);
         dispatch({ type: "RESET_FORM", payload: "" });
      } catch (error) {
         // Handle error
         setLoading(false);
      }
   };

   return (
      <View style={styles.container}>
         <TextInput
            outlineStyle={{ borderColor: theme.colors.inverseOnSurface }}
            activeOutlineColor={theme.colors.primary}
            style={[
               styles.input,
               { backgroundColor: theme.colors.inverseOnSurface },
            ]}
            label="Card Number"
            value={state.cardNumber}
            onChangeText={(value) =>
               handleInputChange("SET_CARD_NUMBER", value)
            }
            mode="outlined"
            left={
               <TextInput.Icon
                  icon={() => (
                     <MaterialCommunityIcons
                        name="credit-card"
                        size={24}
                        color={colors.primary}
                     />
                  )}
               />
            }
         />
         <TextInput
            outlineStyle={{ borderColor: theme.colors.inverseOnSurface }}
            activeOutlineColor={theme.colors.primary}
            style={[
               styles.input,
               { backgroundColor: theme.colors.inverseOnSurface },
            ]}
            label="Expiry Date"
            value={state.expiryDate}
            onChangeText={(value) =>
               handleInputChange("SET_EXPIRY_DATE", value)
            }
            mode="outlined"
            left={
               <TextInput.Icon
                  icon={() => (
                     <MaterialCommunityIcons
                        name="calendar-month"
                        size={24}
                        color={colors.primary}
                     />
                  )}
               />
            }
         />
         <TextInput
            outlineStyle={{ borderColor: theme.colors.inverseOnSurface }}
            activeOutlineColor={theme.colors.primary}
            style={[
               styles.input,
               { backgroundColor: theme.colors.inverseOnSurface },
            ]}
            label="CVV"
            value={state.cvv}
            onChangeText={(value) => handleInputChange("SET_CVV", value)}
            mode="outlined"
            left={
               <TextInput.Icon
                  icon={() => (
                     <MaterialCommunityIcons
                        name="lock"
                        size={24}
                        color={colors.primary}
                     />
                  )}
               />
            }
         />
         <TextInput
            outlineStyle={{ borderColor: theme.colors.inverseOnSurface }}
            activeOutlineColor={theme.colors.primary}
            style={[
               styles.input,
               { backgroundColor: theme.colors.inverseOnSurface },
            ]}
            label="Card Type"
            value={state.cardType}
            onChangeText={(value) => handleInputChange("SET_CARD_TYPE", value)}
            mode="outlined"
            left={
               <TextInput.Icon
                  icon={() => (
                     <MaterialCommunityIcons
                        name="credit-card-outline"
                        size={24}
                        color={colors.primary}
                     />
                  )}
               />
            }
         />
         <TextInput
            outlineStyle={{ borderColor: theme.colors.inverseOnSurface }}
            activeOutlineColor={theme.colors.primary}
            style={[
               styles.input,
               { backgroundColor: theme.colors.inverseOnSurface },
            ]}
            label="Billing Address"
            value={state.billingAddress}
            onChangeText={(value) =>
               handleInputChange("SET_BILLING_ADDRESS", value)
            }
            mode="outlined"
            left={
               <TextInput.Icon
                  icon={() => (
                     <MaterialCommunityIcons
                        name="map-marker-outline"
                        size={24}
                        color={colors.primary}
                     />
                  )}
               />
            }
         />
         <TextInput
            outlineStyle={{ borderColor: theme.colors.inverseOnSurface }}
            activeOutlineColor={theme.colors.primary}
            style={[
               styles.input,
               { backgroundColor: theme.colors.inverseOnSurface },
            ]}
            label="Cash Holder Name"
            value={state.cashHolderName}
            onChangeText={(value) =>
               handleInputChange("SET_CASH_HOLDER_NAME", value)
            }
            mode="outlined"
            left={
               <TextInput.Icon
                  icon={() => (
                     <MaterialCommunityIcons
                        name="account"
                        size={24}
                        color={colors.primary}
                     />
                  )}
               />
            }
         />

         <Button
            style={styles.button}
            mode="contained"
            loading={loading}
            disabled={loading}
            onPress={handleAddBankCard}>
            Add Bank Card
         </Button>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   input: {
      marginBottom: 10,
   },
   button: {
      marginTop: 16,
   },
});

export default BankCardForm;
