import { Skeleton } from "@rneui/themed";
import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { Divider } from "react-native-paper";

const { width,height } = Dimensions.get("window");

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 8,
   },
});

export const LoadingBlogComponent = () => {
   return (
      <View style={styles.container}>
         <View
            style={{
               flex: 1,
               flexDirection: "row",
               justifyContent: "flex-start",
               gap: 4,
               margin: 3,
            }}>
            <Skeleton animation="wave" circle width={50} height={50} />
            <Skeleton
               style={{ borderRadius: 5, marginTop: 4 }}
               animation="wave"
               width={width - 70}
               height={30}
            />
         </View>
         <View style={{ justifyContent: "center", alignItems: "flex-start" }}>
            <Skeleton
               animation="wave"
               style={{ borderRadius: 5 }}
               width={width - 14}
               height={300}
            />
            <Skeleton
               animation="wave"
               style={{ borderRadius: 5, marginTop: 3 }}
               width={width - 14}
               height={18}
            />
            <Skeleton
               animation="wave"
               style={{ borderRadius: 5, marginVertical: 3 }}
               width={width - 14}
               height={200}
            />
         </View>
         <View
            style={{
               flex: 1,
               flexDirection: "row",
               justifyContent: "flex-start",
               gap: 6,
            }}>
            <Skeleton
               style={{ borderRadius: 15 }}
               animation="wave"
               width={width / 3.2}
               height={40}
            />
            <Skeleton
               style={{ borderRadius: 15 }}
               animation="wave"
               width={width / 3.2}
               height={40}
            />
            <Skeleton
               style={{ borderRadius: 15 }}
               animation="wave"
               width={width / 3.2}
               height={40}
            />
         </View>
      </View>
   );
};

export const LoadingFindFriendComponent = () => {
   return (
      <View style={{ margin: 3 }}>
         <View style={{ justifyContent: "center", alignItems: "flex-start" }}>
            <Skeleton
               animation="wave"
               style={{ borderRadius: 5 }}
               width={width /2.1}
               height={height * 0.25}
            />
            <Skeleton
               animation="wave"
               style={{
                  borderRadius: 20,
                  marginVertical: 3,
                  alignSelf: "center",
               }}
               width={width / 2.2}
               height={40}
            />
         </View>
      </View>
   );
};

export const LoadingProductComponent = () => {
   return (
      <View style={styles.container}>
         <View
            style={{
               flex: 1,
               flexDirection: "row",
               justifyContent: "flex-start",
               gap: 4,
               margin: 3,
            }}>
            <Skeleton animation="wave" circle width={50} height={50} />
            <Skeleton
               style={{ borderRadius: 5, marginTop: 4 }}
               animation="wave"
               width={290}
               height={30}
            />
         </View>
         <View style={{ justifyContent: "center", alignItems: "flex-start" }}>
            <Skeleton
               animation="wave"
               style={{ borderRadius: 5 }}
               width={width - 14}
               height={300}
            />
            <Skeleton
               animation="wave"
               style={{ borderRadius: 5, marginTop: 3 }}
               width={width - 14}
               height={40}
            />
            <Skeleton
               animation="wave"
               style={{ borderRadius: 5, marginVertical: 3 }}
               width={width - 14}
               height={200}
            />
         </View>
         <View
            style={{
               flex: 1,
               flexDirection: "column",
               gap: 2,
               alignItems: "flex-start",
            }}>
            <Skeleton
               style={{ borderRadius: 5 }}
               animation="wave"
               width={280}
               height={40}
            />
            <Skeleton
               style={{ borderRadius: 5 }}
               animation="wave"
               width={width - 14}
               height={40}
            />
            <Skeleton
               style={{ borderRadius: 5 }}
               animation="wave"
               width={width - 40}
               height={40}
            />
         </View>
         <Divider />
      </View>
   );
};

export const LoadingProfileComponent = () => {
   return (
      <ScrollView>
         <View
            style={{
               flex: 1,
               flexDirection: "column",
               justifyContent: "center",
               alignItems: "center",
               gap: 4,
               marginVertical: 3,
            }}>
            <Skeleton animation="wave" circle width={100} height={100} />
            <Skeleton
               style={{ borderRadius: 5 }}
               animation="wave"
               width={width - 110}
               height={25}
            />
         </View>
         <View
            style={{
               flex: 1,
               flexDirection: "row",
               justifyContent: "flex-start",
               gap: 5,
               marginVertical: 2,
            }}>
            <Skeleton
               style={{ borderRadius: 15 }}
               animation="wave"
               width={width / 4}
               height={37}
            />
            <Skeleton
               style={{ borderRadius: 15 }}
               animation="wave"
               width={width / 4}
               height={37}
            />
            <Skeleton
               style={{ borderRadius: 15 }}
               animation="wave"
               width={width / 4}
               height={37}
            />
            <Skeleton
               style={{ borderRadius: 15 }}
               animation="wave"
               width={width / 4}
               height={37}
            />
         </View>
         <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Skeleton
               animation="wave"
               style={{ borderRadius: 5 }}
               width={width - 14}
               height={290}
            />
         </View>
         <LoadingBlogComponent />
         <LoadingBlogComponent />
      </ScrollView>
   );
};

export const LoadingNotificationComponent = () => {
   return (
      <View
         style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
            gap: 4,
         }}>
         <Skeleton animation="wave" circle width={60} height={60} />
         <Skeleton
            style={{ borderRadius: 5, marginTop: 4 }}
            animation="wave"
            width={width - 70}
            height={130}
         />
      </View>
   );
};

export const LoadingConversationComponent = () => {
   return (
      <View
         style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
            gap: 4,
         }}>
         <Skeleton animation="wave" circle width={60} height={60} />
         <Skeleton
            style={{ borderRadius: 4, marginTop: 4 }}
            animation="wave"
            width={width - 70}
            height={53}
         />
      </View>
   );
};
