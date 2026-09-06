import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
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
        dialogTitle: 'Zaxira faylini saqlash',
        UTI: 'public.json',
      });
      return { ok: true, message: 'Zaxira tayyorlandi.' };
    }
    return { ok: true, message: `Fayl tayyor: ${file.uri}` };
  } catch (e: any) {
    return { ok: false, message: `Zaxira yaratilmadi: ${e?.message ?? 'nomalum xato'}` };
  }
}

/** Foydalanuvchidan .json fayl so'raydi va uni o'qiydi. */
export async function pickBackup(): Promise<{ ok: boolean; data?: AppState; message: string }> {
  try {
    const res = await DocumentPicker.getDocumentAsync({
      type: ['application/json', 'text/plain', '*/*'],
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (res.canceled || !res.assets?.length) return { ok: false, message: 'Bekor qilindi.' };

    const asset = res.assets[0];
    const text = await new File(asset.uri).text();
    const data = JSON.parse(text);
    if (!data || (!Array.isArray(data.tasks) && !Array.isArray(data.entries))) {
      return { ok: false, message: 'Bu Kundo zaxira fayliga o‘xshamaydi.' };
    }
    return { ok: true, data, message: 'Fayl o‘qildi.' };
  } catch (e: any) {
    return { ok: false, message: `Fayl o‘qilmadi: ${e?.message ?? 'nomalum xato'}` };
  }
}

/** Xarajatlarni CSV ko'rinishida ulashish (Excel uchun) */
export async function exportEntriesCsv(state: AppState): Promise<{ ok: boolean; message: string }> {
  try {
    const rows = [['sana', 'turi', 'yonalish', 'summa', 'izoh']];
    [...state.entries]
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
      .forEach((e) => rows.push([e.date, e.kind, e.cat, String(e.amount), e.note ?? '']));

    const csv = '﻿' + rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const file = new File(Paths.cache, `xarajatlar-${today()}.csv`);
    if (file.exists) file.delete();
    file.create({ overwrite: true });
    file.write(csv);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, { mimeType: 'text/csv', dialogTitle: 'Xarajatlar jadvali' });
      return { ok: true, message: 'CSV tayyorlandi.' };
    }
    return { ok: true, message: `Fayl tayyor: ${file.uri}` };
  } catch (e: any) {
    return { ok: false, message: `CSV yaratilmadi: ${e?.message ?? 'nomalum xato'}` };
  }
}
