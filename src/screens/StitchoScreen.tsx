/**
 * Stitcho Art Costing Software
 * Package: com.apexinfocom.stitcho
 * Features: Local history, PDF generation, WhatsApp sharing
 */

import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
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
import {generatePDF} from 'react-native-html-to-pdf';
import Share, {Social} from 'react-native-share';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Colors,
  CommonStyles,
  FontFamily,
  FontSize,
  Radius,
  Shadow,
  Spacing,
} from '../theme';

// ─── Local Storage shim ───────────────────────────────────────────────────────
declare const global: {__stitchoStore?: string};
function readStore(): Record<string, string> {
  try {
    if (global.__stitchoStore) return JSON.parse(global.__stitchoStore);
  } catch (_) {}
  return {};
}
function writeStore(data: Record<string, string>) {
  global.__stitchoStore = JSON.stringify(data);
}
const Storage = {
  getItem: (key: string): string | null => readStore()[key] ?? null,
  setItem: (key: string, value: string) => {
    const s = readStore();
    s[key] = value;
    writeStore(s);
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────
type SectionKey = 'pallu' | 'scut' | 'less' | 'blouse';
const SECTIONS: SectionKey[] = ['pallu', 'scut', 'less', 'blouse'];
const SECTION_LABELS: Record<SectionKey, string> = {
  pallu: 'Pallu',
  scut: 'Scut',
  less: 'Less',
  blouse: 'Blouse',
};

interface SectionValues {head: string; stich: string}
interface FormState {
  designName: string;
  ratePerStitch: string;
  sections: Record<SectionKey, SectionValues>;
}
interface ComputedValues {
  totalStich: Record<SectionKey, number>;
  rate: Record<SectionKey, number>;
  sareesStitch: number;
  sareesRate: number;
}
interface HistoryEntry {
  id: string;
  savedAt: string;
  form: FormState;
  computed: ComputedValues;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function makeEmpty(): FormState {
  const sections = {} as Record<SectionKey, SectionValues>;
  for (const s of SECTIONS) sections[s] = {head: '', stich: ''};
  return {designName: '', ratePerStitch: '', sections};
}

function compute(form: FormState): ComputedValues {
  const rps = parseFloat(form.ratePerStitch) || 0;
  const totalStich = {} as Record<SectionKey, number>;
  const rate = {} as Record<SectionKey, number>;
  let sareesStitch = 0, sareesRate = 0;
  for (const s of SECTIONS) {
    const h = parseFloat(form.sections[s].head) || 0;
    const st = parseFloat(form.sections[s].stich) || 0;
    totalStich[s] = h * st;
    rate[s] = (h * st / 1000) * rps;
    sareesStitch += h * st;
    sareesRate += rate[s];
  }
  return {totalStich, rate, sareesStitch, sareesRate};
}

function fmt(n: number, d = 2) {
  return n === 0 ? (d === 0 ? '0' : '0.00') : n.toFixed(d);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const HISTORY_KEY = 'stitcho_history';
function loadHistory(): HistoryEntry[] {
  try { const r = Storage.getItem(HISTORY_KEY); if (r) return JSON.parse(r); } catch (_) {}
  return [];
}
function persistHistory(e: HistoryEntry[]) { Storage.setItem(HISTORY_KEY, JSON.stringify(e)); }

// ─── PDF Generator ────────────────────────────────────────────────────────────
function buildPDFHtml(form: FormState, computed: ComputedValues): string {
  const rps = parseFloat(form.ratePerStitch) || 0;
  const now = new Date().toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const tableRows = SECTIONS.map(s => `
    <tr>
      <td class="col-label">${SECTION_LABELS[s]}</td>
      <td>${form.sections[s].head || '0'}</td>
      <td>${form.sections[s].stich || '0'}</td>
      <td class="computed">${fmt(computed.totalStich[s], 0)}</td>
      <td class="computed rate-col">₹ ${fmt(computed.rate[s])}</td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, sans-serif; color: #004C6D; background: #fff; padding: 32px; }

  .header { background: #004C6D; color: white; padding: 20px 24px; border-radius: 10px; margin-bottom: 24px; }
  .header h1 { font-size: 22px; font-weight: bold; letter-spacing: 0.5px; }
  .header .sub { font-size: 12px; color: #00E0D6; margin-top: 4px; }

  .section-title {
    font-size: 11px; font-weight: bold; color: #0077A8;
    text-transform: uppercase; letter-spacing: 1px;
    margin: 16px 0 8px;
  }

  .info-box { background: #F2FBFF; border: 1px solid #E6F1F7; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; }
  .info-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
  .info-label { font-size: 12px; color: #7BAFC0; }
  .info-value { font-size: 13px; font-weight: bold; color: #004C6D; }

  table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  th {
    background: #004C6D; color: white;
    padding: 9px 10px; font-size: 11px;
    text-align: center; letter-spacing: 0.5px;
  }
  th.col-label { text-align: left; }
  td {
    padding: 8px 10px; font-size: 12px;
    border-bottom: 1px solid #E6F1F7;
    text-align: center; color: #004C6D;
  }
  td.col-label { text-align: left; font-weight: bold; }
  td.computed { background: #D0F8F5; color: #0077A8; font-weight: bold; }
  td.rate-col { background: #D0F8F5; }
  tr:nth-child(even) td { background: #F2FBFF; }
  tr:nth-child(even) td.computed { background: #C0F4F0; }

  .summary-box {
    border: 2px solid #00B3C7; border-radius: 10px;
    padding: 16px 20px; margin-top: 8px;
  }
  .summary-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 6px 0; border-bottom: 1px solid #E6F1F7;
  }
  .summary-row:last-child { border-bottom: none; }
  .summary-label { font-size: 13px; color: #004C6D; font-weight: bold; }
  .summary-value { font-size: 14px; color: #0077A8; font-weight: bold; }
  .summary-total .summary-label { font-size: 15px; color: #004C6D; }
  .summary-total .summary-value {
    font-size: 20px; color: #00B3C7; font-weight: bold;
  }

  .footer {
    margin-top: 28px; padding-top: 12px;
    border-top: 1px solid #E6F1F7;
    display: flex; justify-content: space-between;
    font-size: 10px; color: #7BAFC0;
  }
</style>
</head>
<body>

  <!-- App Header -->
  <div class="header">
    <h1>✂ Stitcho Art Costing Software</h1>
    <div class="sub">by Apex Infocom &nbsp;|&nbsp; com.apexinfocom.stitcho</div>
  </div>

  <!-- Design Info -->
  <div class="section-title">Design Information</div>
  <div class="info-box">
    <div class="info-row">
      <span class="info-label">Design No / Name</span>
      <span class="info-value">${form.designName || '—'}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Rate Per Stitch</span>
      <span class="info-value">${rps.toFixed(2)}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Generated On</span>
      <span class="info-value">${now}</span>
    </div>
  </div>

  <!-- Calculation Table -->
  <div class="section-title">Stitching Calculation</div>
  <table>
    <thead>
      <tr>
        <th class="col-label">Section</th>
        <th>Head</th>
        <th>Stich</th>
        <th>Total Stich</th>
        <th>Rate (₹)</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>

  <!-- Summary -->
  <div class="section-title">Summary</div>
  <div class="summary-box">
    <div class="summary-row">
      <span class="summary-label">Rate Per Stitch</span>
      <span class="summary-value">${rps.toFixed(2)}</span>
    </div>
    <div class="summary-row">
      <span class="summary-label">Total Sarees Stitch</span>
      <span class="summary-value">${fmt(computed.sareesStitch, 0)}</span>
    </div>
    ${SECTIONS.map(s => `
    <div class="summary-row">
      <span class="summary-label">${SECTION_LABELS[s]} Rate</span>
      <span class="summary-value">₹ ${fmt(computed.rate[s])}</span>
    </div>`).join('')}
    <div class="summary-row summary-total">
      <span class="summary-label">Total Sarees Rate</span>
      <span class="summary-value">₹ ${fmt(computed.sareesRate)}</span>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <span>Stitcho Art Costing – com.apexinfocom.stitcho</span>
    <span>${now}</span>
  </div>

</body>
</html>`;
}

async function generateAndSharePDF(form: FormState, computed: ComputedValues): Promise<void> {
  try {
    const html = buildPDFHtml(form, computed);
    const designSlug = (form.designName || 'stitcho').replace(/[^a-z0-9]/gi, '_');
    const options = {
      html,
      fileName: `stitcho_${designSlug}_${Date.now()}`,
    };

    const pdf = await generatePDF(options);
    if (!pdf || !pdf.filePath) {
      throw new Error('PDF generation failed to produce a valid file.');
    }

    const fileUrl = pdf.filePath.startsWith('file://') ? pdf.filePath : `file://${pdf.filePath}`;

    const shareOptions = {
      title: `Stitcho – ${form.designName || 'Costing Report'}`,
      subject: `Stitcho – ${form.designName || 'Costing Report'}`,
      message: `Stitcho Art Costing Report\nDesign: ${form.designName || '—'}\nSarees Rate: ₹${fmt(computed.sareesRate)}\nTotal Stitch: ${fmt(computed.sareesStitch, 0)}\n\nShared from Stitcho Art Costing App`,
      url: fileUrl,
      type: 'application/pdf',
    };

    // Try sharing directly to WhatsApp if installed
    try {
      const {isInstalled} = await Share.isPackageInstalled('com.whatsapp');
      if (isInstalled) {
        await Share.shareSingle({
          ...shareOptions,
          social: Social.Whatsapp,
        });
        return;
      }
    } catch (_) {
      // If WhatsApp check fails or not installed, fallback to general share dialog
    }

    // Fallback to standard share dialog (shows installed apps or options in emulator)
    await Share.open(shareOptions);
  } catch (err: any) {
    if (
      err &&
      err.message &&
      (err.message.includes('User did not share') ||
        err.message.includes('dismissed') ||
        err.message.includes('Canceled') ||
        err.message.includes('CANCELLED'))
    ) {
      return;
    }
    Alert.alert('Share Failed', err?.message || 'Could not share PDF. Please try again.');
  }
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function StitchoScreen() {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<FormState>(makeEmpty());
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);

  useEffect(() => { setHistory(loadHistory()); }, []);

  const computed = compute(form);

  const updateSection = useCallback((s: SectionKey, f: keyof SectionValues, v: string) => {
    setForm(p => ({...p, sections: {...p.sections, [s]: {...p.sections[s], [f]: v}}}));
  }, []);

  const handleSave = useCallback(() => {
    if (!form.designName.trim()) {
      Alert.alert('Required', 'Please enter a Design No / Name.'); return;
    }
    const now = new Date().toISOString();
    if (editingId) {
      const updated = history.map(h =>
        h.id === editingId ? {...h, savedAt: now, form: {...form}, computed} : h);
      setHistory(updated); persistHistory(updated);
      Alert.alert('Updated', 'Record updated in history.');
    } else {
      const entry: HistoryEntry = {id: `${Date.now()}`, savedAt: now, form: {...form}, computed};
      const updated = [entry, ...history];
      setHistory(updated); persistHistory(updated);
      Alert.alert('Saved', 'Record saved to history.');
    }
  }, [form, computed, history, editingId]);

  // Clear = reset everything (all fields + design name + rate)
  const handleClear = useCallback(() => {
    setForm(makeEmpty());
    setEditingId(null);
  }, []);

  const handleWhatsApp = useCallback(async () => {
    Keyboard.dismiss();
    if (!form.designName.trim()) {
      Alert.alert('Required', 'Please enter a Design No / Name before sharing.'); return;
    }
    setSharing(true);
    try {
      await generateAndSharePDF(form, computed);
    } finally {
      setSharing(false);
    }
  }, [form, computed]);

  const selectHistory = useCallback((entry: HistoryEntry) => {
    setForm({...entry.form}); setEditingId(entry.id); setHistoryVisible(false);
  }, []);

  const deleteHistory = useCallback((id: string) => {
    Alert.alert('Delete Record', 'Remove this entry from history?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Delete', style: 'destructive', onPress: () => {
        const updated = history.filter(h => h.id !== id);
        setHistory(updated); persistHistory(updated);
        if (editingId === id) setEditingId(null);
      }},
    ]);
  }, [history, editingId]);

  return (
    <View style={[S.root, {paddingTop: insets.top}]}>
      <StatusBar backgroundColor={Colors.dark} barStyle="light-content" />

      {/* ── Header ── */}
      <View style={S.header}>
        <View style={S.headerLeft}>
          <Icon name="content-cut" size={22} color={Colors.primary} style={S.headerIcon} />
          <View>
            <Text style={S.headerTitle}>Stitcho Art Costing</Text>
            {editingId && (
              <View style={S.editingChipRow}>
                <Icon name="edit" size={11} color={Colors.primary} />
                <Text style={S.editingChip}> Editing saved record</Text>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity style={S.historyPill} onPress={() => setHistoryVisible(true)}>
          <Icon name="history" size={16} color={Colors.primary} />
          <Text style={S.historyPillText}> {history.length}</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={CommonStyles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={CommonStyles.flex}
          contentContainerStyle={S.scrollContent}
          keyboardShouldPersistTaps="handled">

          {/* ── Design Name ── */}
          <View style={S.card}>
            <Text style={S.fieldLabel}>Design No / Name</Text>
            <View style={S.designRow}>
              <Icon name="tag" size={18} color={Colors.textMuted} style={S.designIcon} />
              <TextInput
                style={S.designInput}
                placeholder="Enter Design No / Name"
                placeholderTextColor={Colors.textMuted}
                value={form.designName}
                onChangeText={v => setForm(f => ({...f, designName: v}))}
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

            <GridRow label="Head" sections={SECTIONS}
              getValue={s => form.sections[s].head}
              onChange={(s, v) => updateSection(s, 'head', v)}
              editable />
            <GridRow label="Stich" sections={SECTIONS}
              getValue={s => form.sections[s].stich}
              onChange={(s, v) => updateSection(s, 'stich', v)}
              editable />
            <GridRow label="Total Stich" sections={SECTIONS}
              getValue={s => fmt(computed.totalStich[s], 0)}
              editable={false} computed />
            <GridRow label="Rate" sections={SECTIONS}
              getValue={s => fmt(computed.rate[s])}
              editable={false} computed />
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
                onChangeText={v => setForm(f => ({...f, ratePerStitch: v}))}
              />
            </SummaryRow>
            <View style={S.summaryDivider} />
            <SummaryRow label="Sarees Stitch" iconName="format-list-numbered">
              <View style={S.summaryValueBox}>
                <Text style={S.summaryValue}>{fmt(computed.sareesStitch, 0)}</Text>
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
            <TouchableOpacity style={[S.btn, S.btnSave]} onPress={handleSave} activeOpacity={0.82}>
              <Icon name={editingId ? 'sync' : 'save'} size={20} color="#fff" />
              <Text style={S.btnLabel}>{editingId ? 'Update' : 'Save'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[S.btn, S.btnCalc]} onPress={() => Keyboard.dismiss()} activeOpacity={0.82}>
              <Icon name="calculate" size={20} color="#fff" />
              <Text style={S.btnLabel}>Calculate</Text>
            </TouchableOpacity>
          </View>

          {/* WhatsApp Share Button */}
          <TouchableOpacity
            style={[S.btn, S.btnWhatsApp, sharing && S.btnDisabled]}
            onPress={handleWhatsApp}
            activeOpacity={0.82}
            disabled={sharing}>
            <Icon name="share" size={20} color="#fff" />
            <Text style={S.btnLabel}>
              {sharing ? 'Generating PDF…' : 'Share on WhatsApp'}
            </Text>
          </TouchableOpacity>

          {/* Clear Button (full width) */}
          <TouchableOpacity style={[S.btn, S.btnClear]} onPress={handleClear} activeOpacity={0.82}>
            <Icon name="cleaning-services" size={20} color="#fff" />
            <Text style={S.btnLabel}>Clear All</Text>
          </TouchableOpacity>

          <View style={{height: insets.bottom + 24}} />
        </ScrollView>
      </KeyboardAvoidingView>

      <HistoryModal
        visible={historyVisible}
        history={history}
        onClose={() => setHistoryVisible(false)}
        onSelect={selectHistory}
        onDelete={deleteHistory}
      />
    </View>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
interface GridRowProps {
  label: string;
  sections: SectionKey[];
  getValue: (s: SectionKey) => string;
  onChange?: (s: SectionKey, v: string) => void;
  editable: boolean;
  computed?: boolean;
}
function GridRow({label, sections, getValue, onChange, editable, computed: isComputed}: GridRowProps) {
  return (
    <View style={S.tableRow}>
      <View style={S.fieldLabelCell}>
        <Text style={S.rowLabel}>{label}:</Text>
      </View>
      {sections.map(s => (
        <View key={s} style={S.dataCell}>
          {editable ? (
            <TextInput
              style={S.tableInput}
              keyboardType="decimal-pad"
              value={getValue(s)}
              onChangeText={v => onChange?.(s, v)}
              placeholder="0"
              placeholderTextColor={Colors.textMuted}
              selectTextOnFocus
            />
          ) : (
            <View style={[S.tableReadonly, isComputed && S.computedCell]}>
              <Text style={S.tableReadonlyText}>{getValue(s)}</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

function SummaryRow({label, iconName, children}: {label: string; iconName: string; children: React.ReactNode}) {
  return (
    <View style={S.summaryRow}>
      <View style={S.summaryLabelRow}>
        <Icon name={iconName} size={16} color={Colors.accent} style={S.summaryLabelIcon} />
        <Text style={S.summaryLabel}>{label}</Text>
      </View>
      {children}
    </View>
  );
}

interface HistoryModalProps {
  visible: boolean;
  history: HistoryEntry[];
  onClose: () => void;
  onSelect: (e: HistoryEntry) => void;
  onDelete: (id: string) => void;
}
function HistoryModal({visible, history, onClose, onSelect, onDelete}: HistoryModalProps) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={S.modalOverlay}>
        <View style={[S.modalSheet, {paddingBottom: insets.bottom + 16}]}>
          <View style={S.sheetHandle} />
          <View style={S.modalHeader}>
            <View style={S.modalTitleRow}>
              <Icon name="history" size={22} color={Colors.accent} style={{marginRight: 8}} />
              <Text style={S.modalTitle}>History</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={S.closeBtn}
              hitSlop={{top: 12, left: 12, right: 12, bottom: 12}}>
              <Icon name="close" size={22} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          {history.length === 0 ? (
            <View style={S.emptyWrap}>
              <Icon name="folder-open" size={64} color={Colors.border} style={{marginBottom: Spacing[3]}} />
              <Text style={S.emptyTitle}>No records yet</Text>
              <Text style={S.emptyHint}>Fill the form and tap Save to start building history.</Text>
            </View>
          ) : (
            <FlatList
              data={history}
              keyExtractor={i => i.id}
              renderItem={({item}) => (
                <TouchableOpacity style={S.historyItem} onPress={() => onSelect(item)} activeOpacity={0.8}>
                  <View style={S.historyIconWrap}>
                    <Icon name="receipt-long" size={20} color={Colors.primary} />
                  </View>
                  <View style={S.historyItemContent}>
                    <Text style={S.historyDesign}>{item.form.designName || '(No Name)'}</Text>
                    <View style={S.historyDateRow}>
                      <Icon name="access-time" size={11} color={Colors.textMuted} />
                      <Text style={S.historyDate}> {formatDate(item.savedAt)}</Text>
                    </View>
                    <View style={S.historyChips}>
                      <View style={S.chip}>
                        <Icon name="format-list-numbered" size={11} color={Colors.textSecondary} />
                        <Text style={S.chipText}> {fmt(item.computed.sareesStitch, 0)}</Text>
                      </View>
                      <View style={[S.chip, S.chipAccent]}>
                        <Icon name="payments" size={11} color={Colors.accent} />
                        <Text style={[S.chipText, S.chipTextAccent]}> ₹{fmt(item.computed.sareesRate)}</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => onDelete(item.id)} style={S.deleteBtn}
                    hitSlop={{top: 8, left: 8, right: 8, bottom: 8}}>
                    <Icon name="delete-outline" size={22} color={Colors.error} />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={S.separator} />}
              contentContainerStyle={{paddingHorizontal: Spacing[4], paddingVertical: Spacing[2]}}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.background},

  header: {
    backgroundColor: Colors.dark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    ...Shadow.md,
  },
  headerLeft: {flexDirection: 'row', alignItems: 'center', flex: 1},
  headerIcon: {marginRight: Spacing[2]},
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.textLight,
    letterSpacing: 0.2,
  },
  editingChipRow: {flexDirection: 'row', alignItems: 'center', marginTop: 2},
  editingChip: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.primary,
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

  scrollContent: {padding: Spacing[3], gap: Spacing[3]},

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
  designIcon: {marginRight: Spacing[2]},
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
  fieldLabelCell: {flex: 1.4, justifyContent: 'center', paddingRight: Spacing[1]},
  dataCell: {flex: 1, paddingHorizontal: 3, alignItems: 'center', justifyContent: 'center'},
  colHeader: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.accent,
    textAlign: 'center',
    paddingVertical: Spacing[2],
    textTransform: 'uppercase',
    letterSpacing: 0.6,
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
  computedCell: {backgroundColor: Colors.computedBg},
  tableReadonlyText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.accent,
    textAlign: 'center',
  },

  summaryRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing[2]},
  summaryLabelRow: {flex: 1, flexDirection: 'row', alignItems: 'center'},
  summaryLabelIcon: {marginRight: 5},
  summaryLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
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
  totalBox: {borderColor: Colors.primary, backgroundColor: Colors.computedBg},
  totalValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.accent,
  },
  summaryDivider: {height: 1, backgroundColor: Colors.border},

  btnRow: {flexDirection: 'row', gap: Spacing[2]},
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
  btnSave: {backgroundColor: Colors.dark},
  btnCalc: {backgroundColor: Colors.secondary},
  btnWhatsApp: {backgroundColor: '#25D366', flex: 1},
  btnClear: {backgroundColor: Colors.error},
  btnDisabled: {opacity: 0.6},
  btnLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textLight,
    letterSpacing: 0.3,
  },

  modalOverlay: {flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end'},
  modalSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius['2xl'],
    borderTopRightRadius: Radius['2xl'],
    maxHeight: '80%',
    ...Shadow.lg,
  },
  sheetHandle: {
    width: 40, height: 4, borderRadius: Radius.full,
    backgroundColor: Colors.border, alignSelf: 'center', marginTop: Spacing[2],
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing[4], paddingVertical: Spacing[3],
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  modalTitleRow: {flexDirection: 'row', alignItems: 'center'},
  modalTitle: {
    fontFamily: FontFamily.bold, fontSize: FontSize.xl, color: Colors.textPrimary,
  },
  closeBtn: {padding: Spacing[1]},

  historyItem: {flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing[3]},
  historyIconWrap: {
    width: 38, height: 38, borderRadius: Radius.md,
    backgroundColor: Colors.computedBg, alignItems: 'center',
    justifyContent: 'center', marginRight: Spacing[3],
  },
  historyItemContent: {flex: 1},
  historyDesign: {
    fontFamily: FontFamily.semiBold, fontSize: FontSize.md, color: Colors.textPrimary,
  },
  historyDateRow: {flexDirection: 'row', alignItems: 'center', marginTop: 2},
  historyDate: {
    fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textMuted,
  },
  historyChips: {flexDirection: 'row', gap: Spacing[2], marginTop: Spacing[1] + 2},
  chip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing[2], paddingVertical: 2,
    borderRadius: Radius.full, backgroundColor: Colors.background,
    borderWidth: 1, borderColor: Colors.border,
  },
  chipAccent: {backgroundColor: Colors.computedBg, borderColor: Colors.secondary},
  chipText: {fontFamily: FontFamily.medium, fontSize: FontSize.xs, color: Colors.textSecondary},
  chipTextAccent: {color: Colors.accent},
  deleteBtn: {padding: Spacing[2], marginLeft: Spacing[1]},
  separator: {height: 1, backgroundColor: Colors.border},

  emptyWrap: {alignItems: 'center', justifyContent: 'center', padding: Spacing[12]},
  emptyTitle: {
    fontFamily: FontFamily.bold, fontSize: FontSize.lg,
    color: Colors.textPrimary, marginBottom: Spacing[2],
  },
  emptyHint: {
    fontFamily: FontFamily.regular, fontSize: FontSize.sm,
    color: Colors.textMuted, textAlign: 'center',
  },
});
