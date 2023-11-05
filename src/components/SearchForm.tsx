import {
   StyleSheet,
   Text,
   View,
   TextInput,
   Pressable,
   useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import { EvilIcons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
type SearchProps = {
   setSearchValue: (value: string) => void;
};

const SearchForm = ({ setSearchValue }: SearchProps) => {
   const [searchValue, _setSearchValue] = useState("");
   const theme = useTheme();
   const { width } = useWindowDimensions();
   const handleSearch = () => {
      setSearchValue(searchValue);
      console.log(searchValue);
   };
   return (
      <View
         style={{
            paddingHorizontal: 15,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
         }}>
         <TextInput
            placeholder="Search here..."
            onChangeText={(v) => _setSearchValue(v)}
            style={{
               flex: 1,
               backgroundColor: theme.colors.inverseOnSurface,
               borderTopLeftRadius: 20,
               borderBottomLeftRadius: 20,
               height: 50,
               paddingHorizontal: 10,
               width: 0.7 * width,
               borderColor: theme.colors.inverseOnSurface,
               borderWidth: 1,
            }}
         />
         <Pressable
            onPress={handleSearch}
            style={{
               paddingHorizontal: 15,
               height: 50,
               alignItems: "center",
               justifyContent: "center",
               borderTopRightRadius: 20,
               borderBottomRightRadius: 20,
               backgroundColor: theme.colors.inverseOnSurface,
               borderColor: theme.colors.inverseOnSurface,
               borderWidth: 1,
            }}>
            <EvilIcons name="search" size={30} />
         </Pressable>
      </View>
   );
};

export default SearchForm;

const styles = StyleSheet.create({});
