// Container.tsx

import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";

interface FormContainer {
  children: ReactNode;
  className?: any;
}

const FormContainer: React.FC<FormContainer> = ({ children, className }) => {
  console.log(className)
  return <View className={`w-full px-5  ${className}`}>{children}</View>;
};

export default FormContainer;
