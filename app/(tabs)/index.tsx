import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '@/constants/theme';

const UNITS: Record<string, Record<string, number> | null> = {
  Length:      { m:1, km:0.001, cm:100, mm:1000, mi:0.000621371, ft:3.28084, inch:39.3701, yd:1.09361 },
  Weight:      { kg:1, g:1000, mg:1e6, lb:2.20462, oz:35.274, ton:0.001 },
  Temperature: null,
  Volume:      { L:1, mL:1000, m3:0.001, gal:0.264172, pt:2.11338, fl_oz:33.814 },
  Speed:       { 'm/s':1, 'km/h':3.6, mph:2.23694, knot:1.94384 },
  Area:        { 'm²':1, 'km²':1e-6, 'cm²':1e4, 'ft²':10.7639, acre:0.000247105, ha:0.0001 },
};

function convertTemp(val: number, from: string, to: string): number {
  const c = from === '°C' ? val : from === '°F' ? (val - 32) * 5 / 9 : val - 273.15;
  return to === '°C' ? c : to === '°F' ? c * 9 / 5 + 32 : c + 273.15;
}

export default function UnitConverter() {
  const [cat, setCat]     = useState('Length');
  const [val, setVal]     = useState('');
  const [from, setFrom]   = useState('');
  const [to, setTo]       = useState('');
  const [result, setResult] = useState<number | null>(null);

  const units = cat === 'Temperature' ? ['°C', '°F', 'K'] : Object.keys(UNITS[cat]!);

  const convert = () => {
    const n = parseFloat(val);
    if (isNaN(n) || !from || !to) return;
    const res = cat === 'Temperature'
      ? convertTemp(n, from, to)
      : (n / UNITS[cat]![from]) * UNITS[cat]![to];
    setResult(parseFloat(res.toPrecision(7)));
  };

  const swap = () => { setFrom(to); setTo(from); setResult(null); };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerIcon}>⚖️</Text>
        <View>
          <Text style={s.headerTitle}>Unit Converter</Text>
          <Text style={s.headerSub}>Smart Utility Toolkit</Text>
        </View>
      </View>

      <ScrollView style={s.body} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {/* Category chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
          {Object.keys(UNITS).map(c => (
            <TouchableOpacity key={c} style={[s.chip, cat === c && s.chipActive]} onPress={() => { setCat(c); setFrom(''); setTo(''); setResult(null); }}>
              <Text style={[s.chipText, cat === c && s.chipTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={s.card}>
          <Text style={s.label}>VALUE</Text>
          <TextInput style={s.input} keyboardType="numeric" placeholder="Enter value…" placeholderTextColor={theme.muted} value={val} onChangeText={t => { setVal(t); setResult(null); }} />

          <View style={s.row}>
            {/* From */}
            <View style={{ flex: 1 }}>
              <Text style={s.label}>FROM</Text>
              <ScrollView style={s.picker} nestedScrollEnabled>
                {units.map(u => (
                  <TouchableOpacity key={u} style={[s.pickerItem, from === u && s.pickerItemActive]} onPress={() => { setFrom(u); setResult(null); }}>
                    <Text style={[s.pickerText, from === u && { color: theme.accent }]}>{u}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <TouchableOpacity style={s.swapBtn} onPress={swap}>
              <Text style={{ color: theme.muted, fontSize: 20 }}>⇄</Text>
            </TouchableOpacity>

            {/* To */}
            <View style={{ flex: 1 }}>
              <Text style={s.label}>TO</Text>
              <ScrollView style={s.picker} nestedScrollEnabled>
                {units.map(u => (
                  <TouchableOpacity key={u} style={[s.pickerItem, to === u && s.pickerItemActive]} onPress={() => { setTo(u); setResult(null); }}>
                    <Text style={[s.pickerText, to === u && { color: theme.accent }]}>{u}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <TouchableOpacity style={s.btn} onPress={convert}>
            <Text style={s.btnText}>Convert</Text>
          </TouchableOpacity>

          {result !== null && (
            <View style={s.result}>
              <Text style={s.resultVal}>{result} <Text style={{ fontSize: 18 }}>{to}</Text></Text>
              <Text style={s.resultLabel}>{val} {from} = {result} {to}</Text>
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
  headerTitle:     { fontSize: 18, fontWeight: '700', color: theme.accent },
  headerSub:       { fontSize: 11, color: theme.muted },
  body:            { flex: 1, padding: 16 },
  card:            { backgroundColor: theme.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: theme.border },
  label:           { fontSize: 11, color: theme.muted, fontWeight: '600', marginBottom: 6, letterSpacing: 0.5 },
  input:           { backgroundColor: theme.surface, borderRadius: 10, padding: 12, color: theme.text, fontSize: 16, borderWidth: 1, borderColor: theme.border, marginBottom: 12 },
  row:             { flexDirection: 'row', gap: 8, alignItems: 'flex-start', marginTop: 4 },
  picker:          { backgroundColor: theme.surface, borderRadius: 10, borderWidth: 1, borderColor: theme.border, maxHeight: 140 },
  pickerItem:      { paddingVertical: 9, paddingHorizontal: 12 },
  pickerItemActive:{ backgroundColor: `${theme.accent}22` },
  pickerText:      { color: theme.muted, fontSize: 13 },
  swapBtn:         { backgroundColor: theme.surface, borderRadius: 8, padding: 10, marginTop: 20, borderWidth: 1, borderColor: theme.border },
  btn:             { backgroundColor: theme.accent, borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 14 },
  btnText:         { color: '#fff', fontWeight: '700', fontSize: 15 },
  result:          { backgroundColor: theme.surface, borderRadius: 12, padding: 16, marginTop: 12, alignItems: 'center', borderWidth: 1, borderColor: `${theme.accent}44` },
  resultVal:       { fontSize: 28, fontWeight: '800', color: theme.accent2 },
  resultLabel:     { fontSize: 12, color: theme.muted, marginTop: 4 },
  chip:            { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: theme.border, marginRight: 8 },
  chipActive:      { borderColor: theme.accent, backgroundColor: `${theme.accent}22` },
  chipText:        { color: theme.muted, fontSize: 12, fontWeight: '600' },
  chipTextActive:  { color: theme.accent },
});