import * as Haptics from 'expo-haptics';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Sheet } from '../components/Sheet';
import { TaskForm, emptyDraft, type TaskDraft } from '../components/TaskForm';
import { TaskRow } from '../components/TaskRow';
import { BLOCKS } from '../lib/catalog';
import { WDAYS, addDays, dayTitle, longDate, today, wd } from '../lib/date';
import { overdue, sortTasks, tasksOn, useStore } from '../store';
import { F, R, S } from '../theme';
import type { BlockKey, Task } from '../types';
import { IconChevron, IconPlus } from '../ui/icons';
import { Bar, Btn, Card, Divider, Empty, Ring, Row, Screen, Txt, usePal } from '../ui/kit';
import { useToast } from '../ui/toast';

export default function TodayScreen() {
  const p = usePal();
  const store = useStore();
  const { state, ensureRepeats } = store;
  const toast = useToast();
  const [date, setDate] = useState(today());
  const [quick, setQuick] = useState('');
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<TaskDraft>(emptyDraft);
  const [editing, setEditing] = useState<Task | null>(null);
  const [editDraft, setEditDraft] = useState<TaskDraft>(emptyDraft);

  useEffect(() => {
    ensureRepeats(date);
  }, [date, ensureRepeats, state.repeats]);

  const list = useMemo(() => tasksOn(state, date), [state, date]);
  const done = list.filter((t) => t.done).length;
  const late = useMemo(() => overdue(state), [state]);
  const isToday = date === today();

  /** Bir qatorli tez qo'shish — ko'p vazifa shu yo'l bilan yoziladi. */
  const addQuick = () => {
    const title = quick.trim();
    if (!title) return;
    store.addTask({
      title,
      cat: store.state.settings.lastTaskCat,
      pri: 3,
      block: currentBlock(),
      date,
      repeat: '',
    });
    setQuick('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  const openAdd = () => {
    setDraft({
      ...emptyDraft(),
      title: quick.trim(),
      cat: store.state.settings.lastTaskCat,
      block: currentBlock(),
    });
    setQuick('');
    setAdding(true);
  };

  const submitAdd = () => {
    const title = draft.title.trim();
    if (!title) return;
    store.addTask({
      title,
      cat: draft.cat,
      pri: draft.pri,
      block: draft.block,
      time: draft.time || undefined,
      date,
      repeat: draft.repeat,
    });
    store.setSettings({ lastTaskCat: draft.cat });
    setAdding(false);
    if (draft.repeat) toast.show('Takrorlanuvchi vazifa qo‘shildi.');
  };

  const openEdit = (t: Task) => {
    setEditing(t);
    setEditDraft({ title: t.title, cat: t.cat, pri: t.pri, block: t.block, time: t.time ?? '', repeat: '' });
  };

  const saveEdit = () => {
    if (!editing) return;
    const title = editDraft.title.trim();
    if (title) {
      store.updateTask(editing.id, {
        title,
        cat: editDraft.cat,
        pri: editDraft.pri,
        block: editDraft.block,
        time: editDraft.time || undefined,
      });
    }
    setEditing(null);
  };

  const removeCurrent = () => {
    if (!editing) return;
    const name = editing.title;
    store.removeTask(editing.id);
    setEditing(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    toast.show(`«${trim(name)}» o‘chirildi`, { undo: store.undo });
  };

  return (
    <>
      <Screen
        eyebrow="Kun rejasi"
        title={dayTitle(date)}
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Batafsil vazifa qo'shish"
            onPress={openAdd}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              borderRadius: R.md,
              backgroundColor: p.lojuvard,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <IconPlus color={p.onAccent} size={22} />
          </Pressable>
        }
      >
        <Card>
          <Row>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Oldingi kun"
              onPress={() => setDate(addDays(date, -1))}
              hitSlop={12}
              style={navBtn(p)}
            >
              <IconChevron color={p.ink2} dir="left" />
            </Pressable>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Txt v="h2">{longDate(date)}</Txt>
              <Txt v="monoSm">{WDAYS[wd(date)]}</Txt>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Keyingi kun"
              onPress={() => setDate(addDays(date, 1))}
              hitSlop={12}
              style={navBtn(p)}
            >
              <IconChevron color={p.ink2} dir="right" />
            </Pressable>
          </Row>

          <Row gap={S.lg} style={{ marginTop: S.lg }}>
            <Ring
              pct={list.length ? done / list.length : 0}
              label={`${list.length ? Math.round((done / list.length) * 100) : 0}%`}
            />
            <View style={{ flex: 1, gap: 4 }}>
              <Txt v="mono">
                {done} / {list.length}
              </Txt>
              <Txt v="small">{list.length ? 'bajarilgan vazifa' : 'bu kunga vazifa yo‘q'}</Txt>
              {!isToday ? (
                <Pressable onPress={() => setDate(today())} hitSlop={8} style={{ marginTop: S.sm }}>
                  <Txt v="small" color={p.lojuvard}>
                    ← Bugunga qaytish
                  </Txt>
                </Pressable>
              ) : null}
            </View>
          </Row>
        </Card>

        {/* tez qo'shish */}
        <Card pad={false}>
          <Row style={{ paddingLeft: S.lg, paddingRight: 6, paddingVertical: 6 }}>
            <TextInput
              value={quick}
              onChangeText={setQuick}
              placeholder="Vazifa yozing va qo‘shing…"
              placeholderTextColor={p.muted}
              returnKeyType="done"
              onSubmitEditing={addQuick}
              blurOnSubmit={false}
              accessibilityLabel="Tez vazifa qo'shish"
              style={{
                flex: 1,
                paddingVertical: 12,
                fontFamily: F.body,
                fontSize: 15,
                color: p.ink,
              }}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Qo'shish"
              onPress={addQuick}
              disabled={!quick.trim()}
              hitSlop={8}
              style={({ pressed }) => ({
                width: 38,
                height: 38,
                borderRadius: R.sm,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: quick.trim() ? p.lojuvard : p.surface2,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <IconPlus color={quick.trim() ? p.onAccent : p.muted} size={19} />
            </Pressable>
          </Row>
        </Card>

        {late.length && isToday ? (
          <Card style={{ borderColor: p.oltin, backgroundColor: p.oltinSoft }}>
            <Txt color={p.oltin}>{late.length} ta vazifa oldingi kunlardan bajarilmay qolgan.</Txt>
            <Btn
              label="Bugunga ko‘chirish"
              tone="ghost"
              small
              style={{ marginTop: S.md, borderColor: p.oltin }}
              onPress={() => {
                const n = late.length;
                store.rollover();
                toast.show(`${n} ta vazifa bugunga ko‘chirildi`, { undo: store.undo });
              }}
            />
          </Card>
        ) : null}

        {list.length === 0 ? (
          <Card>
            <Empty text="Kun bo‘sh. Yuqoridagi qatorga yozing yoki «+» tugmasi bilan vaqti va yo‘nalishi bilan qo‘shing." />
          </Card>
        ) : (
          BLOCKS.map((b) => {
            const rows = sortTasks(list.filter((t) => t.block === b.k));
            if (!rows.length) return null;
            const dn = rows.filter((t) => t.done).length;
            return (
              <Card key={b.k} pad={false}>
                <View style={{ padding: S.md, paddingHorizontal: S.lg, backgroundColor: p.surface2 }}>
                  <Row>
                    <Txt v="h3">{b.uz}</Txt>
                    <Txt v="monoSm" style={{ flex: 1 }}>
                      {' '}
                      {b.span}
                    </Txt>
                    <Txt v="monoSm">
                      {dn}/{rows.length}
                    </Txt>
                    <View style={{ width: 44 }}>
                      <Bar pct={dn / rows.length} height={4} />
                    </View>
                  </Row>
                </View>
                <Divider />
                {rows.map((t) => (
                  <TaskRow
                    key={t.id}
                    task={t}
                    onToggle={() => store.toggleTask(t.id)}
                    onPress={() => openEdit(t)}
                  />
                ))}
              </Card>
            );
          })
        )}
      </Screen>

      <Sheet
        visible={adding}
        onClose={() => setAdding(false)}
        title="Yangi vazifa"
        footer={<Btn label="Qo‘shish" onPress={submitAdd} disabled={!draft.title.trim()} />}
      >
        <TaskForm draft={draft} set={setDraft} autoFocus />
      </Sheet>

      <Sheet
        visible={!!editing}
        onClose={() => setEditing(null)}
        title="Vazifa"
        footer={
          <>
            <Btn label="Saqlash" onPress={saveEdit} disabled={!editDraft.title.trim()} />
            <Row gap={S.sm}>
              <Btn
                label="Ertaga surish"
                tone="ghost"
                style={{ flex: 1 }}
                onPress={() => {
                  if (!editing) return;
                  store.pushTask(editing.id, 1);
                  setEditing(null);
                  toast.show('Ertaga surildi');
                }}
              />
              <Btn label="O‘chirish" tone="danger" style={{ flex: 1 }} onPress={removeCurrent} />
            </Row>
          </>
        }
      >
        <TaskForm draft={editDraft} set={setEditDraft} showRepeat={false} />
        {editing?.rid ? (
          <Txt v="small">
            Bu takrorlanuvchi vazifa. Bu yerdagi o‘zgarish faqat shu kunga tegishli — butun takrorni «Odatlar»
            bo‘limidan to‘xtatasiz.
          </Txt>
        ) : null}
      </Sheet>
    </>
  );
}

function trim(s: string, n = 28) {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
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

function currentBlock(): BlockKey {
  const h = new Date().getHours();
  if (h < 12) return 'ertalab';
  if (h < 18) return 'kunduzi';
  return 'kechqurun';
}
