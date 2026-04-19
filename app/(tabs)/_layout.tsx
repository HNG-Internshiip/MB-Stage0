import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import theme from '@/constants/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const tabs: { name: string; label: string; icon: IoniconsName; iconFocused: IoniconsName; color: string }[] = [
  { name: 'index',      label: 'Units',    icon: 'swap-horizontal-outline',  iconFocused: 'swap-horizontal',  color: theme.accent  },
  { name: 'currency',   label: 'Currency', icon: 'cash-outline',             iconFocused: 'cash',             color: theme.orange  },
  { name: 'calculator', label: 'Calc',     icon: 'calculator-outline',       iconFocused: 'calculator',       color: theme.teal    },
  { name: 'bmi',        label: 'BMI',      icon: 'body-outline',             iconFocused: 'body',             color: theme.success },
  { name: 'time',       label: 'Time',     icon: 'timer-outline',            iconFocused: 'timer',            color: theme.pink    },
  { name: 'tasks',      label: 'Tasks',    icon: 'checkbox-outline',         iconFocused: 'checkbox',         color: theme.accent  },
  { name: 'notes',      label: 'Notes',    icon: 'document-text-outline',    iconFocused: 'document-text',    color: theme.yellow  },
];

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.navBg,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
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
            tabBarActiveTintColor: t.color,
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? t.iconFocused : t.icon} size={22} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}