import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
  useColorScheme,
} from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { F, R, S, paletteFor, type Palette } from '../theme';
import { useStore } from '../store';
import { IconCheck } from './icons';

export function usePal(): Palette {
  const scheme = useColorScheme();
  const { state } = useStore();
  return paletteFor(state.settings.theme, scheme);
}

/* ---------- matn ---------- */

type TxtProps = {
  children: React.ReactNode;
  v?: 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'label' | 'mono' | 'monoSm';
  color?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  /** Uzun raqam bir qatorda qolishi uchun: joyi yetmasa shrift kichrayadi. */
  adjustsFontSizeToFit?: boolean;
  minimumFontScale?: number;
};

export function Txt({
  children,
  v = 'body',
  color,
  style,
  numberOfLines,
  adjustsFontSizeToFit,
  minimumFontScale,
}: TxtProps) {
  const p = usePal();
  const base: Record<string, TextStyle> = {
    display: { fontFamily: F.display, fontSize: 30, lineHeight: 34, letterSpacing: -0.6, color: p.ink },
    h1: { fontFamily: F.display, fontSize: 23, lineHeight: 28, letterSpacing: -0.4, color: p.ink },
    h2: { fontFamily: F.display, fontSize: 18, lineHeight: 23, letterSpacing: -0.2, color: p.ink },
    h3: { fontFamily: F.bodySemi, fontSize: 14.5, lineHeight: 20, color: p.ink },
    body: { fontFamily: F.body, fontSize: 15, lineHeight: 21, color: p.ink },
    small: { fontFamily: F.body, fontSize: 12.5, lineHeight: 17, color: p.muted },
    label: {
      fontFamily: F.mono,
      fontSize: 10,
      letterSpacing: 1.5,
      color: p.muted,
      textTransform: 'uppercase',
    },
    mono: { fontFamily: F.monoMed, fontSize: 14, color: p.ink },
    monoSm: { fontFamily: F.mono, fontSize: 11.5, color: p.muted },
  };
  return (
    <Text
      numberOfLines={numberOfLines}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      minimumFontScale={minimumFontScale}
      style={[base[v], color ? { color } : null, style]}
    >
      {children}
    </Text>
  );
}

/* ---------- sirtlar ---------- */

export function Card({
  children,
  style,
  pad = true,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  pad?: boolean;
}) {
  const p = usePal();
  return (
    <View
      style={[
        {
          backgroundColor: p.surface,
          borderColor: p.line,
          borderWidth: StyleSheet.hairlineWidth * 2,
          borderRadius: R.lg,
          padding: pad ? S.lg : 0,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Row({
  children,
  style,
  gap = S.sm,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  gap?: number;
}) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap }, style]}>{children}</View>;
}

export function Divider() {
  const p = usePal();
  return <View style={{ height: StyleSheet.hairlineWidth * 2, backgroundColor: p.line }} />;
}

/* ---------- boshqaruv ---------- */

export function Btn({
  label,
  onPress,
  tone = 'primary',
  small,
  style,
  disabled,
}: {
  label: string;
  onPress: () => void;
  tone?: 'primary' | 'ghost' | 'danger';
  small?: boolean;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}) {
  const p = usePal();
  const bg = tone === 'primary' ? p.lojuvard : 'transparent';
  const fg = tone === 'primary' ? p.onAccent : tone === 'danger' ? p.anor : p.ink2;
  const bc = tone === 'primary' ? p.lojuvard : tone === 'danger' ? p.anor : p.line2;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          backgroundColor: bg,
          borderColor: bc,
          borderWidth: tone === 'primary' ? 0 : StyleSheet.hairlineWidth * 2,
          borderRadius: R.sm,
          paddingVertical: small ? 7 : 12,
          paddingHorizontal: small ? 12 : 18,
          alignItems: 'center',
          opacity: disabled ? 0.45 : pressed ? 0.75 : 1,
        },
        style,
      ]}
    >
      <Text style={{ fontFamily: F.display, fontSize: small ? 13.5 : 15.5, color: fg }}>{label}</Text>
    </Pressable>
  );
}

