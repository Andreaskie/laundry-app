import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "../screens/AdminScreens/ProfileScreen";
import ScheduleScreen from "../screens/AdminScreens/ScheduleScreen";
import CategoryScreen from "../screens/AdminScreens/CategoryScreen";
import ReportScreen from "../screens/AdminScreens/ReportScreen";
import MapScreen from "../screens/AdminScreens/MapScreen";

// Import your screens

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

const ScheduleStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Schedule" component={ScheduleScreen} />
  </Stack.Navigator>
);

const CategoryStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Category" component={CategoryScreen} />
  </Stack.Navigator>
);

const ReportsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Reports" component={ReportScreen} />
  </Stack.Navigator>
);

const MapStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Map" component={MapScreen} />
  </Stack.Navigator>
);

function MainMenuAdmin() {
  return (
    <Tab.Navigator
      initialRouteName="Profile"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case "Profile":
              iconName = "account";
              break;
            case "Schedule":
              iconName = "calendar";
              break;
            case "Category":
              iconName = "format-list-bulleted";
              break;
            case "Reports":
              iconName = "file-chart";
              break;
            case "Map":
              iconName = "map";
              break;
            default:
              iconName = "account";
          }

          return (
            <MaterialCommunityIcons name={iconName} color={color} size={size} />
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: "#e91e63",
      }}
    >
      <Tab.Screen name="Profile" component={ProfileStack} />
      <Tab.Screen name="Schedule" component={ScheduleStack} />
      <Tab.Screen name="Category" component={CategoryStack} />
      <Tab.Screen name="Reports" component={ReportsStack} />
      <Tab.Screen name="Map" component={MapStack} />
    </Tab.Navigator>
  );
}

export default MainMenuAdmin;
