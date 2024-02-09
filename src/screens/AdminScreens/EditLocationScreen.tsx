// EditLocationScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { firebase } from "../../../config";

const EditLocationScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [newAddress, setNewAddress] = useState("");

  const handleSave = async () => {
    try {
      // Update user's address in Firestore
      await firebase.firestore().collection("users").doc(userId).update({
        address: newAddress,
      });

      // Navigate back after updating the address
      navigation.goBack();
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  return (
    <View>
      <Text>Edit Location</Text>
      <TextInput
        value={newAddress}
        onChangeText={(text) => setNewAddress(text)}
        placeholder="Enter new address"
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

export default EditLocationScreen;
