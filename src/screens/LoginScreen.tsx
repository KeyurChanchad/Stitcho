import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadow,
  Spacing,
} from '../theme';

interface LoginScreenProps {
  onSignIn: () => void;
  isSigningIn: boolean;
}

export default function LoginScreen({
  onSignIn,
  isSigningIn,
}: LoginScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.loginRoot,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <StatusBar backgroundColor={Colors.dark} barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.loginScroll} bounces={false}>
        {/* Top Branding */}
        <View style={styles.loginBrandWrap}>
          <View style={styles.loginLogoCircle}>
            <Icon name="content-cut" size={44} color={Colors.primary} />
          </View>
          <Text style={styles.loginBrandTitle}>Stitcho</Text>
          <Text style={styles.loginBrandSub}>Art Costing Software</Text>
          <View style={styles.loginBadge}>
            <Text style={styles.loginBadgeText}>by Apex Infocom</Text>
          </View>
        </View>

        {/* Login Card */}
        <View style={styles.loginCard}>
          <Text style={styles.loginCardTitle}>Sign In Required</Text>
          <Text style={styles.loginCardDesc}>
            Please sign in with your Google account to access Stitcho Art
            Costing software.
          </Text>

          <View style={styles.loginButtonContainer}>
            <GoogleSigninButton
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={onSignIn}
              disabled={isSigningIn}
              style={styles.googleNativeBtn}
            />
          </View>

          {isSigningIn && (
            <View style={styles.loginLoadingRow}>
              <ActivityIndicator size="small" color={Colors.accent} />
              <Text style={styles.loginLoadingText}>Connecting to Google…</Text>
            </View>
          )}

          {/* Feature Highlights */}
          <View style={styles.loginFeaturesList}>
            <View style={styles.loginFeatureItem}>
              <Icon
                name="calculate"
                size={20}
                color={Colors.accent}
                style={styles.loginFeatureIcon}
              />
              <View style={styles.loginFeatureTextWrap}>
                <Text style={styles.loginFeatureTitle}>Art Stitch Costing</Text>
                <Text style={styles.loginFeatureDesc}>
                  Head, stitch, and rate calculation for all sections
                </Text>
              </View>
            </View>

            <View style={styles.loginFeatureDivider} />

            <View style={styles.loginFeatureItem}>
              <Icon
                name="history"
                size={20}
                color={Colors.accent}
                style={styles.loginFeatureIcon}
              />
              <View style={styles.loginFeatureTextWrap}>
                <Text style={styles.loginFeatureTitle}>Design History</Text>
                <Text style={styles.loginFeatureDesc}>
                  Automatic updates for existing designs without duplicates
                </Text>
              </View>
            </View>

            <View style={styles.loginFeatureDivider} />

            <View style={styles.loginFeatureItem}>
              <Icon
                name="picture-as-pdf"
                size={20}
                color={Colors.accent}
                style={styles.loginFeatureIcon}
              />
              <View style={styles.loginFeatureTextWrap}>
                <Text style={styles.loginFeatureTitle}>
                  PDF Export & WhatsApp Share
                </Text>
                <Text style={styles.loginFeatureDesc}>
                  One-tap professional quotation sharing with clients
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.loginFooterText}>
          Secure Google Sign-In • com.apexinfocom.stitcho
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loginRoot: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loginScroll: {
    padding: Spacing[4],
    flexGrow: 1,
    justifyContent: 'center',
  },
  loginBrandWrap: {
    alignItems: 'center',
    marginBottom: Spacing[5],
  },
  loginLogoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[3],
    ...Shadow.md,
  },
  loginBrandTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['3xl'],
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  loginBrandSub: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.accent,
    marginTop: 2,
  },
  loginBadge: {
    backgroundColor: 'rgba(0, 76, 109, 0.08)',
    paddingHorizontal: Spacing[3],
    paddingVertical: 3,
    borderRadius: Radius.full,
    marginTop: Spacing[2],
  },
  loginBadgeText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  loginCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius['2xl'],
    padding: Spacing[5],
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    ...Shadow.lg,
  },
  loginCardTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
    marginBottom: Spacing[2],
  },
  loginCardDesc: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing[5],
  },
  loginButtonContainer: {
    alignItems: 'center',
    width: '100%',
    marginBottom: Spacing[2],
  },
  googleNativeBtn: {
    width: 312,
    height: 48,
  },
  loginLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing[2],
    marginBottom: Spacing[3],
    gap: Spacing[2],
  },
  loginLoadingText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.accent,
  },
  loginFeaturesList: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing[3],
    marginTop: Spacing[4],
  },
  loginFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing[2],
  },
  loginFeatureIcon: {
    marginRight: Spacing[3],
  },
  loginFeatureTextWrap: {
    flex: 1,
  },
  loginFeatureTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  loginFeatureDesc: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  loginFeatureDivider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  loginFooterText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing[5],
  },
});
