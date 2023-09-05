import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Appbar, Divider, List } from "react-native-paper";
import FirstNameForm from "../components/Settings/FirstName";
import LastNameForm from "../components/Settings/LastName";
import MiddleNameForm from "../components/Settings/MiddleName";
import ChangePasswordForm from "../components/Settings/ChangePasswordForm";
import PhoneNumberForm from "../components/Settings/AddPhoneNumber";
import PinCodeForm from "../components/Settings/AddPinCode";
import BankCardForm from "../components/Settings/BankCardForm";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

const SettingScreen = () => {
   const [expandedSection, setExpandedSection] = useState("");

   const handleSectionPress = (section: any) => {
      if (expandedSection === section) {
         setExpandedSection("");
      } else {
         setExpandedSection(section);
      }
   };

   return (
      <ScrollView style={styles.container}>
         <View style={styles.content}>
            <List.Section>
               <List.Subheader
                  style={{
                     fontFamily: "Poppins_600SemiBold",
                     fontSize: 16,
                     textAlign: "center",
                  }}>
                  <MaterialCommunityIcons
                     size={23}
                     name="account-cog-outline"
                  />{" "}
                  General
               </List.Subheader>
               <Divider />
               <List.Item
                  titleStyle={styles.headerTitle}
                  title="First Name"
                  left={(props) => <List.Icon {...props} icon="account" />}
                  onPress={() => handleSectionPress("firstname")}
               />
               <View style={styles.collapse}>
                  <FirstNameForm />
               </View>

               <List.Item
                  titleStyle={styles.headerTitle}
                  title="Middle Name"
                  left={(props) => <List.Icon {...props} icon="account" />}
                  onPress={() => handleSectionPress("middlename")}
               />
               <View style={styles.collapse}>
                  <MiddleNameForm />
               </View>

               <List.Item
                  titleStyle={styles.headerTitle}
                  title="Last Name"
                  left={(props) => <List.Icon {...props} icon="account" />}
                  onPress={() => handleSectionPress("lastname")}
               />
               <View style={styles.collapse}>
                  <LastNameForm />
               </View>
            </List.Section>
            <List.Section>
               <List.Subheader
                  style={{
                     fontFamily: "Poppins_600SemiBold",
                     fontSize: 16,
                     textAlign: "center",
                  }}>
                  <MaterialCommunityIcons size={23} name="phone-plus-outline" />{" "}
                  Contact Info{" "}
               </List.Subheader>
               <Divider />
               <List.Item
                  titleStyle={styles.headerTitle}
                  title="Add Phone Number"
                  left={(props) => <List.Icon {...props} icon="phone" />}
                  onPress={() => handleSectionPress("phonenumber")}
               />
               <View style={styles.collapse}>
                  <PhoneNumberForm />
               </View>
            </List.Section>

            <List.Section>
               <List.Subheader
                  style={{
                     fontFamily: "Poppins_600SemiBold",
                     fontSize: 16,
                     textAlign: "center",
                  }}>
                  <AntDesign size={23} name="lock" /> Privacy{" "}
               </List.Subheader>
               <Divider />
               <List.Item
                  titleStyle={styles.headerTitle}
                  title="Change Password"
                  left={(props) => <List.Icon {...props} icon="calendar" />}
                  onPress={() => handleSectionPress("password")}
               />
               <View style={styles.collapse}>
                  <ChangePasswordForm />
               </View>

               <List.Item
                  titleStyle={styles.headerTitle}
                  title="Add PinCode"
                  left={(props) => <List.Icon {...props} icon="calendar" />}
                  onPress={() => handleSectionPress("pincode")}
               />
               <View style={styles.collapse}>
                  <PinCodeForm />
               </View>

               <List.Subheader
                  style={{
                     fontFamily: "Poppins_600SemiBold",
                     fontSize: 16,
                     textAlign: "center",
                  }}>
                  <MaterialCommunityIcons size={23} name="cogs" /> Other Account
                  Settings
               </List.Subheader>
               <Divider />
               <List.Item
                  titleStyle={styles.headerTitle}
                  title="Debit or Credit Card"
                  left={(props) => <List.Icon {...props} icon="card" />}
                  onPress={() => handleSectionPress("bcard")}
               />

               <View style={styles.collapse}>
                  <BankCardForm />
               </View>
            </List.Section>
         </View>
      </ScrollView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#ffffff",
   },
   headerTitle: {
      fontFamily: "Poppins_300Light",
   },
   content: {
      flex: 1,
      paddingHorizontal: 8,
   },
   collapse: {
      paddingHorizontal: 16,
      marginBottom: 8,
   },
});

export default SettingScreen;
