import {
  ColorValue,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  TextInputProps,
  TextProps,
  TextStyle,
  ViewStyle,
} from "react-native";

export interface OtpInputProps {
  text?: string;
  defaultText?: string;
  numberOfDigits?: number;
  autoFocus?: boolean;
  focusColor?: ColorValue;
  onTextChange?: (text: string) => void;
  onFilled?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  cursorStyle?: "default" | "pointer" | "not-allowed";
  onEnterKeyPress?: () => void;
  onBackspaceKeyPress?: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
  animatedInputIndex?: number;
  blurOnFilled?: boolean;
  hideStick?: boolean;
  focusStickBlinkingDuration?: number;
  secureTextEntry?: boolean;
  theme?: Theme;
  disabled?: boolean;
  onPress?: () => void;
  textInputProps?: TextInputProps;
  textProps?: TextProps;
  type?: "alpha" | "numeric" | "alphanumeric";
  placeholder?: string;
}

export interface OtpInputRef {
  clear: () => void;
  focus: () => void;
  setValue: (value: string) => void;
  blur: () => void;
}

export interface Theme {
  containerStyle?: ViewStyle;
  pinCodeContainerStyle?: ViewStyle;
  filledPinCodeContainerStyle?: ViewStyle;
  pinCodeTextStyle?: TextStyle;
  focusStickStyle?: ViewStyle;
  focusedPinCodeContainerStyle?: ViewStyle;
  disabledPinCodeContainerStyle?: ViewStyle;
  placeholderTextStyle?: TextStyle;
}
