import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, TextInput, Text, Alert, TouchableOpacity } from "react-native";
import { auth } from "../../config/firebaseConfig";


const SignUpScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Account created successfully!");
      router.push("/(tabs)"); // Navigate to Tab Navigator (Home Screen)
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-light-blue px-6">
      <View className="mb-6 mt-4 items-center">
        <Text className="text-xl font-bold text-black text-center">
          Welcome To My Sign Up Page👍
        </Text>
      </View>
      <Text className="text-2xl font-bold text-gray-800 mb-6">Sign Up</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        className="w-full border border-teal-300 bg-teal-600 rounded-lg p-3 mb-4 text-white shadow"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="w-full border border-teal-300 bg-teal-600 rounded-lg p-3 mb-4 text-white shadow"
      />
      <Text className="text-black text-sm">
        Please enter your email and password
      </Text>
      <TouchableOpacity
        onPress={handleSignUp}
        className="w-full bg-purple-500 py-3 rounded-lg shadow-md mt-4"
      >
        <Text className="text-center text-black font-semibold text-lg">
          Sign Up
        </Text>
      </TouchableOpacity>
      <Text
        onPress={() => router.push("/sign-in")}
        className="mt-4 text-black text-lg font-semibold"
      >
        Already have an account? Sign In
      </Text>
    </View>
  );
};

export default SignUpScreen;
