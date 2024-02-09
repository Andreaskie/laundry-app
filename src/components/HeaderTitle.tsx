import React from "react";
import { Text as RNText, View, TextProps } from "react-native";

interface CustomTextProps extends TextProps {}

const HeaderTitle: React.FC<CustomTextProps> = ({
  children,

  style,
  ...props
}) => {
  return (
    <View className="w-full shadow-xl bg-white p-4 border-b border-gray-300">
      <RNText
        className={`text-[#3498db] text-lg font-semibold `}
        style={style}
        {...props}
      >
        {children}
      </RNText>
    </View>
  );
};

export default HeaderTitle;
