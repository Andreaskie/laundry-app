import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { AuthContext } from "../../features/AuthContext";
import { firebase } from "../../../config";
import { ScrollView } from "react-native-gesture-handler";
import HeaderTitle from "../../components/HeaderTitle";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Button from "../../components/Button";
import { useNavigation } from "@react-navigation/native";

const UserBookingScreen = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<any>();

  React.useEffect(() => {
    if (user !== null) {
      const unsubscribe = firebase
        .firestore()
        .collection("bookings")
        .where("userData.uid", "==", user.uid)
        .onSnapshot((snapshot) => {
          const itemsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setData(itemsData);
        });

      return () => {
        unsubscribe();
      };
    }
  }, [user]);
  const updateStatus = async (bookingId) => {
    try {
      setLoading(true);

      const bookingRef = firebase
        .firestore()
        .collection("bookings")
        .doc(bookingId);

      const timestamp = firebase.firestore.FieldValue.serverTimestamp();

      await bookingRef.update({
        status: "Cancelled",
        updatedAt: timestamp,
      });

      console.log(
        `Booking ${bookingId} status updated successfully at ${timestamp}`
      );
      Alert.alert("Booking Cancelled");
    } catch (error) {
      console.error("Error updating booking status:", error);
    } finally {
      setLoading(false);
    }
  };

  const navigation = useNavigation();

  return (
    <View className="bg-[#f8fafc] flex-1">
      <HeaderTitle>Booking Transactions</HeaderTitle>
      <ScrollView className="mb-10">
        <View className=" m-3 rounded ">
          {data &&
            data.reverse().map((bks, index) => {
              const timestampObject = bks.bookingDate;
              const timestampMilliseconds = timestampObject.seconds * 1000;
              const date = new Date(timestampMilliseconds);
              const formattedDate = date.toLocaleString();

              return (
                <View key={index} className="bg-white my-2 p-2">
                  <Text className="text-sm border-b w-full text-[#3498db] border-gray-200 pb-2 uppercase">
                    <MaterialCommunityIcons
                      name="history"
                      color="#3498db"
                      size={20}
                    />
                    Transaction ID: &nbsp;
                    {bks.bookingUid.split("-")[0]}
                  </Text>
                  <Text
                    className={`text-sm uppercase absolute right-2 top-1 p-1 rounded-sm  ${
                      bks.status === "Pending"
                        ? "bg-yellow-500 text-white"
                        : bks.status === "Cancelled"
                        ? "bg-red-500 text-white"
                        : bks.status === "Approved"
                        ? "bg-green-500 text-white"
                        : bks.status === "Completed"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-[#3498db]"
                    }`}
                  >
                    {bks.status}
                  </Text>
                  <Text className="p-1 my-2 text-slate900  bg-gray-100">
                    &nbsp;Service Booked @ {bks?.shopName.user_name}
                  </Text>
                  <View className="flex-row justify-between p-2">
                    <Text className="font-bold"> Booking Date: </Text>
                    <Text>{formattedDate}</Text>
                  </View>

                  {bks?.cart.map((crt, index) => {
                    return (
                      <View
                        className="flex-row justify-between py-3 px-2 bg-[#f8fafc]"
                        key={index}
                      >
                        <View>
                          <Text className="font-semibold   ">
                            {crt.category}
                          </Text>
                          <Text className="text-slate-700">
                            {crt.description}
                          </Text>
                        </View>
                        <Text className="text-xs">
                          {crt.quantity} x ₱ {crt.price} = ₱
                          {crt.quantity * crt.price}
                        </Text>
                      </View>
                    );
                  })}
                  <View className="flex-row justify-between p-2">
                    <Text className="   font-bold">Total:</Text>
                    <Text className="">₱ {bks.total}</Text>
                  </View>
                  {loading ? (
                    <ActivityIndicator size="small" color="#3498db" />
                  ) : (
                    <>
                      {bks.status === "Pending" && (
                        <View className="flex-row justify-end px-3">
                          <TouchableOpacity
                            onPress={() => updateStatus(bks.bookingUid)}
                            className={`mt-3 p-2 w-1/2 border border-[#ff6347] rounded-md `}
                          >
                            <Text className="text-center text-[#ff6347] font-semibold">
                              Cancel Booking
                            </Text>
                          </TouchableOpacity>
                          <View className="w-2/4 ml-2">
                            {!bks.paymentImage ? (
                              <Button
                                title="Proceed to payment"
                                onPress={() =>
                                  navigation.navigate("PaymentUserScreen", {
                                    bks,
                                  })
                                }
                              />
                            ) : (
                              <Text className="text-center m-auto underline . . ."></Text>
                            )}
                          </View>
                        </View>
                      )}
                    </>
                  )}
                </View>
              );
            })}
        </View>
      </ScrollView>
    </View>
  );
};

export default UserBookingScreen;
