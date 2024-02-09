import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "../screens/AdminScreens/ProfileScreen";
import ScheduleScreen from "../screens/AdminScreens/ScheduleScreen";
import CategoryScreen from "../screens/AdminScreens/CategoryScreen";
import ReportScreen from "../screens/AdminScreens/ReportScreen";
import MapScreen from "../screens/AdminScreens/MapScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const screens = [
  { name: "Home", component: ReportScreen, iconName: "home" },
  { name: "Schedule", component: ScheduleScreen, iconName: "calendar" },
  {
    name: "Category",
    component: CategoryScreen,
    iconName: "format-list-bulleted",
  },
  { name: "Map", component: MapScreen, iconName: "map" },
  { name: "Profile", component: ProfileScreen, iconName: "account" },
];

const MainMenuAdmin = () => {
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

export default MainMenuAdmin;
