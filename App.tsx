// Faqat kerakli qalinliklar import qilinadi — butun to'plam ilova hajmini oshirib yuboradi.
import { IBMPlexMono_400Regular } from '@expo-google-fonts/ibm-plex-mono/400Regular';
import { IBMPlexMono_500Medium } from '@expo-google-fonts/ibm-plex-mono/500Medium';
import { Jost_500Medium } from '@expo-google-fonts/jost/500Medium';
import { Jost_600SemiBold } from '@expo-google-fonts/jost/600SemiBold';
import { Karla_400Regular } from '@expo-google-fonts/karla/400Regular';
import { Karla_500Medium } from '@expo-google-fonts/karla/500Medium';
import { Karla_600SemiBold } from '@expo-google-fonts/karla/600SemiBold';
import { Karla_700Bold } from '@expo-google-fonts/karla/700Bold';
import { DarkTheme, DefaultTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import HabitsScreen from './src/screens/HabitsScreen';
import MoneyScreen from './src/screens/MoneyScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TodayScreen from './src/screens/TodayScreen';
import WeekScreen from './src/screens/WeekScreen';
import { t } from './src/i18n';
import { StoreProvider, useStore } from './src/store';
import { F, paletteFor } from './src/theme';
import { IconGear, IconGrid, IconList, IconWallet, StarMark } from './src/ui/icons';
import { usePal } from './src/ui/kit';
import { ToastProvider } from './src/ui/toast';
import { Welcome } from './src/components/Welcome';

SplashScreen.preventAutoHideAsync().catch(() => {});

const Tab = createBottomTabNavigator();

function Tabs() {
  const p = usePal();
  const insets = useSafeAreaInsets();
  const navTheme: Theme = {
    ...(p.dark ? DarkTheme : DefaultTheme),
    colors: {
      ...(p.dark ? DarkTheme : DefaultTheme).colors,
      background: p.ground,
      card: p.surface,
      text: p.ink,
      border: p.line,
      primary: p.lojuvard,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: p.lojuvard,
          tabBarInactiveTintColor: p.muted,
          tabBarLabelPosition: 'below-icon',
          tabBarLabelStyle: { fontFamily: F.displayMed, fontSize: 11 },
          tabBarStyle: {
            backgroundColor: p.surface,
            borderTopColor: p.line,
            borderTopWidth: StyleSheet.hairlineWidth * 2,
            paddingTop: 7,
            paddingBottom: Math.max(insets.bottom, 8),
            height: 58 + Math.max(insets.bottom, 8),
          },
        }}
      >
        <Tab.Screen
          name="day"
          component={TodayScreen}
          options={{
            tabBarLabel: t('tab.day'),
            tabBarIcon: ({ color }) => <IconList color={color} size={21} />,
          }}
        />
        <Tab.Screen
          name="week"
          component={WeekScreen}
          options={{
            tabBarLabel: t('tab.week'),
            tabBarIcon: ({ color }) => <IconGrid color={color} size={21} />,
          }}
        />
        <Tab.Screen
          name="money"
          component={MoneyScreen}
          options={{
            tabBarLabel: t('tab.money'),
            tabBarIcon: ({ color }) => <IconWallet color={color} size={21} />,
          }}
        />
        <Tab.Screen
          name="habits"
          component={HabitsScreen}
          options={{
            tabBarLabel: t('tab.habits'),
            tabBarIcon: ({ color }) => <StarMark color={color} size={20} />,
          }}
        />
        <Tab.Screen
          name="settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: t('tab.settings'),
            tabBarIcon: ({ color }) => <IconGear color={color} size={21} />,
          }}
        />
      </Tab.Navigator>
      <StatusBar style={p.dark ? 'light' : 'dark'} />
    </NavigationContainer>
  );
}

function Gate({ fontsReady }: { fontsReady: boolean }) {
  const { ready, state } = useStore();
  const done = fontsReady && ready;

  const onLayout = useCallback(() => {
    if (done) SplashScreen.hideAsync().catch(() => {});
  }, [done]);

  useEffect(() => {
    if (done) SplashScreen.hideAsync().catch(() => {});
  }, [done]);

  const p = paletteFor(state.settings.theme, null);

  if (!done) return <View style={{ flex: 1, backgroundColor: p.ground }} onLayout={onLayout} />;
  return (
    <View style={{ flex: 1 }} onLayout={onLayout}>
      <ToastProvider>
        <Tabs />
        <Welcome />
      </ToastProvider>
    </View>
  );
}

export default function App() {
  const [fontsReady] = useFonts({
    Jost_500Medium,
    Jost_600SemiBold,
    Karla_400Regular,
    Karla_500Medium,
    Karla_600SemiBold,
    Karla_700Bold,
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
  });

  return (
    <SafeAreaProvider>
      <StoreProvider>
        <Gate fontsReady={fontsReady} />
      </StoreProvider>
    </SafeAreaProvider>
  );
}
