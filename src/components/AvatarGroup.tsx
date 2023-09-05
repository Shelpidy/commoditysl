import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Text } from "react-native-paper";

type AvatarGroupProps = {
   users: User[];
   max: number;
};

const AvatarGroup = ({ users, max }: AvatarGroupProps) => {
   // users is an array of objects with name and image properties
   // max is the maximum number of avatars to show
   const visibleUsers = users.slice(0, max);
   const hiddenUsers = users.length - max;
   return (
      <View style={styles.container}>
         {visibleUsers.map((user, index) => (
            <View key={index} style={styles.avatar}>
               <Avatar.Image source={{ uri: user.profileImage }} size={40} />
            </View>
         ))}
         {hiddenUsers > 0 && (
            <View style={styles.avatar}>
               <Avatar.Text size={40} label={`+${hiddenUsers}`} />
            </View>
         )}
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flexDirection: "row",
      alignItems: "center",
   },
   avatar: {
      marginLeft: -10,
      borderWidth: 2,
      borderColor: "#fff",
      borderRadius: 20,
      zIndex: 1,
   },
});

export default AvatarGroup;
