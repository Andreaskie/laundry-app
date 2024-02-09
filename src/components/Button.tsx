import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary";
  cN?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  cN,
  variant = "primary",
  style,
  ...props
}) => {
  const buttonStyle =
    variant === "primary" ? styles.primaryButton : styles.secondaryButton;
  const textColor =
    variant === "primary" ? styles.primaryText : styles.secondaryText;

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle, style]}
      onPress={onPress}
      className={cN}
      {...props}
    >
      <Text style={[styles.buttonText, textColor]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: "#3498db",
  },
  secondaryButton: {
    backgroundColor: "transparent",
  },
  primaryText: {
    color: "#fff",
  },
  secondaryText: {
    color: "#3498db",
  },
  buttonText: {
    fontSize: 16,
  },
});

export default Button;
