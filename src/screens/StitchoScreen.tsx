import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Types
import {
  FormState,
  HistoryEntry,
  SectionKey,
  SECTIONS,
  SECTION_LABELS,
  SectionValues,
  UserProfile,
} from '../types';

// Services
import {
  compute,
  fmt,
  makeEmpty,
  normalizeFormState,
} from '../services/calculation';
import {
  loadHistory,
  loadUserProfile,
  persistHistory,
  persistUserProfile,
} from '../services/storage';
import {
  checkSilentSignIn,
  initGoogleSignIn,
  signInWithGoogle,
  signOutGoogle,
} from '../services/auth';
import { generateAndSharePDF } from '../services/pdf';
import { checkForUpdate, openAppStore, UpdateInfo } from '../services/update';
import { showToast } from '../services/toast';
import { initAds, showInterstitialIfNeeded } from '../services/ads';

// Components & Sub-screens
import GridRow from '../components/GridRow';
import SummaryRow from '../components/SummaryRow';
import HistoryModal from '../components/HistoryModal';
import ProfileModal from '../components/ProfileModal';
import UpdateModal from '../components/UpdateModal';
import BannerAdView from '../components/BannerAdView';
import SplashScreen from './SplashScreen';
import LoginScreen from './LoginScreen';

// Theme
import {
  Colors,
  CommonStyles,
  FontFamily,
  FontSize,
  Radius,
  Shadow,
  Spacing,
} from '../theme';

