import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { db } from "../../config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(productsArray);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-3xl font-bold text-gray-800 mb-4">Shop Now</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2} // Display products in a grid
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/product/${item.id}`)}
            className="bg-white rounded-lg p-2 shadow-md mb-4 w-[48%]"
          >
            <Image
              source={{ uri: item.image }}
              className="w-full h-40 rounded-lg"
            />
            <Text className="text-lg font-semibold mt-2">{item.name}</Text>
            <Text className="text-gray-600">${item.price}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
