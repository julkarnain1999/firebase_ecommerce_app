import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, TextInput, Text, Alert, TouchableOpacity } from "react-native";
import { auth } from "../../config/firebaseConfig";


const SignInScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Signed in successfully!");
      router.replace("/"); // Navigate to main app
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-light-blue px-6">
      <View className="mb-6 items-center">
        <Text className="text-3xl font-bold text-gray-800">
          Welcome to My Sign In Page😎
        </Text>
      </View>
      <Text className="text-xl font-bold text-gray-800 mb-2">
        Sign in to your account
      </Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        className="w-full border border-gray-300 bg-teal-500 rounded-lg p-3 mb-4 text-white shadow"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="w-full border border-gray-300 bg-teal-500 rounded-lg p-3 mb-4 text-white shadow"
      />
      <Text className="text-black text-sm mb-2">
        Please enter your email and password
      </Text>
      <TouchableOpacity
        onPress={handleSignIn}
        className="w-full bg-purple-500 py-3 rounded-lg shadow-md mt-2"
      >
        <Text className="text-center text-black font-semibold text-lg">
          Sign In
        </Text>
      </TouchableOpacity>
      <Text
        onPress={() => router.push("/sign-up")}
        className="mt-4 text-black text-sm"
      >
        Don't have an account? Sign Up
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/forgot-password")}
        className="mt-4 bg-red-500 py-2 px-4 rounded-lg"
      >
        <Text className="text-white text-sm font-semibold">
          Forgot Password?
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignInScreen;
