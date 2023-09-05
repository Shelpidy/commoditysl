import {
   StyleSheet,
   Text,
   View,
   Alert,
   FlatList,
   Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import BlogComponent from "./BlogComponent";
import axios from "axios";
// import { blogs as _fetchedPost } from "../../data";
import { useCurrentUser } from "../../utils/CustomHooks";
import SharedBlogComponent from "./SharedBlogComponent";
import { ActivityIndicator, Divider } from "react-native-paper";
import { LoadingBlogComponent } from "./LoadingComponents";
import { useNavigation } from "@react-navigation/native";

type BlogComponentProps = {
   blog: Blog;
   createdBy: User;
   ownedBy: User;
   commentsCount: number;
   likesCount: number;
   sharesCount: number;
   liked: boolean;
};

const ForYouBlogsComponent = () => {
   const [blogs, setBlogs] = useState<BlogComponentProps[] | null>(null);
   const [allBlogs, setAllBlogs] = useState<BlogComponentProps[] | null>(null);
   const page = React.useRef<number>(1);
   const [numberOfblogsPerPage, setNumberOfblogsPerPage] = useState<number>(5);
   const [loading, setLoading] = useState<boolean>(false);
   const [refreshing, setRefreshing] = useState<boolean>(false);
   const currentUser = useCurrentUser();
   const navigation = useNavigation();
   const [hasMore, setHasMore] = useState(true);
   const [loadingFetch, setLoadingFetch] = useState<boolean>(false);

   let fetchData = async (pageNum?: number) => {
      console.log("Fetching posts");
      let pageNumber = pageNum ?? page.current;
      if (!hasMore) return;
      try {
         if (currentUser) {
            setLoadingFetch(true);
            let activeUserId = currentUser?.userId;
            let { data, status } = await axios.get(
               `http://192.168.1.93:6000/blogs?pageNumber=${pageNumber}&numberOfRecords=${numberOfblogsPerPage}`,
               { headers: { Authorization: `Bearer ${currentUser?.token}` } }
            );

            if (status === 200) {
               console.log(data);
               // setBlogs(data.data);
               let fetchedPost: BlogComponentProps[] = data.data;

               setAllBlogs((prev) =>
                  prev ? [...prev, ...fetchedPost] : fetchedPost
               );
               setBlogs((prev) =>
                  prev ? [...prev, ...fetchedPost] : fetchedPost
               );

               if (fetchedPost.length > 0) page.current++;
               if (data.data.length < numberOfblogsPerPage) {
                  setHasMore(false);
               }
               setLoadingFetch(false);
               // Alert.alert("Success",data.message)
            } else {
               Alert.alert("Failed", data.message);
               setLoadingFetch(false);
            }
         }
      } catch (err) {
         Alert.alert("Failed", String(err));
         console.log(err);
         setLoadingFetch(false);
      }
   };

   const handleLoadMore = () => {
      console.log("blogs Reached end");
      if (loadingFetch) return;
      fetchData();
   };

   const renderFooter = () => {
      if (!loading) return null;
      return (
         <View
            style={{
               flexDirection: "row",
               padding: 10,
               justifyContent: "center",
               alignItems: "center",
               backgroundColor: "white",
            }}>
            <ActivityIndicator color="#cecece" size="small" />
            <Text style={{ color: "#cecece", marginLeft: 5 }}>
               Loading more blogs
            </Text>
         </View>
      );
   };

   useEffect(
      function () {
         fetchData(1);
      },
      [currentUser]
   );

   if (!blogs) {
      return (
         <View style={{ padding: 2 }}>
            <LoadingBlogComponent />
            <Divider />
            <LoadingBlogComponent />
            <Divider />
            <LoadingBlogComponent />
         </View>
      );
   }

   return (
      <FlatList
         keyExtractor={(item) => String(item.blog.blogId)}
         data={blogs}
         renderItem={({ item, index, separators }) => {
            if (item.blog?.fromBlogId) {
               return (
                  <SharedBlogComponent
                     key={String(item.blog.blogId)}
                     {...item}
                  />
               );
            } else {
               return (
                  <BlogComponent key={String(item.blog.blogId)} {...item} />
               );
            }
         }}
         onEndReached={handleLoadMore}
         onEndReachedThreshold={0.3}
         ListFooterComponent={renderFooter}
      />
   );
};

export default ForYouBlogsComponent;
