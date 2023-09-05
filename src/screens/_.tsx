// import { StyleSheet, Text, View, Alert, ScrollView } from "react-native";
// import React, { useEffect, useState } from "react";
// import SearchForm from "../components/SearchForm";
// import PostProductFormNav from "../components/PostProductFormNav";
// import ProductRequestComponent from "../components/Marketing/ProductRequestComponent";
// import axios from "axios";

// // import { Products as _fetchedPost } from "../../data";

// type ProductsComponentProps = {
//    navigation?: any;
// };

// const UserProductsRequestScreen = ({ navigation }: ProductsComponentProps) => {
//    const [products, setProducts] = useState<ProductComponentProps[]>([]);
//    const [allProducts, setAllProducts] = useState<ProductComponentProps[]>([]);
//    const [pageNumber, setPageNumber] = useState<number>(1);
//    const [numberOfProductsPerPage, setNumberOfProductsPerPage] =
//       useState<number>(20);
//    const [numberOfPageLinks, setNumberOfPageLinks] = useState<number>(0);
//    const [loading, setLoading] = useState<boolean>(false);
//    const [loading2, setLoading2] = useState<boolean>(false);
//    const [currentUser, setCurrentUser] = useState<CurrentUser>({});
//    const [refresh, setRefresh] = useState<number>(0);

//    useEffect(
//       function () {
//          setLoading(true);
//          let fetchData = async () => {
//             let activeUserId = 1;
//             try {
//                let response = await fetch(
//                   `http://192.168.1.93:5000/marketing/products/request/${activeUserId}`
//                );
//                let data = await response.json();
//                if (data.status == "success") {
//                   console.log(data.data);
//                   // setProducts(data.data);
//                   let fetchedPost: ProductComponentProps[] = data.data;
//                   let numOfPageLinks = Math.ceil(
//                      fetchedPost.length / numberOfProductsPerPage
//                   );
//                   // console.log(fetchedPost);
//                   setAllProducts(fetchedPost);
//                   setNumberOfPageLinks(numOfPageLinks);
//                   const currentIndex =
//                      numberOfProductsPerPage * (pageNumber - 1);
//                   const lastIndex = currentIndex + numberOfProductsPerPage;
//                   setProducts(data.data.slice(currentIndex, lastIndex));
//                   // Alert.alert("Success",data.message)
//                } else {
//                   Alert.alert("Failed", data.message);
//                }
//                setLoading(false);
//             } catch (err) {
//                Alert.alert("Failed", String(err));
//                setLoading(false);
//             }
//          };
//          fetchData();
//       },
//       [refresh]
//    );

//    useEffect(() => {
//       const currentIndex = numberOfProductsPerPage * (pageNumber - 1);
//       const lastIndex = currentIndex + numberOfProductsPerPage;
//       setProducts(products.slice(currentIndex, lastIndex));
//    }, [pageNumber]);

//    if (products.length === 0 || loading) {
//       return (
//          <View
//             style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//             <Text>Loading Products...</Text>
//          </View>
//       );
//    }

//    const searchProducts = (_token: string) => {
//       console.log("From product", _token);
//       let token = _token.toLowerCase();
//       let newProducts = allProducts?.filter(
//          (Product) =>
//             Product?.description.toLowerCase().includes(token) ||
//             Product?.productName?.toLowerCase().includes(token) ||
//             Product?.price?.toLowerCase().includes(token)
//       );
//       setProducts(newProducts);
//    };

//    return (
//       <ScrollView style={{ backgroundColor: "#f9f9f9" }}>
//          {/* <Text>ProductsComponent {Products.length}</Text> */}
//          <PostProductFormNav page="product" navigation={navigation} />
//          <SearchForm setSearchValue={searchProducts} />
//          {products.map((product) => {
//             return (
//                <ProductRequestComponent
//                   key={String(product.id)}
//                   props={product}
//                   refreshRequest={() => setRefresh(refresh + 1)}
//                   navigation={navigation}
//                />
//             );
//          })}
//       </ScrollView>
//    );
// };

// export default UserProductsRequestScreen;

// const styles = StyleSheet.create({});
