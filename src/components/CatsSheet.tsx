import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { tones } from '../lib/catalog';
import { t } from '../i18n';
import { catUsage, useStore } from '../store';
import { R, S } from '../theme';
import type { CatKind, ToneKey } from '../types';
import { IconCheck, IconTrash } from '../ui/icons';
import { Btn, Chip, Divider, Field, Row, Txt, usePal } from '../ui/kit';
import { useToast } from '../ui/toast';
import { Sheet } from './Sheet';

/**
 * Yo'nalishlarni boshqarish: qo'shish, nomini va rangini o'zgartirish, o'chirish.
 *
 * O'chirishda yozuvlar yo'qolmaydi — ular boshqa yo'nalishga ko'chiriladi, chunki
 * yo'nalish yozuvning bir maydoni, yozuvning o'zi emas. Oxirgi yo'nalish o'chmaydi.
 */
export function CatsSheet({
  visible,
  onClose,
  kind,
  title,
  hint,
}: {
  visible: boolean;
  onClose: () => void;
  kind: CatKind;
  title: string;
  hint: string;
}) {
  const p = usePal();
  const store = useStore();
  const toast = useToast();
  const list = store.state.cats[kind];

  const [editing, setEditing] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [tone, setTone] = useState<ToneKey>('lojuvard');
  const [moveTo, setMoveTo] = useState('');
  const [newName, setNewName] = useState('');
  const [newTone, setNewTone] = useState<ToneKey>('lojuvard');
  const [err, setErr] = useState('');

  const reset = () => {
    setEditing(null);
    setDeleting(null);
    setErr('');
  };

  const close = () => {
    reset();
    setNewName('');
    onClose();
  };

  const taken = (v: string, exceptKey?: string) =>
    list.some((c) => c.k !== exceptKey && c.label.toLowerCase() === v.trim().toLowerCase());

  const startEdit = (k: string) => {
    const c = list.find((x) => x.k === k);
    if (!c) return;
    setDeleting(null);
    setErr('');
    setEditing(k);
    setName(c.label);
    setTone(c.tone);
  };

  const saveEdit = () => {
    const v = name.trim();
    if (!v) return setErr(t('cats.emptyName'));
    if (taken(v, editing ?? undefined)) return setErr(t('cats.duplicate'));
    store.updateCat(kind, editing!, { label: v, tone });
    reset();
  };

  const startDelete = (k: string) => {
    setEditing(null);
    setErr('');
    setDeleting(k);
    setMoveTo(list.find((c) => c.k !== k)?.k ?? '');
  };

  const confirmDelete = () => {
    const k = deleting!;
    const n = catUsage(store.state, kind, k);
    store.removeCat(kind, k, moveTo);
    reset();
    toast.show(n > 0 ? t('cats.deletedMoved', { n }) : t('cats.deleted'), {
      undo: store.undo,
    });
  };

  const add = () => {
    const v = newName.trim();
    if (!v) return setErr(t('cats.emptyName'));
    if (taken(v)) return setErr(t('cats.duplicate'));
    store.addCat(kind, v, newTone);
    setNewName('');
    setErr('');
  };

  return (
    <Sheet visible={visible} onClose={close} title={title}>
      <Txt v="small">{hint}</Txt>

      <View>
        {list.map((c, i) => {
          const n = catUsage(store.state, kind, c.k);
          const last = list.length <= 1;
          return (
            <View key={c.k}>
              {i > 0 ? <Divider /> : null}
              <Row style={{ paddingVertical: S.md }} gap={S.md}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    backgroundColor: p[c.tone] as string,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Txt v="h3">{c.label}</Txt>
                  <Txt v="small">{n > 0 ? t('cats.usage', { n }) : t('cats.unused')}</Txt>
                </View>
                <Pressable onPress={() => startEdit(c.k)} hitSlop={8} accessibilityRole="button">
                  <Txt v="small" color={p.lojuvard}>
                    {t('common.edit')}
                  </Txt>
                </Pressable>
                <Pressable
                  onPress={() => startDelete(c.k)}
                  disabled={last}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={t('cats.deleteA11y', { name: c.label })}
                  style={{ opacity: last ? 0.3 : 1 }}
                >
                  <IconTrash color={p.anor} size={17} />
                </Pressable>
              </Row>

              {editing === c.k ? (
                <View style={panel(p)}>
                  <Field
                    value={name}
                    onChangeText={setName}
                    placeholder={t('cats.namePlaceholder')}
                    autoFocus
                  />
                  <Tones value={tone} onChange={setTone} />
                  {err ? (
                    <Txt v="small" color={p.anor}>
                      {err}
                    </Txt>
                  ) : null}
                  <Row gap={S.sm}>
                    <Btn label={t('common.save')} small onPress={saveEdit} style={{ flex: 1 }} />
                    <Btn label={t('common.cancel')} small tone="ghost" onPress={reset} style={{ flex: 1 }} />
                  </Row>
                </View>
              ) : null}

              {deleting === c.k ? (
                <View style={panel(p)}>
                  {n > 0 ? (
                    <>
                      <Txt v="small">{t('cats.moveAsk', { n })}</Txt>
                      <Row gap={S.sm} style={{ flexWrap: 'wrap' }}>
                        {list
                          .filter((x) => x.k !== c.k)
                          .map((x) => (
                            <Chip
                              key={x.k}
                              label={x.label}
                              active={moveTo === x.k}
                              tone={p[x.tone] as string}
                              onPress={() => setMoveTo(x.k)}
                            />
                          ))}
                      </Row>
                    </>
                  ) : (
                    <Txt v="small">{t('cats.deleteFree')}</Txt>
                  )}
                  <Row gap={S.sm}>
                    <Btn
                      label={t('common.delete')}
                      small
                      tone="danger"
                      onPress={confirmDelete}
                      style={{ flex: 1 }}
                    />
                    <Btn label={t('common.cancel')} small tone="ghost" onPress={reset} style={{ flex: 1 }} />
                  </Row>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>

      <Divider />

      <View style={{ gap: S.sm }}>
        <Txt v="label">{t('cats.newTitle')}</Txt>
        <Field value={newName} onChangeText={setNewName} placeholder={t('cats.newPlaceholder')} />
        <Tones value={newTone} onChange={setNewTone} />
        {err && !editing && !deleting ? (
          <Txt v="small" color={p.anor}>
            {err}
          </Txt>
        ) : null}
        <Btn label={t('common.add')} tone="ghost" onPress={add} />
      </View>
    </Sheet>
  );
}

/** Rang tanlash — nomi emas, o'zi ko'rinadi. */
function Tones({ value, onChange }: { value: ToneKey; onChange: (t: ToneKey) => void }) {
  const p = usePal();
  return (
    <Row gap={S.sm}>
      {tones().map((x) => {
        const on = x.k === value;
        return (
          <Pressable
            key={x.k}
            onPress={() => onChange(x.k)}
            accessibilityRole="button"
            accessibilityLabel={x.label}
            accessibilityState={{ selected: on }}
            style={{
              width: 32,
              height: 32,
              borderRadius: R.sm,
              backgroundColor: p[x.k] as string,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: on ? 2.5 : 0,
              borderColor: p.ink,
            }}
          >
            {on ? <IconCheck color={p.onAccent} size={14} /> : null}
          </Pressable>
        );
      })}
    </Row>
  );
}

function panel(p: ReturnType<typeof usePal>) {
  return {
    gap: S.sm,
    padding: S.md,
    marginBottom: S.md,
    borderRadius: R.md,
    backgroundColor: p.surface2,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: p.line,
  };
}
