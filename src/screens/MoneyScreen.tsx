import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import React, { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Sheet } from '../components/Sheet';
import { moneyCat, moneyCats } from '../lib/catalog';
import { addMonths, daysInMonth, longDate, monthLabel, monthOf, thisMonth, today } from '../lib/date';
import { fmt, fmtShort, maskAmount, parseAmount } from '../lib/money';
import { byCategory, dailyTotals, entriesInMonth, recentAmounts, sumBy, useStore } from '../store';
import { F, R, S } from '../theme';
import type { Entry, EntryKind } from '../types';
import { IconChevron, IconPlus, IconTrash } from '../ui/icons';
import { Bar, Btn, Card, Chip, Divider, Empty, Field, Row, Screen, Seg, Txt, usePal } from '../ui/kit';
import { useToast } from '../ui/toast';

type Draft = { kind: EntryKind; amount: string; cat: string; note: string; date: string };

const newDraft = (cat: string): Draft => ({ kind: 'chiqim', amount: '', cat, note: '', date: today() });

export default function MoneyScreen() {
  const p = usePal();
  const store = useStore();
  const { state } = store;
  const toast = useToast();
  const cur = store.state.settings.currency;
  const [ym, setYm] = useState(thisMonth());
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Draft>(() => newDraft(store.state.settings.lastSpendCat));
  const [pickingDate, setPickingDate] = useState(false);
  const [editing, setEditing] = useState<Entry | null>(null);
  const [budgeting, setBudgeting] = useState(false);
  const [budgetText, setBudgetText] = useState('');

  const list = useMemo(() => entriesInMonth(state, ym), [state, ym]);
  const spend = sumBy(list, 'chiqim');
  const income = sumBy(list, 'kirim');
  const balance = income - spend;
  const budget = store.state.budgets[ym] ?? 0;
  const left = budget - spend;

  const dim = daysInMonth(ym);
  const daily = useMemo(() => dailyTotals(list, ym, dim), [list, ym, dim]);
  const maxDaily = Math.max(1, ...daily);
  const cats = useMemo(() => byCategory(list, 'chiqim'), [list]);
  const recent = useMemo(() => recentAmounts(state, draft.kind), [state, draft.kind]);

  const prevYm = addMonths(ym, -1);
  const prevSpend = useMemo(() => sumBy(entriesInMonth(state, prevYm), 'chiqim'), [state, prevYm]);
  const delta = prevSpend > 0 ? Math.round(((spend - prevSpend) / prevSpend) * 100) : null;

  const isCurrent = ym === thisMonth();
  const dayNow = isCurrent ? Number(today().slice(8, 10)) : dim;
  const perDayLeft =
    budget && isCurrent && dim - dayNow >= 0 ? Math.max(0, left) / Math.max(1, dim - dayNow + 1) : 0;

  const grouped = useMemo(() => {
    const map = new Map<string, Entry[]>();
    [...list]
      .sort((a, b) => (a.date === b.date ? b.created - a.created : a.date < b.date ? 1 : -1))
      .forEach((e) => {
        const arr = map.get(e.date) ?? [];
        arr.push(e);
        map.set(e.date, arr);
      });
    return [...map.entries()];
  }, [list]);

  const lastCatFor = (kind: EntryKind) =>
    kind === 'kirim' ? store.state.settings.lastIncomeCat : store.state.settings.lastSpendCat;

  const openAdd = (kind: EntryKind = 'chiqim') => {
    const known = moneyCats(kind).some((c) => c.k === lastCatFor(kind));
    setDraft({
      kind,
      amount: '',
      cat: known ? lastCatFor(kind) : moneyCats(kind)[0].k,
      note: '',
      date: isCurrent ? today() : `${ym}-01`,
    });
    setAdding(true);
  };

  const submit = () => {
    const amount = parseAmount(draft.amount);
    if (amount <= 0) return;
    store.addEntry({
      kind: draft.kind,
      amount,
      cat: draft.cat,
      note: draft.note.trim() || undefined,
      date: draft.date,
    });
    store.setSettings(draft.kind === 'kirim' ? { lastIncomeCat: draft.cat } : { lastSpendCat: draft.cat });
    setAdding(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    toast.show(`${draft.kind === 'kirim' ? 'Kirim' : 'Chiqim'} yozildi: ${fmt(amount)} ${cur}`);
  };

  return (
    <>
      <Screen
        eyebrow="Xarajat"
        title={monthLabel(ym)}
        right={
          <Pressable
            onPress={() => openAdd('chiqim')}
            style={{
              width: 42,
              height: 42,
              borderRadius: R.md,
              backgroundColor: p.lojuvard,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconPlus color={p.onAccent} size={22} />
          </Pressable>
        }
      >
        <Card>
          <Row>
            <Pressable onPress={() => setYm(addMonths(ym, -1))} hitSlop={12} style={navBtn(p)}>
              <IconChevron color={p.ink2} dir="left" />
            </Pressable>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Txt v="label">{isCurrent ? 'joriy oy' : 'oy'}</Txt>
              {!isCurrent ? (
                <Pressable onPress={() => setYm(thisMonth())}>
                  <Txt v="small" color={p.lojuvard}>
                    Shu oyga qaytish
                  </Txt>
                </Pressable>
              ) : null}
            </View>
            <Pressable onPress={() => setYm(addMonths(ym, 1))} hitSlop={12} style={navBtn(p)}>
              <IconChevron color={p.ink2} dir="right" />
            </Pressable>
          </Row>

          <View style={{ marginTop: S.lg, gap: 3 }}>
            <Txt v="label">Oylik chiqim</Txt>
            <Row style={{ alignItems: 'baseline' }} gap={6}>
              <Txt style={{ fontFamily: F.display, fontSize: 34, color: p.ink }}>{fmt(spend)}</Txt>
              <Txt v="small">{cur}</Txt>
            </Row>
            {delta !== null ? (
              <Txt v="small" color={delta > 0 ? p.anor : delta < 0 ? p.feruza : p.muted}>
                {delta > 0 ? '↑' : delta < 0 ? '↓' : '='} o‘tgan oyga nisbatan {Math.abs(delta)}%{'  ·  '}
                {fmtShort(prevSpend)}
              </Txt>
            ) : null}
          </View>

          <Row gap={S.md} style={{ marginTop: S.md }}>
            <View style={{ flex: 1 }}>
              <Txt v="small">Kirim</Txt>
              <Txt v="mono" color={p.feruza}>
                {fmt(income)}
              </Txt>
            </View>
            <View style={{ flex: 1 }}>
              <Txt v="small">Farq</Txt>
              <Txt v="mono" color={balance >= 0 ? p.feruza : p.anor}>
                {balance >= 0 ? '+' : '−'}
                {fmt(Math.abs(balance))}
              </Txt>
            </View>
          </Row>

          <View style={{ marginTop: S.lg }}>
            <Divider />
          </View>

          {budget > 0 ? (
            <View style={{ marginTop: S.md, gap: S.sm }}>
              <Row>
                <Txt v="small" style={{ flex: 1 }}>
                  Oylik byudjet: {fmt(budget)} {cur}
                </Txt>
                <Pressable
                  onPress={() => {
                    setBudgetText(String(budget));
                    setBudgeting(true);
                  }}
                  hitSlop={10}
                >
                  <Txt v="small" color={p.lojuvard}>
                    o'zgartirish
                  </Txt>
                </Pressable>
              </Row>
              <Bar
                pct={spend / budget}
                tone={spend > budget ? p.anor : spend / budget > 0.85 ? p.oltin : p.feruza}
                height={8}
              />
              <Row>
                <Txt v="small" color={left >= 0 ? p.ink2 : p.anor} style={{ flex: 1 }}>
                  {left >= 0 ? `${fmt(left)} ${cur} qoldi` : `${fmt(-left)} ${cur} oshib ketdi`}
                </Txt>
                {perDayLeft > 0 ? <Txt v="small">kuniga ~{fmtShort(perDayLeft)}</Txt> : null}
              </Row>
            </View>
          ) : (
            <Row style={{ marginTop: S.md }}>
              <Txt v="small" style={{ flex: 1 }}>
                Bu oyga byudjet belgilanmagan.
              </Txt>
              <Btn
                label="Byudjet qo'yish"
                tone="ghost"
                small
                onPress={() => {
                  setBudgetText('');
                  setBudgeting(true);
                }}
              />
            </Row>
          )}
        </Card>

        <Row gap={S.sm}>
          <Btn label="Chiqim qo'shish" style={{ flex: 1 }} onPress={() => openAdd('chiqim')} />
          <Btn label="Kirim" tone="ghost" style={{ flex: 1 }} onPress={() => openAdd('kirim')} />
        </Row>

        {spend > 0 ? (
          <Card>
            <Txt v="label">Kunlik sarf</Txt>
            <Row gap={2} style={{ height: 62, alignItems: 'flex-end', marginTop: S.md }}>
              {daily.map((v, i) => (
                <View
                  key={i}
                  style={
                    v > 0
                      ? {
                          flex: 1,
                          height: `${Math.max(8, (v / maxDaily) * 100)}%`,
                          borderRadius: 2,
                          backgroundColor: isCurrent && i + 1 === dayNow ? p.lojuvard : p.feruza,
                        }
                      : { flex: 1, height: 2, borderRadius: 1, backgroundColor: p.line }
                  }
                />
              ))}
            </Row>
            <Row style={{ marginTop: 6 }}>
              <Txt v="monoSm" style={{ flex: 1, fontSize: 9.5 }}>
                1
              </Txt>
              <Txt v="monoSm" style={{ fontSize: 9.5 }}>
                eng ko'p: {fmtShort(maxDaily)}
              </Txt>
              <Txt v="monoSm" style={{ flex: 1, textAlign: 'right', fontSize: 9.5 }}>
                {dim}
              </Txt>
            </Row>
          </Card>
        ) : null}

        {cats.length ? (
          <Card>
            <Txt v="label">Yo'nalishlar bo'yicha</Txt>
            <View style={{ gap: S.md, marginTop: S.md }}>
              {cats.map((c) => {
                const meta = moneyCat('chiqim', c.cat);
                const tone = p[meta.tone] as string;
                return (
                  <View key={c.cat} style={{ gap: 5 }}>
                    <Row>
                      <Txt style={{ flex: 1, fontSize: 14 }}>{meta.uz}</Txt>
                      <Txt v="mono" style={{ fontSize: 13 }}>
                        {fmt(c.total)}
                      </Txt>
                      <Txt v="monoSm" style={{ width: 42, textAlign: 'right' }}>
                        {Math.round((c.total / spend) * 100)}%
                      </Txt>
                    </Row>
                    <Bar pct={c.total / spend} tone={tone} height={5} />
                  </View>
                );
              })}
            </View>
          </Card>
        ) : null}

        {grouped.length ? (
          grouped.map(([d, rows]) => (
            <Card key={d} pad={false}>
              <View style={{ padding: S.md, paddingHorizontal: S.lg, backgroundColor: p.surface2 }}>
                <Row>
                  <Txt v="h3" style={{ flex: 1 }}>
                    {d === today() ? 'Bugun' : longDate(d)}
                  </Txt>
                  <Txt v="monoSm">
                    {fmt(rows.reduce((a, e) => a + (e.kind === 'chiqim' ? e.amount : 0), 0))}
                  </Txt>
                </Row>
              </View>
              <Divider />
              {rows.map((e) => {
                const meta = moneyCat(e.kind, e.cat);
                const tone = e.kind === 'kirim' ? p.feruza : (p[meta.tone] as string);
                return (
                  <Pressable
                    key={e.id}
                    onPress={() => setEditing(e)}
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: S.md,
                      paddingVertical: 12,
                      paddingHorizontal: S.lg,
                      borderBottomWidth: StyleSheet.hairlineWidth * 2,
                      borderBottomColor: p.line,
                      backgroundColor: pressed ? p.surface2 : 'transparent',
                    })}
                  >
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 2,
                        backgroundColor: tone,
                        transform: [{ rotate: '45deg' }],
                      }}
                    />
                    <View style={{ flex: 1 }}>
                      <Txt style={{ fontSize: 14.5 }}>{meta.uz}</Txt>
                      {e.note ? (
                        <Txt v="small" numberOfLines={1}>
                          {e.note}
                        </Txt>
                      ) : null}
                    </View>
                    <Txt v="mono" color={e.kind === 'kirim' ? p.feruza : p.ink}>
                      {e.kind === 'kirim' ? '+' : '−'}
                      {fmt(e.amount)}
                    </Txt>
                  </Pressable>
                );
              })}
            </Card>
          ))
        ) : (
          <Empty text="Bu oyda hali yozuv yo'q. Yuqoridagi «+» tugmasi bilan birinchi xarajatni qo'shing." />
        )}
      </Screen>

      {/* qo'shish */}
      <Sheet
        visible={adding}
        onClose={() => setAdding(false)}
        title={draft.kind === 'kirim' ? 'Kirim qo’shish' : 'Chiqim qo’shish'}
        footer={<Btn label="Saqlash" onPress={submit} disabled={parseAmount(draft.amount) <= 0} />}
      >
        <Seg
          value={draft.kind}
          options={[
            { k: 'chiqim' as EntryKind, uz: 'Chiqim' },
            { k: 'kirim' as EntryKind, uz: 'Kirim' },
          ]}
          onChange={(k) => setDraft({ ...draft, kind: k, cat: moneyCats(k)[0].k })}
        />

        <View style={{ gap: S.sm }}>
          <Txt v="label">Summa ({cur})</Txt>
          <Field
            value={draft.amount}
            onChangeText={(v) => setDraft({ ...draft, amount: maskAmount(v) })}
            placeholder="0"
            keyboardType="numeric"
            autoFocus
            align="right"
            style={{ fontFamily: F.display, fontSize: 30, paddingVertical: 14 }}
          />
          <Row gap={S.sm} style={{ flexWrap: 'wrap' }}>
            {recent.length
              ? recent.map((q) => (
                  <Chip key={`r${q}`} label={fmt(q)} onPress={() => setDraft({ ...draft, amount: fmt(q) })} />
                ))
              : [10000, 50000, 100000, 500000].map((q) => (
                  <Chip
                    key={q}
                    label={`+${fmtShort(q)}`}
                    onPress={() => setDraft({ ...draft, amount: fmt(parseAmount(draft.amount) + q) })}
                  />
                ))}
          </Row>
        </View>

        <View style={{ gap: S.sm }}>
          <Txt v="label">Yo'nalish</Txt>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: S.sm }}>
            {moneyCats(draft.kind).map((c) => (
              <Chip
                key={c.k}
                label={c.uz}
                active={draft.cat === c.k}
                tone={p[c.tone] as string}
                onPress={() => setDraft({ ...draft, cat: c.k })}
              />
            ))}
          </View>
        </View>

        <View style={{ gap: S.sm }}>
          <Txt v="label">Sana</Txt>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: S.sm }}>
            {lastDays(8, ym).map((d) => (
              <Chip
                key={d}
                label={d === today() ? 'Bugun' : longDate(d)}
                active={draft.date === d}
                onPress={() => setDraft({ ...draft, date: d })}
              />
            ))}
            <Chip
              label={lastDays(8, ym).includes(draft.date) ? 'Boshqa sana…' : longDate(draft.date)}
              active={!lastDays(8, ym).includes(draft.date)}
              onPress={() => setPickingDate(true)}
            />
          </ScrollView>
          {pickingDate ? (
            <DateTimePicker
              value={new Date(draft.date)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date()}
              onChange={(event, d) => {
                setPickingDate(
                  Platform.OS === 'ios' ? event.type !== 'set' && event.type !== 'dismissed' : false,
                );
                if (event.type === 'set' && d) {
                  const y = d.getFullYear();
                  const m = String(d.getMonth() + 1).padStart(2, '0');
                  const dd = String(d.getDate()).padStart(2, '0');
                  setDraft({ ...draft, date: `${y}-${m}-${dd}` });
                }
              }}
            />
          ) : null}
        </View>

        <View style={{ gap: S.sm }}>
          <Txt v="label">Izoh (ixtiyoriy)</Txt>
          <Field
            value={draft.note}
            onChangeText={(v) => setDraft({ ...draft, note: v })}
            placeholder="masalan: bozordan"
          />
        </View>
      </Sheet>

      {/* tahrirlash */}
      <Sheet
        visible={!!editing}
        onClose={() => setEditing(null)}
        title="Yozuv"
        footer={
          <Btn
            label="O‘chirish"
            tone="danger"
            onPress={() => {
              if (!editing) return;
              const amount = editing.amount;
              store.removeEntry(editing.id);
              setEditing(null);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
              toast.show(`${fmt(amount)} ${cur} o‘chirildi`, { undo: store.undo });
            }}
          />
        }
      >
        {editing ? (
          <Card>
            <Row>
              <Txt v="small" style={{ flex: 1 }}>
                {editing.kind === 'kirim' ? 'Kirim' : 'Chiqim'}
              </Txt>
              <Txt v="monoSm">{editing.date}</Txt>
            </Row>
            <Txt v="h1" style={{ marginTop: 6 }}>
              {fmt(editing.amount)} {cur}
            </Txt>
            <Txt v="small" style={{ marginTop: 4 }}>
              {moneyCat(editing.kind, editing.cat).uz}
            </Txt>
            {editing.note ? <Txt style={{ marginTop: S.sm }}>{editing.note}</Txt> : null}
          </Card>
        ) : null}
        <Row gap={S.sm}>
          <IconTrash color={p.muted} size={15} />
          <Txt v="small" style={{ flex: 1 }}>
            Yozuvni o'chirsangiz, oylik hisob-kitob darhol yangilanadi.
          </Txt>
        </Row>
      </Sheet>

      {/* byudjet */}
      <Sheet
        visible={budgeting}
        onClose={() => setBudgeting(false)}
        title={`${monthLabel(ym)} byudjeti`}
        footer={
          <>
            <Btn
              label="Saqlash"
              onPress={() => {
                store.setBudget(ym, parseAmount(budgetText));
                setBudgeting(false);
              }}
            />
            {budget > 0 ? (
              <Btn
                label="Byudjetni olib tashlash"
                tone="ghost"
                onPress={() => {
                  store.setBudget(ym, 0);
                  setBudgeting(false);
                }}
              />
            ) : null}
          </>
        }
      >
        <Txt v="small">
          Oyiga qancha sarflashni rejalashtirgansiz? Ilova qolgan mablag'ni va kuniga qancha sarflash
          mumkinligini o'zi hisoblab boradi.
        </Txt>
        <Field
          value={budgetText}
          onChangeText={(v) => setBudgetText(maskAmount(v))}
          placeholder="0"
          keyboardType="numeric"
          align="right"
          autoFocus
          style={{ fontFamily: F.display, fontSize: 28, paddingVertical: 14 }}
        />
        <Row gap={S.sm} style={{ flexWrap: 'wrap' }}>
          {[2000000, 3000000, 5000000, 8000000].map((q) => (
            <Chip key={q} label={fmtShort(q)} onPress={() => setBudgetText(fmt(q))} />
          ))}
        </Row>
      </Sheet>
    </>
  );
}

function lastDays(n: number, ym: string): string[] {
  const out: string[] = [];
  const base = monthOf(today()) === ym ? today() : `${ym}-${String(daysInMonth(ym)).padStart(2, '0')}`;
  const d = new Date(
    base.slice(0, 4) as unknown as number,
    Number(base.slice(5, 7)) - 1,
    Number(base.slice(8, 10)),
  );
  for (let i = 0; i < n; i++) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    out.push(`${y}-${m}-${dd}`);
    d.setDate(d.getDate() - 1);
  }
  return out;
}

function navBtn(p: ReturnType<typeof usePal>) {
  return {
    width: 34,
    height: 34,
    borderRadius: R.sm,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: p.line,
    backgroundColor: p.surface2,
  };
}
