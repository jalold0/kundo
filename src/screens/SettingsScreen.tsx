import Constants from 'expo-constants';
import React, { useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, View } from 'react-native';
import { CatsSheet } from '../components/CatsSheet';
import { exportBackup, exportEntriesCsv, pickBackup } from '../lib/backup';
import { LANGS, t, type Lang } from '../i18n';
import { useStore } from '../store';
import { R, S } from '../theme';
import type { ThemeMode } from '../theme';
import type { CatKind } from '../types';
import {
  IconChevron,
  IconDownload,
  IconHelp,
  IconList,
  IconMail,
  IconShield,
  IconTable,
  IconTag,
  IconTrash,
  IconUpload,
  IconWallet,
  StarMark,
} from '../ui/icons';
import { Card, Divider, Row, Screen, Seg, Txt, usePal } from '../ui/kit';
import { useToast } from '../ui/toast';

const SAYT = 'https://kundoapp.vercel.app';

/** `toLocaleString` uchun — sana va vaqt shu qoidada yoziladi. */
const LOCALES: Record<Lang, string> = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-US' };
const POCHTA = 'jaloldin@buxoro.online';

type IconCmp = (props: { size?: number; color: string; strokeWidth?: number }) => React.ReactElement;

export default function SettingsScreen() {
  const p = usePal();
  const store = useStore();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [cats, setCats] = useState<CatKind | null>(null);

  const version = Constants.expoConfig?.version ?? '1.0.0';
  const n = store.state.cats;

  const ochish = (url: string) => {
    Linking.openURL(url).catch(() => toast.show(t('common.linkFailed')));
  };

  const doExport = async () => {
    setBusy(true);
    const r = await exportBackup(store.state);
    setBusy(false);
    if (!r.ok) Alert.alert(t('settings.backupTitle'), r.message);
    else toast.show(t('settings.backupDone'));
  };

  const doCsv = async () => {
    if (!store.state.entries.length) {
      Alert.alert(t('settings.spendTitle'), t('settings.csvEmpty'));
      return;
    }
    setBusy(true);
    const r = await exportEntriesCsv(store.state);
    setBusy(false);
    if (!r.ok) Alert.alert(t('settings.csvTitle'), r.message);
  };

  const doImport = async () => {
    setBusy(true);
    const r = await pickBackup();
    setBusy(false);
    if (!r.ok || !r.data) {
      if (!r.canceled) Alert.alert(t('settings.restoreTitle'), r.message);
      return;
    }
    const d = r.data;
    Alert.alert(
      t('settings.restoreTitle'),
      t('settings.restoreAsk', { tasks: d.tasks?.length ?? 0, entries: d.entries?.length ?? 0 }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.merge'),
          onPress: () => {
            store.mergeIn(d);
            toast.show(t('settings.restoreMerged'));
          },
        },
        {
          text: t('common.replace'),
          style: 'destructive',
          onPress: () => {
            store.replaceAll(d);
            toast.show(t('settings.restoreReplaced'), { undo: store.undo });
          },
        },
      ],
    );
  };

  const doReset = () => {
    Alert.alert(t('settings.wipe'), t('settings.wipeAsk'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => {
          store.replaceAll({
            v: 1,
            tasks: [],
            repeats: [],
            habits: [],
            entries: [],
            // Yo'nalishlar va sozlamalar qoladi: o'chirilayotgani — yozuvlar.
            cats: store.state.cats,
            budgets: {},
            notes: '',
            settings: store.state.settings,
            updated: null,
          });
          toast.show(t('settings.wipeDone'), { undo: store.undo });
        },
      },
    ]);
  };

  const mailto = `mailto:${POCHTA}?subject=${encodeURIComponent(`Kundo ${version}`)}`;

  return (
    <>
      <Screen eyebrow="Kundo" title={t('settings.title')}>
        <Section title={t('settings.appearance')}>
          <View style={{ padding: S.lg, gap: S.md }}>
            <View>
              <Txt v="h3">{t('settings.theme')}</Txt>
              <Txt v="small" style={{ marginTop: 2 }}>
                {t('settings.themeHint')}
              </Txt>
            </View>
            <Seg<ThemeMode>
              value={store.state.settings.theme}
              options={[
                { k: 'system', label: t('settings.themeSystem') },
                { k: 'light', label: t('settings.themeLight') },
                { k: 'dark', label: t('settings.themeDark') },
              ]}
              onChange={(mode) => store.setSettings({ theme: mode })}
            />
          </View>
          <Divider />
          <View style={{ padding: S.lg, gap: S.md }}>
            <View>
              <Txt v="h3">{t('settings.language')}</Txt>
              <Txt v="small" style={{ marginTop: 2 }}>
                {t('settings.languageHint')}
              </Txt>
            </View>
            <Seg<Lang>
              value={store.state.settings.lang}
              options={LANGS.map((l) => ({ k: l.k, label: l.label }))}
              onChange={(lang) => store.setSettings({ lang })}
            />
          </View>
        </Section>

        <Section title={t('settings.cats')}>
          <Item
            ico={IconList}
            title={t('settings.catsTask')}
            subtitle={`${t('settings.catsCount', { n: n.task.length })} — ${n.task
              .slice(0, 3)
              .map((c) => c.label)
              .join(', ')}…`}
            onPress={() => setCats('task')}
          />
          <Sep />
          <Item
            ico={IconWallet}
            title={t('settings.catsSpend')}
            subtitle={t('settings.catsCount', { n: n.spend.length })}
            onPress={() => setCats('spend')}
          />
          <Sep />
          <Item
            ico={IconTag}
            title={t('settings.catsIncome')}
            subtitle={t('settings.catsCount', { n: n.income.length })}
            onPress={() => setCats('income')}
          />
        </Section>

        <Section title={t('settings.data')}>
          <Item
            ico={IconDownload}
            title={t('settings.backup')}
            subtitle={t('settings.backupHint')}
            onPress={doExport}
            disabled={busy}
          />
          <Sep />
          <Item
            ico={IconUpload}
            title={t('settings.restore')}
            subtitle={t('settings.restoreHint')}
            onPress={doImport}
            disabled={busy}
          />
          <Sep />
          <Item
            ico={IconTable}
            title={t('settings.csv')}
            subtitle={t('settings.csvHint')}
            onPress={doCsv}
            disabled={busy}
          />
          <Divider />
          <View style={{ paddingHorizontal: S.lg, paddingVertical: S.lg }}>
            <Row gap={S.md}>
              <Stat value={store.state.tasks.length} label={t('settings.statTasks')} />
              <Stat value={store.state.habits.length} label={t('settings.statHabits')} />
              <Stat value={store.state.entries.length} label={t('settings.statEntries')} />
            </Row>
            <Txt v="small" style={{ marginTop: S.md }}>
              {t('settings.localOnly')}
            </Txt>
            {store.state.updated ? (
              <Txt v="monoSm" style={{ marginTop: S.xs }}>
                {t('settings.lastChange', {
                  when: new Date(store.state.updated).toLocaleString(LOCALES[store.state.settings.lang]),
                })}
              </Txt>
            ) : null}
          </View>
        </Section>

        <Section title={t('settings.app')}>
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
                {t('settings.version', { v: version })}
              </Txt>
            </View>
          </Row>
          <View style={{ paddingHorizontal: S.lg, paddingBottom: S.lg }}>
            <Txt v="small">{t('settings.about')}</Txt>
          </View>
          <Divider />
          <Item
            ico={IconShield}
            title={t('settings.privacy')}
            subtitle={t('settings.privacyHint')}
            onPress={() => ochish(`${SAYT}/maxfiylik.html`)}
          />
          <Sep />
          <Item
            ico={IconHelp}
            title={t('settings.help')}
            subtitle={t('settings.helpHint')}
            onPress={() => ochish(`${SAYT}/qollab.html`)}
          />
          <Sep />
          <Item
            ico={IconMail}
            title={t('settings.contact')}
            subtitle={POCHTA}
            onPress={() => ochish(mailto)}
          />
        </Section>

        <Section title={t('settings.danger')} tone={p.anor}>
          <Item
            ico={IconTrash}
            danger
            chevron={false}
            title={t('settings.wipe')}
            subtitle={t('settings.wipeHint')}
            onPress={doReset}
          />
        </Section>
      </Screen>

      {cats ? (
        <CatsSheet
          visible
          kind={cats}
          onClose={() => setCats(null)}
          title={CAT_SHEET[cats].title()}
          hint={CAT_SHEET[cats].hint()}
        />
      ) : null}
    </>
  );
}

/** Sarlavha va izoh render paytida olinadi — til almashsa darhol o'zgaradi. */
const CAT_SHEET: Record<CatKind, { title: () => string; hint: () => string }> = {
  task: { title: () => t('settings.catsTask'), hint: () => t('cats.taskHint') },
  spend: { title: () => t('settings.catsSpend'), hint: () => t('cats.moneyHint') },
  income: { title: () => t('settings.catsIncome'), hint: () => t('cats.moneyHint') },
};

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
