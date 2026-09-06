import Constants from 'expo-constants';
import React, { useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, View } from 'react-native';
import { exportBackup, exportEntriesCsv, pickBackup } from '../lib/backup';
import { useStore } from '../store';
import { S } from '../theme';
import type { ThemeMode } from '../theme';
import { StarMark } from '../ui/icons';
import { Btn, Card, Divider, Row, Screen, Seg, Txt, usePal } from '../ui/kit';
import { useToast } from '../ui/toast';

export default function SettingsScreen() {
  const p = usePal();
  const store = useStore();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

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

  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <Screen eyebrow="Sozlamalar" title="Sozlamalar">
      <Card>
        <Txt v="label">Ko'rinish</Txt>
        <View style={{ marginTop: S.md }}>
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
        <Txt v="small" style={{ marginTop: S.sm }}>
          «Tizim» — telefon sozlamasiga qarab o‘zi almashadi.
        </Txt>
      </Card>

      <Card>
        <Txt v="label">Ma'lumot</Txt>
        <Row style={{ marginTop: S.md }}>
          <Txt v="small" style={{ flex: 1 }}>
            Hammasi shu telefonda saqlanadi. Hech qanday server yo‘q, hisob ochish shart emas.
          </Txt>
        </Row>
        <View style={{ gap: S.sm, marginTop: S.md }}>
          <Btn label="Zaxira olish (JSON)" tone="ghost" onPress={doExport} disabled={busy} />
          <Btn label="Zaxiradan tiklash" tone="ghost" onPress={doImport} disabled={busy} />
          <Btn label="Xarajatlarni CSV qilib chiqarish" tone="ghost" onPress={doCsv} disabled={busy} />
        </View>
        <Divider />
        <Row style={{ marginTop: S.md }} gap={S.md}>
          <Stat label="vazifa" value={store.state.tasks.length} />
          <Stat label="odat" value={store.state.habits.length} />
          <Stat label="moliyaviy yozuv" value={store.state.entries.length} />
        </Row>
        {store.state.updated ? (
          <Txt v="small" style={{ marginTop: S.sm }}>
            Oxirgi o‘zgarish: {new Date(store.state.updated).toLocaleString('uz-UZ')}
          </Txt>
        ) : null}
      </Card>

      <Card>
        <Row gap={S.md}>
          <StarMark color={p.lojuvard} size={30} />
          <View style={{ flex: 1 }}>
            <Txt v="h2">Kundo</Txt>
            <Txt v="monoSm">versiya {version}</Txt>
          </View>
        </Row>
        <Txt v="small" style={{ marginTop: S.md }}>
          Kuningizni va xarajatlaringizni bir joyda tartibga soladigan oddiy daftar. Rang va naqshlar Buxoro
          koshinidan ilhomlangan.
        </Txt>
        <Pressable
          onPress={() => Linking.openURL('mailto:jaloldin@buxoro.online?subject=Kun%20Tartibi')}
          style={{ marginTop: S.md }}
        >
          <Txt v="small" color={p.lojuvard}>
            Taklif va xatolar haqida yozish
          </Txt>
        </Pressable>
      </Card>

      <Card style={{ borderColor: p.anor }}>
        <Txt v="label">Xavfli hudud</Txt>
        <Txt v="small" style={{ marginTop: S.sm }}>
          Ilovadagi barcha yozuvlarni o‘chirish.
        </Txt>
        <Btn label="Hammasini o‘chirish" tone="danger" style={{ marginTop: S.md }} onPress={doReset} />
      </Card>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={{ flex: 1 }}>
      <Txt v="mono">{value}</Txt>
      <Txt v="small">{label}</Txt>
    </View>
  );
}

export const styles = StyleSheet.create({});
