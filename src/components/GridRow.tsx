import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {SectionKey} from '../types';
import {Colors, FontFamily, FontSize, Radius, Spacing} from '../theme';

interface GridRowProps {
  label: string;
  sections: SectionKey[];
  getValue: (s: SectionKey) => string;
  onChange?: (s: SectionKey, v: string) => void;
  editable: boolean;
  computed?: boolean;
}

export default function GridRow({
  label,
  sections,
  getValue,
  onChange,
  editable,
  computed: isComputed,
}: GridRowProps) {
  return (
    <View style={styles.tableRow}>
      <View style={styles.fieldLabelCell}>
        <Text style={styles.rowLabel}>{label}:</Text>
      </View>
      {sections.map(s => (
        <View key={s} style={styles.dataCell}>
          {editable ? (
            <TextInput
              style={styles.tableInput}
              keyboardType="decimal-pad"
              value={getValue(s)}
              onChangeText={v => onChange?.(s, v)}
              placeholder="0"
              placeholderTextColor={Colors.textMuted}
              selectTextOnFocus
            />
          ) : (
            <View style={[styles.tableReadonly, isComputed && styles.computedCell]}>
              <Text style={styles.tableReadonlyText}>{getValue(s)}</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: Spacing[1],
  },
  fieldLabelCell: {
    flex: 1.4,
    justifyContent: 'center',
    paddingRight: Spacing[1],
  },
  dataCell: {
    flex: 1,
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    paddingVertical: Spacing[2],
  },
  tableInput: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    textAlign: 'center',
    paddingVertical: Spacing[1] + 2,
    paddingHorizontal: Spacing[1],
    width: '100%',
    minHeight: 34,
  },
  tableReadonly: {
    borderRadius: Radius.sm,
    backgroundColor: Colors.background,
    paddingVertical: Spacing[1] + 2,
    paddingHorizontal: Spacing[1],
    width: '100%',
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  computedCell: {
    backgroundColor: Colors.computedBg,
  },
  tableReadonlyText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.accent,
    textAlign: 'center',
  },
});
