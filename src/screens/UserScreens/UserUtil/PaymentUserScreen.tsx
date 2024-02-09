import React from "react";
import { ActivityIndicator, Alert, Image, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Geolocation from "react-native-geocoding";
import Button from "../../../components/Button";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { firebase } from "../../../../config";
import { useNavigation } from "@react-navigation/native";
const PaymentUserScreen = ({ route }: any) => {
  const [addressFormatted, setAddressFormatted] = React.useState("");
  const [imageUri, setImageUri] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  Geolocation.init("AIzaSyBiEejYn0WTm0Fxwc58ztsOl1btvFtlfmg");
  const navigation = useNavigation();
  React.useEffect(() => {
    const formatData = async () => {
      const result = await Geolocation.from(
        route.params.bks.shopName.address.latitude,
        route.params.bks.shopName.address.longitude
      );

      const formattedAddress = result.results[0].formatted_address;

      setAddressFormatted(formattedAddress);
    };
    formatData();
  }, [route]);

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

  const submitPayment = async () => {
    try {
      if (!imageUri) {
        Alert.alert(
          "Image not selected",
          "Please choose an image for the item."
        );
        return;
      }
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const imageUrl = await uploadImage();
      const data = {
        ...route.params.bks,
      };

      const bookingRef = firebase
        .firestore()
        .collection("bookings")
        .doc(data.bookingUid);

      await bookingRef.update({
        paymentImage: imageUrl,
        updatedAt: timestamp,
      });
      Alert.alert("Payment Added");
      navigation.navigate("Home");
      console.log(`Payment Added Successfully at ${timestamp}`);
    } catch (err) {
      console.log(err);
    }
  };

  const originalDate = new Date(route.params?.bks.bookingDate);
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  const formattedDateString = originalDate.toLocaleDateString("en-US", options);

  return (
    <ScrollView>
      <Text className="text-xl font-semibold pl-4 pt-3  text-[#0891b2]">
        Payment Page
      </Text>
      <View className=" bg-white m-3 rounded-lg p-2">
        <Text className="text-sm border-b w-full text-[#3498db] border-gray-200 pb-2 uppercase">
          <MaterialCommunityIcons name="history" color="#3498db" size={20} />
          Transaction ID: &nbsp;
          {route.params.bks.bookingUid.split("-")[0]}
        </Text>

        <Text className="p-1 my-2 text-slate900  bg-gray-100">
          &nbsp;Service Booked @ {route.params.bks?.shopName.user_name}
        </Text>
      </View>

      <View className=" bg-white m-3 rounded-lg p-3 space-y-2">
        <Text className="text-sm border-b text-[#3498db] border-gray-200 pb-2 uppercase items-center">
          <MaterialCommunityIcons name="history" color="#3498db" size={20} />
          &nbsp; Booking Details
        </Text>
        <View className="flex-row justify-between py-1">
          <Text className="font-bold"> Date: </Text>
          <Text>{formattedDateString}</Text>
        </View>

        <View className="flex-row justify-between py-1  bg-gray-100 font-semibold px-1">
          <Text className="font-bold"> Items</Text>
          <Text className="font-bold"> Quantity/Sub Total</Text>
        </View>

        {route.params.bks?.cart.map((x, index) => {
          return (
            <View className="flex-row justify-between py-1" key={index}>
              <View>
                <Text className="font-bold uppercase tracking-tight ">
                  {" "}
                  {x.category}
                </Text>
                <Text className=""> {x.description}</Text>
              </View>
              <Text className="text-xs">
                {x.quantity} x ₱ {x.price} = ₱{x.quantity * x.price}
              </Text>
            </View>
          );
        })}

        <View className="flex-row justify-between p-1">
          <Text className="  text-lg font-bold">Total:</Text>
          <Text className=" text-lg">₱ {route.params.bks?.total}</Text>
        </View>
      </View>

      <View className=" bg-white m-3 rounded-lg p-3 space-y-2">
        <Text className="text-sm border-b text-[#3498db] border-gray-200 pb-2 uppercase items-center">
          <MaterialCommunityIcons name="cash" color="#3498db" size={20} />
          &nbsp; Payment Details
        </Text>
        <Text className="text-slate-700">
          Kindly upload a screenshot/screen of your receipt. You can send your
          payment via gcash using the number below:
        </Text>

        <View className="flex-row justify-between py-1">
          <Text className="font-bold"> Gcash number: </Text>
          <Text>{route.params.bks.shopName?.contact}</Text>
        </View>
        <View className="flex-row justify-between py-1">
          <Text className="font-bold"> Receipient Name: </Text>
          <Text>
            {route.params.bks.shopName?.first_name}{" "}
            {route.params.bks.shopName?.last_name}{" "}
          </Text>
        </View>
        {loading && <ActivityIndicator size="large" />}

        <View className="flex-row justify-between py-1">
          <Text className="font-bold"> Attach Image: </Text>
        </View>
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
        <View className="flex-row justify-end">
          <View className="w-2/4 ml-2">
            {!loading && (
              <Button title="Submit Payment" onPress={submitPayment} />
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default PaymentUserScreen;
