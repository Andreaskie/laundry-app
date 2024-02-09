import React, { useState } from "react";
import { View } from "react-native";
import Input from "../components/Input";
import Container from "../components/Container";
import Button from "../components/Button";
import FormContainer from "../components/FormContainer";
import Title from "../components/Title";
import TitleContainer from "../components/TitleContainer";
import { firebase } from "../../config";
import { ScrollView } from "react-native-gesture-handler";

interface RegistrationScreenProps {
  navigation: any;
}

type InputType = "default" | "numeric" | "email";

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({
  navigation,
}) => {
  const [data, setData] = useState<{
    [key: string]: string;
  }>({
    first_name: "",
    last_name: "",
    contact: "",
    address: "",
    user_name: "",
    email: "",
    password: "",
  });

  const handleChange = (field: keyof typeof data, value: string) => {
    setData({ ...data, [field]: value });
  };

  const submit = async () => {
    const {
      first_name,
      last_name,
      contact,
      user_name,
      email,
      password,
      isAdmin,
    } = data;

    try {
      const authUser = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      const uid = authUser.user.uid;

      await firebase.auth().currentUser?.sendEmailVerification({
        handleCodeInApp: true,
        url: "https://laundry-app-80707.firebaseapp.com",
      });

      try {
        const userRef = firebase.firestore().collection("users").doc(uid);
        const roles = isAdmin === "Y" || isAdmin === "y" ? true : false;
        await userRef.set({
          uid,
          first_name,
          last_name,
          contact,
          user_name,
          email,
          password,
          roles,
        });

        console.log("User data saved to Firestore");
      } catch (error) {
        console.error("Error saving user data to Firestore:", error);
      }

      alert("Registration successful. Verification email sent.");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Container>
      <Title variant="bold">Create New Account</Title>
      <ScrollView className="w-full p-3 mt-2 pb-20 bg-white rounded-md">
        {RegistrationJson.map((input, index) => (
          <Input
            key={index}
            variant="rounded"
            value={data[input.id]}
            text={input.text}
            placeholder={input.placeholder}
            type={input.type as InputType}
            onChangeText={(text) => handleChange(input.id, text)}
          />
        ))}

        <View className="mb-10">
          <Button title="Register" variant="primary" onPress={submit} />
          <Button
            title="Back to Login"
            variant="secondary"
            onPress={() => navigation.navigate("Login")}
          />
        </View>
      </ScrollView>
    </Container>
  );
};

export default RegistrationScreen;

const RegistrationJson: any[] = [
  {
    id: "first_name",
    type: "default",
    placeholder: "First Name",
    text: "First Name",
  },
  {
    id: "last_name",
    type: "default",
    placeholder: "Last Name",
    text: "Last Name",
  },
  {
    id: "contact",
    type: "numeric",
    placeholder: "Contact",
    text: "Input Contact Number, for Admin input Gcash number",
  },
  {
    id: "user_name",
    type: "default",
    placeholder: "User Name",
    text: "User Name for Admin input laundryshop name",
  },
  {
    id: "email",
    type: "email-address",
    placeholder: "Email Address",
    text: "Email Address",
  },
  {
    id: "password",
    placeholder: "Password",
    text: "Password",
  },
  {
    id: "isAdmin",
    placeholder: "Admin Account (Y/N)",
    text: "Input Y for Admin, N for User",
  },
];
