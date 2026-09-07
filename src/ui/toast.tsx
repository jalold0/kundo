import * as Haptics from 'expo-haptics';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { t } from '../i18n';
import { F, R, S } from '../theme';
import { usePal } from './kit';

type ToastOpts = { undo?: () => void; tone?: 'normal' | 'danger' };
type Toast = { id: number; text: string } & ToastOpts;

const Ctx = createContext<{ show: (text: string, opts?: ToastOpts) => void }>({ show: () => {} });

export function useToast() {
  return useContext(Ctx);
}

/**
 * Ekran ostida chiqadigan qisqa xabar. Agar `undo` berilsa,
 * foydalanuvchi amalni bir bosishda qaytara oladi — o'chirish oldidan
 * «rostdanmi?» deb so'ramaslikning eng qulay yo'li shu.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seq = useRef(0);

  const show = useCallback((text: string, opts?: ToastOpts) => {
    if (timer.current) clearTimeout(timer.current);
    seq.current += 1;
    setToast({ id: seq.current, text, ...opts });
    timer.current = setTimeout(() => setToast(null), opts?.undo ? 5200 : 2600);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      <ToastView toast={toast} onDone={() => setToast(null)} />
    </Ctx.Provider>
  );
}

function ToastView({ toast, onDone }: { toast: Toast | null; onDone: () => void }) {
  const p = usePal();
  const insets = useSafeAreaInsets();
  // Animated qiymat bir marta yaratiladi; ref emas, chunki render paytida o'qiladi.
  const [anim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(anim, {
      toValue: toast ? 1 : 0,
      duration: toast ? 180 : 140,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [toast, anim]);

  if (!toast) return null;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: S.md,
        right: S.md,
        bottom: insets.bottom + 74,
        opacity: anim,
        transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }],
      }}
    >
      <View
        pointerEvents={toast.undo ? 'box-none' : 'none'}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: S.md,
          paddingVertical: 12,
          paddingHorizontal: S.lg,
          borderRadius: R.md,
          backgroundColor: p.dark ? p.surface2 : p.ink,
          borderWidth: p.dark ? StyleSheet.hairlineWidth * 2 : 0,
          borderColor: p.line2,
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 6 },
          elevation: 6,
        }}
      >
        <Text
          numberOfLines={2}
          style={{ flex: 1, fontFamily: F.body, fontSize: 14, color: p.dark ? p.ink : p.surface }}
        >
          {toast.text}
        </Text>
        {toast.undo ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('toast.undoA11y')}
            hitSlop={10}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              toast.undo?.();
              onDone();
            }}
          >
            <Text style={{ fontFamily: F.display, fontSize: 14.5, color: p.dark ? p.lojuvard : '#A8BEF7' }}>
              {t('common.undo')}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </Animated.View>
  );
}
