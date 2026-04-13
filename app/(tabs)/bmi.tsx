import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, SafeAreaView,
} from 'react-native';
import theme from '@/constants/theme';

type Category = { label: string; color: string };

function getCategory(bmi: number): Category {
  if (bmi < 18.5) return { label: 'Underweight', color: theme.accent };
  if (bmi < 25)   return { label: 'Normal',       color: theme.success };
  if (bmi < 30)   return { label: 'Overweight',   color: theme.accent3 };
  return               { label: 'Obese',          color: theme.error };
}

const SCALE = [
  { range: '< 18.5', label: 'Under',  color: theme.accent  },
  { range: '18.5–25', label: 'Normal', color: theme.success },
  { range: '25–30',  label: 'Over',   color: theme.accent3 },
  { range: '≥ 30',   label: 'Obese',  color: theme.error   },
];

export default function BMICalc() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit]     = useState<'metric' | 'imperial'>('metric');
  const [result, setResult] = useState<{ bmi: string; cat: Category } | null>(null);

  const calc = () => {
    let h = parseFloat(height), w = parseFloat(weight);
    if (!h || !w) return;
    if (unit === 'imperial') { h = h * 0.0254; w = w * 0.453592; } else { h = h / 100; }
    const bmi = w / (h * h);
    setResult({ bmi: bmi.toFixed(1), cat: getCategory(bmi) });
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.headerIcon}>🏋️</Text>
        <View>
          <Text style={s.headerTitle}>BMI Calculator</Text>
          <Text style={s.headerSub}>Body Mass Index</Text>
        </View>
      </View>

      <ScrollView style={s.body} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {/* Unit toggle */}
        <View style={s.toggle}>
          {(['metric', 'imperial'] as const).map(u => (
            <TouchableOpacity key={u} style={[s.toggleBtn, unit === u && s.toggleActive]} onPress={() => { setUnit(u); setResult(null); }}>
              <Text style={[s.toggleText, unit === u && s.toggleTextActive]}>
                {u === 'metric' ? 'Metric (cm / kg)' : 'Imperial (in / lb)'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={s.card}>
          <Text style={s.label}>HEIGHT ({unit === 'metric' ? 'cm' : 'inches'})</Text>
          <TextInput style={s.input} keyboardType="numeric" placeholder={unit === 'metric' ? 'e.g. 175' : 'e.g. 69'} placeholderTextColor={theme.muted} value={height} onChangeText={t => { setHeight(t); setResult(null); }} />

          <Text style={s.label}>WEIGHT ({unit === 'metric' ? 'kg' : 'lbs'})</Text>
          <TextInput style={s.input} keyboardType="numeric" placeholder={unit === 'metric' ? 'e.g. 70' : 'e.g. 154'} placeholderTextColor={theme.muted} value={weight} onChangeText={t => { setWeight(t); setResult(null); }} />

          <TouchableOpacity style={[s.btn, { backgroundColor: theme.success }]} onPress={calc}>
            <Text style={s.btnText}>Calculate BMI</Text>
          </TouchableOpacity>

          {result && (
            <View style={s.result}>
              <Text style={[s.bmiVal, { color: result.cat.color }]}>{result.bmi}</Text>
              <View style={[s.badge, { backgroundColor: `${result.cat.color}22` }]}>
                <Text style={[s.badgeText, { color: result.cat.color }]}>{result.cat.label}</Text>
              </View>

              {/* Scale */}
              <View style={s.scale}>
                {SCALE.map(sc => (
                  <View key={sc.label} style={s.scaleItem}>
                    <Text style={[s.scaleRange, { color: sc.color }]}>{sc.range}</Text>
                    <Text style={s.scaleLabel}>{sc.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: theme.bg },
  header:          { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#1e1b4b', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: theme.border },
  headerIcon:      { fontSize: 22 },
  headerTitle:     { fontSize: 18, fontWeight: '700', color: theme.success },
  headerSub:       { fontSize: 11, color: theme.muted },
  body:            { flex: 1, padding: 16 },
  toggle:          { flexDirection: 'row', backgroundColor: theme.surface, borderRadius: 12, padding: 4, marginBottom: 14, borderWidth: 1, borderColor: theme.border },
  toggleBtn:       { flex: 1, paddingVertical: 9, borderRadius: 9, alignItems: 'center' },
  toggleActive:    { backgroundColor: theme.card },
  toggleText:      { fontSize: 12, color: theme.muted, fontWeight: '600' },
  toggleTextActive:{ color: theme.success },
  card:            { backgroundColor: theme.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: theme.border },
  label:           { fontSize: 11, color: theme.muted, fontWeight: '600', marginBottom: 6, letterSpacing: 0.5 },
  input:           { backgroundColor: theme.surface, borderRadius: 10, padding: 12, color: theme.text, fontSize: 16, borderWidth: 1, borderColor: theme.border, marginBottom: 14 },
  btn:             { borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 4 },
  btnText:         { color: '#fff', fontWeight: '700', fontSize: 15 },
  result:          { backgroundColor: theme.surface, borderRadius: 12, padding: 16, marginTop: 14, alignItems: 'center', borderWidth: 1, borderColor: `${theme.success}44` },
  bmiVal:          { fontSize: 56, fontWeight: '800' },
  badge:           { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4, marginTop: 6 },
  badgeText:       { fontWeight: '700', fontSize: 14 },
  scale:           { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 16 },
  scaleItem:       { alignItems: 'center' },
  scaleRange:      { fontSize: 11, fontWeight: '700' },
  scaleLabel:      { fontSize: 11, color: theme.muted, marginTop: 2 },
});