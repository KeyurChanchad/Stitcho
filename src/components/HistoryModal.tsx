import React from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {HistoryEntry} from '../types';
import {fmt, formatDate} from '../services/calculation';
import {Colors, FontFamily, FontSize, Radius, Shadow, Spacing} from '../theme';

interface HistoryModalProps {
  visible: boolean;
  history: HistoryEntry[];
  onClose: () => void;
  onSelect: (e: HistoryEntry) => void;
  onDelete: (id: string) => void;
}

function ItemSeparator() {
  return <View style={styles.separator} />;
}

export default function HistoryModal({
  visible,
  history,
  onClose,
  onSelect,
  onDelete,
}: HistoryModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalSheet, {paddingBottom: insets.bottom + 16}]}>
          <View style={styles.sheetHandle} />

          <View style={styles.modalHeader}>
            <View style={styles.modalTitleRow}>
              <Icon
                name="history"
                size={22}
                color={Colors.accent}
                style={styles.iconMr8}
              />
              <Text style={styles.modalTitle}>History</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{top: 12, left: 12, right: 12, bottom: 12}}>
              <Icon name="close" size={22} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          {history.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Icon
                name="folder-open"
                size={64}
                color={Colors.border}
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyTitle}>No records yet</Text>
              <Text style={styles.emptyHint}>
                Fill the form and tap Save to start building history.
              </Text>
            </View>
          ) : (
            <FlatList
              data={history}
              keyExtractor={i => i.id}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.historyItem}
                  onPress={() => onSelect(item)}
                  activeOpacity={0.8}>
                  <View style={styles.historyIconWrap}>
                    <Icon name="receipt-long" size={20} color={Colors.primary} />
                  </View>
                  <View style={styles.historyItemContent}>
                    <Text style={styles.historyDesign}>
                      {item.form.designName || '(No Name)'}
                    </Text>
                    <View style={styles.historyDateRow}>
                      <Icon
                        name="access-time"
                        size={11}
                        color={Colors.textMuted}
                      />
                      <Text style={styles.historyDate}>
                        {' '}
                        {formatDate(item.savedAt)}
                      </Text>
                    </View>
                    <View style={styles.historyChips}>
                      <View style={styles.chip}>
                        <Icon
                          name="format-list-numbered"
                          size={11}
                          color={Colors.textSecondary}
                        />
                        <Text style={styles.chipText}>
                          {' '}
                          {fmt(item.computed.sareesStitch, 0)}
                        </Text>
                      </View>
                      <View style={[styles.chip, styles.chipAccent]}>
                        <Icon name="payments" size={11} color={Colors.accent} />
                        <Text
                          style={[styles.chipText, styles.chipTextAccent]}>
                          {' '}
                          ₹{fmt(item.computed.sareesRate)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => onDelete(item.id)}
                    style={styles.deleteBtn}
                    hitSlop={{top: 8, left: 8, right: 8, bottom: 8}}>
                    <Icon name="delete-outline" size={22} color={Colors.error} />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={ItemSeparator}
              contentContainerStyle={styles.historyListContent}
            />
          )}
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
  historyListContent: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing[3],
  },
  historyIconWrap: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    backgroundColor: Colors.computedBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[3],
  },
  historyItemContent: {
    flex: 1,
  },
  historyDesign: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  historyDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  historyDate: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  historyChips: {
    flexDirection: 'row',
    gap: Spacing[2],
    marginTop: Spacing[1] + 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipAccent: {
    backgroundColor: Colors.computedBg,
    borderColor: Colors.secondary,
  },
  chipText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  chipTextAccent: {
    color: Colors.accent,
  },
  deleteBtn: {
    padding: Spacing[2],
    marginLeft: Spacing[1],
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[12],
  },
  emptyIcon: {
    marginBottom: Spacing[3],
  },
  emptyTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing[2],
  },
  emptyHint: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
