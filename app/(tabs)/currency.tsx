import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '@/constants/theme';

const RATES: Record<string, number> = {
  USD:1, EUR:0.92, GBP:0.79, NGN:1580, JPY:149.5,
  CAD:1.36, AUD:1.54, INR:83.1, CNY:7.24, BRL:4.97,
  MXN:17.1, ZAR:18.6, GHS:12.4, KES:129.5, CHF:0.9,
};

const FLAGS: Record<string, string> = {
  USD:'🇺🇸', EUR:'🇪🇺', GBP:'🇬🇧', NGN:'🇳🇬', JPY:'🇯🇵',
  CAD:'🇨🇦', AUD:'🇦🇺', INR:'🇮🇳', CNY:'🇨🇳', BRL:'🇧🇷',
  MXN:'🇲🇽', ZAR:'🇿🇦', GHS:'🇬🇭', KES:'🇰🇪', CHF:'🇨🇭',
};

const CURRENCIES = Object.keys(RATES);

export default function CurrencyConverter() {
  const [amt, setAmt]     = useState('');
  const [from, setFrom]   = useState('USD');
  const [to, setTo]       = useState('NGN');
  const [result, setResult] = useState<string | null>(null);

  const convert = () => {
    const n = parseFloat(amt);
    if (isNaN(n)) return;
    setResult(((n / RATES[from]) * RATES[to]).toFixed(2));
  };

  const CurrencyPicker = ({ selected, onSelect }: { selected: string; onSelect: (c: string) => void }) => (
    <ScrollView style={s.picker} nestedScrollEnabled showsVerticalScrollIndicator={false}>
      {CURRENCIES.map(c => (
        <TouchableOpacity key={c} style={[s.pickerItem, selected === c && s.pickerItemActive]} onPress={() => { onSelect(c); setResult(null); }}>
          <Text style={s.flag}>{FLAGS[c]}</Text>
          <Text style={[s.pickerText, selected === c && { color: theme.accent3, fontWeight: '700' }]}>{c}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={s.safe} edges={['top', 'left', 'right']}>
      <View style={s.header}>
        <Text style={s.headerIcon}>💱</Text>
        <View>
          <Text style={s.headerTitle}>Currency Converter</Text>
          <Text style={s.headerSub}>Indicative rates · not live</Text>
        </View>
      </View>

      <ScrollView style={s.body} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={s.card}>
          <Text style={s.label}>AMOUNT</Text>
          <TextInput
            style={s.input} keyboardType="numeric" placeholder="0.00"
            placeholderTextColor={theme.muted} value={amt}
            onChangeText={t => { setAmt(t); setResult(null); }}
          />

          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>FROM</Text>
              <CurrencyPicker selected={from} onSelect={setFrom} />
            </View>
            <TouchableOpacity style={s.swapBtn} onPress={() => { setFrom(to); setTo(from); setResult(null); }}>
              <Text style={{ fontSize: 20, color: theme.muted }}>⇄</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>TO</Text>
              <CurrencyPicker selected={to} onSelect={setTo} />
            </View>
          </View>

          <TouchableOpacity style={[s.btn, { backgroundColor: theme.accent3 }]} onPress={convert}>
            <Text style={s.btnText}>Convert</Text>
          </TouchableOpacity>

          {result !== null && (
            <View style={s.result}>
              <Text style={s.resultVal}>{result} <Text style={{ fontSize: 18 }}>{to}</Text></Text>
              <Text style={s.resultLabel}>{amt} {from} = {result} {to}</Text>
              <Text style={s.rateNote}>Rate: 1 {from} ≈ {((1 / RATES[from]) * RATES[to]).toFixed(4)} {to}</Text>
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
  headerTitle:     { fontSize: 18, fontWeight: '700', color: theme.accent3 },
  headerSub:       { fontSize: 11, color: theme.muted },
  body:            { flex: 1, padding: 16 },
  card:            { backgroundColor: theme.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: theme.border },
  label:           { fontSize: 11, color: theme.muted, fontWeight: '600', marginBottom: 6, letterSpacing: 0.5 },
  input:           { backgroundColor: theme.surface, borderRadius: 10, padding: 12, color: theme.text, fontSize: 16, borderWidth: 1, borderColor: theme.border, marginBottom: 12 },
  row:             { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  picker:          { backgroundColor: theme.surface, borderRadius: 10, borderWidth: 1, borderColor: theme.border, maxHeight: 200 },
  pickerItem:      { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 9, paddingHorizontal: 12 },
  pickerItemActive:{ backgroundColor: `${theme.accent3}22` },
  flag:            { fontSize: 16 },
  pickerText:      { color: theme.muted, fontSize: 13 },
  swapBtn:         { backgroundColor: theme.surface, borderRadius: 8, padding: 10, marginTop: 20, borderWidth: 1, borderColor: theme.border },
  btn:             { borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 14 },
  btnText:         { color: '#fff', fontWeight: '700', fontSize: 15 },
  result:          { backgroundColor: theme.surface, borderRadius: 12, padding: 16, marginTop: 12, alignItems: 'center', borderWidth: 1, borderColor: `${theme.accent3}44` },
  resultVal:       { fontSize: 28, fontWeight: '800', color: theme.accent2 },
  resultLabel:     { fontSize: 12, color: theme.muted, marginTop: 4 },
  rateNote:        { fontSize: 11, color: theme.muted, marginTop: 6, opacity: 0.7 },
});