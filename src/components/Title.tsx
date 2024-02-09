import React from "react";
import { Text as RNText, TextStyle, TextProps } from "react-native";

interface CustomTextProps extends TextProps {
  variant?: "normal" | "bold" | "italic";
  style?: TextStyle;
}

const Title: React.FC<CustomTextProps> = ({
  children,
  variant = "normal",
  style,
  ...props
}) => {
  const textStyle =
    variant === "normal"
      ? "text-base"
      : variant === "bold"
      ? "font-semibold text-2xl"
      : "italic";

  return (
    <RNText
      className={`text-[#3498db] mt-10 tracking-wider text-center     ${textStyle}`}
      style={style}
      {...props}
    >
      {children}
    </RNText>
  );
};

export default Title;
