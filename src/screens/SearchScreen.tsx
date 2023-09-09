import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogComponent from "../components/MediaPosts/BlogComponent";
import FindFriendComponent from "../components/FindFriendComponent";
import SearchForm from "../components/SearchForm";

type FetchedBlog = {
   blog: Blog;
   createdBy: User;
   ownedBy: User;
   commentsCount: number;
   likesCount: number;
   sharesCount: number;
   liked: boolean;
};

const SearchScreen = ({ navigation }: any) => {
   const [posts, setPosts] = useState<FetchedBlog[]>([]);
   const [users, setUsers] = useState<User[]>([]);
   const [loading, setLoading] = useState<boolean>(false);
   const [searchValue, setSearchValue] = useState<string>("");

   async function handleSearch(searchData: any) {
      setLoading(true);
      try {
         let { data, status } = await axios.get(
            `http://192.168.1.98:5000/search/?searchValue=${searchData}`
         );
         if (status === 200) {
            setPosts(data.data.posts);
            setUsers(data.data.users);
         } else {
            console.log(data.data);
         }
         setLoading(false);
      } catch (err) {
         console.log(err);
      }
   }
   if (loading) {
      return (
         <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Searching.....</Text>
         </View>
      );
   }

   return (
      <ScrollView
         style={{
            backgroundColor: theme.colors.inverseOnSurface,
            paddingTop: 5,
         }}>
         <SearchForm setSearchValue={handleSearch} />
         <ScrollView horizontal>
            {users?.map((user) => {
               return (
                  <FindFriendComponent key={String(user.userId)} user={user} />
               );
            })}
         </ScrollView>
         <ScrollView>
            {posts.length < 1 && (
               <View>
                  <Text>No Result Found For Posts</Text>
               </View>
            )}
            {posts.length >= 1 &&
               posts.map((post) => {
                  return (
                     <BlogComponent key={String(post.blog.blogId)} {...post} />
                  );
               })}
         </ScrollView>
      </ScrollView>
   );
};

export default SearchScreen;

const styles = StyleSheet.create({});
