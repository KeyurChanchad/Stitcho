/**
 * Stitcho – Design System
 * =================================
 * Theme extracted from the "Stitcho App Theme" design spec:
 *
 *  Primary   #00E0D6  – cyan / teal
 *  Secondary #00B3C7  – deeper cyan
 *  Accent    #0077A8  – medium blue
 *  Dark      #004C6D  – dark navy
 *  Background #F2FBFF – off-white blue tint
 *  Border    #E6F1F7  – light border
 *
 * Typography: Inter (Regular / Medium / SemiBold / Bold)
 */

import {StyleSheet, TextStyle} from 'react-native';

// ─── Color Palette ────────────────────────────────────────────────────────────

export const Colors = {
  /** #00E0D6 – Cyan Teal (primary actions, highlights) */
  primary: '#00E0D6',
  /** #00B3C7 – Deeper Cyan (secondary elements, sub-headers) */
  secondary: '#00B3C7',
  /** #0077A8 – Medium Blue (accent, links, active states) */
  accent: '#0077A8',
  /** #004C6D – Dark Navy (text, headers, nav background) */
  dark: '#004C6D',

  // Backgrounds & Surfaces
  /** #F2FBFF – Main screen background */
  background: '#F2FBFF',
  /** #FFFFFF – Card / surface background */
  surface: '#FFFFFF',
  /** #E6F1F7 – Borders and dividers */
  border: '#E6F1F7',

  // Derived / Utility
  /** Soft tint of primary for input backgrounds */
  primaryTint: '#E0FFFE',
  /** Computed fields – light cyan tint */
  computedBg: '#D0F8F5',
  /** Highlighted input (rate per stitch) */
  highlightBg: '#E0FFFE',
  highlightBorder: '#00B3C7',

  // Text
  textPrimary: '#004C6D',   // dark navy – headings
  textSecondary: '#0077A8', // accent blue – sub-labels
  textMuted: '#7BAFC0',     // muted blue-grey
  textLight: '#FFFFFF',     // white text on colored bg
  textOnDark: '#E0FFFE',    // on dark backgrounds

  // Status
  success: '#00C896',
  warning: '#FFB347',
  error: '#FF5252',
  info: '#00B3C7',

  // Overlays
  overlay: 'rgba(0, 76, 109, 0.45)',

  // Gradients (as arrays for use with LinearGradient)
  gradientPrimary: ['#00E0D6', '#0077A8'] as [string, string],
  gradientDark: ['#004C6D', '#002F45'] as [string, string],
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────

/**
 * Font family names matching the TTF files bundled in:
 *   android/app/src/main/assets/fonts/
 *   ios/stitcho/Fonts/
 *
 * React Native resolves font families by the PostScript name on iOS
 * and by the filename (without extension) on Android.
 */
export const FontFamily = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
} as const;

export const FontSize = {
  xs: 11,
  sm: 12,
  base: 14,
  md: 15,
  lg: 16,
  xl: 18,
  '2xl': 20,
  '3xl': 24,
  '4xl': 28,
  '5xl': 32,
} as const;

export const LineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

export const LetterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
} as const;

/** Preset text styles – use these across all components */
export const Typography = StyleSheet.create({
  // Display
  display: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['5xl'],
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.tight,
  },
  h1: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['4xl'],
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.tight,
  },
  h2: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['3xl'],
    color: Colors.textPrimary,
  },
  h3: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
  },
  h4: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
  },
  h5: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },

  // Body
  bodyLg: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  bodySm: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  bodyMedium: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },

  // Labels & Captions
  label: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  labelSm: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  caption: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },

  // Buttons
  btnLg: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textLight,
    letterSpacing: LetterSpacing.wide,
  },
  btn: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textLight,
  },
  btnSm: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textLight,
  },

  // Numeric / Tabular
  numeric: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  numericLg: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.accent,
  },
} as TextStyle & any);

// ─── Spacing ─────────────────────────────────────────────────────────────────

export const Spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

// ─── Border Radius ───────────────────────────────────────────────────────────

export const Radius = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  '2xl': 24,
  full: 9999,
} as const;

// ─── Shadows ─────────────────────────────────────────────────────────────────

export const Shadow = {
  sm: {
    shadowColor: Colors.dark,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.dark,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.dark,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;

// ─── Common Component Styles ─────────────────────────────────────────────────

export const CommonStyles = StyleSheet.create({
  // Layouts
  flex: {flex: 1},
  row: {flexDirection: 'row'},
  center: {alignItems: 'center', justifyContent: 'center'},
  spaceBetween: {justifyContent: 'space-between'},

  // Screens
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Cards
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  cardElevated: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    ...Shadow.md,
  },

  // Header / AppBar
  header: {
    backgroundColor: Colors.dark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    ...Shadow.md,
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.textLight,
    letterSpacing: LetterSpacing.normal,
  },

  // Inputs
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2] + 2,
  },
  inputFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryTint,
  },
  inputHighlight: {
    borderColor: Colors.highlightBorder,
    backgroundColor: Colors.highlightBg,
    fontFamily: FontFamily.bold,
    color: Colors.accent,
  },

  // Buttons
  btnPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[5],
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  btnSecondary: {
    backgroundColor: Colors.secondary,
    borderRadius: Radius.md,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[5],
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDark: {
    backgroundColor: Colors.dark,
    borderRadius: Radius.md,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[5],
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[5],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  btnDanger: {
    backgroundColor: Colors.error,
    borderRadius: Radius.md,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[5],
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnWarning: {
    backgroundColor: Colors.warning,
    borderRadius: Radius.md,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[5],
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing[2],
  },

  // Badge
  badge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryTint,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.accent,
  },
});

// ─── Convenience re-exports ───────────────────────────────────────────────────

const Theme = {
  Colors,
  FontFamily,
  FontSize,
  LineHeight,
  LetterSpacing,
  Typography,
  Spacing,
  Radius,
  Shadow,
  CommonStyles,
};

export default Theme;
