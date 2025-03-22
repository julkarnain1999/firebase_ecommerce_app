import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { db } from "../../config/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function CartScreen() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Fetch Cart Items
  const fetchCartItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "cart"));
      const cartArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCartItems(cartArray);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setLoading(false);
    }
  };

  // Remove Item from Cart
  const removeFromCart = async (id) => {
    try {
      await deleteDoc(doc(db, "cart", id));
      setCartItems(cartItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Calculate Total Price
  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  if (loading) {
    return <ActivityIndicator size="large" color="blue" />;
  }

  return (
    <View className="flex-1 p-4 bg-white">
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} className="mb-4">
        <Text className="text-lg font-bold text-blue-500">← Back</Text>
      </TouchableOpacity>

      <Text className="text-2xl font-bold mb-4">Your Cart</Text>

      {cartItems.length === 0 ? (
        <Text className="text-lg text-gray-500">No items in the cart</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <Image
                source={{ uri: item.image }}
                className="w-full h-40 rounded-lg"
              />
              <Text className="text-lg font-semibold mt-2">{item.name}</Text>
              <Text className="text-gray-600">${item.price}</Text>

              {/* Remove Button */}
              <TouchableOpacity
                onPress={() => removeFromCart(item.id)}
                className="mt-2"
              >
                <Text className="text-red-500 font-semibold">Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Total Price */}
      {cartItems.length > 0 && (
        <Text className="text-2xl font-bold mt-4">Total: ${totalPrice}</Text>
      )}

      {/* Checkout Button */}
      {cartItems.length > 0 ? (
        <TouchableOpacity
          className="mt-4 p-3 bg-blue-500 rounded-lg"
          onPress={() =>
            alert(`Order placed successfully! Total: $${totalPrice}`)
          }
        >
          <Text className="text-white text-center text-lg font-semibold">
            Checkout (${totalPrice})
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className="mt-4 p-3 bg-gray-400 rounded-lg opacity-50"
          disabled
        >
          <Text className="text-white text-center text-lg font-semibold">
            Checkout (Cart is empty)
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
