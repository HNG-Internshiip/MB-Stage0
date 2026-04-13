import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import theme from '@/constants/theme';

const tabs = [
  { name: 'index',      label: 'Units',    icon: '⚖️',  color: theme.accent  },
  { name: 'currency',   label: 'Currency', icon: '💱',  color: theme.accent3 },
  { name: 'calculator', label: 'Calc',     icon: '🔢',  color: theme.accent2 },
  { name: 'bmi',        label: 'BMI',      icon: '🏋️', color: theme.success },
  { name: 'time',       label: 'Time',     icon: '⏱️',  color: theme.pink    },
  { name: 'notes',      label: 'Notes',    icon: '📝',  color: theme.yellow  },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.navBg,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.muted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      }}
    >
      {tabs.map(t => (
        <Tabs.Screen
          key={t.name}
          name={t.name}
          options={{
            title: t.label,
            tabBarLabel: t.label,
            tabBarIcon: ({ focused }) => {
              const { Text } = require('react-native');
              return (
                <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.45 }}>
                  {t.icon}
                </Text>
              );
            },
            tabBarActiveTintColor: t.color,
          }}
        />
      ))}
    </Tabs>
  );
}