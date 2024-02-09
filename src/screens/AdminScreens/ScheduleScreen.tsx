import React, { useContext, useState } from "react";
import { View, Text, ScrollView, Alert, TextInput, Switch } from "react-native";
import HeaderTitle from "../../components/HeaderTitle";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { firebase } from "../../../config";
import { AuthContext } from "../../features/AuthContext";

const ScheduleScreen = () => {
  const [schedule, setSchedule] = useState<any>(null);
  const { user } = useContext(AuthContext);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          console.error("User not logged in.");
          return;
        }

        const scheduleRef = firebase.firestore().collection("schedule");
        const userSchedule = await scheduleRef
          .where("uid", "==", user.uid)
          .get();

        if (!userSchedule.empty) {
          const updatedSchedule = userSchedule.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          const dayOrder = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ];

          const sortedSchedule = updatedSchedule.sort(
            (a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
          );

          setSchedule(sortedSchedule);
        } else {
          setSchedule([
            {
              day: "Monday",
              openTime: { hour: "08", minute: "00" },
              closeTime: { hour: "17", minute: "00" },
              isOpen: false,
              message: "",
            },
            {
              day: "Tuesday",
              openTime: { hour: "08", minute: "00" },
              closeTime: { hour: "17", minute: "00" },
              isOpen: false,
              message: "",
            },
            {
              day: "Wednesday",
              openTime: { hour: "08", minute: "00" },
              closeTime: { hour: "17", minute: "00" },
              isOpen: false,
              message: "",
            },
            {
              day: "Thursday",
              openTime: { hour: "08", minute: "00" },
              closeTime: { hour: "17", minute: "00" },
              isOpen: false,
              message: "",
            },
            {
              day: "Friday",
              openTime: { hour: "08", minute: "00" },
              closeTime: { hour: "17", minute: "00" },
              isOpen: false,
              message: "",
            },
            {
              day: "Saturday",
              openTime: { hour: "08", minute: "00" },
              closeTime: { hour: "17", minute: "00" },
              isOpen: false,
              message: "",
            },
            {
              day: "Sunday",
              openTime: { hour: "08", minute: "00" },
              closeTime: { hour: "17", minute: "00" },
              isOpen: false,
              message: "",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching or sorting schedule:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (index, field, value) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[index][field] = value;
    setSchedule(updatedSchedule);
  };

  const handleSave = async () => {
    try {
      const user = firebase.auth().currentUser;

      if (!user) {
        console.error("User not logged in.");
        return;
      }

      const scheduleRef = firebase.firestore().collection("schedule");

      for (const entry of schedule) {
        const existingDoc = await scheduleRef
          .where("uid", "==", user.uid)
          .where("day", "==", entry.day)
          .get();

        if (existingDoc.docs.length > 0) {
          await scheduleRef.doc(existingDoc.docs[0].id).update({
            uid: user.uid,
            day: entry.day,
            openTime: entry.openTime,
            closeTime: entry.closeTime,
            isOpen: entry.isOpen,
            message: entry.message,
          });
        } else {
          await scheduleRef.add({
            uid: user.uid,
            day: entry.day,
            openTime: entry.openTime,
            closeTime: entry.closeTime,
            isOpen: entry.isOpen,
            message: entry.message,
          });
        }
      }

      Alert.alert("Schedule Updated");
    } catch (error) {
      console.error("Error saving schedule:", error);
    }
  };

  return (
    <View className="w-full h-screen bg-[#f8fafc] ">
      <HeaderTitle>My Schedule</HeaderTitle>
      <View className="w-24 absolute top-0 right-2">
        <Button title="Save" cN="!w-fit" onPress={handleSave} />
      </View>
      <ScrollView className="p-4 mb-20">
        {schedule?.map((entry, index) => (
          <View key={index} className="bg-white rounded-sm mb-5">
            <View className="flex-col justify-between mb-2">
              <View className="flex-row items-center mb-2 px-2 w-full bg-gray-200">
                <Text className="font-semibold">{entry.day}, </Text>
                <Text>Is shop open today?</Text>
                <Switch
                  value={entry.isOpen}
                  onValueChange={() =>
                    handleInputChange(index, "isOpen", !entry.isOpen)
                  }
                />
              </View>
              <View className="flex flex-row items-center gap-2 p-2">
                <Text>Opening Time in 24 hours format: </Text>
                <TextInput
                  value={entry.openTime.hour}
                  placeholder="HH"
                  className="p-1 px-3 bg-black/5 rounded-lg w-13"
                  keyboardType="number-pad"
                  onChangeText={(value) =>
                    handleInputChange(index, "openTime", {
                      ...entry.openTime,
                      hour: value,
                    })
                  }
                />
                <TextInput
                  className="p-1 px-3 bg-black/5 rounded-lg w-13"
                  value={entry.openTime.minute}
                  placeholder="MM"
                  onChangeText={(value) =>
                    handleInputChange(index, "openTime", {
                      ...entry.openTime,
                      minute: value,
                    })
                  }
                />
              </View>
              <View className="flex-row items-center gap-2 p-2">
                <Text>Closing Time in 24 hours format: </Text>
                <TextInput
                  className="p-1 px-3 bg-black/5 rounded-lg w-13"
                  value={entry.closeTime.hour}
                  placeholder="HH"
                  onChangeText={(value) =>
                    handleInputChange(index, "closeTime", {
                      ...entry.closeTime,
                      hour: value,
                    })
                  }
                />
                <TextInput
                  className="p-1 px-3 bg-black/5 rounded-lg w-13"
                  value={entry.closeTime.minute}
                  placeholder="MM"
                  onChangeText={(value) =>
                    handleInputChange(index, "closeTime", {
                      ...entry.closeTime,
                      minute: value,
                    })
                  }
                />
              </View>
            </View>

            <Input
              value={entry.message}
              placeholder="Enter Notes"
              onChangeText={(value) =>
                handleInputChange(index, "message", value)
              }
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ScheduleScreen;
