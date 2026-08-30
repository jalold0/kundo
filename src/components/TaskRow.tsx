import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { pri as priOf, taskCat } from '../lib/catalog';
import { S } from '../theme';
import type { Task } from '../types';
import { IconRepeat } from '../ui/icons';
import { Check, Row, Tag, Txt, usePal } from '../ui/kit';

export function TaskRow({
  task,
  onToggle,
  onPress,
  showDate,
}: {
  task: Task;
  onToggle: () => void;
  onPress: () => void;
  showDate?: string;
}) {
  const p = usePal();
  const cat = taskCat(task.cat);
  const tone = p[cat.tone] as string;
  const pr = priOf(task.pri);
  const stripe = task.pri === 1 ? p.anor : task.pri === 2 ? p.oltin : 'transparent';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'flex-start',
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
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          backgroundColor: stripe,
          opacity: task.done ? 0.3 : 1,
        }}
      />
      <View style={{ paddingTop: 1 }}>
        <Check
          on={task.done}
          onPress={() => {
            Haptics.selectionAsync().catch(() => {});
            onToggle();
          }}
        />
      </View>
      <View style={{ flex: 1, gap: 5 }}>
        <Txt
          style={{
            color: task.done ? p.muted : p.ink,
            textDecorationLine: task.done ? 'line-through' : 'none',
          }}
        >
          {task.title}
        </Txt>
        <Row gap={S.sm} style={{ flexWrap: 'wrap' }}>
          {task.time ? (
            <Txt v="mono" color={p.ink2} style={{ fontSize: 12 }}>
              {task.time}
            </Txt>
          ) : null}
          <Tag label={cat.uz} tone={tone} />
          {task.pri < 3 && pr.tone ? (
            <Txt v="small" color={p[pr.tone] as string}>
              {pr.uz}
            </Txt>
          ) : null}
          {task.rid ? (
            <Row gap={3}>
              <IconRepeat color={p.muted} size={12} />
              <Txt v="small">takroriy</Txt>
            </Row>
          ) : null}
          {showDate ? <Txt v="monoSm">{showDate}</Txt> : null}
        </Row>
      </View>
    </Pressable>
  );
}
