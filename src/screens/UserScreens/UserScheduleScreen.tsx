import React, { useContext } from "react";
import { View, Text } from "react-native";
import { AuthContext } from "../../features/AuthContext";
import { firebase } from "../../../config";
import HeaderTitle from "../../components/HeaderTitle";
import { ScrollView } from "react-native-gesture-handler";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
interface ScheduleData {
  id: string;
  day: string;
  uid: string;
  openTime: { hour: string; minute: string };
  closeTime: { hour: string; minute: string };
  isOpen: boolean;
}

const UserScheduleScreen: React.FC = () => {
  const [schedule, setSchedule] = React.useState<Record<
    string,
    ScheduleData[]
  > | null>(null);
  const { user } = useContext<any>(AuthContext);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          console.error("User not logged in.");
          return;
        }

        const scheduleRef = firebase.firestore().collection("schedule");
        const userSchedule = await scheduleRef.get();

        const usersQuery = await firebase
          .firestore()
          .collection("users")
          .where("roles", "==", true)
          .get();

        const usersArray = usersQuery.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const groupedSchedules: Record<string, ScheduleData[]> = {};
        userSchedule.docs.forEach((doc) => {
          const scheduleData: ScheduleData = { id: doc.id, ...doc.data() };
          const matchingUser = usersArray.find(
            (user) => user.id === scheduleData.uid
          );

          if (matchingUser) {
            const title = " " + matchingUser.user_name + " Schedule";

            if (!groupedSchedules[title]) {
              groupedSchedules[title] = [];
            }

            groupedSchedules[title].push(scheduleData);
          }
        });

        setSchedule(groupedSchedules);
      } catch (error) {
        console.error("Error fetching or updating schedule:", error);
      }
    };

    fetchData();
  }, [user]);

  return (
    <View className="bg-[#f8fafc]">
      <HeaderTitle>Laundry Schedules</HeaderTitle>
      <ScrollView className="mb-20">
        {schedule &&
          Object.entries(schedule).map(([title, schedules], index) => (
            <View key={index} className="bg-white m-3 rounded p-2">
              <Text className="text-sm border-b text-[#3498db] border-gray-200 pb-2 uppercase">
                <MaterialCommunityIcons
                  name="calendar-outline"
                  color="#3498db"
                  size={20}
                />
                {String(title)}
              </Text>
              {schedules.length > 0 &&
                schedules
                  .sort((a, b) => {
                    const daysOrder = [
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ];
                    return daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
                  })
                  .map((item, subIndex) => (
                    <View key={subIndex} className="flex-col bg-[#f8fafc] m-2 p-2 ">
                      <View className="flex-row items-center p-1  ">
                        <Text className="text-[#3498db] my-2">{item.day}</Text>
                        <Text
                          className={` ml-2 text-sm uppercase ${
                            item.isOpen ? "text-green-400" : "text-red-500"
                          }`}
                        >
                          {`${item.isOpen ? "Shop Open" : "Shop Close"}`}
                        </Text>
                      </View>

                      <Text className="p-1">
                        Schedules - &nbsp;
                        {item.openTime?.hour}:{item.openTime?.minute} -{" "}
                        {item.closeTime?.hour}:{item.closeTime?.minute}
                      </Text>

                      {item.message && (
                        <Text className="p-1">Note: {item.message}</Text>
                      )}
                    </View>
                  ))}
            </View>
          ))}
      </ScrollView>
    </View>
  );
};

export default UserScheduleScreen;
