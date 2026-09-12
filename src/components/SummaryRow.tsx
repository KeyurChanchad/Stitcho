import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Colors, FontFamily, FontSize, Spacing} from '../theme';

interface SummaryRowProps {
  label: string;
  iconName: string;
  children: React.ReactNode;
}

export default function SummaryRow({label, iconName, children}: SummaryRowProps) {
  return (
    <View style={styles.summaryRow}>
      <View style={styles.summaryLabelRow}>
        <Icon
          name={iconName}
          size={16}
          color={Colors.accent}
          style={styles.summaryLabelIcon}
        />
        <Text style={styles.summaryLabel}>{label}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing[2],
  },
  summaryLabelRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryLabelIcon: {
    marginRight: 6,
  },
  summaryLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
});
