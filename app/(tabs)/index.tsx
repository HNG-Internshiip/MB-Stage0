import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import theme from '@/constants/theme';

const UNITS: Record<string, Record<string, number> | null> = {
  Length:      { m:1, km:0.001, cm:100, mm:1000, mi:0.000621371, ft:3.28084, inch:39.3701, yd:1.09361 },
  Weight:      { kg:1, g:1000, mg:1e6, lb:2.20462, oz:35.274, ton:0.001 },
  Temperature: null,
  Volume:      { L:1, mL:1000, m3:0.001, gal:0.264172, pt:2.11338, fl_oz:33.814 },
  Speed:       { 'm/s':1, 'km/h':3.6, mph:2.23694, knot:1.94384 },
  Area:        { 'm²':1, 'km²':1e-6, 'cm²':1e4, 'ft²':10.7639, acre:0.000247105, ha:0.0001 },
};

const CAT_ICONS: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  Length: 'resize-outline', Weight: 'barbell-outline', Temperature: 'thermometer-outline',
  Volume: 'beaker-outline', Speed: 'speedometer-outline', Area: 'square-outline',
};

function convertTemp(val: number, from: string, to: string) {
  const c = from==='°C'?val:from==='°F'?(val-32)*5/9:val-273.15;
  return to==='°C'?c:to==='°F'?c*9/5+32:c+273.15;
}

