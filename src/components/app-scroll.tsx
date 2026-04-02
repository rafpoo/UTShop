import React from 'react';
import { Platform, ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';

type AppScrollViewProps = ScrollViewProps & {
  children: React.ReactNode;
};

export function AppScrollView({
  children,
  style,
  contentContainerStyle,
  showsVerticalScrollIndicator,
  ...rest
}: AppScrollViewProps) {
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.webScroll, style]}>
        <View style={contentContainerStyle}>{children}</View>
      </View>
    );
  }

  return (
    <ScrollView
      style={style}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      {...rest}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  webScroll: {
    flex: 1,
    overflowY: 'auto',
  },
});
