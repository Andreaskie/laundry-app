// Container.tsx

import { StatusBar } from "expo-status-bar";
import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";

interface ContainerProps {
  children: ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <View className="bg-[#f8fafc] pb-5 px-3 h-full w-full flex justify-around items-center">
      <StatusBar style="light" />
      {children}
    </View>
  );
};

export default Container;
