import React, { useContext } from "react";
import { View, Text } from "react-native";

import { firebase } from "../../../config";
import { AuthContext } from "../../features/AuthContext";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Button from "../../components/Button";
import { useNavigation } from "@react-navigation/native";

const ReportScreen = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = React.useState<any>([]);
  const [categories, setCategories] = React.useState<any>([]);
  const tableHeaders = ["Date", "Price", "Status", "Action"];

  const navigation = useNavigation();
  React.useEffect(() => {
    if (user !== null) {
      const unsubscribe = firebase
        .firestore()
        .collection("bookings")
        .where("laundryId", "==", user.uid)
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

  React.useEffect(() => {
    if (user !== null) {
      const unsubscribe = firebase
        .firestore()
        .collection("items")
        .where("uploaderUid", "==", user.uid)
        .onSnapshot((snapshot) => {
          const itemsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCategories(itemsData);
        });

      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  const completedSales =
    data.length > 0 &&
    data
      .filter((item) => item.status === "Completed")
      .reduce((total, item) => total + item.total, 0);

  return (
    <ScrollView className="pb-10">
      <View className="rounded-sm mx-4 p-4 my-2 bg-white">
        <Text>
          Total Sales: <Text className="font-bold">₱ {completedSales}</Text>
        </Text>
      </View>
      <View className="rounded-sm mx-4 p-4 my-2 bg-white">
        <Text>
          Bookings:{" "}
          <Text className="font-bold">
            {" "}
            {data.length > 0 &&
              data.filter((x) => x.status === "Pending").length}
          </Text>
        </Text>
      </View>
      <View className="rounded-sm mx-4 my-2 p-4 bg-white">
        <Text>
          Categories: <Text className="font-bold">{categories.length}</Text>
        </Text>
      </View>

      <View className=" m-3 rounded ">
        {data &&
          data.map((bks, index) => {
            const timestampObject = bks.bookingDate;
            const timestampMilliseconds = timestampObject.seconds * 1000;
            const date = new Date(timestampMilliseconds);
            const formattedDate = date.toLocaleString();

            const timestampObjectUp = bks?.updatedAt;
            const timestampMillisecondsUp =
              timestampObjectUp?.seconds * 1000 +
              timestampObjectUp?.nanoseconds / 1000000;
            const dateUp = new Date(timestampMillisecondsUp);
            const formattedDateUp = dateUp.toLocaleString();

            return (
              <View key={index} className="bg-white my-2 p-2">
                <Text className="text-sm border-b w-full text-[#3498db] border-gray-200 pb-2 uppercase">
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

                <View className="flex-row justify-between p-2">
                  <Text className="font-bold"> Booking Date: </Text>
                  <Text>{formattedDate}</Text>
                </View>

                <View className="flex-row justify-between p-2">
                  <Text className="font-bold"> Last Status Updated: </Text>
                  <Text>{!bks.updatedAt ? "N/A" : formattedDateUp}</Text>
                </View>

                {bks?.cart.map((crt, index) => {
                  return (
                    <View
                      className="flex-row justify-between py-3 px-2 bg-[#f8fafc]"
                      key={index}
                    >
                      <View>
                        <Text className="font-semibold   ">{crt.category}</Text>
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
                <Button
                  title="View Details"
                  onPress={() =>
                    navigation.navigate("ReportScreenDetails", {
                      bks,
                    })
                  }
                />
                <></>
              </View>
            );
          })}
      </View>
    </ScrollView>
  );
};

export default ReportScreen;
