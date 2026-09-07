import Constants from 'expo-constants';
import React, { useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, View } from 'react-native';
import { exportBackup, exportEntriesCsv, pickBackup } from '../lib/backup';
import { useStore } from '../store';
import { R, S } from '../theme';
import type { ThemeMode } from '../theme';
import {
  IconChevron,
  IconDownload,
  IconHelp,
  IconMail,
  IconShield,
  IconTable,
  IconTrash,
  IconUpload,
  StarMark,
} from '../ui/icons';
import { Card, Divider, Row, Screen, Seg, Txt, usePal } from '../ui/kit';
import { useToast } from '../ui/toast';

const SAYT = 'https://kundoapp.vercel.app';
const POCHTA = 'jaloldin@buxoro.online';

type IconCmp = (props: { size?: number; color: string; strokeWidth?: number }) => React.ReactElement;

export default function SettingsScreen() {
  const p = usePal();
  const store = useStore();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const version = Constants.expoConfig?.version ?? '1.0.0';

  const ochish = (url: string) => {
    Linking.openURL(url).catch(() => toast.show('Havolani ochib bo‘lmadi.'));
  };

  const doExport = async () => {
    setBusy(true);
    const r = await exportBackup(store.state);
    setBusy(false);
    if (!r.ok) Alert.alert('Zaxira', r.message);
    else toast.show('Zaxira fayli tayyorlandi.');
  };

  const doCsv = async () => {
    if (!store.state.entries.length) {
      Alert.alert('Xarajatlar', 'Hali birorta yozuv yo‘q.');
      return;
    }
    setBusy(true);
    const r = await exportEntriesCsv(store.state);
    setBusy(false);
    if (!r.ok) Alert.alert('CSV', r.message);
  };

  const doImport = async () => {
    setBusy(true);
    const r = await pickBackup();
    setBusy(false);
    if (!r.ok || !r.data) {
      if (r.message !== 'Bekor qilindi.') Alert.alert('Tiklash', r.message);
      return;
    }
    const d = r.data;
    Alert.alert(
      'Zaxiradan tiklash',
      `Faylda ${d.tasks?.length ?? 0} vazifa, ${d.entries?.length ?? 0} moliyaviy yozuv bor. Qanday qo‘shamiz?`,
      [
        { text: 'Bekor', style: 'cancel' },
        {
          text: 'Birlashtirish',
          onPress: () => {
            store.mergeIn(d);
            toast.show('Zaxira birlashtirildi.');
          },
        },
        {
          text: 'Almashtirish',
          style: 'destructive',
          onPress: () => {
            store.replaceAll(d);
            toast.show('Ma’lumot almashtirildi.', { undo: store.undo });
          },
        },
      ],
    );
  };

  const doReset = () => {
    Alert.alert(
      'Hamma ma’lumotni o‘chirish',
      'Vazifalar, odatlar va xarajat yozuvlari butunlay o‘chadi. Bu amalni qaytarib bo‘lmaydi — avval zaxira olib qo‘ying.',
      [
        { text: 'Bekor', style: 'cancel' },
        {
          text: 'O‘chirish',
          style: 'destructive',
          onPress: () => {
            store.replaceAll({
              v: 1,
              tasks: [],
              repeats: [],
              habits: [],
              entries: [],
              budgets: {},
              notes: '',
              settings: store.state.settings,
              updated: null,
            });
            toast.show('Hamma yozuv o‘chirildi.', { undo: store.undo });
          },
        },
      ],
    );
  };

  const mailto = `mailto:${POCHTA}?subject=${encodeURIComponent(`Kundo ${version}`)}`;

  return (
    <Screen eyebrow="Kundo" title="Sozlamalar">
      <Section title="Ko‘rinish">
        <View style={{ padding: S.lg, gap: S.md }}>
          <View>
            <Txt v="h3">Mavzu</Txt>
            <Txt v="small" style={{ marginTop: 2 }}>
              «Tizim» tanlansa, telefon sozlamasiga qarab o‘zi almashadi.
            </Txt>
          </View>
          <Seg<ThemeMode>
            value={store.state.settings.theme}
            options={[
              { k: 'system', uz: 'Tizim' },
              { k: 'light', uz: 'Yorug‘' },
              { k: 'dark', uz: 'Qorong‘i' },
            ]}
            onChange={(t) => store.setSettings({ theme: t })}
          />
        </View>
      </Section>

      <Section title="Ma’lumot">
        <Item
          ico={IconDownload}
          title="Zaxira olish"
          subtitle="Hamma yozuv bitta JSON fayliga"
          onPress={doExport}
          disabled={busy}
        />
        <Sep />
        <Item
          ico={IconUpload}
          title="Zaxiradan tiklash"
          subtitle="Fayldagini birlashtirish yoki butunlay almashtirish"
          onPress={doImport}
          disabled={busy}
        />
        <Sep />
        <Item
          ico={IconTable}
          title="Xarajatlarni CSV qilish"
          subtitle="Excel va Google Sheets ochadigan jadval"
          onPress={doCsv}
          disabled={busy}
        />
        <Divider />
        <View style={{ paddingHorizontal: S.lg, paddingVertical: S.lg }}>
          <Row gap={S.md}>
            <Stat value={store.state.tasks.length} label="vazifa" />
            <Stat value={store.state.habits.length} label="odat" />
            <Stat value={store.state.entries.length} label="yozuv" />
          </Row>
          <Txt v="small" style={{ marginTop: S.md }}>
            Hammasi shu telefonda saqlanadi — server yo‘q, hisob ochish shart emas.
          </Txt>
          {store.state.updated ? (
            <Txt v="monoSm" style={{ marginTop: S.xs }}>
              oxirgi o‘zgarish: {new Date(store.state.updated).toLocaleString('uz-UZ')}
            </Txt>
          ) : null}
        </View>
      </Section>

      <Section title="Ilova">
        <Row style={{ padding: S.lg }} gap={S.md}>
          <View
            style={{
              width: 46,
              height: 46,
              borderRadius: R.md,
              backgroundColor: p.lojuvard,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <StarMark color={p.onAccent} size={26} />
          </View>
          <View style={{ flex: 1 }}>
            <Txt v="h2">Kundo</Txt>
            <Txt v="monoSm" style={{ marginTop: 1 }}>
              versiya {version}
            </Txt>
          </View>
        </Row>
        <View style={{ paddingHorizontal: S.lg, paddingBottom: S.lg }}>
          <Txt v="small">
            Kuningizni va xarajatlaringizni bir joyda tartibga soladigan oddiy daftar. Rang va naqshlar
            Buxoro koshinidan ilhomlangan.
          </Txt>
        </View>
        <Divider />
        <Item
          ico={IconShield}
          title="Maxfiylik siyosati"
          subtitle="Ilova nima yig‘adi va nima yig‘maydi"
          onPress={() => ochish(`${SAYT}/maxfiylik.html`)}
        />
        <Sep />
        <Item
          ico={IconHelp}
          title="Yordam va savollar"
          subtitle="Tez-tez so‘raladigan savollar"
          onPress={() => ochish(`${SAYT}/qollab.html`)}
        />
        <Sep />
        <Item
          ico={IconMail}
          title="Taklif va xato haqida yozish"
          subtitle={POCHTA}
          onPress={() => ochish(mailto)}
        />
      </Section>

      <Section title="Xavfli hudud" tone={p.anor}>
        <Item
          ico={IconTrash}
          danger
          chevron={false}
          title="Hamma ma’lumotni o‘chirish"
          subtitle="Vazifa, odat va xarajat yozuvlari butunlay o‘chadi"
          onPress={doReset}
        />
      </Section>
    </Screen>
  );
}

/* ---------- shu ekranning qismlari ---------- */

/** Sarlavhasi kartadan tashqarida turadigan bo'lim — sozlamalar ro'yxati shaklida. */
function Section({ title, tone, children }: { title: string; tone?: string; children: React.ReactNode }) {
  return (
    <View>
      <Txt v="label" style={{ marginBottom: S.sm, marginLeft: S.xs }}>
        {title}
      </Txt>
      <Card pad={false} style={tone ? { borderColor: tone } : undefined}>
        {children}
      </Card>
    </View>
  );
}

/** Ikonka + sarlavha + izoh + o'ng tomonda strelka. */
function Item({
  ico: Ico,
  title,
  subtitle,
  onPress,
  disabled,
  danger,
  /** Strelka «boshqa joyga o'tadi» degan ma'noni beradi — dialog ochadigan qatorda o'chiriladi. */
  chevron = true,
}: {
  ico: IconCmp;
  title: string;
  subtitle?: string;
  onPress: () => void;
  disabled?: boolean;
  danger?: boolean;
  chevron?: boolean;
}) {
  const p = usePal();
  const accent = danger ? p.anor : p.lojuvard;
  const tint = danger ? p.anorSoft : p.lojuvardSoft;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: S.md,
        paddingHorizontal: S.lg,
        paddingVertical: 13,
        backgroundColor: pressed ? p.surface2 : 'transparent',
        opacity: disabled ? 0.45 : 1,
      })}
    >
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          backgroundColor: tint,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ico size={19} color={accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Txt v="h3" color={danger ? p.anor : undefined}>
          {title}
        </Txt>
        {subtitle ? (
          <Txt v="small" style={{ marginTop: 1 }}>
            {subtitle}
          </Txt>
        ) : null}
      </View>
      {chevron ? <IconChevron size={15} color={p.muted} /> : null}
    </Pressable>
  );
}

/** Qatorlar orasidagi chiziq — ikonka kengligicha ichkariga surilgan. */
function Sep() {
  const p = usePal();
  return (
    <View
      style={{
        height: StyleSheet.hairlineWidth * 2,
        backgroundColor: p.line,
        marginLeft: S.lg + 34 + S.md,
      }}
    />
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={{ flex: 1 }}>
      <Txt v="mono" style={{ fontSize: 20, lineHeight: 25 }}>
        {value}
      </Txt>
      <Txt v="label" style={{ marginTop: 3 }}>
        {label}
      </Txt>
    </View>
  );
}
