import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { db } from "../../config/firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

export default function HistoryScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); // For back navigation

  const fetchOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const ordersArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersArray);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  // ✅ Confirm Order with Alert
  const confirmOrder = async (orderId) => {
    if (!orderId) {
      Alert.alert("Error", "Invalid order ID.");
      return;
    }

    Alert.alert(
      "Confirm Order",
      `Are you sure you want to confirm order ID: ${orderId}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              const orderRef = doc(db, "orders", orderId);
              await setDoc(orderRef, { status: "Confirmed" }, { merge: true });
              fetchOrders(); // Refresh the list
              Alert.alert("Success", `Order ID ${orderId} confirmed!`);
            } catch (error) {
              console.error("Error confirming order:", error);
            }
          },
        },
      ]
    );
  };

  // ✅ Cancel Order with Alert
  const cancelOrder = async (orderId) => {
    if (!orderId) {
      Alert.alert("Error", "Invalid order ID.");
      return;
    }

    Alert.alert(
      "Cancel Order",
      `Are you sure you want to cancel order ID: ${orderId}?`,
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          onPress: async () => {
            try {
              const orderRef = doc(db, "orders", orderId);
              const orderSnap = await getDoc(orderRef);

              if (orderSnap.exists()) {
                await deleteDoc(orderRef);
                fetchOrders();
                Alert.alert(
                  "Canceled",
                  `Order ID ${orderId} has been canceled.`
                );
              } else {
                Alert.alert("Error", "Order does not exist.");
              }
            } catch (error) {
              console.error("Error canceling order:", error);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="blue" />;
  }

  return (
    <View className="flex-1 p-4 bg-white">
      {/* ✅ Back Button */}
      <TouchableOpacity
        className="p-3 bg-gray-400 rounded-lg mb-4"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-white text-center text-lg font-semibold">
          Back
        </Text>
      </TouchableOpacity>

      <Text className="text-2xl font-bold mb-4">Order History</Text>

      <TouchableOpacity
        className="p-3 bg-blue-500 rounded-lg mb-4"
        onPress={fetchOrders}
      >
        <Text className="text-white text-center text-lg font-semibold">
          Refresh Order History
        </Text>
      </TouchableOpacity>

      {orders.length === 0 ? (
        <Text className="text-lg text-gray-500">No orders yet</Text>
      ) : (
        <FlatList
          data={orders}
          // ✅ Fixed duplicate key issue
          renderItem={({ item }) => (
            <View className="mb-4 p-4 border border-gray-300 rounded-lg bg-gray-100">
              <Image
                source={{ uri: item.image }}
                className="w-full h-40 rounded-lg"
              />
              <Text className="text-lg font-semibold mt-2">{item.name}</Text>
              <Text className="text-gray-600">${item.price}</Text>
              <Text className="text-sm text-gray-500">
                Status: {item.status || "Pending"}
              </Text>

              <TouchableOpacity
                className="mt-2 p-2 bg-green-500 rounded-lg"
                onPress={() => confirmOrder(item.id)}
              >
                <Text className="text-white text-center text-md font-semibold">
                  Confirm Order
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="mt-2 p-2 bg-red-500 rounded-lg"
                onPress={() => cancelOrder(item.id)}
              >
                <Text className="text-white text-center text-md font-semibold">
                  Cancel Order
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}
