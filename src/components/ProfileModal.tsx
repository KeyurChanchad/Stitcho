import React from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {UserProfile} from '../types';
import {Colors, FontFamily, FontSize, Radius, Shadow, Spacing} from '../theme';

interface ProfileModalProps {
  visible: boolean;
  user: UserProfile | null;
  onClose: () => void;
  onSignOut: () => void;
}

export default function ProfileModal({
  visible,
  user,
  onClose,
  onSignOut,
}: ProfileModalProps) {
  const insets = useSafeAreaInsets();

  if (!user) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalSheet,
            styles.modalSheetProfile,
            {paddingBottom: insets.bottom + 16},
          ]}>
          <View style={styles.sheetHandle} />

          <View style={styles.modalHeader}>
            <View style={styles.modalTitleRow}>
              <Icon
                name="person"
                size={22}
                color={Colors.accent}
                style={styles.iconMr8}
              />
              <Text style={styles.modalTitle}>User Profile</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{top: 12, left: 12, right: 12, bottom: 12}}>
              <Icon name="close" size={22} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.profileScrollContent}
            keyboardShouldPersistTaps="handled">
            <View style={styles.profileCard}>
              {/* Avatar Section */}
              <View style={styles.profileAvatarSection}>
                <View style={styles.profileAvatarWrap}>
                  {user.photo ? (
                    <Image
                      source={{uri: user.photo}}
                      style={styles.profileAvatarLarge}
                    />
                  ) : (
                    <View style={styles.profileAvatarLargePlaceholder}>
                      <Icon name="person" size={54} color={Colors.accent} />
                    </View>
                  )}
                  <View style={styles.verifiedBadge}>
                    <Icon name="check" size={12} color="#fff" />
                  </View>
                </View>
                <Text style={styles.profileNameText}>
                  {user.name || 'Google User'}
                </Text>
                <Text style={styles.profileEmailText}>{user.email}</Text>

                <View style={styles.googleConnectedChip}>
                  <View style={styles.googleDot} />
                  <Text style={styles.googleConnectedText}>
                    Google Account Connected
                  </Text>
                </View>
              </View>

              {/* Account Details Box */}
              <View style={styles.profileInfoBox}>
                <Text style={styles.profileSectionTitle}>Account Details</Text>

                <View style={styles.profileInfoRow}>
                  <Icon
                    name="person-outline"
                    size={18}
                    color={Colors.accent}
                    style={styles.profileInfoIcon}
                  />
                  <View style={styles.profileInfoTextWrap}>
                    <Text style={styles.profileInfoLabel}>Name</Text>
                    <Text style={styles.profileInfoValue}>
                      {user.name || 'Not provided'}
                    </Text>
                  </View>
                </View>

                <View style={styles.profileInfoDivider} />

                <View style={styles.profileInfoRow}>
                  <Icon
                    name="mail-outline"
                    size={18}
                    color={Colors.accent}
                    style={styles.profileInfoIcon}
                  />
                  <View style={styles.profileInfoTextWrap}>
                    <Text style={styles.profileInfoLabel}>Email</Text>
                    <Text style={styles.profileInfoValue}>{user.email}</Text>
                  </View>
                </View>

                <View style={styles.profileInfoDivider} />

                <View style={styles.profileInfoRow}>
                  <Icon
                    name="fingerprint"
                    size={18}
                    color={Colors.accent}
                    style={styles.profileInfoIcon}
                  />
                  <View style={styles.profileInfoTextWrap}>
                    <Text style={styles.profileInfoLabel}>Google User ID</Text>
                    <Text
                      style={styles.profileInfoValue}
                      numberOfLines={1}
                      ellipsizeMode="middle">
                      {user.id}
                    </Text>
                  </View>
                </View>

                <View style={styles.profileInfoDivider} />

                <View style={styles.profileInfoRow}>
                  <Icon
                    name="storage"
                    size={18}
                    color={Colors.accent}
                    style={styles.profileInfoIcon}
                  />
                  <View style={styles.profileInfoTextWrap}>
                    <Text style={styles.profileInfoLabel}>Data Storage</Text>
                    <Text style={styles.profileInfoValue}>Saved Locally</Text>
                  </View>
                </View>
              </View>

              {/* Sign Out Button */}
              <TouchableOpacity
                style={styles.signOutBtn}
                onPress={onSignOut}
                activeOpacity={0.82}>
                <Icon name="logout" size={18} color="#fff" />
                <Text style={styles.signOutBtnText}>Sign Out from Google</Text>
              </TouchableOpacity>
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
  modalSheetProfile: {
    maxHeight: '85%',
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
  profileScrollContent: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
  },
  profileCard: {
    alignItems: 'center',
  },
  profileAvatarSection: {
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  profileAvatarWrap: {
    position: 'relative',
    marginBottom: Spacing[3],
  },
  profileAvatarLarge: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  profileAvatarLargePlaceholder: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: Colors.computedBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileNameText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  profileEmailText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginBottom: Spacing[2],
  },
  googleConnectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.computedBg,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: Radius.full,
    gap: 6,
  },
  googleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  googleConnectedText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.accent,
  },
  profileInfoBox: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing[3],
    marginBottom: Spacing[4],
  },
  profileSectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing[2],
  },
  profileInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing[2],
  },
  profileInfoIcon: {
    marginRight: Spacing[3],
  },
  profileInfoTextWrap: {
    flex: 1,
  },
  profileInfoLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  profileInfoValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    marginTop: 1,
  },
  profileInfoDivider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  signOutBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.error,
    paddingVertical: Spacing[3],
    borderRadius: Radius.md,
    gap: Spacing[2],
    ...Shadow.sm,
  },
  signOutBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: '#fff',
  },
});
