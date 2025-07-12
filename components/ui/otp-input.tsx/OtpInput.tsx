import * as React from "react";
import { forwardRef, useImperativeHandle } from "react";
import { Platform, Pressable, Text, TextInput, View } from "react-native";
import Animated, { FlipInEasyX } from "react-native-reanimated";
import { styles } from "./OtpInput.styles";
import { OtpInputProps, OtpInputRef } from "./OtpInput.types";
import { VerticalStick } from "./VerticalStick";
import { useOtpInput } from "./useOtpInput";

export const OtpInput = forwardRef<OtpInputRef, OtpInputProps>((props, ref) => {
  const {
    models: { text, inputRef, focusedInputIndex, isFocused, placeholder },
    actions: { clear, handlePress, handleTextChange, focus, handleFocus, handleBlur, blur },
    forms: { setTextWithRef },
  } = useOtpInput(props);
  const {
    disabled,
    numberOfDigits = 6,
    autoFocus = true,
    hideStick,
    cursorStyle,
    focusColor = "#A4D0A4",
    animatedInputIndex,
    focusStickBlinkingDuration,
    secureTextEntry = false,
    theme = {},
    textInputProps,
    textProps,
    type = "numeric",
  } = props;
  const {
    containerStyle,
    pinCodeContainerStyle,
    pinCodeTextStyle,
    focusStickStyle,
    focusedPinCodeContainerStyle,
    filledPinCodeContainerStyle,
    disabledPinCodeContainerStyle,
    placeholderTextStyle,
  } = theme;

  useImperativeHandle(ref, () => ({ clear, focus, setValue: setTextWithRef, blur }));

  const generatePinCodeContainerStyle = (isFocusedContainer: boolean, char: string) => {
    const stylesArray = [styles.codeContainer, pinCodeContainerStyle];
    if (focusColor && isFocusedContainer) {
      stylesArray.push({ borderColor: focusColor });
    }

    if (focusedPinCodeContainerStyle && isFocusedContainer) {
      stylesArray.push(focusedPinCodeContainerStyle);
    }

    if (filledPinCodeContainerStyle && Boolean(char)) {
      stylesArray.push(filledPinCodeContainerStyle);
    }

    if (disabledPinCodeContainerStyle && disabled) {
      stylesArray.push(disabledPinCodeContainerStyle);
    }

    return stylesArray;
  };

  const placeholderStyle = {
    opacity: !!placeholder ? 0.5 : pinCodeTextStyle?.opacity || 1,
    ...(!!placeholder ? placeholderTextStyle : []),
  };

  return (
    <Pressable style={[styles.container, containerStyle]} onPress={handlePress}>
      {Array(numberOfDigits)
        .fill(0)
        .map((_, index) => {
          const isPlaceholderCell = !!placeholder && !text?.[index];
          const char = isPlaceholderCell ? placeholder?.[index] || " " : text[index];
          const isFocusedInput = index === focusedInputIndex && !disabled && Boolean(isFocused);
          const isFilledLastInput = text.length === numberOfDigits && index === text.length - 1;
          const isFocusedContainer = isFocusedInput || (isFilledLastInput && Boolean(isFocused));
          const animatedEntry = animatedInputIndex === index;

          return (
            <View
              key={`${char}-${index}`}
              style={generatePinCodeContainerStyle(isFocusedContainer, char)}
              testID="otp-input"
            >
              {isFocusedInput && !hideStick ? (
                <VerticalStick
                  focusColor={focusColor}
                  style={focusStickStyle}
                  focusStickBlinkingDuration={focusStickBlinkingDuration}
                />
              ) : (
                <Animated.View entering={animatedEntry ? FlipInEasyX.duration(1000) : undefined}>
                  <Text
                    {...textProps}
                    testID={textProps?.testID ? `${textProps.testID}-${index}` : undefined}
                    style={[
                      styles.codeText,
                      pinCodeTextStyle,
                      isPlaceholderCell ? placeholderStyle : {},
                      textProps?.style,
                    ]}
                  >
                    {char && secureTextEntry ? "•" : char}
                  </Text>
                </Animated.View>
              )}
            </View>
          );
        })}
      <TextInput
        value={text}
        onChangeText={handleTextChange}
        maxLength={numberOfDigits}
        inputMode={type === "numeric" ? type : "text"}
        textContentType="oneTimeCode"
        ref={inputRef}
        autoFocus={autoFocus}
        secureTextEntry={secureTextEntry}
        // autoComplete={Platform.OS === "android" ? "sms-otp" : "one-time-code"}
        // aria-disabled={disabled}
        editable={!disabled}
        focusable={!disabled}
        testID="otp-input-hidden"
        onFocus={handleFocus}
        onBlur={handleBlur}
        caretHidden={Platform.OS === "ios"}
        {...textInputProps}
        style={[styles.hiddenInput, textInputProps?.style, { cursor: cursorStyle }]}
      />
      {/* </Pressable> */}
    </Pressable>
  );
});
