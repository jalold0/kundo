import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { daysInMonth, monthOf, months, parseISO, today, wmin } from '../lib/date';
import { t } from '../i18n';
import { R, S } from '../theme';
import { IconChevron } from '../ui/icons';
import { Row, Txt, usePal } from '../ui/kit';

/**
 * Vaqt va sana tanlash — ilova ichida.
 *
 * Ilgari `@react-native-community/datetimepicker` ishlatilardi: Android'da tizimning
 * o'z oynasini ochadi, u ilovaning rangi ham, shrifti ham emas. Ustiga-ustak bu
 * panellar Sheet (Modal) ichida ochiladi — modal ustiga modal Android'da beqaror.
 * Shuning uchun ikkalasi ham oddiy panel: joyida ochiladi, ilova uslubida.
 */

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINS = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

export function TimePanel({ value, onChange }: { value: string; onChange: (t: string) => void }) {
  const p = usePal();
  const [hh, mm] = value ? value.split(':') : ['', ''];
  return (
    <View style={panel(p)}>
      <View style={{ gap: S.sm }}>
        <Txt v="label">{t('form.hour')}</Txt>
        <Grid>
          {HOURS.map((h) => (
            <Cell key={h} label={h} active={hh === h} onPress={() => onChange(`${h}:${mm || '00'}`)} />
          ))}
        </Grid>
      </View>
      <View style={{ gap: S.sm }}>
        <Txt v="label">{t('form.minute')}</Txt>
        <Grid>
          {MINS.map((m) => (
            <Cell key={m} label={m} active={mm === m} onPress={() => onChange(`${hh || '09'}:${m}`)} />
          ))}
        </Grid>
      </View>
    </View>
  );
}

export function DatePanel({
  value,
  onChange,
  /** Bundan keyingi kunlar tanlanmaydi — xarajat kelasi kunga yozilmaydi. */
  max = today(),
}: {
  value: string;
  onChange: (d: string) => void;
  max?: string;
}) {
  const p = usePal();
  const [ym, setYm] = useState(() => monthOf(value || today()));
  const cells = useMemo(() => buildMonth(ym), [ym]);
  const canNext = ym < monthOf(max);
  const [y, m] = ym.split('-').map(Number);

  return (
    <View style={panel(p)}>
      <Row>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common.prevMonth')}
          hitSlop={10}
          onPress={() => setYm(shiftMonth(ym, -1))}
          style={navBtn(p, true)}
        >
          <IconChevron color={p.ink2} dir="left" />
        </Pressable>
        <Txt v="h3" style={{ flex: 1, textAlign: 'center' }}>
          {months()[m - 1]} {y}
        </Txt>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common.nextMonth')}
          hitSlop={10}
          disabled={!canNext}
          onPress={() => setYm(shiftMonth(ym, 1))}
          style={navBtn(p, canNext)}
        >
          <IconChevron color={canNext ? p.ink2 : p.line2} dir="right" />
        </Pressable>
      </Row>

      <Row style={{ flexWrap: 'wrap' }} gap={0}>
        {week().map((w) => (
          <View key={w} style={{ width: '14.28%', alignItems: 'center', paddingBottom: 4 }}>
            <Txt v="label">{w}</Txt>
          </View>
        ))}
        {cells.map((d, i) => (
          <View key={d ?? `b${i}`} style={{ width: '14.28%', padding: 2 }}>
            {d ? <DayCell date={d} selected={d === value} disabled={d > max} onPress={onChange} /> : null}
          </View>
        ))}
      </Row>
    </View>
  );
}

/* ---------- qismlar ---------- */

function DayCell({
  date,
  selected,
  disabled,
  onPress,
}: {
  date: string;
  selected: boolean;
  disabled: boolean;
  onPress: (d: string) => void;
}) {
  const p = usePal();
  const isToday = date === today();
  const day = Number(date.slice(8));
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={() => onPress(date)}
      style={({ pressed }) => ({
        aspectRatio: 1,
        borderRadius: R.sm,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: StyleSheet.hairlineWidth * 2,
        borderColor: selected ? p.lojuvard : isToday ? p.feruza : 'transparent',
        backgroundColor: selected ? p.lojuvard : 'transparent',
        opacity: disabled ? 0.3 : pressed ? 0.7 : 1,
      })}
    >
      <Txt v="mono" color={selected ? p.onAccent : p.ink2} style={{ fontSize: 13 }}>
        {day}
      </Txt>
    </Pressable>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <Row style={{ flexWrap: 'wrap' }} gap={S.xs}>
      {children}
    </Row>
  );
}

function Cell({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const p = usePal();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => ({
        minWidth: 44,
        paddingVertical: 8,
        paddingHorizontal: 6,
        borderRadius: R.sm,
        alignItems: 'center',
        borderWidth: StyleSheet.hairlineWidth * 2,
        borderColor: active ? p.lojuvard : p.line,
        backgroundColor: active ? p.lojuvard : p.surface,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Txt v="mono" color={active ? p.onAccent : p.ink2} style={{ fontSize: 13.5 }}>
        {label}
      </Txt>
    </Pressable>
  );
}

/* ---------- yordamchilar ---------- */

function panel(p: ReturnType<typeof usePal>) {
  return {
    gap: S.md,
    padding: S.md,
    borderRadius: R.md,
    backgroundColor: p.surface2,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: p.line,
  };
}

function navBtn(p: ReturnType<typeof usePal>, on: boolean) {
  return {
    width: 32,
    height: 32,
    borderRadius: R.sm,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: p.line,
    backgroundColor: on ? p.surface : 'transparent',
  };
}

function shiftMonth(ym: string, n: number): string {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(y, m - 1 + n, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** Oy katakchalari: boshida bo'sh kunlar (dushanbadan), keyin ISO sanalar. */
function buildMonth(ym: string): (string | null)[] {
  const n = daysInMonth(ym);
  const off = (parseISO(`${ym}-01`).getDay() + 6) % 7;
  const out: (string | null)[] = Array(off).fill(null);
  for (let d = 1; d <= n; d++) out.push(`${ym}-${String(d).padStart(2, '0')}`);
  return out;
}

/** Dushanbadan boshlanadigan hafta sarlavhalari — `weekStart()` bilan bir tartib. */
function week(): string[] {
  const w = wmin();
  return [w[1], w[2], w[3], w[4], w[5], w[6], w[0]];
}
