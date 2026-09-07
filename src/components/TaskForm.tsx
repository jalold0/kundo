import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { BLOCKS, PRIS, REPEAT_RULES, blockLabel, priLabel, repeatLabel } from '../lib/catalog';
import { useStore } from '../store';
import { t } from '../i18n';
import { S } from '../theme';
import type { BlockKey, Pri, RepeatRule } from '../types';
import { Chip, Field, Row, Txt, usePal } from '../ui/kit';
import { TimePanel } from './pickers';

export type TaskDraft = {
  title: string;
  cat: string;
  pri: Pri;
  block: BlockKey;
  time: string;
  repeat: RepeatRule | '';
};

/** `cat` — sozlamalardagi yo'nalishlardan biri; qotib yozilgan qiymat yo'q. */
export const emptyDraft = (cat: string): TaskDraft => ({
  title: '',
  cat,
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
  const cats = useStore().state.cats.task;
  const [picking, setPicking] = useState(false);

  return (
    <View style={{ gap: S.md }}>
      <Field
        value={draft.title}
        onChangeText={(v) => set({ ...draft, title: v })}
        placeholder={t('form.titlePlaceholder')}
        autoFocus={autoFocus}
      />

      <View style={{ gap: S.sm }}>
        <Txt v="label">{t('form.cat')}</Txt>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: S.sm }}>
          {cats.map((c) => (
            <Chip
              key={c.k}
              label={c.label}
              active={draft.cat === c.k}
              tone={p[c.tone] as string}
              onPress={() => set({ ...draft, cat: c.k })}
            />
          ))}
        </ScrollView>
      </View>

      <View style={{ gap: S.sm }}>
        <Txt v="label">{t('form.pri')}</Txt>
        <Row gap={S.sm}>
          {PRIS.map((x) => (
            <Chip
              key={x.k}
              label={priLabel(x.k)}
              active={draft.pri === x.k}
              tone={x.tone ? (p[x.tone] as string) : undefined}
              onPress={() => set({ ...draft, pri: x.k })}
            />
          ))}
        </Row>
      </View>

      <View style={{ gap: S.sm }}>
        <Txt v="label">{t('form.blockAndTime')}</Txt>
        <Row gap={S.sm} style={{ flexWrap: 'wrap' }}>
          {BLOCKS.map((b) => (
            <Chip
              key={b.k}
              label={blockLabel(b.k)}
              active={draft.block === b.k}
              onPress={() => set({ ...draft, block: b.k })}
            />
          ))}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={draft.time ? t('form.changeTime', { time: draft.time }) : t('form.setTime')}
            onPress={() => setPicking(!picking)}
            style={{
              paddingVertical: 7,
              paddingHorizontal: 12,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: picking || draft.time ? p.feruza : p.line,
              backgroundColor: picking || draft.time ? p.feruzaSoft : p.surface,
            }}
          >
            <Txt v="mono" color={draft.time ? p.feruza : p.muted} style={{ fontSize: 13 }}>
              {draft.time || '--:--'}
            </Txt>
          </Pressable>
          {draft.time ? (
            <Chip
              label={t('form.clearTime')}
              onPress={() => {
                set({ ...draft, time: '' });
                setPicking(false);
              }}
            />
          ) : null}
        </Row>
        {picking ? <TimePanel value={draft.time} onChange={(t) => set({ ...draft, time: t })} /> : null}
      </View>

      {showRepeat ? (
        <View style={{ gap: S.sm }}>
          <Txt v="label">{t('form.repeat')}</Txt>
          <Row gap={S.sm} style={{ flexWrap: 'wrap' }}>
            {REPEAT_RULES.map((r) => (
              <Chip
                key={r.k || 'bir'}
                label={repeatLabel(r.k)}
                active={draft.repeat === r.k}
                onPress={() => set({ ...draft, repeat: r.k as RepeatRule | '' })}
              />
            ))}
          </Row>
        </View>
      ) : null}
    </View>
  );
}
