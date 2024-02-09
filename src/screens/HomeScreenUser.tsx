import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "../screens/AdminScreens/ProfileScreen";
import ScheduleScreen from "../screens/AdminScreens/ScheduleScreen";
import CategoryScreen from "../screens/AdminScreens/CategoryScreen";
import ReportScreen from "../screens/AdminScreens/ReportScreen";
import MapScreen from "../screens/AdminScreens/MapScreen";
import DashboardScreen from "./UserScreens/DashboardScreen";
import UserScheduleScreen from "./UserScreens/UserScheduleScreen";
import UserBookingScreen from "./UserScreens/UserBookingScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const screens = [
  { name: "Home", component: DashboardScreen, iconName: "home" },
  { name: "Schedule", component: UserScheduleScreen, iconName: "calendar" },
  { name: "Booking", component: UserBookingScreen, iconName: "book" },
  { name: "Profile", component: ProfileScreen, iconName: "account" },
];

const MainMenuUser = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const screen = screens.find((s) => s.name === route.name);
          return (
            <MaterialCommunityIcons
              name={screen?.iconName || "account"}
              color={color}
              size={size}
            />
          );
        },
      })}
    >
      {screens.map((screen) => (
        <Tab.Screen
          key={screen.name}
          name={screen.name}
          options={{ headerShown: false }}
          component={screen.component}
        />
      ))}
    </Tab.Navigator>
  );
};

export default MainMenuUser;
