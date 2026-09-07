import * as Haptics from 'expo-haptics';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Sheet } from '../components/Sheet';
import { findCat, repeatLabel } from '../lib/catalog';
import {
  addDays,
  addMonths,
  longDate,
  monthLabel,
  thisMonth,
  today,
  wd,
  wdays,
  weekStart,
  wmin,
} from '../lib/date';
import { habitMonth, longestStreak, streak, useStore } from '../store';
import { F, R, S } from '../theme';
import { IconChevron, IconTrash } from '../ui/icons';
import { Btn, Card, Divider, Empty, Field, Row, Screen, Txt, usePal } from '../ui/kit';
import { useToast } from '../ui/toast';

export default function HabitsScreen() {
  const p = usePal();
  const store = useStore();
  const toast = useToast();
  const [ws, setWs] = useState(weekStart(today()));
  const [ym, setYm] = useState(thisMonth());
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(ws, i)), [ws]);
  const thisWeek = weekStart(today());
  const canNextWeek = ws < thisWeek;
  const canNextMonth = ym < thisMonth();
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
            <Row gap={S.sm}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Oldingi hafta"
                hitSlop={10}
                onPress={() => setWs(addDays(ws, -7))}
                style={navBtn(p, true)}
              >
                <IconChevron color={p.ink2} dir="left" />
              </Pressable>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Txt v="h3">{ws === thisWeek ? 'Shu hafta' : 'Hafta'}</Txt>
                <Txt v="monoSm">
                  {longDate(ws)} — {longDate(addDays(ws, 6))}
                </Txt>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Keyingi hafta"
                hitSlop={10}
                disabled={!canNextWeek}
                onPress={() => setWs(addDays(ws, 7))}
                style={navBtn(p, canNextWeek)}
              >
                <IconChevron color={canNextWeek ? p.ink2 : p.line2} dir="right" />
              </Pressable>
            </Row>
            {ws !== thisWeek ? (
              <Pressable onPress={() => setWs(thisWeek)} style={{ alignSelf: 'center', marginTop: 4 }}>
                <Txt v="small" color={p.lojuvard}>
                  Shu haftaga qaytish
                </Txt>
              </Pressable>
            ) : null}
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
                    // Kelasi kunni belgilab bo'lmaydi: u hali kelmagan.
                    const future = d > today();
                    return (
                      <Pressable
                        key={d}
                        accessibilityRole="button"
                        accessibilityState={{ checked: on, disabled: future }}
                        accessibilityLabel={`${h.name} — ${wdays()[wd(d)]}`}
                        disabled={future}
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
                          opacity: future ? 0.35 : 1,
                        }}
                      >
                        <Txt v="monoSm" color={on ? p.onAccent : p.muted} style={{ fontSize: 11 }}>
                          {wmin()[wd(d)]}
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
            <Row gap={S.sm}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Oldingi oy"
                hitSlop={10}
                onPress={() => setYm(addMonths(ym, -1))}
                style={navBtn(p, true)}
              >
                <IconChevron color={p.ink2} dir="left" />
              </Pressable>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Txt v="h3">Oylik dinamika</Txt>
                <Txt v="monoSm">{monthLabel(ym)}</Txt>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Keyingi oy"
                hitSlop={10}
                disabled={!canNextMonth}
                onPress={() => setYm(addMonths(ym, 1))}
                style={navBtn(p, canNextMonth)}
              >
                <IconChevron color={canNextMonth ? p.ink2 : p.line2} dir="right" />
              </Pressable>
            </Row>
          </View>
          <Divider />
          {store.state.habits.length ? (
            store.state.habits.map((h) => {
              const m = habitMonth(h, ym);
              const pct = m.counted ? Math.round((m.done / m.counted) * 100) : 0;
              return (
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
                    <Txt v="mono" color={pct >= 70 ? p.feruza : pct >= 40 ? p.oltin : p.muted}>
                      {pct}%
                    </Txt>
                  </Row>
                  {/* Oyning har kuni — bitta ustun. Belgilash haftalik jadvalda, bu yerda faqat ko'rinish. */}
                  <Row gap={2}>
                    {m.days.map((x) => (
                      <View
                        key={x.d}
                        style={{
                          flex: 1,
                          height: 22,
                          borderRadius: 3,
                          backgroundColor: x.on ? p.feruza : x.future ? 'transparent' : p.surface2,
                          borderWidth: x.future ? StyleSheet.hairlineWidth * 2 : 0,
                          borderColor: p.line,
                        }}
                      />
                    ))}
                  </Row>
                  <Txt v="small">
                    {m.done} / {m.counted} kun · eng uzun ketma-ketlik: {longestStreak(h)} kun
                  </Txt>
                </View>
              );
            })
          ) : (
            <Empty text="Odat qo'shsangiz, oy bo'ylab dinamikasi shu yerda chiziq bo'lib ko'rinadi." />
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
              const c = findCat(store.state.cats.task, r.cat);
              const rule = repeatLabel(r.rule);
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
                      {r.rule === 'hafta' ? ` · ${wdays()[r.wd]}` : ''}
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