export default function StitchoScreen() {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<FormState>(makeEmpty());
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [profileVisible, setProfileVisible] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);

  useEffect(() => {
    initGoogleSignIn();
    initAds();
    setHistory(loadHistory());

    // Check for app updates in the background on launch
    checkForUpdate().then(info => {
      if (info && info.updateAvailable) {
        setUpdateInfo(info);
        setUpdateModalVisible(true);
      }
    });

    const savedUser = loadUserProfile();
    if (savedUser) {
      setUser(savedUser);
      setIsAuthChecking(false);
    } else {
      checkSilentSignIn()
        .then(silentUser => {
          if (silentUser) {
            setUser(silentUser);
            persistUserProfile(silentUser);
          }
        })
        .finally(() => {
          setIsAuthChecking(false);
        });
    }
  }, []);

  const computed = compute(form);

  const updateSection = useCallback(
    (s: SectionKey, f: keyof SectionValues, v: string) => {
      setForm(p => ({
        ...p,
        sections: { ...p.sections, [s]: { ...p.sections[s], [f]: v } },
      }));
    },
    [],
  );

  const handleSave = useCallback(() => {
    const trimmedDesign = form.designName.trim();
    if (!trimmedDesign) {
      showToast('error', 'Required', 'Please enter a Design No / Name.');
      return;
    }
    const now = new Date().toISOString();

    // Check if design already exists in history (case-insensitive)
    const existingEntry = history.find(
      h =>
        h.form.designName.trim().toLowerCase() === trimmedDesign.toLowerCase(),
    );

    const targetId = editingId || existingEntry?.id;

    if (targetId) {
      const updated = history.map(h =>
        h.id === targetId
          ? {
              ...h,
              savedAt: now,
              form: { ...form, designName: trimmedDesign },
              computed,
            }
          : h,
      );
      setHistory(updated);
      persistHistory(updated);
      setEditingId(targetId);
      
      const msg = existingEntry && !editingId
        ? `Design "${trimmedDesign}" already exists in history. Record has been updated.`
        : 'Record updated in history.';
      showToast('success', 'Updated', msg);
    } else {
      const entry: HistoryEntry = {
        id: `${Date.now()}`,
        savedAt: now,
        form: { ...form, designName: trimmedDesign },
        computed,
      };
      const updated = [entry, ...history];
      setHistory(updated);
      persistHistory(updated);
      setEditingId(entry.id);
      showToast('success', 'Saved', 'Record saved to history.');
    }
    
    // Show Ad if needed after save
    showInterstitialIfNeeded();
  }, [form, computed, history, editingId]);

  const handleClear = useCallback(() => {
    setForm(makeEmpty());
    setEditingId(null);
  }, []);

  const handleWhatsApp = useCallback(async () => {
    Keyboard.dismiss();
    if (!form.designName.trim()) {
      showToast('error', 'Required', 'Please enter a Design No / Name before sharing.');
      return;
    }
    setSharing(true);
    try {
      await generateAndSharePDF(form, computed);
    } finally {
      setSharing(false);
    }
  }, [form, computed]);

  const handleGoogleSignIn = useCallback(async () => {
    setIsSigningIn(true);
    try {
      const res = await signInWithGoogle();
      if (res.type === 'success') {
        setUser(res.user);
        persistUserProfile(res.user);
        showToast('success', 'Signed In', `Welcome, ${res.user.name || res.user.email}!`);
      } else if (res.type === 'error') {
        console.log(res);
        showToast('error', 'Sign In Error', res.message);
      }
    } finally {
      setIsSigningIn(false);
    }
  }, []);

  const handleGoogleSignOut = useCallback(() => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOutGoogle();
          setProfileVisible(false);
          setUser(null);
          persistUserProfile(null);
          showToast('success', 'Signed Out', 'You have been signed out.');
        },
      },
    ]);
  }, []);

  const selectHistory = useCallback((entry: HistoryEntry) => {
    setForm(normalizeFormState(entry.form));
    setEditingId(entry.id);
    setHistoryVisible(false);
  }, []);

  const deleteHistory = useCallback(
    (id: string) => {
      Alert.alert('Delete Record', 'Remove this entry from history?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updated = history.filter(h => h.id !== id);
            setHistory(updated);
            persistHistory(updated);
            if (editingId === id) {
              setEditingId(null);
            }
          },
        },
      ]);
    },
    [history, editingId],
  );

  const handleManualUpdateCheck = useCallback(async () => {
    const info = await checkForUpdate();
    if (info && info.updateAvailable) {
      setProfileVisible(false);
      setUpdateInfo(info);
      setUpdateModalVisible(true);
    } else {
      showToast('info', 'Up to Date', 'You are already using the latest version of Stitcho.');
    }
  }, []);

  // Splash Screen while verifying auth
  if (isAuthChecking) {
    return <SplashScreen />;
  }

  // Mandatory Login Gate
  if (!user) {
    return (
      <LoginScreen onSignIn={handleGoogleSignIn} isSigningIn={isSigningIn} />
    );
  }

  return (
    <View style={[S.root, { paddingTop: insets.top }]}>
      <StatusBar backgroundColor={Colors.dark} barStyle="light-content" />

      {/* ── Header ── */}
      <View style={S.header}>
        <View style={S.headerLeft}>
          <Icon
            name="content-cut"
            size={22}
            color={Colors.primary}
            style={S.headerIcon}
          />
          <View>
            <Text style={S.headerTitle}>Stitcho Art Costing</Text>
            {editingId ? (
              <View style={S.editingChipRow}>
                <Icon name="edit" size={11} color={Colors.primary} />
                <Text style={S.editingChip}> Editing saved record</Text>
              </View>
            ) : user.name ? (
              <Text style={S.userGreeting}>Hi, {user.name.split(' ')[0]}</Text>
            ) : null}
          </View>
        </View>

        <View style={S.headerRight}>
          <TouchableOpacity
            style={S.historyPill}
            onPress={() => setHistoryVisible(true)}
            activeOpacity={0.8}
          >
            <Icon name="history" size={16} color={Colors.primary} />
            <Text style={S.historyPillText}> {history.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={S.profileHeaderBtn}
            onPress={() => setProfileVisible(true)}
            activeOpacity={0.8}
          >
            {user.photo ? (
              <Image source={{ uri: user.photo }} style={S.headerAvatar} />
            ) : (
              <View style={[S.headerAvatarFallback, S.headerAvatarActive]}>
                <Icon name="person" size={20} color={Colors.dark} />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={CommonStyles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={CommonStyles.flex}
          contentContainerStyle={S.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Profile Status Banner ── */}
          <TouchableOpacity
            style={S.profileBanner}
            onPress={() => setProfileVisible(true)}
            activeOpacity={0.85}
          >
            <View style={S.profileBannerLeft}>
              {user.photo ? (
                <Image
                  source={{ uri: user.photo }}
                  style={S.profileBannerAvatar}
                />
              ) : (
                <View style={S.profileBannerAvatarPlaceholder}>
                  <Icon name="person" size={18} color={Colors.primary} />
                </View>
              )}
              <View style={S.profileBannerTextWrap}>
                <Text style={S.profileBannerName}>
                  {user.name || 'Google User'}
                </Text>
                <Text style={S.profileBannerEmail} numberOfLines={1}>
                  {user.email}
                </Text>
              </View>
            </View>
            <View style={S.profileBannerBadge}>
              <Icon name="verified" size={13} color={Colors.accent} />
              <Text style={S.profileBannerBadgeText}>Profile</Text>
            </View>
          </TouchableOpacity>

          {/* ── Design Name ── */}
          <View style={S.card}>
            <Text style={S.fieldLabel}>Design No / Name</Text>
            <View style={S.designRow}>
              <Icon
                name="tag"
                size={18}
                color={Colors.textMuted}
                style={S.designIcon}
              />
              <TextInput
                style={S.designInput}
                placeholder="Enter Design No / Name"
                placeholderTextColor={Colors.textMuted}
                value={form.designName}
                onChangeText={v => setForm(f => ({ ...f, designName: v }))}
              />
              <Icon name="edit" size={18} color={Colors.textMuted} />
            </View>
          </View>

          {/* ── Grid Table ── */}
          <View style={S.card}>
            <View style={S.tableRow}>
              <View style={S.fieldLabelCell}>
                <Text style={S.colHeader}>Field</Text>
              </View>
              {SECTIONS.map(sec => (
                <View key={sec} style={S.dataCell}>
                  <Text style={S.colHeader}>{SECTION_LABELS[sec]}</Text>
                </View>
              ))}
            </View>

            <GridRow
              label="Head"
              sections={SECTIONS}
              getValue={s => form.sections[s].head}
              onChange={(s, v) => updateSection(s, 'head', v)}
              editable
            />
            <GridRow
              label="Stich"
              sections={SECTIONS}
              getValue={s => form.sections[s].stich}
              onChange={(s, v) => updateSection(s, 'stich', v)}
              editable
            />
            <GridRow
              label="Total Stich"
              sections={SECTIONS}
              getValue={s => fmt(computed.totalStich[s], 0)}
              editable={false}
              computed
            />
            <GridRow
              label="Rate"
              sections={SECTIONS}
              getValue={s => fmt(computed.rate[s])}
              editable={false}
              computed
            />
          </View>

          {/* ── Summary ── */}
          <View style={S.card}>
            <SummaryRow label="Rate Per Stitch" iconName="speed">
              <TextInput
                style={[S.summaryValueBox, S.rateInput]}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={Colors.textMuted}
                value={form.ratePerStitch}
                onChangeText={v => setForm(f => ({ ...f, ratePerStitch: v }))}
              />
            </SummaryRow>
            <View style={S.summaryDivider} />
            <SummaryRow label="Sarees Stitch" iconName="format-list-numbered">
              <View style={S.summaryValueBox}>
                <Text style={S.summaryValue}>
                  {fmt(computed.sareesStitch, 0)}
                </Text>
              </View>
            </SummaryRow>
            <View style={S.summaryDivider} />
            <SummaryRow label="Sarees Rate" iconName="payments">
              <View style={[S.summaryValueBox, S.totalBox]}>
                <Text style={S.totalValue}>₹ {fmt(computed.sareesRate)}</Text>
              </View>
            </SummaryRow>
          </View>

          {/* ── Action Buttons ── */}
          <View style={S.btnRow}>
            <TouchableOpacity
              style={[S.btn, S.btnSave]}
              onPress={handleSave}
              activeOpacity={0.82}
            >
              <Icon name={editingId ? 'sync' : 'save'} size={20} color="#fff" />
              <Text style={S.btnLabel}>{editingId ? 'Update' : 'Save'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[S.btn, S.btnCalc]}
              onPress={() => Keyboard.dismiss()}
              activeOpacity={0.82}
            >
              <Icon name="calculate" size={20} color="#fff" />
              <Text style={S.btnLabel}>Calculate</Text>
            </TouchableOpacity>
          </View>

          {/* WhatsApp Share Button */}
          <TouchableOpacity
            style={[S.btn, S.btnWhatsApp, sharing && S.btnDisabled]}
            onPress={handleWhatsApp}
            activeOpacity={0.82}
            disabled={sharing}
          >
            <Icon name="share" size={20} color="#fff" />
            <Text style={S.btnLabel}>
              {sharing ? 'Generating PDF…' : 'Share on WhatsApp'}
            </Text>
          </TouchableOpacity>

          {/* Clear Button */}
          <TouchableOpacity
            style={[S.btn, S.btnClear]}
            onPress={handleClear}
            activeOpacity={0.82}
          >
            <Icon name="cleaning-services" size={20} color="#fff" />
            <Text style={S.btnLabel}>Clear All</Text>
          </TouchableOpacity>

          <View style={{ height: insets.bottom + 24 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Banner Ad anchored at bottom */}
      <BannerAdView />

      {/* Modals */}
      <HistoryModal
        visible={historyVisible}
        history={history}
        onClose={() => setHistoryVisible(false)}
        onSelect={selectHistory}
        onDelete={deleteHistory}
      />

      <ProfileModal
        visible={profileVisible}
        user={user}
        onClose={() => setProfileVisible(false)}
        onSignOut={handleGoogleSignOut}
        onCheckUpdate={handleManualUpdateCheck}
      />

      <UpdateModal
        visible={updateModalVisible}
        updateInfo={updateInfo}
        onDismiss={() => setUpdateModalVisible(false)}
        onUpdate={() => {
          if (updateInfo) {
            openAppStore(updateInfo.storeUrl);
          }
        }}
      />
    </View>
  );
}

const S = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  header: {
    backgroundColor: Colors.dark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    ...Shadow.md,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  headerIcon: { marginRight: Spacing[2] },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.textLight,
    letterSpacing: 0.2,
  },
  editingChipRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  editingChip: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.primary,
  },
  userGreeting: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.primary,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  historyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,224,214,0.15)',
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1] + 2,
  },
  historyPillText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  profileHeaderBtn: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(0,224,214,0.15)',
  },
  headerAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: Radius.full,
  },
  headerAvatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarActive: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    width: 24,
    height: 24,
  },

  scrollContent: { padding: Spacing[3], gap: Spacing[3] },

  profileBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing[3],
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  profileBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileBannerAvatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    marginRight: Spacing[3],
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  profileBannerAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.computedBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[3],
  },
  profileBannerTextWrap: { flex: 1 },
  profileBannerName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  profileBannerEmail: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 1,
  },
  profileBannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.computedBg,
    paddingHorizontal: Spacing[2] + 2,
    paddingVertical: 4,
    borderRadius: Radius.full,
    gap: 4,
  },
  profileBannerBadgeText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.accent,
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },

  fieldLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing[1] + 2,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  designRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing[3],
  },
  designIcon: { marginRight: Spacing[2] },
  designInput: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    paddingVertical: Spacing[2] + 2,
  },

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
  colHeader: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.accent,
    textAlign: 'center',
    paddingVertical: Spacing[2],
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  summaryDivider: { height: 1, backgroundColor: Colors.border },
  summaryValueBox: {
    flex: 1.1,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.background,
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[3],
    alignItems: 'flex-end',
  },
  summaryValue: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  rateInput: {
    borderColor: Colors.secondary,
    backgroundColor: Colors.highlightBg,
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
    color: Colors.accent,
    textAlign: 'right',
  },
  totalBox: { borderColor: Colors.primary, backgroundColor: Colors.computedBg },
  totalValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.accent,
  },

  btnRow: { flexDirection: 'row', gap: Spacing[2] },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[1] + 2,
    borderRadius: Radius.md,
    paddingVertical: Spacing[3] + 2,
    ...Shadow.sm,
  },
  btnSave: { backgroundColor: Colors.dark },
  btnCalc: { backgroundColor: Colors.secondary },
  btnWhatsApp: { backgroundColor: '#25D366', flex: 1 },
  btnClear: { backgroundColor: Colors.error },
  btnDisabled: { opacity: 0.6 },
  btnLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textLight,
    letterSpacing: 0.3,
  },
});
