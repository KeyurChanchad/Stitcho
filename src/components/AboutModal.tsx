import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadow,
  Spacing,
} from '../theme';

interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
  onCheckUpdate?: () => void;
}

export default function AboutModal({
  visible,
  onClose,
  onCheckUpdate,
}: AboutModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalSheet,
            { paddingBottom: insets.bottom + 16 },
          ]}
        >
          <View style={styles.sheetHandle} />

          <View style={styles.modalHeader}>
            <View style={styles.modalTitleRow}>
              <Icon
                name="info-outline"
                size={22}
                color={Colors.accent}
                style={styles.iconMr8}
              />
              <Text style={styles.modalTitle}>About Stitcho</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{ top: 12, left: 12, right: 12, bottom: 12 }}
            >
              <Icon name="close" size={22} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Branding Section */}
            <View style={styles.brandingSection}>
              <View style={styles.logoCircle}>
                <Icon name="content-cut" size={40} color={Colors.primary} />
              </View>
              <Text style={styles.appName}>Stitcho</Text>
              <Text style={styles.appSub}>Art Costing Software</Text>
              <View style={styles.badgeWrap}>
                <Text style={styles.badgeText}>by Apex Infocom</Text>
              </View>
            </View>

            {/* App Info Box */}
            <View style={styles.infoBox}>
              <Text style={styles.sectionTitle}>Application Details</Text>

              <View style={styles.infoRow}>
                <Icon
                  name="storage"
                  size={18}
                  color={Colors.accent}
                  style={styles.infoIcon}
                />
                <View style={styles.infoTextWrap}>
                  <Text style={styles.infoLabel}>Data Storage</Text>
                  <Text style={styles.infoValue}>100% Offline & Saved Locally</Text>
                </View>
              </View>

              <View style={styles.infoDivider} />

              <View style={styles.infoRow}>
                <Icon
                  name="verified-user"
                  size={18}
                  color={Colors.accent}
                  style={styles.infoIcon}
                />
                <View style={styles.infoTextWrap}>
                  <Text style={styles.infoLabel}>Privacy</Text>
                  <Text style={styles.infoValue}>No Sign-In Required • No Ads</Text>
                </View>
              </View>

              {onCheckUpdate && (
                <>
                  <View style={styles.infoDivider} />

                  <TouchableOpacity
                    style={styles.infoRow}
                    onPress={onCheckUpdate}
                    activeOpacity={0.7}
                  >
                    <Icon
                      name="system-update"
                      size={18}
                      color={Colors.accent}
                      style={styles.infoIcon}
                    />
                    <View style={styles.infoTextWrap}>
                      <Text style={styles.infoLabel}>App Version</Text>
                      <Text style={styles.infoValue}>v1.0.4</Text>
                    </View>
                    <View style={styles.checkUpdatePill}>
                      <Text style={styles.checkUpdatePillText}>Check for Update</Text>
                      <Icon
                        name="chevron-right"
                        size={16}
                        color={Colors.accent}
                      />
                    </View>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius['2xl'],
    borderTopRightRadius: Radius['2xl'],
    maxHeight: '80%',
    ...Shadow.lg,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginTop: Spacing[2],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
  },
  iconMr8: {
    marginRight: 8,
  },
  closeBtn: {
    padding: Spacing[1],
  },
  scrollContent: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[4],
  },
  brandingSection: {
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[2],
    ...Shadow.md,
  },
  appName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  appSub: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.accent,
    marginTop: 2,
  },
  badgeWrap: {
    backgroundColor: 'rgba(0, 76, 109, 0.08)',
    paddingHorizontal: Spacing[3],
    paddingVertical: 3,
    borderRadius: Radius.full,
    marginTop: Spacing[2],
  },
  badgeText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  infoBox: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing[3],
    marginBottom: Spacing[2],
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing[2],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing[2],
  },
  infoIcon: {
    marginRight: Spacing[3],
  },
  infoTextWrap: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  infoValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    marginTop: 1,
  },
  infoDivider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  checkUpdatePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.computedBg,
    paddingHorizontal: Spacing[2],
    paddingVertical: 4,
    borderRadius: Radius.full,
    gap: 2,
  },
  checkUpdatePillText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.accent,
  },
});
