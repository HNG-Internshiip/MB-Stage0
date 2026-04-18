import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, Dimensions, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '@/constants/theme';

const { width, height } = Dimensions.get('window');

const ONBOARDING_KEY = '@sut_onboarded';

// ─── Slide data ───────────────────────────────────────────────────────────────
const SLIDES = [
  {
    id: '1',
    icon: '🧰',
    title: 'Your Everyday\nToolkit',
    description: 'Seven powerful utilities in one beautifully designed app. Everything you need, always in your pocket.',
    color: theme.accent,
    bg: '#1e1b4b',
  },
  {
    id: '2',
    icon: '⚖️',
    title: 'Convert\nAnything',
    description: 'Length, weight, temperature, currency and more — swap units instantly with a clean, intuitive interface.',
    color: theme.accent2,
    bg: '#0f2a2a',
  },
  {
    id: '3',
    icon: '⏱️',
    title: 'Stay on\nTime',
    description: 'Track your time with a lap stopwatch and animated countdown timer. Never miss a beat.',
    color: theme.pink,
    bg: '#2a0f1e',
  },
  {
    id: '4',
    icon: '✅',
    title: 'Get Things\nDone',
    description: 'Create tasks, set priorities, and track your progress — fully offline. Your data, always available.',
    color: theme.success,
    bg: '#0a2010',
  },
  {
    id: '5',
    icon: '🚀',
    title: "You're All\nSet!",
    description: 'Dive in and start using your Smart Utility Toolkit. Built for speed, designed for you.',
    color: theme.accent3,
    bg: '#2a1500',
  },
];

// ─── Dot indicator ────────────────────────────────────────────────────────────
function Dots({ count, active, color }: { count: number; active: number; color: string }) {
  return (
    <View style={dot.row}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={[
            dot.dot,
            i === active
              ? { width: 24, backgroundColor: color }
              : { width: 8, backgroundColor: theme.border },
          ]}
        />
      ))}
    </View>
  );
}

const dot = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { height: 8, borderRadius: 4 },
});

// ─── Single slide ─────────────────────────────────────────────────────────────
function Slide({ item }: { item: typeof SLIDES[0] }) {
  return (
    <View style={[sl.slide, { width }]}>
      {/* Icon bubble */}
      <View style={[sl.iconWrap, { backgroundColor: `${item.color}22`, borderColor: `${item.color}44` }]}>
        <Text style={sl.icon}>{item.icon}</Text>
      </View>

      {/* Decorative ring */}
      <View style={[sl.ring, { borderColor: `${item.color}18`, width: 280, height: 280, borderRadius: 140 }]} />
      <View style={[sl.ring, { borderColor: `${item.color}0e`, width: 360, height: 360, borderRadius: 180 }]} />

      <Text style={[sl.title, { color: item.color }]}>{item.title}</Text>
      <Text style={sl.desc}>{item.description}</Text>
    </View>
  );
}

const sl = StyleSheet.create({
  slide:   { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 36, position: 'relative' },
  iconWrap:{ width: 130, height: 130, borderRadius: 65, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, marginBottom: 40, zIndex: 1 },
  icon:    { fontSize: 58 },
  ring:    { position: 'absolute', borderWidth: 1 },
  title:   { fontSize: 38, fontWeight: '800', textAlign: 'center', lineHeight: 46, marginBottom: 18, zIndex: 1 },
  desc:    { fontSize: 16, color: theme.muted, textAlign: 'center', lineHeight: 26, zIndex: 1 },
});

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Onboarding() {
  const [index, setIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const current = SLIDES[index];
  const isLast  = index === SLIDES.length - 1;

  const goTo = (next: number) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setIndex(next);
    flatRef.current?.scrollToIndex({ index: next, animated: true });
  };

  const finish = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    router.replace('/(tabs)');
  };

  const next = () => isLast ? finish() : goTo(index + 1);
  const skip = () => finish();

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: current.bg }]} edges={['top', 'left', 'right']}>
      {/* Skip */}
      {!isLast && (
        <TouchableOpacity style={s.skip} onPress={skip}>
          <Text style={s.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <FlatList
          ref={flatRef}
          data={SLIDES}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <Slide item={item} />}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          style={{ flex: 1 }}
        />
      </Animated.View>

      {/* Bottom controls */}
      <View style={s.bottom}>
        <Dots count={SLIDES.length} active={index} color={current.color} />

        <TouchableOpacity
          style={[s.nextBtn, { backgroundColor: current.color }]}
          onPress={next}
          activeOpacity={0.85}
        >
          <Text style={s.nextText}>{isLast ? "Let's Go 🚀" : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:     { flex: 1 },
  skip:     { alignSelf: 'flex-end', paddingHorizontal: 24, paddingVertical: 14 },
  skipText: { color: theme.muted, fontSize: 14, fontWeight: '600' },
  bottom:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 28, paddingVertical: 24, paddingBottom: 32 },
  nextBtn:  { paddingHorizontal: 32, paddingVertical: 14, borderRadius: 30 },
  nextText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});