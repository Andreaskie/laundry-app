import React, { useContext, useEffect } from "react";
import { firebase } from "../../../../config";
import { View, Text, Alert } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import Loading from "../../../components/Loading";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Geolocation from "react-native-geocoding";
import Button from "../../../components/Button";
import { AuthContext } from "../../../features/AuthContext";

import { useNavigation } from "@react-navigation/native";
import { useCart } from "../../../features/CartContext";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
LocaleConfig.locales["en"] = {
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  monthNamesShort: [
    "Jan.",
    "Feb.",
    "Mar.",
    "Apr.",
    "May",
    "Jun.",
    "Jul.",
    "Aug.",
    "Sep.",
    "Oct.",
    "Nov.",
    "Dec.",
  ],
  dayNames: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};

LocaleConfig.defaultLocale = "en";

const BookingUserScreen = ({ route }: any) => {
  const [activeSchedule, setActiveSchedule] = React.useState<any>(null);
  const [markedDates, setMarkedDates] = React.useState<any>({});
  const [userData, setUserData] = React.useState<any>();

  const [addressFormatted, setAddressFormatted] = React.useState<any>(null);
  const [bookingData, setBookingData] = React.useState(
    route.params.bookingInitialData
  );
  const bookingUid = uuidv4();

  const { user } = useContext<any>(AuthContext);
  const navigation = useNavigation<any>();

  const { clearCart } = useCart();
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const scheduleRef = firebase.firestore().collection("schedule");
        const userSchedule = await scheduleRef
          .where("uid", "==", route.params.bookingInitialData.laundryId)
          .get();

        if (!userSchedule.empty) {
          const updatedSchedule = userSchedule.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          const openSchedules = updatedSchedule.filter(
            (schedule) => schedule.isOpen
          );
          setActiveSchedule(openSchedules);

          const markedDatesObj: any = {};
          const allDays = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ];

          allDays.forEach((day: any) => {
            markedDatesObj[day] = {
              marked: openSchedules.some((schedule) => schedule.day === day),
              dotColor: "blue",
            };
          });

          setMarkedDates(markedDatesObj);
        }
      } catch (error) {
        console.error("Error fetching or sorting schedule:", error);
      }
    };

    fetchData();
  }, [route.params]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await firebase
          .firestore()
          .collection("users")
          .doc(user.uid)
          .get();

        if (userDoc.exists) {
          setUserData(userDoc.data());
        } else {
          console.log("User does not exist");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const originalDate = new Date(bookingData.bookingDate);
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  const formattedDateString = originalDate.toLocaleDateString("en-US", options);

  Geolocation.init("AIzaSyBiEejYn0WTm0Fxwc58ztsOl1btvFtlfmg");

  useEffect(() => {
    const formatData = async () => {
      const result = await Geolocation.from(
        bookingData.shopName.address.latitude,
        bookingData.shopName.address.longitude
      );

      const formattedAddress = result.results[0].formatted_address;

      setAddressFormatted(formattedAddress);
    };
    formatData();
  }, []);

  const submitBooking = async () => {
    try {
      const data = { ...bookingData, userData, bookingUid, status: "Pending" };

      const bookingRef = firebase
        .firestore()
        .collection("bookings")
        .doc(bookingUid);
      await bookingRef.set(data);
      Alert.alert("Booking submitted successfully!");
      navigation.navigate("Home");
      clearCart();
    } catch (error) {
      console.error("Error submitting booking:", error);
    }
  };
  if (!activeSchedule) {
    return <Loading />;
  }
  return (
    <ScrollView>
      <View className=" bg-white m-3 rounded-lg p-2">
        <Text className="text-xl font-semibold p-2  text-[#0891b2]">
          Book a Laundry with{" "}
          {route.params.bookingInitialData.shopName.user_name}
        </Text>

        <View className="flex flex-row p-1 ">
          <MaterialCommunityIcons
            name="google-maps"
            color="#3498db"
            size={20}
          />
          <Text className=" text-slate-700 tracking-wide pl-2">
            {addressFormatted}
          </Text>
        </View>
      </View>

      {activeSchedule?.length > 0 && (
        <Calendar
          markedDates={markedDates}
          style={{ borderRadius: 10, overflow: "hidden" }}
          className="m-2"
          minDate={new Date().toISOString().split("T")[0]}
          dayComponent={({ date, state }) => {
            const isAvailable = activeSchedule.some(
              (schedule) =>
                schedule.day === getDayName(new Date(date.dateString))
            );

            return (
              <TouchableOpacity
                onPress={() => {
                  if (isAvailable) {
                    setBookingData({
                      ...bookingData,
                      bookingDate: new Date(date.dateString),
                    });
                  } else {
                    Alert.alert("This day is not available.");
                  }
                }}
                style={{ borderRadius: 999, overflow: "hidden" }}
              >
                <View style={{ padding: 10, borderRadius: 999 }}>
                  <Text style={{ color: isAvailable ? "blue" : "red" }}>
                    {date.day}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

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

        {bookingData?.cart.map((x, index) => {
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
          <Text className=" text-lg">₱ {bookingData.total}</Text>
        </View>

        <View className="flex-row justify-end">
          <View className="w-2/4 ml-2">
            <Button title="Submit" onPress={submitBooking} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

function getDayName(date: Date): string {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[date.getDay()];
}

export default BookingUserScreen;
