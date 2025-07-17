import React from "react";
import { NativeSyntheticEvent, StyleSheet, TextInputKeyPressEventData } from "react-native";
import { OtpInput, OtpInputRef, Theme } from "./otp-input.tsx";

interface GameInputProps {
  ref?: React.Ref<OtpInputRef>;
  defaultValue?: string;
  value?: string;
  onChange?: (val: string) => void;
  onPress?: () => void;
  onEnterKeyPress?: () => void;
  onBackspaceKeyPress?: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
  nextInputRef?: OtpInputRef;
  cursorStyle?: "default" | "pointer" | "not-allowed";
  disabled?: boolean;
  animatedInputIndex?: number;
  autoFocus?: boolean;
  styles?: Theme;
}

export default function GameInput({
  ref,
  defaultValue,
  value,
  onChange,
  onPress,
  onEnterKeyPress,
  onBackspaceKeyPress,
  cursorStyle,
  disabled = false,
  nextInputRef,
  animatedInputIndex,
  autoFocus = false,
  styles = {},
}: GameInputProps) {
  // const { colorScheme } = useColorScheme();
  // const isDark = colorScheme === "dark";
  const theme = StyleSheet.create({
    containerStyle: { ...defaultStyles.container, ...styles?.containerStyle },
    pinCodeContainerStyle: { ...defaultStyles.pinCodeContainer, ...styles?.pinCodeContainerStyle },
    pinCodeTextStyle: { ...defaultStyles.pinCodeText, ...styles?.pinCodeTextStyle },
    focusStickStyle: { ...defaultStyles.focusStick, ...styles?.focusStickStyle },
    focusedPinCodeContainerStyle: { ...defaultStyles.activePinCodeContainer, ...styles?.focusedPinCodeContainerStyle },
    placeholderTextStyle: { ...defaultStyles.placeholderText, ...styles?.placeholderTextStyle },
    filledPinCodeContainerStyle: {
      ...defaultStyles.filledPinCodeContainer,
      ...styles?.filledPinCodeContainerStyle,
    },
    disabledPinCodeContainerStyle: {
      ...defaultStyles.disabledPinCodeContainer,
      ...styles?.disabledPinCodeContainerStyle,
    },
  });

  return (
    <OtpInput
      numberOfDigits={10}
      onPress={onPress}
      focusColor="gray-500"
      text={value}
      onEnterKeyPress={onEnterKeyPress}
      onBackspaceKeyPress={onBackspaceKeyPress}
      defaultText={defaultValue}
      animatedInputIndex={animatedInputIndex}
      type="alpha"
      cursorStyle={cursorStyle}
      onTextChange={onChange}
      disabled={disabled}
      autoFocus={autoFocus}
      ref={ref}
      theme={theme}
    />
  );
}

const defaultStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 4,
    textTransform: "uppercase",
    borderWidth: 1,
    borderColor: "#e5e7eb", // gray-200
    overflow: "hidden", // enforce rounded corners
  },
  pinCodeContainer: {
    flex: 1,
    aspectRatio: 0.75,
    borderRadius: 0,
    overflow: "hidden",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  activePinCodeContainer: {
    borderLeftWidth: 0.75,
    outlineWidth: 1,
    outlineColor: "#000000",
    // borderLeftWidth: 1,
  },
  filledPinCodeContainer: {
    backgroundColor: "#f9fafb", // gray-50
  },
  disabledPinCodeContainer: {
    // opacity: 0.5,
  },
  pinCodeText: {
    fontSize: 24,
    fontWeight: "500",
    color: "#111827", // gray-900
    textAlign: "center",
  },
  placeholderText: {
    color: "#9ca3af", // gray-400
    fontSize: 24,
    textAlign: "center",
  },
  focusStick: {
    width: 2,
    height: 28,
    backgroundColor: "#000000",
    borderRadius: 1,
  },
});
