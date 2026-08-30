import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, View } from 'react-native';
import { BLOCKS, CATS, PRIS, REPEAT_RULES, taskCat } from '../lib/catalog';
import { S } from '../theme';
import type { BlockKey, CatKey, Pri, RepeatRule } from '../types';
import { Chip, Field, Row, Txt, usePal } from '../ui/kit';

export type TaskDraft = {
  title: string;
  cat: CatKey;
  pri: Pri;
  block: BlockKey;
  time: string;
  repeat: RepeatRule | '';
};

export const emptyDraft = (): TaskDraft => ({
  title: '',
  cat: 'ish',
  pri: 3,
  block: 'ertalab',
  time: '',
  repeat: '',
});

export function TaskForm({
  draft,
  set,
  showRepeat = true,
  autoFocus,
}: {
  draft: TaskDraft;
  set: (d: TaskDraft) => void;
  showRepeat?: boolean;
  autoFocus?: boolean;
}) {
  const p = usePal();
  const [picking, setPicking] = useState(false);

  const timeAsDate = () => {
    const d = new Date();
    if (draft.time) {
      const [h, m] = draft.time.split(':').map(Number);
      d.setHours(h, m, 0, 0);
    } else {
      d.setHours(9, 0, 0, 0);
    }
    return d;
  };

  return (
    <View style={{ gap: S.md }}>
      <Field
        value={draft.title}
        onChangeText={(v) => set({ ...draft, title: v })}
        placeholder="Vazifa nomi…"
        autoFocus={autoFocus}
      />

      <View style={{ gap: S.sm }}>
        <Txt v="label">Yo'nalish</Txt>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: S.sm }}>
          {CATS.map((c) => (
            <Chip
              key={c.k}
              label={c.uz}
              active={draft.cat === c.k}
              tone={p[c.tone] as string}
              onPress={() => set({ ...draft, cat: c.k })}
            />
          ))}
        </ScrollView>
      </View>

      <View style={{ gap: S.sm }}>
        <Txt v="label">Ustuvorlik</Txt>
        <Row gap={S.sm}>
          {PRIS.map((x) => (
            <Chip
              key={x.k}
              label={x.uz}
              active={draft.pri === x.k}
              tone={x.tone ? (p[x.tone] as string) : undefined}
              onPress={() => set({ ...draft, pri: x.k })}
            />
          ))}
        </Row>
      </View>

      <View style={{ gap: S.sm }}>
        <Txt v="label">Kun qismi va vaqt</Txt>
        <Row gap={S.sm} style={{ flexWrap: 'wrap' }}>
          {BLOCKS.map((b) => (
            <Chip
              key={b.k}
              label={b.uz}
              active={draft.block === b.k}
              onPress={() => set({ ...draft, block: b.k })}
            />
          ))}
          <Pressable
            onPress={() => setPicking(true)}
            style={{
              paddingVertical: 7,
              paddingHorizontal: 12,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: draft.time ? p.feruza : p.line,
              backgroundColor: draft.time ? p.feruzaSoft : p.surface,
            }}
          >
            <Txt v="mono" color={draft.time ? p.feruza : p.muted} style={{ fontSize: 13 }}>
              {draft.time || '--:--'}
            </Txt>
          </Pressable>
          {draft.time ? (
            <Chip label="vaqtni olib tashlash" onPress={() => set({ ...draft, time: '' })} />
          ) : null}
        </Row>
      </View>

      {showRepeat ? (
        <View style={{ gap: S.sm }}>
          <Txt v="label">Takrorlash</Txt>
          <Row gap={S.sm} style={{ flexWrap: 'wrap' }}>
            {REPEAT_RULES.map((r) => (
              <Chip
                key={r.k || 'bir'}
                label={r.uz}
                active={draft.repeat === r.k}
                onPress={() => set({ ...draft, repeat: r.k as RepeatRule | '' })}
              />
            ))}
          </Row>
        </View>
      ) : null}

      {picking ? (
        <DateTimePicker
          value={timeAsDate()}
          mode="time"
          is24Hour
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            setPicking(Platform.OS === 'ios' ? event.type !== 'set' && event.type !== 'dismissed' : false);
            if (event.type === 'set' && date) {
              const hh = String(date.getHours()).padStart(2, '0');
              const mm = String(date.getMinutes()).padStart(2, '0');
              set({ ...draft, time: `${hh}:${mm}` });
            }
          }}
        />
      ) : null}
    </View>
  );
}

export function catTone(p: ReturnType<typeof usePal>, k: CatKey) {
  return p[taskCat(k).tone] as string;
}