export function Chip({
  label,
  active,
  onPress,
  tone,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
  tone?: string;
}) {
  const p = usePal();
  const accent = tone ?? p.lojuvard;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingVertical: 7,
        paddingHorizontal: 12,
        borderRadius: R.pill,
        borderWidth: StyleSheet.hairlineWidth * 2,
        borderColor: active ? accent : p.line,
        backgroundColor: active ? accent + (p.dark ? '26' : '1A') : p.surface,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Text
        style={{ fontFamily: active ? F.bodySemi : F.body, fontSize: 13, color: active ? accent : p.ink2 }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function Tag({ label, tone }: { label: string; tone: string }) {
  const p = usePal();
  return (
    <View
      style={{
        paddingVertical: 2,
        paddingHorizontal: 7,
        borderRadius: 4,
        backgroundColor: tone + (p.dark ? '2E' : '1F'),
      }}
    >
      <Text style={{ fontFamily: F.mono, fontSize: 9.5, letterSpacing: 0.8, color: tone }}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

export function Seg<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { k: T; uz: string }[];
  onChange: (v: T) => void;
}) {
  const p = usePal();
  return (
    <View
      style={{ flexDirection: 'row', backgroundColor: p.surface2, borderRadius: R.sm, padding: 3, gap: 3 }}
    >
      {options.map((o) => {
        const on = o.k === value;
        return (
          <Pressable
            key={o.k}
            onPress={() => onChange(o.k)}
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: R.sm - 2,
              alignItems: 'center',
              backgroundColor: on ? p.surface : 'transparent',
              borderWidth: on ? StyleSheet.hairlineWidth * 2 : 0,
              borderColor: p.line,
            }}
          >
            <Text
              style={{ fontFamily: on ? F.display : F.body, fontSize: 13.5, color: on ? p.ink : p.muted }}
            >
              {o.uz}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Check({
  on,
  onPress,
  tone,
  label,
}: {
  on: boolean;
  onPress: () => void;
  tone?: string;
  /** Ekran o'quvchi uchun: nima belgilanayotgani. */
  label?: string;
}) {
  const p = usePal();
  const accent = tone ?? p.lojuvard;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: on }}
      accessibilityLabel={label}
      hitSlop={10}
      style={{
        width: 24,
        height: 24,
        borderRadius: 7,
        borderWidth: 1.8,
        borderColor: on ? accent : p.line2,
        backgroundColor: on ? accent : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {on ? <IconCheck color={p.onAccent} size={13} /> : null}
    </Pressable>
  );
}

export function Field({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
  style,
  autoFocus,
  onSubmitEditing,
  align,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric';
  multiline?: boolean;
  style?: StyleProp<TextStyle>;
  autoFocus?: boolean;
  onSubmitEditing?: () => void;
  align?: 'left' | 'right' | 'center';
}) {
  const p = usePal();
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={p.muted}
      keyboardType={keyboardType}
      multiline={multiline}
      autoFocus={autoFocus}
      onSubmitEditing={onSubmitEditing}
      textAlign={align}
      style={[
        {
          backgroundColor: p.surface2,
          borderColor: p.line,
          borderWidth: StyleSheet.hairlineWidth * 2,
          borderRadius: R.sm,
          paddingHorizontal: 13,
          paddingVertical: multiline ? 12 : 11,
          fontFamily: F.body,
          fontSize: 15,
          color: p.ink,
          minHeight: multiline ? 110 : undefined,
          textAlignVertical: multiline ? 'top' : 'center',
        },
        style,
      ]}
    />
  );
}

/* ---------- ko'rsatkichlar ---------- */

export function Ring({
  pct,
  size = 92,
  label,
  sub,
}: {
  pct: number;
  size?: number;
  label: string;
  sub?: string;
}) {
  const p = usePal();
  const r = size * 0.4;
  const c = 2 * Math.PI * r;
  const half = size / 2;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Path
          d={`M${half} ${half - r * 0.6} L${half + r * 0.6} ${half} L${half} ${half + r * 0.6} L${half - r * 0.6} ${half} Z`}
          stroke={p.lojuvard}
          strokeWidth={1.1}
          opacity={0.3}
          fill={p.lojuvard}
          fillOpacity={0.07}
        />
        <Rect
          x={half - r * 0.42}
          y={half - r * 0.42}
          width={r * 0.84}
          height={r * 0.84}
          stroke={p.lojuvard}
          strokeWidth={1.1}
          opacity={0.3}
          fill="none"
        />
        <Circle cx={half} cy={half} r={r} stroke={p.line} strokeWidth={6} fill="none" />
        <Circle
          cx={half}
          cy={half}
          r={r}
          stroke={p.lojuvard}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={c * (1 - Math.max(0, Math.min(1, pct)))}
          transform={`rotate(-90 ${half} ${half})`}
        />
      </Svg>
      <Text style={{ fontFamily: F.display, fontSize: size * 0.24, color: p.ink }}>{label}</Text>
      {sub ? <Text style={{ fontFamily: F.mono, fontSize: 10, color: p.muted }}>{sub}</Text> : null}
    </View>
  );
}

export function Bar({ pct, tone, height = 6 }: { pct: number; tone?: string; height?: number }) {
  const p = usePal();
  const w = Math.max(0, Math.min(1, pct)) * 100;
  return (
    <View style={{ height, borderRadius: R.pill, backgroundColor: p.line, overflow: 'hidden' }}>
      <View
        style={{ width: `${w}%`, height: '100%', borderRadius: R.pill, backgroundColor: tone ?? p.feruza }}
      />
    </View>
  );
}

export function Empty({ text }: { text: string }) {
  const p = usePal();
  return (
    <View style={{ alignItems: 'center', paddingVertical: 26, gap: S.sm }}>
      <Svg width={30} height={30} viewBox="0 0 24 24" fill="none">
        <Path d="M12 2 L22 12 L12 22 L2 12 Z" stroke={p.line2} strokeWidth={1.3} />
        <Rect x="5" y="5" width="14" height="14" stroke={p.line2} strokeWidth={1.3} />
      </Svg>
      <Text
        style={{
          fontFamily: F.body,
          fontSize: 13,
          color: p.muted,
          textAlign: 'center',
          paddingHorizontal: S.xl,
        }}
      >
        {text}
      </Text>
    </View>
  );
}

/* ---------- ekran ---------- */

export function Screen({
  children,
  title,
  eyebrow,
  right,
  scroll = true,
}: {
  children: React.ReactNode;
  title: string;
  eyebrow?: string;
  right?: React.ReactNode;
  scroll?: boolean;
}) {
  const p = usePal();
  const insets = useSafeAreaInsets();
  const header = (
    <View style={{ paddingTop: insets.top + S.md, paddingHorizontal: S.lg, paddingBottom: S.md }}>
      <Row style={{ alignItems: 'flex-end' }}>
        <View style={{ flex: 1 }}>
          {eyebrow ? <Txt v="label">{eyebrow}</Txt> : null}
          <Txt v="display" style={{ marginTop: eyebrow ? 3 : 0 }}>
            {title}
          </Txt>
        </View>
        {right}
      </Row>
    </View>
  );
  const body = scroll ? (
    <ScrollView
      contentContainerStyle={{ paddingHorizontal: S.lg, paddingBottom: S.xxl + insets.bottom, gap: S.md }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={{ flex: 1, paddingHorizontal: S.lg }}>{children}</View>
  );
  return (
    <View style={{ flex: 1, backgroundColor: p.ground }}>
      {header}
      {body}
    </View>
  );
}

export function Loading() {
  const p = usePal();
  return (
    <View style={{ flex: 1, backgroundColor: p.ground, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={p.lojuvard} />
    </View>
  );
}
