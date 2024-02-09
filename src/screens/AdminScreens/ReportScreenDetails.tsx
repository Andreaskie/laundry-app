import React, { useState } from "react";
import { Alert, Image, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Button from "../../components/Button";
import { firebase } from "../../../config";
const ReportScreenDetails = ({ route }) => {
  const [loading, setLoading] = useState(false);
  const timestampObject = route.params.bks.bookingDate;
  const timestampMilliseconds = timestampObject.seconds * 1000;
  const date = new Date(timestampMilliseconds);
  const formattedDate = date.toLocaleString();

  const timestampObjectUp = route.params.bks?.updatedAt;
  const timestampMillisecondsUp =
    timestampObjectUp?.seconds * 1000 +
    timestampObjectUp?.nanoseconds / 1000000;
  const dateUp = new Date(timestampMillisecondsUp);
  const formattedDateUp = dateUp.toLocaleString();

  const approveBooking = async (status) => {
    try {
      setLoading(true);

      const bookingRef = firebase
        .firestore()
        .collection("bookings")
        .doc(route.params.bks.bookingUid);

      const timestamp = firebase.firestore.FieldValue.serverTimestamp();

      await bookingRef.update({
        status: status,
        updatedAt: timestamp,
      });

      Alert.alert("Booking Updated");
    } catch (error) {
      console.error("Error updating booking status:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <ScrollView>
      <View className="bg-white my-2 p-2">
        <Text className="text-sm border-b w-full text-[#3498db] border-gray-200 pb-2 uppercase">
          Transaction ID: &nbsp;
          {route.params.bks.bookingUid.split("-")[0]}
        </Text>
        <Text
          className={`text-sm uppercase absolute right-2 top-1 p-1 rounded-sm  ${
            route.params.bks.status === "Pending"
              ? "bg-yellow-500 text-white"
              : route.params.bks.status === "Cancelled"
              ? "bg-red-500 text-white"
              : route.params.bks.status === "Approved"
              ? "bg-green-500 text-white"
              : route.params.bks.status === "Completed"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-[#3498db]"
          }`}
        >
          {route.params.bks.status}
        </Text>

        <View className="flex-row justify-between p-2">
          <Text className="font-bold"> Booking Date: </Text>
          <Text>{formattedDate}</Text>
        </View>

        <View className="flex-row justify-between p-2">
          <Text className="font-bold"> Last Status Updated: </Text>
          <Text>{!route.params.bks.updatedAt ? "N/A" : formattedDateUp}</Text>
        </View>

        {route.params.bks?.cart.map((crt, index) => {
          return (
            <View
              className="flex-row justify-between py-3 px-2 bg-[#f8fafc]"
              key={index}
            >
              <View>
                <Text className="font-semibold   ">{crt.category}</Text>
                <Text className="text-slate-700">{crt.description}</Text>
              </View>
              <Text className="text-xs">
                {crt.quantity} x ₱ {crt.price} = ₱{crt.quantity * crt.price}
              </Text>
            </View>
          );
        })}
        <View className="flex-row justify-between p-2">
          <Text className="   font-bold">Total:</Text>
          <Text className="">₱ {route.params.bks.total}</Text>
        </View>

        <Image src={route.params.bks?.paymentImage} className="h-60" />
        {route.params.bks.status === "Pending" && (
          <Button
            title="Approve Booking"
            onPress={() => approveBooking("Approved")}
          />
        )}
        {route.params.bks.status === "Approved" && (
          <Button
            title="Mark as Completed"
            onPress={() => approveBooking("Completed")}
          />
        )}
        <></>
      </View>
    </ScrollView>
  );
};

export default ReportScreenDetails;
