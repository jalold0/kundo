import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { t } from '../i18n';
import { today } from './date';
import type { AppState } from '../types';

/** Zaxira faylini yaratib, ulashish oynasini ochadi. */
export async function exportBackup(state: AppState): Promise<{ ok: boolean; message: string }> {
  try {
    const name = `kundo-zaxira-${today()}.json`;
    const file = new File(Paths.cache, name);
    if (file.exists) file.delete();
    file.create({ overwrite: true });
    file.write(JSON.stringify(state, null, 2));

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, {
        mimeType: 'application/json',
        dialogTitle: t('backup.saveDialog'),
        UTI: 'public.json',
      });
      return { ok: true, message: t('backup.ready') };
    }
    return { ok: true, message: t('backup.fileReady', { path: file.uri }) };
  } catch (e: any) {
    return { ok: false, message: `Zaxira yaratilmadi: ${e?.message ?? 'nomalum xato'}` };
  }
}

/** Foydalanuvchidan .json fayl so'raydi va uni o'qiydi. */
export async function pickBackup(): Promise<{
  ok: boolean;
  data?: AppState;
  message: string;
  /** Foydalanuvchi oynani yopgan — bu xato emas, xabar ko'rsatilmaydi. */
  canceled?: boolean;
}> {
  try {
    const res = await DocumentPicker.getDocumentAsync({
      type: ['application/json', 'text/plain', '*/*'],
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (res.canceled || !res.assets?.length) return { ok: false, canceled: true, message: '' };

    const asset = res.assets[0];
    const text = await new File(asset.uri).text();
    const data = JSON.parse(text);
    if (!data || (!Array.isArray(data.tasks) && !Array.isArray(data.entries))) {
      return { ok: false, message: t('backup.notOurs') };
    }
    return { ok: true, data, message: t('backup.fileRead') };
  } catch (e: any) {
    return { ok: false, message: t('backup.readFailed', { why: e?.message ?? t('backup.unknown') }) };
  }
}

/** Xarajatlarni CSV ko'rinishida ulashish (Excel uchun) */
export async function exportEntriesCsv(state: AppState): Promise<{ ok: boolean; message: string }> {
  try {
    const rows = [[t('csv.date'), t('csv.kind'), t('csv.cat'), t('csv.amount'), t('csv.note')]];
    [...state.entries]
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
      .forEach((e) => rows.push([e.date, e.kind, e.cat, String(e.amount), e.note ?? '']));

    const csv = '﻿' + rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const file = new File(Paths.cache, `xarajatlar-${today()}.csv`);
    if (file.exists) file.delete();
    file.create({ overwrite: true });
    file.write(csv);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, { mimeType: 'text/csv', dialogTitle: t('backup.csvDialog') });
      return { ok: true, message: t('backup.csvReady') };
    }
    return { ok: true, message: t('backup.fileReady', { path: file.uri }) };
  } catch (e: any) {
    return { ok: false, message: t('backup.csvFailed', { why: e?.message ?? t('backup.unknown') }) };
  }
}
