// Input.tsx
import React, { useState } from "react";
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  View,
  Text,
} from "react-native";

interface InputProps extends TextInputProps {
  variant?: "default" | "rounded";
  label?: string;
  type?: any;
  locked?: boolean;
  text?: string;
  onChangeText?: (text: string) => void;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  type,
  text,
  variant = "default",
  label,
  locked,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };

  const inputStyle = variant === "rounded" ? "rounded" : "";

  const borderStyle = isFocused
    ? "border-0.5 border-blue-500"
    : "border-0.5 border-gray-400";

  return (
    <View className="flex items-center space-y-2 mt-3">
      <Text className="text-left w-full ml-2 font-bold text-slate-900">
        {placeholder}
      </Text>
      <View className="bg-black/5 rounded-lg w-full p-3">
        <TextInput
          className=""
          value={value}
          aria-disabled={locked}
          placeholder={text}
          keyboardType={type}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          onFocus={handleInputFocus}
          editable={!locked}
          onBlur={handleInputBlur}
          {...props}
        />
      </View>
    </View>
  );
};

export default Input;
