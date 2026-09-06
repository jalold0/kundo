import React, { useState } from 'react';
import { View } from 'react-native';
import { STARTER_HABITS, useStore } from '../store';
import { S } from '../theme';
import { StarMark } from '../ui/icons';
import { Btn, Card, Check, Row, Txt, usePal } from '../ui/kit';
import { Sheet } from './Sheet';

/**
 * Birinchi ochilishda bir marta ko'rinadi. Hech narsa so'ramaydi —
 * uch jumlada nima qilishini aytadi va odatlarni bir bosishda qo'shishni taklif qiladi.
 */
export function Welcome() {
  const p = usePal();
  const store = useStore();
  const [withHabits, setWithHabits] = useState(true);
  const visible = store.ready && !store.state.settings.onboarded;

  const start = () => {
    if (withHabits && store.state.habits.length === 0) store.addHabits(STARTER_HABITS);
    store.setSettings({ onboarded: true });
  };

  return (
    <Sheet
      visible={visible}
      onClose={start}
      title="Kundo"
      footer={<Btn label="Boshlash" onPress={start} />}
    >
      <Row gap={S.md}>
        <StarMark color={p.lojuvard} size={34} />
        <Txt v="small" style={{ flex: 1 }}>
          Kuningiz va pulingiz uchun bitta daftar. Hammasi shu telefonda qoladi — ro'yxatdan o'tish ham,
          internet ham kerak emas.
        </Txt>
      </Row>

      <Card>
        <Row gap={S.md}>
          <Check
            on={withHabits}
            label="Uchta odat bilan boshlansin"
            onPress={() => setWithHabits(!withHabits)}
            tone={p.feruza}
          />
          <View style={{ flex: 1 }}>
            <Txt>Uchta odat bilan boshlansin</Txt>
            <Txt v="small">{STARTER_HABITS.join(' · ')}</Txt>
          </View>
        </Row>
      </Card>

      <View style={{ gap: S.sm }}>
        <Line n="1" title="Kun" text="Vazifalarni ertalab, kunduzi, kechqurunga ajratib yozasiz." />
        <Line
          n="2"
          title="Xarajat"
          text="Har bir chiqimni bir necha soniyada yozib qo'yasiz — oy oxirida pul qayerga ketgani ko'rinadi."
        />
        <Line n="3" title="Odatlar" text="Har kuni bir bosish. Ketma-ket necha kun bajarganingiz sanaladi." />
      </View>
    </Sheet>
  );
}

function Line({ n, title, text }: { n: string; title: string; text: string }) {
  const p = usePal();
  return (
    <Row gap={S.md} style={{ alignItems: 'flex-start' }}>
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          backgroundColor: p.lojuvardSoft,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 1,
        }}
      >
        <Txt v="monoSm" color={p.lojuvard}>
          {n}
        </Txt>
      </View>
      <View style={{ flex: 1 }}>
        <Txt v="h3">{title}</Txt>
        <Txt v="small">{text}</Txt>
      </View>
    </Row>
  );
}