export default function UnitConverter() {
  const [cat, setCat]     = useState('Length');
  const [val, setVal]     = useState('');
  const [from, setFrom]   = useState('');
  const [to, setTo]       = useState('');
  const [result, setResult] = useState<number|null>(null);

  const units = cat==='Temperature'?['°C','°F','K']:Object.keys(UNITS[cat]!);

  const convert = () => {
    const n = parseFloat(val); if(isNaN(n)||!from||!to) return;
    const res = cat==='Temperature'?convertTemp(n,from,to):(n/UNITS[cat]![from])*UNITS[cat]![to];
    setResult(parseFloat(res.toPrecision(7)));
  };
  const swap = () => { setFrom(to); setTo(from); setResult(null); };

  return (
    <SafeAreaView style={s.safe} edges={['top','left','right']}>
      {/* Header */}
      <View style={s.header}>
        <View style={[s.headerIconWrap, { backgroundColor: `${theme.accent}22` }]}>
          <Ionicons name="swap-horizontal" size={20} color={theme.accent} />
        </View>
        <View>
          <Text style={s.headerTitle}>Unit Converter</Text>
          <Text style={s.headerSub}>Smart Utility Toolkit</Text>
        </View>
      </View>

      <ScrollView style={s.body} contentContainerStyle={{ paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
        {/* Category chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          {Object.keys(UNITS).map(c => (
            <TouchableOpacity key={c} style={[s.chip, cat===c && { borderColor: theme.accent, backgroundColor: `${theme.accent}18` }]} onPress={()=>{setCat(c);setFrom('');setTo('');setResult(null);}}>
              <Ionicons name={CAT_ICONS[c]} size={13} color={cat===c?theme.accent:theme.muted} style={{ marginRight: 4 }} />
              <Text style={[s.chipText, cat===c && { color: theme.accent }]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={s.card}>
          {/* Value input */}
          <Text style={s.label}>VALUE</Text>
          <View style={s.inputWrap}>
            <Ionicons name="pencil-outline" size={16} color={theme.muted} style={{ marginRight: 8 }} />
            <TextInput style={s.input} keyboardType="numeric" placeholder="Enter value…" placeholderTextColor={theme.muted} value={val} onChangeText={t=>{setVal(t);setResult(null);}} />
          </View>

          {/* From / swap / To */}
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>FROM</Text>
              <ScrollView style={s.picker} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                {units.map(u=>(
                  <TouchableOpacity key={u} style={[s.pickerItem, from===u && s.pickerItemActive]} onPress={()=>{setFrom(u);setResult(null);}}>
                    <Text style={[s.pickerText, from===u && { color: theme.accent, fontWeight:'700' }]}>{u}</Text>
                    {from===u && <Ionicons name="checkmark" size={13} color={theme.accent} />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <TouchableOpacity style={s.swapBtn} onPress={swap}>
              <Ionicons name="swap-horizontal" size={20} color={theme.accent} />
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
              <Text style={s.label}>TO</Text>
              <ScrollView style={s.picker} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                {units.map(u=>(
                  <TouchableOpacity key={u} style={[s.pickerItem, to===u && s.pickerItemActive]} onPress={()=>{setTo(u);setResult(null);}}>
                    <Text style={[s.pickerText, to===u && { color: theme.accent, fontWeight:'700' }]}>{u}</Text>
                    {to===u && <Ionicons name="checkmark" size={13} color={theme.accent} />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <TouchableOpacity style={s.btn} onPress={convert}>
            <Ionicons name="swap-horizontal" size={16} color="#111" style={{ marginRight: 6 }} />
            <Text style={s.btnText}>Convert</Text>
          </TouchableOpacity>

          {result!==null && (
            <View style={s.result}>
              <Ionicons name="checkmark-circle" size={20} color={theme.success} style={{ marginBottom: 6 }} />
              <Text style={s.resultVal}>{result} <Text style={{ fontSize: 18, color: theme.muted }}>{to}</Text></Text>
              <Text style={s.resultLabel}>{val} {from} = {result} {to}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:            { flex:1, backgroundColor: theme.bg },
  header:          { flexDirection:'row', alignItems:'center', gap:12, paddingHorizontal:20, paddingVertical:16, borderBottomWidth:1, borderBottomColor:theme.border },
  headerIconWrap:  { width:40, height:40, borderRadius:12, alignItems:'center', justifyContent:'center' },
  headerTitle:     { fontSize:18, fontWeight:'700', color:theme.text },
  headerSub:       { fontSize:11, color:theme.muted, marginTop:1 },
  body:            { flex:1, padding:16 },
  card:            { backgroundColor:theme.card, borderRadius:20, padding:18, borderWidth:1, borderColor:theme.border },
  label:           { fontSize:11, color:theme.muted, fontWeight:'600', marginBottom:8, letterSpacing:0.6, textTransform:'uppercase' },
  inputWrap:       { flexDirection:'row', alignItems:'center', backgroundColor:theme.surface, borderRadius:12, paddingHorizontal:14, paddingVertical:2, borderWidth:1, borderColor:theme.border, marginBottom:16 },
  input:           { flex:1, color:theme.text, fontSize:16, paddingVertical:12 },
  row:             { flexDirection:'row', gap:8, alignItems:'flex-start' },
  picker:          { backgroundColor:theme.surface, borderRadius:12, borderWidth:1, borderColor:theme.border, maxHeight:150 },
  pickerItem:      { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingVertical:10, paddingHorizontal:12 },
  pickerItemActive:{ backgroundColor:`${theme.accent}18` },
  pickerText:      { color:theme.muted, fontSize:13 },
  swapBtn:         { backgroundColor:`${theme.accent}18`, borderRadius:12, padding:10, marginTop:22, borderWidth:1, borderColor:`${theme.accent}33` },
  btn:             { flexDirection:'row', alignItems:'center', justifyContent:'center', backgroundColor:theme.accent, borderRadius:14, padding:14, marginTop:16 },
  btnText:         { color:'#111', fontWeight:'800', fontSize:15 },
  result:          { backgroundColor:theme.surface, borderRadius:14, padding:16, marginTop:14, alignItems:'center', borderWidth:1, borderColor:`${theme.success}33` },
  resultVal:       { fontSize:30, fontWeight:'800', color:theme.text },
  resultLabel:     { fontSize:12, color:theme.muted, marginTop:6 },
  chip:            { flexDirection:'row', alignItems:'center', paddingHorizontal:14, paddingVertical:8, borderRadius:20, borderWidth:1, borderColor:theme.border, marginRight:8 },
  chipText:        { color:theme.muted, fontSize:12, fontWeight:'600' },
});