import {
   StyleSheet,
   Text,
   View,
   Alert,
   FlatList,
   Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import CommentComponent from "./CommentComponent";
import { Button, Divider, ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useCurrentUser } from "../../utils/CustomHooks";
import { Skeleton } from "@rneui/themed";
import axios from "axios";

type CommentsProps = {
   blogId: string;
   userId?: string;
   refetchId: number;
};

type FetchComment = {
   comment: BlogComment;
   commentsCount: number;
   likesCount: number;
   liked: boolean;
   user: User;
};

const { width, height } = Dimensions.get("window");

const Comments = ({ blogId, userId, refetchId }: CommentsProps) => {
   const [comments, setComments] = useState<BlogComment[] | null>(null);
   const [loading, setLoading] = useState(false);
   const [loadingFetch, setLoadingFetch] = useState<boolean>(false);
   const page = React.useRef<number>(1);
   const [hasMore, setHasMore] = useState(true);
   const navigation = useNavigation<any>();
   const currentUser = useCurrentUser();
   const [refetchComments, setReFetchComments] = useState<number>(refetchId);

   const fetchComments = async (pageNum?: number) => {
      let pageNumber = pageNum ?? page.current;
      console.log("Page number", pageNumber);
      if (!hasMore) return;

      try {
         setLoadingFetch(true);
         if (currentUser && blogId) {
            let { data, status } = await axios.get(
               `http://192.168.1.93:6000/blogs/${blogId}/comments?pageNumber=${pageNumber}&numberOfRecords=5`,
               { headers: { Authorization: `Bearer ${currentUser?.token}` } }
            );

            if (status === 200) {
               setComments((prevComments) =>
                  prevComments ? [...prevComments, ...data.data] : data.data
               );
               if (data.data.length > 0) {
                  page.current++;
               }
               console.log("Comments=>", data.data);
               if (data.data.length < 5) {
                  setHasMore(false);
               }
               setLoadingFetch(false);
            } else {
               Alert.alert("Failed", data.message);
               setLoadingFetch(false);
            }
         }
         // setLoadingFetch(false);
      } catch (err) {
         console.log("From Comments", String(err));
         Alert.alert("Failed", String(err));
         setLoadingFetch(false);
      }
   };

   useEffect(() => {
      console.log("Fetching comments");
      fetchComments(1);
   }, [currentUser]);

   const handleLoadMore = () => {
      console.log("Comments reached end");
      if (loadingFetch) return;
      fetchComments();
   };

   const renderFooter = () => {
      if (!loadingFetch) return null;
      return (
         <View
            style={{
               flexDirection: "row",
               padding: 15,
               justifyContent: "center",
               alignItems: "center",
               backgroundColor: "white",
            }}>
            <ActivityIndicator color="#cecece" size="small" />
            <Text style={{ color: "#cecece", marginLeft: 5 }}>Loading</Text>
         </View>
      );
   };

   const renderItem = ({ item }: { item: BlogComment }) => (
      <CommentComponent
         key={String(item.commentId)}
         blogOwnerId={userId}
         comment={item}
      />
   );

   const renderSkeleton = () => (
      <View>
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
               height={80}
            />
         </View>
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
               height={80}
            />
         </View>
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
               height={80}
            />
         </View>
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
               height={80}
            />
         </View>
      </View>
   );
   return (
      <FlatList
         data={comments}
         renderItem={renderItem}
         keyExtractor={(item) => String(item?.commentId)}
         onEndReached={handleLoadMore}
         onEndReachedThreshold={0.3}
         ListFooterComponent={renderFooter}
         style={{ padding: 8 }}
         // ListEmptyComponent={renderSkeleton}
      />
   );
};

export default Comments;

const styles = StyleSheet.create({});
