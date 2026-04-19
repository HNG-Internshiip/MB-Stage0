import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import theme from '@/constants/theme';

const KEYS = [
  ['C', '+/-', '%', '÷'],
  ['7', '8',   '9', '×'],
  ['4', '5',   '6', '−'],
  ['1', '2',   '3', '+'],
  ['⌫', '0',   '.', '='],
];
const OP_KEYS  = ['÷','×','−','+','='];
const FN_KEYS  = ['C','+/-','%'];

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [expr, setExpr]       = useState('');
  const [newNum, setNewNum]   = useState(true);

  const press = (key: string) => {
    if(key==='C')  { setDisplay('0'); setExpr(''); setNewNum(true); return; }
    if(key==='⌫') { setDisplay(d=>d.length>1?d.slice(0,-1):'0'); return; }
    if(key==='=') {
      try {
        const e=(expr+display).replace(/÷/g,'/').replace(/×/g,'*').replace(/−/g,'-');
        if(/^[\d\s+\-*/().%]+$/.test(e)) {
          const res=Function('"use strict";return('+e+')')() as number;
          setDisplay(String(parseFloat(res.toPrecision(12))));
          setExpr(''); setNewNum(true);
        }
      } catch { setDisplay('Error'); setNewNum(true); }
      return;
    }
    if(OP_KEYS.slice(0,-1).includes(key)) { setExpr(expr+display+key); setNewNum(true); return; }
    if(key==='+/-') { setDisplay(d=>d.startsWith('-')?d.slice(1):'-'+d); return; }
    if(newNum) { setDisplay(key==='.'?'0.':key); setNewNum(false); }
    else setDisplay(d=>d==='0'&&key!=='.'?key:d+key);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top','left','right']}>
      <View style={s.header}>
        <View style={[s.headerIconWrap, { backgroundColor:`${theme.teal}22` }]}>
          <Ionicons name="calculator" size={20} color={theme.teal} />
        </View>
        <View>
          <Text style={s.headerTitle}>Calculator</Text>
          <Text style={s.headerSub}>Smart Utility Toolkit</Text>
        </View>
      </View>

      <View style={s.body}>
        {/* Display */}
        <View style={s.display}>
          <Text style={s.exprText} numberOfLines={1}>{expr}</Text>
          <Text style={s.displayText} numberOfLines={1} adjustsFontSizeToFit>{display}</Text>
        </View>

        {/* Keypad */}
        <View style={s.keypad}>
          {KEYS.map((row,r)=>(
            <View key={r} style={s.keyRow}>
              {row.map(k=>{
                const isOp  = OP_KEYS.includes(k);
                const isFn  = FN_KEYS.includes(k);
                const isDel = k==='⌫';
                return (
                  <TouchableOpacity key={k} style={[s.key, isOp&&s.keyOp, isFn&&s.keyFn, isDel&&s.keyDel]} onPress={()=>press(k)} activeOpacity={0.7}>
                    {isDel
                      ? <Ionicons name="backspace-outline" size={22} color={theme.error} />
                      : <Text style={[s.keyText, isOp&&s.keyTextOp, isFn&&s.keyTextFn]}>{k}</Text>
                    }
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex:1, backgroundColor:theme.bg },
  header:      { flexDirection:'row', alignItems:'center', gap:12, paddingHorizontal:20, paddingVertical:16, borderBottomWidth:1, borderBottomColor:theme.border },
  headerIconWrap:{ width:40, height:40, borderRadius:12, alignItems:'center', justifyContent:'center' },
  headerTitle: { fontSize:18, fontWeight:'700', color:theme.text },
  headerSub:   { fontSize:11, color:theme.muted, marginTop:1 },
  body:        { flex:1, padding:16, justifyContent:'flex-end' },
  display:     { backgroundColor:theme.card, borderRadius:20, padding:20, marginBottom:16, borderWidth:1, borderColor:theme.border },
  exprText:    { fontSize:15, color:theme.muted, textAlign:'right', marginBottom:4 },
  displayText: { fontSize:52, fontWeight:'300', color:theme.text, textAlign:'right' },
  keypad:      { gap:10, marginBottom:8 },
  keyRow:      { flexDirection:'row', gap:10 },
  key:         { flex:1, aspectRatio:1, borderRadius:16, backgroundColor:theme.card, alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:theme.border },
  keyOp:       { backgroundColor:theme.accent, borderColor:theme.accent },
  keyFn:       { backgroundColor:theme.surface, borderColor:theme.border },
  keyDel:      { backgroundColor:theme.surface, borderColor:theme.border },
  keyText:     { fontSize:22, fontWeight:'600', color:theme.text },
  keyTextOp:   { color:'#111' },
  keyTextFn:   { color:theme.teal },
});