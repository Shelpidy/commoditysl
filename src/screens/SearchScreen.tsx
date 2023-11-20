import { StyleSheet,View, ScrollView, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogComponent from "../components/MediaPosts/BlogComponent";
import FindFriendComponent from "../components/FindFriendComponent";
import SearchForm from "../components/SearchForm";
import { useTheme,Text } from "react-native-paper";
import LoadingIndicator from "../components/LoadingIndicator";
import { useCurrentUser } from "../utils/CustomHooks";

type FetchedBlog = {
   blog: Blog;
   createdBy: User;
   ownedBy: User;
   commentsCount: number;
   likesCount: number;
   sharesCount: number;
   liked: boolean;
   reposted:boolean;
};

const SearchScreen = () => {
   const [blogs, setBlogs] = useState<FetchedBlog[]>([]);
   const [users, setUsers] = useState<User[]>([]);
   const [loading, setLoading] = useState<boolean>(false);
   const [searchValue, setSearchValue] = useState<string>("");
   const currentUser = useCurrentUser()
   const theme = useTheme()

   async function handleSearch(searchData: any) {
      try {
         console.log({SEARCH:searchData})
         setLoading(true);
         let { data, status } = await axios.get(
            `http://192.168.1.98:6000/search?q=${searchData}`,
            { headers: { Authorization: `Bearer ${currentUser?.token}` } }
         );
         if (status === 200) {
            setBlogs(data.blogs);
            setUsers(data.users);
            console.log(data)
         } else {
            console.log(data.data);
         }
      
      } catch (err) {
         console.log(err);
      }finally{
         setLoading(false)
      }
   }
   if (loading) {
      return (
         <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <LoadingIndicator text="searching..." />
         </View>
      );
   }


   return (
      <ScrollView
         style={{
            backgroundColor: theme.colors.background,
            paddingTop: 5,
         }}>
         <SearchForm setSearchValue={handleSearch} />
         {
            users.length > 0 && 
           <View style={{marginVertical:10}}><Text variant="titleMedium" style={{textAlign:"center"}}>Users</Text></View>
         }
         <FlatList
          horizontal
         keyExtractor={(item) => String(item.userId)}
         data={users}
         renderItem={({ item, index, separators }) => {
            return  <FindFriendComponent key={String(item.userId)} user={item} />;
         }}
      />
         <FlatList
         ListHeaderComponent={blogs.length > 0? <View style={{marginVertical:10}}><Text variant="titleMedium" style={{textAlign:"center"}}>Blogs</Text></View>:null}
         keyExtractor={(item) => item.blog.blogId}
         data={blogs}
         renderItem={({ item, index, separators }) => {
            return <BlogComponent key={item.blog.blogId} {...item} />;
         }}
      />
      </ScrollView>
   );
};

export default SearchScreen;

const styles = StyleSheet.create({});
