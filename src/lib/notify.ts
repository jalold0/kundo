import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { t } from '../i18n';
import type { AppState, Task } from '../types';
import { blockOf } from './catalog';
import { addDays, parseISO, today } from './date';

/**
 * Mahalliy eslatmalar. Server yo'q — hammasi telefonning o'zida rejalashtiriladi.
 *
 * Yondashuv: holat o'zgarganda barcha rejalar bekor qilinib, qaytadan qo'yiladi.
 * Har bir eslatmaning identifikatorini alohida kuzatishdan ko'ra shu ishonchliroq:
 * vazifa o'chirilsa, vaqti ko'chirilsa yoki bajarilsa, hisob o'zi to'g'rilanadi.
 *
 * Chegara: iOS bir vaqtda 64 tadan ortiq kutayotgan eslatmani saqlamaydi,
 * shuning uchun oldinga faqat bir hafta va ko'pi bilan {@link MAX_TASKS} ta.
 */

const CHANNEL = 'kundo-eslatma';
const MAX_TASKS = 40;
const DAYS_AHEAD = 7;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/** Android'da kanal bo'lmasa eslatma ovozsiz va ustuvorligi past bo'ladi. */
async function ensureChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL, {
    name: t('notify.channel'),
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 200],
    lightColor: '#1D3F91',
  });
}

/**
 * Ruxsat so'raydi. Foydalanuvchi rad etsa qayta so'ramaymiz — tizim oynasi
 * ikkinchi marta ko'rinmaydi va bezor qilishning ma'nosi yo'q.
 */
export async function askPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

export async function hasPermission(): Promise<boolean> {
  return (await Notifications.getPermissionsAsync()).granted;
}

/** Vazifa vaqti: `time` bo'lsa o'sha soat, bo'lmasa kun qismining boshi. */
function taskAt(task: Task): Date | null {
  const hm = task.time ?? blockOf(task.block).span.slice(0, 5);
  const [h, m] = hm.split(':').map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  const d = parseISO(task.date);
  d.setHours(h, m, 0, 0);
  return d;
}

/**
 * Barcha eslatmani qaytadan rejalashtiradi. Ruxsat bo'lmasa yoki sozlamada
 * o'chirilgan bo'lsa — faqat tozalaydi.
 */
export async function resync(s: AppState): Promise<void> {
  const { notifyTasks, notifyDaily, notifyAt } = s.settings;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (!notifyTasks && !notifyDaily) return;
    if (!(await hasPermission())) return;
    await ensureChannel();

    const now = Date.now();
    const limit = parseISO(addDays(today(), DAYS_AHEAD)).getTime();

    if (notifyTasks) {
      const soon = s.tasks
        .filter((x) => !x.done && x.time)
        .map((x) => ({ task: x, at: taskAt(x) }))
        .filter((x): x is { task: Task; at: Date } => !!x.at)
        .filter((x) => x.at.getTime() > now && x.at.getTime() < limit)
        .sort((a, b) => a.at.getTime() - b.at.getTime())
        .slice(0, MAX_TASKS);

      for (const { task, at } of soon) {
        await Notifications.scheduleNotificationAsync({
          identifier: `task-${task.id}`,
          content: { title: task.title, body: t('notify.taskBody') },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: at,
            channelId: CHANNEL,
          },
        });
      }
    }

    if (notifyDaily) {
      const [h, m] = notifyAt.split(':').map(Number);
      await Notifications.scheduleNotificationAsync({
        identifier: 'daily',
        content: { title: t('notify.dailyTitle'), body: t('notify.dailyBody') },
        // Har kuni takrorlanadi — matnda raqam yo'q, aks holda eskirib qolardi.
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: Number.isFinite(h) ? h : 21,
          minute: Number.isFinite(m) ? m : 0,
          channelId: CHANNEL,
        },
      });
    }
  } catch {
    // Eslatma qo'yilmasa ilova ishlashda davom etadi — bu qo'shimcha imkoniyat.
  }
}

export async function cancelAll(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // bekor qilinmasa ham ilova ishlaydi
  }
}
