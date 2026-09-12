import React from 'react';
import {ActivityIndicator, StatusBar, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors, FontFamily, FontSize, Spacing} from '../theme';

export default function SplashScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.splashRoot,
        {paddingTop: insets.top, paddingBottom: insets.bottom},
      ]}>
      <StatusBar backgroundColor={Colors.dark} barStyle="light-content" />
      <View style={styles.splashContent}>
        <View style={styles.splashLogoCircle}>
          <Icon name="content-cut" size={44} color={Colors.primary} />
        </View>
        <Text style={styles.splashTitle}>Stitcho</Text>
        <Text style={styles.splashSubtitle}>Art Costing Software</Text>
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={styles.splashSpinner}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  splashRoot: {
    flex: 1,
    backgroundColor: Colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    alignItems: 'center',
  },
  splashLogoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(0, 224, 214, 0.15)',
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[4],
  },
  splashTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['4xl'],
    color: Colors.textLight,
    letterSpacing: 1,
  },
  splashSubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.primary,
    marginTop: 4,
    marginBottom: Spacing[4],
  },
  splashSpinner: {
    marginTop: Spacing[4],
  },
});
