// LoginScreen.js
import React, { useState, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import Input from "../components/Input";
import Container from "../components/Container";
import Button from "../components/Button";
import FormContainer from "../components/FormContainer";
import Title from "../components/Title";
import { firebase } from "../../config";
import { AuthContext } from "../features/AuthContext";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TitleContainer from "../components/TitleContainer";
import { login } from "../features/AuthReducer";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { dispatch, user } = useContext(AuthContext);

  const handleChange = (field: string, value: string) => {
    if (field === "email") {
      setEmail(value);
    } else if (field === "password") {
      setPassword(value);
    }
  };

  const submit = async () => {
    try {
      const userCredential = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);

      dispatch(
        login({
          user: userCredential.user || {},
          token: userCredential.user?.stsTokenManager?.accessToken || "",
        })
      );

      // Store user data and token in AsyncStorage
      await AsyncStorage.setItem(
        "userData",
        JSON.stringify(userCredential.user)
      );
      await AsyncStorage.setItem(
        "token",
        userCredential.user?.stsTokenManager?.accessToken || ""
      );
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <Container>
      <Title variant="bold">Sign in to your account</Title>

      <View className="w-full p-3 bg-white rounded-md">
        <Input
          label="Username"
          variant="rounded"
          value={email}
          placeholder="Email"
          text="Email Address"
          onChangeText={(text) => handleChange("email", text)}
        />
        <Input
          label="Password"
          secureTextEntry
          placeholder="Password"
          text="Password"
          value={password}
          onChangeText={(text) => handleChange("password", text)}
        />
        <Button title="Login" variant="primary" onPress={submit} />
        <Button
          title="Don't have an account?"
          variant="secondary"
          onPress={() => navigation.navigate("Registration")}
        />
      </View>
    </Container>
  );
};

export default LoginScreen;
