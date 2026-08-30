import * as Haptics from 'expo-haptics';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Sheet } from '../components/Sheet';
import { REPEAT_RULES, taskCat } from '../lib/catalog';
import { WDAYS, WMIN, addDays, longDate, today, wd, weekStart } from '../lib/date';
import { streak, useStore } from '../store';
import { F, R, S } from '../theme';
import { IconTrash } from '../ui/icons';
import { Btn, Card, Divider, Empty, Field, Row, Screen, Txt, usePal } from '../ui/kit';
import { useToast } from '../ui/toast';

export default function HabitsScreen() {
  const p = usePal();
  const store = useStore();
  const toast = useToast();
  const ws = weekStart(today());
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(ws, i)), [ws]);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');

  const submit = () => {
    const v = name.trim();
    if (!v) return;
    store.addHabit(v);
    setName('');
    setAdding(false);
  };

  return (
    <>
      <Screen
        eyebrow="Odatlar va takrorlar"
        title="Izchillik"
        right={<Btn label="Odat qo'shish" tone="ghost" small onPress={() => setAdding(true)} />}
      >
        <Card pad={false}>
          <View style={{ padding: S.md, paddingHorizontal: S.lg, backgroundColor: p.surface2 }}>
            <Row>
              <Txt v="h3" style={{ flex: 1 }}>
                Shu hafta
              </Txt>
              <Txt v="monoSm">
                {longDate(ws)} — {longDate(addDays(ws, 6))}
              </Txt>
            </Row>
          </View>
          <Divider />
          {store.state.habits.length ? (
            store.state.habits.map((h) => (
              <View
                key={h.id}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: S.lg,
                  gap: S.sm,
                  borderBottomWidth: StyleSheet.hairlineWidth * 2,
                  borderBottomColor: p.line,
                }}
              >
                <Row gap={S.md}>
                  <Txt style={{ flex: 1, fontFamily: F.bodyMed }} numberOfLines={1}>
                    {h.name}
                  </Txt>
                  <Row gap={4}>
                    <Txt v="mono" color={p.feruza}>
                      {streak(h)}
                    </Txt>
                    <Txt v="small">kun ketma-ket</Txt>
                  </Row>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${h.name} odatini o'chirish`}
                    hitSlop={12}
                    onPress={() => {
                      store.removeHabit(h.id);
                      toast.show(`«${h.name}» o‘chirildi`, { undo: store.undo });
                    }}
                  >
                    <IconTrash color={p.muted} size={16} />
                  </Pressable>
                </Row>
                <Row gap={6}>
                  {days.map((d) => {
                    const on = !!h.days[d];
                    const isToday = d === today();
                    return (
                      <Pressable
                        key={d}
                        accessibilityRole="button"
                        accessibilityLabel={`${h.name} — ${WDAYS[wd(d)]}`}
                        onPress={() => {
                          Haptics.selectionAsync().catch(() => {});
                          store.toggleHabit(h.id, d);
                        }}
                        style={{
                          flex: 1,
                          height: 38,
                          borderRadius: R.sm,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: isToday ? 2 : StyleSheet.hairlineWidth * 2,
                          borderColor: on ? p.feruza : isToday ? p.feruza : p.line2,
                          backgroundColor: on ? p.feruza : 'transparent',
                        }}
                      >
                        <Txt v="monoSm" color={on ? p.onAccent : p.muted} style={{ fontSize: 11 }}>
                          {WMIN[wd(d)]}
                        </Txt>
                      </Pressable>
                    );
                  })}
                </Row>
              </View>
            ))
          ) : (
            <Empty text="Odat qo'shsangiz, har kuni bir bosish bilan belgilab borasiz — ketma-ket kunlar hisoblanadi." />
          )}
        </Card>

        <Card pad={false}>
          <View style={{ padding: S.md, paddingHorizontal: S.lg, backgroundColor: p.surface2 }}>
            <Row>
              <Txt v="h3" style={{ flex: 1 }}>
                Takrorlanuvchi vazifalar
              </Txt>
              <Txt v="monoSm">{store.state.repeats.length}</Txt>
            </Row>
          </View>
          <Divider />
          {store.state.repeats.length ? (
            store.state.repeats.map((r) => {
              const c = taskCat(r.cat);
              const rule = REPEAT_RULES.find((x) => x.k === r.rule)?.uz ?? '';
              return (
                <Row
                  key={r.id}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: S.lg,
                    borderBottomWidth: StyleSheet.hairlineWidth * 2,
                    borderBottomColor: p.line,
                  }}
                >
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      backgroundColor: p[c.tone] as string,
                      transform: [{ rotate: '45deg' }],
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Txt numberOfLines={1}>{r.title}</Txt>
                    <Txt v="small">
                      {rule}
                      {r.rule === 'hafta' ? ` · ${WDAYS[r.wd]}` : ''}
                      {r.time ? ` · ${r.time}` : ''}
                    </Txt>
                  </View>
                  <Btn
                    label="To‘xtatish"
                    tone="ghost"
                    small
                    onPress={() => {
                      store.removeRepeat(r.id);
                      toast.show('Takrorlash to‘xtatildi', { undo: store.undo });
                    }}
                  />
                </Row>
              );
            })
          ) : (
            <Empty text="Vazifa qo'shayotganda «Har kuni» yoki «Ish kunlari» ni tanlasangiz, shu yerda ko'rinadi." />
          )}
        </Card>
      </Screen>

      <Sheet
        visible={adding}
        onClose={() => setAdding(false)}
        title="Yangi odat"
        footer={<Btn label="Qo‘shish" onPress={submit} disabled={!name.trim()} />}
      >
        <Txt v="small">
          Har kuni takrorlanadigan kichik ish — masalan, ertalabki yurish yoki 30 daqiqa kitob.
        </Txt>
        <Field
          value={name}
          onChangeText={setName}
          placeholder="Odat nomi…"
          autoFocus
          onSubmitEditing={submit}
        />
      </Sheet>
    </>
  );
}
