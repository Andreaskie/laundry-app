import React, { useContext, useState } from "react";
import {
  View,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
// Import from react-native-image-crop-picker
import axios from "axios";
import { AuthContext } from "../../../features/AuthContext";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { firebase } from "../../../../config";

const AddCategory = ({ hideAddCategory }) => {
  const { user } = useContext(AuthContext);
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemStatus, setItemStatus] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const chooseImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);

        console.log(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error choosing image:", error);
    }
  };

  const uploadImage = async () => {
    try {
      setLoading(true);

      const response = await fetch(imageUri);
      const blob = await response.blob();
      const base64data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

     
      const cloudinaryResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dfhhkd04c/image/upload",
        {
          file: base64data,
          upload_preset: "Categories",
        }
      );

      setLoading(false);

      return cloudinaryResponse.data.secure_url;
    } catch (error) {
      setLoading(false);
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const addItem = async () => {
    console.log(imageUri);
    try {
      if (!imageUri) {
        Alert.alert(
          "Image not selected",
          "Please choose an image for the item."
        );
        return;
      }

      const imageUrl = await uploadImage();

      await firebase.firestore().collection("items").add({
        name: itemName,
        category: itemCategory,
        description: itemDescription,
        price: itemPrice,
        status: itemStatus,
        imageUrl,
        uploaderUid: user.uid, // Add uploader's UID
      });

      // Reset form after successful upload
      setItemName("");
      setItemCategory("");
      setItemDescription("");
      setItemPrice("");
      setItemStatus("");
      setImageUri("");
      setLoading(false);

      Alert.alert("Item Added");

      hideAddCategory();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  return (
    <ScrollView>
      <View>
        <Button
          title="Choose Image"
          onPress={chooseImage}
          variant="secondary"
        />
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            className="mt-5 rounded "
            style={{ width: 200, height: 200 }}
          />
        )}

        {loading && <ActivityIndicator size="large" />}

        <Input
          placeholder="Category"
          text="Category Name"
          value={itemCategory}
          onChangeText={(text) => setItemCategory(text)}
        />
        <Input
          placeholder="Description"
          text="Description"
          value={itemDescription}
          onChangeText={(text) => setItemDescription(text)}
        />
        <Input
          placeholder="Price"
          text="Price"
          value={itemPrice}
          onChangeText={(text) => setItemPrice(text)}
          keyboardType="numeric"
        />
        <Input
          placeholder="Status"
          text="Input Available or NotAvailable"
          value={itemStatus}
          onChangeText={(text) => setItemStatus(text)}
        />
      </View>
      {!loading && <Button title="Add Item" onPress={addItem} cN="mt-20aa" />}
    </ScrollView>
  );
};

export default AddCategory;
