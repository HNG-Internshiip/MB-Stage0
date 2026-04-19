import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import theme from '@/constants/theme';

const RATES: Record<string,number> = { USD:1,EUR:0.92,GBP:0.79,NGN:1580,JPY:149.5,CAD:1.36,AUD:1.54,INR:83.1,CNY:7.24,BRL:4.97,MXN:17.1,ZAR:18.6,GHS:12.4,KES:129.5,CHF:0.9 };
const FLAGS: Record<string,string> = { USD:'🇺🇸',EUR:'🇪🇺',GBP:'🇬🇧',NGN:'🇳🇬',JPY:'🇯🇵',CAD:'🇨🇦',AUD:'🇦🇺',INR:'🇮🇳',CNY:'🇨🇳',BRL:'🇧🇷',MXN:'🇲🇽',ZAR:'🇿🇦',GHS:'🇬🇭',KES:'🇰🇪',CHF:'🇨🇭' };
const CURRENCIES = Object.keys(RATES);

function CurrencyPicker({ selected, onSelect, accentColor }: { selected:string; onSelect:(c:string)=>void; accentColor:string }) {
  return (
    <ScrollView style={s.picker} nestedScrollEnabled showsVerticalScrollIndicator={false}>
      {CURRENCIES.map(c=>(
        <TouchableOpacity key={c} style={[s.pickerItem, selected===c && { backgroundColor:`${accentColor}18` }]} onPress={()=>onSelect(c)}>
          <Text style={s.flag}>{FLAGS[c]}</Text>
          <Text style={[s.pickerText, selected===c && { color:accentColor, fontWeight:'700' }]}>{c}</Text>
          {selected===c && <Ionicons name="checkmark" size={13} color={accentColor} />}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

export default function CurrencyConverter() {
  const [amt, setAmt]     = useState('');
  const [from, setFrom]   = useState('USD');
  const [to, setTo]       = useState('NGN');
  const [result, setResult] = useState<string|null>(null);

  const convert = () => {
    const n = parseFloat(amt); if(isNaN(n)) return;
    setResult(((n/RATES[from])*RATES[to]).toFixed(2));
  };

  return (
    <SafeAreaView style={s.safe} edges={['top','left','right']}>
      <View style={s.header}>
        <View style={[s.headerIconWrap, { backgroundColor:`${theme.orange}22` }]}>
          <Ionicons name="cash" size={20} color={theme.orange} />
        </View>
        <View>
          <Text style={s.headerTitle}>Currency Converter</Text>
          <Text style={s.headerSub}>Indicative rates · not live</Text>
        </View>
      </View>

      <ScrollView style={s.body} contentContainerStyle={{ paddingBottom:28 }} showsVerticalScrollIndicator={false}>
        <View style={s.card}>
          <Text style={s.label}>AMOUNT</Text>
          <View style={s.inputWrap}>
            <Ionicons name="wallet-outline" size={16} color={theme.muted} style={{ marginRight:8 }} />
            <TextInput style={s.input} keyboardType="numeric" placeholder="0.00" placeholderTextColor={theme.muted} value={amt} onChangeText={t=>{setAmt(t);setResult(null);}} />
          </View>

          <View style={s.row}>
            <View style={{ flex:1 }}>
              <Text style={s.label}>FROM</Text>
              <CurrencyPicker selected={from} onSelect={c=>{setFrom(c);setResult(null);}} accentColor={theme.orange} />
            </View>
            <TouchableOpacity style={s.swapBtn} onPress={()=>{setFrom(to);setTo(from);setResult(null);}}>
              <Ionicons name="swap-horizontal" size={20} color={theme.orange} />
            </TouchableOpacity>
            <View style={{ flex:1 }}>
              <Text style={s.label}>TO</Text>
              <CurrencyPicker selected={to} onSelect={c=>{setTo(c);setResult(null);}} accentColor={theme.orange} />
            </View>
          </View>

          <TouchableOpacity style={[s.btn, { backgroundColor:theme.orange }]} onPress={convert}>
            <Ionicons name="cash" size={16} color="#fff" style={{ marginRight:6 }} />
            <Text style={[s.btnText, { color:'#fff' }]}>Convert</Text>
          </TouchableOpacity>

          {result!==null && (
            <View style={[s.result, { borderColor:`${theme.orange}33` }]}>
              <Ionicons name="checkmark-circle" size={20} color={theme.orange} style={{ marginBottom:6 }} />
              <Text style={s.resultVal}>{result} <Text style={{ fontSize:18, color:theme.muted }}>{to}</Text></Text>
              <Text style={s.resultLabel}>{amt} {from} = {result} {to}</Text>
              <View style={s.ratePill}>
                <Ionicons name="trending-up-outline" size={12} color={theme.orange} />
                <Text style={[s.rateText, { color:theme.orange }]}>1 {from} ≈ {((1/RATES[from])*RATES[to]).toFixed(4)} {to}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:           { flex:1, backgroundColor:theme.bg },
  header:         { flexDirection:'row', alignItems:'center', gap:12, paddingHorizontal:20, paddingVertical:16, borderBottomWidth:1, borderBottomColor:theme.border },
  headerIconWrap: { width:40, height:40, borderRadius:12, alignItems:'center', justifyContent:'center' },
  headerTitle:    { fontSize:18, fontWeight:'700', color:theme.text },
  headerSub:      { fontSize:11, color:theme.muted, marginTop:1 },
  body:           { flex:1, padding:16 },
  card:           { backgroundColor:theme.card, borderRadius:20, padding:18, borderWidth:1, borderColor:theme.border },
  label:          { fontSize:11, color:theme.muted, fontWeight:'600', marginBottom:8, letterSpacing:0.6, textTransform:'uppercase' },
  inputWrap:      { flexDirection:'row', alignItems:'center', backgroundColor:theme.surface, borderRadius:12, paddingHorizontal:14, paddingVertical:2, borderWidth:1, borderColor:theme.border, marginBottom:16 },
  input:          { flex:1, color:theme.text, fontSize:16, paddingVertical:12 },
  row:            { flexDirection:'row', gap:8, alignItems:'flex-start' },
  picker:         { backgroundColor:theme.surface, borderRadius:12, borderWidth:1, borderColor:theme.border, maxHeight:200 },
  pickerItem:     { flexDirection:'row', alignItems:'center', gap:8, paddingVertical:10, paddingHorizontal:12 },
  flag:           { fontSize:16 },
  pickerText:     { flex:1, color:theme.muted, fontSize:13 },
  swapBtn:        { backgroundColor:`${theme.orange}18`, borderRadius:12, padding:10, marginTop:22, borderWidth:1, borderColor:`${theme.orange}33` },
  btn:            { flexDirection:'row', alignItems:'center', justifyContent:'center', borderRadius:14, padding:14, marginTop:16 },
  btnText:        { fontWeight:'800', fontSize:15 },
  result:         { backgroundColor:theme.surface, borderRadius:14, padding:16, marginTop:14, alignItems:'center', borderWidth:1 },
  resultVal:      { fontSize:30, fontWeight:'800', color:theme.text },
  resultLabel:    { fontSize:12, color:theme.muted, marginTop:6 },
  ratePill:       { flexDirection:'row', alignItems:'center', gap:4, backgroundColor:`${theme.orange}18`, borderRadius:20, paddingHorizontal:10, paddingVertical:4, marginTop:10 },
  rateText:       { fontSize:11, fontWeight:'600' },
});