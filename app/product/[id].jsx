import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { db } from "../../config/firebaseConfig";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    try {
      await addDoc(collection(db, "cart"), product);
      Alert.alert("Success", "Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const orderProduct = async () => {
    try {
      await addDoc(collection(db, "orders"), product);
      Alert.alert(
        "Order Placed",
        "You have successfully ordered this product!"
      );
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="blue" />;
  }

  if (!product) {
    return (
      <Text className="text-center text-lg text-red-500">
        Product not found
      </Text>
    );
  }

  return (
    <View className="flex-1 p-4 bg-white">
      <Image
        source={{ uri: product.image }}
        className="w-full h-80 rounded-xl mb-4"
      />
      <Text className="text-2xl font-bold">{product.name}</Text>
      <Text className="text-xl text-gray-600">${product.price}</Text>

      <TouchableOpacity
        onPress={addToCart}
        className="bg-blue-500 p-4 rounded-lg mt-4"
      >
        <Text className="text-white text-center text-lg font-semibold">
          Add to Cart
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={orderProduct}
        className="bg-green-500 p-4 rounded-lg mt-2"
      >
        <Text className="text-white text-center text-lg font-semibold">
          Order Now
        </Text>
      </TouchableOpacity>
    </View>
  );
}
