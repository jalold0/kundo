import * as Haptics from 'expo-haptics';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Sheet } from '../components/Sheet';
import { TaskForm, emptyDraft, type TaskDraft } from '../components/TaskForm';
import { TaskRow } from '../components/TaskRow';
import { BLOCKS, blockLabel } from '../lib/catalog';
import { addDays, dayTitle, longDate, today, wd, wdays } from '../lib/date';
import { t } from '../i18n';
import { overdue, sortTasks, tasksOn, useStore } from '../store';
import { F, R, S } from '../theme';
import type { AppState, BlockKey, Task } from '../types';
import { IconCheck, IconChevron, IconPlus } from '../ui/icons';
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
  const [draft, setDraft] = useState<TaskDraft>(() => emptyDraft(firstCat(state)));
  const [editing, setEditing] = useState<Task | null>(null);
  const [editDraft, setEditDraft] = useState<TaskDraft>(() => emptyDraft(firstCat(state)));

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
      cat: firstCat(state),
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
      ...emptyDraft(firstCat(state)),
      title: quick.trim(),
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
    if (draft.repeat) toast.show(t('today.repeatAdded'));
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
    toast.show(t('today.deleted', { name: trim(name) }), { undo: store.undo });
  };

  return (
    <>
      <Screen
        eyebrow={t('today.eyebrow')}
        title={dayTitle(date)}
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('today.addDetailed')}
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
              accessibilityLabel={t('common.prevDay')}
              onPress={() => setDate(addDays(date, -1))}
              hitSlop={12}
              style={navBtn(p)}
            >
              <IconChevron color={p.ink2} dir="left" />
            </Pressable>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Txt v="h2">{longDate(date)}</Txt>
              <Txt v="monoSm">{wdays()[wd(date)]}</Txt>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('common.nextDay')}
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
              <Txt v="small">{list.length ? t('today.doneTasks') : t('today.noTasks')}</Txt>
              {!isToday ? (
                <Pressable onPress={() => setDate(today())} hitSlop={8} style={{ marginTop: S.sm }}>
                  <Txt v="small" color={p.lojuvard}>
                    {t('today.backToToday')}
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
              placeholder={t('today.quickPlaceholder')}
              placeholderTextColor={p.muted}
              returnKeyType="done"
              onSubmitEditing={addQuick}
              blurOnSubmit={false}
              accessibilityLabel={t('today.quickAdd')}
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
              accessibilityLabel={t('common.add')}
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

        {/*
          Odatlar shu yerda ham turadi: odam ertalab «Kun» ekranini ochadi va
          odatni o'sha joyda belgilashni kutadi. Oylik dinamika «Odatlar» bo'limida.
        */}
        {store.state.habits.length && date <= today() ? (
          <Card>
            <Row>
              <Txt v="label" style={{ flex: 1 }}>
                {t('today.habits')}
              </Txt>
              <Txt v="monoSm">
                {store.state.habits.filter((h) => h.days[date]).length}/{store.state.habits.length}
              </Txt>
            </Row>
            <Row gap={S.sm} style={{ flexWrap: 'wrap', marginTop: S.md }}>
              {store.state.habits.map((h) => {
                const on = !!h.days[date];
                return (
                  <Pressable
                    key={h.id}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: on }}
                    accessibilityLabel={h.name}
                    onPress={() => {
                      Haptics.selectionAsync().catch(() => {});
                      store.toggleHabit(h.id, date);
                    }}
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 7,
                      paddingVertical: 7,
                      paddingHorizontal: 12,
                      borderRadius: R.pill,
                      borderWidth: StyleSheet.hairlineWidth * 2,
                      borderColor: on ? p.feruza : p.line,
                      backgroundColor: on ? p.feruzaSoft : p.surface,
                      opacity: pressed ? 0.7 : 1,
                    })}
                  >
                    <View
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 5,
                        borderWidth: 1.6,
                        borderColor: on ? p.feruza : p.line2,
                        backgroundColor: on ? p.feruza : 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {on ? <IconCheck color={p.onAccent} size={10} /> : null}
                    </View>
                    <Txt v="small" color={on ? p.feruza : p.ink2}>
                      {h.name}
                    </Txt>
                  </Pressable>
                );
              })}
            </Row>
          </Card>
        ) : null}

        {late.length && isToday ? (
          <Card style={{ borderColor: p.oltin, backgroundColor: p.oltinSoft }}>
            <Txt color={p.oltin}>{t('today.late', { n: late.length })}</Txt>
            <Btn
              label={t('today.rollover')}
              tone="ghost"
              small
              style={{ marginTop: S.md, borderColor: p.oltin }}
              onPress={() => {
                const n = late.length;
                store.rollover();
                toast.show(t('today.rolledOver', { n }), { undo: store.undo });
              }}
            />
          </Card>
        ) : null}

        {list.length === 0 ? (
          <Card>
            <Empty text={t('today.empty')} />
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
                    <Txt v="h3">{blockLabel(b.k)}</Txt>
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
        title={t('today.newTask')}
        footer={<Btn label={t('common.add')} onPress={submitAdd} disabled={!draft.title.trim()} />}
      >
        <TaskForm draft={draft} set={setDraft} autoFocus />
      </Sheet>

      <Sheet
        visible={!!editing}
        onClose={() => setEditing(null)}
        title={t('today.task')}
        footer={
          <>
            <Btn label={t('common.save')} onPress={saveEdit} disabled={!editDraft.title.trim()} />
            <Row gap={S.sm}>
              <Btn
                label={t('today.pushTomorrow')}
                tone="ghost"
                style={{ flex: 1 }}
                onPress={() => {
                  if (!editing) return;
                  store.pushTask(editing.id, 1);
                  setEditing(null);
                  toast.show(t('today.pushedTomorrow'));
                }}
              />
              <Btn label={t('common.delete')} tone="danger" style={{ flex: 1 }} onPress={removeCurrent} />
            </Row>
          </>
        }
      >
        <TaskForm draft={editDraft} set={setEditDraft} showRepeat={false} />
        {editing?.rid ? <Txt v="small">{t('today.repeatNote')}</Txt> : null}
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

/**
 * Yangi vazifa uchun yo'nalish: oxirgi ishlatilgani, agar u o'chirilgan bo'lsa —
 * ro'yxatdagi birinchisi.
 */
function firstCat(state: AppState): string {
  const list = state.cats.task;
  return list.some((c) => c.k === state.settings.lastTaskCat) ? state.settings.lastTaskCat : list[0].k;
}
