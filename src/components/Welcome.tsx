import React, { useState } from 'react';
import { View } from 'react-native';
import { t } from '../i18n';
import { starterHabits, useStore } from '../store';
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
    if (withHabits && store.state.habits.length === 0) store.addHabits(starterHabits());
    store.setSettings({ onboarded: true });
  };

  return (
    <Sheet
      visible={visible}
      onClose={start}
      title="Kundo"
      footer={<Btn label={t('welcome.start')} onPress={start} />}
    >
      <Row gap={S.md}>
        <StarMark color={p.lojuvard} size={34} />
        <Txt v="small" style={{ flex: 1 }}>
          {t('welcome.intro')}
        </Txt>
      </Row>

      <Card>
        <Row gap={S.md}>
          <Check
            on={withHabits}
            label={t('welcome.startHabits')}
            onPress={() => setWithHabits(!withHabits)}
            tone={p.feruza}
          />
          <View style={{ flex: 1 }}>
            <Txt>{t('welcome.startHabits')}</Txt>
            <Txt v="small">{starterHabits().join(' · ')}</Txt>
          </View>
        </Row>
      </Card>

      <View style={{ gap: S.sm }}>
        <Line n="1" title={t('tab.day')} text={t('welcome.dayText')} />
        <Line n="2" title={t('tab.money')} text={t('welcome.moneyText')} />
        <Line n="3" title={t('tab.habits')} text={t('welcome.habitsText')} />
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
