import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { TaskRow } from '../components/TaskRow';
import { WSHORT, addDays, longDate, parseISO, today, wd, weekStart } from '../lib/date';
import { sortTasks, tasksOn, useStore } from '../store';
import { F, R, S } from '../theme';
import { Bar, Card, Divider, Empty, Row, Screen, Txt, usePal } from '../ui/kit';
import { IconChevron } from '../ui/icons';

export default function WeekScreen() {
  const p = usePal();
  const store = useStore();
  const { state } = store;
  const [anchor, setAnchor] = useState(weekStart(today()));
  const [picked, setPicked] = useState<string | null>(null);

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(anchor, i)), [anchor]);

  const perDay = useMemo(
    () =>
      days.map((d) => {
        const list = tasksOn(state, d);
        return { d, list, done: list.filter((t) => t.done).length };
      }),
    [days, state],
  );

  const total = perDay.reduce((a, x) => a + x.list.length, 0);
  const tdone = perDay.reduce((a, x) => a + x.done, 0);
  const open = total - tdone;

  const cats = store.state.cats.task;
  const topCat = useMemo(() => {
    let best = { uz: '—', n: 0, tone: p.ink };
    cats.forEach((c) => {
      const n = perDay.reduce((a, x) => a + x.list.filter((t) => t.cat === c.k).length, 0);
      if (n > best.n) best = { uz: c.uz, n, tone: p[c.tone] as string };
    });
    return best;
  }, [perDay, p, cats]);

  const shown = picked ? perDay.filter((x) => x.d === picked) : perDay;

  return (
    <Screen eyebrow="Hafta" title="Haftalik ko'rinish">
      <Card>
        <Row>
          <Pressable
            onPress={() => {
              setAnchor(addDays(anchor, -7));
              setPicked(null);
            }}
            hitSlop={12}
            style={navBtn(p)}
          >
            <IconChevron color={p.ink2} dir="left" />
          </Pressable>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Txt v="h2">
              {longDate(anchor)} — {longDate(addDays(anchor, 6))}
            </Txt>
            {anchor !== weekStart(today()) ? (
              <Pressable
                onPress={() => {
                  setAnchor(weekStart(today()));
                  setPicked(null);
                }}
              >
                <Txt v="small" color={p.lojuvard}>
                  Shu haftaga qaytish
                </Txt>
              </Pressable>
            ) : (
              <Txt v="monoSm">joriy hafta</Txt>
            )}
          </View>
          <Pressable
            onPress={() => {
              setAnchor(addDays(anchor, 7));
              setPicked(null);
            }}
            hitSlop={12}
            style={navBtn(p)}
          >
            <IconChevron color={p.ink2} dir="right" />
          </Pressable>
        </Row>

        <Row gap={6} style={{ marginTop: S.lg }}>
          {perDay.map((x) => {
            const isToday = x.d === today();
            const on = picked === x.d;
            return (
              <Pressable
                key={x.d}
                onPress={() => setPicked(on ? null : x.d)}
                style={{
                  flex: 1,
                  gap: 7,
                  paddingVertical: 9,
                  paddingHorizontal: 4,
                  borderRadius: R.sm,
                  borderWidth: StyleSheet.hairlineWidth * 2,
                  borderColor: on ? p.lojuvard : p.line,
                  backgroundColor: on ? p.lojuvardSoft : p.surface2,
                  alignItems: 'center',
                }}
              >
                <Txt v="monoSm" color={wd(x.d) === 0 ? p.anor : p.muted} style={{ fontSize: 9.5 }}>
                  {WSHORT[wd(x.d)]}
                </Txt>
                <Txt style={{ fontFamily: F.display, fontSize: 19, color: isToday ? p.lojuvard : p.ink }}>
                  {parseISO(x.d).getDate()}
                </Txt>
                <View style={{ width: '100%' }}>
                  <Bar pct={x.list.length ? x.done / x.list.length : 0} height={4} />
                </View>
                <Txt v="monoSm" style={{ fontSize: 9.5 }}>
                  {x.done}/{x.list.length}
                </Txt>
              </Pressable>
            );
          })}
        </Row>
      </Card>

      <Row gap={S.sm}>
        <Stat value={String(total)} label="jami vazifa" />
        <Stat value={String(tdone)} label="bajarilgan" tone={p.feruza} />
        <Stat value={String(open)} label="ochiq qolgan" tone={open ? p.oltin : undefined} />
      </Row>

      <Card>
        <Txt v="label">Eng ko'p yo'nalish</Txt>
        <Row style={{ marginTop: 6 }}>
          <Txt v="h1" color={topCat.tone} style={{ flex: 1 }}>
            {topCat.uz}
          </Txt>
          <Txt v="mono">{topCat.n}</Txt>
        </Row>
      </Card>

      {shown.map((x) => {
        const rows = sortTasks(x.list);
        if (!rows.length && picked !== x.d) return null;
        return (
          <Card key={x.d} pad={false}>
            <View style={{ padding: S.md, paddingHorizontal: S.lg, backgroundColor: p.surface2 }}>
              <Row>
                <Txt v="h3" style={{ flex: 1 }}>
                  {x.d === today() ? 'Bugun' : longDate(x.d)}
                </Txt>
                <Txt v="monoSm">
                  {x.done}/{rows.length}
                </Txt>
              </Row>
            </View>
            <Divider />
            {rows.length ? (
              rows.map((t) => (
                <TaskRow
                  key={t.id}
                  task={t}
                  onToggle={() => store.toggleTask(t.id)}
                  onPress={() => store.toggleTask(t.id)}
                />
              ))
            ) : (
              <Empty text="Bu kunga vazifa yozilmagan." />
            )}
          </Card>
        );
      })}

      {!total ? <Empty text="Bu haftada hali vazifa yo'q. «Kun» bo'limidan qo'shing." /> : null}
    </Screen>
  );
}

function Stat({ value, label, tone }: { value: string; label: string; tone?: string }) {
  return (
    <Card style={{ flex: 1 }}>
      <Txt v="h1" color={tone}>
        {value}
      </Txt>
      <Txt v="small" style={{ marginTop: 2 }}>
        {label}
      </Txt>
    </Card>
  );
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
