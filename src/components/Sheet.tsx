import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { t } from '../i18n';
import { R, S } from '../theme';
import { Row, Txt, usePal } from '../ui/kit';

export function Sheet({
  visible,
  onClose,
  title,
  children,
  footer,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const p = usePal();
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: '#000000' + (p.dark ? '99' : '66') }} onPress={onClose} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View
          style={{
            backgroundColor: p.ground,
            borderTopLeftRadius: R.lg + 6,
            borderTopRightRadius: R.lg + 6,
            paddingTop: S.md,
            paddingBottom: insets.bottom + S.lg,
            maxHeight: '88%',
          }}
        >
          <View
            style={{
              alignSelf: 'center',
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: p.line2,
              marginBottom: S.md,
            }}
          />
          <Row style={{ paddingHorizontal: S.lg, paddingBottom: S.md }}>
            <Txt v="h1" style={{ flex: 1 }}>
              {title}
            </Txt>
            <Pressable onPress={onClose} hitSlop={12}>
              <Txt v="small" color={p.lojuvard}>
                {t('common.close')}
              </Txt>
            </Pressable>
          </Row>
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: S.lg, paddingBottom: S.md, gap: S.md }}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
          {footer ? (
            <View style={{ paddingHorizontal: S.lg, paddingTop: S.md, gap: S.sm }}>{footer}</View>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
