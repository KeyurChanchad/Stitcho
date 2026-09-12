import React from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {UpdateInfo} from '../services/update';
import {Colors, FontFamily, FontSize, Radius, Shadow, Spacing} from '../theme';

interface UpdateModalProps {
  visible: boolean;
  updateInfo: UpdateInfo | null;
  onUpdate: () => void;
  onDismiss: () => void;
  isMandatory?: boolean;
}

export default function UpdateModal({
  visible,
  updateInfo,
  onUpdate,
  onDismiss,
  isMandatory = false,
}: UpdateModalProps) {
  if (!updateInfo) {
    return null;
  }

  const storeName = Platform.OS === 'ios' ? 'App Store' : 'Google Play Store';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (!isMandatory) {
          onDismiss();
        }
      }}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Top Icon Badge */}
          <View style={styles.iconCircle}>
            <Icon name="system-update" size={38} color="#FFFFFF" />
          </View>

          {/* Title */}
          <Text style={styles.title}>Update Available!</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            A newer version of <Text style={styles.boldText}>Stitcho</Text> is
            now available on the {storeName}.
          </Text>

          {/* Version comparison row */}
          <View style={styles.versionBox}>
            <View style={styles.versionColumn}>
              <Text style={styles.versionLabel}>Current</Text>
              <Text style={styles.versionValue}>
                v{updateInfo.currentVersion}
              </Text>
            </View>
            <Icon
              name="arrow-forward"
              size={20}
              color={Colors.accent}
              style={styles.arrowIcon}
            />
            <View style={styles.versionColumn}>
              <Text style={styles.versionLabel}>New Version</Text>
              <Text style={[styles.versionValue, styles.newVersionValue]}>
                v{updateInfo.latestVersion}
              </Text>
            </View>
          </View>

          {/* Release Notes if available */}
          {updateInfo.releaseNotes ? (
            <View style={styles.notesBox}>
              <Text style={styles.notesLabel}>What's New:</Text>
              <Text style={styles.notesText} numberOfLines={3}>
                {updateInfo.releaseNotes}
              </Text>
            </View>
          ) : (
            <Text style={styles.description}>
              Update now to enjoy the latest features, performance improvements,
              and bug fixes.
            </Text>
          )}

          {/* Buttons */}
          <View style={styles.btnRow}>
            {!isMandatory && (
              <TouchableOpacity
                style={styles.laterBtn}
                onPress={onDismiss}
                activeOpacity={0.7}>
                <Text style={styles.laterBtnText}>Later</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.updateBtn,
                isMandatory && styles.updateBtnFullWidth,
              ]}
              onPress={onUpdate}
              activeOpacity={0.85}>
              <Icon
                name="file-download"
                size={20}
                color="#FFFFFF"
                style={styles.updateIcon}
              />
              <Text style={styles.updateBtnText}>Update Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 76, 109, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing[6],
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius['2xl'],
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[7],
    paddingBottom: Spacing[6],
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    ...Shadow.lg,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing[4],
    ...Shadow.sm,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing[1],
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing[5],
  },
  boldText: {
    fontFamily: FontFamily.semiBold,
    color: Colors.textPrimary,
  },
  versionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    width: '100%',
    marginBottom: Spacing[4],
  },
  versionColumn: {
    alignItems: 'center',
  },
  versionLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  versionValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  newVersionValue: {
    color: Colors.accent,
  },
  arrowIcon: {
    marginHorizontal: Spacing[2],
  },
  notesBox: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    padding: Spacing[3],
    marginBottom: Spacing[5],
  },
  notesLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  notesText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  description: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: Spacing[6],
    paddingHorizontal: Spacing[1],
  },
  btnRow: {
    flexDirection: 'row',
    width: '100%',
    gap: Spacing[3],
  },
  laterBtn: {
    flex: 1,
    paddingVertical: Spacing[3],
    borderRadius: Radius.md,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  laterBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textMuted,
  },
  updateBtn: {
    flex: 1.4,
    flexDirection: 'row',
    paddingVertical: Spacing[3],
    borderRadius: Radius.md,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  updateBtnFullWidth: {
    flex: 1,
  },
  updateIcon: {
    marginRight: 6,
  },
  updateBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: '#FFFFFF',
  },
});
